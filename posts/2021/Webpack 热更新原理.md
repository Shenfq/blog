---
title: Webpack 热更新原理
author: shenfq
date: 2021/07/21
categories:
- 前端工程
tags:
- 前端
- 模块化
- 前端工程化
- webpack
---


用过 webpack 的同学应该都知道，有一个特别好用的『热更新』，在不刷新页面的情况下，就能将代码推到浏览器。

![热更新](https://file.shenfq.com/pic/20210718124656.gif)

今天的文章将会探寻一下 webpack 热更新的秘密。

## 如何配置热更新

我们先安装一些我们需要的包：

```bash
npm i webpack webpack-cli -D
npm i webpack-dev-server -D
npm i html-webpack-plugin -D
```

然后，我们需要弄明白，webpack 从版本 webpack@4 之后，需要通过 webpack CLI 来启动服务，提供了打包的命令和启动开发服务的命令。

```bash
# 打包到指定目录
webpack build --mode production --config webpack.config.js
# 启动开发服务器
webpack serve --mode development --config webpack.config.js
```

```json
// pkg.json
{
  "scripts": {
    "dev": "webpack serve --mode development --config webpack.config.js",
    "build": "webpack build --mode production --config webpack.config.js"
  },
  "devDependencies": {
    "webpack": "^5.45.1",
    "webpack-cli": "^4.7.2",
    "webpack-dev-server": "^3.11.2",
    "html-webpack-plugin": "^5.3.2",
  }
}
```

在启动开发服务的时候，在 webpack 的配置文件中配置 `devServe` 属性，即可开启热更新模式。

```js
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    hot: true, // 开启热更新
    port: 8080, // 指定服务器端口号
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
```

配置完毕后，我们可以开始按下面的目录结构新建文件。

```bash
├── src
│   ├── index.js
│   └── num.js
├── index.html
├── package.json
└── webpack.config.js
```

这里因为需要对 DOM 进行操作，为了方便我们直接使用 jQuery （yyds），在 HTML 文件中引入 jQuery 的 CDN。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Webpack Demo</title>
  <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js"></script>
</head>
<body>
  <div id="app"></div> 
</body>
</html>
```

然后在 `index.js` 中对 `div#app` 进行操作。

```js
// src/index.js
import { setNum } from './num'

$(function() {
  let num = 0
  const $app = $('#app')
  $app.text(`同步修改结果: ${num}`)

  setInterval(() => {
    num = setNum(num) // 调用 setNum 更新 num 的值
    $app.text(`同步修改结果: ${num}`)
  }, 1e3)
})
```

这里每秒调用一次 `setNum` 方法，更新变量 `num` 的值，然后修改 `div#app` 的文本。`setNum` 方法在 `num.js` 文件中，这里就是我们需要修改的地方，通过修改该方法，让页面直接进行热更新。

```js
// src/num.js
export const setNum = (num) => {
  return ++num // 让 num 自增
}
```

修改 `setNum` 方法的过程中，发现页面直接刷新了，并没有达到预想中的热更新操作。

![](https://file.shenfq.com/pic/20210718123529.gif)

[官方文档](https://webpack.docschina.org/configuration/dev-server/#devserverhot)中好像也没说还有什么其他的配置要做，真是让人迷惑。

![](https://file.shenfq.com/pic/20210718124125.png)

最后把文档翻烂了之后，发现，热更新除了要修改 `devServer` 配置之外，还需要在代码中告诉 webpack 哪些模块是需要进行热更新的。

> 模块热替换：https://webpack.docschina.org/guides/hot-module-replacement/

![webpack 文档](https://file.shenfq.com/pic/20210718124349.png)

同理，我们需要修改 `src/index.js`，告诉 webpack `src/num.js` 模块是需要进行热更新的。

```js
import { setNum } from './num'

if (module.hot) {
  //num 模块需要进行热更新
  module.hot.accept('./num')
}

$(function() {
  ……
})
```

![热更新](https://file.shenfq.com/pic/20210718124656.gif)

关于模块热替换更多 API 介绍可以看这里：

> [模块热替换(hot module replacement) -https://www.webpackjs.com/api/hot-module-replacement](https://www.webpackjs.com/api/hot-module-replacement)

如果不是像我这样手动配置 webpack，并且使用 jQuery 根本不会注意到这个配置。在一些 Loader （style-loader、vue-loader、react-hot-loader）中，都在其内部调用了 module hot api，也是替开发者省了很多心。

#### style-loader 热更新代码

> https://github.com/webpack-contrib/style-loader/blob/6e70da0c5a37025510afe4f49ddeaf6c39daaa75/src/utils.js#L175

![](https://file.shenfq.com/pic/20210718130555.png)

#### vue-loader 热更新代码

> https://github.com/vuejs/vue-loader/blob/689075d763994a536022ea31348186f0a2c27460/lib/codegen/hotReload.js#L17

![](https://file.shenfq.com/pic/20210718130802.png)

## 热更新的原理

在讲热更新之前，我们需要先看看 webpack 是如何打包文件的。

### webpack 打包逻辑

先回顾一下前面的代码，并且把之前的 ESM 语法改成 `require` ，因为 webpack 内部也会把 ESM 修改成 `require`。

```js
// src/index.js
$(function() {
  let num = 0
  const $app = $('#app')
  $app.text(`同步修改结果: ${num}`)
  setInterval(() => {
    num = require('./num').setNum(num)
    $app.text(`同步修改结果: ${num}`)
  }, 1e3)
})
// src/num.js
exports.setNum = (num) => {
  return --num
}
```

我们都知道，webpack 本质是一个打包工具，会把多个 js 文件打包成一个 js 文件。下面的代码是 webpack 打包后的代码：

```js
// webpackBootstrap
(() => {
  // 所有模块打包都一个对象中
  // key 为文件名，value 为一个匿名函数，函数内就是文件内代码
  var __webpack_modules__ = ({
    "./src/index.js": ((module, __webpack_exports__, __webpack_require__) => {
      "use strict";
      $(function() {
        let num = 0
        const $app = $('#app')
        $app.text(`同步修改结果: ${num}`)
        setInterval(() => {
          num = (0,__webpack_require__("./src/num.js").setNum)(num)
          $app.text(`同步修改结果: ${num}`)
        }, 1e3)
      })
    }),

    "./src/num.js": ((module, __webpack_exports__, __webpack_require__) => {
      "use strict";
      Object.assign(__webpack_exports__, {
        "setNum": (num) => {
          return ++num
        }
      })
    })

  });

  // 内部实现一个 require 方法
  function __webpack_require__(moduleId) {
    // Execute the module function
    try {
      var module = {
        id: moduleId,
        exports: {}
      };
      // 取出模块执行
      var factory = __webpack_modules__[moduleId]
      factory.call(module.exports, module, module.exports, __webpack_require__);
    } catch(e) {
      module.error = e;
      throw e;
    }
    // 返回执行后的 exports
    return module.exports;
  }

  /*******************************************/
  // 启动
  // Load entry module and return exports
  __webpack_require__("./src/index.js");
})
```

当然，上面的代码是简化后的代码，webpack 实际打包出来的代码还会有一些缓存、容错以及 ESM 模块兼容之类的代码。

我们可以简单的模拟一下 webpack 的打包逻辑。

```js
// build.js
const path = require('path')
const minimist = require('minimist')
const chokidar = require('chokidar')

const wrapperFn = (content) => {
  return  `function (require, module, exports) {\n  ${content.split('\n').join('\n  ')}\n}`
}

const modulesFn = (files, contents) => {
  let modules = 'const modules = {\n'
  files.forEach(file => {
    modules += `"${file}": ${wrapperFn(contents[file])},\n\n`
  })
  modules += '}'
  return modules
}
const requireFn = () => `const require = function(url) {
  const module = { exports: {} }
  const factory = modules[url] || function() {}
  factory.call(module, require, module, module.exports)
  return module.exports
}`

const template = {
  wrapperFn,
  modulesFn,
  requireFn,
}

module.exports = class Build {
  files = new Set()
  contents = new Object()

  constructor() {
    // 解析参数
    // index: 入口 html 的模板
    // entry: 打包的入口 js 文件名
    // output: 打包后输出的 js 文件名
    const args = minimist(process.argv.slice(2))
    const { index, entry, output } = args

    this.index = index || 'index.html'
    this.entry = path.join('./', entry)
    this.output = path.join('./', output)
    this.getScript()
  }

  getScript() {
    // 从入口的 js 文件开始，获取所有的依赖
    this.files.add(this.entry)
    this.files.forEach(file => {
      const dir = path.dirname(file)
      const content = fs.readFileSync(file, 'utf-8')
      const newContent = this.processJS(dir, content)
      this.contents[file] = newContent
    })
  }

  processJS(dir, content) {
    let match = []
    let result = content
    const depReg = /require\s*\(['"](.+)['"]\)/g

    while ((match = depReg.exec(content)) !== null) {
      const [statements, url] = match
      let newUrl = url
      // 不存在文件后缀时，手动补充后缀
      if (!newUrl.endsWith('.js')) {
        newUrl += '.js'
      }

      newUrl = path.join(dir, newUrl)
      // 将 require 中的相对地址替换为绝对地址
      let newRequire = statements.replace(url, newUrl)
      newRequire = newRequire.replace('(', `(/* ${url} */`)
      result = result.replace(statements, newRequire)
      this.files.add(newUrl)
    }

    return result
  }

  genCode() {
    let outputJS = ''
    outputJS += `/* all modules */${template.modulesFn(this.files, this.contents)}\n`
    outputJS += `/* require */${template.requireFn()}\n`
    outputJS += `/* start */require('${this.entry}')\n`

    return outputJS
  }
}
```

```js
// index.js
cosnt fs = require('fs')
const Build = require('./build')
const build = new Build()

// 生成打包后的代码
const code = build.genCode()
fs.writeFileSync(build.output, code)
```

启动代码：

```bash
node index.js --entry ./src/index.js --output main.js
```

生成后的代码如下所示：

```js
/*
	所有的模块都会放到一个对象中。
	对象的 key 为模块的文件路径；
	对象的 value 为一个匿名函数；
*/
const modules = {
  "src/index.js": function (require, module, exports) {
    $(function() {
      let num = 0
      const $app = $('#app')
      $app.text(`同步修改结果: ${num}`)
      setInterval(() => {
        num = require('./num').setNum(num)
        $app.text(`同步修改结果: ${num}`)
      }, 1e3)
    })
  },

  "src/num.js": function (require, module, exports) {
    exports.setNum = (num) => {
      return ++num
    }
  },
}

/* 
	内部实现一个 require 方法，从 modules 中获取对应模块，
	然后注入 require、module、exports 等参数
*/
const require = function(url) {
  const module = { exports: {} }
  const factory = modules[url] || function() {}
  factory.call(module, require, module, module.exports)
  return module.exports
}

/* 启动入口的 index.js */
require('src/index.js')
```

webpack 打包除了将所有 js 模块打包到一个文件外，引入 `html-webpack-plugin` 插件，还会将生成的 output 自动插入到 html 中。

```js
new HtmlWebpackPlugin({
  template: './index.html'
})
```

这里我们也在 `build.js` 中新增一个方法，模拟下这个行为。

```js
module.exports = class Build {
  constructor() {
    ……
  }
  genIndex() {
    const { index, output } = this
    const htmlStr = fs.readFileSync(index, 'utf-8')
    const insertIdx = htmlStr.indexOf('</head>')
    const insertScript = `<script src="${output}"></script>`
    // 在 head 标签内插入 srcript 标签
    return htmlStr.slice(0, insertIdx) + insertScript + htmlStr.slice(insertIdx)
  }
}
```

要完成热更新，webpack 还需要自己启动一个服务，完成静态文件的传输。我们利用 koa 启动一个简单的服务。

```js
// index.js
const koa = require('koa')
const nodePath = require('path')

const Build = require('./build')
const build = new Build()

// 启动服务
const app = new koa()
app.use(async ctx => {
  const { method, path } = ctx
  const file = nodePath.join('./', path) 
  if (method === 'GET') {
    if (path === '/') {
      // 返回 html
      ctx.set(
        'Content-Type',
        'text/html;charset=utf-8'
      )
      ctx.body = build.genIndex()
      return
    } else if (file === build.output) {
      ctx.set(
        'Content-Type',
        'application/x-javascript;charset=utf-8'
      )
      ctx.body = build.genCode()
      return
    }
  }
  ctx.throw(404, 'Not Found');
})

app.listen(8080)
```

启动服务后，可以看到页面正常运行。

```bash
node index.js --entry ./src/index.js --output main.js
```

![](https://file.shenfq.com/pic/20210721144652.gif)

### 热更新的实现

webpack 在热更新模式下，启动服务后，服务端会与客户端建立一个长链接。文件修改后，服务端会通过长链接向客户端推送一条消息，客户端收到后，会重新请求一个 js 文件，返回的 js 文件会调用 `webpackHotUpdatehmr` 方法，用于替换掉 `__webpack_modules__` 中的部分代码。

![](https://file.shenfq.com/pic/20210721151932.gif)

![](https://file.shenfq.com/pic/20210721153620.png)

通过实验可以看到，热更新的具体流程如下：

1. Webpack Server 与 Client 建立长链接；
2. Webpack 监听文件修改，修改后通过长链接通知客户端；
3. Client 重新请求文件，替换 `__webpack_modules__` 中对应部分；

#### 建立长链接

Server 与 Client 之间需要建立长链接，可以直接使用开源方案的 socket.io 的方案。

```js
// index.js
const koa = require('koa')
const koaSocket = require('koa-socket-2')

const Build = require('./build')
const build = new Build()

const app = new koa()
const socket = new koaSocket()

socket.attach(app) // 启动长链接服务

app.use(async ctx => {
  ………
}
……

// build.js
module.exports = class Build {
  constructor() {
    ……
  }
  genIndex() {
    ……
    // 新增 socket.io 客户端代码
    const insertScript = `
    <script src="/socket.io/socket.io.js"></script>
    <script src="${output}"></script>
    `
    ……
  }
  genCode() {
    let outputJS = ''
    ……
    // 新增代码，监听服务端推送的消息
    outputJS += `/* socket */
    const socket = io()
    socket.on('updateMsg', function (msg){
    // 监听服务端推送的消息
    })\n`
    ……
  }
}
```

#### 监听文件修改

前面实现 `build.js` 的时候，通过 `getScript()` 方法，已经收集了所有的依赖文件。这里只需要通过 `chokidar` 监听所有的依赖文件即可。

```js
// build.js
module.exports = class Build {
  onUpdate = function () {}
  constructor() {
    ……
    // 获取所有js依赖
    this.getScript()
    // 开启文件监听
    this.startWatch()
  }
  startWatch() {
    // 监听所有的依赖文件
    chokidar.watch([...this.files]).on('change', (file) => {
      // 获取更新后的文件
      const dir = path.dirname(file)
      const content = fs.readFileSync(file, 'utf-8')
      const newContent = this.processJS(dir, content)
      // 将更新的文件写入内存
      this.contents[file] = newContent
      this.onUpdate && this.onUpdate(file)
    })
  }
  onWatch(callback) {
    this.onUpdate = callback
  }
}
```

在文件修改后，重写了 `build.contents` 中的文本内容，然后会触发 `onUpdate` 方法。所以，我们启动服务时，需要把实现这个方法，每次触发更新的时候，需要向客户端进行消息推送。

```js
// index.js
const koa = require('koa')
const koaSocket = require('koa-socket-2')

const Build = require('./build')
const build = new Build()
const app = new koa()
const socket = new koaSocket()

// 启动长链接服务
socket.attach(app)

// 文件修改后，向所有的客户端广播修改的文件名
build.onWatch((file) => {
  app._io.emit('updateMsg', JSON.stringify({
    type: 'update', file
  }));
})
```

#### 请求更新模块

客户端收到消息后，请求需要更新的模块。

```js
// build.js
module.exports = class Build {
  genCode() {
    let outputJS = ''
    ……
    // 新增代码，监听服务端推送的消息
    outputJS += `/* socket */
    const socket = io()
    socket.on('updateMsg', function (msg){
    	const json = JSON.parse(msg)
      if (json.type === 'update') {
        // 根据文件名，请求更新的模块
        fetch('/update/'+json.file)
          .then(rsp => rsp.text())
					.then(text => {
            eval(text) // 执行模块
          })
      }
    })\n`
    ……
  }
}
```

然后在服务端中间件内处理 `/update/` 相关的请求。

```js
app.use(async ctx => {
  const { method, path } = ctx
  
  if (method === 'GET') {
    if (path === '/') {
      // 返回 html
      ctx.body = build.genIndex()
      return
    } else if (nodePath.join('./', path) === build.output) {
      // 返回打包后的代码
      ctx.body = build.genCode()
      return
    } else if (path.startsWith('/update/')) {
      const file = nodePath.relative('/update/', path)
      const content = build.contents[file]
      if (content) {
        // 替换 modules 内的文件
        ctx.body = `modules['${file}'] = ${
        	template.wrapperFn(content)
      	}`
        return
      }
    }
  }
}
```

最终效果：

![](https://file.shenfq.com/pic/20210721163140.gif)

### 完整代码

> [👉 Shenfq/hrm](https://github.com/Shenfq/hmr)
>
> [🔗 https://github.com/Shenfq/hmr](https://github.com/Shenfq/hmr)

## 总结

这次自己凭感觉实现了一把 HMR，肯定和 Webpack 真实的 HMR 还是有一点出入，但是对于理解 HMR 的原理还是有一点帮助的，希望大家阅读文章后有所收获。
