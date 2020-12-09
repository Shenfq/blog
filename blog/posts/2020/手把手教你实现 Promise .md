---
title: 手把手教你实现 Promise 
date: 2020/09/01
categories:
- Promise
tags:
- 前端
- Promise
- JavaScript
---

## 前言

很多 JavaScript 的初学者都曾感受过被回调地狱支配的恐惧，直至掌握了 Promise 语法才算解脱。虽然很多语言都早已内置了 Promise ，但是 JavaScript 中真正将其发扬光大的还是 jQuery 1.5 对 `$.ajax` 的重构，支持了 Promise，而且用法也和 jQuery 推崇的链式调用不谋而合。后来 ES6 出世，大家才开始进入全民 Promise 的时代，再后来 ES8 又引入了 async 语法，让 JavaScript 的异步写法更加优雅。

今天我们就一步一步来实现一个 Promise，如果你还没有用过 Promise，建议先熟悉一下 Promise 语法再来阅读本文。



## 构造函数

在已有的 [`Promise/A+` 规范](https://www.ituring.com.cn/article/66566)中并没有规定 promise 对象从何而来，在 jQuery 中通过调用 `$.Deferred()` 得到 promise 对象，ES6 中通过实例化 Promise 类得到 promise 对象。这里我们使用 ES 的语法，构造一个类，通过实例化的方式返回 promise 对象，由于 Promise 已经存在，我们暂时给这个类取名为 `Deferred`。

```js
class Deferred {
  constructor(callback) {
    const resolve = () => {
      // TODO
    }
    const reject = () => {
      // TODO
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}
```

构造函数接受一个 callback，调用 callback 的时候需传入 resolve、reject 两个方法。

### Promise 的状态

Promise 一共分为三个状态：

![状态](https://file.shenfq.com/ipic/2020-08-31-120006.png)

- ⏳`pending`：等待中，这是 Promise 的初始状态；![pending](https://file.shenfq.com/ipic/2020-08-29-155250.png)
- 🙆‍♂️`fulfilled`：已结束，正常调用 resolve 的状态；![fulfilled](https://file.shenfq.com/ipic/2020-08-29-155308.png)
- 🙅‍♂️`rejected`：已拒绝，内部出现错误，或者是调用 reject 之后的状态；![rejected](https://file.shenfq.com/ipic/2020-08-29-155314.png)

我们可以看到 Promise 在运行期间有一个状态，存储在 `[[PromiseState]]` 中。下面我们为 Deferred 添加一个状态。

```js
//基础变量的定义
const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

class Deferred {
  constructor(callback) {
    this.status = STATUS.PENDING

    const resolve = () => {
      // TODO
    }
    const reject = () => {
      // TODO
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```

这里还有个有意思的事情，早期浏览器的实现中 fulfilled 状态是 resolved，明显与 Promise 规范不符。当然，现在已经修复了。

![Chrome Bug](https://file.shenfq.com/ipic/2020-08-31-064915.png)

### 内部结果

除开状态，Promise 内部还有个结果 `[[PromiseResult]]`，用来暂存 resolve/reject 接受的值。

![resolve result](https://file.shenfq.com/ipic/2020-08-31-064452.png)

![reject result](https://file.shenfq.com/ipic/2020-08-31-064521.png)

继续在构造函数中添加一个内部结果。

```js
class Deferred {
  constructor(callback) {
    this.value = undefined
    this.status = STATUS.PENDING

    const resolve = value => {
      this.value = value
      // TODO
    }
    const reject = reason => {
      this.value = reason
      // TODO
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```

### 储存回调

使用 Promise 的时候，我们一般都会调用 promise 对象的 `.then` 方法，在 promise 状态转为 `fulfilled` 或 `rejected` 的时候，拿到内部结果，然后做后续的处理。所以构造函数中，还需要构造两个数组，用来存储 `.then` 方法传入的回调。

```js
class Deferred {
  constructor(callback) {
    this.value = undefined
    this.status = STATUS.PENDING

    this.rejectQueue = []
    this.resolveQueue = []

    const resolve = value => {
      this.value = value
      // TODO
    }
    const reject = reason => {
      this.value = reason
      // TODO
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```

## `resolve` 与 `reject`

### 修改状态

接下来，我们需要实现 resolve 和 reject 两个方法，这两个方法在被调用的时候，会改变 promise 对象的状态。而且任意一个方法在被调用之后，另外的方法是无法被调用的。

```js
new Promise((resolve, reject) => {
	setTimeout(() => {
    resolve('🙆‍♂️')
  }, 500)
  setTimeout(() => {
    reject('🙅‍♂️')
  }, 800)
}).then(
  () => {
    console.log('fulfilled')
  },
  () => {
    console.log('rejected')
  }
)
```

![运行结果](https://file.shenfq.com/ipic/2020-08-31-122023.png)

此时，控制台只会打印出 `fulfilled`，并不会出现 `rejected`。

```js
class Deferred {
  constructor(callback) {
    this.value = undefined
    this.status = STATUS.PENDING

    this.rejectQueue = []
    this.resolveQueue = []

    let called // 用于判断状态是否被修改
    const resolve = value => {
			if (called) return
      called = true
      this.value = value
      // 修改状态
      this.status = STATUS.FULFILLED
    }
    const reject = reason => {
			if (called) return
      called = true
      this.value = reason
      // 修改状态
      this.status = STATUS.REJECTED
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```

### 调用回调

修改完状态后，拿到结果的 promise 一般会调用 then 方法传入的回调。

```js
class Deferred {
  constructor(callback) {
    this.value = undefined
    this.status = STATUS.PENDING

    this.rejectQueue = []
    this.resolveQueue = []

    let called // 用于判断状态是否被修改
    const resolve = value => {
			if (called) return
      called = true
      this.value = value
      // 修改状态
      this.status = STATUS.FULFILLED
      // 调用回调
      for (const fn of this.resolveQueue) {
        fn(this.value)
      }
    }
    const reject = reason => {
			if (called) return
      called = true
      this.value = reason
      // 修改状态
      this.status = STATUS.REJECTED
      // 调用回调
      for (const fn of this.rejectQueue) {
        fn(this.value)
      }
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```



熟悉 JavaScript 事件系统的同学应该知道，`promise.then` 方法中的回调会被放置到微任务队列中，然后异步调用。

![MDN文档](https://file.shenfq.com/ipic/2020-08-31-123307.png)

所以，我们需要将回调的调用放入异步队列，这里我们可以放到 setTimeout 中进行延迟调用，虽然不太符合规范，但是将就将就。

```js
class Deferred {
  constructor(callback) {
    this.value = undefined
    this.status = STATUS.PENDING

    this.rejectQueue = []
    this.resolveQueue = []

    let called // 用于判断状态是否被修改
    const resolve = value => {
			if (called) return
      called = true
      // 异步调用
      setTimeout(() => {
      	this.value = value
        // 修改状态
        this.status = STATUS.FULFILLED
        // 调用回调
        for (const fn of this.resolveQueue) {
          fn(this.value)
        }
      })
    }
    const reject = reason => {
			if (called) return
      called = true
      // 异步调用
      setTimeout(() =>{
        this.value = reason
        // 修改状态
        this.status = STATUS.REJECTED
        // 调用回调
        for (const fn of this.rejectQueue) {
          fn(this.value)
        }
      })
    }
    try {
      callback(resolve, reject)
    } catch (error) {
      // 出现异常直接进行 reject
      reject(error)
    }
  }
}
```

## then 方法

接下来我们需要实现 then 方法，用过 Promise 的同学肯定知道，then 方法是能够继续进行链式调用的，所以 then 必须要返回一个 promise 对象。但是在 `Promise/A+` 规范中，有明确的规定，then 方法返回的是一个新的 promise 对象，而不是直接返回 this，这一点我们可以通过下面代码验证一下。

![then的结果](https://file.shenfq.com/ipic/2020-08-31-115612.png)

可以看到 `p1` 对象和 `p2` 是两个不同的对象，并且 then 方法返回的 `p2` 对象也是 Promise 的实例。

除此之外，then 方法还需要判断当前状态，如果当前状态不是 `pending` 状态，则可以直接调用传入的回调，而不用再放入队列进行等待。

```js
class Deferred {
  then(onResolve, onReject) {
    if (this.status === STATUS.PENDING) {
      // 将回调放入队列中
      const rejectQueue = this.rejectQueue
      const resolveQueue = this.resolveQueue
      return new Deferred((resolve, reject) => {
        // 暂存到成功回调等待调用
        resolveQueue.push(function (innerValue) {
          try {
            const value = onResolve(innerValue)
            // 改变当前 promise 的状态
            resolve(value)
          } catch (error) {
            reject(error)
          }
        })
        // 暂存到失败回调等待调用
        rejectQueue.push(function (innerValue) {
          try {
            const value = onReject(innerValue)
            // 改变当前 promise 的状态
            resolve(value)
          } catch (error) {
            reject(error)
          }
        })
      })
    } else {
      const innerValue = this.value
      const isFulfilled = this.status === STATUS.FULFILLED
      return new Deferred((resolve, reject) => {
        try {
          const value = isFulfilled
            ? onResolve(innerValue) // 成功状态调用 onResolve
            : onReject(innerValue) // 失败状态调用 onReject
          resolve(value) // 返回结果给后面的 then
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
```

现在我们的逻辑已经可以基本跑通，我们先试运行一段代码：

```js
new Deferred(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 3000)
}).then(val1 => {
  console.log('val1', val1)
  return val1 * 2
}).then(val2 => {
  console.log('val2', val2)
  return val2
})
```

3 秒后，控制台出现如下结果：

![试运行](https://file.shenfq.com/ipic/2020-08-31-162512.png)

可以看到，这基本符合我们的预期。

### 值穿透

如果我们在调用 then 的时候，如果没有传入任何的参数，按照规范，当前 promise 的值是可以透传到下一个 then 方法的。例如，如下代码：

```js
new Deferred(resolve => {
  resolve(1)
})
  .then()
  .then()
  .then(val => {
    console.log(val)
  })
```

![值穿透](https://file.shenfq.com/ipic/2020-08-31-163022.png)

在控制台并没有看到任何输出，而切换到 Promise 是可以看到正确结果的。

![值穿透](https://file.shenfq.com/ipic/2020-08-31-163122.png)

要解决这个方法很简单，只需要在 then 调用的时候判断参数是否为一个函数，如果不是则需要给一个默认值。

```js
const isFunction = fn => typeof fn === 'function'

class Deferred {
  then(onResolve, onReject) {
    // 解决值穿透
    onReject = isFunction(onReject) ? onReject : reason => { throw reason }
    onResolve = isFunction(onResolve) ? onResolve : value => { return value }
    if (this.status === STATUS.PENDING) {
      // ...
    } else {
      // ...
    }
  }
}
```

![值穿透](https://file.shenfq.com/ipic/2020-08-31-164124.png)

现在我们已经可以拿到正确结果了。

### 一步之遥

现在我们距离完美实现 then 方法只差一步之遥，那就是我们在调用 then 方法传入的 `onResolve/onReject` 回调时，还需要判断他们的返回值。如果回调的内部返回的就是一个 promise 对象，我们应该如何处理？或者出现了循环引用，我们又该怎么处理？

前面我们在拿到 `onResolve/onReject` 的返回值后，直接就调用了 `resolve` 或者 `resolve`，现在我们需要把他们的返回值进行一些处理。

```diff
then(onResolve, onReject) {
  // 解决值穿透代码已经省略
  if (this.status === STATUS.PENDING) {
    // 将回调放入队列中
    const rejectQueue = this.rejectQueue
    const resolveQueue = this.resolveQueue
    const promise = new Deferred((resolve, reject) => {
      // 暂存到成功回调等待调用
      resolveQueue.push(function (innerValue) {
        try {
          const value = onResolve(innerValue)
-         resolve(value)
+         doThenFunc(promise, value, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
      // 暂存到失败回调等待调用
      rejectQueue.push(function (innerValue) {
        try {
          const value = onReject(innerValue)
-         resolve(value)
+         doThenFunc(promise, value, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    })
    return promise
  } else {
    const innerValue = this.value
    const isFulfilled = this.status === STATUS.FULFILLED
    const promise = new Deferred((resolve, reject) => {
      try {
        const value = isFulfilled
        ? onResolve(innerValue) // 成功状态调用 onResolve
        : onReject(innerValue) // 失败状态调用 onReject
-       resolve(value)
+       doThenFunc(promise, value, resolve, reject)
      } catch (error) {
        reject(error)
      }
    })
    return promise
  }
}
```

#### 返回值判断

在我们使用 Promise 的时候，经常会在 then 方法中返回一个新的 Promise，然后把新的 Promise 完成后的内部结果再传递给后面的 then 方法。

```js
fetch('server/login')
	.then(user => {
  	// 返回新的 promise 对象
  	return fetch(`server/order/${user.id}`)
	})
	.then(order => {
  	console.log(order)
	})
```

```js
function doThenFunc(promise, value, resolve, reject) {
  // 如果 value 是 promise 对象
  if (value instanceof Deferred) {
    // 调用 then 方法，等待结果
    value.then(
      function (val) {
      	doThenFunc(promise, val, resolve, reject)
    	},
      function (reason) {
        reject(reason)
      }
    )
    return
  }
  // 如果非 promise 对象，则直接返回
  resolve(value)
}
```

#### 判断循环引用

如果当前 then 方法回调函数返回值是当前 then 方法产生的新的 promise 对象，则被认为是循环引用，具体案例如下：

![循环引用](https://file.shenfq.com/ipic/2020-09-01-023956.png)

then 方法返回的新的 promise 对象 `p1`，在回调中被当做返回值，此时会抛出一个异常。因为按照之前的逻辑，代码将会一直困在这一段逻辑里。

![循环引用](https://file.shenfq.com/ipic/2020-09-01-033436.png)

所以，我们需要提前预防，及时抛出错误。

```js
function doThenFunc(promise, value, resolve, reject) {
  // 循环引用
  if (promise === value) {
    reject(
    	new TypeError('Chaining cycle detected for promise')
    )
    return
  }
  // 如果 value 是 promise 对象
  if (value instanceof Deferred) {
    // 调用 then 方法，等待结果
    value.then(
      function (val) {
      	doThenFunc(promise, val, resolve, reject)
    	},
      function (reason) {
        reject(reason)
      }
    )
    return
  }
  // 如果非 promise 对象，则直接返回
  resolve(value)
}
```

现在我们再试试在 then 中返回一个新的 promise 对象。

```js
const delayDouble = (num, time) => new Deferred((resolve) => {
  console.log(new Date())
  setTimeout(() => {
    resolve(2 * num)
  }, time)
})

new Deferred(resolve => {
  setTimeout(() => {
    resolve(1)
  }, 2000)
})
  .then(val => {
    console.log(new Date(), val)
    return delayDouble(val, 2000)
  })
  .then(val => {
    console.log(new Date(), val)
  })
```

![运行结果](https://file.shenfq.com/ipic/2020-09-01-035003.png)

上面的结果也是完美符合我们的预期。

## catch 方法

catch 方法其实很简单，相当于 then 方法的一个简写。

```js
class Deferred {
  constructor(callback) {}
  then(onResolve, onReject) {}
  catch(onReject) {
    return this.then(null, onReject)
  }
}
```

## 静态方法

### resolve/reject

Promise 类还提供了两个静态方法，直接返回状态已经固定的 promise 对象。

```js
class Deferred {
  constructor(callback) {}
  then(onResolve, onReject) {}
  catch(onReject) {}
  
  static resolve(value) {
    return new Deferred((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Deferred((resolve, reject) => {
      reject(reason)
    })
  }
}
```

### all

all 方法接受一个 promise 对象的数组，等数组中所有的 promise 对象的状态变为 `fulfilled`，然后返回结果，其结果也是一个数组，数组的每个值对应的是 promise 对象的内部结果。

首先，我们需要先判断传入的参数是否为数组，然后构造一个结果数组以及一个新的 promise 对象。

```js
class Deferred {
  static all(promises) {
    // 非数组参数，抛出异常
    if (!Array.isArray(promises)) {
      return Deferred.reject(new TypeError('args must be an array'))
    }

		// 用于存储每个 promise 对象的结果
    const result = []
    const length = promises.length
    // 如果 remaining 归零，表示所有 promise 对象已经 fulfilled
    let remaining = length 
    const promise = new Deferred(function (resolve, reject) {
      // TODO
    })
		return promise
  }
}
```

接下来，我们需要进行一下判断，对每个 promise 对象的 resolve 进行拦截，每次 resolve 都需要将 `remaining` 减一，直到 `remaining` 归零。

```js
class Deferred {
  static all(promises) {
    // 非数组参数，抛出异常
    if (!Array.isArray(promises)) {
      return Deferred.reject(new TypeError('args must be an array'))
    }

    const result = [] // 用于存储每个 promise 对象的结果
    const length = promises.length

    let remaining = length
    const promise = new Deferred(function (resolve, reject) {
      // 如果数组为空，则返回空结果
      if (promises.length === 0) return resolve(result)

      function done(index, value) {
        doThenFunc(
          promise,
          value,
          (val) => {
            // resolve 的结果放入 result 中
            result[index] = val
            if (--remaining === 0) {
              // 如果所有的 promise 都已经返回结果
              // 然后运行后面的逻辑
              resolve(result)
            }
          },
          reject
        )
      }
      // 放入异步队列
      setTimeout(() => {
        for (let i = 0; i < length; i++) {
          done(i, promises[i])
        }
      })
    })
		return promise
  }
}
```

下面我们通过如下代码，判断逻辑是否正确。按照预期，代码运行后，在 3 秒之后，控制台会打印一个数组 `[2, 4, 6]`。

```js
const delayDouble = (num, time) => new Deferred((resolve) => {
  setTimeout(() => {
    resolve(2 * num)
  }, time)
})

console.log(new Date())
Deferred.all([
  delayDouble(1, 1000),
  delayDouble(2, 2000),
  delayDouble(3, 3000)
]).then((results) => {
  console.log(new Date(), results)
})
```

![all](https://file.shenfq.com/ipic/2020-09-01-053556.png)

上面的运行结果，基本符合我们的预期。

### race

race 方法同样接受一个 promise 对象的数组，但是它只需要有一个 promise 变为 `fulfilled` 状态就会返回结果。

```js
class Deferred {
  static race(promises) {
    if (!Array.isArray(promises)) {
      return Deferred.reject(new TypeError('args must be an array'))
    }

    const length = promises.length
    const promise = new Deferred(function (resolve, reject) {
      if (promises.length === 0) return resolve([])

      function done(value) {
        doThenFunc(promise, value, resolve, reject)
      }

      // 放入异步队列
      setTimeout(() => {
        for (let i = 0; i < length; i++) {
          done(promises[i])
        }
      })
    })
    return promise
  }
}
```

下面我们将前面验证 all 方法的案例改成 race。按照预期，代码运行后，在 1 秒之后，控制台会打印一个2。

```js
const delayDouble = (num, time) => new Deferred((resolve) => {
  setTimeout(() => {
    resolve(2 * num)
  }, time)
})

console.log(new Date())
Deferred.race([
  delayDouble(1, 1000),
  delayDouble(2, 2000),
  delayDouble(3, 3000)
]).then((results) => {
  console.log(new Date(), results)
})
```

![race](https://file.shenfq.com/ipic/2020-09-01-055513.png)

上面的运行结果，基本符合我们的预期。

## 总结

一个简易版的 Promise 类就已经实现了，这里还是省略了部分细节，完整代码可以访问 [github](https://github.com/Shenfq/polyfill/tree/master/promise)。Promise 的出现为后期的 async 语法打下了坚实基础，下一篇博客可以好好聊一聊 JavaScript 的异步编程史，不小心又给自己挖坑了。。。

