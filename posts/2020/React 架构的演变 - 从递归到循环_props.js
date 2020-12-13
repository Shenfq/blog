import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig },
    'pagePath': "posts/2020/React 架构的演变 - 从递归到循环.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/React 架构的演变 - 从递归到循环.html",
    'title': "React 架构的演变 - 从递归到循环",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>React 架构的演变 - 从递归到循环</h1>\n<p>这篇文章是 React 架构演变的第二篇，上一篇主要介绍了更新机制从同步修改为异步，这一篇重点介绍 Fiber 架构下通过循环遍历更新的过程，之所以要使用循环遍历的方式，是因为递归更新过程一旦开始就不能暂停，只能不断向下，直到递归结束或者出现异常。</p>\n<h2 id="%E9%80%92%E5%BD%92%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">递归更新的实现<a class="anchor" href="#%E9%80%92%E5%BD%92%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">§</a></h2>\n<p>React 15 的递归更新逻辑是先将需要更新的组件放入脏组件队列（这里在上篇文章已经介绍过，没看过的可以先看看<a href="https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5/">《React 架构的演变 - 从同步到异步》</a>），然后取出组件进行一次递归，不停向下寻找子节点来查找是否需要更新。</p>\n<p>下面使用一段代码来简单描述一下这个过程：</p>\n<pre class="language-js"><code class="language-js"><span class="token function">updateComponent</span> <span class="token punctuation">(</span><span class="token parameter">prevElement<span class="token punctuation">,</span> nextElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n    <span class="token comment">// 如果组件的 type 和 key 都没有发生变化，进行更新</span>\n    prevElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> nextElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">&amp;&amp;</span>\n    prevElement<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> nextElement<span class="token punctuation">.</span><span class="token property-access">key</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 文本节点更新</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'text\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevElement<span class="token punctuation">.</span><span class="token property-access">value</span> <span class="token operator">!==</span> nextElement<span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceText</span><span class="token punctuation">(</span>nextElement<span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// DOM 节点的更新</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 先更新 DOM 属性</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateProps</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">,</span> nextElement<span class="token punctuation">)</span>\n      <span class="token comment">// 再更新 children</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateChildren</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">,</span> nextElement<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果组件的 type 和 key 发生变化，直接重新渲染组件</span>\n  <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 触发 unmount 生命周期</span>\n    <span class="token maybe-class-name">ReactReconciler</span><span class="token punctuation">.</span><span class="token method function property-access">unmountComponent</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">)</span>\n    <span class="token comment">// 渲染新的组件</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">_instantiateReactComponent</span><span class="token punctuation">(</span>nextElement<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token function">updateChildren</span> <span class="token punctuation">(</span><span class="token parameter">prevElement<span class="token punctuation">,</span> nextElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> prevChildren <span class="token operator">=</span> prevElement<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">var</span> nextChildren <span class="token operator">=</span> nextElement<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token comment">// 省略通过 key 重新排序的 diff 过程</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevChildren <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span> <span class="token comment">// 渲染新的子节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>nextChildren <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span> <span class="token comment">// 清空所有子节点</span>\n  <span class="token comment">// 子节点对比</span>\n  prevChildren<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">prevChild<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> nextChild <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n    <span class="token comment">// 递归过程</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateComponent</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>为了更清晰的看到这个过程，我们还是写一个简单的Demo，构造一个 3 * 3 的 Table 组件。</p>\n<p><img src="https://file.shenfq.com/pic/20200926153531.png" alt="Table"></p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token comment">// <a class="token url-link" href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a></span>\n<span class="token keyword">class</span> <span class="token class-name">Col</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 渲染之前暂停 8ms，给 render 制造一点点压力</span>\n    <span class="token keyword">const</span> start <span class="token operator">=</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start <span class="token operator">&lt;</span> <span class="token number">8</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    val<span class="token operator">:</span> <span class="token number">0</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> val <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token comment">// 构造一个 3 * 3 表格</span>\n    <span class="token keyword">const</span> rows <span class="token operator">=</span> array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> row</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>row<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span>array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n          <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> col</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Col</span></span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>col<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token punctuation">{</span>val<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Col</span></span><span class="token punctuation">></span></span>\n        <span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>table<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tbody</span><span class="token punctuation">></span></span><span class="token punctuation">{</span>rows<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tbody</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>然后每秒对 Table 里面的值更新一次，让 val 每次 + 1，从 0 ~ 9 不停循环。</p>\n<p><img src="https://file.shenfq.com/pic/20200926153958.gif" alt="Table Loop"></p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token comment">// <a class="token url-link" href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a></span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">tick</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> next <span class="token operator">&lt;</span> <span class="token number">10</span> <span class="token operator">?</span> next <span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>完整代码的线上地址： <a href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a>。Demo 组件每次调用 setState，React 会先判断该组件的类型有没有发生修改，如果有就整个组件进行重新渲染，如果没有会更新 state，然后向下判断 table 组件，table 组件继续向下判断 tr 组件，tr 组件再向下判断 td 组件，最后发现 td 组件下的文本节点发生了修改，通过 DOM API 更新。</p>\n<p><img src="https://file.shenfq.com/pic/20200926154214.gif" alt="Update"></p>\n<p>通过 Performance 的函数调用堆栈也能清晰的看到这个过程，updateComponent 之后 的 updateChildren 会继续调用子组件的 updateComponent，直到递归完所有组件，表示更新完成。</p>\n<p><img src="https://file.shenfq.com/pic/20200926161103.png" alt="调用堆栈"></p>\n<p>递归的缺点很明显，不能暂停更新，一旦开始必须从头到尾，这与 React 16 拆分时间片，给浏览器喘口气的理念明显不符，所以 React 必须要切换架构，将虚拟 DOM 从树形结构修改为链表结构。</p>\n<h2 id="%E5%8F%AF%E5%BE%AA%E7%8E%AF%E7%9A%84-fiber">可循环的 Fiber<a class="anchor" href="#%E5%8F%AF%E5%BE%AA%E7%8E%AF%E7%9A%84-fiber">§</a></h2>\n<p>这里说的链表结构就是 Fiber 了，链表结构最大的优势就是可以通过循环的方式来遍历，只要记住当前遍历的位置，即使中断后也能快速还原，重新开始遍历。</p>\n<p>我们先看看一个 Fiber 节点的数据结构：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">FiberNode</span></span> <span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 节点 key，主要用于了优化列表 diff</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">=</span> key\n  <span class="token comment">// 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">=</span> tag\n\n  <span class="token comment">// 子节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 父节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token keyword control-flow">return</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span> \n  <span class="token comment">// 兄弟节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">sibling</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 更新队列，用于暂存 setState 的值</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 节点更新过期时间，用于时间分片</span>\n  <span class="token comment">// react 17 改为：lanes、childLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">childExpirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n\n  <span class="token comment">// 对应到页面的真实 DOM 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>下面举个例子，我们这里有一段普通的 HTML 文本：</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>table<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>在之前的 React 版本中，jsx 会转化为 createElement 方法，创建树形结构的虚拟 DOM。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token maybe-class-name">VDOMRoot</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'table\'</span><span class="token punctuation">,</span>\n  props<span class="token operator">:</span> <span class="token punctuation">{</span> className<span class="token operator">:</span> <span class="token string">\'table\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  children<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>Fiber 架构下，结构如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 有所简化，并非与 React 真实的 Fiber 结构一致</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">FiberRoot</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'table\'</span><span class="token punctuation">,</span>\n  <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n  sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n  child<span class="token operator">:</span> <span class="token punctuation">{</span>\n    type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n    <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// table 的 FiberNode</span>\n    sibling<span class="token operator">:</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// table 的 FiberNode</span>\n      sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      child<span class="token operator">:</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n        <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n        sibling<span class="token operator">:</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n          sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n          child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n          text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n        text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    child<span class="token operator">:</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n      <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n      sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20200929103938.png" alt="Fiber"></p>\n<h2 id="%E5%BE%AA%E7%8E%AF%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">循环更新的实现<a class="anchor" href="#%E5%BE%AA%E7%8E%AF%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">§</a></h2>\n<p>那么，在 setState 的时候，React 是如何进行一次 Fiber 的遍历的呢？</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">let</span> workInProgress <span class="token operator">=</span> <span class="token maybe-class-name">FiberRoot</span>\n\n<span class="token comment">// 遍历 Fiber 节点，如果时间片时间用完就停止遍历</span>\n<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>\n    workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span>\n    <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 用于判断当前时间片是否到期</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span> <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// child 存在</span>\n    <span class="token comment">// 重置 workInProgress 为 child</span>\n    workInProgress <span class="token operator">=</span> next\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// child 不存在</span>\n    <span class="token comment">// 向上回溯节点</span>\n    <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 收集副作用，主要是用于标记节点是否需要操作 DOM</span>\n      <span class="token function">completeWork</span><span class="token punctuation">(</span>completedWork<span class="token punctuation">)</span>\n\n      <span class="token comment">// 获取 Fiber.sibling</span>\n      <span class="token keyword">let</span> siblingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">sibling</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>siblingFiber<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// sibling 存在，则跳出 complete 流程，继续 beginWork</span>\n        workInProgress <span class="token operator">=</span> siblingFiber\n        <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      completedWork <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n      workInProgress <span class="token operator">=</span> completedWork\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 render 方法，创建子 Fiber，进行 diff</span>\n  <span class="token comment">// 操作完毕后，返回当前 Fiber 的 child</span>\n  <span class="token keyword control-flow">return</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 收集节点副作用</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>Fiber 的遍历本质上就是一个循环，全局有一个 <code>workInProgress</code> 变量，用来存储当前正在 diff 的节点，先通过 <code>beginWork</code> 方法对当前节点然后进行 diff 操作（diff 之前会调用 render，重新计算 state、prop），并返回当前节点的第一个子节点( <code>fiber.child</code>)作为新的工作节点，直到不存在子节点。然后，对当前节点调用 <code>completedWork</code> 方法，存储 <code>beginWork</code> 过程中产生的副作用，如果当前节点存在兄弟节点( <code>fiber.sibling</code>)，则将工作节点修改为兄弟节点，重新进入 <code>beginWork</code> 流程。直到  <code>completedWork</code> 重新返回到根节点，执行 <code>commitRoot</code> 将所有的副作用反应到真实 DOM 中。</p>\n<p><img src="https://file.shenfq.com/pic/20200929115604.gif" alt="Fiber work loop"></p>\n<p>在一次遍历过程中，每个节点都会经历 <code>beginWork</code>、<code>completeWork</code> ，直到返回到根节点，最后通过 <code>commitRoot</code> 将所有的更新提交，关于这部分的内容可以看：<a href="https://react.iamkasong.com/process/reconciler.html">《React 技术揭秘》</a>。</p>\n<h2 id="%E6%97%B6%E9%97%B4%E5%88%86%E7%89%87%E7%9A%84%E7%A7%98%E5%AF%86">时间分片的秘密<a class="anchor" href="#%E6%97%B6%E9%97%B4%E5%88%86%E7%89%87%E7%9A%84%E7%A7%98%E5%AF%86">§</a></h2>\n<p>前面说过，Fiber 结构的遍历是支持中断恢复，为了观察这个过程，我们将之前的 3 * 3 的 Table 组件改成 Concurrent 模式，线上地址：<a href="https://codesandbox.io/embed/react-async-demo-h1lbz">https://codesandbox.io/embed/react-async-demo-h1lbz</a>。由于每次调用 Col 组件的 render 部分需要耗时 8ms，会超出了一个时间片，所以每个 td 部分都会暂停一次。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Col</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 渲染之前暂停 8ms，给 render 制造一点点压力</span>\n    <span class="token keyword">const</span> start <span class="token operator">=</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start <span class="token operator">&lt;</span> <span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>td<span class="token operator">></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>td<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在这个 3 * 3 组件里，一共有 9 个 Col 组件，所以会有 9 次耗时任务，分散在 9 个时间片进行，通过 Performance 的调用栈可以看到具体情况：</p>\n<p><img src="https://file.shenfq.com/pic/20200929143815.png" alt="异步模式的调用栈"></p>\n<p>在非 Concurrent 模式下，Fiber 节点的遍历是一次性进行的，并不会切分多个时间片，差别就是在遍历的时候调用了 <code>workLoopSync</code> 方法，该方法并不会判断时间片是否用完。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 遍历 Fiber 节点</span>\n<span class="token keyword">function</span> <span class="token function">workLoopSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20200929153752.png" alt="同步模式的调用栈"></p>\n<p>通过上面的分析可以看出， <code>shouldYield</code> 方法决定了当前时间片是否已经用完，这也是决定 React 是同步渲染还是异步渲染的关键。如果去除任务优先级的概念，<code>shouldYield</code> 方法可以说很简单，就是判断了当前的时间，是否已经超过了预设的 <code>deadline</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取当前时间</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> currentTime <span class="token operator">>=</span> deadline\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>deadline</code> 又是如何得的呢？可以回顾上一篇文章（<a href="https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5/">《React 架构的演变 - 从同步到异步》</a>）提到的 ChannelMessage，更新开始的时候会通过 <code>requestHostCallback</code>（即：<code>port2.send</code>）发送异步消息，在 <code>performWorkUntilDeadline</code> （即：<code>port1.onmessage</code>）中接收消息。<code>performWorkUntilDeadline</code> 每次接收到消息时，表示已经进入了下一个任务队列，这个时候就会更新 <code>deadline</code>。</p>\n<p><img src="https://file.shenfq.com/pic/20200927105705.png" alt="异步调用栈"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> port <span class="token operator">=</span> channel<span class="token punctuation">.</span><span class="token property-access">port2</span>\nchannel<span class="token punctuation">.</span><span class="token property-access">port1</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">performWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>scheduledHostCallback <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token comment">// 重置超时时间 </span>\n    deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval\n    \n    <span class="token keyword">var</span> hasTimeRemaining <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token keyword">var</span> hasMoreWork <span class="token operator">=</span> <span class="token function">scheduledHostCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 已经没有任务了，修改状态 </span>\n      isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 还有任务，放到下个任务队列执行，给浏览器喘息的机会 </span>\n      port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span> <span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token function-variable function">requestHostCallback</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">//callback 挂载到 scheduledHostCallback</span>\n  scheduledHostCallback <span class="token operator">=</span> callback\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMessageLoopRunning<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token comment">// 推送消息，下个队列队列调用 callback</span>\n    port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span> <span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>超时时间的设置就是在当前时间的基础上加上了一个 <code>yieldInterval</code>， 这个 <code>yieldInterval</code> 的值，默认是 5ms。</p>\n<pre class="language-js"><code class="language-js">deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval\n</code></pre>\n<p>同时 React 也提供了修改 <code>yieldInterval</code> 的手段，通过手动指定 fps，来确定一帧的具体时间（单位：ms），fps 越高，一个时间分片的时间就越短，对设备的性能要求就越高。</p>\n<pre class="language-js"><code class="language-js"><span class="token function-variable function">forceFrameRate</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">fps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fps <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">||</span> fps <span class="token operator">></span> <span class="token number">125</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 帧率仅支持 0~125</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fps <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 一般 60 fps 的设备</span>\n    <span class="token comment">// 一个时间分片的时间为 Math.floor(1000/60) = 16</span>\n    yieldInterval <span class="token operator">=</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">floor</span><span class="token punctuation">(</span><span class="token number">1000</span> <span class="token operator">/</span> fps<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// reset the framerate</span>\n    yieldInterval <span class="token operator">=</span> <span class="token number">5</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>下面我们将异步逻辑、循环更新、时间分片串联起来。先回顾一下之前的文章讲过，Concurrent 模式下，setState 后的调用顺序：</p>\n<pre class="language-js"><code class="language-js"><span class="token maybe-class-name">Component</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">scheduleUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">performConcurrentWorkOnRoot</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">performWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><code>scheduleCallback</code> 方法会将传入的回调（<code>performConcurrentWorkOnRoot</code>）组装成一个任务放入 <code>taskQueue</code> 中，然后调用 <code>requestHostCallback</code> 发送一个消息，进入异步任务。<code>performWorkUntilDeadline</code> 接收到异步消息，从  <code>taskQueue</code>  取出任务开始执行，这里的任务就是之前传入的  <code>performConcurrentWorkOnRoot</code> 方法，这个方法最后会调用<code>workLoopConcurrent</code>（<code>workLoopConcurrent</code> 前面已经介绍过了，这个不再重复）。如果 <code>workLoopConcurrent</code> 是由于超时中断的，<code>hasMoreWork</code> 返回为 true，通过 <code>postMessage</code> 发送消息，将操作延迟到下一个任务队列。</p>\n<p><img src="https://file.shenfq.com/pic/20200929195346.png" alt="流程图"></p>\n<p>到这里整个流程已经结束，希望大家看完文章能有所收获，下一篇文章会介绍 Fiber 架构下 Hooks 的实现。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "React \u67B6\u6784\u7684\u6F14\u53D8 - \u4ECE\u9012\u5F52\u5230\u5FAA\u73AF"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>这篇文章是 React 架构演变的第二篇，上一篇主要介绍了更新机制从同步修改为异步，这一篇重点介绍 Fiber 架构下通过循环遍历更新的过程，之所以要使用循环遍历的方式，是因为递归更新过程一旦开始就不能暂停，只能不断向下，直到递归结束或者出现异常。</p>\n<h2 id="%E9%80%92%E5%BD%92%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">递归更新的实现<a class="anchor" href="#%E9%80%92%E5%BD%92%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">§</a></h2>\n<p>React 15 的递归更新逻辑是先将需要更新的组件放入脏组件队列（这里在上篇文章已经介绍过，没看过的可以先看看<a href="https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5/">《React 架构的演变 - 从同步到异步》</a>），然后取出组件进行一次递归，不停向下寻找子节点来查找是否需要更新。</p>\n<p>下面使用一段代码来简单描述一下这个过程：</p>\n<pre class="language-js"><code class="language-js"><span class="token function">updateComponent</span> <span class="token punctuation">(</span><span class="token parameter">prevElement<span class="token punctuation">,</span> nextElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n    <span class="token comment">// 如果组件的 type 和 key 都没有发生变化，进行更新</span>\n    prevElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> nextElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">&amp;&amp;</span>\n    prevElement<span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">===</span> nextElement<span class="token punctuation">.</span><span class="token property-access">key</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 文本节点更新</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevElement<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'text\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevElement<span class="token punctuation">.</span><span class="token property-access">value</span> <span class="token operator">!==</span> nextElement<span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">replaceText</span><span class="token punctuation">(</span>nextElement<span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// DOM 节点的更新</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 先更新 DOM 属性</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateProps</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">,</span> nextElement<span class="token punctuation">)</span>\n      <span class="token comment">// 再更新 children</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateChildren</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">,</span> nextElement<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果组件的 type 和 key 发生变化，直接重新渲染组件</span>\n  <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 触发 unmount 生命周期</span>\n    <span class="token maybe-class-name">ReactReconciler</span><span class="token punctuation">.</span><span class="token method function property-access">unmountComponent</span><span class="token punctuation">(</span>prevElement<span class="token punctuation">)</span>\n    <span class="token comment">// 渲染新的组件</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">_instantiateReactComponent</span><span class="token punctuation">(</span>nextElement<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token function">updateChildren</span> <span class="token punctuation">(</span><span class="token parameter">prevElement<span class="token punctuation">,</span> nextElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> prevChildren <span class="token operator">=</span> prevElement<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token keyword">var</span> nextChildren <span class="token operator">=</span> nextElement<span class="token punctuation">.</span><span class="token property-access">children</span>\n  <span class="token comment">// 省略通过 key 重新排序的 diff 过程</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prevChildren <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span> <span class="token comment">// 渲染新的子节点</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>nextChildren <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span> <span class="token comment">// 清空所有子节点</span>\n  <span class="token comment">// 子节点对比</span>\n  prevChildren<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">prevChild<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> nextChild <span class="token operator">=</span> nextChildren<span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n    <span class="token comment">// 递归过程</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">updateComponent</span><span class="token punctuation">(</span>prevChild<span class="token punctuation">,</span> nextChild<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>为了更清晰的看到这个过程，我们还是写一个简单的Demo，构造一个 3 * 3 的 Table 组件。</p>\n<p><img src="https://file.shenfq.com/pic/20200926153531.png" alt="Table"></p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token comment">// <a class="token url-link" href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a></span>\n<span class="token keyword">class</span> <span class="token class-name">Col</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 渲染之前暂停 8ms，给 render 制造一点点压力</span>\n    <span class="token keyword">const</span> start <span class="token operator">=</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start <span class="token operator">&lt;</span> <span class="token number">8</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span>\n    val<span class="token operator">:</span> <span class="token number">0</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> val <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token comment">// 构造一个 3 * 3 表格</span>\n    <span class="token keyword">const</span> rows <span class="token operator">=</span> array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> row</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>row<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span>array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n          <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> col</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Col</span></span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>col<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token punctuation">{</span>val<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Col</span></span><span class="token punctuation">></span></span>\n        <span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>table<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tbody</span><span class="token punctuation">></span></span><span class="token punctuation">{</span>rows<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tbody</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>然后每秒对 Table 里面的值更新一次，让 val 每次 + 1，从 0 ~ 9 不停循环。</p>\n<p><img src="https://file.shenfq.com/pic/20200926153958.gif" alt="Table Loop"></p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token comment">// <a class="token url-link" href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a></span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">tick</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> next <span class="token operator">&lt;</span> <span class="token number">10</span> <span class="token operator">?</span> next <span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>完整代码的线上地址： <a href="https://codesandbox.io/embed/react-sync-demo-nlijf">https://codesandbox.io/embed/react-sync-demo-nlijf</a>。Demo 组件每次调用 setState，React 会先判断该组件的类型有没有发生修改，如果有就整个组件进行重新渲染，如果没有会更新 state，然后向下判断 table 组件，table 组件继续向下判断 tr 组件，tr 组件再向下判断 td 组件，最后发现 td 组件下的文本节点发生了修改，通过 DOM API 更新。</p>\n<p><img src="https://file.shenfq.com/pic/20200926154214.gif" alt="Update"></p>\n<p>通过 Performance 的函数调用堆栈也能清晰的看到这个过程，updateComponent 之后 的 updateChildren 会继续调用子组件的 updateComponent，直到递归完所有组件，表示更新完成。</p>\n<p><img src="https://file.shenfq.com/pic/20200926161103.png" alt="调用堆栈"></p>\n<p>递归的缺点很明显，不能暂停更新，一旦开始必须从头到尾，这与 React 16 拆分时间片，给浏览器喘口气的理念明显不符，所以 React 必须要切换架构，将虚拟 DOM 从树形结构修改为链表结构。</p>\n<h2 id="%E5%8F%AF%E5%BE%AA%E7%8E%AF%E7%9A%84-fiber">可循环的 Fiber<a class="anchor" href="#%E5%8F%AF%E5%BE%AA%E7%8E%AF%E7%9A%84-fiber">§</a></h2>\n<p>这里说的链表结构就是 Fiber 了，链表结构最大的优势就是可以通过循环的方式来遍历，只要记住当前遍历的位置，即使中断后也能快速还原，重新开始遍历。</p>\n<p>我们先看看一个 Fiber 节点的数据结构：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">FiberNode</span></span> <span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 节点 key，主要用于了优化列表 diff</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">=</span> key\n  <span class="token comment">// 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">=</span> tag\n\n  <span class="token comment">// 子节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 父节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token keyword control-flow">return</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span> \n  <span class="token comment">// 兄弟节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">sibling</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 更新队列，用于暂存 setState 的值</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 节点更新过期时间，用于时间分片</span>\n  <span class="token comment">// react 17 改为：lanes、childLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">childExpirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n\n  <span class="token comment">// 对应到页面的真实 DOM 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>下面举个例子，我们这里有一段普通的 HTML 文本：</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>table<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>在之前的 React 版本中，jsx 会转化为 createElement 方法，创建树形结构的虚拟 DOM。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token maybe-class-name">VDOMRoot</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'table\'</span><span class="token punctuation">,</span>\n  props<span class="token operator">:</span> <span class="token punctuation">{</span> className<span class="token operator">:</span> <span class="token string">\'table\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  children<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      children<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          props<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n          children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token operator">:</span> <span class="token string">\'text\'</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">\'1\'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>Fiber 架构下，结构如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 有所简化，并非与 React 真实的 Fiber 结构一致</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">FiberRoot</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'table\'</span><span class="token punctuation">,</span>\n  <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n  sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n  child<span class="token operator">:</span> <span class="token punctuation">{</span>\n    type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n    <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// table 的 FiberNode</span>\n    sibling<span class="token operator">:</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'tr\'</span><span class="token punctuation">,</span>\n      <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// table 的 FiberNode</span>\n      sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      child<span class="token operator">:</span> <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n        <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n        sibling<span class="token operator">:</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n          <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n          sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n          child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n          text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n        text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    child<span class="token operator">:</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">\'td\'</span><span class="token punctuation">,</span>\n      <span class="token keyword control-flow">return</span><span class="token operator">:</span> <span class="token maybe-class-name">FiberNode</span><span class="token punctuation">,</span> <span class="token comment">// tr 的 FiberNode</span>\n      sibling<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      child<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n      text<span class="token operator">:</span> <span class="token string">\'1\'</span> <span class="token comment">// 子节点仅有文本节点</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20200929103938.png" alt="Fiber"></p>\n<h2 id="%E5%BE%AA%E7%8E%AF%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">循环更新的实现<a class="anchor" href="#%E5%BE%AA%E7%8E%AF%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">§</a></h2>\n<p>那么，在 setState 的时候，React 是如何进行一次 Fiber 的遍历的呢？</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">let</span> workInProgress <span class="token operator">=</span> <span class="token maybe-class-name">FiberRoot</span>\n\n<span class="token comment">// 遍历 Fiber 节点，如果时间片时间用完就停止遍历</span>\n<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>\n    workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span>\n    <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 用于判断当前时间片是否到期</span>\n  <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span> <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// child 存在</span>\n    <span class="token comment">// 重置 workInProgress 为 child</span>\n    workInProgress <span class="token operator">=</span> next\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// child 不存在</span>\n    <span class="token comment">// 向上回溯节点</span>\n    <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 收集副作用，主要是用于标记节点是否需要操作 DOM</span>\n      <span class="token function">completeWork</span><span class="token punctuation">(</span>completedWork<span class="token punctuation">)</span>\n\n      <span class="token comment">// 获取 Fiber.sibling</span>\n      <span class="token keyword">let</span> siblingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">sibling</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>siblingFiber<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// sibling 存在，则跳出 complete 流程，继续 beginWork</span>\n        workInProgress <span class="token operator">=</span> siblingFiber\n        <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      completedWork <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n      workInProgress <span class="token operator">=</span> completedWork\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 render 方法，创建子 Fiber，进行 diff</span>\n  <span class="token comment">// 操作完毕后，返回当前 Fiber 的 child</span>\n  <span class="token keyword control-flow">return</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 收集节点副作用</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>Fiber 的遍历本质上就是一个循环，全局有一个 <code>workInProgress</code> 变量，用来存储当前正在 diff 的节点，先通过 <code>beginWork</code> 方法对当前节点然后进行 diff 操作（diff 之前会调用 render，重新计算 state、prop），并返回当前节点的第一个子节点( <code>fiber.child</code>)作为新的工作节点，直到不存在子节点。然后，对当前节点调用 <code>completedWork</code> 方法，存储 <code>beginWork</code> 过程中产生的副作用，如果当前节点存在兄弟节点( <code>fiber.sibling</code>)，则将工作节点修改为兄弟节点，重新进入 <code>beginWork</code> 流程。直到  <code>completedWork</code> 重新返回到根节点，执行 <code>commitRoot</code> 将所有的副作用反应到真实 DOM 中。</p>\n<p><img src="https://file.shenfq.com/pic/20200929115604.gif" alt="Fiber work loop"></p>\n<p>在一次遍历过程中，每个节点都会经历 <code>beginWork</code>、<code>completeWork</code> ，直到返回到根节点，最后通过 <code>commitRoot</code> 将所有的更新提交，关于这部分的内容可以看：<a href="https://react.iamkasong.com/process/reconciler.html">《React 技术揭秘》</a>。</p>\n<h2 id="%E6%97%B6%E9%97%B4%E5%88%86%E7%89%87%E7%9A%84%E7%A7%98%E5%AF%86">时间分片的秘密<a class="anchor" href="#%E6%97%B6%E9%97%B4%E5%88%86%E7%89%87%E7%9A%84%E7%A7%98%E5%AF%86">§</a></h2>\n<p>前面说过，Fiber 结构的遍历是支持中断恢复，为了观察这个过程，我们将之前的 3 * 3 的 Table 组件改成 Concurrent 模式，线上地址：<a href="https://codesandbox.io/embed/react-async-demo-h1lbz">https://codesandbox.io/embed/react-async-demo-h1lbz</a>。由于每次调用 Col 组件的 render 部分需要耗时 8ms，会超出了一个时间片，所以每个 td 部分都会暂停一次。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Col</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 渲染之前暂停 8ms，给 render 制造一点点压力</span>\n    <span class="token keyword">const</span> start <span class="token operator">=</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start <span class="token operator">&lt;</span> <span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>td<span class="token operator">></span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">.</span><span class="token property-access">children</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>td<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在这个 3 * 3 组件里，一共有 9 个 Col 组件，所以会有 9 次耗时任务，分散在 9 个时间片进行，通过 Performance 的调用栈可以看到具体情况：</p>\n<p><img src="https://file.shenfq.com/pic/20200929143815.png" alt="异步模式的调用栈"></p>\n<p>在非 Concurrent 模式下，Fiber 节点的遍历是一次性进行的，并不会切分多个时间片，差别就是在遍历的时候调用了 <code>workLoopSync</code> 方法，该方法并不会判断时间片是否用完。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 遍历 Fiber 节点</span>\n<span class="token keyword">function</span> <span class="token function">workLoopSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20200929153752.png" alt="同步模式的调用栈"></p>\n<p>通过上面的分析可以看出， <code>shouldYield</code> 方法决定了当前时间片是否已经用完，这也是决定 React 是同步渲染还是异步渲染的关键。如果去除任务优先级的概念，<code>shouldYield</code> 方法可以说很简单，就是判断了当前的时间，是否已经超过了预设的 <code>deadline</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token dom variable">performance</span><span class="token punctuation">.</span><span class="token method function property-access">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取当前时间</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> currentTime <span class="token operator">>=</span> deadline\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>deadline</code> 又是如何得的呢？可以回顾上一篇文章（<a href="https://blog.shenfq.com/2020/react-%E6%9E%B6%E6%9E%84%E7%9A%84%E6%BC%94%E5%8F%98-%E4%BB%8E%E5%90%8C%E6%AD%A5%E5%88%B0%E5%BC%82%E6%AD%A5/">《React 架构的演变 - 从同步到异步》</a>）提到的 ChannelMessage，更新开始的时候会通过 <code>requestHostCallback</code>（即：<code>port2.send</code>）发送异步消息，在 <code>performWorkUntilDeadline</code> （即：<code>port1.onmessage</code>）中接收消息。<code>performWorkUntilDeadline</code> 每次接收到消息时，表示已经进入了下一个任务队列，这个时候就会更新 <code>deadline</code>。</p>\n<p><img src="https://file.shenfq.com/pic/20200927105705.png" alt="异步调用栈"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> port <span class="token operator">=</span> channel<span class="token punctuation">.</span><span class="token property-access">port2</span>\nchannel<span class="token punctuation">.</span><span class="token property-access">port1</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">performWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>scheduledHostCallback <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token comment">// 重置超时时间 </span>\n    deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval\n    \n    <span class="token keyword">var</span> hasTimeRemaining <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token keyword">var</span> hasMoreWork <span class="token operator">=</span> <span class="token function">scheduledHostCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 已经没有任务了，修改状态 </span>\n      isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 还有任务，放到下个任务队列执行，给浏览器喘息的机会 </span>\n      port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span> <span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token function-variable function">requestHostCallback</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">//callback 挂载到 scheduledHostCallback</span>\n  scheduledHostCallback <span class="token operator">=</span> callback\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMessageLoopRunning<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token comment">// 推送消息，下个队列队列调用 callback</span>\n    port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span> <span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>超时时间的设置就是在当前时间的基础上加上了一个 <code>yieldInterval</code>， 这个 <code>yieldInterval</code> 的值，默认是 5ms。</p>\n<pre class="language-js"><code class="language-js">deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval\n</code></pre>\n<p>同时 React 也提供了修改 <code>yieldInterval</code> 的手段，通过手动指定 fps，来确定一帧的具体时间（单位：ms），fps 越高，一个时间分片的时间就越短，对设备的性能要求就越高。</p>\n<pre class="language-js"><code class="language-js"><span class="token function-variable function">forceFrameRate</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">fps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fps <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">||</span> fps <span class="token operator">></span> <span class="token number">125</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 帧率仅支持 0~125</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>fps <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 一般 60 fps 的设备</span>\n    <span class="token comment">// 一个时间分片的时间为 Math.floor(1000/60) = 16</span>\n    yieldInterval <span class="token operator">=</span> <span class="token known-class-name class-name">Math</span><span class="token punctuation">.</span><span class="token method function property-access">floor</span><span class="token punctuation">(</span><span class="token number">1000</span> <span class="token operator">/</span> fps<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// reset the framerate</span>\n    yieldInterval <span class="token operator">=</span> <span class="token number">5</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>下面我们将异步逻辑、循环更新、时间分片串联起来。先回顾一下之前的文章讲过，Concurrent 模式下，setState 后的调用顺序：</p>\n<pre class="language-js"><code class="language-js"><span class="token maybe-class-name">Component</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">scheduleUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">performConcurrentWorkOnRoot</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token arrow operator">=></span> <span class="token function">performWorkUntilDeadline</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><code>scheduleCallback</code> 方法会将传入的回调（<code>performConcurrentWorkOnRoot</code>）组装成一个任务放入 <code>taskQueue</code> 中，然后调用 <code>requestHostCallback</code> 发送一个消息，进入异步任务。<code>performWorkUntilDeadline</code> 接收到异步消息，从  <code>taskQueue</code>  取出任务开始执行，这里的任务就是之前传入的  <code>performConcurrentWorkOnRoot</code> 方法，这个方法最后会调用<code>workLoopConcurrent</code>（<code>workLoopConcurrent</code> 前面已经介绍过了，这个不再重复）。如果 <code>workLoopConcurrent</code> 是由于超时中断的，<code>hasMoreWork</code> 返回为 true，通过 <code>postMessage</code> 发送消息，将操作延迟到下一个任务队列。</p>\n<p><img src="https://file.shenfq.com/pic/20200929195346.png" alt="流程图"></p>\n<p>到这里整个流程已经结束，希望大家看完文章能有所收获，下一篇文章会介绍 Fiber 架构下 Hooks 的实现。</p>'
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#%E9%80%92%E5%BD%92%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">递归更新的实现</a></li><li><a href="#%E5%8F%AF%E5%BE%AA%E7%8E%AF%E7%9A%84-fiber">可循环的 Fiber</a></li><li><a href="#%E5%BE%AA%E7%8E%AF%E6%9B%B4%E6%96%B0%E7%9A%84%E5%AE%9E%E7%8E%B0">循环更新的实现</a></li><li><a href="#%E6%97%B6%E9%97%B4%E5%88%86%E7%89%87%E7%9A%84%E7%A7%98%E5%AF%86">时间分片的秘密</a></li><li><a href="#%E6%80%BB%E7%BB%93">总结</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/09/29",
    'updated': null,
    'excerpt': "这篇文章是 React 架构演变的第二篇，上一篇主要介绍了更新机制从同步修改为异步，这一篇重点介绍 Fiber 架构下通过循环遍历更新的过程，之所以要使用循环遍历的方式，是因为递归更新过程一旦开始就不能暂停，只能不断向下，直...",
    'cover': "https://file.shenfq.com/pic/20200926153531.png",
    'categories': [
        "前端"
    ],
    'tags': [
        "前端框架",
        "JavaScript",
        "React"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2020/如何让 Node.js 服务性能翻倍？.md",
                "title": "如何让 Node.js 服务性能翻倍？",
                "link": "posts/2020/如何让 Node.js 服务性能翻倍？.html",
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
                "count": 18
            },
            {
                "name": "Node.js",
                "count": 7
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
                "name": "随便写写",
                "count": 1
            }
        ],
        "tags": [
            {
                "name": "前端",
                "count": 23
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
                "name": "Vue.js",
                "count": 7
            },
            {
                "name": "Node",
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
                "name": "工作",
                "count": 4
            },
            {
                "name": "总结",
                "count": 4
            },
            {
                "name": "感悟",
                "count": 4
            },
            {
                "name": "机器学习",
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
                "name": "微信小程序",
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
                "name": "组件化",
                "count": 2
            },
            {
                "name": "编译",
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
                "name": "router",
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
                "name": "工程化",
                "count": 1
            },
            {
                "name": "性能",
                "count": 1
            },
            {
                "name": "推荐系统",
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
            },
            {
                "name": "路由",
                "count": 1
            }
        ]
    }
};
