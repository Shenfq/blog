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
#!/usr/bin/env node

const ink = require('ink')
const meow = require('meow')
const React = require('react')
const importJsx = require('import-jsx')

const component = (props) => (
  <Text>
    Hello, <Text color = "green">
  		{ props.name || 'UserName' }
  	</Text>
  </Text>
)

const ui = importJsx(component)

const cli = meow(`
	Usage
	  $ ink-cli
	Options
		--name  Your name
`)

ink.render(React.createElement(ui, cli.flags))
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
const importJsx = require('import-jsx')

const component = (props) => (
  <Text>
    Hello, <Text color = "green">
  		{ props.name || 'UserName' }
  	</Text>
  </Text>
)

const ui = importJsx(component)

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











