---
title: 在命令行里也能用 React
author: shenfq
date: 2021/07/28
categories:
- 前端
tags:
- 命令行
- 前端框架
- JavaScript
- React
---


# 在命令行里也能用 React

用过 React 的同学都知道，React 作为一个视图库，在进行 Web 开发的时候需要安装两个模块。

```bash
npm install react --save
npm install react-dom --save
```

`react` 模块主要提供了组件的生命周期、虚拟 DOM Diff、Hooks 等能力，以及将 JSX 转换为虚拟 DOM 的 `h` 方法。而 `react-dom` 主要对外暴露一个 `render` 方法，将虚拟 DOM 转化为真实 DOM。

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
/* import ReactDOM from 'react-dom/server' //服务的渲染 */

class Hello extends React.component {
  render() {
    return <h1>Hello, world!</h1>,
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('root')
)
```

如果我们将 `react-dom` 换成 `react-native` 就可以将虚拟 DOM 转换为安卓或 iOS 的原生组件。我在[之前的文章](https://blog.shenfq.com/posts/2019/%E8%99%9A%E6%8B%9FDOM%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F.html)中介绍过，虚拟 DOM 最大的优势并不是其 Diff 算法，而是将 JSX 转换为统一的 DSL，通过其抽象能力实现了跨平台的能力。除了官方提供的 `react-dom`、`react-native` ，甚至可以渲染到命令行上，这也是我们今天介绍的 `ink`。

> 🔗 npm ink: https://www.npmjs.com/package/react-dom

![Ink](https://file.shenfq.com/pic/20210726142859.png)

`ink` 内部使用 facebook 基于 C++ 开发的一款跨平台渲染引擎 [`yoga`](https://yogalayout.com/)，支持 Flex 布局，功能十分强大。另外，React Native 内部使用了该引擎。

## 初始化

这里有一个官方提供的脚手架，我们可以直接通过这个脚手架来创建一个项目。

```bash
$ mkdir ink-app
$ cd ink-app
$ npx create-ink-app
```

如果你想使用 TypeScript 来编写项目，你也可以使用如下命令：

```bash
$ npx create-ink-app --typescript
```

生成的代码如下：

```jsx
// src/cli.js
#!/usr/bin/env node
const ink = require('ink')
const meow = require('meow')
const React = require('react')
const importJsx = require('import-jsx')

const ui = importJsx('./ui')

const cli = meow(`
	Usage
	  $ ink-cli
	Options
		--name  Your name
`)

ink.render(React.createElement(ui, cli.flags))
```

```jsx
// src/ui.js
const App = (props) => (
  <Text>
    Hello, <Text color = "green">
  		{ props.name || 'UserName' }
  	</Text>
  </Text>
)

module.exports = App;
```

除了 `ink` 和 `react`，脚手架项目还引入了 `meow`、`import-jsx` 两个库。

`meow` 的主要作用是运行命令时，对参数进行解析，将解析的参数放到 `flags` 属性中，其作用与 `yargs`、`commander` 一样，是构建 CLI 工具的必备利器。

```js
const meow = require('meow')
// 传入的字符串，作为 help 信息。
const cli = meow(`
	Options
		--name  Your name
		--age   Your age
`)
console.log('flags: ', cli.flags)
```

![](https://file.shenfq.com/pic/20210726180012.png)

另一个 `import-jsx` 的主要作用，就是将 `jsx` 字符串转化为 `createElement` 方法的形式。

```js
// ui.js
const component = (props) => (
  <Text>
    Hello, <Text color = "green">
  		{ props.name || 'UserName' }
  	</Text>
  </Text>
)

// cli.js
const importJsx = require('import-jsx')
const ui = importJsx('./ui')

console.log(ui.toString()) // 输出转化后的结果
```

```js
// 转化结果：
props => /*#__PURE__*/React.createElement(
  Text,
  null,
  "Hello, ",
  /*#__PURE__*/React.createElement(
    Text, {
      color: "green"
    },
    props.name || 'UserName'
 	)
)
```

这一步的工作一般由  babel 完成，如果我们没有通过 babel 转义 jsx，使用 `import-jsx` 就相当于是运行时转义，对性能会有损耗。但是，在 CLI 项目中，本身对性能要求也没那么高，通过这种方式，也能更快速的进行项目搭建。

## 内置组件

由于是非浏览器的运行环境，`ink` 与 `react-native` 一样提供了内置的一些组件，用于渲染终端中的特定元素。

### \<Text\>

`<Text>` 组件用于在终端渲染文字，可以为文字指定特定的颜色、加粗、斜体、下划线、删除线等等。

DEMO:

```jsx
// ui.js
const React = require('react')
const { Text } = require('ink')
moudle.exports = () => (<>
  <Text>I am text</Text>
  <Text bold>I am bold</Text>
  <Text italic>I am italic</Text>
  <Text underline>I am underline</Text>
  <Text strikethrough>I am strikethrough</Text>
  <Text color="green">I am green</Text>
  <Text color="blue" backgroundColor="gray">I am blue on gray</Text>
</>)

// cli.js
const React = require('react')
const importJsx = require('import-jsx')
const { render } = require('ink')

const ui = importJsx('./ui')
render(React.createElement(ui))
```

其主要作用就是设置渲染到终端上的文本样式，有点类似于 HTML 中的 `<font>` 标签。

![](https://file.shenfq.com/pic/20210727113553.png)

除了这种常见的 HTML 相关的文本属性，还支持比较特殊的 `wrap` 属性，用于将溢出的文本进行截断。

长文本在超出终端的长度时，默认会进行换行处理。

```jsx
<Text>loooooooooooooooooooooooooooooooooooooooong text</Text>
```

![](https://file.shenfq.com/pic/20210727141017.png)

如果加上 `wrap` 属性，会对长文本进行截断。

```jsx
<Text wrap="truncate">
  loooooooooooooooooooooooooooooooooooooooong text
</Text>
```

![](https://file.shenfq.com/pic/20210727141152.png)

除了从尾部截断文本，还支持从文本中间和文本开始处进行截断。

```jsx
<Text wrap="truncate">
  loooooooooooooooooooooooooooooooooooooooong text
</Text>
<Text wrap="truncate-middle">
  loooooooooooooooooooooooooooooooooooooooong text
</Text>
<Text wrap="truncate-start">
  loooooooooooooooooooooooooooooooooooooooong text
</Text>
```

![](https://file.shenfq.com/pic/20210727141403.png)

### \<Box\>

`<Box>` 组件用于布局，除了支持类似 CSS 中 `margin`、`padding`、`border`  属性外，还能支持 `flex` 布局，可以将 `<Box>` 理解为 HTML 中设置了 flex 布局的 div （ `<div style="display: flex;">`）。

下面我们先给一个 `<Box>` 组件设置高度为 10，然后主轴方向让元素两端对齐，交叉轴方向让元素位于底部对齐。

然后在给内部的两个 `<Box>` 组件设置一个 `padding` 和一个不同样式的边框。

```jsx
const App = () => <Box
  height={10}
  alignItems="flex-end"
  justifyContent="space-between"
>
	<Box borderStyle="double" borderColor="blue" padding={1} >
    <Text>Hello</Text>
  </Box>
	<Box borderStyle="classic"  borderColor="red" padding={1} >
	  <Text>World</Text>
  </Box>
</Box>
```

最终效果如下：

![](https://file.shenfq.com/pic/20210727142547.png)

比较特殊的属性是边框的样式： `borderStyle`，和 CSS 提供的边框样式有点出入。

```jsx
<Box borderStyle="single">
  <Text>single</Text>
</Box>
<Box borderStyle="double">
  <Text>double</Text>
</Box>
<Box borderStyle="round">
  <Text>round</Text>
</Box>
<Box borderStyle="bold">
  <Text>bold</Text>
</Box>
<Box borderStyle="singleDouble">
  <Text>singleDouble</Text>
</Box>
<Box borderStyle="doubleSingle">
  <Text>doubleSingle</Text>
</Box>
<Box borderStyle="classic">
  <Text>classic</Text>
</Box>
```

![](https://file.shenfq.com/pic/20210727144335.png)

`<Box>` 组件提供的其他属性和原生的 CSS 基本一致，详细介绍可以查阅其文档：

> 🔗 ink#Box：[https://www.npmjs.com/package/ink#box](https://www.npmjs.com/package/ink#box)

### \<Newline\>

`<NewLine>` 组件相当于直接在终端中添加一个 `\n` 字符，用于换行（PS：只支持插入在 `<Text>` 元素之间）；

```jsx
const App = () => (<>
  <Text>Hello</Text>
  <Text>World</Text>
</>)
```

![](https://file.shenfq.com/pic/20210727145447.png)

```jsx
const App = () => (<>
  <Text>Hello</Text>
  <Newline />
  <Text>World</Text>
</>)
```

![](https://file.shenfq.com/pic/20210727145619.png)

### \<Spacer\>

`<Spacer>` 组件用于隔开两个元素，使用后，会将间隔开两个元素隔开到终端的两边，效果有点类似于 flex 布局的两端对齐（`justify-content: space-between;`）

```jsx
const App1 = () => <Box>
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</Box>;

const App2 = () => <Box justifyContent="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</Box>;
```

上面两段代码的表现形式一致：

![](https://file.shenfq.com/pic/20210727152636.png)

## 内置 Hooks

`ink` 除了提供一些布局用的组件，还提供了一些 Hooks。

### useInput

可用于监听用户的输入，`useInput` 接受一个回调函数，用户每次按下键盘的按键，都会调用 `useInput` 传入的回调，并传入两个参数。

```ts
useInput((input: string, key: Object) => void)
```

第一个参数：input ，表示按下按键对应的字符。第二个参数： key ，为一个对象，对应按下的一些功能键。

- 如果按下回车，`key.return = true`；
- 如果按下删除键，`key.delete = true`；
- 如果按下esc键，`key.escape = true`；

具体支持哪些功能按键，可以参考官方文档：

> 🔗ink#useInput：[https://www.npmjs.com/package/ink#useinputinputhandler-options](https://www.npmjs.com/package/ink#useinputinputhandler-options)

下面通过一个 DEMO，展示其具体的使用方式，在终端上记录用户的所有输出，如果按下的是删除键，则删除最近记录的一个字符。

```jsx
const React = require('react')
const { useInput, Text } = require('ink')

const { useState } = React
module.exports = () => {
  const [char, setChar] = useState('')
  useInput((input, key) => {
    if (key.delete) {
      // 按下删除键，删除一个字符
      setChar(char.slice(0, -1))
      return
    }
    // 追加最新按下的字符
    setChar(char + input)
  })
  return <Text>input char: {char}</Text>
}
```

![](https://file.shenfq.com/pic/20210727164014.gif)

### useApp

对外暴露一个 `exit` 方法，用于退出终端。

```jsx
const React = require('react')
const { useApp } = require('ink')

const { useEffect } = React
const App = () => {
  const { exit } = useApp()

	// 3s 后退出终端
	useEffect(() => {
		setTimeout(() => {
			exit();
		}, 3000);
	}, []);

	return <Text color="red">3s 后退出终端……</Text>
}
```

![](https://file.shenfq.com/pic/20210727173717.gif)

### useStdin

用于获取命令行的输入流。这里用一个简单的案例，来模拟用户登录。

```jsx
const React = require('react')
const { useStdin } = require('ink')
const { useState, useEffect } = React
module.exports = () => {
  const [pwd, setPwd] = useState('')
  const { stdin } = useStdin()
  
  useEffect(() => {
    // 设置密码后，终止输入
    if (pwd) stdin.pause()
	}, [pwd])
  
  stdin.on('data', (data) => {
    // 提取 data，设置到 pwd 变量中
    const value = data.toString().trim()
    setPwd(value)
  })
  // pwd 为空时，提示用户输入密码
  if (!pwd) {
    return <Text backgroundColor="blue">password:</Text>
  }

  return pwd === 'hk01810'
    ? <Text color="green">登录成功</Text>
    : <Text color="red">有内鬼，终止交易</Text>
}
```

![](https://file.shenfq.com/pic/20210727182117.gif)

### useStdout

用于获取命令行的输出流。会暴露 `stdout` 的写入流，还会暴露一个 `write` 方法，用于在终端进行输入。

```jsx
const React = require('react')
const { useStdout } = require('ink')
const { useEffect } = React
module.exports = () => {
  const { write } = useStdout()
  useEffect(() => {
    // 在终端进行写入
		write('Hello from Ink to stdout')
	}, [])
  return null
}
```

![](https://file.shenfq.com/pic/20210728102652.png)

## 第三方组件

除了内置的这些组件和 Hooks 外，还有丰富的[第三方生态](https://www.npmjs.com/package/ink#useful-components)。比如：Loading组件、超链接组件、表格组件、高亮组件、多选组件、图片组件……

> 🔗 ink#第三方组件：[https://www.npmjs.com/package/ink#useful-components](https://www.npmjs.com/package/ink#useful-components)

#### ink-spinner

![](https://file.shenfq.com/pic/20210728142515.gif)

#### ink-link

![](https://file.shenfq.com/pic/20210728143000.gif)

#### ink-table

![](https://file.shenfq.com/pic/20210728143224.png)

#### ink-syntax-highlight

![](https://file.shenfq.com/pic/20210728143551.png)

#### ink-muti-select

![](https://file.shenfq.com/pic/20210728144429.gif)

## 调试工具

ink 属于 React 生态，自然能够支持 React 官方提供的调试工具 `React Devtools`。

```bash
$ npm install react-devtools # 安装调试工具
```

```bash
$ npx react-devtools # 启动调试工具
```

然后，在启动应用时，在前面设置 `DEV` 全局变量。

```bash
DEV=true node src/cli
```

运行后的效果如下：

![](https://file.shenfq.com/pic/20210728145302.gif)



## 总结

React 确实是视图开发的一把利器，再加上 Hooks 的加持，其抽象能力得到了进一步的提升，统一的 DSL 加上 虚拟 DOM，照理来说，是可以在任何平台进行渲染的。甚至，微软官方都开发了一个  `React Native for Windows`，关键是这个东西不仅仅能开发 Windows 的桌面软件，还可以开发 mac 的桌面软件。

![](https://file.shenfq.com/pic/20210728145805.png)

有点跑题，说回 `ink`，大家熟知的 `Gatsby` 的命令行工具也是通过 `ink` 进行开发的。如果大家后续有本地的 CLI 工具需要实现，可以考虑这款工具，至少不必烦恼如何在命令行进行文本对齐。
