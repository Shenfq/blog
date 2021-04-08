---
title: Go 数组与切片
author: shenfq
date: 2021/04/08
categories:
- Go
tags:
- Go
- 数组
---

# Go 数组与切片

## 数组

数组是一组类型相同的，长度固定的，按数字编号排列的数据序列。由于 go 语言中，数组的类型相同且长度固定，所以在声明数组的时候，就会体现这两个特点。

```go
var array [5]int // [0 0 0 0 0]
```

数组通过 `[SIZE]（方括号内为数组长度）` 加上 `TYPE（类型）` 的形式声明，上面的代码就表示 `array` 变量为一个长度为 `5`，且五个数据的类型都为 `int`。

在之前介绍变量的时候，介绍过 `int` 类型的默认值为 `0`，所以 `array` 的值为 `[0 0 0 0 0]`。

### 数组初始化

数组在初始化阶段，需要通过 `{}` 的方式，指定数组每个位置的具体值。

```go
var array [3]int = [3]int{1, 2, 3} // [1 2 3]
```

可以看到 `{}` 的前面也要带上数组的长度与类型，由于 go 能够进行类型推导，变量后声明的类型显得有点多余，是可以省略的。

```go
var array = [3]int{1, 2, 3} // [1 2 3]
```

#### 🎶 指定索引赋值

初始化的过程中，我们还可以指定索引进行赋值，也就是不必给数组的每个位置都安排上具体的值。

```go
var array = [5]int{1: 77, 3: 77} // [0 77 0 77 0]
```

上面的数组输出的结果为：`[0 77 0 77 0]`。和其他语言一样，数组的索引是从 `0` 开始的，我们给索引为 `1` 和 `3` 位置都指定了值为 `77` ，其他位置由于没有指定具体值，就是其类型的默认值。

#### 🎶 自动推导数组长度

前面的案例都是指定了数组的长度，其实我们可以通过 `[...]` 的方式，告诉 go 编译器，数组长度尚未确定，在初始化之后才能确定其长度，然后 go 在编译阶段就会自动进行推导。

```go
var array = [...]int{1, 2, 3, 4, 5} // [1 2 3 4 5]
fmt.Println("array length is", len(array))
```

**我们可以通过 `len` 方法获取数组的长度**，上面代码的运行结果如下：

![](https://file.shenfq.com/pic/20210407195942.png)

如果我们在指定索引的位置赋值了，最终长度取决于最末尾的索引，下面的代码中，指定了索引 `5` 的值为 `77`，则数组的长度为 `6`。

```go
var array = [...]int{1: 77, 5: 77} // [0 77 0 0 0 77]
fmt.Println("array length is", len(array))
```

![](https://file.shenfq.com/pic/20210407200247.png)

### 赋值与访问

与其他语言一样，数组的赋值和访问都是通过 `[Index]` 操作的。

```go
var array = [...]int{1, 2, 3}
array[0] = 100 // 索引 0 的位置重新赋值为 100
fmt.Println("array is", array)
```

![](https://file.shenfq.com/pic/20210407202513.png)

取值也是同样的操作，我们现在实现一个求数组平均数的函数：

```go
func getAverage(array [5]int) float32 {
	var sum int
	var avg float32

	for i := 0; i < 5; i++ {
		sum += array[i]
	}

	avg = float32(sum) / 5

	return avg
}
```

```go
var array = [5]int{1, 2, 3, 4, 5}
fmt.Println("average is", getAverage(array))
```

![](https://file.shenfq.com/pic/20210407205141.png)

### 多维数组

多维数组的声明，相对于一维数组，就是看前面有几个 `[SIZE]`。

```go
var a1 [2][3]int // 二维数组
var a1 [2][3][4]int // 三维数组
```

我们拿三维数组举例，第一个 `[]`  内的数字表示最外层数组的长度，往后以此类推。`[2][3][4]int` 表示最外层数组长度为 2，第二层数组长度为 3，最内层数组长度为 4。其赋值方式也和一维数组一样，只是多维数组需要将多个 `{}` 进行嵌套。

```go
var a1 = [2][3][4]int{
  {
    {1, 2, 3, 4},
    {1, 2, 3, 4},
    {1, 2, 3, 4},
  },
  {
    {1, 2, 3, 4},
    {1, 2, 3, 4},
    {1, 2, 3, 4},
  },
}
fmt.Println(a1)
```

打印结果：

![](https://file.shenfq.com/pic/20210407210214.png)

多维数组的访问和一维数组一样，也是通过 `[]` + 数组索引，只是多维数组要访问某个值需要多个 `[]`。

如果我们要拿到下图的 `2`，访问方式为：`array[0][1][1]`

![](https://file.shenfq.com/pic/20210407210706.png)

```go
fmt.Println("array[0][1][1] = ", array[0][1][1])
```

![](https://file.shenfq.com/pic/20210407210809.png)

## 切片

前面介绍过，数组是一组类型相同且长度固定的数据集合，而切片就是一种比较抽象的数组，其长度不固定，声明方式与数组类似（`[]` 中不显示注明数组长度，也不使用 `[...]` 的方式进行长度的推导）：

```go
var slice []int
```

### 切片初始化

切片的初始化与数组类似，只要省略掉 `[]` 内注明的数组长度即可：

```go
var s1 = []int{1, 2, 3}
s2 := []int{1, 2, 3} // 简写
```

除了这种字面量的声明方式，还可以通过 go 的内置方法：`make`，来进行切片的初始化：

```go
var s1 = make([]int, 3)
s2 := make([]int, 3) // 简写
```

`make` 方法的第二个参数表示切片的长度，虽然切片的长度可变，但是通过 `make` 方法创建切片时，需要指定一个长度。除了指定切片的长度，`make` 方法还支持传入第三个参数，用来指定切片的『容量』，如果没有指定切片的容量，那初始状态切片的容量与长度一致。

```go
func make([]T, len, cap)
```

### 长度与容量

长度指的是，切片内有多少个元素，而容量可以理解为，当前切片在内存中开辟了多大的空间。前面介绍过，可以通过 `len` 方法获取到数组的长度，获取切片的长度也可以使用该方法。要获取切片的容量，可以使用 `cap` 方法。

```go
s1 := make([]int, 5)
fmt.Printf("The length of s1 is %d\n", len(s1))
fmt.Printf("The capacity of s1 is %d\n", cap(s1))
```

![](https://file.shenfq.com/pic/20210408143245.png)

可以看到初始状态下，切片的长度与容量一致。如果要修改切片的长度，可以通过 `append` 方法，在切片尾部追加一个新的值。

```go
s1 := make([]int, 3, 5) // 声明一个长度为 3，容量为 5 的切面
s1 = append(s1, 1) // 在尾部追加一个值，长度会变成 4

fmt.Printf("The length of s1 is %d\n", len(s1))
fmt.Printf("The capacity of s1 is %d\n", cap(s1))
```

![](https://file.shenfq.com/pic/20210408143937.png)

`append` 方法是可以接受多个参数，我们在追加一个值之后，继续调用 `append` 方法，往切片后再追加两个值：

```go
s1 := make([]int, 3, 5)
s1 = append(s1, 1)
s1 = append(s1, 2, 3)
fmt.Println(s1) // [0 0 0 1 2 3]
fmt.Printf("The length of s1 is %d\n", len(s1))
fmt.Printf("The capacity of s1 is %d\n", cap(s1))
```

此时的切片的长度已经变成了 6，超过了切片的容量，那这个时候切换的容量会不会也变成 6？

![](https://file.shenfq.com/pic/20210408144255.png)

根据输出的结果，此时切片的容量变成了 10，这意味着切片的容量的扩充是在之前的基础长进行翻倍操作的。为了验证这个结论，我们在切片后继续追加 5 个值，让切片的长度变成 11，超出当前的容量，看看容量会变成多少。

```go
s1 := make([]int, 3, 5)
s1 = append(s1, 1)
s1 = append(s1, 2, 3)
s1 = append(s1, 4, 5, 6, 7, 8)

fmt.Printf("The length of s1 is %d\n", len(s1))
fmt.Printf("The capacity of s1 is %d\n", cap(s1))
```

![](https://file.shenfq.com/pic/20210408144603.png)

可以看到切片的容量变成了 20，这也验证了我们之前的结论，当切片长度超过了其容量，容量会在原来的基础上翻倍。那如果切片容量达到了 2000，长度超过 2000，容量也会变成 4000 吗？

```go
s1 := make([]int, 1024)
s1 = append(s1, 1)

fmt.Printf("\nThe length of s1 is %d\n", len(s1))
fmt.Printf("The capacity of s1 is %d\n", cap(s1))
```

![](https://file.shenfq.com/pic/20210408144937.png)

可以看到，我们新定义的切片长度为 1024，在长度变成 1025 的时候，容量并没有翻倍。为了避免切片容量无休止的扩展，go 规定如果当前切片的长度大于 1024 ，在长度超过其容量时，只会增加 25% 的容量。

### 切片截取

切片之所以叫切片，是因为它可以通过切出数组中的某一块来创建。语法规则也很简单：`Array[start:end]`。

```go
arr := [5]int{1, 2, 3, 4, 5}
slice := arr[1:3]

fmt.Println(slice) // [2 3]
```

![](https://file.shenfq.com/pic/20210408151709.png)

`arr[1:3]` 表示将数组的从索引为 1 的位置一直到索引为 3 的位置（不包括 3）截取出来，形成一个切片。当然这个开头结尾的数字也是可以省略的，如果我们如果我们省略开头就表示截取开始的位置为 0，省略结尾就表示截取结束的位置一直到数组的最后一位。

```go
arr := [5]int{1, 2, 3, 4, 5}
slice := arr[1:]
fmt.Println(slice) // [2 3 4 5]
```

![](https://file.shenfq.com/pic/20210408152153.png)

通过省略截取的开头和结尾，我们就能将一个数组进行一次拷贝操作，然后形成一个切片。（PS. 截取操作形成的新数据是一个切片）

```go
arr := [5]int{1, 2, 3, 4, 5}
slice := arr[:]

fmt.Printf("slice = %v, slice type is %T", slice, slice)
```

![](https://file.shenfq.com/pic/20210408152646.png)







