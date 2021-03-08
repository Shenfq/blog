import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/小程序依赖分析.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/小程序依赖分析.html",
    'title': "小程序依赖分析",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>小程序依赖分析</h1>\n<p>用过 webpack 的同学肯定知道 <code>webpack-bundle-analyzer</code> ，可以用来分析当前项目 js 文件的依赖关系。</p>\n<p><img src="https://file.shenfq.com/pic/20201030230741.png" alt="webpack-bundle-analyzer"></p>\n<p>因为最近一直在做小程序业务，而且小程序对包体大小特别敏感，所以就想着能不能做一个类似的工具，用来查看当前小程序各个主包与分包之间的依赖关系。经过几天的折腾终于做出来了，效果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201103115231.png" alt="小程序依赖关系"></p>\n<p>今天的文章就带大家来实现这个工具。</p>\n<h2 id="%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3">小程序入口<a class="anchor" href="#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3">§</a></h2>\n<p>小程序的页面通过 <code>app.json</code> 的 <code>pages</code> 参数定义，用于指定小程序由哪些页面组成，每一项都对应一个页面的路径（含文件名） 信息。 <code>pages</code> 内的每个页面，小程序都会去寻找对应的 <code>json</code>, <code>js</code>, <code>wxml</code>, <code>wxss</code> 四个文件进行处理。</p>\n<p>如开发目录为：</p>\n<pre class="language-autoit"><code class="language-autoit">├── app<span class="token punctuation">.</span>js\n├── app<span class="token punctuation">.</span>json\n├── app<span class="token punctuation">.</span>wxss\n├── pages\n│   │── index\n│   │   ├── index<span class="token punctuation">.</span>wxml\n│   │   ├── index<span class="token punctuation">.</span>js\n│   │   ├── index<span class="token punctuation">.</span>json\n│   │   └── index<span class="token punctuation">.</span>wxss\n│   └── logs\n│       ├── logs<span class="token punctuation">.</span>wxml\n│       └── logs<span class="token punctuation">.</span>js\n└── utils\n</code></pre>\n<p>则需要在 app.json 中写：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"pages"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"pages/index/index"</span><span class="token punctuation">,</span> <span class="token string">"pages/logs/logs"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>为了方便演示，我们先 fork 一份小程序的官方demo，然后新建一个文件 <code>depend.js</code>，依赖分析相关的工作就在这个文件里面实现。</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">git</span> clone <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:wechat-miniprogram/miniprogram-demo.git\n$ <span class="token builtin class-name">cd</span> miniprogram-demo\n$ <span class="token function">touch</span> depend.js\n</code></pre>\n<p>其大致的目录结构如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201031202105.png" alt="目录结构"></p>\n<p>以 <code>app.json</code> 为入口，我们可以获取所有主包下的页面。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs-extra\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> root <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取绝对地址</span>\n  <span class="token function">getAbsolute</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">,</span> file<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> appPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span><span class="token string">\'app.json\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> appJson <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>appPath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> pages <span class="token punctuation">}</span> <span class="token operator">=</span> appJson <span class="token comment">// 主包的所有页面</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>每个页面会对应 <code>json</code>, <code>js</code>, <code>wxml</code>, <code>wxss</code> 四个文件：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token maybe-class-name">Extends</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.json\'</span><span class="token punctuation">,</span> <span class="token string">\'.wxml\'</span><span class="token punctuation">,</span> <span class="token string">\'.wxss\'</span><span class="token punctuation">]</span>\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 存储文件</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 修改文件后缀</span>\n  <span class="token function">replaceExt</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> ext <span class="token operator">=</span> <span class="token string">\'\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> extName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> fileName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">basename</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> extName<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> fileName <span class="token operator">+</span> ext<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 省略获取 pages 过程</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 获取绝对地址</span>\n      <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n      <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 每个页面都需要判断 js、json、wxml、wxss 是否存在</span>\n        <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>现在 pages 内页面相关的文件都放到 files 字段存起来了。</p>\n<h2 id="%E6%9E%84%E9%80%A0%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84">构造树形结构<a class="anchor" href="#%E6%9E%84%E9%80%A0%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84">§</a></h2>\n<p>拿到文件后，我们需要依据各个文件构造一个树形结构的文件树，用于后续展示依赖关系。</p>\n<p>假设我们有一个 <code>pages</code> 目录，<code>pages</code> 目录下有两个页面：<code>detail</code>、<code>index</code> ，这两个 页面文件夹下有四个对应的文件。</p>\n<pre class="language-bash"><code class="language-bash">pages\n├── detail\n│   ├── detail.js\n│   ├── detail.json\n│   ├── detail.wxml\n│   └── detail.wxss\n└── index\n    ├── index.js\n    ├── index.json\n    ├── index.wxml\n    └── index.wxss\n</code></pre>\n<p>依据上面的目录结构，我们构造一个如下的文件树结构，<code>size</code> 用于表示当前文件或文件夹的大小，<code>children</code> 存放文件夹下的文件，如果是文件则没有 <code>children</code> 属性。</p>\n<pre class="language-js"><code class="language-js">pages <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">8</span><span class="token punctuation">,</span>\n  <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"detail"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n      <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"detail.js"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.json"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.wxml"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.wxss"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"index"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n      <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"index.js"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.json"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.wxml"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.wxss"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们先在构造函数构造一个 <code>tree</code> 字段用来存储文件树的数据，然后我们将每个文件都传入 <code>addToTree</code> 方法，将文件添加到树中 。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      size<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 省略获取 pages 过程</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n      <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 调用 addToTree</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>接下来实现 <code>addToTree</code> 方法：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略之前的部分代码</span>\n\n  <span class="token comment">// 获取相对地址</span>\n  <span class="token function">getRelative</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">relative</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">,</span> file<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取文件大小，单位 KB</span>\n  <span class="token function">getSize</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> stats <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">statSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> stats<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">/</span> <span class="token number">1024</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 将文件添加到树中</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> size <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getSize</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token comment">// 将文件路径转化成数组</span>\n    <span class="token comment">// \'pages/index/index.js\' =></span>\n    <span class="token comment">// [\'pages\', \'index\', \'index.js\']</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> lastIdx <span class="token operator">=</span> names<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n    <span class="token keyword">let</span> point <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">.</span><span class="token property-access">children</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>idx <span class="token operator">===</span> lastIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span> size <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">return</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n          size<span class="token punctuation">,</span> children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n      <span class="token punctuation">}</span>\n      point <span class="token operator">=</span> point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将文件添加的 files</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们可以在运行之后，将文件输出到 <code>tree.json</code> 看看。</p>\n<pre class="language-js"><code class="language-js"> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n   <span class="token comment">// ...</span>\n   pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n     <span class="token comment">//...</span>\n   <span class="token punctuation">}</span><span class="token punctuation">)</span>\n   fs<span class="token punctuation">.</span><span class="token method function property-access">writeJSONSync</span><span class="token punctuation">(</span><span class="token string">\'tree.json\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> spaces<span class="token operator">:</span> <span class="token number">2</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n <span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201031232716.png" alt="tree.json"></p>\n<h2 id="%E8%8E%B7%E5%8F%96%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB">获取依赖关系<a class="anchor" href="#%E8%8E%B7%E5%8F%96%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB">§</a></h2>\n<p>上面的步骤看起来没什么问题，但是我们缺少了重要的一环，那就是我们在构造文件树之前，还需要得到每个文件的依赖项，这样输出的才是小程序完整的文件树。文件的依赖关系需要分成四部分来讲，分别是  <code>js</code>, <code>json</code>, <code>wxml</code>, <code>wxss</code>  这四种类型文件获取依赖的方式。</p>\n<h3 id="%E8%8E%B7%E5%8F%96-js-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .js 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-js-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>小程序支持 CommonJS 的方式进行模块化，如果开启了 es6，也能支持 ESM 进行模块化。我们如果要获得一个 <code>js</code> 文件的依赖，首先要明确，js 文件导入模块的三种写法，针对下面三种语法，我们可以引入 Babel 来获取依赖。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">a</span> <span class="token keyword module">from</span> <span class="token string">\'./a.js\'</span>\n<span class="token keyword module">export</span> b <span class="token keyword module">from</span> <span class="token string">\'./b.js\'</span>\n<span class="token keyword">const</span> c <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./c.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p>通过 <code>@babel/parser</code> 将代码转化为 AST，然后通过 <code>@babel/traverse</code> 遍历 AST 节点，获取上面三种导入方式的值，放到数组。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> parse <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'@babel/parser\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token keyword module">default</span><span class="token operator">:</span> traverse <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'@babel/traverse\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">jsDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token comment">// 读取 js 文件内容</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将代码转化为 AST</span>\n    <span class="token keyword">const</span> ast <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>content<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      sourceType<span class="token operator">:</span> <span class="token string">\'module\'</span><span class="token punctuation">,</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'exportDefaultFrom\'</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 遍历 AST</span>\n    <span class="token function">traverse</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">ImportDeclaration</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取 import from 地址</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">source</span>\n        <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">ExportNamedDeclaration</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取 export from 地址</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">source</span>\n        <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">CallExpression</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n          <span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">&amp;&amp;</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">===</span> <span class="token string">\'require\'</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>\n          node<span class="token punctuation">.</span><span class="token property-access">arguments</span><span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">>=</span> <span class="token number">1</span>\n        <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 获取 require 地址</span>\n          <span class="token keyword">const</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">arguments</span>\n          <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在获取依赖模块的路径后，还不能立即将路径添加到依赖数组内，因为根据模块语法 <code>js</code> 后缀是可以省略的，另外 require 的路径是一个文件夹的时候，默认会导入该文件夹下的 <code>index.js</code> 。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取某个路径的脚本文件</span>\n  <span class="token function">transformScript</span><span class="token punctuation">(</span><span class="token parameter">url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> ext <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span>\n    <span class="token comment">// 如果存在后缀，表示当前已经是一个文件</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>ext <span class="token operator">===</span> <span class="token string">\'.js\'</span> <span class="token operator">&amp;&amp;</span> fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> url\n    <span class="token punctuation">}</span>\n    <span class="token comment">// a/b/c => a/b/c.js</span>\n    <span class="token keyword">const</span> jsFile <span class="token operator">=</span> url <span class="token operator">+</span> <span class="token string">\'.js\'</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> jsFile\n    <span class="token punctuation">}</span>\n    <span class="token comment">// a/b/c => a/b/c/index.js</span>\n    <span class="token keyword">const</span> jsIndexFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token string">\'index.js\'</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>jsIndexFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> jsIndexFile\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">jsDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们可以创建一个 <code>js</code>，看看输出的 <code>deps</code> 是否正确：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 文件路径：/Users/shenfq/Code/fork/miniprogram-demo/</span>\n<span class="token keyword module">import</span> <span class="token imports">a</span> <span class="token keyword module">from</span> <span class="token string">\'./a.js\'</span>\n<span class="token keyword module">export</span> b <span class="token keyword module">from</span> <span class="token string">\'../b.js\'</span>\n<span class="token keyword">const</span> c <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../c.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201101134549.png" alt="image-20201101134549678"></p>\n<h3 id="%E8%8E%B7%E5%8F%96-json-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .json 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-json-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p><code>json</code> 文件本身是不支持模块化的，但是小程序可以通过 <code>json</code> 文件导入自定义组件，只需要在页面的 <code>json</code> 文件通过 <code>usingComponents</code> 进行引用声明。<code>usingComponents</code> 为一个对象，键为自定义组件的标签名，值为自定义组件文件路径：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"usingComponents"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"component-tag-name"</span><span class="token operator">:</span> <span class="token string">"path/to/the/custom/component"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>自定义组件与小程序页面一样，也会对应四个文件，所以我们需要获取 <code>json</code> 中 <code>usingComponents</code> 内的所有依赖项，并判断每个组件对应的那四个文件是否存在，然后添加到依赖项内。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">jsonDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> usingComponents <span class="token punctuation">}</span> <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>usingComponents <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> usingComponents <span class="token operator">===</span> <span class="token string">\'object\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">values</span><span class="token punctuation">(</span>usingComponents<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        component <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n        <span class="token comment">// 每个组件都需要判断 js/json/wxml/wxss 文件是否存在</span>\n        <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">ext</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>component<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%8E%B7%E5%8F%96-wxml-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .wxml 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-wxml-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>wxml 提供两种文件引用方式 <code>import</code> 和 <code>include</code>。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>import</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>a.wxml<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>include</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>b.wxml<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n</code></pre>\n<p>wxml 文件本质上还是一个 html 文件，所以可以通过 html parser 对 wxml 文件进行解析，关于 html parser 相关的原理可以看我之前写过的文章  <a href="https://blog.shenfq.com/2020/vue-%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/">《Vue 模板编译原理》</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> htmlparser2 <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'htmlparser2\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">wxmlDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> htmlParser <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">htmlparser2<span class="token punctuation">.</span>Parser</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      <span class="token function">onopentag</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> attribs <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>name <span class="token operator">!==</span> <span class="token string">\'import\'</span> <span class="token operator">&amp;&amp;</span> name <span class="token operator">!==</span> <span class="token string">\'include\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> src <span class="token punctuation">}</span> <span class="token operator">=</span> attribs\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>src<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">const</span> wxmlFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> src<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    htmlParser<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span>\n    htmlParser<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%8E%B7%E5%8F%96-wxss-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .wxss 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-wxss-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>最后 wxss 文件导入样式和 css 语法一致，使用 <code>@import</code> 语句可以导入外联样式表。</p>\n<pre class="language-css"><code class="language-css"><span class="token atrule"><span class="token rule">@import</span> <span class="token string">"common.wxss"</span><span class="token punctuation">;</span></span>\n</code></pre>\n<p>可以通过 <code>postcss</code> 解析 wxss 文件，然后获取导入文件的地址，但是这里我们偷个懒，直接通过简单的正则匹配来做。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">wxssDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> importRegExp <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">@import\s*[\'"](.+)[\'"];*</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n    <span class="token keyword">let</span> matched\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>matched <span class="token operator">=</span> importRegExp<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>matched<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">continue</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">const</span> wxssFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> matched<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>wxssFile<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B0%86%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%A0%91%E7%BB%93%E6%9E%84%E4%B8%AD">将依赖添加到树结构中<a class="anchor" href="#%E5%B0%86%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%A0%91%E7%BB%93%E6%9E%84%E4%B8%AD">§</a></h3>\n<p>现在我们需要修改 <code>addToTree</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">getDeps</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> ext <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ext<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">Deps</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ext<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">Deps</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">]</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// ... 添加到树中</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n\n    <span class="token comment">// ===== 获取文件依赖，并添加到树中 =====</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getDeps</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span>      \n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201101205623.png" alt="image-20201101205623259"></p>\n<h2 id="%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%85%E4%BE%9D%E8%B5%96">获取分包依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%85%E4%BE%9D%E8%B5%96">§</a></h2>\n<p>熟悉小程序的同学肯定知道，小程序提供了<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html">分包机制</a>。使用分包后，分包内的文件会被打包成一个单独的包，在用到的时候才会加载，而其他的文件则会放在主包，小程序打开的时候就会加载。<code>subpackages</code> 中，每个分包的配置有以下几项：</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th style="text-align:left">字段</th>\n<th style="text-align:left">类型</th>\n<th style="text-align:left">说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td style="text-align:left">root</td>\n<td style="text-align:left">String</td>\n<td style="text-align:left">分包根目录</td>\n</tr>\n<tr>\n<td style="text-align:left">name</td>\n<td style="text-align:left">String</td>\n<td style="text-align:left">分包别名，<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html">分包预下载</a>时可以使用</td>\n</tr>\n<tr>\n<td style="text-align:left">pages</td>\n<td style="text-align:left">StringArray</td>\n<td style="text-align:left">分包页面路径，相对与分包根目录</td>\n</tr>\n<tr>\n<td style="text-align:left">independent</td>\n<td style="text-align:left">Boolean</td>\n<td style="text-align:left">分包是否是<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html">独立分包</a></td>\n</tr>\n</tbody>\n</table></div>\n<p>所以我们在运行的时候，除了要拿到 <code>pages</code> 下的所有页面，还需拿到 <code>subpackages</code> 中所有的页面。由于之前只关心主包的内容，<code>this.tree</code> 下面只有一颗文件树，现在我们需要在 <code>this.tree</code> 下挂载多颗文件树，我们需要先为主包创建一个单独的文件树，然后为每个分包创建一个文件树。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">createTree</span><span class="token punctuation">(</span><span class="token parameter">pkg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">[</span>pkg<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      size<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">addPage</span><span class="token punctuation">(</span><span class="token parameter">page<span class="token punctuation">,</span> pkg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n    <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> pkg<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> appPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span><span class="token string">\'app.json\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> appJson <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>appPath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> pages<span class="token punctuation">,</span> subPackages<span class="token punctuation">,</span> subpackages <span class="token punctuation">}</span> <span class="token operator">=</span> appJson\n    \n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">createTree</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">)</span> <span class="token comment">// 为主包创建文件树</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addPage</span><span class="token punctuation">(</span>page<span class="token punctuation">,</span> <span class="token string">\'main\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 由于 app.json 中 subPackages、subpackages 都能生效</span>\n    <span class="token comment">// 所以我们两个属性都获取，哪个存在就用哪个</span>\n    <span class="token keyword">const</span> subPkgs <span class="token operator">=</span> subPackages <span class="token operator">||</span> subpackages\n    <span class="token comment">// 分包存在的时候才进行遍历</span>\n    subPkgs <span class="token operator">&amp;&amp;</span> subPkgs<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> root<span class="token punctuation">,</span> pages <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      root <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">createTree</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token comment">// 为分包创建文件树</span>\n      pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addPage</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>root<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>page<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span> pkg<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 输出文件树</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">writeJSONSync</span><span class="token punctuation">(</span><span class="token string">\'tree.json\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> spaces<span class="token operator">:</span> <span class="token number">2</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>addToTree</code> 方法也需要进行修改，根据传入的 <code>pkg</code> 来判断将当前文件添加到哪个树。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> pkg <span class="token operator">=</span> <span class="token string">\'main\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">let</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pkg <span class="token operator">!==</span> <span class="token string">\'main\'</span> <span class="token operator">&amp;&amp;</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>pkg<span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件不是以分包名开头，证明该文件不在分包内，</span>\n      <span class="token comment">// 需要将文件添加到主包的文件树内</span>\n      pkg <span class="token operator">=</span> <span class="token string">\'main\'</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> tree <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">[</span>pkg<span class="token punctuation">]</span> <span class="token comment">// 依据 pkg 取到对应的树</span>\n    <span class="token keyword">const</span> size <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getSize</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> lastIdx <span class="token operator">=</span> names<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n\n    tree<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n    <span class="token keyword">let</span> point <span class="token operator">=</span> tree<span class="token punctuation">.</span><span class="token property-access">children</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// ... 添加到树中</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n\n    <span class="token comment">// ===== 获取文件依赖，并添加到树中 =====</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getDeps</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span>      \n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里有一点需要注意，如果 <code>package/a</code> 分包下的文件依赖的文件不在 <code>package/a</code>  文件夹下，则该文件需要放入主包的文件树内。</p>\n<h2 id="%E9%80%9A%E8%BF%87-echart-%E7%94%BB%E5%9B%BE">通过 EChart 画图<a class="anchor" href="#%E9%80%9A%E8%BF%87-echart-%E7%94%BB%E5%9B%BE">§</a></h2>\n<p>经过上面的流程后，最终我们可以得到如下的一个 json 文件：</p>\n<p><img src="https://file.shenfq.com/pic/20201102001906.png" alt="tree.json"></p>\n<p>接下来，我们利用 ECharts 的画图能力，将这个 json 数据以图表的形式展现出来。我们可以在 ECharts 提供的实例中看到一个 <a href="https://echarts.apache.org/examples/zh/editor.html?c=treemap-disk">Disk Usage</a> 的案例，很符合我们的预期。</p>\n<p><img src="https://file.shenfq.com/pic/20201102002332.png" alt="ECharts"></p>\n<p>ECharts 的配置这里就不再赘述，按照官网的 demo 即可，我们需要把 <code>tree. json</code> 的数据转化为 ECharts 需要的格式就行了，完整的代码放到 codesandbod 了，去下面的线上地址就能看到效果了。</p>\n<blockquote>\n<p>线上地址：<a href="https://codesandbox.io/s/cold-dawn-kufc9">https://codesandbox.io/s/cold-dawn-kufc9</a></p>\n</blockquote>\n<p><img src="https://file.shenfq.com/pic/20201102004105.png" alt="最后效果"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>这篇文章比较偏实践，所以贴了很多的代码，另外本文对各个文件的依赖获取提供了一个思路，虽然这里只是用文件树构造了一个这样的依赖图。</p>\n<p>在业务开发中，小程序 IDE 每次启动都需要进行全量的编译，开发版预览的时候会等待较长的时间，我们现在有文件依赖关系后，就可以只选取目前正在开发的页面进行打包，这样就能大大提高我们的开发效率。如果有对这部分内容感兴趣的，可以另外写一篇文章介绍下如何实现。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u5C0F\u7A0B\u5E8F\u4F9D\u8D56\u5206\u6790"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>用过 webpack 的同学肯定知道 <code>webpack-bundle-analyzer</code> ，可以用来分析当前项目 js 文件的依赖关系。</p>\n<p><img src="https://file.shenfq.com/pic/20201030230741.png" alt="webpack-bundle-analyzer"></p>\n<p>因为最近一直在做小程序业务，而且小程序对包体大小特别敏感，所以就想着能不能做一个类似的工具，用来查看当前小程序各个主包与分包之间的依赖关系。经过几天的折腾终于做出来了，效果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201103115231.png" alt="小程序依赖关系"></p>\n<p>今天的文章就带大家来实现这个工具。</p>\n<h2 id="%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3">小程序入口<a class="anchor" href="#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3">§</a></h2>\n<p>小程序的页面通过 <code>app.json</code> 的 <code>pages</code> 参数定义，用于指定小程序由哪些页面组成，每一项都对应一个页面的路径（含文件名） 信息。 <code>pages</code> 内的每个页面，小程序都会去寻找对应的 <code>json</code>, <code>js</code>, <code>wxml</code>, <code>wxss</code> 四个文件进行处理。</p>\n<p>如开发目录为：</p>\n<pre class="language-autoit"><code class="language-autoit">├── app<span class="token punctuation">.</span>js\n├── app<span class="token punctuation">.</span>json\n├── app<span class="token punctuation">.</span>wxss\n├── pages\n│   │── index\n│   │   ├── index<span class="token punctuation">.</span>wxml\n│   │   ├── index<span class="token punctuation">.</span>js\n│   │   ├── index<span class="token punctuation">.</span>json\n│   │   └── index<span class="token punctuation">.</span>wxss\n│   └── logs\n│       ├── logs<span class="token punctuation">.</span>wxml\n│       └── logs<span class="token punctuation">.</span>js\n└── utils\n</code></pre>\n<p>则需要在 app.json 中写：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"pages"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"pages/index/index"</span><span class="token punctuation">,</span> <span class="token string">"pages/logs/logs"</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>为了方便演示，我们先 fork 一份小程序的官方demo，然后新建一个文件 <code>depend.js</code>，依赖分析相关的工作就在这个文件里面实现。</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">git</span> clone <a class="token email-link" href="mailto:git@github.com">git@github.com</a>:wechat-miniprogram/miniprogram-demo.git\n$ <span class="token builtin class-name">cd</span> miniprogram-demo\n$ <span class="token function">touch</span> depend.js\n</code></pre>\n<p>其大致的目录结构如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201031202105.png" alt="目录结构"></p>\n<p>以 <code>app.json</code> 为入口，我们可以获取所有主包下的页面。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs-extra\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> root <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取绝对地址</span>\n  <span class="token function">getAbsolute</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">,</span> file<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> appPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span><span class="token string">\'app.json\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> appJson <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>appPath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> pages <span class="token punctuation">}</span> <span class="token operator">=</span> appJson <span class="token comment">// 主包的所有页面</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>每个页面会对应 <code>json</code>, <code>js</code>, <code>wxml</code>, <code>wxss</code> 四个文件：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token maybe-class-name">Extends</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.json\'</span><span class="token punctuation">,</span> <span class="token string">\'.wxml\'</span><span class="token punctuation">,</span> <span class="token string">\'.wxss\'</span><span class="token punctuation">]</span>\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 存储文件</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 修改文件后缀</span>\n  <span class="token function">replaceExt</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> ext <span class="token operator">=</span> <span class="token string">\'\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> extName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> fileName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">basename</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> extName<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> fileName <span class="token operator">+</span> ext<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 省略获取 pages 过程</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 获取绝对地址</span>\n      <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n      <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 每个页面都需要判断 js、json、wxml、wxss 是否存在</span>\n        <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>现在 pages 内页面相关的文件都放到 files 字段存起来了。</p>\n<h2 id="%E6%9E%84%E9%80%A0%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84">构造树形结构<a class="anchor" href="#%E6%9E%84%E9%80%A0%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84">§</a></h2>\n<p>拿到文件后，我们需要依据各个文件构造一个树形结构的文件树，用于后续展示依赖关系。</p>\n<p>假设我们有一个 <code>pages</code> 目录，<code>pages</code> 目录下有两个页面：<code>detail</code>、<code>index</code> ，这两个 页面文件夹下有四个对应的文件。</p>\n<pre class="language-bash"><code class="language-bash">pages\n├── detail\n│   ├── detail.js\n│   ├── detail.json\n│   ├── detail.wxml\n│   └── detail.wxss\n└── index\n    ├── index.js\n    ├── index.json\n    ├── index.wxml\n    └── index.wxss\n</code></pre>\n<p>依据上面的目录结构，我们构造一个如下的文件树结构，<code>size</code> 用于表示当前文件或文件夹的大小，<code>children</code> 存放文件夹下的文件，如果是文件则没有 <code>children</code> 属性。</p>\n<pre class="language-js"><code class="language-js">pages <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">8</span><span class="token punctuation">,</span>\n  <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"detail"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n      <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"detail.js"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.json"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.wxml"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"detail.wxss"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"index"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n      <span class="token string">"children"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"index.js"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.json"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.wxml"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token string">"index.wxss"</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token string">"size"</span><span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们先在构造函数构造一个 <code>tree</code> 字段用来存储文件树的数据，然后我们将每个文件都传入 <code>addToTree</code> 方法，将文件添加到树中 。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      size<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 省略获取 pages 过程</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n      <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 调用 addToTree</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>接下来实现 <code>addToTree</code> 方法：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略之前的部分代码</span>\n\n  <span class="token comment">// 获取相对地址</span>\n  <span class="token function">getRelative</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> path<span class="token punctuation">.</span><span class="token method function property-access">relative</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">,</span> file<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取文件大小，单位 KB</span>\n  <span class="token function">getSize</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> stats <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">statSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> stats<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">/</span> <span class="token number">1024</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 将文件添加到树中</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> size <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getSize</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token comment">// 将文件路径转化成数组</span>\n    <span class="token comment">// \'pages/index/index.js\' =></span>\n    <span class="token comment">// [\'pages\', \'index\', \'index.js\']</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> lastIdx <span class="token operator">=</span> names<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n    <span class="token keyword">let</span> point <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">.</span><span class="token property-access">children</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>idx <span class="token operator">===</span> lastIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span> size <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">return</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n          size<span class="token punctuation">,</span> children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n      <span class="token punctuation">}</span>\n      point <span class="token operator">=</span> point<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将文件添加的 files</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们可以在运行之后，将文件输出到 <code>tree.json</code> 看看。</p>\n<pre class="language-js"><code class="language-js"> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n   <span class="token comment">// ...</span>\n   pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n     <span class="token comment">//...</span>\n   <span class="token punctuation">}</span><span class="token punctuation">)</span>\n   fs<span class="token punctuation">.</span><span class="token method function property-access">writeJSONSync</span><span class="token punctuation">(</span><span class="token string">\'tree.json\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> spaces<span class="token operator">:</span> <span class="token number">2</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n <span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201031232716.png" alt="tree.json"></p>\n<h2 id="%E8%8E%B7%E5%8F%96%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB">获取依赖关系<a class="anchor" href="#%E8%8E%B7%E5%8F%96%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB">§</a></h2>\n<p>上面的步骤看起来没什么问题，但是我们缺少了重要的一环，那就是我们在构造文件树之前，还需要得到每个文件的依赖项，这样输出的才是小程序完整的文件树。文件的依赖关系需要分成四部分来讲，分别是  <code>js</code>, <code>json</code>, <code>wxml</code>, <code>wxss</code>  这四种类型文件获取依赖的方式。</p>\n<h3 id="%E8%8E%B7%E5%8F%96-js-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .js 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-js-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>小程序支持 CommonJS 的方式进行模块化，如果开启了 es6，也能支持 ESM 进行模块化。我们如果要获得一个 <code>js</code> 文件的依赖，首先要明确，js 文件导入模块的三种写法，针对下面三种语法，我们可以引入 Babel 来获取依赖。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">a</span> <span class="token keyword module">from</span> <span class="token string">\'./a.js\'</span>\n<span class="token keyword module">export</span> b <span class="token keyword module">from</span> <span class="token string">\'./b.js\'</span>\n<span class="token keyword">const</span> c <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./c.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p>通过 <code>@babel/parser</code> 将代码转化为 AST，然后通过 <code>@babel/traverse</code> 遍历 AST 节点，获取上面三种导入方式的值，放到数组。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> parse <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'@babel/parser\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token keyword module">default</span><span class="token operator">:</span> traverse <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'@babel/traverse\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">jsDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token comment">// 读取 js 文件内容</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将代码转化为 AST</span>\n    <span class="token keyword">const</span> ast <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>content<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      sourceType<span class="token operator">:</span> <span class="token string">\'module\'</span><span class="token punctuation">,</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'exportDefaultFrom\'</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 遍历 AST</span>\n    <span class="token function">traverse</span><span class="token punctuation">(</span>ast<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">ImportDeclaration</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取 import from 地址</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">source</span>\n        <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">ExportNamedDeclaration</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取 export from 地址</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">source</span>\n        <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function"><span class="token maybe-class-name">CallExpression</span></span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> node <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n          <span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">&amp;&amp;</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">===</span> <span class="token string">\'require\'</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>\n          node<span class="token punctuation">.</span><span class="token property-access">arguments</span><span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">>=</span> <span class="token number">1</span>\n        <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 获取 require 地址</span>\n          <span class="token keyword">const</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">arguments</span>\n          <span class="token keyword">const</span> jsFile <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">transformScript</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在获取依赖模块的路径后，还不能立即将路径添加到依赖数组内，因为根据模块语法 <code>js</code> 后缀是可以省略的，另外 require 的路径是一个文件夹的时候，默认会导入该文件夹下的 <code>index.js</code> 。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取某个路径的脚本文件</span>\n  <span class="token function">transformScript</span><span class="token punctuation">(</span><span class="token parameter">url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> ext <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span>\n    <span class="token comment">// 如果存在后缀，表示当前已经是一个文件</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>ext <span class="token operator">===</span> <span class="token string">\'.js\'</span> <span class="token operator">&amp;&amp;</span> fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> url\n    <span class="token punctuation">}</span>\n    <span class="token comment">// a/b/c => a/b/c.js</span>\n    <span class="token keyword">const</span> jsFile <span class="token operator">=</span> url <span class="token operator">+</span> <span class="token string">\'.js\'</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>jsFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> jsFile\n    <span class="token punctuation">}</span>\n    <span class="token comment">// a/b/c => a/b/c/index.js</span>\n    <span class="token keyword">const</span> jsIndexFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token string">\'index.js\'</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>jsIndexFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> jsIndexFile\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">jsDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们可以创建一个 <code>js</code>，看看输出的 <code>deps</code> 是否正确：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 文件路径：/Users/shenfq/Code/fork/miniprogram-demo/</span>\n<span class="token keyword module">import</span> <span class="token imports">a</span> <span class="token keyword module">from</span> <span class="token string">\'./a.js\'</span>\n<span class="token keyword module">export</span> b <span class="token keyword module">from</span> <span class="token string">\'../b.js\'</span>\n<span class="token keyword">const</span> c <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../c.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201101134549.png" alt="image-20201101134549678"></p>\n<h3 id="%E8%8E%B7%E5%8F%96-json-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .json 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-json-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p><code>json</code> 文件本身是不支持模块化的，但是小程序可以通过 <code>json</code> 文件导入自定义组件，只需要在页面的 <code>json</code> 文件通过 <code>usingComponents</code> 进行引用声明。<code>usingComponents</code> 为一个对象，键为自定义组件的标签名，值为自定义组件文件路径：</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"usingComponents"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"component-tag-name"</span><span class="token operator">:</span> <span class="token string">"path/to/the/custom/component"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>自定义组件与小程序页面一样，也会对应四个文件，所以我们需要获取 <code>json</code> 中 <code>usingComponents</code> 内的所有依赖项，并判断每个组件对应的那四个文件是否存在，然后添加到依赖项内。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">jsonDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> usingComponents <span class="token punctuation">}</span> <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>usingComponents <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> usingComponents <span class="token operator">===</span> <span class="token string">\'object\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">values</span><span class="token punctuation">(</span>usingComponents<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        component <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n        <span class="token comment">// 每个组件都需要判断 js/json/wxml/wxss 文件是否存在</span>\n        <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">ext</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>component<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%8E%B7%E5%8F%96-wxml-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .wxml 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-wxml-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>wxml 提供两种文件引用方式 <code>import</code> 和 <code>include</code>。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>import</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>a.wxml<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>include</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>b.wxml<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n</code></pre>\n<p>wxml 文件本质上还是一个 html 文件，所以可以通过 html parser 对 wxml 文件进行解析，关于 html parser 相关的原理可以看我之前写过的文章  <a href="https://blog.shenfq.com/2020/vue-%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/">《Vue 模板编译原理》</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> htmlparser2 <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'htmlparser2\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">wxmlDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> htmlParser <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">htmlparser2<span class="token punctuation">.</span>Parser</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      <span class="token function">onopentag</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> attribs <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>name <span class="token operator">!==</span> <span class="token string">\'import\'</span> <span class="token operator">&amp;&amp;</span> name <span class="token operator">!==</span> <span class="token string">\'include\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">const</span> <span class="token punctuation">{</span> src <span class="token punctuation">}</span> <span class="token operator">=</span> attribs\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>src<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword">const</span> wxmlFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> src<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    htmlParser<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span>\n    htmlParser<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%8E%B7%E5%8F%96-wxss-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">获取 .wxss 文件依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96-wxss-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>最后 wxss 文件导入样式和 css 语法一致，使用 <code>@import</code> 语句可以导入外联样式表。</p>\n<pre class="language-css"><code class="language-css"><span class="token atrule"><span class="token rule">@import</span> <span class="token string">"common.wxss"</span><span class="token punctuation">;</span></span>\n</code></pre>\n<p>可以通过 <code>postcss</code> 解析 wxss 文件，然后获取导入文件的地址，但是这里我们偷个懒，直接通过简单的正则匹配来做。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">wxssDeps</span><span class="token punctuation">(</span><span class="token parameter">file</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">const</span> dirName <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> content <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> importRegExp <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">@import\s*[\'"](.+)[\'"];*</span><span class="token regex-delimiter">/</span><span class="token regex-flags">g</span></span>\n    <span class="token keyword">let</span> matched\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>matched <span class="token operator">=</span> importRegExp<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>matched<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">continue</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">const</span> wxssFile <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dirName<span class="token punctuation">,</span> matched<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>wxmlFile<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        deps<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>wxssFile<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">return</span> deps\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B0%86%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%A0%91%E7%BB%93%E6%9E%84%E4%B8%AD">将依赖添加到树结构中<a class="anchor" href="#%E5%B0%86%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%A0%91%E7%BB%93%E6%9E%84%E4%B8%AD">§</a></h3>\n<p>现在我们需要修改 <code>addToTree</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">getDeps</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> ext <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ext<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">Deps</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">[</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ext<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">Deps</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">]</span><span class="token punctuation">(</span>filepath<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span><span class="token parameter">filePath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// ... 添加到树中</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n\n    <span class="token comment">// ===== 获取文件依赖，并添加到树中 =====</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getDeps</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span>      \n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201101205623.png" alt="image-20201101205623259"></p>\n<h2 id="%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%85%E4%BE%9D%E8%B5%96">获取分包依赖<a class="anchor" href="#%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%85%E4%BE%9D%E8%B5%96">§</a></h2>\n<p>熟悉小程序的同学肯定知道，小程序提供了<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html">分包机制</a>。使用分包后，分包内的文件会被打包成一个单独的包，在用到的时候才会加载，而其他的文件则会放在主包，小程序打开的时候就会加载。<code>subpackages</code> 中，每个分包的配置有以下几项：</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th style="text-align:left">字段</th>\n<th style="text-align:left">类型</th>\n<th style="text-align:left">说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td style="text-align:left">root</td>\n<td style="text-align:left">String</td>\n<td style="text-align:left">分包根目录</td>\n</tr>\n<tr>\n<td style="text-align:left">name</td>\n<td style="text-align:left">String</td>\n<td style="text-align:left">分包别名，<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html">分包预下载</a>时可以使用</td>\n</tr>\n<tr>\n<td style="text-align:left">pages</td>\n<td style="text-align:left">StringArray</td>\n<td style="text-align:left">分包页面路径，相对与分包根目录</td>\n</tr>\n<tr>\n<td style="text-align:left">independent</td>\n<td style="text-align:left">Boolean</td>\n<td style="text-align:left">分包是否是<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html">独立分包</a></td>\n</tr>\n</tbody>\n</table></div>\n<p>所以我们在运行的时候，除了要拿到 <code>pages</code> 下的所有页面，还需拿到 <code>subpackages</code> 中所有的页面。由于之前只关心主包的内容，<code>this.tree</code> 下面只有一颗文件树，现在我们需要在 <code>this.tree</code> 下挂载多颗文件树，我们需要先为主包创建一个单独的文件树，然后为每个分包创建一个文件树。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> <span class="token string">\'miniprogram\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">createTree</span><span class="token punctuation">(</span><span class="token parameter">pkg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">[</span>pkg<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      size<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">addPage</span><span class="token punctuation">(</span><span class="token parameter">page<span class="token punctuation">,</span> pkg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> absPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span>page<span class="token punctuation">)</span>\n    <span class="token maybe-class-name">Extends</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">ext</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> filePath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceExt</span><span class="token punctuation">(</span>absPath<span class="token punctuation">,</span> ext<span class="token punctuation">)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">existsSync</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> pkg<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> appPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getAbsolute</span><span class="token punctuation">(</span><span class="token string">\'app.json\'</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> appJson <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readJsonSync</span><span class="token punctuation">(</span>appPath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> pages<span class="token punctuation">,</span> subPackages<span class="token punctuation">,</span> subpackages <span class="token punctuation">}</span> <span class="token operator">=</span> appJson\n    \n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">createTree</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">)</span> <span class="token comment">// 为主包创建文件树</span>\n    pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addPage</span><span class="token punctuation">(</span>page<span class="token punctuation">,</span> <span class="token string">\'main\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 由于 app.json 中 subPackages、subpackages 都能生效</span>\n    <span class="token comment">// 所以我们两个属性都获取，哪个存在就用哪个</span>\n    <span class="token keyword">const</span> subPkgs <span class="token operator">=</span> subPackages <span class="token operator">||</span> subpackages\n    <span class="token comment">// 分包存在的时候才进行遍历</span>\n    subPkgs <span class="token operator">&amp;&amp;</span> subPkgs<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> root<span class="token punctuation">,</span> pages <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      root <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token string">\'/\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">createTree</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token comment">// 为分包创建文件树</span>\n      pages<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">page</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addPage</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>root<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>page<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span> pkg<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 输出文件树</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">writeJSONSync</span><span class="token punctuation">(</span><span class="token string">\'tree.json\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> spaces<span class="token operator">:</span> <span class="token number">2</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>addToTree</code> 方法也需要进行修改，根据传入的 <code>pkg</code> 来判断将当前文件添加到哪个树。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Depend</span> <span class="token punctuation">{</span>\n  <span class="token function">addToTree</span><span class="token punctuation">(</span>filePath<span class="token punctuation">,</span> pkg <span class="token operator">=</span> <span class="token string">\'main\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">has</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件已经添加过，则不再添加到文件树中</span>\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">let</span> relPath <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getRelative</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pkg <span class="token operator">!==</span> <span class="token string">\'main\'</span> <span class="token operator">&amp;&amp;</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>pkg<span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果该文件不是以分包名开头，证明该文件不在分包内，</span>\n      <span class="token comment">// 需要将文件添加到主包的文件树内</span>\n      pkg <span class="token operator">=</span> <span class="token string">\'main\'</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> tree <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tree</span><span class="token punctuation">[</span>pkg<span class="token punctuation">]</span> <span class="token comment">// 依据 pkg 取到对应的树</span>\n    <span class="token keyword">const</span> size <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getSize</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    <span class="token keyword">const</span> names <span class="token operator">=</span> relPath<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token property-access">sep</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> lastIdx <span class="token operator">=</span> names<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n\n    tree<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">+=</span> size\n    <span class="token keyword">let</span> point <span class="token operator">=</span> tree<span class="token punctuation">.</span><span class="token property-access">children</span>\n    names<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> idx</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// ... 添加到树中</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">files</span><span class="token punctuation">.</span><span class="token method function property-access">add</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n\n    <span class="token comment">// ===== 获取文件依赖，并添加到树中 =====</span>\n    <span class="token keyword">const</span> deps <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getDeps</span><span class="token punctuation">(</span>filePath<span class="token punctuation">)</span>\n    deps<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">addToTree</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span>      \n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里有一点需要注意，如果 <code>package/a</code> 分包下的文件依赖的文件不在 <code>package/a</code>  文件夹下，则该文件需要放入主包的文件树内。</p>\n<h2 id="%E9%80%9A%E8%BF%87-echart-%E7%94%BB%E5%9B%BE">通过 EChart 画图<a class="anchor" href="#%E9%80%9A%E8%BF%87-echart-%E7%94%BB%E5%9B%BE">§</a></h2>\n<p>经过上面的流程后，最终我们可以得到如下的一个 json 文件：</p>\n<p><img src="https://file.shenfq.com/pic/20201102001906.png" alt="tree.json"></p>\n<p>接下来，我们利用 ECharts 的画图能力，将这个 json 数据以图表的形式展现出来。我们可以在 ECharts 提供的实例中看到一个 <a href="https://echarts.apache.org/examples/zh/editor.html?c=treemap-disk">Disk Usage</a> 的案例，很符合我们的预期。</p>\n<p><img src="https://file.shenfq.com/pic/20201102002332.png" alt="ECharts"></p>\n<p>ECharts 的配置这里就不再赘述，按照官网的 demo 即可，我们需要把 <code>tree. json</code> 的数据转化为 ECharts 需要的格式就行了，完整的代码放到 codesandbod 了，去下面的线上地址就能看到效果了。</p>\n<blockquote>\n<p>线上地址：<a href="https://codesandbox.io/s/cold-dawn-kufc9">https://codesandbox.io/s/cold-dawn-kufc9</a></p>\n</blockquote>\n<p><img src="https://file.shenfq.com/pic/20201102004105.png" alt="最后效果"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>这篇文章比较偏实践，所以贴了很多的代码，另外本文对各个文件的依赖获取提供了一个思路，虽然这里只是用文件树构造了一个这样的依赖图。</p>\n<p>在业务开发中，小程序 IDE 每次启动都需要进行全量的编译，开发版预览的时候会等待较长的时间，我们现在有文件依赖关系后，就可以只选取目前正在开发的页面进行打包，这样就能大大提高我们的开发效率。如果有对这部分内容感兴趣的，可以另外写一篇文章介绍下如何实现。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%85%A5%E5%8F%A3" }, "\u5C0F\u7A0B\u5E8F\u5165\u53E3")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%9E%84%E9%80%A0%E6%A0%91%E5%BD%A2%E7%BB%93%E6%9E%84" }, "\u6784\u9020\u6811\u5F62\u7ED3\u6784")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB" }, "\u83B7\u53D6\u4F9D\u8D56\u5173\u7CFB"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96-js-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96" }, "\u83B7\u53D6 .js \u6587\u4EF6\u4F9D\u8D56")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96-json-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96" }, "\u83B7\u53D6 .json \u6587\u4EF6\u4F9D\u8D56")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96-wxml-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96" }, "\u83B7\u53D6 .wxml \u6587\u4EF6\u4F9D\u8D56")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96-wxss-%E6%96%87%E4%BB%B6%E4%BE%9D%E8%B5%96" }, "\u83B7\u53D6 .wxss \u6587\u4EF6\u4F9D\u8D56")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B0%86%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%88%B0%E6%A0%91%E7%BB%93%E6%9E%84%E4%B8%AD" }, "\u5C06\u4F9D\u8D56\u6DFB\u52A0\u5230\u6811\u7ED3\u6784\u4E2D")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%8E%B7%E5%8F%96%E5%88%86%E5%8C%85%E4%BE%9D%E8%B5%96" }, "\u83B7\u53D6\u5206\u5305\u4F9D\u8D56")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E9%80%9A%E8%BF%87-echart-%E7%94%BB%E5%9B%BE" }, "\u901A\u8FC7 EChart \u753B\u56FE")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/11/02",
    'updated': null,
    'excerpt': "用过 webpack 的同学肯定知道 webpack-bundle-analyzer ，可以用来分析当前项目 js 文件的依赖关系。 因为最近一直在做小程序业务，而且小程序对包体大小特别敏感，所以就想着能不能做一个类似的工具，用来查看当前小程序各个主...",
    'cover': "https://file.shenfq.com/pic/20201030230741.png",
    'categories': [
        "微信小程序"
    ],
    'tags': [
        "小程序",
        "微信小程序",
        "依赖分析"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 21
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
                "name": "读后感",
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
                "name": "工作",
                "count": 6
            },
            {
                "name": "总结",
                "count": 6
            },
            {
                "name": "感悟",
                "count": 6
            },
            {
                "name": "React",
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
                "name": "Components",
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
                "name": "Web Components",
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
                "name": "前端思考",
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
                "name": "读后感",
                "count": 1
            },
            {
                "name": "负载均衡",
                "count": 1
            }
        ]
    }
};
