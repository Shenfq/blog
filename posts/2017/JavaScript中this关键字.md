---
title: JavaScript中this关键字
author: shenfq
date: 2017/10/12
categories:
- 前端
tags:
- js基础
- this
- 前端
---

# JavaScript中this关键字

this一直是js中一个老生常谈的东西，但是我们究竟该如何来理解它呢？       
在《JavaScript高级程序设计》中，对this的解释是：
> this对象是在运行时基于函数的执行环境绑定的。

我们来逐字解读这句话：
- this是一个对象
- this的产生与函数有关
- this与执行环境绑定

说通俗一点就是，“**谁调用的这个函数，this就是谁**”。

<!-- more -->

---


#### 一、函数直接调用中的this

**举个栗子：**
```javascript
var x = 1;

function testThis() {
    console.log(this.x);
}

testThis();  //1
```
js中有一个全局对象window，直接调用函数testThis时，就相当于调用window下的testThis方法，包括直接声明的变量也都是挂载在window对象下的。

```javascript
var x = 1;
function testThis() {
    this.innerX = 10;
    return 1;
}
testThis() === window.testThis();  // true
innerX === window.innerX;  // true
x === window.x;  // true

```
同理，在匿名函数中使用this也是指向的window，因为匿名函数的执行环境具有全局性。

```javascript
(function () {
    console.log(this); //window
})();
```

但是呢，凡事都有例外，js的例外就是严格模式。在严格模式中，禁止this关键字指向全局对象。

```javascript
(function () {
    'use strict';
    console.log(this); //undefined
})();
```

---

#### 二、对象方法调用中的this

**再举个栗子：**

```javascript
var person = {
    "name": "shenfq",
    "showName": function () {
        console.log(this.name);
    } 
};

person.showName(); // 'shenfq'
```
此时，showName方法中的this指向的是对象person，因为调用showName的是person对象，所以showName方法中的 this.name 其实就是 person.name。

但是如果我们换个思路，把showName方法赋值给一个全局变量，然后在全局环境下调用。

```javascript
var name = 'global',
    person = {
        "name": "shenfq",
        "showName": function () {
            console.log(this.name);
        } 
    },
    showGlobalName = person.showName;
showGlobalName(); // 'global'
```
可以看到，在全局环境中调用showName方法时，this就会指向window。

再换个思路，如果showName方法被其他对象调用呢？

```javascript
var person = {
        "name": "shenfq",
        "showName": function () {
            console.log(this.name);
        } 
    },
    animal = {
        "name": "dog",
        "showName": person.showName
    };

animal.showName(); // 'dog'
```
此时的name又变成了animal对象下的name，再复杂一点，如果调用方法的是对象下的一个属性，而这个属性是另个对象。

```javascript
function showName () {
    console.log(this.name);
}
var person = {
    "name": "shenfq",
    "bodyParts": {
        "name": "hand",
        "showName": showName
    },
    "showName": showName
};

person.showName(); // 'shenfq'
person.bodyParts.showName(); // 'hand'
```
虽然调用showName方法的最源头是person对象，但是最终调用的是person下的bodyParts，所以方法写在哪个对象下其实不重要，重要的是这个方法最后被谁调用了，**this指向的永远是最终调用它的那个对象**。讲来讲去，this也就那么回事，只要知道函数体的执行上下文就能知道this指向哪儿，这个规则在大多数情况下都适用，注意是**大多数情况**，少部分情况后面会讲。

最后一个思考题，当方法返回一个匿名函数，这个匿名函数里面的this指向哪里？

```javascript
var name = 'global',
    person = {
        "name": "shenfq",
        "returnShowName": function () {
            return function () {
                console.log(this.name);
            }
        } 
    };

person.returnShowName()(); // 'global'
```
答案一目了然，匿名函数不管写在哪里，只要是被直接调用，它的this都是指向window，因为匿名函数的执行环境具有全局性。

---

#### 三、new构造函数中的this

**还是先举个栗子：**

```javascript
function Person (name) {
    this.name = name;
}
var global = Peson('global'),
    xiaoming = new Person('xiaoming');

console.log(window.name); // 'global'
console.log(xiaoming.name); // 'xiaoming'
```

首先不使用new操作符，直接调用Person函数，这时的this任然指向window。当使用了new操作符时，这个函数就被称为构造函数。

所谓构造函数，就是用来构造一个对象的函数。构造函数总是与new操作符一起出现的，当没有new操作符时，该函数与普通函数无区别。

对构造函数进行new操作的过程被称为实例化。new操作会返回一个被实例化的对象，而构造函数中的this指向的就是那个被实例化的对象，比如上面例子中的xiaoming。

**关于构造函数有几点需要注意：**
1. 实例化对象默认会有constructor属性，指向构造函数；


```javascript

function Person (name) {
    this.name = name;
}
var xiaoming = new Person('xiaoming');

console.log(xiaoming.constructor); // Person

```

2. 实例化对象会继承构造函数的原型，可以调用构造函数原型上的所有方法；


```javascript

function Person (name) {
    this.name = name;
}
Person.prototype = {
    showName: function () {
        console.log(this.name);
    }
};
var xiaoming = new Person('xiaoming');

xiaoming.showName(); // 'xiaoming'

```

3. 如果构造函数返回了一个对象，那么实例对象就是返回的对象，所有通过this赋值的属性都将不存在

```javascript

function Person (name, age) {
    this.name = name;
    this.age  = age;
    return {
        name: 'innerName'
    };
}
Person.prototype = {
    showName: function () {
        console.log(this.name);
    }
};
var xiaoming = new Person('xiaoming', 18);

console.log(xiaoming); // {name: 'innerName'}

```


---


#### 四、通过call、apply间接调用函数时的this

**又一次举个栗子：**

```javascript
var obj = {
    "name": "object"
}

function test () {
    console.log(this.name);
}

test.call(obj);   // 'object'
test.apply(obj);  // 'object'
```
[call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)与[apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)方法都是挂载在Function原型下的方法，所有的函数都能使用。

这两个函数既有相同之处也有不同之处：
- 相同的地方就是它们的第一个参数会绑定到函数体的this上，如果不传参数，this默认还是绑定到window上。
- 不同之处在于，call的后续参数会传递给调用函数作为参数，而apply的第二个参数为一个数组，数组里的元素就是调用函数的参数。

语言很苍白，我只好写段代码：

```javascript
var person = {
    "name": "shenfq"
};
function changeJob(company, work) {
    this.company = company;
    this.work    = work;
};

changeJob.call(person, 'NASA', 'spaceman');
console.log(person.work); // 'spaceman'

changeJob.apply(person, ['Temple', 'monk']);
console.log(person.work); // 'monk'

```

有一点值得注意，这两个方法会把传入的参数转成对象类型，不管传入的字符串还是数字。


```javascript
var number = 1, string = 'string';
function getThisType () {
    console.log(typeof this);
}

getThisType.call(number); //object
getThisType.apply(string); //object
```

#### 五、通过bind改变函数的this指向

**最后举个栗子：**

```javascript
var name = 'global',
    person = {
        "name": "shenfq"
    };
function test () {
    console.log(this.name);
}

test(); // global

var newTest = test.bind(person);
newTest(); // shenfq
```

bind方法是ES5中新增的，和call、apply一样都是Function对象原型下的方法-- Function.prototype.bind ，所以每个函数都能直接调用。bind方法会返回一个与调用函数一样的函数，只是返回的函数内的this被永久绑定为bind方法的第一个参数，并且被bind绑定后的函数不能再被重新绑定。


```javascript
function showName () {
    console.log(this.name);
}
var person = {"name": "shenfq"},
    animal = {"name": "dog"};

var showPersonName = showName.bind(person),
    showAnimalName = showPersonName.bind(animal);

showPersonName(); //'shenfq'
showAnimalName(); //'shenfq'
```
可以看到showPersonName方法先是对showName绑定了person对象，然后再对showPersonName重新绑定animal对象并没有生效。


#### 六、箭头函数中的this

**真的是最后一个栗子：**

```javascript
var person = {
    "name": "shenfq",
    "returnArrow": function () {
        return () => {
            console.log(this.name);
        }
    }
};

person.returnArrow()(); // 'shenfq'
```

箭头函数是ES6中新增的一种语法糖，简单说就是匿名函数的简写，但是与匿名函数不同的是箭头函数中的this表示的是外层执行上下文，也就是说箭头函数的this就是外层函数的this。


```javascript
var person = {
    "name": "shenfq",
    "returnArrow": function () {
        let that = this;
        return () => {
            console.log(this == that);
        }
    }
};

person.returnArrow()(); // true
```


---

#### 补充：

**事件处理函数中的this：**

```javascript
var $btn = document.getElementById('btn');
function showThis () {
    console.log(this);
}
$btn.addEventListener('click', showThis, false);
```

点击按钮可以看到控制台打印出了元素节点。

![事件结果](//file.shenfq.com/17-10-12/25450020.jpg)

其实事件函数中的this默认就是绑定事件的元素，调用事件函数时可以简单理解为

> $btn.showThis()

只要单击了按钮就会已这种方式来触发事件函数，所以事件函数中的this表示元素节点，这也与之前定义的**“谁调用的这个函数，this就是谁”**相吻合。

**eval中的this：**
```javascript
eval('console.log(this)'); //window
var obj = {
    name: 'object',
    showThis: function () {
        eval('console.log(this)');
    }
}
obj.showThis(); // obj
```
[eval](http://www.nowamagic.net/librarys/veda/detail/1627)是一个可以动态执行js代码的函数，能将传入其中的字符串当作js代码执行。这个方法一般用得比较少，因为很危险，想想动态执行代码，什么字符串都能执行，但是如果用得好也能带来很大的便利。

eval中的this与箭头函数比较类似，与外层函数的this一致。

当然这只针对现代浏览器，在一些低版本的浏览器上，比如ie7、低版本webkit，eval的this指向会有些不同。

eval也可以在一些特殊情况下用来获取全局对象(window、global)，使用 [(1,eval)('this')](https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript)。


---

先写这么多，有需要再补充 ^ _ ^


#### 参考：
1. [this - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
2. [Javascript的this用法](http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html)
3. [(1,eval)('this') vs eval('this') in JavaScript?](https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript)