import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2017/babel到底该如何配置？.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2017/babel到底该如何配置？.html",
    'title': "babel到底该如何配置？",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>babel到底该如何配置？</h1>\n<h4 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h4>\n<p>说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的<a href="http://babeljs.io/">官网</a>是这样介绍它的：</p>\n<blockquote>\n<p>Babel is a JavaScript compiler.</p>\n</blockquote>\n<blockquote>\n<p>Use next generation JavaScript, today.</p>\n</blockquote>\n<p>大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对js语法的支持不尽相同，特别是ES6之后，ECMAScrip对版本的更新已经到了一年一次的节奏，虽然每年更新的幅度不大，但是每年的提案可不少。babel的出现就是为了解决这个问题，把那些使用新标准编写的代码转译为当前环境可运行的代码，简单点说就是把ES6代码转译（转码+编译）到ES5。</p>\n<p>经常有人在使用babel的时候并没有弄懂babel是干嘛的，只知道要写ES6就要在webpack中引入一个babel-loader，然后胡乱在网上copy一个.babelrc到项目目录就开始了（ps: 其实我说的是我自己）。理解babel的配置很重要，可以避免一些不必要的坑，比如：代码中使用Object.assign在一些低版本浏览器会报错，以为是webpack打包时出现了什么问题，其实是babel的配置问题。</p>\n<!-- more -->\n<hr>\n<h4 id="es6">ES6<a class="anchor" href="#es6">§</a></h4>\n<p>正文之前先谈谈ES6，ES即<strong>ECMAScript</strong>，6表示第六个版本(也被称为是ES2015，因为是2015年发布的)，它是javascript的实现标准。</p>\n<p>被纳入到ES标准的语法必须要经过如下五个阶段:</p>\n<ol>\n<li>Stage 0: strawman</li>\n<li>Stage 1: proposal</li>\n<li>Stage 2: draft   -   必须包含<strong>2个实验性的具体实现</strong>，其中一个可以是用转译器实现的，例如Babel。</li>\n<li>Stage 3: candidate  -  至少要有<strong>2个符合规范的具体实现</strong>。</li>\n<li>Stage 4: finished</li>\n</ol>\n<p>可以看到提案在进入stage3阶段时就已经在一些环境被实现，在stage2阶段有babel的实现。所以被纳入到ES标准的语法其实在大部分环境都已经是有了实现的，那么为什么还要用babel来进行转译，因为不能确保每个运行代码的环境都是最新版本并已经实现了规范。</p>\n<p>更多关于ES6的内容可以参考hax的live:<a href="https://www.zhihu.com/lives/883307634416054272?utm_source=qq&amp;utm_medium=social">Hax：如何学习和实践ES201X？</a></p>\n<hr>\n<h4 id="babel%E7%9A%84%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4">Babel的版本变更<a class="anchor" href="#babel%E7%9A%84%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4">§</a></h4>\n<p>写这篇文章时babel版本已经到了<a href="https://github.com/babel/babel/releases/tag/v7.0.0-beta.3">v7.0.0-beta.3</a>,也就是说7.0的正式版就要发布了，可喜可贺。但是今天不谈7.0，只谈babel6，在我知道并开始使用的babel的时候babel已经到了版本6，没有经历过5的时代。</p>\n<p>在babel5的时代，babel属于全家桶型，只要安装babel就会安装babel相关的所有工具，\n即装即用。</p>\n<p>但是到了babel6，具体有以下几点变更：</p>\n<ul>\n<li>移除babel全家桶安装，拆分为单独模块，例如：babel-core、babel-cli、babel-node、babel-polyfill等；\n可以在babel的github仓库看到babel现在有哪些模块。\n<img src="//file.shenfq.com/17-10-16/10463136.jpg" alt="babel-package"></li>\n<li>新增 .babelrc 配置文件，基本上所有的babel转译都会来读取这个配置；</li>\n<li>新增 plugin 配置，所有的东西都插件化，什么代码要转译都能在插件中自由配置；</li>\n<li>新增 preset 配置，babel5会默认转译ES6和jsx语法，babel6转译的语法都要在perset中配置，preset简单说就是一系列plugin包的使用。</li>\n</ul>\n<hr>\n<h4 id="babel%E5%90%84%E4%B8%AA%E6%A8%A1%E5%9D%97%E4%BB%8B%E7%BB%8D">babel各个模块介绍<a class="anchor" href="#babel%E5%90%84%E4%B8%AA%E6%A8%A1%E5%9D%97%E4%BB%8B%E7%BB%8D">§</a></h4>\n<p>babel6将babel全家桶拆分成了许多不同的模块，只有知道这些模块怎么用才能更好的理解babel。</p>\n<p>下面的一些示例代码已经上传到了<a href="https://github.com/Shenfq/studyBabel">github</a>，欢迎访问，欢迎star。</p>\n<p>安装方式：</p>\n<pre class="language-shell"><code class="language-shell"><span class="token comment">#通过npm安装</span>\n<span class="token function">npm</span> <span class="token function">install</span> babel-core babel-cli babel-node\n\n<span class="token comment">#通过yarn安装</span>\n<span class="token function">yarn</span> <span class="token function">add</span> babel-core babel-cli babel-node\n</code></pre>\n<h5 id="1babel-core">1、<a href="http://babeljs.io/docs/usage/api/">babel-core</a><a class="anchor" href="#1babel-core">§</a></h5>\n<p>看名字就知道，babel-core是作为babel的核心存在，babel的核心api都在这个模块里面，比如：transform。</p>\n<p>下面介绍几个babel-core中的api</p>\n<ul>\n<li>babel.transform：用于字符串转码得到AST</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/*\n * @param {string} code 要转译的代码字符串\n * @param {object} options 可选，配置项\n * @return {object} \n*/</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>code<span class="token operator">:</span> string<span class="token punctuation">,</span> options<span class="token operator">?</span><span class="token operator">:</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">)</span>\n    \n<span class="token comment">//返回一个对象(主要包括三个部分)：</span>\n<span class="token punctuation">{</span>\n    generated code<span class="token punctuation">,</span> <span class="token comment">//生成码</span>\n    sources map<span class="token punctuation">,</span> <span class="token comment">//源映射</span>\n    <span class="token constant">AST</span>  <span class="token comment">//即abstract syntax tree，抽象语法树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>更多关于AST知识点请看<a href="https://www.zhihu.com/question/20346372">这里</a>。</p>\n<p>一些使用babel插件的打包或构建工具都有使用到这个方法，下面是一些引入babel插件中的源码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//gulp-babel</span>\n<span class="token keyword">const</span> babel <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-core\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\nmodule<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">opts</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    opts <span class="token operator">=</span> opts <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> through<span class="token punctuation">.</span><span class="token method function property-access">obj</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">file<span class="token punctuation">,</span> enc<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n            <span class="token keyword">const</span> fileOpts <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> opts<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n              filename<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">path</span><span class="token punctuation">,</span>\n              filenameRelative<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span><span class="token punctuation">,</span>\n              sourceMap<span class="token operator">:</span> <span class="token known-class-name class-name">Boolean</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">sourceMap</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n              sourceFileName<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span><span class="token punctuation">,</span>\n              sourceMapTarget<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">const</span> res <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">contents</span><span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> fileOpts<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>res <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              <span class="token comment">//some codes</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">//some codes</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//babel-loader</span>\n<span class="token keyword">var</span> babel <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-core"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\n<span class="token keyword">var</span> <span class="token function-variable function">transpile</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">transpile</span><span class="token punctuation">(</span><span class="token parameter">source<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//some code</span>\n    <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n        result <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">//some codes</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">//some codes</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//rollup-pugin-babel</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> buildExternalHelpers<span class="token punctuation">,</span> transform <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'babel-core\'</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">function</span> <span class="token function">babel</span> <span class="token punctuation">(</span> <span class="token parameter">options</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//some codes</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        <span class="token comment">// some methods</span>\n        <span class="token function">transform</span> <span class="token punctuation">(</span> <span class="token parameter">code<span class="token punctuation">,</span> id</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">const</span> transformed <span class="token operator">=</span> <span class="token function">transform</span><span class="token punctuation">(</span> code<span class="token punctuation">,</span> localOpts <span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token comment">//some codes</span>\n            <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n              code<span class="token operator">:</span> transformed<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token punctuation">,</span>\n              map<span class="token operator">:</span> transformed<span class="token punctuation">.</span><span class="token property-access">map</span>\n            <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面是一些打包工具引入babel插件时的一些源码，可以看到基本都是先通过调用transform方法进行代码转码。</p>\n<ul>\n<li>babel.transformFile</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//异步的文件转码方式，回调函数中的result与transform返回的对象一至。</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transformFile</span><span class="token punctuation">(</span><span class="token string">"filename.js"</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> result</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  result<span class="token punctuation">;</span> <span class="token comment">// => { code, map, ast }</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<ul>\n<li>babel.transformFileSync</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//同步的文件转码方式，返回结果与transform返回的对象一至。</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transformFileSync</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> options<span class="token punctuation">)</span> <span class="token comment">// => { code, map, ast }</span>\n</code></pre>\n<ul>\n<li>babel.transformFromAst</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//将ast进行转译</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> code<span class="token punctuation">,</span> map<span class="token punctuation">,</span> ast <span class="token punctuation">}</span> <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transformFromAst</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> code<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h5 id="2babel-cli">2、<a href="http://babeljs.io/docs/usage/cli/">babel-cli</a><a class="anchor" href="#2babel-cli">§</a></h5>\n<p>babel-cli是一个通过命令行对js文件进行换码的工具。</p>\n<p>使用方法：</p>\n<ul>\n<li>直接在命令行输出转译后的代码<pre class="language-shell"><code class="language-shell">babel script.js\n</code></pre>\n</li>\n<li>指定输出文件<pre class="language-shell"><code class="language-shell">babel script.js --out-file build.js\n或者是\nbabel script.js -o build.js\n</code></pre>\n</li>\n</ul>\n<p>让我们来编写了一个具有箭头函数的代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//script.js</span>\n<span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> item <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>然后在命令行执行 babel script.js，发现输出的代码好像没有转译。</p>\n<p><img src="//file.shenfq.com/17-10-16/1390829.jpg" alt="babel转译"></p>\n<p>因为我们没有告诉babel要转译哪些类型，现在看看怎么指定转译代码中的箭头函数。</p>\n<pre class="language-shell"><code class="language-shell">babel --plugins transform-es2015-arrow-functions script.js\n</code></pre>\n<p><img src="//file.shenfq.com/17-10-16/38822081.jpg" alt="转译箭头函数"></p>\n<p>或者在目录里添加一个.babelrc文件，内容如下：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n    <span class="token property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"transform-es2015-arrow-functions"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>.babelrc是babel的全局配置文件，所有的babel操作（包括babel-core、babel-node）基本都会来读取这个配置，后面会详细介绍。</p>\n<h5 id="3babel-node">3、babel-node<a class="anchor" href="#3babel-node">§</a></h5>\n<p>babel-node是随babel-cli一起安装的，只要安装了babel-cli就会自带babel-node。\n在命令行输入babel-node会启动一个REPL（Read-Eval-Print-Loop），这是一个支持ES6的js执行环境。</p>\n<p><img src="//file.shenfq.com/17-10-17/40708997.jpg" alt="测试babel-node"></p>\n<p>其实不用babel-node，直接在node下，只要node版本大于6大部分ES6语法已经支持，况且现在node的版本已经到了8.7.0。</p>\n<p><img src="//file.shenfq.com/17-10-17/67395028.jpg" alt="node环境箭头函数测试"></p>\n<p>babel-node还能直接用来执行js脚本，与直接使用node命令类似，只是会在执行过程中进行babel的转译，并且babel官方不建议在生产环境直接这样使用，因为babel实时编译产生的代码会缓存在内存中，导致内存占用过高，所以我们了解了解就好。</p>\n<pre class="language-shell"><code class="language-shell">babel-node script.js\n</code></pre>\n<h5 id="4babel-register">4、<a href="http://babeljs.io/docs/usage/babel-register/">babel-register</a><a class="anchor" href="#4babel-register">§</a></h5>\n<p>babel-register字面意思能看出来，这是babel的一个注册器，它在底层改写了node的require方法，引入babel-register之后所有require并以.es6, .es, .jsx 和 .js为后缀的模块都会经过babel的转译。</p>\n<p>同样通过箭头函数做个实验：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//test.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'shenfq\'</span><span class="token punctuation">;</span>\nmodule<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> json <span class="token operator">=</span> <span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> json<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token comment">//main.js</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> test <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./test.js\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//test.js中的es6语法将被转译成es5</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>test<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//通过toString方法，看看控制台输出的函数是否被转译</span>\n</code></pre>\n<p><img src="//file.shenfq.com/17-10-17/66788446.jpg" alt="register转译"></p>\n<p>默认babel-register会忽略对node_modules目录下模块的转译，如果要开启可以进行如下配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-register"</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  ignore<span class="token operator">:</span> <span class="token boolean">false</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>babel-register与babel-core会同时安装，在babel-core中会有一个register.js文件，所以引入babel-register有两种方法：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-core/register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是官方不推荐第一种方法，因为babel-register已经独立成了一个模块，在babel-core的register.js文件中有如下注释。</p>\n<blockquote>\n<p>TODO: eventually deprecate this console.trace(&quot;use the <code>babel-register</code> package instead of <code>babel-core/register</code>&quot;);</p>\n</blockquote>\n<h5 id="5babel-polyfill">5、<a href="http://babeljs.io/docs/usage/babel-register/">babel-polyfill</a><a class="anchor" href="#5babel-polyfill">§</a></h5>\n<p>polyfill这个单词翻译成中文是<code>垫片</code>的意思，详细点解释就是桌子的桌脚有一边矮一点，拿一个东西把桌子垫平。polyfill在代码中的作用主要是用已经存在的语法和api实现一些浏览器还没有实现的api，对浏览器的一些缺陷做一些修补。例如Array新增了includes方法，我想使用，但是低版本的浏览器上没有，我就得做兼容处理：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">Array</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">includes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">defineProperty</span><span class="token punctuation">(</span><span class="token class-name">Array</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">,</span> <span class="token string">\'includes\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">value</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">searchElement<span class="token punctuation">,</span> fromIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">\'"this" is null or not defined\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">var</span> o <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">var</span> len <span class="token operator">=</span> o<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">>>></span> <span class="token number">0</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>len <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">var</span> n <span class="token operator">=</span> fromIndex <span class="token operator">|</span> <span class="token number">0</span><span class="token punctuation">;</span>\n      <span class="token keyword">var</span> k <span class="token operator">=</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">max</span><span class="token punctuation">(</span>n <span class="token operator">>=</span> <span class="token number">0</span> <span class="token operator">?</span> n <span class="token operator">:</span> len <span class="token operator">-</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">abs</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>k <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">===</span> searchElement<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        k<span class="token operator">++</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> \n</code></pre>\n<p>上面简单的提供了一个includes方法的polyfill，代码来自<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes">MDN</a>。</p>\n<p>理解polyfill的意思之后，再来说说babel为什么存在polyfill。因为babel的转译只是语法层次的转译，例如箭头函数、解构赋值、class，对一些新增api以及全局函数（例如：Promise）无法进行转译，这个时候就需要在代码中引入babel-polyfill，让代码完美支持ES6+环境。前面介绍的babel-node就会自动在代码中引入babel-polyfill包。</p>\n<p>引入方法：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//在代码的最顶部进行require或者import</span>\n\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-polyfill"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">import</span> <span class="token string">"babel-polyfill"</span><span class="token punctuation">;</span>\n\n<span class="token comment">//如果使用webpack，也可以在文件入口数组引入</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-polyfill"</span><span class="token punctuation">,</span> <span class="token string">"./app/js"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但很多时候我们并不会使用所有ES6+语法，全局添加所有垫片肯定会让我们的代码量上升，之后会介绍其他添加垫片的方式。</p>\n<hr>\n<h4 id="babelrc">.babelrc<a class="anchor" href="#babelrc">§</a></h4>\n<p>前面已经介绍了babel常用的一些模块，接下来看看babel的配置文件 <code>.babelrc</code>。</p>\n<p>后面的后缀rc来自linux中，使用过linux就知道linux中很多rc结尾的文件，比如<code>.bashrc</code>，rc是<code>run command</code>的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。</p>\n<p>babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从<code>package.json</code>文件的babel属性中读取配置。</p>\n<h5 id="plugins">plugins<a class="anchor" href="#plugins">§</a></h5>\n<p>先简单介绍下 plugins ，babel中的插件，通过配置不同的插件才能告诉babel，我们的代码中有哪些是需要转译的。</p>\n<p>这里有一个babel官网的<a href="http://babeljs.io/docs/plugins/">插件列表</a>，里面有目前babel支持的全部插件。</p>\n<p>举个例子：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">,</span> <span class="token comment">//转译箭头函数</span>\n        <span class="token string">"transform-es2015-classes"</span><span class="token punctuation">,</span> <span class="token comment">//转译class语法</span>\n        <span class="token string">"transform-es2015-spread"</span><span class="token punctuation">,</span> <span class="token comment">//转译数组解构</span>\n        <span class="token string">"transform-es2015-for-of"</span> <span class="token comment">//转译for-of</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n<span class="token comment">//如果要为某个插件添加配置项，按如下写法：</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span><span class="token punctuation">[</span>\n        <span class="token comment">//改为数组，第二个元素为配置项</span>\n        <span class="token punctuation">[</span><span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token string">"spec"</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面这些都只是语法层次的转译，前面说过有些api层次的东西需要引入polyfill，同样babel也有一系列插件来支持这些。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span><span class="token punctuation">[</span>\n        <span class="token comment">//如果我们在代码中使用Object.assign方法，就用如下插件</span>\n        <span class="token string">"transform-object-assign"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//写了一个使用Object.assign的代码如下：</span>\n<span class="token keyword">const</span> people <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'shenfq\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//经过babel转译后如下：</span>\n<span class="token keyword">var</span> _extends <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token property-access">assign</span> <span class="token operator">||</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">target</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arguments<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">var</span> source <span class="token operator">=</span> arguments<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> key <span class="token keyword">in</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> target<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> source<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span> <span class="token keyword control-flow">return</span> target<span class="token punctuation">;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> people <span class="token operator">=</span> <span class="token function">_extends</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'shenfq\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这种通过transform添加的polyfill只会引入到当前模块中，试想实际开发中存在多个模块使用同一个api，每个模块都引入相同的polyfill，大量重复的代码出现在项目中，这肯定是一种灾难。另外一个个的引入需要polyfill的transform挺麻烦的，而且不能保证手动引入的transform一定正确，等会会提供一个解决方案：<code>transform-runtime</code>。</p>\n<p>除了添加polyfill，babel还有一个工具包helpers，如果你有安装babel-cli，你可以直接通过下面的命令把这个工具包输出：</p>\n<pre class="language-shell"><code class="language-shell">./node_modules/.bin/babel-external-helpers <span class="token operator">></span> helpers.js\n</code></pre>\n<p>这个工具包类似于babel的utils模块，就像我们项目中的utils一样，很多地方都会用到，例如babel实现Object.assign就是使用的helpers中的_extend方法。为了避免同一个文件多次引用babel的助手函数，通过<code>external-helpers</code>插件，能够把这些助手函数抽出放到文件顶部，避免多次引用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//安装： cnpm install --save-dev babel-plugin-external-helpers</span>\n\n<span class="token comment">//配置</span>\n<span class="token punctuation">{</span>\n  <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"external-helpers"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>虽然这个插件能避免一个文件多次引用助手函数，但是并不能直接避免多个文件内重复引用，这与前面说到的通过transform添加polyfill是一样的问题，这些引用都只是module级别的，在打包工具盛行的今天，需要考虑如何减少多个模块重复引用相同代码造成代码冗余。</p>\n<p>当然也可以在每个需要使用helpers的js文件顶部直接引入之前生成的helpers文件既可，通过打包工具将这个公共模块进行抽离。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'helpers\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在说完babel的helpers之后就到了插件系统的最后的一个插件：<code>transform-runtime</code>。前面在transform-polyfill的时候也有提到这个插件，之所以把它放到helpers后面是因为这个插件能自动为项目引入polyfill和helpers。</p>\n<pre class="language-shell"><code class="language-shell">cnpm <span class="token function">install</span> -D babel-plugin-transform-runtime babel-runtime\n</code></pre>\n<p>transform-runtime这个插件依赖于babel-runtime，所以安装transform-runtime的同时最好也安装babel-runtime，为了防止一些不必要的错误。babel-runtime由三个部分组成：</p>\n<ol>\n<li><a href="https://github.com/zloirock/core-js">core-js</a>\n<blockquote>\n<p>core-js极其强悍，通过ES3实现了大部分的ES5、6、7的垫片，作者zloirock是来自战斗名族的程序员，一个人维护着core-js，听说他最近还在找工作，上面是core-js的github地址，感兴趣可以去看看。</p>\n</blockquote>\n</li>\n<li><a href="http://facebook.github.io/regenerator/">regenerator</a>\n<blockquote>\n<p>regenerator来自facebook的一个库，用于实现 generator functions。</p>\n</blockquote>\n</li>\n<li>helpers\n<blockquote>\n<p>babel的一些工具函数，没错，这个helpers和前面使用babel-external-helpers生成的helpers是同一个东西</p>\n</blockquote>\n</li>\n</ol>\n<p>从babel-runtime的package.json文件中也能看出，runtime依赖了哪些东西。</p>\n<p><img src="//file.shenfq.com/17-10-22/66492657.jpg" alt="babel-runtime的package.json"></p>\n<p>安装有babel-runtime之后要引入helpers可以使用如下方式：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-runtime/helpers\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>使用runtime的时候还有一些配置项：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span><span class="token string">"transform-runtime"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            <span class="token string">"helpers"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//自动引入helpers</span>\n            <span class="token string">"polyfill"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//自动引入polyfill（core-js提供的polyfill）</span>\n            <span class="token string">"regenerator"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//自动引入regenerator</span>\n        <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><strong>比较transform-runtime与babel-polyfill引入垫片的差异：</strong></p>\n<ol>\n<li>使用runtime是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，不需要再手动一个个的去配置plugins，只是引入的polyfill不是全局性的，有些局限性。而且runtime引入的polyfill不会改写一些实例方法，比如Object和Array原型链上的方法，像前面提到的<code>Array.protype.includes</code>。</li>\n<li>babel-polyfill就能解决runtime的那些问题，它的垫片是全局的，而且全能，基本上ES6中要用到的polyfill在babel-polyfill中都有，它提供了一个完整的ES6+的环境。babel官方建议只要不在意babel-polyfill的体积，最好进行全局引入，因为这是最稳妥的方式。</li>\n<li>一般的建议是开发一些框架或者库的时候使用不会污染全局作用域的babel-runtime，而开发web应用的时候可以全局引入babel-polyfill避免一些不必要的错误，而且大型web应用中全局引入babel-polyfill可能还会减少你打包后的文件体积（相比起各个模块引入重复的polyfill来说）。</li>\n</ol>\n<hr>\n<h5 id="presets">presets<a class="anchor" href="#presets">§</a></h5>\n<p>显然这样一个一个配置插件会非常的麻烦，为了方便，babel为我们提供了一个配置项叫做persets（预设）。</p>\n<p>预设就是一系列插件的集合，就好像修图一样，把上次修图的一些参数保存为一个预设，下次就能直接使用。</p>\n<p>如果要转译ES6语法，只要按如下方式配置即可：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//先安装ES6相关preset： cnpm install -D babel-preset-es2015</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"es2015"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//如果要转译的语法不止ES6，还有各个提案阶段的语法也想体验，可以按如下方式。</span>\n<span class="token comment">//安装需要的preset： cnpm install -D babel-preset-stage-0 babel-preset-stage-1 babel-preset-stage-2 babel-preset-stage-3</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"es2015"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-0"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-1"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-2"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-3"</span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//同样babel也能直接转译jsx语法，通过引入react的预设</span>\n<span class="token comment">//cnpm install -D babel-preset-react</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"es2015"</span><span class="token punctuation">,</span>\n        <span class="token string">"react"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>不过上面这些preset官方现在都已经不推荐了，官方<strong>唯一推荐</strong>preset：<code>babel-preset-env</code>。</p>\n<p>这款preset能灵活决定加载哪些插件和polyfill，不过还是得开发者手动进行一些配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// cnpm install -D babel-preset -env</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span><span class="token string">"env"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            <span class="token string">"targets"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">//指定要转译到哪个环境</span>\n                <span class="token comment">//浏览器环境</span>\n                <span class="token string">"browsers"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"last 2 versions"</span><span class="token punctuation">,</span> <span class="token string">"safari >= 7"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n                <span class="token comment">//node环境</span>\n                <span class="token string">"node"</span><span class="token operator">:</span> <span class="token string">"6.10"</span><span class="token punctuation">,</span> <span class="token comment">//"current"  使用当前版本的node</span>\n                \n            <span class="token punctuation">}</span><span class="token punctuation">,</span>\n             <span class="token comment">//是否将ES6的模块化语法转译成其他类型</span>\n             <span class="token comment">//参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为\'commonjs\'</span>\n            <span class="token string">"modules"</span><span class="token operator">:</span> <span class="token string">\'commonjs\'</span><span class="token punctuation">,</span>\n            <span class="token comment">//是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本</span>\n            <span class="token string">"debug"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n            <span class="token comment">//强制开启某些模块，默认为[]</span>\n            <span class="token string">"include"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n            <span class="token comment">//禁用某些模块，默认为[]</span>\n            <span class="token string">"exclude"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"transform-es2015-for-of"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n            <span class="token comment">//是否自动引入polyfill，开启此选项必须保证已经安装了babel-polyfill</span>\n            <span class="token comment">//参数：Boolean，默认为false.</span>\n            <span class="token string">"useBuiltIns"</span><span class="token operator">:</span> <span class="token boolean">false</span>\n        <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>关于最后一个参数<code>useBuiltIns</code>，有两点必须要注意：</p>\n<ol>\n<li>如果useBuiltIns为true，项目中必须引入babel-polyfill。</li>\n<li>babel-polyfill只能被引入一次，如果多次引入会造成全局作用域的冲突。</li>\n</ol>\n<p>做了个实验，同样的代码，只是<code>.babelrc</code>配置中一个开启了<code>useBuiltIns</code>，一个没有，两个js文件体积相差70K，<a href="https://github.com/Shenfq/studyBabel/tree/master/7-babel-env">戳我看看</a>。</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th>文件</th>\n<th>大小</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>useBuiltIns.js</td>\n<td>189kb</td>\n</tr>\n<tr>\n<td>notUseBuiltIns.js</td>\n<td>259kb</td>\n</tr>\n</tbody>\n</table></div>\n<p><strong>最后啰嗦一句</strong></p>\n<p>关于polyfill还有个叫做<a href="https://polyfill.io/v2/docs/">polyfill.io</a>的神器，只要在浏览器引入</p>\n<blockquote>\n<p><a href="https://cdn.polyfill.io/v2/polyfill.js">https://cdn.polyfill.io/v2/polyfill.js</a></p>\n</blockquote>\n<p>服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。</p>\n<hr>\n<p>前前后后写完这个差不多写了一个星期，查了很多资料（babel的官网和github都看了好几遍），总算憋出来了。</p>\n<hr>\n<h4 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h4>\n<ol>\n<li><a href="https://www.zhihu.com/question/24715618">ECMAScript 6 会重蹈 ECMAScript 4 的覆辙吗？</a></li>\n<li><a href="https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/README.md">Babel手册</a></li>\n<li><a href="http://babeljs.io/">Babel官网</a></li>\n<li><a href="http://2ality.com/2017/02/babel-preset-env.html">babel-preset-env: a preset that configures Babel for you</a></li>\n</ol>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "babel\u5230\u5E95\u8BE5\u5982\u4F55\u914D\u7F6E\uFF1F"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h4 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h4>\n<p>说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的<a href="http://babeljs.io/">官网</a>是这样介绍它的：</p>\n<blockquote>\n<p>Babel is a JavaScript compiler.</p>\n</blockquote>\n<blockquote>\n<p>Use next generation JavaScript, today.</p>\n</blockquote>\n<p>大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对js语法的支持不尽相同，特别是ES6之后，ECMAScrip对版本的更新已经到了一年一次的节奏，虽然每年更新的幅度不大，但是每年的提案可不少。babel的出现就是为了解决这个问题，把那些使用新标准编写的代码转译为当前环境可运行的代码，简单点说就是把ES6代码转译（转码+编译）到ES5。</p>\n<p>经常有人在使用babel的时候并没有弄懂babel是干嘛的，只知道要写ES6就要在webpack中引入一个babel-loader，然后胡乱在网上copy一个.babelrc到项目目录就开始了（ps: 其实我说的是我自己）。理解babel的配置很重要，可以避免一些不必要的坑，比如：代码中使用Object.assign在一些低版本浏览器会报错，以为是webpack打包时出现了什么问题，其实是babel的配置问题。</p>\n<!-- more -->\n<hr>\n<h4 id="es6">ES6<a class="anchor" href="#es6">§</a></h4>\n<p>正文之前先谈谈ES6，ES即<strong>ECMAScript</strong>，6表示第六个版本(也被称为是ES2015，因为是2015年发布的)，它是javascript的实现标准。</p>\n<p>被纳入到ES标准的语法必须要经过如下五个阶段:</p>\n<ol>\n<li>Stage 0: strawman</li>\n<li>Stage 1: proposal</li>\n<li>Stage 2: draft   -   必须包含<strong>2个实验性的具体实现</strong>，其中一个可以是用转译器实现的，例如Babel。</li>\n<li>Stage 3: candidate  -  至少要有<strong>2个符合规范的具体实现</strong>。</li>\n<li>Stage 4: finished</li>\n</ol>\n<p>可以看到提案在进入stage3阶段时就已经在一些环境被实现，在stage2阶段有babel的实现。所以被纳入到ES标准的语法其实在大部分环境都已经是有了实现的，那么为什么还要用babel来进行转译，因为不能确保每个运行代码的环境都是最新版本并已经实现了规范。</p>\n<p>更多关于ES6的内容可以参考hax的live:<a href="https://www.zhihu.com/lives/883307634416054272?utm_source=qq&amp;utm_medium=social">Hax：如何学习和实践ES201X？</a></p>\n<hr>\n<h4 id="babel%E7%9A%84%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4">Babel的版本变更<a class="anchor" href="#babel%E7%9A%84%E7%89%88%E6%9C%AC%E5%8F%98%E6%9B%B4">§</a></h4>\n<p>写这篇文章时babel版本已经到了<a href="https://github.com/babel/babel/releases/tag/v7.0.0-beta.3">v7.0.0-beta.3</a>,也就是说7.0的正式版就要发布了，可喜可贺。但是今天不谈7.0，只谈babel6，在我知道并开始使用的babel的时候babel已经到了版本6，没有经历过5的时代。</p>\n<p>在babel5的时代，babel属于全家桶型，只要安装babel就会安装babel相关的所有工具，\n即装即用。</p>\n<p>但是到了babel6，具体有以下几点变更：</p>\n<ul>\n<li>移除babel全家桶安装，拆分为单独模块，例如：babel-core、babel-cli、babel-node、babel-polyfill等；\n可以在babel的github仓库看到babel现在有哪些模块。\n<img src="//file.shenfq.com/17-10-16/10463136.jpg" alt="babel-package"></li>\n<li>新增 .babelrc 配置文件，基本上所有的babel转译都会来读取这个配置；</li>\n<li>新增 plugin 配置，所有的东西都插件化，什么代码要转译都能在插件中自由配置；</li>\n<li>新增 preset 配置，babel5会默认转译ES6和jsx语法，babel6转译的语法都要在perset中配置，preset简单说就是一系列plugin包的使用。</li>\n</ul>\n<hr>\n<h4 id="babel%E5%90%84%E4%B8%AA%E6%A8%A1%E5%9D%97%E4%BB%8B%E7%BB%8D">babel各个模块介绍<a class="anchor" href="#babel%E5%90%84%E4%B8%AA%E6%A8%A1%E5%9D%97%E4%BB%8B%E7%BB%8D">§</a></h4>\n<p>babel6将babel全家桶拆分成了许多不同的模块，只有知道这些模块怎么用才能更好的理解babel。</p>\n<p>下面的一些示例代码已经上传到了<a href="https://github.com/Shenfq/studyBabel">github</a>，欢迎访问，欢迎star。</p>\n<p>安装方式：</p>\n<pre class="language-shell"><code class="language-shell"><span class="token comment">#通过npm安装</span>\n<span class="token function">npm</span> <span class="token function">install</span> babel-core babel-cli babel-node\n\n<span class="token comment">#通过yarn安装</span>\n<span class="token function">yarn</span> <span class="token function">add</span> babel-core babel-cli babel-node\n</code></pre>\n<h5 id="1babel-core">1、<a href="http://babeljs.io/docs/usage/api/">babel-core</a><a class="anchor" href="#1babel-core">§</a></h5>\n<p>看名字就知道，babel-core是作为babel的核心存在，babel的核心api都在这个模块里面，比如：transform。</p>\n<p>下面介绍几个babel-core中的api</p>\n<ul>\n<li>babel.transform：用于字符串转码得到AST</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/*\n * @param {string} code 要转译的代码字符串\n * @param {object} options 可选，配置项\n * @return {object} \n*/</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>code<span class="token operator">:</span> string<span class="token punctuation">,</span> options<span class="token operator">?</span><span class="token operator">:</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">)</span>\n    \n<span class="token comment">//返回一个对象(主要包括三个部分)：</span>\n<span class="token punctuation">{</span>\n    generated code<span class="token punctuation">,</span> <span class="token comment">//生成码</span>\n    sources map<span class="token punctuation">,</span> <span class="token comment">//源映射</span>\n    <span class="token constant">AST</span>  <span class="token comment">//即abstract syntax tree，抽象语法树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>更多关于AST知识点请看<a href="https://www.zhihu.com/question/20346372">这里</a>。</p>\n<p>一些使用babel插件的打包或构建工具都有使用到这个方法，下面是一些引入babel插件中的源码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//gulp-babel</span>\n<span class="token keyword">const</span> babel <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-core\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\nmodule<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">opts</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    opts <span class="token operator">=</span> opts <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> through<span class="token punctuation">.</span><span class="token method function property-access">obj</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">file<span class="token punctuation">,</span> enc<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n            <span class="token keyword">const</span> fileOpts <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> opts<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n              filename<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">path</span><span class="token punctuation">,</span>\n              filenameRelative<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span><span class="token punctuation">,</span>\n              sourceMap<span class="token operator">:</span> <span class="token known-class-name class-name">Boolean</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">sourceMap</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n              sourceFileName<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span><span class="token punctuation">,</span>\n              sourceMapTarget<span class="token operator">:</span> file<span class="token punctuation">.</span><span class="token property-access">relative</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">const</span> res <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">contents</span><span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> fileOpts<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>res <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              <span class="token comment">//some codes</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token comment">//some codes</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//babel-loader</span>\n<span class="token keyword">var</span> babel <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-core"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\n<span class="token keyword">var</span> <span class="token function-variable function">transpile</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">transpile</span><span class="token punctuation">(</span><span class="token parameter">source<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//some code</span>\n    <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n        result <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transform</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">//some codes</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">//some codes</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//rollup-pugin-babel</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> buildExternalHelpers<span class="token punctuation">,</span> transform <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'babel-core\'</span><span class="token punctuation">;</span>\n<span class="token comment">/*\nsome codes...\n*/</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">function</span> <span class="token function">babel</span> <span class="token punctuation">(</span> <span class="token parameter">options</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">//some codes</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        <span class="token comment">// some methods</span>\n        <span class="token function">transform</span> <span class="token punctuation">(</span> <span class="token parameter">code<span class="token punctuation">,</span> id</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">const</span> transformed <span class="token operator">=</span> <span class="token function">transform</span><span class="token punctuation">(</span> code<span class="token punctuation">,</span> localOpts <span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token comment">//some codes</span>\n            <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n              code<span class="token operator">:</span> transformed<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token punctuation">,</span>\n              map<span class="token operator">:</span> transformed<span class="token punctuation">.</span><span class="token property-access">map</span>\n            <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面是一些打包工具引入babel插件时的一些源码，可以看到基本都是先通过调用transform方法进行代码转码。</p>\n<ul>\n<li>babel.transformFile</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//异步的文件转码方式，回调函数中的result与transform返回的对象一至。</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transformFile</span><span class="token punctuation">(</span><span class="token string">"filename.js"</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> result</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  result<span class="token punctuation">;</span> <span class="token comment">// => { code, map, ast }</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<ul>\n<li>babel.transformFileSync</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//同步的文件转码方式，返回结果与transform返回的对象一至。</span>\nbabel<span class="token punctuation">.</span><span class="token method function property-access">transformFileSync</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> options<span class="token punctuation">)</span> <span class="token comment">// => { code, map, ast }</span>\n</code></pre>\n<ul>\n<li>babel.transformFromAst</li>\n</ul>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//将ast进行转译</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> code<span class="token punctuation">,</span> map<span class="token punctuation">,</span> ast <span class="token punctuation">}</span> <span class="token operator">=</span> babel<span class="token punctuation">.</span><span class="token method function property-access">transformFromAst</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> code<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h5 id="2babel-cli">2、<a href="http://babeljs.io/docs/usage/cli/">babel-cli</a><a class="anchor" href="#2babel-cli">§</a></h5>\n<p>babel-cli是一个通过命令行对js文件进行换码的工具。</p>\n<p>使用方法：</p>\n<ul>\n<li>直接在命令行输出转译后的代码<pre class="language-shell"><code class="language-shell">babel script.js\n</code></pre>\n</li>\n<li>指定输出文件<pre class="language-shell"><code class="language-shell">babel script.js --out-file build.js\n或者是\nbabel script.js -o build.js\n</code></pre>\n</li>\n</ul>\n<p>让我们来编写了一个具有箭头函数的代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//script.js</span>\n<span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> item <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>然后在命令行执行 babel script.js，发现输出的代码好像没有转译。</p>\n<p><img src="//file.shenfq.com/17-10-16/1390829.jpg" alt="babel转译"></p>\n<p>因为我们没有告诉babel要转译哪些类型，现在看看怎么指定转译代码中的箭头函数。</p>\n<pre class="language-shell"><code class="language-shell">babel --plugins transform-es2015-arrow-functions script.js\n</code></pre>\n<p><img src="//file.shenfq.com/17-10-16/38822081.jpg" alt="转译箭头函数"></p>\n<p>或者在目录里添加一个.babelrc文件，内容如下：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n    <span class="token property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"transform-es2015-arrow-functions"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>.babelrc是babel的全局配置文件，所有的babel操作（包括babel-core、babel-node）基本都会来读取这个配置，后面会详细介绍。</p>\n<h5 id="3babel-node">3、babel-node<a class="anchor" href="#3babel-node">§</a></h5>\n<p>babel-node是随babel-cli一起安装的，只要安装了babel-cli就会自带babel-node。\n在命令行输入babel-node会启动一个REPL（Read-Eval-Print-Loop），这是一个支持ES6的js执行环境。</p>\n<p><img src="//file.shenfq.com/17-10-17/40708997.jpg" alt="测试babel-node"></p>\n<p>其实不用babel-node，直接在node下，只要node版本大于6大部分ES6语法已经支持，况且现在node的版本已经到了8.7.0。</p>\n<p><img src="//file.shenfq.com/17-10-17/67395028.jpg" alt="node环境箭头函数测试"></p>\n<p>babel-node还能直接用来执行js脚本，与直接使用node命令类似，只是会在执行过程中进行babel的转译，并且babel官方不建议在生产环境直接这样使用，因为babel实时编译产生的代码会缓存在内存中，导致内存占用过高，所以我们了解了解就好。</p>\n<pre class="language-shell"><code class="language-shell">babel-node script.js\n</code></pre>\n<h5 id="4babel-register">4、<a href="http://babeljs.io/docs/usage/babel-register/">babel-register</a><a class="anchor" href="#4babel-register">§</a></h5>\n<p>babel-register字面意思能看出来，这是babel的一个注册器，它在底层改写了node的require方法，引入babel-register之后所有require并以.es6, .es, .jsx 和 .js为后缀的模块都会经过babel的转译。</p>\n<p>同样通过箭头函数做个实验：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//test.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'shenfq\'</span><span class="token punctuation">;</span>\nmodule<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> json <span class="token operator">=</span> <span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> json<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token comment">//main.js</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> test <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./test.js\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//test.js中的es6语法将被转译成es5</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>test<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//通过toString方法，看看控制台输出的函数是否被转译</span>\n</code></pre>\n<p><img src="//file.shenfq.com/17-10-17/66788446.jpg" alt="register转译"></p>\n<p>默认babel-register会忽略对node_modules目录下模块的转译，如果要开启可以进行如下配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-register"</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  ignore<span class="token operator">:</span> <span class="token boolean">false</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>babel-register与babel-core会同时安装，在babel-core中会有一个register.js文件，所以引入babel-register有两种方法：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-core/register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-register\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是官方不推荐第一种方法，因为babel-register已经独立成了一个模块，在babel-core的register.js文件中有如下注释。</p>\n<blockquote>\n<p>TODO: eventually deprecate this console.trace(&quot;use the <code>babel-register</code> package instead of <code>babel-core/register</code>&quot;);</p>\n</blockquote>\n<h5 id="5babel-polyfill">5、<a href="http://babeljs.io/docs/usage/babel-register/">babel-polyfill</a><a class="anchor" href="#5babel-polyfill">§</a></h5>\n<p>polyfill这个单词翻译成中文是<code>垫片</code>的意思，详细点解释就是桌子的桌脚有一边矮一点，拿一个东西把桌子垫平。polyfill在代码中的作用主要是用已经存在的语法和api实现一些浏览器还没有实现的api，对浏览器的一些缺陷做一些修补。例如Array新增了includes方法，我想使用，但是低版本的浏览器上没有，我就得做兼容处理：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">Array</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">includes</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">defineProperty</span><span class="token punctuation">(</span><span class="token class-name">Array</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">,</span> <span class="token string">\'includes\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">value</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">searchElement<span class="token punctuation">,</span> fromIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">throw</span> <span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">\'"this" is null or not defined\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">var</span> o <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">var</span> len <span class="token operator">=</span> o<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">>>></span> <span class="token number">0</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>len <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">var</span> n <span class="token operator">=</span> fromIndex <span class="token operator">|</span> <span class="token number">0</span><span class="token punctuation">;</span>\n      <span class="token keyword">var</span> k <span class="token operator">=</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">max</span><span class="token punctuation">(</span>n <span class="token operator">>=</span> <span class="token number">0</span> <span class="token operator">?</span> n <span class="token operator">:</span> len <span class="token operator">-</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">abs</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>k <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">===</span> searchElement<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        k<span class="token operator">++</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> \n</code></pre>\n<p>上面简单的提供了一个includes方法的polyfill，代码来自<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes">MDN</a>。</p>\n<p>理解polyfill的意思之后，再来说说babel为什么存在polyfill。因为babel的转译只是语法层次的转译，例如箭头函数、解构赋值、class，对一些新增api以及全局函数（例如：Promise）无法进行转译，这个时候就需要在代码中引入babel-polyfill，让代码完美支持ES6+环境。前面介绍的babel-node就会自动在代码中引入babel-polyfill包。</p>\n<p>引入方法：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//在代码的最顶部进行require或者import</span>\n\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"babel-polyfill"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">import</span> <span class="token string">"babel-polyfill"</span><span class="token punctuation">;</span>\n\n<span class="token comment">//如果使用webpack，也可以在文件入口数组引入</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-polyfill"</span><span class="token punctuation">,</span> <span class="token string">"./app/js"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但很多时候我们并不会使用所有ES6+语法，全局添加所有垫片肯定会让我们的代码量上升，之后会介绍其他添加垫片的方式。</p>\n<hr>\n<h4 id="babelrc">.babelrc<a class="anchor" href="#babelrc">§</a></h4>\n<p>前面已经介绍了babel常用的一些模块，接下来看看babel的配置文件 <code>.babelrc</code>。</p>\n<p>后面的后缀rc来自linux中，使用过linux就知道linux中很多rc结尾的文件，比如<code>.bashrc</code>，rc是<code>run command</code>的缩写，翻译成中文就是运行时的命令，表示程序执行时就会来调用这个文件。</p>\n<p>babel所有的操作基本都会来读取这个配置文件，除了一些在回调函数中设置options参数的，如果没有这个配置文件，会从<code>package.json</code>文件的babel属性中读取配置。</p>\n<h5 id="plugins">plugins<a class="anchor" href="#plugins">§</a></h5>\n<p>先简单介绍下 plugins ，babel中的插件，通过配置不同的插件才能告诉babel，我们的代码中有哪些是需要转译的。</p>\n<p>这里有一个babel官网的<a href="http://babeljs.io/docs/plugins/">插件列表</a>，里面有目前babel支持的全部插件。</p>\n<p>举个例子：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">,</span> <span class="token comment">//转译箭头函数</span>\n        <span class="token string">"transform-es2015-classes"</span><span class="token punctuation">,</span> <span class="token comment">//转译class语法</span>\n        <span class="token string">"transform-es2015-spread"</span><span class="token punctuation">,</span> <span class="token comment">//转译数组解构</span>\n        <span class="token string">"transform-es2015-for-of"</span> <span class="token comment">//转译for-of</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n<span class="token comment">//如果要为某个插件添加配置项，按如下写法：</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span><span class="token punctuation">[</span>\n        <span class="token comment">//改为数组，第二个元素为配置项</span>\n        <span class="token punctuation">[</span><span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token string">"spec"</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面这些都只是语法层次的转译，前面说过有些api层次的东西需要引入polyfill，同样babel也有一系列插件来支持这些。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span><span class="token punctuation">[</span>\n        <span class="token comment">//如果我们在代码中使用Object.assign方法，就用如下插件</span>\n        <span class="token string">"transform-object-assign"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//写了一个使用Object.assign的代码如下：</span>\n<span class="token keyword">const</span> people <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'shenfq\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">//经过babel转译后如下：</span>\n<span class="token keyword">var</span> _extends <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token property-access">assign</span> <span class="token operator">||</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">target</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> arguments<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">var</span> source <span class="token operator">=</span> arguments<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> key <span class="token keyword">in</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> target<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> source<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span> <span class="token keyword control-flow">return</span> target<span class="token punctuation">;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> people <span class="token operator">=</span> <span class="token function">_extends</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'shenfq\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这种通过transform添加的polyfill只会引入到当前模块中，试想实际开发中存在多个模块使用同一个api，每个模块都引入相同的polyfill，大量重复的代码出现在项目中，这肯定是一种灾难。另外一个个的引入需要polyfill的transform挺麻烦的，而且不能保证手动引入的transform一定正确，等会会提供一个解决方案：<code>transform-runtime</code>。</p>\n<p>除了添加polyfill，babel还有一个工具包helpers，如果你有安装babel-cli，你可以直接通过下面的命令把这个工具包输出：</p>\n<pre class="language-shell"><code class="language-shell">./node_modules/.bin/babel-external-helpers <span class="token operator">></span> helpers.js\n</code></pre>\n<p>这个工具包类似于babel的utils模块，就像我们项目中的utils一样，很多地方都会用到，例如babel实现Object.assign就是使用的helpers中的_extend方法。为了避免同一个文件多次引用babel的助手函数，通过<code>external-helpers</code>插件，能够把这些助手函数抽出放到文件顶部，避免多次引用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//安装： cnpm install --save-dev babel-plugin-external-helpers</span>\n\n<span class="token comment">//配置</span>\n<span class="token punctuation">{</span>\n  <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"external-helpers"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>虽然这个插件能避免一个文件多次引用助手函数，但是并不能直接避免多个文件内重复引用，这与前面说到的通过transform添加polyfill是一样的问题，这些引用都只是module级别的，在打包工具盛行的今天，需要考虑如何减少多个模块重复引用相同代码造成代码冗余。</p>\n<p>当然也可以在每个需要使用helpers的js文件顶部直接引入之前生成的helpers文件既可，通过打包工具将这个公共模块进行抽离。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'helpers\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在说完babel的helpers之后就到了插件系统的最后的一个插件：<code>transform-runtime</code>。前面在transform-polyfill的时候也有提到这个插件，之所以把它放到helpers后面是因为这个插件能自动为项目引入polyfill和helpers。</p>\n<pre class="language-shell"><code class="language-shell">cnpm <span class="token function">install</span> -D babel-plugin-transform-runtime babel-runtime\n</code></pre>\n<p>transform-runtime这个插件依赖于babel-runtime，所以安装transform-runtime的同时最好也安装babel-runtime，为了防止一些不必要的错误。babel-runtime由三个部分组成：</p>\n<ol>\n<li><a href="https://github.com/zloirock/core-js">core-js</a>\n<blockquote>\n<p>core-js极其强悍，通过ES3实现了大部分的ES5、6、7的垫片，作者zloirock是来自战斗名族的程序员，一个人维护着core-js，听说他最近还在找工作，上面是core-js的github地址，感兴趣可以去看看。</p>\n</blockquote>\n</li>\n<li><a href="http://facebook.github.io/regenerator/">regenerator</a>\n<blockquote>\n<p>regenerator来自facebook的一个库，用于实现 generator functions。</p>\n</blockquote>\n</li>\n<li>helpers\n<blockquote>\n<p>babel的一些工具函数，没错，这个helpers和前面使用babel-external-helpers生成的helpers是同一个东西</p>\n</blockquote>\n</li>\n</ol>\n<p>从babel-runtime的package.json文件中也能看出，runtime依赖了哪些东西。</p>\n<p><img src="//file.shenfq.com/17-10-22/66492657.jpg" alt="babel-runtime的package.json"></p>\n<p>安装有babel-runtime之后要引入helpers可以使用如下方式：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'babel-runtime/helpers\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>使用runtime的时候还有一些配置项：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span><span class="token string">"transform-runtime"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            <span class="token string">"helpers"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//自动引入helpers</span>\n            <span class="token string">"polyfill"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//自动引入polyfill（core-js提供的polyfill）</span>\n            <span class="token string">"regenerator"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//自动引入regenerator</span>\n        <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><strong>比较transform-runtime与babel-polyfill引入垫片的差异：</strong></p>\n<ol>\n<li>使用runtime是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，不需要再手动一个个的去配置plugins，只是引入的polyfill不是全局性的，有些局限性。而且runtime引入的polyfill不会改写一些实例方法，比如Object和Array原型链上的方法，像前面提到的<code>Array.protype.includes</code>。</li>\n<li>babel-polyfill就能解决runtime的那些问题，它的垫片是全局的，而且全能，基本上ES6中要用到的polyfill在babel-polyfill中都有，它提供了一个完整的ES6+的环境。babel官方建议只要不在意babel-polyfill的体积，最好进行全局引入，因为这是最稳妥的方式。</li>\n<li>一般的建议是开发一些框架或者库的时候使用不会污染全局作用域的babel-runtime，而开发web应用的时候可以全局引入babel-polyfill避免一些不必要的错误，而且大型web应用中全局引入babel-polyfill可能还会减少你打包后的文件体积（相比起各个模块引入重复的polyfill来说）。</li>\n</ol>\n<hr>\n<h5 id="presets">presets<a class="anchor" href="#presets">§</a></h5>\n<p>显然这样一个一个配置插件会非常的麻烦，为了方便，babel为我们提供了一个配置项叫做persets（预设）。</p>\n<p>预设就是一系列插件的集合，就好像修图一样，把上次修图的一些参数保存为一个预设，下次就能直接使用。</p>\n<p>如果要转译ES6语法，只要按如下方式配置即可：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//先安装ES6相关preset： cnpm install -D babel-preset-es2015</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"es2015"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//如果要转译的语法不止ES6，还有各个提案阶段的语法也想体验，可以按如下方式。</span>\n<span class="token comment">//安装需要的preset： cnpm install -D babel-preset-stage-0 babel-preset-stage-1 babel-preset-stage-2 babel-preset-stage-3</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"es2015"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-0"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-1"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-2"</span><span class="token punctuation">,</span>\n        <span class="token string">"stage-3"</span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//同样babel也能直接转译jsx语法，通过引入react的预设</span>\n<span class="token comment">//cnpm install -D babel-preset-react</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">"es2015"</span><span class="token punctuation">,</span>\n        <span class="token string">"react"</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>不过上面这些preset官方现在都已经不推荐了，官方<strong>唯一推荐</strong>preset：<code>babel-preset-env</code>。</p>\n<p>这款preset能灵活决定加载哪些插件和polyfill，不过还是得开发者手动进行一些配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// cnpm install -D babel-preset -env</span>\n<span class="token punctuation">{</span>\n    <span class="token string">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span><span class="token string">"env"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            <span class="token string">"targets"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">//指定要转译到哪个环境</span>\n                <span class="token comment">//浏览器环境</span>\n                <span class="token string">"browsers"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"last 2 versions"</span><span class="token punctuation">,</span> <span class="token string">"safari >= 7"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n                <span class="token comment">//node环境</span>\n                <span class="token string">"node"</span><span class="token operator">:</span> <span class="token string">"6.10"</span><span class="token punctuation">,</span> <span class="token comment">//"current"  使用当前版本的node</span>\n                \n            <span class="token punctuation">}</span><span class="token punctuation">,</span>\n             <span class="token comment">//是否将ES6的模块化语法转译成其他类型</span>\n             <span class="token comment">//参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为\'commonjs\'</span>\n            <span class="token string">"modules"</span><span class="token operator">:</span> <span class="token string">\'commonjs\'</span><span class="token punctuation">,</span>\n            <span class="token comment">//是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本</span>\n            <span class="token string">"debug"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n            <span class="token comment">//强制开启某些模块，默认为[]</span>\n            <span class="token string">"include"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"transform-es2015-arrow-functions"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n            <span class="token comment">//禁用某些模块，默认为[]</span>\n            <span class="token string">"exclude"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"transform-es2015-for-of"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n            <span class="token comment">//是否自动引入polyfill，开启此选项必须保证已经安装了babel-polyfill</span>\n            <span class="token comment">//参数：Boolean，默认为false.</span>\n            <span class="token string">"useBuiltIns"</span><span class="token operator">:</span> <span class="token boolean">false</span>\n        <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>关于最后一个参数<code>useBuiltIns</code>，有两点必须要注意：</p>\n<ol>\n<li>如果useBuiltIns为true，项目中必须引入babel-polyfill。</li>\n<li>babel-polyfill只能被引入一次，如果多次引入会造成全局作用域的冲突。</li>\n</ol>\n<p>做了个实验，同样的代码，只是<code>.babelrc</code>配置中一个开启了<code>useBuiltIns</code>，一个没有，两个js文件体积相差70K，<a href="https://github.com/Shenfq/studyBabel/tree/master/7-babel-env">戳我看看</a>。</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th>文件</th>\n<th>大小</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>useBuiltIns.js</td>\n<td>189kb</td>\n</tr>\n<tr>\n<td>notUseBuiltIns.js</td>\n<td>259kb</td>\n</tr>\n</tbody>\n</table></div>\n<p><strong>最后啰嗦一句</strong></p>\n<p>关于polyfill还有个叫做<a href="https://polyfill.io/v2/docs/">polyfill.io</a>的神器，只要在浏览器引入</p>\n<blockquote>\n<p><a href="https://cdn.polyfill.io/v2/polyfill.js">https://cdn.polyfill.io/v2/polyfill.js</a></p>\n</blockquote>\n<p>服务器会更具浏览器的UserAgent返回对应的polyfill文件，很神奇，可以说这是目前最优雅的解决polyfill过大的方案。</p>\n<hr>\n<p>前前后后写完这个差不多写了一个星期，查了很多资料（babel的官网和github都看了好几遍），总算憋出来了。</p>\n<hr>\n<h4 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h4>\n<ol>\n<li><a href="https://www.zhihu.com/question/24715618">ECMAScript 6 会重蹈 ECMAScript 4 的覆辙吗？</a></li>\n<li><a href="https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/README.md">Babel手册</a></li>\n<li><a href="http://babeljs.io/">Babel官网</a></li>\n<li><a href="http://2ality.com/2017/02/babel-preset-env.html">babel-preset-env: a preset that configures Babel for you</a></li>\n</ol>'
        } }),
    'toc': null,
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2017/10/22",
    'updated': null,
    'excerpt': "背景 说起ES6，webpack，打包，模块化总是离不开babel，babel作为一个js的编译器已经被广泛使用。在babel的官网是这样介绍它的： 大家都知道js作为宿主语言，很依赖执行的环境（浏览器、node等），不同环境对js语法的支持不尽相...",
    'cover': "//file.shenfq.com/17-10-16/10463136.jpg",
    'thumbnail': "//file.shenfq.com/17-10-22/2398050.jpg",
    'categories': [
        "前端工程"
    ],
    'tags': [
        "es6",
        "babel",
        "前端"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 33
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
                "count": 13
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
                "name": "linux",
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
