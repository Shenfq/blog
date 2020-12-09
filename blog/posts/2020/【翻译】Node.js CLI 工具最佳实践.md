---
title: 【翻译】Node.js CLI 工具最佳实践
author: shenfq
date: 2020/02/22
categories:
- Node.js
tags:
- 前端
- 翻译
- Node
---

# 【翻译】Node.js CLI 工具最佳实践

> [原文链接](https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/3afe1ab0a5b506ef8c32903c4bf253a4cdb4bddd/README.md#shell-interpreters-vary)

这是一个关于如何构建成功的、可移植的、对用户友好的Node.js 命令行工具（CLI）最佳实践的集合。

## 为什么写这篇文章？

一个糟糕的 CLI 工具会让用户觉得难用，而构建一个成功的 CLI 需要密切关注很多细节，同时需要站在用户的角度，创造良好的用户体验。要做到这些特别不容易。

在这个指南中，我列出了在各个重点领域的最佳实践，都是 CLI 工具交互最理想的用户体验。

## 特性：

- ✅ 构建成功的 Node.js CLI 工具的 21 种最佳实践
- ❤️ 帮忙翻译成其他语言
- 🙏 欢迎捐赠
- 最近更新时间：2020-02-14

## 为什么是我？

我叫Liran Tal，我一直专注于构建命令行工具。

我最近的一些工作就是构建Node.js CLI，包括以下开源项目：

| [**Dockly**](https://github.com/lirantal/dockly) | [**npq**](https://github.com/lirantal/npq)                   | [**lockfile-lint**](https://github.com/lirantal/lockfile-lint) | [**is-website-vulnerable**](https://github.com/lirantal/is-website-vulnerable) |
| ------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 沉浸式终端界面，用于管理Docker容器和服务         | 通过在安装过程中进行检查，以安全地使用npm / yarn 安装的软件包 | 整理 npm 或 yarn 的 lock 文件以分析和检测安全问题            | 在网站引用的 JS 库中查找公开的安全漏洞                       |

---



## 1 命令行的经验

本节将会介绍创建美观且高可用的 Node.js 命令行工具相关的最佳实践。

### 1.1 尊重 POSIX

✅ **正确：** 使用兼容 [POSIX-compliant](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) 命令行的语法，因为这是被广泛接受的命令行工具的标准。

❌ **错误：** 当用户使用CLI，其命令行参数与他们过去的使用习惯不一致时，会感觉很难适应。

➡️ **细节：**

Unix-like 操作系统普及了命令行工具，比如awk，sed。这样的工具已经有效地标准化了命令行选项「options」（又名标志「flags」），选项参数和其他操作的行为。

一些案例：

  * 在帮助「help」中将选项参数「option-arguments」标记为方括号([])，以表示它们是可选的，或者使用尖括号(<>)，表示它们是必需的。
  * 参数可以使用单字符缩写，一般是 `-` 加上一个字母或数字。
  * 多个没有值的选型可进行组合，比如：`cli -abc` 等价于 `cli -a -b -c`。

用户一般都会希望你的命令行工具与其他Unix工具具有类似的约定。


### 1.2 构建友好的 CLI

✅ **正确：** 尽可能多的输出一些信息以帮助用户成功使用 CLI。

❌ **错误：** 由于 CLI 一直启动失败，又没有为用户提供足够的帮助，会让用户产生明显的挫败感。

➡️ **细节：**

命令行工具的界面一定程度上应与 Web 用户界面类似，尽可能的保证程序能正常使用。

构建一个对用户友好的 CLI 应该尽可能的为用户提供支持。作为实例，我们讨论下 `curl` 命令的交互，该命令期望将 URL 作为主要的数据输入，而用户却没有提供 URL，这时候命令行会提示用户通读 `curl --help` 的输出信息。但是，对用户友好的 CLI 工具会显示一个可交互式的提示，捕获用户的输入，从而正常运行。


### 1.3 有状态的数据

✅ **正确：** 在多次调用 CLI 的过程中，提供有状态的体验，记住这些数据，以提供无缝的交互体验。

❌ **错误：** 用户多次调用 CLI 重复提供相同的信息，会让用户感到厌烦。

➡️ **细节：**

你需要为 CLI 工具提供持续缓存，比如记住用户名、电子邮件、token 或者是 CLI 多次调用的一些首选项。可以使用以下工具来保留用户的这些配置。

- [configstore](https://www.npmjs.com/package/configstore)

- [conf](https://www.npmjs.com/package/conf)

### 1.4 提供多彩的体验

✅ **正确：** 在 CLI 工具中使用颜色来突出显示一些信息，并且提供降级方案，进行检测，自动退出以免输出乱码。

❌ **错误：** 苍白的输出可能会让用户丢失重要的信息，尤其是文本较多的时候。

➡️ **细节：**

大多数的命令行工具都支持彩色文本，通过特定的 ANSI 编码来启用。
命令行工具输出彩色文本可带来更丰富的体验和更多的交互。但是，不受支持的终端可能会在屏幕上以乱码信息的形式输出。此外，CLI 也可能用于不支持彩色输出的连续集成中。

- [chalk](https://www.npmjs.com/package/chalk)
- [colors](https://www.npmjs.com/package/colors)

### 1.5 丰富的交互

✅ **正确：**  提供除了文本输入之外的其他交互形式，为用户提供更加丰富的体验。

❌ **错误：** 当输入的信息是固定的选项（类似下拉菜单）时，文本输入的形式可能会给用户带来麻烦。

➡️ **细节：**

可以以提示输入的方式引入更加丰富的交互方式，提示输入比自由的文本输入更高端。例如，下拉列表、单选按钮切换、隐藏密码输入。丰富交互的另一个方面就是动画以及进度条，在 CLI 执行异步工作时，都能为用户提供更好的体验。

许多 CLI 提供默认的命令行参数，而无需用户进一步交互。不强迫用户提供一些非必要的参数。

- [prompts](https://www.npmjs.com/package/prompts)
- [enquirer](https://www.npmjs.com/package/enquirer)
- [ink](https://www.npmjs.com/package/ink)
- [ora](https://www.npmjs.com/package/chalk)

### 1.6 无处不在的超链接

✅ **正确：**  URL（https://www.github.com）和源代码（`src/Util.js:2:75`）使用格式正确的文本输出，因为这两者都是现代终端可点击的链接。

❌ **错误：** 避免使用`git.io/abc`之类的非交互式的链接，该链接需要用户手动复制和粘贴。

➡️ **细节：**

如果你要分享的信息在 Url 链接中，或者是某个文件的特定行列，则需要向用户提供正确的格式的链接，用户一旦点击它们，就会打开浏览器或者在IDE跳到特定位置。

### 1.7 零配置

✅ **正确：** 通过自动检测所需的配置和命令行参数，达到即开即用的体验。

❌ **错误：** 如果可以以可靠的方式自动检测命令行参数，并且调用的操作不需用户显式确认（例如确认删除），则不要强制用户交互。

➡️ **细节：**

旨在在运行 CLI 工具时提供“即开即用”的体验。

- The [Jest JavaScript Testing Framework](https://jestjs.io/)
- [Parcel](https://parceljs.org/), a web application bundler


## 2 发布

本节介绍了如何以最佳方式分发和打包 Node.js CLI 工具的最佳实践。

### 2.1 最小化的依赖

✅ **正确：** 最大程度地减少生产环境的依赖项，并且使用可替代的最小的依赖包，确保这是一个尽可能小的 Node.js 包。但是，也不能过于谨慎因此重复发明轮子而过度优化依赖。

❌ **错误：** 应用中依赖的大小将决定 CLI 的安装时间，从而导致糟糕的用户体验。

➡️ **细节：**

使用 `npx` 可以快速调用通过 `npm install` 安装的 Node.js CLI 模块，这可提供更好的用户体验。这有助于将整体的依赖关系和传递依赖关系保持在合理大小。

npm 全局安装模块，安装过程会变得缓慢，这是一个糟糕的体验。通过 npx 总是获取当前项目安装的模块（当前文件夹的node_modules），因此使用 `npx` 来调用 CLI 可能会降低性能。

### 2.2 使用文件锁

✅ **正确：** 通过 npm 提供的 package-lock.json 来锁定安装包，以确保用户安装的时候使用的依赖版本是准确的。

❌ **错误：** 不锁定依赖的版本，意味着 npm 将在安装过程中自己解决他们，从而导致安装依赖的版本范围扩大，这会引入无法控制的更改，可能会让 CLI 无法成功运行。

➡️ **细节：**

通常，npm 包在发布时只定义其直接的依赖项及其版本范围，并且 npm 会在安装时解析所有间接依赖项的版本。随着时间的流逝，间接的依赖项版本会有所不同，因为依赖项随时会发布新版本。
尽管维护人员已广泛使用[版本控制语义](https://semver.org/)，但是 npm 会为安装的包引入许多间接的依赖关系，这些间接依赖提升了破坏您的应用程序的风险。
使用 package-lock.json 会带给用户更好的安全感。将要安装的依赖项固定到特定版本，因此，即使这些依赖项发布了较新的版本，也不会安装它们。这将让您有责任保持对依赖项的关注，了解依赖项中任何安全相关的修复，并通过定期发布 CLI 工具进行安全更新。可以考虑使用[Snyk](https://snyk.io/) 来自动修复整个依赖性树中的安全性问题。*注：我是Snyk的开发者开发者。*
参考：

- [Do you really know how a lockfile works for yarn and npm packages?](https://snyk.io/blog/making-sense-of-package-lock-files-in-the-npm-ecosystem/)
- [Yarn docs: Should lockfiles be committed to the repository?](https://next.yarnpkg.com/advanced/qa/#should-lockfiles-be-committed-to-the-repository)



## 3 通用性

本节将介绍使 Node.js CLI 与其他命令行工具无缝集成有关的最佳实践，并遵循 CLI 正常运行的约定。

本节将回答以下问题：

- 我可以导出 CLI 的输出以便于分析吗？
- 我可以将 CLI 的输出通过管道传递到另一个命令行工具的输入吗？
- 是否可以将其他工具的结果通过管道传输到此 CLI？

### 3.1 接受 STDIN 作为输入

✅ **正确：** 对于数据驱动的命令行应用，用户可以轻松的通过管道将数据输入到 STDIN。

❌ **错误：** 其他的命令行工具可能无法直接提供数据输入到你的 CLI 中，这会阻止某些代码的正常运行，例如：

```bash
$ curl -s "https://api.example.com/data.json" | your_cli
```

➡️ **细节：**

如果命令行工具需要处理某些数据，比如，指定 JSON 文件执行某种任务，一般使用 `--file file.json` 的命令行参数。

### 3.2 结构化输出

✅ **正确：** 通过某个参数来允许应用的结果进行结构化的输出，这样使得数据更容易处理和解析。

❌ **错误：** 用户可能需要使用复杂的正则来解析和匹配 CLI 的输出结果。

➡️ **细节：**

对于 CLI 的用户来说，解析数据并使用数据来执行其他任务（比如，提供给 web 仪表盘或电子邮件）通常很有用。
能够轻松地从命令行输出中得到需要的数据，这将为 CLI 的用户提供更好的体验。

### 3.3 跨平台

✅ **正确：** 如果希望 CLI 能够跨平台工作，则必须注意命令行 shell 和子系统（如文件系统）的语义。

❌ **错误：** 由于错误的路径分隔符等因素，CLI 将在一些操作系统上无法运行，即使代码中没有明显的功能差异。

➡️ **细节：**

单纯从代码的角度来看，功能没有被剥离，并且应该在不同的操作系统中执行良好，但是一些遗漏的细节可能会使程序无法运行。让我们来研究几个必须遵守跨平台规范的案例。

#### 产生错误的命令

有时候我们需要运行 Node.js 程序的进程，假设您有如下的脚本：

```js
// program.js
#!/usr/bin/env bin

// your app code
```

然后使用如下方式启动。

```js
const cliExecPath = 'program.js'
const process = childProcess.spawn(cliExecPath, [])
```

上面的代码能工作，但是下面这样更好。

```js
const cliExecPath = 'program.js'
const process = childProcess.spawn('node', [cliExecPath])
```

为什么这样更好呢？因为 `program.js` 代码以类 Unix 的  [Shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) 符号开始，但是由于这不是跨平台的标准，Windows 不知道如何解析。

在 `package.json` 中也是如此，如下方式定义 `npm script` 是不正确的：

```json
"scripts": {
  "postinstall": "myInstall.js"
}
```

这是因为 Windows 无法理解 `myinstall.js` 中的 Shebang ，并且不知道如何使用 `node` 解释器运行它。

相反，请使用如下方法：

```js
"scripts": {
  "postinstall": "node myInstall.js"
}
```

#### 不同的 shell 解释器

并不是所有的字符在不同的 shell 解释器都能得到相同的处理。

例如， Windows 的命令提示符不会像 bash shell 那样将单引号当做双引号，因此它不知道单引号内的所有字符属于同一个字符串组，这会导致错误。

下面的命令会导致在 Windows 环境下失效：

```json
// package.json
"scripts": {
  "format": "prettier-standard '**/*.js'",
  ...
}
```

应该按照如下方式：

```json
// package.json
"scripts": {
  "format": "prettier-standard \"**/*.js\"",
  ...
}
```

#### 避免手动连接路径

不同平台会使用不同的路径连接符，当通过手动连接它们时，会导致程序不能在不同的平台之前相互操作。

让我们看看一个不好的案例：

```js
const myPath = `${__dirname}/../bin/myBin.js`
```

它使用的是正斜杠，但是 Windows 上是使用反斜杠作为路径的分割符。所以我们不要通过手动的方式构建文件系统路径，而是使用 Node.js 的路径模块:

```js
const myPath = path.join(__dirname, '..', 'bin', 'myBin.js')
```

#### 避免使用分号链接命令

我们在 Linux 上一般都使用分号来顺序链接要运行的命令，例如：`cd /tmp;ls`。但是，在 Windows 上执行相同的操作会失败。

```js
const process = childProcess.exec(`${cliExecPath}; ${cliExecPath2}`)
```

我们可以使用 `&&` 或者 `||`：

```js
const process = childProcess.exec(`${cliExecPath} || ${cliExecPath2}`)
```

### 3.4 允许环境覆盖

✅ **正确：** 允许从环境变量中读取配置，并且当它与命令行参数冲突时，允许环境变量被覆盖。

❌ **错误：** 尽量不要使用自定义配置。

➡️ **细节：**

使用环境变量调整配置，这是许多工具中用于修改 CLI 工具行为的常用方法。 

当命令行参数和环境变量都配置相同的设置时，应该给环境变量一个优先级来覆盖该设置。

## 4 易用性

本节将介绍，如何在用户缺乏开发者设计工具所需环境的情况下，更加容易地使用 Node.js CLI。

### 4.1 允许环境覆盖

✅ **正确：** 为 CLI 创建一个 docker 镜像，并将其发布到Docker Hub之类的公共仓库中，以便没有 Node.js 环境的用户可以使用它。

❌ **错误：** 没有 Node.js 环境的用户将没有 npm 或 npx ，因此将无法运行您的 CLI 工具。

➡️ **细节：**

从 npm 仓库中下载 Node.js CLI 工具通常将使用 Node.js 工具链（例如 npm 或 npx）来完成。这在JavaScript 和 Node.js 开发者中很容易完成。

但是，如果您将 CLI 程序提供给大众使用，而不管他们是否熟悉 JavaScript 或该工具是否可用，那么将限制 CLI 程序仅以 npm 仓库形式的安装分发。如果您的 CLI 工具打算在CI环境中使用，则可能还需要安装那些与Node.js 相关的工具链依赖项。

打包和分发可执行文件的方式有很多，将预先绑定了 CLI 工具的Docker容器进行容器化，这是一种容易使用方法并且不需要太多依赖关系（除了需要 Docker 环境之外）。

### 4.2 优雅降级

✅ **正确：** 在用户不受支持的环境中提供没有彩色和丰富交互的输出，比如跳过某些交互直接提供 JSON 格式的输出。

❌ **错误：** 对于不受支持的终端用户，使用终端交互可能会显著降低最终用户体验，并阻止他们使用您的 CLI 工具。

➡️ **细节：**

对于那些拥有丰富交互形式的终端的用户来说，彩色输出、ascii图表、终端动画会带来很好的用户体验，但是对于没有这些特性的终端用户来说，它可能会显示一下乱码或者完全无法操作。

要使终端不受支持的用户正确使用您的 CLI 工具，您有如下选择:

- 自动检测终端能力，并在运行时评估是否对 CLI 的交互性进行降级；

- 为用户提供一个选项来显式地进行降级，例如通过提供一个 `--json` 命令行参数来强制输出原始数据。

### 4.3 Node.js 版本兼容

✅ **正确：** 支持目前还在维护的 [Node.js 版本](https://nodejs.org/en/about/releases) 。

❌ **错误：** 试图与不受支持的Node.js版本保持兼容的代码库将很难维护，并且会失去使用语言新特性的有点。

➡️ **细节：**

有时可能需要专门针对缺少新的 ECAMScript 特性的旧 Node.js 版本兼容。例如，如果您正在构建一个主要面向DevOps 的Node.js CLI，那么他们可能没有一个理想的 Node.js 环境或者是最新的 runtime。比如，Debian Stretch (oldstable) 附带就是 [Node.js 8.11.1](https://packages.debian.org/search?suite=default&section=all&arch=any&searchon=names&keywords=nodejs).。

如果你的需要兼容旧版本的 Node. js 如 Node. js 8、6、4，最好是使用 Babel 之类的编译器来确保生成的代码与V8 JavaScript 引擎的版本兼容，并与这些版本附带的Node.js runtime 兼容。

绝对不要因此简化你的代码，来使用一些旧的 ECMAScript 语言规范，因为这会产生代码维护相关的问题。

### 4.4 自动检测 Node.js runtime

✅ **正确：** 在 Shebang 声明中使用与安装位置无关的引用，该引用可根据运行时环境自动定位 Node.js run

time。

❌ **错误：** 硬编码 Node.js runtime 位置，如 `#!/usr/local/bin/node` ，仅特定于您自己的环境，这可能使 CLI 工具在其他 Node.js 安装目录不同的环境中无法工作。

➡️ **细节：**

首先在 `cli.js` 文件的顶部添加 `#!/usr/local/bin/node`，然后通过 `node cli.js` 来启动 Node.js CLI，这是一个容易的开始。但是，这是一种有缺陷的方法，因为其他用户的环境无法保证 `node` 可执行文件的位置。

我们可以将 `#!/usr/bin/env node` 作为最佳实践，但是这仍然假设 Node.js runtime 是被 bin/node 引用，而不是 bin/nodejs 或其他。




## 5 测试

### 5.1 不要信任语言环境

✅ **正确：** 不要假定输出文本与您声明的字符串等效，因为测试可能在与您的语言环境不同，比如在非英语环境的系统上运行。

❌ **错误：** 当开发人员在非英语语言环境的系统上进行测试时，开发人员将遇到测试失败。

➡️ **细节：**

当您运行 CLI 并解析输出来测试 CLI 时，您可能倾向于使用  grep  命令，以确保某些字符存在于输出中，例如在不带参数的情况下运行 CLI 时：

```js
const output = execSync(cli);
expect(output).to.contain("Examples:"));
```

如果在非英语的语言环境中运行测试，并且 CLI 参数解析库支持自动检测语言环境并采用该语言环境，则输出从 `Examples` 转换成了 “语言环境” 的语言，测试将失败。

## 6 错误

### 6.1 错误信息

✅ **正确：** 在展示错误信息时，提供可以在项目文档中查找的可跟踪错误的代码，从而简化错误消息的排除。

❌ **错误：** 一般的错误消息往往模棱两可，用户很难搜索解决方案。

➡️ **细节：**

返回错误消息时，请确保它们包含特定的错误代码，以便以后查阅。与HTTP状态代码非常相似，因此 CLI 工具需要命名或编码错误。

例如：

```bash
$ my-cli-tool --doSomething

Error (E4002): please provide an API token via environment variables
```

### 6.2 可行的错误

✅ **正确：** 错误消息应告诉用户解决方案是什么，而不是仅仅提示这里存在错误。

❌ **错误：** 面对错误消息，如果没有任何解决错误的提示，则用户可能无法成功使用 CLI。

➡️ **细节：**

例如：

```bash
$ my-cli-tool --doSomething

Error (E4002): please provide an API token via environment variables
```

### 6.3 提供调试模式

✅ **正确：** 如果高级用户需要诊断问题，则给他们提供更详细的信息

❌ **错误：** 不要关闭调试功能。因为只是从用户那里收集反馈，并让他们查明错误原因将特别困难。

➡️ **细节：**

使用环境变量或命令行参数来设置调试模式并打开详细输出信息。在代码中有意义的地方，植入调试消息，以帮助用户和维护者理解程序，输入和输出以及其他使解决问题变得容易的信息。

参考开源软件包：

- [debug](https://www.npmjs.com/package/debug)

---

## 作者

**Node.js CLI Apps Best Practices** © [Liran Tal](https://github.com/lirantal), Released under [CC BY-SA 4.0](https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/master/LICENSE) License.

