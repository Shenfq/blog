---
title: Node.js的进程管理
date: 2018/12/28
categories:
- Node.js
tags:
- 前端
- Node
- 多进程
- cluster
- 负载均衡
---

众所周知Node基于V8，而在V8中JavaScript是单线程运行的，这里的单线程不是指Node启动的时候就只有一个线程，而是说运行JavaScript代码是在单线程上，Node还有其他线程，比如进行异步IO操作的IO线程。这种单线程模型带来的好处就是系统调度过程中不会频繁进行上下文切换，提升了单核CPU的利用率。

但是这种做法有个缺陷，就是我们无法利用服务器CPU多核的性能，一个Node进程只能利用一个CPU。而且单线程模式下一旦代码崩溃就是整个程序崩溃。通常解决方案就是使用Node的cluster模块，通过`master-worker`模式启用多个进程实例。下面我们详细讲述下，Node如何使用多进程模型利用多核CPU，以及自带的cluster模块具体的工作原理。

<!-- more -->

## 如何创建子进程

node提供了`child_process`模块用来进行子进程的创建，该模块一共有四个方法用来创建子进程。

```javascript
const { spawn, exec, execFile, fork } = require('child_process')

spawn(command[, args][, options])

exec(command[, options][, callback])

execFile(file[, args][, options][, callback])

fork(modulePath[, args][, options])
```

### spawn

首先认识一下spawn方法，下面是Node文档的官方实例。

```javascript
const { spawn } = require('child_process');
const child = spawn('ls', ['-lh', '/home']);

child.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});

const { stdin, stdout, stderr } = child

stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});
```

通过spawn创建的子进程，继承自EventEmitter，所以可以在上面进行事件（`discount`，`error`，`close`，`message`）的监听。同时子进程具有三个输入输出流：stdin、stdout、stderr，通过这三个流，可以实时获取子进程的输入输出和错误信息。


这个方法的最终实现基于libuv，这里不再展开讨论，感兴趣可以查看[源码](https://github.com/nodejs/node/blob/v10.14.2/src/process_wrap.cc#L256)。

```
// 调用libuv的api，初始化一个进程
int err = uv_spawn(env->event_loop(), &wrap->process_, &options);
```


### exec/execFile

之所以把这两个放到一起，是因为exec最后调用的就是execFile方法，源码在[这里](https://github.com/nodejs/node/blob/v10.14.2/lib/child_process.js#L150)。唯一的区别是，exec中调用的`normalizeExecArgs`方法会将opts的shell属性默认设置为true。


```javascript
exports.exec = function exec(/* command , options, callback */) {
  const opts = normalizeExecArgs.apply(null, arguments);
  return exports.execFile(opts.file, opts.options, opts.callback);
};

function normalizeExecArgs(command, options, callback) {
  options = { ...options };
  options.shell = typeof options.shell === 'string' ? options.shell : true;
  return { options };
}
```

在execFile中，最终调用的是`spawn`方法。

```javascript
exports.execFile = function execFile(file /* , args, options, callback */) {
  let args = [];
  let callback;
  let options;
  var child = spawn(file, args, {
    // ... some options
  });
  
  return child;
}
```

exec会将spawn的输入输出流转换成String，默认使用UTF-8的编码，然后传递给回调函数，使用回调方式在node中较为熟悉，比流更容易操作，所以我们能使用exec方法执行一些`shell`命令，然后在回调中获取返回值。有点需要注意，这里的buffer是有最大缓存区的，如果超出会直接被kill掉，可用通过maxBuffer属性进行配置（默认: 200*1024）。

```javascript
const { exec } = require('child_process');
exec('ls -lh /home', (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
```

### fork

fork最后也是调用spawn来创建子进程，但是fork是spawn的一种特殊情况，用于衍生新的 Node.js 进程，会产生一个新的V8实例，所以执行fork方法时需要指定一个js文件。

```javascript
exports.fork = function fork(modulePath /* , args, options */) {
  // ...
  
  options.shell = false;

  return spawn(options.execPath, args, options);
};
```

通过fork创建子进程之后，父子进程直接会创建一个IPC（进程间通信）通道，方便父子进程直接通信，在js层使用 `process.send(message)` 和 `process.on('message', msg => {})` 进行通信。而在底层，实现进程间通信的方式有很多，Node的进程间通信基于libuv实现，不同操作系统实现方式不一致。在*unix系统中采用Unix Domain Socket方式实现，Windows中使用命名管道的方式实现。

> 常见进程间通信方式：消息队列、共享内存、pipe、信号量、套接字

下面是一个父子进程通信的实例。

**parent.js**

```javascript
const path = require('path')
const { fork } = require('child_process')

const child = fork(path.join(__dirname, 'child.js'))

child.on('message', msg => {
    console.log('message from child', msg)
});

child.send('hello child, I\'m master')
```

**child.js**

```javascript
process.on('message', msg => {
  console.log('message from master:', msg)
});
let counter = 0
setInterval(() => {
  process.send({
    child: true,
    counter: counter++
  })
}, 1000);
```
![image](https://file.shenfq.com/19-1-9/37414156.jpg)

### 小结

其实可以看到，这些方法都是对spawn方法的复用，然后spawn方法底层调用了libuv进行进程的管理，具体可以看下图。

![image](https://file.shenfq.com/19-1-9/67988038.jpg)


## 利用fork实现`master-worker`模型

首先来看看，如果我们在`child.js`中启动一个http服务会发生什么情况。

```javascript
// master.js
const { fork } = require('child_process')

for (let i = 0; i < 2; i++) {
  const child = fork('./child.js')
}

// child.js
const http = require('http')
http.createServer((req, res) => {
  res.end('Hello World\n');
}).listen(8000)
```

![image](https://file.shenfq.com/19-1-9/87041789.jpg)

```
              +--------------+
              |              |
              |    master    |
              |              |
     +--------+--------------+- -- -- -
     |                                 |
     |                          Error: listen EADDRINUSE
     |                                 |
     |
+----v----+                      +-----v---+
|         |                      |         |
| worker1 |                      | worker2 |
|         |                      |         |
+---------+                      +---------+
   ：8000                            ：8000

```

我们fork了两个子进程，因为两个子进程同时对一个端口进行监听，Node会直接抛出一个异常（`Error: listen EADDRINUSE`），如上图所示。那么我们能不能使用代理模式，同时监听多个端口，让master进程监听80端口收到请求时，再将请求分发给不同服务，而且master进程还能做适当的负载均衡。

```
              +--------------+
              |              |
              |    master    |
              |     ：80     |
     +--------+--------------+---------+
     |                                 |
     |                                 |
     |                                 |
     |                                 |
+----v----+                      +-----v---+
|         |                      |         |
| worker1 |                      | worker2 |
|         |                      |         |
+---------+                      +---------+
   ：8000                            ：8001
```

但是这么做又会带来另一个问题，代理模式中十分消耗文件描述符（linux系统默认的最大文件描述符限制是1024），文件描述符在windows系统中称为句柄（handle），习惯性的我们也可以称linux中的文件描述符为句柄。当用户进行访问，首先连接到master进程，会消耗一个句柄，然后master进程再代理到worker进程又会消耗掉一个句柄，所以这种做法十分浪费系统资源。为了解决这个问题，Node的进程间通信可以发送句柄，节省系统资源。

> 句柄是一种特殊的智能指针 。当一个应用程序要引用其他系统（如数据库、操作系统）所管理的内存块或对象时，就要使用句柄。

我们可以在master进程启动一个tcp服务，然后通过IPC将服务的句柄发送给子进程，子进程再对服务的连接事件进行监听，具体代码如下：

```javascript
// master.js
var { fork } = require('child_process')
var server = require('net').createServer()
server.on('connection', function(socket) {
  socket.end('handled by master') // 响应来自master
})
server.listen(3000, function() {
  console.log('master listening on: ', 3000)
})
for (var i = 0; i < 2; i++) {
  var child = fork('./child.js')
  child.send('server', server) // 发送句柄给worker
  console.log('worker create, pid is ', child.pid)
}

// child.js
process.on('message', function (msg, handler) {
  if (msg !== 'server') {
    return
  }
  // 获取到句柄后，进行请求的监听
  handler.on('connection', function(socket) {
    socket.end('handled by worker, pid is ' + process.pid)  
  })
})
```

![启动服务](https://file.shenfq.com/19-1-9/4257973.jpg)

下面我们通过`curl`连续请求 5 次服务。

```bash
for varible1 in {1..5}
do
  curl "localhost:3000"
done
```

![请求服务](https://file.shenfq.com/19-1-9/13847319.jpg)

可以看到，响应请求的可以是父进程，也可以是不同子进程，多个进程对同一个服务响应的连接事件监听，谁先抢占，就由谁进行响应。这里就会出现一个Linux网络编程中很常见的事件，当多个进程同时监听网络的连接事件，当这个有新的连接到达时，这些进程被同时唤醒，这被称为“惊群”。这样导致的情况就是，一旦事件到达，每个进程同时去响应这一个事件，而最终只有一个进程能处理事件成功，其他的进程在处理该事件失败后重新休眠，造成了系统资源的浪费。

![image](https://file.shenfq.com/19-1-9/82240458.jpg)

> ps：在windows系统上，永远都是最后定义的子进程抢占到句柄，这可能和libuv的实现机制有关，具体原因往有大佬能够指点。

![image](https://file.shenfq.com/19-1-9/19078214.jpg)

出现这样的问题肯定是大家都不愿意的嘛，这个时候我们就想起了`nginx`的好了，这里[有篇文章](https://blog.csdn.net/russell_tao/article/details/7204260)讲解了nginx是如何解决“惊群”的，利用nginx的反向代理可以有效地解决这个问题，毕竟nginx本来就很擅长这种问题。

```
http { 
  upstream node { 
      server 127.0.0.1:8000; 
      server 127.0.0.1:8001; 
      server 127.0.0.1:8002; 
      server 127.0.0.1:8003;
      keepalive 64;
  } 
  server { 
       listen 80; 
       server_name shenfq.com; 
       location / { 
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-Nginx-Proxy true;
            proxy_set_header Connection "";
            proxy_pass http://node; # 这里要和最上面upstream后的应用名一致，可以自定义
       } 
  }
}
```

### 小结

如果我们自己用Node原生来实现一个多进程模型，存在这样或者那样的问题，虽然最终我们借助了nginx达到了这个目的，但是使用nginx的话，我们需要另外维护一套nginx的配置，而且如果有一个Node服务挂了，nginx并不知道，还是会将请求转发到那个端口。

## cluster模块

除了用nginx做反向代理，node本身也提供了一个`cluster`模块，用于多核CPU环境下多进程的负载均衡。cluster模块创建子进程本质上是通过child_procee.fork，利用该模块可以很容易的创建共享同一端口的子进程服务器。

### 上手指南

有了这个模块，你会感觉实现Node的单机集群是多么容易的一件事情。下面看看官方实例，短短的十几行代码就实现了一个多进程的Node服务，且自带负载均衡。

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) { // 判断是否为主进程
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else { // 子进程进行服务器创建
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

![image](https://file.shenfq.com/19-1-9/33436044.jpg)


## cluster模块源码分析

首先看代码，通过`isMaster`来判断是否为主进程，如果是主进程进行fork操作，子进程创建服务器。这里cluster进行fork操作时，执行的是当前文件。`cluster.fork`最终调用的`child_process.fork`，且第一个参数为`process.argv.slice(2)`，在fork子进程之后，会对其internalMessage事件进行监听，这个后面会提到，具体代码如下：

```javascript
const { fork } = require('child_process');

cluster.fork = function(env) {
  cluster.setupMaster();
  const id = ++ids;
  const workerProcess = createWorkerProcess(id, env);
  const worker = new Worker({
    id: id,
    process: workerProcess
  });
  
  // 监听子进程的消息
  worker.process.on('internalMessage', internal(worker, onmessage));
  // ...
};
// 配置master进程
cluster.setupMaster = function(options) {
  cluster.settings = {
    args: process.argv.slice(2),
    exec: process.argv[1],
    execArgv: process.execArgv,
    silent: false,
    ...cluster.settings,
    ...options
  };
};

// 创建子进程
function createWorkerProcess(id, env) {
  return fork(cluster.settings.exec, cluster.settings.args, {
    // some options
  });
}
```

### 子进程端口监听问题

这里会有一个问题，子进程全部都在监听同一个端口，我们之前已经试验过，服务监听同一个端口会出现端口占用的问题，那么cluster模块如何保证端口不冲突的呢？ 查阅[源码](https://github.com/nodejs/node/blob/v10.14.2/lib/_http_server.js#L309)发现，http模块的createServer继承自net模块。

```javascript
util.inherits(Server, net.Server);
```

而在net模块中，listen方法会调用listenInCluster方法，listenInCluster判断当前是否为master进程。

[lib/net.js](https://github.com/nodejs/node/blob/v10.14.2/lib/net.js#L1370)

```javascript
Server.prototype.listen = function(...args) {

  // ...
  if (typeof options.port === 'number' || typeof options.port === 'string') {
    // 如果listen方法只传入了端口号，最后会走到这里
    listenInCluster(this, null, options.port | 0, 4, backlog, undefined, options.exclusive);
    return this;
  }
  // ...
};

function listenInCluster(server, address, port, addressType, backlog, fd, exclusive, flags) {
  if (cluster === undefined) cluster = require('cluster');

  if (cluster.isMaster) {
    // 如果是主进程则启动一个服务
    // 但是主进程没有调用过listen方法，所以没有走这里一步
    server._listen2(address, port, addressType, backlog, fd, flags);
    return;
  }
  
  const serverQuery = {
    address: address,
    port: port,
    addressType: addressType,
    fd: fd,
    flags,
  };
 
  // 子进程获取主进程服务的句柄
  cluster._getServer(server, serverQuery, listenOnMasterHandle);
  
  function listenOnMasterHandle(err, handle) {
    server._handle = handle; // 重写handle，对listen方法进行了hack
    server._listen2(address, port, addressType, backlog, fd, flags);
  }
}
```

看上面代码可以知道，真正启动服务的方法为`server._listen2`。在`_listen2`方法中，最终调用的是`_handle`下的listen方法。

```javascript
function setupListenHandle(address, port, addressType, backlog, fd, flags) {
  // ...
  this._handle.onconnection = onconnection;
  var err = this._handle.listen(backlog || 511);
  // ...
}

Server.prototype._listen2 = setupListenHandle;  // legacy alias
```

那么`cluster._getServer`方法到底做了什么呢？

搜寻它的源码，首先向master进程发送了一个消息，消息类型为`queryServer`。

```javascript
// child.js
cluster._getServer = function(obj, options, cb) {
  // ...
  
  const message = {
    act: 'queryServer',
    index,
    data: null,
    ...options
  };
  
  // 发送消息到master进程，消息类型为 queryServer
  send(message, (reply, handle) => {
    rr(reply, indexesKey, cb);              // Round-robin.
  });
  // ...
};
```

这里的rr方法，对前面提到的`_handle.listen`进行了hack，所有子进程的listen其实是不起作用的。

```javascript
function rr(message, indexesKey, cb) {
  if (message.errno)
    return cb(message.errno, null);

  var key = message.key;

  function listen(backlog) { // listen方法直接返回0，不再进行端口监听
    return 0;
  }

  function close() {
    send({ act: 'close', key });
  }

  function getsockname(out) {
    return 0;
  }
  
  const handle = { close, listen, ref: noop, unref: noop };
  
  handles.set(key, handle); // 根据key将工作进程的 handle 进行缓存
  cb(0, handle);
}

// 这里的cb回调就是前面_getServer方法传入的。 参考之前net模块的listen方法
function listenOnMasterHandle(err, handle) {
  server._handle = handle; // 重写handle，对listen方法进行了hack
  // 该方法调用后，会对handle绑定一个 onconnection 方法，最后会进行调用
  server._listen2(address, port, addressType, backlog, fd, flags);
}

```

### 主进程与子进程通信

那么到底在哪里对端口进行了监听呢？

前面提到过，fork子进程的时候，对子进程进行了internalMessage事件的监听。

```
worker.process.on('internalMessage', internal(worker, onmessage));
```

子进程向master进程发送消息，一般使用`process.send`方法，会被监听的`message`事件所接收。这里是因为发送的message指定了`cmd: 'NODE_CLUSTER'`，只要cmd字段以`NODE_`开头，这样消息就会认为是内部通信，被internalMessage事件所接收。

```javascript
// child.js
function send(message, cb) {
  return sendHelper(process, message, null, cb);
}

// utils.js
function sendHelper(proc, message, handle, cb) {
  if (!proc.connected)
    return false;

  // Mark message as internal. See INTERNAL_PREFIX in lib/child_process.js
  message = { cmd: 'NODE_CLUSTER', ...message, seq };

  if (typeof cb === 'function')
    callbacks.set(seq, cb);

  seq += 1;
  return proc.send(message, handle);
}
```

master进程接收到消息后，根据act的类型开始执行不同的方法，这里act为`queryServer`。queryServer方法会构造一个key，如果这个key（规则主要为地址+端口+文件描述符）之前不存在，则对`RoundRobinHandle`构造函数进行了实例化，RoundRobinHandle构造函数中启动了一个TCP服务，并对之前指定的端口进行了监听。

```javascript
// master.js
const handles = new Map();

function onmessage(message, handle) {
  const worker = this;
  if (message.act === 'online')
    online(worker);
  else if (message.act === 'queryServer')
    queryServer(worker, message);
  // other act logic
}
function queryServer(worker, message) {
  // ...
  const key = `${message.address}:${message.port}:${message.addressType}:` +
              `${message.fd}:${message.index}`;
  var handle = handles.get(key);
  // 如果之前没有对该key进行实例化，则进行实例化
  if (handle === undefined) {
    let address = message.address;
    // const RoundRobinHandle = require('internal/cluster/round_robin_handle');
    var constructor = RoundRobinHandle;

    handle = new constructor(key,
                             address,
                             message.port,
                             message.addressType,
                             message.fd,
                             message.flags);
    handles.set(key, handle);
  }
  // ...
}

// internal/cluster/round_robin_handle
function RoundRobinHandle(key, address, port, addressType, fd, flags) {
  this.server = net.createServer(assert.fail);
  // 这里启动一个TCP服务器
  this.server.listen({ port, host });
  
  // TCP服务器启动时的事件
  this.server.once('listening', () => {
    this.handle = this.server._handle;
    this.handle.onconnection = (err, handle) => this.distribute(err, handle);
  });
  // ...
}
```

可以看到TCP服务启动后，立马对`connection`事件进行了监听，会调用RoundRobinHandle的distribute方法。

```javascript
// RoundRobinHandle
this.handle.onconnection = (err, handle) => this.distribute(err, handle);

// distribute 对工作进程进行分发
RoundRobinHandle.prototype.distribute = function(err, handle) {
  this.handles.push(handle); // 存入TCP服务的句柄
  const worker = this.free.shift(); // 取出第一个工作进程

  if (worker)
    this.handoff(worker); // 切换到工作进程
};

RoundRobinHandle.prototype.handoff = function(worker) {
  const handle = this.handles.shift(); // 获取TCP服务句柄
  
  if (handle === undefined) {
    this.free.push(worker);  // 将该工作进程重新放入队列中
    return;
  }
  
  const message = { act: 'newconn', key: this.key };

  // 向工作进程发送一个类型为 newconn 的消息以及TCP服务的句柄
  sendHelper(worker.process, message, handle, (reply) => {
    if (reply.accepted)
      handle.close();
    else
      this.distribute(0, handle);  // 工作进程不能正常运行，启动下一个

    this.handoff(worker);
  });
};
```

在子进程中也有对内部消息进行监听，在`cluster/child.js`中，有个`cluster._setupWorker`方法，该方法会对内部消息监听，该方法的在`lib/internal/bootstrap/node.js`中调用，这个文件是每次启动node命令后，由C++模块调用的。

[链接](https://github.com/nodejs/node/blob/v10.14.2/lib/internal/bootstrap/node.js#L337)
```javascript
function startup() {
  // ...
  startExecution();
}
function startExecution() {
  // ...
  prepareUserCodeExecution();
}
function prepareUserCodeExecution() {
  if (process.argv[1] && process.env.NODE_UNIQUE_ID) {
    const cluster = NativeModule.require('cluster');
    cluster._setupWorker();
    delete process.env.NODE_UNIQUE_ID;
  }
}

startup()
```

下面看看_setupWorker方法做了什么。

```javascript
cluster._setupWorker = function() {
  // ...
  process.on('internalMessage', internal(worker, onmessage));

  function onmessage(message, handle) {
    // 如果act为 newconn 调用onconnection方法
    if (message.act === 'newconn')
      onconnection(message, handle);
    else if (message.act === 'disconnect')
      _disconnect.call(worker, true);
  }
};

function onconnection(message, handle) {
  const key = message.key;
  const server = handles.get(key);
  const accepted = server !== undefined;

  send({ ack: message.seq, accepted });

  if (accepted)
    server.onconnection(0, handle); // 调用net中的onconnection方法
}
```

最后子进程获取到客户端句柄后，调用net模块的onconnection，对Socket进行实例化，后面就与其他http请求的逻辑一致了，不再细讲。

至此，cluster模块的逻辑就走通了。

## 参考链接

- [当我们谈论 cluster 时我们在谈论什么](https://github.com/hustxiaoc/node.js/issues/11)
- [通过源码解析 Node.js 中 cluster 模块的主要功能实现](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)
- [child_process 文档](http://nodejs.cn/api/child_process.html)
- [cluster 文档](http://nodejs.cn/api/cluster.html)