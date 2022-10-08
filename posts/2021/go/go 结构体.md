---
title: Go 结构体与方法
author: shenfq
date: 2021/04/19
categories:
- Go
tags:
- Go
- 结构体
---

# Go 结构体与方法

## 结构体

结构体是 go 语言中一个比较重要的概念，在 c 语言中也有类似的东西。由于他们没有类的概念，结构体可以简单理解成类，是一个不同类型的数据构成的一个集合。集合中不同类型的数据被称为成员，每个成员都要自己不同的类型，可以理解为 js 中对象的每个属性。

### 声明结构体

结构体通过 `type` 和 `struct` 关键字进行声明，`type` 后接结构体的名字，`struct` 后接结构体每个成员的定义。

```go
type Person struct {
  name string
  age int
  gender string
  address string
}
```

上面代码有点类似于其他语言中接口的定义，实际上，go 也支持定义接口，我们只需要将 `struct` 关键字替换成 `interface` 就表示定义接口。

### 初始化结构体

初始化结构体有两种方式，一种是通过字面量的方式，用结构体名称加上结构体各个成员值的方式进行初始化。用上面的 `Person` 结构体举例：

```go
var p = Person{"Shenfq", 25, "男", "湖南长沙"}
fmt.Println("Person:", p)
```

![](https://file.shenfq.com/pic/20210418162456.png)

这种方式需要每个值按照结构体成员定义时的顺序进行初始化，当然，也可以通过键值对的方式，打乱其顺序。这种方式可以对部分成员进行省略，省略的部分会根据其类型，取该类型的空值。

```go
var p = Person{
  name: "Shenfq",
  address: "湖南长沙",
}

fmt.Println("Person:", p)
fmt.Println("Person.age:", p.age)
```

如果要访问结构体成员，可以通过 `.` 操作符，这与其他语言取对象属性的方式一致。这里我们使用 `p.age` 的方式获取了结构体 `p` 的成员 `age` 的值。

![](https://file.shenfq.com/pic/20210418162725.png)

除了字面量的方式初始化，结构体还可以通过 `new` 关键字进行初始化。

```go
var p = new(Person)
```

通过该方式初始化的结构体有两个特点：

- new 关键字返回的为结构体指针；
- new 关键字返回的结果每个成员都是空值；

所以，我们通过 `new` 初始化结构体的时候，取值的时候需要加 `*` 号。

```go
var p = new(Person)
p.name = "Shenfq"
p.age = 18
p.gender = "男"
p.address = "湖南长沙"

fmt.Println("Person:", p)
```

如果直接在控制台打印变量 `p`，会发现前面有个 `&`，表示这是一个指针。

![](https://file.shenfq.com/pic/20210418204339.png)

### 匿名结构体

结构体和函数一样也可以定义一个没有名字的结构体，就是在定义结构体的同时进行初始化，并且省略 `type` 关键字和结构体名称。

```go
var p = struct {
  name string
  age int
  gender string
  address string
} { "Shenfq", 25, "男", "湖南长沙"}
```

## 方法

结构体只能定义一个个成员，而且成员都是基础类型，想要实现类似 OOP 中类的概念，还需要为结构体提供方法。实际上，我们可以为结构体指定方法，只需要在定义函数的函数名前面加上结构体名，就能定义该函数为结构体的方法。

我们为之前的 `Person` 结构体定义一个 `sayHello` 的方法。

```go
func (p Person) sayHello(name string) {
	fmt.Printf("Hi %s, I'm %s, How are you?\n", name, p.name)
}
p.sayHello("Jack")
```

调用结构体方法的方式，和取结构体成员的值一样，也需要通过 `.` 操作符。

![](https://file.shenfq.com/pic/20210419103247.png)

在 goland 的 Structure 中，能看到 `Person` 结构体是包含 `sayHello` 方法的，说明方法的定义即使不在结构体内，这个方法也是属于该结构体的。

![](https://file.shenfq.com/pic/20210419141849.png)

### 方法中的指针

有时候，我们调用方法的同时，需要修改结构体中一些成员的值，会发现原结构体的值并没有改变。

```go
func (p Person) growth() {
	p.age++
}

var p = Person{ age: 25 }
p.growth()
```

上面的代码中，我们定义的 `growth` 方法，会修改传入结构体中的 `age` 值。但是实际结果和我们预期的不一样。

```go
var p = Person{ age: 25 }

p.growth()
fmt.Println("age:", p.age)
```

![](https://file.shenfq.com/pic/20210419161602.png)

这是由于，传入方法中的结构体，是原结构体复制后的值，需要修改原结构体，就需要给方法传入其指针。只需要在方法定义结构体参数时，加上 `*` 号，表示变量 `p` 为结构体指针。

```go
func (p *Person) growth() {
	p.age++
}
```

![](https://file.shenfq.com/pic/20210419161824.png)