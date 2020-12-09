---
title: 【翻译】基于虚拟DOM库(Snabbdom)的迷你React
author: shenfq
date: 2019/05/01
categories:
- 前端
tags:
- 前端框架
- react
- virtual dom
- 虚拟 DOM
- Snabbdom
- 翻译
---

# 【翻译】基于虚拟DOM库(Snabbdom)的迷你React


> [原文链接](https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3)

> 原文写于 2015-07-31，虽然时间比较久远，但是对于我们理解虚拟 DOM 和 view 层之间的关系还是有很积极的作用的。

React 是 JavaScript 社区的新成员，尽管 JSX （在 JavaScript 中使用 HTML 语法）存在一定的争议，但是对于虚拟 DOM 人们有不一样的看法。

对于不熟悉的人来说，虚拟 DOM 可以描述为某个时刻真实DOM的简单表示。其思想是：每次 UI 状态发生更改时，重新创建一个虚拟 DOM，而不是直接使用命令式的语句更新真实 DOM ，底层库将对应的更新映射到真实 DOM 上。

需要注意的是，更新操作并没有替换整个 DOM 树（例如使用 innerHTML 重新设置 HTML 字符串），而是替换 DOM 节点中实际修改的部分（改变节点属性、添加子节点）。这里使用的是增量更新，通过比对新旧虚拟 DOM 来推断更新的部分，然后将更新的部分通过补丁的方式更新到真实 DOM 中。

虚拟 DOM 因为高效的性能经常受到特别的关注。但是还有一项同样重要的特性，虚拟 DOM 可以把 UI 表示为状态函数的映射（PS. 也就是我们常说的 `UI = render(state)`），这也使得编写 web 应用有了新的形式。

在本文中，我们将研究虚拟 DOM 的概念如何引用到 web 应用中。我们将从简单的例子开始，然后给出一个架构来编写基于 Virtual DOM 的应用。

为此我们将选择一个独立的 JavaScript 虚拟 DOM 库，因为我们希望依赖最小化。本文中，我们将使用 snabbdom([paldepind/snabbdom](https://github.com/snabbdom/snabbdom))，但是你也可以使用其他类似的库，比如 Matt Esch 的 [virtual-dom](https://github.com/Matt-Esch/virtual-dom)

## snabbdom简易教程

snabbdom 是一个模块化的库，所以，我们需要使用一个打包工具，比如 webpack。

首先，让我们看看如何进行 snabbdom 的初始化。

```javascript
import snabbdom from 'snabbdom';

const patch = snabbdom.init([                 // 指定模块初始化 patch 方法
  require('snabbdom/modules/class'),          // 切换 class 
  require('snabbdom/modules/props'),          // 设置 DOM 元素的属性
  require('snabbdom/modules/style'),          // 处理元素的 style ，支持动画
  require('snabbdom/modules/eventlisteners'), // 事件处理
]);
```

上面的代码中，我们初始化了 snabbdom 模块并添加了一些扩展。在 snabbdom 中，切换 class、style还有 DOM 元素上的属性设置和事件绑定都是给不同模块实现的。上面的实例，只使用了默认提供的模块。

核心模块只暴露了一个 `patch` 方法，它由 init 方法返回。我们使用它创建初始化的 DOM，之后也会使用它来进行 DOM 的更新。

下面是一个 Hello World 示例：

```javascript
import h from 'snabbdom/h';

var vnode = h('div', {style: {fontWeight: 'bold'}}, 'Hello world');
patch(document.getElementById('placeholder'), vnode);
```

`h` 是一个创建虚拟 DOM 的辅助函数。我们将在文章后面介绍具体用法，现在只需要该函数的 3 个输入参数：

1. 一个 CSS 选择器（jQuery 的选择器），比如 `div#id.class`。
2. 一个可选的数据对象，它包含了虚拟节点的属性（class、styles、events）。
3. 一个字符串或者虚拟 DOM 的数组（用于表示该节点的children）。

第一次调用的时候，patch 方法需要一个 DOM 占位符和一个初始的虚拟 DOM，然后它会根据虚拟 DOM 创建一个对应的真实 DO树。在随后的的调用中，我们为它提供新旧两个虚拟 DOM，然后它通过 diff 算法比对这两个虚拟 DOM，并找出更新的部分对真实 DOM 进行必要的修改 ，使得真实的 DOM 树为最新的虚拟 DOM 的映射。

为了快速上手，我在 GitHub 上创建了一个仓库，其中包含了项目的必要内容。下面让我们来克隆这个仓库（[yelouafi/snabbdom-starter](https://github.com/yelouafi/snabbdom-starter)），然后运行 `npm install` 安装依赖。这个仓库使用 Browserify 作为打包工具，文件变更后使用 Watchify 自动重新构建，并且通过 Babel 将 ES6 的代码转成兼容性更好的 ES5。

下面运行如下代码：

```
npm run watch
```

这段代码将启动 watchify 模块，它会在 app 文件夹内，创建一个浏览器能够运行的包：`build.js` 。模块还将检测我们的 js 代码是否发生改变，如果有修改，会自动的重新构建 `build.js`。（如果你想手动构建，可以使用：`npm run build`）

在浏览器中打开 `app/index.html` 就能运行程序，这时候你会在屏幕上看到 “Hello World”。

这篇文中的所有案例都能在特定的分支上进行实现，我会在文中链接到每个分支，同时 README.md 文件也包含了所有分支的链接。


### 动态视图

> 本例的源代码在 [dynamic-view branch](https://github.com/yelouafi/snabbdom-starter/tree/dynamic-view)

为了突出虚拟 DOM 动态化的优势，接下来会构建一个很简单的时钟。

首先修改 `app/js/main.js`：

```javascript
function view(currentDate) { 
  return h('div', 'Current date ' + currentDate); 
}

var oldVnode = document.getElementById('placeholder');

setInterval( () => {
  const newVnode = view(new Date());
  oldVnode = patch(oldVnode, newVnode);
}, 1000);
```

通过单独的函数 `view` 来生成虚拟 DOM，它接受一个状态（当前日期）作为输入。

该案例展示了虚拟 DOM 的经典使用方式，在不同的时刻构造出新的虚拟 DOM，然后将新旧虚拟 DOM 进行对比，并更新到真实 DOM 上。案例中，我们每秒都构造了一个虚拟 DOM，并用它来更新真实 DOM。

### 事件响应

> 本例的源代码在 [event-reactivity branch](https://github.com/yelouafi/snabbdom-starter/tree/event-reactivity)

下面的案例介绍了通过事件系统完成一个打招呼的应用程序：

```javascript
function view(name) { 
  return h('div', [
    h('input', {
      props: { type: 'text', placeholder: 'Type  your name' },
      on   : { input: update }
    }),
    h('hr'),
    h('div', 'Hello ' + name)
  ]); 
}

var oldVnode = document.getElementById('placeholder');

function update(event) {
  const newVnode = view(event.target.value);
  oldVnode = patch(oldVnode, newVnode);
}


oldVnode = patch(oldVnode, view(''));
```

在 snabbdom 中，我们使用 props 对象来设置元素的属性，props 模块会对 props 对象进行处理。类似地，我们通过 on 对象进行元素的时间绑定，eventlistener 模块会对 on 对象进行处理。

上面的案例中，update 函数执行了与前面案例中 setInterval 类似的事情：从传入的事件对象中提取出 input 的值，构造出一个新的虚拟 DOM，然后调用 patch ，用新的虚拟 DOM 树更新真实 DOM。

## 复杂的应用程序

使用独立的虚拟 DOM 库的好处是，我们在构建自己的应用时，可以按照自己喜欢的方式来做。你可以使用 MVC 的设计模式，可以使用更现代化的数据流体系，比如 Flux。

在这篇文章中，我会介绍一种不太为人所知的架构模式，是我之前在 Elm（一种可编译成 JavaScript 的 函数式语言）中使用过的。Elm 的开发者称这种模式为 [ Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/)，它的主要优点是允许我们将整个应用编写为一组纯函数。

### 主流程

让我们回顾一下上个案例的主流程：

1. 通过 view 函数构造出我们初始的虚拟 DOM，在 view 函数中，给 input 输入框添加了一个 input 事件。
2. 通过 patch 将虚拟 DOM 渲染到真实 DOM 中，并将 input 事件绑定到真实 DOM 上。
3. 等待用户输入……
4. 用户输入内容，触发 input 事件，然后调用 update 函数
5. 在 update 函数中，我们更新了状态
6. 我们传入了新的状态给 view 函数，并生成新的虚拟 DOM （与步骤 1 相同）
7. 再次调用 patch，重复上述过程（与步骤 2 相同）


上面的过程可以描述成一个循环。如果去掉实现的一些细节，我们可以建立一个抽象的函数调用序列。

![主流程](https://file.shenfq.com/FvyObN9fMncD7cMXJYfZOFQJFQ--.png)

`user` 是用户交互的抽象，我们得到的是函数调用的循环序列。注意，`user` 函数是异步的，否则这将是一个无限的死循环。

让我们将上述过程转换为代码：

```javascript
function main(initState, element, {view, update}) {
  const newVnode = view(initState, event => {
    const newState = update(initState, event);
    main(newState, newVnode, {view, update});
  });
  patch(oldVnode, newVnode);
}
```

`main` 函数反映了上述的循环过程：给定一个初始状态（initState），一个 DOM 节点和一个*顶层组件*（view + update），`main` 通过当前的状态经过 view 函数构建出新的虚拟 DOM，然后通过补丁的方式更新到真实 DOM上。

传递给 `view` 函数的参数有两个：首先是*当前*状态，其次是事件处理的回调函数，对生成的视图中触发的事件进行处理。回调函数主要负责为应用程序构建一个新的状态，并使用新的状态重启 UI 循环。

新状态的构造委托给顶层组件的 `update` 函数，该函数是一个简单的纯函数：无论何时，给定当前状态和当前程序的输入（事件或行为），它都会为程序返回一个新的状态。

要注意的是，除了 patch 方法会有副作用，主函数内不会有任何改变状态行为发生。

main 函数有点类似于低级GUI框架的 `main` 事件循环，这里的重点是收回对 UI 事件分发流程的控制: 在实际状态下，DOM API通过采用观察者模式强制我们进行事件驱动，但是我们不想在这里使用观察者模式，下面就会讲到。

### Elm 架构（Elm architecture）

![Elm architecture](https://file.shenfq.com/Fs8usRuYQCOKL621r-fRyMsr9ZcI.png)

基于 Elm-architecture 的程序中，是由一个个模块或者说组件构成的。每个组件都有两个基本函数：`update`和`view`，以及一个特定的数据结构：组件拥有的 `model` 以及更新该 `model` 实例的 `actions`。

1. `update` 是一个纯函数，接受两个参数：组件拥有的 `model` 实例，表示当前的状态（state），以及一个 `action` 表示需要执行的更新操作。它将返回一个新的 `model` 实例。
2. `view` 同样接受两个参数：当前 `model` 实例和一个事件通道，它可以通过多种形式传播数据，在我们的案例中，将使用一个简单的回调函数。该函数返回一个新的虚拟 DOM，该虚拟 DOM 将会渲染成真实 DOM。

如上所述，Elm architecture 摆脱了传统的由事件进行驱动观察者模式。相反该架构倾向于集中式的管理数据（比如 React/Flux），任何的事件行为都会有两种方式：

1. 冒泡到顶层组件；
2. 通过组件树的形式进行下发，在此阶段，每个组件都可以选择自己的处理方式，或者转发给其他一个或所有子组件。

该架构的另一个关键点，就是将程序需要的整个状态都保存在一个对象中。树中的每个组件都负责将它们拥有的状态的一部分传递给子组件。

在我们的案例中，我们将使用与 Elm 网站相同的案例，因为它完美的展示了该模式。

### 案例一：计数器

> 本例的源代码在 [counter-1 branch](https://github.com/yelouafi/snabbdom-starter/tree/counter-1)

我们在 “counter.js” 中定义了 counter 组件：

```javascript
const INC = Symbol('inc');
const DEC = Symbol('dec');

// model : Number
function view(count, handler) { 
  return h('div', [
    h('button', {
      on   : { click: handler.bind(null, {type: INC}) }
    }, '+'),
    h('button', {
      on   : { click: handler.bind(null, {type: DEC}) }
    }, '-'),
    h('div', `Count : ${count}`),
  ]); 
}


function update(count, action) {
  return  action.type === INC ? count + 1
        : action.type === DEC ? count - 1
        : count;
}

export default { view, update, actions : { INC, DEC } }
```

counter 组件由以下属性组成：

1. Model： 一个简单的 `Number`
2. View：为用户提供两个按钮，用户递增、递减计数器，以及显示当前数字
3. Update：接受两个动作：INC / DEC，增加或减少计数器的值

首先要注意的是，view/update 都是纯函数，除了输入之外，他们不依赖任何外部环境。计数器组件本身不包括任何状态或变量，它只会从给定的状态构造出固定的视图，以及通过给定的状态更新视图。由于其纯粹性，计数器组件可以轻松的插入任何提供依赖（state 和 action）环境。
 
其次需要注意 `handler.bind(null, action)` 表达式，每次点击按钮，事件监听器都会触发该函数。我们将原始的用户事件转换为一个有意义的操作（递增或递减），使用了 ES6 的 Symbol 类型，比原始的字符串类型更好（避免了操作名称冲突的问题），稍后我们还将看到更好的解决方案：使用 union 类型。

下面看看如何进行组件的测试，我们使用了 “tape” 测试库：

```javascript
import test from 'tape';
import { update, actions } from '../app/js/counter';

test('counter update function', (assert) => {
    
  var count = 10;
  count = update(count, {type: actions.INC});
  assert.equal(count, 11);

  count = update(count, {type: actions.DEC});
  assert.equal(count, 10);

  assert.end();
});
```

我们可以直接使用 babel-node 来进行测试

```
babel-node test/counterTest.js
```


### 案例二：两个计数器

> 本例的源代码在 [counter-2 branch](https://github.com/yelouafi/snabbdom-starter/tree/counter-2)

我们将和 Elm 官方教程保持同步，增加计数器的数量，现在我们会有2个计数器。此外，还有一个“重置”按钮，将两个计数器同时重置为“0”;

首先，我们需要修改计数器组件，让该组件支持重置操作。为此，我们将引入一个新函数 `init`，其作用是为计数器构造一个新状态 (count)。


```javascript
function init() {
  return 0;
}
```

`init` 在很多情况下都非常有用。例如，使用来自服务器或本地存储的数据初始化状态。它通过 JavaScript 对象创建一个丰富的数据模型(例如，为一个 JavaScript 对象添加一些原型属性或方法)。

`init` 与 `update` 有一些区别：后者执行一个更新操作，然后从一个状态派生出新的状态；但是前者是使用一些输入值（比如：默认值、服务器数据等等）构造一个状态，输入值是可选的，而且完全不管前一个状态是什么。

下面我们将通过一些代码管理两个计数器，我们在 `towCounters.js` 中实现我们的代码。

首先，我们需要定义模型相关的操作类型：

```javascript
//{ first : counter.model, second : counter.model }

const RESET         = Symbol('reset');
const UPDATE_FIRST  = Symbol('update first');
const UPDATE_SECOND = Symbol('update second');
```

该模型导出两个属性：first 和 second 分别保存两个计数器的状态。我们定义了三个操作类型：第一个用来将计数器重置为 0，另外两个后面也会讲到。

组件通过 init 方法创建 state。

```javascript
function init() {
  return { first: counter.init(), second: counter.init() };
}
```

view 函数负责展示这两个计数器，并为用户提供一个重置按钮。

```javascript
function view(model, handler) { 
  return h('div', [
    h('button', {
      on   : { click: handler.bind(null, {type: RESET}) }
    }, 'Reset'),
    h('hr'),
    counter.view(model.first, counterAction => handler({ type: UPDATE_FIRST, data: counterAction})),
    h('hr'),
    counter.view(model.second, counterAction => handler({ type: UPDATE_SECOND, data: counterAction})),
    
  ]); 
}
```

我们给 view 方法传递了两个参数：

1. 每个视图都会获得父组件的部分状态（model.first / model.second）
2. 动态处理函数，它会传递到每个子节点的 view 。比如：第一个计数器触发了一个动作，我们会将 `UPDATE_FIRST` 封装在 action 中，当父类的 update 方法被调用时，我们会将计数器需要的 action（存储在 data 属性中）转发到正确的计数器，并调用计数器的 update 方法。

下面看看 update 函数的实现，并导出组件的所有属性。

```javascript
function update(model, action) {
  return  action.type === RESET     ?
            { 
              first : counter.init(),
              second: counter.init()
            }
            
        : action.type === UPDATE_FIRST   ?
            {...model, first : counter.update(model.first, action.data) }
            
        : action.type === UPDATE_SECOND  ?
            {...model, second : counter.update(model.second, action.data) }
            
        : model;
}

export default { view, init, update, actions : { UPDATE_FIRST, UPDATE_SECOND, RESET } }
```

update 函数处理3个操作:

1. `RESET` 操作会调用 init 将每个计数器重置到默认状态。
2. `UPDATE_FIRST` 和 `UPDATE_SECOND`，会封装一个计数器需要 action。函数将封装好的 action 连同其 state 转发给相关的子计数器。

` {...model, prop: val}; ` 是 ES7 的对象扩展属性（如object .assign），它总是返回一个新的对象。我们不修改参数中传递的 state ，而是始终返回一个相同属性的新 state 对象，确保更新函数是一个纯函数。

最后调用 main 方法，构造顶层组件：

```javascript
main(
  twoCounters.init(), // the initial state 
  document.getElementById('placeholder'), 
  twoCounters
);
```

“towCounters” 展示了经典的嵌套组件的使用模式：

1. 组件通过类似于树的层次结构进行组织。
2. main 函数调用顶层组件的 view 方法，并将全局的初始状态和处理回调（main handler）作为参数。
3. 在视图渲染的时候，父组件调用子组件的 view 函数，并将子组件相关的 state 传给子组件。
4. 视图将用户事件转化为对程序更有意义的 actions。
5. 从子组件触发的操作会通过父组件向上传递，直到顶层组件。与 DOM 事件的冒泡不同，父组件不会在此阶段进行操作，它能做的就是将相关信息添加到 action 中。
6. 在冒泡阶段，父组件的 view 函数可以拦截子组件的 actions ，并扩展一些必要的数据。
7. 该操作最终在主处理程序（main handler）中结束，主处理程序将通过调用顶部组件的 update 函数进行派发操作。
8. 每个父组件的 update 函数负责将操作分派给其子组件的 update 函数。通常使用在冒泡阶段添加了相关信息的 action。


### 案例三：计数器列表

> 本例的源代码在 [counter-3 branch](https://github.com/yelouafi/snabbdom-starter/tree/counter-3)

让我们继续来看 Elm 的教程，我们将进一步扩展我们的示例，可以管理任意数量的计数器列表。此外还提供新增计数器和删除计数器的按钮。

“counter” 组件代码保持不变，我们将定义一个新组件 `counterList` 来管理计数器数组。

我们先来定义模型，和一组关联操作。

```javascript
/*
model : {
  counters: [{id: Number, counter: counter.model}],
  nextID  : Number
}
*/

const ADD     = Symbol('add');
const UPDATE  = Symbol('update counter');
const REMOVE  = Symbol('remove');
const RESET   = Symbol('reset');
```

组件的模型包括了两个参数：

1. 一个由对象（id，counter）组成的列表，id 属性与前面实例的 first 和 second 属性作用类似；它将标识每个计数器的唯一性。
2. `nextID` 用来维护一个做自动递增的基数，每个新添加的计数器都会使用 `nextID + 1` 来作为它的 ID。

接下来，我们定义 `init` 方法，它将构造一个默认的 state。

```javascript
function init() {
  return  { nextID: 1, counters: [] };
}
```

下面定义一个 view 函数。

```javascript
function view(model, handler) { 
  return h('div', [
    h('button', {
      on   : { click: handler.bind(null, {type: ADD}) }
    }, 'Add'), 
    h('button', {
      on   : { click: handler.bind(null, {type: RESET}) }
    }, 'Reset'),
    h('hr'),
    h('div.counter-list', model.counters.map(item => counterItemView(item, handler)))
    
  ]); 
}
```

视图提供了两个按钮来触发“添加”和“重置”操作。每个计数器的都通过 `counterItemView` 函数来生成虚拟 DOM。

```javascript
function counterItemView(item, handler) {
  return h('div.counter-item', {key: item.id }, [
    h('button.remove', {
      on : { click: e => handler({ type: REMOVE, id: item.id})  }
    }, 'Remove'),
    counter.view(item.counter, a => handler({type: UPDATE, id: item.id, data: a})),
    h('hr')
  ]);
}
```

该函数添加了一个 remove 按钮在视图中，并引用了计数器的 id 添加到 remove 的 action 中。

接下来看看 update 函数。

```javascript
const resetAction = {type: counter.actions.INIT, data: 0};

function update(model, action) {
  
  return  action.type === ADD     ? addCounter(model)
        : action.type === RESET   ? resetCounters(model)
        : action.type === REMOVE  ? removeCounter(model, action.id)
        : action.type === UPDATE  ? updateCounter(model, action.id, action.data) 
        : model;
}

export default { view, update, actions : { ADD, RESET, REMOVE, UPDATE } }
```

该代码遵循上一个示例的相同的模式，使用冒泡阶段存储的 id 信息，将子节点的 actions 转发到顶层组件。下面是 update 的一个分支 “updateCounter” 。

```javascript
function updateCounter(model, id, action) {
  return {...model,
    counters  : model.counters.map(item => 
      item.id !== id ? 
          item
        : { ...item, 
            counter : counter.update(item.counter, action)
          }
    )
  };
}
```

上面这种模式可以应用于任何树结构嵌套的组件结构中，通过这种模式，我们让整个应用程序的结构进行了统一。

### 在 actions 中使用 union 类型

在前面的示例中，我们使用 ES6 的 Symbols 类型来表示操作类型。在视图内部，我们创建了带有操作类型和附加信息（id，子节点的 action）的对象。

在真实的场景中，我们必须将 action 的创建逻辑移动到一个单独的工厂函数中（类似于React/Flux中的 Action Creators）。在这篇文章的剩余部分，我将提出一个更符合 FP 精神的替代方案：union 类型。它是 FP 语言（如Haskell）中使用的 [代数数据类型](https://en.wikipedia.org/wiki/Algebraic_data_type) 的子集，您可以将它们看作具有更强大功能的枚举。

union类型可以为我们提供以下特性：

1. 定义一个可描述所有可能的 actions 的类型。
2. 为每个可能的值提供一个工厂函数。
3. 提供一个可控的流来处理所有可能的变量。

union 类型在 JavaScript 中不是原生的，但是我们可以使用一个库来模拟它。在我们的示例中，我们使用 union-type ([github/union-type](https://github.com/paldepind/union-type)) ，这是 snabbdom 作者编写的一个小而美的库。

先让我们安装这个库：

```
npm install --save union-type
```

下面我们来定义计数器的 actions：

```javascript
import Type from 'union-type';

const Action = Type({
  Increment : [],
  Decrement : []
});
```

`Type` 是该库导出的唯一函数。我们使用它来定义 union 类型 `Action`，其中包含两个可能的 actions。

返回的 `Action` 具有一组工厂函数，用于创建所有可能的操作。

```javascript
function view(count, handler) { 
  return h('div', [
    h('button', {
      on   : { click: handler.bind(null, Action.Increment()) }
    }, '+'),
    h('button', {
      on   : { click: handler.bind(null, Action.Decrement()) }
    }, '-'),
    h('div', `Count : ${count}`),
  ]); 
}
```

在 view 创建递增和递减两种 action。update 函数展示了 uinon 如何对不同类型的 action 进行模式匹配。

```javascript
function update(count, action) {
  return  Action.case({
    Increment : () => count + 1,
    Decrement : () => count - 1
  }, action);
}
```

`Action` 具有一个 `case` 方法，该方法接受两个参数：

- 一个对象（变量名和一个回调函数）
- 要匹配的值

然后，case方法将提供的 action 与所有指定的变量名相匹配，并调用相应的处理函数。返回值是匹配的回调函数的返回值。

类似地，我们看看如何定义 `counterList` 的 actions

```javascript
const Action = Type({
  Add     : [],
  Remove  : [Number],
  Reset   : [],
  Update  : [Number, counter.Action],
});
```

`Add`和`Reset`是空数组(即它们没有任何字段)，`Remove`只有一个字段（计数器的 id）。最后，`Update` 操作有两个字段：计数器的 id 和计数器触发时的 action。

与之前一样，我们在 update 函数中进行模式匹配。

```javascript
function update(model, action) {
  
  return Action.case({
    Add     : () => addCounter(model),
    Remove  : id => removeCounter(model, id),
    Reset   : () => resetCounters(model), 
    Update  : (id, action) => updateCounter(model, id, action)
  }, action);
}
```

注意，`Remove` 和 `Update` 都会接受参数。如果匹配成功，`case` 方法将从 case 实例中提取字段并将它们传递给对应的回调函数。

所以典型的模式是：

- 将 actions 建模为union类型。
- 在 view 函数中，使用 union 类型提供的工厂函数创建 action （如果创建的逻辑更复杂，还可以将操作创建委托给单独的函数）。
- 在 update 函数中，使用 `case` 方法来匹配 union 类型的可能值。


## TodoMVC例子

在这个仓库中([github/yelouafi/snabbdom-todomvc](https://github.com/yelouafi/snabbdom-todomvc))，使用本文提到的规范进行了 todoMVC 应用的实现。应用程序由2个模块组成：

- `task.js` 定义一个呈现单个任务并更新其状态的组件
- `todos.js`，它管理任务列表以及过滤和更新



## 总结

我们已经了解了如何使用小而美的虚 拟DOM 库编写应用程序。当我们不想被迫选择使用React框架（尤其是 class），或者当我们需要一个小型 JavaScript 库时，这将非常有用。

*Elm architecture* 提供了一个简单的模式来编写复杂的虚拟DOM应用，具有纯函数的所有优点。这为我们的代码提供了一个简单而规范的结构。使用标准的模式使得应用程序更容易维护，特别是在成员频繁更改的团队中。新成员可以快速掌握代码的总体架构。

由于完全用纯函数实现的，我确信只要组件代码遵守其约定，更改组件就不会产生不良的副作用。

