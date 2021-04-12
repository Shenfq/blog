import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/从零开始实现VS Code基金插件.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/从零开始实现VS Code基金插件.html",
    'title': "从零开始实现 VS Code 基金插件",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>从零开始实现 VS Code 基金插件</h1>\n<h2 id="%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2">写在前面<a class="anchor" href="#%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2">§</a></h2>\n<p>随着7月一波牛市行情，越来越多的人投身A股行列，但是股市的风险巨大，有人一夜暴富，也有人血本无归，所以对于普通人来说基金定投是个不错的选择，本人也是基金定投的一枚小韭菜。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-050614.png" alt="基金定投"></p>\n<p>上班的时候经常心理痒痒，想看看今天的基金又赚（ge）了多少钱，拿出手机打开支付宝的步骤过于繁琐，而且我也不太关心其他的指标，只是想知道今天的净值与涨幅。VS Code 做为一个编码工具，提供了强大的插件机制，我们可以好好利用这个能力，可以一边编码的时候一边看看行情。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-21-120746.png" alt="示例"></p>\n<h2 id="%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6">实现插件<a class="anchor" href="#%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6">§</a></h2>\n<h3 id="%E5%88%9D%E5%A7%8B%E5%8C%96">初始化<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96">§</a></h3>\n<p>VSCode 官方提供了非常方便的插件模板，我们可以直接通过 <code>Yeoman</code> 来生成 VS Code 插件的模板。</p>\n<p>先全局安装 <a href="https://www.npmjs.com/package/yo">yo</a> 和 <a href="https://www.npmjs.com/package/generator-code">generator-code</a>，运行命令 <code>yo code</code>。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 全局安装 yo 模块</span>\n<span class="token function">npm</span> <span class="token function">install</span> -g yo generator-code\n</code></pre>\n<p>这里我们使用 TypeScript 来编写插件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-135902.png" alt="yo code"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-135811.png" alt="yo code"></p>\n<p>生成后的目录结构如下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-132408.png" alt="目录结构"></p>\n<p>VS Code 插件可以简单理解为一个 Npm 包，也需要一个 <code>package.json</code> 文件，属性与 Npm 包的基本一致。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token comment">// 名称</span>\n  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 版本</span>\n  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 描述</span>\n  <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"实时查看基金行情"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 发布者</span>\n  <span class="token property">"publisher"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 版本要求</span>\n  <span class="token property">"engines"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vscode"</span><span class="token operator">:</span> <span class="token string">"^1.45.0"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 入口文件</span>\n  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"./out/extension.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"compile"</span><span class="token operator">:</span> <span class="token string">"tsc -p ./"</span><span class="token punctuation">,</span>\n    <span class="token property">"watch"</span><span class="token operator">:</span> <span class="token string">"tsc -watch -p ./"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"@types/node"</span><span class="token operator">:</span> <span class="token string">"^10.14.17"</span><span class="token punctuation">,</span>\n    <span class="token property">"@types/vscode"</span><span class="token operator">:</span> <span class="token string">"^1.41.0"</span><span class="token punctuation">,</span>\n    <span class="token property">"typescript"</span><span class="token operator">:</span> <span class="token string">"^3.9.7"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 插件配置</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 激活事件</span>\n  <span class="token property">"activationEvents"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>简单介绍下其中比较重要的配置。</p>\n<ul>\n<li><code>contributes</code>：插件相关配置。</li>\n<li><code>activationEvents</code>：激活事件。</li>\n<li><code>main</code>：插件的入口文件，与 Npm 包表现一致。</li>\n<li><code>name</code> 、 <code>publisher</code>：name 是插件名，publisher 是发布者。<code>${publisher}.${name}</code> 构成插件 ID。</li>\n</ul>\n<p>比较值得关注的就是 <code>contributes</code> 和 <code>activationEvents</code> 这两个配置。</p>\n<h3 id="%E5%88%9B%E5%BB%BA%E8%A7%86%E5%9B%BE">创建视图<a class="anchor" href="#%E5%88%9B%E5%BB%BA%E8%A7%86%E5%9B%BE">§</a></h3>\n<p>我们首先在我们的应用中创建一个视图容器，视图容器简单来说一个单独的侧边栏，在 <code>package.json</code> 的 <code>contributes.viewsContainers</code> 中进行配置。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"viewsContainers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"activitybar"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n          <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"FUND WATCH"</span><span class="token punctuation">,</span>\n          <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">"images/fund.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-092247.png" alt="侧边栏"></p>\n<p>然后我们还需要添加一个视图，在 <code>package.json</code> 的 <code>contributes.views</code> 中进行配置，该字段为一个对象，它的 Key 就是我们视图容器的 id，值为一个数组，表示一个视图容器内可添加多个视图。</p>\n<pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n  <span class="token string">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"viewsContainers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"activitybar"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n          <span class="token string">"title"</span><span class="token operator">:</span> <span class="token string">"FUND WATCH"</span><span class="token punctuation">,</span>\n          <span class="token string">"icon"</span><span class="token operator">:</span> <span class="token string">"images/fund.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"fund-watch"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果你不希望在自定义的视图容器中添加，可以选择 VS Code 自带的视图容器。</p>\n<ul>\n<li><code>explorer</code>: 显示在资源管理器侧边栏</li>\n<li><code>debug</code>: 显示在调试侧边栏</li>\n<li><code>scm</code>: 显示在源代码侧边栏</li>\n</ul>\n<pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n  <span class="token string">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"explorer"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-100627.png" alt="显示到资源管理器中"></p>\n<h3 id="%E8%BF%90%E8%A1%8C%E6%8F%92%E4%BB%B6">运行插件<a class="anchor" href="#%E8%BF%90%E8%A1%8C%E6%8F%92%E4%BB%B6">§</a></h3>\n<p>使用 <code>Yeoman</code> 生成的模板自带 VS Code 运行能力。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-134256.png" alt="vscode配置"></p>\n<p>切换到调试面板，直接点击运行，就能看到侧边栏多了个图标。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-134410.png" alt="调试面板"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-132932.png" alt="运行结果"></p>\n<h3 id="%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE">添加配置<a class="anchor" href="#%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE">§</a></h3>\n<p>我们需要获取基金的列表，当然需要一些基金代码，而这些代码我们可以放到 VS Code 的配置中。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 配置</span>\n    <span class="token property">"configuration"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 配置类型，对象</span>\n      <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"object"</span><span class="token punctuation">,</span>\n      <span class="token comment">// 配置名称</span>\n      <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"fund"</span><span class="token punctuation">,</span>\n      <span class="token comment">// 配置的各个属性</span>\n      <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 自选基金列表</span>\n        <span class="token property">"fund.favorites"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 属性类型</span>\n          <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"array"</span><span class="token punctuation">,</span>\n          <span class="token comment">// 默认值</span>\n          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n            <span class="token string">"163407"</span><span class="token punctuation">,</span>\n            <span class="token string">"161017"</span>\n          <span class="token punctuation">]</span><span class="token punctuation">,</span>\n          <span class="token comment">// 描述</span>\n          <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"自选基金列表，值为基金代码"</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token comment">// 刷新时间的间隔</span>\n        <span class="token property">"fund.interval"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"number"</span><span class="token punctuation">,</span>\n          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n          <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"刷新时间，单位为秒，默认 2 秒"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%A7%86%E5%9B%BE%E6%95%B0%E6%8D%AE">视图数据<a class="anchor" href="#%E8%A7%86%E5%9B%BE%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>我们回看之前注册的视图，VS Code 中称为树视图。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"fund-watch"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们需要通过 vscode 提供的 <code>registerTreeDataProvider</code> 为视图提供数据。打开生成的 <code>src/extension.ts</code> 文件，修改代码如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// vscode 模块为 VS Code 内置，不需要通过 npm 安装</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>这里我们通过 VS Code 提供的 <code>window.registerTreeDataProvider</code> 来注册数据，传入的第一个参数表示视图 ID，第二个参数是 <code>TreeDataProvider</code> 的实现。</p>\n<p><code>TreeDataProvider</code> 有两个必须实现的方法：</p>\n<ul>\n<li><code>getChildren</code>：该方法接受一个 element，返回 element 的子元素，如果没有element，则返回的是根节点的子元素，我们这里因为是单列表，所以不会接受 element 元素；</li>\n<li><code>getTreeItem</code>：该方法接受一个 element，返回视图单行的 UI 数据，需要对 <code>TreeItem</code> 进行实例化；</li>\n</ul>\n<p>我们通过 VS Code 的资源管理器来展示下这两个方法：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-015527.png" alt="方法展示"></p>\n<p>有了上面的知识，我们就可以轻松为树视图提供数据了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span>string<span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新视图</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>element<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">TreeItem</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> order <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取配置的基金代码</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> workspace\n      <span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    \n    <span class="token comment">// 依据代码排序</span>\n    <span class="token keyword control-flow">return</span> favorites<span class="token punctuation">.</span><span class="token method function property-access">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">prev<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">(</span>prev <span class="token operator">>=</span> next <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> order<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n\n</code></pre>\n<p>现在运行之后，可能会发现视图上没有数据，这是因为没有配置激活事件。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"activationEvents"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">// 表示 fund-list 视图展示时，激活该插件</span>\n    <span class="token string">"onView:fund-list"</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-015003.png" alt="基金代码列表"></p>\n<h3 id="%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE">请求数据<a class="anchor" href="#%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>我们已经成功将基金代码展示在视图上，接下来就需要请求基金数据了。网上有很多基金相关 api，这里我们使用天天基金网的数据。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-020506.png" alt="天天基金网"></p>\n<p>通过请求可以看到，天天基金网通过 JSONP 的方式获取基金相关数据，我们只需要构造一个 url，并传入当前时间戳即可。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string"><a class="token url-link" href="https://fundgz.1234567.com.cn/js/">https://fundgz.1234567.com.cn/js/</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rt=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>time<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>VS Code 中请求数据，需要使用内部提供的 <code>https</code> 模块，下面我们新建一个 <code>api.ts</code>。</p>\n<pre class="language-ts"><code class="language-ts"><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> https <span class="token keyword">from</span> <span class="token string">\'https\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 发起 GET 请求</span>\n<span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>url<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Promise</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    https<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> chunks <span class="token operator">=</span> <span class="token string">\'\'</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>res <span class="token operator">||</span> res<span class="token punctuation">.</span>statusCode <span class="token operator">!==</span> <span class="token number">200</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">reject</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'网络请求错误!\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      res<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>chunk<span class="token punctuation">)</span> <span class="token operator">=></span> chunks <span class="token operator">+=</span> chunk<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token string">\'utf8\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      res<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'end\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">resolve</span><span class="token punctuation">(</span>chunks<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">FundInfo</span> <span class="token punctuation">{</span>\n  now<span class="token operator">:</span> <span class="token builtin">string</span>\n  name<span class="token operator">:</span> <span class="token builtin">string</span>\n  code<span class="token operator">:</span> <span class="token builtin">string</span>\n  lastClose<span class="token operator">:</span> <span class="token builtin">string</span>\n  changeRate<span class="token operator">:</span> <span class="token builtin">string</span>\n  changeAmount<span class="token operator">:</span> <span class="token builtin">string</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 根据基金代码请求基金数据</span>\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">fundApi</span><span class="token punctuation">(</span>codes<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>FundInfo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> time <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 请求列表</span>\n  <span class="token keyword">const</span> promises<span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> codes<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string"><a class="token url-link" href="https://fundgz.1234567.com.cn/js/">https://fundgz.1234567.com.cn/js/</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rt=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>time<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> <span class="token function">request</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> <span class="token builtin">Promise</span><span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span>promises<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>results<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> resultArr<span class="token operator">:</span> FundInfo<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    results<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>rsp<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> match <span class="token operator">=</span> rsp<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">jsonpgz\((.+)\)</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>match <span class="token operator">||</span> <span class="token operator">!</span>match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">const</span> str <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> info<span class="token operator">:</span> FundInfo <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 当前净值</span>\n        now<span class="token operator">:</span> obj<span class="token punctuation">.</span>gsz<span class="token punctuation">,</span>\n        <span class="token comment">// 基金名称</span>\n        name<span class="token operator">:</span> obj<span class="token punctuation">.</span>name<span class="token punctuation">,</span>\n        <span class="token comment">// 基金代码</span>\n        code<span class="token operator">:</span> obj<span class="token punctuation">.</span>fundcode<span class="token punctuation">,</span>\n        <span class="token comment">// 昨日净值</span>\n        lastClose<span class="token operator">:</span> obj<span class="token punctuation">.</span>dwjz<span class="token punctuation">,</span>\n        <span class="token comment">// 涨跌幅</span>\n        changeRate<span class="token operator">:</span> obj<span class="token punctuation">.</span>gszzl<span class="token punctuation">,</span>\n        <span class="token comment">// 涨跌额</span>\n        changeAmount<span class="token operator">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">.</span>gsz <span class="token operator">-</span> obj<span class="token punctuation">.</span>dwjz<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toFixed</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n      resultArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> resultArr<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>接下来修改视图数据。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了其他代码</span>\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 展示名称和涨跌幅</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> changeRate <span class="token punctuation">}</span> <span class="token operator">=</span> info\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">TreeItem</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>changeRate<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token known-class-name class-name">Promise</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> order <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取配置的基金代码</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> workspace\n      <span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    \n    <span class="token comment">// 获取基金数据</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">fundApi</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token spread operator">...</span>favorites<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">results<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> results<span class="token punctuation">.</span><span class="token method function property-access">sort</span><span class="token punctuation">(</span>\n        <span class="token punctuation">(</span><span class="token parameter">prev<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">(</span>prev<span class="token punctuation">.</span><span class="token property-access">changeRate</span> <span class="token operator">>=</span> next<span class="token punctuation">.</span><span class="token property-access">changeRate</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> order\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-025708.png" alt="视图数据"></p>\n<h3 id="%E7%BE%8E%E5%8C%96%E6%A0%BC%E5%BC%8F">美化格式<a class="anchor" href="#%E7%BE%8E%E5%8C%96%E6%A0%BC%E5%BC%8F">§</a></h3>\n<p>前面我们都是通过直接实例化 <code>TreeItem</code> 的方式来实现 UI 的，现在我们需要重新构造一个 <code>TreeItem</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了其他代码</span>\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">FundItem</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">FundItem</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// TreeItem</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">FundItem</span> <span class="token keyword">extends</span> <span class="token class-name">TreeItem</span> <span class="token punctuation">{</span>\n  info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">;</span>\n\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> icon <span class="token operator">=</span> <span class="token known-class-name class-name">Number</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">\'📈\'</span> <span class="token operator">:</span> <span class="token string">\'📉\'</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 加上 icon，更加直观的知道是涨还是跌</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>icon<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">   </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">%</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">let</span> sliceName <span class="token operator">=</span> info<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>sliceName<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      sliceName <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>sliceName<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">...</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> tips <span class="token operator">=</span> <span class="token punctuation">[</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">代码:　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">名称:　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>sliceName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">--------------------------</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">单位净值:　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">now</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">涨跌幅:　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">%</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">涨跌额:　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeAmount</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">昨收:　　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">lastClose</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">info</span> <span class="token operator">=</span> info<span class="token punctuation">;</span>\n    <span class="token comment">// tooltip 鼠标悬停时，展示的内容</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tooltip</span> <span class="token operator">=</span> tips<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'\r\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-030457.png" alt="美化后"></p>\n<h3 id="%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE">更新数据<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE">§</a></h3>\n<p><code>TreeDataProvider</code> 需要提供一个 <code>onDidChangeTreeData</code> 属性，该属性是 EventEmitter 的一个实例，然后通过触发 EventEmitter 实例进行数据的更新，每次调用 refresh 方法相当于重新调用了 <code>getChildren</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">private</span> refreshEvent<span class="token operator">:</span> <span class="token maybe-class-name">EventEmitter</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventEmitter</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readonly onDidChangeTreeData<span class="token operator">:</span> <span class="token maybe-class-name">Event</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">refreshEvent</span><span class="token punctuation">.</span><span class="token property-access">event</span><span class="token punctuation">;</span>\n\n  <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新视图</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">refreshEvent</span><span class="token punctuation">.</span><span class="token method function property-access">fire</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们回到 <code>extension.ts</code>，添加一个定时器，让数据定时更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./data/Provider\'</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取 interval 配置</span>\n  <span class="token keyword">let</span> interval <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.interval\'</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>interval <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    interval <span class="token operator">=</span> <span class="token number">2</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span>\n\n  <span class="token comment">// 定时更新</span>\n  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> interval <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n</code></pre>\n<p>除了定时更新，我们还需要提供手动更新的能力。修改 <code>package.json</code>，注册命令。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"刷新"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/refresh.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/refresh.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"view/title"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span><span class="token punctuation">,</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ul>\n<li><code>commands</code>：用于注册命令，指定命令的名称、图标，以及 command 用于 extension 中绑定相应事件；</li>\n<li><code>menus</code>：用于标记命令展示的位置；\n<ul>\n<li><code>when</code>：定义展示的视图，具体语法可以查阅<a href="https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts">官方文档</a>；</li>\n<li>group：定义菜单的分组；</li>\n<li>command：定义命令调用的事件；</li>\n</ul>\n</li>\n</ul>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-032913.png" alt="view-actions"></p>\n<p>配置好命令后，回到 <code>extension.ts</code> 中。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> interval <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.interval\'</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>interval <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    interval <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 定时任务</span>\n  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> interval <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n</code></pre>\n<p>现在我们就可以手动刷新了。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-033219.png" alt="image-20200824113219392"></p>\n<h3 id="%E6%96%B0%E5%A2%9E%E5%9F%BA%E9%87%91">新增基金<a class="anchor" href="#%E6%96%B0%E5%A2%9E%E5%9F%BA%E9%87%91">§</a></h3>\n<p>我们新增一个按钮用了新增基金。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.add"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"新增"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/add.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/add.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"刷新"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/refresh.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/refresh.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"view/title"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.add"</span><span class="token punctuation">,</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span><span class="token punctuation">,</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>extension.ts </code> 中注册事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n  \n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.add\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>实现新增功能，修改 <code>Provider.ts</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n\n  <span class="token comment">// 更新配置</span>\n  <span class="token function">updateConfig</span><span class="token punctuation">(</span><span class="token parameter">funds<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> config <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> favorites <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token keyword module">from</span><span class="token punctuation">(</span>\n      <span class="token comment">// 通过 Set 去重</span>\n      <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">[</span>\n        <span class="token spread operator">...</span>config<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        <span class="token spread operator">...</span>funds<span class="token punctuation">,</span>\n      <span class="token punctuation">]</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    config<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> favorites<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">async</span> <span class="token function">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 弹出输入框</span>\n    <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">showInputBox</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      value<span class="token operator">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      valueSelection<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      prompt<span class="token operator">:</span> <span class="token string">\'添加基金到自选\'</span><span class="token punctuation">,</span>\n      placeHolder<span class="token operator">:</span> <span class="token string">\'Add Fund To Favorite\'</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">validateInput</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">inputCode<span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> codeArray <span class="token operator">=</span> inputCode<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\W]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> hasError <span class="token operator">=</span> codeArray<span class="token punctuation">.</span><span class="token method function property-access">some</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span> code <span class="token operator">!==</span> <span class="token string">\'\'</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^\d+$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword control-flow">return</span> hasError <span class="token operator">?</span> <span class="token string">\'基金代码输入有误\'</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token operator">!</span>res<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> codeArray <span class="token operator">=</span> res<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\W]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">fundApi</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token spread operator">...</span>codeArray<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>result <span class="token operator">&amp;&amp;</span> result<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 只更新能正常请求的代码</span>\n        <span class="token keyword">const</span> codes <span class="token operator">=</span> result<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">i</span> <span class="token arrow operator">=></span> i<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateConfig</span><span class="token punctuation">(</span>codes<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">showWarningMessage</span><span class="token punctuation">(</span><span class="token string">\'stocks not found\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035043.png" alt="新增按钮"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035109.png" alt="输入框"></p>\n<h3 id="%E5%88%A0%E9%99%A4%E5%9F%BA%E9%87%91">删除基金<a class="anchor" href="#%E5%88%A0%E9%99%A4%E5%9F%BA%E9%87%91">§</a></h3>\n<p>最后新增一个按钮，用来删除基金。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.item.remove"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"删除"</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这个按钮放到 context 中</span>\n      <span class="token property">"view/item/context"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.item.remove"</span><span class="token punctuation">,</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"inline"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>extension.ts </code> 中注册事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n  \n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.add\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.item.remove\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">fund</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> fund<span class="token punctuation">;</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">removeConfig</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>实现新增功能，修改 <code>Provider.ts</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n\n  <span class="token comment">// 删除配置</span>\n  <span class="token function">removeConfig</span><span class="token punctuation">(</span><span class="token parameter">code<span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> config <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token spread operator">...</span>config<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> index <span class="token operator">=</span> favorites<span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>index <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    favorites<span class="token punctuation">.</span><span class="token method function property-access">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    config<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> favorites<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035658.png" alt="删除按钮"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>实现过程中也遇到了很多问题，遇到问题可以多翻阅 <a href="https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/">VSCode 插件中文文档</a>。该插件已经发布的了 VS Code 插件市场，感兴趣的可以直接<a href="https://marketplace.visualstudio.com/items?itemName=shenfq.fund-watch">下载该插件</a>，或者在 github 上下载<a href="https://github.com/Shenfq/fund-watch">完整代码</a>。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u4ECE\u96F6\u5F00\u59CB\u5B9E\u73B0 VS Code \u57FA\u91D1\u63D2\u4EF6"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2">写在前面<a class="anchor" href="#%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2">§</a></h2>\n<p>随着7月一波牛市行情，越来越多的人投身A股行列，但是股市的风险巨大，有人一夜暴富，也有人血本无归，所以对于普通人来说基金定投是个不错的选择，本人也是基金定投的一枚小韭菜。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-050614.png" alt="基金定投"></p>\n<p>上班的时候经常心理痒痒，想看看今天的基金又赚（ge）了多少钱，拿出手机打开支付宝的步骤过于繁琐，而且我也不太关心其他的指标，只是想知道今天的净值与涨幅。VS Code 做为一个编码工具，提供了强大的插件机制，我们可以好好利用这个能力，可以一边编码的时候一边看看行情。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-21-120746.png" alt="示例"></p>\n<h2 id="%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6">实现插件<a class="anchor" href="#%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6">§</a></h2>\n<h3 id="%E5%88%9D%E5%A7%8B%E5%8C%96">初始化<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96">§</a></h3>\n<p>VSCode 官方提供了非常方便的插件模板，我们可以直接通过 <code>Yeoman</code> 来生成 VS Code 插件的模板。</p>\n<p>先全局安装 <a href="https://www.npmjs.com/package/yo">yo</a> 和 <a href="https://www.npmjs.com/package/generator-code">generator-code</a>，运行命令 <code>yo code</code>。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 全局安装 yo 模块</span>\n<span class="token function">npm</span> <span class="token function">install</span> -g yo generator-code\n</code></pre>\n<p>这里我们使用 TypeScript 来编写插件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-135902.png" alt="yo code"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-22-135811.png" alt="yo code"></p>\n<p>生成后的目录结构如下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-132408.png" alt="目录结构"></p>\n<p>VS Code 插件可以简单理解为一个 Npm 包，也需要一个 <code>package.json</code> 文件，属性与 Npm 包的基本一致。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token comment">// 名称</span>\n  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 版本</span>\n  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 描述</span>\n  <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"实时查看基金行情"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 发布者</span>\n  <span class="token property">"publisher"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 版本要求</span>\n  <span class="token property">"engines"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vscode"</span><span class="token operator">:</span> <span class="token string">"^1.45.0"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 入口文件</span>\n  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"./out/extension.js"</span><span class="token punctuation">,</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"compile"</span><span class="token operator">:</span> <span class="token string">"tsc -p ./"</span><span class="token punctuation">,</span>\n    <span class="token property">"watch"</span><span class="token operator">:</span> <span class="token string">"tsc -watch -p ./"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"@types/node"</span><span class="token operator">:</span> <span class="token string">"^10.14.17"</span><span class="token punctuation">,</span>\n    <span class="token property">"@types/vscode"</span><span class="token operator">:</span> <span class="token string">"^1.41.0"</span><span class="token punctuation">,</span>\n    <span class="token property">"typescript"</span><span class="token operator">:</span> <span class="token string">"^3.9.7"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 插件配置</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 激活事件</span>\n  <span class="token property">"activationEvents"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>简单介绍下其中比较重要的配置。</p>\n<ul>\n<li><code>contributes</code>：插件相关配置。</li>\n<li><code>activationEvents</code>：激活事件。</li>\n<li><code>main</code>：插件的入口文件，与 Npm 包表现一致。</li>\n<li><code>name</code> 、 <code>publisher</code>：name 是插件名，publisher 是发布者。<code>${publisher}.${name}</code> 构成插件 ID。</li>\n</ul>\n<p>比较值得关注的就是 <code>contributes</code> 和 <code>activationEvents</code> 这两个配置。</p>\n<h3 id="%E5%88%9B%E5%BB%BA%E8%A7%86%E5%9B%BE">创建视图<a class="anchor" href="#%E5%88%9B%E5%BB%BA%E8%A7%86%E5%9B%BE">§</a></h3>\n<p>我们首先在我们的应用中创建一个视图容器，视图容器简单来说一个单独的侧边栏，在 <code>package.json</code> 的 <code>contributes.viewsContainers</code> 中进行配置。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"viewsContainers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"activitybar"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n          <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"FUND WATCH"</span><span class="token punctuation">,</span>\n          <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token string">"images/fund.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-092247.png" alt="侧边栏"></p>\n<p>然后我们还需要添加一个视图，在 <code>package.json</code> 的 <code>contributes.views</code> 中进行配置，该字段为一个对象，它的 Key 就是我们视图容器的 id，值为一个数组，表示一个视图容器内可添加多个视图。</p>\n<pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n  <span class="token string">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"viewsContainers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"activitybar"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-watch"</span><span class="token punctuation">,</span>\n          <span class="token string">"title"</span><span class="token operator">:</span> <span class="token string">"FUND WATCH"</span><span class="token punctuation">,</span>\n          <span class="token string">"icon"</span><span class="token operator">:</span> <span class="token string">"images/fund.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"fund-watch"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果你不希望在自定义的视图容器中添加，可以选择 VS Code 自带的视图容器。</p>\n<ul>\n<li><code>explorer</code>: 显示在资源管理器侧边栏</li>\n<li><code>debug</code>: 显示在调试侧边栏</li>\n<li><code>scm</code>: 显示在源代码侧边栏</li>\n</ul>\n<pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n  <span class="token string">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"explorer"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n          <span class="token string">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-100627.png" alt="显示到资源管理器中"></p>\n<h3 id="%E8%BF%90%E8%A1%8C%E6%8F%92%E4%BB%B6">运行插件<a class="anchor" href="#%E8%BF%90%E8%A1%8C%E6%8F%92%E4%BB%B6">§</a></h3>\n<p>使用 <code>Yeoman</code> 生成的模板自带 VS Code 运行能力。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-134256.png" alt="vscode配置"></p>\n<p>切换到调试面板，直接点击运行，就能看到侧边栏多了个图标。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-134410.png" alt="调试面板"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-23-132932.png" alt="运行结果"></p>\n<h3 id="%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE">添加配置<a class="anchor" href="#%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE">§</a></h3>\n<p>我们需要获取基金的列表，当然需要一些基金代码，而这些代码我们可以放到 VS Code 的配置中。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 配置</span>\n    <span class="token property">"configuration"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 配置类型，对象</span>\n      <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"object"</span><span class="token punctuation">,</span>\n      <span class="token comment">// 配置名称</span>\n      <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"fund"</span><span class="token punctuation">,</span>\n      <span class="token comment">// 配置的各个属性</span>\n      <span class="token property">"properties"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 自选基金列表</span>\n        <span class="token property">"fund.favorites"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 属性类型</span>\n          <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"array"</span><span class="token punctuation">,</span>\n          <span class="token comment">// 默认值</span>\n          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n            <span class="token string">"163407"</span><span class="token punctuation">,</span>\n            <span class="token string">"161017"</span>\n          <span class="token punctuation">]</span><span class="token punctuation">,</span>\n          <span class="token comment">// 描述</span>\n          <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"自选基金列表，值为基金代码"</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token comment">// 刷新时间的间隔</span>\n        <span class="token property">"fund.interval"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"number"</span><span class="token punctuation">,</span>\n          <span class="token property">"default"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n          <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"刷新时间，单位为秒，默认 2 秒"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E8%A7%86%E5%9B%BE%E6%95%B0%E6%8D%AE">视图数据<a class="anchor" href="#%E8%A7%86%E5%9B%BE%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>我们回看之前注册的视图，VS Code 中称为树视图。</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"views"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"fund-watch"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"自选基金"</span><span class="token punctuation">,</span>\n      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"fund-list"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们需要通过 vscode 提供的 <code>registerTreeDataProvider</code> 为视图提供数据。打开生成的 <code>src/extension.ts</code> 文件，修改代码如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// vscode 模块为 VS Code 内置，不需要通过 npm 安装</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>这里我们通过 VS Code 提供的 <code>window.registerTreeDataProvider</code> 来注册数据，传入的第一个参数表示视图 ID，第二个参数是 <code>TreeDataProvider</code> 的实现。</p>\n<p><code>TreeDataProvider</code> 有两个必须实现的方法：</p>\n<ul>\n<li><code>getChildren</code>：该方法接受一个 element，返回 element 的子元素，如果没有element，则返回的是根节点的子元素，我们这里因为是单列表，所以不会接受 element 元素；</li>\n<li><code>getTreeItem</code>：该方法接受一个 element，返回视图单行的 UI 数据，需要对 <code>TreeItem</code> 进行实例化；</li>\n</ul>\n<p>我们通过 VS Code 的资源管理器来展示下这两个方法：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-015527.png" alt="方法展示"></p>\n<p>有了上面的知识，我们就可以轻松为树视图提供数据了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span>string<span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新视图</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>element<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">TreeItem</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> order <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取配置的基金代码</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> workspace\n      <span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    \n    <span class="token comment">// 依据代码排序</span>\n    <span class="token keyword control-flow">return</span> favorites<span class="token punctuation">.</span><span class="token method function property-access">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">prev<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">(</span>prev <span class="token operator">>=</span> next <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> order<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n\n</code></pre>\n<p>现在运行之后，可能会发现视图上没有数据，这是因为没有配置激活事件。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"activationEvents"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">// 表示 fund-list 视图展示时，激活该插件</span>\n    <span class="token string">"onView:fund-list"</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-015003.png" alt="基金代码列表"></p>\n<h3 id="%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE">请求数据<a class="anchor" href="#%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>我们已经成功将基金代码展示在视图上，接下来就需要请求基金数据了。网上有很多基金相关 api，这里我们使用天天基金网的数据。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-020506.png" alt="天天基金网"></p>\n<p>通过请求可以看到，天天基金网通过 JSONP 的方式获取基金相关数据，我们只需要构造一个 url，并传入当前时间戳即可。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string"><a class="token url-link" href="https://fundgz.1234567.com.cn/js/">https://fundgz.1234567.com.cn/js/</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rt=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>time<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>VS Code 中请求数据，需要使用内部提供的 <code>https</code> 模块，下面我们新建一个 <code>api.ts</code>。</p>\n<pre class="language-ts"><code class="language-ts"><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> https <span class="token keyword">from</span> <span class="token string">\'https\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 发起 GET 请求</span>\n<span class="token keyword">const</span> request <span class="token operator">=</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>url<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token builtin">Promise</span></span><span class="token punctuation">(</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    https<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token punctuation">(</span>res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> chunks <span class="token operator">=</span> <span class="token string">\'\'</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>res <span class="token operator">||</span> res<span class="token punctuation">.</span>statusCode <span class="token operator">!==</span> <span class="token number">200</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">reject</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'网络请求错误!\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      res<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>chunk<span class="token punctuation">)</span> <span class="token operator">=></span> chunks <span class="token operator">+=</span> chunk<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token string">\'utf8\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      res<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'end\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">resolve</span><span class="token punctuation">(</span>chunks<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">interface</span> <span class="token class-name">FundInfo</span> <span class="token punctuation">{</span>\n  now<span class="token operator">:</span> <span class="token builtin">string</span>\n  name<span class="token operator">:</span> <span class="token builtin">string</span>\n  code<span class="token operator">:</span> <span class="token builtin">string</span>\n  lastClose<span class="token operator">:</span> <span class="token builtin">string</span>\n  changeRate<span class="token operator">:</span> <span class="token builtin">string</span>\n  changeAmount<span class="token operator">:</span> <span class="token builtin">string</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 根据基金代码请求基金数据</span>\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">fundApi</span><span class="token punctuation">(</span>codes<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span>FundInfo<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> time <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 请求列表</span>\n  <span class="token keyword">const</span> promises<span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> codes<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> url <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string"><a class="token url-link" href="https://fundgz.1234567.com.cn/js/">https://fundgz.1234567.com.cn/js/</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rt=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>time<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> <span class="token function">request</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">return</span> <span class="token builtin">Promise</span><span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span>promises<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>results<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> resultArr<span class="token operator">:</span> FundInfo<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    results<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>rsp<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> match <span class="token operator">=</span> rsp<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">jsonpgz\((.+)\)</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>match <span class="token operator">||</span> <span class="token operator">!</span>match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword">const</span> str <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> info<span class="token operator">:</span> FundInfo <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 当前净值</span>\n        now<span class="token operator">:</span> obj<span class="token punctuation">.</span>gsz<span class="token punctuation">,</span>\n        <span class="token comment">// 基金名称</span>\n        name<span class="token operator">:</span> obj<span class="token punctuation">.</span>name<span class="token punctuation">,</span>\n        <span class="token comment">// 基金代码</span>\n        code<span class="token operator">:</span> obj<span class="token punctuation">.</span>fundcode<span class="token punctuation">,</span>\n        <span class="token comment">// 昨日净值</span>\n        lastClose<span class="token operator">:</span> obj<span class="token punctuation">.</span>dwjz<span class="token punctuation">,</span>\n        <span class="token comment">// 涨跌幅</span>\n        changeRate<span class="token operator">:</span> obj<span class="token punctuation">.</span>gszzl<span class="token punctuation">,</span>\n        <span class="token comment">// 涨跌额</span>\n        changeAmount<span class="token operator">:</span> <span class="token punctuation">(</span>obj<span class="token punctuation">.</span>gsz <span class="token operator">-</span> obj<span class="token punctuation">.</span>dwjz<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toFixed</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n      resultArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> resultArr<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>接下来修改视图数据。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了其他代码</span>\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 展示名称和涨跌幅</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> changeRate <span class="token punctuation">}</span> <span class="token operator">=</span> info\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">TreeItem</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>changeRate<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">getChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token known-class-name class-name">Promise</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> order <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取配置的基金代码</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> workspace\n      <span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    \n    <span class="token comment">// 获取基金数据</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">fundApi</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token spread operator">...</span>favorites<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">results<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> results<span class="token punctuation">.</span><span class="token method function property-access">sort</span><span class="token punctuation">(</span>\n        <span class="token punctuation">(</span><span class="token parameter">prev<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">(</span>prev<span class="token punctuation">.</span><span class="token property-access">changeRate</span> <span class="token operator">>=</span> next<span class="token punctuation">.</span><span class="token property-access">changeRate</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> order\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-025708.png" alt="视图数据"></p>\n<h3 id="%E7%BE%8E%E5%8C%96%E6%A0%BC%E5%BC%8F">美化格式<a class="anchor" href="#%E7%BE%8E%E5%8C%96%E6%A0%BC%E5%BC%8F">§</a></h3>\n<p>前面我们都是通过直接实例化 <code>TreeItem</code> 的方式来实现 UI 的，现在我们需要重新构造一个 <code>TreeItem</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了其他代码</span>\n  <span class="token function">getTreeItem</span><span class="token punctuation">(</span>info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">FundItem</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">FundItem</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// TreeItem</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">TreeItem</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">FundItem</span> <span class="token keyword">extends</span> <span class="token class-name">TreeItem</span> <span class="token punctuation">{</span>\n  info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span><span class="token punctuation">;</span>\n\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">info<span class="token operator">:</span> <span class="token maybe-class-name">FundInfo</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> icon <span class="token operator">=</span> <span class="token known-class-name class-name">Number</span><span class="token punctuation">(</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">\'📈\'</span> <span class="token operator">:</span> <span class="token string">\'📉\'</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 加上 icon，更加直观的知道是涨还是跌</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>icon<span class="token interpolation-punctuation punctuation">}</span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">   </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">%</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">let</span> sliceName <span class="token operator">=</span> info<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>sliceName<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      sliceName <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>sliceName<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">...</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> tips <span class="token operator">=</span> <span class="token punctuation">[</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">代码:　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">名称:　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>sliceName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">--------------------------</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">单位净值:　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">now</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">涨跌幅:　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeRate</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">%</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">涨跌额:　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">changeAmount</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">昨收:　　　　　　</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>info<span class="token punctuation">.</span><span class="token property-access">lastClose</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">info</span> <span class="token operator">=</span> info<span class="token punctuation">;</span>\n    <span class="token comment">// tooltip 鼠标悬停时，展示的内容</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tooltip</span> <span class="token operator">=</span> tips<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'\r\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-030457.png" alt="美化后"></p>\n<h3 id="%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE">更新数据<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE">§</a></h3>\n<p><code>TreeDataProvider</code> 需要提供一个 <code>onDidChangeTreeData</code> 属性，该属性是 EventEmitter 的一个实例，然后通过触发 EventEmitter 实例进行数据的更新，每次调用 refresh 方法相当于重新调用了 <code>getChildren</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">private</span> refreshEvent<span class="token operator">:</span> <span class="token maybe-class-name">EventEmitter</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventEmitter</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readonly onDidChangeTreeData<span class="token operator">:</span> <span class="token maybe-class-name">Event</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span> <span class="token operator">|</span> <span class="token keyword null nil">null</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">refreshEvent</span><span class="token punctuation">.</span><span class="token property-access">event</span><span class="token punctuation">;</span>\n\n  <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新视图</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">refreshEvent</span><span class="token punctuation">.</span><span class="token method function property-access">fire</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>我们回到 <code>extension.ts</code>，添加一个定时器，让数据定时更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./data/Provider\'</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取 interval 配置</span>\n  <span class="token keyword">let</span> interval <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.interval\'</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>interval <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    interval <span class="token operator">=</span> <span class="token number">2</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span>\n\n  <span class="token comment">// 定时更新</span>\n  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> interval <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n</code></pre>\n<p>除了定时更新，我们还需要提供手动更新的能力。修改 <code>package.json</code>，注册命令。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"刷新"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/refresh.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/refresh.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"view/title"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span><span class="token punctuation">,</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ul>\n<li><code>commands</code>：用于注册命令，指定命令的名称、图标，以及 command 用于 extension 中绑定相应事件；</li>\n<li><code>menus</code>：用于标记命令展示的位置；\n<ul>\n<li><code>when</code>：定义展示的视图，具体语法可以查阅<a href="https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts">官方文档</a>；</li>\n<li>group：定义菜单的分组；</li>\n<li>command：定义命令调用的事件；</li>\n</ul>\n</li>\n</ul>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-032913.png" alt="view-actions"></p>\n<p>配置好命令后，回到 <code>extension.ts</code> 中。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> interval <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.interval\'</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>interval <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    interval <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 数据注册</span>\n  <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">registerTreeDataProvider</span><span class="token punctuation">(</span><span class="token string">\'fund-list\'</span><span class="token punctuation">,</span> provider<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 定时任务</span>\n  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> interval <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n\n</code></pre>\n<p>现在我们就可以手动刷新了。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-033219.png" alt="image-20200824113219392"></p>\n<h3 id="%E6%96%B0%E5%A2%9E%E5%9F%BA%E9%87%91">新增基金<a class="anchor" href="#%E6%96%B0%E5%A2%9E%E5%9F%BA%E9%87%91">§</a></h3>\n<p>我们新增一个按钮用了新增基金。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.add"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"新增"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/add.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/add.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"刷新"</span><span class="token punctuation">,</span>\n        <span class="token property">"icon"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          <span class="token property">"light"</span><span class="token operator">:</span> <span class="token string">"images/light/refresh.svg"</span><span class="token punctuation">,</span>\n          <span class="token property">"dark"</span><span class="token operator">:</span> <span class="token string">"images/dark/refresh.svg"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token property">"view/title"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.add"</span><span class="token punctuation">,</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"navigation"</span><span class="token punctuation">,</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.refresh"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>extension.ts </code> 中注册事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n  \n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.add\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>实现新增功能，修改 <code>Provider.ts</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n\n  <span class="token comment">// 更新配置</span>\n  <span class="token function">updateConfig</span><span class="token punctuation">(</span><span class="token parameter">funds<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> config <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> favorites <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token keyword module">from</span><span class="token punctuation">(</span>\n      <span class="token comment">// 通过 Set 去重</span>\n      <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">[</span>\n        <span class="token spread operator">...</span>config<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        <span class="token spread operator">...</span>funds<span class="token punctuation">,</span>\n      <span class="token punctuation">]</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span><span class="token punctuation">;</span>\n    config<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> favorites<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">async</span> <span class="token function">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 弹出输入框</span>\n    <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">showInputBox</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      value<span class="token operator">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      valueSelection<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      prompt<span class="token operator">:</span> <span class="token string">\'添加基金到自选\'</span><span class="token punctuation">,</span>\n      placeHolder<span class="token operator">:</span> <span class="token string">\'Add Fund To Favorite\'</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">validateInput</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">inputCode<span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> codeArray <span class="token operator">=</span> inputCode<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\W]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">const</span> hasError <span class="token operator">=</span> codeArray<span class="token punctuation">.</span><span class="token method function property-access">some</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span> code <span class="token operator">!==</span> <span class="token string">\'\'</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^\d+$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword control-flow">return</span> hasError <span class="token operator">?</span> <span class="token string">\'基金代码输入有误\'</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token operator">!</span>res<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> codeArray <span class="token operator">=</span> res<span class="token punctuation">.</span><span class="token method function property-access">split</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\W]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">fundApi</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token spread operator">...</span>codeArray<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>result <span class="token operator">&amp;&amp;</span> result<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 只更新能正常请求的代码</span>\n        <span class="token keyword">const</span> codes <span class="token operator">=</span> result<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">i</span> <span class="token arrow operator">=></span> i<span class="token punctuation">.</span><span class="token property-access">code</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateConfig</span><span class="token punctuation">(</span>codes<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">showWarningMessage</span><span class="token punctuation">(</span><span class="token string">\'stocks not found\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035043.png" alt="新增按钮"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035109.png" alt="输入框"></p>\n<h3 id="%E5%88%A0%E9%99%A4%E5%9F%BA%E9%87%91">删除基金<a class="anchor" href="#%E5%88%A0%E9%99%A4%E5%9F%BA%E9%87%91">§</a></h3>\n<p>最后新增一个按钮，用来删除基金。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"contributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"commands"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.item.remove"</span><span class="token punctuation">,</span>\n        <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"删除"</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token property">"menus"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这个按钮放到 context 中</span>\n      <span class="token property">"view/item/context"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          <span class="token property">"command"</span><span class="token operator">:</span> <span class="token string">"fund.item.remove"</span><span class="token punctuation">,</span>\n          <span class="token property">"when"</span><span class="token operator">:</span> <span class="token string">"view == fund-list"</span><span class="token punctuation">,</span>\n          <span class="token property">"group"</span><span class="token operator">:</span> <span class="token string">"inline"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>extension.ts </code> 中注册事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ExtensionContext</span><span class="token punctuation">,</span> commands<span class="token punctuation">,</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Provider</span></span> <span class="token keyword module">from</span> <span class="token string">\'./Provider\'</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 激活插件</span>\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token operator">:</span> <span class="token maybe-class-name">ExtensionContext</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n  \n  <span class="token comment">// 基金类</span>\n  <span class="token keyword">const</span> provider <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Provider</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 事件</span>\n  context<span class="token punctuation">.</span><span class="token property-access">subscriptions</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.add\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">addFund</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.refresh\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    commands<span class="token punctuation">.</span><span class="token method function property-access">registerCommand</span><span class="token punctuation">(</span><span class="token string">\'fund.item.remove\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">fund</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> fund<span class="token punctuation">;</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">removeConfig</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      provider<span class="token punctuation">.</span><span class="token method function property-access">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<p>实现新增功能，修改 <code>Provider.ts</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token dom variable">window</span><span class="token punctuation">,</span> workspace<span class="token punctuation">,</span> <span class="token maybe-class-name">Event</span><span class="token punctuation">,</span> <span class="token maybe-class-name">EventEmitter</span><span class="token punctuation">,</span> <span class="token maybe-class-name">TreeDataProvider</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vscode\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">FundItem</span></span> <span class="token keyword module">from</span> <span class="token string">\'./TreeItem\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports">fundApi</span> <span class="token keyword module">from</span> <span class="token string">\'./api\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">DataProvider</span> <span class="token keyword">implements</span> <span class="token class-name">TreeDataProvider</span><span class="token operator">&lt;</span><span class="token maybe-class-name">FundInfo</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略部分代码 ...</span>\n\n  <span class="token comment">// 删除配置</span>\n  <span class="token function">removeConfig</span><span class="token punctuation">(</span><span class="token parameter">code<span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> config <span class="token operator">=</span> workspace<span class="token punctuation">.</span><span class="token method function property-access">getConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> favorites<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token spread operator">...</span>config<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token keyword">const</span> index <span class="token operator">=</span> favorites<span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>index <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    favorites<span class="token punctuation">.</span><span class="token method function property-access">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    config<span class="token punctuation">.</span><span class="token method function property-access">update</span><span class="token punctuation">(</span><span class="token string">\'fund-watch.favorites\'</span><span class="token punctuation">,</span> favorites<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-08-24-035658.png" alt="删除按钮"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>实现过程中也遇到了很多问题，遇到问题可以多翻阅 <a href="https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/">VSCode 插件中文文档</a>。该插件已经发布的了 VS Code 插件市场，感兴趣的可以直接<a href="https://marketplace.visualstudio.com/items?itemName=shenfq.fund-watch">下载该插件</a>，或者在 github 上下载<a href="https://github.com/Shenfq/fund-watch">完整代码</a>。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2" }, "\u5199\u5728\u524D\u9762")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%AE%9E%E7%8E%B0%E6%8F%92%E4%BB%B6" }, "\u5B9E\u73B0\u63D2\u4EF6"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%88%9D%E5%A7%8B%E5%8C%96" }, "\u521D\u59CB\u5316")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%88%9B%E5%BB%BA%E8%A7%86%E5%9B%BE" }, "\u521B\u5EFA\u89C6\u56FE")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%BF%90%E8%A1%8C%E6%8F%92%E4%BB%B6" }, "\u8FD0\u884C\u63D2\u4EF6")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%B7%BB%E5%8A%A0%E9%85%8D%E7%BD%AE" }, "\u6DFB\u52A0\u914D\u7F6E")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%A7%86%E5%9B%BE%E6%95%B0%E6%8D%AE" }, "\u89C6\u56FE\u6570\u636E")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE" }, "\u8BF7\u6C42\u6570\u636E")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%BE%8E%E5%8C%96%E6%A0%BC%E5%BC%8F" }, "\u7F8E\u5316\u683C\u5F0F")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%9B%B4%E6%96%B0%E6%95%B0%E6%8D%AE" }, "\u66F4\u65B0\u6570\u636E")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%96%B0%E5%A2%9E%E5%9F%BA%E9%87%91" }, "\u65B0\u589E\u57FA\u91D1")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%88%A0%E9%99%A4%E5%9F%BA%E9%87%91" }, "\u5220\u9664\u57FA\u91D1")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/08/24",
    'updated': null,
    'excerpt': "写在前面 随着7月一波牛市行情，越来越多的人投身A股行列，但是股市的风险巨大，有人一夜暴富，也有人血本无归，所以对于普通人来说基金定投是个不错的选择，本人也是基金定投的一枚小韭菜。 上班的时候经常心理痒痒，想看看今...",
    'cover': "https://file.shenfq.com/ipic/2020-08-22-050614.png",
    'categories': [
        "VSCode"
    ],
    'tags': [
        "VSCode"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 22
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
                "name": "Go",
                "count": 3
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
                "count": 9
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
                "name": "Go",
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
                "name": "Web Components",
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
                "name": "前端思考",
                "count": 1
            },
            {
                "name": "前端构建工具",
                "count": 1
            },
            {
                "name": "变量",
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
                "name": "推荐系统",
                "count": 1
            },
            {
                "name": "数组",
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
