---
title: linux下升级npm以及node
author: shenfq
date: 2017/06/12
categories:
- Node.js
tags:
- linux
- node
- npm
- 前端
---

# linux下升级npm以及node

> linux不比windows，鼠标点两下什么都好说，在windows下面升级node，只需要去官网下载最新的msi安装包，然后安装到之前的node路径下，一切ok。其实linux使用命令行也是很爽的，作为程序员，难道不应该更喜欢看到命令行吗，哈哈哈！


<!-- more -->


## npm升级

废话不多说，直接讲步骤。先从容易的开始，升级npm。

npm这款包管理工具虽然一直被人们诟病，很多人都推荐使用yarn，但其使用人数还是不见减少，况且npm都是随node同时安装好的，一时让我抛弃它，还是有点难做到。


```bash
npm i -g npm
```

是的，你没看错。升级npm只需要像安装其它包一样install一下就行，windows和linux下都可以通过此方式进行升级，你还能指定npm的版本。


```bash
npm i -g npm@5.0.0
```


## node升级

node升级相对于npm来说就复杂一点了。          

1. 首先通过npm安装node的版本管理工具“n“，不用惊讶，名字就是这么简单，就叫n。据了解，n是node下的一个模块，作者是Express框架的开发者。

```bash
npm i -g n
```

2. 检查n模块

先查看系统node的安装路径，n模块的默认路径为 ‘/usr/local’。

```bash
$ which node

/data/home/server/nodejs/bin/node   #举个例子
```
如果路径与n模块的默认路径相同可以跳过3步骤。

3. 通过N_PREFIX变量来修改 n 的默认node安装路径。

(1) 编辑环境配置文件

```bash
vim ~/.bash_profile   
```

(2) 将下面两行代码插入到文件末尾

```vim
export N_PREFIX=/data/home/server/nodejs #node实际安装位置
export PATH=$N_PREFIX/bin:$PATH
```

(3)  :wq保存退出；

执行source使修改生效。

```bash
$ source ~/.bash_profile
```

(4) 确认一下环境变量是否生效。


```bash
echo $N_PREFIX
/data/home/server/nodejs
```

4. n模块常用命令


```bash
Commands:

  n                              Output versions installed
  n latest                       Install or activate the latest node release
  n -a x86 latest                As above but force 32 bit architecture
  n stable                       Install or activate the latest stable node release
  n lts                          Install or activate the latest LTS node release
  n <version>                    Install node <version>
  n use <version> [args ...]     Execute node <version> with [args ...]
  n bin <version>                Output bin path for <version>
  n rm <version ...>             Remove the given version(s)
  n prune                        Remove all versions except the current version
  n --latest                     Output the latest node version available
  n --stable                     Output the latest stable node version available
  n --lts                        Output the latest LTS node version available
  n ls                           Output the versions of node available
```


(1) 安装node最新版本


```bash
n latest
```


(2) 安装稳定版


```bash
n stable
```

(3) 安装指定版本

```bash
n v7.10.0
```


(4) 查看已安装版本


```bash
n
```


(5) 删除指定版本


```bash
n rm 6.4.0
```



---

最后，linux下还有一款基于的node管理工具nvm，有兴趣的同学也可以自己尝试下。