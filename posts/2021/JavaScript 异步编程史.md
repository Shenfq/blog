---
title: JavaScript 异步编程史
author: shenfq
date: 2021/06/01
categories:
- 前端
tags:
- JavaScript
- Promise
- Generator
- async/await
---

## 前言

早期的 Web 应用中，与后台进行交互时，需要进行 `form` 表单的提交，然后在页面刷新后给用户反馈结果。在页面刷新过程中，后台会重新返回一段 HTML 代码，这段 HTML 中的大部分内容与之前页面基本相同，这势必造成了流量的浪费，而且一来一回也延长了页面的响应时间，总是会让人觉得 Web 应用的体验感比不上客户端应用。

2004 年，**AJAX** 即“**Asynchronous JavaScript and XML**”技术横空出世，让 Web 应用的体验得到了质的提升。再到 2006 年，jQuery 问世，将 Web 应用的开发体验也提高到了新的台阶。

由于 JavaScript 语言单线程的特点，不管是事件的触发还是 AJAX 都是通过回调的方式进行异步任务的触发。如果我们想要线性的处理多个异步任务，在代码中就会出现如下的情况：

```js
getUser(token, function (user) {
  getClassID(user, function (id) {
    getClassName(id, function (name) {
      console.log(name)
    })
  })
})
```

我们经常将这种代码称为：“回调地狱”。

## 事件与回调

众所周知，JavaScript 的运行时是跑在单线程上的，是基于事件模型来进行异步任务触发的，不需要考虑共享内存加锁的问题，绑定的事件会按照顺序齐齐整整的触发。要理解 JavaScript 的异步任务，首先就要理解 JavaScript 的事件模型。

由于是异步任务，我们需要组织一段代码放到未来运行（指定时间结束时或者事件触发时），这一段代码我们通常放到一个匿名函数中，通常称为回调函数。

```js
setTimeout(function () {
  // 在指定时间结束时，触发的回调
}， 800)
window.addEventListener("resize", function() {
  // 当浏览器视窗发生变化时，触发的回调
})
```

### 未来运行

前面说过回调函数的运行是在未来，这就说明回调中使用的变量并不是在回调声明阶段就固定的。

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("i =", i)
  }, 100)
}
```

这里连续声明了三个异步任务，**100毫秒** 后会输出变量 `i` 的结果，按照正常的逻辑应该会输出 `0、1、2` 这三个结果。

然而，事实并非如此，这也是我们刚开始接触 JavaScript 的时候会遇到的问题，因为回调函数的实际运行时机是在未来，所以输出的 `i` 的值是循环结束时的值，三个异步任务的结果一致，会输出三个 `i = 3`。

![](https://file.shenfq.com/pic/20210531113319.png)

经历过这个问题的同学，一般都知道，我们可以通过闭包的方式，或者重新声明局部变量的方式解决这个问题。

### 事件队列

事件绑定之后，会将所有的回调函数存储起来，然后在运行过程中，会有另外的线程对这些异步调用的回调进行调度的处理，一旦**满足“触发”条件**就会将回调函数放入到对应的事件队列（`这里只是简单的理解成一个队列，实际存在两个事件队列：宏任务、微任务`）中。

满足触发条件一般有以下几种情况：

1. DOM 相关的操作进行的事件触发，比如点击、移动、失焦等行为；
2. IO 相关的操作，文件读取完成、网络请求结束等；
3. 时间相关的操作，到达定时任务的约定时间；

上面的这些行为发生时，代码中之前指定的回调函数就会被放入一个任务队列中，主线程一旦空闲，就会将其中的任务按照**先进先出**的流程一一执行。当有新的事件被触发时，又会重新放入到回调中，如此循环🔄，所以 JavaScript 的这一机制通常被称为“事件循环机制”。

```js
for (var i = 1; i <= 3; i++) {
  const x = i
  setTimeout(function () {
    console.log(`第${x}个setTimout被执行`)
  }, 100)
}
```

可以看到，其运行顺序满足队列先进先出的特点，先声明的先被执行。

![](https://file.shenfq.com/pic/20210531164049.png)

### 线程的阻塞

由于 JavaScript 单线程的特点，定时器其实并不可靠，当代码遇到阻塞的情况，即使事件到达了触发的时间，也会一直等在主线程空闲才会运行。

```js
const start = Date.now()
setTimeout(function () {
  console.log(`实际等待时间: ${Date.now() - start}ms`)
}, 300)

// while循环让线程阻塞 800ms
while(Date.now() - start < 800) {}
```

上面代码中，定时器设置了 `300ms` 后触发回调函数，如果代码没有遇到阻塞，正常情况下会 `300ms` 后，会输出等待时间。

但是我们在还没加了一个 `while` 循环，这个循环会在 `800ms` 后才结束，主线程一直被这个循环阻塞在这里，导致时间到了回调函数也没有正常运行。

![](https://file.shenfq.com/pic/20210531143449.png)

## Promise

事件回调的方式，在编码的过程中，就特别容易造成回调地狱。而 Promise 提供了一种更加线性的方式编写异步代码，有点类似于管道的机制。

```js
// 回调地狱
getUser(token, function (user) {
  getClassID(user, function (id) {
    getClassName(id, function (name) {
      console.log(name)
    })
  })
})

// Promise
getUser(token).then(function (user) {
  return getClassID(user)
}).then(function (id) {
  return getClassName(id)
}).then(function (name) {
  console.log(name)
}).catch(function (err) {
  console.error('请求异常', err)
})
```

Promise 在很多语言中都有类似的实现，在 JavaScript 发展过程中，比较著名的框架 jQuery、Dojo 也都进行过类似的实现。2009 年，推出的 CommonJS 规范中，基于 `Dojo.Deffered` 的实现方式，提出 `Promise/A` 规范。也是这一年 Node.js 横空出世，Node.js 很多实现都是依照 CommonJS 规范来的，比较熟悉的就是其模块化方案。

早期的 Node.js 中也实现了 Promise 对象，但是 2010 年的时候，Ry（Node.js 作者）认为 Promise 是一种比较上层的实现，而且 Node.js 的开发本来就依赖于 V8 引擎，V8 引擎原生也没有提供 Promise 的支持，所以后来 Node.js 的模块使用了 `error-first callback` 的风格（`cb(error, result)`）。

```js
const fs = require('fs')
// 第一个参数为 Error 对象，如果不为空，则表示出现异常
fs.readFile('./README.txt', function (err, buffer) {
  if (err !== null) {
    return
  }
  console.log(buffer.toString())
})
```

这一决定也导致后来 Node.js 中出现了各式各样的 Promise 类库，比较出名的就是 `Q.js`、`Bluebird`。关于 Promise 的实现，之前有写过一篇文章，感兴趣可以看看：[《手把手教你实现 Promise》](https://blog.shenfq.com/posts/2020/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E5%AE%9E%E7%8E%B0%20Promise%20.html)。

在 Node.js@8 之前，V8 原生的 Promise 实现有一些性能问题，导致原生 Promise 的性能甚至不如一些第三方的 Promise 库。

![](https://file.shenfq.com/pic/20210601151820.png)

所以，低版本的 Node.js 项目中，经常会将 Promise 进行全局的替换：

```js
const Bulebird = require('bluebird')
global.Promise = Bulebird
```

## Generator & co

`Generator(生成器)` 是 ES6 提供的一种新的函数类型，主要是用于定义一个能自我迭代的函数。通过 `function *` 的语法能够构造一个 `Generator` 函数，函数执行后会返回一个`iteration(迭代器)`对象，该对象具有一个 `next()` 方法，每次调用 `next()` 方法就会在 `yield` 关键词前面暂停，直到再次调用 `next()` 方法。

```js
function * forEach(array) {
  const len = array.length
  for (let i = 0; i < len; i ++) {
    yield i;
  }
}
const it = forEach([2, 4, 6])
it.next() // { value: 2, done: false }
it.next() // { value: 4, done: false }
it.next() // { value: 6, done: false }
it.next() // { value: undefined, done: true }
```

`next()` 方法会返回一个对象，对象有两个属性 `value`、`done`：

- `value`：表示 `yield` 后面的值；
- `done`：表示函数是否执行完毕；

由于生成器函数具有中断执行的特点，将生成器函数当做一个异步操作的容器，再配合上 Promise 对象的 then 方法可以将交回异步逻辑的执行权，在每个 `yeild` 后面都加上一个 Promise 对象，就能让迭代器不停的往下执行。

```js
function * gen(token) {
  const user = yield getUser(token)
  const cId = yield getClassID(user)
  const name = yield getClassName(cId)
  console.log(name)
}

const g = gen('xxxx-token')

// 执行 next 方法返回的 value 为一个 Promise 对象
const { value: promise1 } = g.next()
promise1.then(user => {
  // 传入第二个 next 方法的值，会被生成器中第一个 yield 关键词前面的变量接受
  // 往后推也是如此，第三个 next 方法的值，会被第二个 yield 前面的变量接受
  // 只有第一个 next 方法的值会被抛弃
  const { value: promise2 } = gen.next(user).value
  promise2.then(cId => {
    const { value: promise3, done } = gen.next(cId).value
    // 依次先后传递，直到 next 方法返回的 done 为 true
  })
})
```

我们将上面的逻辑进行一下抽象，让每个 Promise 对象正常返回后，就自动调用 next，让迭代器进行自执行，直到执行完毕（也就是 `done` 为 `true`）。

```js
function co(gen, ...args) {
  const g = gen(...args)
  function next(data) {
    const { value: promise, done } = g.next(data)
    if (done) return promise
    promise.then(res => {
      next(res) // 将 promise 的结果传入下一个 yield
    })
  }
  
  next() // 开始自执行
}

co(gen, 'xxxx-token')
```

这也就是 `koa` 早期的核心库 `co` 的实现逻辑，只是 `co` 进行了一些参数校验与错误处理。通过 generator 加上 co 能够让异步流程更加的简单易读，对开发者而言肯定是阶段欢喜的一件事。

## async/await

`async/await` 可以说是 JavaScript 异步编程的终极解决方案，其实本质上就是 Generator & co 的一个语法糖，只需要在异步的生成器函数前加上 `async`，然后将生成器函数内的 `yield` 替换为 `await`。

```js
async function fun(token) {
  const user = await getUser(token)
  const cId = await getClassID(user)
  const name = await getClassName(cId)
  console.log(name)
}

fun()
```

`async` 函数将自执行器进行了内置，同时 `await` 后不限制为 Promise 对象，可以为任意值，而且 `async/await` 在语义上比起生成器的 yield 更加清楚，一眼就能明白这是一个异步操作。



