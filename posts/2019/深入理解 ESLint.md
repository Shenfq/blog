---
title: 深入理解 ESLint
author: shenfq
date: 2019/07/28
categories:
- 前端工程
tags:
- 前端
- 前端工程化
- 前端工具
- ESLint
- 代码格式化
---


## 前言

小沈是一个刚刚开始工作的前端实习生，第一次进行团队开发，难免有些紧张。在导师的安排下，拿到了项目的 git 权限，开始进行 clone。

```
$ git clone git@github.com:company/project.git
```

小沈开始细细品味着同事们的代码，终于在他的不懈努力下，发现了老王 2 年前写的一个 bug，跟导师报备之后，小沈开始着手修改。年轻人嘛，容易冲动，不仅修复了老王的 bug，还把这部分代码进行了重构，使用了前两天刚刚从书里学会的策略模式，去掉了一些不必要 if else 逻辑。小沈潇洒的摸了摸自己稀疏的头发，得意的准备提交代码，想着第一天刚来就秀了下自己的超强的编码能力。接下来可怕的事情发生了，代码死活不能通过 lint 工具的检测，急得他面红耳赤，赶紧跑去问导师，导师告诉他，只要按照控制台的 warning 修改代码就好。小沈反驳道，这个 lint 工具非让我去掉分号，我在学校的时候，老师就教我分号是必不可少的，没有分号的代码是不完美的。导师无奈的笑了笑，打开了小沈的实习评分表，在团队合作一项中勾选『较差』。

不服气的小沈，写了一篇博客发布到了 CSDN 上，还收获了不少阅读量。

![image](https://file.shenfq.com/20190727153755.png)

#### 问：工作第一天小沈犯了哪些错误？

1. 对不了解的业务代码进行重构，这是业务开发的大忌；
2. 没有遵守团队规范，团队开发带有太强的个人情绪；
3. 上面都是我编的，听说现在写文章开头都要编个故事。


## lint 工具简史

> 在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。    -- by wikipedia

在 JavaScript 20 多年的发展历程中，也出现过许许多多的 lint 工具，下面就来介绍下主流的三款 lint 工具。

1. JSLint
2. JSHint
3. ESLint

![image](https://file.shenfq.com/2019-7-27-15-40-6.comywsres26205WEBRESOURCE0bbfb328d288ee97233c5811224582f8)

### [JSLint](http://www.jslint.com/)


![JSLint logo](https://file.shenfq.com/20190727153752.png)

JSLint 可以说是最早出现的 JavaScript 的 lint 工具，由 Douglas Crockford (《JavaScript 语言精粹》作者) 开发。从《JavaScript 语言精粹》的笔风就能看出，Douglas 是个眼里容不得瑕疵的人，所以 JSLint 也继承了这个特色，JSLint 的所有规则都是由 Douglas 自己定义的，可以说这是一个极具 Douglas 个人风格的 lint 工具，如果你要使用它，就必须接受它所有规则。值得称赞的是，JSLint 依然在更新，而且也提供了 node 版本：[node-jslint](https://www.npmjs.com/package/jslint)。


### [JSHint](https://jshint.com/)

![JSHint logo](https://file.shenfq.com/20190727153753.png)

由于 JSLint 让很多人无法忍受它的规则，感觉受到了压迫，所以 Anton Kovalyov (现在在 Medium 工作) 基于 JSLint 开发了 JSHint。JSHint 在 JSLint 的基础上提供了丰富的配置项，给了开发者极大的自由，JSHint 一开始就保持着开源软件的风格，由社区进行驱动，发展十分迅速。早起 jQuery 也是使用 JSHint 进行代码检查的，不过现在已经转移到 ESLint 了。


### [ESLint](https://cn.eslint.org/)

![ESLint logo](https://file.shenfq.com/20190727153754.png)

ESLint 由 Nicholas C. Zakas (《JavaScript 高级程序设计》作者) 于2013年6月创建，它的出现因为 Zakas 想使用 JSHint 添加一条自定义的规则，但是发现 JSHint 不支持，于是自己开发了一个。

ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。

[早期源码](https://github.com/eslint/eslint/blob/v0.0.2/lib/jscheck.js#L70)：

```javascript
var ast = esprima.parse(text, { loc: true, range: true }),
    walk = astw(ast);

walk(function(node) {
    api.emit(node.type, node);
});

return messages;
```

但是，那个时候 ESLint 并没有大火，因为需要将源代码转成 AST，运行速度上输给了 JSHint ，并且 JSHint 当时已经有完善的生态（编辑器的支持）。真正让 ESLint 大火是因为 ES6 的出现。

ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让ESLint 成为最快支持 ES6 语法的 lint 工具。

![谷歌趋势](https://file.shenfq.com/20190727153757.png)

在 2016 年，ESLint整合了与它同时诞生的另一个 lint 工具：JSCS，因为它与 ESLint 具有异曲同工之妙，都是通过生成 AST 的方式进行规则检测。

![ESLint整合JSCS](https://file.shenfq.com/20190727153756.png)

自此，ESLint 在 JS Linter 领域一统江湖，成为前端界的主流工具。


## Lint 工具的意义

下面一起来思考一个问题：Lint 工具对工程师来说到底是代码质量的保证还是一种束缚？

然后，我们再看看 ESLint 官网的简介：

> 代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

> JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。

因为 JavaScript 这门神奇的语言，在带给我们灵活性的同时，也埋下了一些坑。比如 `==` 涉及到的弱类型转换，着实让人很苦恼，还有 `this` 的指向，也是一个让人迷惑的东西。而 Lint 工具就很好的解决了这个问题，干脆禁止你使用 `==` ，这种做法虽然限制了语言的灵活性，但是带来的收益也是可观的。

还有就是作为一门动态语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行才发现，这给我们调试工作增加了一些负担，而 Lint 工具相当于为语言增加了编译过程，在代码运行前进行静态分析找到出错的地方。

所以汇总一下，Lint工具的优势：

#### 1. 避免低级bug，找出可能发生的语法错误

> 使用未声明变量、修改 const 变量……
    
#### 2. 提示删除多余的代码

> 声明而未使用的变量、重复的 case ……

#### 3. 确保代码遵循最佳实践

> 可参考 [airbnb style](https://github.com/airbnb/javascript)、[javascript standard](https://github.com/standard/standard)

#### 4. 统一团队的代码风格

> 加不加分号？使用 tab 还是空格？


## 使用方式

说了那么多，还是来看下有点实际意义的，ESLint 到底是如何使用的。

### 初始化

如果想在现有项目中引入 ESLint，可以直接运行下面的命令：

```bash
# 全局安装 ESLint
$ npm install -g eslint

# 进入项目
$ cd ~/Code/ESLint-demo

# 初始化 package.json
$ npm init -f

# 初始化 ESLint 配置
$ eslint --init
```

![image](https://file.shenfq.com/20190727153759.png)

在使用 `eslint --init` 后，会出现很多用户配置项，具体可以参考：[eslint cli 部分的源码](https://github.com/eslint/eslint/blob/v6.0.1/lib/init/config-initializer.js#L432)。


经过一系列一问一答的环节后，你会发现在你文件夹的根目录生成了一个 `.eslintrc.js` 文件。

![image](https://file.shenfq.com/20190727153800.png)

### 配置方式

ESLint 一共有两种配置方式：

#### 1. 使用注释把 lint 规则直接嵌入到源代码中

这是最简单粗暴的方式，直接在源代码中使用 ESLint 能够识别的注释方式，进行 lint 规则的定义。

```javascript
/* eslint eqeqeq: "error" */
var num = 1
num == '1'
```

![image](https://file.shenfq.com/20190727153758.png)

当然我们一般使用注释是为了临时禁止某些严格的 lint 规则出现的警告：

```javascript
/* eslint-disable */
alert('该注释放在文件顶部，整个文件都不会出现 lint 警告')

/* eslint-enable */
alert('重新启用 lint 告警')

/* eslint-disable eqeqeq */
alert('只禁止某一个或多个规则')

/* eslint-disable-next-line */
alert('当前行禁止 lint 警告')

alert('当前行禁止 lint 警告') // eslint-disable-line
```

#### 2. 使用配置文件进行 lint 规则配置

在初始化过程中，有一个选项就是使用什么文件类型进行 lint 配置（`What format do you want your config file to be in?`）：

```
{
    type: "list",
    name: "format",
    message: "What format do you want your config file to be in?",
    default: "JavaScript",
    choices: ["JavaScript", "YAML", "JSON"]
}
```

官方一共提供了三个选项：

1. JavaScript (eslintrc.js)
2. YAML (eslintrc.yaml)
3. JSON (eslintrc.json)

另外，你也可以自己在 `package.json` 文件中添加 `eslintConfig` 字段进行配置。

翻阅 ESLint [源码](https://github.com/eslint/eslint/blob/v6.0.1/lib/cli-engine/config-array-factory.js#L52)可以看到，其配置文件的优先级如下：

```javascript
const configFilenames = [
  ".eslintrc.js",
  ".eslintrc.yaml",
  ".eslintrc.yml",
  ".eslintrc.json",
  ".eslintrc",
  "package.json"
];
```

```
.eslintrc.js > .eslintrc.yaml  > .eslintrc.yml > .eslintrc.json > .eslintrc > package.json
```


当然你也可以使用 cli 自己指定配置文件路径：

![image](https://file.shenfq.com/20190727153813.png)

#### 项目级与目录级的配置

我们有如下目录结构，此时在根目录运行 ESLint，那么我们将得到两个配置文件 `.eslintrc.js`（项目级配置） 和 `src/.eslintrc.js`（目录级配置），这两个配置文件会进行合并，但是 `src/.eslintrc.js` 具有更高的优先级。

![目录结构](https://file.shenfq.com/20190727153810.png)

但是，我们只要在 `src/.eslintrc.js` 中配置 `"root": true`，那么 ESLint 就会认为 `src` 目录为根目录，不再向上查找配置。

```javascript
{
  "root": true
}
```


### 配置参数

下面我们一起来细细品味 ESLinte 的配置规则。

#### 解析器配置

```javascript
{
  // 解析器类型
  // espima(默认), babel-eslint, @typescript-eslint/parse
  "parse": "esprima",
  // 解析器配置参数
  "parseOptions": {
    // 代码类型：script(默认), module
    "sourceType": "script",
    // es 版本号，默认为 5，也可以是用年份，比如 2015 (同 6)
    "ecamVersion": 6,
    // es 特性配置
    "ecmaFeatures": {
        "globalReturn": true, // 允许在全局作用域下使用 return 语句
        "impliedStrict": true, // 启用全局 strict mode 
        "jsx": true // 启用 JSX
    },
  }
}
```

对于 `@typescript-eslint/parse` 这个解析器，主要是为了替代之前存在的 TSLint，TS 团队因为 ESLint 生态的繁荣，且 ESLint 具有更多的配置项，不得不抛弃 TSLint 转而实现一个 ESLint 的解析器。同时，该解析器拥有[不同的配置](https://www.npmjs.com/package/@typescript-eslint/parser#configuration)：


```javascript
{
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "useJSXTextNode": true,
    "project": "./tsconfig.json",
    "tsconfigRootDir": "../../",
    "extraFileExtensions": [".vue"]
  }
}
```

#### 环境与全局变量

ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。

```javascript
{
  "globals": {
    // 声明 jQuery 对象为全局变量
    "$": false // true表示该变量为 writeable，而 false 表示 readonly
  }
}
```

在 `globals` 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 `env` ，这是对一个环境定义的一组全局变量的预设（类似于 babel 的 presets）。

```javascript
{
  "env": {
    "amd": true,
    "commonjs": true,
    "jquery": true
  }
}
```

可选的环境很多，预设值都在[这个文件](https://github.com/eslint/eslint/blob/v6.0.1/conf/environments.js)中进行定义，查看源码可以发现，其预设变量都引用自 [`globals`](https://github.com/sindresorhus/globals/blob/master/globals.json) 包。

![env](https://file.shenfq.com/20190727153811.png)

![env](https://file.shenfq.com/20190727153809.png)

### 规则设置

ESLint 附带有[大量的规则](https://cn.eslint.org/docs/rules/)，你可以在配置文件的 `rules` 属性中配置你想要的规则。每一条规则接受一个参数，参数的值如下：

- "off" 或 0：关闭规则
- "warn" 或 1：开启规则，warn 级别的错误 (不会导致程序退出)
- "error" 或 2：开启规则，error级别的错误(当被触发的时候，程序会退出)

举个例子，我们先写一段使用了平等(equality)的代码，然后对 `eqeqeq` 规则分别进行不同的配置。

```javascript
// demo.js
var num = 1
num == '1'
```

![eqeqeq 规则校验](https://file.shenfq.com/20190727153814.png)

这里使用了命令行的配置方式，如果你只想对单个文件进行某个规则的校验就可以使用这种方式。

但是，事情往往没有我们想象中那么简单，ESLint 的规则不仅只有关闭和开启这么简单，每一条规则还有自己的配置项。如果需要对某个规则进行配置，就需要使用数组形式的参数。

我们看下 `quotes` 规则，根据官网介绍，它支持字符串和对象两个配置项。

![quotes](https://file.shenfq.com/20190727153812.png)


```javascript
{
  "rules": {
    // 使用数组形式，对规则进行配置
    // 第一个参数为是否启用规则
    // 后面的参数才是规则的配置项
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true 
      }
    ]
  }
}
```

根据上面的规则：

```javascript
// bad
var str = "test 'ESLint' rule"

// good
var str = 'test "ESLint" rule'
```

### 扩展

扩展就是直接使用别人已经写好的 lint 规则，方便快捷。扩展一般支持三种类型：


```javascript
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard",
  ]
}
```

- `eslint:` 开头的是 ESLint 官方的扩展，一共有两个：[`eslint:recommended`](https://github.com/eslint/eslint/blob/v6.0.1/conf/eslint-recommended.js) 、[`eslint:all`](https://github.com/eslint/eslint/blob/master/conf/eslint-all.js)。
- `plugin:` 开头的是扩展是插件类型，也可以直接在 `plugins` 属性中进行设置，后面一节会详细讲到。
- 最后一种扩展来自 npm 包，官方规定 npm 包的扩展必须以 `eslint-config-` 开头，使用时可以省略这个头，上面案例中 `eslint-config-standard` 可以直接简写成 `standard`。

如果你觉得自己的配置十分满意，也可以将自己的 lint 配置发布到 npm 包，只要将包名命名为 `eslint-config-xxx` 即可，同时，需要在 package.json 的 peerDependencies 字段中声明你依赖的 ESLint 的版本号。

### 插件

#### 使用插件

虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。

这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 `eslint-plugin-` 开头，使用的时候也可以省略这个头。


```bash
npm install --save-dev eslint-plugin-vue eslint-plugin-react
```

```javascript
{
  "plugins": [
    "react", // eslint-plugin-react
    "vue",   // eslint-plugin-vue
  ]
}
```

或者是在扩展中引入插件，前面有提到 `plugin:` 开头的是扩展是进行插件的加载。


```javascript
{
  "extends": [
    "plugin:react/recommended",
  ]
}
```

通过扩展的方式加载插件的规则如下：


```javascript
extPlugin = `plugin:${pluginName}/${configName}`
```

对照上面的案例，插件名(pluginName) 为 react，也就是之前安装 `eslint-plugin-react` 包，配置名(configName)为 recommended。那么这个配置名又是从哪里来的呢？

可以看到 `eslint-plugin-react` 的[源码](https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L108)。

```javascript
module.exports = {
  // 自定义的 rule
  rules: allRules,
  // 可用的扩展
  configs: {
    // plugin:react/recommended
    recomended: {
      plugins: [ 'react' ]
      rules: {...}
    },
    // plugin:react/all
    all: {
      plugins: [ 'react' ]
      rules: {...}
    }
  }
}
```

配置名是插件配置的 configs 属性定义的，这里的配置其实就是 ESLint 的扩展，通过这种方式即可以加载插件，又可以加载扩展。

#### 开发插件

ESLint 官方为了方便开发者，提供了 Yeoman 的模板（generator-eslint）。

```bash
# 安装模块
npm install -g yo generator-eslint

# 创建目录
mkdir eslint-plugin-demo
cd eslint-plugin-demo

# 创建模板
yo eslint:plugin
```

![eslint:plugin](https://file.shenfq.com/2019-7-27-16-2-20)

![eslint:plugin 目录](https://file.shenfq.com/2019-7-27-16-5-24.png)

创建好项目之后，就可以开始创建一条规则了，幸运的是 generator-eslint 除了能够生成插件的模板代码外，还具有创建规则的模板代码。打开之前创建的 `eslint-plugin-demo` 文件夹，在该目录下添加一条规则，我希望这条规则能检测出我的代码里面是否有 `console` ，所以，我给该规则命名为 `disable-console`。

```bash
yo eslint:rule
```

![eslint:rule](https://file.shenfq.com/2019-7-27-16-36-30.png)

![eslint:rule 目录](https://file.shenfq.com/2019-7-27-16-38-5.png)

接下来我们看看如何来指定 ESLinte 的一个规则：

打开 `lib/rules/disable-console.js` ，可以看到默认的模板代码如下：

```javascript
module.exports = {
  meta: {
    docs: {
      description: "disable console",
      category: "Fill me in",
      recommended: false
    },
    schema: []
  },
  create: function (context) {
    // variables should be defined here
    return {
      // give me methods
    };
  }
};
```

简单的介绍下其中的参数（更详细的介绍可以查看[官方文档](https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics)）：

- meta：规则的一些描述信息
  - docs：规则的描述对象
    - descrition(string)：规则的简短描述
    - category(string)： 规则的类别（具体类别可以查看[官网](https://cn.eslint.org/docs/rules/)）
    - recommended(boolean)：是否加入 `eslint:recommended`
  - schema(array)：规则所接受的配置项
- create：返回一个对象，该对象包含 ESLint 在遍历 JavaScript 代码 AST 时，所触发的一系列事件勾子。

在详细讲解如何创建一个规则之前，我们先来谈谈 AST（抽象语法树）。ESLint 使用了一个叫做 Espree 的 JavaScript 解析器来把 JavaScript 代码解析为一个 AST 。然后深度遍历 AST，每条规则都会对匹配的过程进行监听，每当匹配到一个类型，相应的规则就会进行检查。为了方便查看 AST 的各个节点类型，这里提供一个网站能十分清晰的查看一段代码解析成 AST 之后的样子：[astexplorer](https://astexplorer.net/)。如果你想找到所有 AST 节点的类型，可以查看 [estree](https://github.com/estree/estree)。

![astexplorer](https://file.shenfq.com/2019-7-27-23-27-1.png)

![astexplorer](https://file.shenfq.com/2019-7-27-23-35-57.png)

可以看到 `console.log()` 属于 `ExpressionStatement(表达式语句)` 中的 `CallExpression(调用语句)`。

```javascript
{
  "type": "ExpressionStatement",
  "expression": {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "console"
      },
      "property": {
        "type": "Identifier",
        "name": "log"
      },
      "computed": false
    }
  }
}
```

所以，我们要判断代码中是否调用了 `console`，可以在 create 方法返回的对象中，写一个 CallExpression 方法，在 ESLint 遍历 AST 的过程中，对调用语句进行监听，然后检查该调用语句是否为 `console` 调用。

```javascript
module.exports = {
  create: function(context) {
    return {
      CallExpression(node) {
        // 获取调用语句的调用对象
        const callObj = node.callee.object
        if (!callObj) {
          return
        }
        if (callObj.name === 'console') {
          // 如果调用对象为 console，通知 ESLint
          context.report({
            node,
            message: 'error: should remove console'
          })
        }
      },
    }
  }
}
```

可以看到我们最后通过 `context.report` 方法，告诉 ESLint 这是一段有问题的代码，具体要怎么处理，就要看 ESLint 配置中，该条规则是 `[off, warn, error]` 中的哪一个了。

之前介绍规则的时候，有讲到规则是可以接受配置的，下面看看我们自己制定规则的时候，要如何接受配置项。其实很简单，只需要在 mate 对象的 schema 中定义好参数的类型，然后在 create 方法中，通过 `context.options` 获取即可。下面对 `disable-console` 进行修改，毕竟禁止所有的 console 太过严格，我们可以添加一个参数，该参数是一个数组，表示允许调用的 console 方法。

```javascript
module.exports = {
  meta: {
    docs: {
      description: "disable console", // 规则描述
      category: "Possible Errors",    // 规则类别
      recommended: false
    },
    schema: [ // 接受一个参数
      {
        type: 'array', // 接受参数类型为数组
        items: {
          type: 'string' // 数组的每一项为一个字符串
        }
      }
    ]
  },

  create: function(context) {
    const logs = [ // console 的所以方法
        "debug", "error", "info", "log", "warn", 
        "dir", "dirxml", "table", "trace", 
        "group", "groupCollapsed", "groupEnd", 
        "clear", "count", "countReset", "assert", 
        "profile", "profileEnd", 
        "time", "timeLog", "timeEnd", "timeStamp", 
        "context", "memory"
    ]
    return {
      CallExpression(node) {
         // 接受的参数
        const allowLogs = context.options[0]
        const disableLogs = Array.isArray(allowLogs)
          // 过滤掉允许调用的方法
          ? logs.filter(log => !allowLogs.includes(log))
          : logs
        const callObj = node.callee.object
        const callProp = node.callee.property
        if (!callObj || !callProp) {
          return
        }
        if (callObj.name !== 'console') {
          return
        }
        // 检测掉不允许调用的 console 方法
        if (disableLogs.includes(callProp.name)) {
          context.report({
            node,
            message: 'error: should remove console'
          })
        }
      },
    }
  }
}
```

规则写完之后，打开 `tests/rules/disable-console.js` ，编写测试用例。

```javascript
var rule = require("../../../lib/rules/disable-console")
var RuleTester = require("eslint").RuleTester

var ruleTester = new RuleTester()
ruleTester.run("disable-console", rule, {
  valid: [{
    code: "console.info(test)",
    options: [['info']]
  }],
  invalid: [{
    code: "console.log(test)",
    errors: [{ message: "error: should remove console" }]
  }]
});
```

![test](https://file.shenfq.com/2019-7-28-0-38-3.png)

最后，只需要引入插件，然后开启规则即可。

```javascript
// eslintrc.js
module.exports = {
  plugins: [ 'demo' ],
  rules: {
    'demo/disable-console': [
      'error', [ 'info' ]
    ],
  }
}
```

![use plugin demo](https://file.shenfq.com/2019-7-28-1-1-19.png)


## 最佳配置

![最佳配置](https://file.shenfq.com/20190728133740.png)

业界有许多 JavaScript 的推荐编码规范，较为出名的就是下面两个：

1. [airbnb style](https://github.com/airbnb/javascript)
2. [javascript standard](https://github.com/standard/standard)

同时这里也推荐 AlloyTeam 的 [eslint-config-alloy](https://github.com/AlloyTeam/eslint-config-alloy)。

但是代码规范这个东西，最好是团队成员之间一起来制定，确保大家都能够接受，如果实在是有人有异议，就只能少数服从多数了。虽然这节的标题叫最佳配置，但是软件行业并有没有什么方案是最佳方案，即使 javascript standard 也不是 javascript 标准的编码规范，它仅仅只是叫这个名字而已，只有适合的才是最好的。

最后安利一下，将 ESLint 和 Prettier 结合使用，不仅统一编码规范，也能统一代码风格。具体实践方式，请参考我的文章：[使用ESLint+Prettier来统一前端代码风格](https://juejin.im/post/5b27a326e51d45588a7dac57)。

## 总结

看到这里我们做一个总结，JavaScript 的 linter 工具发展历史其实也不算短，ESLint 之所以能够后来者居上，主要原因还是 JSLint 和 JSHint 采用自顶向下的方式来解析代码，并且早期 JavaScript 语法万年不更新，能这种方式够以较快的速度来解析代码，找到可能存在的语法错误和不规范的代码。但是 ES6 发布之后，JavaScript 语法发生了很多的改动，比如：箭头函数、模板字符串、扩展运算符……，这些语法的发布，导致 JSLint 和 JSHint 如果不更新解析器就没法检测 ES6 的代码。而 ESLint 另辟蹊径，采用 AST 的方式对代码进行静态分析，并保留了强大的可扩展性和灵活的配置能力。这也告诉我们，在日常的编码过程中，一定要考虑到后续的扩展能力。

正是因为这个强大扩展能力，让业界的很多 JavaScript 编码规范能够在各个团队进行快速的落地，并且团队自己定制的代码规范也可以对外共享。

最后，希望你通过上面的学习已经理解了 ESLint 带来的好处，同时掌握了 ESLint 的用法，并可以为现有的项目引入 ESLint 改善项目的代码质量。

## 参考

- [ESLint 官网](https://cn.eslint.org/)
- [JS Linter 进化史](https://zhuanlan.zhihu.com/p/34656263/)
- [ESLint 工作原理探讨](https://zhuanlan.zhihu.com/p/53680918)



