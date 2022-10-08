---
title: git快速入门
author: shenfq
date: 2018/04/17
categories:
- Git
tags:
- git
- 版本管理
---


## 背景

git作为现在最为流行的版本管理系统，大部分公司都使用git进行版本控制，
并且最大同性交友网站github也是在git的基础上建立的。
很多人认为git难，在于它的一些概念与之前流行的集中化的版本管理系统有所出入，
只要通过熟悉git的基本概念，以及git分支切换的流程，想要上手还是很容易的。

这篇文章将介绍git的一些基本概念以及git常用的一些命令。github官方提供了一套git学习教程，感兴趣可以[去看看](https://try.github.io/)。

<!-- more -->

## 分布式的版本库

### 基本概念

首先，看看官网是怎么介绍git的。

> Git is a free and open source distributed version control system.      
> Git是一个免费并且开源的分布式版本管理工具。

重点就在于git的分布式，只需要在项目根目录执行`git init`你就拥有了一个git版本库，
同时在该目录下会生成一个`.git`文件夹，该文件夹用来记录你所有的提交信息，类似与`.svn`文件夹。
该文件夹会存储你每次提交的文件的全部信息，只是会经过压缩，具体内容这里不做深入展开。
如果你对git的内部原理感兴趣可以看
[这里](https://bingohuang.gitbooks.io/progit2/content/10-git-internals/sections/objects.html)。

与集中式的版本管理工具不同，git的commit之后提交到本地的版本库，
像svn的commit则是直接提交到服务器的中央版本库。
这就意味这我们都在本地具有一个版本库，那么多人开发时，我们需要如何管理我们的版本库呢？

这里git就引入了一个远程版本库的概念，远程版本库并不会记录我们的代码文件，
只是一个裸仓库，也就是说远程版本库只会保存`.git`目录下的东西，这也相当于间接的记录我们的代码文件。
每个人都能让远程版本库同步你本地的commit信息，但是同步之前会检查你本地的版本库是否与远程版本库的提交信息一致，
如果不一致会提醒你先从远程版本库进行更新。唉，千言万语不如一张图。

![同步到远程版本库](//file.shenfq.com/18-4-14/34749597.jpg)


1. 当我们告诉远程版本库，我有一个新的提交需要你同步，它会拒绝你。
2. 因为在你之前有一个人先同步了提交到远程分支，你必须更新他的提交到你本地，你才能继续同步你的提交。

git在提交到版本库之前，还有一个步骤，那就是添加到暂存区，至于git为什么会存在暂存区，知乎上有个回答我觉得说得挺好的（[传送门](https://www.zhihu.com/question/19946553/answer/29033220)）。

大致意思是说，早期的版本管理工具有成熟的gui，比如用svn，每一次提交都能让你自由选择需要提交哪些文件的修改。

![小乌龟](//file.shenfq.com/18-4-15/73819602.jpg)

而在命令行下面，这些操作比较麻烦，为了解决这个问题，于是在commit之前增加了一个暂存区，用来存放我们需要提交的文件。好了，我们再回过头来看看git在版本管理上分了哪些部分。

![](//file.shenfq.com/18-4-14/41364002.jpg)


### git命令简介

了解了这些概念，我们再来看看，如何初始化一个git仓库，并且在修改代码后将提交同步给远程版本库。

#### 初始化git配置

该配置是用来告诉版本库是谁提交代码。

```bash
#全局设置用户名
git config --global user.name "your name"

#全局设置邮箱
git config --global user.email "xxxxxxxxx@qq.com"

```

#### 初始化git仓库

这里有两种方式，一种是新建一个本地版本库，然后手动连接远程版本库，还一种是直接获取远程版本到本地。

1. 新建本地仓库，并与远程版本库进行连接

```bash
mkdir hub && cd hub

git init  #初始化git仓库

git remote add origin git@github.com:github/hub.git  #关联远程版本库，并取名为origin

git pull origin master  #获取名为origin的远程版本库的提交信息到本地版本库
```

2. 获取远程的版本库到本地

```bash

git clone git@github.com:github/hub.git  #该命令相当于上面三步的缩写

```

#### 修改文件并提交到暂存区

我们可以新建一个文件（eg. `reamde.md`），然后通过add命令，将该文件添加到暂存区，表示该文件是我们要提交到版本库的文件。

```bash
# 将一个修改后的文件添加到暂存区
git add readme.md


# gitadd其他用法

# 添加所有修改、删除或新建的文件到暂存区
git add .
# 添加所有以js结尾的文件到暂存区
git add *.js
# 添加所有修改、删除或新建的文件到暂存区
# 除了.开头的文件，比如 .gitignore
git add *
# git add --update 的缩写
# 如果再次修改了在暂存区中的文件，可以通过该命令进行更新
git add -u
# 作用与git add . 相同
git add -A

```

#### 提交代码到版本库

我们现在已经把代码添加到了暂存区，接下来就需要把暂存区的代码提交到版本库。

```bash
# 提交暂存区的代码到版本库
git commit -m 'commit message'

# 如果你重新编辑了一些文件，添加到暂存区，想把这些修改合并到上一次提交
# 然后会出现一个编辑框，让你修改上次的提交信息
git commit --amend
# 如果不想修改上次的提交信息
git commit --amend --no-edit
```

#### 同步远程版本库到本地版本库

最好每次把自己的提交信息同步给远程版本库之前，先把远程版本库同步到本地。
这里会涉及到分支的概念，我们先放到一边，本地版本库默认默认为master分支
（ps. 也就是我们常说的主干）。

```bash
# 将名为origin的远程版本库的master分支同步到本地的当前分支
git pull origin master

# git pull命令其实是如下两个命令的简写
git fetch origin master
git merge origin/master
```


#### 同步本地版本库到远程版本库

git将本地版本库同步到远程版本库使用push命令，但是每次都需要指定同步给哪个版本库的哪一个分支，
这时，你可以使用`-u`参数将本地版本库与远程版本库绑定，以后提交就不需要指定，默认提交到那个版本库。

```bash
# 将本地的提交同步给远程版本库
git push origin master

# 绑定默认提交的远程版本库
git push -u origin master
# 下次提交只需要使用git push就可以了
git push
```

## git分支

git的分支是git版本管理的重点，git的分支对比svn十分轻量级。

注意，前方高能！！！

为了讲清楚这些概念得画一些图，没办法美术功底太好，话又不会说，只好画图写教程了。

### 何为分支

要搞清楚git的分支概念，首先需要知道git是如何区分不同的分支的。
在git中，一个分支就会存在有一个指针，该指针指向一个commit。
每次拉分支就会在当前commit上创建一个新的指针，而且分支的指针每次都会跟随commit前移。

```bash
# 查看当前分支
git branch #刚刚初始化的版本库默认在master分支上
# 新建分支
git branch branch #新建一个名为branch的分支
```

![新建分支](//file.shenfq.com/18-4-17/92923237.jpg)

那么现在有个问题，在新建一个分支之后，两个分支指向同一个commit，到底怎么区分现在哪个分支上呢？
这里就要引入一个新的指针`HEAD`，用来指向当前所处的分支。

```bash
# 切换分支
git checkout branch #切换到branch分支

# 创建分支与切换分支可以简写为一个命令
gti checkout -b branch
```

![HEAD指向当前分支](//file.shenfq.com/18-4-17/94032614.jpg)

现在在branch分支上进行了一次commit，然后branch指针就像向前移动。

```bash
vim xxx.txt
git add.
git commit -m 'modify xxx.txt'
```

![branch分支前移](//file.shenfq.com/18-4-17/27007514.jpg)

然后再切换到master分支，进行一次提交，看下图就会发现，这里会出现分支。
`master`分支表示的是commit1、2、3、5，而`branch`分支commit1、2、3、4。
到这里就很容易理解为什么说git的分支很轻量级，因为对git来说一个分支只是会新建一个指针，
并指向一个提交，而不是拷贝所有的代码文件到另一个目录。

```bash
git checkout master #切换到master分支
vim yyy.txt
git add.
git commit -m 'modify yyy.txt'
```

![不同分支的提交不会相互影响](//file.shenfq.com/18-4-17/94198720.jpg)

### 合并分支

天下三分，分久必合，合久必分。
有分支就会有合并，举个例子，项目中突然来了个bug，但是手头的代码还没写完，不可能直接提交。所以你要先从`master`分支拉出一个`Fix-Bug`分支，在分支上修改好之后再进行提交。最后这个提交需要merge回`master`分支。

```bash
#1. 先创建feature分支，将手头的代码提交到feature分支上
git checkout -b feature
git add .
git commit -m 'feature branch commit'

#2. 切换回master分支，从master拉一个新的分支
git checkout master
git checkout -b Fix-Bug

#3. bug修改完毕后，提交代码到Fix-Bug分支
git add .
git commit -m 'fixed bug'

#4. 把修复了bug的代码merge到master分支
git checkout master #重新切换回master分支
git pull origin master #把同事提交的代码先更新到本地
git merge Fix-Bug
git push origin master #将merge的代码同步到线上，进行bug修复
git branch -d Fix-Bug #bug修复后将Fix-Bug分支删除
```

![merge](//file.shenfq.com/18-4-17/17626900.jpg)


上面只是进行了简单的演示，真实情况比这更加复杂。

观察上图，可以发现在`merge`操作后，自动会生成一个新的commit。如果你不想生成这个commit，
merge之后还有其他修改，或者想要自己写commit的message，也可以使用如下命令来取消自动commit。

```bash
git merge --no-commit branch
```

#### merge的特殊情况：冲突

有时候远程版本库和本地版本库进行merge的时候，你和你的同事可能同事修改了同一个文件的同一个位置，这就会出现冲突。
出现冲突怎么办，当然是解决冲突。解决冲突你可以自己一个个手动去解决，当然你也可以使用一些工具，比如下图使用vscode来解决冲突。

![vscode解决冲突](//file.shenfq.com/18-4-17/65016361.jpg)

可以通过`git status`查看哪些文件出现了冲突，通过编辑器将所有冲突解决后就可以进行提交了。

![发生冲突的文件](//file.shenfq.com/18-4-17/23041771.jpg)


#### 常见的git分支管理模式：gitflow

![](//file.shenfq.com/18-4-17/29960391.jpg)

这里主要涉及常用的分支的命名规范：

1. master主干，用来存放最稳定的代码
2. hotfix，用来紧急修改bug的分支
3. release，用来发布上线的分支
4. feature，特性分支，每一个新功能都应该有一个特性分支
5. develop，开发分支，当特性开发完毕后，将特性分支合并到develop分支



## 参考

这里只是介绍了git中最基本的一些概念，git还有很多高级命令待大家去发现，比如rebase、reset、stash。

最后给大家推荐一些git的好教程。

1. [pro git](https://git-scm.com/book/zh/v2)
2. [git常用命令汇总](https://mp.weixin.qq.com/s/hYjGyIdLK3UCEVF0lRYRCg)
3. [git push与pull的默认行为](https://segmentfault.com/a/1190000002783245)

