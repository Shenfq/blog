import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/虚拟DOM到底是什么？.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/虚拟DOM到底是什么？.html",
    'title': "虚拟DOM到底是什么？",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>虚拟DOM到底是什么？</h1>\n<h2 id="%E6%98%AF%E4%BB%80%E4%B9%88">是什么？<a class="anchor" href="#%E6%98%AF%E4%BB%80%E4%B9%88">§</a></h2>\n<p>虚拟 DOM （Virtual DOM ）这个概念相信大家都不陌生，从 React 到 Vue ，虚拟 DOM 为这两个框架都带来了跨平台的能力（React-Native 和 Weex）。因为很多人是在学习 React 的过程中接触到的虚拟 DOM ，所以为先入为主，认为虚拟 DOM 和 JSX 密不可分。其实不然，虚拟 DOM 和 JSX 固然契合，但 JSX 只是虚拟 DOM 的充分不必要条件，Vue 即使使用模版，也能把虚拟 DOM 玩得风生水起，同时也有很多人通过 babel 在 Vue 中使用 JSX。</p>\n<p>很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。</p>\n<p>回到最开始的问题，虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 <code>tag</code>、<code>props</code>、<code>children</code> 三个属性。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>hello world!!!<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>上面的 HTML 转换为虚拟 DOM 如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  tag<span class="token operator">:</span> <span class="token string">\'div\'</span><span class="token punctuation">,</span>\n  props<span class="token operator">:</span> <span class="token punctuation">{</span>\n    id<span class="token operator">:</span> <span class="token string">\'app\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  chidren<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      tag<span class="token operator">:</span> <span class="token string">\'p\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span>\n        className<span class="token operator">:</span> <span class="token string">\'text\'</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      chidren<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">\'hello world!!!\'</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该对象就是我们常说的虚拟 DOM 了，因为 DOM 是树形结构，所以使用 JavaScript 对象就能很简单的表示。而原生 DOM 因为浏览器厂商需要实现众多的规范（各种 HTML5 属性、DOM事件），即使创建一个空的 div 也要付出昂贵的代价。虚拟 DOM 提升性能的点在于 DOM 发生变化的时候，通过 diff 算法比对 JavaScript 原生对象，计算出需要变更的 DOM，然后只对变化的 DOM 进行操作，而不是更新整个视图。</p>\n<p>那么我们到底该如何将一段 HTML 转换为虚拟 DOM 呢？</p>\n<h2 id="%E4%BB%8E-h-%E5%87%BD%E6%95%B0%E8%AF%B4%E8%B5%B7">从 h 函数说起<a class="anchor" href="#%E4%BB%8E-h-%E5%87%BD%E6%95%B0%E8%AF%B4%E8%B5%B7">§</a></h2>\n<p>观察主流的虚拟 DOM 库（<a href="https://github.com/snabbdom/snabbdom">snabbdom</a>、<a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a>），通常都有一个 h 函数，也就是 React 中的 <code>React.createElement</code>，以及 Vue 中的 render 方法中的 <code>createElement</code>，另外 React 是通过 babel 将 jsx 转换为 h 函数渲染的形式，而 Vue 是使用 vue-loader 将模版转为 h 函数渲染的形式（也可以通过 babel-plugin-transform-vue-jsx 插件在 vue 中使用 jsx，本质还是转换为 h 函数渲染形式）。</p>\n<p>我们先使用 babel，将一段 jsx 代码，转换为一段 js 代码：</p>\n<h4 id="%E5%AE%89%E8%A3%85-babel-%E4%BE%9D%E8%B5%96">安装 babel 依赖<a class="anchor" href="#%E5%AE%89%E8%A3%85-babel-%E4%BE%9D%E8%B5%96">§</a></h4>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> i -D @babel/cli @babel/core @babel/plugin-transform-react-jsx\n</code></pre>\n<h4 id="%E9%85%8D%E7%BD%AE-babelrc">配置 .babelrc<a class="anchor" href="#%E9%85%8D%E7%BD%AE-babelrc">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">{\n    <span class="token string">"plugins"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span>\n            <span class="token string">"@babel/plugin-transform-react-jsx"</span><span class="token punctuation">,</span>\n            {\n                <span class="token string">"pragma"</span><span class="token punctuation">:</span> <span class="token string">"h"</span><span class="token punctuation">,</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token keyword">default</span> pragma is React<span class="token punctuation">.</span>createElement\n            }\n        <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n}\n</code></pre>\n<h4 id="%E8%BD%AC%E8%AF%91-jsx">转译 jsx<a class="anchor" href="#%E8%BD%AC%E8%AF%91-jsx">§</a></h4>\n<p>在目录下新建一个 <code>main.jsx</code></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">getVDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">"app"</span><span class="token operator">></span>\n      <span class="token operator">&lt;</span>p className<span class="token operator">=</span><span class="token string">"text"</span><span class="token operator">></span>hello world<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>使用如下命令进行转译：</p>\n<pre class="language-bash"><code class="language-bash">npx babel main.jsx --out-file main-compiled.js\n</code></pre>\n<p><img src="https://file.shenfq.com/FtpWFfOrYBe4E2sI3_MyVvWYYijx.png" alt="jsx 转译"></p>\n<p>可以看到，最终 HTML 代码会被转译成 h 函数的渲染形式。h 函数接受是三个参数，分别代表是 DOM 元素的标签名、属性、子节点，最终返回一个虚拟 DOM 的对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> props<span class="token punctuation">,</span> <span class="token spread operator">...</span>children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    tag<span class="token punctuation">,</span>\n    props<span class="token operator">:</span> props <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> children<span class="token punctuation">.</span><span class="token method function property-access">flat</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9F-dom">渲染虚拟 DOM<a class="anchor" href="#%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9F-dom">§</a></h2>\n<p>虽然虚拟 DOM 可以渲染到多个平台，但是这里讲一下在浏览器环境下如何渲染虚拟 DOM。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">vdom</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 如果是字符串或者数字，创建一个文本节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> vdom <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> vdom <span class="token operator">===</span> <span class="token string">\'number\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createTextNode</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> tag<span class="token punctuation">,</span> props<span class="token punctuation">,</span> children <span class="token punctuation">}</span> <span class="token operator">=</span> vdom\n  <span class="token comment">// 创建真实DOM</span>\n  <span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span>\n  <span class="token comment">// 设置属性</span>\n  <span class="token function">setProps</span><span class="token punctuation">(</span>element<span class="token punctuation">,</span> props<span class="token punctuation">)</span>\n  <span class="token comment">// 遍历子节点，并获取创建真实DOM，插入到当前节点</span>\n  children\n    <span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>render<span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span>element<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 虚拟 DOM 中缓存真实 DOM 节点</span>\n  vdom<span class="token punctuation">.</span><span class="token property-access">dom</span> <span class="token operator">=</span> element\n  \n  <span class="token comment">// 返回 DOM 节点</span>\n  <span class="token keyword control-flow">return</span> element\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">setProps</span> <span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">entries</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>key<span class="token punctuation">,</span> value<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">setProp</span><span class="token punctuation">(</span>element<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">setProp</span> <span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> key<span class="token punctuation">,</span> vlaue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  element<span class="token punctuation">.</span><span class="token method function property-access">setAttribute</span><span class="token punctuation">(</span>\n    <span class="token comment">// className使用class代替</span>\n    key <span class="token operator">===</span> <span class="token string">\'className\'</span> <span class="token operator">?</span> <span class="token string">\'class\'</span> <span class="token operator">:</span> key<span class="token punctuation">,</span>\n    vlaue\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>将虚拟 DOM 渲染成真实 DOM 后，只需要插入到对应的根节点即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> vdom <span class="token operator">=</span> <span class="token operator">&lt;</span>div<span class="token operator">></span>hello world<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span> <span class="token comment">// h(\'div\', {}, \'hello world!!!\')</span>\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> ele <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span>\napp<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>ele<span class="token punctuation">)</span>\n</code></pre>\n<p>当然在现代化的框架中，一般会有一个组件文件专门用来构造虚拟 DOM，我们模仿 React 使用 class 的方式编写组件，然后渲染到页面中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  vdom <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 组件的虚拟DOM表示</span>\n  $el  <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 虚拟DOM生成的真实节点</span>\n\n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    text<span class="token operator">:</span> <span class="token string">\'Initialize the Component\'</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> text <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span> text <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">createElement</span> <span class="token punctuation">(</span><span class="token parameter">app<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> vdom <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  component<span class="token punctuation">.</span><span class="token property-access">vdom</span> <span class="token operator">=</span> vdom\n  component<span class="token punctuation">.</span><span class="token property-access">$el</span> <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span> <span class="token comment">// 将虚拟 DOM 转换为真实 DOM</span>\n  app<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">$el</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> component <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Component</span>\n<span class="token function">createElement</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="diff-%E7%AE%97%E6%B3%95">diff 算法<a class="anchor" href="#diff-%E7%AE%97%E6%B3%95">§</a></h2>\n<p>diff 算法，顾名思义，就是比对新老 VDOM 的变化，然后将变化的部分更新到视图上。对应到代码上，就是一个 diff 函数，返回一个 patches （补丁）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> before  <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'before text\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> after   <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'after text\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token function">diff</span><span class="token punctuation">(</span>before<span class="token punctuation">,</span> after<span class="token punctuation">)</span>\n</code></pre>\n<p>修改我们之前的组件，增加 setState 方法，用于修改组件的内部状态。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  vdom <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 组件的虚拟DOM表示</span>\n  $el <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 虚拟DOM生成的真实节点</span>\n  \n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    text<span class="token operator">:</span> <span class="token string">\'Initialize the Component\'</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token comment">// 手动修改组件state</span>\n  <span class="token function">setState</span><span class="token punctuation">(</span><span class="token parameter">newState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      <span class="token spread operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">,</span>\n      <span class="token spread operator">...</span>newState\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> newVdom <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token function">diff</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">vdom</span><span class="token punctuation">,</span> newVdom<span class="token punctuation">)</span>\n    <span class="token function">patch</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$el</span><span class="token punctuation">,</span> patches<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">changeText</span><span class="token punctuation">(</span><span class="token parameter">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      text\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> text <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span> text <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>当我们调用 setState 时，state 内部状态发生变动，再次调用 render 方法就会生成一个新的虚拟 DOM 树，这样我们就能使用 diff 方法计算出新老虚拟 DOM 发送变化的部分，最后使用 patch 方法，将变动渲染到视图中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> component <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Component</span>\n<span class="token function">createElement</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n\n<span class="token comment">// 将文本更改为数字，每秒 +1</span>\n<span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  component<span class="token punctuation">.</span><span class="token method function property-access">changeText</span><span class="token punctuation">(</span><span class="token operator">++</span>count<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FobvvOGC3OwJLUp722L0I-HSO-wd.gif" alt="change text"></p>\n<h3 id="diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96">diff 算法的进化<a class="anchor" href="#diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96">§</a></h3>\n<p>关于 diff 算法的最经典的就是 Matt Esch 的 <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a>，以及 <a href="https://github.com/snabbdom/snabbdom">snabbdom</a>（被整合进 vue 2.0中）。</p>\n<p><img src="https://file.shenfq.com/FmC9sTi8KElPbfGWRch5nH649y12.png" alt="Virtual DOM 的历史"></p>\n<blockquote>\n<p>最开始出现的是 virtual-dom 这个库，是大家好奇 React 为什么这么快而搞鼓出来的。它的实现是非常学院风格，通过深度优先搜索与 in-order tree 来实现高效的 diff 。它与 React 后来公开出来的算法是很不一样。\n然后是 cito.js 的横空出世，它对今后所有虚拟 DOM 的算法都有重大影响。它采用两端同时进行比较的算法，将 diff 速度拉高到几个层次。\n紧随其后的是 kivi.js，在 cito.js 的基出提出两项优化方案，使用 key 实现移动追踪以及及基于 key 的最长自增子序列算法应用（算法复杂度 为O(n^2)）。\n但这样的 diff 算法太过复杂了，于是后来者 snabbdom 将 kivi.js 进行简化，去掉编辑长度矩离算法，调整两端比较算法。速度略有损失，但可读性大大提高。再之后，就是著名的vue2.0 把sanbbdom整个库整合掉了。</p>\n</blockquote>\n<blockquote>\n<p>引用自司徒正美的文章 <a href="https://segmentfault.com/a/1190000011235844">去哪儿网迷你React的研发心得</a></p>\n</blockquote>\n<p>下面我们就来讲讲这几个虚拟 DOM 库 diff 算法的具体实现：</p>\n<h3 id="1%EF%B8%8F%E2%83%A3-virtual-dom">1️⃣ <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a><a class="anchor" href="#1%EF%B8%8F%E2%83%A3-virtual-dom">§</a></h3>\n<p>virtual-dom 作为虚拟 DOM 开天辟地的作品，采用了对 DOM 树进行了深度优先的遍历的方法。</p>\n<h4 id="dom-%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86">DOM 树的遍历<a class="anchor" href="#dom-%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86">§</a></h4>\n<p><img src="https://file.shenfq.com/FsioVJQiRylzBQN3quCjf2H0s287.gif" alt="image"></p>\n<p>体现到代码上：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diff</span> <span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token function">walk</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token comment">// 进行深度优先遍历</span>\n  <span class="token keyword control-flow">return</span> patches\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> patch <span class="token operator">=</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token string">\'update\'</span><span class="token punctuation">,</span> vNode<span class="token operator">:</span> newNode <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> newChildren <span class="token operator">=</span> newNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> oldLen <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> newLen <span class="token operator">=</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> len <span class="token operator">=</span> oldLen <span class="token operator">></span> newLen <span class="token operator">?</span> oldLen <span class="token operator">:</span> newLen\n  <span class="token comment">// 找到对应位置的子节点进行比对</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> newChild <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    index<span class="token operator">++</span>\n    <span class="token comment">// 相同节点进行比对</span>\n    <span class="token function">walk</span><span class="token punctuation">(</span>oldChild<span class="token punctuation">,</span> newChild<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>oldChild<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      index <span class="token operator">+=</span> oldChild<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> patch\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="vdom-%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">VDOM 节点的对比<a class="anchor" href="#vdom-%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<p>上面代码只是对 VDOM 进行了简单的深度优先遍历，在遍历中，还需要对每个 VDOM 进行一些对比，具体分为以下几种情况：</p>\n<ol>\n<li>旧节点不存在，插入新节点；新节点不存在，删除旧节点</li>\n<li>新旧节点如果都是 VNode，且新旧节点 tag 相同\n<ul>\n<li>对比新旧节点的属性</li>\n<li>对比新旧节点的子节点差异，通过 key 值进行重排序，key 值相同节点继续向下遍历</li>\n</ul>\n</li>\n<li>新旧节点如果都是 VText，判断两者文本是否发生变化</li>\n<li>其他情况直接用新节点替代旧节点</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> isVNode<span class="token punctuation">,</span> isVText<span class="token punctuation">,</span> isArray <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'../utils/type\'</span>\n\n<span class="token keyword">function</span> <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">let</span> patch <span class="token operator">=</span> patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 旧节点不存在，直接插入</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token punctuation">,</span>\n      vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>newNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 新节点不存在，删除旧节点</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE</span><span class="token punctuation">,</span>\n      vNode<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>newNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 相同类型节点的 diff</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">===</span> oldNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">&amp;&amp;</span> newNode<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> oldNode<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 新老节点属性的对比</span>\n        <span class="token keyword">const</span> propsPatch <span class="token operator">=</span> <span class="token function">diffProps</span><span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">,</span> oldNode<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>propsPatch <span class="token operator">&amp;&amp;</span> propsPatch<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">PROPS</span><span class="token punctuation">,</span>\n            patches<span class="token operator">:</span> propsPatch<span class="token punctuation">,</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 新老节点子节点的对比</span>\n        patch <span class="token operator">=</span> <span class="token function">diffChildren</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> patch<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 新节点替换旧节点</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REPLACE</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVText</span><span class="token punctuation">(</span>newNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isVText</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 将旧节点替换成文本节点</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">text</span> <span class="token operator">!==</span> oldNode<span class="token punctuation">.</span><span class="token property-access">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 替换文本</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 将补丁放入对应位置</span>\n    patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> patch\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 一个节点可能有多个 patch</span>\n<span class="token comment">// 多个patch时，使用数组进行存储</span>\n<span class="token keyword">function</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span><span class="token parameter">patch<span class="token punctuation">,</span> apply</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>patch<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patch<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>apply<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      patch <span class="token operator">=</span> <span class="token punctuation">[</span>patch<span class="token punctuation">,</span> apply<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">return</span> patch\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> apply\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E5%B1%9E%E6%80%A7%E7%9A%84%E5%AF%B9%E6%AF%94">属性的对比<a class="anchor" href="#%E5%B1%9E%E6%80%A7%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diffProps</span><span class="token punctuation">(</span><span class="token parameter">newProps<span class="token punctuation">,</span> oldProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> oldProps<span class="token punctuation">)</span>\n\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">key</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newVal <span class="token operator">=</span> newProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> oldVal <span class="token operator">=</span> oldProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>newVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patches<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE_PROP</span><span class="token punctuation">,</span>\n        key<span class="token punctuation">,</span>\n        value<span class="token operator">:</span> oldVal<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldVal <span class="token operator">===</span> <span class="token keyword nil">undefined</span> <span class="token operator">||</span> newVal <span class="token operator">!==</span> oldVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patches<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">SET_PROP</span><span class="token punctuation">,</span>\n        key<span class="token punctuation">,</span>\n        value<span class="token operator">:</span> newVal<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> patches\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E5%AD%90%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">子节点的对比<a class="anchor" href="#%E5%AD%90%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<p>这一部分可以说是 diff 算法中，变动最多的部分，因为前面的部分，各个库对比的方向基本一致，而关于子节点的对比，各个仓库都在前者基础上不断得进行改进。</p>\n<p>首先需要明白，为什么需要改进子节点的对比方式。如果我们直接按照深度优先遍历的方式，一个个去对比子节点，子节点的顺序发生改变，那么就会导致 diff 算法认为所有子节点都需要进行 replace，重新将所有子节点的虚拟 DOM 转换成真实 DOM，这种操作是十分消耗性能的。</p>\n<p><img src="https://file.shenfq.com/Ftm04NfB6WqjgFugvWJci9PbDwqp.gif" alt="image"></p>\n<p>但是，如果我们能够找到新旧虚拟 DOM 对应的位置，然后进行移动，那么就能够尽量减少 DOM 的操作。</p>\n<p><img src="https://file.shenfq.com/FpbHKROrmlMkJtnaGGfveqJuD0Bm.gif" alt="image"></p>\n<p>virtual-dom 在一开始就进行了这方面的尝试，对子节点添加 key 值，通过 key 值的对比，来判断子节点是否进行了移动。通过 key 值对比子节点是否移动的模式，被各个库沿用，这也就是为什么主流的视图库中，子节点如果缺失 key 值，会有 warning 的原因。</p>\n<p><img src="https://file.shenfq.com/Fh-7SWcDf_hSGL5zNjNUwUkdv6EO.png" alt="react warning"></p>\n<p>具体是怎么对比的，我们先看代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diffChildren</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> patch<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token comment">// 新节点按旧节点的顺序重新排序</span>\n  <span class="token keyword">const</span> sortedSet <span class="token operator">=</span> <span class="token function">sortChildren</span><span class="token punctuation">(</span>oldChildren<span class="token punctuation">,</span> newNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> newChildren <span class="token operator">=</span> sortedSet<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> oldLen <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> newLen <span class="token operator">=</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> len <span class="token operator">=</span> oldLen <span class="token operator">></span> newLen <span class="token operator">?</span> oldLen <span class="token operator">:</span> newLen\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> leftNode <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">var</span> rightNode <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    index<span class="token operator">++</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>leftNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>rightNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 旧节点不存在，新节点存在，进行插入操作</span>\n        patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token punctuation">,</span>\n          vNode<span class="token operator">:</span> rightNode<span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 相同节点进行比对</span>\n      <span class="token function">walk</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">,</span> rightNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isArray</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      index <span class="token operator">+=</span> leftNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>sortedSet<span class="token punctuation">.</span><span class="token property-access">moves</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 最后进行重新排序</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">ORDER</span><span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> sortedSet<span class="token punctuation">.</span><span class="token property-access">moves</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> patch\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里首先需要对新的子节点进行重排序，先进行相同节点的 diff ，最后把子节点按照新的子节点顺序重新排列。</p>\n<p><img src="https://file.shenfq.com/FqGLn7cd3EEbxRF-nXITUi1jTNp5.gif" alt="children diff"></p>\n<p>这里有个较复杂的部分，就是对子节点的重新排序。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">sortChildren</span><span class="token punctuation">(</span><span class="token parameter">oldChildren<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 找出变化后的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)</span>\n  <span class="token keyword">const</span> newChildIndex <span class="token operator">=</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> newKeys <span class="token operator">=</span> newChildIndex<span class="token punctuation">.</span><span class="token property-access">keys</span>\n  <span class="token keyword">const</span> newFree <span class="token operator">=</span> newChildIndex<span class="token punctuation">.</span><span class="token property-access">free</span>\n\n  <span class="token comment">// 所有子节点无 key 不进行对比</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> newChildren<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 找出变化前的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)</span>\n  <span class="token keyword">const</span> oldChildIndex <span class="token operator">=</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span>oldChildren<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> oldKeys <span class="token operator">=</span> oldChildIndex<span class="token punctuation">.</span><span class="token property-access">keys</span>\n  <span class="token keyword">const</span> oldFree <span class="token operator">=</span> oldChildIndex<span class="token punctuation">.</span><span class="token property-access">free</span>\n\n  <span class="token comment">// 所有子节点无 key 不进行对比</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> newChildren<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// O(MAX(N, M)) memory</span>\n  <span class="token keyword">const</span> shuffle <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n  <span class="token keyword">const</span> freeCount <span class="token operator">=</span> newFree<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">let</span> freeIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> deletedItems <span class="token operator">=</span> <span class="token number">0</span>\n\n  <span class="token comment">// 遍历变化前的子节点，对比变化后子节点的 key 值</span>\n  <span class="token comment">// 并按照对应顺序将变化后子节点的索引放入 shuffle 数组中</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldItem <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> itemIndex\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newKeys<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 匹配到变化前节点中存在的 key</span>\n        itemIndex <span class="token operator">=</span> newKeys<span class="token punctuation">[</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">[</span>itemIndex<span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 移除变化后节点不存在的 key 值</span>\n        deletedItems<span class="token operator">++</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>freeIndex <span class="token operator">&lt;</span> freeCount<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 匹配变化前后的无 key 子节点</span>\n        itemIndex <span class="token operator">=</span> newFree<span class="token punctuation">[</span>freeIndex<span class="token operator">++</span><span class="token punctuation">]</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">[</span>itemIndex<span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 如果变化后子节点中已经不存在无 key 项</span>\n        <span class="token comment">// 变化前的无 key 项也是多余项，故删除</span>\n        deletedItems<span class="token operator">++</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> lastFreeIndex <span class="token operator">=</span>\n    freeIndex <span class="token operator">>=</span> newFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">?</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">:</span> newFree<span class="token punctuation">[</span>freeIndex<span class="token punctuation">]</span>\n\n  <span class="token comment">// 遍历变化后的子节点，将所有之前不存在的 key 对应的子节点放入 shuffle 数组中</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newItem <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>oldKeys<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>newItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 添加所有新的 key 值对应的子节点</span>\n        <span class="token comment">// 之后还会重新排序，我们会在适当的地方插入新增节点</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newItem<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>j <span class="token operator">>=</span> lastFreeIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 添加剩余的无 key 子节点</span>\n      shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newItem<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> simulate <span class="token operator">=</span> shuffle<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> removes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> inserts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> simulateIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> simulateItem\n  <span class="token keyword">let</span> wantedItem\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    wantedItem <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token comment">// 期待元素: 表示变化后 k 的子节点</span>\n    simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span> <span class="token comment">// 模拟元素: 表示变化前 k 位置的子节点</span>\n\n    <span class="token comment">// 删除在变化后不存在的子节点</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">===</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> simulate<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>simulateItem <span class="token operator">||</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">!==</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 期待元素的 key 值存在</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 如果一个带 key 的子元素没有在合适的位置，则进行移动</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newKeys<span class="token punctuation">[</span>simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span> <span class="token operator">!==</span> k <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n            simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n            <span class="token comment">// if the remove didn\'t put the wanted item in place, we need to insert it</span>\n            <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>simulateItem <span class="token operator">||</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">!==</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n            <span class="token punctuation">}</span>\n            <span class="token comment">// items are matching, so skip ahead</span>\n            <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n              simulateIndex<span class="token operator">++</span>\n            <span class="token punctuation">}</span>\n          <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n            inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        k<span class="token operator">++</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 该位置期待元素的 key 值不存在，且模拟元素存在 key 值</span>\n      <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 变化前该位置的元素</span>\n        removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果期待元素和模拟元素 key 值相等，跳到下一个子节点比对</span>\n      simulateIndex<span class="token operator">++</span>\n      k<span class="token operator">++</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 移除所有的模拟元素</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>simulateIndex <span class="token operator">&lt;</span> simulate<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n    removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n      <span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 如果只有删除选项中有值</span>\n  <span class="token comment">// 将操作直接交个 delete patch</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>removes<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> deletedItems <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>inserts<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> shuffle<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    children<span class="token operator">:</span> shuffle<span class="token punctuation">,</span>\n    moves<span class="token operator">:</span> <span class="token punctuation">{</span>\n      removes<span class="token operator">:</span> removes<span class="token punctuation">,</span>\n      inserts<span class="token operator">:</span> inserts<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n\n<span class="token keyword">function</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> keys <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token keyword">const</span> free <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> length <span class="token operator">=</span> children<span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> child <span class="token operator">=</span> children<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      keys<span class="token punctuation">[</span>child<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span> <span class="token operator">=</span> i\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      free<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    keys<span class="token operator">:</span> keys<span class="token punctuation">,</span> <span class="token comment">// 子节点中所有存在的 key 对应的索引</span>\n    free<span class="token operator">:</span> free<span class="token punctuation">,</span> <span class="token comment">// 子节点中不存在 key 值的索引</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token parameter">arr<span class="token punctuation">,</span> index<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  arr<span class="token punctuation">.</span><span class="token method function property-access">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 移除数组中指定元素</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token keyword module">from</span><span class="token operator">:</span> index<span class="token punctuation">,</span>\n    key<span class="token operator">:</span> key<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这一部分比较复杂，具体可以查看 virtual-dom 的两个 pr ，这两个 pr 里面讨论了关于 diff 子节点重新排序的优化逻辑。</p>\n<ul>\n<li><a href="https://github.com/Matt-Esch/virtual-dom/pull/197">Rewrite reorder</a></li>\n<li><a href="https://github.com/Matt-Esch/virtual-dom/pull/199">Rewrite reorder (part 2)</a></li>\n</ul>\n<h4 id="%E6%9B%B4%E6%96%B0-dom">更新 DOM<a class="anchor" href="#%E6%9B%B4%E6%96%B0-dom">§</a></h4>\n<p>在拿到了 VDOM 的 diff 结果后，需要将得到的 patches 更新到视图上。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">rootNode<span class="token punctuation">,</span> patches</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>patches <span class="token operator">||</span> patches<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword control-flow">return</span>\n  <span class="token comment">// 取得对应 index 的真实 DOM</span>\n  <span class="token keyword">const</span> nodes <span class="token operator">=</span> <span class="token function">domIndex</span><span class="token punctuation">(</span>rootNode<span class="token punctuation">)</span>\n  patches<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">patch<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    patch <span class="token operator">&amp;&amp;</span> <span class="token function">applyPatch</span><span class="token punctuation">(</span>nodes<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">,</span> patch<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">domIndex</span><span class="token punctuation">(</span><span class="token parameter">rootNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> nodes <span class="token operator">=</span> <span class="token punctuation">[</span>rootNode<span class="token punctuation">]</span>\n  <span class="token keyword">const</span> children <span class="token operator">=</span> rootNode<span class="token punctuation">.</span><span class="token property-access">childNodes</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>children<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> child <span class="token keyword">of</span> children<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">1</span> <span class="token operator">||</span> child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          nodes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">domIndex</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          nodes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> nodes\n<span class="token punctuation">}</span>\n</code></pre>\n<p>遍历patches，然后得到每个真实 DOM 和其对应的 patch，然后在真实 DOM 上进行更新：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">applyPatch</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> patchList</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> patch <span class="token keyword">of</span> patchList<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">patchOp</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> patch<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">patchOp</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> patch</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> vNode <span class="token punctuation">}</span> <span class="token operator">=</span> patch\n  <span class="token keyword">const</span> parentNode <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">parentNode</span>\n  <span class="token keyword">let</span> newNode <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token operator">:</span>\n      <span class="token comment">// 插入新节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE</span><span class="token operator">:</span>\n      <span class="token comment">// 删除旧新节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REPLACE</span><span class="token operator">:</span>\n      <span class="token comment">// 替换节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">ORDER</span><span class="token operator">:</span>\n      <span class="token comment">// 子节点重新排序</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token operator">:</span>\n      <span class="token comment">// 替换文本节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">PROPS</span><span class="token operator">:</span>\n      <span class="token comment">// 更新节点属性</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword module">default</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">break</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里每一步操作，不进行具体展开，感兴趣的话可以在我的 github 查看<a href="https://github.com/Shenfq/magic-dom/blob/master/lib/patch.js">完整代码</a>。</p>\n<h3 id="2%EF%B8%8F%E2%83%A3-citojs">2️⃣ <a href="https://github.com/joelrich/citojs">cito.js</a><a class="anchor" href="#2%EF%B8%8F%E2%83%A3-citojs">§</a></h3>\n<p>cito 其他步骤与 virtual-dom 类似，最大的差异点就在子节点的对比上，而且 cito 移除了 patch 更新，在 diff 的过程中，直接更新真实 DOM ，这样省去了 patch 的存储，一定程度上节省了内存，后面其他的 VDOM 库基本使用这种方式。</p>\n<p>我们再来看看 cito 在子节点的对比上，到底有何优化？</p>\n<p>其实前面我们已经介绍过了，cito 主要变化就是引入了两端对比，将 diff 算法的速度提升了几个量级。</p>\n<p><img src="https://file.shenfq.com/FuJ7jioLog_cAouxbVNeVZIEYvq5.gif" alt="两端对比"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token doc-comment comment">/**\n * 子节点对比\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">domNode</span>   父节点的真实DOM\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">oldChildren</span> 旧的子节点\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">children</span>    新的子节点\n */</span>\n<span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span><span class="token parameter">domNode<span class="token punctuation">,</span> oldChildren<span class="token punctuation">,</span> children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> oldChildrenLength <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> childrenLength <span class="token operator">=</span> children<span class="token punctuation">.</span><span class="token property-access">length</span>\n  \n  <span class="token keyword">let</span> oldEndIndex <span class="token operator">=</span> oldChildrenLength <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> endIndex <span class="token operator">=</span> childrenLength <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> oldStartIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> startIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> successful <span class="token operator">=</span> <span class="token boolean">true</span>\n  <span class="token keyword">let</span> nextChild\n  \n  <span class="token comment">// 两端对比算法</span>\n  outer<span class="token operator">:</span> <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>\n    successful <span class="token operator">&amp;&amp;</span>\n    oldStartIndex <span class="token operator">&lt;=</span> oldEndIndex <span class="token operator">&amp;&amp;</span>\n    startIndex <span class="token operator">&lt;=</span> endIndex\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    successful <span class="token operator">=</span> <span class="token boolean">false</span>\n    <span class="token keyword">let</span> oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> startChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldStartChild<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      oldStartIndex<span class="token operator">++</span>\n      startIndex<span class="token operator">++</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n      startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">let</span> oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldEndChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> endChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldEndChild<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      oldEndIndex<span class="token operator">--</span>\n      endIndex<span class="token operator">--</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n      endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> endChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      nextChild <span class="token operator">=</span> endIndex <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">&lt;</span> childrenLength <span class="token operator">?</span> children<span class="token punctuation">[</span>endIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldStartChild<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      <span class="token comment">// 移动子节点</span>\n      <span class="token function">moveChild</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n      oldStartIndex<span class="token operator">++</span>\n      endIndex<span class="token operator">--</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n      endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldEndChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> startChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      nextChild <span class="token operator">=</span> oldStartIndex <span class="token operator">&lt;</span> oldChildrenLength <span class="token operator">?</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldEndChild<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      <span class="token comment">// 移动子节点</span>\n      <span class="token function">moveChild</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n      oldEndIndex<span class="token operator">--</span>\n      startIndex<span class="token operator">++</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n      startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>子节点对比：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">updateNode</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> node<span class="token punctuation">,</span> domParent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>node <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> tag <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">tag</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">!==</span> tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 标签不一致，创建新节点</span>\n    <span class="token function">createNode</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> domParent<span class="token punctuation">,</span> oldNode<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token keyword">const</span> children <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token keyword">const</span> domNode <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">dom</span>\n    node<span class="token punctuation">.</span><span class="token property-access">dom</span> <span class="token operator">=</span> domNode <span class="token comment">// 真实 DOM 挂在到 虚拟 DOM 上</span>\n    <span class="token comment">// 子节点对比</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>children <span class="token operator">!==</span> oldChildren<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">updateChildren</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> node<span class="token punctuation">,</span> oldChildren<span class="token punctuation">,</span> children<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> oldProps <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">props</span>\n    <span class="token keyword">const</span> props <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">props</span>\n    <span class="token comment">// 属性对比</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>props <span class="token operator">!==</span> oldProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">updateAttributes</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> props<span class="token punctuation">,</span> oldProps<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>移动子节点：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">moveChild</span><span class="token punctuation">(</span><span class="token parameter">domNode<span class="token punctuation">,</span> child<span class="token punctuation">,</span> nextChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> domRefChild <span class="token operator">=</span> nextChild <span class="token operator">&amp;&amp;</span> nextChild<span class="token punctuation">.</span><span class="token property-access">dom</span>\n  <span class="token keyword">let</span> domChild <span class="token operator">=</span> child<span class="token punctuation">.</span><span class="token property-access">dom</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>domChild <span class="token operator">!==</span> domRefChild<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>domRefChild<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      domNode<span class="token punctuation">.</span><span class="token method function property-access">insertBefore</span><span class="token punctuation">(</span>domChild<span class="token punctuation">,</span> domRefChild<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      domNode<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>domChild<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="3%EF%B8%8F%E2%83%A3-kivijs">3️⃣ <a href="https://github.com/localvoid/kivi">kivi.js</a><a class="anchor" href="#3%EF%B8%8F%E2%83%A3-kivijs">§</a></h3>\n<p>kivi 的 diff 算法在 cito 的基础上，引入了最长增长子序列，通过子序列找到最小的 DOM 操作数。</p>\n<h4 id="%E7%AE%97%E6%B3%95%E6%80%9D%E6%83%B3">算法思想<a class="anchor" href="#%E7%AE%97%E6%B3%95%E6%80%9D%E6%83%B3">§</a></h4>\n<blockquote>\n<p>翻译自 <a href="https://github.com/localvoid/kivi/blob/569ba49acd7d5c8809cfc621eb02ec6206f0d3c9/lib/reconciler.ts#L410-L641">kivi/lib/reconciler.ts</a></p>\n</blockquote>\n<p>该算法用于找到最小的 DOM 操作数，可以分为以下几步：</p>\n<h5 id="1-%E6%89%BE%E5%88%B0%E6%95%B0%E7%BB%84%E4%B8%AD%E9%A6%96%E9%83%A8%E5%92%8C%E5%B0%BE%E9%83%A8%E5%85%AC%E5%85%B1%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E5%9C%A8%E4%B8%A4%E7%AB%AF%E7%A7%BB%E5%8A%A8">1. 找到数组中首部和尾部公共的节点，并在两端移动<a class="anchor" href="#1-%E6%89%BE%E5%88%B0%E6%95%B0%E7%BB%84%E4%B8%AD%E9%A6%96%E9%83%A8%E5%92%8C%E5%B0%BE%E9%83%A8%E5%85%AC%E5%85%B1%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E5%9C%A8%E4%B8%A4%E7%AB%AF%E7%A7%BB%E5%8A%A8">§</a></h5>\n<p>该方法通过比对两端的 key 值，找到旧节点（A） 和新节点（B）中索引相同的节点。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>a b c d e f g<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>a b f d c g<span class="token punctuation">]</span>\n</code></pre>\n<p>这里我们可以跳过首部的 <code>a</code> 和 <code>b</code>，以及尾部的 <code>g</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>c d e f<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>f d c<span class="token punctuation">]</span>\n</code></pre>\n<p>此时，将尝试对边进行比较，如果在对边有一个 key 值相同的节点，将执行简单的移动操作，将 <code>c</code> 节点移动到\n右边缘，将 <code>f</code> 节点移动到左边缘。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>d e<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>d<span class="token punctuation">]</span>\n</code></pre>\n<p>现在将再次尝试查找公共的首部与尾部，发现 <code>d</code> 节点是相同的，我们跳过它。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>e<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span> <span class="token punctuation">]</span>\n</code></pre>\n<p>然后检查各个列表的长度是否为0，如果旧节点列表长度为0，将插入新节点列表的剩余节点，或者新节点列表长度为0，将删除所有旧节点列表中的元素。</p>\n<p>这个简单的算法适用于大多数的实际案例，比如仅仅反转了列表。</p>\n<p>当列表无法利用该算法找到解的时候，会使用下一个算法，例如：</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>a b c d e f g<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>a c b h f e g<span class="token punctuation">]</span>\n</code></pre>\n<p>边缘的 <code>a</code> 和 <code>g</code> 节点相同，跳过他们。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n</code></pre>\n<p>然后上面的算法行不通了，我们需要进入下一步。</p>\n<h5 id="2-%E6%9F%A5%E6%89%BE%E9%9C%80%E8%A6%81%E5%88%A0%E9%99%A4%E6%88%96%E8%80%85%E6%8F%92%E5%85%A5%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E4%B8%94%E6%9F%90%E4%B8%AA%E8%8A%82%E7%82%B9%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E7%A7%BB%E5%8A%A8">2. 查找需要删除或者插入的节点，并且某个节点是否需要移动<a class="anchor" href="#2-%E6%9F%A5%E6%89%BE%E9%9C%80%E8%A6%81%E5%88%A0%E9%99%A4%E6%88%96%E8%80%85%E6%8F%92%E5%85%A5%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E4%B8%94%E6%9F%90%E4%B8%AA%E8%8A%82%E7%82%B9%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E7%A7%BB%E5%8A%A8">§</a></h5>\n<p>我们先创建一个数组 <code>P</code>，长度为新子节点列表的长度，并为数组每个元素赋值 -1 ，它表示新子节点应该插入的位置。稍后，我们将把旧子节点中的节点位置分配给这个数组。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n</code></pre>\n<p>然后，我们构建一个对象 <code>I</code>，它的键表示新子节点的 key 值，值为子节点在剩余节点数组中的位置。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">0</span>\n</code></pre>\n<p>我们开始遍历旧子节点列表的剩余节点，并检查是否可以在 <code>I</code> 对象的索引中找到具有相同 key 值的节点。如果找不到任何节点，则将它删除，否则，我们将节点在旧节点列表位置分配给数组 <code>P</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n      <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">1</span>\n</code></pre>\n<p>当我们为数组 <code>P</code> 分配节点位置时，我们会保留上一个节点在新子节点列表中的位置，如果当一个节点的位置大于当前节点的位置，那么我们将 <code>moved</code> 变量置为 <code>true</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n        <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">/</span><span class="token operator">/</span> last <span class="token operator">></span> <span class="token number">0</span><span class="token comment">; moved = true</span>\n</code></pre>\n<p>上一个节点 <code>b</code>位置为 “1”，当前节点 <code>c</code> 的位置 “0”，所以将 <code>moved</code> 变量置为 <code>true</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n          <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>对象 <code>I</code> 索引中不存在 <code>d</code>，则删除该节点</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n            <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>为节点 <code>e</code> 分配位置。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n              <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>为节点 <code>f</code> 分配位置。</p>\n<p>此时，我们检查 <code>moved</code> 标志是否被打开，或者旧子节点列表的长度减去已删除节点的数量不等于新子节点列表的长度。如果其中任何一个条件为真，我们则进入下一步。</p>\n<h5 id="3-%E5%A6%82%E6%9E%9C-moved-%E4%B8%BA%E7%9C%9F%E6%9F%A5%E6%89%BE%E6%9C%80%E5%B0%8F%E7%A7%BB%E5%8A%A8%E6%95%B0%E5%A6%82%E6%9E%9C%E9%95%BF%E5%BA%A6%E5%8F%91%E9%80%81%E5%8F%98%E5%8C%96%E5%88%99%E6%8F%92%E5%85%A5%E6%96%B0%E8%8A%82%E7%82%B9">3. 如果 <code>moved</code> 为真，查找最小移动数，如果长度发送变化，则插入新节点。<a class="anchor" href="#3-%E5%A6%82%E6%9E%9C-moved-%E4%B8%BA%E7%9C%9F%E6%9F%A5%E6%89%BE%E6%9C%80%E5%B0%8F%E7%A7%BB%E5%8A%A8%E6%95%B0%E5%A6%82%E6%9E%9C%E9%95%BF%E5%BA%A6%E5%8F%91%E9%80%81%E5%8F%98%E5%8C%96%E5%88%99%E6%8F%92%E5%85%A5%E6%96%B0%E8%8A%82%E7%82%B9">§</a></h5>\n<p>如果 <code>moved</code> 为真，我们需要在 <code>P</code> 数组中找到 <a href="http://en.wikipedia.org/wiki/Longest_increasing_subsequence">最长自增子序列</a>，并移动不属于这个子序列的所有节点。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>现在我们需要同时从尾端遍历新的子节点列表以及最长自增子序列（后面简称 LIS），并检查当前位置是否等于 LIS 的值。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n              <span class="token operator">^</span>  <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">4</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n              <span class="token operator">^</span>  <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">4</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>e</code> 保持当前位置</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">3</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos !<span class="token operator">=</span> <span class="token number">1</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>移动节点 <code>f</code>，移动到下一个节点 <code>e</code> 前面它。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">2</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> old_pos <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>h</code> 在数组 P 中为 -1 ，则表示插入新节点 <code>h</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n        <span class="token operator">^</span>        <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">1</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">1</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>b</code> 保持当前位置</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n      <span class="token operator">^</span>          <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">0</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> new_pos !<span class="token operator">=</span> undefined\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>移动节点 <code>c</code> ，移动到下一个节点 <code>b</code> 前面它。</p>\n<p>如果 <code>moved</code> 为 <code>false</code> 时，我们不需要查找LIS，我们只需遍历新子节点列表，并检查它在数组 <code>P</code> 中的位置，如果是 -1 ，则插入新节点。</p>\n<h4 id="%E5%85%B3%E4%BA%8E-kivi">关于 kivi<a class="anchor" href="#%E5%85%B3%E4%BA%8E-kivi">§</a></h4>\n<p>kivi 是作者对虚拟 DOM 性能提升的一些猜想，一开始它就向着性能出发，所有它在实现上代码可能并不优雅，而且它的 api 也十分不友好。而接下来的 snabbdom 就在 kivi 的基础上，大大提升了代码的可读性，很多讲述虚拟 DOM 的文章也将 snabbdom 作为案例。</p>\n<p>另外，kivi 的作者也创建了另一个 源码以及 api 更友好的仓库：<a href="https://github.com/localvoid/ivi">ivi</a>，感兴趣可以了解一下。</p>\n<h3 id="4%EF%B8%8F%E2%83%A3-snabbdom">4️⃣ <a href="https://github.com/snabbdom/snabbdom">snabbdom</a><a class="anchor" href="#4%EF%B8%8F%E2%83%A3-snabbdom">§</a></h3>\n<p>snabbdom 的优势就是代码的可读性大大提升，并且也引入了两端对比，diff 速度也不慢。</p>\n<p>我们可以简单看下 snabbdom 的两端对比算法的核心代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token doc-comment comment">/**\n * 子节点对比\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">parentElm</span>   父节点的真实DOM\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">oldCh</span> 旧的子节点\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">newCh</span> 新的子节点\n */</span>\n<span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span><span class="token parameter">parentElm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> newCh</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> oldStartIdx <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> newStartIdx <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> oldEndIdx <span class="token operator">=</span> oldCh<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>oldEndIdx<span class="token punctuation">]</span>\n  <span class="token keyword">let</span> newEndIdx <span class="token operator">=</span> newCh<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span>newEndIdx<span class="token punctuation">]</span>\n  <span class="token keyword">let</span> oldKeyToIdx\n  <span class="token keyword">let</span> idxInOld\n  <span class="token keyword">let</span> elmToMove\n  <span class="token keyword">let</span> before\n\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">&amp;&amp;</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 跳过两端不存在的旧节点</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldEndVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 跳过两端不存在的新节点</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newStartVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newEndVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">/* \n    ** 进行两端对比，分为四种状况：\n    ** 1. oldStart &lt;=>  newStart\n    ** 2. oldEnd   &lt;=>  newEnd\n    ** 3. oldStart &lt;=>  newEnd\n    ** 4. oldEnd   &lt;=>  newStart\n    */</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span>\n      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldEndVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">.</span><span class="token property-access">nextSibling</span><span class="token punctuation">)</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// Vnode moved left</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldEndVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> \n    <span class="token comment">// 上面四种情况都不存在，通过 key 值查找对应 VDOM 进行对比</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 构造旧子节点的 map 表 (key => vdom)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldKeyToIdx <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        oldKeyToIdx <span class="token operator">=</span> <span class="token function">createKeyToOldIdx</span><span class="token punctuation">(</span>oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      idxInOld <span class="token operator">=</span> oldKeyToIdx<span class="token punctuation">[</span>newStartVnode<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span>\n      <span class="token comment">// 如果新的子节点在旧子节点不存在，进行插入操作</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>idxInOld <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> <span class="token function">render</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">)</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 如果新的子节点在旧子节点存在，进行对比</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        elmToMove <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>elmToMove<span class="token punctuation">.</span><span class="token property-access">sel</span> <span class="token operator">!==</span> newStartVnode<span class="token punctuation">.</span><span class="token property-access">sel</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// key 值相同，但是 tag 不同，重新生成节点并替换</span>\n          <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> <span class="token function">render</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">)</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          <span class="token function">patchVnode</span><span class="token punctuation">(</span>elmToMove<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n          oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword nil">undefined</span> <span class="token comment">// 该位置已经对比，进行置空</span>\n          <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> elmToMove<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 处理一些未处理到的节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">||</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">></span> oldEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      before <span class="token operator">=</span> newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword null nil">null</span> <span class="token operator">?</span> <span class="token keyword null nil">null</span> <span class="token operator">:</span> newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">dom</span>\n      <span class="token function">addVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> before<span class="token punctuation">,</span> newCh<span class="token punctuation">,</span> newStartIdx<span class="token punctuation">,</span> newEndIdx<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token function">removeVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>关于 snabbdom ，网上有太多教程来分析它的 diff 过程了，不管是虚拟 DOM 的教程，还是 Vue 的源码分析，这里就不再详细讲述了。但是可以明显的看到，snabbdom 的 diff 算法是有 cito 和 kivi 的影子在的。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>毋庸置疑虚拟 DOM 带给前端的意义是非凡的，虚拟 DOM 在现如今还有更多新鲜的玩法。\n比如 <a href="https://github.com/Tencent/omi">omi</a> 将虚拟 DOM 与 Web Component 的结合，还有 <a href="https://github.com/NervJS/taro">Taro</a> 和 <a href="https://github.com/didi/chameleon">Chameleon</a> 带来的多端统一的能力。</p>\n<p>另外，文中相关的代码都可以在我的 <a href="https://github.com/Shenfq/magic-dom">github</a> 查看，这篇文章更多是对自己学习的一个记录，如果有什么错误的观点，欢迎进行指正。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u865A\u62DFDOM\u5230\u5E95\u662F\u4EC0\u4E48\uFF1F"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E6%98%AF%E4%BB%80%E4%B9%88">是什么？<a class="anchor" href="#%E6%98%AF%E4%BB%80%E4%B9%88">§</a></h2>\n<p>虚拟 DOM （Virtual DOM ）这个概念相信大家都不陌生，从 React 到 Vue ，虚拟 DOM 为这两个框架都带来了跨平台的能力（React-Native 和 Weex）。因为很多人是在学习 React 的过程中接触到的虚拟 DOM ，所以为先入为主，认为虚拟 DOM 和 JSX 密不可分。其实不然，虚拟 DOM 和 JSX 固然契合，但 JSX 只是虚拟 DOM 的充分不必要条件，Vue 即使使用模版，也能把虚拟 DOM 玩得风生水起，同时也有很多人通过 babel 在 Vue 中使用 JSX。</p>\n<p>很多人认为虚拟 DOM 最大的优势是 diff 算法，减少 JavaScript 操作真实 DOM 的带来的性能消耗。虽然这一个虚拟 DOM 带来的一个优势，但并不是全部。虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种GUI。</p>\n<p>回到最开始的问题，虚拟 DOM 到底是什么，说简单点，就是一个普通的 JavaScript 对象，包含了 <code>tag</code>、<code>props</code>、<code>children</code> 三个属性。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>hello world!!!<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>上面的 HTML 转换为虚拟 DOM 如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  tag<span class="token operator">:</span> <span class="token string">\'div\'</span><span class="token punctuation">,</span>\n  props<span class="token operator">:</span> <span class="token punctuation">{</span>\n    id<span class="token operator">:</span> <span class="token string">\'app\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  chidren<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      tag<span class="token operator">:</span> <span class="token string">\'p\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span>\n        className<span class="token operator">:</span> <span class="token string">\'text\'</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      chidren<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token string">\'hello world!!!\'</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该对象就是我们常说的虚拟 DOM 了，因为 DOM 是树形结构，所以使用 JavaScript 对象就能很简单的表示。而原生 DOM 因为浏览器厂商需要实现众多的规范（各种 HTML5 属性、DOM事件），即使创建一个空的 div 也要付出昂贵的代价。虚拟 DOM 提升性能的点在于 DOM 发生变化的时候，通过 diff 算法比对 JavaScript 原生对象，计算出需要变更的 DOM，然后只对变化的 DOM 进行操作，而不是更新整个视图。</p>\n<p>那么我们到底该如何将一段 HTML 转换为虚拟 DOM 呢？</p>\n<h2 id="%E4%BB%8E-h-%E5%87%BD%E6%95%B0%E8%AF%B4%E8%B5%B7">从 h 函数说起<a class="anchor" href="#%E4%BB%8E-h-%E5%87%BD%E6%95%B0%E8%AF%B4%E8%B5%B7">§</a></h2>\n<p>观察主流的虚拟 DOM 库（<a href="https://github.com/snabbdom/snabbdom">snabbdom</a>、<a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a>），通常都有一个 h 函数，也就是 React 中的 <code>React.createElement</code>，以及 Vue 中的 render 方法中的 <code>createElement</code>，另外 React 是通过 babel 将 jsx 转换为 h 函数渲染的形式，而 Vue 是使用 vue-loader 将模版转为 h 函数渲染的形式（也可以通过 babel-plugin-transform-vue-jsx 插件在 vue 中使用 jsx，本质还是转换为 h 函数渲染形式）。</p>\n<p>我们先使用 babel，将一段 jsx 代码，转换为一段 js 代码：</p>\n<h4 id="%E5%AE%89%E8%A3%85-babel-%E4%BE%9D%E8%B5%96">安装 babel 依赖<a class="anchor" href="#%E5%AE%89%E8%A3%85-babel-%E4%BE%9D%E8%B5%96">§</a></h4>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> i -D @babel/cli @babel/core @babel/plugin-transform-react-jsx\n</code></pre>\n<h4 id="%E9%85%8D%E7%BD%AE-babelrc">配置 .babelrc<a class="anchor" href="#%E9%85%8D%E7%BD%AE-babelrc">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">{\n    <span class="token string">"plugins"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">[</span>\n            <span class="token string">"@babel/plugin-transform-react-jsx"</span><span class="token punctuation">,</span>\n            {\n                <span class="token string">"pragma"</span><span class="token punctuation">:</span> <span class="token string">"h"</span><span class="token punctuation">,</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token keyword">default</span> pragma is React<span class="token punctuation">.</span>createElement\n            }\n        <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n}\n</code></pre>\n<h4 id="%E8%BD%AC%E8%AF%91-jsx">转译 jsx<a class="anchor" href="#%E8%BD%AC%E8%AF%91-jsx">§</a></h4>\n<p>在目录下新建一个 <code>main.jsx</code></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">getVDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n    <span class="token operator">&lt;</span>div id<span class="token operator">=</span><span class="token string">"app"</span><span class="token operator">></span>\n      <span class="token operator">&lt;</span>p className<span class="token operator">=</span><span class="token string">"text"</span><span class="token operator">></span>hello world<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>\n    <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>使用如下命令进行转译：</p>\n<pre class="language-bash"><code class="language-bash">npx babel main.jsx --out-file main-compiled.js\n</code></pre>\n<p><img src="https://file.shenfq.com/FtpWFfOrYBe4E2sI3_MyVvWYYijx.png" alt="jsx 转译"></p>\n<p>可以看到，最终 HTML 代码会被转译成 h 函数的渲染形式。h 函数接受是三个参数，分别代表是 DOM 元素的标签名、属性、子节点，最终返回一个虚拟 DOM 的对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> props<span class="token punctuation">,</span> <span class="token spread operator">...</span>children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    tag<span class="token punctuation">,</span>\n    props<span class="token operator">:</span> props <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    children<span class="token operator">:</span> children<span class="token punctuation">.</span><span class="token method function property-access">flat</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9F-dom">渲染虚拟 DOM<a class="anchor" href="#%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9F-dom">§</a></h2>\n<p>虽然虚拟 DOM 可以渲染到多个平台，但是这里讲一下在浏览器环境下如何渲染虚拟 DOM。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">vdom</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 如果是字符串或者数字，创建一个文本节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> vdom <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> vdom <span class="token operator">===</span> <span class="token string">\'number\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createTextNode</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> tag<span class="token punctuation">,</span> props<span class="token punctuation">,</span> children <span class="token punctuation">}</span> <span class="token operator">=</span> vdom\n  <span class="token comment">// 创建真实DOM</span>\n  <span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span>tag<span class="token punctuation">)</span>\n  <span class="token comment">// 设置属性</span>\n  <span class="token function">setProps</span><span class="token punctuation">(</span>element<span class="token punctuation">,</span> props<span class="token punctuation">)</span>\n  <span class="token comment">// 遍历子节点，并获取创建真实DOM，插入到当前节点</span>\n  children\n    <span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>render<span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span>element<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 虚拟 DOM 中缓存真实 DOM 节点</span>\n  vdom<span class="token punctuation">.</span><span class="token property-access">dom</span> <span class="token operator">=</span> element\n  \n  <span class="token comment">// 返回 DOM 节点</span>\n  <span class="token keyword control-flow">return</span> element\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">setProps</span> <span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">entries</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>key<span class="token punctuation">,</span> value<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">setProp</span><span class="token punctuation">(</span>element<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">setProp</span> <span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> key<span class="token punctuation">,</span> vlaue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  element<span class="token punctuation">.</span><span class="token method function property-access">setAttribute</span><span class="token punctuation">(</span>\n    <span class="token comment">// className使用class代替</span>\n    key <span class="token operator">===</span> <span class="token string">\'className\'</span> <span class="token operator">?</span> <span class="token string">\'class\'</span> <span class="token operator">:</span> key<span class="token punctuation">,</span>\n    vlaue\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>将虚拟 DOM 渲染成真实 DOM 后，只需要插入到对应的根节点即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> vdom <span class="token operator">=</span> <span class="token operator">&lt;</span>div<span class="token operator">></span>hello world<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span> <span class="token comment">// h(\'div\', {}, \'hello world!!!\')</span>\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> ele <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span>\napp<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>ele<span class="token punctuation">)</span>\n</code></pre>\n<p>当然在现代化的框架中，一般会有一个组件文件专门用来构造虚拟 DOM，我们模仿 React 使用 class 的方式编写组件，然后渲染到页面中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  vdom <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 组件的虚拟DOM表示</span>\n  $el  <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 虚拟DOM生成的真实节点</span>\n\n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    text<span class="token operator">:</span> <span class="token string">\'Initialize the Component\'</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> text <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span> text <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">createElement</span> <span class="token punctuation">(</span><span class="token parameter">app<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> vdom <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  component<span class="token punctuation">.</span><span class="token property-access">vdom</span> <span class="token operator">=</span> vdom\n  component<span class="token punctuation">.</span><span class="token property-access">$el</span> <span class="token operator">=</span> <span class="token function">render</span><span class="token punctuation">(</span>vdom<span class="token punctuation">)</span> <span class="token comment">// 将虚拟 DOM 转换为真实 DOM</span>\n  app<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">$el</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> component <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Component</span>\n<span class="token function">createElement</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="diff-%E7%AE%97%E6%B3%95">diff 算法<a class="anchor" href="#diff-%E7%AE%97%E6%B3%95">§</a></h2>\n<p>diff 算法，顾名思义，就是比对新老 VDOM 的变化，然后将变化的部分更新到视图上。对应到代码上，就是一个 diff 函数，返回一个 patches （补丁）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> before  <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'before text\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> after   <span class="token operator">=</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'div\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'after text\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token function">diff</span><span class="token punctuation">(</span>before<span class="token punctuation">,</span> after<span class="token punctuation">)</span>\n</code></pre>\n<p>修改我们之前的组件，增加 setState 方法，用于修改组件的内部状态。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">class</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  vdom <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 组件的虚拟DOM表示</span>\n  $el <span class="token operator">=</span> <span class="token keyword null nil">null</span> <span class="token comment">// 虚拟DOM生成的真实节点</span>\n  \n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    text<span class="token operator">:</span> <span class="token string">\'Initialize the Component\'</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token comment">// 手动修改组件state</span>\n  <span class="token function">setState</span><span class="token punctuation">(</span><span class="token parameter">newState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n      <span class="token spread operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">,</span>\n      <span class="token spread operator">...</span>newState\n    <span class="token punctuation">}</span>\n    <span class="token keyword">const</span> newVdom <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token function">diff</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">vdom</span><span class="token punctuation">,</span> newVdom<span class="token punctuation">)</span>\n    <span class="token function">patch</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$el</span><span class="token punctuation">,</span> patches<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">changeText</span><span class="token punctuation">(</span><span class="token parameter">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      text\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> text <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span> text <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>当我们调用 setState 时，state 内部状态发生变动，再次调用 render 方法就会生成一个新的虚拟 DOM 树，这样我们就能使用 diff 方法计算出新老虚拟 DOM 发送变化的部分，最后使用 patch 方法，将变动渲染到视图中。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'app\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> component <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Component</span>\n<span class="token function">createElement</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> component<span class="token punctuation">)</span>\n\n<span class="token comment">// 将文本更改为数字，每秒 +1</span>\n<span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  component<span class="token punctuation">.</span><span class="token method function property-access">changeText</span><span class="token punctuation">(</span><span class="token operator">++</span>count<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FobvvOGC3OwJLUp722L0I-HSO-wd.gif" alt="change text"></p>\n<h3 id="diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96">diff 算法的进化<a class="anchor" href="#diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96">§</a></h3>\n<p>关于 diff 算法的最经典的就是 Matt Esch 的 <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a>，以及 <a href="https://github.com/snabbdom/snabbdom">snabbdom</a>（被整合进 vue 2.0中）。</p>\n<p><img src="https://file.shenfq.com/FmC9sTi8KElPbfGWRch5nH649y12.png" alt="Virtual DOM 的历史"></p>\n<blockquote>\n<p>最开始出现的是 virtual-dom 这个库，是大家好奇 React 为什么这么快而搞鼓出来的。它的实现是非常学院风格，通过深度优先搜索与 in-order tree 来实现高效的 diff 。它与 React 后来公开出来的算法是很不一样。\n然后是 cito.js 的横空出世，它对今后所有虚拟 DOM 的算法都有重大影响。它采用两端同时进行比较的算法，将 diff 速度拉高到几个层次。\n紧随其后的是 kivi.js，在 cito.js 的基出提出两项优化方案，使用 key 实现移动追踪以及及基于 key 的最长自增子序列算法应用（算法复杂度 为O(n^2)）。\n但这样的 diff 算法太过复杂了，于是后来者 snabbdom 将 kivi.js 进行简化，去掉编辑长度矩离算法，调整两端比较算法。速度略有损失，但可读性大大提高。再之后，就是著名的vue2.0 把sanbbdom整个库整合掉了。</p>\n</blockquote>\n<blockquote>\n<p>引用自司徒正美的文章 <a href="https://segmentfault.com/a/1190000011235844">去哪儿网迷你React的研发心得</a></p>\n</blockquote>\n<p>下面我们就来讲讲这几个虚拟 DOM 库 diff 算法的具体实现：</p>\n<h3 id="1%EF%B8%8F%E2%83%A3-virtual-dom">1️⃣ <a href="https://github.com/Matt-Esch/virtual-dom">virtual-dom</a><a class="anchor" href="#1%EF%B8%8F%E2%83%A3-virtual-dom">§</a></h3>\n<p>virtual-dom 作为虚拟 DOM 开天辟地的作品，采用了对 DOM 树进行了深度优先的遍历的方法。</p>\n<h4 id="dom-%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86">DOM 树的遍历<a class="anchor" href="#dom-%E6%A0%91%E7%9A%84%E9%81%8D%E5%8E%86">§</a></h4>\n<p><img src="https://file.shenfq.com/FsioVJQiRylzBQN3quCjf2H0s287.gif" alt="image"></p>\n<p>体现到代码上：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diff</span> <span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token function">walk</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token comment">// 进行深度优先遍历</span>\n  <span class="token keyword control-flow">return</span> patches\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> patch <span class="token operator">=</span> <span class="token punctuation">{</span> type<span class="token operator">:</span> <span class="token string">\'update\'</span><span class="token punctuation">,</span> vNode<span class="token operator">:</span> newNode <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> newChildren <span class="token operator">=</span> newNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> oldLen <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> newLen <span class="token operator">=</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> len <span class="token operator">=</span> oldLen <span class="token operator">></span> newLen <span class="token operator">?</span> oldLen <span class="token operator">:</span> newLen\n  <span class="token comment">// 找到对应位置的子节点进行比对</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> newChild <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    index<span class="token operator">++</span>\n    <span class="token comment">// 相同节点进行比对</span>\n    <span class="token function">walk</span><span class="token punctuation">(</span>oldChild<span class="token punctuation">,</span> newChild<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>oldChild<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      index <span class="token operator">+=</span> oldChild<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> patch\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="vdom-%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">VDOM 节点的对比<a class="anchor" href="#vdom-%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<p>上面代码只是对 VDOM 进行了简单的深度优先遍历，在遍历中，还需要对每个 VDOM 进行一些对比，具体分为以下几种情况：</p>\n<ol>\n<li>旧节点不存在，插入新节点；新节点不存在，删除旧节点</li>\n<li>新旧节点如果都是 VNode，且新旧节点 tag 相同\n<ul>\n<li>对比新旧节点的属性</li>\n<li>对比新旧节点的子节点差异，通过 key 值进行重排序，key 值相同节点继续向下遍历</li>\n</ul>\n</li>\n<li>新旧节点如果都是 VText，判断两者文本是否发生变化</li>\n<li>其他情况直接用新节点替代旧节点</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> isVNode<span class="token punctuation">,</span> isVText<span class="token punctuation">,</span> isArray <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'../utils/type\'</span>\n\n<span class="token keyword">function</span> <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">let</span> patch <span class="token operator">=</span> patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 旧节点不存在，直接插入</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token punctuation">,</span>\n      vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>newNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 新节点不存在，删除旧节点</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE</span><span class="token punctuation">,</span>\n      vNode<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>newNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 相同类型节点的 diff</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">===</span> oldNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">&amp;&amp;</span> newNode<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> oldNode<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 新老节点属性的对比</span>\n        <span class="token keyword">const</span> propsPatch <span class="token operator">=</span> <span class="token function">diffProps</span><span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">,</span> oldNode<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">)</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>propsPatch <span class="token operator">&amp;&amp;</span> propsPatch<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n            type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">PROPS</span><span class="token punctuation">,</span>\n            patches<span class="token operator">:</span> propsPatch<span class="token punctuation">,</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 新老节点子节点的对比</span>\n        patch <span class="token operator">=</span> <span class="token function">diffChildren</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> patch<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 新节点替换旧节点</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REPLACE</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVText</span><span class="token punctuation">(</span>newNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isVText</span><span class="token punctuation">(</span>oldNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 将旧节点替换成文本节点</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newNode<span class="token punctuation">.</span><span class="token property-access">text</span> <span class="token operator">!==</span> oldNode<span class="token punctuation">.</span><span class="token property-access">text</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 替换文本</span>\n      patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token punctuation">,</span>\n        vNode<span class="token operator">:</span> newNode<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 将补丁放入对应位置</span>\n    patches<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> patch\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 一个节点可能有多个 patch</span>\n<span class="token comment">// 多个patch时，使用数组进行存储</span>\n<span class="token keyword">function</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span><span class="token parameter">patch<span class="token punctuation">,</span> apply</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>patch<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>patch<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patch<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>apply<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      patch <span class="token operator">=</span> <span class="token punctuation">[</span>patch<span class="token punctuation">,</span> apply<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">return</span> patch\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> apply\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E5%B1%9E%E6%80%A7%E7%9A%84%E5%AF%B9%E6%AF%94">属性的对比<a class="anchor" href="#%E5%B1%9E%E6%80%A7%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diffProps</span><span class="token punctuation">(</span><span class="token parameter">newProps<span class="token punctuation">,</span> oldProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> patches <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> oldProps<span class="token punctuation">)</span>\n\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">key</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newVal <span class="token operator">=</span> newProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> oldVal <span class="token operator">=</span> oldProps<span class="token punctuation">[</span>key<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>newVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patches<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE_PROP</span><span class="token punctuation">,</span>\n        key<span class="token punctuation">,</span>\n        value<span class="token operator">:</span> oldVal<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldVal <span class="token operator">===</span> <span class="token keyword nil">undefined</span> <span class="token operator">||</span> newVal <span class="token operator">!==</span> oldVal<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      patches<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">SET_PROP</span><span class="token punctuation">,</span>\n        key<span class="token punctuation">,</span>\n        value<span class="token operator">:</span> newVal<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> patches\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E5%AD%90%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">子节点的对比<a class="anchor" href="#%E5%AD%90%E8%8A%82%E7%82%B9%E7%9A%84%E5%AF%B9%E6%AF%94">§</a></h4>\n<p>这一部分可以说是 diff 算法中，变动最多的部分，因为前面的部分，各个库对比的方向基本一致，而关于子节点的对比，各个仓库都在前者基础上不断得进行改进。</p>\n<p>首先需要明白，为什么需要改进子节点的对比方式。如果我们直接按照深度优先遍历的方式，一个个去对比子节点，子节点的顺序发生改变，那么就会导致 diff 算法认为所有子节点都需要进行 replace，重新将所有子节点的虚拟 DOM 转换成真实 DOM，这种操作是十分消耗性能的。</p>\n<p><img src="https://file.shenfq.com/Ftm04NfB6WqjgFugvWJci9PbDwqp.gif" alt="image"></p>\n<p>但是，如果我们能够找到新旧虚拟 DOM 对应的位置，然后进行移动，那么就能够尽量减少 DOM 的操作。</p>\n<p><img src="https://file.shenfq.com/FpbHKROrmlMkJtnaGGfveqJuD0Bm.gif" alt="image"></p>\n<p>virtual-dom 在一开始就进行了这方面的尝试，对子节点添加 key 值，通过 key 值的对比，来判断子节点是否进行了移动。通过 key 值对比子节点是否移动的模式，被各个库沿用，这也就是为什么主流的视图库中，子节点如果缺失 key 值，会有 warning 的原因。</p>\n<p><img src="https://file.shenfq.com/Fh-7SWcDf_hSGL5zNjNUwUkdv6EO.png" alt="react warning"></p>\n<p>具体是怎么对比的，我们先看代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">diffChildren</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> newNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> patch<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token comment">// 新节点按旧节点的顺序重新排序</span>\n  <span class="token keyword">const</span> sortedSet <span class="token operator">=</span> <span class="token function">sortChildren</span><span class="token punctuation">(</span>oldChildren<span class="token punctuation">,</span> newNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> newChildren <span class="token operator">=</span> sortedSet<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">const</span> oldLen <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> newLen <span class="token operator">=</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> len <span class="token operator">=</span> oldLen <span class="token operator">></span> newLen <span class="token operator">?</span> oldLen <span class="token operator">:</span> newLen\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> leftNode <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">var</span> rightNode <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    index<span class="token operator">++</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>leftNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>rightNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 旧节点不存在，新节点存在，进行插入操作</span>\n        patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token punctuation">,</span>\n          vNode<span class="token operator">:</span> rightNode<span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 相同节点进行比对</span>\n      <span class="token function">walk</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">,</span> rightNode<span class="token punctuation">,</span> patches<span class="token punctuation">,</span> index<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isVNode</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isArray</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      index <span class="token operator">+=</span> leftNode<span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>sortedSet<span class="token punctuation">.</span><span class="token property-access">moves</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 最后进行重新排序</span>\n    patch <span class="token operator">=</span> <span class="token function">appendPatch</span><span class="token punctuation">(</span>patch<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">ORDER</span><span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> sortedSet<span class="token punctuation">.</span><span class="token property-access">moves</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> patch\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里首先需要对新的子节点进行重排序，先进行相同节点的 diff ，最后把子节点按照新的子节点顺序重新排列。</p>\n<p><img src="https://file.shenfq.com/FqGLn7cd3EEbxRF-nXITUi1jTNp5.gif" alt="children diff"></p>\n<p>这里有个较复杂的部分，就是对子节点的重新排序。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">sortChildren</span><span class="token punctuation">(</span><span class="token parameter">oldChildren<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 找出变化后的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)</span>\n  <span class="token keyword">const</span> newChildIndex <span class="token operator">=</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> newKeys <span class="token operator">=</span> newChildIndex<span class="token punctuation">.</span><span class="token property-access">keys</span>\n  <span class="token keyword">const</span> newFree <span class="token operator">=</span> newChildIndex<span class="token punctuation">.</span><span class="token property-access">free</span>\n\n  <span class="token comment">// 所有子节点无 key 不进行对比</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> newChildren<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 找出变化前的子节点中带 key 的 vdom (keys)，和不带 key 的 vdom (free)</span>\n  <span class="token keyword">const</span> oldChildIndex <span class="token operator">=</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span>oldChildren<span class="token punctuation">)</span>\n  <span class="token keyword">const</span> oldKeys <span class="token operator">=</span> oldChildIndex<span class="token punctuation">.</span><span class="token property-access">keys</span>\n  <span class="token keyword">const</span> oldFree <span class="token operator">=</span> oldChildIndex<span class="token punctuation">.</span><span class="token property-access">free</span>\n\n  <span class="token comment">// 所有子节点无 key 不进行对比</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> newChildren<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// O(MAX(N, M)) memory</span>\n  <span class="token keyword">const</span> shuffle <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n  <span class="token keyword">const</span> freeCount <span class="token operator">=</span> newFree<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">let</span> freeIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> deletedItems <span class="token operator">=</span> <span class="token number">0</span>\n\n  <span class="token comment">// 遍历变化前的子节点，对比变化后子节点的 key 值</span>\n  <span class="token comment">// 并按照对应顺序将变化后子节点的索引放入 shuffle 数组中</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldItem <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> itemIndex\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newKeys<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 匹配到变化前节点中存在的 key</span>\n        itemIndex <span class="token operator">=</span> newKeys<span class="token punctuation">[</span>oldItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">[</span>itemIndex<span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 移除变化后节点不存在的 key 值</span>\n        deletedItems<span class="token operator">++</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>freeIndex <span class="token operator">&lt;</span> freeCount<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 匹配变化前后的无 key 子节点</span>\n        itemIndex <span class="token operator">=</span> newFree<span class="token punctuation">[</span>freeIndex<span class="token operator">++</span><span class="token punctuation">]</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newChildren<span class="token punctuation">[</span>itemIndex<span class="token punctuation">]</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 如果变化后子节点中已经不存在无 key 项</span>\n        <span class="token comment">// 变化前的无 key 项也是多余项，故删除</span>\n        deletedItems<span class="token operator">++</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> lastFreeIndex <span class="token operator">=</span>\n    freeIndex <span class="token operator">>=</span> newFree<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">?</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">:</span> newFree<span class="token punctuation">[</span>freeIndex<span class="token punctuation">]</span>\n\n  <span class="token comment">// 遍历变化后的子节点，将所有之前不存在的 key 对应的子节点放入 shuffle 数组中</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> newItem <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>j<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>oldKeys<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>newItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 添加所有新的 key 值对应的子节点</span>\n        <span class="token comment">// 之后还会重新排序，我们会在适当的地方插入新增节点</span>\n        shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newItem<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>j <span class="token operator">>=</span> lastFreeIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 添加剩余的无 key 子节点</span>\n      shuffle<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>newItem<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> simulate <span class="token operator">=</span> shuffle<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> removes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> inserts <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> simulateIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> simulateItem\n  <span class="token keyword">let</span> wantedItem\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    wantedItem <span class="token operator">=</span> newChildren<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token comment">// 期待元素: 表示变化后 k 的子节点</span>\n    simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span> <span class="token comment">// 模拟元素: 表示变化前 k 位置的子节点</span>\n\n    <span class="token comment">// 删除在变化后不存在的子节点</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">===</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> simulate<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>simulateItem <span class="token operator">||</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">!==</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 期待元素的 key 值存在</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 如果一个带 key 的子元素没有在合适的位置，则进行移动</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newKeys<span class="token punctuation">[</span>simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span> <span class="token operator">!==</span> k <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n            simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n            <span class="token comment">// if the remove didn\'t put the wanted item in place, we need to insert it</span>\n            <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>simulateItem <span class="token operator">||</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">!==</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n              inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n            <span class="token punctuation">}</span>\n            <span class="token comment">// items are matching, so skip ahead</span>\n            <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n              simulateIndex<span class="token operator">++</span>\n            <span class="token punctuation">}</span>\n          <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n            inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          inserts<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> wantedItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">,</span> to<span class="token operator">:</span> k <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        k<span class="token operator">++</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 该位置期待元素的 key 值不存在，且模拟元素存在 key 值</span>\n      <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 变化前该位置的元素</span>\n        removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果期待元素和模拟元素 key 值相等，跳到下一个子节点比对</span>\n      simulateIndex<span class="token operator">++</span>\n      k<span class="token operator">++</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 移除所有的模拟元素</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>simulateIndex <span class="token operator">&lt;</span> simulate<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    simulateItem <span class="token operator">=</span> simulate<span class="token punctuation">[</span>simulateIndex<span class="token punctuation">]</span>\n    removes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>\n      <span class="token function">remove</span><span class="token punctuation">(</span>simulate<span class="token punctuation">,</span> simulateIndex<span class="token punctuation">,</span> simulateItem <span class="token operator">&amp;&amp;</span> simulateItem<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 如果只有删除选项中有值</span>\n  <span class="token comment">// 将操作直接交个 delete patch</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>removes<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> deletedItems <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>inserts<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      children<span class="token operator">:</span> shuffle<span class="token punctuation">,</span>\n      moves<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    children<span class="token operator">:</span> shuffle<span class="token punctuation">,</span>\n    moves<span class="token operator">:</span> <span class="token punctuation">{</span>\n      removes<span class="token operator">:</span> removes<span class="token punctuation">,</span>\n      inserts<span class="token operator">:</span> inserts<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n\n<span class="token keyword">function</span> <span class="token function">keyIndex</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> keys <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token keyword">const</span> free <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">const</span> length <span class="token operator">=</span> children<span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> child <span class="token operator">=</span> children<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      keys<span class="token punctuation">[</span>child<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span> <span class="token operator">=</span> i\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      free<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    keys<span class="token operator">:</span> keys<span class="token punctuation">,</span> <span class="token comment">// 子节点中所有存在的 key 对应的索引</span>\n    free<span class="token operator">:</span> free<span class="token punctuation">,</span> <span class="token comment">// 子节点中不存在 key 值的索引</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token parameter">arr<span class="token punctuation">,</span> index<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  arr<span class="token punctuation">.</span><span class="token method function property-access">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 移除数组中指定元素</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    <span class="token keyword module">from</span><span class="token operator">:</span> index<span class="token punctuation">,</span>\n    key<span class="token operator">:</span> key<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这一部分比较复杂，具体可以查看 virtual-dom 的两个 pr ，这两个 pr 里面讨论了关于 diff 子节点重新排序的优化逻辑。</p>\n<ul>\n<li><a href="https://github.com/Matt-Esch/virtual-dom/pull/197">Rewrite reorder</a></li>\n<li><a href="https://github.com/Matt-Esch/virtual-dom/pull/199">Rewrite reorder (part 2)</a></li>\n</ul>\n<h4 id="%E6%9B%B4%E6%96%B0-dom">更新 DOM<a class="anchor" href="#%E6%9B%B4%E6%96%B0-dom">§</a></h4>\n<p>在拿到了 VDOM 的 diff 结果后，需要将得到的 patches 更新到视图上。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">patch</span><span class="token punctuation">(</span><span class="token parameter">rootNode<span class="token punctuation">,</span> patches</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>patches <span class="token operator">||</span> patches<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword control-flow">return</span>\n  <span class="token comment">// 取得对应 index 的真实 DOM</span>\n  <span class="token keyword">const</span> nodes <span class="token operator">=</span> <span class="token function">domIndex</span><span class="token punctuation">(</span>rootNode<span class="token punctuation">)</span>\n  patches<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">patch<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    patch <span class="token operator">&amp;&amp;</span> <span class="token function">applyPatch</span><span class="token punctuation">(</span>nodes<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">,</span> patch<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">domIndex</span><span class="token punctuation">(</span><span class="token parameter">rootNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> nodes <span class="token operator">=</span> <span class="token punctuation">[</span>rootNode<span class="token punctuation">]</span>\n  <span class="token keyword">const</span> children <span class="token operator">=</span> rootNode<span class="token punctuation">.</span><span class="token property-access">childNodes</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>children<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> child <span class="token keyword">of</span> children<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">1</span> <span class="token operator">||</span> child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          nodes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">domIndex</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span><span class="token property-access">nodeType</span> <span class="token operator">===</span> <span class="token number">3</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          nodes<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> nodes\n<span class="token punctuation">}</span>\n</code></pre>\n<p>遍历patches，然后得到每个真实 DOM 和其对应的 patch，然后在真实 DOM 上进行更新：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">applyPatch</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> patchList</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> patch <span class="token keyword">of</span> patchList<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">patchOp</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> patch<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">patchOp</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> patch</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> vNode <span class="token punctuation">}</span> <span class="token operator">=</span> patch\n  <span class="token keyword">const</span> parentNode <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">parentNode</span>\n  <span class="token keyword">let</span> newNode <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">INSERT</span><span class="token operator">:</span>\n      <span class="token comment">// 插入新节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REMOVE</span><span class="token operator">:</span>\n      <span class="token comment">// 删除旧新节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">REPLACE</span><span class="token operator">:</span>\n      <span class="token comment">// 替换节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">ORDER</span><span class="token operator">:</span>\n      <span class="token comment">// 子节点重新排序</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">VTEXT</span><span class="token operator">:</span>\n      <span class="token comment">// 替换文本节点</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword">case</span> <span class="token constant">PATCH</span><span class="token punctuation">.</span><span class="token constant">PROPS</span><span class="token operator">:</span>\n      <span class="token comment">// 更新节点属性</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token keyword module">default</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">break</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里每一步操作，不进行具体展开，感兴趣的话可以在我的 github 查看<a href="https://github.com/Shenfq/magic-dom/blob/master/lib/patch.js">完整代码</a>。</p>\n<h3 id="2%EF%B8%8F%E2%83%A3-citojs">2️⃣ <a href="https://github.com/joelrich/citojs">cito.js</a><a class="anchor" href="#2%EF%B8%8F%E2%83%A3-citojs">§</a></h3>\n<p>cito 其他步骤与 virtual-dom 类似，最大的差异点就在子节点的对比上，而且 cito 移除了 patch 更新，在 diff 的过程中，直接更新真实 DOM ，这样省去了 patch 的存储，一定程度上节省了内存，后面其他的 VDOM 库基本使用这种方式。</p>\n<p>我们再来看看 cito 在子节点的对比上，到底有何优化？</p>\n<p>其实前面我们已经介绍过了，cito 主要变化就是引入了两端对比，将 diff 算法的速度提升了几个量级。</p>\n<p><img src="https://file.shenfq.com/FuJ7jioLog_cAouxbVNeVZIEYvq5.gif" alt="两端对比"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token doc-comment comment">/**\n * 子节点对比\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">domNode</span>   父节点的真实DOM\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">oldChildren</span> 旧的子节点\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">children</span>    新的子节点\n */</span>\n<span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span><span class="token parameter">domNode<span class="token punctuation">,</span> oldChildren<span class="token punctuation">,</span> children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> oldChildrenLength <span class="token operator">=</span> oldChildren<span class="token punctuation">.</span><span class="token property-access">length</span>\n  <span class="token keyword">const</span> childrenLength <span class="token operator">=</span> children<span class="token punctuation">.</span><span class="token property-access">length</span>\n  \n  <span class="token keyword">let</span> oldEndIndex <span class="token operator">=</span> oldChildrenLength <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> endIndex <span class="token operator">=</span> childrenLength <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> oldStartIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> startIndex <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> successful <span class="token operator">=</span> <span class="token boolean">true</span>\n  <span class="token keyword">let</span> nextChild\n  \n  <span class="token comment">// 两端对比算法</span>\n  outer<span class="token operator">:</span> <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>\n    successful <span class="token operator">&amp;&amp;</span>\n    oldStartIndex <span class="token operator">&lt;=</span> oldEndIndex <span class="token operator">&amp;&amp;</span>\n    startIndex <span class="token operator">&lt;=</span> endIndex\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    successful <span class="token operator">=</span> <span class="token boolean">false</span>\n    <span class="token keyword">let</span> oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> startChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldStartChild<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      oldStartIndex<span class="token operator">++</span>\n      startIndex<span class="token operator">++</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n      startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">let</span> oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n    <span class="token keyword">let</span> endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldEndChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> endChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldEndChild<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      oldEndIndex<span class="token operator">--</span>\n      endIndex<span class="token operator">--</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n      endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> endChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      nextChild <span class="token operator">=</span> endIndex <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">&lt;</span> childrenLength <span class="token operator">?</span> children<span class="token punctuation">[</span>endIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldStartChild<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      <span class="token comment">// 移动子节点</span>\n      <span class="token function">moveChild</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> endChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n      oldStartIndex<span class="token operator">++</span>\n      endIndex<span class="token operator">--</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldStartChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span>\n      endChild <span class="token operator">=</span> children<span class="token punctuation">[</span>endIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldEndChild<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> startChild<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      nextChild <span class="token operator">=</span> oldStartIndex <span class="token operator">&lt;</span> oldChildrenLength <span class="token operator">?</span> oldChildren<span class="token punctuation">[</span>oldStartIndex<span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword null nil">null</span>\n      <span class="token comment">// 子节点对比</span>\n      <span class="token function">updateNode</span><span class="token punctuation">(</span>oldEndChild<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> domNode<span class="token punctuation">)</span>\n      <span class="token comment">// 移动子节点</span>\n      <span class="token function">moveChild</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> startChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n      oldEndIndex<span class="token operator">--</span>\n      startIndex<span class="token operator">++</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIndex <span class="token operator">></span> oldEndIndex <span class="token operator">||</span> startIndex <span class="token operator">></span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">break</span> outer\n      <span class="token punctuation">}</span>\n      oldEndChild <span class="token operator">=</span> oldChildren<span class="token punctuation">[</span>oldEndIndex<span class="token punctuation">]</span>\n      startChild <span class="token operator">=</span> children<span class="token punctuation">[</span>startIndex<span class="token punctuation">]</span>\n      successful <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>子节点对比：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">updateNode</span><span class="token punctuation">(</span><span class="token parameter">oldNode<span class="token punctuation">,</span> node<span class="token punctuation">,</span> domParent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>node <span class="token operator">===</span> oldNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">const</span> tag <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">tag</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldNode<span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">!==</span> tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 标签不一致，创建新节点</span>\n    <span class="token function">createNode</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> domParent<span class="token punctuation">,</span> oldNode<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> oldChildren <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token keyword">const</span> children <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">children</span>\n    <span class="token keyword">const</span> domNode <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">dom</span>\n    node<span class="token punctuation">.</span><span class="token property-access">dom</span> <span class="token operator">=</span> domNode <span class="token comment">// 真实 DOM 挂在到 虚拟 DOM 上</span>\n    <span class="token comment">// 子节点对比</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>children <span class="token operator">!==</span> oldChildren<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">updateChildren</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> node<span class="token punctuation">,</span> oldChildren<span class="token punctuation">,</span> children<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">const</span> oldProps <span class="token operator">=</span> oldNode<span class="token punctuation">.</span><span class="token property-access">props</span>\n    <span class="token keyword">const</span> props <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">props</span>\n    <span class="token comment">// 属性对比</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>props <span class="token operator">!==</span> oldProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">updateAttributes</span><span class="token punctuation">(</span>domNode<span class="token punctuation">,</span> props<span class="token punctuation">,</span> oldProps<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>移动子节点：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">moveChild</span><span class="token punctuation">(</span><span class="token parameter">domNode<span class="token punctuation">,</span> child<span class="token punctuation">,</span> nextChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> domRefChild <span class="token operator">=</span> nextChild <span class="token operator">&amp;&amp;</span> nextChild<span class="token punctuation">.</span><span class="token property-access">dom</span>\n  <span class="token keyword">let</span> domChild <span class="token operator">=</span> child<span class="token punctuation">.</span><span class="token property-access">dom</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>domChild <span class="token operator">!==</span> domRefChild<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>domRefChild<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      domNode<span class="token punctuation">.</span><span class="token method function property-access">insertBefore</span><span class="token punctuation">(</span>domChild<span class="token punctuation">,</span> domRefChild<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      domNode<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>domChild<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="3%EF%B8%8F%E2%83%A3-kivijs">3️⃣ <a href="https://github.com/localvoid/kivi">kivi.js</a><a class="anchor" href="#3%EF%B8%8F%E2%83%A3-kivijs">§</a></h3>\n<p>kivi 的 diff 算法在 cito 的基础上，引入了最长增长子序列，通过子序列找到最小的 DOM 操作数。</p>\n<h4 id="%E7%AE%97%E6%B3%95%E6%80%9D%E6%83%B3">算法思想<a class="anchor" href="#%E7%AE%97%E6%B3%95%E6%80%9D%E6%83%B3">§</a></h4>\n<blockquote>\n<p>翻译自 <a href="https://github.com/localvoid/kivi/blob/569ba49acd7d5c8809cfc621eb02ec6206f0d3c9/lib/reconciler.ts#L410-L641">kivi/lib/reconciler.ts</a></p>\n</blockquote>\n<p>该算法用于找到最小的 DOM 操作数，可以分为以下几步：</p>\n<h5 id="1-%E6%89%BE%E5%88%B0%E6%95%B0%E7%BB%84%E4%B8%AD%E9%A6%96%E9%83%A8%E5%92%8C%E5%B0%BE%E9%83%A8%E5%85%AC%E5%85%B1%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E5%9C%A8%E4%B8%A4%E7%AB%AF%E7%A7%BB%E5%8A%A8">1. 找到数组中首部和尾部公共的节点，并在两端移动<a class="anchor" href="#1-%E6%89%BE%E5%88%B0%E6%95%B0%E7%BB%84%E4%B8%AD%E9%A6%96%E9%83%A8%E5%92%8C%E5%B0%BE%E9%83%A8%E5%85%AC%E5%85%B1%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E5%9C%A8%E4%B8%A4%E7%AB%AF%E7%A7%BB%E5%8A%A8">§</a></h5>\n<p>该方法通过比对两端的 key 值，找到旧节点（A） 和新节点（B）中索引相同的节点。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>a b c d e f g<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>a b f d c g<span class="token punctuation">]</span>\n</code></pre>\n<p>这里我们可以跳过首部的 <code>a</code> 和 <code>b</code>，以及尾部的 <code>g</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>c d e f<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>f d c<span class="token punctuation">]</span>\n</code></pre>\n<p>此时，将尝试对边进行比较，如果在对边有一个 key 值相同的节点，将执行简单的移动操作，将 <code>c</code> 节点移动到\n右边缘，将 <code>f</code> 节点移动到左边缘。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>d e<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>d<span class="token punctuation">]</span>\n</code></pre>\n<p>现在将再次尝试查找公共的首部与尾部，发现 <code>d</code> 节点是相同的，我们跳过它。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>e<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span> <span class="token punctuation">]</span>\n</code></pre>\n<p>然后检查各个列表的长度是否为0，如果旧节点列表长度为0，将插入新节点列表的剩余节点，或者新节点列表长度为0，将删除所有旧节点列表中的元素。</p>\n<p>这个简单的算法适用于大多数的实际案例，比如仅仅反转了列表。</p>\n<p>当列表无法利用该算法找到解的时候，会使用下一个算法，例如：</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>a b c d e f g<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>a c b h f e g<span class="token punctuation">]</span>\n</code></pre>\n<p>边缘的 <code>a</code> 和 <code>g</code> 节点相同，跳过他们。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token operator">-</span><span class="token operator">></span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  B<span class="token punctuation">:</span>    <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n</code></pre>\n<p>然后上面的算法行不通了，我们需要进入下一步。</p>\n<h5 id="2-%E6%9F%A5%E6%89%BE%E9%9C%80%E8%A6%81%E5%88%A0%E9%99%A4%E6%88%96%E8%80%85%E6%8F%92%E5%85%A5%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E4%B8%94%E6%9F%90%E4%B8%AA%E8%8A%82%E7%82%B9%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E7%A7%BB%E5%8A%A8">2. 查找需要删除或者插入的节点，并且某个节点是否需要移动<a class="anchor" href="#2-%E6%9F%A5%E6%89%BE%E9%9C%80%E8%A6%81%E5%88%A0%E9%99%A4%E6%88%96%E8%80%85%E6%8F%92%E5%85%A5%E7%9A%84%E8%8A%82%E7%82%B9%E5%B9%B6%E4%B8%94%E6%9F%90%E4%B8%AA%E8%8A%82%E7%82%B9%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E7%A7%BB%E5%8A%A8">§</a></h5>\n<p>我们先创建一个数组 <code>P</code>，长度为新子节点列表的长度，并为数组每个元素赋值 -1 ，它表示新子节点应该插入的位置。稍后，我们将把旧子节点中的节点位置分配给这个数组。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n</code></pre>\n<p>然后，我们构建一个对象 <code>I</code>，它的键表示新子节点的 key 值，值为子节点在剩余节点数组中的位置。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">0</span>\n</code></pre>\n<p>我们开始遍历旧子节点列表的剩余节点，并检查是否可以在 <code>I</code> 对象的索引中找到具有相同 key 值的节点。如果找不到任何节点，则将它删除，否则，我们将节点在旧节点列表位置分配给数组 <code>P</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n      <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">.</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">1</span>\n</code></pre>\n<p>当我们为数组 <code>P</code> 分配节点位置时，我们会保留上一个节点在新子节点列表中的位置，如果当一个节点的位置大于当前节点的位置，那么我们将 <code>moved</code> 变量置为 <code>true</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n        <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  last <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">/</span><span class="token operator">/</span> last <span class="token operator">></span> <span class="token number">0</span><span class="token comment">; moved = true</span>\n</code></pre>\n<p>上一个节点 <code>b</code>位置为 “1”，当前节点 <code>c</code> 的位置 “0”，所以将 <code>moved</code> 变量置为 <code>true</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n          <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>对象 <code>I</code> 索引中不存在 <code>d</code>，则删除该节点</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n            <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token punctuation">.</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>为节点 <code>e</code> 分配位置。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n              <span class="token operator">^</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  I<span class="token punctuation">:</span> {\n    c<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n    b<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    h<span class="token punctuation">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n    f<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token operator">&lt;</span><span class="token operator">-</span>\n    e<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  }\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>为节点 <code>f</code> 分配位置。</p>\n<p>此时，我们检查 <code>moved</code> 标志是否被打开，或者旧子节点列表的长度减去已删除节点的数量不等于新子节点列表的长度。如果其中任何一个条件为真，我们则进入下一步。</p>\n<h5 id="3-%E5%A6%82%E6%9E%9C-moved-%E4%B8%BA%E7%9C%9F%E6%9F%A5%E6%89%BE%E6%9C%80%E5%B0%8F%E7%A7%BB%E5%8A%A8%E6%95%B0%E5%A6%82%E6%9E%9C%E9%95%BF%E5%BA%A6%E5%8F%91%E9%80%81%E5%8F%98%E5%8C%96%E5%88%99%E6%8F%92%E5%85%A5%E6%96%B0%E8%8A%82%E7%82%B9">3. 如果 <code>moved</code> 为真，查找最小移动数，如果长度发送变化，则插入新节点。<a class="anchor" href="#3-%E5%A6%82%E6%9E%9C-moved-%E4%B8%BA%E7%9C%9F%E6%9F%A5%E6%89%BE%E6%9C%80%E5%B0%8F%E7%A7%BB%E5%8A%A8%E6%95%B0%E5%A6%82%E6%9E%9C%E9%95%BF%E5%BA%A6%E5%8F%91%E9%80%81%E5%8F%98%E5%8C%96%E5%88%99%E6%8F%92%E5%85%A5%E6%96%B0%E8%8A%82%E7%82%B9">§</a></h5>\n<p>如果 <code>moved</code> 为真，我们需要在 <code>P</code> 数组中找到 <a href="http://en.wikipedia.org/wiki/Longest_increasing_subsequence">最长自增子序列</a>，并移动不属于这个子序列的所有节点。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>现在我们需要同时从尾端遍历新的子节点列表以及最长自增子序列（后面简称 LIS），并检查当前位置是否等于 LIS 的值。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n              <span class="token operator">^</span>  <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">4</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n              <span class="token operator">^</span>  <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">4</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>e</code> 保持当前位置</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">3</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos !<span class="token operator">=</span> <span class="token number">1</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>移动节点 <code>f</code>，移动到下一个节点 <code>e</code> 前面它。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">2</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> old_pos <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>h</code> 在数组 P 中为 -1 ，则表示插入新节点 <code>h</code>。</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n        <span class="token operator">^</span>        <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">1</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n            <span class="token operator">^</span>    <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">1</span>\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>节点 <code>b</code> 保持当前位置</p>\n<pre class="language-autoit"><code class="language-autoit">  A<span class="token punctuation">:</span> <span class="token punctuation">[</span>b c d e f<span class="token punctuation">]</span>\n  B<span class="token punctuation">:</span> <span class="token punctuation">[</span>c b h f e<span class="token punctuation">]</span>\n      <span class="token operator">^</span>          <span class="token operator">/</span><span class="token operator">/</span> new_pos <span class="token operator">==</span> <span class="token number">0</span>\n  P<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">0</span> <span class="token punctuation">.</span> <span class="token number">4</span> <span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">.</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span>\n  LIS<span class="token punctuation">:</span>     <span class="token punctuation">[</span><span class="token number">1</span> <span class="token number">4</span><span class="token punctuation">]</span>\n          <span class="token operator">^</span>      <span class="token operator">/</span><span class="token operator">/</span> new_pos !<span class="token operator">=</span> undefined\n  moved <span class="token operator">=</span> <span class="token boolean">true</span>\n</code></pre>\n<p>移动节点 <code>c</code> ，移动到下一个节点 <code>b</code> 前面它。</p>\n<p>如果 <code>moved</code> 为 <code>false</code> 时，我们不需要查找LIS，我们只需遍历新子节点列表，并检查它在数组 <code>P</code> 中的位置，如果是 -1 ，则插入新节点。</p>\n<h4 id="%E5%85%B3%E4%BA%8E-kivi">关于 kivi<a class="anchor" href="#%E5%85%B3%E4%BA%8E-kivi">§</a></h4>\n<p>kivi 是作者对虚拟 DOM 性能提升的一些猜想，一开始它就向着性能出发，所有它在实现上代码可能并不优雅，而且它的 api 也十分不友好。而接下来的 snabbdom 就在 kivi 的基础上，大大提升了代码的可读性，很多讲述虚拟 DOM 的文章也将 snabbdom 作为案例。</p>\n<p>另外，kivi 的作者也创建了另一个 源码以及 api 更友好的仓库：<a href="https://github.com/localvoid/ivi">ivi</a>，感兴趣可以了解一下。</p>\n<h3 id="4%EF%B8%8F%E2%83%A3-snabbdom">4️⃣ <a href="https://github.com/snabbdom/snabbdom">snabbdom</a><a class="anchor" href="#4%EF%B8%8F%E2%83%A3-snabbdom">§</a></h3>\n<p>snabbdom 的优势就是代码的可读性大大提升，并且也引入了两端对比，diff 速度也不慢。</p>\n<p>我们可以简单看下 snabbdom 的两端对比算法的核心代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token doc-comment comment">/**\n * 子节点对比\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Element<span class="token punctuation">}</span></span> <span class="token parameter">parentElm</span>   父节点的真实DOM\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">oldCh</span> 旧的子节点\n * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">newCh</span> 新的子节点\n */</span>\n<span class="token keyword">function</span> <span class="token function">updateChildren</span><span class="token punctuation">(</span><span class="token parameter">parentElm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> newCh</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> oldStartIdx <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> newStartIdx <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">let</span> oldEndIdx <span class="token operator">=</span> oldCh<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>oldEndIdx<span class="token punctuation">]</span>\n  <span class="token keyword">let</span> newEndIdx <span class="token operator">=</span> newCh<span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">-</span> <span class="token number">1</span>\n  <span class="token keyword">let</span> newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n  <span class="token keyword">let</span> newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span>newEndIdx<span class="token punctuation">]</span>\n  <span class="token keyword">let</span> oldKeyToIdx\n  <span class="token keyword">let</span> idxInOld\n  <span class="token keyword">let</span> elmToMove\n  <span class="token keyword">let</span> before\n\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">&amp;&amp;</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 跳过两端不存在的旧节点</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldEndVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 跳过两端不存在的新节点</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newStartVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>newEndVnode <span class="token operator">==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">/* \n    ** 进行两端对比，分为四种状况：\n    ** 1. oldStart &lt;=>  newStart\n    ** 2. oldEnd   &lt;=>  newEnd\n    ** 3. oldStart &lt;=>  newEnd\n    ** 4. oldEnd   &lt;=>  newStart\n    */</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldStartVnode<span class="token punctuation">,</span> newEndVnode<span class="token punctuation">)</span>\n      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldEndVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">.</span><span class="token property-access">nextSibling</span><span class="token punctuation">)</span>\n      oldStartVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">++</span>oldStartIdx<span class="token punctuation">]</span>\n      newEndVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">--</span>newEndIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">sameVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// Vnode moved left</span>\n      <span class="token function">patchVnode</span><span class="token punctuation">(</span>oldEndVnode<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldEndVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n      oldEndVnode <span class="token operator">=</span> oldCh<span class="token punctuation">[</span><span class="token operator">--</span>oldEndIdx<span class="token punctuation">]</span>\n      newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n    <span class="token punctuation">}</span> \n    <span class="token comment">// 上面四种情况都不存在，通过 key 值查找对应 VDOM 进行对比</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 构造旧子节点的 map 表 (key => vdom)</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldKeyToIdx <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        oldKeyToIdx <span class="token operator">=</span> <span class="token function">createKeyToOldIdx</span><span class="token punctuation">(</span>oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      idxInOld <span class="token operator">=</span> oldKeyToIdx<span class="token punctuation">[</span>newStartVnode<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">]</span>\n      <span class="token comment">// 如果新的子节点在旧子节点不存在，进行插入操作</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>idxInOld <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> <span class="token function">render</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">)</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 如果新的子节点在旧子节点存在，进行对比</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        elmToMove <span class="token operator">=</span> oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>elmToMove<span class="token punctuation">.</span><span class="token property-access">sel</span> <span class="token operator">!==</span> newStartVnode<span class="token punctuation">.</span><span class="token property-access">sel</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// key 值相同，但是 tag 不同，重新生成节点并替换</span>\n          <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> <span class="token function">render</span><span class="token punctuation">(</span>newStartVnode<span class="token punctuation">)</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          <span class="token function">patchVnode</span><span class="token punctuation">(</span>elmToMove<span class="token punctuation">,</span> newStartVnode<span class="token punctuation">)</span>\n          oldCh<span class="token punctuation">[</span>idxInOld<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword nil">undefined</span> <span class="token comment">// 该位置已经对比，进行置空</span>\n          <span class="token function">insertBefore</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> elmToMove<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">,</span> oldStartVnode<span class="token punctuation">.</span><span class="token property-access">dom</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        newStartVnode <span class="token operator">=</span> newCh<span class="token punctuation">[</span><span class="token operator">++</span>newStartIdx<span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 处理一些未处理到的节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">&lt;=</span> oldEndIdx <span class="token operator">||</span> newStartIdx <span class="token operator">&lt;=</span> newEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldStartIdx <span class="token operator">></span> oldEndIdx<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      before <span class="token operator">=</span> newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword null nil">null</span> <span class="token operator">?</span> <span class="token keyword null nil">null</span> <span class="token operator">:</span> newCh<span class="token punctuation">[</span>newEndIdx <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">dom</span>\n      <span class="token function">addVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> before<span class="token punctuation">,</span> newCh<span class="token punctuation">,</span> newStartIdx<span class="token punctuation">,</span> newEndIdx<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token function">removeVnodes</span><span class="token punctuation">(</span>parentElm<span class="token punctuation">,</span> oldCh<span class="token punctuation">,</span> oldStartIdx<span class="token punctuation">,</span> oldEndIdx<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>关于 snabbdom ，网上有太多教程来分析它的 diff 过程了，不管是虚拟 DOM 的教程，还是 Vue 的源码分析，这里就不再详细讲述了。但是可以明显的看到，snabbdom 的 diff 算法是有 cito 和 kivi 的影子在的。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>毋庸置疑虚拟 DOM 带给前端的意义是非凡的，虚拟 DOM 在现如今还有更多新鲜的玩法。\n比如 <a href="https://github.com/Tencent/omi">omi</a> 将虚拟 DOM 与 Web Component 的结合，还有 <a href="https://github.com/NervJS/taro">Taro</a> 和 <a href="https://github.com/didi/chameleon">Chameleon</a> 带来的多端统一的能力。</p>\n<p>另外，文中相关的代码都可以在我的 <a href="https://github.com/Shenfq/magic-dom">github</a> 查看，这篇文章更多是对自己学习的一个记录，如果有什么错误的观点，欢迎进行指正。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%98%AF%E4%BB%80%E4%B9%88" }, "\u662F\u4EC0\u4E48\uFF1F")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%BB%8E-h-%E5%87%BD%E6%95%B0%E8%AF%B4%E8%B5%B7" }, "\u4ECE h \u51FD\u6570\u8BF4\u8D77"),
                React.createElement("ol", null)),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9F-dom" }, "\u6E32\u67D3\u865A\u62DF DOM")),
            React.createElement("li", null,
                React.createElement("a", { href: "#diff-%E7%AE%97%E6%B3%95" }, "diff \u7B97\u6CD5"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#diff-%E7%AE%97%E6%B3%95%E7%9A%84%E8%BF%9B%E5%8C%96" }, "diff \u7B97\u6CD5\u7684\u8FDB\u5316")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#1%EF%B8%8F%E2%83%A3-virtual-dom" }, "1\uFE0F\u20E3 virtual-dom"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#2%EF%B8%8F%E2%83%A3-citojs" }, "2\uFE0F\u20E3 cito.js")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#3%EF%B8%8F%E2%83%A3-kivijs" }, "3\uFE0F\u20E3 kivi.js"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#4%EF%B8%8F%E2%83%A3-snabbdom" }, "4\uFE0F\u20E3 snabbdom")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/06/18",
    'updated': null,
    'excerpt': "是什么？ 虚拟 DOM （Virtual DOM ）这个概念相信大家都不陌生，从 React 到 Vue ，虚拟 DOM 为这两个框架都带来了跨平台的能力（React-Native 和 Weex）。因为很多人是在学习 React 的过程中接触到的虚拟 DOM ，所以为先入为主...",
    'cover': "https://file.shenfq.com/FtpWFfOrYBe4E2sI3_MyVvWYYijx.png",
    'categories': [
        "前端"
    ],
    'tags': [
        "虚拟DOM"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2021/sudoku.md",
                "title": "用 JavaScript 做数独",
                "link": "posts/2021/sudoku.html",
                "date": "2021-09-05T13:05:11.000Z",
                "updated": null,
                "author": "Shenfq",
                "contributors": [
                    "Shenfq"
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
                "count": 27
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
                "count": 25
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
                "name": "JavaScript",
                "count": 10
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
                "name": "Node",
                "count": 7
            },
            {
                "name": "React",
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
                "name": "Koa",
                "count": 2
            },
            {
                "name": "Promise",
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
                "name": "fetch",
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
                "name": "npm",
                "count": 1
            },
            {
                "name": "offer",
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
                "name": "状态管理",
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
