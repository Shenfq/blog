import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/【翻译】基于虚拟DOM库(Snabbdom)的迷你React.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/【翻译】基于虚拟DOM库(Snabbdom)的迷你React.html",
    'title': "【翻译】基于虚拟DOM库(Snabbdom)的迷你React",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>【翻译】基于虚拟DOM库(Snabbdom)的迷你React</h1>\n<blockquote>\n<p><a href="https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3">原文链接</a></p>\n</blockquote>\n<blockquote>\n<p>原文写于 2015-07-31，虽然时间比较久远，但是对于我们理解虚拟 DOM 和 view 层之间的关系还是有很积极的作用的。</p>\n</blockquote>\n<p>React 是 JavaScript 社区的新成员，尽管 JSX （在 JavaScript 中使用 HTML 语法）存在一定的争议，但是对于虚拟 DOM 人们有不一样的看法。</p>\n<p>对于不熟悉的人来说，虚拟 DOM 可以描述为某个时刻真实DOM的简单表示。其思想是：每次 UI 状态发生更改时，重新创建一个虚拟 DOM，而不是直接使用命令式的语句更新真实 DOM ，底层库将对应的更新映射到真实 DOM 上。</p>\n<p>需要注意的是，更新操作并没有替换整个 DOM 树（例如使用 innerHTML 重新设置 HTML 字符串），而是替换 DOM 节点中实际修改的部分（改变节点属性、添加子节点）。这里使用的是增量更新，通过比对新旧虚拟 DOM 来推断更新的部分，然后将更新的部分通过补丁的方式更新到真实 DOM 中。</p>\n<p>虚拟 DOM 因为高效的性能经常受到特别的关注。但是还有一项同样重要的特性，虚拟 DOM 可以把 UI 表示为状态函数的映射（PS. 也就是我们常说的 <code>UI = render(state)</code>），这也使得编写 web 应用有了新的形式。</p>\n<p>在本文中，我们将研究虚拟 DOM 的概念如何引用到 web 应用中。我们将从简单的例子开始，然后给出一个架构来编写基于 Virtual DOM 的应用。</p>\n<p>为此我们将选择一个独立的 JavaScript 虚拟 DOM 库，因为我们希望依赖最小化。本文中，我们将使用 snabbdom(<a href="https://github.com/snabbdom/snabbdom">paldepind/snabbdom</a>)，但是你也可以使用其他类似的库，比如 Matt Esch 的 <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a></p>\n<h2 id="snabbdom%E7%AE%80%E6%98%93%E6%95%99%E7%A8%8B">snabbdom简易教程<a class="anchor" href="#snabbdom%E7%AE%80%E6%98%93%E6%95%99%E7%A8%8B">§</a></h2>\n<p>snabbdom 是一个模块化的库，所以，我们需要使用一个打包工具，比如 webpack。</p>\n<p>首先，让我们看看如何进行 snabbdom 的初始化。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">snabbdom</span> <span class="token keyword module">from</span> <span class="token string">\'snabbdom\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> patch <span class="token operator">=</span> snabbdom<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">[</span>                 <span class="token comment">// 指定模块初始化 patch 方法</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/class\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 切换 class </span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/props\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 设置 DOM 元素的属性</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/style\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 处理元素的 style ，支持动画</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/eventlisteners\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 事件处理</span>\n<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>上面的代码中，我们初始化了 snabbdom 模块并添加了一些扩展。在 snabbdom 中，切换 class、style还有 DOM 元素上的属性设置和事件绑定都是给不同模块实现的。上面的实例，只使用了默认提供的模块。</p>\n<p>核心模块只暴露了一个 <code>patch</code> 方法，它由 init 方法返回。我们使用它创建初始化的 DOM，之后也会使用它来进行 DOM 的更新。</p>\n<p>下面是一个 Hello World 示例：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">h</span> <span class="token keyword module">from</span> <span class="token string">\'snabbdom/h\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> vnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>style<span class="token operator">:</span> <span class="token punctuation">{</span>fontWeight<span class="token operator">:</span> <span class="token string">\'bold\'</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Hello world\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">patch</span><span class="token punctuation">(</span><span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>h</code> 是一个创建虚拟 DOM 的辅助函数。我们将在文章后面介绍具体用法，现在只需要该函数的 3 个输入参数：</p>\n<ol>\n<li>一个 CSS 选择器（jQuery 的选择器），比如 <code>div#id.class</code>。</li>\n<li>一个可选的数据对象，它包含了虚拟节点的属性（class、styles、events）。</li>\n<li>一个字符串或者虚拟 DOM 的数组（用于表示该节点的children）。</li>\n</ol>\n<p>第一次调用的时候，patch 方法需要一个 DOM 占位符和一个初始的虚拟 DOM，然后它会根据虚拟 DOM 创建一个对应的真实 DO树。在随后的的调用中，我们为它提供新旧两个虚拟 DOM，然后它通过 diff 算法比对这两个虚拟 DOM，并找出更新的部分对真实 DOM 进行必要的修改 ，使得真实的 DOM 树为最新的虚拟 DOM 的映射。</p>\n<p>为了快速上手，我在 GitHub 上创建了一个仓库，其中包含了项目的必要内容。下面让我们来克隆这个仓库（<a href="https://github.com/yelouafi/snabbdom-starter">yelouafi/snabbdom-starter</a>），然后运行 <code>npm install</code> 安装依赖。这个仓库使用 Browserify 作为打包工具，文件变更后使用 Watchify 自动重新构建，并且通过 Babel 将 ES6 的代码转成兼容性更好的 ES5。</p>\n<p>下面运行如下代码：</p>\n<pre class="language-autoit"><code class="language-autoit">npm run watch\n</code></pre>\n<p>这段代码将启动 watchify 模块，它会在 app 文件夹内，创建一个浏览器能够运行的包：<code>build.js</code> 。模块还将检测我们的 js 代码是否发生改变，如果有修改，会自动的重新构建 <code>build.js</code>。（如果你想手动构建，可以使用：<code>npm run build</code>）</p>\n<p>在浏览器中打开 <code>app/index.html</code> 就能运行程序，这时候你会在屏幕上看到 “Hello World”。</p>\n<p>这篇文中的所有案例都能在特定的分支上进行实现，我会在文中链接到每个分支，同时 <a href="http://README.md">README.md</a> 文件也包含了所有分支的链接。</p>\n<h3 id="%E5%8A%A8%E6%80%81%E8%A7%86%E5%9B%BE">动态视图<a class="anchor" href="#%E5%8A%A8%E6%80%81%E8%A7%86%E5%9B%BE">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/dynamic-view">dynamic-view branch</a></p>\n</blockquote>\n<p>为了突出虚拟 DOM 动态化的优势，接下来会构建一个很简单的时钟。</p>\n<p>首先修改 <code>app/js/main.js</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">currentDate</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token string">\'Current date \'</span> <span class="token operator">+</span> currentDate<span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> oldVnode <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">setInterval</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  oldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过单独的函数 <code>view</code> 来生成虚拟 DOM，它接受一个状态（当前日期）作为输入。</p>\n<p>该案例展示了虚拟 DOM 的经典使用方式，在不同的时刻构造出新的虚拟 DOM，然后将新旧虚拟 DOM 进行对比，并更新到真实 DOM 上。案例中，我们每秒都构造了一个虚拟 DOM，并用它来更新真实 DOM。</p>\n<h3 id="%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94">事件响应<a class="anchor" href="#%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/event-reactivity">event-reactivity branch</a></p>\n</blockquote>\n<p>下面的案例介绍了通过事件系统完成一个打招呼的应用程序：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'input\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> placeholder<span class="token operator">:</span> <span class="token string">\'Type  your name\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> input<span class="token operator">:</span> update <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token string">\'Hello \'</span> <span class="token operator">+</span> name<span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> oldVnode <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token property-access">target</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  oldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n\noldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在 snabbdom 中，我们使用 props 对象来设置元素的属性，props 模块会对 props 对象进行处理。类似地，我们通过 on 对象进行元素的时间绑定，eventlistener 模块会对 on 对象进行处理。</p>\n<p>上面的案例中，update 函数执行了与前面案例中 setInterval 类似的事情：从传入的事件对象中提取出 input 的值，构造出一个新的虚拟 DOM，然后调用 patch ，用新的虚拟 DOM 树更新真实 DOM。</p>\n<h2 id="%E5%A4%8D%E6%9D%82%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F">复杂的应用程序<a class="anchor" href="#%E5%A4%8D%E6%9D%82%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F">§</a></h2>\n<p>使用独立的虚拟 DOM 库的好处是，我们在构建自己的应用时，可以按照自己喜欢的方式来做。你可以使用 MVC 的设计模式，可以使用更现代化的数据流体系，比如 Flux。</p>\n<p>在这篇文章中，我会介绍一种不太为人所知的架构模式，是我之前在 Elm（一种可编译成 JavaScript 的 函数式语言）中使用过的。Elm 的开发者称这种模式为 <a href="https://github.com/evancz/elm-architecture-tutorial/"> Elm Architecture</a>，它的主要优点是允许我们将整个应用编写为一组纯函数。</p>\n<h3 id="%E4%B8%BB%E6%B5%81%E7%A8%8B">主流程<a class="anchor" href="#%E4%B8%BB%E6%B5%81%E7%A8%8B">§</a></h3>\n<p>让我们回顾一下上个案例的主流程：</p>\n<ol>\n<li>通过 view 函数构造出我们初始的虚拟 DOM，在 view 函数中，给 input 输入框添加了一个 input 事件。</li>\n<li>通过 patch 将虚拟 DOM 渲染到真实 DOM 中，并将 input 事件绑定到真实 DOM 上。</li>\n<li>等待用户输入……</li>\n<li>用户输入内容，触发 input 事件，然后调用 update 函数</li>\n<li>在 update 函数中，我们更新了状态</li>\n<li>我们传入了新的状态给 view 函数，并生成新的虚拟 DOM （与步骤 1 相同）</li>\n<li>再次调用 patch，重复上述过程（与步骤 2 相同）</li>\n</ol>\n<p>上面的过程可以描述成一个循环。如果去掉实现的一些细节，我们可以建立一个抽象的函数调用序列。</p>\n<p><img src="https://file.shenfq.com/FvyObN9fMncD7cMXJYfZOFQJFQ--.png" alt="主流程"></p>\n<p><code>user</code> 是用户交互的抽象，我们得到的是函数调用的循环序列。注意，<code>user</code> 函数是异步的，否则这将是一个无限的死循环。</p>\n<p>让我们将上述过程转换为代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">initState<span class="token punctuation">,</span> element<span class="token punctuation">,</span> <span class="token punctuation">{</span>view<span class="token punctuation">,</span> update<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span>initState<span class="token punctuation">,</span> <span class="token parameter">event</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newState <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>initState<span class="token punctuation">,</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">main</span><span class="token punctuation">(</span>newState<span class="token punctuation">,</span> newVnode<span class="token punctuation">,</span> <span class="token punctuation">{</span>view<span class="token punctuation">,</span> update<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>main</code> 函数反映了上述的循环过程：给定一个初始状态（initState），一个 DOM 节点和一个<em>顶层组件</em>（view + update），<code>main</code> 通过当前的状态经过 view 函数构建出新的虚拟 DOM，然后通过补丁的方式更新到真实 DOM上。</p>\n<p>传递给 <code>view</code> 函数的参数有两个：首先是<em>当前</em>状态，其次是事件处理的回调函数，对生成的视图中触发的事件进行处理。回调函数主要负责为应用程序构建一个新的状态，并使用新的状态重启 UI 循环。</p>\n<p>新状态的构造委托给顶层组件的 <code>update</code> 函数，该函数是一个简单的纯函数：无论何时，给定当前状态和当前程序的输入（事件或行为），它都会为程序返回一个新的状态。</p>\n<p>要注意的是，除了 patch 方法会有副作用，主函数内不会有任何改变状态行为发生。</p>\n<p>main 函数有点类似于低级GUI框架的 <code>main</code> 事件循环，这里的重点是收回对 UI 事件分发流程的控制: 在实际状态下，DOM API通过采用观察者模式强制我们进行事件驱动，但是我们不想在这里使用观察者模式，下面就会讲到。</p>\n<h3 id="elm-%E6%9E%B6%E6%9E%84elm-architecture">Elm 架构（Elm architecture）<a class="anchor" href="#elm-%E6%9E%B6%E6%9E%84elm-architecture">§</a></h3>\n<p><img src="https://file.shenfq.com/Fs8usRuYQCOKL621r-fRyMsr9ZcI.png" alt="Elm architecture"></p>\n<p>基于 Elm-architecture 的程序中，是由一个个模块或者说组件构成的。每个组件都有两个基本函数：<code>update</code>和<code>view</code>，以及一个特定的数据结构：组件拥有的 <code>model</code> 以及更新该 <code>model</code> 实例的 <code>actions</code>。</p>\n<ol>\n<li><code>update</code> 是一个纯函数，接受两个参数：组件拥有的 <code>model</code> 实例，表示当前的状态（state），以及一个 <code>action</code> 表示需要执行的更新操作。它将返回一个新的 <code>model</code> 实例。</li>\n<li><code>view</code> 同样接受两个参数：当前 <code>model</code> 实例和一个事件通道，它可以通过多种形式传播数据，在我们的案例中，将使用一个简单的回调函数。该函数返回一个新的虚拟 DOM，该虚拟 DOM 将会渲染成真实 DOM。</li>\n</ol>\n<p>如上所述，Elm architecture 摆脱了传统的由事件进行驱动观察者模式。相反该架构倾向于集中式的管理数据（比如 React/Flux），任何的事件行为都会有两种方式：</p>\n<ol>\n<li>冒泡到顶层组件；</li>\n<li>通过组件树的形式进行下发，在此阶段，每个组件都可以选择自己的处理方式，或者转发给其他一个或所有子组件。</li>\n</ol>\n<p>该架构的另一个关键点，就是将程序需要的整个状态都保存在一个对象中。树中的每个组件都负责将它们拥有的状态的一部分传递给子组件。</p>\n<p>在我们的案例中，我们将使用与 Elm 网站相同的案例，因为它完美的展示了该模式。</p>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%B8%80%E8%AE%A1%E6%95%B0%E5%99%A8">案例一：计数器<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%B8%80%E8%AE%A1%E6%95%B0%E5%99%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-1">counter-1 branch</a></p>\n</blockquote>\n<p>我们在 “counter.js” 中定义了 counter 组件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token constant">INC</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'inc\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">DEC</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'dec\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// model : Number</span>\n<span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">INC</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'+\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">DEC</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'-\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Count : </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>count<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">INC</span> <span class="token operator">?</span> count <span class="token operator">+</span> <span class="token number">1</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">DEC</span> <span class="token operator">?</span> count <span class="token operator">-</span> <span class="token number">1</span>\n        <span class="token operator">:</span> count<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">INC</span><span class="token punctuation">,</span> <span class="token constant">DEC</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>counter 组件由以下属性组成：</p>\n<ol>\n<li>Model： 一个简单的 <code>Number</code></li>\n<li>View：为用户提供两个按钮，用户递增、递减计数器，以及显示当前数字</li>\n<li>Update：接受两个动作：INC / DEC，增加或减少计数器的值</li>\n</ol>\n<p>首先要注意的是，view/update 都是纯函数，除了输入之外，他们不依赖任何外部环境。计数器组件本身不包括任何状态或变量，它只会从给定的状态构造出固定的视图，以及通过给定的状态更新视图。由于其纯粹性，计数器组件可以轻松的插入任何提供依赖（state 和 action）环境。</p>\n<p>其次需要注意 <code>handler.bind(null, action)</code> 表达式，每次点击按钮，事件监听器都会触发该函数。我们将原始的用户事件转换为一个有意义的操作（递增或递减），使用了 ES6 的 Symbol 类型，比原始的字符串类型更好（避免了操作名称冲突的问题），稍后我们还将看到更好的解决方案：使用 union 类型。</p>\n<p>下面看看如何进行组件的测试，我们使用了 “tape” 测试库：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">test</span> <span class="token keyword module">from</span> <span class="token string">\'tape\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> update<span class="token punctuation">,</span> actions <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'../app/js/counter\'</span><span class="token punctuation">;</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token string">\'counter update function\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">assert</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    \n  <span class="token keyword">var</span> count <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>\n  count <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> actions<span class="token punctuation">.</span><span class="token constant">INC</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  assert<span class="token punctuation">.</span><span class="token method function property-access">equal</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  count <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> actions<span class="token punctuation">.</span><span class="token constant">DEC</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  assert<span class="token punctuation">.</span><span class="token method function property-access">equal</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  assert<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>我们可以直接使用 babel-node 来进行测试</p>\n<pre class="language-autoit"><code class="language-autoit">babel<span class="token operator">-</span>node test<span class="token operator">/</span>counterTest<span class="token punctuation">.</span>js\n</code></pre>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%BA%8C%E4%B8%A4%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8">案例二：两个计数器<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%BA%8C%E4%B8%A4%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-2">counter-2 branch</a></p>\n</blockquote>\n<p>我们将和 Elm 官方教程保持同步，增加计数器的数量，现在我们会有2个计数器。此外，还有一个“重置”按钮，将两个计数器同时重置为“0”;</p>\n<p>首先，我们需要修改计数器组件，让该组件支持重置操作。为此，我们将引入一个新函数 <code>init</code>，其作用是为计数器构造一个新状态 (count)。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>init</code> 在很多情况下都非常有用。例如，使用来自服务器或本地存储的数据初始化状态。它通过 JavaScript 对象创建一个丰富的数据模型(例如，为一个 JavaScript 对象添加一些原型属性或方法)。</p>\n<p><code>init</code> 与 <code>update</code> 有一些区别：后者执行一个更新操作，然后从一个状态派生出新的状态；但是前者是使用一些输入值（比如：默认值、服务器数据等等）构造一个状态，输入值是可选的，而且完全不管前一个状态是什么。</p>\n<p>下面我们将通过一些代码管理两个计数器，我们在 <code>towCounters.js</code> 中实现我们的代码。</p>\n<p>首先，我们需要定义模型相关的操作类型：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//{ first : counter.model, second : counter.model }</span>\n\n<span class="token keyword">const</span> <span class="token constant">RESET</span>         <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'reset\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE_FIRST</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update first\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE_SECOND</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update second\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>该模型导出两个属性：first 和 second 分别保存两个计数器的状态。我们定义了三个操作类型：第一个用来将计数器重置为 0，另外两个后面也会讲到。</p>\n<p>组件通过 init 方法创建 state。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span> first<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> second<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>view 函数负责展示这两个计数器，并为用户提供一个重置按钮。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">RESET</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Reset\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">first</span><span class="token punctuation">,</span> <span class="token parameter">counterAction</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">UPDATE_FIRST</span><span class="token punctuation">,</span> data<span class="token operator">:</span> counterAction<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">second</span><span class="token punctuation">,</span> <span class="token parameter">counterAction</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">UPDATE_SECOND</span><span class="token punctuation">,</span> data<span class="token operator">:</span> counterAction<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    \n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们给 view 方法传递了两个参数：</p>\n<ol>\n<li>每个视图都会获得父组件的部分状态（model.first / model.second）</li>\n<li>动态处理函数，它会传递到每个子节点的 view 。比如：第一个计数器触发了一个动作，我们会将 <code>UPDATE_FIRST</code> 封装在 action 中，当父类的 update 方法被调用时，我们会将计数器需要的 action（存储在 data 属性中）转发到正确的计数器，并调用计数器的 update 方法。</li>\n</ol>\n<p>下面看看 update 函数的实现，并导出组件的所有属性。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">RESET</span>     <span class="token operator">?</span>\n            <span class="token punctuation">{</span> \n              first <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n              second<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE_FIRST</span>   <span class="token operator">?</span>\n            <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span> first <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">first</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE_SECOND</span>  <span class="token operator">?</span>\n            <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span> second <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">second</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> model<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> init<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">UPDATE_FIRST</span><span class="token punctuation">,</span> <span class="token constant">UPDATE_SECOND</span><span class="token punctuation">,</span> <span class="token constant">RESET</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>update 函数处理3个操作:</p>\n<ol>\n<li><code>RESET</code> 操作会调用 init 将每个计数器重置到默认状态。</li>\n<li><code>UPDATE_FIRST</code> 和 <code>UPDATE_SECOND</code>，会封装一个计数器需要 action。函数将封装好的 action 连同其 state 转发给相关的子计数器。</li>\n</ol>\n<p><code>{...model, prop: val};</code> 是 ES7 的对象扩展属性（如object .assign），它总是返回一个新的对象。我们不修改参数中传递的 state ，而是始终返回一个相同属性的新 state 对象，确保更新函数是一个纯函数。</p>\n<p>最后调用 main 方法，构造顶层组件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">main</span><span class="token punctuation">(</span>\n  twoCounters<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// the initial state </span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n  twoCounters\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>“towCounters” 展示了经典的嵌套组件的使用模式：</p>\n<ol>\n<li>组件通过类似于树的层次结构进行组织。</li>\n<li>main 函数调用顶层组件的 view 方法，并将全局的初始状态和处理回调（main handler）作为参数。</li>\n<li>在视图渲染的时候，父组件调用子组件的 view 函数，并将子组件相关的 state 传给子组件。</li>\n<li>视图将用户事件转化为对程序更有意义的 actions。</li>\n<li>从子组件触发的操作会通过父组件向上传递，直到顶层组件。与 DOM 事件的冒泡不同，父组件不会在此阶段进行操作，它能做的就是将相关信息添加到 action 中。</li>\n<li>在冒泡阶段，父组件的 view 函数可以拦截子组件的 actions ，并扩展一些必要的数据。</li>\n<li>该操作最终在主处理程序（main handler）中结束，主处理程序将通过调用顶部组件的 update 函数进行派发操作。</li>\n<li>每个父组件的 update 函数负责将操作分派给其子组件的 update 函数。通常使用在冒泡阶段添加了相关信息的 action。</li>\n</ol>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%B8%89%E8%AE%A1%E6%95%B0%E5%99%A8%E5%88%97%E8%A1%A8">案例三：计数器列表<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%B8%89%E8%AE%A1%E6%95%B0%E5%99%A8%E5%88%97%E8%A1%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-3">counter-3 branch</a></p>\n</blockquote>\n<p>让我们继续来看 Elm 的教程，我们将进一步扩展我们的示例，可以管理任意数量的计数器列表。此外还提供新增计数器和删除计数器的按钮。</p>\n<p>“counter” 组件代码保持不变，我们将定义一个新组件 <code>counterList</code> 来管理计数器数组。</p>\n<p>我们先来定义模型，和一组关联操作。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/*\nmodel : {\n  counters: [{id: Number, counter: counter.model}],\n  nextID  : Number\n}\n*/</span>\n\n<span class="token keyword">const</span> <span class="token constant">ADD</span>     <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'add\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update counter\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">REMOVE</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'remove\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">RESET</span>   <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'reset\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>组件的模型包括了两个参数：</p>\n<ol>\n<li>一个由对象（id，counter）组成的列表，id 属性与前面实例的 first 和 second 属性作用类似；它将标识每个计数器的唯一性。</li>\n<li><code>nextID</code> 用来维护一个做自动递增的基数，每个新添加的计数器都会使用 <code>nextID + 1</code> 来作为它的 ID。</li>\n</ol>\n<p>接下来，我们定义 <code>init</code> 方法，它将构造一个默认的 state。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  <span class="token punctuation">{</span> nextID<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> counters<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>下面定义一个 view 函数。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">ADD</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Add\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">RESET</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Reset\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div.counter-list\'</span><span class="token punctuation">,</span> model<span class="token punctuation">.</span><span class="token property-access">counters</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token arrow operator">=></span> <span class="token function">counterItemView</span><span class="token punctuation">(</span>item<span class="token punctuation">,</span> handler<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    \n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>视图提供了两个按钮来触发“添加”和“重置”操作。每个计数器的都通过 <code>counterItemView</code> 函数来生成虚拟 DOM。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">counterItemView</span><span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div.counter-item\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>key<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button.remove\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token function-variable function">click</span><span class="token operator">:</span> <span class="token parameter">e</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">REMOVE</span><span class="token punctuation">,</span> id<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">}</span><span class="token punctuation">)</span>  <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Remove\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token property-access">counter</span><span class="token punctuation">,</span> <span class="token parameter">a</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">UPDATE</span><span class="token punctuation">,</span> id<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> data<span class="token operator">:</span> a<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该函数添加了一个 remove 按钮在视图中，并引用了计数器的 id 添加到 remove 的 action 中。</p>\n<p>接下来看看 update 函数。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> resetAction <span class="token operator">=</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token property-access">actions</span><span class="token punctuation">.</span><span class="token constant">INIT</span><span class="token punctuation">,</span> data<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  \n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">ADD</span>     <span class="token operator">?</span> <span class="token function">addCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">RESET</span>   <span class="token operator">?</span> <span class="token function">resetCounters</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">REMOVE</span>  <span class="token operator">?</span> <span class="token function">removeCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE</span>  <span class="token operator">?</span> <span class="token function">updateCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> \n        <span class="token operator">:</span> model<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">ADD</span><span class="token punctuation">,</span> <span class="token constant">RESET</span><span class="token punctuation">,</span> <span class="token constant">REMOVE</span><span class="token punctuation">,</span> <span class="token constant">UPDATE</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>该代码遵循上一个示例的相同的模式，使用冒泡阶段存储的 id 信息，将子节点的 actions 转发到顶层组件。下面是 update 的一个分支 “updateCounter” 。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">updateCounter</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> id<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span>\n    counters  <span class="token operator">:</span> model<span class="token punctuation">.</span><span class="token property-access">counters</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token arrow operator">=></span> \n      item<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">!==</span> id <span class="token operator">?</span> \n          item\n        <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>item<span class="token punctuation">,</span> \n            counter <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token property-access">counter</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面这种模式可以应用于任何树结构嵌套的组件结构中，通过这种模式，我们让整个应用程序的结构进行了统一。</p>\n<h3 id="%E5%9C%A8-actions-%E4%B8%AD%E4%BD%BF%E7%94%A8-union-%E7%B1%BB%E5%9E%8B">在 actions 中使用 union 类型<a class="anchor" href="#%E5%9C%A8-actions-%E4%B8%AD%E4%BD%BF%E7%94%A8-union-%E7%B1%BB%E5%9E%8B">§</a></h3>\n<p>在前面的示例中，我们使用 ES6 的 Symbols 类型来表示操作类型。在视图内部，我们创建了带有操作类型和附加信息（id，子节点的 action）的对象。</p>\n<p>在真实的场景中，我们必须将 action 的创建逻辑移动到一个单独的工厂函数中（类似于React/Flux中的 Action Creators）。在这篇文章的剩余部分，我将提出一个更符合 FP 精神的替代方案：union 类型。它是 FP 语言（如Haskell）中使用的 <a href="https://en.wikipedia.org/wiki/Algebraic_data_type">代数数据类型</a> 的子集，您可以将它们看作具有更强大功能的枚举。</p>\n<p>union类型可以为我们提供以下特性：</p>\n<ol>\n<li>定义一个可描述所有可能的 actions 的类型。</li>\n<li>为每个可能的值提供一个工厂函数。</li>\n<li>提供一个可控的流来处理所有可能的变量。</li>\n</ol>\n<p>union 类型在 JavaScript 中不是原生的，但是我们可以使用一个库来模拟它。在我们的示例中，我们使用 union-type (<a href="https://github.com/paldepind/union-type">github/union-type</a>) ，这是 snabbdom 作者编写的一个小而美的库。</p>\n<p>先让我们安装这个库：</p>\n<pre class="language-autoit"><code class="language-autoit">npm install <span class="token operator">-</span><span class="token operator">-</span>save union<span class="token operator">-</span>type\n</code></pre>\n<p>下面我们来定义计数器的 actions：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Type</span></span> <span class="token keyword module">from</span> <span class="token string">\'union-type\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token maybe-class-name">Action</span> <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Type</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Increment</span> <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Decrement</span> <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Type</code> 是该库导出的唯一函数。我们使用它来定义 union 类型 <code>Action</code>，其中包含两个可能的 actions。</p>\n<p>返回的 <code>Action</code> 具有一组工厂函数，用于创建所有可能的操作。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access"><span class="token maybe-class-name">Increment</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'+\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access"><span class="token maybe-class-name">Decrement</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'-\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Count : </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>count<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 view 创建递增和递减两种 action。update 函数展示了 uinon 如何对不同类型的 action 进行模式匹配。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access">case</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Increment</span></span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Decrement</span></span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> count <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>Action</code> 具有一个 <code>case</code> 方法，该方法接受两个参数：</p>\n<ul>\n<li>一个对象（变量名和一个回调函数）</li>\n<li>要匹配的值</li>\n</ul>\n<p>然后，case方法将提供的 action 与所有指定的变量名相匹配，并调用相应的处理函数。返回值是匹配的回调函数的返回值。</p>\n<p>类似地，我们看看如何定义 <code>counterList</code> 的 actions</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token maybe-class-name">Action</span> <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Type</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Add</span>     <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Remove</span>  <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token known-class-name class-name">Number</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Reset</span>   <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Update</span>  <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token known-class-name class-name">Number</span><span class="token punctuation">,</span> counter<span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Action</span></span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Add</code>和<code>Reset</code>是空数组(即它们没有任何字段)，<code>Remove</code>只有一个字段（计数器的 id）。最后，<code>Update</code> 操作有两个字段：计数器的 id 和计数器触发时的 action。</p>\n<p>与之前一样，我们在 update 函数中进行模式匹配。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  \n  <span class="token keyword control-flow">return</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access">case</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Add</span></span>     <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">addCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Remove</span></span>  <span class="token operator">:</span> <span class="token parameter">id</span> <span class="token arrow operator">=></span> <span class="token function">removeCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> id<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Reset</span></span>   <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">resetCounters</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span><span class="token punctuation">,</span> \n    <span class="token function-variable function"><span class="token maybe-class-name">Update</span></span>  <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">updateCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> id<span class="token punctuation">,</span> action<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>注意，<code>Remove</code> 和 <code>Update</code> 都会接受参数。如果匹配成功，<code>case</code> 方法将从 case 实例中提取字段并将它们传递给对应的回调函数。</p>\n<p>所以典型的模式是：</p>\n<ul>\n<li>将 actions 建模为union类型。</li>\n<li>在 view 函数中，使用 union 类型提供的工厂函数创建 action （如果创建的逻辑更复杂，还可以将操作创建委托给单独的函数）。</li>\n<li>在 update 函数中，使用 <code>case</code> 方法来匹配 union 类型的可能值。</li>\n</ul>\n<h2 id="todomvc%E4%BE%8B%E5%AD%90">TodoMVC例子<a class="anchor" href="#todomvc%E4%BE%8B%E5%AD%90">§</a></h2>\n<p>在这个仓库中(<a href="https://github.com/yelouafi/snabbdom-todomvc">github/yelouafi/snabbdom-todomvc</a>)，使用本文提到的规范进行了 todoMVC 应用的实现。应用程序由2个模块组成：</p>\n<ul>\n<li><code>task.js</code> 定义一个呈现单个任务并更新其状态的组件</li>\n<li><code>todos.js</code>，它管理任务列表以及过滤和更新</li>\n</ul>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>我们已经了解了如何使用小而美的虚 拟DOM 库编写应用程序。当我们不想被迫选择使用React框架（尤其是 class），或者当我们需要一个小型 JavaScript 库时，这将非常有用。</p>\n<p><em>Elm architecture</em> 提供了一个简单的模式来编写复杂的虚拟DOM应用，具有纯函数的所有优点。这为我们的代码提供了一个简单而规范的结构。使用标准的模式使得应用程序更容易维护，特别是在成员频繁更改的团队中。新成员可以快速掌握代码的总体架构。</p>\n<p>由于完全用纯函数实现的，我确信只要组件代码遵守其约定，更改组件就不会产生不良的副作用。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u3010\u7FFB\u8BD1\u3011\u57FA\u4E8E\u865A\u62DFDOM\u5E93(Snabbdom)\u7684\u8FF7\u4F60React"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<blockquote>\n<p><a href="https://medium.com/@yelouafi/react-less-virtual-dom-with-snabbdom-functions-everywhere-53b672cb2fe3">原文链接</a></p>\n</blockquote>\n<blockquote>\n<p>原文写于 2015-07-31，虽然时间比较久远，但是对于我们理解虚拟 DOM 和 view 层之间的关系还是有很积极的作用的。</p>\n</blockquote>\n<p>React 是 JavaScript 社区的新成员，尽管 JSX （在 JavaScript 中使用 HTML 语法）存在一定的争议，但是对于虚拟 DOM 人们有不一样的看法。</p>\n<p>对于不熟悉的人来说，虚拟 DOM 可以描述为某个时刻真实DOM的简单表示。其思想是：每次 UI 状态发生更改时，重新创建一个虚拟 DOM，而不是直接使用命令式的语句更新真实 DOM ，底层库将对应的更新映射到真实 DOM 上。</p>\n<p>需要注意的是，更新操作并没有替换整个 DOM 树（例如使用 innerHTML 重新设置 HTML 字符串），而是替换 DOM 节点中实际修改的部分（改变节点属性、添加子节点）。这里使用的是增量更新，通过比对新旧虚拟 DOM 来推断更新的部分，然后将更新的部分通过补丁的方式更新到真实 DOM 中。</p>\n<p>虚拟 DOM 因为高效的性能经常受到特别的关注。但是还有一项同样重要的特性，虚拟 DOM 可以把 UI 表示为状态函数的映射（PS. 也就是我们常说的 <code>UI = render(state)</code>），这也使得编写 web 应用有了新的形式。</p>\n<p>在本文中，我们将研究虚拟 DOM 的概念如何引用到 web 应用中。我们将从简单的例子开始，然后给出一个架构来编写基于 Virtual DOM 的应用。</p>\n<p>为此我们将选择一个独立的 JavaScript 虚拟 DOM 库，因为我们希望依赖最小化。本文中，我们将使用 snabbdom(<a href="https://github.com/snabbdom/snabbdom">paldepind/snabbdom</a>)，但是你也可以使用其他类似的库，比如 Matt Esch 的 <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a></p>\n<h2 id="snabbdom%E7%AE%80%E6%98%93%E6%95%99%E7%A8%8B">snabbdom简易教程<a class="anchor" href="#snabbdom%E7%AE%80%E6%98%93%E6%95%99%E7%A8%8B">§</a></h2>\n<p>snabbdom 是一个模块化的库，所以，我们需要使用一个打包工具，比如 webpack。</p>\n<p>首先，让我们看看如何进行 snabbdom 的初始化。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">snabbdom</span> <span class="token keyword module">from</span> <span class="token string">\'snabbdom\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> patch <span class="token operator">=</span> snabbdom<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">[</span>                 <span class="token comment">// 指定模块初始化 patch 方法</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/class\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 切换 class </span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/props\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 设置 DOM 元素的属性</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/style\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>          <span class="token comment">// 处理元素的 style ，支持动画</span>\n  <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'snabbdom/modules/eventlisteners\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 事件处理</span>\n<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>上面的代码中，我们初始化了 snabbdom 模块并添加了一些扩展。在 snabbdom 中，切换 class、style还有 DOM 元素上的属性设置和事件绑定都是给不同模块实现的。上面的实例，只使用了默认提供的模块。</p>\n<p>核心模块只暴露了一个 <code>patch</code> 方法，它由 init 方法返回。我们使用它创建初始化的 DOM，之后也会使用它来进行 DOM 的更新。</p>\n<p>下面是一个 Hello World 示例：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">h</span> <span class="token keyword module">from</span> <span class="token string">\'snabbdom/h\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> vnode <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>style<span class="token operator">:</span> <span class="token punctuation">{</span>fontWeight<span class="token operator">:</span> <span class="token string">\'bold\'</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Hello world\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">patch</span><span class="token punctuation">(</span><span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> vnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>h</code> 是一个创建虚拟 DOM 的辅助函数。我们将在文章后面介绍具体用法，现在只需要该函数的 3 个输入参数：</p>\n<ol>\n<li>一个 CSS 选择器（jQuery 的选择器），比如 <code>div#id.class</code>。</li>\n<li>一个可选的数据对象，它包含了虚拟节点的属性（class、styles、events）。</li>\n<li>一个字符串或者虚拟 DOM 的数组（用于表示该节点的children）。</li>\n</ol>\n<p>第一次调用的时候，patch 方法需要一个 DOM 占位符和一个初始的虚拟 DOM，然后它会根据虚拟 DOM 创建一个对应的真实 DO树。在随后的的调用中，我们为它提供新旧两个虚拟 DOM，然后它通过 diff 算法比对这两个虚拟 DOM，并找出更新的部分对真实 DOM 进行必要的修改 ，使得真实的 DOM 树为最新的虚拟 DOM 的映射。</p>\n<p>为了快速上手，我在 GitHub 上创建了一个仓库，其中包含了项目的必要内容。下面让我们来克隆这个仓库（<a href="https://github.com/yelouafi/snabbdom-starter">yelouafi/snabbdom-starter</a>），然后运行 <code>npm install</code> 安装依赖。这个仓库使用 Browserify 作为打包工具，文件变更后使用 Watchify 自动重新构建，并且通过 Babel 将 ES6 的代码转成兼容性更好的 ES5。</p>\n<p>下面运行如下代码：</p>\n<pre class="language-autoit"><code class="language-autoit">npm run watch\n</code></pre>\n<p>这段代码将启动 watchify 模块，它会在 app 文件夹内，创建一个浏览器能够运行的包：<code>build.js</code> 。模块还将检测我们的 js 代码是否发生改变，如果有修改，会自动的重新构建 <code>build.js</code>。（如果你想手动构建，可以使用：<code>npm run build</code>）</p>\n<p>在浏览器中打开 <code>app/index.html</code> 就能运行程序，这时候你会在屏幕上看到 “Hello World”。</p>\n<p>这篇文中的所有案例都能在特定的分支上进行实现，我会在文中链接到每个分支，同时 <a href="http://README.md">README.md</a> 文件也包含了所有分支的链接。</p>\n<h3 id="%E5%8A%A8%E6%80%81%E8%A7%86%E5%9B%BE">动态视图<a class="anchor" href="#%E5%8A%A8%E6%80%81%E8%A7%86%E5%9B%BE">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/dynamic-view">dynamic-view branch</a></p>\n</blockquote>\n<p>为了突出虚拟 DOM 动态化的优势，接下来会构建一个很简单的时钟。</p>\n<p>首先修改 <code>app/js/main.js</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">currentDate</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token string">\'Current date \'</span> <span class="token operator">+</span> currentDate<span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> oldVnode <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">setInterval</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  oldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过单独的函数 <code>view</code> 来生成虚拟 DOM，它接受一个状态（当前日期）作为输入。</p>\n<p>该案例展示了虚拟 DOM 的经典使用方式，在不同的时刻构造出新的虚拟 DOM，然后将新旧虚拟 DOM 进行对比，并更新到真实 DOM 上。案例中，我们每秒都构造了一个虚拟 DOM，并用它来更新真实 DOM。</p>\n<h3 id="%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94">事件响应<a class="anchor" href="#%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/event-reactivity">event-reactivity branch</a></p>\n</blockquote>\n<p>下面的案例介绍了通过事件系统完成一个打招呼的应用程序：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'input\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> placeholder<span class="token operator">:</span> <span class="token string">\'Type  your name\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> input<span class="token operator">:</span> update <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token string">\'Hello \'</span> <span class="token operator">+</span> name<span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> oldVnode <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token property-access">target</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  oldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n\noldVnode <span class="token operator">=</span> <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在 snabbdom 中，我们使用 props 对象来设置元素的属性，props 模块会对 props 对象进行处理。类似地，我们通过 on 对象进行元素的时间绑定，eventlistener 模块会对 on 对象进行处理。</p>\n<p>上面的案例中，update 函数执行了与前面案例中 setInterval 类似的事情：从传入的事件对象中提取出 input 的值，构造出一个新的虚拟 DOM，然后调用 patch ，用新的虚拟 DOM 树更新真实 DOM。</p>\n<h2 id="%E5%A4%8D%E6%9D%82%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F">复杂的应用程序<a class="anchor" href="#%E5%A4%8D%E6%9D%82%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F">§</a></h2>\n<p>使用独立的虚拟 DOM 库的好处是，我们在构建自己的应用时，可以按照自己喜欢的方式来做。你可以使用 MVC 的设计模式，可以使用更现代化的数据流体系，比如 Flux。</p>\n<p>在这篇文章中，我会介绍一种不太为人所知的架构模式，是我之前在 Elm（一种可编译成 JavaScript 的 函数式语言）中使用过的。Elm 的开发者称这种模式为 <a href="https://github.com/evancz/elm-architecture-tutorial/"> Elm Architecture</a>，它的主要优点是允许我们将整个应用编写为一组纯函数。</p>\n<h3 id="%E4%B8%BB%E6%B5%81%E7%A8%8B">主流程<a class="anchor" href="#%E4%B8%BB%E6%B5%81%E7%A8%8B">§</a></h3>\n<p>让我们回顾一下上个案例的主流程：</p>\n<ol>\n<li>通过 view 函数构造出我们初始的虚拟 DOM，在 view 函数中，给 input 输入框添加了一个 input 事件。</li>\n<li>通过 patch 将虚拟 DOM 渲染到真实 DOM 中，并将 input 事件绑定到真实 DOM 上。</li>\n<li>等待用户输入……</li>\n<li>用户输入内容，触发 input 事件，然后调用 update 函数</li>\n<li>在 update 函数中，我们更新了状态</li>\n<li>我们传入了新的状态给 view 函数，并生成新的虚拟 DOM （与步骤 1 相同）</li>\n<li>再次调用 patch，重复上述过程（与步骤 2 相同）</li>\n</ol>\n<p>上面的过程可以描述成一个循环。如果去掉实现的一些细节，我们可以建立一个抽象的函数调用序列。</p>\n<p><img src="https://file.shenfq.com/FvyObN9fMncD7cMXJYfZOFQJFQ--.png" alt="主流程"></p>\n<p><code>user</code> 是用户交互的抽象，我们得到的是函数调用的循环序列。注意，<code>user</code> 函数是异步的，否则这将是一个无限的死循环。</p>\n<p>让我们将上述过程转换为代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">initState<span class="token punctuation">,</span> element<span class="token punctuation">,</span> <span class="token punctuation">{</span>view<span class="token punctuation">,</span> update<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newVnode <span class="token operator">=</span> <span class="token function">view</span><span class="token punctuation">(</span>initState<span class="token punctuation">,</span> <span class="token parameter">event</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newState <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>initState<span class="token punctuation">,</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">main</span><span class="token punctuation">(</span>newState<span class="token punctuation">,</span> newVnode<span class="token punctuation">,</span> <span class="token punctuation">{</span>view<span class="token punctuation">,</span> update<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token function">patch</span><span class="token punctuation">(</span>oldVnode<span class="token punctuation">,</span> newVnode<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>main</code> 函数反映了上述的循环过程：给定一个初始状态（initState），一个 DOM 节点和一个<em>顶层组件</em>（view + update），<code>main</code> 通过当前的状态经过 view 函数构建出新的虚拟 DOM，然后通过补丁的方式更新到真实 DOM上。</p>\n<p>传递给 <code>view</code> 函数的参数有两个：首先是<em>当前</em>状态，其次是事件处理的回调函数，对生成的视图中触发的事件进行处理。回调函数主要负责为应用程序构建一个新的状态，并使用新的状态重启 UI 循环。</p>\n<p>新状态的构造委托给顶层组件的 <code>update</code> 函数，该函数是一个简单的纯函数：无论何时，给定当前状态和当前程序的输入（事件或行为），它都会为程序返回一个新的状态。</p>\n<p>要注意的是，除了 patch 方法会有副作用，主函数内不会有任何改变状态行为发生。</p>\n<p>main 函数有点类似于低级GUI框架的 <code>main</code> 事件循环，这里的重点是收回对 UI 事件分发流程的控制: 在实际状态下，DOM API通过采用观察者模式强制我们进行事件驱动，但是我们不想在这里使用观察者模式，下面就会讲到。</p>\n<h3 id="elm-%E6%9E%B6%E6%9E%84elm-architecture">Elm 架构（Elm architecture）<a class="anchor" href="#elm-%E6%9E%B6%E6%9E%84elm-architecture">§</a></h3>\n<p><img src="https://file.shenfq.com/Fs8usRuYQCOKL621r-fRyMsr9ZcI.png" alt="Elm architecture"></p>\n<p>基于 Elm-architecture 的程序中，是由一个个模块或者说组件构成的。每个组件都有两个基本函数：<code>update</code>和<code>view</code>，以及一个特定的数据结构：组件拥有的 <code>model</code> 以及更新该 <code>model</code> 实例的 <code>actions</code>。</p>\n<ol>\n<li><code>update</code> 是一个纯函数，接受两个参数：组件拥有的 <code>model</code> 实例，表示当前的状态（state），以及一个 <code>action</code> 表示需要执行的更新操作。它将返回一个新的 <code>model</code> 实例。</li>\n<li><code>view</code> 同样接受两个参数：当前 <code>model</code> 实例和一个事件通道，它可以通过多种形式传播数据，在我们的案例中，将使用一个简单的回调函数。该函数返回一个新的虚拟 DOM，该虚拟 DOM 将会渲染成真实 DOM。</li>\n</ol>\n<p>如上所述，Elm architecture 摆脱了传统的由事件进行驱动观察者模式。相反该架构倾向于集中式的管理数据（比如 React/Flux），任何的事件行为都会有两种方式：</p>\n<ol>\n<li>冒泡到顶层组件；</li>\n<li>通过组件树的形式进行下发，在此阶段，每个组件都可以选择自己的处理方式，或者转发给其他一个或所有子组件。</li>\n</ol>\n<p>该架构的另一个关键点，就是将程序需要的整个状态都保存在一个对象中。树中的每个组件都负责将它们拥有的状态的一部分传递给子组件。</p>\n<p>在我们的案例中，我们将使用与 Elm 网站相同的案例，因为它完美的展示了该模式。</p>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%B8%80%E8%AE%A1%E6%95%B0%E5%99%A8">案例一：计数器<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%B8%80%E8%AE%A1%E6%95%B0%E5%99%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-1">counter-1 branch</a></p>\n</blockquote>\n<p>我们在 “counter.js” 中定义了 counter 组件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token constant">INC</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'inc\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">DEC</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'dec\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// model : Number</span>\n<span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">INC</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'+\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">DEC</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'-\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Count : </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>count<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">INC</span> <span class="token operator">?</span> count <span class="token operator">+</span> <span class="token number">1</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">DEC</span> <span class="token operator">?</span> count <span class="token operator">-</span> <span class="token number">1</span>\n        <span class="token operator">:</span> count<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">INC</span><span class="token punctuation">,</span> <span class="token constant">DEC</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>counter 组件由以下属性组成：</p>\n<ol>\n<li>Model： 一个简单的 <code>Number</code></li>\n<li>View：为用户提供两个按钮，用户递增、递减计数器，以及显示当前数字</li>\n<li>Update：接受两个动作：INC / DEC，增加或减少计数器的值</li>\n</ol>\n<p>首先要注意的是，view/update 都是纯函数，除了输入之外，他们不依赖任何外部环境。计数器组件本身不包括任何状态或变量，它只会从给定的状态构造出固定的视图，以及通过给定的状态更新视图。由于其纯粹性，计数器组件可以轻松的插入任何提供依赖（state 和 action）环境。</p>\n<p>其次需要注意 <code>handler.bind(null, action)</code> 表达式，每次点击按钮，事件监听器都会触发该函数。我们将原始的用户事件转换为一个有意义的操作（递增或递减），使用了 ES6 的 Symbol 类型，比原始的字符串类型更好（避免了操作名称冲突的问题），稍后我们还将看到更好的解决方案：使用 union 类型。</p>\n<p>下面看看如何进行组件的测试，我们使用了 “tape” 测试库：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports">test</span> <span class="token keyword module">from</span> <span class="token string">\'tape\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> update<span class="token punctuation">,</span> actions <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'../app/js/counter\'</span><span class="token punctuation">;</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token string">\'counter update function\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">assert</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    \n  <span class="token keyword">var</span> count <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>\n  count <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> actions<span class="token punctuation">.</span><span class="token constant">INC</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  assert<span class="token punctuation">.</span><span class="token method function property-access">equal</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  count <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> actions<span class="token punctuation">.</span><span class="token constant">DEC</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  assert<span class="token punctuation">.</span><span class="token method function property-access">equal</span><span class="token punctuation">(</span>count<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  assert<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>我们可以直接使用 babel-node 来进行测试</p>\n<pre class="language-autoit"><code class="language-autoit">babel<span class="token operator">-</span>node test<span class="token operator">/</span>counterTest<span class="token punctuation">.</span>js\n</code></pre>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%BA%8C%E4%B8%A4%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8">案例二：两个计数器<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%BA%8C%E4%B8%A4%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-2">counter-2 branch</a></p>\n</blockquote>\n<p>我们将和 Elm 官方教程保持同步，增加计数器的数量，现在我们会有2个计数器。此外，还有一个“重置”按钮，将两个计数器同时重置为“0”;</p>\n<p>首先，我们需要修改计数器组件，让该组件支持重置操作。为此，我们将引入一个新函数 <code>init</code>，其作用是为计数器构造一个新状态 (count)。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>init</code> 在很多情况下都非常有用。例如，使用来自服务器或本地存储的数据初始化状态。它通过 JavaScript 对象创建一个丰富的数据模型(例如，为一个 JavaScript 对象添加一些原型属性或方法)。</p>\n<p><code>init</code> 与 <code>update</code> 有一些区别：后者执行一个更新操作，然后从一个状态派生出新的状态；但是前者是使用一些输入值（比如：默认值、服务器数据等等）构造一个状态，输入值是可选的，而且完全不管前一个状态是什么。</p>\n<p>下面我们将通过一些代码管理两个计数器，我们在 <code>towCounters.js</code> 中实现我们的代码。</p>\n<p>首先，我们需要定义模型相关的操作类型：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//{ first : counter.model, second : counter.model }</span>\n\n<span class="token keyword">const</span> <span class="token constant">RESET</span>         <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'reset\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE_FIRST</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update first\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE_SECOND</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update second\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>该模型导出两个属性：first 和 second 分别保存两个计数器的状态。我们定义了三个操作类型：第一个用来将计数器重置为 0，另外两个后面也会讲到。</p>\n<p>组件通过 init 方法创建 state。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span> first<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> second<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>view 函数负责展示这两个计数器，并为用户提供一个重置按钮。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">RESET</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Reset\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">first</span><span class="token punctuation">,</span> <span class="token parameter">counterAction</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">UPDATE_FIRST</span><span class="token punctuation">,</span> data<span class="token operator">:</span> counterAction<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">second</span><span class="token punctuation">,</span> <span class="token parameter">counterAction</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">UPDATE_SECOND</span><span class="token punctuation">,</span> data<span class="token operator">:</span> counterAction<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    \n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们给 view 方法传递了两个参数：</p>\n<ol>\n<li>每个视图都会获得父组件的部分状态（model.first / model.second）</li>\n<li>动态处理函数，它会传递到每个子节点的 view 。比如：第一个计数器触发了一个动作，我们会将 <code>UPDATE_FIRST</code> 封装在 action 中，当父类的 update 方法被调用时，我们会将计数器需要的 action（存储在 data 属性中）转发到正确的计数器，并调用计数器的 update 方法。</li>\n</ol>\n<p>下面看看 update 函数的实现，并导出组件的所有属性。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">RESET</span>     <span class="token operator">?</span>\n            <span class="token punctuation">{</span> \n              first <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n              second<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE_FIRST</span>   <span class="token operator">?</span>\n            <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span> first <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">first</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE_SECOND</span>  <span class="token operator">?</span>\n            <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span> second <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token property-access">second</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n            \n        <span class="token operator">:</span> model<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> init<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">UPDATE_FIRST</span><span class="token punctuation">,</span> <span class="token constant">UPDATE_SECOND</span><span class="token punctuation">,</span> <span class="token constant">RESET</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>update 函数处理3个操作:</p>\n<ol>\n<li><code>RESET</code> 操作会调用 init 将每个计数器重置到默认状态。</li>\n<li><code>UPDATE_FIRST</code> 和 <code>UPDATE_SECOND</code>，会封装一个计数器需要 action。函数将封装好的 action 连同其 state 转发给相关的子计数器。</li>\n</ol>\n<p><code>{...model, prop: val};</code> 是 ES7 的对象扩展属性（如object .assign），它总是返回一个新的对象。我们不修改参数中传递的 state ，而是始终返回一个相同属性的新 state 对象，确保更新函数是一个纯函数。</p>\n<p>最后调用 main 方法，构造顶层组件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">main</span><span class="token punctuation">(</span>\n  twoCounters<span class="token punctuation">.</span><span class="token method function property-access">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// the initial state </span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'placeholder\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n  twoCounters\n<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>“towCounters” 展示了经典的嵌套组件的使用模式：</p>\n<ol>\n<li>组件通过类似于树的层次结构进行组织。</li>\n<li>main 函数调用顶层组件的 view 方法，并将全局的初始状态和处理回调（main handler）作为参数。</li>\n<li>在视图渲染的时候，父组件调用子组件的 view 函数，并将子组件相关的 state 传给子组件。</li>\n<li>视图将用户事件转化为对程序更有意义的 actions。</li>\n<li>从子组件触发的操作会通过父组件向上传递，直到顶层组件。与 DOM 事件的冒泡不同，父组件不会在此阶段进行操作，它能做的就是将相关信息添加到 action 中。</li>\n<li>在冒泡阶段，父组件的 view 函数可以拦截子组件的 actions ，并扩展一些必要的数据。</li>\n<li>该操作最终在主处理程序（main handler）中结束，主处理程序将通过调用顶部组件的 update 函数进行派发操作。</li>\n<li>每个父组件的 update 函数负责将操作分派给其子组件的 update 函数。通常使用在冒泡阶段添加了相关信息的 action。</li>\n</ol>\n<h3 id="%E6%A1%88%E4%BE%8B%E4%B8%89%E8%AE%A1%E6%95%B0%E5%99%A8%E5%88%97%E8%A1%A8">案例三：计数器列表<a class="anchor" href="#%E6%A1%88%E4%BE%8B%E4%B8%89%E8%AE%A1%E6%95%B0%E5%99%A8%E5%88%97%E8%A1%A8">§</a></h3>\n<blockquote>\n<p>本例的源代码在 <a href="https://github.com/yelouafi/snabbdom-starter/tree/counter-3">counter-3 branch</a></p>\n</blockquote>\n<p>让我们继续来看 Elm 的教程，我们将进一步扩展我们的示例，可以管理任意数量的计数器列表。此外还提供新增计数器和删除计数器的按钮。</p>\n<p>“counter” 组件代码保持不变，我们将定义一个新组件 <code>counterList</code> 来管理计数器数组。</p>\n<p>我们先来定义模型，和一组关联操作。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/*\nmodel : {\n  counters: [{id: Number, counter: counter.model}],\n  nextID  : Number\n}\n*/</span>\n\n<span class="token keyword">const</span> <span class="token constant">ADD</span>     <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'add\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">UPDATE</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'update counter\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">REMOVE</span>  <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'remove\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token constant">RESET</span>   <span class="token operator">=</span> <span class="token known-class-name class-name">Symbol</span><span class="token punctuation">(</span><span class="token string">\'reset\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>组件的模型包括了两个参数：</p>\n<ol>\n<li>一个由对象（id，counter）组成的列表，id 属性与前面实例的 first 和 second 属性作用类似；它将标识每个计数器的唯一性。</li>\n<li><code>nextID</code> 用来维护一个做自动递增的基数，每个新添加的计数器都会使用 <code>nextID + 1</code> 来作为它的 ID。</li>\n</ol>\n<p>接下来，我们定义 <code>init</code> 方法，它将构造一个默认的 state。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  <span class="token punctuation">{</span> nextID<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> counters<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>下面定义一个 view 函数。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">ADD</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Add\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">RESET</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Reset\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div.counter-list\'</span><span class="token punctuation">,</span> model<span class="token punctuation">.</span><span class="token property-access">counters</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token arrow operator">=></span> <span class="token function">counterItemView</span><span class="token punctuation">(</span>item<span class="token punctuation">,</span> handler<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    \n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>视图提供了两个按钮来触发“添加”和“重置”操作。每个计数器的都通过 <code>counterItemView</code> 函数来生成虚拟 DOM。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">counterItemView</span><span class="token punctuation">(</span><span class="token parameter">item<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div.counter-item\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>key<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button.remove\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token function-variable function">click</span><span class="token operator">:</span> <span class="token parameter">e</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token constant">REMOVE</span><span class="token punctuation">,</span> id<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">}</span><span class="token punctuation">)</span>  <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'Remove\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    counter<span class="token punctuation">.</span><span class="token method function property-access">view</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token property-access">counter</span><span class="token punctuation">,</span> <span class="token parameter">a</span> <span class="token arrow operator">=></span> <span class="token function">handler</span><span class="token punctuation">(</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token constant">UPDATE</span><span class="token punctuation">,</span> id<span class="token operator">:</span> item<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> data<span class="token operator">:</span> a<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'hr\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该函数添加了一个 remove 按钮在视图中，并引用了计数器的 id 添加到 remove 的 action 中。</p>\n<p>接下来看看 update 函数。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> resetAction <span class="token operator">=</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token property-access">actions</span><span class="token punctuation">.</span><span class="token constant">INIT</span><span class="token punctuation">,</span> data<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  \n  <span class="token keyword control-flow">return</span>  action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">ADD</span>     <span class="token operator">?</span> <span class="token function">addCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">RESET</span>   <span class="token operator">?</span> <span class="token function">resetCounters</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">REMOVE</span>  <span class="token operator">?</span> <span class="token function">removeCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">)</span>\n        <span class="token operator">:</span> action<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token constant">UPDATE</span>  <span class="token operator">?</span> <span class="token function">updateCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> action<span class="token punctuation">.</span><span class="token property-access">data</span><span class="token punctuation">)</span> \n        <span class="token operator">:</span> model<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span> view<span class="token punctuation">,</span> update<span class="token punctuation">,</span> actions <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token constant">ADD</span><span class="token punctuation">,</span> <span class="token constant">RESET</span><span class="token punctuation">,</span> <span class="token constant">REMOVE</span><span class="token punctuation">,</span> <span class="token constant">UPDATE</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span>\n</code></pre>\n<p>该代码遵循上一个示例的相同的模式，使用冒泡阶段存储的 id 信息，将子节点的 actions 转发到顶层组件。下面是 update 的一个分支 “updateCounter” 。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">updateCounter</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> id<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span><span class="token spread operator">...</span>model<span class="token punctuation">,</span>\n    counters  <span class="token operator">:</span> model<span class="token punctuation">.</span><span class="token property-access">counters</span><span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token arrow operator">=></span> \n      item<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">!==</span> id <span class="token operator">?</span> \n          item\n        <span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>item<span class="token punctuation">,</span> \n            counter <span class="token operator">:</span> counter<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token property-access">counter</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面这种模式可以应用于任何树结构嵌套的组件结构中，通过这种模式，我们让整个应用程序的结构进行了统一。</p>\n<h3 id="%E5%9C%A8-actions-%E4%B8%AD%E4%BD%BF%E7%94%A8-union-%E7%B1%BB%E5%9E%8B">在 actions 中使用 union 类型<a class="anchor" href="#%E5%9C%A8-actions-%E4%B8%AD%E4%BD%BF%E7%94%A8-union-%E7%B1%BB%E5%9E%8B">§</a></h3>\n<p>在前面的示例中，我们使用 ES6 的 Symbols 类型来表示操作类型。在视图内部，我们创建了带有操作类型和附加信息（id，子节点的 action）的对象。</p>\n<p>在真实的场景中，我们必须将 action 的创建逻辑移动到一个单独的工厂函数中（类似于React/Flux中的 Action Creators）。在这篇文章的剩余部分，我将提出一个更符合 FP 精神的替代方案：union 类型。它是 FP 语言（如Haskell）中使用的 <a href="https://en.wikipedia.org/wiki/Algebraic_data_type">代数数据类型</a> 的子集，您可以将它们看作具有更强大功能的枚举。</p>\n<p>union类型可以为我们提供以下特性：</p>\n<ol>\n<li>定义一个可描述所有可能的 actions 的类型。</li>\n<li>为每个可能的值提供一个工厂函数。</li>\n<li>提供一个可控的流来处理所有可能的变量。</li>\n</ol>\n<p>union 类型在 JavaScript 中不是原生的，但是我们可以使用一个库来模拟它。在我们的示例中，我们使用 union-type (<a href="https://github.com/paldepind/union-type">github/union-type</a>) ，这是 snabbdom 作者编写的一个小而美的库。</p>\n<p>先让我们安装这个库：</p>\n<pre class="language-autoit"><code class="language-autoit">npm install <span class="token operator">-</span><span class="token operator">-</span>save union<span class="token operator">-</span>type\n</code></pre>\n<p>下面我们来定义计数器的 actions：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Type</span></span> <span class="token keyword module">from</span> <span class="token string">\'union-type\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token maybe-class-name">Action</span> <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Type</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Increment</span> <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Decrement</span> <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Type</code> 是该库导出的唯一函数。我们使用它来定义 union 类型 <code>Action</code>，其中包含两个可能的 actions。</p>\n<p>返回的 <code>Action</code> 具有一组工厂函数，用于创建所有可能的操作。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">view</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> \n  <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access"><span class="token maybe-class-name">Increment</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'+\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'button\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      on   <span class="token operator">:</span> <span class="token punctuation">{</span> click<span class="token operator">:</span> handler<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access"><span class="token maybe-class-name">Decrement</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'-\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Count : </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>count<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> \n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 view 创建递增和递减两种 action。update 函数展示了 uinon 如何对不同类型的 action 进行模式匹配。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">count<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span>  <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access">case</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Increment</span></span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> count <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Decrement</span></span> <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> count <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>Action</code> 具有一个 <code>case</code> 方法，该方法接受两个参数：</p>\n<ul>\n<li>一个对象（变量名和一个回调函数）</li>\n<li>要匹配的值</li>\n</ul>\n<p>然后，case方法将提供的 action 与所有指定的变量名相匹配，并调用相应的处理函数。返回值是匹配的回调函数的返回值。</p>\n<p>类似地，我们看看如何定义 <code>counterList</code> 的 actions</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token maybe-class-name">Action</span> <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Type</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Add</span>     <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Remove</span>  <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token known-class-name class-name">Number</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Reset</span>   <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Update</span>  <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token known-class-name class-name">Number</span><span class="token punctuation">,</span> counter<span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Action</span></span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Add</code>和<code>Reset</code>是空数组(即它们没有任何字段)，<code>Remove</code>只有一个字段（计数器的 id）。最后，<code>Update</code> 操作有两个字段：计数器的 id 和计数器触发时的 action。</p>\n<p>与之前一样，我们在 update 函数中进行模式匹配。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">model<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  \n  <span class="token keyword control-flow">return</span> <span class="token maybe-class-name">Action</span><span class="token punctuation">.</span><span class="token method function property-access">case</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Add</span></span>     <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">addCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Remove</span></span>  <span class="token operator">:</span> <span class="token parameter">id</span> <span class="token arrow operator">=></span> <span class="token function">removeCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> id<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function-variable function"><span class="token maybe-class-name">Reset</span></span>   <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">resetCounters</span><span class="token punctuation">(</span>model<span class="token punctuation">)</span><span class="token punctuation">,</span> \n    <span class="token function-variable function"><span class="token maybe-class-name">Update</span></span>  <span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">updateCounter</span><span class="token punctuation">(</span>model<span class="token punctuation">,</span> id<span class="token punctuation">,</span> action<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>注意，<code>Remove</code> 和 <code>Update</code> 都会接受参数。如果匹配成功，<code>case</code> 方法将从 case 实例中提取字段并将它们传递给对应的回调函数。</p>\n<p>所以典型的模式是：</p>\n<ul>\n<li>将 actions 建模为union类型。</li>\n<li>在 view 函数中，使用 union 类型提供的工厂函数创建 action （如果创建的逻辑更复杂，还可以将操作创建委托给单独的函数）。</li>\n<li>在 update 函数中，使用 <code>case</code> 方法来匹配 union 类型的可能值。</li>\n</ul>\n<h2 id="todomvc%E4%BE%8B%E5%AD%90">TodoMVC例子<a class="anchor" href="#todomvc%E4%BE%8B%E5%AD%90">§</a></h2>\n<p>在这个仓库中(<a href="https://github.com/yelouafi/snabbdom-todomvc">github/yelouafi/snabbdom-todomvc</a>)，使用本文提到的规范进行了 todoMVC 应用的实现。应用程序由2个模块组成：</p>\n<ul>\n<li><code>task.js</code> 定义一个呈现单个任务并更新其状态的组件</li>\n<li><code>todos.js</code>，它管理任务列表以及过滤和更新</li>\n</ul>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>我们已经了解了如何使用小而美的虚 拟DOM 库编写应用程序。当我们不想被迫选择使用React框架（尤其是 class），或者当我们需要一个小型 JavaScript 库时，这将非常有用。</p>\n<p><em>Elm architecture</em> 提供了一个简单的模式来编写复杂的虚拟DOM应用，具有纯函数的所有优点。这为我们的代码提供了一个简单而规范的结构。使用标准的模式使得应用程序更容易维护，特别是在成员频繁更改的团队中。新成员可以快速掌握代码的总体架构。</p>\n<p>由于完全用纯函数实现的，我确信只要组件代码遵守其约定，更改组件就不会产生不良的副作用。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#snabbdom%E7%AE%80%E6%98%93%E6%95%99%E7%A8%8B" }, "snabbdom\u7B80\u6613\u6559\u7A0B"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%8A%A8%E6%80%81%E8%A7%86%E5%9B%BE" }, "\u52A8\u6001\u89C6\u56FE")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94" }, "\u4E8B\u4EF6\u54CD\u5E94")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%A4%8D%E6%9D%82%E7%9A%84%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F" }, "\u590D\u6742\u7684\u5E94\u7528\u7A0B\u5E8F"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%B8%BB%E6%B5%81%E7%A8%8B" }, "\u4E3B\u6D41\u7A0B")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#elm-%E6%9E%B6%E6%9E%84elm-architecture" }, "Elm \u67B6\u6784\uFF08Elm architecture\uFF09")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A1%88%E4%BE%8B%E4%B8%80%E8%AE%A1%E6%95%B0%E5%99%A8" }, "\u6848\u4F8B\u4E00\uFF1A\u8BA1\u6570\u5668")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A1%88%E4%BE%8B%E4%BA%8C%E4%B8%A4%E4%B8%AA%E8%AE%A1%E6%95%B0%E5%99%A8" }, "\u6848\u4F8B\u4E8C\uFF1A\u4E24\u4E2A\u8BA1\u6570\u5668")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A1%88%E4%BE%8B%E4%B8%89%E8%AE%A1%E6%95%B0%E5%99%A8%E5%88%97%E8%A1%A8" }, "\u6848\u4F8B\u4E09\uFF1A\u8BA1\u6570\u5668\u5217\u8868")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%9C%A8-actions-%E4%B8%AD%E4%BD%BF%E7%94%A8-union-%E7%B1%BB%E5%9E%8B" }, "\u5728 actions \u4E2D\u4F7F\u7528 union \u7C7B\u578B")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#todomvc%E4%BE%8B%E5%AD%90" }, "TodoMVC\u4F8B\u5B50")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/05/01",
    'updated': null,
    'excerpt': "React 是 JavaScript 社区的新成员，尽管 JSX （在 JavaScript 中使用 HTML 语法）存在一定的争议，但是对于虚拟 DOM 人们有不一样的看法。 对于不熟悉的人来说，虚拟 DOM 可以描述为某个时刻真实DOM的简单表示。其思想是：每次...",
    'cover': "https://file.shenfq.com/FvyObN9fMncD7cMXJYfZOFQJFQ--.png",
    'categories': [
        "前端"
    ],
    'tags': [
        "前端框架",
        "react",
        "virtual dom",
        "虚拟 DOM",
        "Snabbdom",
        "翻译"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2022/LFU.md",
                "title": "什么是 LFU 算法？",
                "link": "posts/2022/LFU.html",
                "date": "2022/03/22",
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
                "excerpt": "上次的文章介绍了 LRU 算法，今天打算来介绍一下 LFU 算法。在上篇文章中有提到， LFU（Least frequently used：最少使用）算法与 LRU 算法只是在淘汰策略上有所不同，LRU 倾向于保留最近有使用的数据，而 LFU 倾向于保留使用频...",
                "cover": "https://file.shenfq.com/pic/202203221024302.jpg"
            },
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
                "count": 35
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
                "count": 15
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
                "name": "LFU",
                "count": 2
            },
            {
                "name": "LRU",
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
                "name": "缓存",
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
