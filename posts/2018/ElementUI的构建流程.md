---
title: ElementUI的构建流程
author: shenfq
date: 2018/09/17
categories:
- 前端
tags:
- 前端
- 组件化
- 工程化
---


## 背景

最近一直在着手做一个与业务强相关的组件库，一直在思考要从哪里下手，怎么来设计这个组件库，因为业务上一直在使用ElementUI（以下简称Element），于是想参考了一下Element组件库的设计，看看Element构建方式，并且总结成了这篇文章。

![logo](https://file.shenfq.com/18-9-14/48784910.jpg)


<!-- more -->

## Element的目录结构

废话不多说，先看看目录结构，从目录结构入手，一步步进行分解。

```
├─build // 构建相关的脚本和配置
├─examples // 用于展示Element组件的demo
├─lib // 构建后生成的文件，发布到npm包
├─packages // 组件代码
├─src // 引入组件的入口文件
├─test // 测试代码
├─Makefile // 构建文件
├─components.json // 组件列表
└─package.json
```

## 有哪些构建命令

刚打开的时候看到了一个Makefile文件，如果学过c/c++的同学对这个东西应该不陌生，当时看到后台同学发布版本时，写下了一句`make love`，把我和我的小伙伴们都惊呆了。说正紧的，makefile可以说是比较早出现在UNIX 系统中的工程化工具，通过一个简单的`make XXX`来执行一系列的编译和链接操作。不懂makefile文件的可以看这篇文章了解下：[前端入门->makefile](https://segmentfault.com/a/1190000004437816#articleHeader11)

当我们打开Element的Makefile时，发现里面的操作都是npm script的命令，我不知道为什么还要引入Makefile，直接使用`npm run xxx`就好了呀。

```
default: help

install:
	npm install
	
new:
	node build/bin/new.js $(filter-out $@,$(MAKECMDGOALS))
	
dev:
	npm run dev
	
deploy:
	@npm run deploy
	
dist: install
	npm run dist
	
pub:
	npm run pub
	
help:
	@echo "make 命令使用说明"
	@echo "make install	---  安装依赖"
	@echo "make new <component-name> [中文名]	---  创建新组件 package. 例如 'make new button 按钮'"
	@echo "make dev	---  开发模式"
	@echo "make dist	---  编译项目，生成目标文件"
	@echo "make deploy	---  部署 demo"
	@echo "make pub	---  发布到 npm 上"
	@echo "make new-lang <lang>	---  为网站添加新语言. 例如 'make new-lang fr'"
```

## 开发模式与构建入口文件

这里我们只挑选几个重要的看看。首先看到`make install`，使用的是npm进行依赖安装，但是Element实际上是使用yarn进行依赖管理，所以如果你要在本地进行Element开发的话，最好使用yarn进行依赖安装。在官方的[贡献指南](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md#%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)也有提到。

![贡献指南](https://file.shenfq.com/18-9-8/65602547.jpg)

同时在package.json文件中有个bootstrap命令就是使用yarn来安装依赖。

```
"bootstrap": "yarn || npm i",
```

安装完依赖之后，就可以进行开发了，运行`npm run dev`，可以通过webpack-dev-sever在本地运行Element官网的demo。

```
"dev": "
    npm run bootstrap && // 依赖安装
    npm run build:file && // 目标文件生成
    cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & 
    node build/bin/template.js
"

"build:file": " 
    node build/bin/iconInit.js &  // 解析icon.scss，将所有小图标的name存入examples/icon.json
    node build/bin/build-entry.js &  // 根据components.json，生成入口文件
    node build/bin/i18n.js &  // 根据examples/i18n/page.json和模板，生成不同语言的demo
    node build/bin/version.js // 生成examples/versions.json，键值对，各个大版本号对应的最新版本
"
```

在通过webpack-dev-server运行demo时，有个前置条件，就是通过`npm run build:file`生成目标文件。这里主要看下`node build/bin/build-entry.js`，这个脚本用于生成Element的入口js。先是读取根目录的components.json，这个json文件维护着Element的所有的组件名，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行import，对外暴露install方法，把所有import的组件通过`Vue.component(name, component)`方式注册为全局组件，并且把一些弹窗类的组件挂载到Vue的原型链上。具体代码如下（ps：对代码进行一些精简，具体逻辑不变）：

```javascript
var Components = require('../../components.json');
var fs = require('fs');
var render = require('json-templater/string');
var uppercamelcase = require('uppercamelcase');
var path = require('path');
var endOfLine = require('os').EOL; // 换行符

var includeComponentTemplate = [];
var installTemplate = [];
var listTemplate = [];

Object.keys(Components).forEach(name => {
  var componentName = uppercamelcase(name); //将组件名转为驼峰
  var componetPath = Components[name]
  includeComponentTemplate.push(`import ${componentName} from '.${componetPath}';`);
  
  // 这几个特殊组件不能直接注册成全局组件，需要挂载到Vue的原型链上
  if (['Loading', 'MessageBox', 'Notification', 'Message'].indexOf(componentName) === -1) {
    installTemplate.push(`  ${componentName}`);
  }

  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
});

var template = `/* Automatically generated by './build/bin/build-entry.js' */

${includeComponentTemplate.join(endOfLine)}
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
${installTemplate.join(',' + endOfLine)},
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  version: '${process.env.VERSION || require('../../package.json').version}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
${listTemplate.join(',' + endOfLine)}
};

module.exports.default = module.exports;
`;

// 写文件
fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);

```

最后生成的代码如下：

```javascript
/* Automatically generated by './build/bin/build-entry.js' */
import Button from '../packages/button/index.js';
import Table from '../packages/table/index.js';
import Form from '../packages/form/index.js';
import Row from '../packages/row/index.js';
import Col from '../packages/col/index.js';
// some others Component
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
  Button,
  Table,
  Form,
  Row,
  Menu,
  Col,
  // some others Component
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = {
  version: '2.4.6',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  Button,
  Table,
  Form,
  Row,
  Menu,
  Col,
  // some others Component
};

module.exports.default = module.exports;
```

最后有个写法需要注意：`module.exports.default = module.exports;`，这里是为了兼容ESmodule，因为es6的模块`export default xxx`，在webpack中最后会变成类似于`exports.default = xxx`的形式，而`import ElementUI from 'element-ui';`会变成`ElementUI = require('element-ui').default`的形式，为了让ESmodule识别这种commonjs的写法，就需要加上default。

exports对外暴露的install方法就是把Element组件注册会全局组件的方法。当我们使用`Vue.use`时，就会调用对外暴露的install方法。如果我们直接通过script的方式引入vue和Element，检测到Vue为全局变量时，也会调用install方法。

```html
// 使用方式1
<!-- import Vue before Element -->
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<!-- import JavaScript -->
<script src="https://unpkg.com/element-ui/lib/index.js"></script>

// 使用方式2
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI); // 此时会调用ElementUI.install()

```

在module.exports对象中，除了暴露install方法外，还把所有组件进行了对外的暴露，方便引入单个组件。

```javascript
import { Button } from 'element-ui';
Vue.use(Button);
```

但是如果你有进行按需加载，使用Element官方的babel-plugin-component插件，上面代码会转换成如下形式：

```javascript
var _button = require('element-ui/lib/button')
require('element-ui/lib/theme-chalk/button.css')

Vue.use(_button)
```

那么前面module.exports对外暴露的单组件好像也没什么用。
不过这里使用`npm run build:file`生成文件的方式是可取的，因为在实际项目中，我们每新增一个组件，只需要修改components.json文件，然后使用`npm run build:file`重新生成代码就可以了，不需要手动去修改多个文件。

在生成了入口文件的index.js之后就会运行webpack-dev-server。

```bash
webpack-dev-server --config build/webpack.demo.js
```

接下来看下webpack.demo.js的入口文件：

```javascript
// webpack.demo.js
const webpackConfig = {
  entry: './examples/entry.js',
  output: {
    path: path.resolve(process.cwd(), './examples/element-ui/'),
    publicPath: process.env.CI_ENV || '',
    filename: '[name].[hash:7].js',
    chunkFilename: isProd ? '[name].[hash:7].js' : '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      main: path.resolve(__dirname, '../src'),
      packages: path.resolve(__dirname, '../packages'),
      examples: path.resolve(__dirname, '../examples'),
      'element-ui': path.resolve(__dirname, '../')
    },
    modules: ['node_modules']
  }
  // ... some other config
}

// examples/entry.js
import Vue from 'vue';
import Element from 'main/index.js';

Vue.use(Element);
```

## 新建组件

entry.js就是直接引入的之前build:file中生成的index.js的Element的入口文件。因为这篇文章主要讲构建流程，所以不会仔细看demo的源码。下面看看Element如何新建一个组件，在Makefile可以看到使用`make new xxx`新建一个组件。。

```
new:
	node build/bin/new.js $(filter-out $@,$(MAKECMDGOALS))
```

这后面的`$(filter-out $@,$(MAKECMDGOALS))`就是把命令行输入的参数直接传输给`node build/bin/new.js`，具体细节这里不展开，还是直接看看`build/bin/new.js`的具体细节。

```javascript
// 参数校验
if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}

const path = require('path');
const fileSave = require('file-save');
const uppercamelcase = require('uppercamelcase');
// 获取命令行的参数
// e.g. node new.js input 输入框 
// process.argv表示命令行的参数数组
// 0是node，1是new.js，2和3就是后面两个参数
const componentname = process.argv[2]; // 组件名
const chineseName = process.argv[3] || componentname;
const ComponentName = uppercamelcase(componentname); // 转成驼峰表示
// 组件所在的目录文件
const PackagePath = path.resolve(__dirname, '../../packages', componentname);

// 检查components.json中是否已经存在同名组件
const componentsFile = require('../../components.json');
if (componentsFile[componentname]) {
  console.error(`${componentname} 已存在.`);
  process.exit(1);
}
// componentsFile中写入新的组件键值对
componentsFile[componentname] = `./packages/${componentname}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n');
  
const Files = [
  {
    filename: 'index.js',
    content: `index.js相关模板`
  }, 
  {
    filename: 'src/main.vue',
    content: `组件相关的模板`
  },
  // 下面三个文件是的对应的中英文api文档
  {
    filename: path.join('../../examples/docs/zh-CN', `${componentname}.md`),
    content: `## ${ComponentName} ${chineseName}`
  },
  {
    filename: path.join('../../examples/docs/en-US', `${componentname}.md`),
    content: `## ${ComponentName}`
  },
  {
    filename: path.join('../../examples/docs/es', `${componentname}.md`),
    content: `## ${ComponentName}`
  },
  
  {
    filename: path.join('../../test/unit/specs', `${componentname}.spec.js`),
    content: `组件相关测试用例的模板`
  },
  {
    filename: path.join('../../packages/theme-chalk/src', `${componentname}.scss`),
    content: `组件的样式文件`
  },
  {
    filename: path.join('../../types', `${componentname}.d.ts`),
    content: `组件的types文件，用于语法提示`
  }
];

// 生成组件必要的文件
Files.forEach(file => {
  fileSave(path.join(PackagePath, file.filename))
    .write(file.content, 'utf8')
    .end('\n');
});
```

这个脚本最终会在`components.json`写入组件相关的键值对，同时在packages目录创建对应的组件文件，并在`packages/theme-chalk/src`目录下创建一个样式文件，Element的样式是使用sass进行预编译的，所以生成是`.scss`文件。大致看下packages目录下生成的文件的模板：

```javascript
{
  filename: 'index.js',
  content: `
  import ${ComponentName} from './src/main';

  /* istanbul ignore next */
  ${ComponentName}.install = function(Vue) {
    Vue.component(${ComponentName}.name, ${ComponentName});
  };

  export default ${ComponentName};
  `
},
{
  filename: 'src/main.vue',
  content: `
  <template>
    <div class="el-${componentname}"></div>
  </template>

  <script>
    export default {
      name: 'El${ComponentName}'
    };
  </script>
  `
}
```

每个组件都会对外单独暴露一个install方法，因为Element支持按需加载。同时，每个组件名都会加上`El`前缀。，所以我们使用Element组件时，经常是这样的`el-xxx`，这符合W3C的自定义HTML标签的[规范](https://www.w3.org/TR/custom-elements/#concepts)（小写，并且包含一个短杠）。


## 打包流程

由于现代前端的复杂环境，代码写好之后并不能直接使用，被拆成模块的代码，需要通过打包工具进行打包成一个单独的js文件。并且由于各种浏览器的兼容性问题，还需要把ES6语法转译为ES5，sass、less等css预编译语言需要经过编译生成浏览器真正能够运行的css文件。所以，当我们通过`npm run new component`新建一个组件，并通过`npm run dev`在本地调试好代码后，需要把进行打包操作，才能真正发布到npm上。

这里运行`npm run dist`进行Element的打包操作，具体命令如下。

```
"dist": "
    npm run clean && 
    npm run build:file && 
    npm run lint && 
    webpack --config build/webpack.conf.js && 
    webpack --config build/webpack.common.js && 
    webpack --config build/webpack.component.js && 
    npm run build:utils && 
    npm run build:umd && 
    npm run build:theme
"
```

![流程图](https://file.shenfq.com/18-9-14/30112392.jpg)

下面一步步拆解上述流程。

#### 清理文件

```
"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage"
```

使用`npm run clean`会删除之前打包生成的文件，这里直接使用了一个node包：rimraf，类似于linux下的`rm -rf`。

#### 入口文件生成

`npm run build:file`在前面已经介绍过了，通过components.json生成入口文件。

#### 代码检查

```
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet"
```

使用ESLint对多个目录下的文件进行lint操作。

#### 文件打包

```
webpack --config build/webpack.conf.js && 
webpack --config build/webpack.common.js && 
webpack --config build/webpack.component.js && 
```

这里直接使用原生webpack进行打包操作，webpack版本为：3.7.1。在Element@2.4.0之前，使用的打包工具为[`cooking`](https://github.com/ElemeFE/cooking/blob/master/README_zh-cn.md)，但是这个工具是基于webpack2，很久没有更新（ps. 项目中能使用webpack最好使用webpack，多阅读官网的文档，虽然文档很烂，其他第三方对webpack进行包装的构建工具，很容易突然就不更新了，到时候要迁移会很麻烦）。

这三个配置文件的配置基本类似，区别在entry和output。

```javascript
// webpack.conf.js
module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    library: 'ELEMENT',
    umdNamedDefine: true
  }
}

// webpack.common.js
module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: 'element-ui.common.js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  }
}
// webpack.component.js
const Components = require('../components.json');
module.exports = {
  entry: Components,
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  }
}
```

webpack.conf.js 与 webpack.common.js打包的入口文件都是`src/index.js`，该文件通过`npm run build:file`生成。不同之处在于输出文件，两个配置生成的js都在lib目录，重点在于libraryTarget，一个是umd，一个是commonjs2。还一个 webpack.component.js 的入口文件为 components.json 中的所有组件，表示packages目录下的所有组件都会在lib文件夹下生成也单独的js文件，这些组件单独的js文件就是用来做按需加载的，如果需要哪个组件，就会单独import这个组件js。

当我们直接在代码中引入整个Element的时候，加载的是 webpack.common.js 打包生成的 element-ui.common.js 文件。因为我们引入npm包的时候，会根据package.json中的main字段来查找入口文件。

```javascript
// package.json
"main": "lib/element-ui.common.js"
```

#### 转译工具方法

```
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
```

这一部分是吧src目录下的除了index.js入口文件外的其他文件通过babel转译，然后移动到lib文件夹下。

```tree
└─src
    ├─directives
    ├─locale
    ├─mixins
    ├─transitions
    ├─popup
    └─index.js
```

在src目录下，除了index.js外，还有一些其他文件夹，这些是Element组件中经常使用的工具方法。如果你对Element的源码足够熟悉，可以直接把Element中一些工具方法拿来使用，不再需要安装其他的包。

```javascript
const date = require('element-ui/lib/utils/date')

date.format(new Date, 'HH:mm:ss')
```

#### 生成样式文件

```
"build:theme": "
  node build/bin/gen-cssfile && 
  gulp build --gulpfile packages/theme-chalk/gulpfile.js && 
  cp-cli packages/theme-chalk/lib lib/theme-chalk
"
```

这里直接使用gulp将scss文件转为css文件。

```javascript
gulp.src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(gulp.dest('./lib'));
```

最终我们引入的`element-ui/lib/theme-chalk/index.css`，其源文件只不过是把所有组件的scss文件进行import。这个index.scss是在运行gulp之前，通过`node build/bin/gen-cssfile`命令生成的，逻辑与生成js的入口文件类似，同样是遍历components.json。

![index.scss](https://file.shenfq.com/18-9-16/48946057.jpg)


## 发布流程

代码经过之前的编译，就到了发布流程，在Element中发布主要是用shell脚本实现的。Element发布一共涉及三个部分。

1. git发布
2. npm发布
3. 官网发布

```
// 新版本发布
"pub": "
    npm run bootstrap && 
    sh build/git-release.sh && 
    sh build/release.sh && 
    node build/bin/gen-indices.js && 
    sh build/deploy-faas.sh
"
```

#### git冲突检测

运行 git-release.sh 进行git冲突的检测，这里主要是检测dev分支是否冲突，因为Element是在dev分支进行开发的（这个才Element官方的开发指南也有提到），只有在最后发布时，才merge到master。

![开发指南](https://file.shenfq.com/18-9-16/41638093.jpg)

```bash
#!/usr/bin/env sh
# 切换至dev分支
git checkout dev

# 检测本地和暂存区是否还有未提交的文件
if test -n "$(git status --porcelain)"; then
  echo 'Unclean working tree. Commit or stash changes first.' >&2;
  exit 128;
fi
# 检测本地分支是否有误
if ! git fetch --quiet 2>/dev/null; then
  echo 'There was a problem fetching your branch. Run `git fetch` to see more...' >&2;
  exit 128;
fi
# 检测本地分支是否落后远程分支
if test "0" != "$(git rev-list --count --left-only @'{u}'...HEAD)"; then
  echo 'Remote history differ. Please pull changes.' >&2;
  exit 128;
fi

echo 'No conflicts.' >&2;
```

#### git发布；npm发布

检测到git在dev分支上没有冲突后，立即执行release.sh。

![发布](https://file.shenfq.com/18-9-17/55012829.jpg)

这一部分代码比较简单，可以直接在[github](https://github.com/ElemeFE/element/blob/dev/build/release.sh)上查看。上述发布流程，省略了一个部分，就是Element会将其样式也发布到[npm](https://www.npmjs.com/package/element-theme-chalk)上。

```bash
# publish theme
echo "Releasing theme-chalk $VERSION ..."
cd packages/theme-chalk
npm version $VERSION --message "[release] $VERSION"
if [[ $VERSION =~ "beta" ]]
then
  npm publish --tag beta
else
  npm publish
fi
```

如果你只想使用Element的样式，不使用它的Vue组件，你也可以直接在npm上下载他们的样式，不过一般也没人这么做吧。

```bash
npm install -S element-theme-chalk
```

#### 官网更新

这一步就不详细说了，因为不在文章想说的构建流程之列。

大致就是将静态资源生成到`examples/element-ui`目录下，然后放到`gh-pages`分支，这样就能通过github pages的方式访问。不信，你访问试试。

> [http://elemefe.github.io/element](http://elemefe.github.io/element)

同时在该分支下，写入了CNAME文件，这样访问[element.eleme.io](element.eleme.io)也能定向到element的github pages了。

```
echo element.eleme.io>>examples/element-ui/CNAME
```

![域名重定向](https://file.shenfq.com/18-9-17/84798170.jpg)


## 总结

Element的代码总体看下来，还是十分流畅的，对自己做组件化帮助很大。刚开始写这篇文章的时候，标题写着`主流组件库的构建流程`，想把Element和antd的构建流程都写出来，写完Element才发现这个坑开得好大，于是麻溜的把标题改成`Element的构建流程`。当然Element除了其构建流程，本身很多组件的实现思路也很优雅，大家感兴趣可以去看一看。
