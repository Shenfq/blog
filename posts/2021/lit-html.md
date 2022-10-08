---
title: 下一代的模板引擎：lit-html
author: shenfq
date: 2021/03/31
categories:
- 前端
tags:
- 模板引擎
- Components
- Web Components
---

[前面的文章](https://mp.weixin.qq.com/s/dfPBhp8atU5QSCv55QJQfA)介绍了 Web Components 的基本用法，今天来看看基于这个原生技术，Google 二次封存的框架 lit-html。

其实早在 Google 提出 Web Components 的时候，就在此基础上发布了 [Polymer](https://github.com/Polymer/polymer) 框架。只是这个框架一直雷声大雨点小，内部似乎也对这个项目不太满意，然后他们团队又开发了两个更加现代化的框架（或者说是库？）： lit-html、lit-element，今天的文章会重点介绍  lit-html 的用法以及优势。

![](https://file.shenfq.com/pic/20210317192428.png)

## 发展历程

在讲到 lit-html 之前，我们先看看前端通过 JavaScript 操作页面，经历过的几个阶段：

![发展阶段](https://file.shenfq.com/pic/20210323154753.png)

### 原生 DOM API

最早通过 DOM API 操作页面元素，操作步骤较为繁琐，而且 JS 引擎与浏览器 DOM 对象的通信相对耗时，频繁的 DOM 操作对浏览器性能影响较大。

```js
var $box = document.getElementById('box')
var $head = document.createElement('h1')
var $content = document.createElement('div')
$head.innerText = '关注我的公众号'
$content.innerText = '打开微信搜索：『自然醒的笔记本』'
$box.append($head)
$box.append($content)
```

![](https://file.shenfq.com/pic/20210330113320.png)

### jQuery 操作 DOM

jQuery 的出现，让 DOM 操作更加便捷，内部还做了很多跨浏览器的兼容性处理，极大的提升了开发体验，并且还拥有丰富的插件体系和详细的文档。

![](https://file.shenfq.com/pic/20210329151953.jpg)

```js
var $box = $('#box')

var $head = $('<h1/>', { text: '关注我的公众号' })
var $content = $('<div/>', { text: '打开微信搜索：『自然醒的笔记本』' })

$box.append($head, $content)
```

![](https://file.shenfq.com/pic/20210330113401.png)

虽然提供了便捷的操作，由于其内部有很多兼容性代码，在性能上就大打折扣了。而且它的链式调用，让开发者写出的面条式代码也经常让人诟病（PS. 个人认为这也不能算缺点，只是有些人看不惯罢了）。

### 模板操作

『模板引擎』最早是后端 MVC 框架的 View 层，用来拼接生成 HTML 代码用的。比如，[mustache](http://mustache.github.io/) 是一个可以用于多个语言的一套模板引擎。

![mustache](https://file.shenfq.com/pic/20210329142349.png)

后来前端框架也开始捣鼓 MVC 模式，渐渐的前端也开始引入了模板的概念，让操作页面元素变得更加顺手。下面的案例，是 angluar.js 中通过指令来使用模板：

```js
var app = angular.module("box", []);

app.directive("myMessage", function (){
  return {
    template : '' +
    '<h1>关注我的公众号</h1>' +
    '<div>打开微信搜索：『自然醒的笔记本』</div>'
  }
})
```

![](https://file.shenfq.com/pic/20210330113519.png)

后来的 Vue 更是将模板与虚拟 DOM 进行了结合，更进一步的提升了 Vue 中模板的性能，但是模板也有其缺陷存在。

- 不管是什么模板引擎，在启动时，解析模板是需要花时间，这是没有办法避免的；
- 连接模板与 JavaScript 的数据比较麻烦，而且在数据更新时还需进行模板的更新；
- 各式各样的模板创造了自己的语法结构，使用不同的模板引擎，就需要重新学习一遍其语法糖，这对开发体验不是很友好；

### JSX

![GitHub - OpenJSX/logo: Logo of JSX-IR](https://file.shenfq.com/pic/20210330214946.png)

React 在官方文档中这样介绍 JSX：

> JSX，是一个 JavaScript 的语法扩展。我们建议在 React 中配合使用 JSX，JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 可能会使人联想到模板语言，但它具有 JavaScript 的全部功能。

```jsx
var title = '关注我的公众号'
var content = '打开微信搜索：『自然醒的笔记本』'

const element = <div>
  <h1>{title}</h1>
  <div>{content}</div>
</div>;

ReactDOM.render(
  element,
  document.getElementById('root')
)
```

![](https://file.shenfq.com/pic/20210330124910.png)

JSX 的出现，给前端的开发模式带来更大的想象空间，更是引入了函数式编程的思想。

```
UI = fn(state)
```

但是这也带来了一个问题，JSX 语法必须经过转义，将其处理成 `React.createElement` 的形式，这也提高了 React 的上手难度，很多新手望而却步。

## lit-html 介绍

lit-html 的出现就尽可能的规避了之前模板引擎的问题，通过现代浏览器原生的能力来构建模板。

- ES6 提供的模板字面量；
- Web Components 提供的 `<template>` 标签；

```js
// Import lit-html
import {html, render} from 'lit-html';

// Define a template
const template = (title, content) => html`
  <h1>${title}</h1>
  <div>${content}</div>
`;

// Render the template to the document
render(
  template('关注我的公众号', '打开微信搜索：『自然醒的笔记本』'),
  document.body
);
```

![](https://file.shenfq.com/pic/20210330113202.png)

### 模板语法

由于使用了原生的模板字符，可以无需转义，直接进行使用，而且和 JSX 一样也能使用 JavaScript 语法进行遍历和逻辑控制。

```js
const skillTpl = (title, skills) => html`
  <h2>${title || '技能列表' }</h2>
  <ul>
    ${skills.map(i => html`<li>${i}</li>`)}
  </ul>
`;

render(
  skillTpl('我的技能', ['Vue', 'React', 'Angluar']),
  document.body
);
```

![](https://file.shenfq.com/pic/20210329165442.png)

除了这种写法上的便利，lit-html 内部也提供了Vue 类似的事件绑定方式。

```js
const Input = (defaultValue) => html`
  name: <input value=${defaultValue} @input=${(evt) => {
    console.log(evt.target.value)
  }} />
`;

render(
  Input('input your name'),
  document.body
);
```

![](https://file.shenfq.com/pic/20210329171834.gif)

### 样式的绑定

除了使用原生模板字符串编写模板外，lit-html 天生自带的 `CSS-in-JS` 的能力。

 ```js
import {html, render} from 'lit-html';
import {styleMap} from 'lit-html/directives/style-map.js';

const skillTpl = (title, skills, highlight) => {
  const styles = {
    backgroundColor: highlight ? 'yellow' : '',
  };
  return html`
    <h2>${title || '技能列表' }</h2>
    <ul style=${styleMap(styles)}>
      ${skills.map(i => html`<li>${i}</li>`)}
    </ul>
  `
};

render(
  skillTpl('我的技能', ['Vue', 'React', 'Angluar'], true),
  document.body
);
 ```

![](https://file.shenfq.com/pic/20210329175710.png)

## 渲染流程

做为一个模板引擎，lit-html 的主要作用就是将模板渲染到页面上，相比起 React、Vue 等框架，它更加专注于渲染，下面我们看看 lit-html 的基本工作流程。

```js
// Import lit-html
import { html, render } from 'lit-html';

// Define a template
const myTemplate = (name) => html`<p>Hello ${name}</p>`;

// Render the template to the document
render(myTemplate('World'), document.body);
```

通过前面的案例也能看出，lit-html 对外常用的两个 api 是 html 和 render。

### 构造模板

html 是一个标签函数，属于 ES6 新增语法，如果不记得标签函数的用法，可以打开 [Mozilla 的文档（https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Template_literals)复习下。

```js
export const html = (strings, ...values) => {
  ……
};
```

html 标签函数会接受多个参数，第一个参数为静态字符串组成的数组，后面的参数为动态传入的表达式。我们可以写一个案例，看看传入的 html 标签函数的参数到底长什么样：

```js
const foo = '吴彦祖';
const bar = '梁朝伟';

html`<p>Hello ${foo}, I'm ${bar}</p>`;
```

![](https://file.shenfq.com/pic/20210330211014.png)

整个字符串会被动态的表达式进行切割成三部分，这个三个部分会组成一个数组，做为第一个参数传入 html 标签函数，而动态的表达式经过计算后得到的值会做为后面的参数一次传入，我们可以将 strings 和 values 打印出来看看：

![log](https://file.shenfq.com/pic/20210330211419.png)

lit-html 会将这两个参数传入 `TemplateResult` 中，进行实例化操作。

```js
export const html = (strings, ...values) => {
  return new TemplateResult(strings, values);
};
```

```js
// 生成一个随机字符
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
const nodeMarker = `<!--${marker}-->`;

export class TemplateResult {
	constructor(strings, values) {
		this.strings = strings;
		this.values = values;
	}
	getHTML() {
		const l = this.strings.length - 1;
		let html = '';
		let isCommentBinding = false;
		for (let i = 0; i < l; i++) {
			const s = this.strings[i];
			html += s + nodeMarker;
		}
		html += this.strings[l];
		return html;
	}
	getTemplateElement() {
		const template = document.createElement('template');
		let value = this.getHTML();
		template.innerHTML = value;
		return template;
	}
}
```

实例化的  `TemplateResult` 会提供一个 `getTemplateElement` 方法，该方法会创建一个 template 标签，然后会将 `getHTML` 的值传入 template 标签的 `innerHTML` 中。而 `getHTML` 方法的作用，就是在之前传入的静态字符串中间插入 HTML 注释。前面的案例中，如果调用 `getHTML` 得到的结果如下。

![](https://file.shenfq.com/pic/20210330213944.png)

### 渲染到页面

`render` 方法会接受两个参数，第一个参数为 html 标签函数返回的 `TemplateResult`，第二个参数为一个真实的 DOM 节点。

```js
export const parts = new WeakMap();
export const render = (result, container) => {
  // 先获取DOM节点之前对应的缓存
  let part = parts.get(container);
  // 如果不存在缓存，则重新创建
  if (part === undefined) {
    part = new NodePart()
    parts.set(container, part);
    part.appendInto(container);
  }
  // 将 TemplateResult 设置到 part 中
  part.setValue(result);
  // 调用 commit 进行节点的创建或更新
  part.commit();
};
```

render 阶段会先到 `parts` 里面查找之前构造过的 `part` 缓存。可以将 `part` 理解为一个节点的构造器，用来将 template 的内容渲染到真实的 DOM 节点中。

如果 `part` 缓存不存在，会先构造一个，然后调用 `appendInto` 方法，该方法会在 DOM 节点的前后插入两个注释节点，用于后续插入模板。

```js
const createMarker = () => document.createComment('');
export class NodePart {
  appendInto(container) {
    this.startNode = container.appendChild(createMarker());
    this.endNode = container.appendChild(createMarker());
  }
}
```

![](https://file.shenfq.com/pic/20210331100930.png)

然后通过 `commit` 方法创建真实的节点，并插入到两个注释节点中。下面我们看看 `commit` 方法的具体操作：

```js
export class NodePart {
  setValue(result) {
    // 将 templateResult 放入 __pendingValue 属性中
    this.__pendingValue = result;
  }
  commit() {
    const value = this.__pendingValue;
    // 依据 value 的不同类型进行不同的操作
    if (value instanceof TemplateResult) {
      // 通过 html 标签方法得到的 value
      // 肯定是 TemplateResult 类型的
      this.__commitTemplateResult(value);
    } else {
      this.__commitText(value);
    }
  }
  __commitTemplateResult(value) {
    // 调用 templateFactory 构造模板节点
    const template = templateFactory(value);
    // 如果之前已经构建过一次模板，则进行更新
    if (this.value.template === template) {
      // console.log('更新DOM', value)
      this.value.update(value.values);
    } else {
      // 通过模板节点构造模板实例
      const instance = new TemplateInstance(template);
      // 将 templateResult 中的 values 更新到模板实例中
			const fragment = instance._clone();
      instance.update(value.values);
      // 拷贝模板中的 DOM 节点，插入到页面
      this.__commitNode(fragment);
      // 模板实例放入 value 属性进行缓存，用于后续判断是否是更新操作
      this.value = instance;
    }
  }
}
```

实例化之后的模板，首先会调用 `instance._clone()` 进行一次拷贝操作，然后通过 `instance.update(value.values)` 将计算后的动态表达式插入其中。

![](https://file.shenfq.com/pic/20210331150548.png)

最后调用 `__commitNode` 将拷贝模板得到的节点插入真实的 DOM 中。

```js
export class NodePart {
  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }
  __commitNode(value) {
    this.__insert(value);
    this.value = value;
  }
}
```

![](https://file.shenfq.com/pic/20210331150955.png)

可以看到 lit-html 并没有类似 Vue、React 那种将模板或 JSX 构造成虚拟 DOM 的流程，只提供了一个轻量的 html 标签方法，将模板字符转化为 `TemplateResult`，然后用注释节点去填充动态的位置。`TemplateResult` 最终也是通过创建 `<template>` 标签，然后通过浏览器内置的 innerHTML 进行模板解析的，这个过程也是十分轻量，相当于能交给浏览器的部分全部交给浏览器来完成，包括模板创建完后的节点拷贝操作。

```js
export class TemplateInstance {
  _clone() {
    const { element } = this.template;
    const fragment = document.importNode(element.content, true);
    // 省略部分操作……
    return fragment;
  }
}
```

## 其他

lit-html 只是一个高效的模板引擎，如果要用来编写业务代码还缺少了类似 Vue、React 提供的生命周期、数据绑定等能力。为了完成这部分的能力，[Polymer](https://github.com/Polymer/polymer) 项目组还提供了另一个框架：[lit-element](https://lit-element.polymer-project.org/)，可以用来创建 WebComponents。

除了官方的 lit-element 框架，Vue 的作者还将 Vue 的响应式部分剥离，与 lit-html 进行了结合，创建了一个 [vue-lit（https://github.com/yyx990803/vue-lit）](https://github.com/yyx990803/vue-lit) 的框架，一共也就写了 70 行代码，感兴趣可以看看。

![](https://file.shenfq.com/pic/20210331152643.png)

