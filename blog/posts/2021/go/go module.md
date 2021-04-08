---
title: Go 模块化
author: shenfq
date: 2021/04/05
categories:
- Go
tags:
- Go
- 模块化
---

# Go 模块化

## 前言

在很久很久以前，就 push 自己学过 go 语言，但是之前只是看了一下基础语法就放弃了，实在是工作当中没有应用场景。最近发现基于 go 写的 esbuild 异军突起，想要深入研究下它的奥秘，发现看不懂。于是，打算先从 go 开始学一遍，等我把 go 学好了，再去研究 esbuild。所以，最近的几篇文章都会写 go 的一些学习心得，今天的文章就从 go 语言的模块化开始。

![](https://file.shenfq.com/pic/20210405193808.png)

## 环境变量

学习 go 语言的第一步，当然是安装以及环境变量。由于我是 macos，直接运行 `brew install go` 就能安装成功，也可以在[官网（https://golang.google.cn/）](https://golang.google.cn/)下载对应的二进制包。

安装成功后，需要配置下面几个环境变量：

- GOROOT：go 语言的安装路径；
- GOBIN：go 语言的可执行文件路径，一般为 `"$GOROOT/bin"`；
- GOPATH：工作目录，可设置多个，每个项目都可以设置一个单独的GOPATH；

## GOPATH

在 GoLand（go 语言最强IDE） 中，我们可以在 `Preferences` 中设置多个 GOPATH，而且将 GOPATH 分为全局和局部的。

![](https://file.shenfq.com/pic/20210402194612.png)

GOPATH 最早出现的意义是用来进行模块管理，每个 GOPATH 中会有三个目录：

- src：用来存放源代码；
- pkg：用来存放编译后的 `.a(archive)` 静态库文件；
- bin：用来存放编译后可直接运行的二进制文件；

![](https://file.shenfq.com/pic/20210402194916.png)

一般设置为工作目录的 src 文件夹需要手动创建，其他两个目录都是编译后自动生成的。

接下来，我们新建了一个目录 `~/Code/goland/go-story`，并将该目录设置为工作目录。

```bash
export GOPATH="~/Code/goland/go-story"
```

然后在当前目录新建一个 `src` 文件夹，并新建一个 `hello` 目录，在 `hello` 目录新建 `main.go` 文件。

![](https://file.shenfq.com/pic/20210405141212.png)

在 `hello/main.go` 文件中，写入如下代码：

```go
package main

import (
	"flag"
	"fmt"
)

var name string

func init() {
	flag.StringVar(&name, "name", "everyone", "The greeting object.")
}

func main() {
	flag.Parse() // 解析命令行参数
	fmt.Printf("\nHello %s\n", name)
}
```

flag 库是 go 内置的模块，类似于 node 的 [commander](https://www.npmjs.com/package/commander) 库，运行后结果如下所示：

![](https://file.shenfq.com/pic/20210405143954.png)

下面我们引入一个能够让命令行输出色彩更加丰富的库：[colourize](https://github.com/TreyBastian/colourize)，类似于 node 中的 [chalk](https://www.npmjs.com/package/chalk)。通过下面这个命令来安装依赖：

```bash
go get github.com/TreyBastian/colourize 
```

运行之后，我们可以看到在工作区自动创建了一个 `pkg` 目录，目录下新生成的是 `colourize` 库文件，同时 src 目录也新建了一个 `github.com` 目录，用来放 `colourize` 的源码。

![](https://file.shenfq.com/pic/20210405141929.png)

`go get` 命令可以简单理解为 `npm install`。接下来就能在 `hello/main.go` 中引入依赖。

```go
package main

import (
	"flag"
	"fmt"

	"github.com/TreyBastian/colourize"
)

var name string

func init() {
	flag.StringVar(&name, "name", "everyone", "The greeting object.")
}

func hello(name string) {
	fmt.Printf(colourize.Colourize("\nHello %s\n", colourize.Blue), name)
}

func main() {
	flag.Parse()
	hello(name)
}
```

运行 `hello/main.go` 可以看到命令行输出了蓝色的文字。

![](https://file.shenfq.com/pic/20210405142320.png)

默认情况下，go 依赖的加载机制为：

- `$GOROOT` 下的 `src` 目录
- `$GOPATH` 下的 `src` 目录

## Go Vendor

前面这种方式，有个很麻烦的问题，就是没有办法进行很好的版本管理，而且多个依赖分散在 `$GOPATH/src` 目录下，可能会出现很多很麻烦的问题。

例如，我现在在 `GOPATH` 下有两个项目：`go-blog`、`go-stroy`，这两个项目分别有不同的依赖，分散在 `github.com` 目录，这个时候到底要不要将整个 `github.com` 目录添加到版本库呢？

![](https://file.shenfq.com/pic/20210405150429.png)

go 在 1.5 版本的时候，引入了 vendor 机制，在每个项目目录下可以通过 `vendor` 目录存放依赖，这类似于 node 中的 `node_modules` 目录。

![](https://file.shenfq.com/pic/20210405150802.png)

使用 `go vendor` 需要先安装 `govendor` 模块。

```bash
go get govendor
```

然后在项目目录运行如下命令。

```bash
cd ~/Code/gland/go-story/src/hello
govendor init
govendor add github.com/TreyBastian/colourize
```

可以看到，`hello` 项目下新生成了一个 `vendor` 目录，而且 `colourize` 也被拷贝到了该目录下。

![](https://file.shenfq.com/pic/20210405150717.png)

而且 `govendor` 会新建一个 `vendor.json` 文件，用来进行依赖项的管理。

![](https://file.shenfq.com/pic/20210405151449.png)

有了 `go vendor` 之后，依赖项的加载顺序如下：

- 项目目录下的 `vendor` 目录
- 项目目录上一级的 `vendor` 目录
- 不断向上冒泡 ……（PS. 类似于 `node_modules`）
- `$GOPATH` 下的 `vendor` 目录
- `$GOROOT` 下的 `src` 目录
- `$GOPATH` 下的 `src` 目录

### 配置开关

有一点需要注意，在 go 1.5 版本下，`go vendor` 并不是默认开启的，需要手动配置环境变量：

```bash
export GO15VENDOREXPERIMENT=1
```

在 go 1.6 版本中，`go vendor` 已经改为默认开启。

## Go Modules

虽然 1.5 版本推出了 `go vendor`，但是没有解决根本问题，只是依赖的查找上支持到了 `vendor` 目录，`vendor` 目录还是需要一些第三方的库（`govendor`、`godep`、`glide`）进行管理，而且对于 `GOPATH` 环境变量依然有所依赖。

官方为了解决这些问题，终于在 1.11 版本中，实验性的内置了其模块管理的能力（1.12 版本正式开启）：`go mod`。

使用 `go mod` 的时候，我们无需 `GOPATH`，所以我们需要把之前配置的 `GOPATH` 清理掉，调整下目录结构，将 `go-story/hello/main.go` 直接移动到 `go-story/main.go`，然后将 `src`、`pkg` 目录删除。

```bash
# 初始化 go modules
go mod init [pkg-name]
```

![](https://file.shenfq.com/pic/20210405172840.png)

此时，会在目录下生成一个 `go.mod` 文件。

![](https://file.shenfq.com/pic/20210405172955.png)

查看其内容，发现里面会声明 go 的版本号，以及当前模块的名称。

![](https://file.shenfq.com/pic/20210405173448.png)

然后我们安装依赖（**不管是何种依赖管理的方式，安装方法依旧不变**）：

```bash
go get github.com/TreyBastian/colourize
```

![](https://file.shenfq.com/pic/20210405173658.png)

`go.mod` 中，会写入添加的依赖，以及版本号，同时，该模块会被安装到 GOPATH 中。由于我们之前将 GOPATH 移除，这里会安装到 GOPATH 的默认值中（`~/go/`）。

![](https://file.shenfq.com/pic/20210405173923.png)

## 总结

之前开发 node 的过程中，也踩过很多 npm 的坑，而且社区对 npm 也有很多怨言，也出现了很多第三方的模块：`yarn`、`pnpm` 等等。

想不到 go 的模块管理，也是一部血泪史，现在下载一些 go 的老项目还会发现一些 `go vendor` 管理方式的项目。另外，`go mod` 出现后，go 官方也在计划移除 `GOPATH`。













