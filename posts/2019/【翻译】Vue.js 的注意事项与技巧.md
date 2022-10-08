---
title: 【翻译】Vue.js 的注意事项与技巧
author: shenfq
date: 2019/03/31
categories:
- 前端
tags:
- 前端框架
- Vue.js
- 翻译
---

# 【翻译】Vue.js 的注意事项与技巧

原文链接：[Vue.js — Considerations and Tricks](https://blog.webf.zone/vue-js-considerations-and-tricks-fa7e0e4bb7bb)


![](https://file.shenfq.com/FjFxhMxwH4RWxzhXmnKlhcxjQ2Ap.png)

Vue.js 是一个很棒的框架。然而，当你开始构建一个大型 JavaScript 项目的时候，你将对 Vue.js 感到一些困惑。这些困惑并不是来自框架本身，相反 Vue.js 团队会经常调整一些重要设计策略。

相对于 React 和 Angular，Vue.js 面向一些不同水平的开发者。它更加的友好，不管是对初学者还是经验丰富的老手。它并不隐藏一些 DOM 操作，相反它与 DOM 配合的很好。

这篇文章更像是一个目录，列举了我在 Vue.js 的初学路上遇到一些问题和技巧。理解这些关键性的设计技巧，有助于我们构建大型的 Web 应用。

写这篇文章的时候是 2018 年 5 月 18 日，下面这些技巧依然是有效的。但是框架升级，或者浏览器底层或者 JS API 发生改变时，他们可能会变得不是那么有用。

> 译者注：尽管 Vue.js 3 即将到来，但是下面的技巧大部分是有用的，因为 3 的版本并不会改变一些上层 API ，最大的特性可能是底层数据 Observer 改有 proxy 实现，以及源码使用 typescript 构建。


---

## 1、为什么 Vue.js 不使用 ES Classes 的方式编写组件

如果你使用过类似于 Angular 的框架或者某些后端 OOP 语言后，那么你的第一个问题可能是：为什么不使用 Class 形式的组件？

Vue.js 的作者在 GitHub issues 中很好的回答了这个问题：
[Use standard JS classes instead of custom syntax?](https://github.com/vuejs/vue/issues/2371)

为什么不使用 Class 这里有三个很重要的原因：

1. ES Classes 不能够满足当前 Vue.js 的需求，ES Classes 标准还没有完全规范化，并且总是朝着错误的方向发展。如果 Classes 的私有属性和装饰器（当前已进入 Stage 3）稳定后，可能会有一定帮助。
2. ES Classes 只适合于那些熟悉面向对象语言的人，它对哪些不使用复杂构建工具和编译器的人不够友好。
3. 优秀的 UI 组件层次结构一般都是组件的横向组合，它并不是基于继承的层次结构。而 Classes 形式显然更擅长的是后者。


>  译者注：But，Vue.js 3.0 将支持基于 Class 的组件写法，真香。

## 2、如何构建自己的抽象组件？

如果你想构建自己的抽象组件（比如 transition、keep-alive），这是一个比构建大型 web 应用更加疯狂地想法，这里有一些关于这个问题的讨论，但是并没有什么进展。

[Any plan for docs of abstract components?](https://github.com/vuejs/vuejs.org/issues/720)

> 译者注：在 Vue.js 内部组件（transition、keep-alive）中，使用了一个 abstract 属性，用于声明抽象组件，这个属性作者并不打算开放给大家使用，所以文档也没有提及。但是如果你要使用也是可以的，那么你必须深入源码探索该属性有何作用。

但是不要害怕，如果你可以很好地理解 slots ，你就可以构建自己的抽象组件了。这里有一篇很好的博客介绍了要如何做到这一点。

[Writing Abstract Components with Vue.js](https://alligator.io/vuejs/vue-abstract-components/)

> 译者注：下面是《在 Vue.js 中构建抽象组件》的简单翻译

    抽象组件与普通组件一样，只是它不会在界面上显示任何 DOM 元素。它们只是为现有组件添加额外的行为。
    就像很多你已经熟悉的 Vue.js 的内置组件，比如：`<transition>`、`<keep-alive>`、`<slot>`。
    
    现在展示一个案例，如何跟踪一个 DOM 已经进入了可视区域 ，让我们使用 IntersectionObserver API 来实现一个解决这个问题的抽象组件。
    （完整代码在这里：[vue-intersect](https://github.com/heavyy/vue-intersect)）


```javascript
// IntersectionObserver.vue
export default {
  // 在 Vue 中启用抽象组件
  // 此属性不在官方文档中， 可能随时发生更改，但是我们的组件必须使用它
  abstract: true,
  // 重新实现一个 render 函数
  render() {
    // 我们不需要任何包裹的元素，只需要返回子组件即可
    try {
      return this.$slots.default[0];
    } catch (e) {
      throw new Error('IntersectionObserver.vue can only render one, and exactly one child component.');
    }

    return null;
  },
  mounted () {
    // 创建一个 IntersectionObserver 实例
    this.observer = new IntersectionObserver((entries) => {
      this.$emit(entries[0].isIntersecting ? 'intersect-enter' : 'intersect-leave', [entries[0]]);
    });

    // 需要等待下一个事件队列，保证子元素已经渲染
    this.$nextTick(() => {
      this.observer.observe(this.$slots.default[0].elm);
    });
  },
  destroyed() {
    // 确保组件移除时，IntersectionObserver 实例也会停止监听
    this.observer.disconnect();
  }
}
```

    让我们看看如何使用它？
    
```html
<intersection-observer @intersect-enter="handleEnter" @intersect-leave="handleLeave">
  <my-honest-to-goodness-component></my-honest-to-goodness-component>
</intersection-observer>
```


但是在这样做之前，请你三思。我们一般依赖 mixins 和一些纯函数来解决一些特殊场景的问题，你可以将 mixins 直接看做一个抽象组件。

[How do I extend another VueJS component in a single-file component? (ES6 vue-loader)](https://stackoverflow.com/questions/35964116/how-do-i-extend-another-vuejs-component-in-a-single-file-component-es6-vue-loa/35964246#35964246)


## 3、我不太喜欢 Vue.js 的单文件组件，我更希望 HTML、CSS 和 JavaScript 分离。

没有人阻止你这样做，如果你是个注重分离的哲学家，喜欢把不同的东西放在不同文件，或者讨厌编辑器对 `.vue` 文件的不稳定行为，那么你这么做也是可以的。你要做的很简单：

```html
<!--https://vuejs.org/v2/guide/single-file-components.html -->
<!-- my-component.vue -->
<template src="./my-component.html"></template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

这么做，就会出现下一个问题：**我的组件总是需要 4 个文件（vue + html + css + js）吗？我能不能摆脱 `.vue` 文件？** 答案是肯定的，你可以使用 [`vue-template-loader`](https://github.com/ktsn/vue-template-loader)。

我的同事还为此写了一篇很棒的教程：

[Using vue-template-loader with Vue.js to Compile HTML Templates](https://alligator.io/vuejs/vue-template-loader/)

## 4、 函数式组件

感谢 React.js 让函数式组件很流行，这是因为他们无状态、易于测试。然而它们也存在一些问题。

> 译者注：不了解 Vue.js 函数式组件的可以先在官方文档查看：[官方文档](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)

### 4.1 为什么我不能对功能组件使用基于 Class 的 @Component 装饰器？

再次回到 Classes，它只是一种用于保存本地状态的数据结构。如果函数式组件是无状态的，那么使用 @Component 装饰器就是无意义的。

这里有关于这个的讨论：

[How to create functional component in @Component?](https://github.com/vuejs/vue-class-component/issues/120)

### 4.2 外部类和样式不应用于函数式组件

函数式组件不能像普通组件那样，绑定具体的类和样式，必须在 render 函数中手动应用这些绑定。

[DOM class attribute not rendered properly with functional components](https://github.com/vuejs/vue-loader/issues/1014)

[class attribute ignored on functional components](https://github.com/vuejs/vue/issues/7554)

### 4.3 函数式组件总是会重复渲染？

> TLDR：在函数式组件中使用有状态组件时务必要小心

[Functional components are re-rendered when props are unchanged.](https://github.com/vuejs/vue/issues/4037)

函数式组件相当于直接调用组件的 Render 函数，这意味着你应该：

> 避免在 render 函数中直接使用有状态组件，因为这会在每次调用 render 函数时创建不同的组件实例。

**如果函数式组件是叶子组件，会更好地利用它们。** 需要注意的是，同样的行为也适用于 React.js。

### 4.4 如何在Vue.js 函数式组件中触发一个事件？

在从函数式组件中触发一个事件并不简单。不幸的是，文档中也没有提到这一点。函数式组件中不可用 `$emit` 方法。stack overflow 上有人讨论过这个问题:

[How to emit an event from Vue.js Functional component?](https://stackoverflow.com/questions/50288996/how-to-emit-an-event-from-vue-js-functional-component)


## 5、Vue.js 的透明包裹组件

组件包裹一些DOM元素，并且公开了这些DOM元素的事件，而不是根DOM的节点实例。

例如：

```html
<!-- Wrapper component for input -->
<template>
    <div class="wrapper-comp">
        <label>My Label</label>
        <input @focus="$emit('focus')" type="text"/>
    </div>
</template>
```

这里我们真正感兴趣的是 `input` 节点，而不是 `div` 根节点，因为它主要是为了样式和修饰而添加的。用户可能对这个组件的几个输入事件感兴趣，比如 `blur`、`focus`、`click`、`hover`等等。这意味着我们必须重新绑定每个事件。我们的组件如下所示。

```html
<!-- Wrapper component for input -->
<template>
    <div class="wrapper-comp">
        <label>My Label</label>
        <input type="text"
            @focus="$emit('focus')"
            @click="$emit('click')"
            @blur="$emit('blur')"
            @hover="$emit('hover')"
        />
    </div>
</template>
```

实际上这是完全没必要的。简单的解决方案是使用 Vue 实例上的属性 `vm.$listeners` 将事件重新绑定到所需DOM 元素上：

```html
<!-- Notice the use of $listeners -->
<template>
    <div class="wrapper-comp">
        <label>My Label</label>
        <input v-on="$listeners" type="text"/>
    </div>
</template>
<!-- Uses: @focus event will bind to internal input element -->
<custom-input @focus="onFocus"></custom-input>
```


## 6、为什么你不能在 slot 上绑定和触发事件

我经常看到有些开发人员，在 slot 上进行事件的监听和分发，这是不可能的。

组件的 slot 由调用它的父组件提供，这意味着所有事件都应该与父组件相关联。尝试去倾听这些变化意味着你的父子组件是紧密耦合的，不过有另一种方法可以做到这一点，Evan You解释得很好:

[Is it possible to emit event from component inside slot  #4332](https://github.com/vuejs/vue/issues/4332#issuecomment-263444492)

[Suggestion: v-on on slots](https://github.com/vuejs/vue/issues/4781)

## 7、slot 中的 slot（访问孙辈slot）

在某些时候，可能会遇到这种情况。假设有一个组件，比如 A ，它接受一些 slot 。遵循组合的原则，使用组件 A 构建另一个组件 B 。然后你把 B 用在 C 中。

> 那么现在问题来了： 如何将 slot 从 C 组件传递到 A 组件?

要回答这个问题，首先取决你使用何种方式构建组件？ 如果你是用 render 函数，那就很简单。你只需要在组件 B 的 render 函数中进行如下操作：

```javascript
// Render function for component B
function render(h) {
    return h('component-a', {
        // Passing slots as they are to component A
        scopedSlot: this.$scopedSlots
    }
}
```

但是，如果你使用的是基于模板的方式，那么就有些糟糕了。幸运的是，在这个问题上有了进展：

[feat(core): support passing down scopedSlots with v-bind](https://github.com/vuejs/vue/pull/7765)


---

希望这篇文章让你对 Vue.js 的设计思路有了更深入的了解，并为你提供了一些在高级场景中的技巧。
