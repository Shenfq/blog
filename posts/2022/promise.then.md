---
title: 关于 Promise 的执行顺序
author: shenfq
date: 2022/01/20
categories:
- 前端
tags:
- JavaScript
- Promise
---

# 关于 Promise 的执行顺序

最近看到一个 Promise 相关的很有意思的代码：

```js
new Promise((resolve) => {
  console.log(1)
  resolve()
}).then(() => {
  new Promise((resolve) => {
    console.log(2)
    resolve()
  }).then(() => {
    console.log(4)
  })
}).then(() => {
  console.log(3)
})
```

第一次看到这个代码的时候，以为的输出结果会是：`1,2,3,4`，但是被实际的输出结果打脸 。

![](https://file.shenfq.com/pic/202201201133648.png)

如图所示，实际的输出结果为：`1,2,4,3`。

### 代码分析

为了搞清楚实际的输出结果为什么是：`1,2,4,3`，我们来一步步分析代码的执行。

我们知道，Promise 实例化时，传入的回调会立即执行，而Promise 的 then 回调会被放到微任务队列中，等待执行。队列就是一个先进先出的列表，先被放到队列的回调，会被优先执行。前面的代码中，一共有 5 个回调函数。

![](https://file.shenfq.com/pic/202201181756302.png)

`回调1` 是 Promise 实例化时的回调，所以会立即执行，此时控制台打印出数字 `1`，然后 `resolve()` 方法被调用，此时的 Promise 状态被修改成了 `fulfilled`（如果没有调用 `resolve()` 方法，Promise 的状态为 `pending`）。

![](https://file.shenfq.com/pic/202201191739509.png)

Promise 实例化完成后，第一个 `then()` 方法被调用， `回调2` 会被放入了微任务队列中，等待执行。

### then 方法何时调用？

这个时候疑问点来了，第一个 `then()` 方法被调用后，第二个 `then` 方法会不会马上被调用，如果会，那输出的结果就应该是 ：`1,2,3,4`。显然，此时不会马上调用第二个 `then()` 方法，也就是不会马上将 `回调5` 放入微任务队列。那如果不会，那何时才会被调用？

这个时候，需要看一下 [Promise/A+ 规范](https://github.com/lingirlsea/promisesaplus)。重点是下面几条：

> **2.2 `then` 方法**
> promise 的 then 方法接受两个参数：
>
> ```js
> promise.then(onFulfilled, onRejected)
> ```

> 2.2.2 如果 onFulfilled 是函数：
> 
> - 2.2.2.1 当 promise 处于已处理状态时，该函数必须被调用并将 promise 的值作为第一个参数。
> - 2.2.2.2 该函数一定不能在 promise 处于已处理状态之前调用。
> - 2.2.2.3 该函数被调用次数不超过一次。

> 2.2.6 `then` 可以在同一个 promise 上多次调用。
>
> - 2.2.6.1 如果 `promise` 处于已处理状态时，所有相应的 `onFulfilled` 回调必须按照它们对 `then` 的组织顺序依次调用。
> - 2.2.6.2 如果 `promise` 处于已拒绝状态时，所有相应的 `onRejected` 回调必须按照它们对 `then` 的组织顺序依次调用。

> 2.2.7 `then` 必须返回一个 promise。

```js
promise1 = new Promise(resolve => resolve())

// promise1 可以多次调用 then
// 且 onFulfilled 回调的执行顺序，按照 .then 的调用顺序执行
promise1.then(onFulfilled1) // 1
promise1.then(onFulfilled2) // 2
promise1.then(onFulfilled3) // 3
// 上面 3 个 onFulfilled，按照 1、2、3 的顺序执行
```

```js
// 调用 .then 方法后，返回一个新的 promise
promise2 = promise1.then(onFulfilled, onRejected);
```

综上，第一个 `then()` 方法调用后，会返回一个新的 Promise。这样做的目的就是为了保持链式调用，而且 `then()` 方法内的 `onFulfilled` 回调会等待 Promise 状态修改之后才会调用。

我们稍微修改一下前面代码的调用形式，如下：

```js
const p1 = new Promise((resolve) => {
  console.log(1)
  resolve()
})

const p2 = p1.then(() => {
  new Promise((resolve) => {
    console.log(2)
    resolve()
  }).then(() => {
    console.log(4)
  })
})

const p3 = p2.then(() => {
  console.log(3)
})
```

`p1.then()` 会返回一个新的 Promise 命名为 `p2`，后面的 `p2.then()` 的回调会在 `p1.then()` 内的回调函数执行完之后，才会调用，也就是 `p2` 这个 Promise 状态发生改变之后。

所以，只有 `回调2` 执行完成后，才会执行 `p2.then()`。我们再看 `回调2` 的内容。 

![](https://file.shenfq.com/pic/202201201100397.png)

`回调2` 先是对一个 Promise 进行了实例化操作，实例化的回调为 `回调3` ，该回调会立即执行，此时控制台打印出数字 `2`，然后 `resolve()` 方法被调用，此时的 Promise 状态被修改成了 `fulfilled`，后面的 `回调4` 会放入微任务队列。`回调2` 执行完毕后，执行 `p2.then()`，`回调5` 被放入微任务队列。

按照队列先进先出的执行顺序，先执行 `回调4`，然后执行 `回调5`。所以，在控制台会先输出数字 `4`，然后输出数字 `3`。

如果想要输出的结果为：`1,2,3,4`，可以将代码改成如下形式：

```js
const p1 = new Promise((resolve) => {
  console.log(1)
  resolve()
})

p1.then(() => {
  new Promise((resolve) => {
    console.log(2)
    resolve()
  }).then(() => {
    console.log(4)
  })
})

p1.then(() => {
  console.log(3)
})
```

![](https://file.shenfq.com/pic/202201201134890.png)

根据前面的 `2.2.6` 规则，`then` 可以在同一个 promise 上多次调用，且 p1 后面的 then 会按照他们的调用顺序直接放入微任务队列中。
