---
title: 详解 Webpack devtools
author: shenfq
date: 2022/10/08
categories:
- 前端
tags:
- JavaScript
- SourceMap
- Webpack
- Babel
- 编译
---

最近主要在开发一个低代码平台，主要用于运营搭建 H5 活动。这中间涉及到第三方组件的开发，而第三方组件想要接入平台，需要经过我们特定的打包工具来build。构建之后的组件，会合并成单个的 js 文件，而且代码会被压缩会混淆，这个时候如果需要调试，那就会极其痛苦。想要有一个好的调试环境，就要涉及 SourceMap 的输出，而 Webpack 的 `devtools` 字段就是用于控制 SourceMap。

## SourceMap 原理

在详细解释 devtools 配置之前，先看看 SourceMap 的原理。SourceMap 的主要作用就是用来还原代码，将已经编译压缩的代码，还原成之前的代码。

下图左边代码为 Webpack 打包之前，右边为打包之后。

![](https://file.shenfq.com/pic/202210072228319.png)

打开 chrome 引入 `dist.js` ，会发现浏览器会自动将压缩的代码进行了还原。

![](https://file.shenfq.com/pic/202210072229423.png)

那这个 SourceMap 到底是怎么将右边的代码还原成左边的样子的呢。我们先看一下 `dist.js.map` 的结构。

```js
{
  // 版本号
  "version": 3,
  // 输出的文件名
  "file": "dist.js",
  // 输出代码与源代码的映射关系
  "mappings": "MAAA,IAAMA,EAAM,CACVC,KAAM,KACNC,OAAQ,KAGV,SAASC,IACPH,EAAIE,QAAU,EAGhB,SAASE,IACPJ,EAAIE,QAAU,EACdG,QAAQC,IAAIN,EAAIC,KAAM,OAGxBE,IACAC,IACAA,IACAD,K",
  // 原代码中的一些变量名
  "names": [
    "dog", "name", "weight",
    "eat", "call", "console", "log"
  ],
  // 源文件列表
  // 我们打包的时候经常是多个js文件合并成一个，所以源文件有多个
  "sources": [
    "webpack:///./src/index.ts"
  ],
  // 源文件内容的列表，与sources字段对应
  "sourcesContent": [
    "const dog = {\n  name: '旺财',\n  weight: 100\n}\n\nfunction eat() {\n  dog.weight += 1\n}\n\nfunction call() {\n  dog.weight -= 1\n  console.log(dog.name, '汪汪汪')\n}\n\neat()\ncall()\ncall()\neat()"
  ],
}
```

其他字段应该都好理解，比较难懂的就是 `mappings` 字段，看着就像是一堆乱码。这是一串使用 VLQ 进行编码的字符串，规则比较复杂。我们可以直接在 github 找一个[VLQ（https://github.com/Rich-Harris/vlq/blob/master/src/index.js）](https://github.com/Rich-Harris/vlq/blob/master/src/index.js)编码的库，对这串字符进行解码。

```js
/** @type {Record<string, number>} */
let char_to_integer = {};

/** @type {Record<number, string>} */
let integer_to_char = {};

'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	.split('')
	.forEach(function (char, i) {
		char_to_integer[char] = i;
		integer_to_char[i] = char;
	});

/** @param {string} string */
function decode(string) {
	/** @type {number[]} */
	let result = [];

	let shift = 0;
	let value = 0;

	for (let i = 0; i < string.length; i += 1) {
		let integer = char_to_integer[string[i]];

		if (integer === undefined) {
			throw new Error('Invalid character (' + string[i] + ')');
		}

		const has_continuation_bit = integer & 32;

		integer &= 31;
		value += integer << shift;

		if (has_continuation_bit) {
			shift += 5;
		} else {
			const should_negate = value & 1;
			value >>>= 1;

			if (should_negate) {
				result.push(value === 0 ? -0x80000000 : -value);
			} else {
				result.push(value);
			}

			// reset
			value = shift = 0;
		}
	}

	return result;
}
```

mappings 字符串一般通过分号（`;`）和逗号（`,`）进行分隔。每个分号分隔的部分对应压缩后代码的每一行。因为上面打包的代码经过了压缩，只有一行代码，所以这个 mappings 中就没有分号。而通过逗号进行分割的部分表示压缩后代码当前行的某一列与源代码的对应关系。

我们试着通过上面的代码，对 mappings 的前面一部分进行解码。

```js
'MAAA,IAAMA,EAAM,CACVC,KAAM'.split(',').forEach((str) => {
	console.log(decode(str))
})
```

解码结果如下：

```js
[ 6, 0, 0, 0 ]       // MAAA
[ 4, 0, 0, 6, 0 ]    // IAAMA
[ 2, 0, 0, 6 ]       // EAAM
[ 1, 0, 1, -10, 1 ]  // CACVC
[ 5, 0, 0, 6 ]       // KAAM
```

每一串字符都对应五个数字，这个五个数字分别对应下面的含义：

1. 第一位，表示这个位置压缩代码的第几列（与前面的数字累加获取）。

2. 第二位，表示这个位置属于sources属性中的哪一个文件。

3. 第三位，表示这个位置属于源码的第几行（与前面的数字累加获取）。
4. 第四位，表示这个位置属于源码的第几列（与前面的数字累加获取）。
5. 第五位，表示这个位置属于names属性中的哪一个变量。

那么 `MAAA: [ 6, 0, 0, 0 ]:` 对应的意思就是，压缩后代码的第1行的第7列（PS. 计数都是从0开始，所以数字6对应的应该是第7列，后面的数字同理），对应sources中的第1个文件的第1行的第1列。看代码能看出，就是表示压缩后的这个 var 声明，对应源码的 const。

![](https://file.shenfq.com/pic/202210072233476.png)

在看看 `IAAMA: [ 4, 0, 0, 6, 0 ]`，表示压缩代码的第11列（这里的4，表示从前面已计算的列向后再数4列，也就是第11列），对应源码第1行的第7列（这里同理，也是向后数6列），且对应 names 属性的第1个变量名，也就是 `"dog"`。这里对代码进行了混淆，所以有个 names 字段专门用来记录压缩之前的变量名。

![](https://file.shenfq.com/pic/202210072239050.png)

简单翻译一下前面的解码结果：

```js
[ 6, 0, 0, 0 ] // 压缩代码的第7列，对应源码第1行的第1列
[ 4, 0, 0, 6, 0 ] // 压缩代码的第11列，对应源码第1行的第7列，对应names第1个变量（"dog"）
[ 2, 0, 0, 6 ] // 压缩代码的第13列，对应源码第1行的第13列
[ 1, 0, 1, -10, 1 ] // 压缩代码的第14列，对应源码第2行的第3列，对应names第2个变量（"name"）
[ 5, 0, 0, 6 ] // 压缩代码的第19列，对应源码第2行的第9列
```

可以看到这里面出现了一个负数，这里是因为对应关系从源码的第1行，跳到了第2行，新的一行列数应该从前面开始计算，而列数是按照前面的结果累加的，所以这里要进行列数的回退，所以出现了一个负数，将列数进行回退。

上面是代码经过压缩处理的情况，如果我们只通过webpack进行打包处理，不进行压缩，生成的 mappings 如下：

![](https://file.shenfq.com/pic/202210080833607.png)

可以看到，`dist.js` 前面5行代码都是 webpack 生成的 runtime，与源代码无关，所以 mappings 前面有五个分号（`;`），表示前 5 行与源码没有对应关系，后面的 `AAAA,IAAMA,GAAG,GAAG;` 才是 `dist.js` 第六行与源码的对应关系。

## devtools 配置项

在了解了 SourceMap 的原理后，在看看 devtools 的配置项。如果看 Webpack 的[官方文档](https://webpack.docschina.org/configuration/devtool/)，会发现 `devtools` 的配置项是一个有十几行的表格，有点唬人，仔细观察会发现，`devtools` 配置以 `"source-map"` 为基础，然后加上各种前缀。

**格式如下：**

```js
[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
```

不同的配置会生成不同的产物，在 webpack 的 github 仓库中，有一个专门的demo用于展示不同参数打包后的产物：[https://github.com/webpack/webpack/tree/main/examples/source-map](https://github.com/webpack/webpack/tree/main/examples/source-map)。

#### source-map

先看最基础的配置（`devtools: "source-map"`），就是单独生成一个 `.map` 文件，然后在打包代码的最后一行加上一个注释，写明生成 SourceMap 的路径，方便浏览器读取。

```js
//# sourceMappingURL=SourceMap文件路径
```

![](https://file.shenfq.com/pic/202210080927039.png)

#### inline-source-map

看名字很容易理解，在前面加上 `inline-` 属于内联的 SourceMap，就是将 SourceMap 的内容进行 base64 转义，直接放到打包代码的最后一行。

```js
//# sourceMappingURL=data:application/json;charset=utf-8;.......
```

![](https://file.shenfq.com/pic/202210081006624.png)

#### eval/eval-source-map

eval-source-map 会将对应模块的代码都放到 `eval()` 中执行，如果加上了 `//# sourceURL=xxx` ，浏览器会自动将 eval 中的代码自动放到 sources 中。

![](https://file.shenfq.com/pic/202210081031292.png)

![eval中的代码在sources中也能看到](https://file.shenfq.com/pic/202210081103610.png)

通过 eval 生成代码的好处，改动了某个模块，只需要对某个模块的代码重新 eval 就可以，可以提升二次编译的效率。官方文档也有说明，`eval` 的 `rebuild` 的效率基本是最高的。

![](https://file.shenfq.com/pic/202210081107282.png)

#### cheap-source-map/cheap-module-source-map

```js
// source-map
"mappings": ";;;;;AAAA,IAAMA,GAGL,GAAG;EACFC,IAAI,EAAE,IADJ;EAEFC,MAAM,EAAE;AAFN,CAHJ;;AAQA,SAASC,GAAT,CAAaD,MAAb,EAA6B;EAC3BF,GAAG,CAACE,MAAJ,IAAcA,MAAd;AACD;;AAED,SAASE,IAAT,GAAgB;EACdJ,GAAG,CAACE,MAAJ,IAAc,CAAd;EACAG,OAAO,CAACC,GAAR,CAAYN,GAAG,CAACC,IAAhB,EAAsB,KAAtB;AACD;;AAEDE,GAAG,CAAC,EAAD,CAAH;AACAC,IAAI;AACJA,IAAI;AACJD,GAAG,CAAC,CAAD,CAAH,C"

// cheap-source-map
"mappings": ";;;;;AAAA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA;AACA"
```

上面是通过 `source-map` 和 `cheap-source-map` 生成的 mappings 的区别，可以看到 `cheap-source-map` 生成的 mappings 精简了很多。因为 `cheap-source-map` 去掉了列信息，可以大幅提高 souremap 生成的效率。

在 webpack 打包的过程中，代码会经过许多 loader 处理，而 loader 处理的过程中，对应的代码映射关系可能会发生变化，而 `cheap-module-source-map`  的作用就是打包后的代码是与最开始的代码进行对应的，而不是经过 loader 处理的代码。

![](https://file.shenfq.com/pic/202210081156104.png)

我们先写一段 typescript 代码，如下：

```ts
const dog: {
  name: string,
  weight: number
} = {
  name: '旺财',
  weight: 100
}
function eat(weight: number) {
  dog.weight += weight
}
function call() {
  dog.weight -= 1
  console.log(`${dog.name}: 汪汪汪`)
}

eat(10)
call()
call()
eat(5)
```

先看看直接使用 `cheap-source-map` 还原出的代码：

![](https://file.shenfq.com/pic/202210081158240.png)

在看看 `cheap-module-source-map` 进行还原出的代码：

![](https://file.shenfq.com/pic/202210081200764.png)

#### hidden-source-map

与 `source-map` 配置一样，会单独生成一个 `.map` 文件，只是打包代码的最后没有与之关联的注释，一般生产发布的时候，将 `.map` 文件上传到报错平台（例如：sentry）。另外，如果配置了多个 loader，可以考虑在上线时，将 devtools 配置成 `hidden-cheap-module-source-map`。

![](https://file.shenfq.com/pic/202210081204545.png)

### 小结

上面介绍了各种配置输出代码的特性，每一种都是能排列组合的。比如，在开发环境，为了尽可能的看到未经过 loader 转化的原代码，可以配置成 `cheap-module-source-map`。如果需要进一步提升编译速度，就可以配置成 `eval-cheap-module-source-map`。而在发布上线的时候，就可以将配置调整成 `hidden-cheap-module-source-map`。
