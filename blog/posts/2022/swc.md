---
title: 新一代的编译工具 SWC
author: shenfq
date: 2022/01/13
categories:
- 前端
tags:
- JavaScript
- Rust
- Babel
- 编译
---

# 新一代的编译工具 SWC

最近前端圈掀起了一阵 rust 风，凡是能用 rust 重写的前端工具就用 rust 重写，今天介绍的工具就是通过 rust 实现的 bable：swc，一个将 ES6 转化为 ES5 的工具。

而且在 swc 的官网，很直白说自己和 babel 对标，`swc` 和 `babel` 命令可以相互替换，并且大部分的 babel 插件也已经实现。

![](https://file.shenfq.com/pic/202201050924805.png)

使用 rust 的一个优势就是快，比如我们之前的一个项目，将 babel 替换成 swc 后，编译速度从原来的 7 秒提升到了 1 秒，效率直接爆炸。

![](https://file.shenfq.com/pic/202201042122421.png)

## 上手

swc 与 babel 一样，将命令行工具、编译核心模块分化为两个包。

- `@swc/cli` 类似于 `@babel/cli`;
- `@swc/core` 类似于 `@babel/core`;

```bash
npm i -D @swc/cli @swc/core
```

通过如下命令，可以将一个 ES6 的 JS 文件转化为 ES5。

```bash
npx swc source.js -o dist.js
```

下面是 `source.js` 的代码：

```js
const start = () => {
  console.log('app started')
}
```

代码中囊括了 ES6 的两个特性，`const 声明` 和 `箭头函数`。经过 swc 转化后，这两个特性分别被转化成了 `var 声明` 和 `function 匿名函数`。

![](https://file.shenfq.com/pic/202201101704871.png)

### 配置文件

swc 与 babel 一样，支持类似于 `.babelrc` 的配置文件：`.swcrc`，配置的格式为 JSON。

```json
{
  "jsc": { // 编译规则
    "target": "es5", // 输出js的规范
    "parser": {
      // 除了 ecmascript，还支持 typescript
      "syntax": "ecmascript",
      // 是否解析jsx，对应插件 @babel/plugin-transform-react-jsx
      "jsx": false,
      // 是否支持装饰器，对应插件 @babel/plugin-syntax-decorators
      "decorators": false,
      // 是否支持动态导入，对应插件 @babel/plugin-syntax-dynamic-import
      "dynamicImport": false,
      // ……
      // babel 的大部分插件都能在这里找到对应配置
    },
    "minify": {}, // 压缩相关配置，需要先开启压缩
  },
  "env": { // 编译结果相关配置
    "targets": { // 编译结果需要适配的浏览器
      "ie": "11" // 只兼容到 ie 11
    },
    "corejs": "3" // corejs 的版本
  },
  "minify": true // 是否开启压缩
}
```

babel 的插件系统被 swc 整合成了 `jsc.parser` 内的配置，基本上大部分插件都能照顾到。而且，swc 还继承了压缩的能力，通过 `minify` 属性开启，`jsc.minify` 用于配置压缩相关的规则，更详细的配置可查看[文档](https://swc.rs/docs/configuration/minification)。

### Node APIs

通过在 node.js 代码中，导入 `@swc/core` 模块，可以在 node.js 中调用 api 直接进行代码的编译，这对 CLI 工具的开发来说是常规操作。

```js
// swc.mjs
import { readFileSync } from 'fs'
import { transform } from '@swc/core'

const run = async () => {
  const code = readFileSync('./source.js', 'utf-8')
	const result = await transform(code, {
    filename: "source.js",
  })
  // 输出编译后代码
  console.log(result.code)
}

run()
```

![](https://file.shenfq.com/pic/202201131446362.png)

### 打包代码

除了将代码转义，swc 还提供了一个简易的打包能力。我们新建一个 `src` 文件夹，在里面新建两个文件：`index.js`、`utils.js`。

```js
// src/index.js
import { log } from './utils.js'
const start = () => log('app started')
start()
```

```JS
// src/utils.js
export const log = function () {
  console.log(...arguments)
}
export const errorLog = function () {
  console.error(...arguments)
}
```

可以看到 `index.js` 导入了 `utils.js` 中的一个方法，然后我们新建一个 `spack.config.js` 文件，该文件是 swc 打包的配置文件。

```js
// spack.config.js
module.exports = {
  entry: {
    // 打包的入口
    web: __dirname + "/src/index.js",
  },
  output: {
    // 打包后输出的文件夹
    path: __dirname + "/dist",
  },
};
```

然后在命令行运行：

```bash
$ npx spack
```

![](https://file.shenfq.com/pic/202201131533361.png)

打包成功后，会在 `dist` 目录输出一个 `web.js` 文件。

![](https://file.shenfq.com/pic/202201131534524.png)

可以看到，不仅将 `index.js`、`utils.js` 打包成了一个文件，还进行了 `tree shaking`，将 `utils.js` 中没有使用的 `errorLog` 方法删掉了。

## 能不能用？

babel 毕竟经过了这么多年的发展，不管是 bug 输了，还是社区活跃度都远远优于 swc。所以，如果是小产品试水还是可以试一下 swc 的，旧项目如果已经使用了 babel 还是不建议进行迁移。

在使用的过程，还是发现了一些小问题。比如，如果我使用了 `async function`，swc 会自动导入 `regenerator-runtime` 模块。

```js
// 编译前，有个 async 方法
const start = async () => {
  console.log('app started')
}
```

调用 swc 编译后，代码如下：

![](https://file.shenfq.com/pic/202201131824854.png)

这个结果看起来是没问题的，但是 swc 与 babel 类似，也有 helpers（@swc/helpers），同时提供了 `externalHelpers` 开关， 如果把 `externalHelpers` 设置为 `true`，swc 会将一些工具类，通过模块的形式导入。

```json
// .swcrc
{
  "jsc": {
    "externalHelpers": true
  }
}
```

![](https://file.shenfq.com/pic/202201131834021.png)

而 `externalHelpers` 的默认值是 `false`，那这个时候，`regenerator-runtime` ，到底是通过模块的形式导入，还是把整个代码写入到文件？

swc 正好有个 [issue [https://github.com/swc-project/swc/issues/1461]](https://github.com/swc-project/swc/issues/1461) 在讨论这个问题。

除了上面说的这个问题，其实还有一点，就是作者觉得之前的架构有问题，正在加紧重写 2.0 版本，感觉可以期待一下，另外提一句，swc 的作者是一个 97 年的韩国小哥，目前大学都还没毕业，最后我也只能说一句：牛逼！

