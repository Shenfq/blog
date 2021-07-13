---
title: 我不知道的CSS - position
author: shenfq
date: 2021/07/13
categories:
- 前端
tags:
- CSS
- Sticky
- Postion
---

# 我不知道的CSS - position

熟悉我的小伙伴可能知道，我最近回长沙工作了，由于之前大部分时间在做工具，Node.js 的开发比较多。but，现在又重新开始写了一些业务代码，发现 CSS 有很多博大精深的东西，所以，今天的文章复习一下 CSS 定位相关的东西。

## 定位的类型

在最新的 CSS 规范中，定位的元素一共分为四种类型：

- `relative`：相对定位元素

- `absolute`：绝对定位元素

- `fixed`：固定定位元素

- `sticky`：粘性定位元素

如果元素没有设置 `position` 属性，默认为 `static` ，其所有定位相关的属性（`top`/`bottom`/`left`/`right`/`z-index`）就会失效。

![](https://file.shenfq.com/pic/20210706111122.png)

在不修改 `position` 属性的情况下，冒然给它设置 `top`、`left `等属性，会发现它岿然不动。

![](https://file.shenfq.com/pic/20210706111306.png)

## 相对定位

相对定位是指元素在原来的位置上，进行一定的偏移，具体偏移到哪里，还是得看 `top`/`bottom`/`left`/`right` 这四个属性的值。

下面给一个元素设置为相对定位（`position: relative;`），然后让元素距离顶部和左边都为 `30px`。

```html
<style>
  div {
    width: 200px;
    height: 200px;
    background: steelblue;
  }
  .relative {
    position: relative;
    top: 30px;
    left: 30px;
  }
</style>
<body>
  <div class="relative"></div>
<body/>
```

下面的图片就是元素没有加上 `.releativ`和加上 `.releative` 的区别。

![](https://file.shenfq.com/pic/20210712175922.png)

元素在绝对定位的时候，其初始位置会被保留下来，也就是原来的位置上会留白。

```css
div {
  display: inline-block;
  width: 200px;
  height: 200px;
}
.box1 {
  background: red;
}
.box2 {
  background: yellow;
}
.box3 {
  background: blue;
}
.relative {
  position: relative;
  top: 30px;
  left: 30px;
}
```

先为元素定义好样式，在三个元素都没有进行偏移时，如下所示：

```html
<body>
  <div class="box1"></div>
  <div class="box2"></div>
  <div class="box3"></div>
<body/>
```

![](https://file.shenfq.com/pic/20210712181038.png)

如果给第二个元素加上相对定位，第二个元素就会向右边和下边进行偏移，同时在原始的位置会空出来一块。

```html
<body>
  <div class="box1"></div>
  <div class="box2 relative"></div>
  <div class="box3"></div>
<body/>
```

![](https://file.shenfq.com/pic/20210712181312.png)

## 绝对定位

绝对定位不会相对于原来的位置定位，而是会向上查找，找到一个非 `static` 的祖先元素进行定位，如果一直到 `body` 都没有非 `static` 的元素，则会相对于 `body` 来进行定位。

```html
<style>
  body { /* 清理body默认样式 */
    margin: 0;
    padding: 0;
  }
  .box {
    margin: 30px;
    display: inline-block;
    width: 300px;
    height: 300px;
  }
  .box1 {
    position: relative;
    border: 3px solid red;
  }
  .box2 {
    border: 3px solid yellow;
  }
  .box3 {
    border: 3px solid blue;
  }

  .absolute {
    /*
    position: absolute;
    top: 30px;
    left: 30px;
    */
    width: 100px;
    height: 100px;
    background-color: aquamarine;
  }
</style>
<body>
  <div class="box box1">
    <div class="box box2">
      <div class="box box3">
        <div class="absolute"></div>
      </div>
    </div>
  </div>
</body>
```

![](https://file.shenfq.com/pic/20210713094458.png)

在未给最内部的 div 设置 position 属性时，它是紧挨着 `div.box3` 的边框的。下面我们给内部的 div 加上 `position: absolute;` ，让其进行绝对定位。

```css
.absolute {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 100px;
  height: 100px;
  background-color: aquamarine;
}
```

![](https://file.shenfq.com/pic/20210713105842.png)

由于外面三层的 `div.box` 都是默认的 `static` 状态，所以绝对定位的元素会相对于 `body` 进行定位，距离 `body` 的顶部和左边 `30px`。

现在，给 `div.box2` 加上一个相对定位，此时的绝对定位元素就会相对于 `div.box2` 来进行定位。

```css
.box2 {
  position: relative;
  border: 3px solid yellow;
}
```

![](https://file.shenfq.com/pic/20210713110058.png)

绝对定位除了定位的元素不同，它的初始位置也不会被保留，相当于脱离了文档流。这里我们可以用之前相对定位的案例，布局三个 div，让中间的 div 进行绝对定位。

```html
<style>
  div {
    display: inline-block;
    width: 200px;
    height: 200px;
  }
  .box1 {
    background: red;
  }
  .box2 {
    background: yellow;
  }
  .box3 {
    background: blue;
  }

  .absolute {
    position: absolute;
    top: 30px;
    left: 30px;
  }
</style>
<body>
  <div class="box1"></div>
  <div class="box2 absolute"></div>
  <div class="box3"></div>
</body>
```

![](https://file.shenfq.com/pic/20210713110633.png)

可以看到，中间的 div 会相对于 `body` 进行定位，同时，它原来的位置也不会被保留。

## 固定定位

理解了相对定位和绝对定位，固定定位就比较好理解了。固定定位会相对于视窗进行定位，而且和绝对定位一样也会脱离文档流。这里写一个简单的例子：

```html
<style>
  .box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    margin: 100px;
  }

  .fixed {
    position: fixed;
    top: 30px;
    left: 30px;
    width: 100px;
    height: 100px;
    background-color: cadetblue;
  }
</style>
<body>
  <div class="box">
    <div class="fixed"></div>
  </div>
</body>
```

![](https://file.shenfq.com/pic/20210713143326.png)



## 粘性定位

前面的内容都是复习，这个粘性定位确实是最近刚刚接触的🤪，没办法 CSS 太菜了。

粘性定位可以理解为相对定位和固定定位的缝合，会出现这个属性主要是现在很多 H5 页面都会有这种在顶部固定的导航栏，看来 W3C 也是能看到我们普通开发者的需求的。

```css
.sticky {
  position: sticky;
  top: 0;
  margin-top: 50px;
}
```

当我们给一个元素设置为粘性定位时，如果设置了 `top: 0;`，粘性定位的元素在它距离视窗顶部大于 0 的时候，会按照默认布局来，也就是和相对定位表现一致。一旦其距离顶部的距离等于 0，这元素会固定在窗口的这个地方，此时的表现和固定布局表现一致。

具体的效果如下：

![](https://file.shenfq.com/pic/20210713150545.gif)



有了这个属性就可以少些很多 JavaScript 代码了，通过几行 CSS 就能实现一起需要引入一个插件才能实现的功能。原来现在的 CSS 已经这么厉害了。



最近更新公众号的频率明显下降，而且内容也越来越水了，之前写的 Go 笔记也没什么深入的内容。最近因为换城市、换工作，然后也一时不知道写什么，导致质量有明显的下降，后面会慢慢恢复周更，然后会多写一点前端框架和工程化方面的东西，共勉。









