---
title: Webpack5 跨应用代码共享-Module Federation
author: shenfq
date: 2020/09/14
categories:
- 前端工程
tags:
- 前端
- 模块化
- 前端工程化
- webpack
---

# Webpack5 跨应用代码共享-Module Federation

Webpack 5 的消息尽管已经出来了许久，但是正式版一直还未发布。Webpack 5 的 ChangeLog 中，除了常规的性能优化、编译提速之外，有一个比较让人期待的功能就是 `Module Federation`。有些文件将 `Module Federation` 强行翻译成「模块联邦」，听起来很是怪异，我在某个前端群也抛出了这个问题，没想到大家的回复也是五花八门。所以，本文就直接用 `Module Federation` 了，不进行翻译听起来好像更舒服一点。

![](https://file.shenfq.com/ipic/2020-09-14-040807.png)

## 什么是 Module Federation ？

`Module Federation` 主要是用来解决多个应用之间代码共享的问题，可以让我们的更加优雅的实现跨应用的代码共享。假设我们现在有两个项目A、B，项目 A 内部有个轮播图组件，项目 B 内部有个新闻列表组件。

![项目 A](https://file.shenfq.com/ipic/2020-09-13-131855.png)

![项目 B](https://file.shenfq.com/ipic/2020-09-13-131933.png)

现在来了个需求，要将项目 B 的新闻列表移植到项目 A 中，而且需要保证后续的迭代过程中，两边的新闻列表样式保持一致。这时候你有两种做法：

1. 使用 CV 大法，将项目 B 的代码完整复制一份到项目 A；
2. 将新闻组件独立，发布到内部的 npm，通过 npm 加载组件；

CV 大法肯定比独立组件要快，毕竟不需要将组件代码从项目 B 独立出来，然后发布 npm。但是 CV 大法的缺陷是，不能及时同步代码，如果你的另一个同事在你复制代码之后，对项目 B 的新闻组件进行了修改，此时项目 A 与项目 B 的新闻组件就不一致了。

这个时候，如果你两个项目恰好使用了 Webpack 5，那应该是件很幸福的事，因为你不需要任何代价，只需要几行配置，就能直接在项目 A 用上项目 B 的新闻组件。不仅如此，还可以在项目 B 中使用项目 A 的轮播图组件。也就是说，通过 `Module Federation` 实现的代码共享是双向的，听起来真是想让人直呼：“学不动了！”。

## Module Federation 实践

下面我们来看看项目 A/B 的代码。

项目 A 的目录结构如下：

```
├── public
│   └── index.html
├── src
│   ├── index.js
│   ├── bootstrap.js
│   ├── App.js
│   └── Slides.js
├── package.json
└── webpack.config.js
```

项目 B 的目录结构如下：

```
├── public
│   └── index.html
├── src
│   ├── index.js
│   ├── bootstrap.js
│   ├── App.js
│   └── NewsList.js
├── package.json
└── webpack.config.js
```

项目 A、B 的差异主要在 App.js 中 import 的组件不同，两者的 index.js、bootstrap.js 都是一样的。

```jsx
// index.js
import("./bootstrap");

// bootstrap.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

项目 A 的 App.js：

```jsx
import React from "react";
import Slides from './Slides';

const App = () => (
  <div>
    <h2 style={{ textAlign: 'center' }}>App1, Local Slides</h2>
    <Slides />
  </div>
);

export default App;
```

项目 B 的 App.js：

```jsx
import React from "react";
import NewsList from './NewsList';
const RemoteSlides = React.lazy(() => import("app1/Slides"));

const App = () => (
  <div>
    <h2 style={{ textAlign: 'center' }}>App 2, Local NewsList</h2>
    <NewsList />
  </div>
);

export default App;
```

现在我们看看在接入 `Module Federation` 之前的 webpack 配置：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  // 入口文件
  entry: "./src/index",
  // 开发服务配置
  devServer: {
    // 项目 A 端口为 3001，项目 B 端口为 3002
    port: 3001,
    contentBase: path.join(__dirname, "dist"),
  },
  output: {
    // 项目 A 端口为 3001，项目 B 端口为 3002
    publicPath: "http://localhost:3001/",
  },
  module: {
    // 使用 babel-loader 转义
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    // 处理 html
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

### 配置：exposes/remotes

现在，我们修改 webpack 配置，引入 `Module Federation`，让项目 A 引入项目 B 的新闻组件。

```js
// 项目 B 的 webpack 配置
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      // 提供给其他服务加载的文件
      filename: "remoteEntry.js",
      // 唯一ID，用于标记当前服务
      name: "app2",
      // 需要暴露的模块，使用时通过 `${name}/${expose}` 引入
      exposes: {
        "./NewsList": "./src/NewsList",
      }
    })
  ]
};

// 项目 A 的 webpack 配置
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      // 引用 app2 的服务
      remotes: {
        app2: "app2@http://localhost:3002/remoteEntry.js",
      }
    })
  ]
};
```

我们重点关注 `exposes`/`remotes`：

- 提供了 `exposes` 选项的表示当前应用是一个 `Remote`，`exposes` 内的模块可以被其他的 `Host` 引用，引用方式为 `import(${name}/${expose})`。
- 提供了 `remotes` 选项的表示当前应用是一个 `Host`，可以引用 `remote` 中 `expose` 的模块。

然后修改项目 A 的 App.js：

```jsx
import React from "react";
import Slides from './Slides';
// 引入项目 B 的新闻组件
const RemoteNewsList = React.lazy(() => import("app2/NewsList"));

const App = () => (
  <div>
    <h2 style={{ textAlign: 'center' }}>App1, Local Slides, Remote NewsList</h2>
    <Slides />
    <React.Suspense fallback="Loading Slides">
      <RemoteNewsList />
    </React.Suspense>
  </div>
);

export default App;
```

![项目 A](https://file.shenfq.com/ipic/2020-09-13-153604.png)

此时，项目 A 就已经成功接入了项目 B 的新闻组件。我们再看看项目 A 的网络请求，项目 A 配置了 `app2: "app2@http://localhost:3002/remoteEntry.js"` 的 remote 后，会先请求项目 B 的 `remoteEntry.js` 文件作为入口。在我们 import 项目 B 的新闻组件时，就会去获取项目 B 的 `src_NewsList_js.js` 文件。

![network](https://file.shenfq.com/ipic/2020-09-13-162457.png)

### 配置：shared

除了前面提到的模块引入和模块暴露相关的配置外，还有个 `shared` 配置，主要是用来避免项目出现多个公共依赖。

例如，我们当前的项目 A，已经引入了一个 `react`/`react-dom`，而项目 B 暴露的新闻列表组件也依赖了 `react`/`react-dom`。如果不解决这个问题，项目 A 就会加载两个 `react` 库。这让我回想起刚刚入行的时候，公司的一个项目由于是 PHP 模板拼接的方式，不同部门在自己的模板中都引入了一个 jQuery，导致项目中引入了三个不同版本的 jQuery，特别影响页面性能。

所以，我们在使用 Module Federation 的时候一定要记得，将公共依赖配置到 `shared` 中。另外，一定要两个项目同时配置 `shared` ，否则会报错。

接下来，我们在浏览器打开项目 A，在 Chrome 的 network 面板中，可以看到项目 A 直接使用了项目 B 的 `react`/`react-dom`。

![共享依赖](https://file.shenfq.com/ipic/2020-09-13-155102.png)

### 双向共享

前面提到过，Module Federation 的共享可以是双向的。下面，我们将项目 A 也配置成一个 `Remote`，将项目 A 的轮播图组件暴露给项目 B 使用。

```js
// 项目 B 的 webpack 配置
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      // 暴露新闻列表组件
      exposes: {
        "./NewsList": "./src/NewsList",
      },
      // 引用 app1 的服务
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ]
};

// 项目 A 的 webpack 配置
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      // 暴露轮播图组件
      exposes: {
        "./Slides": "./src/Slides",
      },
      // 引用 app2 的服务
      remotes: {
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      },
    })
  ]
};
```

在项目 B 中使用轮播图组件：

```diff
// App.js
import React from "react";
import NewsList from './NewsList';
+const RemoteSlides = React.lazy(() => import("app1/Slides"));

const App = () => (
  <div>
-   <h2 style={{ textAlign: 'center' }}>App 2, Local NewsList</h2>
+   <h2 style={{ textAlign: 'center' }}>App 2, Remote Slides, Local NewsList</h2>
+   <React.Suspense fallback="Loading Slides">
+     <RemoteSlides />
+   </React.Suspense>
    <NewsList />
  </div>
);

export default App;
```

![项目 B](https://file.shenfq.com/ipic/2020-09-13-163136.png)

### 同时引入多个依赖

Module Federation 也支持一次性 Remote 多个项目。我们可以新建一个项目 C，同时引入项目 A 的轮播图组件和项目 B 的新闻列表组件。

```js
// 项目 C 的 webpack 配置
// 其他配置与之前的项目基本一致，除了需要将端口修改为 3003
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app3",
      // 同时依赖项目 A、B
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    })
  ]
};
```

接入组件：

```jsx
import React from "react";
const RemoteSlides = React.lazy(() => import("app1/Slides"));
const RemoteNewsList = React.lazy(() => import("app2/NewsList"));

const App = () => (
  <div>
    <h2 style={{ textAlign: 'center' }}>App 3, Remote Slides, Remote Remote</h2>
    <React.Suspense fallback="Loading Slides">
      <RemoteSlides />
      <RemoteNewsList />
    </React.Suspense>
  </div>
);

export default App;
```

![项目 C](https://file.shenfq.com/ipic/2020-09-13-163820.png)

## 加载逻辑

这里有一个点需要特别注意，就是入口文件 `index.js` 本身没有什么逻辑，反而将逻辑放在了 `bootstrap.js` 中，`index.js` 去动态加载 `bootstrap.js`。

```js
// index.js
import("./bootstrap");

// bootstrap.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.render(<App />, document.getElementById("root"));
```

如果删掉 `bootstrap.js`，将逻辑直接放到 `index.js` 是否可行呢？经过测试，确实是不可行的。

![去除 bootstrap.js](https://file.shenfq.com/ipic/2020-09-14-022855.png)

主要原因是 remote 暴露的 js 文件需要优先加载，如果 `bootstrap.js` 不是一个异步逻辑，在 `import NewsList` 的时候，会依赖 app2 的 `remote.js`，如果直接在 `main.js` 执行，app2 的 `remote.js` 根本没有加载，所以会有问题。

![依赖查找](https://file.shenfq.com/ipic/2020-09-14-024302.png)

![依赖查找](https://file.shenfq.com/ipic/2020-09-14-024406.png)

通过 network 面板也可以看出，`remote.js` 是先于 `bootstrap.js` 加载的，所以我们的 `bootstrap.js` 必须是个异步逻辑。

![network](https://file.shenfq.com/ipic/2020-09-14-023427.png)

项目 A 的加载逻辑如下：

#### 加载 main.js

`main.js` 里面主要是 webpack 的一些 runtime 逻辑，以及 remote 请求和 bootstrap 请求。

![main.js-1](https://file.shenfq.com/ipic/2020-09-14-031820.png)

![main.js-2](https://file.shenfq.com/ipic/2020-09-14-031024.png)

#### 加载 remote.js

`main.js` 会优先加载项目 B 的 `remote.js`，该文件会暴露 `exposes` 中配置的内部组件供外部使用。

![remote.js](https://file.shenfq.com/ipic/2020-09-14-032045.png)

#### 加载 bootstrap.js

`main.js` 加载自己的主逻辑 `bootstrap.js`，`bootstrap.js` 会使用到 app2 的新闻列表组件。

![bootstrap.js](https://file.shenfq.com/ipic/2020-09-14-030420.png)

内部使用 `__webpack_require__.e` 来加载新闻组件， `__webpack_require__.e` 在 `main.js` 中有定义。

![RemoteNewsList](https://file.shenfq.com/ipic/2020-09-14-032623.png)

```js
/* webpack/runtime/ensure chunk */
(() => {
  __webpack_require__.f = {};
  __webpack_require__.e = (chunkId) => {
    // __webpack_require__.e 会通过传入的 chunkId 在 __webpack_require__.f 中查找
    return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
      __webpack_require__.f[key](chunkId, promises);
      return promises;
    }, []));
  };
})();
```

`__webpack_require__.f` 一共有三个部分：

```js
__webpack_require__.f.remotes = (chunkId, promises) => {}  // webpack/runtime/remotes
__webpack_require__.f.consumes = (chunkId, promises) => {} // webpack/runtime/consumes
__webpack_require__.f.j = (chunkId, promises) => {}        // webpack/runtime/jsonp
```

我们暂时只看 remotes 的逻辑，因为我们的新闻组件是作为 remote 加载进来的。

```js
	/* webpack/runtime/remotes loading */
	(() => {
		var installedModules = {};
		var chunkMapping = {
			"webpack_container_remote_app2_NewsList": [
				"webpack/container/remote/app2/NewsList"
			]
		};
		var idToExternalAndNameMapping = {
			"webpack/container/remote/app2/NewsList": [
				"default",
				"./NewsList",
				"webpack/container/reference/app2"
			]
		};

		__webpack_require__.f.remotes = (chunkId, promises) => {
			// chunkId: webpack_container_remote_app2_NewsList
			chunkMapping[chunkId].forEach((id) => {
				// id: webpack/container/remote/app2/NewsList
				var data = idToExternalAndNameMapping[id];
        // require("webpack/container/reference/app2")["./NewsList"]
				var promise = __webpack_require__(data[2])[data[1]];
        return promise;
			});
		}
	})();
```

可以看到，最后的调用方式会变成 `require("webpack/container/reference/app2")["./NewsList"]`，而这个模块在之前加载的 app2 的 `remote.js` 已经定义过。

![app2 remote](https://file.shenfq.com/ipic/2020-09-14-034645.png)

`src_NewsList_js.js` 的加载由 `remote.js` 发起。

![image-20200914114816682](https://file.shenfq.com/ipic/2020-09-14-034833.png)

## 总结

Webpack 5 提供的 `Module Federation` 还是很强大的，特别是在多个项目中进行代码共享，提供了极大的便利，但是这有一个致命缺点，需要你们所有的项目都基于 Webpack，而且已经升级到了 Webpack 5。相比起 `Module Federation`，个人还是更喜欢 vite 提供的方案，利用浏览器原生的模块化能力，进行代码共享。

完整代码可以访问我的 [github](https://github.com/Shenfq/Webpack5-Module-Federation-Demo)，如果想看更多关于 `Module Federation` 的案例，可以访问[官方仓库](https://github.com/module-federation/module-federation-examples)。

