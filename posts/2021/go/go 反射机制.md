---
title: Go 反射机制
author: shenfq
date: 2021/04/29
categories:
- Go
tags:
- Go
- 反射机制

---


因为没有强类型语言的经验，反射这个概念，之前确实没怎么接触过。在维基百科上搜了一下，具体解释如下：

> 在计算机学中，反射式编程（英语：reflective programming）或反射（英语：reflection），是指计算机程序在运行时（runtime）可以访问、检测和修改它本身状态或行为的一种能力。用比喻来说，反射就是程序在运行的时候能够“观察”并且修改自己的行为。

go 中的反射也是这种作用，可以在程序运行期间，获取变量的类型与值的信息，然后进行访问或或者修改。go 语言中，内置了 `reflect` 包，用来获取一个变量的类型（`type`）与值（`value`），对应的方法分别为 `reflect.TypeOf()` 和 `reflect.ValueOf()`。

## 反射类型

`TypeOf` 方法，会返回该变量的类型对象，类型对象下可以获取到变量的类型与种类。

```go
import (
	"fmt"
	"reflect"
)

func main() {
	// 定义一个int类型的变量
	var i int = 1
	// 获取变量的类型对象
	var typeOfNum = reflect.TypeOf(i) 

  // 输出类型与种类
  typeOfNumName = typeOfNum.Name()
  typeOfNumKind = typeOfNum.Kind()
  fmt.Printf("name: %s, kind: %s", typeOfNumName, typeOfNumKind)
}
```

可以看到，此时的类型与种类都为 `int`。

![](https://file.shenfq.com/pic/20210429141331.png)

### 类型与种类

类型表示定义变量的时候指定的类型，可以反映 `type` 关键字定义的类型，而种类是变量最终归属的类型。说起来可能比较苍白，我们直接上代码。

```go
type num int

// 定义一个num类型的变量
var i num = 1
var typeOfNum = reflect.TypeOf(i) 
```

可以看到，此时的类型为 `num`，种类为 `int`。

![](https://file.shenfq.com/pic/20210429142610.png) 

对于一些引用类型的变量，比如切片、函数、结构体，`kind` 都能准确反映其底层的类型。

```go
func printTypeOf(typeOf reflect.Type) {
	fmt.Printf("name: %s, kind: %s\n", typeOf.Name(), typeOf.Kind())
}

type Person struct {}
type IntSlice []int
func main() {
	var a = IntSlice{}
	var b = Person{}
	printTypeOf(reflect.TypeOf(a))
	printTypeOf(reflect.TypeOf(b))
}
```

![](https://file.shenfq.com/pic/20210429144206.png)

而面对匿名结构体或者匿名函数，其类型值会返回为空。

```go
func main() {
	var a = struct {}{}
	printTypeOf(reflect.TypeOf(a))
}
```

![](https://file.shenfq.com/pic/20210429144259.png)

## 反射值

`ValueOf` 方法，可以获取一个变量的值。

```go
var i = 3.1415926
var s = "欢迎关注我的公众号：『自然醒的笔记本』"

fmt.Println(reflect.ValueOf(s))
fmt.Println(reflect.ValueOf(i))
```

![](https://file.shenfq.com/pic/20210429153206.png)

通过反射的值对象，也能取到变量的种类，并且还能根据其种类，调用对应的方法获取变量的真实值。

```go
var i = 100
var v = reflect.ValueOf(i)

fmt.Println(v.Int()) // 如果值是 Int 类型，可以通过 Int 方法获取具体值
fmt.Println(v.Kind())
```

![](https://file.shenfq.com/pic/20210429154424.png)

### 修改值

通过反射得到的值对象，可以对变量本身的值进行修改。首先，在获取反射值时，不能直接获取变量的反射值，而是要先取其指针的值对象。

```go
var i = 100
var v = reflect.ValueOf(&i) // 取出变量i的指针的值对象

fmt.Println(v.Kind(), v)
```

取出指针的值对象之后，不能立即赋值，因为此时拿到的是变量的地址。

![](https://file.shenfq.com/pic/20210429155741.png)

要赋值的话，需要先调用 `Elem` 方法，取出具体元素，然后进行赋值。

```go
var i = 100
var v = reflect.ValueOf(&i) // 取出变量i的指针的值对象

var e = v.Elem()
e.SetInt(500) // 修改元素值

fmt.Println(e.Kind(), i)
```

![](https://file.shenfq.com/pic/20210429155959.png)

### 值对象与结构体

前面介绍过，通过反射可以得到变量的值，对于结构体来说，也是一样。

```go
type Person struct {
	name string
	age int
	gender string
	address string
}

var p = Person{"Shenfq", 25, "男", "湖南长沙"}
var v = reflect.ValueOf(p)

fmt.Println(v.Kind(), v)
```

![](https://file.shenfq.com/pic/20210429160303.png)

反射值对象还提供了一些方法，专门用来针对结构体成员的信息获取。

#### NumField()

`NumField()` 可以获取结构体成员的具体数量。

```go
var p = Person{"Shenfq", 25, "男", "湖南长沙"}
var v = reflect.ValueOf(p)

fmt.Println("Person 结构体成员数:", v.NumField())
```

![](https://file.shenfq.com/pic/20210429160723.png)

#### Field()

`Field()` 可以获取结构体指定索引位置的成员的反射值。

```go
var p = Person{"Shenfq", 25, "男", "湖南长沙"}
var v = reflect.ValueOf(p)
var num = v.NumField()
for i :=0; i < num; i++ {
  var val = v.Field(i)
  fmt.Printf("Person[%d]: %s %v\n", i, val.Type(), val)
}
```

![](https://file.shenfq.com/pic/20210429161221.png)

#### FieldByName()

`FieldByName()` 可以获取结构体指定成员名称的成员的反射值。

```go
var p = Person{"Shenfq", 25, "男", "湖南长沙"}
var v = reflect.ValueOf(p)
var vOfName = v.FieldByName("name")
fmt.Printf("Person[name]: %s %v\n", vOfName.Type(), vOfName)
```

![](https://file.shenfq.com/pic/20210429161530.png)

