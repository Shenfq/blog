import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2018/git快速入门.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/git快速入门.html",
    'title': "git快速入门",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>git快速入门</h1>\n<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>git作为现在最为流行的版本管理系统，大部分公司都使用git进行版本控制，\n并且最大同性交友网站github也是在git的基础上建立的。\n很多人认为git难，在于它的一些概念与之前流行的集中化的版本管理系统有所出入，\n只要通过熟悉git的基本概念，以及git分支切换的流程，想要上手还是很容易的。</p>\n<p>这篇文章将介绍git的一些基本概念以及git常用的一些命令。github官方提供了一套git学习教程，感兴趣可以<a href="https://try.github.io/">去看看</a>。</p>\n<!-- more -->\n<h2 id="%E5%88%86%E5%B8%83%E5%BC%8F%E7%9A%84%E7%89%88%E6%9C%AC%E5%BA%93">分布式的版本库<a class="anchor" href="#%E5%88%86%E5%B8%83%E5%BC%8F%E7%9A%84%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h2>\n<h3 id="%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5">基本概念<a class="anchor" href="#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5">§</a></h3>\n<p>首先，看看官网是怎么介绍git的。</p>\n<blockquote>\n<p>Git is a free and open source distributed version control system.<br>\nGit是一个免费并且开源的分布式版本管理工具。</p>\n</blockquote>\n<p>重点就在于git的分布式，只需要在项目根目录执行<code>git init</code>你就拥有了一个git版本库，\n同时在该目录下会生成一个<code>.git</code>文件夹，该文件夹用来记录你所有的提交信息，类似与<code>.svn</code>文件夹。\n该文件夹会存储你每次提交的文件的全部信息，只是会经过压缩，具体内容这里不做深入展开。\n如果你对git的内部原理感兴趣可以看\n<a href="https://bingohuang.gitbooks.io/progit2/content/10-git-internals/sections/objects.html">这里</a>。</p>\n<p>与集中式的版本管理工具不同，git的commit之后提交到本地的版本库，\n像svn的commit则是直接提交到服务器的中央版本库。\n这就意味这我们都在本地具有一个版本库，那么多人开发时，我们需要如何管理我们的版本库呢？</p>\n<p>这里git就引入了一个远程版本库的概念，远程版本库并不会记录我们的代码文件，\n只是一个裸仓库，也就是说远程版本库只会保存<code>.git</code>目录下的东西，这也相当于间接的记录我们的代码文件。\n每个人都能让远程版本库同步你本地的commit信息，但是同步之前会检查你本地的版本库是否与远程版本库的提交信息一致，\n如果不一致会提醒你先从远程版本库进行更新。唉，千言万语不如一张图。</p>\n<p><img src="//file.shenfq.com/18-4-14/34749597.jpg" alt="同步到远程版本库"></p>\n<ol>\n<li>当我们告诉远程版本库，我有一个新的提交需要你同步，它会拒绝你。</li>\n<li>因为在你之前有一个人先同步了提交到远程分支，你必须更新他的提交到你本地，你才能继续同步你的提交。</li>\n</ol>\n<p>git在提交到版本库之前，还有一个步骤，那就是添加到暂存区，至于git为什么会存在暂存区，知乎上有个回答我觉得说得挺好的（<a href="https://www.zhihu.com/question/19946553/answer/29033220">传送门</a>）。</p>\n<p>大致意思是说，早期的版本管理工具有成熟的gui，比如用svn，每一次提交都能让你自由选择需要提交哪些文件的修改。</p>\n<p><img src="//file.shenfq.com/18-4-15/73819602.jpg" alt="小乌龟"></p>\n<p>而在命令行下面，这些操作比较麻烦，为了解决这个问题，于是在commit之前增加了一个暂存区，用来存放我们需要提交的文件。好了，我们再回过头来看看git在版本管理上分了哪些部分。</p>\n<p><img src="//file.shenfq.com/18-4-14/41364002.jpg" alt=""></p>\n<h3 id="git%E5%91%BD%E4%BB%A4%E7%AE%80%E4%BB%8B">git命令简介<a class="anchor" href="#git%E5%91%BD%E4%BB%A4%E7%AE%80%E4%BB%8B">§</a></h3>\n<p>了解了这些概念，我们再来看看，如何初始化一个git仓库，并且在修改代码后将提交同步给远程版本库。</p>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96git%E9%85%8D%E7%BD%AE">初始化git配置<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96git%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>该配置是用来告诉版本库是谁提交代码。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment">#全局设置用户名</span>\n<span class="token function">git</span> config --global user.name <span class="token string">"your name"</span>\n\n<span class="token comment">#全局设置邮箱</span>\n<span class="token function">git</span> config --global user.email <span class="token string">"<a class="token email-link" href="mailto:xxxxxxxxx@qq.com">xxxxxxxxx@qq.com</a>"</span>\n\n</code></pre>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96git%E4%BB%93%E5%BA%93">初始化git仓库<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96git%E4%BB%93%E5%BA%93">§</a></h4>\n<p>这里有两种方式，一种是新建一个本地版本库，然后手动连接远程版本库，还一种是直接获取远程版本到本地。</p>\n<ol>\n<li>新建本地仓库，并与远程版本库进行连接</li>\n</ol>\n<pre class="language-bash"><code class="language-bash"><span class="token function">mkdir</span> hub <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> hub\n\n<span class="token function">git</span> init  <span class="token comment">#初始化git仓库</span>\n\n<span class="token function">git</span> remote <span class="token function">add</span> origin <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:github/hub.git  <span class="token comment">#关联远程版本库，并取名为origin</span>\n\n<span class="token function">git</span> pull origin master  <span class="token comment">#获取名为origin的远程版本库的提交信息到本地版本库</span>\n</code></pre>\n<ol start="2">\n<li>获取远程的版本库到本地</li>\n</ol>\n<pre class="language-bash"><code class="language-bash">\n<span class="token function">git</span> clone <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:github/hub.git  <span class="token comment">#该命令相当于上面三步的缩写</span>\n\n</code></pre>\n<h4 id="%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%88%B0%E6%9A%82%E5%AD%98%E5%8C%BA">修改文件并提交到暂存区<a class="anchor" href="#%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%88%B0%E6%9A%82%E5%AD%98%E5%8C%BA">§</a></h4>\n<p>我们可以新建一个文件（eg. <code>reamde.md</code>），然后通过add命令，将该文件添加到暂存区，表示该文件是我们要提交到版本库的文件。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将一个修改后的文件添加到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> readme.md\n\n\n<span class="token comment"># gitadd其他用法</span>\n\n<span class="token comment"># 添加所有修改、删除或新建的文件到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token comment"># 添加所有以js结尾的文件到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> *.js\n<span class="token comment"># 添加所有修改、删除或新建的文件到暂存区</span>\n<span class="token comment"># 除了.开头的文件，比如 .gitignore</span>\n<span class="token function">git</span> <span class="token function">add</span> *\n<span class="token comment"># git add --update 的缩写</span>\n<span class="token comment"># 如果再次修改了在暂存区中的文件，可以通过该命令进行更新</span>\n<span class="token function">git</span> <span class="token function">add</span> -u\n<span class="token comment"># 作用与git add . 相同</span>\n<span class="token function">git</span> <span class="token function">add</span> -A\n\n</code></pre>\n<h4 id="%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%88%B0%E7%89%88%E6%9C%AC%E5%BA%93">提交代码到版本库<a class="anchor" href="#%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%88%B0%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>我们现在已经把代码添加到了暂存区，接下来就需要把暂存区的代码提交到版本库。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 提交暂存区的代码到版本库</span>\n<span class="token function">git</span> commit -m <span class="token string">\'commit message\'</span>\n\n<span class="token comment"># 如果你重新编辑了一些文件，添加到暂存区，想把这些修改合并到上一次提交</span>\n<span class="token comment"># 然后会出现一个编辑框，让你修改上次的提交信息</span>\n<span class="token function">git</span> commit --amend\n<span class="token comment"># 如果不想修改上次的提交信息</span>\n<span class="token function">git</span> commit --amend --no-edit\n</code></pre>\n<h4 id="%E5%90%8C%E6%AD%A5%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93">同步远程版本库到本地版本库<a class="anchor" href="#%E5%90%8C%E6%AD%A5%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>最好每次把自己的提交信息同步给远程版本库之前，先把远程版本库同步到本地。\n这里会涉及到分支的概念，我们先放到一边，本地版本库默认默认为master分支\n（ps. 也就是我们常说的主干）。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将名为origin的远程版本库的master分支同步到本地的当前分支</span>\n<span class="token function">git</span> pull origin master\n\n<span class="token comment"># git pull命令其实是如下两个命令的简写</span>\n<span class="token function">git</span> fetch origin master\n<span class="token function">git</span> merge origin/master\n</code></pre>\n<h4 id="%E5%90%8C%E6%AD%A5%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93">同步本地版本库到远程版本库<a class="anchor" href="#%E5%90%8C%E6%AD%A5%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>git将本地版本库同步到远程版本库使用push命令，但是每次都需要指定同步给哪个版本库的哪一个分支，\n这时，你可以使用<code>-u</code>参数将本地版本库与远程版本库绑定，以后提交就不需要指定，默认提交到那个版本库。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将本地的提交同步给远程版本库</span>\n<span class="token function">git</span> push origin master\n\n<span class="token comment"># 绑定默认提交的远程版本库</span>\n<span class="token function">git</span> push -u origin master\n<span class="token comment"># 下次提交只需要使用git push就可以了</span>\n<span class="token function">git</span> push\n</code></pre>\n<h2 id="git%E5%88%86%E6%94%AF">git分支<a class="anchor" href="#git%E5%88%86%E6%94%AF">§</a></h2>\n<p>git的分支是git版本管理的重点，git的分支对比svn十分轻量级。</p>\n<p>注意，前方高能！！！</p>\n<p>为了讲清楚这些概念得画一些图，没办法美术功底太好，话又不会说，只好画图写教程了。</p>\n<h3 id="%E4%BD%95%E4%B8%BA%E5%88%86%E6%94%AF">何为分支<a class="anchor" href="#%E4%BD%95%E4%B8%BA%E5%88%86%E6%94%AF">§</a></h3>\n<p>要搞清楚git的分支概念，首先需要知道git是如何区分不同的分支的。\n在git中，一个分支就会存在有一个指针，该指针指向一个commit。\n每次拉分支就会在当前commit上创建一个新的指针，而且分支的指针每次都会跟随commit前移。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 查看当前分支</span>\n<span class="token function">git</span> branch <span class="token comment">#刚刚初始化的版本库默认在master分支上</span>\n<span class="token comment"># 新建分支</span>\n<span class="token function">git</span> branch branch <span class="token comment">#新建一个名为branch的分支</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/92923237.jpg" alt="新建分支"></p>\n<p>那么现在有个问题，在新建一个分支之后，两个分支指向同一个commit，到底怎么区分现在哪个分支上呢？\n这里就要引入一个新的指针<code>HEAD</code>，用来指向当前所处的分支。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 切换分支</span>\n<span class="token function">git</span> checkout branch <span class="token comment">#切换到branch分支</span>\n\n<span class="token comment"># 创建分支与切换分支可以简写为一个命令</span>\ngti checkout -b branch\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/94032614.jpg" alt="HEAD指向当前分支"></p>\n<p>现在在branch分支上进行了一次commit，然后branch指针就像向前移动。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">vim</span> xxx.txt\n<span class="token function">git</span> add.\n<span class="token function">git</span> commit -m <span class="token string">\'modify xxx.txt\'</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/27007514.jpg" alt="branch分支前移"></p>\n<p>然后再切换到master分支，进行一次提交，看下图就会发现，这里会出现分支。\n<code>master</code>分支表示的是commit1、2、3、5，而<code>branch</code>分支commit1、2、3、4。\n到这里就很容易理解为什么说git的分支很轻量级，因为对git来说一个分支只是会新建一个指针，\n并指向一个提交，而不是拷贝所有的代码文件到另一个目录。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">git</span> checkout master <span class="token comment">#切换到master分支</span>\n<span class="token function">vim</span> yyy.txt\n<span class="token function">git</span> add.\n<span class="token function">git</span> commit -m <span class="token string">\'modify yyy.txt\'</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/94198720.jpg" alt="不同分支的提交不会相互影响"></p>\n<h3 id="%E5%90%88%E5%B9%B6%E5%88%86%E6%94%AF">合并分支<a class="anchor" href="#%E5%90%88%E5%B9%B6%E5%88%86%E6%94%AF">§</a></h3>\n<p>天下三分，分久必合，合久必分。\n有分支就会有合并，举个例子，项目中突然来了个bug，但是手头的代码还没写完，不可能直接提交。所以你要先从<code>master</code>分支拉出一个<code>Fix-Bug</code>分支，在分支上修改好之后再进行提交。最后这个提交需要merge回<code>master</code>分支。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment">#1. 先创建feature分支，将手头的代码提交到feature分支上</span>\n<span class="token function">git</span> checkout -b feature\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token function">git</span> commit -m <span class="token string">\'feature branch commit\'</span>\n\n<span class="token comment">#2. 切换回master分支，从master拉一个新的分支</span>\n<span class="token function">git</span> checkout master\n<span class="token function">git</span> checkout -b Fix-Bug\n\n<span class="token comment">#3. bug修改完毕后，提交代码到Fix-Bug分支</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token function">git</span> commit -m <span class="token string">\'fixed bug\'</span>\n\n<span class="token comment">#4. 把修复了bug的代码merge到master分支</span>\n<span class="token function">git</span> checkout master <span class="token comment">#重新切换回master分支</span>\n<span class="token function">git</span> pull origin master <span class="token comment">#把同事提交的代码先更新到本地</span>\n<span class="token function">git</span> merge Fix-Bug\n<span class="token function">git</span> push origin master <span class="token comment">#将merge的代码同步到线上，进行bug修复</span>\n<span class="token function">git</span> branch -d Fix-Bug <span class="token comment">#bug修复后将Fix-Bug分支删除</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/17626900.jpg" alt="merge"></p>\n<p>上面只是进行了简单的演示，真实情况比这更加复杂。</p>\n<p>观察上图，可以发现在<code>merge</code>操作后，自动会生成一个新的commit。如果你不想生成这个commit，\nmerge之后还有其他修改，或者想要自己写commit的message，也可以使用如下命令来取消自动commit。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">git</span> merge --no-commit branch\n</code></pre>\n<h4 id="merge%E7%9A%84%E7%89%B9%E6%AE%8A%E6%83%85%E5%86%B5%E5%86%B2%E7%AA%81">merge的特殊情况：冲突<a class="anchor" href="#merge%E7%9A%84%E7%89%B9%E6%AE%8A%E6%83%85%E5%86%B5%E5%86%B2%E7%AA%81">§</a></h4>\n<p>有时候远程版本库和本地版本库进行merge的时候，你和你的同事可能同事修改了同一个文件的同一个位置，这就会出现冲突。\n出现冲突怎么办，当然是解决冲突。解决冲突你可以自己一个个手动去解决，当然你也可以使用一些工具，比如下图使用vscode来解决冲突。</p>\n<p><img src="//file.shenfq.com/18-4-17/65016361.jpg" alt="vscode解决冲突"></p>\n<p>可以通过<code>git status</code>查看哪些文件出现了冲突，通过编辑器将所有冲突解决后就可以进行提交了。</p>\n<p><img src="//file.shenfq.com/18-4-17/23041771.jpg" alt="发生冲突的文件"></p>\n<h4 id="%E5%B8%B8%E8%A7%81%E7%9A%84git%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8Fgitflow">常见的git分支管理模式：gitflow<a class="anchor" href="#%E5%B8%B8%E8%A7%81%E7%9A%84git%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8Fgitflow">§</a></h4>\n<p><img src="//file.shenfq.com/18-4-17/29960391.jpg" alt=""></p>\n<p>这里主要涉及常用的分支的命名规范：</p>\n<ol>\n<li>master主干，用来存放最稳定的代码</li>\n<li>hotfix，用来紧急修改bug的分支</li>\n<li>release，用来发布上线的分支</li>\n<li>feature，特性分支，每一个新功能都应该有一个特性分支</li>\n<li>develop，开发分支，当特性开发完毕后，将特性分支合并到develop分支</li>\n</ol>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<p>这里只是介绍了git中最基本的一些概念，git还有很多高级命令待大家去发现，比如rebase、reset、stash。</p>\n<p>最后给大家推荐一些git的好教程。</p>\n<ol>\n<li><a href="https://git-scm.com/book/zh/v2">pro git</a></li>\n<li><a href="https://mp.weixin.qq.com/s/hYjGyIdLK3UCEVF0lRYRCg">git常用命令汇总</a></li>\n<li><a href="https://segmentfault.com/a/1190000002783245">git push与pull的默认行为</a></li>\n</ol>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "git\u5FEB\u901F\u5165\u95E8"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>git作为现在最为流行的版本管理系统，大部分公司都使用git进行版本控制，\n并且最大同性交友网站github也是在git的基础上建立的。\n很多人认为git难，在于它的一些概念与之前流行的集中化的版本管理系统有所出入，\n只要通过熟悉git的基本概念，以及git分支切换的流程，想要上手还是很容易的。</p>\n<p>这篇文章将介绍git的一些基本概念以及git常用的一些命令。github官方提供了一套git学习教程，感兴趣可以<a href="https://try.github.io/">去看看</a>。</p>\n<!-- more -->\n<h2 id="%E5%88%86%E5%B8%83%E5%BC%8F%E7%9A%84%E7%89%88%E6%9C%AC%E5%BA%93">分布式的版本库<a class="anchor" href="#%E5%88%86%E5%B8%83%E5%BC%8F%E7%9A%84%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h2>\n<h3 id="%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5">基本概念<a class="anchor" href="#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5">§</a></h3>\n<p>首先，看看官网是怎么介绍git的。</p>\n<blockquote>\n<p>Git is a free and open source distributed version control system.<br>\nGit是一个免费并且开源的分布式版本管理工具。</p>\n</blockquote>\n<p>重点就在于git的分布式，只需要在项目根目录执行<code>git init</code>你就拥有了一个git版本库，\n同时在该目录下会生成一个<code>.git</code>文件夹，该文件夹用来记录你所有的提交信息，类似与<code>.svn</code>文件夹。\n该文件夹会存储你每次提交的文件的全部信息，只是会经过压缩，具体内容这里不做深入展开。\n如果你对git的内部原理感兴趣可以看\n<a href="https://bingohuang.gitbooks.io/progit2/content/10-git-internals/sections/objects.html">这里</a>。</p>\n<p>与集中式的版本管理工具不同，git的commit之后提交到本地的版本库，\n像svn的commit则是直接提交到服务器的中央版本库。\n这就意味这我们都在本地具有一个版本库，那么多人开发时，我们需要如何管理我们的版本库呢？</p>\n<p>这里git就引入了一个远程版本库的概念，远程版本库并不会记录我们的代码文件，\n只是一个裸仓库，也就是说远程版本库只会保存<code>.git</code>目录下的东西，这也相当于间接的记录我们的代码文件。\n每个人都能让远程版本库同步你本地的commit信息，但是同步之前会检查你本地的版本库是否与远程版本库的提交信息一致，\n如果不一致会提醒你先从远程版本库进行更新。唉，千言万语不如一张图。</p>\n<p><img src="//file.shenfq.com/18-4-14/34749597.jpg" alt="同步到远程版本库"></p>\n<ol>\n<li>当我们告诉远程版本库，我有一个新的提交需要你同步，它会拒绝你。</li>\n<li>因为在你之前有一个人先同步了提交到远程分支，你必须更新他的提交到你本地，你才能继续同步你的提交。</li>\n</ol>\n<p>git在提交到版本库之前，还有一个步骤，那就是添加到暂存区，至于git为什么会存在暂存区，知乎上有个回答我觉得说得挺好的（<a href="https://www.zhihu.com/question/19946553/answer/29033220">传送门</a>）。</p>\n<p>大致意思是说，早期的版本管理工具有成熟的gui，比如用svn，每一次提交都能让你自由选择需要提交哪些文件的修改。</p>\n<p><img src="//file.shenfq.com/18-4-15/73819602.jpg" alt="小乌龟"></p>\n<p>而在命令行下面，这些操作比较麻烦，为了解决这个问题，于是在commit之前增加了一个暂存区，用来存放我们需要提交的文件。好了，我们再回过头来看看git在版本管理上分了哪些部分。</p>\n<p><img src="//file.shenfq.com/18-4-14/41364002.jpg" alt=""></p>\n<h3 id="git%E5%91%BD%E4%BB%A4%E7%AE%80%E4%BB%8B">git命令简介<a class="anchor" href="#git%E5%91%BD%E4%BB%A4%E7%AE%80%E4%BB%8B">§</a></h3>\n<p>了解了这些概念，我们再来看看，如何初始化一个git仓库，并且在修改代码后将提交同步给远程版本库。</p>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96git%E9%85%8D%E7%BD%AE">初始化git配置<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96git%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>该配置是用来告诉版本库是谁提交代码。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment">#全局设置用户名</span>\n<span class="token function">git</span> config --global user.name <span class="token string">"your name"</span>\n\n<span class="token comment">#全局设置邮箱</span>\n<span class="token function">git</span> config --global user.email <span class="token string">"<a class="token email-link" href="mailto:xxxxxxxxx@qq.com">xxxxxxxxx@qq.com</a>"</span>\n\n</code></pre>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96git%E4%BB%93%E5%BA%93">初始化git仓库<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96git%E4%BB%93%E5%BA%93">§</a></h4>\n<p>这里有两种方式，一种是新建一个本地版本库，然后手动连接远程版本库，还一种是直接获取远程版本到本地。</p>\n<ol>\n<li>新建本地仓库，并与远程版本库进行连接</li>\n</ol>\n<pre class="language-bash"><code class="language-bash"><span class="token function">mkdir</span> hub <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> hub\n\n<span class="token function">git</span> init  <span class="token comment">#初始化git仓库</span>\n\n<span class="token function">git</span> remote <span class="token function">add</span> origin <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:github/hub.git  <span class="token comment">#关联远程版本库，并取名为origin</span>\n\n<span class="token function">git</span> pull origin master  <span class="token comment">#获取名为origin的远程版本库的提交信息到本地版本库</span>\n</code></pre>\n<ol start="2">\n<li>获取远程的版本库到本地</li>\n</ol>\n<pre class="language-bash"><code class="language-bash">\n<span class="token function">git</span> clone <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:github/hub.git  <span class="token comment">#该命令相当于上面三步的缩写</span>\n\n</code></pre>\n<h4 id="%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%88%B0%E6%9A%82%E5%AD%98%E5%8C%BA">修改文件并提交到暂存区<a class="anchor" href="#%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%B9%B6%E6%8F%90%E4%BA%A4%E5%88%B0%E6%9A%82%E5%AD%98%E5%8C%BA">§</a></h4>\n<p>我们可以新建一个文件（eg. <code>reamde.md</code>），然后通过add命令，将该文件添加到暂存区，表示该文件是我们要提交到版本库的文件。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将一个修改后的文件添加到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> readme.md\n\n\n<span class="token comment"># gitadd其他用法</span>\n\n<span class="token comment"># 添加所有修改、删除或新建的文件到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token comment"># 添加所有以js结尾的文件到暂存区</span>\n<span class="token function">git</span> <span class="token function">add</span> *.js\n<span class="token comment"># 添加所有修改、删除或新建的文件到暂存区</span>\n<span class="token comment"># 除了.开头的文件，比如 .gitignore</span>\n<span class="token function">git</span> <span class="token function">add</span> *\n<span class="token comment"># git add --update 的缩写</span>\n<span class="token comment"># 如果再次修改了在暂存区中的文件，可以通过该命令进行更新</span>\n<span class="token function">git</span> <span class="token function">add</span> -u\n<span class="token comment"># 作用与git add . 相同</span>\n<span class="token function">git</span> <span class="token function">add</span> -A\n\n</code></pre>\n<h4 id="%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%88%B0%E7%89%88%E6%9C%AC%E5%BA%93">提交代码到版本库<a class="anchor" href="#%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%88%B0%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>我们现在已经把代码添加到了暂存区，接下来就需要把暂存区的代码提交到版本库。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 提交暂存区的代码到版本库</span>\n<span class="token function">git</span> commit -m <span class="token string">\'commit message\'</span>\n\n<span class="token comment"># 如果你重新编辑了一些文件，添加到暂存区，想把这些修改合并到上一次提交</span>\n<span class="token comment"># 然后会出现一个编辑框，让你修改上次的提交信息</span>\n<span class="token function">git</span> commit --amend\n<span class="token comment"># 如果不想修改上次的提交信息</span>\n<span class="token function">git</span> commit --amend --no-edit\n</code></pre>\n<h4 id="%E5%90%8C%E6%AD%A5%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93">同步远程版本库到本地版本库<a class="anchor" href="#%E5%90%8C%E6%AD%A5%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>最好每次把自己的提交信息同步给远程版本库之前，先把远程版本库同步到本地。\n这里会涉及到分支的概念，我们先放到一边，本地版本库默认默认为master分支\n（ps. 也就是我们常说的主干）。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将名为origin的远程版本库的master分支同步到本地的当前分支</span>\n<span class="token function">git</span> pull origin master\n\n<span class="token comment"># git pull命令其实是如下两个命令的简写</span>\n<span class="token function">git</span> fetch origin master\n<span class="token function">git</span> merge origin/master\n</code></pre>\n<h4 id="%E5%90%8C%E6%AD%A5%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93">同步本地版本库到远程版本库<a class="anchor" href="#%E5%90%8C%E6%AD%A5%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E5%BA%93%E5%88%B0%E8%BF%9C%E7%A8%8B%E7%89%88%E6%9C%AC%E5%BA%93">§</a></h4>\n<p>git将本地版本库同步到远程版本库使用push命令，但是每次都需要指定同步给哪个版本库的哪一个分支，\n这时，你可以使用<code>-u</code>参数将本地版本库与远程版本库绑定，以后提交就不需要指定，默认提交到那个版本库。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 将本地的提交同步给远程版本库</span>\n<span class="token function">git</span> push origin master\n\n<span class="token comment"># 绑定默认提交的远程版本库</span>\n<span class="token function">git</span> push -u origin master\n<span class="token comment"># 下次提交只需要使用git push就可以了</span>\n<span class="token function">git</span> push\n</code></pre>\n<h2 id="git%E5%88%86%E6%94%AF">git分支<a class="anchor" href="#git%E5%88%86%E6%94%AF">§</a></h2>\n<p>git的分支是git版本管理的重点，git的分支对比svn十分轻量级。</p>\n<p>注意，前方高能！！！</p>\n<p>为了讲清楚这些概念得画一些图，没办法美术功底太好，话又不会说，只好画图写教程了。</p>\n<h3 id="%E4%BD%95%E4%B8%BA%E5%88%86%E6%94%AF">何为分支<a class="anchor" href="#%E4%BD%95%E4%B8%BA%E5%88%86%E6%94%AF">§</a></h3>\n<p>要搞清楚git的分支概念，首先需要知道git是如何区分不同的分支的。\n在git中，一个分支就会存在有一个指针，该指针指向一个commit。\n每次拉分支就会在当前commit上创建一个新的指针，而且分支的指针每次都会跟随commit前移。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 查看当前分支</span>\n<span class="token function">git</span> branch <span class="token comment">#刚刚初始化的版本库默认在master分支上</span>\n<span class="token comment"># 新建分支</span>\n<span class="token function">git</span> branch branch <span class="token comment">#新建一个名为branch的分支</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/92923237.jpg" alt="新建分支"></p>\n<p>那么现在有个问题，在新建一个分支之后，两个分支指向同一个commit，到底怎么区分现在哪个分支上呢？\n这里就要引入一个新的指针<code>HEAD</code>，用来指向当前所处的分支。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 切换分支</span>\n<span class="token function">git</span> checkout branch <span class="token comment">#切换到branch分支</span>\n\n<span class="token comment"># 创建分支与切换分支可以简写为一个命令</span>\ngti checkout -b branch\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/94032614.jpg" alt="HEAD指向当前分支"></p>\n<p>现在在branch分支上进行了一次commit，然后branch指针就像向前移动。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">vim</span> xxx.txt\n<span class="token function">git</span> add.\n<span class="token function">git</span> commit -m <span class="token string">\'modify xxx.txt\'</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/27007514.jpg" alt="branch分支前移"></p>\n<p>然后再切换到master分支，进行一次提交，看下图就会发现，这里会出现分支。\n<code>master</code>分支表示的是commit1、2、3、5，而<code>branch</code>分支commit1、2、3、4。\n到这里就很容易理解为什么说git的分支很轻量级，因为对git来说一个分支只是会新建一个指针，\n并指向一个提交，而不是拷贝所有的代码文件到另一个目录。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">git</span> checkout master <span class="token comment">#切换到master分支</span>\n<span class="token function">vim</span> yyy.txt\n<span class="token function">git</span> add.\n<span class="token function">git</span> commit -m <span class="token string">\'modify yyy.txt\'</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/94198720.jpg" alt="不同分支的提交不会相互影响"></p>\n<h3 id="%E5%90%88%E5%B9%B6%E5%88%86%E6%94%AF">合并分支<a class="anchor" href="#%E5%90%88%E5%B9%B6%E5%88%86%E6%94%AF">§</a></h3>\n<p>天下三分，分久必合，合久必分。\n有分支就会有合并，举个例子，项目中突然来了个bug，但是手头的代码还没写完，不可能直接提交。所以你要先从<code>master</code>分支拉出一个<code>Fix-Bug</code>分支，在分支上修改好之后再进行提交。最后这个提交需要merge回<code>master</code>分支。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment">#1. 先创建feature分支，将手头的代码提交到feature分支上</span>\n<span class="token function">git</span> checkout -b feature\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token function">git</span> commit -m <span class="token string">\'feature branch commit\'</span>\n\n<span class="token comment">#2. 切换回master分支，从master拉一个新的分支</span>\n<span class="token function">git</span> checkout master\n<span class="token function">git</span> checkout -b Fix-Bug\n\n<span class="token comment">#3. bug修改完毕后，提交代码到Fix-Bug分支</span>\n<span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>\n<span class="token function">git</span> commit -m <span class="token string">\'fixed bug\'</span>\n\n<span class="token comment">#4. 把修复了bug的代码merge到master分支</span>\n<span class="token function">git</span> checkout master <span class="token comment">#重新切换回master分支</span>\n<span class="token function">git</span> pull origin master <span class="token comment">#把同事提交的代码先更新到本地</span>\n<span class="token function">git</span> merge Fix-Bug\n<span class="token function">git</span> push origin master <span class="token comment">#将merge的代码同步到线上，进行bug修复</span>\n<span class="token function">git</span> branch -d Fix-Bug <span class="token comment">#bug修复后将Fix-Bug分支删除</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-4-17/17626900.jpg" alt="merge"></p>\n<p>上面只是进行了简单的演示，真实情况比这更加复杂。</p>\n<p>观察上图，可以发现在<code>merge</code>操作后，自动会生成一个新的commit。如果你不想生成这个commit，\nmerge之后还有其他修改，或者想要自己写commit的message，也可以使用如下命令来取消自动commit。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">git</span> merge --no-commit branch\n</code></pre>\n<h4 id="merge%E7%9A%84%E7%89%B9%E6%AE%8A%E6%83%85%E5%86%B5%E5%86%B2%E7%AA%81">merge的特殊情况：冲突<a class="anchor" href="#merge%E7%9A%84%E7%89%B9%E6%AE%8A%E6%83%85%E5%86%B5%E5%86%B2%E7%AA%81">§</a></h4>\n<p>有时候远程版本库和本地版本库进行merge的时候，你和你的同事可能同事修改了同一个文件的同一个位置，这就会出现冲突。\n出现冲突怎么办，当然是解决冲突。解决冲突你可以自己一个个手动去解决，当然你也可以使用一些工具，比如下图使用vscode来解决冲突。</p>\n<p><img src="//file.shenfq.com/18-4-17/65016361.jpg" alt="vscode解决冲突"></p>\n<p>可以通过<code>git status</code>查看哪些文件出现了冲突，通过编辑器将所有冲突解决后就可以进行提交了。</p>\n<p><img src="//file.shenfq.com/18-4-17/23041771.jpg" alt="发生冲突的文件"></p>\n<h4 id="%E5%B8%B8%E8%A7%81%E7%9A%84git%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8Fgitflow">常见的git分支管理模式：gitflow<a class="anchor" href="#%E5%B8%B8%E8%A7%81%E7%9A%84git%E5%88%86%E6%94%AF%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8Fgitflow">§</a></h4>\n<p><img src="//file.shenfq.com/18-4-17/29960391.jpg" alt=""></p>\n<p>这里主要涉及常用的分支的命名规范：</p>\n<ol>\n<li>master主干，用来存放最稳定的代码</li>\n<li>hotfix，用来紧急修改bug的分支</li>\n<li>release，用来发布上线的分支</li>\n<li>feature，特性分支，每一个新功能都应该有一个特性分支</li>\n<li>develop，开发分支，当特性开发完毕后，将特性分支合并到develop分支</li>\n</ol>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<p>这里只是介绍了git中最基本的一些概念，git还有很多高级命令待大家去发现，比如rebase、reset、stash。</p>\n<p>最后给大家推荐一些git的好教程。</p>\n<ol>\n<li><a href="https://git-scm.com/book/zh/v2">pro git</a></li>\n<li><a href="https://mp.weixin.qq.com/s/hYjGyIdLK3UCEVF0lRYRCg">git常用命令汇总</a></li>\n<li><a href="https://segmentfault.com/a/1190000002783245">git push与pull的默认行为</a></li>\n</ol>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%83%8C%E6%99%AF" }, "\u80CC\u666F")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%88%86%E5%B8%83%E5%BC%8F%E7%9A%84%E7%89%88%E6%9C%AC%E5%BA%93" }, "\u5206\u5E03\u5F0F\u7684\u7248\u672C\u5E93"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5" }, "\u57FA\u672C\u6982\u5FF5")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#git%E5%91%BD%E4%BB%A4%E7%AE%80%E4%BB%8B" }, "git\u547D\u4EE4\u7B80\u4ECB"),
                        React.createElement("ol", null)))),
            React.createElement("li", null,
                React.createElement("a", { href: "#git%E5%88%86%E6%94%AF" }, "git\u5206\u652F"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%BD%95%E4%B8%BA%E5%88%86%E6%94%AF" }, "\u4F55\u4E3A\u5206\u652F")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%90%88%E5%B9%B6%E5%88%86%E6%94%AF" }, "\u5408\u5E76\u5206\u652F"),
                        React.createElement("ol", null)))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%8F%82%E8%80%83" }, "\u53C2\u8003")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/04/17",
    'updated': null,
    'excerpt': "背景 git作为现在最为流行的版本管理系统，大部分公司都使用git进行版本控制， 并且最大同性交友网站github也是在git的基础上建立的。 很多人认为git难，在于它的一些概念与之前流行的集中化的版本管理系统有所出入， 只要通过...",
    'cover': "//file.shenfq.com/18-4-14/34749597.jpg",
    'thumbnail': "//file.shenfq.com/18-4-17/53844391.jpg",
    'categories': [
        "Git"
    ],
    'tags': [
        "git",
        "版本管理"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2022/LRU.md",
                "title": "什么是 LRU 算法？",
                "link": "posts/2022/LRU.html",
                "date": "2022/03/12",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "缓存",
                    "LRU",
                    "LFU",
                    "JavaScript"
                ],
                "excerpt": "缓存 是我们写代码过程中常用的一种手段，是一种空间换时间的做法。就拿我们经常使用的 HTTP 协议，其中也存在强缓存和协商缓存两种缓存方式。当我们打开一个网站的时候，浏览器会查询该请求的响应头，通过判断响应头中是否有 ...",
                "cover": "https://file.shenfq.com/pic/202203121421464.png"
            },
            {
                "pagePath": "posts/2022/2021总结.md",
                "title": "2021年终总结",
                "link": "posts/2022/2021总结.html",
                "date": "2022/02/14",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "年终总结"
                ],
                "tags": [
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "从参加工作开始，基本每年都会写年终总结，2021年的年终总结写得格外的晚，甚至2022年都已经过去了一个多月。 2021年新冠疫情依旧没有消失，当然疫情带给我们的影响，相比于2020年已经小了很多，打了疫苗，做核酸出结果的速度也...",
                "cover": "https://file.shenfq.com/pic/202202102257314.png"
            },
            {
                "pagePath": "posts/2022/promise.then.md",
                "title": "关于 Promise 的执行顺序",
                "link": "posts/2022/promise.then.html",
                "date": "2022/01/20",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "JavaScript",
                    "Promise"
                ],
                "excerpt": "最近看到一个 Promise 相关的很有意思的代码： new Promise((resolve) => { console.log(1) resolve() }).then(() => { new Promise((resolve) => { console.log(2) resolve() }).then(() => { console.log(4) }) }).then(() =...",
                "cover": "https://file.shenfq.com/pic/202201201133648.png"
            },
            {
                "pagePath": "posts/2022/swc.md",
                "title": "新一代的编译工具 SWC",
                "link": "posts/2022/swc.html",
                "date": "2022/01/13",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "JavaScript",
                    "Rust",
                    "Babel",
                    "编译"
                ],
                "excerpt": "最近前端圈掀起了一阵 rust 风，凡是能用 rust 重写的前端工具就用 rust 重写，今天介绍的工具就是通过 rust 实现的 babel：swc，一个将 ES6 转化为 ES5 的工具。 而且在 swc 的官网，很直白说自己和 babel 对标，swc 和 babel...",
                "cover": "https://file.shenfq.com/pic/202201050924805.png"
            },
            {
                "pagePath": "posts/2021/Pinia.md",
                "title": "全新的 Vue3 状态管理工具：Pinia",
                "link": "posts/2021/Pinia.html",
                "date": "2021/12/15",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "Vue3",
                    "Pinia",
                    "状态管理"
                ],
                "excerpt": "Vue3 发布已经有一段时间了，它采用了新的响应式系统，而且构建了一套全新的 Composition API。Vue 的周边生态都在加紧适配这套新的系统，官方的状态管理库 Vuex 也在适配中，为此官方提出了一个 Vuex 5 的全新提案。 - 支持两...",
                "cover": "https://file.shenfq.com/pic/202112151708176.svg"
            },
            {
                "pagePath": "posts/2021/node-util.md",
                "title": "你不知道的 Node.js Util",
                "link": "posts/2021/node-util.html",
                "date": "2021/11/15",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "Util",
                    "Node.js",
                    "Promise"
                ],
                "excerpt": "从类型判断说起 在 JavaScript 中，进行变量的类型校验是一个非常令人头疼的事，如果只是简单的使用 typeof 会到各种各样的问题。 举几个简单的🌰： console.log(typeof null) // 'object' console.log(typeof new Array) //...",
                "cover": "https://file.shenfq.com/pic/202111150955411.png"
            },
            {
                "pagePath": "posts/2021/Undici.md",
                "title": "介绍一个请求库 — Undici",
                "link": "posts/2021/Undici.html",
                "date": "2021/10/19",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端",
                    "axios",
                    "fetch",
                    "undici",
                    "request"
                ],
                "excerpt": "前言 在浏览器中，如果想发起一个请求，我们以前会使用到 xhr，不过这种底层 api，往往调用方式比较简陋。为了提高开发效率， jQuery 的 $.ajax 可能是最好的选择，好在后来出现了更加现代化的 fetch api 。 但是考虑到 fetch ...",
                "cover": "https://file.shenfq.com/pic/202110081517709.png"
            },
            {
                "pagePath": "posts/2021/sudoku.md",
                "title": "用 JavaScript 做数独",
                "link": "posts/2021/sudoku.html",
                "date": "2021/09/05",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "React",
                    "sudoku",
                    "JavaScript"
                ],
                "excerpt": "最近看到老婆天天在手机上玩数独，突然想起 N 年前刷 LeetCode 的时候，有个类似的算法题（37.解数独），是不是可以把这个算法进行可视化。 说干就干，经过一个小时的实践，最终效果如下： 怎么解数独 解数独之前，我们先了解一...",
                "cover": "https://file.shenfq.com/pic/20210816103453.gif"
            },
            {
                "pagePath": "posts/2021/GTD.md",
                "title": "使用 GTD 优化自己的工作和生活",
                "link": "posts/2021/GTD.html",
                "date": "2021/08/10",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "随便写写"
                ],
                "tags": [
                    "GTD",
                    "方法论",
                    "提醒事项",
                    "滴答清单",
                    "随便写写"
                ],
                "excerpt": "算起来工作已经四个年头了，刚开始工作就在使用 TODO 工具，比如 OneNote、奇妙清单（现在叫：微软 TODO）、滴答清单。但是，在用的过程中很多 TODO 直到项目结束了，依然是 TODO。 直到最近遇到了 GTD，简直是打开了新世界的大...",
                "cover": "https://file.shenfq.com/pic/20210810152004.png"
            },
            {
                "pagePath": "posts/2021/pull-request.md",
                "title": "你给开源项目提过 PR 吗？",
                "link": "posts/2021/pull-request.html",
                "date": "2021/08/04",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "感悟",
                    "GitHub",
                    "Pull Request"
                ],
                "excerpt": "你有给开源的库或者框架提过 PR 吗？ 如果没有，那么今天的文章会教你怎么给开源库提 PR。 为什么要给开源项目提 PR？ 这件事还得从好几年前（2019年）说起，那时候在折腾一个虚拟 DOM 的玩具（参考之前的文章：🔗虚拟DOM到底...",
                "cover": "https://file.shenfq.com/pic/20210804130741.jpeg"
            },
            {
                "pagePath": "posts/2021/setState.md",
                "title": "React 中 setState 是一个宏任务还是微任务？",
                "link": "posts/2021/setState.html",
                "date": "2021/08/02",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "JavaScript",
                    "React",
                    "面试"
                ],
                "excerpt": "最近有个朋友面试，面试官问了个奇葩的问题，也就是我写在标题上的这个问题。 能问出这个问题，面试官应该对 React 不是很了解，也是可能是看到面试者简历里面有写过自己熟悉 React，面试官想通过这个问题来判断面试者是不是真...",
                "cover": "https://file.shenfq.com/pic/20210729112816.png"
            },
            {
                "pagePath": "posts/2021/ink.md",
                "title": "在命令行里也能用 React",
                "link": "posts/2021/ink.html",
                "date": "2021/07/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "命令行",
                    "前端框架",
                    "JavaScript",
                    "React"
                ],
                "excerpt": "用过 React 的同学都知道，React 作为一个视图库，在进行 Web 开发的时候需要安装两个模块。 npm install react --save npm install react-dom --save react 模块主要提供了组件的生命周期、虚拟 DOM Diff、Hooks 等能力，以及...",
                "cover": "https://file.shenfq.com/pic/20210726142859.png"
            },
            {
                "pagePath": "posts/2021/Webpack 热更新原理.md",
                "title": "Webpack 热更新原理",
                "link": "posts/2021/Webpack 热更新原理.html",
                "date": "2021/07/21",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "模块化",
                    "前端工程化",
                    "webpack"
                ],
                "excerpt": "用过 webpack 的同学应该都知道，有一个特别好用的『热更新』，在不刷新页面的情况下，就能将代码推到浏览器。 今天的文章将会探寻一下 webpack 热更新的秘密。 如何配置热更新 我们先安装一些我们需要的包： npm i webpack we...",
                "cover": "https://file.shenfq.com/pic/20210718124656.gif"
            },
            {
                "pagePath": "posts/2021/我不知道的 position.md",
                "title": "我不知道的CSS - position",
                "link": "posts/2021/我不知道的 position.html",
                "date": "2021/07/13",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "CSS",
                    "Sticky",
                    "Postion"
                ],
                "excerpt": "熟悉我的小伙伴可能知道，我最近回长沙工作了，由于之前大部分时间在做工具，Node.js 的开发比较多。but，现在又重新开始写了一些业务代码，发现 CSS 有很多博大精深的东西，所以，今天的文章复习一下 CSS 定位相关的东西。 定...",
                "cover": "https://file.shenfq.com/pic/20210706111122.png"
            },
            {
                "pagePath": "posts/2021/go/go 并发.md",
                "title": "Go 并发",
                "link": "posts/2021/go/go 并发.html",
                "date": "2021/06/22",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "并发"
                ],
                "excerpt": "并发 前言 在学习 Go 的并发之前，先复习一下操作系统的基础知识。 并发与并行 先来理一理并发与并行的区别。 可是明确的是并发≠并行，但是只要 CPU 运行足够快，每个时间片划分足够小，就会给人们造成一种假象，认为计算机在...",
                "cover": "https://file.shenfq.com/pic/20210621105313.png"
            },
            {
                "pagePath": "posts/2021/我回长沙了.md",
                "title": "我回长沙了",
                "link": "posts/2021/我回长沙了.html",
                "date": "2021/06/08",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "随便写写"
                ],
                "tags": [
                    "长沙",
                    "二线",
                    "置业",
                    "工作",
                    "offer"
                ],
                "excerpt": "为什么想回来？ 2017年，大学毕业后去到了深圳，那时候一心就想去大城市看看，让自己的青春不留遗憾。 刚到深圳的时候，加入了一家实习公司，管理层会通过各种方式让大家留下来加班，即使是我一个刚刚加入手头上没什么事情的实...",
                "cover": "https://file.shenfq.com/pic/20210607174247.png"
            },
            {
                "pagePath": "posts/2021/JavaScript 异步编程史.md",
                "title": "JavaScript 异步编程史",
                "link": "posts/2021/JavaScript 异步编程史.html",
                "date": "2021/06/01",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "JavaScript",
                    "Promise",
                    "Generator",
                    "async/await"
                ],
                "excerpt": "前言 早期的 Web 应用中，与后台进行交互时，需要进行 form 表单的提交，然后在页面刷新后给用户反馈结果。在页面刷新过程中，后台会重新返回一段 HTML 代码，这段 HTML 中的大部分内容与之前页面基本相同，这势必造成了流量的...",
                "cover": "https://file.shenfq.com/pic/20210531113319.png"
            },
            {
                "pagePath": "posts/2021/go/go 反射机制.md",
                "title": "Go 反射机制",
                "link": "posts/2021/go/go 反射机制.html",
                "date": "2021/04/29",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "反射机制"
                ],
                "excerpt": "因为没有强类型语言的经验，反射这个概念，之前确实没怎么接触过。在维基百科上搜了一下，具体解释如下： go 中的反射也是这种作用，可以在程序运行期间，获取变量的类型与值的信息，然后进行访问或或者修改。go 语言中，内置了...",
                "cover": "https://file.shenfq.com/pic/20210429141331.png"
            },
            {
                "pagePath": "posts/2021/go/go 错误处理.md",
                "title": "Go 错误处理",
                "link": "posts/2021/go/go 错误处理.html",
                "date": "2021/04/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "错误处理"
                ],
                "excerpt": "构造 error 在 go 语言中，有一个预定义的接口：error，该接口自带一个 Error() 方法，调用该方法会返回一个字符串。 type error interface { Error() string } 调用该方法，会返回当前错误的具体结果。一般有下面几种方式生成...",
                "cover": "https://file.shenfq.com/pic/20210427164350.png"
            },
            {
                "pagePath": "posts/2021/消费主义.md",
                "title": "消费主义的陷阱",
                "link": "posts/2021/消费主义.html",
                "date": "2021/04/21",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "随便写写"
                ],
                "tags": [
                    "消费主义",
                    "理性消费",
                    "随便写写"
                ],
                "excerpt": "最近有一则新闻『中国超 2 亿人单身』上了热搜，但是我压根不关心这个，因为我有女朋友，我更关心的是后面的内容『一线城市单身青年 4 成月光』（我表面上在第一层，你以为我在第三层，其实我已经在第五层了🤡）。 说起来是在...",
                "cover": "https://file.shenfq.com/pic/20210420094632.png"
            },
            {
                "pagePath": "posts/2021/go/go 结构体.md",
                "title": "Go 结构体与方法",
                "link": "posts/2021/go/go 结构体.html",
                "date": "2021/04/19",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "结构体"
                ],
                "excerpt": "结构体 结构体是 go 语言中一个比较重要的概念，在 c 语言中也有类似的东西。由于他们没有类的概念，结构体可以简单理解成类，是一个不同类型的数据构成的一个集合。集合中不同类型的数据被称为成员，每个成员都要自己不同的类...",
                "cover": "https://file.shenfq.com/pic/20210418162456.png"
            },
            {
                "pagePath": "posts/2021/go/go 函数与指针.md",
                "title": "Go 函数与指针",
                "link": "posts/2021/go/go 函数与指针.html",
                "date": "2021/04/12",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "函数",
                    "指针"
                ],
                "excerpt": "函数 函数就是一段基本的代码块，一般用来对需要重复执行的代码进行复用。在 go 中，函数是『一等公民』，这与 js 类似，也就是可以将函数当做一个变量进行传递。 函数声明 由于是强类型语言，与 js 不同，在函数声明的过程中，...",
                "cover": "https://file.shenfq.com/pic/20210411144315.png"
            },
            {
                "pagePath": "posts/2021/go/go 数组与切片.md",
                "title": "Go 数组与切片",
                "link": "posts/2021/go/go 数组与切片.html",
                "date": "2021/04/08",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "数组"
                ],
                "excerpt": "数组 数组是一组类型相同的，长度固定的，按数字编号排列的数据序列。由于 go 语言中，数组的类型相同且长度固定，所以在声明数组的时候，就会体现这两个特点。 var array [5]int // [0 0 0 0 0] 数组通过 [SIZE]（方括号内为数...",
                "cover": "https://file.shenfq.com/pic/20210407195942.png"
            },
            {
                "pagePath": "posts/2021/go/go 变量与常量.md",
                "title": "Go 常量与变量",
                "link": "posts/2021/go/go 变量与常量.html",
                "date": "2021/04/06",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "变量",
                    "常量"
                ],
                "excerpt": "变量 go 语言的变量声明和大多数语言类似，通过 var 关键字声明变量，只是 go 语言作为静态类型语言，声明变量时需要指定其类型。 下面的代码表示声明一个『name』变量，类型为『string』，并给其赋值『\"Shenfq\"』。 var name ...",
                "cover": "https://file.shenfq.com/pic/20210406135246.png"
            },
            {
                "pagePath": "posts/2021/go/go module.md",
                "title": "Go 模块化",
                "link": "posts/2021/go/go module.html",
                "date": "2021/04/05",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Go"
                ],
                "tags": [
                    "Go",
                    "模块化"
                ],
                "excerpt": "前言 在很久很久以前，就 push 自己学过 go 语言，但是之前只是看了一下基础语法就放弃了，实在是工作当中没有应用场景。最近发现基于 go 写的 esbuild 异军突起，想要深入研究下它的奥秘，发现看不懂。于是，打算先从 go 开始...",
                "cover": "https://file.shenfq.com/pic/20210405193808.png"
            },
            {
                "pagePath": "posts/2021/lit-html.md",
                "title": "下一代的模板引擎：lit-html",
                "link": "posts/2021/lit-html.html",
                "date": "2021/03/31",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "模板引擎",
                    "Components",
                    "Web Components"
                ],
                "excerpt": "前面的文章介绍了 Web Components 的基本用法，今天来看看基于这个原生技术，Google 二次封存的框架 lit-html。 其实早在 Google 提出 Web Components 的时候，就在此基础上发布了 Polymer 框架。只是这个框架一直雷声大雨点小...",
                "cover": "https://file.shenfq.com/pic/20210317192428.png"
            },
            {
                "pagePath": "posts/2021/读《贫穷的本质》.md",
                "title": "读《贫穷的本质》引发的一些思考",
                "link": "posts/2021/读《贫穷的本质》.html",
                "date": "2021/03/08",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "读后感"
                ],
                "tags": [
                    "读后感",
                    "前端思考",
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "最近在看了 《贫穷的本质》这本书，然后结合书中的观点和最近工作的一些思考，写了这么一篇文章，和大家分享一下我的一些想法。 书的最后，给大家总结了五点，穷人之所以一直贫穷的原因，因为看的是翻译的书籍，这里我用我自己...",
                "cover": "https://file.shenfq.com/pic/20210308135724.jpg"
            },
            {
                "pagePath": "posts/2021/Web Components 上手指南.md",
                "title": "Web Components 上手指南",
                "link": "posts/2021/Web Components 上手指南.html",
                "date": "2021/02/23",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "Components",
                    "Web Components"
                ],
                "excerpt": "现在的前端开发基本离不开 React、Vue 这两个框架的支撑，而这两个框架下面又衍生出了许多的自定义组件库： - Element（Vue） - Ant Design（React） 这些组件库的出现，让我们可以直接使用已经封装好的组件，而且在开源社区的...",
                "cover": "https://file.shenfq.com/pic/20210223154148.png"
            },
            {
                "pagePath": "posts/2021/MobX 上手指南.md",
                "title": "MobX 上手指南",
                "link": "posts/2021/MobX 上手指南.html",
                "date": "2021/01/25",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "MobX",
                    "状态管理"
                ],
                "excerpt": "之前用 Redux 比较多，一直听说 Mobx 能让你体验到在 React 里面写 Vue 的感觉，今天打算尝试下 Mobx 是不是真的有写 Vue 的感觉。 题外话 在介绍 MobX 的用法之前，先说点题外话，我们可以看一下 MobX 的中文简介。在 MobX 的...",
                "cover": "https://file.shenfq.com/pic/20210118134728.png"
            },
            {
                "pagePath": "posts/2021/介绍两种 CSS 方法论.md",
                "title": "介绍两种 CSS 方法论",
                "link": "posts/2021/介绍两种 CSS 方法论.html",
                "date": "2021/01/05",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "CSS",
                    "前端",
                    "样式",
                    "组件化",
                    "工程化"
                ],
                "excerpt": "前言 说起 CSS 命名规范，大家应该都很熟悉，或者应该听说过 BEM 。BEM 是由 Yandex 团队提出的一种 CSS Class 命名方法，旨在帮助开发人员创建更好的且结构一致的 CSS 模块。 BEM 将页面的类名分为块（Block）、元素（Element...",
                "cover": "https://file.shenfq.com/pic/20210103214204.png"
            },
            {
                "pagePath": "posts/2021/2020总结.md",
                "title": "2020年终总结",
                "link": "posts/2021/2020总结.html",
                "date": "2021/01/01",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "年终总结"
                ],
                "tags": [
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "今天早上起来，看了下日期，没想到 2020 只剩下两天了，过去得如此快，甚至都还没想好怎么跨年😥。本来想看看之前立的 flag 有多少实现了，结果发现自己今年根本没立 flag，哈哈哈。仔细回顾了一下今年，发现还是挺丰富的，做...",
                "cover": "https://file.shenfq.com/pic/20201230205903.gif"
            },
            {
                "pagePath": "posts/2020/Node.js 服务性能翻倍的秘密（二）.md",
                "title": "Node.js 服务性能翻倍的秘密（二）",
                "link": "posts/2020/Node.js 服务性能翻倍的秘密（二）.html",
                "date": "2020/12/25",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "性能",
                    "Node",
                    "router",
                    "路由"
                ],
                "excerpt": "前言 前一篇文章介绍了 fastify 通过 schema 来序列化 JSON，为 Node.js 服务提升性能的方法。今天的文章会介绍 fastify 使用的路由库，翻阅其源码（lib/route.js）可以发现，fastify 的路由库并不是内置的，而是使用了一个叫做...",
                "cover": "https://file.shenfq.com/pic/20201218150431.png"
            },
            {
                "pagePath": "posts/2020/Node.js 服务性能翻倍的秘密（一）.md",
                "title": "Node.js 服务性能翻倍的秘密（一）",
                "link": "posts/2020/Node.js 服务性能翻倍的秘密（一）.html",
                "date": "2020/12/13",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "性能",
                    "Node",
                    "JSON",
                    "fastify"
                ],
                "excerpt": "前言 用过 Node.js 开发过的同学肯定都上手过 koa，因为他简单优雅的写法，再加上丰富的社区生态，而且现存的许多 Node.js 框架都是基于 koa 进行二次封装的。但是说到性能，就不得不提到一个知名框架： fastify ，听名字就知道...",
                "cover": "https://file.shenfq.com/pic/20201213162826.png"
            },
            {
                "pagePath": "posts/2020/我是怎么读源码的.md",
                "title": "我是如何阅读源码的",
                "link": "posts/2020/我是怎么读源码的.html",
                "date": "2020/12/7",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "React",
                    "Vue.js",
                    "前端"
                ],
                "excerpt": "最近写了很多源码分析相关的文章，React、Vue 都有，想把我阅读源码的一些心得分享给大家。 React： - React 架构的演变 - 从同步到异步 - React 架构的演变 - 从递归到循环 - React 架构的演变 - 更新机制 - React 架构的演变...",
                "cover": "https://file.shenfq.com/pic/20201205210806.png"
            },
            {
                "pagePath": "posts/2020/Vue3 Teleport 组件的实践及原理.md",
                "title": "Vue3 Teleport 组件的实践及原理",
                "link": "posts/2020/Vue3 Teleport 组件的实践及原理.html",
                "date": "2020/12/1",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "Vue.js",
                    "组件"
                ],
                "excerpt": "Vue3 的组合式 API 以及基于 Proxy 响应式原理已经有很多文章介绍过了，除了这些比较亮眼的更新，Vue3 还新增了一个内置组件：Teleport。这个组件的作用主要用来将模板内的 DOM 元素移动到其他位置。 使用场景 业务开发的过程中...",
                "cover": "https://file.shenfq.com/pic/20201128210914.png"
            },
            {
                "pagePath": "posts/2020/【翻译】CommonJS 是如何导致打包体积增大的？.md",
                "title": "【翻译】CommonJS 是如何导致打包后体积增大的？",
                "link": "posts/2020/【翻译】CommonJS 是如何导致打包体积增大的？.html",
                "date": "2020/11/18",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "翻译",
                    "模块化",
                    "前端工程化",
                    "Webpack"
                ],
                "excerpt": "今天的文章，将介绍什么是 CommonJS，以及它为什么会导致我们打包后的文件体积增大。 什么是 CommonJS？ CommonJS 是 2009 年发布的 JavaScript模块化的一项标准，最初它只打算在浏览器之外的场景使用，主要用于服务器端的应用..."
            },
            {
                "pagePath": "posts/2020/Vue3 模板编译优化.md",
                "title": "Vue3 模板编译优化",
                "link": "posts/2020/Vue3 模板编译优化.html",
                "date": "2020/11/11",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "Vue.js",
                    "编译",
                    "模板"
                ],
                "excerpt": "Vue3 正式发布已经有一段时间了，前段时间写了一篇文章（《Vue 模板编译原理》）分析 Vue 的模板编译原理。今天的文章打算学习下 Vue3 下的模板编译与 Vue2 下的差异，以及 VDOM 下 Diff 算法的优化。 编译入口 了解过 Vue3 的...",
                "cover": "https://file.shenfq.com/pic/20201109144930.png"
            },
            {
                "pagePath": "posts/2020/小程序依赖分析.md",
                "title": "小程序依赖分析",
                "link": "posts/2020/小程序依赖分析.html",
                "date": "2020/11/02",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "微信小程序"
                ],
                "tags": [
                    "小程序",
                    "微信小程序",
                    "依赖分析"
                ],
                "excerpt": "用过 webpack 的同学肯定知道 webpack-bundle-analyzer ，可以用来分析当前项目 js 文件的依赖关系。 因为最近一直在做小程序业务，而且小程序对包体大小特别敏感，所以就想着能不能做一个类似的工具，用来查看当前小程序各个主...",
                "cover": "https://file.shenfq.com/pic/20201030230741.png"
            },
            {
                "pagePath": "posts/2020/React 架构的演变 - Hooks 的实现.md",
                "title": "React 架构的演变 - Hooks 的实现",
                "link": "posts/2020/React 架构的演变 - Hooks 的实现.html",
                "date": "2020/10/27",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "JavaScript",
                    "React"
                ],
                "excerpt": "React Hooks 可以说完全颠覆了之前 Class Component 的写法，进一步增强了状态复用的能力，让 Function Component 也具有了内部状态，对于我个人来说，更加喜欢 Hooks 的写法。当然如果你是一个使用 Class Component 的老手，初...",
                "cover": "https://file.shenfq.com/pic/20201026173627.png"
            },
            {
                "pagePath": "posts/2020/Vue 3 的组合 API 如何请求数据？.md",
                "title": "Vue 3 的组合 API 如何请求数据？",
                "link": "posts/2020/Vue 3 的组合 API 如何请求数据？.html",
                "date": "2020/10/20",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端",
                    "前端框架",
                    "Vue.js"
                ],
                "excerpt": "前言 之前在学习 React Hooks 的过程中，看到一篇外网文章，通过 Hooks 来请求数据，并将这段逻辑抽象成一个新的 Hooks 给其他组件复用，我也在我的博客里翻译了一下：《在 React Hooks 中如何请求数据？》，感兴趣可以看看。虽...",
                "cover": "https://file.shenfq.com/pic/20201019144935.png"
            },
            {
                "pagePath": "posts/2020/React 架构的演变 - 更新机制.md",
                "title": "React 架构的演变 - 更新机制",
                "link": "posts/2020/React 架构的演变 - 更新机制.html",
                "date": "2020/10/12",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "JavaScript",
                    "React"
                ],
                "excerpt": "前面的文章分析了 Concurrent 模式下异步更新的逻辑，以及 Fiber 架构是如何进行时间分片的，更新过程中的很多内容都省略了，评论区也收到了一些同学对更新过程的疑惑，今天的文章就来讲解下 React Fiber 架构的更新机制。 Fib...",
                "cover": "https://file.shenfq.com/pic/20201009143621.png"
            },
            {
                "pagePath": "posts/2020/React 架构的演变 - 从递归到循环.md",
                "title": "React 架构的演变 - 从递归到循环",
                "link": "posts/2020/React 架构的演变 - 从递归到循环.html",
                "date": "2020/09/29",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "JavaScript",
                    "React"
                ],
                "excerpt": "这篇文章是 React 架构演变的第二篇，上一篇主要介绍了更新机制从同步修改为异步，这一篇重点介绍 Fiber 架构下通过循环遍历更新的过程，之所以要使用循环遍历的方式，是因为递归更新过程一旦开始就不能暂停，只能不断向下，直...",
                "cover": "https://file.shenfq.com/pic/20200926153531.png"
            },
            {
                "pagePath": "posts/2020/React 架构的演变 - 从同步到异步.md",
                "title": "React 架构的演变 - 从同步到异步",
                "link": "posts/2020/React 架构的演变 - 从同步到异步.html",
                "date": "2020/09/23",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "JavaScript",
                    "React"
                ],
                "excerpt": "写这篇文章的目的，主要是想弄懂 React 最新的 fiber 架构到底是什么东西，但是看了网上的很多文章，要不模棱两可，要不就是一顿复制粘贴，根本看不懂，于是开始认真钻研源码。钻研过程中，发现我想得太简单了，React 源码的复...",
                "cover": "https://file.shenfq.com/ipic/2020-09-22-064122.png"
            },
            {
                "pagePath": "posts/2020/Webpack5 Module Federation.md",
                "title": "Webpack5 跨应用代码共享-Module Federation",
                "link": "posts/2020/Webpack5 Module Federation.html",
                "date": "2020/09/14",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "模块化",
                    "前端工程化",
                    "webpack"
                ],
                "excerpt": "Webpack 5 的消息尽管已经出来了许久，但是正式版一直还未发布。Webpack 5 的 ChangeLog 中，除了常规的性能优化、编译提速之外，有一个比较让人期待的功能就是 Module Federation。有些文件将 Module Federation 强行翻译成「...",
                "cover": "https://file.shenfq.com/ipic/2020-09-14-040807.png"
            },
            {
                "pagePath": "posts/2020/面向未来的前端构建工具-vite.md",
                "title": "面向未来的前端构建工具-vite",
                "link": "posts/2020/面向未来的前端构建工具-vite.html",
                "date": "2020/09/07",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "模块化",
                    "前端工程化",
                    "Vue.js",
                    "JavaScript"
                ],
                "excerpt": "前言 如果近期你有关注 Vue 的动态，就能发现 Vue 作者最近一直在捣鼓的新工具 vite。vite 1.0 目前已经进入了 rc 版本，马上就要正式发布 1.0 的版本了。几个月前，尤雨溪就已经在微博介绍过了 vite ，是一个基于浏览器原生 E...",
                "cover": "https://file.shenfq.com/ipic/2020-09-06-031703.png"
            },
            {
                "pagePath": "posts/2020/手把手教你实现 Promise .md",
                "title": "手把手教你实现 Promise",
                "link": "posts/2020/手把手教你实现 Promise .html",
                "date": "2020/09/01",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Promise"
                ],
                "tags": [
                    "前端",
                    "Promise",
                    "JavaScript"
                ],
                "excerpt": "前言 很多 JavaScript 的初学者都曾感受过被回调地狱支配的恐惧，直至掌握了 Promise 语法才算解脱。虽然很多语言都早已内置了 Promise ，但是 JavaScript 中真正将其发扬光大的还是 jQuery 1.5 对 $.ajax 的重构，支持了 Prom...",
                "cover": "https://file.shenfq.com/ipic/2020-08-31-120006.png"
            },
            {
                "pagePath": "posts/2020/你不知道的 TypeScript 高级类型.md",
                "title": "你不知道的 TypeScript 高级类型",
                "link": "posts/2020/你不知道的 TypeScript 高级类型.html",
                "date": "2020/08/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "JavaScript",
                    "TypeScript",
                    "类型系统",
                    "泛型"
                ],
                "excerpt": "前言 对于有 JavaScript 基础的同学来说，入门 TypeScript 其实很容易，只需要简单掌握其基础的类型系统就可以逐步将 JS 应用过渡到 TS 应用。 // js const double = (num) => 2 * num // ts const double = (num: number): nu...",
                "cover": "https://file.shenfq.com/ipic/2020-08-26-135150.png"
            },
            {
                "pagePath": "posts/2020/从零开始实现VS Code基金插件.md",
                "title": "从零开始实现 VS Code 基金插件",
                "link": "posts/2020/从零开始实现VS Code基金插件.html",
                "date": "2020/08/24",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "VSCode"
                ],
                "tags": [
                    "VSCode"
                ],
                "excerpt": "写在前面 随着7月一波牛市行情，越来越多的人投身A股行列，但是股市的风险巨大，有人一夜暴富，也有人血本无归，所以对于普通人来说基金定投是个不错的选择，本人也是基金定投的一枚小韭菜。 上班的时候经常心理痒痒，想看看今...",
                "cover": "https://file.shenfq.com/ipic/2020-08-22-050614.png"
            },
            {
                "pagePath": "posts/2020/Vue模板编译原理.md",
                "title": "Vue 模板编译原理",
                "link": "posts/2020/Vue模板编译原理.html",
                "date": "2020/08/20",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "Vue.js",
                    "编译",
                    "模板"
                ],
                "excerpt": "写在开头 写过 Vue 的同学肯定体验过， .vue 这种单文件组件有多么方便。但是我们也知道，Vue 底层是通过虚拟 DOM 来进行渲染的，那么 .vue 文件的模板到底是怎么转换成虚拟 DOM 的呢？这一块对我来说一直是个黑盒，之前也没有...",
                "cover": "https://file.shenfq.com/ipic/2020-08-19-032238.jpg"
            },
            {
                "pagePath": "posts/2020/小程序自动化测试.md",
                "title": "小程序自动化测试",
                "link": "posts/2020/小程序自动化测试.html",
                "date": "2020/08/09",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "微信小程序"
                ],
                "tags": [
                    "小程序",
                    "微信小程序",
                    "自动化测试"
                ],
                "excerpt": "背景 近期团队打算做一个小程序自动化测试的工具，期望能够做到业务人员操作一遍小程序后，自动还原之前的操作路径，并且捕获操作过程中发生的异常，以此来判断这次发布是否会影响小程序的基础功能。 上述描述看似简单，但是中...",
                "cover": "https://file.shenfq.com/ipic/2020-08-09-072710.png"
            },
            {
                "pagePath": "posts/2020/Node.js 与二进制数据流.md",
                "title": "Node.js 与二进制数据流",
                "link": "posts/2020/Node.js 与二进制数据流.html",
                "date": "2020/06/30",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "Node",
                    "Buffer",
                    "Stream",
                    "二进制"
                ],
                "excerpt": "认识二进制数据 二进制数据就像上图一样，由0和1来存储数据。普通的十进制数转化成二进制数一般采用\"除2取余，逆序排列\"法，用2整除十进制整数，可以得到一个商和余数；再用2去除商，又会得到一个商和余数，如此进行，直到商为...",
                "cover": "https://file.shenfq.com/ipic/2020-04-16-040056.jpg"
            },
            {
                "pagePath": "posts/2020/【翻译】Node.js CLI 工具最佳实践.md",
                "title": "【翻译】Node.js CLI 工具最佳实践",
                "link": "posts/2020/【翻译】Node.js CLI 工具最佳实践.html",
                "date": "2020/02/22",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "前端",
                    "翻译",
                    "Node"
                ],
                "excerpt": "这是一个关于如何构建成功的、可移植的、对用户友好的Node.js 命令行工具（CLI）最佳实践的集合。 为什么写这篇文章？ 一个糟糕的 CLI 工具会让用户觉得难用，而构建一个成功的 CLI 需要密切关注很多细节，同时需要站在用户的角..."
            },
            {
                "pagePath": "posts/2020/2019年终总结.md",
                "title": "2019年终总结",
                "link": "posts/2020/2019年终总结.html",
                "date": "2020/01/17",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "年终总结"
                ],
                "tags": [
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "GoodBye 2019 2019 已经结束，是时候开始回忆下自己的 2019 了。年终总结好像是 2017 年开始写的，还是毕业的第一个年头，一晃已经毕业两年多了。一年过去，总得记点流水账吧。 工作上 工作上，去年还在感叹自己进入鹅厂多么不...",
                "cover": "https://file.shenfq.com/ezdlm.png"
            },
            {
                "pagePath": "posts/2019/前端模块化的今生.md",
                "title": "前端模块化的今生",
                "link": "posts/2019/前端模块化的今生.html",
                "date": "2019/11/30",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "前端",
                    "前端工程化",
                    "前端模块化",
                    "CommonJS",
                    "ES Module"
                ],
                "excerpt": "背景 众所周知，早期 JavaScript 原生并不支持模块化，直到 2015 年，TC39 发布 ES6，其中有一个规范就是 ES modules（为了方便表述，后面统一简称 ESM）。但是在 ES6 规范提出前，就已经存在了一些模块化方案，比如 CommonJS（...",
                "cover": "https://file.shenfq.com/zbsq0.png"
            },
            {
                "pagePath": "posts/2019/前端模块化的前世.md",
                "title": "前端模块化的前世",
                "link": "posts/2019/前端模块化的前世.html",
                "date": "2019/10/08",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "前端",
                    "前端工程化",
                    "前端模块化",
                    "AMD",
                    "CMD",
                    "CommonJS"
                ],
                "excerpt": "随着前端项目的越来越庞大，组件化的前端框架，前端路由等技术的发展，模块化已经成为现代前端工程师的一项必备技能。无论是什么语言一旦发展到一定地步，其工程化能力和可维护性势必得到相应的发展。 模块化这件事，无论在哪个...",
                "cover": "https://file.shenfq.com/20191008214141.png"
            },
            {
                "pagePath": "posts/2019/深入理解 ESLint.md",
                "title": "深入理解 ESLint",
                "link": "posts/2019/深入理解 ESLint.html",
                "date": "2019/07/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "前端工程化",
                    "前端工具",
                    "ESLint",
                    "代码格式化"
                ],
                "excerpt": "前言 小沈是一个刚刚开始工作的前端实习生，第一次进行团队开发，难免有些紧张。在导师的安排下，拿到了项目的 git 权限，开始进行 clone。 $ git clone git@github.com:company/project.git 小沈开始细细品味着同事们的代码，...",
                "cover": "https://file.shenfq.com/20190727153755.png"
            },
            {
                "pagePath": "posts/2019/USB.md",
                "title": "USB 科普",
                "link": "posts/2019/USB.html",
                "date": "2019/06/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "其他"
                ],
                "tags": [
                    "USB"
                ],
                "excerpt": "什么是 USB？ 维基百科的解释： 在几年前，市面上常见的 USB 数据线都使用如下结构，一边 USB Type-A（主要用于连接电脑或充电器）, 一边 USB Micro-B（主要用来连接手机或其他手持设备），主要还是因为安卓手机普遍使用这种类...",
                "cover": "https://file.shenfq.com/FpXvpHY5rIYID72c1rOVAowxtW42.png"
            },
            {
                "pagePath": "posts/2019/虚拟DOM到底是什么？.md",
                "title": "虚拟DOM到底是什么？",
                "link": "posts/2019/虚拟DOM到底是什么？.html",
                "date": "2019/06/18",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "虚拟DOM"
                ],
                "excerpt": "是什么？ 虚拟 DOM （Virtual DOM ）这个概念相信大家都不陌生，从 React 到 Vue ，虚拟 DOM 为这两个框架都带来了跨平台的能力（React-Native 和 Weex）。因为很多人是在学习 React 的过程中接触到的虚拟 DOM ，所以为先入为主...",
                "cover": "https://file.shenfq.com/FtpWFfOrYBe4E2sI3_MyVvWYYijx.png"
            },
            {
                "pagePath": "posts/2019/【翻译】基于虚拟DOM库(Snabbdom)的迷你React.md",
                "title": "【翻译】基于虚拟DOM库(Snabbdom)的迷你React",
                "link": "posts/2019/【翻译】基于虚拟DOM库(Snabbdom)的迷你React.html",
                "date": "2019/05/01",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "react",
                    "virtual dom",
                    "虚拟 DOM",
                    "Snabbdom",
                    "翻译"
                ],
                "excerpt": "React 是 JavaScript 社区的新成员，尽管 JSX （在 JavaScript 中使用 HTML 语法）存在一定的争议，但是对于虚拟 DOM 人们有不一样的看法。 对于不熟悉的人来说，虚拟 DOM 可以描述为某个时刻真实DOM的简单表示。其思想是：每次...",
                "cover": "https://file.shenfq.com/FvyObN9fMncD7cMXJYfZOFQJFQ--.png"
            },
            {
                "pagePath": "posts/2019/【翻译】Vue.js 的注意事项与技巧.md",
                "title": "【翻译】Vue.js 的注意事项与技巧",
                "link": "posts/2019/【翻译】Vue.js 的注意事项与技巧.html",
                "date": "2019/03/31",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "Vue.js",
                    "翻译"
                ],
                "excerpt": "原文链接：Vue.js — Considerations and Tricks Vue.js 是一个很棒的框架。然而，当你开始构建一个大型 JavaScript 项目的时候，你将对 Vue.js 感到一些困惑。这些困惑并不是来自框架本身，相反 Vue.js 团队会经常调整一些重要...",
                "cover": "https://file.shenfq.com/FjFxhMxwH4RWxzhXmnKlhcxjQ2Ap.png"
            },
            {
                "pagePath": "posts/2019/【翻译】在 React Hooks 中如何请求数据？.md",
                "title": "【翻译】在 React Hooks 中如何请求数据？",
                "link": "posts/2019/【翻译】在 React Hooks 中如何请求数据？.html",
                "date": "2019/03/25",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端框架",
                    "react",
                    "fetch",
                    "react hooks",
                    "翻译"
                ],
                "excerpt": "通过这个教程，我想告诉你在 React 中如何使用 state 和 effect 这两种 hooks 去请求数据。我们将使用总所周知的 Hacker News API 来获取一些热门文章。你将定义属于你自己的数据请求的 Hooks ，并且可以在你所有的应用中复用，...",
                "cover": "https://file.shenfq.com/Fp4SkemaUMnmloPIN3eWDZ9o6qZd.png"
            },
            {
                "pagePath": "posts/2019/深度神经网络原理与实践.md",
                "title": "深度神经网络原理与实践",
                "link": "posts/2019/深度神经网络原理与实践.html",
                "date": "2019/03/17",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "机器学习"
                ],
                "tags": [
                    "机器学习",
                    "深度学习",
                    "神经网络"
                ],
                "excerpt": "理论基础 什么是神经网络 我们知道深度学习是机器学习的一个分支，是一种以人工神经网络为架构，对数据进行表征学习的算法。而深度神经网络又是深度学习的一个分支，它在 wikipedia 上的解释如下： 首先我们可以知道，深度神经...",
                "cover": "https://file.shenfq.com/Fjw7fiWg-n1qXji4aX9DUz10Nrqa.png"
            },
            {
                "pagePath": "posts/2019/工作两年的迷茫.md",
                "title": "工作两年的迷茫",
                "link": "posts/2019/工作两年的迷茫.html",
                "date": "2019/02/20",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "随便写写"
                ],
                "tags": [
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "2019年着实是迷茫的一年，各大公司传来了裁员消息，再加上前段时间部门业务调整，工作开始有些闲置，调整完后，现在的业务方向与自己期望的有些偏差。工作近两年，照理来说应该还是个职场新手，却有种已经工作四五年的感觉，突..."
            },
            {
                "pagePath": "posts/2019/推荐系统入门.md",
                "title": "推荐系统入门",
                "link": "posts/2019/推荐系统入门.html",
                "date": "2019/01/30",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "机器学习"
                ],
                "tags": [
                    "机器学习",
                    "推荐系统",
                    "算法",
                    "数学"
                ],
                "excerpt": "什么是推荐系统 维基百科定义如下： 首先推荐系统是一个过滤系统，这里对“物品”的定义很宽泛，物品可以是人、消费品、服务、信息等等，不同的业务场景的“物品”是不同的。 e.g. - 电商业务（淘宝、京东）的推荐系统中物品指...",
                "cover": "https://file.shenfq.com/FscTeCfJB7rKcLbcWjC3KMh-_b6R.png"
            },
            {
                "pagePath": "posts/2019/梯度下降与线性回归.md",
                "title": "梯度下降与线性回归",
                "link": "posts/2019/梯度下降与线性回归.html",
                "date": "2019/01/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "机器学习"
                ],
                "tags": [
                    "机器学习",
                    "算法",
                    "数学"
                ],
                "excerpt": "基本概念 梯度下降法是机器学习中最常用的优化方法之一，主要作用是求解目标函数的极小值。基本原理就是让目标函数沿着某个方向去搜索极小值，而这个方向就是梯度下降的方向，如果搜索极大值，就是沿着梯度上升方向。 什么是梯...",
                "cover": "https://file.shenfq.com/19-01-28/1.png"
            },
            {
                "pagePath": "posts/2019/2018年终总结.md",
                "title": "2018年终总结",
                "link": "posts/2019/2018年终总结.html",
                "date": "2019/01/09",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "年终总结"
                ],
                "tags": [
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "总觉得2018年过得非常快，快到以为现在还是2018，写日期的时候才反应过来现在已经到了2019。2018对我来说是圆满的一年，入职鹅厂，认识晴子，一切都显得那幸运。 工作经历 2018年算是迈入工作的的第二个年头，一月份刚好有个鹅...",
                "cover": "https://file.shenfq.com/19-01-09/25450020.jpg"
            },
            {
                "pagePath": "posts/2018/Node.js的进程管理.md",
                "title": "Node.js的进程管理",
                "link": "posts/2018/Node.js的进程管理.html",
                "date": "2018/12/28",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "前端",
                    "Node",
                    "多进程",
                    "cluster",
                    "负载均衡"
                ],
                "excerpt": "众所周知Node基于V8，而在V8中JavaScript是单线程运行的，这里的单线程不是指Node启动的时候就只有一个线程，而是说运行JavaScript代码是在单线程上，Node还有其他线程，比如进行异步IO操作的IO线程。这种单线程模型带来的好处...",
                "cover": "https://file.shenfq.com/19-1-9/37414156.jpg"
            },
            {
                "pagePath": "posts/2018/koa-router源码解析.md",
                "title": "koa-router源码解析",
                "link": "posts/2018/koa-router源码解析.html",
                "date": "2018/12/07",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "Node",
                    "Koa",
                    "router",
                    "路由"
                ],
                "excerpt": "koa-router koa-router应该是最常使用的koa的路由库，其源码比较简单，而且有十分详细的注释与使用案例。使用方式也比tj大神的koa-route要简洁。 如何使用koa-router 按照惯例，先看看koa-router的使用方法。 var Koa = requir...",
                "cover": "https://file.shenfq.com/18-12-19/41366075.jpg"
            },
            {
                "pagePath": "posts/2018/koa2源码解析.md",
                "title": "koa2源码解析",
                "link": "posts/2018/koa2源码解析.html",
                "date": "2018/11/27",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "Node",
                    "Koa",
                    "中间件"
                ],
                "excerpt": "如何使用koa 在看koa2的源码之前，按照惯例先看看koa2的hello world的写法。 const Koa = require('koa'); const app = new Koa(); // response app.use(ctx => { ctx.body = 'Hello Koa'; }); app.listen(3000); 一开始就通过...",
                "cover": "https://file.shenfq.com/18-12-19/81578504.jpg"
            },
            {
                "pagePath": "posts/2018/前端业务组件化实践.md",
                "title": "前端业务组件化实践",
                "link": "posts/2018/前端业务组件化实践.html",
                "date": "2018/10/23",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端",
                    "组件化"
                ],
                "excerpt": "最近一直在做管理端相关的需求，管理端不比h5每天都有高流量，需要不断地做性能上的优化，以及适配不同设备兼容性。但是管理端也面临着自己的挑战，因为项目越来越大，可配置化的东西就越来越多，管理端的页面也就越多，同时面...",
                "cover": "https://file.shenfq.com/18-12-19/84472576.jpg"
            },
            {
                "pagePath": "posts/2018/ElementUI的构建流程.md",
                "title": "ElementUI的构建流程",
                "link": "posts/2018/ElementUI的构建流程.html",
                "date": "2018/09/17",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端",
                    "组件化",
                    "工程化"
                ],
                "excerpt": "背景 最近一直在着手做一个与业务强相关的组件库，一直在思考要从哪里下手，怎么来设计这个组件库，因为业务上一直在使用ElementUI（以下简称Element），于是想参考了一下Element组件库的设计，看看Element构建方式，并且总结成...",
                "cover": "https://file.shenfq.com/18-9-14/48784910.jpg"
            },
            {
                "pagePath": "posts/2018/seajs源码解读.md",
                "title": "seajs源码解读",
                "link": "posts/2018/seajs源码解读.html",
                "date": "2018/08/15",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "模块化",
                    "前端",
                    "前端工程化"
                ],
                "excerpt": "近几年前端工程化越来越完善，打包工具也已经是前端标配了，像seajs这种老古董早已停止维护，而且使用的人估计也几个了。但这并不能阻止好奇的我，为了了解当年的前端前辈们是如何在浏览器进行代码模块化的，我鼓起勇气翻开了S...",
                "cover": "https://file.shenfq.com/18-8-13/86590747.jpg"
            },
            {
                "pagePath": "posts/2018/使用ESLint+Prettier来统一前端代码风格.md",
                "title": "使用ESLint+Prettier来统一前端代码风格",
                "link": "posts/2018/使用ESLint+Prettier来统一前端代码风格.html",
                "date": "2018/06/18",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "前端",
                    "代码格式化",
                    "ESLint"
                ],
                "excerpt": "正文之前，先看个段子放松一下： 去死吧！你这个异教徒！ 想起自己刚入行的时候，从svn上把代码checkout下来，看到同事写的代码，大括号居然换行了。心中暗骂，这个人是不是个**，大括号为什么要换行？年轻气盛的我，居然满腔怒...",
                "cover": "https://file.shenfq.com/18-6-18/90739745.jpg"
            },
            {
                "pagePath": "posts/2018/webpack4初探.md",
                "title": "webpack4初探",
                "link": "posts/2018/webpack4初探.html",
                "date": "2018/06/09",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "前端",
                    "模块化",
                    "前端工程化",
                    "webpack"
                ],
                "excerpt": "一、前言 2018/2/25，webpack4正式发布，距离现在已经过去三个多月了，也逐渐趋于稳定，而且现在的最新版本都到了4.12.0（版本迭代快得真是让人害怕）。 很多人都说webpack复杂，难以理解，很大一部分原因是webpack是基于配置的...",
                "cover": "//file.shenfq.com/18-6-9/66027398.jpg"
            },
            {
                "pagePath": "posts/2018/git快速入门.md",
                "title": "git快速入门",
                "link": "posts/2018/git快速入门.html",
                "date": "2018/04/17",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Git"
                ],
                "tags": [
                    "git",
                    "版本管理"
                ],
                "excerpt": "背景 git作为现在最为流行的版本管理系统，大部分公司都使用git进行版本控制， 并且最大同性交友网站github也是在git的基础上建立的。 很多人认为git难，在于它的一些概念与之前流行的集中化的版本管理系统有所出入， 只要通过...",
                "cover": "//file.shenfq.com/18-4-14/34749597.jpg"
            },
            {
                "pagePath": "posts/2018/RequireJS源码分析（下）.md",
                "title": "RequireJS源码分析（下）",
                "link": "posts/2018/RequireJS源码分析（下）.html",
                "date": "2018/02/25",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "模块化",
                    "前端",
                    "前端工程化"
                ],
                "excerpt": "这篇文章主要会讲述模块加载操作的主要流程，以及Module的主要功能。废话不多说，直接看代码吧。 模块加载使用方法： require.config({ paths: { jquery: 'https://cdn.bootcss.com/jquery/3.2.1/jquery' } }); require(['jque..."
            },
            {
                "pagePath": "posts/2018/2017年终总结.md",
                "title": "2017年终总结",
                "link": "posts/2018/2017年终总结.html",
                "date": "2018/01/07",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "年终总结"
                ],
                "tags": [
                    "生活",
                    "工作",
                    "感悟",
                    "总结"
                ],
                "excerpt": "想想日子过得也快，2017年算是自己正式参加工作的一年。而且也是今年毕业，正式踏入社会。 17年2月来深圳找实习工作，碰壁也蛮多次，得到的结果都是基础很好，但是没经验，我们不要实习生，还有这简历不匹配工作年限直接就被刷..."
            },
            {
                "pagePath": "posts/2017/RequireJS源码分析（上）.md",
                "title": "RequireJS源码分析（上）",
                "link": "posts/2017/RequireJS源码分析（上）.html",
                "date": "2017/12/23",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "模块化",
                    "前端",
                    "前端工程化"
                ],
                "excerpt": "requirejs作为AMD（Asynchronous Module Definition--异步的模块加载机制）规范的实现，还是有必要看看的。初识requirejs源码，必须先弄清楚requirejs的模块是如何定义的，并且要知道入口在哪个地方，如果清楚了调用方式，看源...",
                "cover": "//file.shenfq.com/17-11-19/90660695.jpg"
            },
            {
                "pagePath": "posts/2017/ES6模块.md",
                "title": "【翻译】深入ES6模块",
                "link": "posts/2017/ES6模块.html",
                "date": "2017/11/13",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "模块化"
                ],
                "tags": [
                    "es6",
                    "模块化",
                    "前端"
                ],
                "excerpt": "回想2007年，那时候我刚加入Mozilla's JavaScript团队，那时候的一个典型的JavaScript程序只需要一行代码，听起来像个笑话。 两年后，Google Maps发布。在这之前，JavaScript主要用来做表单的验证，你用来处理<input onchange=..."
            },
            {
                "pagePath": "posts/2017/babel到底该如何配置？.md",
                "title": "babel到底该如何配置？",
                "link": "posts/2017/babel到底该如何配置？.html",
                "date": "2017/10/22",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "es6",
                    "babel",
                    "前端"
                ],
                "excerpt": "背景 说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的官网是这样介绍它的： 大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对js语法的支持不尽相...",
                "cover": "//file.shenfq.com/17-10-16/10463136.jpg"
            },
            {
                "pagePath": "posts/2017/JavaScript中this关键字.md",
                "title": "JavaScript中this关键字",
                "link": "posts/2017/JavaScript中this关键字.html",
                "date": "2017/10/12",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端"
                ],
                "tags": [
                    "js基础",
                    "this",
                    "前端"
                ],
                "excerpt": "this一直是js中一个老生常谈的东西，但是我们究竟该如何来理解它呢？ 在《JavaScript高级程序设计》中，对this的解释是： 我们来逐字解读这句话： - this是一个对象 - this的产生与函数有关 - this与执行环境绑定 说通俗一点就...",
                "cover": "//file.shenfq.com/17-10-12/25450020.jpg"
            },
            {
                "pagePath": "posts/2017/linux下升级npm以及node.md",
                "title": "linux下升级npm以及node",
                "link": "posts/2017/linux下升级npm以及node.html",
                "date": "2017/06/12",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "Node.js"
                ],
                "tags": [
                    "linux",
                    "node",
                    "npm",
                    "前端"
                ],
                "excerpt": "npm升级 废话不多说，直接讲步骤。先从容易的开始，升级npm。 npm这款包管理工具虽然一直被人们诟病，很多人都推荐使用yarn，但其使用人数还是不见减少，况且npm都是随node同时安装好的，一时让我抛弃它，还是有点难做到。 npm..."
            },
            {
                "pagePath": "posts/2017/Gulp入门指南.md",
                "title": "Gulp入门指南",
                "link": "posts/2017/Gulp入门指南.html",
                "date": "2017/05/24",
                "updated": null,
                "author": "shenfq",
                "contributors": [
                    "Shenfq"
                ],
                "categories": [
                    "前端工程"
                ],
                "tags": [
                    "gulp",
                    "前端构建工具",
                    "前端"
                ],
                "excerpt": "为什么要写这篇博客？ 谈起为什么，其实就是想总结下这段时间做的工作。之前一直在用gulp，但是一直没有自己的思考，下了两个插件就开始了。这一次为公司的项目配置了一次gulp，尽可能多的考虑到了一些情况，比如本地开发调试时..."
            }
        ],
        "categories": [
            {
                "name": "前端",
                "count": 34
            },
            {
                "name": "Go",
                "count": 8
            },
            {
                "name": "Node.js",
                "count": 8
            },
            {
                "name": "前端工程",
                "count": 8
            },
            {
                "name": "模块化",
                "count": 6
            },
            {
                "name": "年终总结",
                "count": 5
            },
            {
                "name": "随便写写",
                "count": 4
            },
            {
                "name": "机器学习",
                "count": 3
            },
            {
                "name": "微信小程序",
                "count": 2
            },
            {
                "name": "Git",
                "count": 1
            },
            {
                "name": "Promise",
                "count": 1
            },
            {
                "name": "VSCode",
                "count": 1
            },
            {
                "name": "其他",
                "count": 1
            },
            {
                "name": "读后感",
                "count": 1
            }
        ],
        "tags": [
            {
                "name": "前端",
                "count": 26
            },
            {
                "name": "JavaScript",
                "count": 14
            },
            {
                "name": "前端框架",
                "count": 13
            },
            {
                "name": "前端工程化",
                "count": 11
            },
            {
                "name": "模块化",
                "count": 10
            },
            {
                "name": "Go",
                "count": 8
            },
            {
                "name": "React",
                "count": 8
            },
            {
                "name": "工作",
                "count": 8
            },
            {
                "name": "感悟",
                "count": 8
            },
            {
                "name": "Node",
                "count": 7
            },
            {
                "name": "Vue.js",
                "count": 7
            },
            {
                "name": "总结",
                "count": 7
            },
            {
                "name": "翻译",
                "count": 5
            },
            {
                "name": "Promise",
                "count": 4
            },
            {
                "name": "webpack",
                "count": 3
            },
            {
                "name": "机器学习",
                "count": 3
            },
            {
                "name": "组件化",
                "count": 3
            },
            {
                "name": "编译",
                "count": 3
            },
            {
                "name": "CommonJS",
                "count": 2
            },
            {
                "name": "Components",
                "count": 2
            },
            {
                "name": "CSS",
                "count": 2
            },
            {
                "name": "es6",
                "count": 2
            },
            {
                "name": "ESLint",
                "count": 2
            },
            {
                "name": "fetch",
                "count": 2
            },
            {
                "name": "Koa",
                "count": 2
            },
            {
                "name": "react",
                "count": 2
            },
            {
                "name": "router",
                "count": 2
            },
            {
                "name": "Web Components",
                "count": 2
            },
            {
                "name": "代码格式化",
                "count": 2
            },
            {
                "name": "前端模块化",
                "count": 2
            },
            {
                "name": "小程序",
                "count": 2
            },
            {
                "name": "工程化",
                "count": 2
            },
            {
                "name": "微信小程序",
                "count": 2
            },
            {
                "name": "性能",
                "count": 2
            },
            {
                "name": "数学",
                "count": 2
            },
            {
                "name": "模板",
                "count": 2
            },
            {
                "name": "状态管理",
                "count": 2
            },
            {
                "name": "算法",
                "count": 2
            },
            {
                "name": "路由",
                "count": 2
            },
            {
                "name": "随便写写",
                "count": 2
            },
            {
                "name": "AMD",
                "count": 1
            },
            {
                "name": "async/await",
                "count": 1
            },
            {
                "name": "axios",
                "count": 1
            },
            {
                "name": "babel",
                "count": 1
            },
            {
                "name": "Babel",
                "count": 1
            },
            {
                "name": "Buffer",
                "count": 1
            },
            {
                "name": "cluster",
                "count": 1
            },
            {
                "name": "CMD",
                "count": 1
            },
            {
                "name": "ES Module",
                "count": 1
            },
            {
                "name": "fastify",
                "count": 1
            },
            {
                "name": "Generator",
                "count": 1
            },
            {
                "name": "git",
                "count": 1
            },
            {
                "name": "GitHub",
                "count": 1
            },
            {
                "name": "GTD",
                "count": 1
            },
            {
                "name": "gulp",
                "count": 1
            },
            {
                "name": "JSON",
                "count": 1
            },
            {
                "name": "js基础",
                "count": 1
            },
            {
                "name": "LFU",
                "count": 1
            },
            {
                "name": "linux",
                "count": 1
            },
            {
                "name": "LRU",
                "count": 1
            },
            {
                "name": "MobX",
                "count": 1
            },
            {
                "name": "node",
                "count": 1
            },
            {
                "name": "Node.js",
                "count": 1
            },
            {
                "name": "npm",
                "count": 1
            },
            {
                "name": "offer",
                "count": 1
            },
            {
                "name": "Pinia",
                "count": 1
            },
            {
                "name": "Postion",
                "count": 1
            },
            {
                "name": "Pull Request",
                "count": 1
            },
            {
                "name": "react hooks",
                "count": 1
            },
            {
                "name": "request",
                "count": 1
            },
            {
                "name": "Rust",
                "count": 1
            },
            {
                "name": "Snabbdom",
                "count": 1
            },
            {
                "name": "Sticky",
                "count": 1
            },
            {
                "name": "Stream",
                "count": 1
            },
            {
                "name": "sudoku",
                "count": 1
            },
            {
                "name": "this",
                "count": 1
            },
            {
                "name": "TypeScript",
                "count": 1
            },
            {
                "name": "undici",
                "count": 1
            },
            {
                "name": "USB",
                "count": 1
            },
            {
                "name": "Util",
                "count": 1
            },
            {
                "name": "virtual dom",
                "count": 1
            },
            {
                "name": "VSCode",
                "count": 1
            },
            {
                "name": "Vue3",
                "count": 1
            },
            {
                "name": "Webpack",
                "count": 1
            },
            {
                "name": "中间件",
                "count": 1
            },
            {
                "name": "二线",
                "count": 1
            },
            {
                "name": "二进制",
                "count": 1
            },
            {
                "name": "依赖分析",
                "count": 1
            },
            {
                "name": "函数",
                "count": 1
            },
            {
                "name": "前端工具",
                "count": 1
            },
            {
                "name": "前端思考",
                "count": 1
            },
            {
                "name": "前端构建工具",
                "count": 1
            },
            {
                "name": "反射机制",
                "count": 1
            },
            {
                "name": "变量",
                "count": 1
            },
            {
                "name": "命令行",
                "count": 1
            },
            {
                "name": "多进程",
                "count": 1
            },
            {
                "name": "常量",
                "count": 1
            },
            {
                "name": "并发",
                "count": 1
            },
            {
                "name": "指针",
                "count": 1
            },
            {
                "name": "推荐系统",
                "count": 1
            },
            {
                "name": "提醒事项",
                "count": 1
            },
            {
                "name": "数组",
                "count": 1
            },
            {
                "name": "方法论",
                "count": 1
            },
            {
                "name": "样式",
                "count": 1
            },
            {
                "name": "模板引擎",
                "count": 1
            },
            {
                "name": "泛型",
                "count": 1
            },
            {
                "name": "消费主义",
                "count": 1
            },
            {
                "name": "深度学习",
                "count": 1
            },
            {
                "name": "滴答清单",
                "count": 1
            },
            {
                "name": "版本管理",
                "count": 1
            },
            {
                "name": "理性消费",
                "count": 1
            },
            {
                "name": "生活",
                "count": 1
            },
            {
                "name": "神经网络",
                "count": 1
            },
            {
                "name": "类型系统",
                "count": 1
            },
            {
                "name": "组件",
                "count": 1
            },
            {
                "name": "结构体",
                "count": 1
            },
            {
                "name": "缓存",
                "count": 1
            },
            {
                "name": "置业",
                "count": 1
            },
            {
                "name": "自动化测试",
                "count": 1
            },
            {
                "name": "虚拟 DOM",
                "count": 1
            },
            {
                "name": "虚拟DOM",
                "count": 1
            },
            {
                "name": "读后感",
                "count": 1
            },
            {
                "name": "负载均衡",
                "count": 1
            },
            {
                "name": "错误处理",
                "count": 1
            },
            {
                "name": "长沙",
                "count": 1
            },
            {
                "name": "面试",
                "count": 1
            }
        ]
    }
};
