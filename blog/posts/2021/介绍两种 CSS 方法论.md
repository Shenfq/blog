---
title: 介绍两种 CSS 方法论
author: shenfq
date: 2021/01/05
categories:
- 前端
tags:
- CSS
- 前端
- 样式
- 组件化
- 工程化
---

# 介绍两种 CSS 方法论

## 前言

说起 CSS 命名规范，大家应该都很熟悉，或者应该听说过 [`BEM`](https://en.bem.info/) 。BEM 是由 Yandex 团队提出的一种 CSS Class 命名方法，旨在帮助开发人员创建更好的且结构一致的 CSS 模块。

BEM 将页面的类名分为`块（Block）`、`元素（Element）`、`修饰符（Modifier）`。

-  块（Block）：一个块是视觉上或者语义上的一个整体，它是一个具体且唯一的一个元素，例如，页面上的一个弹窗，或者是一个搜索框；
- 元素（Element）：一般认为是块的组成部分，元素比较用它父级的块名称做为前缀，例如，弹窗的标题、关闭按钮、确认按钮；
- 修饰符（Modifier）：修饰符表示一个具体元素的特定状态，例如，关闭按钮在鼠标没放上去和放上去的时候，呈现的两种状态。

现在用 Bootstrap 的弹窗组件，举一个更加具体的例子：

![](https://file.shenfq.com/pic/20210103214204.png)

鼠标放上去和没放上去的状态是有区别的。

![](https://file.shenfq.com/pic/20210103214329.png)

通过上面的示例可以看出，块与元素是通过`两个下划线（__）`连接的，而元素和修饰符之间是通过`两个短横线（--）`连接的。

当然，今天的文章不会着重介绍什么是 BEM，如果你之前没接触过 BEM 可以尝试去了解一下，并且多在在项目中试用几次，感受他的魅力。另外，现在网上已经有非常多的文章在介绍 BEM 了，耐心找，肯定能找到优秀的教程的。今天的文章会分享比较少人介绍的两种 CSS 方法论：SUIT CSS 和 SMACSS。

## SUIT CSS

> 官方文档：SUIT CSS命名约定([https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md))

SUIT CSS是一种基于组件开发的 CSS 的方法论，它将类名分为两种类型：`工具类`和`组件类`。

### 工具类

CSS 中有很多固定工具类，比如：左右浮动、文本截断、垂直居中……。工具类的作用是帮助程序减少一些重复代码，并提供一致的实现。

**命名规则：**`u-[sm-|md-|lg-]<工具类名>`。工具类使用 `u-` 打头，后面接类名（类名使用驼峰的方式命名），中间可以加上 `sm`、`md`、`lg` 这种响应式的规则。

**举个栗子：**

```html
<div class="u-cf">
  <!-- 左浮动 -->
  <a class="u-floatLeft" href="https://blog.shenfq.com/">
    👉看看我的博客
  </a>
  <!-- 文本截断，最大宽度200px -->
  <p class="u-textBreak u-maxWidth200">
    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」
  </p>
</div>
```

### 组件类

组件类用来描述一个个具体的组件，组件是构成一个具体应用程序的基石，所以组件的设计特别重要。

**命名规则：**`[<命名空间>-]<组件名>[-后代名][--修饰符]`，这样的命名方式，在编写 HTML 和 CSS 的时候有几个好处：

- 有助于区分组件的根元素，后代元素，以及用来修饰的类；
- 降级类名重复的几率；
- 能够让类名更具有语义化；

下面来看看命名规则的各个部分的具体作用：

#### 命名空间（可选）

命名空间是可选的，如果你希望避免自己定义的组件类名与引入的第三方样式类名发生冲突，则可以为自己的类名加上命名空间。但是，如果你们业务中不存在第三方的样式，则可以不带命名空间。

```css
.sfq-Modal{} /* 我的弹窗组件 */
.sfq-Button {} /* 我的按钮组件 */
```

#### 组件名

组件名使用大驼峰规则（首字母大写的驼峰规则，Pascal Case）来命名，使用这种方式也可以尽可能的避免出现同名样式的冲突。

```css
.Modal {}
```

```html
<div class="Modal">
  …
</div>
```

#### 组件名-后代名

组件的后代指附加在组件上的一部分，例如，弹窗组件的标题、按钮等等。后代名称使用小驼峰规则（首字母大写的驼峰规则，Camel Case）命名。

```html
<div class="Modal">
  <header class="Modal-title">
    <h2 class="Modal-titleName">欢迎关注</h2>
    <span class="Modal-closeBtn">X</span>
  </header>
  <div class="Modal-content">
    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」
  </div>
</div>
```

#### 组件名--修饰符

修饰符是一种表示组件特定状态的类名，修饰符名称同样使用小驼峰规则来命名，并且和组件名直接需要用`两个短横线（--）`进行连接，这与 BEM 表现一致。

```html
<button class="Button Button--default">点击关注「更了不起的前端」</button>
<button class="Button Button--primary">点击关注「更了不起的前端」</button>
```

### 变量名

SUIT CSS 除了定义了工具类、组件类这两种命名方式外，还有定义了 CSS 变量的命名方式。**命名规则：** `--组件名[-后代名|--修饰符]-(CSS属性|变量名)`。

```css
:root {
  /* 基础按钮的背景色 */
  --Button--default-backgroundColor: #909399;
  /* 主要按钮的背景色 */
  --Button--primary-backgroundColor: #409EFF;
}
```

### SUIT CSS 小结

SUIT CSS 除了定义了工具类、组件类的命名方式外，还提供了完整的基础类，以及测试套件用来检测你的 CSS 类名是否符合规范，具体使用方法可以查看[官方文档（https://github.com/suitcss/suit）](https://github.com/suitcss/suit)。SUIT CSS 可以说在 BEM 的基础上进行了改进，特别是去除了双下划线的设计，在观感上就比 BEM 美观了许多，而且各种名称都是通过驼峰的方式命名，省略了部分短横线，这让 SUIT CSS 的类名的长度上也会比 BEM 更加精简。

## SMACSS

> SMACSS 官网：[http://smacss.com/](http://smacss.com/)

SMACSS （Scalable and Modular Architecture for CSS）是一套易开发，易维护的 CSS 编写的方法论，它将 CSS 规则一共分为五大类：

1. Base（基础）
2. Layout（布局）
3. Module（模块）
4. State（状态）
5. Theme（主题）

你应该能在你现有项目的样式里发现上面的五个分类，这几种类型的样式混合在一起会让你的代码显得特别复杂，如果你有意识将这些样式归类，将大大降低复杂度。除了将样式归类之外，每个类别还有一些适用的准则。

### 基础规则

基础规则作用于元素选择器，用于定义 HTML 标签的默认样式。基础样式主要用于设置标题大小，默认链接颜色，默认字体样式以及`body`背景等。

```css
/* 基础样式示例 */
body, form {
    margin: 0;
    padding: 0;
}

a {
    color: #039;
}

a:hover {
    color: #03F;    
}
```

### 布局规则

CSS 的本质上来说就是布局页面中的元素的，但是，页面各个元素也是有主次之分的。例如，头部、尾部这种大的区块就是主要组件，我们称之为布局（Layout）。而导航栏（属于头部），网站说明（属于尾部）这种区块为次要组件，我们称之为模块（Module）。

下面举个具体的案例，来看看掘金的页面布局：

![juejin.cn](https://file.shenfq.com/pic/20210105110758.png)

页面上有一个头部，一个导航条，一个内容区域以及一个侧边栏，这些都属于布局的部分。

![image-20210105111358246](https://file.shenfq.com/pic/20210105111358.png)

SMACSS 中允许在布局样式中，使用 ID 选择器，有助于在 HTML 中一眼区分出节点在布局中的位置。其他的非 ID 选择器的类，需要添加 `l-` 前缀，表示这属于布局样式。

```html
<div id="header"></div>
<div id="navigation"></div>
<div id="content" class="l-left"></div>
<div id="sidebar" class="l-right"></div>
```

### 模块规则

前面提到过模块，模块是相对与布局组件来说，更加松散的次要组件，这个区分确实比较模糊，所以有一些方案也取消了布局规则，将所有可重用组件都划分为模块。

模块规则在官方文档没有详细的命名风格，我看了很多文章，在命名模块的时候基本都是在参考 BEM，所以这里不再单独介绍。

### 状态规则

状态是用来描述模块在不同状态下的外观，使用 `is-` 前缀，这有助于我们在 HTML 中区分元素的状态。

```html
<header id="header">
  <ul class="nav">
		<!-- 表示被选中 -->
    <li class="nav--item is-selected">欢迎关注</li>
    <li class="nav--item">欢迎关注</li>
  </ul>
</header>
```

某些状态优先级比较高，可以酌情加上 `!important`，例如用来控制元素显示或隐藏的。

```css
.is-hide {
    display: none !important;
}
.is-show {
    display: block !important;
}
```

### SMACSS 小结

这里没有特别介绍主题规则，因为主题在当前这个时间，基本已经被 CSS 变量所替代。SMACSS 有很多的规则这里没有详细列出来，但是在关于 CSS 如何命名方面的规则其实比较少，而且它的布局规则与模块规则确实有些模糊，不太好区分。

