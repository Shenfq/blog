---
title: 你给开源项目提过 PR 吗？
author: shenfq
date: 2021/08/04
categories:
- 前端
tags:
- 感悟
- GitHub
- Pull Request
---


你有给开源的库或者框架提过 PR 吗？

如果没有，那么今天的文章会教你怎么给开源库提 PR。

## 为什么要给开源项目提 PR？

这件事还得从好几年前（2019年）说起，那时候在折腾一个虚拟 DOM 的玩具（参考之前的文章：[🔗虚拟DOM到底是什么？](https://blog.shenfq.com/posts/2019/%E8%99%9A%E6%8B%9FDOM%E5%88%B0%E5%BA%95%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F.html)），作为一个标准的前端工程，构建工具、Lint 工具、代码格式化都是必不可少的。

在构建工具上我选择了 `Rollup`，希望每次构建的时候都能自动进行代码的 Lint，所以引入了 `Rollup` 的一个插件：[`rollup-plugin-eslint`](https://github.com/Shenfq/rollup-plugin-eslint)。

![](https://file.shenfq.com/pic/20210804130741.jpeg)

在使用这个插件的过程中，发现和 `Webpack` 对应的插件 [ `eslint-webpack-plugin`](https://github.com/webpack-contrib/eslint-webpack-plugin) 还是有一些差距的。我在使用 `Webpack` 的 `eslint-webpack-plugin` 时候，只需要配置 [`fix` 属性](https://github.com/webpack-contrib/eslint-webpack-plugin#fix)，就能够在保存代码的时候，自动对代码进行 fix。

```js
// webpack.config.js
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new ESLintPlugin({
      fix: true,
      extensions: ['js', 'jsx']
    })
};

```

![](https://file.shenfq.com/pic/20210803211200.png)

而在使用 `rollup-plugin-eslint` 的时候，看文档上，好像没有提到这个选项，也就是说 `rollup-plugin-eslint` 根本不支持这个功能。然后，搜索了一下 Issues，不搜不要紧，一搜吓一跳，发现有人在 2016 年就提出了这个[疑问😳](https://github.com/TrySound/rollup-plugin-eslint/issues/1)。

![](https://file.shenfq.com/pic/20210803211629.png)

作者的回复也很简单，欢迎提交 PR。

![](https://file.shenfq.com/pic/20210803211756.png)

我当时心想，这个功能这么久了都没人实现想必很难吧。但是隔壁的 `eslint-webpack-plugin` 明明支持这个功能，我去看看它怎么实现的不就行了🐶。

于是，我就把 `eslint-webpack-plugin` 的代码 clone 下来一顿搜索，发现它实现这个功能就用了[三行代码](https://github.com/webpack-contrib/eslint-webpack-plugin/blob/HEAD/src/getESLint.js#L38-L40)。

```js
if (options.fix) {
  await ESLint.outputFixes(results);
}
```

激动的心，颤抖的手，我赶忙就去  `rollup-plugin-eslint` 那里提了个 [PR](https://github.com/TrySound/rollup-plugin-eslint/pull/27/files#diff-e727e4bdf3657fd1d798edcd6b099d6e092f8573cba266154583a746bba0f346)。

> 🔗PR: https://github.com/TrySound/rollup-plugin-eslint/pull/27

![](https://file.shenfq.com/pic/20210803212810.png)

关键是，作者都没想到这个东西居然这么简单就实现了。

![](https://file.shenfq.com/pic/20210803212924.png)

## 如何在 GitHub 上提 PR？

上面是我第一次提 PR 的一个心路历程，如果你也发现了你现在使用的什么开源框架有待优化的地方，这里再教大家怎么在 GitHub 上提交一个 PR。

#### 对开源项目进行 Fork

首先把你要提交 PR 的项目 Fork 到自己的仓库。

![](https://file.shenfq.com/pic/20210803213434.png)

然后到自己的仓库中，将 Fork 的项目 clone 到本地。

![](https://file.shenfq.com/pic/20210803213637.png)

```bash
$ git clone git@github.com:Shenfq/rollup-plugin-eslint.git
```

#### 切换到新分支，提交变更，推送到远程

代码 clone 到本地之后，先切换一个新的分支，分支名最好紧贴这次更新的内容。

```bash
$ git checkout -b feature/add-fix-option
```

在新分支修改代码：

```diff
+  if (options.fix && report) {
+    CLIEngine.outputFixes(report);
+  }
```

提交变更：

```bash
$ git add .
$ git commit -m "feat: add options.fix"
```

最后将新的分支推送到远程：

```bash
$ git push --set-upstream origin feature/add-fix-option
```

#### 新建 PR

在自己的 GitHub 仓库中找到对应项目，打开 `Pull requests` Tab，点击 `New pull request` 按钮，新建一个 PR。

![](https://file.shenfq.com/pic/20210803215832.png)

然后，在下面的界面中，选择刚刚提交的分支，最后点击 `Create pull request` 即可。

![](https://file.shenfq.com/pic/20210803220329.png)

点击之后，就在对应的项目中提交了一个属于你的 PR 了。如果顺利的话，你就能『混』 到一个开源项目贡献者的头衔。

