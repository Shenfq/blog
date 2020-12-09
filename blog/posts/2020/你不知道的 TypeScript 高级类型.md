---
title: 你不知道的 TypeScript 高级类型
author: shenfq
date: 2020/08/28
categories:
- 前端
tags:
- JavaScript
- TypeScript
- 类型系统
- 泛型
---
## 前言

对于有 JavaScript 基础的同学来说，入门 TypeScript 其实很容易，只需要简单掌握其基础的类型系统就可以逐步将 JS 应用过渡到 TS 应用。

```ts
// js
const double = (num) => 2 * num

// ts
const double = (num: number): number => 2 * num
```

然而，当应用越来越复杂，我们很容易把一些变量设置为 any 类型，TypeScript 写着写着也就成了 AnyScript。为了让大家能更加深入的了解 TypeScript 的类型系统，本文将重点介绍其高级类型，帮助大家摆脱 AnyScript。

## 泛型

在讲解高级类型之前，我们需要先简单理解泛型是什么。

泛型是强类型语言中比较重要的一个概念，合理的使用泛型可以提升代码的可复用性，让系统更加灵活。下面是维基百科对泛型的描述：

> 泛型允许程序员在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型。

泛型通过一对尖括号来表示(`<>`)，尖括号内的字符被称为*类型变量*，这个变量用来表示类型。

```ts
function copy<T>(arg: T): T {
  if (typeof arg === 'object') {
    return JSON.parse(
      JSON.stringify(arg)
    )
  } else {
    return arg
  }
}
```

这个类型 T，在没有调用 copy 函数的时候并不确定，只有调用 copy 的时候，我们才知道 T 具体代表什么类型。

```ts
const str = copy<string>('my name is typescript')
```

![类型](https://file.shenfq.com/ipic/2020-08-26-135150.png)

我们在 VS Code 中可以看到 copy 函数的参数以及返回值已经有了类型，也就是说我们调用 copy 函数的时候，给类型变量 T 赋值了 string。其实，我们在调用 copy 的时候可以省略尖括号，通过 TS 的类型推导是可以确定 T 为 string 的。

![类型推导](https://file.shenfq.com/ipic/2020-08-26-135601.png)

## 高级类型

除了 string、number、boolean 这种基础类型外，我们还应该了解一些类型声明中的一些高级用法。

### 交叉类型（&）

交叉类型说简单点就是将多个类型合并成一个类型，个人感觉叫做「合并类型」更合理一点，其语法规则和逻辑 “与” 的符号一致。

```ts
T & U
```

假如，我现在有两个类，一个按钮，一个超链接，现在我需要一个带有超链接的按钮，就可以使用交叉类型来实现。

```ts
interface Button {
  type: string
  text: string
}

interface Link {
  alt: string
  href: string
}

const linkBtn: Button & Link = {
  type: 'danger',
  text: '跳转到百度',
  alt: '跳转到百度',
  href: 'http://www.baidu.com'
}
```

### 联合类型（|）

联合类型的语法规则和逻辑 “或” 的符号一致，表示其类型为连接的多个类型中的任意一个。

```ts
T | U
```

例如，之前的 Button 组件，我们的 type 属性只能指定固定的几种字符串。

```ts
interface Button {
  type: 'default' | 'primary' | 'danger'
  text: string
}

const btn: Button = {
  type: 'primary',
  text: '按钮'
}
```

### 类型别名（type）

前面提到的交叉类型与联合类型如果有多个地方需要使用，就需要通过类型别名的方式，给这两种类型声明一个别名。类型别名与声明变量的语法类似，只需要把 `const`、`let` 换成 `type` 关键字即可。

```ts
type Alias = T | U
```

```ts
type InnerType = 'default' | 'primary' | 'danger'

interface Button {
  type: InnerType
  text: string
}

interface Alert {
  type: ButtonType
  text: string
}
```

### 类型索引（keyof）

`keyof` 类似于 `Object.keys` ，用于获取一个接口中 Key 的联合类型。

```ts
interface Button {
    type: string
    text: string
}

type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
```

还是拿之前的 Button 类来举例，Button 的 type 类型来自于另一个类 ButtonTypes，按照之前的写法，每次 ButtonTypes 更新都需要修改 Button 类，如果我们使用 `keyof` 就不会有这个烦恼。

```ts
interface ButtonStyle {
    color: string
    background: string
}
interface ButtonTypes {
    default: ButtonStyle
    primary: ButtonStyle
    danger: ButtonStyle
}
interface Button {
    type: 'default' | 'primary' | 'danger'
    text: string
}

// 使用 keyof 后，ButtonTypes修改后，type 类型会自动修改 
interface Button {
    type: keyof ButtonTypes
    text: string
}

```

### 类型约束（extends）

这里的 `extends` 关键词不同于在 class 后使用 `extends` 的继承作用，泛型内使用的主要作用是对泛型加以约束。我们用我们前面写过的 copy 方法再举个例子：

```ts
type BaseType = string | number | boolean

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}
```

![copy number](https://file.shenfq.com/ipic/2020-08-27-062957.png)

如果我们传入一个对象就会有问题。

![copy object](https://file.shenfq.com/ipic/2020-08-27-063107.png)

`extends` 经常与 `keyof` 一起使用，例如我们有一个方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用 `extends` 和 `keyof` 进行约束。 

```ts
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')
```

![获取对象的值](https://file.shenfq.com/ipic/2020-08-27-074835.png)

这里的 getValue 方法就能根据传入的参数 obj 来约束 key 的值。

### 类型映射（in）

`in` 关键词的作用主要是做类型的映射，遍历已有接口的 key 或者是遍历联合类型。下面使用内置的泛型接口 `Readonly` 来举例。

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string
  b: string
}

type ReadOnlyObj = Readonly<Obj>
```

![ReadOnlyObj](https://file.shenfq.com/ipic/2020-08-27-075646.png)

我们可以结构下这个逻辑，首先 `keyof Obj` 得到一个联合类型 `'a' | 'b'`。

```ts
interface Obj {
    a: string
    b: string
}

type ObjKeys = 'a' | 'b'

type ReadOnlyObj = {
    readonly [P in ObjKeys]: Obj[P];
}
```

然后 `P in ObjKeys` 相当于执行了一次 forEach 的逻辑，遍历 `'a' | 'b'`

```ts
type ReadOnlyObj = {
    readonly a: Obj['a'];
    readonly b: Obj['b'];
}
```

最后就可以得到一个新的接口。

```ts
interface ReadOnlyObj {
    readonly a: string;
    readonly b: string;
}
```

### 条件类型（U ? X : Y）

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

```ts
T extends U ? X : Y
```

上面的意思就是，如果 T 是 U 的子集，就是类型 X，否则为类型 Y。下面使用内置的泛型接口 `Extract` 来举例。

```ts
type Extract<T, U> = T extends U ? T : never;
```

如果 T 中的类型在 U 存在，则返回，否则抛弃。假设我们两个类，有三个公共的属性，可以通过 Extract 提取这三个公共属性。

```tsx
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}

interface Student {
  name: string
  age: number
  email: string
  grade: number
}


type CommonKeys = Extract<keyof Worker, keyof Student>
// 'name' | 'age' | 'email'
```

![CommonKeys](https://file.shenfq.com/ipic/2020-08-27-125507.png)

## 工具泛型

TypesScript 中内置了很多工具泛型，前面介绍过 `Readonly`、`Extract` 这两种，内置的泛型在 TypeScript 内置的 `lib.es5.d.ts` 中都有定义，所以不需要任何依赖都是可以直接使用的。下面看看一些经常使用的工具泛型吧。

![lib.es5.d.ts](https://file.shenfq.com/ipic/2020-08-27-133220.png)

### Partial

```ts
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```

`Partial` 用于将一个接口的所有属性设置为可选状态，首先通过 `keyof T`，取出类型变量 `T` 的所有属性，然后通过 `in` 进行遍历，最后在属性后加上一个 `?`。

我们通过 TypeScript 写 React 的组件的时候，如果组件的属性都有默认值的存在，我们就可以通过 `Partial` 将属性值都变成可选值。

```tsx
import React from 'react'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  text: string
  disabled: boolean
  onClick: () => void
}

// 将按钮组件的 props 的属性都改为可选
const render = (props: Partial<ButtonProps> = {}) => {
  const baseProps = {
    disabled: false,
    type: 'button',
    text: 'Hello World',
    onClick: () => {},
  }
  const options = { ...baseProps, ...props }
  return (
    <button
      type={options.type}
      disabled={options.disabled}
      onClick={options.onClick}>
      {options.text}
    </button>
  )
}
```

### Required

```ts
type Required<T> = {
    [P in keyof T]-?: T[P]
}
```

`Required` 的作用刚好与  `Partial` 相反，就是将接口中所有可选的属性改为必须的，区别就是把 `Partial` 里面的 `?` 替换成了 `-?`。

### Record

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T
}
```

`Record` 接受两个类型变量，`Record` 生成的类型具有类型 K 中存在的属性，值为类型 T。这里有一个比较疑惑的点就是给类型 K 加一个类型约束，`extends keyof any`，我们可以先看看 `keyof any` 是个什么东西。

![keyof any](https://file.shenfq.com/ipic/2020-08-27-132145.png)

大致一直就是类型  K 被约束在 `string | number | symbol` 中，刚好就是对象的索引的类型，也就是类型 K 只能指定为这几种类型。

我们在业务代码中经常会构造某个对象的数组，但是数组不方便索引，所以我们有时候会把对象的某个字段拿出来作为索引，然后构造一个新的对象。假设有个商品列表的数组，要在商品列表中找到商品名为 「每日坚果」的商品，我们一般通过遍历数组的方式来查找，比较繁琐，为了方便，我们就会把这个数组改写成对象。

```ts
interface Goods {
  id: string
  name: string
  price: string
  image: string
}

const goodsMap: Record<string, Goods> = {}
const goodsList: Goods[] = await fetch('server.com/goods/list')

goodsList.forEach(goods => {
  goodsMap[goods.name] = goods
})
```

### Pick

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

`Pick` 主要用于提取接口的某几个属性。做过 Todo 工具的同学都知道，Todo工具只有编辑的时候才会填写描述信息，预览的时候只有标题和完成状态，所以我们可以通过 `Pick` 工具，提取 Todo 接口的两个属性，生成一个新的类型 TodoPreview。

```ts
interface Todo {
  title: string
  completed: boolean
  description: string
}

type TodoPreview = Pick<Todo, "title" | "completed">

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

![TodoPreview](https://file.shenfq.com/ipic/2020-08-27-134906.png)

### Exclude

```ts
type Exclude<T, U> = T extends U ? never : T
```

`Exclude` 的作用与之前介绍过的 `Extract` 刚好相反，如果 T 中的类型在 U 不存在，则返回，否则抛弃。现在我们拿之前的两个类举例，看看 `Exclude` 的返回结果。

```ts
interface Worker {
  name: string
  age: number
  email: string
  salary: number
}

interface Student {
  name: string
  age: number
  email: string
  grade: number
}


type ExcludeKeys = Exclude<keyof Worker, keyof Student>
// 'salary'
```

![ExcludeKeys](https://file.shenfq.com/ipic/2020-08-28-021608.png)

取出的是 Worker 在 Student 中不存在的 `salary`。

### Omit

```ts
type Omit<T, K extends keyof any> = Pick<
  T, Exclude<keyof T, K>
>
```

`Omit` 的作用刚好和 Pick 相反，先通过 `Exclude<keyof T, K>` 先取出类型 T 中存在，但是 K 不存在的属性，然后再由这些属性构造一个新的类型。还是通过前面的 Todo 案例来说，TodoPreview 类型只需要排除接口的 description 属性即可，写法上比之前 Pick 精简了一些。

```ts
interface Todo {
  title: string
  completed: boolean
  description: string
}

type TodoPreview = Omit<Todo, "description">

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

![TodoPreview](https://file.shenfq.com/ipic/2020-08-28-022345.png)



## 总结

如果只是掌握了 TypeScript 的一些基础类型，可能很难游刃有余的去使用 TypeScript，而且最近 TypeScript 发布了 4.0 的版本新增了更多功能，想要用好它只能不断的学习和掌握它。希望阅读本文的朋友都能有所收获，摆脱 AnyScript。

