---
title: 全新的 Vue3 状态管理工具：Pinia
author: shenfq
date: 2021/12/15
categories:
- 前端
tags:
- Vue3
- Pinia
- 状态管理
---

# 全新的 Vue3 状态管理工具：Pinia

Vue3 发布已经有一段时间了，它采用了新的响应式系统，而且构建了一套全新的 `Composition API`。Vue 的周边生态都在加紧适配这套新的系统，官方的状态管理库 Vuex 也在适配中，为此官方提出了一个 [Vuex 5](https://github.com/vuejs/rfcs/discussions/270) 的全新提案。

![](https://file.shenfq.com/pic/202112151621995.png)

- 支持两种语法创建 Store：`Options Api` 和 `Composition Api`；
- 删除 `mutations`，只支持 `state`、`getters`、`actions`；
- 模块化的设计，能很好支持代码分割；
- 没有嵌套的模块，只有 Store 的概念；
- 完整的 `TypeScript` 支持；

在这个提案下方，有个评论很有意思。简单翻译一下：

![](https://file.shenfq.com/pic/202112151708483.png)



好巧不巧，Vuex5 的提案，与 Pinia 实现的功能不能说毫无关系，只能说一模一样，今天的文章就来给大家介绍一下这个菠萝：

![Logo](https://file.shenfq.com/pic/202112151708176.svg)

## 安装

在现有项目中，用过如下命令进行 Pinia 模块的安装。

```bash
# yarn
yarn add pinia@next
# npm
npm i pinia@next
```

安装完成后，需要在 Vue3 项目的入口文件中，进行导入安装。

```js
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 实例化 Vue
const app = createApp(App)
// 安装 Pinia
app.use(createPinia())
// 挂载在真实 DOM
app.mount('#app')
```

## 上手

要使用 Pinia 的话，只需要定义一个 store，然后在用到该数据的地方进行导入。

### 定义 Store

```js
import { defineStore } from "pinia"

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
const useCounterStore = defineStore({
  // 每个 store 的 id 必须唯一
  id: 'counter',
  // state 表示数据源
  state: () => ({
    count: 0
  }),
  // getters 类似于 computed，可对 state 的值进行二次计算
  getters: {
    double () {
    	// getter 中的 this 指向👉 state
    	return this.count * 2
  	},
  	// 如果使用箭头函数会导致 this 指向有问题
  	// 可以在函数的第一个参数中拿到 state
    double: (state) => {
    	return state.count * 2
  	}
  },
  // actions 用来修改 state
  actions: {
    increment() {
      // action 中的 this 指向👉 state
      this.count++
    },
  }
})

export default useCounterStore
```

除了使用上述类似 vuex 的方式来构建 state，还可以使用 `function` 的形式来创建 store，有点类似于 Vue3 中的 `setup()`。

```js
import { ref, computed } from "vue"
import { defineStore } from "pinia"

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
const useCounterStore = defineStore('counter', function () {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return {
  	count, double, increment
  }
})

export default useCounterStore
```

### 使用 Store

前面也介绍过，Pinia 提供了两种方式来使用 store，`Options Api` 和 `Composition Api` 中都完美支持。

#### Options Api

在 `Options Api` 中，可直接使用官方提供的 `mapActions` 和 `mapState` 方法，导出 store 中的 state、getter、action，其用法与 Vuex 基本一致，很容易上手。

```js
import { mapActions, mapState } from 'pinia'
import { useCounterStore } from '../model/counter'

export default {
  name: 'HelloWorld',
  computed: {
    ...mapState(useCounterStore, ['count', 'double'])
  },
  methods: {
    ...mapActions(useCounterStore, ['increment'])
  }
}
```

#### Composition Api

`Composition Api` 中，不管是 state 还是 getter 都需要通过 `computed` 方法来监听变化，这和 `Options Api` 中，需要放到 `computed` 对象中的道理一样。另外， `Options Api`  中拿到的 state 值是可以直接进行修改操作的，当然还是建议写一个 action 来操作 state 值，方便后期维护。

```js
// Composition Api
import { computed } from 'vue'
import { useCounterStore } from '../stores/counter'
export default {
  name: 'HelloWorld',
  setup() {
    const counter = useCounterStore()
    return {
      // state 和 getter 都需要在使用 computed，这和 Options Api 一样
      count: computed(() => counter.count),
      double: computed(() => counter.double),
      increment: () => { counter.count++ }, // 可以直接修改 state 的值
      increment: counter.increment, // 可以引用 store 中定义的 action
    }
  }
}
```

### 类型提示

在 Vuex 中，TypeScript 的类型提示做得不是很好，在进行类型推导时，只能找到它的 state。特别是写代码的过程中，代码提示就很不智能。

![](https://file.shenfq.com/pic/202112151709157.png)

而 pinia，就能推导出定义的所有 state、getter、action，这样在写代码的时候，就会方便很多。

![](https://file.shenfq.com/pic/202112151709804.png)

![](https://file.shenfq.com/pic/202112151709469.png)

主要是 pinia 通过 TypeScript 进行了十分友好的类型定义，感兴趣的可以看看 pinia 的类型定义文件（`pinia.d.ts`）：

![](https://file.shenfq.com/pic/202112151709919.png)

### 代码分割

由于使用了模块化设计，所有的 store 都能够单独引入，而不是像 vuex 一样，通过 modules 的方式，将所有的 module 挂载到一个 store 上。

假设，我们当前通过 Vuex 创建了一个 Store，这个 Store 下有两个 module，分别是用户模块（User）和商品模块（Goods）。即使当前首页只使用到了用户信息，但是整个 Store 都会被打包到首页的 js chunk 中。

![](https://file.shenfq.com/pic/202112151709033.png)

![](https://file.shenfq.com/pic/202112151709945.png)

如果我们使用 pinia，我们会使用 `defineStore` 定义两个 完全是分离状态的 store，两个页面在引入时，也互不影响。最后打包的时候，首页的 js chunk 和商品页的 js chunk 会分别打包对应的 store。

![](https://file.shenfq.com/pic/202112151709926.png)

---

Pinia 的介绍到这里就告一段落了，如果现在有新项目要使用 Vue3 进行开发，推荐无脑使用 Pinia，更加方便简介，而且大小仅 1KB。
