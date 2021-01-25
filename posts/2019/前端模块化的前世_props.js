import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/前端模块化的前世.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/前端模块化的前世.html",
    'title': "前端模块化的前世",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>前端模块化的前世</h1>\n<p>随着前端项目的越来越庞大，组件化的前端框架，前端路由等技术的发展，模块化已经成为现代前端工程师的一项必备技能。无论是什么语言一旦发展到一定地步，其工程化能力和可维护性势必得到相应的发展。</p>\n<p>模块化这件事，无论在哪个编程领域都是相当常见的事情，模块化存在的意义就是为了增加可复用性，以尽可能少的代码是实现个性化的需求。同为前端三剑客之一的 CSS 早在 2.1 的版本就提出了 <code>@import</code> 来实现模块化，但是 JavaScript 直到 ES6 才出现官方的模块化方案： ES Module (<code>import</code>、<code>export</code>)。尽管早期 JavaScript 语言规范上不支持模块化，但这并没有阻止 JavaScript  的发展，官方没有模块化标准开发者们就开始自己创建规范，自己实现规范。</p>\n<h2 id="commonjs-%E7%9A%84%E5%87%BA%E7%8E%B0">CommonJS 的出现<a class="anchor" href="#commonjs-%E7%9A%84%E5%87%BA%E7%8E%B0">§</a></h2>\n<p>十年前的前端没有像现在这么火热，模块化也只是使用闭包简单的实现一个命名空间。2009 年对 JavaScript 无疑是重要的一年，新的 JavaScript 引擎 (v8) ，并且有成熟的库 (jQuery、YUI、Dojo)，ES5 也在提案中，然而 JavaScript 依然只能出现在浏览器当中。早在2007年，AppJet 就提供了一项服务，创建和托管服务端的 JavaScript 应用。后来 Aptana 也提供了一个能够在服务端运行 Javascript 的环境，叫做 Jaxer。网上还能搜到关于 AppJet、Jaxer 的博客，甚至 Jaxer 项目还在<a href="https://github.com/aptana/Jaxer">github</a>上。</p>\n<p><img src="https://file.shenfq.com/20191008214141.png" alt="Jaxer"></p>\n<p>但是这些东西都没有发展起来，Javascript  并不能替代传统的服务端脚本语言 (PHP、Python、Ruby) 。尽管它有很多的缺点，但是不妨碍有很多人使用它。后来就有人开始思考 JavaScript 要在服务端运行还需要些什么？于是在 2009 年 1 月，Mozilla 的工程师 <a href="http://www.kevindangoor.com/">Kevin Dangoor</a> 发起了 CommonJS 的提案，呼吁 JavaScript 爱好者联合起来，编写 JavaScript 运行在服务端的相关规范，一周之后，就有了 224 个参与者。</p>\n<blockquote>\n<p>&quot;[This] is not a technical problem,It\'s a matter of people getting together and making a decision to step forward and start building up something bigger and cooler together.&quot;</p>\n</blockquote>\n<p>CommonJS 标准囊括了 JavaScript 需要在服务端运行所必备的基础能力，比如：模块化、IO 操作、二进制字符串、进程管理、Web网关接口 (JSGI) 。但是影响最深远的还是 CommonJS 的模块化方案，CommonJS 的模块化方案是JavaScript社区第一次在模块系统上取得的成果，不仅支持依赖管理，而且还支持作用域隔离和模块标识。再后来 node.js 出世，他直接采用了 <code>CommonJS</code> 的模块化规范，同时还带来了npm (Node Package Manager，现在已经是全球最大模块仓库了) 。</p>\n<p>CommonJS 在服务端表现良好，很多人就想将 CommonJS 移植到客户端 (也就是我们说的浏览器) 进行实现。由于CommonJS 的模块加载是同步的，而服务端直接从磁盘或内存中读取，耗时基本可忽略，但是在浏览器端如果还是同步加载，对用户体验极其不友好，模块加载过程中势必会向服务器请求其他模块代码，网络请求过程中会造成长时间白屏。所以从 CommonJS 中逐渐分裂出来了一些派别，在这些派别的发展过程中，出现了一些业界较为熟悉方案 AMD、CMD、打包工具（Component/Browserify/Webpack）。</p>\n<h2 id="amd%E8%A7%84%E8%8C%83requirejs">AMD规范：RequireJS<a class="anchor" href="#amd%E8%A7%84%E8%8C%83requirejs">§</a></h2>\n<p><img src="https://file.shenfq.com/20191008214224.png" alt="RequireJS logo"></p>\n<p>RequireJS 是 AMD 规范的代表之作，它之所以能代表 AMD 规范，是因为 RequireJS 的作者 (James Burke) 就是 AMD 规范的提出者。同时作者还开发了<a href="https://github.com/jrburke/amdefine"> <code>amdefine</code></a>，一个让你在 node 中也可以使用 AMD 规范的库。</p>\n<p>AMD 规范由 CommonJS 的 Modules/Transport/C 提案发展而来，毫无疑问，Modules/Transport/C 提案的发起者就是 James Burke。</p>\n<p>James Burke 指出了 CommonJS 规范在浏览器上的一些不足：</p>\n<ol>\n<li>缺少模块封装的能力：CommonJS 规范中的每个模块都是一个文件。这意味着每个文件只有一个模块。这在服务器上是可行的，但是在浏览器中就不是很友好，浏览器中需要做到尽可能少的发起请求。</li>\n<li>使用同步的方式加载依赖：虽然同步的方法进行加载可以让代码更容易理解，但是在浏览器中使用同步加载会导致长时间白屏，影响用户体验。</li>\n<li>CommonJS 规范使用一个名为 <code>export</code> 的对象来暴露模块，将需要导出变量附加到 <code>export</code> 上，但是不能直接给该对象进行赋值。如果需要导出一个构造函数，则需要使用 <code>module.export</code>，这会让人感到很疑惑。</li>\n</ol>\n<p>AMD 规范定义了一个 <code>define</code> 全局方法用来定义和加载模块，当然 RequireJS 后期也扩展了 <code>require</code> 全局方法用来加载模块 。通过该方法解决了在浏览器使用 CommonJS 规范的不足。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span>id<span class="token operator">?</span><span class="token punctuation">,</span> dependencies<span class="token operator">?</span><span class="token punctuation">,</span> factory<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<ol>\n<li>\n<p>使用匿名函数来封装模块，并通过函数返回值来定义模块，这更加符合 JavaScript 的语法，这样做既避免了对 <code>exports</code> 变量的依赖，又避免了一个文件只能暴露一个模块的问题。</p>\n</li>\n<li>\n<p>提前列出依赖项并进行异步加载，这在浏览器中，这能让模块开箱即用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">"foo"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">"logger"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">logger</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    logger<span class="token punctuation">.</span><span class="token method function property-access">debug</span><span class="token punctuation">(</span><span class="token string">"starting foo\'s definition"</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">"foo"</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>为模块指定一个模块 ID (名称) 用来唯一标识定义中模块。此外，AMD的模块名规范是 CommonJS 模块名规范的超集。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">"foo"</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">\'foo\'</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n</ol>\n<h3 id="requirejs-%E5%8E%9F%E7%90%86">RequireJS 原理<a class="anchor" href="#requirejs-%E5%8E%9F%E7%90%86">§</a></h3>\n<p>在讨论原理之前，我们可以先看下 RequireJS 的基本使用方式。</p>\n<ul>\n<li>\n<p>模块信息配置：</p>\n<pre class="language-javascript"><code class="language-javascript">require<span class="token punctuation">.</span><span class="token method function property-access">config</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  paths<span class="token operator">:</span> <span class="token punctuation">{</span>\n    jquery<span class="token operator">:</span> <span class="token string">\'<a class="token url-link" href="https://code.jquery.com/jquery-3.4.1.js">https://code.jquery.com/jquery-3.4.1.js</a>\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>依赖模块加载与调用：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'jquery\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">$</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n  <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">html</span><span class="token punctuation">(</span><span class="token string">\'loaded\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>模块定义：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span> <span class="token keyword">typeof</span> define <span class="token operator">===</span> <span class="token string">"function"</span> <span class="token operator">&amp;&amp;</span> define<span class="token punctuation">.</span><span class="token property-access">amd</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">define</span><span class="token punctuation">(</span> <span class="token string">"jquery"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> jQuery<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n</li>\n</ul>\n<p>我们首先使用 <code>config</code> 方法进行了 jquery 模块的路径配置，然后调用 <code>require</code> 方法加载 jquery 模块，之后在回调中调用已加载完成的 <code>$</code> 对象。在这个过程中，jquery 会使用 <code>define</code> 方法暴露出我们所需要的 <code>$</code> 对象。</p>\n<p>在了解了基本的使用过程后，我们就继续深入 RequireJS 的原理。</p>\n<h4 id="%E6%A8%A1%E5%9D%97%E4%BF%A1%E6%81%AF%E9%85%8D%E7%BD%AE">模块信息配置<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E4%BF%A1%E6%81%AF%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>模块信息的配置，其实很简单，只用几行代码就能实现。定义一个全局对象，然后使用 <code>Object.assign</code> 进行对象扩展。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 配置信息</span>\n<span class="token keyword">const</span> cfg <span class="token operator">=</span> <span class="token punctuation">{</span> paths<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span>\n\n<span class="token comment">// 全局 require 方法</span>\nreq <span class="token operator">=</span> <span class="token function-variable function">require</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token comment">// 扩展配置</span>\nreq<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">config</span> <span class="token operator">=</span> <span class="token parameter">config</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span>cfg<span class="token punctuation">,</span> config<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E4%B8%8E%E8%B0%83%E7%94%A8">依赖模块加载与调用<a class="anchor" href="#%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E4%B8%8E%E8%B0%83%E7%94%A8">§</a></h4>\n<p><code>require</code> 方法的逻辑很简单，进行简单的参数校验后，调用 <code>getModule</code> 方法对 <code>Module</code> 进行了实例化，getModule 会对已经实例化的模块进行缓存。因为 require 方法进行模块实例的时候，并没有模块名，所以这里产生的是一个匿名模块。Module 类，我们可以理解为一个模块加载器，主要作用是进行依赖的加载，并在依赖加载完毕后，调用回调函数，同时将依赖的模块逐一作为参数回传到回调函数中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 全局 require 方法</span>\nreq <span class="token operator">=</span> <span class="token function-variable function">require</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> deps <span class="token operator">===</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    callback <span class="token operator">=</span> deps\n    deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>deps<span class="token punctuation">,</span> callback<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> reqCounter <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token keyword">const</span> registry <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 已注册的模块</span>\n\n<span class="token comment">// 模块加载器的工厂方法</span>\n<span class="token keyword">const</span> <span class="token function-variable function">getModule</span> <span class="token operator">=</span> <span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果模块名不存在，表示为匿名模块，自动构造模块名</span>\n    name <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">@mod_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token operator">++</span>reqCounter<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">let</span> mod <span class="token operator">=</span> registry<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>mod<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod <span class="token operator">=</span> registry<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> mod\n<span class="token punctuation">}</span>\n</code></pre>\n<p>模块加载器是是整个模块加载的核心，主要包括 <code>enable</code> 方法和 <code>check</code> 方法。</p>\n<p>模块加载器在完成实例化之后，会首先调用 <code>init</code> 方法进行初始化，初始化的时候传入模块的依赖以及回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 模块加载器</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depMaps</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">init</span><span class="token punctuation">(</span><span class="token parameter">deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> deps\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">callback</span> <span class="token operator">=</span> callback\n    <span class="token comment">// 判断是否存在依赖</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>deps<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enable</code> 方法主要用于模块的依赖加载，该方法的主要逻辑如下：</p>\n<ol>\n<li>\n<p>遍历所有的依赖模块；</p>\n</li>\n<li>\n<p>记录已加载模块数 (<code>this.depCount++</code>)，该变量用于判断依赖模块是否全部加载完毕；</p>\n</li>\n<li>\n<p>实例化依赖模块的模块加载器，并绑定 <code>definedFn</code> 方法；</p>\n<blockquote>\n<p><code>definedFn</code> 方法会在依赖模块加载完毕后调用，主要作用是获取依赖模块的内容，并将 <code>depCount</code> 减 1，最后调用 <code>check</code> 方法 (该方法会判断 <code>depCount</code> 是否已经小于 1，以此来界定依赖全部加载完毕)；</p>\n</blockquote>\n</li>\n<li>\n<p>最后通过依赖模块名，在配置中获取依赖模块的路径，进行模块加载。</p>\n</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token spread operator">...</span>\n  <span class="token comment">// 启用模块，进行依赖加载</span>\n  <span class="token function">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 遍历依赖</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 记录已加载的模块数</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">++</span>\n      \n      <span class="token comment">// 实例化依赖模块的模块加载器，绑定模块加载完毕的回调</span>\n      <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n      mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token parameter">exports</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">--</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> exports\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      \n      <span class="token comment">// 在配置中获取依赖模块的路径，进行模块加载</span>\n      <span class="token keyword">const</span> url <span class="token operator">=</span> cfg<span class="token punctuation">.</span><span class="token property-access">paths</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n      <span class="token function">loadModule</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> url<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>loadModule</code> 的主要作用就是通过 url 去加载一个 js 文件，并绑定一个 onload 事件。onload 会重新获取依赖模块已经实例化的模块加载器，并调用 <code>init</code> 方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 缓存加载的模块</span>\n<span class="token keyword">const</span> defMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token comment">// 依赖的加载</span>\n<span class="token keyword">const</span> <span class="token function-variable function">loadModule</span> <span class="token operator">=</span>  <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> url</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> head <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementsByTagName</span><span class="token punctuation">(</span><span class="token string">\'head\'</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> node <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span><span class="token string">\'script\'</span><span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">=</span> <span class="token string">\'text/javascript\'</span>\n  node<span class="token punctuation">.</span><span class="token property-access">async</span> <span class="token operator">=</span> <span class="token boolean">true</span>\n  <span class="token comment">// 设置一个 data 属性，便于依赖加载完毕后拿到模块名</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">setAttribute</span><span class="token punctuation">(</span><span class="token string">\'data-module\'</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'load\'</span><span class="token punctuation">,</span> onScriptLoad<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">src</span> <span class="token operator">=</span> url\n  head<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> node\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 节点绑定的 onload 事件函数</span>\n<span class="token keyword">const</span> <span class="token function-variable function">onScriptLoad</span> <span class="token operator">=</span> <span class="token parameter">evt</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> node <span class="token operator">=</span> evt<span class="token punctuation">.</span><span class="token property-access">currentTarget</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">removeEventListener</span><span class="token punctuation">(</span><span class="token string">\'load\'</span><span class="token punctuation">,</span> onScriptLoad<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n  <span class="token comment">// 获取模块名</span>\n  <span class="token keyword">const</span> name <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token method function property-access">getAttribute</span><span class="token punctuation">(</span><span class="token string">\'data-module\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> def <span class="token operator">=</span> defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>def<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">,</span> def<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>看到之前的案例，因为只有一个依赖 (jQuery)，并且 jQuery 模块并没有其他依赖，所以 <code>init</code> 方法会直接调用 <code>check</code> 方法。这里也可以思考一下，如果是一个有依赖项的模块后续的流程是怎么样的呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string">"jquery"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">/* 无其他依赖 */</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> jQuery<span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>check</code> 方法主要用于依赖检测，以及调用依赖加载完毕后的回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 模块加载器</span>\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token spread operator">...</span>\n  <span class="token comment">// 检查依赖是否加载完毕</span>\n  <span class="token function">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> exports <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">exports</span>\n    <span class="token comment">//如果依赖数小于1，表示依赖已经全部加载完毕</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span> <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n      <span class="token comment">// 调用回调，并获取该模块的内容</span>\n      exports <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> exports\n      <span class="token comment">//激活 defined 回调</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">definedFn</span><span class="token punctuation">(</span>exports<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最终通过 <code>definedFn</code> 重新回到被依赖模块，也就是最初调用 <code>require</code> 方法实例化的匿名模块加载器中，将依赖模块暴露的内容存入 <code>depExports</code> 中，然后调用匿名模块加载器的 <code>check</code> 方法，调用回调。</p>\n<pre class="language-javascript"><code class="language-javascript">mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token parameter">exports</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">--</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> exports\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E6%A8%A1%E5%9D%97%E5%AE%9A%E4%B9%89">模块定义<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AE%9A%E4%B9%89">§</a></h4>\n<p>还有一个疑问就是，在依赖模块加载完毕的回调中，怎么拿到的依赖模块的依赖和回调呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> def <span class="token operator">=</span> defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\nmod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>def<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">,</span> def<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span>\n</code></pre>\n<p>答案就是通过全局定义的 <code>define</code> 方法，该方法会将模块的依赖项还有回调存储到一个全局变量，后面只要按需获取即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> defMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 缓存加载的模块</span>\n<span class="token function-variable function">define</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> callback <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="requirejs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">RequireJS 原理总结<a class="anchor" href="#requirejs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">§</a></h4>\n<p>最后可以发现，RequireJS 的核心就在于模块加载器的实现，不管是通过 <code>require</code> 进行依赖加载，还是使用 <code>define</code> 定义模块，都离不开模块加载器。</p>\n<p>感兴趣的可以在我的github上查看关于简化版 RequrieJS 的<a href="https://github.com/Shenfq/think-modular/blob/master/requirejs/fake/require.js">完整代码</a> 。</p>\n<h2 id="cmd%E8%A7%84%E8%8C%83seajs">CMD规范：sea.js<a class="anchor" href="#cmd%E8%A7%84%E8%8C%83seajs">§</a></h2>\n<p><img src="https://file.shenfq.com/20191008214223.png" alt="sea.js logo"></p>\n<p>CMD 规范由国内的开发者玉伯提出，尽管在国际上的知名度远不如 AMD ，但是在国内也算和 AMD 齐头并进。相比于 AMD 的异步加载，CMD 更加倾向于懒加载，而且 CMD 的规范与 CommonJS 更贴近，只需要在 CommonJS 外增加一个函数调用的包装即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./a"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./b"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>作为 CMD 规范的实现 sea.js 也实现了类似于 RequireJS 的 api：</p>\n<pre class="language-javascript"><code class="language-javascript">seajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  main<span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>sea.js 在模块加载的方式上与 RequireJS 一致，都是通过在 head 标签插入 script 标签进行加载的，但是在加载顺序上有一定的区别。要讲清楚这两者之间的差别，我们还是直接来看一段代码：</p>\n<p><strong>RequireJS</strong> :</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// RequireJS</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a load\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">run</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b load\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">run</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'main run\'</span><span class="token punctuation">)</span>\n  a<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  b<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20191008214225.png" alt="requirejs result"></p>\n<p><strong>sea.js</strong> :</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// sea.js</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a load\'</span><span class="token punctuation">)</span>\n  exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">run</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b load\'</span><span class="token punctuation">)</span>\n  exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">run</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'main run\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">)</span>\n  a<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">)</span>\n  b<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nseajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20191008214226.png" alt="sea.js result"></p>\n<p>可以看到 sea.js 的模块属于懒加载，只有在 require 的地方，才会真正运行模块。而 RequireJS，会先运行所有的依赖，得到所有依赖暴露的结果后再执行回调。</p>\n<p>正是因为懒加载的机制，所以 sea.js 提供了 <code>seajs.use</code> 的方法，来运行已经定义的模块。所有 define 的回调函数都不会立即执行，而是将所有的回调函数进行缓存，只有 use 之后，以及被 require 的模块回调才会进行执行。</p>\n<h3 id="seajs-%E5%8E%9F%E7%90%86">sea.js 原理<a class="anchor" href="#seajs-%E5%8E%9F%E7%90%86">§</a></h3>\n<p>下面简单讲解一下 sea.js 的懒加载逻辑。在调用 define 方法的时候，只是将 模块放入到一个全局对象进行缓存。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> seajs <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token keyword">const</span> cache <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">cache</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token function-variable function">define</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> factory</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> uri <span class="token operator">=</span> <span class="token function">id2uri</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token function">parseDependencies</span><span class="token punctuation">(</span>factory<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> cache<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">(</span>cache<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> deps\n  mod<span class="token punctuation">.</span><span class="token property-access">factory</span> <span class="token operator">=</span> factory\n  \n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">uri</span>    <span class="token operator">=</span> uri\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span>   <span class="token operator">=</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里的 Module，是一个与 RequireJS 类似的模块加载器。后面运行的 seajs.use 就会从缓存取出对应的模块进行加载。</p>\n<blockquote>\n<p>注意：这一部分代码只是简单介绍 use 方法的逻辑，并不能直接运行。</p>\n</blockquote>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">let</span> cid <span class="token operator">=</span> <span class="token number">0</span>\nseajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token function">isArray</span><span class="token punctuation">(</span>ids<span class="token punctuation">)</span> <span class="token operator">?</span> ids <span class="token operator">:</span> <span class="token punctuation">[</span>ids<span class="token punctuation">]</span>\n  \n  deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">dep<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> mod <span class="token operator">=</span> cache<span class="token punctuation">[</span>dep<span class="token punctuation">]</span>\n    mod<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>另外 sea.js 的依赖都是在 factory 中声明的，在模块被调用的时候，sea.js 会将 factory 转成字符串，然后匹配出所有的 <code>require(\'xxx\')</code> 中的 <code>xxx</code> ，来进行依赖的存储。前面代码中的 <code>parseDependencies</code> 方法就是做这件事情的。</p>\n<p>早期 sea.js 是直接通过正则的方式进行匹配的：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token function-variable function">parseDependencies</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token constant">REQUIRE_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">"(?:\\"|[^"])*"|\'(?:\\' | [ ^ , '])*\'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["\'])(.+?)\1\s*\)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n  <span class="token keyword">const</span> <span class="token constant">SLASH_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\\\</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n  <span class="token keyword">const</span> ret <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n  code\n    <span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token constant">SLASH_RE</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token constant">REQUIRE_RE</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> __<span class="token punctuation">,</span> id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        ret<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> ret\n<span class="token punctuation">}</span>\n</code></pre>\n<p>但是后来发现正则有各种各样的 bug，并且过长的正则也不利于维护，所以 sea.js 后期舍弃了这种方式，转而使用状态机进行词法分析的方式获取 require 依赖。</p>\n<p>详细代码可以查看 sea.js 相关的子项目：<a href="https://github.com/seajs/crequire">crequire</a>。</p>\n<h4 id="seajs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">sea.js 原理总结<a class="anchor" href="#seajs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">§</a></h4>\n<p>其实 sea.js 的代码逻辑大体上与 RequireJS 类似，都是通过创建 script 标签进行模块加载，并且都有实现一个模块记载器，用于管理依赖。</p>\n<p>主要差异在于，sea.js 的懒加载机制，并且在使用方式上，sea.js 的所有依赖都不是提前声明的，而是 sea.js 内部通过正则或词法分析的方式将依赖手动进行提取的。</p>\n<p>感兴趣的可以在我的github上查看关于简化版 sea.js 的<a href="https://github.com/Shenfq/think-modular/blob/master/seajs/fake/sea.js">完整代码</a> 。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>ES6 的模块化规范已经日趋完善，其静态化思想也为后来的打包工具提供了便利，并且能友好的支持 tree shaking。了解这些已经过时的模块化方案看起来似乎有些无趣，但是历史不能被遗忘，我们应该多了解这些东西出现的背景，以及前人们的解决思路，而不是一直抱怨新东西更迭的速度太快。</p>\n<p>不说鸡汤了，挖个坑，敬请期待下一期的《前端模块化的今生》。</p>']
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u524D\u7AEF\u6A21\u5757\u5316\u7684\u524D\u4E16"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>随着前端项目的越来越庞大，组件化的前端框架，前端路由等技术的发展，模块化已经成为现代前端工程师的一项必备技能。无论是什么语言一旦发展到一定地步，其工程化能力和可维护性势必得到相应的发展。</p>\n<p>模块化这件事，无论在哪个编程领域都是相当常见的事情，模块化存在的意义就是为了增加可复用性，以尽可能少的代码是实现个性化的需求。同为前端三剑客之一的 CSS 早在 2.1 的版本就提出了 <code>@import</code> 来实现模块化，但是 JavaScript 直到 ES6 才出现官方的模块化方案： ES Module (<code>import</code>、<code>export</code>)。尽管早期 JavaScript 语言规范上不支持模块化，但这并没有阻止 JavaScript  的发展，官方没有模块化标准开发者们就开始自己创建规范，自己实现规范。</p>\n<h2 id="commonjs-%E7%9A%84%E5%87%BA%E7%8E%B0">CommonJS 的出现<a class="anchor" href="#commonjs-%E7%9A%84%E5%87%BA%E7%8E%B0">§</a></h2>\n<p>十年前的前端没有像现在这么火热，模块化也只是使用闭包简单的实现一个命名空间。2009 年对 JavaScript 无疑是重要的一年，新的 JavaScript 引擎 (v8) ，并且有成熟的库 (jQuery、YUI、Dojo)，ES5 也在提案中，然而 JavaScript 依然只能出现在浏览器当中。早在2007年，AppJet 就提供了一项服务，创建和托管服务端的 JavaScript 应用。后来 Aptana 也提供了一个能够在服务端运行 Javascript 的环境，叫做 Jaxer。网上还能搜到关于 AppJet、Jaxer 的博客，甚至 Jaxer 项目还在<a href="https://github.com/aptana/Jaxer">github</a>上。</p>\n<p><img src="https://file.shenfq.com/20191008214141.png" alt="Jaxer"></p>\n<p>但是这些东西都没有发展起来，Javascript  并不能替代传统的服务端脚本语言 (PHP、Python、Ruby) 。尽管它有很多的缺点，但是不妨碍有很多人使用它。后来就有人开始思考 JavaScript 要在服务端运行还需要些什么？于是在 2009 年 1 月，Mozilla 的工程师 <a href="http://www.kevindangoor.com/">Kevin Dangoor</a> 发起了 CommonJS 的提案，呼吁 JavaScript 爱好者联合起来，编写 JavaScript 运行在服务端的相关规范，一周之后，就有了 224 个参与者。</p>\n<blockquote>\n<p>&quot;[This] is not a technical problem,It\'s a matter of people getting together and making a decision to step forward and start building up something bigger and cooler together.&quot;</p>\n</blockquote>\n<p>CommonJS 标准囊括了 JavaScript 需要在服务端运行所必备的基础能力，比如：模块化、IO 操作、二进制字符串、进程管理、Web网关接口 (JSGI) 。但是影响最深远的还是 CommonJS 的模块化方案，CommonJS 的模块化方案是JavaScript社区第一次在模块系统上取得的成果，不仅支持依赖管理，而且还支持作用域隔离和模块标识。再后来 node.js 出世，他直接采用了 <code>CommonJS</code> 的模块化规范，同时还带来了npm (Node Package Manager，现在已经是全球最大模块仓库了) 。</p>\n<p>CommonJS 在服务端表现良好，很多人就想将 CommonJS 移植到客户端 (也就是我们说的浏览器) 进行实现。由于CommonJS 的模块加载是同步的，而服务端直接从磁盘或内存中读取，耗时基本可忽略，但是在浏览器端如果还是同步加载，对用户体验极其不友好，模块加载过程中势必会向服务器请求其他模块代码，网络请求过程中会造成长时间白屏。所以从 CommonJS 中逐渐分裂出来了一些派别，在这些派别的发展过程中，出现了一些业界较为熟悉方案 AMD、CMD、打包工具（Component/Browserify/Webpack）。</p>\n<h2 id="amd%E8%A7%84%E8%8C%83requirejs">AMD规范：RequireJS<a class="anchor" href="#amd%E8%A7%84%E8%8C%83requirejs">§</a></h2>\n<p><img src="https://file.shenfq.com/20191008214224.png" alt="RequireJS logo"></p>\n<p>RequireJS 是 AMD 规范的代表之作，它之所以能代表 AMD 规范，是因为 RequireJS 的作者 (James Burke) 就是 AMD 规范的提出者。同时作者还开发了<a href="https://github.com/jrburke/amdefine"> <code>amdefine</code></a>，一个让你在 node 中也可以使用 AMD 规范的库。</p>\n<p>AMD 规范由 CommonJS 的 Modules/Transport/C 提案发展而来，毫无疑问，Modules/Transport/C 提案的发起者就是 James Burke。</p>\n<p>James Burke 指出了 CommonJS 规范在浏览器上的一些不足：</p>\n<ol>\n<li>缺少模块封装的能力：CommonJS 规范中的每个模块都是一个文件。这意味着每个文件只有一个模块。这在服务器上是可行的，但是在浏览器中就不是很友好，浏览器中需要做到尽可能少的发起请求。</li>\n<li>使用同步的方式加载依赖：虽然同步的方法进行加载可以让代码更容易理解，但是在浏览器中使用同步加载会导致长时间白屏，影响用户体验。</li>\n<li>CommonJS 规范使用一个名为 <code>export</code> 的对象来暴露模块，将需要导出变量附加到 <code>export</code> 上，但是不能直接给该对象进行赋值。如果需要导出一个构造函数，则需要使用 <code>module.export</code>，这会让人感到很疑惑。</li>\n</ol>\n<p>AMD 规范定义了一个 <code>define</code> 全局方法用来定义和加载模块，当然 RequireJS 后期也扩展了 <code>require</code> 全局方法用来加载模块 。通过该方法解决了在浏览器使用 CommonJS 规范的不足。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span>id<span class="token operator">?</span><span class="token punctuation">,</span> dependencies<span class="token operator">?</span><span class="token punctuation">,</span> factory<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<ol>\n<li>\n<p>使用匿名函数来封装模块，并通过函数返回值来定义模块，这更加符合 JavaScript 的语法，这样做既避免了对 <code>exports</code> 变量的依赖，又避免了一个文件只能暴露一个模块的问题。</p>\n</li>\n<li>\n<p>提前列出依赖项并进行异步加载，这在浏览器中，这能让模块开箱即用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">"foo"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">"logger"</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">logger</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    logger<span class="token punctuation">.</span><span class="token method function property-access">debug</span><span class="token punctuation">(</span><span class="token string">"starting foo\'s definition"</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">"foo"</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>为模块指定一个模块 ID (名称) 用来唯一标识定义中模块。此外，AMD的模块名规范是 CommonJS 模块名规范的超集。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">"foo"</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">\'foo\'</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n</ol>\n<h3 id="requirejs-%E5%8E%9F%E7%90%86">RequireJS 原理<a class="anchor" href="#requirejs-%E5%8E%9F%E7%90%86">§</a></h3>\n<p>在讨论原理之前，我们可以先看下 RequireJS 的基本使用方式。</p>\n<ul>\n<li>\n<p>模块信息配置：</p>\n<pre class="language-javascript"><code class="language-javascript">require<span class="token punctuation">.</span><span class="token method function property-access">config</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  paths<span class="token operator">:</span> <span class="token punctuation">{</span>\n    jquery<span class="token operator">:</span> <span class="token string">\'<a class="token url-link" href="https://code.jquery.com/jquery-3.4.1.js">https://code.jquery.com/jquery-3.4.1.js</a>\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>依赖模块加载与调用：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'jquery\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">$</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n  <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">html</span><span class="token punctuation">(</span><span class="token string">\'loaded\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n</li>\n<li>\n<p>模块定义：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span> <span class="token keyword">typeof</span> define <span class="token operator">===</span> <span class="token string">"function"</span> <span class="token operator">&amp;&amp;</span> define<span class="token punctuation">.</span><span class="token property-access">amd</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">define</span><span class="token punctuation">(</span> <span class="token string">"jquery"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> jQuery<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n</li>\n</ul>\n<p>我们首先使用 <code>config</code> 方法进行了 jquery 模块的路径配置，然后调用 <code>require</code> 方法加载 jquery 模块，之后在回调中调用已加载完成的 <code>$</code> 对象。在这个过程中，jquery 会使用 <code>define</code> 方法暴露出我们所需要的 <code>$</code> 对象。</p>\n<p>在了解了基本的使用过程后，我们就继续深入 RequireJS 的原理。</p>\n<h4 id="%E6%A8%A1%E5%9D%97%E4%BF%A1%E6%81%AF%E9%85%8D%E7%BD%AE">模块信息配置<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E4%BF%A1%E6%81%AF%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>模块信息的配置，其实很简单，只用几行代码就能实现。定义一个全局对象，然后使用 <code>Object.assign</code> 进行对象扩展。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 配置信息</span>\n<span class="token keyword">const</span> cfg <span class="token operator">=</span> <span class="token punctuation">{</span> paths<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">}</span>\n\n<span class="token comment">// 全局 require 方法</span>\nreq <span class="token operator">=</span> <span class="token function-variable function">require</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token comment">// 扩展配置</span>\nreq<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">config</span> <span class="token operator">=</span> <span class="token parameter">config</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span>cfg<span class="token punctuation">,</span> config<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E4%B8%8E%E8%B0%83%E7%94%A8">依赖模块加载与调用<a class="anchor" href="#%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E4%B8%8E%E8%B0%83%E7%94%A8">§</a></h4>\n<p><code>require</code> 方法的逻辑很简单，进行简单的参数校验后，调用 <code>getModule</code> 方法对 <code>Module</code> 进行了实例化，getModule 会对已经实例化的模块进行缓存。因为 require 方法进行模块实例的时候，并没有模块名，所以这里产生的是一个匿名模块。Module 类，我们可以理解为一个模块加载器，主要作用是进行依赖的加载，并在依赖加载完毕后，调用回调函数，同时将依赖的模块逐一作为参数回传到回调函数中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 全局 require 方法</span>\nreq <span class="token operator">=</span> <span class="token function-variable function">require</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>deps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> deps <span class="token operator">===</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    callback <span class="token operator">=</span> deps\n    deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>deps<span class="token punctuation">,</span> callback<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">let</span> reqCounter <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token keyword">const</span> registry <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 已注册的模块</span>\n\n<span class="token comment">// 模块加载器的工厂方法</span>\n<span class="token keyword">const</span> <span class="token function-variable function">getModule</span> <span class="token operator">=</span> <span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果模块名不存在，表示为匿名模块，自动构造模块名</span>\n    name <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">@mod_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token operator">++</span>reqCounter<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">let</span> mod <span class="token operator">=</span> registry<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>mod<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod <span class="token operator">=</span> registry<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> mod\n<span class="token punctuation">}</span>\n</code></pre>\n<p>模块加载器是是整个模块加载的核心，主要包括 <code>enable</code> 方法和 <code>check</code> 方法。</p>\n<p>模块加载器在完成实例化之后，会首先调用 <code>init</code> 方法进行初始化，初始化的时候传入模块的依赖以及回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 模块加载器</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depMaps</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">init</span><span class="token punctuation">(</span><span class="token parameter">deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> deps\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">callback</span> <span class="token operator">=</span> callback\n    <span class="token comment">// 判断是否存在依赖</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>deps<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enable</code> 方法主要用于模块的依赖加载，该方法的主要逻辑如下：</p>\n<ol>\n<li>\n<p>遍历所有的依赖模块；</p>\n</li>\n<li>\n<p>记录已加载模块数 (<code>this.depCount++</code>)，该变量用于判断依赖模块是否全部加载完毕；</p>\n</li>\n<li>\n<p>实例化依赖模块的模块加载器，并绑定 <code>definedFn</code> 方法；</p>\n<blockquote>\n<p><code>definedFn</code> 方法会在依赖模块加载完毕后调用，主要作用是获取依赖模块的内容，并将 <code>depCount</code> 减 1，最后调用 <code>check</code> 方法 (该方法会判断 <code>depCount</code> 是否已经小于 1，以此来界定依赖全部加载完毕)；</p>\n</blockquote>\n</li>\n<li>\n<p>最后通过依赖模块名，在配置中获取依赖模块的路径，进行模块加载。</p>\n</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token spread operator">...</span>\n  <span class="token comment">// 启用模块，进行依赖加载</span>\n  <span class="token function">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 遍历依赖</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 记录已加载的模块数</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">++</span>\n      \n      <span class="token comment">// 实例化依赖模块的模块加载器，绑定模块加载完毕的回调</span>\n      <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n      mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token parameter">exports</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">--</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> exports\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      \n      <span class="token comment">// 在配置中获取依赖模块的路径，进行模块加载</span>\n      <span class="token keyword">const</span> url <span class="token operator">=</span> cfg<span class="token punctuation">.</span><span class="token property-access">paths</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n      <span class="token function">loadModule</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> url<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>loadModule</code> 的主要作用就是通过 url 去加载一个 js 文件，并绑定一个 onload 事件。onload 会重新获取依赖模块已经实例化的模块加载器，并调用 <code>init</code> 方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 缓存加载的模块</span>\n<span class="token keyword">const</span> defMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token comment">// 依赖的加载</span>\n<span class="token keyword">const</span> <span class="token function-variable function">loadModule</span> <span class="token operator">=</span>  <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> url</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> head <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementsByTagName</span><span class="token punctuation">(</span><span class="token string">\'head\'</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> node <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span><span class="token string">\'script\'</span><span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">=</span> <span class="token string">\'text/javascript\'</span>\n  node<span class="token punctuation">.</span><span class="token property-access">async</span> <span class="token operator">=</span> <span class="token boolean">true</span>\n  <span class="token comment">// 设置一个 data 属性，便于依赖加载完毕后拿到模块名</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">setAttribute</span><span class="token punctuation">(</span><span class="token string">\'data-module\'</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'load\'</span><span class="token punctuation">,</span> onScriptLoad<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">src</span> <span class="token operator">=</span> url\n  head<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> node\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 节点绑定的 onload 事件函数</span>\n<span class="token keyword">const</span> <span class="token function-variable function">onScriptLoad</span> <span class="token operator">=</span> <span class="token parameter">evt</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> node <span class="token operator">=</span> evt<span class="token punctuation">.</span><span class="token property-access">currentTarget</span>\n  node<span class="token punctuation">.</span><span class="token method function property-access">removeEventListener</span><span class="token punctuation">(</span><span class="token string">\'load\'</span><span class="token punctuation">,</span> onScriptLoad<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>\n  <span class="token comment">// 获取模块名</span>\n  <span class="token keyword">const</span> name <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token method function property-access">getAttribute</span><span class="token punctuation">(</span><span class="token string">\'data-module\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">getModule</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> def <span class="token operator">=</span> defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>def<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">,</span> def<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>看到之前的案例，因为只有一个依赖 (jQuery)，并且 jQuery 模块并没有其他依赖，所以 <code>init</code> 方法会直接调用 <code>check</code> 方法。这里也可以思考一下，如果是一个有依赖项的模块后续的流程是怎么样的呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span> <span class="token string">"jquery"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">/* 无其他依赖 */</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> jQuery<span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>check</code> 方法主要用于依赖检测，以及调用依赖加载完毕后的回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 模块加载器</span>\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token spread operator">...</span>\n  <span class="token comment">// 检查依赖是否加载完毕</span>\n  <span class="token function">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> exports <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">exports</span>\n    <span class="token comment">//如果依赖数小于1，表示依赖已经全部加载完毕</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span> <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n      <span class="token comment">// 调用回调，并获取该模块的内容</span>\n      exports <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> exports\n      <span class="token comment">//激活 defined 回调</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">definedFn</span><span class="token punctuation">(</span>exports<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最终通过 <code>definedFn</code> 重新回到被依赖模块，也就是最初调用 <code>require</code> 方法实例化的匿名模块加载器中，将依赖模块暴露的内容存入 <code>depExports</code> 中，然后调用匿名模块加载器的 <code>check</code> 方法，调用回调。</p>\n<pre class="language-javascript"><code class="language-javascript">mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">definedFn</span> <span class="token operator">=</span> <span class="token parameter">exports</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depCount</span><span class="token operator">--</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">depExports</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> exports\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">check</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E6%A8%A1%E5%9D%97%E5%AE%9A%E4%B9%89">模块定义<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AE%9A%E4%B9%89">§</a></h4>\n<p>还有一个疑问就是，在依赖模块加载完毕的回调中，怎么拿到的依赖模块的依赖和回调呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> def <span class="token operator">=</span> defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span>\nmod<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span>def<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">,</span> def<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span>\n</code></pre>\n<p>答案就是通过全局定义的 <code>define</code> 方法，该方法会将模块的依赖项还有回调存储到一个全局变量，后面只要按需获取即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> defMap <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 缓存加载的模块</span>\n<span class="token function-variable function">define</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  defMap<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> callback <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="requirejs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">RequireJS 原理总结<a class="anchor" href="#requirejs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">§</a></h4>\n<p>最后可以发现，RequireJS 的核心就在于模块加载器的实现，不管是通过 <code>require</code> 进行依赖加载，还是使用 <code>define</code> 定义模块，都离不开模块加载器。</p>\n<p>感兴趣的可以在我的github上查看关于简化版 RequrieJS 的<a href="https://github.com/Shenfq/think-modular/blob/master/requirejs/fake/require.js">完整代码</a> 。</p>\n<h2 id="cmd%E8%A7%84%E8%8C%83seajs">CMD规范：sea.js<a class="anchor" href="#cmd%E8%A7%84%E8%8C%83seajs">§</a></h2>\n<p><img src="https://file.shenfq.com/20191008214223.png" alt="sea.js logo"></p>\n<p>CMD 规范由国内的开发者玉伯提出，尽管在国际上的知名度远不如 AMD ，但是在国内也算和 AMD 齐头并进。相比于 AMD 的异步加载，CMD 更加倾向于懒加载，而且 CMD 的规范与 CommonJS 更贴近，只需要在 CommonJS 外增加一个函数调用的包装即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./a"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./b"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>作为 CMD 规范的实现 sea.js 也实现了类似于 RequireJS 的 api：</p>\n<pre class="language-javascript"><code class="language-javascript">seajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  main<span class="token punctuation">.</span><span class="token method function property-access">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>sea.js 在模块加载的方式上与 RequireJS 一致，都是通过在 head 标签插入 script 标签进行加载的，但是在加载顺序上有一定的区别。要讲清楚这两者之间的差别，我们还是直接来看一段代码：</p>\n<p><strong>RequireJS</strong> :</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// RequireJS</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a load\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">run</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b load\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">run</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token string">\'b\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'main run\'</span><span class="token punctuation">)</span>\n  a<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  b<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20191008214225.png" alt="requirejs result"></p>\n<p><strong>sea.js</strong> :</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// sea.js</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a load\'</span><span class="token punctuation">)</span>\n  exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">run</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'a run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b load\'</span><span class="token punctuation">)</span>\n  exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">run</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'b run\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'main run\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">)</span>\n  a<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'b\'</span><span class="token punctuation">)</span>\n  b<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nseajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20191008214226.png" alt="sea.js result"></p>\n<p>可以看到 sea.js 的模块属于懒加载，只有在 require 的地方，才会真正运行模块。而 RequireJS，会先运行所有的依赖，得到所有依赖暴露的结果后再执行回调。</p>\n<p>正是因为懒加载的机制，所以 sea.js 提供了 <code>seajs.use</code> 的方法，来运行已经定义的模块。所有 define 的回调函数都不会立即执行，而是将所有的回调函数进行缓存，只有 use 之后，以及被 require 的模块回调才会进行执行。</p>\n<h3 id="seajs-%E5%8E%9F%E7%90%86">sea.js 原理<a class="anchor" href="#seajs-%E5%8E%9F%E7%90%86">§</a></h3>\n<p>下面简单讲解一下 sea.js 的懒加载逻辑。在调用 define 方法的时候，只是将 模块放入到一个全局对象进行缓存。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> seajs <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token keyword">const</span> cache <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">cache</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n<span class="token function-variable function">define</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> factory</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> uri <span class="token operator">=</span> <span class="token function">id2uri</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token function">parseDependencies</span><span class="token punctuation">(</span>factory<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> cache<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">(</span>cache<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> deps\n  mod<span class="token punctuation">.</span><span class="token property-access">factory</span> <span class="token operator">=</span> factory\n  \n<span class="token punctuation">}</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Module</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token number">0</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">uri</span>    <span class="token operator">=</span> uri\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span>   <span class="token operator">=</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里的 Module，是一个与 RequireJS 类似的模块加载器。后面运行的 seajs.use 就会从缓存取出对应的模块进行加载。</p>\n<blockquote>\n<p>注意：这一部分代码只是简单介绍 use 方法的逻辑，并不能直接运行。</p>\n</blockquote>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">let</span> cid <span class="token operator">=</span> <span class="token number">0</span>\nseajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token function">isArray</span><span class="token punctuation">(</span>ids<span class="token punctuation">)</span> <span class="token operator">?</span> ids <span class="token operator">:</span> <span class="token punctuation">[</span>ids<span class="token punctuation">]</span>\n  \n  deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">dep<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> mod <span class="token operator">=</span> cache<span class="token punctuation">[</span>dep<span class="token punctuation">]</span>\n    mod<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>另外 sea.js 的依赖都是在 factory 中声明的，在模块被调用的时候，sea.js 会将 factory 转成字符串，然后匹配出所有的 <code>require(\'xxx\')</code> 中的 <code>xxx</code> ，来进行依赖的存储。前面代码中的 <code>parseDependencies</code> 方法就是做这件事情的。</p>\n<p>早期 sea.js 是直接通过正则的方式进行匹配的：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token function-variable function">parseDependencies</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token constant">REQUIRE_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">"(?:\\"|[^"])*"|\'(?:\\' | [ ^ , '])*\'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["\'])(.+?)\1\s*\)</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n  <span class="token keyword">const</span> <span class="token constant">SLASH_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\\\\</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n  <span class="token keyword">const</span> ret <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n  code\n    <span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token constant">SLASH_RE</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token constant">REQUIRE_RE</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> __<span class="token punctuation">,</span> id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        ret<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> ret\n<span class="token punctuation">}</span>\n</code></pre>\n<p>但是后来发现正则有各种各样的 bug，并且过长的正则也不利于维护，所以 sea.js 后期舍弃了这种方式，转而使用状态机进行词法分析的方式获取 require 依赖。</p>\n<p>详细代码可以查看 sea.js 相关的子项目：<a href="https://github.com/seajs/crequire">crequire</a>。</p>\n<h4 id="seajs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">sea.js 原理总结<a class="anchor" href="#seajs-%E5%8E%9F%E7%90%86%E6%80%BB%E7%BB%93">§</a></h4>\n<p>其实 sea.js 的代码逻辑大体上与 RequireJS 类似，都是通过创建 script 标签进行模块加载，并且都有实现一个模块记载器，用于管理依赖。</p>\n<p>主要差异在于，sea.js 的懒加载机制，并且在使用方式上，sea.js 的所有依赖都不是提前声明的，而是 sea.js 内部通过正则或词法分析的方式将依赖手动进行提取的。</p>\n<p>感兴趣的可以在我的github上查看关于简化版 sea.js 的<a href="https://github.com/Shenfq/think-modular/blob/master/seajs/fake/sea.js">完整代码</a> 。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>ES6 的模块化规范已经日趋完善，其静态化思想也为后来的打包工具提供了便利，并且能友好的支持 tree shaking。了解这些已经过时的模块化方案看起来似乎有些无趣，但是历史不能被遗忘，我们应该多了解这些东西出现的背景，以及前人们的解决思路，而不是一直抱怨新东西更迭的速度太快。</p>\n<p>不说鸡汤了，挖个坑，敬请期待下一期的《前端模块化的今生》。</p>']
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#commonjs-%E7%9A%84%E5%87%BA%E7%8E%B0">CommonJS 的出现</a></li><li><a href="#amd%E8%A7%84%E8%8C%83requirejs">AMD规范：RequireJS</a><ol><li><a href="#requirejs-%E5%8E%9F%E7%90%86">RequireJS 原理</a><ol></ol></li></ol></li><li><a href="#cmd%E8%A7%84%E8%8C%83seajs">CMD规范：sea.js</a><ol><li><a href="#seajs-%E5%8E%9F%E7%90%86">sea.js 原理</a><ol></ol></li></ol></li><li><a href="#%E6%80%BB%E7%BB%93">总结</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/10/08",
    'updated': null,
    'excerpt': "随着前端项目的越来越庞大，组件化的前端框架，前端路由等技术的发展，模块化已经成为现代前端工程师的一项必备技能。无论是什么语言一旦发展到一定地步，其工程化能力和可维护性势必得到相应的发展。 模块化这件事，无论在哪个...",
    'cover': "https://file.shenfq.com/20191008214141.png",
    'categories': [
        "模块化"
    ],
    'tags': [
        "前端",
        "前端工程化",
        "前端模块化",
        "AMD",
        "CMD",
        "CommonJS"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "excerpt": "之前用 Redux 比较多，一直听说 Mobx 能让你体验到在 React 里面写 Vue 的感觉，今天打算尝试下 Mobx 是不是真的有写 Vue 的感觉。 题外话 在介绍 MobX 的用法之前，先说点题外话，我们看一下 MobX 的简介。在 MobX 的中文网站...",
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
                "count": 20
            },
            {
                "name": "Node.js",
                "count": 8
            },
            {
                "name": "前端工程",
                "count": 7
            },
            {
                "name": "模块化",
                "count": 6
            },
            {
                "name": "年终总结",
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
                "name": "随便写写",
                "count": 1
            }
        ],
        "tags": [
            {
                "name": "前端",
                "count": 24
            },
            {
                "name": "前端框架",
                "count": 11
            },
            {
                "name": "前端工程化",
                "count": 10
            },
            {
                "name": "模块化",
                "count": 8
            },
            {
                "name": "JavaScript",
                "count": 7
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
                "name": "React",
                "count": 5
            },
            {
                "name": "工作",
                "count": 5
            },
            {
                "name": "总结",
                "count": 5
            },
            {
                "name": "感悟",
                "count": 5
            },
            {
                "name": "翻译",
                "count": 5
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
                "name": "CommonJS",
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
                "name": "webpack",
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
                "name": "算法",
                "count": 2
            },
            {
                "name": "编译",
                "count": 2
            },
            {
                "name": "路由",
                "count": 2
            },
            {
                "name": "AMD",
                "count": 1
            },
            {
                "name": "babel",
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
                "name": "CSS",
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
                "name": "fetch",
                "count": 1
            },
            {
                "name": "git",
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
                "name": "npm",
                "count": 1
            },
            {
                "name": "Promise",
                "count": 1
            },
            {
                "name": "react hooks",
                "count": 1
            },
            {
                "name": "Snabbdom",
                "count": 1
            },
            {
                "name": "Stream",
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
                "name": "USB",
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
                "name": "Webpack",
                "count": 1
            },
            {
                "name": "中间件",
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
                "name": "前端工具",
                "count": 1
            },
            {
                "name": "前端构建工具",
                "count": 1
            },
            {
                "name": "多进程",
                "count": 1
            },
            {
                "name": "推荐系统",
                "count": 1
            },
            {
                "name": "样式",
                "count": 1
            },
            {
                "name": "泛型",
                "count": 1
            },
            {
                "name": "深度学习",
                "count": 1
            },
            {
                "name": "版本管理",
                "count": 1
            },
            {
                "name": "状态管理",
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
                "name": "负载均衡",
                "count": 1
            }
        ]
    }
};
