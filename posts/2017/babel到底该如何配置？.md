---
title: babel到底该如何配置？
author: shenfq
date: 2017/10/22
categories:
- 前端工程
tags:
- es6
- babel
- 前端
---

#### 背景
说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的[官网](http://babeljs.io/)是这样介绍它的：

> Babel is a JavaScript compiler.

> Use next generation JavaScript, today.

大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对js语法的支持不尽相同，特别是ES6之后，ECMAScrip对版本的更新已经到了一年一次的节奏，虽然每年更新的幅度不大，但是每年的提案可不少。babel的出现就是为了解决这个问题，把那些使用新标准编写的代码转译为当前环境可运行的代码，简单点说就是把ES6代码转译（转码+编译）到ES5。

经常有人在使用babel的时候并没有弄懂babel是干嘛的，只知道要写ES6就要在webpack中引入一个babel-loader，然后胡乱在网上copy一个.babelrc到项目目录就开始了（ps: 其实我说的是我自己）。理解babel的配置很重要，可以避免一些不必要的坑，比如：代码中使用Object.assign在一些低版本浏览器会报错，以为是webpack打包时出现了什么问题，其实是babel的配置问题。

<!-- more -->

---

#### ES6

正文之前先谈谈ES6，ES即**ECMAScript**，6表示第六个版本(也被称为是ES2015，因为是2015年发布的)，它是javascript的实现标准。

被纳入到ES标准的语法必须要经过如下五个阶段:
1. Stage 0: strawman
2. Stage 1: proposal
3. Stage 2: draft   -   必须包含**2个实验性的具体实现**，其中一个可以是用转译器实现的，例如Babel。
4. Stage 3: candidate  -  至少要有**2个符合规范的具体实现**。
5. Stage 4: finished

可以看到提案在进入stage3阶段时就已经在一些环境被实现，在stage2阶段有babel的实现。所以被纳入到ES标准的语法其实在大部分环境都已经是有了实现的，那么为什么还要用babel来进行转译，因为不能确保每个运行代码的环境都是最新版本并已经实现了规范。

更多关于ES6的内容可以参考hax的live:[Hax：如何学习和实践ES201X？](https://www.zhihu.com/lives/883307634416054272?utm_source=qq&utm_medium=social)


---

#### Babel的版本变更

写这篇文章时babel版本已经到了[v7.0.0-beta.3](https://github.com/babel/babel/releases/tag/v7.0.0-beta.3),也就是说7.0的正式版就要发布了，可喜可贺。但是今天不谈7.0，只谈babel6，在我知道并开始使用的babel的时候babel已经到了版本6，没有经历过5的时代。

在babel5的时代，babel属于全家桶型，只要安装babel就会安装babel相关的所有工具，
即装即用。

但是到了babel6，具体有以下几点变更：

- 移除babel全家桶安装，拆分为单独模块，例如：babel-core、babel-cli、babel-node、babel-polyfill等；
可以在babel的github仓库看到babel现在有哪些模块。
![babel-package](//file.shenfq.com/17-10-16/10463136.jpg)
- 新增 .babelrc 配置文件，基本上所有的babel转译都会来读取这个配置；
- 新增 plugin 配置，所有的东西都插件化，什么代码要转译都能在插件中自由配置；
- 新增 preset 配置，babel5会默认转译ES6和jsx语法，babel6转译的语法都要在perset中配置，preset简单说就是一系列plugin包的使用。



---

#### babel各个模块介绍

babel6将babel全家桶拆分成了许多不同的模块，只有知道这些模块怎么用才能更好的理解babel。

下面的一些示例代码已经上传到了[github](https://github.com/Shenfq/studyBabel)，欢迎访问，欢迎star。

安装方式：

```shell
#通过npm安装
npm install babel-core babel-cli babel-node

#通过yarn安装
yarn add babel-core babel-cli babel-node
```


##### 1、[babel-core](http://babeljs.io/docs/usage/api/)

看名字就知道，babel-core是作为babel的核心存在，babel的核心api都在这个模块里面，比如：transform。

下面介绍几个babel-core中的api

- babel.transform：用于字符串转码得到AST

```javascript
/*
 * @param {string} code 要转译的代码字符串
 * @param {object} options 可选，配置项
 * @return {object} 
*/
babel.transform(code: string, options?: Object)
    
//返回一个对象(主要包括三个部分)：
{
    generated code, //生成码
    sources map, //源映射
    AST  //即abstract syntax tree，抽象语法树
}
```
更多关于AST知识点请看[这里](https://www.zhihu.com/question/20346372)。

一些使用babel插件的打包或构建工具都有使用到这个方法，下面是一些引入babel插件中的源码：

```javascript
//gulp-babel
const babel = require('babel-core');
/*
some codes...
*/
module.exports = function (opts) {
    opts = opts || {};
	return through.obj(function (file, enc, cb) {
        try {
            const fileOpts = Object.assign({}, opts, {
            	filename: file.path,
            	filenameRelative: file.relative,
            	sourceMap: Boolean(file.sourceMap),
            	sourceFileName: file.relative,
            	sourceMapTarget: file.relative
            });
            const res = babel.transform(file.contents.toString(), fileOpts);
            if (res !== null) {
            	//some codes
            }
        } catch (err) {
            //some codes
        }
    }
}

//babel-loader
var babel = require("babel-core");
/*
some codes...
*/
var transpile = function transpile(source, options) {
    //some code
    try {
        result = babel.transform(source, options);
    } catch (error) {
        //some codes
    }
    //some codes
}

//rollup-pugin-babel
import { buildExternalHelpers, transform } from 'babel-core';
/*
some codes...
*/
export default function babel ( options ) {
    //some codes
    return {
        // some methods
        transform ( code, id ) {
            const transformed = transform( code, localOpts );
            //some codes
            return {
            	code: transformed.code,
            	map: transformed.map
            };
        }
    }
}
```

上面是一些打包工具引入babel插件时的一些源码，可以看到基本都是先通过调用transform方法进行代码转码。

- babel.transformFile

```javascript
//异步的文件转码方式，回调函数中的result与transform返回的对象一至。
babel.transformFile("filename.js", options, function (err, result) {
  result; // => { code, map, ast }
});
```


- babel.transformFileSync

```javascript
//同步的文件转码方式，返回结果与transform返回的对象一至。
babel.transformFileSync(filename, options) // => { code, map, ast }
```

- babel.transformFromAst

```javascript
//将ast进行转译
const { code, map, ast } = babel.transformFromAst(ast, code, options);
```

##### 2、[babel-cli](http://babeljs.io/docs/usage/cli/)

babel-cli是一个通过命令行对js文件进行换码的工具。

使用方法：

- 直接在命令行输出转译后的代码
    ```shell
    babel script.js
    ```
- 指定输出文件
    ```shell
    babel script.js --out-file build.js
    或者是
    babel script.js -o build.js
    ```

让我们来编写了一个具有箭头函数的代码：

```javascript
//script.js
const array = [1,2,3].map((item, index) => item * 2);
```
然后在命令行执行 babel script.js，发现输出的代码好像没有转译。

![babel转译](//file.shenfq.com/17-10-16/1390829.jpg)

因为我们没有告诉babel要转译哪些类型，现在看看怎么指定转译代码中的箭头函数。

```shell
babel --plugins transform-es2015-arrow-functions script.js
```

![转译箭头函数](//file.shenfq.com/17-10-16/38822081.jpg)

或者在目录里添加一个.babelrc文件，内容如下：

```json
{
    "plugins": [
        "transform-es2015-arrow-functions"
    ]
}
```
.babelrc是babel的全局配置文件，所有的babel操作（包括babel-core、babel-node）基本都会来读取这个配置，后面会详细介绍。


##### 3、babel-node

babel-node是随babel-cli一起安装的，只要安装了babel-cli就会自带babel-node。
在命令行输入babel-node会启动一个REPL（Read-Eval-Print-Loop），这是一个支持ES6的js执行环境。

![测试babel-node](//file.shenfq.com/17-10-17/40708997.jpg)

其实不用babel-node，直接在node下，只要node版本大于6大部分ES6语法已经支持，况且现在node的版本已经到了8.7.0。

![node环境箭头函数测试](//file.shenfq.com/17-10-17/67395028.jpg)

babel-node还能直接用来执行js脚本，与直接使用node命令类似，只是会在执行过程中进行babel的转译，并且babel官方不建议在生产环境直接这样使用，因为babel实时编译产生的代码会缓存在内存中，导致内存占用过高，所以我们了解了解就好。

```shell
babel-node script.js
```
##### 4、[babel-register](http://babeljs.io/docs/usage/babel-register/)
babel-register字面意思能看出来，这是babel的一个注册器，它在底层改写了node的require方法，引入babel-register之后所有require并以.es6, .es, .jsx 和 .js为后缀的模块都会经过babel的转译。

同样通过箭头函数做个实验：

```javascript
//test.js
const name = 'shenfq';
module.exports = () => {
    const json = {name};
    return json;
};
//main.js
require('babel-register');
var test = require('./test.js');  //test.js中的es6语法将被转译成es5

console.log(test.toString()); //通过toString方法，看看控制台输出的函数是否被转译
```

![register转译](//file.shenfq.com/17-10-17/66788446.jpg)

默认babel-register会忽略对node_modules目录下模块的转译，如果要开启可以进行如下配置。

```javascript
require("babel-register")({
  ignore: false
});
```


babel-register与babel-core会同时安装，在babel-core中会有一个register.js文件，所以引入babel-register有两种方法：

```javascript
require('babel-core/register');
require('babel-register');
```

但是官方不推荐第一种方法，因为babel-register已经独立成了一个模块，在babel-core的register.js文件中有如下注释。

> TODO: eventually deprecate this console.trace("use the `babel-register` package instead of `babel-core/register`");

##### 5、[babel-polyfill](http://babeljs.io/docs/usage/babel-register/)
polyfill这个单词翻译成中文是`垫片`的意思，详细点解释就是桌子的桌脚有一边矮一点，拿一个东西把桌子垫平。polyfill在代码中的作用主要是用已经存在的语法和api实现一些浏览器还没有实现的api，对浏览器的一些缺陷做一些修补。例如Array新增了includes方法，我想使用，但是低版本的浏览器上没有，我就得做兼容处理：

```javascript
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
} 
```
上面简单的提供了一个includes方法的polyfill，代码来自[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)。

理解polyfill的意思之后，再来说说babel为什么存在polyfill。因为babel的转译只是语法层次的转译，例如箭头函数、解构赋值、class，对一些新增api以及全局函数（例如：Promise）无法进行转译，这个时候就需要在代码中引入babel-polyfill，让代码完美支持ES6+环境。前面介绍的babel-node就会自动在代码中引入babel-polyfill包。

引入方法：

```javascript
//在代码的最顶部进行require或者import

require("babel-polyfill");

import "babel-polyfill";

//如果使用webpack，也可以在文件入口数组引入
module.exports = {
  entry: ["babel-polyfill", "./app/js"]
};
```

但很多时候我们并不会使用所有ES6+语法，全局添加所有垫片肯定会让我们的代码量上升，之后会介绍其他添加垫片的方式。



---

#### .babelrc

前面已经介绍了babel常用的一些模块，接下来看看babel的配置文件 `.babelrc`。

后面的后缀rc来自linux中，使用过linux就知道linux中很多rc结尾的文件，比如`.bashrc`，rc是`run command`的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。

babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从`package.json`文件的babel属性中读取配置。

##### plugins
先简单介绍下 plugins ，babel中的插件，通过配置不同的插件才能告诉babel，我们的代码中有哪些是需要转译的。

这里有一个babel官网的[插件列表](http://babeljs.io/docs/plugins/)，里面有目前babel支持的全部插件。

举个例子：

```javascript
{
    "plugins": [
        "transform-es2015-arrow-functions", //转译箭头函数
        "transform-es2015-classes", //转译class语法
        "transform-es2015-spread", //转译数组解构
        "transform-es2015-for-of" //转译for-of
    ]
}
//如果要为某个插件添加配置项，按如下写法：
{
    "plugins":[
        //改为数组，第二个元素为配置项
        ["transform-es2015-arrow-functions", { "spec": true }]
    ]
}
```

上面这些都只是语法层次的转译，前面说过有些api层次的东西需要引入polyfill，同样babel也有一系列插件来支持这些。

```javascript
{
    "plugins":[
        //如果我们在代码中使用Object.assign方法，就用如下插件
        "transform-object-assign"
    ]
}

//写了一个使用Object.assign的代码如下：
const people = Object.assign({}, {
    name: 'shenfq'
});
//经过babel转译后如下：
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const people = _extends({}, {
    name: 'shenfq'
});
```

这种通过transform添加的polyfill只会引入到当前模块中，试想实际开发中存在多个模块使用同一个api，每个模块都引入相同的polyfill，大量重复的代码出现在项目中，这肯定是一种灾难。另外一个个的引入需要polyfill的transform挺麻烦的，而且不能保证手动引入的transform一定正确，等会会提供一个解决方案：`transform-runtime`。

除了添加polyfill，babel还有一个工具包helpers，如果你有安装babel-cli，你可以直接通过下面的命令把这个工具包输出：

```shell
./node_modules/.bin/babel-external-helpers > helpers.js
```

这个工具包类似于babel的utils模块，就像我们项目中的utils一样，很多地方都会用到，例如babel实现Object.assign就是使用的helpers中的_extend方法。为了避免同一个文件多次引用babel的助手函数，通过`external-helpers`插件，能够把这些助手函数抽出放到文件顶部，避免多次引用。

```javascript
//安装： cnpm install --save-dev babel-plugin-external-helpers

//配置
{
  "plugins": ["external-helpers"]
}
```

虽然这个插件能避免一个文件多次引用助手函数，但是并不能直接避免多个文件内重复引用，这与前面说到的通过transform添加polyfill是一样的问题，这些引用都只是module级别的，在打包工具盛行的今天，需要考虑如何减少多个模块重复引用相同代码造成代码冗余。

当然也可以在每个需要使用helpers的js文件顶部直接引入之前生成的helpers文件既可，通过打包工具将这个公共模块进行抽离。

```javascript
require('helpers');
```


在说完babel的helpers之后就到了插件系统的最后的一个插件：`transform-runtime`。前面在transform-polyfill的时候也有提到这个插件，之所以把它放到helpers后面是因为这个插件能自动为项目引入polyfill和helpers。

```shell
cnpm install -D babel-plugin-transform-runtime babel-runtime
```

transform-runtime这个插件依赖于babel-runtime，所以安装transform-runtime的同时最好也安装babel-runtime，为了防止一些不必要的错误。babel-runtime由三个部分组成：
1. [core-js](https://github.com/zloirock/core-js)
    > core-js极其强悍，通过ES3实现了大部分的ES5、6、7的垫片，作者zloirock是来自战斗名族的程序员，一个人维护着core-js，听说他最近还在找工作，上面是core-js的github地址，感兴趣可以去看看。
2. [regenerator](http://facebook.github.io/regenerator/)
    > regenerator来自facebook的一个库，用于实现 generator functions。
3. helpers
    > babel的一些工具函数，没错，这个helpers和前面使用babel-external-helpers生成的helpers是同一个东西

从babel-runtime的package.json文件中也能看出，runtime依赖了哪些东西。

![babel-runtime的package.json](//file.shenfq.com/17-10-22/66492657.jpg)

安装有babel-runtime之后要引入helpers可以使用如下方式：

```javascript
require('babel-runtime/helpers');
```

使用runtime的时候还有一些配置项：

```javascript
{
    "plugins": [
        ["transform-runtime", {
            "helpers": false, //自动引入helpers
            "polyfill": false, //自动引入polyfill（core-js提供的polyfill）
            "regenerator": true, //自动引入regenerator
        }]
    ]
}
```

**比较transform-runtime与babel-polyfill引入垫片的差异：**

1. 使用runtime是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，不需要再手动一个个的去配置plugins，只是引入的polyfill不是全局性的，有些局限性。而且runtime引入的polyfill不会改写一些实例方法，比如Object和Array原型链上的方法，像前面提到的`Array.protype.includes`。
2. babel-polyfill就能解决runtime的那些问题，它的垫片是全局的，而且全能，基本上ES6中要用到的polyfill在babel-polyfill中都有，它提供了一个完整的ES6+的环境。babel官方建议只要不在意babel-polyfill的体积，最好进行全局引入，因为这是最稳妥的方式。
3. 一般的建议是开发一些框架或者库的时候使用不会污染全局作用域的babel-runtime，而开发web应用的时候可以全局引入babel-polyfill避免一些不必要的错误，而且大型web应用中全局引入babel-polyfill可能还会减少你打包后的文件体积（相比起各个模块引入重复的polyfill来说）。


---

##### presets

显然这样一个一个配置插件会非常的麻烦，为了方便，babel为我们提供了一个配置项叫做persets（预设）。

预设就是一系列插件的集合，就好像修图一样，把上次修图的一些参数保存为一个预设，下次就能直接使用。

如果要转译ES6语法，只要按如下方式配置即可：

```javascript
//先安装ES6相关preset： cnpm install -D babel-preset-es2015
{
    "presets": ["es2015"]
}

//如果要转译的语法不止ES6，还有各个提案阶段的语法也想体验，可以按如下方式。
//安装需要的preset： cnpm install -D babel-preset-stage-0 babel-preset-stage-1 babel-preset-stage-2 babel-preset-stage-3
{
    "presets": [
        "es2015",
        "stage-0",
        "stage-1",
        "stage-2",
        "stage-3",
    ]
}

//同样babel也能直接转译jsx语法，通过引入react的预设
//cnpm install -D babel-preset-react
{
    "presets": [
        "es2015",
        "react"
    ]
}
```

不过上面这些preset官方现在都已经不推荐了，官方**唯一推荐**preset：`babel-preset-env`。

这款preset能灵活决定加载哪些插件和polyfill，不过还是得开发者手动进行一些配置。

```javascript
// cnpm install -D babel-preset -env
{
    "presets": [
        ["env", {
            "targets": { //指定要转译到哪个环境
                //浏览器环境
                "browsers": ["last 2 versions", "safari >= 7"],
                //node环境
                "node": "6.10", //"current"  使用当前版本的node
                
            },
             //是否将ES6的模块化语法转译成其他类型
             //参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
            "modules": 'commonjs',
            //是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本
            "debug": false,
            //强制开启某些模块，默认为[]
            "include": ["transform-es2015-arrow-functions"],
            //禁用某些模块，默认为[]
            "exclude": ["transform-es2015-for-of"],
            //是否自动引入polyfill，开启此选项必须保证已经安装了babel-polyfill
            //参数：Boolean，默认为false.
            "useBuiltIns": false
        }]
    ]
}
```
关于最后一个参数`useBuiltIns`，有两点必须要注意：
1. 如果useBuiltIns为true，项目中必须引入babel-polyfill。
2. babel-polyfill只能被引入一次，如果多次引入会造成全局作用域的冲突。

做了个实验，同样的代码，只是`.babelrc`配置中一个开启了`useBuiltIns`，一个没有，两个js文件体积相差70K，[戳我看看](https://github.com/Shenfq/studyBabel/tree/master/7-babel-env)。

文件 | 大小
---  | ---
useBuiltIns.js    | 189kb
notUseBuiltIns.js | 259kb


**最后啰嗦一句**

关于polyfill还有个叫做[polyfill.io](https://polyfill.io/v2/docs/)的神器，只要在浏览器引入

> https://cdn.polyfill.io/v2/polyfill.js

服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。


---

前前后后写完这个差不多写了一个星期，查了很多资料（babel的官网和github都看了好几遍），总算憋出来了。


---


#### 参考
1. [ECMAScript 6 会重蹈 ECMAScript 4 的覆辙吗？](https://www.zhihu.com/question/24715618)
2. [Babel手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/README.md)
3. [Babel官网](http://babeljs.io/)
4. [babel-preset-env: a preset that configures Babel for you](http://2ality.com/2017/02/babel-preset-env.html)
