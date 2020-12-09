---
title: 【翻译】CommonJS 是如何导致打包后体积增大的？
author: shenfq
date: 2020/11/18
categories:
- 前端工程
tags:
- 前端
- 翻译
- 模块化
- 前端工程化
- Webpack
---

> 原文：[How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles)


今天的文章，将介绍什么是 CommonJS，以及它为什么会导致我们打包后的文件体积增大。

> 本文概要：为了确保打包工具（webpack之类的）能够对你的项目代码进行优化，请避免在项目中使用 CommonJS 模块，并且整个项目都应该使用 ESM（ECMAScript Module） 的模块语法。

## 什么是 CommonJS？

CommonJS 是 2009 年发布的 JavaScript模块化的一项标准，最初它只打算在浏览器之外的场景使用，主要用于服务器端的应用程序。

你可以使用 CommonJS 来定义模块，并从中导出部分模块。例如，下面的代码定义了一个模块，该模块导出了五个函数：`add`、 `subtract`、 `multiply`、 `divide`、`max`:

```js
// utils.js
const { maxBy } = require('lodash-es');
const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

其他模块可以导入这个模块的部分函数。

```js
// index.js
const { add } = require(‘./utils');
console.log(add(1, 2));
```

通过 node 运行 `index.js` ，会在控制台输出数字 `3`。

在 2010 年，由于浏览器缺乏标准化的模块化能力，CommonJS 成了当时 JavaScript 客户端较为流行的模块化标准。

## CommonJS 如何影响包体？

服务端的 JavaScript 程序对代码体积并不像浏览器中那么敏感，这就是为什么在设计 CommonJS 的时候，并没有考虑减少生产包大小的原因。同时，[研表究明](https://v8.dev/blog/cost-of-javascript-2019) JavaScript 代码的体积依然是影响页面加载速度的一个重要因素。

JavaScript 的打包工具（`webpack`、`terser`）会进行许多优化以减小最后生成的包体大小。他们在构建时，会分析你的代码，尽可能的删除不会使用的部分。例如，上面的代码中，最终生成的包应该只包含 `add` 函数，因为这是 `index.js` 唯一从 `utils.js` 中导入的部分。

下面我们使用如下 `webpack` 配置对应用进行打包：

```js
const path = require('path');
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

我们需要将 `webpack` 的 `mode` 指定为 `production`，并且将 `index.js` 做为入口。运行 `webpack` 后，会输出一个文件：[dist/out.js](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js)，可以通过如下方式统计它的大小：

```bash
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

打包后的文件高达 625 KB。如果看下 `out.js` 文件，会发现 `utils.js` 导入 [`lodash`](https://lodash.com/) 的所有模块都打包到了输出的文件中，尽管我们在 `index.js` 并没有使用到 lodash 的任何方法，但是这给我们的包体带来了巨大的影响。

现在我们将代码的模块化方案改为 [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)，`utils.js` 部分的代码如下：

```js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

`index.js` 也改为 ESM 的方式从 `utils.js` 导入模块：

```js
import { add } from './utils';

console.log(add(1, 2));
```

使用相同的 `webpack` 配置，构建完毕之后，我们打开 `out.js` ，**仅有 40 字节**，输出如下：

```js
(()=>{"use strict";console.log(1+2)})();
```

值得注意的是，最终的输出并没有包含 `utils.js` 的任何代码，而且 lodash 也消失了。而且 `terser`（`webpack` 使用的压缩工具）直接将 add 函数内联到了 `console.log` 内部。

有的小朋友可能就会问了（`此处采用了李永乐语法`），为什么使用 CommonJS 会导致输出的文件大了 `16,000` 倍？当然，这只是用来展示 CommonJS 与 ESM 差异的案例，实际上并不会出现这么大的差异，但是使用 CommonJS 肯定会导致打包后的体积更大。

一般情况下，CommonJS 模块的体积更加难优化，因为它比 ES 模块更加的动态化。为了确保构建工具以及压缩工具能成功优化代码，请避免使用 CommonJS 模块。

当然，如果你只在 `utils.js` 采用了 ESM 的模块化方案，而 `index.js` 还是维持 CommonJS，则包体依旧会受到影响。

## 为什么 CommonJS 会使包体更大？

要回答这个问题，我们需要研究 `webpack` 的 `ModuleConcatenationPlugin` 的行为，并且看看它是如何进行静态分析的。该插件将所有的模块都放入一个闭包内，这会让你的代码在浏览器中更快的执行。我们来看看下面的代码：

```js
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```js
// index.js
import { add } from ‘./utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

我们有一个新的 ESM 模块（`utils.js`），将其导入 `index.js` 中，我们还重新定义一个 `subtract` 函数。接下来使用之前的 `webpack` 配置来构建项目，但是这次，我把禁用压缩配置。

```diff
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
+ optimization: {
+   minimize: false
+ },
  mode: 'production',
};
```

输出的 `out.js` 如下：

```js
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;
console.log(add(1, 2));

/******/ })();
```

输出的代码中，所有的函数都在一个命名空间里，为了防止冲突，`webpack` 将 `index.js` 中的 `subtract` 函数重新命名为了 `index_subtract` 函数。

如果开启压缩配置，它会进行如下操作：

1. 删除没有使用的 `subtract` 函数和 `index_subtract` 函数；
2. 删除所有的注释和空格；
3. `console.log` 中直接内联 `add` 函数；

一些开发人员会把这种删除未使用代码的行为称为“**tree-shaking**（树摇）”。`webpack` 能够通过导出、导入符号静态的分析 `utils.js`（在构建的过程中），这使得 tree-shaking 有了可行性。当使用 ESM 时，这种行为是默认开启的，因为相比于 CommonJS，它更加易于静态分析。

让我们看看另外的示例，这一次将 `utils.js` 改为 CommonJS 模块，而不是 ESM 模块。

```js
// utils.js
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

这个小小的改动，明显影响了输出的代码。由于输出的文本太大，我们只展示其中的一小部分。

```js
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

可以看到，最终生成的代码包含一些 `webpack` 的 `runtime` 代码，这部分代码负责模块的导入导出的能力。这次并没有将 `utils.js` 和 `index.js` 所有的变量放到了同一命名空间下，动态引入的模块都是通过 `__webpack_require__` 进行导入。

使用 CommonJS 的时候，我们可以通过任意的表达式构造导出名称，例如下面的代码也是能正常运行的：

```js
module.exports[(Math.random()] = () => { … };
```

这导致构建工具在构建时，没有办法知道导出的变量名，因为这个名称只有在用户浏览器运行时才能够真正确定。压缩工具无法准确的知道 `index.js` 使用了模块的哪部分内容，因此无法正确的进行 tree-shaking。如果我们从 `node_modules` 导入了 CommonJS 模块，你的构建工具将无法正确的优化它。

## 对 CommonJS 使用 Tree-shaking

由于 CommonJS 的模块化方案是动态的，想要分析他们是特别困难的。与通过表达式导入模块的 CommonJS 相比，ESM 模块的导入始终使用的是静态的字符串文本。

在某些情况下，如果你使用的库遵循 CommonJS 的相关的一些约定，你可以使用第三方的 `webpack` 插件：[webpack-common-shake](https://github.com/indutny/webpack-common-shake)，在构建的过程中，删除未使用的模块。尽管该插件增加了 CommonJS 对 tree-shaking 的支持，但并没有涵盖所有的 CommonJS 依赖，这意味着你不能获得 ESM 相同的效果。

此外，这并非是 `webpack` 默认行为，它会对你的构建耗时增加额外的成本。

## 总结

为了确保构建工具对你的代码尽可能的进行优化，请避免使用 CommonJS 模块，并在整个项目中使用 ESM 语法。

下面是一些检验你的项目是否是最佳实践的方法：

- 使用 Rollup.js 提供的 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件，并开启 `modulesOnly` 选项，表示你的项目只会使用 ESM。
- 使用 [`is-esm`](https://github.com/mgechev/is-esm) 来验证 npm 安装的模块是否使用 ESM。
- 如果您使用的是Angular，默认情况下，如果你依赖了不能进行 tree-shaking 的模块，则会收到警告。
