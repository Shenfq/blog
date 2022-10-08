---
title: Web Components 上手指南
author: shenfq
date: 2021/02/23
categories:
- 前端
tags:
- Components
- Web Components
---


![Web Components](https://file.shenfq.com/pic/20210223154148.png)

现在的前端开发基本离不开 React、Vue 这两个框架的支撑，而这两个框架下面又衍生出了许多的自定义组件库：

- [Element](https://element.eleme.io/#/zh-CN)（Vue）
- [Ant Design](https://ant.design/index-cn)（React）

这些组件库的出现，让我们可以直接使用已经封装好的组件，而且在开源社区的帮助下，出现了很多的模板项目（ [vue-element-admin](https://panjiachen.github.io/vue-element-admin-site/zh/)、[Ant Design Pro](https://pro.ant.design/index-cn/) ），能让我们快速的开始一个项目。

虽然 React、Vue 为我们的组件开发提供了便利，但是这两者在组件的开发思路上，一个是自创的 JSX 语法，一个是特有的单文件模板的语法，两者的目标都是想提供一种组件的封装方法。毕竟都有其原创的东西在里面，和我们刚开始接触的 Web 基础的 HTML、CSS、JS 的方式还是有些出入的。今天介绍的就是，通过 HTML、CSS、JS 的方式来实现自定义的组件，也是目前浏览器原生提供的方案：Web Components。

## 什么是 Web Components？

Web Components 本身不是一个单独的规范，而是由一组DOM API 和 HTML 规范所组成，用于创建可复用的自定义名字的 HTML 标签，并且可以直接在你的 Web 应用中使用。 

代码的复用一直都是我们追求的目标，在 JS 中可复用的代码我们可以封装成一个函数，但是对于复杂的HTML（包括相关的样式及交互逻辑），我们一直都没有比较好的办法来进行复用。要么借助后端的模板引擎，要么借助已有框架对 DOM API 的二次封装，而 Web Components 的出现就是为了补足浏览器在这方面的能力。

## 如何使用 Web Components？

Web Components 中包含的几个规范，都已在 W3C 和 HTML 标准中进行了规范化，主要由三部分组成：

- **Custom elements（自定义元素）**：一组 JavaScript API，用来创建自定义的 HTML标签，并允许标签创建或销毁时进行一些操作；
- **Shadow DOM（影子DOM）**：一组 JavaScript API，用于将创建的 DOM Tree 插入到现有的元素中，且 DOM Tree 不能被外部修改，不用担心元素被其他地方影响；
- **HTML templates（HTML模板）**：通过 `<template>`、`<slot>` 直接在 HTML 文件中编写模板，然后通过 DOM API 获取。

### Custom elements（自定义元素） 

浏览器提供了一个方法： `customElements.define()` ， 来进行自定义标签的定义。该方法接受三个参数：

- 自定义元素的名称，一个 DOMString 标准的字符串，为了防止自定义元素的冲突，必须是一个带短横线连接的名称（`e.g. custom-tag`）。
- 定义自定义元素的一些行为，类似于 React、Vue 中的生命周期。
- 扩展参数（可选），该参数类型为一个对象，且需要包含 `extends` 属性，用于指定创建的元素继承自哪一个内置元素（`e.g. { extends: 'p' }`）。

下面通过一些例子，演示其用法，完整代码放到了 [JS Bin](https://jsbin.com/xicuxiy/edit?html,js,output) 上。

#### 创建一个新的 HTML 标签

先看看如何创建一个全新的自定义元素。

```js
class HelloUser extends HTMLElement {
  constructor() {
    // 必须调用 super 方法
    super();

    // 创建一个 div 标签
    const $box = document.createElement("p");
    let userName = "User Name";
    if (this.hasAttribute("name")) {
      // 如果存在 name 属性，读取 name 属性的值
      userName = this.getAttribute("name");
    }
    // 设置 div 标签的文本内容
    $box.innerText = `Hello ${userName}`;

    // 创建一个 shadow 节点，创建的其他元素应附着在该节点上
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild($box);
  }
}

// 定义一个名为 <hello-user /> 的元素
customElements.define("hello-user", HelloUser);
```

```html
<hello-user name="Shenfq"></hello-user>
```

这时候页面上就会生成一个 `<p>` 标签，其文本内容为：`Hello Shenfq`。这种形式的自定义元素被称为： `Autonomous custom elements`，是一个独立的元素，可以在 HTML 中直接使用。

#### 扩展已有的 HTML 标签

我们除了可以定义一个全新的 HTML 标签，还可以对已有的 HTML 标签进行扩展，例如，我们需要封装一个与 `<ul>` 标签能力类似的组件，就可以使用如下方式：

```js
class SkillList extends HTMLUListElement {
  constructor() {
    // 必须调用 super 方法
    super();

    if (
      this.hasAttribute("skills") &&
      this.getAttribute("skills").includes(',')
    ) {
      // 读取 skills 属性的值
      const skills = this.getAttribute("skills").split(',');
      skills.forEach(skill => {
        const item = document.createElement("li");
        item.innerText = skill;
        this.appendChild(item);
      })
    }
  }
}

// 对 <ul> 标签进行扩展
customElements.define("skill-list", SkillList, { extends: "ul" });
```

```html
<ul is="skill-list" skills="js,css,html"></ul>
```

对已有的标签进行扩展，需要用到 `customElements.define` 方法的第三个参数，且第二参数的类，也需要继承需要扩展标签的对应的类。使用的时候，只需要在标签加上 `is` 属性，属性值为第一个参数定义的名称。

#### 生命周期

自定义元素的生命周期比较简单，一共只提供了四个回调方法：

- `connectedCallback`：当自定义元素被插入到页面的 DOM 文档时调用。
- `disconnectedCallback`：当自定义元素从 DOM 文档中被删除时调用。
- `adoptedCallback`：当自定义元素被移动时调用。
- `attributeChangedCallback`: 当自定义元素增加、删除、修改自身属性时调用。

下面演示一下使用方法：

```js
class HelloUser extends HTMLElement {
  constructor() {
    // 必须调用 super 方法
    super();

    // 创建一个 div 标签
    const $box = document.createElement("p");
    let userName = "User Name";
    if (this.hasAttribute("name")) {
      // 如果存在 name 属性，读取 name 属性的值
      userName = this.getAttribute("name");
    }
    // 设置 div 标签的文本内容
    $box.innerText = `Hello ${userName}`;

    // 创建一个 shadow 节点，创建的其他元素应附着在该节点上
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild($box);
  }
  connectedCallback() {
    console.log('创建元素')
    // 5s 后移动元素到 iframe
    setTimeout(() => {
      const iframe = document.getElementsByTagName("iframe")[0]
      iframe.contentWindow.document.adoptNode(this)
    }, 5e3)
  }
  disconnectedCallback() {
    console.log('删除元素')
  }
  adoptedCallback() {
    console.log('移动元素')
  }
}
```

```html
<!-- 页面插入一个 iframe，将自定义元素移入其中 -->
<iframe width="0" height="0"></iframe>
<hello-user name="Shenfq"></hello-user>
```

在元素被创建后，等待 5s，然后将自定义元素移动到 iframe 文档中，这时候能看到控制台会同时出现 `删除元素`、`移动元素` 的 log。

![Console](https://file.shenfq.com/pic/20210222221823.gif)



### Shadow DOM（影子DOM）

在前面介绍自定义元素的时候，已经用到了 Shadow DOM。 Shadow DOM 的作用是让内部的元素与外部隔离，让自定义元素的结构、样式、行为不受到外部的影响。

我们可以看到前面定义的 `<hello-user>` 标签，在控制台的 Elements 内，会显示一个 `shadow-root` ，表明内部是一个 Shadow DOM。

![Shadow DOM](https://file.shenfq.com/pic/20210222222914.png)

其实 Web Components 没有提出之前，浏览器内部就有使用 Shadow DOM 进行一些内部元素的封装，例如 `<video>` 标签。我们需要现在控制台的配置中，打开 `Show user agent ashdow DOM` 开关。

![设置](https://file.shenfq.com/pic/20210223103416.gif)

然后在控制台的 Elements 内，就能看到 `<video>` 标签内其实也有一个 `shadow-root`。

![video 标签](https://file.shenfq.com/pic/20210223102821.png)

#### 创建 Shadow DOM

我们可以在任意一个节点内部创建一个 Shadow DOM，在获取元素实例后，调用 `Element.attachShadow()` 方法，就能将一个新的 `shadow-root` 附加到该元素上。

该方法接受一个对象，且只有一个 `mode` 属性，值为 `open` 或 `closed`，表示 Shadow DOM 内的节点是否能被外部获取。

```html
<div id="root"></div>
<script>
  // 获取页面的
  const $root = document.getElementById('root');
  const $p = document.createElement('p');
  $p.innerText = '创建一个 shadow 节点';
  const shadow = $root.attachShadow({mode: 'open'});
  shadow.appendChild($p);
</script>
```

![Shadow DOM](https://file.shenfq.com/pic/20210223114210.png)

#### mode 的差异

前面提到了 mode 值为 `open` 或 `closed`，主要差异就是是否可以使用 `Element.shadowRoot` 获取到 `shadow-root` 进行一些操作。

```html
<div id="root"></div>
<script>
  // 获取页面的
  const $root = document.getElementById('root');
  const $p = document.createElement('p');
  $p.innerText = '创建一个 shadow 节点';
  const shadow = $root.attachShadow({mode: 'open'});
  shadow.appendChild($p);
  console.log('is open', $div.shadowRoot);
</script>
```

![open mode](https://file.shenfq.com/pic/20210223120128.png)

```html
<div id="root"></div>
<script>
  // 获取页面的
  const $root = document.getElementById('root');
  const $p = document.createElement('p');
  $p.innerText = '创建一个 shadow 节点';
  const shadow = $root.attachShadow({mode: 'closed'});
  shadow.appendChild($p);
  console.log('is closed', $div.shadowRoot);
</script>
```

![closed mode](https://file.shenfq.com/pic/20210223120216.png)

### HTML templates（HTML模板）

前面的案例中，有个很明显的缺陷，那就是操作 DOM 还是得使用 DOM API，相比起 Vue 得模板和 React 的 JSX 效率明显更低，为了解决这个问题，在 HTML 规范中引入了 `<tempate>` 和 `<slot>` 标签。

#### 使用模板

模板简单来说就是一个普通的 HTML 标签，可以理解成一个 `div`，只是这个元素内的所以内容不会展示到界面上。

```html
<template id="helloUserTpl">
  <p class="name">Name</p>
  <a target="blank" class="blog">##</a>
</template>
```

在 JS 中，我们可以直接通过 DOM API 获取到该模板的实例，获取到实例后，一般不能直接对模板内的元素进行修改，要调用 `tpl.content.cloneNode` 进行一次拷贝，因为页面上的模板并不是一次性的，可能其他的组件也要引用。

```js
// 通过 ID 获取标签
const tplElem = document.getElementById('helloUserTpl');
const content = tplElem.content.cloneNode(true);
```

我们在获取到拷贝的模板后，就能对模板进行一些操作，然后再插入到 Shadow DOM 中。

```html
<hello-user name="Shenfq" blog="http://blog.shenfq.com" />

<script>
  class HelloUser extends HTMLElement {
    constructor() {
      // 必须调用 super 方法
      super();

      // 通过 ID 获取标签
      const tplElem = document.getElementById('helloUserTpl');
      const content = tplElem.content.cloneNode(true);

      if (this.hasAttribute('name')) {
        const $name = content.querySelector('.name');
        $name.innerText = this.getAttribute('name');
      }
      if (this.hasAttribute('blog')) {
        const $blog = content.querySelector('.blog');
        $blog.innerText = this.getAttribute('blog');
        $blog.setAttribute('href', this.getAttribute('blog'));
      }
      // 创建一个 shadow 节点，创建的其他元素应附着在该节点上
      const shadow = this.attachShadow({ mode: "closed" });
      shadow.appendChild(content);
    }
  }

  // 定义一个名为 <hello-user /> 的元素
  customElements.define("hello-user", HelloUser);
</script>
```

#### 添加样式

 `<template>` 标签中可以直接插入 `<style>` 标签在，模板内部定义样式。

```html
<template id="helloUserTpl">
  <style>
    :host {
      display: flex;
      flex-direction: column;
      width: 200px;
      padding: 20px;
      background-color: #D4D4D4;
      border-radius: 3px;
    }

    .name {
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      margin: 0;
      margin-bottom: 5px;
    }

    .email {
      font-size: 12px;
      line-height: 1;
      margin: 0;
      margin-bottom: 15px;
    }
  </style>
  <p class="name">User Name</p>
  <a target="blank" class="blog">##</a>
</template>

```

其中 `:host` 伪类用来定义 `shadow-root`的样式，也就是包裹这个模板的标签的样式。

![](https://file.shenfq.com/pic/20210223142736.png)

#### 占位元素

占位元素就是在模板中的某个位置先占据一个位置，然后在元素插入到界面上的时候，在指定这个位置应该显示什么。

```html
<template id="helloUserTpl">
  <p class="name">User Name</p>
  <a target="blank" class="blog">##</a>
  <!--占位符-->
  <slot name="desc"></slot> 
</template>

<hello-user name="Shenfq" blog="http://blog.shenfq.com">
  <p slot="desc">欢迎关注公众号：更了不起的前端</p>
</hello-user>
```

![](https://file.shenfq.com/pic/20210223145512.png)

这里用的用法与 Vue 的 slot 用法一致，不做过多的介绍。

## 总结

到这里 Web Components 的基本用法就介绍得差不多了，相比于其他的支持组件化方案的框架，使用 Web Components 有如下的优点：

- 浏览器原生支持，不需要引入额外的第三方库；
- 真正的内部私有化的 CSS，不会产生样式的冲突；
- 无需经过编译操作，即可实现的组件化方案，且与外部 DOM 隔离；

Web Components 的主要缺点就是标准可能还不太稳定，例如文章中没有提到的模板的模块化方案，就已经被废除，现在还没有正式的方案引入模板文件。而且原生的 API 虽然能用，但是就是不好用，要不然也不会出现 jQuery 这样的库来操作 DOM。好在现在也有很多基于 Web Components 实现的框架，后面还会开篇文章专门讲一讲使用 Web Components 的框架 `lit-html`、`lit-element`。

好啦，今天的文章就到这里了，希望大家能有所收获。



