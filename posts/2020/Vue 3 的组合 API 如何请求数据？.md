---
title: Vue 3 的组合 API 如何请求数据？
author: shenfq
date: 2020/10/20
categories:
- 前端
tags:
- 前端
- 前端框架
- Vue.js
---


## 前言

之前在学习 React Hooks 的过程中，看到一篇外网文章，通过 Hooks 来请求数据，并将这段逻辑抽象成一个新的 Hooks 给其他组件复用，我也在我的博客里翻译了一下：[《在 React Hooks 中如何请求数据？》](https://blog.shenfq.com/2019/%E3%80%90%E7%BF%BB%E8%AF%91%E3%80%91%E5%9C%A8-react-hooks-%E4%B8%AD%E5%A6%82%E4%BD%95%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE%EF%BC%9F/)，感兴趣可以看看。虽然是去年的文章，在阅读之后一下子就掌握了 Hooks 的使用方式，而且数据请求是在业务代码中很常用的逻辑。

Vue 3 已经发布一段时间了，其组合 API 多少有点 React Hooks 的影子在里面，今天我也打算通过这种方式来学习下组合 API。

## 项目初始化

为了快速启动一个 Vue 3 项目，我们直接使用当下最热门的工具 Vite 来初始化项目。整个过程一气呵成，行云流水。

```bash
npm init vite-app vue3-app
```

```bash
# 打开生成的项目文件夹
cd vue3-app
# 安装依赖
npm install
# 启动项目
npm run dev
```

我们打开 `App.vue` 将生成的代码先删掉。

## 组合 API 的入口

接下来我们将通过 [Hacker News API](https://hn.algolia.com/api) 来获取一些热门文章，Hacker News API返回的数据结构如下：

```json
{
  "hits": [
    {
      "objectID": "24518295",
      "title": "Vue.js 3",
      "url": "https://github.com/vuejs/vue-next/releases/tag/v3.0.0",
    },
    {...},
    {...},
  ]
}
```

我们通过 `ui > li` 将新闻列表展示到界面上，新闻数据从 `hits` 遍历中获取。

```html
<template>
  <ul>
    <li
      v-for="item of hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({
      hits: []
    })
    return state
  }
}
</script>
```

在讲解数据请求前，我看先看看 `setup()` 方法，组合 API 需要通过 `setup()` 方法来启动，`setup()` 返回的数据可以在模板内使用，可以简单理解为 Vue 2 里面 `data()` 方法返回的数据，不同的是，返回的数据需要先经过 `reactive()` 方法进行包裹，将数据变成响应式。

## 组合 API 中请求数据

在 Vue 2 中，我们请求数据时，通常需要将发起请求的代码放到某个生命周期中（`created` 或 `mounted`）。在 `setup()` 方法内，我们可以使用 Vue 3 提供的[生命周期钩子](https://vue3js.cn/docs/zh/guide/composition-api-lifecycle-hooks.html)将请求放到特定生命周期内，关于生命周期钩子方法与之前生命周期的对比如下：

![生命周期](https://file.shenfq.com/pic/20201019144935.png)

可以看到，基本上就是在之前的方法名前加上了一个 `on`，且并没有提供 `onCreated` 的钩子，因为在 `setup()` 内执行就相当于在 `created` 阶段执行。下面我们在 `mounted` 阶段来请求数据：

```js
import { reactive, onMounted } from 'vue'

export default {
  setup() {
    const state = reactive({
      hits: []
    })
    onMounted(async () => {
      const data = await fetch(
        'https://hn.algolia.com/api/v1/search?query=vue'
      ).then(rsp => rsp.json())
      state.hits = data.hits
    })
    return state
  }
}
```

最后效果如下：

![Demo](https://file.shenfq.com/pic/20201019150631.png)

## 监听数据变动

Hacker News 的查询接口有一个 query 参数，前面的案例中，我们将这个参数固定了，现在我们通过响应式的数据来定义这个变量。

```html
<template>
  <input type="text" v-model="query" />
  <ul>
    <li
      v-for="item of hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import { reactive, onMounted } from 'vue'

export default {
  setup() {
    const state = reactive({
      query: 'vue',
      hits: []
    })
    onMounted((async () => {
      const data = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${state.query}`
      ).then(rsp => rsp.json())
      state.hits = data.hits
    })
    return state
  }
}
</script>
```

现在我们在输入框修改，就能触发 `state.query` 同步更新，但是并不会触发 fetch 重新调用，所以我们需要通过 `watchEffect()` 来监听响应数据的变化。

```js
import { reactive, onMounted, watchEffect } from 'vue'

export default {
  setup() {
    const state = reactive({
      query: 'vue',
      hits: []
    })
    const fetchData = async (query) => {
      const data = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      ).then(rsp => rsp.json())
      state.hits = data.hits
    }
    onMounted(() => {
      fetchData(state.query)
      watchEffect(() => {
        fetchData(state.query)
      })
    })
    return state
  }
}
```

由于 `watchEffect()` 首次调用的时候，其回调就会执行一次，造成初始化时会请求两次接口，所以我们需要把 `onMounted` 中的 `fetchData` 删掉。

```diff
onMounted(() => {
- fetchData(state.query)
  watchEffect(() => {
    fetchData(state.query)
  })
})
```



![Demo](https://file.shenfq.com/pic/20201019202029.gif)

`watchEffect()` 会监听传入函数内所有的响应式数据，一旦其中的某个数据发生变化，函数就会重新执行。如果要取消监听，可以调用 `watchEffect()` 的返回值，它的返回值为一个函数。下面举个例子：

```js
const stop = watchEffect(() => {
  if (state.query === 'vue3') {
    // 当 query 为 vue3 时，停止监听
    stop()
  }
  fetchData(state.query)
})
```

当我们在输入框输入 `"vue3"` 后，就不会再发起请求了。

![Demo](https://file.shenfq.com/pic/20201019202323.gif)

## 返回事件方法

现在有个问题就是 input 内的值每次修改都会触发一次请求，我们可以增加一个按钮，点击按钮后再触发 `state.query` 的更新。

``` html
<template>
  <input type="text" v-model="input" />
  <button @click="setQuery">搜索</button>
  <ul>
    <li
      v-for="item of hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import { reactive, onMounted, watchEffect } from 'vue'

export default {
  setup() {
    const state = reactive({
      input: 'vue',
      query: 'vue',
      hits: []
    })
    const fetchData = async (query) => {
      const data = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      ).then(rsp => rsp.json())
      state.hits = data.hits
    }
    onMounted(() => {
      watchEffect(() => {
        fetchData(state.query)
      })
    })
    
    const setQuery = () => {
      state.query = state.input
    }
    return { setQuery, state }
  }
}
</script>
```

可以注意到 button 绑定的 click 事件的方法，也是通过 `setup()` 方法返回的，我们可以将 `setup()` 方法返回值理解为 Vue2 中 `data()` 方法和 `methods` 对象的合并。

原先的返回值 state 变成了现在返回值的一个属性，所以我们在模板层取数据的时候，需要进行一些修改，在前面加上 `state.`。

```html
<template>
  <input type="text" v-model="state.input" />
  <button @click="setQuery">搜索</button>
  <ul>
    <li
      v-for="item of state.hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>
```

![Demo](https://file.shenfq.com/pic/20201019205400.gif)

## 返回数据修改

作为强迫症患者，在模板层通过 `state.xxx` 的方式获取数据实在是难受，那我们是不是可以通过对象解构的方式将 `state` 的数据返回呢？

```html
<template>
  <input type="text" v-model="input" />
  <button class="search-btn" @click="setQuery">搜索</button>
  <ul class="results">
    <li
      v-for="item of hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import { reactive, onMounted, watchEffect } from 'vue'

export default {
  setup(props, ctx) {
    const state = reactive({
      input: 'vue',
      query: 'vue',
      hits: []
    })
    // 省略部分代码...
    return {
      ...state,
      setQuery,
    }
  }
}
</script>
```

答案是『不可以』。修改代码后，可以看到页面虽然发起了请求，但是页面并没有展示数据。

`state` 在解构后，数据就变成了静态数据，不能再被跟踪，返回值类似于：

```js
export default {
  setup(props, ctx) {
    // 省略部分代码...
    return {
      input: 'vue',
      query: 'vue',
      hits: [],
      setQuery,
    }
  }
}
```

![Demo](https://file.shenfq.com/pic/20201019210700.png)

为了跟踪基础类型的数据（即非对象数据），Vue3 也提出了解决方案：`ref()` 。

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

上面为 Vue 3 的官方案例，`ref()` 方法返回的是一个对象，无论是修改还是获取，都需要取返回对象的 `value` 属性。

我们将 `state` 从响应对象改为一个普通对象，然后所有属性都使用 `ref` 包裹，这样修改后，后续的解构才做才能生效。这样的弊端就是，`state` 的每个属性在修改时，都必须取其 `value` 属性。但是在模板中不需要追加 `.value`，Vue 3 内部有对其进行处理。

```js
import { ref, onMounted, watchEffect } from 'vue'
export default {
  setup() {
    const state = {
      input: ref('vue'),
      query: ref('vue'),
      hits: ref([])
    }
    const fetchData = async (query) => {
      const data = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      ).then(rsp => rsp.json())
      state.hits.value = data.hits
    }
    onMounted(() => {
      watchEffect(() => {
        fetchData(state.query.value)
      })
    })
    const setQuery = () => {
      state.query.value = state.input.value
    }
    return {
      ...state,
      setQuery,
    }
  }
}
```

有没有办法保持 `state` 为响应对象，同时又支持其对象解构的呢？当然是有的，Vue 3 也提供了解决方案：`toRefs()` 。`toRefs()` 方法可以将一个响应对象变为普通对象，并且给每个属性加上 `ref()`。

```js
import { toRefs, reactive, onMounted, watchEffect } from 'vue'

export default {
  setup() {
    const state = reactive({
      input: 'vue',
      query: 'vue',
      hits: []
    })
    const fetchData = async (query) => {
      const data = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${query}`
      ).then(rsp => rsp.json())
      state.hits = data.hits
    }
    onMounted(() => {
      watchEffect(() => {
        fetchData(state.query)
      })
    })
    const setQuery = () => {
      state.query = state.input
    }
    return {
      ...toRefs(state),
      setQuery,
    }
  }
}
```

## Loading 与 Error 状态

通常，我们发起请求的时候，需要为请求添加 Loading 和 Error 状态，我们只需要在 `state` 中添加两个变量来控制这两种状态即可。

```js
export default {
  setup() {
    const state = reactive({
      input: 'vue',
      query: 'vue',
      hits: [],
      error: false,
      loading: false,
    })
    const fetchData = async (query) => {
      state.error = false
      state.loading = true
      try {
        const data = await fetch(
          `https://hn.algolia.com/api/v1/search?query=${query}`
        ).then(rsp => rsp.json())
        state.hits = data.hits
      } catch {
        state.error = true
      }
      state.loading = false
    }
    onMounted(() => {
      watchEffect(() => {
        fetchData(state.query)
      })
    })
    const setQuery = () => {
      state.query = state.input
    }
    return {
      ...toRefs(state),
      setQuery,
    }
  }
}
```

同时在模板使用这两个变量：

```html
<template>
  <input type="text" v-model="input" />
  <button @click="setQuery">搜索</button>
  <div v-if="loading">Loading ...</div>
  <div v-else-if="error">Something went wrong ...</div>
  <ul v-else>
    <li
      v-for="item of hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>
```

展示 Loading、Error 状态：

![Demo](https://file.shenfq.com/pic/20201019225828.gif)

## 将数据请求逻辑抽象

用过 umi 的同学肯定知道 umi 提供了一个叫做 useRequest 的 Hooks，用于请求数据非常的方便，那么我们通过 Vue 的组合 API 也可以抽象出一个类似于 useRequest 的公共方法。

接下来我们新建一个文件 `useRequest.js` ：

```js
import {
  toRefs,
  reactive,
} from 'vue'

export default (options) => {
  const { url } = options
  const state = reactive({
    data: {},
    error: false,
    loading: false,
  })

  const run = async () => {
    state.error = false
    state.loading = true
    try {
      const result = await fetch(url).then(res => res.json())
      state.data = result
    } catch(e) {
      state.error = true
    }
    state.loading = false
  }

  return {
    run,
    ...toRefs(state)
  }
}
```

然后在 `App.vue` 中引入：

```html
<template>
  <input type="text" v-model="query" />
  <button @click="search">搜索</button>
  <div v-if="loading">Loading ...</div>
  <div v-else-if="error">Something went wrong ...</div>
  <ul v-else>
    <li
      v-for="item of data.hits"
      :key="item.objectID"
    >
      <a :href="item.url">{{item.title}}</a>
    </li>
  </ul>
</template>

<script>
import { ref, onMounted } from 'vue'
import useRequest from './useRequest'

export default {
  setup() {
    const query = ref('vue')
    const { data, loading, error, run } = useRequest({
      url: 'https://hn.algolia.com/api/v1/search'
    })
    onMounted(() => {
      run()
    })
    return {
      data,
      query,
      error,
      loading,
      search: run,
    }
  }
}
</script>
```

当前的 `useRequest` 还有两个缺陷：

1. 传入的 url 是固定的，query 修改后，不能及时的反应到 url 上；
2. 不能自动请求，需要手动调用一下 run 方法；

```js
import {
  isRef,
  toRefs,
  reactive,
  onMounted,
} from 'vue'

export default (options) => {
  const { url, manual = false, params = {} } = options

  const state = reactive({
    data: {},
    error: false,
    loading: false,
  })

  const run = async () => {
    // 拼接查询参数
    let query = ''
    Object.keys(params).forEach(key => {
      const val = params[key]
      // 如果去 ref 对象，需要取 .value 属性
      const value = isRef(val) ? val.value : val
      query += `${key}=${value}&`
    })
    state.error = false
    state.loading = true
    try {
      const result = await fetch(`${url}?${query}`)
      	.then(res => res.json())
      state.data = result
    } catch(e) {
      state.error = true
    }
    state.loading = false
  }

  onMounted(() => {
    // 第一次是否需要手动调用
    !manual && run()
  })

  return {
    run,
    ...toRefs(state)
  }
}
```

经过修改后，我们的逻辑就变得异常简单了。

```js
import useRequest from './useRequest'

export default {
  setup() {
    const query = ref('vue')
    const { data, loading, error, run } = useRequest(
      {
        url: 'https://hn.algolia.com/api/v1/search',
        params: {
          query
        }
      }
    )
    return {
      data,
      query,
      error,
      loading,
      search: run,
    }
  }
}
```

当然，这个 `useRequest` 还有很多可以完善的地方，例如：不支持 http 方法修改、不支持节流防抖、不支持超时时间等等。最后，希望大家看完文章后能有所收获。