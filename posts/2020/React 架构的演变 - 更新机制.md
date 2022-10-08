---
title: React 架构的演变 - 更新机制
author: shenfq
date: 2020/10/12
categories:
- 前端
tags:
- 前端框架
- JavaScript
- React
---

# React 架构的演变 - 更新机制

前面的文章分析了 Concurrent 模式下异步更新的逻辑，以及 Fiber 架构是如何进行时间分片的，更新过程中的很多内容都省略了，评论区也收到了一些同学对更新过程的疑惑，今天的文章就来讲解下 React Fiber 架构的更新机制。

## Fiber 数据结构

我们先回顾一下 Fiber 节点的数据结构（之前文章省略了一部分属性，所以和之前文章略有不同）：

```js
function FiberNode (tag, key) {
  // 节点 key，主要用于了优化列表 diff
  this.key = key
  // 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...
  this.tag = tag

	// 子节点
  this.child = null
  // 父节点
  this.return = null 
  // 兄弟节点
  this.sibling = null
  
  // 更新队列，用于暂存 setState 的值
  this.updateQueue = null
  // 新传入的 props
  this.pendingProps = pendingProps;
  // 之前的 props
  this.memoizedProps = null;
  // 之前的 state
  this.memoizedState = null;

  // 节点更新过期时间，用于时间分片
  // react 17 改为：lanes、childLanes
  this.expirationTime = NoLanes
  this.childExpirationTime = NoLanes

  // 对应到页面的真实 DOM 节点
  this.stateNode = null
  // Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能
  this.alternate = null

  // 副作用相关，用于标记节点是否需要更新
  // 以及更新的类型：替换成新节点、更新属性、更新文本、删除……
  this.effectTag = NoEffect
  // 指向下一个需要更新的节点
  this.nextEffect = null
  this.firstEffect = null
  this.lastEffect = null
}
```

## 缓存机制

可以注意到 Fiber 节点有个 `alternate` 属性，该属性在节点初始化的时候默认为空（`this.alternate = null`）。这个节点的作用就是用来缓存之前的 Fiber 节点，更新的时候会判断 `fiber.alternate` 是否为空来确定当前是首次渲染还是更新。下面我们上代码：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = { val: 0 }
  render() {
    return <div>val: { this.state.val }</div>
  }
}

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />)
```

在调用 createRoot 的时候，会先生成一个`FiberRootNode`，在 `FiberRootNode` 下会有个 current 属性，current 指向 `RootFiber` 可以理解为一个空 Fiber。后续调用的 render 方法，就是将传入的组件挂载到 `FiberRootNode.current`（即 `RootFiber`） 的空 Fiber 节点上。

```js
// 实验版本对外暴露的 createRoot 需要加上 `unstable_` 前缀
exports.unstable_createRoot = createRoot

function createRoot(container) {
  return new ReactDOMRoot(container)
}
function ReactDOMRoot(container) {
  var root = new FiberRootNode()
  // createRootFiber => createFiber => return new FiberNode(tag);
  root.current = createRootFiber() // 挂载一个空的 fiber 节点
  this._internalRoot = root
}
ReactDOMRoot.prototype.render = function render(children) {
  var root = this._internalRoot
  var update = createUpdate()
  update.payload = { element: children }
  const rootFiber = root.current
  // update对象放到 rootFiber 的 updateQueue 中
  enqueueUpdate(rootFiber, update)
  // 开始更新流程
  scheduleUpdateOnFiber(rootFiber)
}
```

`render` 最后调用 `scheduleUpdateOnFiber` 进入更新任务，该方法之前有说明，最后会通过 scheduleCallback 走 MessageChannel 消息进入下个任务队列，最后调用 `performConcurrentWorkOnRoot` 方法。

```js
// scheduleUpdateOnFiber
// => ensureRootIsScheduled
// => scheduleCallback(performConcurrentWorkOnRoot)
function performConcurrentWorkOnRoot(root) {
  renderRootConcurrent(root)
}
function renderRootConcurrent(root) {
  // workInProgressRoot 为空，则创建 workInProgress
  if (workInProgressRoot !== root) {
    createWorkInProgress()
  }
}
function createWorkInProgress() {
  workInProgressRoot = root
  var current = root.current
  var workInProgress = current.alternate;
  if (workInProgress === null) {
    // 第一次构建，需要创建副本
    workInProgress = createFiber(current.tag)
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    // 更新过程可以复用
    workInProgress.nextEffect = null
    workInProgress.firstEffect = null
    workInProgress.lastEffect = null
  }
}
```

开始更新时，如果 `workInProgress` 为空会指向一个新的空 Fiber 节点，表示正在进行工作的 Fiber 节点。

```js
workInProgress.alternate = current
current.alternate = workInProgress
```

![fiber tree](https://file.shenfq.com/pic/20201009143621.png)

构造好 `workInProgress` 之后，就会开始在新的 RootFiber 下生成新的子 Fiber 节点了。

```js
function renderRootConcurrent(root) {
  // 构造 workInProgress...
  // workInProgress.alternate = current
	// current.alternate = workInProgress

  // 进入遍历 fiber 树的流程
  workLoopConcurrent()
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork()
  }
}

function performUnitOfWork() {
  var current = workInProgress.alternate
  // 返回当前 Fiber 的 child
  const next = beginWork(current, workInProgress)
  // 省略后续代码...
}
```

按照我们前面的案例， `workLoopConcurrent` 调用完成后，最后得到的 fiber 树如下：

```js
class App extends React.Component {
  state = { val: 0 }
  render() {
    return <div>val: { this.state.val }</div>
  }
}
```

![fiber tree](https://file.shenfq.com/pic/20201009145645.png)

最后进入 Commit 阶段的时候，会切换 FiberRootNode 的 current 属性：

```js
function performConcurrentWorkOnRoot() {
  renderRootConcurrent() // 结束遍历流程，fiber tree 已经构造完毕

  var finishedWork = root.current.alternate
  root.finishedWork = finishedWork
  commitRoot(root)
}
function commitRoot() {
  var finishedWork = root.finishedWork
  root.finishedWork = null
  root.current = finishedWork // 切换到新的 fiber 树
}
```

![fiber tree](https://file.shenfq.com/pic/20201009154353.png)

上面的流程为第一次渲染，通过 `setState({ val: 1 })` 更新时，`workInProgress` 会切换到 `root.current.alternate`。

```js
function createWorkInProgress() {
  workInProgressRoot = root
  var current = root.current
  var workInProgress = current.alternate;
  if (workInProgress === null) {
    // 第一次构建，需要创建副本
    workInProgress = createFiber(current.tag)
    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    // 更新过程可以复用
    workInProgress.nextEffect = null
    workInProgress.firstEffect = null
    workInProgress.lastEffect = null
  }
}
```

![fiber tree](https://file.shenfq.com/pic/20201009154849.png)

在后续的遍历过程中（`workLoopConcurrent()`），会在旧的 RootFiber 下构建一个新的 fiber tree，并且每个 fiber 节点的 alternate 都会指向 current fiber tree 下的节点。

![fiber tree](https://file.shenfq.com/pic/20201009155147.png)

这样 FiberRootNode 的 current 属性就会轮流在两棵 fiber tree 不停的切换，即达到了缓存的目的，也不会过分的占用内存。

## 更新队列

在 React 15 里，多次 setState 会被放到一个队列中，等待一次更新。

```js
// setState 方法挂载到原型链上
ReactComponent.prototype.setState = function (partialState, callback) {
  // 调用 setState 后，会调用内部的 updater.enqueueSetState
  this.updater.enqueueSetState(this, partialState)
};

var ReactUpdateQueue = {
  enqueueSetState(component, partialState) {
    // 在组件的 _pendingStateQueue 上暂存新的 state
    if (!component._pendingStateQueue) {
      component._pendingStateQueue = []
    }
    // 将 setState 的值放入队列中
    var queue = component._pendingStateQueue
    queue.push(partialState)
    enqueueUpdate(component)
  }
}
```

同样在 Fiber 架构中，也会有一个队列用来存放 setState 的值。每个 Fiber 节点都有一个 `updateQueue` 属性，这个属性就是用来缓存 setState 值的，只是结构从 React 15 的数组变成了链表结构。

无论是首次 Render 的 Mount 阶段，还是 setState 的 Update 阶段，内部都会调用 `enqueueUpdate` 方法。

```js
// --- Render 阶段 ---
function initializeUpdateQueue(fiber) {
  var queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null
    },
    effects: null
  }
  fiber.updateQueue = queue
}
ReactDOMRoot.prototype.render = function render(children) {
  var root = this._internalRoot
  var update = createUpdate()
  update.payload = { element: children }
  const rootFiber = root.current
  // 初始化 rootFiber 的 updateQueue
  initializeUpdateQueue(rootFiber)
  // update 对象放到 rootFiber 的 updateQueue 中
  enqueueUpdate(rootFiber, update)
  // 开始更新流程
  scheduleUpdateOnFiber(rootFiber)
}

// --- Update 阶段 ---
Component.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState)
}
var classComponentUpdater = {
  enqueueSetState: function (inst, payload) {
    // 获取实例对应的fiber
    var fiber = get(inst)
    var update = createUpdate()
    update.payload = payload

    // update 对象放到 rootFiber 的 updateQueue 中
    enqueueUpdate(fiber, update)
    scheduleUpdateOnFiber(fiber)
  }
}
```

`enqueueUpdate` 方法的主要作用就是将 setState 的值挂载到 Fiber 节点上。

```js
function enqueueUpdate(fiber, update) {
  var updateQueue = fiber.updateQueue;

  if (updateQueue === null) {
    // updateQueue 为空则跳过
    return;
  }
  var sharedQueue = updateQueue.shared;
  var pending = sharedQueue.pending;

  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update;
}
```

多次 setState 会在 `sharedQueue.pending` 上形成一个单向循环链表，具体例子更形象的展示下这个链表结构。

```js
class App extends React.Component {
  state = { val: 0 }
  click () {
    for (let i = 0; i < 3; i++) {
      this.setState({ val: this.state.val + 1 })
    }
  }
  render() {
    return <div onClick={() => {
      this.click()
    }}>val: { this.state.val }</div>
  }
}
```

点击 div 之后，会连续进行三次 setState，每次 setState 都会更新 updateQueue。

![第一次 setState](https://file.shenfq.com/pic/20201009235025.png)

![第二次 setState](https://file.shenfq.com/pic/20201009234928.png)

![第三次 setState](https://file.shenfq.com/pic/20201009234826.png)

更新过程中，我们遍历下 updateQueue 链表，可以看到结果与预期的一致。

```js
let $pending = sharedQueue.pending
// 遍历链表，在控制台输出 payload
while($pending) {
  console.log('update.payload', $pending.payload)
  $pending = $pending.next
}
```

![链表数据](https://file.shenfq.com/pic/20201009235244.png)

## 递归 Fiber 节点

Fiber 架构下每个节点都会经历`递（beginWork）`和`归（completeWork）`两个过程：

- beginWork：生成新的 state，调用 render 创建子节点，连接当前节点与子节点；
- completeWork：依据 EffectTag 收集 Effect，构造 Effect List；

先回顾下这个流程：

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork()
  }
}

function performUnitOfWork() {
  var current = workInProgress.alternate
  // 返回当前 Fiber 的 child
  const next = beginWork(current, workInProgress)
  if (next === null) { // child 不存在
    completeUnitOfWork()
  } else { // child 存在
    // 重置 workInProgress 为 child
    workInProgress = next
  }
}
function completeUnitOfWork() {
  // 向上回溯节点
  let completedWork = workInProgress
  while (completedWork !== null) {
    // 收集副作用，主要是用于标记节点是否需要操作 DOM
    var current = completedWork.alternate
    completeWork(current, completedWork)

    // 省略构造 Effect List 过程

    // 获取 Fiber.sibling
    let siblingFiber = workInProgress.sibling
    if (siblingFiber) {
      // sibling 存在，则跳出 complete 流程，继续 beginWork
      workInProgress = siblingFiber
      return
    }

    completedWork = completedWork.return
    workInProgress = completedWork
  }
}
```

### 递（beginWork）

先看看 `beginWork` 进行了哪些操作：

```js
function beginWork(current, workInProgress) {
  if (current !== null) { // current 不为空，表示需要进行 update
    var oldProps = current.memoizedProps // 原先传入的 props
    var newProps = workInProgress.pendingProps // 更新过程中新的 props
    // 组件的 props 发生变化，或者 type 发生变化
    if (oldProps !== newProps || workInProgress.type !== current.type) {
      // 设置更新标志位为 true
      didReceiveUpdate = true
    }
  } else { // current 为空表示首次加载，需要进行 mount
    didReceiveUpdate = false
  }
  
  // tag 表示组件类型，不用类型的组件调用不同方法获取 child
  switch(workInProgress.tag) {
    // 函数组件
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, newProps)
    // Class组件
    case ClassComponent:
      return updateClassComponent(current, workInProgress, newProps)
    // DOM 原生组件（div、span、button……）
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    // DOM 文本组件
    case HostText:
      return updateHostText(current, workInProgress)
  }
}
```

首先判断 `current（即：workInProgress.alternate）` 是否存在，如果存在表示需要更新，不存在就是首次加载，`didReceiveUpdate` 变量设置为 false，`didReceiveUpdate` 变量用于标记是否需要调用 render 新建 `fiber.child`，如果为 false 就会重新构建`fiber.child`，否则复用之前的 `fiber.child`。

然后会依据 `workInProgress.tag` 调用不同的方法构建  `fiber.child`。关于 `workInProgress.tag` 的含义可以参考 [react/packages/shared/ReactWorkTags.js](https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactWorkTags.js)，主要是用来区分每个节点各自的类型，下面是常用的几个：

```js
var FunctionComponent = 0; // 函数组件
var ClassComponent = 1; // Class组件
var HostComponent = 5; // 原生组件
var HostText = 6; // 文本组件
```

调用的方法不一一展开讲解，我们只看看 `updateClassComponent`：

```js
// 更新 class 组件
function updateClassComponent(current, workInProgress, newProps) {
  // 更新 state，省略了一万行代码，只保留了核心逻辑，看看就好
  var oldState = workInProgress.memoizedState
  var newState = oldState

  var queue = workInProgress.updateQueue
  var pendingQueue = queue.shared.pending
  var firstUpdate = pendingQueue
  var update = pendingQueue

  do {
    // 合并 state
    var partialState = update.payload
    newState = Object.assign({}, newState, partialState)

    // 链表遍历完毕
    update = update.next
    if (update === firstUpdate) {
    	// 链表遍历完毕
      queue.shared.pending = null
      break
    }
  } while (true)

	workInProgress.memoizedState = newState // state 更新完毕
  
  // 检测 oldState 和 newState 是否一致，如果一致，跳过更新
  // 调用 componentWillUpdate 判断是否需要更新
  

  var instance = workInProgress.stateNode
  instance.props = newProps
  instance.state = newState

  // 调用 Component 实例的 render
  var nextChildren = instance.render()
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}
```

首先遍历了之前提到的 `updateQueue` 更新 `state`，然后就是判断 `state` 是否更新，以此来推到组件是否需要更新（这部分代码省略了），最后调用的组件 `render` 方法生成子组件的虚拟 DOM。最后的 `reconcileChildren` 就是依据 `render` 的返回值来生成 fiber 节点并挂载到 `workInProgress.child` 上。

```js
// 构造子节点
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress, null, nextChildren
    )
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress, current.child, nextChildren
    )
  }
}

// 两个方法本质上一样，只是一个需要生成新的 fiber，一个复用之前的
var reconcileChildFibers = ChildReconciler(true)
var mountChildFibers = ChildReconciler(false)

function ChildReconciler(shouldTrackSideEffects) {
  return function (returnFiber, currentChild, nextChildren) {
    // 不同类型进行不同的处理
    // 返回对象
    if (typeof newChild === 'object' && newChild !== null) {
			return placeSingleChild(
        reconcileSingleElement(
          returnFiber, currentChild, newChild
        )
      )
    }
    // 返回数组
    if (Array.isArray(newChild)) {
      // ...
    }
    // 返回字符串或数字，表明是文本节点
    if (
      typeof newChild === 'string' ||
      typeof newChild === 'number'
    ) {
      // ...
    }
    // 返回 null，直接删除节点
    return deleteRemainingChildren(returnFiber, currentChild)
  }
}
```

篇幅有限，看看 render 返回值为对象的情况（通常情况下，render 方法 return 的如果是 jsx 都会被转化为虚拟 DOM，而虚拟 DOM 必定是对象或数组）：

```js
if (typeof newChild === 'object' && newChild !== null) {
  return placeSingleChild(
    // 构造 fiber，或者是复用 fiber
    reconcileSingleElement(
      returnFiber, currentChild, newChild
    )
  )
}

function placeSingleChild(newFiber) {
  // 更新操作，需要设置 effectTag
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    newFiber.effectTag = Placement
  }
  return newFiber
}
```

### 归（completeWork）

当 `fiber.child` 为空时，就会进入 `completeWork` 流程。而 `completeWork` 主要就是收集 `beginWork` 阶段设置的 `effectTag`，如果有设置 `effectTag` 就表明该节点发生了变更， `effectTag`  的主要类型如下（默认为 `NoEffect` ，表示节点无需进行操作，完整的定义可以参考 [react/packages/shared/ReactSideEffectTags.js](https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactSideEffectTags.js)）：

```js
export const NoEffect = /*                     */ 0b000000000000000;
export const PerformedWork = /*                */ 0b000000000000001;

// You can change the rest (and add more).
export const Placement = /*                    */ 0b000000000000010;
export const Update = /*                       */ 0b000000000000100;
export const PlacementAndUpdate = /*           */ 0b000000000000110;
export const Deletion = /*                     */ 0b000000000001000;
export const ContentReset = /*                 */ 0b000000000010000;
export const Callback = /*                     */ 0b000000000100000;
export const DidCapture = /*                   */ 0b000000001000000;
```

我们看看 `completeWork` 过程中，具体进行了哪些操作：

```js
function completeWork(current, workInProgress) {
  switch (workInProgress.tag) {
    // 这些组件没有反应到 DOM 的 effect，跳过处理
    case Fragment:
    case MemoComponent:
    case LazyComponent:
    case ContextConsumer:
    case FunctionComponent:
      return null
    // class 组件
    case ClassComponent: {
      // 处理 context
      var Component = workInProgress.type
      if (isContextProvider(Component)) {
        popContext(workInProgress)
      }
      return null
    }
    case HostComponent: {
      // 这里 Fiber 的 props 对应的就是 DOM 节点的 props
      // 例如： id、src、className ……
  		var newProps = workInProgress.pendingProps // props
      if (
        current !== null &&
        workInProgress.stateNode != null
      ) { // current 不为空，表示是更新操作
        var type = workInProgress.type
        updateHostComponent(current, workInProgress, type, newProps)
      } else { // current 为空，表示需要渲染 DOM 节点
        // 实例化 DOM，挂载到 fiber.stateNode
        var instance = createInstance(type, newProps)
        appendAllChildren(instance, workInProgress, false, false);
        workInProgress.stateNode = instance
      }
      return null
    }
    case HostText: {
      var newText = workInProgress.pendingProps // props
      if (current && workInProgress.stateNode != null) {
        var oldText = current.memoizedProps
        // 更新文本节点
        updateHostText(current, workInProgress, oldText, newText)
      } else {
        // 实例文本节点
        workInProgress.stateNode = createTextInstance(newText)
      }
      return null
    }
  }
}
```

与 `beginWork` 一样，`completeWork` 过程中也会依据 ` workInProgress.tag ` 来进行不同的处理，其他类型的组件基本可以略过，只用关注下 `HostComponent`、`HostText`，这两种类型的节点会反应到真实 DOM 中，所以会有所处理。

```js
updateHostComponent = function (
	current, workInProgress, type, newProps
) {
  var oldProps = current.memoizedProps

  if (oldProps === newProps) {
    // 新旧 props 无变化
    return
  }

  var instance = workInProgress.stateNode // DOM 实例
  // 对比新旧 props
	var updatePayload = diffProperties(instance, type, oldProps, newProps)
  // 将发生变化的属性放入 updateQueue
  // 注意这里的 updateQueue 不同于 Class 组件对应的 fiber.updateQueue
  workInProgress.updateQueue = updatePayload
};
```

`updateHostComponent` 方法最后会通过 `diffProperties` 方法获取一个更新队列，挂载到 `fiber.updateQueue` 上，这里的 updateQueue 不同于 Class 组件对应的 `fiber.updateQueue`，不是一个链表结构，而是一个数组结构，用于更新真实 DOM。

下面举一个例子，修改 App 组件的 state 后，下面的 span 标签对应的 `data-val`、`style`、`children` 都会相应的发生修改，同时，在控制台打印出 `updatePayload` 的结果。

```jsx
import React from 'react'

class App extends React.Component {
  state = { val: 1 }
  clickBtn = () => {
    this.setState({ val: this.state.val + 1 })
  }
  render() {
    return (<div>
      <button onClick={this.clickBtn}>add</button>
      <span
        data-val={this.state.val}
        style={{ fontSize: this.state.val * 15 }}
      >
        { this.state.val }
      </span>
    </div>)
  }
}

export default App
```

![console](https://file.shenfq.com/pic/20201012114009.png)

### 副作用链表

在最后的更新阶段，为了不用遍历所有的节点，在 `completeWork` 过程结束后，会构造一个 effectList 连接所有 effectTag 不为 NoEffect 的节点，在 commit 阶段能够更高效的遍历节点。

```js
function completeUnitOfWork() {
  let completedWork = workInProgress
  while (completedWork !== null) {
    // 调用 completeWork()...

    // 构造 Effect List 过程
    var returnFiber = completedWork.return
    if (returnFiber !== null) {
      if (returnFiber.firstEffect === null) {
        returnFiber.firstEffect = completedWork.firstEffect;
      }
      if (completedWork.lastEffect !== null) {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
        }
        returnFiber.lastEffect = completedWork.lastEffect;
      }

      if (completedWork.effectTag > PerformedWork) {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = completedWork
        } else {
          returnFiber.firstEffect = completedWork
        }
        returnFiber.lastEffect = completedWork
      }
    }

    // 判断 completedWork.sibling 是否存在...
  }
}
```

上面的代码就是构造 effectList 的过程，光看代码还是比较难理解的，我们还是通过实际的代码来解释一下。

```jsx
import React from 'react'

export default class App extends React.Component {
  state = { val: 0 }
  click = () => {
    this.setState({ val: this.state.val + 1 })
  }
  render() {
    const { val } = this.state
    const array = Array(2).fill()
    const rows = array.map(
      (_, row) => <tr key={row}>
        {array.map(
          (_, col) => <td key={col}>{val}</td>
        )}
      </tr>
    )
    return <table onClick={() => this.click()}>
      {rows}
    </table>
  }
}
```

![App](https://file.shenfq.com/pic/20201012155512.png)

我们构造一个 2 * 2 的 Table，每次点击组件，td 的 children 都会发生修改，下面看看这个过程中的 effectList 是如何变化的。

第一个 td 完成 `completeWork` 后，EffectList 结果如下：

![1](https://file.shenfq.com/pic/20201012153947.png)

第二个 td 完成 `completeWork` 后，EffectList 结果如下：

![2](https://file.shenfq.com/pic/20201012154130.png)

两个 td 结束了 `completeWork` 流程，会回溯到 tr 进行 `completeWork` ，tr 结束流程后 ，table 会直接复用 tr 的 firstEffect 和 lastEffect，EffectList 结果如下：

![3](https://file.shenfq.com/pic/20201012154619.png)

后面两个 td 结束 `completeWork` 流程后，EffectList 结果如下：

![4](https://file.shenfq.com/pic/20201012154701.png)

回溯到第二个 tr 进行 `completeWork` ，由于 table 已经存在 firstEffect 和 lastEffect，这里会直接修改 table 的 firstEffect 的 nextEffect，以及重新指定 lastEffect，EffectList 结果如下：

![5](https://file.shenfq.com/pic/20201012155222.png)

最后回溯到 App 组件时，就会直接复用 table 的 firstEffect 和 lastEffect，最后 的EffectList 结果如下：

![6](https://file.shenfq.com/pic/20201012155348.png)

## 提交更新

这一阶段的主要作用就是遍历 effectList 里面的节点，将更新反应到真实 DOM 中，当然还涉及一些生命周期钩子的调用，我们这里只展示最简单的逻辑。

```js
function commitRoot(root) {
  var finishedWork = root.finishedWork
  var firstEffect = finishedWork
  var nextEffect = firstEffect
  // 遍历effectList
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag
    // 根据 effectTag 进行不同的处理
    switch (effectTag) {
      // 插入 DOM 节点
      case Placement: {
        commitPlacement(nextEffect)
        nextEffect.effectTag &= ~Placement
        break
      }
      // 更新 DOM 节点
      case Update: {
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      // 删除 DOM 节点
      case Deletion: {
        commitDeletion(root, nextEffect)
        break
      }
    }
    nextEffect = nextEffect.nextEffect
  }
}
```

这里不再展开讲解每个 effect 下具体的操作，在遍历完 effectList 之后，就是将当前的 fiber 树进行切换。

```js
function commitRoot() {
  var finishedWork = root.finishedWork

  // 遍历 effectList ……

  root.finishedWork = null
  root.current = finishedWork // 切换到新的 fiber 树
}
```

##  总结

到这里整个更新流程就结束了，可以看到 Fiber 架构下，所有数据结构都是链表形式，链表的遍历都是通过循环的方式来实现的，看代码的过程中经常会被突然出现的 return、break 扰乱思路，所以要完全理解这个流程还是很不容易的。

最后，希望大家在阅读文章的过程中能有收获，下一篇文章会开始写 Hooks 相关的内容。