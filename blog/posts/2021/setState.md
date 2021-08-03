---
title: React 中 setState 是一个宏任务还是微任务？
author: shenfq
date: 2021/08/02
categories:
- 前端
tags:
- 前端框架
- JavaScript
- React
- 面试
---

# React 中 setState 是一个宏任务还是微任务？

最近有个朋友面试，面试官问了个奇葩的问题，也就是我写在标题上的这个问题。

![](https://file.shenfq.com/pic/20210729112816.png)

能问出这个问题，面试官应该对 React 不是很了解，也是可能是看到面试者简历里面有写过自己熟悉 React，面试官想通过这个问题来判断面试者是不是真的熟悉 React 🤣。

## 面试官的问法是否正确？

面试官的问题是，`setState` 是一个宏任务还是微任务，那么在他的认知里，`setState` 肯定是一个异步操作。为了判断 `setState` 到底是不是异步操作，可以先做一个实验，通过 CRA 新建一个 React 项目，在项目中，编辑如下代码：

```jsx
import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  state = {
    count: 1000
  }
  render() {
    return (
      <div className="App">
        <img
          src={logo} alt="logo"
          className="App-logo"
          onClick={this.handleClick}
        />
        <p>我的关注人数：{this.state.count}</p>
      </div>
    );
  }
}

export default App;
```

页面大概长这样：

![](https://file.shenfq.com/pic/20210730093700.png)

上面的 React Logo 绑定了一个点击事件，现在需要实现这个点击事件，在点击 Logo 之后，进行一次 `setState` 操作，在 set 操作完成时打印一个 log，并且在 set 操作之前，分别添加一个宏任务和微任务。代码如下：

```js
handleClick = () => {
  const fans = Math.floor(Math.random() * 10)
  setTimeout(() => {
    console.log('宏任务触发')
  })
  Promise.resolve().then(() => {
    console.log('微任务触发')
  })
  this.setState({
    count: this.state.count + fans
  }, () => {
    console.log('新增粉丝数:', fans)
  })
}
```

![](https://file.shenfq.com/pic/20210730094048.gif)

很明显，在点击 Logo 之后，先完成了 `setState` 操作，然后再是微任务的触发和宏任务的触发。所以，`setState` 的执行时机是早于微任务与宏任务的，即使这样也只能说它的执行时机早于 `Promise.then`，还不能证明它就是同步任务。

```js
handleClick = () => {
  const fans = Math.floor(Math.random() * 10)
  console.log('开始运行')
  this.setState({
    count: this.state.count + fans
  }, () => {
    console.log('新增粉丝数:', fans)
  })
  console.log('结束运行')
}
```

![](https://file.shenfq.com/pic/20210730102604.gif)

这么看，似乎 `setState` 又是一个异步的操作。主要原因是，在 React 的生命周期以及绑定的事件流中，所有的 `setState` 操作会先缓存到一个队列中，在整个事件结束后或者 mount 流程结束后，才会取出之前缓存的 `setState` 队列进行一次计算，触发 state 更新。只要我们跳出 React 的事件流或者生命周期，就能打破 React 对 `setState` 的掌控。最简单的方法，就是把 `setState` 放到 `setTimeout` 的匿名函数中。

```js
handleClick = () => {
  setTimeout(() => {
    const fans = Math.floor(Math.random() * 10)
    console.log('开始运行')
    this.setState({
      count: this.state.count + fans
    }, () => {
      console.log('新增粉丝数:', fans)
    })
    console.log('结束运行')
  })
}
```

![](https://file.shenfq.com/pic/20210730110005.gif)

所以，`setState` 就是一次同步行为，根本不存在面试官的问题。

## React 是如何控制 setState 的 ？

前面的案例中，`setState` 只有在 `setTimeout` 中才会变得像一个同步方法，这是怎么做到的？

```js
handleClick = () => {
  // 正常的操作
  this.setState({
    count: this.state.count + 1
  })
}
handleClick = () => {
  // 脱离 React 控制的操作
  setTimeout(() => {
    this.setState({
      count: this.state.count + fans
    })
  })
}
```

先回顾之前的代码，在这两个操作中，我们分别在 Performance 中记录一次调用栈，看看两者的调用栈有何区别。

![正常操作](https://file.shenfq.com/pic/20210730143435.png)

![脱离 React 控制的操作](https://file.shenfq.com/pic/20210730143455.png)

在调用栈中，可以看到 `Component.setState` 方法最终会调用`enqueueSetState` 方法 ，而 `enqueueSetState` 方法内部会调用 `scheduleUpdateOnFiber` 方法，区别就在于正常调用的时候，`scheduleUpdateOnFiber` 方法内只会调用 `ensureRootIsScheduled` ，在事件方法结束后，才会调用 `flushSyncCallbackQueue` 方法​。而脱离 React 事件流的时候，`scheduleUpdateOnFiber` 在 `ensureRootIsScheduled` 调用结束后，会直接调用 `flushSyncCallbackQueue` 方法，这个方法就是用来更新 state 并重新进行 render。

![](https://file.shenfq.com/pic/20210730144641.png)

![](https://file.shenfq.com/pic/20210730144810.png)

```js
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  if (lane === SyncLane) {
    // 同步操作
    ensureRootIsScheduled(root, eventTime);
    // 判断当前是否还在 React 事件流中
    // 如果不在，直接调用 flushSyncCallbackQueue 更新
    if (executionContext === NoContext) {
      flushSyncCallbackQueue();
    }
  } else {
    // 异步操作
  }
}
```

上述代码可以简单描述这个过程，主要是判断了 `executionContext` 是否等于 `NoContext` 来确定当前更新流程是否在 React 事件流中。 

众所周知，React 在绑定事件时，会对事件进行合成，统一绑定到 `document` 上（ `react@17` 有所改变，变成了绑定事件到 `render` 时指定的那个 DOM 元素），最后由 React 来派发。

所有的事件在触发的时候，都会先调用 `batchedEventUpdates$1` 这个方法，在这里就会修改 `executionContext` 的值，React 就知道此时的 `setState` 在自己的掌控中。

```js
// executionContext 的默认状态
var executionContext = NoContext;
function batchedEventUpdates$1(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext |= EventContext; // 修改状态
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
		// 调用结束后，调用 flushSyncCallbackQueue
    if (executionContext === NoContext) {
      flushSyncCallbackQueue();
    }
  }
}
```

![](https://file.shenfq.com/pic/20210801171209.png)

所以，不管是直接调用 `flushSyncCallbackQueue` ，还是推迟调用，这里本质上都是同步的，只是有个先后顺序的问题。

## 未来会有异步的 setState

如果你有认真看上面的代码，你会发现在 `scheduleUpdateOnFiber` 方法内，会判断 `lane` 是否为同步，那么是不是存在异步的情况？

```js
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  if (lane === SyncLane) {
    // 同步操作
    ensureRootIsScheduled(root, eventTime);
    // 判断当前是否还在 React 事件流中
    // 如果不在，直接调用 flushSyncCallbackQueue 更新
    if (executionContext === NoContext) {
      flushSyncCallbackQueue();
    }
  } else {
    // 异步操作
  }
}
```

React 在两年前，升级 fiber 架构的时候，就是为其异步化做准备的。在 React 18 将会正式发布 `Concurrent` 模式，关于 `Concurrent` 模式，官方的介绍如下。

![](https://file.shenfq.com/pic/20210802112142.png)

> **什么是 Concurrent 模式？**
>
> Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。在 Concurrent 模式中，渲染不是阻塞的。它是可中断的。这改善了用户体验。它同时解锁了以前不可能的新功能。

现在如果想使用 `Concurrent` 模式，需要使用 React 的实验版本。如果你对这部分内容感兴趣可以阅读我之前的文章：[《React 架构的演变 - 从同步到异步》](https://blog.shenfq.com/posts/2020/React%20%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98%20-%20%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5.html)。



