---
title: USB 科普
author: shenfq
date: 2019/06/28
categories:
- 其他
tags:
- USB
---

# USB 科普


## 什么是 USB？

![USB](https://file.shenfq.com/FpXvpHY5rIYID72c1rOVAowxtW42.png)

维基百科的解释：

> 通用串行总线（英语：Universal Serial Bus，缩写：USB）是连接计算机系统与外部设备的一种串口总线标准，也是一种输入输出接口的技术规范，被广泛地应用于个人计算机和移动设备等信息通讯产品，并扩展至摄影器材、数字电视（机顶盒）、游戏机等其它相关领域。

在几年前，市面上常见的 USB 数据线都使用如下结构，一边 USB Type-A（主要用于连接电脑或充电器）, 一边 USB Micro-B（主要用来连接手机或其他手持设备），主要还是因为安卓手机普遍使用这种类型的数据线进行充电。

![image](https://file.shenfq.com/FltrBsi-aqL4d6M8A9tvAF2W_qsJ.png)

![image](https://file.shenfq.com/Fqeuqar1k5k2ZrboYkPmvL3Tb9tH.png)

所以 USB 我们身边随处可见，而且必不可少。但是在 90  年代初期，人们的电脑桌上需要摆放一堆杂乱无章的线（虽然现在依然是一堆线，但好歹接口统一了），当时调制解调器需要一条线、键盘需要一条线，打印机也需要一条又粗又大的线。于是，USB 的发明者`阿杰伊-巴特( Ajay Bhatt)`，开始捣鼓 USB。

![阿杰伊-巴特](https://file.shenfq.com/FoiA_zN_wrvLygMuyoxXP_vzRPqE.png)

目前全球有超过 100 亿台设备在使用 USB 数据线，如果每根数据线收取 1 分的专利费，那就赚发了。但是 USB 技术没有赚到任何的钱，因为为 USB 技术提供资助，并且拥有USB技术的全部专利的公司英特尔，它们免费开放了这项技术，不得不说英特尔在这方面还是表现很不错的。


## USB 接口类型

上面说到的 USB Type-A、USB Micro-B 都是指 USB 的接口类型，作为最早开始使用的 USB Type-A 因为成本的考虑并没有做成两面都可插拔的方式，现在来看或许有些遗憾，不过好在 USB Type-C 横空出世，完美的解决了这个问题。

> 巴特在一次采访中说道： “当年我们做这个接口的时候，就是希望它能够解决 90 年代的线缆连接问题。以前的插头和连接器太多了，很复杂，人们用起来其实并不方便。我是希望能有一个接口，可以帮助一般的家庭能快速把计算机和打印机连接起来，并且能够打印他们需要的东西。只要这个接口足够方便，他们接上就会用，同时也不需要每次都打电话来向我求助，那我觉得这样的接口就足够。要让 USB 接口做到正反插都能兼容，其实并不容易。如果要用上这种设计，那就必须在 USB 接口上嵌入多一倍的电线和电路，那成本也必定要翻倍。”

在上个世纪 USB 接口更多是以普及为主要目标，所以为了让厂商和用户接受，USB 接口的设计采用更低成本的方案也是可以接受的，这个方案也为这个接口带来了普及的机会。

### 常见的 USB 接口

除了 USB Type-A 和 USB Type-C 之外，当然也有 USB Type-B ，以及 USB Micro-B，这四种是市面上常见的 USB 接口。 

![常见 USB 接口](https://file.shenfq.com/Flls4CqeC0US-ob94L09gYYa0_S_.png)

#### Type-A：标准版USB接口

最常见的一种USB接口类型，在电脑上常用。

#### Type-B：打印机设备常用

打印机上最为常见和流行的一种数据接口类型。

#### Micro-B：移动设备的USB标准

Type-B的便携版本，大部分安卓手机中采用的是Micro USB 接口(即 USB Micro-B)，这种接口至今仍被广泛地应用在各种移动便携式设备上。

#### Type-C：USB 接口的未来

现在的各种笔记本、平板电脑甚至是智能手机都开始使用USB Type-C接口。

#### 其他类型的 USB 接口

在 Micro-B 接口出现之前，还有一种 Mini-B 接口，又称迷你USB。因为其 T 字型的造型，又被成为 T 字头。

![Mini-B](https://file.shenfq.com/FrLTPJmbePysT-rg4bLHNde7J6m-.png)

此外，Micro-B 接口因为只兼容 USB 2.0 的协议，后面又出现了一种新的 兼容 USB 3.0 协议的 Micro-B 接口，有时也被称为 Micro-USB 3.0。

![Micro-USB 3.0](https://file.shenfq.com/Fq6g0uP8uNesvt_1w9zwuxB5xYNd.png)

当然，除了 Micro-B 和  Mini-B，Micro-A 和  Mini-A也是存在的，只是实用性不太广，B 口都是 A 口的改良版。

![Mini-USB](https://file.shenfq.com/FuLPbPojXIvbdR3BQA8SeNVKxDK5.png)
![Micro-USB](https://file.shenfq.com/FkWNAXCbDzHvYHlDgeXNqIbq-ppJ.png)

### Type-C 接口的优势

1. 小巧精妙的设计：Type-C 接口的大小约为 8.3*2.5mm，差不多是 Type-A 接口的三分之一；同时可以正反插入，极大的方便了使用者。
2. 支持 USB 3.1 （关于协议部分在文章后面讲）的全部功能：最大数据传输速度可达到 10Gbit/秒，最大功率可达 100W，不管是在数据还是功率传输上都有十分明显的优势。
3. 可扩展能力强：一个 USB Type-C 接口，可以承载充电、数据传输、视频传输、投影仪连接等多种功能。

## USB 传输协议

Type-C 火爆的另一个原因就是与 Type-C 接口同时推出的 USB 3.1 标准，该标准极大的改善了数据线的数据传输的体验。

### USB 版本历史

USB 的第一个版本既不是 0.1，也不是 1.0，而是从 0.7 开始的，1994年11月11日发表了USB V0.7版本。

#### 1.0 之前的版本

- USB 0.7：1994年11月发布。
- USB 0.8：1994年12月发布。
- USB 0.9：1995年4月发布。
- USB 0.99：1995年8月发布。
- USB 1.0 RC：1995年11月发布。

#### USB 1.0

1998年9月发布。数据传输速率为1.5Mbit/s(Low-Speed)。数据传输速率为12Mbit/s（Full-Speed），修正1.0版已发现的问题。

![Full Speed](https://file.shenfq.com/FhCiT8_4P74cQrmnZDb__pDRcCSI.png)

#### USB 1.1

1996年1月发布。数据传输速率为1.5Mbit/s(Low-Speed)。

#### USB 2.0

2000年4月发布。数据传输速率为480Mbit/s（现在称作Hi-Speed），但受限于BOT传输协议和NRZI编码方式，实际最高传输速度只有35MByte/s左右。关于 USB 2.0 的其他规范可以在 [USB.org](https://www.usb.org/) 查到。

![Hi-Speed](https://file.shenfq.com/FouueyYK8K36gBJ2m9BXFr4M12uL.png)


#### USB 3.0（USB 3.1 Gen1）

2008年11月发布。速度由480Mbps大幅提升到5Gbps。USB 3.0插座通常是蓝色的，并向下兼容USB 2.0。

![SuperSpeed](https://file.shenfq.com/FpNKWUug3AM7nScw0gSVJ1MAseHz.png)

#### USB 3.1（USB 3.1 Gen2）

USB 3.0 推广小组于2013年7月31日宣布USB 3.1规格[10]，传输速度提升为10Gb/s，比USB3.0的5Gb/s快上一倍，并向下兼容USB 2.0/1.0，如果要得到10Gb/s的传输速度仍需在主机、目标端同时具备对应的芯片才能达成。

同时，USB 3.1 提高了之前对输出电流的限制，电力供应可高达 100w (20V/5A)，也为现在手机的快充提供了支撑。

![SuperSpeed+](https://file.shenfq.com/FnUBl6Cc8o6imF1qPwOZh27Zz6VR.png)

#### USB 3.2

USB 3.2是2017年7月25日 USB开发者论坛（USB Implementers Forum）宣布基于 USB 3.1 改良推出的USB连接接口的最新版本，除了将传输速度从10Gbps倍增至20Gbps。另外，从 USB 3.2 开始，Type-C 将成为唯一推荐的接口方案。

#### 版本对比

![image](https://file.shenfq.com/FgFpw0hVrmvF1OVOl22x3FsE5_HW.png)

### Type-C 与 USB 3.1

因为 USB 3.1 和 Type-C 是同一时间推出，所以很多人以为这是同一个东西，但是实际上并不是。 USB 3.1 只是由 USB开发者论坛（USB Implementers Forum）推出的一种传输协议，而 Type-C 是一种 USB 接口形式。所以，USB 3.1标准也可以用于 Type-A，Micro-USB 接口，只要开发商愿意进行开发，同时 Type-C接口也可以采用USB2.0、USB3.0、USB3.1等传输标准。

### Thunderbolt 3

Thunderbolt 3 简称 “雷电3”，苹果的协议，同样使用 Type-C 接口。Thunderbolt 是苹果公司与 Intel 公司深度合作推出的一种技术，它融合了传统的 PCIE 数据传输技术和 DisplayPort 显示技术。最新的 Thunderbolt 3 将数据传输、视频输出和充电集合至一个小巧的接口中，接口最高带宽可达到 40Gb/s，是USB3.0的8倍，是USB3.1的4倍。

由于雷电 3 与 USB 3.1 都采用了Type C接口规格，看起来几乎完全相同。现在为了更好的区分两者，苹果最新的雷电3数据线上都会带有雷电标志。

![雷电3](https://file.shenfq.com/FkurWH_pdfrFIfC3zLaLDVaJ8yZB.png)

尽管长得一样，但是两者在协议上还是有很大差距的。


   -     | USB 3.1 Gen2 | Thunderbolt 3
---      |---           |---
传输速度 | 10Gbps | 40Gbps
像素     | One 4K | Two 4K
功率     | 100w   | 100w
支持协议 | DisplayPort USB | DisplayPort USB Thunderbolt PCI EXpress

## USB 4.0？

因为因特尔既是 USB 开发者论坛成员，又是雷电 3 的制定者，所以USB 4.0 其实就是 USB 兼容版本的 雷电 3。目前 USB 4 标准的全本还在修订中，预计正本今年下半年 ~~正式开机~~ ，所以大规模应用还需要1年后了。

---

文中大部分内容参考自 [维基百科](https://zh.wikipedia.org/wiki/USB)。


