---
title: webpack4初探
author: shenfq
date: 2018/06/09
thumbnail: //file.shenfq.com/18-8-16/87018253.jpg
categories:
- 前端工程
tags:
- 前端
- 模块化
- 前端工程化
- webpack
---

# webpack4初探

## 一、前言

2018/2/25，webpack4正式发布，距离现在已经过去三个多月了，也逐渐趋于稳定，而且现在的最新版本都到了4.12.0（版本迭代快得真是让人害怕）。

很多人都说webpack复杂，难以理解，很大一部分原因是webpack是基于配置的，可配置项很多，并且每个参数传入的形式多种多样（可以是字符串、数组、对象、函数。。。），文档介绍也比较模糊，这么多的配置项各种排列组合，想想都复杂。而gulp基于流的方式来处理文件，无论从理解上，还是功能上都很容易上手。

<!-- more -->

![最新版本](//file.shenfq.com/18-6-9/66027398.jpg)

```javascript   
//gulp
gulp.src('./src/js/**/*.js')
.pipe('babel')
.pipe('uglifyjs')
.dest('./dist/js')

//webpack
module.exports = {
  entry: './src/main.js',
  output: __dirname + '/dist/app.js',
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new require('uglifyjs-webpack-plugin')()
  ]
}
```

上面简单对比了webpack与gulp配置的区别，当然这样比较是有问题的，gulp并不能进行模块化的处理。这里主要是想告诉大家使用gulp的时候，我们能明确的知道js文件是先进行babel转译，然后进行压缩混淆，最后输出文件。而webpack对我们来说完全是个黑盒，完全不知道plugins的执行顺序。正是因为这些原因，我们常常在使用webpack时有一些不安，不知道这个配置到底有没有生效，我要按某种方式打包到底该如何配置？


为了解决上面的问题，webpack4引入了`零配置`的概念（Parcel ？？？），实际体验下来还是要写不少配置。
但是这不是重点，重点是官方宣传webpack4能够提升构建速度60%-98%，真的让人心动。

## 二、到底怎么升级

#### 0、初始化配置
首先安装最新版的webpack和webpack-dev-server，然后再安装webpack-cli。webpack4将命令行相关的操作抽离到了webpack-cli中，所以，要使用webpack4，必须安装webpack-cli。当然，如果你不想使用webpack-cli，社区也有替代方案[webpack-command](https://github.com/webpack-contrib/webpack-command)，虽然它与webpack-cli区别不大，但是还是建议使用官方推荐的webpack-cli。

```bash
npm i webpack@4 webpack-dev-server@3 --save-dev
npm i webpack-cli --save-dev
```

webpack-cli除了能在命令行接受参数运行webpack外，还具备`migrate`和`init`功能。

1. migrate用来升级webpack配置，能将webpack1的api升级到webpack2，现在用处不大。

```diff
$ webpack-cli migrate ./webpack.config.js
 ✔ Reading webpack config
 ✔ Migrating config from v1 to v2
-    loaders: [
+      rules: [
-        loader: 'babel',
-          query: {
+            use: [{
+              loader: 'babel-loader'
+            }],
+            options: {
-              loader: ExtractTextPlugin.extract('style', 'css!sass')
+              use: ExtractTextPlugin.extract({
+                fallback: 'style',
+                use: 'css!sass'
+              })
? Are you sure these changes are fine? Yes

 ✔︎ New webpack v2 config file is at /home/webpack-cli/build/webpack.config.js
```

2. init可以快速生成一个webpack配置文件的模版，不过用处也不大，毕竟现在的脚手架都集成了webpack的配置。

```
webpack-cli init

1. Will your application have multiple bundles? No // 如果是多入口应用，可以传入一个object
2. Which module will be the first to enter the application? [example: './src/index'] ./src/index // 程序入口
3. What is the location of "app"? [example: "./src/app"] './src/app'
4. Which folder will your generated bundles be in? [default: dist]
5. Are you going to use this in production? No
6. Will you be using ES2015? Yes //是否使用ES6语法，自动添加babel-loader
7. Will you use one of the below CSS solutions? SASS // 根据选择的样式类型，自动生成 loader 配置
8. If you want to bundle your CSS files, what will you name the bundle? (press enter to skip)
9. Name your 'webpack.[name].js?' [default: 'config']: // webpack.config.js

Congratulations! Your new webpack configuration file has been created!
```

更详细介绍请查看webpack-cli的[文档](https://github.com/webpack/webpack-cli/blob/master/README.md)


#### 1、零配置

零配置就意味着webpack4具有默认配置，webpack运行时，会根据`mode`的值采取不同的默认配置。如果你没有给webpack传入mode，会抛出错误，并提示我们如果要使用webpack就需要设置一个mode。

![没有使用mode](//file.shenfq.com/18-6-4/38892042.jpg)

> The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/

mode一共有如下三种配置：

1. none

    这个配置的意思就是不使用任何默认配置


2. development，开发环境下的默认配置

```javascript
module.exports = {
  //开发环境下默认启用cache，在内存中对已经构建的部分进行缓存
  //避免其他模块修改，但是该模块未修改时候，重新构建，能够更快的进行增量构建
  //属于空间换时间的做法
  cache: true, 
  output: {
    pathinfo: true //输入代码添加额外的路径注释，提高代码可读性
  },
  devtools: "eval", //sourceMap为eval类型
  plugins: [
    //默认添加NODE_ENV为development
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
  ],
  optimization: {
    namedModules: true, //取代插件中的 new webpack.NamedModulesPlugin()
    namedChunks: true
  }
}
```

3. production，生产环境下的默认配置

```javascript
module.exports = {
  performance: {
    hints: 'warning',
    maxAssetSize: 250000, //单文件超过250k，命令行告警
    maxEntrypointSize: 250000, //首次加载文件总和超过250k，命令行告警
  }
  plugins: [
    //默认添加NODE_ENV为production
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") })
  ],
  optimization: {
    minimize: true, //取代 new UglifyJsPlugin(/* ... */)
    providedExports: true,
    usedExports: true,
    //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
    //依赖于optimization.providedExports和optimization.usedExports
    sideEffects: true,
    //取代 new webpack.optimize.ModuleConcatenationPlugin()
    concatenateModules: true,
    //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
    noEmitOnErrors: true
  }
}
```

其他的一些默认值：

```javascript
module.exports = {
  context: process.cwd()
  entry: './src',
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  rules: [
    {
      type: "javascript/auto",
      resolve: {}
    },
    {
      test: /\.mjs$/i,
      type: "javascript/esm",
      resolve: {
        mainFields:
        options.target === "web" ||
        options.target === "webworker" ||
        options.target === "electron-renderer"
          ? ["browser", "main"]
          : ["main"]
      }
    },
    {
      test: /\.json$/i,
      type: "json"
    },
    {
      test: /\.wasm$/i,
      type: "webassembly/experimental"
    }
  ]
}
```

如果想查看更多webpack4相关的默认配置，[到这里来](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js)。可以看到webpack4把很多插件相关的配置都迁移到了optimization中，但是我们看看[官方文档](https://webpack.js.org/configuration/optimization/#optimization-noemitonerrors)对optimization的介绍简直寥寥无几，而在默认配置的代码中，webpack对optimization的配置有十几项，反正我是怕了。

![文档对optimization的介绍](//file.shenfq.com/18-6-4/22804701.jpg)

虽然api发生了一些变化，好的一面就是有了这些默认值，我们想通过webpack构建一个项目比以前要简单很多，如果你只是想简单的进行打包，在package.json中添加如下两个script，包你满意。

```json
{
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "build": "webpack --mode production"
  },
}
```

开发环境使用webpack-dev-server，边预览边打包再也不用f5，简直爽歪歪；生产环境直接生成打包后的文件到dist目录


#### 2、loader与plugin的升级

loader的升级就是一次大换血，之前适配webpack3的loader都需要升级才能适配webpack4。如果你使用了不兼容的loader，webpack会告诉你：

> DeprecationWarning: Tapable.apply is deprecated. Call apply on the plugin directly instead

> DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead

如果在运行过程中遇到这两个警告，就表示你有loader或者plugin没有升级。造成这两个错误的原因是，webpack4使用的新的插件系统，并且破坏性的对api进行了更新，不过好在这只是警告，不会导致程序退出，不过建议最好是进行升级。对于loader最好全部进行一次升级，反正也不亏，百利而无一害。

关于plugin，有两个坑，一个是`extract-text-webpack-plugin`，还一个是`html-webpack-plugin`。

先说说`extract-text-webpack-plugin`，这个插件主要用于将多个css合并成一个css，减少http请求，命名时支持contenthash(根据文本内容生成hash)。但是webpack4使用有些问题，所以官方推荐使用`mini-css-extract-plugin`。

> ⚠️ Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead.

这里改动比较小，只要替换下插件，然后改动下css相关的loader就行了：

```diff
-const ExtractTextPlugin = require('extract-text-webpack-plugin')
+const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
-       use: ExtractTextPlugin.extract({
-         use: [{
-           loader: 'css-loader',
-           options: {
-             minimize: process.env.NODE_ENV === 'production'
-           }
-         }],
-         fallback: 'vue-style-loader'
-       })
+       use: [
+         MiniCssExtractPlugin.loader,
+         {
+           loader: 'css-loader',
+           options: {
+           minimize: process.env.NODE_ENV === 'production'
+         }
+       ],
      }
    ]
  },
  plugins:[
-   new ExtractTextPlugin({
+   new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ...
  ]
}

```

然后看看`html-webpack-plugin`，将这个插件升级到最新版本，一般情况没啥问题，但是有个坑，最好是把`chunksSortMode`这个选项设置为none。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      hash: true,
      chunksSortMode: 'none' //如果使用webpack4将该配置项设置为'none'
    })
  ]
}

```

官方有个[issues](https://github.com/jantimon/html-webpack-plugin/issues/870)讨论了这个问题，感兴趣可以去看看。目前作者还在寻找解决方案中。
![html-webpack-plugin issues](//file.shenfq.com/18-6-7/22043868.jpg)


另外，webpack-dev-server也有个升级版本，叫做[webpack-serve](https://www.npmjs.com/package/webpack-serve)，功能比webpack-dev-server强大，支持HTTP2、使用WebSockets做热更新，暂时还在观望中，后续采坑。



#### 3、webpack4的模块拆分

webpack3中，我们经常使用`CommonsChunkPlugin`进行模块的拆分，将代码中的公共部分，以及变动较少的框架或者库提取到一个单独的文件中，比如我们引入的框架代码(vue、react)。只要页面加载过一次之后，抽离出来的代码就可以放入缓存中，而不是每次加载页面都重新加载全部资源。

CommonsChunkPlugin的常规用法如下：

```javascript
module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ //将node_modules中的代码放入vendor.js中
      name: "vendor",
      minChunks: function(module){
        return module.context && module.context.includes("node_modules");
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ //将webpack中runtime相关的代码放入manifest.js中
      name: "manifest",
      minChunks: Infinity
    }),
  ]
}
```

之前`CommonsChunkPlugin`虽然能用，但是配置不够灵活，难以理解，minChunks有时候为数字，有时候为函数，并且如果同步模块与异步模块都引入了相同的module并不能将公共部分提取出来，最后打包生成的js还是存在相同的module。


现在webpack4使用`optimization.splitChunks`来进行代码的拆分，使用`optimization.runtimeChunk`来提取webpack的runtime代码，引入了新的`cacheGroups`概念。并且webpack4中optimization提供如下默认值，官方称这种默认配置是保持web性能的最佳实践，不要手贱去修改，就算你要改也要多测试（官方就是这么自信）。

```javascript
module.exports = {
  optimization: {
    minimize: env === 'production' ? true : false, //是否进行代码压缩
    splitChunks: {
      chunks: "async",
      minSize: 30000, //模块大于30k会被抽离到公共模块
      minChunks: 1, //模块出现1次就会被抽离到公共模块
      maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
      maxInitialRequests: 3, //入口模块最多只能加载3个
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
    	  priority: -20
    	  reuseExistingChunk: true,
    	},
    	vendors: {
    	  test: /[\\/]node_modules[\\/]/,
    	  priority: -10
    	}
      }
    },
    runtimeChunk {
      name: "runtime"
    }
  }
}
```

有了这些默认配置，我们几乎不需要任何成功就能删除之前CommonChunkPlugin的代码，好神奇。

##### 什么模块会进行提取？

通过判断`splitChunks.chunks`的值来确定哪些模块会提取公共模块，该配置一共有三个选项，`initial`、`async`、 `all`。
默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码。

这里有个概念需要明确，webpack中什么是初始入口模块，什么是异步加载模块。e.g.

```javascript
//webpack.config.js
module.exports = {
  entry: {
    main: 'src/index.js'
  }
}

//index.js
import Vue from 'vue'
import(/* webpackChunkName: "asyncModule" */'./a.js')
  .then(mod => {
    console.log('loaded module a', mod)
  })

console.log('initial module')
new Vue({})

//a.js
import _ from 'lodash'
const obj = { name: 'module a' }
export default _.clone(obj)
```

上面的代码中，`index.js`在webpack的entry配置中，这是打包的入口，所以这个模块是初始入口模块。再看看`index.js`中使用了动态import语法，对`a.js`（该异步模块被命名为asyncModule）进行异步加载，则`a.js`就是一个异步加载模块。再看看`index.js`和`a.js`都有来自`node_modules`的模块，按照之前的规则，splitChunks.chunks默认为`async`，所以会被提取到vendors中的只有webpackChunkName中的模块。

![chunks为async](//file.shenfq.com/18-6-9/6383332.jpg)

如果我们把splitChunks.chunks改成all，main中来自`node_modules`的模块也会被进行提取了。

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  }
}
```

![chunks为all](//file.shenfq.com/18-6-9/30305961.jpg)

现在我们在`index.js`中也引入lodash，看看入口模块和异步模块的公共模块还会不会像CommonsChunkPlugin一样被重复打包。

```javascript
//index.js
import Vue from 'vue'
import _ from 'lodash'

import(/* webpackChunkName: "asyncModule" */'./a.js')
  .then(mod => {
    console.log('loaded module a', mod)
  })

console.log('initial module')
console.log(_.map([1,2,3], a => {
    return a * 10
}))
new Vue({})

//a.js
import _ from 'lodash'
const obj = { name: 'module a' }
export default _.clone(obj)
```

![解决了CommonsChunkPlugin的问题](//file.shenfq.com/18-6-9/67725879.jpg)

可以看到之前CommonsChunkPlugin的问题已经被解决了，main模块与asyncModule模块共同的lodash都被打包进了`vendors~main.js`中。

##### 提取的规则是什么？

`splitChunks.cacheGroups`配置项就是用来表示，会提取到公共模块的一个集合，也就是一个提取规则。像前面的`vendor`，就是webpack4默认提供的一个cacheGroup，表示来自node_modules的模块为一个集合。

除了cacheGroups配置项外，可以看下其他的几个默认规则。

1. 被提取的模块必须大于30kb；
2. 模块被引入的次数必须大于1次；
3. 对于异步模块，生成的公共模块文件不能超出5个；
4. 对于入口模块，抽离出的公共模块文件不能超出3个。

对应到代码中就是这四个配置：

```javascript
{
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
}
```

## 三、赠送webpack常见优化方式

#### 1、一个人不行，大家一起上

webpack是一个基于node的前端打包工具，但是node基于v8运行时只能是单线程，但是node中能够fork子进程。所以我们可以使用多进程的方式运行loader，和压缩js，社区有两个插件就是专门干这两个事的：HappyPack、ParallelUglifyPlugin。


使用[HappyPack](https://github.com/amireh/happypack)

```javascript
const path = require('path')
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // loader: 'babel-loader'
        loader: 'happypack/loader?id=babel'
      }
    ]
  },
  plugins: [
    new require('happypack')({
      id: 'babel',
      loaders: ['babel-loader']
    }),
  ],
};
```


使用[ParallelUglifyPlugin](https://github.com/gdborton/webpack-parallel-uglify-plugin)

```javascript
module.exports = {
  optimization: {
    minimizer: [
      new require('webpack-parallel-uglify-plugin')({
        // 配置项
      }),
    ]
  }
}
```


#### 2、打包再打包

使windows的时候，我们经常会看到一些`.dll`文件，dll文件被称为动态链接库，里面包含了程序运行时的一些动态函数库，多个程序可以共用一个dll文件，可以减少程序运行时的物理内存。

webpack中我们也可以引入dll的概念，使用[DllPlugin](https://webpack.js.org/plugins/dll-plugin/)插件，将不经常变化的框架代码打包到一个js中，比如叫做dll.js。在打包的过程中，如果检测到某个块已经在dll.js中就不会再打包。之前DllPlugin与CommonsChunkPlugin并能相互兼容，本是同根生相煎何太急。但是升级到webpack4之后，问题就迎刃而解了。

使用DllPlugin的时候，要先写另外一个webpack配置文件，用来生成dll文件。

```javascript
//webpack.vue.dll.js
const path = require('path')

module.exports = {
  entry: {
    // 把 vue 相关模块的放到一个单独的动态链接库
    vue: ['vue', 'vue-router', 'vuex', 'element-ui']
  },
  output: {
    filename: '[name].dll.js', //生成vue.dll.js
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]'
  },
  plugins: [
    new require('webpack/lib/DllPlugin')({
      name: '_dll_[name]',
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    }),
  ],
};
```

然后在之前的webpack配置中，引入dll。

```javascript
const path = require('path')

module.exports = {
  plugins: [
    // 只要引入manifest.json就能知道哪些模块再dll文件中，在打包过程会忽略这些模块
    new require('webpack/lib/DllReferencePlugin')({
      manifest: require('./dist/vue.manifest.json'),
    })
  ],
  devtool: 'source-map'
};
```

最后生成html文件的时候，一定要先引入dll文件。

```html
<html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <div id="app"></div>
        <script src="./dist/vue.dll.js"></script>
        <script src="./dist/main.js"></script>
    </body>
</html>
```

#### 3、你胖你先跑，部分代码预先运行

前面的优化都是优化打包速度，或者减少重复模块的。这里有一种优化方式，能够减少代码量，并且减少客户端的运行时间。

使用[Prepack](https://prepack.io/)，这是facebook开源的一款工具，能够运行你的代码中部分能够提前运行的代码，减少在线上真实运行的代码。

官方的demo如下：

```javascript
//input
(function () {
  function hello() { return 'hello'; }
  function world() { return 'world'; }
  global.s = hello() + ' ' + world();
})();

//output
s = "hello world";
```

想在webpack中接入也比较简单，社区以及有了对应的插件[prepack-webpack-plugin](https://github.com/gajus/prepack-webpack-plugin)，目前正式环境运用较少，还有些坑，可以继续观望。

```javascript
module.exports = {
  plugins: [
    new require('prepack-webpack-plugin')()
  ]
};
```


这里简单罗列了一些webpack的优化策略，但是有些优化策略还是还是要酌情考虑。比如多进程跑loader，如果你项目比较小，开了之后可能变慢了，因为本来打包时间就比较短，用来fork子进程的时间，说不定都已经跑完了。记住`过早的优化就是万恶之源`。

## 四、总结

webpack4带了很多新的特性，也大大加快的打包时间，并且减少了打包后的文件体积。期待webpack5的更多新特性，比如，以html或css为文件入口（鄙人认为html才是前端模块化的真正入口，浏览器的入口就是html，浏览器在真正的亲爹，不和爹亲和谁亲），默认开启多进程打包，加入文件的长期缓存，更多的拓展零配置。

同时也要感谢前端社区其它的优秀的打包工具，感谢rollup，感谢parcel。

## 五、参考

1. [webpack 为什么这么难用？](https://zhuanlan.zhihu.com/p/32148338)
2. [Webpack 4进阶](https://zhuanlan.zhihu.com/p/35407642)
3. [RIP CommonsChunkPlugin](https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693)
4. [webpack 4: mode and optimization](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)
5. [webpack 4 不完全迁移指北](https://github.com/dwqs/blog/issues/60)