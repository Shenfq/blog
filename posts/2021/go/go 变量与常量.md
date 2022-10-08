---
title: Go 常量与变量
author: shenfq
date: 2021/04/06
categories:
- Go
tags:
- Go
- 变量
- 常量
---


## 变量

go 语言的变量声明和大多数语言类似，通过 `var` 关键字声明变量，只是 go 语言作为静态类型语言，声明变量时需要指定其类型。

下面的代码表示声明一个『`name`』变量，类型为『`string`』，并给其赋值『`"Shenfq"`』。

```go
var name string = "Shenfq"
```

如果我们不进行赋值，这变量会获得一个默认值，下面列举一些 go 语言中的基础类型及其默认值。

| 类型                     | 默认值 |
| ------------------------ | ------ |
| int（int32、int64……）    | 0      |
| uint（uint32、uint64……） | 0      |
| float32、float64         | 0.0    |
| bool                     | false  |
| string                   | ""     |

### 多变量声明

上面介绍 go 语言通过 `var` 关键字进行单个变量声明，我们还可以通过 `var` 关键字进行多个变量的声明：

```go
// 声明两个变量为同一类型
var firstName, lastName string
// 给两个变量同时赋值
firstName, lastName = "frank", "shen"
```

```go
// 声明两个变量为不同类型
var (
  age int
	name string
)
// 给两个变量同时赋值
age, name = 25, "Shenfq"
```

### 类型推导

如果我们在变量声明阶段，对变量进行了赋值操作，这时候我们是可以直接省略变量类型的，因为 go 在编译过程中会依据所赋予的初始值推导出其类型。

```go
var age = 25

fmt.Printf("age 类型为：%T", age) // age 类型为：int
```

```go
var (
  age = 18
  name = "Shenfq"
)
fmt.Printf("age 类型为：%T", age) // age 类型为：int
fmt.Printf("name 类型为：%T", name) // name 类型为：string
```

### 简短格式

前面介绍了变量声明的时候，如果给定了初始值，go 在编译阶段可以进行类型推导。这种情况，go 提供了一种更简单的声明方式，通过 `:=` 的方式进行变量声明，可以省略 `var` 关键字。

```go
func main() {
  age := 25
	name := "Shenfq"
}
```

```go
// 也可以进行多个变量同时赋值
func main() {
  age, name := 25, "Shenfq"
}
```

#### ⚠️注意事项一

这种声明方式只能用于函数体内，不能用于全局变量的声明。

```go
// ⚠️ 不能在全局使用这种方式声明变量
age, name := 25, "Shenfq"

// 只能在函数体内使用该方式
func main() {
	age, name := 25, "Shenfq"
	fmt.Printf("age 类型为：%T", age)
	fmt.Printf("name 类型为：%T", name)
}
```

![warning](https://file.shenfq.com/pic/20210406135246.png)

#### ⚠️注意事项二

已经声明过的变量，不能使用 `:=` 的方式进行赋值。

```go
func main() {
  var age int
	age := 25
}
```

![](https://file.shenfq.com/pic/20210406135740.png)

已经声明过的变量，只能通过 `=` 的方式进行赋值。

```go
func main() {
  var age int
	age = 25
}
```

### 全局变量与局部变量

简单来说，声明在函数体外的变量为全局变量，声明在函数体内的变量为局部变量。

局部变量如果有声明，没有进行使用，则不会通过编译。

```go
func main() {
  var age int
}
```

![](https://file.shenfq.com/pic/20210406141652.png)

但是，全局变量是可以声明而不使用的。

```go
var age int
func main() {
	name := "Shenfq"
	//fmt.Printf("age 类型为：%T", age)
	fmt.Printf("name 类型为：%T", name)
}
```

上面的代码中，我们声明了 `age` 全局变量，但是并未使用，可以正常编译。

### 空白标识符

前面介绍过，go 在变量赋值的时候，可以一次性对多个变量赋值。同时，go 的函数在 return 的时候，也能一次返回多个结果。

```go
func double(num int) (string, int) {
	var err string
	if num < 0 {
		err = "num 不能为负数"
		return err, -1
	}
	result := num * 2
	return err, result
}
```

上面我们实现了一个 `double` 函数，该函数接受一个 `int` 类型的变量（`num`），返回两个值，一个为异常提示，一个为 `num * 2` 的结果。如果 `num < 0` ， 则提示 `num` 不能负数。

```go
func main() {
	err, res := double(10)
	if err != "" {
		fmt.Printf(err)
	} else {
		fmt.Printf("结果为：%v", res)
	}
}
```

如果，我们并不关心 `err` ，只想执行 `double` 之后，输出其结果。

```go
func main() {
	err, res := double(10)
	fmt.Printf("结果为：%v", res)
}
```

![](https://file.shenfq.com/pic/20210406145932.png)

运行后，我们会收到一个编译错误，`err` 变量并未使用。这时候，就需要用到空白标识符（`_`）。

```go
func main() {
	_, res := double(10)
	fmt.Printf("结果为：%v", res)
}
```

我们可以通过 `_` 来接受 `err` 值，这个地方的值就会被抛弃掉，就能顺利通过编译。

## 常量

常量就是不会发生变化的变量，一旦声明就不会改变。go 语言中，常量的声明只需要将变量声明时的 `var` 关键字替换为 `const` 关键字。

```go
// 隐式类型定义
const PI = 3.14
// 显式类型定义
const PI2 float  = 3.14
```

### 多常量声明

与变量类似，常量也支持一次性声明多个。

```go
func main() {
	const (
		PI = 3.14
		PI2 = 3.14
	)
	fmt.Printf("结果为：%v\n", PI)
	fmt.Printf("结果为：%v\n", PI2)
}
```

![](https://file.shenfq.com/pic/20210406171303.png)

如果一次声明多个常量时，某个常量如果为进行赋值，默认会与上一个常量的值进行同步。下面代码的运行结果，与上面的代码一致。

```go
func main() {
	const (
		PI = 3.14
		PI2
	)
	fmt.Printf("结果为：%v\n", PI)
	fmt.Printf("结果为：%v\n", PI2)
}
```

### 特殊常量

有个叫做 `iota` 的特殊常量，在常量的赋值过程中，会进行累加。

```go

func main() {
	const (
		A = iota
		B
		C
	)
	fmt.Println(A, B, C) // 0 1 2
}
```

在 `iota` 累加的过程中，可以对其进行打断。

```go
func main() {
	const (
		A = iota
		B
		C = "Shenfq"
    D
    E
	)
	fmt.Println(A, B, C, D, E)
}
```

这时候输出的结果为：

![](https://file.shenfq.com/pic/20210406172317.png)

这是由于我们将常量 `C` 修改为了字符串 `"Shenfq"`，常量 `D`、`E` 会默认与上一条常量保持同步，所以会得到上述结果。但是， `iota`  是支持重新恢复累加，只需要在指定位置重新赋值一次 `iota` 即可。

```go
func main() {
	const (
		A = iota
		B
		C = "Shenfq"
		D = iota // 恢复累加状态
		E
	)
	fmt.Println(A, B, C, D, E)
}

```

由于 `C` 占用了原本 `2` 的位置，所以 `D` 恢复后，也是从 `3` 开始的。

![](https://file.shenfq.com/pic/20210406172627.png)

`iota` 这种累加的特性，特别像我们在其他语言中使用的枚举，所以在 go 语言中，我们可以直接将 `iota` 当做枚举来使用。

```go
type ButtonType int
const (
  Default ButtonType = iota
  Primary
  Warning
  Error
)
```

