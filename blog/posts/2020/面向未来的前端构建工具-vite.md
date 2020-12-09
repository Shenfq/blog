---
title: 面向未来的前端构建工具-vite
author: shenfq
date: 2020/09/07
categories:
- 前端工程
tags:
- 前端
- 模块化
- 前端工程化
- Vue.js
- JavaScript
---

## 前言

如果近期你有关注 Vue 的动态，就能发现 Vue 作者最近一直在捣鼓的新工具 [vite](https://github.com/vitejs/vite)。vite 1.0 目前已经进入了 rc 版本，马上就要正式发布 1.0 的版本了。几个月前，尤雨溪就已经在微博介绍过了 vite ，是一个基于浏览器原生 ESM 的开发服务器。

![尤雨溪微博](https://file.shenfq.com/ipic/2020-09-06-031703.png)

早期 Webpack 刚出来的时候，是为了解决低版本浏览器不支持 ESM 模块化的问题，将各个分散的 JavaScript 模块合并成一个文件，同时将多个 JavaScript 脚本文件合并成一个文件，减少 HTTP 请求的数量，有助于提升页面首次访问的速度。后期 Webpack 乘胜追击，引入了 Loader、Plugin 机制，提供了各种构建相关的能力（babel转义、css合并、代码压缩），取代了同期的 Browserify、Gulp。

如今，HTTP/2 的盛行，HTTP/3 也即将发行，再加上 5G 网络的商用，减少 HTTP 请求数量起到的作用已经微乎其微，而且新版的浏览器基本已经支持了 ESM（`<script module>`）。

![JavaScript modules](https://file.shenfq.com/ipic/2020-09-06-034308.png)



## 上手 vite

vite 带着它的历史使命随之出现。由于省略了打包的过程，首次启动 vite 的时候可谓秒开。可以看下我录制的 Gif 图，完全无需等待就能进入开发。

![启动 vite](https://file.shenfq.com/ipic/2020-09-06-040532.gif)

想要尝试 vite ，可以直接通过如下命令：

```bash
$ npm init vite-app <project-name>
$ cd <project-name>
$ npm install
$ npm run dev
```

`npm init vite-app` 命令会执行 `npx create-vite-app`，从 npm 上拉取 [create-vite-app](https://www.npmjs.com/package/create-vite-app) 模块，然后通过对应的模板生成模板文件到指定文件夹。

```json
{
  "name": "vite-app",
  "version": "0.0.1",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.0.0-rc.1"
  },
  "devDependencies": {
    "vite": "^1.0.0-rc.1",
    "@vue/compiler-sfc": "^3.0.0-rc.1"
  }
}
```

目前 vite 都是和 vue 3 搭配使用，如果要在 vue 2 使用 vite 估计还得等正式版发布。当然，能上 vue 3 还是上 vue 3 吧，无论性能、包大小还有 ts 加持方面，vue 3 都远优于 vue 2 。除了 vue，vite 还提供了 react、preat 相关的模板。

![其他模板](https://file.shenfq.com/ipic/2020-09-06-053915.png)

生成的 vue 项目的目录结构如下。

![目录结构](https://file.shenfq.com/ipic/2020-09-06-054618.png)

项目的入口为 `index.html`，html 文件中直接使用了浏览器原生的 ESM（`type="module"`） 能力。关于浏览器 ESM 能力的介绍，可以阅读我之前的文章[《前端模块化的今生》](https://blog.shenfq.com/2019/%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9A%84%E4%BB%8A%E7%94%9F/)。

```html
<script type="module" src="/src/main.js"></script>
```

所有的 js 文件经过 vite 处理后，其 import 的模块路径都会被修改，在前面加上 `/@modules/`。当浏览器请求 import 模块的时候，vite 会在 `node_modules` 中找到对应的文件进行返回。

```js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')
```

![请求](https://file.shenfq.com/ipic/2020-09-06-055051.png)

这样就省略了打包的过程，大大提升了开发效率。当然 vite 也提供了生产模式，利用 Rollup 进行构建。

## 谈谈 snowpack

首次提出利用浏览器原生 ESM 能力的工具并非是 vite，而是一个叫做 [snowpack](https://github.com/pikapkg/snowpack) 的工具。snowpack 在发布 1.0 之前，名字还叫做 `@pika/web`。

![snowpack rename](https://file.shenfq.com/ipic/2020-09-06-061256.png)

[pika](https://www.pika.dev/) 团队之所以要做 snowpack ，是因为 pika 致力于为 web 应用提速 90%。

![pika](https://file.shenfq.com/ipic/2020-09-06-060750.png)

由于当前许多 web 应用都是在不同开源模块的基础上进行构建的，而这些开源模块都被 webpack 之类的打包工具打成了一个包，如果这些开源模块都来源于同一个 CDN 地址，且支持跨域缓存，那么这些开源模块都只需要加载一次，其他网站用到了同样的开源模块，就不需要重新在下载，直接读取本地缓存。

举个例子，淘宝和天猫都是基于 react + redux + antd + loadsh 进行开发的，当我打开过淘宝之后，进入天猫这些开源模块都不用重新下载，只需要下载天猫页面相关的一些业务代码即可。为此，pika 专门建立了一个 CDN（[skypack](https://www.skypack.dev/)） 用了下载 npm 上的一些 esm 模块。

后来 snowpack 发布的时候，pika 团队顺便发表了一篇名为[《A Future Without Webpack》](https://www.pika.dev/blog/pika-web-a-future-without-webpack) 的文章，告诉大家可以尝试抛弃 webpack，革 webpack 的命。

![snowpack](https://file.shenfq.com/ipic/2020-09-06-132659.png)

在 vite 的 README 中也提到了在某些方面参考了 snowpack，并且列举了 vite 与 snowpack 的异同。

![Different](https://file.shenfq.com/ipic/2020-09-06-062710.png)

snowpack 现在已经发布到 v2 了，我们可以找到 v1 时期的源码看看 snowpack 的早期实现。

### 源码解析

在 github 上，根据 git tag 可以找到 snowpack v1.0.0 的版本，下载下来发现好像有点 bug ，建议大家阅读源码的时候可以跳到 v1.2.0（[https://github.com/pikapkg/snowpack/tree/v1.2.0](https://github.com/pikapkg/snowpack/tree/v1.2.0)）。

在 `package.json` 中可以看到，snowpack 通过他们团队的 `@pika/pack` 进行打包，这个工具将打包流程进行了管道化，有点类似与 gulp，感兴趣可以了解了解，这里重点还是 snowpack 的原理。

```json
{
  "scripts": {
    "build": "pika build"
  },
  // snowpack 的构建工具
  "@pika/pack": {
    "pipeline": [
      [
        "@pika/plugin-ts-standard-pkg"
      ],
      [
        "@pika/plugin-copy-assets"
      ],
      [
        "@pika/plugin-build-node"
      ],
      [
        "@pika/plugin-simple-bin",
        {
          // 通过 snowpack 运行命令
          "bin": "snowpack"
        }
      ]
    ]
  }
}
```

这里我们以 vue 项目为例，使用 snowpack 运行一个 vue 2 的项目。目录结构如下：

![目录结构](https://file.shenfq.com/ipic/2020-09-06-121111.png)

如果要在项目中引入 snowpack，需要在项目的 `package.json` 中，添加 snowpack 相关的配置，配置中比较重要的就是这个 `snowpack.webDependencies`，表示当前项目的依赖项，这两个文件会被 snowpack 打包到 `web_modules` 目录。

```json
{
  "scripts": {
    "build": "snowpack",
    "start": "serve ./"
  },
  "dependencies": {
    "http-vue-loader": "^1.4.2",
    "vue": "^2.6.12"
  },
  "devDependencies": {
    "serve": "^11.3.2",
    "snowpack": "~1.2.0"
  },
  "snowpack": {
    "webDependencies": [
      "http-vue-loader",
      "vue/dist/vue.esm.browser.js"
    ]
  }
}
```

运行 `npm run build` 之后，会新生成一个 `web_modules` 目录，该目录下的文件就是我们在 `snowpack.webDependencies` 中声明的两个 js 文件。

![npm run build](https://file.shenfq.com/ipic/2020-09-06-122515.png)

![web_modules](https://file.shenfq.com/ipic/2020-09-06-122603.png)

snowpack 运行的时候，会调用源码 `src/index.ts` 中的 cli 方法，该方法的代码删减版如下：

```js
// 精简了部分代码，如果想看完整版建议去 github
// https://github.com/pikapkg/snowpack/blob/v1.2.0/src/index.ts
const cwd = process.cwd();

export async function cli(args: string[]) {
  // 解析命令行参数
  const { dest = 'web_modules' } = yargs(args);
  // esm 脚本文件的输出目录，默认为 web_modules
  const destLoc = path.resolve(cwd, dest);
  // 获取 pkg.json
  const pkgManifest: any = require(path.join(cwd, 'package.json'));
  // 获取 pkg.json 中的依赖模块
  const implicitDependencies = [
    ...Object.keys(pkgManifest.dependencies || {}),
    ...Object.keys(pkgManifest.peerDependencies || {}),
  ];
  // 获取 pkg.json 中 snowpack 相关配置
  const { webDependencies } = pkgManifest['snowpack'] || {
    webDependencies: undefined
  };

  const installTargets = [];
  // 需要被安装的模块，如果没有该配置，会尝试安装所有 dependencies 内的模块
  if (webDependencies) {
    installTargets.push(...scanDepList(webDependencies, cwd));
  } else {
    installTargets.push(...scanDepList(implicitDependencies, cwd));
  }
  // 模块安装
  const result = await install(installTargets, installOptions);
}
```

该方法会读取项目的 `package.json` 文件，如果有 `snowpack.webDependencies` 配置，会优先安装 `snowpack.webDependencies` 中声明的模块，如果没有该配置，会把 `dependencies` 和 `devDependencies` 中的模块都进行安装。所有的模块名都会通过 `scanDepList`，转化为特定格式，并且会把`glob`语法的模块名，经过 `glob` 还原成单个的文件。

```js
import path from 'path';

function createInstallTarget(specifier: string): InstallTarget {
  return {
    specifier,
    named: [],
  };
}

export function scanDepList(depList: string[], cwd: string): InstallTarget[] {
  // 获取 node_modules 路径
  const nodeModules = path.join(cwd, 'node_modules');
  return depList
    .map(whitelistItem => {
    	// 判断文件名是否为 glob 语法 （e.g. `vue/*.js`）
      if (!glob.hasMagic(whitelistItem)) {
        return [createInstallTarget(whitelistItem)];
      } else {
        // 转换 glob 路径
        return scanDepList(glob.sync(whitelistItem，{cwd: nodeModules}), cwd);
      }
    })
  	// 将所有文件合并成一个数组
    .reduce((flat, item) => flat.concat(item), []);
}
```

最后，所有的模块会经过 install 进行安装。

![install](https://file.shenfq.com/ipic/2020-09-06-131508.png)

```js
// 移除 .js、.mjs 后缀
function getWebDependencyName(dep: string): string {
  return dep.replace(/\.m?js$/i, '');
}

// 获取模块的类型以及绝对路径
function resolveWebDependency(dep: string): {
  type: 'JS' | 'ASSET';
  loc: string;
} {
  var packagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
  // 如果带有扩展名，且非 npm 模块，直接返回
  if (path.extname(dep) && !packagePattern.test(dep)) {
    const isJSFile = ['.js', '.mjs', '.cjs'].includes(path.extname(dep));
    return {
      type: isJSFile ? 'JS' : 'ASSET',
      // 还原绝对路径
      loc: require.resolve(dep, {paths: [cwd]}),
    };
  }
  // 如果是 npm 模块，需要查找模块对应的 package.json 文件
  const manifestPath = `${cwd}/node_modules/${dep}/package.json`;
  const manifestStr = fs.readFileSync(manifestPath, {encoding: 'utf8'});
  const depManifest = JSON.parse(manifestStr);
  // 然后读取 package.json 中的 module属性、browser属性
  let foundEntrypoint: string =
    depManifest['browser:module'] || depManifest.module || depManifest.browser;
  if (!foundEntrypoint) {
    // 如果都不存在就取 main 属性
    foundEntrypoint = depManifest.main || 'index.js';
  }
  return {
    type: 'JS',
    // 还原绝对路径
    loc: path.join(`${cwd}/node_modules/${dep}`, foundEntrypoint),
  };
}

// 模块安装
function install(installTargets, installOptions) {
  const {
    destLoc
  } = installOptions;
  // 使用 set 将待安装模块进行一次去重
  const allInstallSpecifiers = new Set(installTargets.map(dep => dep.specifier));
  
  // 模块查找转化
  for (const installSpecifier of allInstallSpecifiers) {
    // 移除 .js、.mjs 后缀
    const targetName = getWebDependencyName(installSpecifier);
    // 获取文件类型，以及文件绝对路径
    const {type: targetType, loc: targetLoc} = resolveWebDependency(installSpecifier);
    if (targetType === 'JS') {
      // 脚本文件
      const hash = await generateHashFromFile(targetLoc);
      // 添加到脚本依赖对象
      depObject[targetName] = targetLoc;
      importMap[targetName] = `./${targetName}.js?rev=${hash}`;
      installResults.push([installSpecifier, true]);
    } else if (targetType === 'ASSET') {
      // 静态资源
      // 添加到静态资源对象
      assetObject[targetName] = targetLoc;
      installResults.push([installSpecifier, true]);
    }
  }
  
  if (Object.keys(depObject).length > 0) {
    // 通过 rollup 打包文件
    const packageBundle = await rollup.rollup({
    	input: depObject,
      plugins: [
        // rollup 插件
        // 这里可以进行一些 babel 转义、代码压缩之类的操作
        // 还可以将一些 commonjs 的模块转化为 ESM 模块
      ]
    });
    // 文件输出到 web_modules 目录
    await packageBundle.write({
    	dir: destLoc,
    });
  }

  // 拷贝静态资源
  Object.entries(assetObject).forEach(([assetName, assetLoc]) => {
    mkdirp.sync(path.dirname(`${destLoc}/${assetName}`));
    fs.copyFileSync(assetLoc, `${destLoc}/${assetName}`);
  });

  return true;
}
```

基本原理已经分析完毕，下面看一看实际案例。我们在 html 中通过 `type="module"` 的 script 标签引入 `index.js` 作为入口文件。

```html
<!DOCTYPE html>
<html lang="en">
  <title>snowpack-vue-httpvueloader</title>
  <link rel="stylesheet" href="./assets/style.css">

  <body>
    <h1>snowpack - Vue Example</h1>
    <div id="app"></div>
    <script type="module" src="./js/index.js"></script>
  </body>
</html>
```

然后在 `index.js` 中， import 在 `webDependenies` 中声明的两个 js 文件，并且在之前加上 `/web_modules`。

```js
import Vue from '/web_modules/vue/dist/vue.esm.browser.js'
import httpVueLoader from '/web_modules/http-vue-loader.js'

Vue.use(httpVueLoader)

new Vue({
  el: '#app',
  components: {
    app: 'url:./components/app.vue',
  },
  template: '<app></app>',
})

```

最后通过 `npm run start `，使用 `serve` 起一个 node 服务就可以正常访问了。

可以看到 snowpack v1 的功能整体比较简陋，只是将需要依赖的模块从 node_modules 中提取到了 web_modules 中，中间通过 rollup 进行了一次编译。这里引入 rollup 主要是为了对 js 代码做一些压缩优化，还有将某些 commonjs 的模块转化为 ESM 的模块。

但是最后还需要借助第三方模块来启动 node 服务，当时官方还热心的告诉你可以选择哪些第三方模块来提供服务。

![server](https://file.shenfq.com/ipic/2020-09-06-133649.png)

v2 版本已经支持内部启用一个 node server 来开发，而不需要借助，而且可以进行热更新。当然 v2 版本除了 js 模块还提供了 css 模块的支持。



## vite 原理

在了解了 snowpack v1 的源码后，再回过头看看 vite 的原理。还是按照之前的方式，追溯到 [vite v0.1.1](https://github.com/vitejs/vite/tree/a4f093a0c364d4984bcd46291a2fa09818712a4d)，代码量较少的时候，看看 vite 的思路。

vite 在启动时，内部会启一个 http server，用于拦截页面的脚本文件。

```js
// 精简了热更新相关代码，如果想看完整版建议去 github
// https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/server.ts
import http, { Server } from 'http'
import serve from 'serve-handler'

import { vueMiddleware } from './vueCompiler'
import { resolveModule } from './moduleResolver'
import { rewrite } from './moduleRewriter'
import { sendJS } from './utils'

export async function createServer({
  port = 3000,
  cwd = process.cwd()
}: ServerConfig = {}): Promise<Server> {
  const server = http.createServer(async (req, res) => {
    const pathname = url.parse(req.url!).pathname!
    if (pathname.startsWith('/__modules/')) {
      // 返回 import 的模块文件
      return resolveModule(pathname.replace('/__modules/', ''), cwd, res)
    } else if (pathname.endsWith('.vue')) {
      // 解析 vue 文件
      return vueMiddleware(cwd, req, res)
    } else if (pathname.endsWith('.js')) {
      // 读取 js 文本内容，然后使用 rewrite 处理
      const filename = path.join(cwd, pathname.slice(1))
      const content = await fs.readFile(filename, 'utf-8')
      return sendJS(res, rewrite(content))
    }

    serve(req, res, {
      public: cwd,
      // 默认返回 index.html
      rewrites: [{ source: '**', destination: '/index.html' }]
    })
  })

  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      console.log(`Running at http://localhost:${port}`)
      resolve(server)
    })

    server.listen(port)
  })
}
```

访问 vite 服务的时候，默认会返回 index.html。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico" />
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

### 处理 js 文件

html 文件会请求 `/src/main.js`， vite 服务在返回 js 文件的时候，会使用 `rewrite` 方法对 js 文件内容进行一次替换。

```js
if (pathname.endsWith('.js')) {
  // 读取 js 文本内容，然后使用 rewrite 处理
  const filename = path.join(cwd, pathname.slice(1))
  const content = await fs.readFile(filename, 'utf-8')
  return sendJS(res, rewrite(content))
}
```

```js
// 精简了部分代码，如果想看完整版建议去 github
// https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleRewriter.ts
import { parse } from '@babel/parser'

export function rewrite(source: string, asSFCScript = false) {
  // 通过 babel 解析，找到 import from、export default 相关代码
  const ast = parse(source, {
    sourceType: 'module',
    plugins: [
      'bigInt',
      'optionalChaining',
      'nullishCoalescingOperator'
    ]
  }).program.body

  let s = source
  ast.forEach((node) => {
    if (node.type === 'ImportDeclaration') {
      if (/^[^\.\/]/.test(node.source.value)) {
        // 在 import 模块名称前加上 /__modules/
        // import { foo } from 'vue' --> import { foo } from '/__modules/vue'
        s = s.slice(0, node.source.start) 
          + `"/__modules/${node.source.value}"`
        	+ s.slice(node.source.end) 
      }
    } else if (asSFCScript && node.type === 'ExportDefaultDeclaration') {
      // export default { xxx } -->
      // let __script; export default (__script = { xxx })
      s = s.slice(0, node.source.start)
        + `let __script; export default (__script = ${
      		s.slice(node.source.start, node.declaration.start) 
   			})`
        + s.slice(node.source.end) 
      s.overwrite(
        node.start!,
        node.declaration.start!,
        `let __script; export default (__script = `
      )
      s.appendRight(node.end!, `)`)
    }
  })

  return s.toString()
}
```

html 文件请求 `/src/main.js`， 经过 vite 处理后，结果如下：

```diff
- import { createApp } from 'vue'
+ import { createApp } from '/__modules/vue'
import App from './App.vue'

createApp(App).mount('#app')
```

![main.js](https://file.shenfq.com/ipic/2020-09-07-034532.png)

### 处理 npm 模块

浏览器解析完 main.js 之后，会读取其中的 import 模块，进行请求。请求的文件如果是 `/__modules/` 开头的话，表明是一个 npm 模块，vite 会使用 `resolveModule` 方法进行处理。

```js
// fetch /__modules/vue
if (pathname.startsWith('/__modules/')) {
  // 返回 import 的模块文件
  return resolveModule(pathname.replace('/__modules/', ''), cwd, res)
}
```

```js
// 精简了部分代码，如果想看完整版建议去 github
// https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleResolver.ts
import path from 'path'
import resolve from 'resolve-from'
import { sendJSStream } from './utils'
import { ServerResponse } from 'http'

export function resolveModule(id: string, cwd: string, res: ServerResponse) {
  let modulePath: string
  modulePath = resolve(cwd, 'node_modules'， `${id}/package.json`)
  if (id === 'vue') {
    // 如果是 vue 模块，返回 vue.runtime.esm-browser.js
    modulePath = path.join(
      path.dirname(modulePath),
      'dist/vue.runtime.esm-browser.js'
    )
  } else {
    // 通过 package.json 文件，找到需要返回的 js 文件
    const pkg = require(modulePath)
    modulePath = path.join(path.dirname(modulePath), pkg.module || pkg.main)
  }

  sendJSStream(res, modulePath)
}
```

### 处理 vue 文件

main.js 除了获取框架代码，还 import 了一个 vue 组件。如果是 `.vue` 结尾的文件，vite 会通过 `vueMiddleware` 方法进行处理。

```js
if (pathname.endsWith('.vue')) {
  // 解析 vue 文件
  return vueMiddleware(cwd, req, res)
}
```

```js
// 精简了部分代码，如果想看完整版建议去 github
// https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/vueCompiler.ts

import url from 'url'
import path from 'path'
import { parse, SFCDescriptor } from '@vue/compiler-sfc'
import { rewrite } from './moduleRewriter'

export async function vueMiddleware(
  cwd: string, req, res
) {
  const { pathname, query } = url.parse(req.url, true)
  const filename = path.join(cwd, pathname.slice(1))
  const content = await fs.readFile(filename, 'utf-8')
  const { descriptor } = parse(content, { filename }) // vue 模板解析
  if (!query.type) {
    let code = ``
    if (descriptor.script) {
      code += rewrite(
        descriptor.script.content,
        true /* rewrite default export to `script` */
      )
    } else {
      code += `const __script = {}; export default __script`
    }
    if (descriptor.styles) {
      descriptor.styles.forEach((s, i) => {
        code += `\nimport ${JSON.stringify(
          pathname + `?type=style&index=${i}`
        )}`
      })
    }
    if (descriptor.template) {
      code += `\nimport { render as __render } from ${JSON.stringify(
        pathname + `?type=template`
      )}`
      code += `\n__script.render = __render`
    }
    sendJS(res, code)
    return
  }
  if (query.type === 'template') {
    // 返回模板
  }
  if (query.type === 'style') {
    // 返回样式
  }
}
```

经过解析，`.vue` 文件返回的时候会被拆分成三个部分：script、style、template。

```html
// 解析前
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>
```

```js
// 解析后
import HelloWorld from "/src/components/HelloWorld.vue";

let __script;
export default (__script = {
    name: "App",
    components: {
        HelloWorld
    }
})

import {render as __render} from "/src/App.vue?type=template"
__script.render = __render
```

template 中的内容，会被 vue 解析成 render 方法。关于 vue 模板是如何编译成 render 方法的，可以看我的另一篇文章：[《Vue 模板编译原理》](https://blog.shenfq.com/2020/vue-%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/)。

```js
import {
  parse,
  SFCDescriptor,
  compileTemplate
} from '@vue/compiler-sfc'

export async function vueMiddleware(
  cwd: string, req, res
) {
  // ...
  if (query.type === 'template') {
    // 返回模板
    const { code } = compileTemplate({
      filename,
      source: template.content,
    })
    sendJS(res, code)
    return
  }
  if (query.type === 'style') {
    // 返回样式
  }
}
```

![模板](https://file.shenfq.com/ipic/2020-09-07-061353.png)

而 template 的样式

```js
import {
  parse,
  SFCDescriptor,
  compileStyle,
  compileTemplate
} from '@vue/compiler-sfc'

export async function vueMiddleware(
  cwd: string, req, res
) {
  // ...
  if (query.type === 'style') {
    // 返回样式
    const index = Number(query.index)
    const style = descriptor.styles[index]
    const { code } = compileStyle({
      filename,
      source: style.content
    })
    sendJS(
      res,
      `
  const id = "vue-style-${index}"
  let style = document.getElementById(id)
  if (!style) {
    style = document.createElement('style')
    style.id = id
    document.head.appendChild(style)
  }
  style.textContent = ${JSON.stringify(code)}
    `.trim()
    )
  }
}
```

style 的处理也不复杂，拿到 style 标签的内容，然后 js 通过创建一个 style 标签，将样式添加到 head 标签中。

### 小结

这里只是简单的解析了 vite 是如何拦截请求，然后返回需要的文件的过程，省略了热更新的代码。而且待发布 vite v1 除了启动服务用来开发，还支持了 rollup 打包，输出生产环境代码的能力。

## 总结

vite 刚刚发布的时候，还只能做 vue 的配套工具使用，现在已经支持了 JSX、TypeScript、Web Assembly、PostCSS 等等一系列能力。我们就静静的等待 vue3 和 vite 的正式版发布吧，到底能不能革了 webpack 的命，就看天意了。

对了，vite 和 vue 一样，来自法语，中文是「快」的意思。

![vite翻译](https://file.shenfq.com/ipic/2020-09-07-065154.png)

