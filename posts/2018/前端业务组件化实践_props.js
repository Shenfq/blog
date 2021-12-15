import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2018/前端业务组件化实践.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/前端业务组件化实践.html",
    'title': "前端业务组件化实践",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>前端业务组件化实践</h1>\n<p>最近一直在做管理端相关的需求，管理端不比h5每天都有高流量，需要不断地做性能上的优化，以及适配不同设备兼容性。但是管理端也面临着自己的挑战，因为项目越来越大，可配置化的东西就越来越多，管理端的页面也就越多，同时面向不同的用户群也催生出了不同管理端，这就导致相同的业务组件在不同项目、不同页面中不停地被copy，一旦组件出现改动，就需要打开多个项目进行修改，出现遗漏还得背锅。</p>\n<p><img src="https://file.shenfq.com/18-12-19/84472576.jpg" alt=""></p>\n<!-- more -->\n<p>毋庸置疑，管理端是有很多优秀的组件库的，比如ElementUI、iView、Antd，但是这些组件库仅仅提供了很基础的组件（比如，表单、表格、弹窗）。那么我们是不是可以把这些多个地方使用的业务组件也进行封装，打包成NPM包放到公司的私有源上，然后通过tnpm进行安装，当组件出现变动的时候，只需要进行<code>tnpm update component</code>即可。这样做的好处就是提高代码的复用性，并且组件有一个专门的仓库进行维护，所有内部管理端项目都能引入这个组件库。</p>\n<p>可能有人会问，管理端中真的会有很多公共的业务组件吗，不同的管理端端之间肯定会有不同的特殊需求如何保证组件的一致性？首先我目前所做的属于电商业务，做电商相关的东西都会有很多业务组件，比如商品选择器、excel批量导入、文件上传等等。再者管理端组件的通用性远高于面向用户侧的组件，因为不管是中秋节、端午节、国庆节，选择商品的弹窗大致逻辑与样式基本不变，而对于面向用户侧的前端组件，不同节日，不同玩法，组件样式肯定会有变动，但是基础的业务逻辑还是能够进行抽象复用，这里不继续展开讨论。</p>\n<h2 id="%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E4%BB%B6">什么是组件<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>这个问题可能比较抽象，每个人对组件可能都有不同的理解，针对组件的颗粒度、通用性回答也会千奇百怪。其实组件一直都存在，没有前端的那个年代，大家管它叫控件，想要在pc端做个软件直接去拖一块一块的控件放到某个位置就好了。在C/S架构的软件向B/S迁移的过程中，控件的概念也慢慢延伸到了Web前端。对于现代前端框架，封装好的组件对于外部来说只是一个自定义的标签，标签可以进行属性和事件的自定义，所以狭义得说，前端组件只能说是一个个的自定义标签，有其固有的样式和自定义的属性与事件。</p>\n<p>关于组件的设计，有一个基本原则：一个组件只做一件事，且把这件事做好。</p>\n<p>通俗来讲，就是基础组件尽量做到细颗粒度的拆分，对一件事的定义可大可小，往小了说，一个输入框、一个按钮，这就是一个基础组件，他们就只做一件事那就是输入和点击。而我们的业务组件就是要把这些小组件组成一个大组件，比如由弹窗+输入框+按钮+穿梭框组成的一个商品选择器，本质上也只做一件事，那就是选择商品。</p>\n<p><img src="https://file.shenfq.com/18-12-19/43713364.jpg" alt=""></p>\n<pre class="language-html"><code class="language-html">封装前：\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-dialog</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-form</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-input</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-input</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-input</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-input</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>查询<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>批量导入<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>下载模版<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-form</span><span class="token punctuation">></span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Transfer</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>取消<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>下一步<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Transfer</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-dialog</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n\n封装后：\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>select-goods</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>select-goods</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>所以一个业务组件的形成其实就是对一些基础组件的组装，当我们有一系列逻辑代码和标签需要在多个地方使用的时候，就要考虑把它封装成一个新的组件，提升代码的复用性。</p>\n<h2 id="%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B">技术选型<a class="anchor" href="#%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B">§</a></h2>\n<p><img src="https://file.shenfq.com/18-12-19/41159506.jpg" alt=""></p>\n<p>需要构建业务组件库，底层肯定是要基于前端框架和基础组件库的。</p>\n<p>目前的三大前端框架都支持组件化的功能，只是内部的原理有些差异，比如React、Vue的组件化都是基于虚拟DOM。对于底层选择什么框架，其实问题不大，跟随团队方向就好，如果团队的项目都使用Vue，你偏偏要使用Angular，但是可能其他同事对这个框架都不熟悉，需要一定的学习成本，这肯定不是一个好选择。由于我们团队项目基本使用Vue，所以我们底层框架选用Vue，基础组件库使用ElementUI。接下来的业务组件库的搭建都是在此基础上进行的。</p>\n<h2 id="%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA">项目搭建<a class="anchor" href="#%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA">§</a></h2>\n<p>先看看项目目录，目录结构有参考ElementUI，具体可以看我之前写的文章：<a href="https://blog.shenfq.com/2018/09/17/ElementUI%E7%9A%84%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B/">《ElementUI构建流程》</a>。</p>\n<pre class="language-autoit"><code class="language-autoit">├─build  构建相关的脚本\n├─docs  组件文档\n├─examples  组件示例\n├─packages  组件目录，每个组件一个单独文件夹\n│  ├─componentA\n│  │  └─src\n│  ├─componentB\n│  │  └─src\n│  └─componentC\n│  │  └─src\n│  └─<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n├─src  <span class="token operator">/</span><span class="token operator">/</span> 组件的入口文件以及一些工具方法\n│  └─main<span class="token punctuation">.</span>js\n└─components<span class="token punctuation">.</span>json <span class="token operator">/</span><span class="token operator">/</span>组件列表\n</code></pre>\n<p>既然最后要发布为NPM包，<code>package.json</code>肯定必不可少的，这其中有几个配置需要注意。</p>\n<h4 id="peerdependencies">peerDependencies<a class="anchor" href="#peerdependencies">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// package.json</span>\n<span class="token string">"peerDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"element-ui"</span><span class="token operator">:</span> <span class="token string">"^2.4.6"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在我们实际的应用中，使用得比较多的就是dependencies和devDependencies。但是peerDependencies，很少需要使用，因为这个依赖一般只要做插件开发时才会经常使用。有这种依赖意味着安装包的用户需要同时安装这些依赖，从npm@3.0开始不会自动帮你安装，需要你的应用中的dependencies或devDependencies中也有同样的依赖。这里我们的组件库需要依赖<code>element-ui</code>，同时<code>element-ui</code>的<a href="https://github.com/ElemeFE/element/blob/dev/package.json#L59">package.json</a>也同步依赖了vue。</p>\n<h4 id="main">main<a class="anchor" href="#main">§</a></h4>\n<p>这个字段表示库被引入时，默认引入的js文件是哪个。这里我们设置为<code>src/main.js</code>，该文件通过脚本自动生成。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'my-components\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">//实际引入的js为</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'node_modules/my-components/src/main.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="files">files<a class="anchor" href="#files">§</a></h4>\n<p>这个字段表示发布到NPM上时，只发布哪些指定文件夹/文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token string">"files"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"src"</span><span class="token punctuation">,</span>\n    <span class="token string">"packages"</span><span class="token punctuation">,</span>\n    <span class="token string">"README.md"</span><span class="token punctuation">,</span>\n    <span class="token string">"components.json"</span>\n<span class="token punctuation">]</span>\n</code></pre>\n<p>当然你也可以在项目根目录配置<code>.npmignore</code>文件，写法与<code>.gitignore</code>一样，作用就是publish到NPM上时要进行忽略的文件。但是下面文件是会默认在files字段中的，即使你加入到<code>.npmignore</code>文件也无法被忽略。</p>\n<ul>\n<li>package.json</li>\n<li>README</li>\n<li>CHANGES / CHANGELOG / HISTORY</li>\n<li>LICENSE / LICENCE</li>\n<li>NOTICE</li>\n<li>&quot;main&quot; 字段的文件</li>\n</ul>\n<p>还有一些文件是默认被npm忽略的。</p>\n<ul>\n<li>.git、.svn</li>\n<li>.*.swp</li>\n<li>.DS_Store</li>\n<li>.npmrc</li>\n<li>node_modules</li>\n<li>npm-debug.log</li>\n<li>package-lock.json</li>\n</ul>\n<p>在定义好目录结构和pkg.json后，我们就需要构建组件库的入口文件。因为组件库是在Vue的基础上构建，那么肯定要符合Vue插件的写法，入口js需要对外暴露一个install方法，用于将所有业务组件注册为全局组件，这样只需要引入之后进行use。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">componentA</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentA/index.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">componentB</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentB/index.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">componentC</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentC/index.js\'</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token punctuation">[</span>\n  componentA<span class="token punctuation">,</span>\n  componentB<span class="token punctuation">,</span>\n  componentC\n<span class="token punctuation">]</span>\n\n<span class="token keyword">const</span> <span class="token function-variable function">install</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token maybe-class-name">Vue</span><span class="token punctuation">,</span> opts <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  components<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">component</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">component</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  install<span class="token punctuation">,</span> <span class="token comment">// 对外暴露install方法</span>\n  componentA<span class="token punctuation">,</span>\n  componentB<span class="token punctuation">,</span>\n  componentC\n<span class="token punctuation">}</span>\n\n<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>\n\n<span class="token comment">// 使用方式</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ElementUI</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Components</span></span> <span class="token keyword module">from</span> <span class="token string">\'my-components\'</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">ElementUI</span><span class="token punctuation">)</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span>\n</code></pre>\n<p>这样做使用的时候很方便，但是每次新增组件就需要手动修改这个main.js，有没有办法让这个文件自动生成呢？当然是有的，我们可以手动维护一个components.json文件，用来存储所有组件名和组件路径。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"componentA"</span><span class="token operator">:</span> <span class="token string">"../packages/componentA/index.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"componentB"</span><span class="token operator">:</span> <span class="token string">"../packages/componentB/index.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"componentC"</span><span class="token operator">:</span> <span class="token string">"../packages/componentC/index.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>然后根据这个json文件和模版文件进行入口文件的生成，提高效率。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// build/entry.js</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> endOfLine <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token constant">EOL</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentNames</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token constant">OUTPUT_PATH</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../src/main.js\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">let</span> includeComponentTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token keyword">let</span> installTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n<span class="token maybe-class-name">ComponentNames</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> componentName <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n  <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">Components</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">)</span>\n\n  installTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n  <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> <span class="token constant">MAIN_TEMPLATE</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n\nconst components = [\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installList<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n]\n\nconst install = function(Vue, opts = {}) {\n  components.map(component => {\n    Vue.component(component.name, component)\n  })\n}\n\nexport default {\n  install,\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n}\n</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n\nfs<span class="token punctuation">.</span><span class="token method function property-access">writeFileSync</span><span class="token punctuation">(</span><span class="token constant">OUTPUT_PATH</span><span class="token punctuation">,</span> <span class="token constant">MAIN_TEMPLATE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'[build entry] DONE:\'</span><span class="token punctuation">,</span> <span class="token constant">OUTPUT_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>新增组件之后，只需要执行<code>node build/entry.js</code>即可，同时也可以将这个命令添加到pkg的scripts中。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"build:entry"</span><span class="token operator">:</span> <span class="token string">"node build/entry.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%B0%E5%A2%9E%E4%B8%8E%E6%9E%84%E5%BB%BA">组件的新增与构建<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%B0%E5%A2%9E%E4%B8%8E%E6%9E%84%E5%BB%BA">§</a></h2>\n<p>用components.json和js脚本的方式进行入口文件的生成，可以一旦程度上提高代码维护性，但是一旦有组件新增还是得修改components.json文件，还是比较繁琐。这里我们也可以通过js脚本的方式来新增组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// build/new.js</span>\n\n<span class="token string">\'use strict\'</span>\n\n<span class="token comment">// 读取命令行参数</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'[组件名]必填\'</span><span class="token punctuation">)</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> fileSave <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'file-save\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> componentname <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentName</span> <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>componentname<span class="token punctuation">)</span> <span class="token comment">// 转为驼峰表示</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">PackagePath</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../packages\'</span><span class="token punctuation">,</span> componentname<span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Files</span> <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'./src/index.vue\'\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.install = function (Vue) {\n  Vue.component(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.name, </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)\n}\nexport default </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'src/index.vue\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n&lt;template>\n  &lt;div>&lt;/div>\n&lt;/template>\n&lt;script>\nexport default {\n  name: \'Cm</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'\n};\n&lt;/script>\n</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">../../docs/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 添加到 components.json</span>\n<span class="token keyword">const</span> componentsFile <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已存在.</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\ncomponentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">../packages/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/index.js</span><span class="token template-punctuation string">`</span></span>\n\n<span class="token keyword">const</span> componentsPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n<span class="token function">fileSave</span><span class="token punctuation">(</span>componentsPath<span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>componentsFile<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'modified: \'</span><span class="token punctuation">,</span> componentsPath<span class="token punctuation">)</span>\n\n<span class="token comment">// 创建 package</span>\n<span class="token maybe-class-name">Files</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">file</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> filePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token maybe-class-name">PackagePath</span><span class="token punctuation">,</span> file<span class="token punctuation">.</span><span class="token property-access">filename</span><span class="token punctuation">)</span>\n  <span class="token function">fileSave</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'created: \'</span><span class="token punctuation">,</span> filePath<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'DONE!\'</span><span class="token punctuation">)</span>\n\n<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>\n\n<span class="token comment">// package.json</span>\n<span class="token string">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token string">"build:entry"</span><span class="token operator">:</span> <span class="token string">"node build/build.entry.js"</span><span class="token punctuation">,</span>\n  <span class="token string">"new"</span><span class="token operator">:</span> <span class="token string">"node build/new.js"</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n</code></pre>\n<p>最后运行命令添加到npm scripts中，现在新增一个组件只需要运行一条命令即可，比如我要新增商品选择器组件(select-goods)。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> run new select-goods\n</code></pre>\n<p>这里主要做了下面三件事。</p>\n<ol>\n<li>修改components.json文件，如果某个组件存在，直接退出进程。</li>\n<li>在packages目录下新建组件文件夹，并新建<code>index.js</code>、<code>src/index.vue</code>。</li>\n<li>在doc文件夹下新建一个组件的markdown文件，用来编写该组件的使用文档。</li>\n</ol>\n<p>有一点需要注意，组件的index.vue文件中的name字段，都是以<code>Cm</code>打头（<code>name: \'Cm${ComponentName}\'</code>），这里主要是为了更符合HTML5的自定义组件规范，让我们的组件都带有一个小横线<code>-</code>。比如我们新建的组件名为<code>select-goods</code>，组件名就为<code>CmSelectGoods</code>，实际使用时为<code>&lt;cm-select-goods /&gt;</code>。</p>\n<p>添加好新的组件，然后生成入口文件，接下来只要通过webpack打包后发布到NPM包就可以了，但是我们在这一步是没有做的，而是选用了后编译模式。</p>\n<h4 id="%E5%90%8E%E7%BC%96%E8%AF%91%E7%BB%84%E4%BB%B6">后编译组件<a class="anchor" href="#%E5%90%8E%E7%BC%96%E8%AF%91%E7%BB%84%E4%BB%B6">§</a></h4>\n<p>即组件在发布到NPM包的时候，不进行编译，而是和实际引入组件库的项目一起交给webpack打包，这里参考了滴滴的cube-ui的做法（<a href="https://didi.github.io/cube-ui/#/zh-CN/docs/post-compile">去看看</a>）。</p>\n<p>所以我们在组件的package.json的main字段处的值为<code>src/main.js</code>，这是整个组建的入口文件，而不是经过webpack或者rollup打包后的模块。这样做有几个好处。</p>\n<p>首先当我们的组件库依赖了某个包，比如：lodash，然后我们的项目也依赖了lodash。如果我们的组件库在发布到NPM之前已经进行了打包，我们在项目中引入的又是打包后的文件，那么项目会再次把lodash打包一次，因为项目不知道我们的组件依赖了lodash，明显造成了资源浪费。</p>\n<p><img src="https://file.shenfq.com/18-12-19/11972445.jpg" alt=""></p>\n<p><img src="https://file.shenfq.com/18-12-19/50925545.jpg" alt=""></p>\n<p>除了依赖包，一些工具方法也可以放到组件库中，使用的时候直接进行require，这样就不用在多个项目中来回copy代码，毕竟业务代码库，大部分工具方法都是通用的。</p>\n<p>其次组件库与业务代码使用同一babel版本进行代码转换，可以保持代码的一致性。同时在业务代码中直接使用babel-polyfill，减少两次打包多次引入某些es6api的polyfill。</p>\n<p>说了这么多，要做到后编译其实很简单，只需要发布到NPM上时，不进行webpack打包。然后在项目的webpack的babel-loader的inclues添加组件库的路径即可，省时又省力。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n  loader<span class="token operator">:</span> <span class="token string">\'babel-loader\'</span><span class="token punctuation">,</span>\n  include<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">\'src\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">\'node_modules/my-components\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%87%E6%A1%A3">组件的文档<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%87%E6%A1%A3">§</a></h2>\n<p>之前我们在新增组件的时候，为每个组件都在docs文件夹下新建了一个markdown文件。如果每次都要下载项目到docs目录下查看文档对开发者不太友好，那么我们可以将markdown文件转为vue组件，然后部署到demo网站上。这样就只要编写好markdown文档，就能直接同步在demo网站同步显示。这里也是参考的ElementUI的做法，使用<a href="https://github.com/QingWei-Li/vue-markdown-loader">vue-markdown-loader</a>将markdown文件转为vue组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.md$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n  use<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      loader<span class="token operator">:</span> <span class="token string">\'vue-loader\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      loader<span class="token operator">:</span> <span class="token string">\'vue-markdown-loader/lib/markdown-compiler\'</span><span class="token punctuation">,</span>\n      options<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该插件通过<code>markdown-it</code>进行markdown文件解析，同时可以自定义<code>markdown-it</code>插件，进行一些个性化的markdown写法，比如代码高亮、可执行的代码，具体使用方式可以参考ElementUI的<a href="https://github.com/ElemeFE/element/blob/dev/build/webpack.demo.js#L75">webpack配置</a>。</p>\n<p><img src="https://file.shenfq.com/18-12-19/18602732.jpg" alt=""></p>\n<h2 id="%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%8F%91%E5%B8%83">组件如何发布<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%8F%91%E5%B8%83">§</a></h2>\n<p>因为我们要发布到tnpm上，首先需要创建一个tnpm账户，通过<code>tnpm adduser</code>进行账户创建。创建好账户之后，发布到tnpm上，需要使用<code>tnpm publish</code>。</p>\n<p>发布到tnpm因为是公司的内源，所有pkg的name字段一定要包名前面加上<code>@tencent/</code>。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"@tencent/my-components"</span>\n</code></pre>\n<p>发布了包之后，只有发布者有权限更新这个包，这个时候需要添加其他用户到这个包，可以使用如下命令：</p>\n<pre class="language-bash"><code class="language-bash"> tnpm owner <span class="token function">add</span> rtx_at_tencent @tencent/my-components\n</code></pre>\n<p>发布如果有很多步骤，可以通过shell脚本的方式进行发布，下面这个是我们目前项目中使用的。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token shebang important">#!/usr/bin/env bash</span>\n\n<span class="token builtin class-name">set</span> -e\n\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> -n <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> status --porcelain<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'push main.js to remote.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token function">git</span> <span class="token function">add</span> src/main.js\n  <span class="token function">git</span> commit -m <span class="token string">"feat: push main.js to remote."</span>\n  <span class="token function">git</span> push\n<span class="token keyword">fi</span>\n\n<span class="token builtin class-name">echo</span> <span class="token string">"Enter release version: "</span>\n<span class="token builtin class-name">read</span> VERSION\n\n<span class="token builtin class-name">read</span> -p <span class="token string">"Releasing <span class="token variable">$VERSION</span> - are you sure? (y/n)"</span> -n <span class="token number">1</span> -r\n<span class="token builtin class-name">echo</span>    <span class="token comment"># (optional) move to a new line</span>\n<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token environment constant">$REPLY</span> <span class="token operator">=</span>~ ^<span class="token punctuation">[</span>Yy<span class="token punctuation">]</span>$ <span class="token punctuation">]</span><span class="token punctuation">]</span>\n<span class="token keyword">then</span>\n  <span class="token function">npm</span> version <span class="token variable">$VERSION</span> --message <span class="token string">"[release] <span class="token variable">$VERSION</span>"</span>\n  tnpm publish\n<span class="token keyword">fi</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>更多组件化相关知识可以看看民工叔15年的文章：<a href="https://github.com/xufei/blog/issues/22">《Web应用组件化的权衡》</a>，看完之后很有收获，大佬就是大佬，15年写的东西至今一点都不显得过时。</p>\n<p>在基础组件层封装好业务组件后，下一步是否就能够使用拖拽方式，将组件拼接直接生成页面呢？还记得最开始说的，一个组件只做一件事，但是这件事可大可小，如果一个页面做的事就是新建商品、编辑商品，那页面也是一个大组件，最后也是在进行组件的拼接。既然写代码做组件拼接，为什么不能直接用拖拽的方式进行组件拼接呢？这个可能就是我们下一步要做的事情了。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u524D\u7AEF\u4E1A\u52A1\u7EC4\u4EF6\u5316\u5B9E\u8DF5"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>最近一直在做管理端相关的需求，管理端不比h5每天都有高流量，需要不断地做性能上的优化，以及适配不同设备兼容性。但是管理端也面临着自己的挑战，因为项目越来越大，可配置化的东西就越来越多，管理端的页面也就越多，同时面向不同的用户群也催生出了不同管理端，这就导致相同的业务组件在不同项目、不同页面中不停地被copy，一旦组件出现改动，就需要打开多个项目进行修改，出现遗漏还得背锅。</p>\n<p><img src="https://file.shenfq.com/18-12-19/84472576.jpg" alt=""></p>\n<!-- more -->\n<p>毋庸置疑，管理端是有很多优秀的组件库的，比如ElementUI、iView、Antd，但是这些组件库仅仅提供了很基础的组件（比如，表单、表格、弹窗）。那么我们是不是可以把这些多个地方使用的业务组件也进行封装，打包成NPM包放到公司的私有源上，然后通过tnpm进行安装，当组件出现变动的时候，只需要进行<code>tnpm update component</code>即可。这样做的好处就是提高代码的复用性，并且组件有一个专门的仓库进行维护，所有内部管理端项目都能引入这个组件库。</p>\n<p>可能有人会问，管理端中真的会有很多公共的业务组件吗，不同的管理端端之间肯定会有不同的特殊需求如何保证组件的一致性？首先我目前所做的属于电商业务，做电商相关的东西都会有很多业务组件，比如商品选择器、excel批量导入、文件上传等等。再者管理端组件的通用性远高于面向用户侧的组件，因为不管是中秋节、端午节、国庆节，选择商品的弹窗大致逻辑与样式基本不变，而对于面向用户侧的前端组件，不同节日，不同玩法，组件样式肯定会有变动，但是基础的业务逻辑还是能够进行抽象复用，这里不继续展开讨论。</p>\n<h2 id="%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E4%BB%B6">什么是组件<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>这个问题可能比较抽象，每个人对组件可能都有不同的理解，针对组件的颗粒度、通用性回答也会千奇百怪。其实组件一直都存在，没有前端的那个年代，大家管它叫控件，想要在pc端做个软件直接去拖一块一块的控件放到某个位置就好了。在C/S架构的软件向B/S迁移的过程中，控件的概念也慢慢延伸到了Web前端。对于现代前端框架，封装好的组件对于外部来说只是一个自定义的标签，标签可以进行属性和事件的自定义，所以狭义得说，前端组件只能说是一个个的自定义标签，有其固有的样式和自定义的属性与事件。</p>\n<p>关于组件的设计，有一个基本原则：一个组件只做一件事，且把这件事做好。</p>\n<p>通俗来讲，就是基础组件尽量做到细颗粒度的拆分，对一件事的定义可大可小，往小了说，一个输入框、一个按钮，这就是一个基础组件，他们就只做一件事那就是输入和点击。而我们的业务组件就是要把这些小组件组成一个大组件，比如由弹窗+输入框+按钮+穿梭框组成的一个商品选择器，本质上也只做一件事，那就是选择商品。</p>\n<p><img src="https://file.shenfq.com/18-12-19/43713364.jpg" alt=""></p>\n<pre class="language-html"><code class="language-html">封装前：\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-dialog</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-form</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-input</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-input</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-input</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-input</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>查询<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>批量导入<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>下载模版<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-form</span><span class="token punctuation">></span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Transfer</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>取消<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-button</span><span class="token punctuation">></span></span>下一步<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-button</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Transfer</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-dialog</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n\n封装后：\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>select-goods</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>select-goods</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>所以一个业务组件的形成其实就是对一些基础组件的组装，当我们有一系列逻辑代码和标签需要在多个地方使用的时候，就要考虑把它封装成一个新的组件，提升代码的复用性。</p>\n<h2 id="%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B">技术选型<a class="anchor" href="#%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B">§</a></h2>\n<p><img src="https://file.shenfq.com/18-12-19/41159506.jpg" alt=""></p>\n<p>需要构建业务组件库，底层肯定是要基于前端框架和基础组件库的。</p>\n<p>目前的三大前端框架都支持组件化的功能，只是内部的原理有些差异，比如React、Vue的组件化都是基于虚拟DOM。对于底层选择什么框架，其实问题不大，跟随团队方向就好，如果团队的项目都使用Vue，你偏偏要使用Angular，但是可能其他同事对这个框架都不熟悉，需要一定的学习成本，这肯定不是一个好选择。由于我们团队项目基本使用Vue，所以我们底层框架选用Vue，基础组件库使用ElementUI。接下来的业务组件库的搭建都是在此基础上进行的。</p>\n<h2 id="%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA">项目搭建<a class="anchor" href="#%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA">§</a></h2>\n<p>先看看项目目录，目录结构有参考ElementUI，具体可以看我之前写的文章：<a href="https://blog.shenfq.com/2018/09/17/ElementUI%E7%9A%84%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B/">《ElementUI构建流程》</a>。</p>\n<pre class="language-autoit"><code class="language-autoit">├─build  构建相关的脚本\n├─docs  组件文档\n├─examples  组件示例\n├─packages  组件目录，每个组件一个单独文件夹\n│  ├─componentA\n│  │  └─src\n│  ├─componentB\n│  │  └─src\n│  └─componentC\n│  │  └─src\n│  └─<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\n├─src  <span class="token operator">/</span><span class="token operator">/</span> 组件的入口文件以及一些工具方法\n│  └─main<span class="token punctuation">.</span>js\n└─components<span class="token punctuation">.</span>json <span class="token operator">/</span><span class="token operator">/</span>组件列表\n</code></pre>\n<p>既然最后要发布为NPM包，<code>package.json</code>肯定必不可少的，这其中有几个配置需要注意。</p>\n<h4 id="peerdependencies">peerDependencies<a class="anchor" href="#peerdependencies">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// package.json</span>\n<span class="token string">"peerDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"element-ui"</span><span class="token operator">:</span> <span class="token string">"^2.4.6"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在我们实际的应用中，使用得比较多的就是dependencies和devDependencies。但是peerDependencies，很少需要使用，因为这个依赖一般只要做插件开发时才会经常使用。有这种依赖意味着安装包的用户需要同时安装这些依赖，从npm@3.0开始不会自动帮你安装，需要你的应用中的dependencies或devDependencies中也有同样的依赖。这里我们的组件库需要依赖<code>element-ui</code>，同时<code>element-ui</code>的<a href="https://github.com/ElemeFE/element/blob/dev/package.json#L59">package.json</a>也同步依赖了vue。</p>\n<h4 id="main">main<a class="anchor" href="#main">§</a></h4>\n<p>这个字段表示库被引入时，默认引入的js文件是哪个。这里我们设置为<code>src/main.js</code>，该文件通过脚本自动生成。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'my-components\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">//实际引入的js为</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'node_modules/my-components/src/main.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="files">files<a class="anchor" href="#files">§</a></h4>\n<p>这个字段表示发布到NPM上时，只发布哪些指定文件夹/文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token string">"files"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"src"</span><span class="token punctuation">,</span>\n    <span class="token string">"packages"</span><span class="token punctuation">,</span>\n    <span class="token string">"README.md"</span><span class="token punctuation">,</span>\n    <span class="token string">"components.json"</span>\n<span class="token punctuation">]</span>\n</code></pre>\n<p>当然你也可以在项目根目录配置<code>.npmignore</code>文件，写法与<code>.gitignore</code>一样，作用就是publish到NPM上时要进行忽略的文件。但是下面文件是会默认在files字段中的，即使你加入到<code>.npmignore</code>文件也无法被忽略。</p>\n<ul>\n<li>package.json</li>\n<li>README</li>\n<li>CHANGES / CHANGELOG / HISTORY</li>\n<li>LICENSE / LICENCE</li>\n<li>NOTICE</li>\n<li>&quot;main&quot; 字段的文件</li>\n</ul>\n<p>还有一些文件是默认被npm忽略的。</p>\n<ul>\n<li>.git、.svn</li>\n<li>.*.swp</li>\n<li>.DS_Store</li>\n<li>.npmrc</li>\n<li>node_modules</li>\n<li>npm-debug.log</li>\n<li>package-lock.json</li>\n</ul>\n<p>在定义好目录结构和pkg.json后，我们就需要构建组件库的入口文件。因为组件库是在Vue的基础上构建，那么肯定要符合Vue插件的写法，入口js需要对外暴露一个install方法，用于将所有业务组件注册为全局组件，这样只需要引入之后进行use。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">componentA</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentA/index.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">componentB</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentB/index.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">componentC</span> <span class="token keyword module">from</span> <span class="token string">\'../packages/componentC/index.js\'</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token punctuation">[</span>\n  componentA<span class="token punctuation">,</span>\n  componentB<span class="token punctuation">,</span>\n  componentC\n<span class="token punctuation">]</span>\n\n<span class="token keyword">const</span> <span class="token function-variable function">install</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token maybe-class-name">Vue</span><span class="token punctuation">,</span> opts <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  components<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">component</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">component</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  install<span class="token punctuation">,</span> <span class="token comment">// 对外暴露install方法</span>\n  componentA<span class="token punctuation">,</span>\n  componentB<span class="token punctuation">,</span>\n  componentC\n<span class="token punctuation">}</span>\n\n<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span>\n\n<span class="token comment">// 使用方式</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ElementUI</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Components</span></span> <span class="token keyword module">from</span> <span class="token string">\'my-components\'</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">ElementUI</span><span class="token punctuation">)</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span>\n</code></pre>\n<p>这样做使用的时候很方便，但是每次新增组件就需要手动修改这个main.js，有没有办法让这个文件自动生成呢？当然是有的，我们可以手动维护一个components.json文件，用来存储所有组件名和组件路径。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"componentA"</span><span class="token operator">:</span> <span class="token string">"../packages/componentA/index.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"componentB"</span><span class="token operator">:</span> <span class="token string">"../packages/componentB/index.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"componentC"</span><span class="token operator">:</span> <span class="token string">"../packages/componentC/index.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>然后根据这个json文件和模版文件进行入口文件的生成，提高效率。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// build/entry.js</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> endOfLine <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token constant">EOL</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentNames</span> <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token constant">OUTPUT_PATH</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../src/main.js\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">let</span> includeComponentTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token keyword">let</span> installTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n<span class="token maybe-class-name">ComponentNames</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> componentName <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n  <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">Components</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">)</span>\n\n  installTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n  <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> <span class="token constant">MAIN_TEMPLATE</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n\nconst components = [\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installList<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n]\n\nconst install = function(Vue, opts = {}) {\n  components.map(component => {\n    Vue.component(component.name, component)\n  })\n}\n\nexport default {\n  install,\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n}\n</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n\nfs<span class="token punctuation">.</span><span class="token method function property-access">writeFileSync</span><span class="token punctuation">(</span><span class="token constant">OUTPUT_PATH</span><span class="token punctuation">,</span> <span class="token constant">MAIN_TEMPLATE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'[build entry] DONE:\'</span><span class="token punctuation">,</span> <span class="token constant">OUTPUT_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>新增组件之后，只需要执行<code>node build/entry.js</code>即可，同时也可以将这个命令添加到pkg的scripts中。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"build:entry"</span><span class="token operator">:</span> <span class="token string">"node build/entry.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%B0%E5%A2%9E%E4%B8%8E%E6%9E%84%E5%BB%BA">组件的新增与构建<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%B0%E5%A2%9E%E4%B8%8E%E6%9E%84%E5%BB%BA">§</a></h2>\n<p>用components.json和js脚本的方式进行入口文件的生成，可以一旦程度上提高代码维护性，但是一旦有组件新增还是得修改components.json文件，还是比较繁琐。这里我们也可以通过js脚本的方式来新增组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// build/new.js</span>\n\n<span class="token string">\'use strict\'</span>\n\n<span class="token comment">// 读取命令行参数</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'[组件名]必填\'</span><span class="token punctuation">)</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> fileSave <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'file-save\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> componentname <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentName</span> <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>componentname<span class="token punctuation">)</span> <span class="token comment">// 转为驼峰表示</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">PackagePath</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../packages\'</span><span class="token punctuation">,</span> componentname<span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Files</span> <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'./src/index.vue\'\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.install = function (Vue) {\n  Vue.component(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.name, </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)\n}\nexport default </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'src/index.vue\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n&lt;template>\n  &lt;div>&lt;/div>\n&lt;/template>\n&lt;script>\nexport default {\n  name: \'Cm</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'\n};\n&lt;/script>\n</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">../../docs/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 添加到 components.json</span>\n<span class="token keyword">const</span> componentsFile <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已存在.</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\ncomponentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">../packages/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/index.js</span><span class="token template-punctuation string">`</span></span>\n\n<span class="token keyword">const</span> componentsPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../components.json\'</span><span class="token punctuation">)</span>\n<span class="token function">fileSave</span><span class="token punctuation">(</span>componentsPath<span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>componentsFile<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'modified: \'</span><span class="token punctuation">,</span> componentsPath<span class="token punctuation">)</span>\n\n<span class="token comment">// 创建 package</span>\n<span class="token maybe-class-name">Files</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">file</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> filePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token maybe-class-name">PackagePath</span><span class="token punctuation">,</span> file<span class="token punctuation">.</span><span class="token property-access">filename</span><span class="token punctuation">)</span>\n  <span class="token function">fileSave</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'created: \'</span><span class="token punctuation">,</span> filePath<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'DONE!\'</span><span class="token punctuation">)</span>\n\n<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>\n\n<span class="token comment">// package.json</span>\n<span class="token string">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token string">"build:entry"</span><span class="token operator">:</span> <span class="token string">"node build/build.entry.js"</span><span class="token punctuation">,</span>\n  <span class="token string">"new"</span><span class="token operator">:</span> <span class="token string">"node build/new.js"</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n</code></pre>\n<p>最后运行命令添加到npm scripts中，现在新增一个组件只需要运行一条命令即可，比如我要新增商品选择器组件(select-goods)。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> run new select-goods\n</code></pre>\n<p>这里主要做了下面三件事。</p>\n<ol>\n<li>修改components.json文件，如果某个组件存在，直接退出进程。</li>\n<li>在packages目录下新建组件文件夹，并新建<code>index.js</code>、<code>src/index.vue</code>。</li>\n<li>在doc文件夹下新建一个组件的markdown文件，用来编写该组件的使用文档。</li>\n</ol>\n<p>有一点需要注意，组件的index.vue文件中的name字段，都是以<code>Cm</code>打头（<code>name: \'Cm${ComponentName}\'</code>），这里主要是为了更符合HTML5的自定义组件规范，让我们的组件都带有一个小横线<code>-</code>。比如我们新建的组件名为<code>select-goods</code>，组件名就为<code>CmSelectGoods</code>，实际使用时为<code>&lt;cm-select-goods /&gt;</code>。</p>\n<p>添加好新的组件，然后生成入口文件，接下来只要通过webpack打包后发布到NPM包就可以了，但是我们在这一步是没有做的，而是选用了后编译模式。</p>\n<h4 id="%E5%90%8E%E7%BC%96%E8%AF%91%E7%BB%84%E4%BB%B6">后编译组件<a class="anchor" href="#%E5%90%8E%E7%BC%96%E8%AF%91%E7%BB%84%E4%BB%B6">§</a></h4>\n<p>即组件在发布到NPM包的时候，不进行编译，而是和实际引入组件库的项目一起交给webpack打包，这里参考了滴滴的cube-ui的做法（<a href="https://didi.github.io/cube-ui/#/zh-CN/docs/post-compile">去看看</a>）。</p>\n<p>所以我们在组件的package.json的main字段处的值为<code>src/main.js</code>，这是整个组建的入口文件，而不是经过webpack或者rollup打包后的模块。这样做有几个好处。</p>\n<p>首先当我们的组件库依赖了某个包，比如：lodash，然后我们的项目也依赖了lodash。如果我们的组件库在发布到NPM之前已经进行了打包，我们在项目中引入的又是打包后的文件，那么项目会再次把lodash打包一次，因为项目不知道我们的组件依赖了lodash，明显造成了资源浪费。</p>\n<p><img src="https://file.shenfq.com/18-12-19/11972445.jpg" alt=""></p>\n<p><img src="https://file.shenfq.com/18-12-19/50925545.jpg" alt=""></p>\n<p>除了依赖包，一些工具方法也可以放到组件库中，使用的时候直接进行require，这样就不用在多个项目中来回copy代码，毕竟业务代码库，大部分工具方法都是通用的。</p>\n<p>其次组件库与业务代码使用同一babel版本进行代码转换，可以保持代码的一致性。同时在业务代码中直接使用babel-polyfill，减少两次打包多次引入某些es6api的polyfill。</p>\n<p>说了这么多，要做到后编译其实很简单，只需要发布到NPM上时，不进行webpack打包。然后在项目的webpack的babel-loader的inclues添加组件库的路径即可，省时又省力。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n  loader<span class="token operator">:</span> <span class="token string">\'babel-loader\'</span><span class="token punctuation">,</span>\n  include<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">\'src\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">\'node_modules/my-components\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%87%E6%A1%A3">组件的文档<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%87%E6%A1%A3">§</a></h2>\n<p>之前我们在新增组件的时候，为每个组件都在docs文件夹下新建了一个markdown文件。如果每次都要下载项目到docs目录下查看文档对开发者不太友好，那么我们可以将markdown文件转为vue组件，然后部署到demo网站上。这样就只要编写好markdown文档，就能直接同步在demo网站同步显示。这里也是参考的ElementUI的做法，使用<a href="https://github.com/QingWei-Li/vue-markdown-loader">vue-markdown-loader</a>将markdown文件转为vue组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.md$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n  use<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      loader<span class="token operator">:</span> <span class="token string">\'vue-loader\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      loader<span class="token operator">:</span> <span class="token string">\'vue-markdown-loader/lib/markdown-compiler\'</span><span class="token punctuation">,</span>\n      options<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该插件通过<code>markdown-it</code>进行markdown文件解析，同时可以自定义<code>markdown-it</code>插件，进行一些个性化的markdown写法，比如代码高亮、可执行的代码，具体使用方式可以参考ElementUI的<a href="https://github.com/ElemeFE/element/blob/dev/build/webpack.demo.js#L75">webpack配置</a>。</p>\n<p><img src="https://file.shenfq.com/18-12-19/18602732.jpg" alt=""></p>\n<h2 id="%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%8F%91%E5%B8%83">组件如何发布<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%8F%91%E5%B8%83">§</a></h2>\n<p>因为我们要发布到tnpm上，首先需要创建一个tnpm账户，通过<code>tnpm adduser</code>进行账户创建。创建好账户之后，发布到tnpm上，需要使用<code>tnpm publish</code>。</p>\n<p>发布到tnpm因为是公司的内源，所有pkg的name字段一定要包名前面加上<code>@tencent/</code>。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"@tencent/my-components"</span>\n</code></pre>\n<p>发布了包之后，只有发布者有权限更新这个包，这个时候需要添加其他用户到这个包，可以使用如下命令：</p>\n<pre class="language-bash"><code class="language-bash"> tnpm owner <span class="token function">add</span> rtx_at_tencent @tencent/my-components\n</code></pre>\n<p>发布如果有很多步骤，可以通过shell脚本的方式进行发布，下面这个是我们目前项目中使用的。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token shebang important">#!/usr/bin/env bash</span>\n\n<span class="token builtin class-name">set</span> -e\n\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> -n <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> status --porcelain<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'push main.js to remote.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token function">git</span> <span class="token function">add</span> src/main.js\n  <span class="token function">git</span> commit -m <span class="token string">"feat: push main.js to remote."</span>\n  <span class="token function">git</span> push\n<span class="token keyword">fi</span>\n\n<span class="token builtin class-name">echo</span> <span class="token string">"Enter release version: "</span>\n<span class="token builtin class-name">read</span> VERSION\n\n<span class="token builtin class-name">read</span> -p <span class="token string">"Releasing <span class="token variable">$VERSION</span> - are you sure? (y/n)"</span> -n <span class="token number">1</span> -r\n<span class="token builtin class-name">echo</span>    <span class="token comment"># (optional) move to a new line</span>\n<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token environment constant">$REPLY</span> <span class="token operator">=</span>~ ^<span class="token punctuation">[</span>Yy<span class="token punctuation">]</span>$ <span class="token punctuation">]</span><span class="token punctuation">]</span>\n<span class="token keyword">then</span>\n  <span class="token function">npm</span> version <span class="token variable">$VERSION</span> --message <span class="token string">"[release] <span class="token variable">$VERSION</span>"</span>\n  tnpm publish\n<span class="token keyword">fi</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>更多组件化相关知识可以看看民工叔15年的文章：<a href="https://github.com/xufei/blog/issues/22">《Web应用组件化的权衡》</a>，看完之后很有收获，大佬就是大佬，15年写的东西至今一点都不显得过时。</p>\n<p>在基础组件层封装好业务组件后，下一步是否就能够使用拖拽方式，将组件拼接直接生成页面呢？还记得最开始说的，一个组件只做一件事，但是这件事可大可小，如果一个页面做的事就是新建商品、编辑商品，那页面也是一个大组件，最后也是在进行组件的拼接。既然写代码做组件拼接，为什么不能直接用拖拽的方式进行组件拼接呢？这个可能就是我们下一步要做的事情了。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E4%BB%B6" }, "\u4EC0\u4E48\u662F\u7EC4\u4EF6")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B" }, "\u6280\u672F\u9009\u578B")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E9%A1%B9%E7%9B%AE%E6%90%AD%E5%BB%BA" }, "\u9879\u76EE\u642D\u5EFA"),
                React.createElement("ol", null)),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%B0%E5%A2%9E%E4%B8%8E%E6%9E%84%E5%BB%BA" }, "\u7EC4\u4EF6\u7684\u65B0\u589E\u4E0E\u6784\u5EFA"),
                React.createElement("ol", null)),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%BB%84%E4%BB%B6%E7%9A%84%E6%96%87%E6%A1%A3" }, "\u7EC4\u4EF6\u7684\u6587\u6863")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%8F%91%E5%B8%83" }, "\u7EC4\u4EF6\u5982\u4F55\u53D1\u5E03")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/10/23",
    'updated': null,
    'excerpt': "最近一直在做管理端相关的需求，管理端不比h5每天都有高流量，需要不断地做性能上的优化，以及适配不同设备兼容性。但是管理端也面临着自己的挑战，因为项目越来越大，可配置化的东西就越来越多，管理端的页面也就越多，同时面...",
    'cover': "https://file.shenfq.com/18-12-19/84472576.jpg",
    'categories': [
        "前端"
    ],
    'tags': [
        "前端",
        "组件化"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "cover": "https://file.shenfq.com/pic/202112151621995.png"
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
                "count": 31
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
                "count": 4
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
                "name": "前端框架",
                "count": 13
            },
            {
                "name": "JavaScript",
                "count": 11
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
                "name": "Node",
                "count": 7
            },
            {
                "name": "Vue.js",
                "count": 7
            },
            {
                "name": "工作",
                "count": 7
            },
            {
                "name": "感悟",
                "count": 7
            },
            {
                "name": "总结",
                "count": 6
            },
            {
                "name": "翻译",
                "count": 5
            },
            {
                "name": "Promise",
                "count": 3
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
                "name": "编译",
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
