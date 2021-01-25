---
title: MobX 上手指南
author: shenfq
date: 2021/01/25
categories:
- 前端
tags:
- MobX
- 状态管理
---

# MobX 上手指南

之前用 Redux 比较多，一直听说 Mobx 能让你体验到在 React 里面写 Vue 的感觉，今天打算尝试下 Mobx 是不是真的有写 Vue 的感觉。

## 题外话

在介绍 MobX 的用法之前，先说点题外话，我们可以看一下 MobX 的中文简介。在 MobX 的中文网站上写着：

> MobX 是一个经过战火洗礼的库，它通过透明的函数响应式编程使得状态管理变得简单和可扩展。

![数据流](https://file.shenfq.com/pic/20210118134728.png)

“战火洗礼的库” 怎么看都感觉很奇怪，读起来很拗口😂，而且网上很多介绍 MobX 的文章都是这么写的，在 [github](https://github.com/mobxjs/mobx) 翻阅其 README 发现写的是：

> MobX is a battle tested library that makes state management simple and scalable by transparently applying functional reactive programming (TFRP). 

可以看到作者原本要表达的意思是 MobX 是经过了许多的测试，拥有比较强的健壮性。下面是通过谷歌翻译的结果，看起来也比中文网的表达要准确一些。

![谷歌翻译](https://file.shenfq.com/pic/20210123154105.png)

虽然，我的英文水平也很菜，还是会尽量看官方的文档，这样可以避免一些不必要的误解。

## 如何使用？

言归正传，MobX 现在的最新版是 6.0，这个版本的 API 相比于之前有了极大的简化，可以说更加好用了。之前的版本是装饰器风格的语法糖，但是装饰器在现在的 ES 规范中并不成熟，而且引入装饰器语法也在增加打包后的代码体积。综合考虑后，MobX 6.0 取消了装饰器语法的 API。

### 响应式对象

MobX 通过 `makeObservable` 方法来构造响应式对象，传入的对象属性会通过  `Proxy` 代理，与 Vue 类似，在 6.0 版本之前使用的是   `Object.defineProperty`  API，当然 6.0 也提供了降级方案。

```js
import { configure, makeObservable, observable, action, computed } from 'mobx'

// 使用该配置，可以将 Proxy 降级为 Object.defineProperty
configure({ useProxies: "never" });

// 构造响应对象
const store = makeObservable(
  // 需要代理的响应对象
  {
    count: 0,
    get double() {
      return this.count * 2
    },
    increment() {
      this.count += 1
    },
    decrement() {
      this.count -= 1
    }
  },
  // 对各个属性进行包装，用于标记该属性的作用
  {
    count: observable, // 需要跟踪的响应属性
    double: computed,  // 计算属性
    increment: action, // action 调用后，会修改响应对象
    decrement: action, // action 调用后，会修改响应对象
  }
)
```

我们在看看之前版本的 MobX，使用装饰器的写法：

```js
class Store {
  @observable count = 0
  constructor() {
    makeObservable(this)
  }
  @action increment() {
    this.count++;
  }
  @action decrement() {
    this.count--;
  }
  @computed get double() {
    return this.count * 2
  }
}

const store = new Store()
```

这么看起来，好像写法并没有得到什么简化，好像比写装饰器还要复杂点。下面我们看看 6.0 版本一个更强大的 API：`makeAutoObservable`。

`makeAutoObservable` 是一个更强大的 `makeObservable`，可以自动未属性加上对象的包装函数，上手成本直线下降。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  },
  increment() {
    this.count += 1
  },
  decrement() {
    this.count -= 1
  }
})
```

### 计算属性

MobX 的属性与 Vue 的 `computed` 一样，在 `makeAutoObservable` 中就是一个 `getter`，`getter` 依赖的值一旦发生变化，`getter` 本身的返回值也会跟随变化。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  }
})
```

当 `store.count` 为 1 时，调用 `store.double` 会返回 2。


### 修改行为

当我们需要修改 store 上的响应属性时，我们可以通过直接重新赋值的方式修改，但是这样会得到 MobX 的警告⚠️。

```js
const store = makeAutoObservable({
  count: 0
});

document.getElementById("increment").onclick = function () {
  store.count += 1
}
```

![warn](https://file.shenfq.com/pic/20210124212353.png)

MobX 会提示，在修改响应式对象的属性时，需要通过 action 的方式修改。虽然直接修改也能生效，但是这样会让 MobX 状态的管理比较混乱，而且将状态修改放到 action 中，能够让 MobX 在内部的事务流程中进行修改，以免拿到的某个属性还处于中间态，最后计算的结果不够准确。

`makeAutoObservable` 中的所有方法都会被处理成 action。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  },
  increment() { // action
    this.count += 1
  },
  decrement() { // action
    this.count -= 1
  }
})
```

不同于 Vuex，将状态的修改划分为 mutation 和 action，同步修改放到 mutation 中，异步的操作放到 action 中。在 MobX 中，不管是同步还是异步操作，都可以放到 action 中，只是异步操作在修改属性时，需要将赋值操作放到 `runInAction` 中。

```js
import { runInAction, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  async initCount() {
    // 模拟获取远程的数据
    const count = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 500)
    })
    // 获取数据后，将赋值操作放到 runInAction 中
    runInAction(() => {
      this.count = count
    })
  }
})

store.initCount()
```

如果不调用 `runInAction` ，则可以直接调用本身已经存在的 action。

```js
import { runInAction, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  async initCount() {
    // 模拟获取远程的数据
    const count = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 500)
    })
    // 获取数据后，调用已有的 action
    this.setCount(count)
  }
})

store.initCount()
```

### 监听对象变更

无论是在 React 还是在小程序中想要引入 MobX，都需要在对象变更的时候，通知调用原生的 `setState/setData` 方法，将状态同步到视图上。

通过 `autorun` 方法可以实现这个能力，我们可以把 `autorun` 理解为 React Hooks 中的 `useEffect`。每当 store 的响应属性发生修改时，传入 `autorun` 的方法（`effect`）就会被调用一次。

```js
import { autorun, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  increment() {
    this.count++
  },
  decrement() {
    this.count--
  }
})

document.getElementById("increment").onclick = function () {
  store.count++
}

const $count = document.getElementById("count")
$count.innerText = `${store.count}`
autorun(() => {
  $count.innerText = `${store.count}`
})
```

每当  `button#increment` 按钮被点击的时候，`span#count` 内的值就会自动进行同步。👉[查看完整代码](https://codesandbox.io/embed/mobx6-d9bex)。

![效果演示](https://file.shenfq.com/pic/20210124220312.gif)

除了 `autorun` ，MobX 还提供了更精细化的监听方法：`reaction`、 `when`。

```js
const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  increment() {
    this.count++
  },
  decrement() {
    this.count--
  }
})

// store 发生修改立即调用 effect
autorun(() => {
  $count.innerText = `${store.count}`
});

// 第一个方法的返回值修改后才会调用后面的 effect
reaction(
  // 表示 store.count 修改后才会调用
  () => store.count,
  // 第一个参数为当前值，第二个参数为修改前的值
  // 有点类似与 Vue 中的 watch
  (value, prevValue) => {
    console.log('diff', value - prevValue)
  }
);

// 第一个方法的返回值为真，立即调用后面的 effect
when(() => store.count > 10, () => {
  console.log(store.count)
})
// when 方法还能返回一个 promise
(async function() {
  await when(() => store.count > 10)
  console.log('store.count > 10')
})()
```

## 总结

MobX 的介绍到这里就结束了，本文只是大致的列举了一下 MobX 的 API，希望大家能有所收获。后续打算再深入研究下 MobX 的实现，等我研究好了，再写篇文章来分享。


