import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/React 架构的演变 - 更新机制.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/React 架构的演变 - 更新机制.html",
    'title': "React 架构的演变 - 更新机制",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>React 架构的演变 - 更新机制</h1>\n<p>前面的文章分析了 Concurrent 模式下异步更新的逻辑，以及 Fiber 架构是如何进行时间分片的，更新过程中的很多内容都省略了，评论区也收到了一些同学对更新过程的疑惑，今天的文章就来讲解下 React Fiber 架构的更新机制。</p>\n<h2 id="fiber-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84">Fiber 数据结构<a class="anchor" href="#fiber-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84">§</a></h2>\n<p>我们先回顾一下 Fiber 节点的数据结构（之前文章省略了一部分属性，所以和之前文章略有不同）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">FiberNode</span></span> <span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 节点 key，主要用于了优化列表 diff</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">=</span> key\n  <span class="token comment">// 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">=</span> tag\n\n  <span class="token comment">// 子节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 父节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token keyword control-flow">return</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span> \n  <span class="token comment">// 兄弟节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">sibling</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 更新队列，用于暂存 setState 的值</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 新传入的 props</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>\n  <span class="token comment">// 之前的 props</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">memoizedProps</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n  <span class="token comment">// 之前的 state</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">memoizedState</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 节点更新过期时间，用于时间分片</span>\n  <span class="token comment">// react 17 改为：lanes、childLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">childExpirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n\n  <span class="token comment">// 对应到页面的真实 DOM 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n\n  <span class="token comment">// 副作用相关，用于标记节点是否需要更新</span>\n  <span class="token comment">// 以及更新的类型：替换成新节点、更新属性、更新文本、删除……</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoEffect</span>\n  <span class="token comment">// 指向下一个需要更新的节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6">缓存机制<a class="anchor" href="#%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6">§</a></h2>\n<p>可以注意到 Fiber 节点有个 <code>alternate</code> 属性，该属性在节点初始化的时候默认为空（<code>this.alternate = null</code>）。这个节点的作用就是用来缓存之前的 Fiber 节点，更新的时候会判断 <code>fiber.alternate</code> 是否为空来确定当前是首次渲染还是更新。下面我们上代码：</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ReactDOM</span></span> <span class="token keyword module">from</span> <span class="token string">\'react-dom\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token maybe-class-name">ReactDOM</span><span class="token punctuation">.</span><span class="token method function property-access">unstable_createRoot</span><span class="token punctuation">(</span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'root\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">App</span></span> <span class="token punctuation">/></span></span><span class="token punctuation">)</span>\n</code></pre>\n<p>在调用 createRoot 的时候，会先生成一个<code>FiberRootNode</code>，在 <code>FiberRootNode</code> 下会有个 current 属性，current 指向 <code>RootFiber</code> 可以理解为一个空 Fiber。后续调用的 render 方法，就是将传入的组件挂载到 <code>FiberRootNode.current</code>（即 <code>RootFiber</code>） 的空 Fiber 节点上。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 实验版本对外暴露的 createRoot 需要加上 `unstable_` 前缀</span>\nexports<span class="token punctuation">.</span><span class="token property-access">unstable_createRoot</span> <span class="token operator">=</span> createRoot\n\n<span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ReactDOMRoot</span></span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token comment">// createRootFiber => createFiber => return new FiberNode(tag);</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> <span class="token function">createRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 挂载一个空的 fiber 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span> <span class="token operator">=</span> root\n<span class="token punctuation">}</span>\n<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span>\n  <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> <span class="token punctuation">{</span> element<span class="token operator">:</span> children <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> rootFiber <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token comment">// update对象放到 rootFiber 的 updateQueue 中</span>\n  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n  <span class="token comment">// 开始更新流程</span>\n  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>render</code> 最后调用 <code>scheduleUpdateOnFiber</code> 进入更新任务，该方法之前有说明，最后会通过 scheduleCallback 走 MessageChannel 消息进入下个任务队列，最后调用 <code>performConcurrentWorkOnRoot</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// scheduleUpdateOnFiber</span>\n<span class="token comment">// => ensureRootIsScheduled</span>\n<span class="token comment">// => scheduleCallback(performConcurrentWorkOnRoot)</span>\n<span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// workInProgressRoot 为空，则创建 workInProgress</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgressRoot <span class="token operator">!==</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  workInProgressRoot <span class="token operator">=</span> root\n  <span class="token keyword">var</span> current <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token keyword">var</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">alternate</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次构建，需要创建副本</span>\n    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\n    current<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新过程可以复用</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>开始更新时，如果 <code>workInProgress</code> 为空会指向一个新的空 Fiber 节点，表示正在进行工作的 Fiber 节点。</p>\n<pre class="language-js"><code class="language-js">workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\ncurrent<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009143621.png" alt="fiber tree"></p>\n<p>构造好 <code>workInProgress</code> 之后，就会开始在新的 RootFiber 下生成新的子 Fiber 节点了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 构造 workInProgress...</span>\n  <span class="token comment">// workInProgress.alternate = current</span>\n  <span class="token comment">// current.alternate = workInProgress</span>\n\n  <span class="token comment">// 进入遍历 fiber 树的流程</span>\n  <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> current <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token comment">// 省略后续代码...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>按照我们前面的案例， <code>workLoopConcurrent</code> 调用完成后，最后得到的 fiber 树如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div<span class="token operator">></span>val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009145645.png" alt="fiber tree"></p>\n<p>最后进入 Commit 阶段的时候，会切换 FiberRootNode 的 current 属性：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 结束遍历流程，fiber tree 已经构造完毕</span>\n\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span><span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> finishedWork\n  <span class="token function">commitRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> finishedWork <span class="token comment">// 切换到新的 fiber 树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009154353.png" alt="fiber tree"></p>\n<p>上面的流程为第一次渲染，通过 <code>setState({ val: 1 })</code> 更新时，<code>workInProgress</code> 会切换到 <code>root.current.alternate</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  workInProgressRoot <span class="token operator">=</span> root\n  <span class="token keyword">var</span> current <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token keyword">var</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">alternate</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次构建，需要创建副本</span>\n    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\n    current<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新过程可以复用</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009154849.png" alt="fiber tree"></p>\n<p>在后续的遍历过程中（<code>workLoopConcurrent()</code>），会在旧的 RootFiber 下构建一个新的 fiber tree，并且每个 fiber 节点的 alternate 都会指向 current fiber tree 下的节点。</p>\n<p><img src="https://file.shenfq.com/pic/20201009155147.png" alt="fiber tree"></p>\n<p>这样 FiberRootNode 的 current 属性就会轮流在两棵 fiber tree 不停的切换，即达到了缓存的目的，也不会过分的占用内存。</p>\n<h2 id="%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97">更新队列<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97">§</a></h2>\n<p>在 React 15 里，多次 setState 会被放到一个队列中，等待一次更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// setState 方法挂载到原型链上</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 setState 后，会调用内部的 updater.enqueueSetState</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingStateQueue 上暂存新的 state</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 将 setState 的值放入队列中</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>同样在 Fiber 架构中，也会有一个队列用来存放 setState 的值。每个 Fiber 节点都有一个 <code>updateQueue</code> 属性，这个属性就是用来缓存 setState 值的，只是结构从 React 15 的数组变成了链表结构。</p>\n<p>无论是首次 Render 的 Mount 阶段，还是 setState 的 Update 阶段，内部都会调用 <code>enqueueUpdate</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// --- Render 阶段 ---</span>\n<span class="token keyword">function</span> <span class="token function">initializeUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>\n    baseState<span class="token operator">:</span> fiber<span class="token punctuation">.</span><span class="token property-access">memoizedState</span><span class="token punctuation">,</span>\n    firstBaseUpdate<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    lastBaseUpdate<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    shared<span class="token operator">:</span> <span class="token punctuation">{</span>\n      pending<span class="token operator">:</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    effects<span class="token operator">:</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n  fiber<span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> queue\n<span class="token punctuation">}</span>\n<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span>\n  <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> <span class="token punctuation">{</span> element<span class="token operator">:</span> children <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> rootFiber <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token comment">// 初始化 rootFiber 的 updateQueue</span>\n  <span class="token function">initializeUpdateQueue</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n  <span class="token comment">// update 对象放到 rootFiber 的 updateQueue 中</span>\n  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n  <span class="token comment">// 开始更新流程</span>\n  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// --- Update 阶段 ---</span>\n<span class="token class-name">Component</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> classComponentUpdater <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">enqueueSetState</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">inst<span class="token punctuation">,</span> payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 获取实例对应的fiber</span>\n    <span class="token keyword">var</span> fiber <span class="token operator">=</span> <span class="token function">get</span><span class="token punctuation">(</span>inst<span class="token punctuation">)</span>\n    <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> payload\n\n    <span class="token comment">// update 对象放到 rootFiber 的 updateQueue 中</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n    <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enqueueUpdate</code> 方法的主要作用就是将 setState 的值挂载到 Fiber 节点上。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span><span class="token property-access">updateQueue</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>updateQueue <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// updateQueue 为空则跳过</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">var</span> sharedQueue <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> pending <span class="token operator">=</span> sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    update<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    update<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> pending<span class="token punctuation">.</span><span class="token property-access">next</span><span class="token punctuation">;</span>\n    pending<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>多次 setState 会在 <code>sharedQueue.pending</code> 上形成一个单向循环链表，具体例子更形象的展示下这个链表结构。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">click</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">3</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">></span>val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>点击 div 之后，会连续进行三次 setState，每次 setState 都会更新 updateQueue。</p>\n<p><img src="https://file.shenfq.com/pic/20201009235025.png" alt="第一次 setState"></p>\n<p><img src="https://file.shenfq.com/pic/20201009234928.png" alt="第二次 setState"></p>\n<p><img src="https://file.shenfq.com/pic/20201009234826.png" alt="第三次 setState"></p>\n<p>更新过程中，我们遍历下 updateQueue 链表，可以看到结果与预期的一致。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">let</span> $pending <span class="token operator">=</span> sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span>\n<span class="token comment">// 遍历链表，在控制台输出 payload</span>\n<span class="token keyword control-flow">while</span><span class="token punctuation">(</span>$pending<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'update.payload\'</span><span class="token punctuation">,</span> $pending<span class="token punctuation">.</span><span class="token property-access">payload</span><span class="token punctuation">)</span>\n  $pending <span class="token operator">=</span> $pending<span class="token punctuation">.</span><span class="token property-access">next</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009235244.png" alt="链表数据"></p>\n<h2 id="%E9%80%92%E5%BD%92-fiber-%E8%8A%82%E7%82%B9">递归 Fiber 节点<a class="anchor" href="#%E9%80%92%E5%BD%92-fiber-%E8%8A%82%E7%82%B9">§</a></h2>\n<p>Fiber 架构下每个节点都会经历<code>递（beginWork）</code>和<code>归（completeWork）</code>两个过程：</p>\n<ul>\n<li>beginWork：生成新的 state，调用 render 创建子节点，连接当前节点与子节点；</li>\n<li>completeWork：依据 EffectTag 收集 Effect，构造 Effect List；</li>\n</ul>\n<p>先回顾下这个流程：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> current <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>next <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// child 不存在</span>\n    <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// child 存在</span>\n    <span class="token comment">// 重置 workInProgress 为 child</span>\n    workInProgress <span class="token operator">=</span> next\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 向上回溯节点</span>\n  <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 收集副作用，主要是用于标记节点是否需要操作 DOM</span>\n    <span class="token keyword">var</span> current <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n    <span class="token function">completeWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> completedWork<span class="token punctuation">)</span>\n\n    <span class="token comment">// 省略构造 Effect List 过程</span>\n\n    <span class="token comment">// 获取 Fiber.sibling</span>\n    <span class="token keyword">let</span> siblingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">sibling</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>siblingFiber<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// sibling 存在，则跳出 complete 流程，继续 beginWork</span>\n      workInProgress <span class="token operator">=</span> siblingFiber\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n\n    completedWork <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n    workInProgress <span class="token operator">=</span> completedWork\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%80%92beginwork">递（beginWork）<a class="anchor" href="#%E9%80%92beginwork">§</a></h3>\n<p>先看看 <code>beginWork</code> 进行了哪些操作：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// current 不为空，表示需要进行 update</span>\n    <span class="token keyword">var</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span> <span class="token comment">// 原先传入的 props</span>\n    <span class="token keyword">var</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// 更新过程中新的 props</span>\n    <span class="token comment">// 组件的 props 发生变化，或者 type 发生变化</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldProps <span class="token operator">!==</span> newProps <span class="token operator">||</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">!==</span> current<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 设置更新标志位为 true</span>\n      didReceiveUpdate <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// current 为空表示首次加载，需要进行 mount</span>\n    didReceiveUpdate <span class="token operator">=</span> <span class="token boolean">false</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token comment">// tag 表示组件类型，不用类型的组件调用不同方法获取 child</span>\n  <span class="token keyword control-flow">switch</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 函数组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">FunctionComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n    <span class="token comment">// Class组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ClassComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateClassComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n    <span class="token comment">// DOM 原生组件（div、span、button……）</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n    <span class="token comment">// DOM 文本组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostText</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateHostText</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>首先判断 <code>current（即：workInProgress.alternate）</code> 是否存在，如果存在表示需要更新，不存在就是首次加载，<code>didReceiveUpdate</code> 变量设置为 false，<code>didReceiveUpdate</code> 变量用于标记是否需要调用 render 新建 <code>fiber.child</code>，如果为 false 就会重新构建<code>fiber.child</code>，否则复用之前的 <code>fiber.child</code>。</p>\n<p>然后会依据 <code>workInProgress.tag</code> 调用不同的方法构建  <code>fiber.child</code>。关于 <code>workInProgress.tag</code> 的含义可以参考 <a href="https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactWorkTags.js">react/packages/shared/ReactWorkTags.js</a>，主要是用来区分每个节点各自的类型，下面是常用的几个：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> <span class="token maybe-class-name">FunctionComponent</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 函数组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">ClassComponent</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// Class组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">HostComponent</span> <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span> <span class="token comment">// 原生组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">HostText</span> <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span> <span class="token comment">// 文本组件</span>\n</code></pre>\n<p>调用的方法不一一展开讲解，我们只看看 <code>updateClassComponent</code>：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 更新 class 组件</span>\n<span class="token keyword">function</span> <span class="token function">updateClassComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 更新 state，省略了一万行代码，只保留了核心逻辑，看看就好</span>\n  <span class="token keyword">var</span> oldState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">memoizedState</span>\n  <span class="token keyword">var</span> newState <span class="token operator">=</span> oldState\n\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">updateQueue</span>\n  <span class="token keyword">var</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">.</span><span class="token property-access">pending</span>\n  <span class="token keyword">var</span> firstUpdate <span class="token operator">=</span> pendingQueue\n  <span class="token keyword">var</span> update <span class="token operator">=</span> pendingQueue\n\n  <span class="token keyword control-flow">do</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 合并 state</span>\n    <span class="token keyword">var</span> partialState <span class="token operator">=</span> update<span class="token punctuation">.</span><span class="token property-access">payload</span>\n    newState <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> newState<span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n\n    <span class="token comment">// 链表遍历完毕</span>\n    update <span class="token operator">=</span> update<span class="token punctuation">.</span><span class="token property-access">next</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>update <span class="token operator">===</span> firstUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 链表遍历完毕</span>\n      queue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">.</span><span class="token property-access">pending</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n\n  workInProgress<span class="token punctuation">.</span><span class="token property-access">memoizedState</span> <span class="token operator">=</span> newState <span class="token comment">// state 更新完毕</span>\n  \n  <span class="token comment">// 检测 oldState 和 newState 是否一致，如果一致，跳过更新</span>\n  <span class="token comment">// 调用 componentWillUpdate 判断是否需要更新</span>\n  \n\n  <span class="token keyword">var</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span>\n  instance<span class="token punctuation">.</span><span class="token property-access">props</span> <span class="token operator">=</span> newProps\n  instance<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> newState\n\n  <span class="token comment">// 调用 Component 实例的 render</span>\n  <span class="token keyword">var</span> nextChildren <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>首先遍历了之前提到的 <code>updateQueue</code> 更新 <code>state</code>，然后就是判断 <code>state</code> 是否更新，以此来推到组件是否需要更新（这部分代码省略了），最后调用的组件 <code>render</code> 方法生成子组件的虚拟 DOM。最后的 <code>reconcileChildren</code> 就是依据 <code>render</code> 的返回值来生成 fiber 节点并挂载到 <code>workInProgress.child</code> 上。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 构造子节点</span>\n<span class="token keyword">function</span> <span class="token function">reconcileChildren</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token function">mountChildFibers</span><span class="token punctuation">(</span>\n      workInProgress<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> nextChildren\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span>\n      workInProgress<span class="token punctuation">,</span> current<span class="token punctuation">.</span><span class="token property-access">child</span><span class="token punctuation">,</span> nextChildren\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 两个方法本质上一样，只是一个需要生成新的 fiber，一个复用之前的</span>\n<span class="token keyword">var</span> reconcileChildFibers <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> mountChildFibers <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>\n\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token parameter">shouldTrackSideEffects</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 不同类型进行不同的处理</span>\n    <span class="token comment">// 返回对象</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'object\'</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>\n        <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>\n          returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> newChild\n        <span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回数组</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token method function property-access">isArray</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回字符串或数字，表明是文本节点</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">||</span>\n      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'number\'</span>\n    <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回 null，直接删除节点</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>篇幅有限，看看 render 返回值为对象的情况（通常情况下，render 方法 return 的如果是 jsx 都会被转化为虚拟 DOM，而虚拟 DOM 必定是对象或数组）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'object\'</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>\n    <span class="token comment">// 构造 fiber，或者是复用 fiber</span>\n    <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>\n      returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> newChild\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 更新操作，需要设置 effectTag</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    newFiber<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">=</span> <span class="token maybe-class-name">Placement</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> newFiber\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%BD%92completework">归（completeWork）<a class="anchor" href="#%E5%BD%92completework">§</a></h3>\n<p>当 <code>fiber.child</code> 为空时，就会进入 <code>completeWork</code> 流程。而 <code>completeWork</code> 主要就是收集 <code>beginWork</code> 阶段设置的 <code>effectTag</code>，如果有设置 <code>effectTag</code> 就表明该节点发生了变更， <code>effectTag</code>  的主要类型如下（默认为 <code>NoEffect</code> ，表示节点无需进行操作，完整的定义可以参考 <a href="https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactSideEffectTags.js">react/packages/shared/ReactSideEffectTags.js</a>）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">NoEffect</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000000000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">PerformedWork</span> <span class="token operator">=</span> <span class="token comment">/*                */</span> <span class="token number">0b000000000000001</span><span class="token punctuation">;</span>\n\n<span class="token comment">// You can change the rest (and add more).</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Placement</span> <span class="token operator">=</span> <span class="token comment">/*                    */</span> <span class="token number">0b000000000000010</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Update</span> <span class="token operator">=</span> <span class="token comment">/*                       */</span> <span class="token number">0b000000000000100</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">PlacementAndUpdate</span> <span class="token operator">=</span> <span class="token comment">/*           */</span> <span class="token number">0b000000000000110</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Deletion</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000001000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">ContentReset</span> <span class="token operator">=</span> <span class="token comment">/*                 */</span> <span class="token number">0b000000000010000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Callback</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000100000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">DidCapture</span> <span class="token operator">=</span> <span class="token comment">/*                   */</span> <span class="token number">0b000000001000000</span><span class="token punctuation">;</span>\n</code></pre>\n<p>我们看看 <code>completeWork</code> 过程中，具体进行了哪些操作：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 这些组件没有反应到 DOM 的 effect，跳过处理</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">Fragment</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">MemoComponent</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">LazyComponent</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ContextConsumer</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">FunctionComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token comment">// class 组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ClassComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 处理 context</span>\n      <span class="token keyword">var</span> <span class="token maybe-class-name">Component</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isContextProvider</span><span class="token punctuation">(</span><span class="token maybe-class-name">Component</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">popContext</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这里 Fiber 的 props 对应的就是 DOM 节点的 props</span>\n      <span class="token comment">// 例如： id、src、className ……</span>\n      <span class="token keyword">var</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// props</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n        current <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">!=</span> <span class="token keyword null nil">null</span>\n      <span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// current 不为空，表示是更新操作</span>\n        <span class="token keyword">var</span> type <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span>\n        <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// current 为空，表示需要渲染 DOM 节点</span>\n        <span class="token comment">// 实例化 DOM，挂载到 fiber.stateNode</span>\n        <span class="token keyword">var</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n        <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> instance\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> newText <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// props</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">&amp;&amp;</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">!=</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> oldText <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span>\n        <span class="token comment">// 更新文本节点</span>\n        <span class="token function">updateHostText</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> oldText<span class="token punctuation">,</span> newText<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 实例文本节点</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>与 <code>beginWork</code> 一样，<code>completeWork</code> 过程中也会依据 <code>workInProgress.tag</code> 来进行不同的处理，其他类型的组件基本可以略过，只用关注下 <code>HostComponent</code>、<code>HostText</code>，这两种类型的节点会反应到真实 DOM 中，所以会有所处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token function-variable function">updateHostComponent</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>\n  <span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldProps <span class="token operator">===</span> newProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 新旧 props 无变化</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token comment">// DOM 实例</span>\n  <span class="token comment">// 对比新旧 props</span>\n  <span class="token keyword">var</span> updatePayload <span class="token operator">=</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n  <span class="token comment">// 将发生变化的属性放入 updateQueue</span>\n  <span class="token comment">// 注意这里的 updateQueue 不同于 Class 组件对应的 fiber.updateQueue</span>\n  workInProgress<span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> updatePayload\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>updateHostComponent</code> 方法最后会通过 <code>diffProperties</code> 方法获取一个更新队列，挂载到 <code>fiber.updateQueue</code> 上，这里的 updateQueue 不同于 Class 组件对应的 <code>fiber.updateQueue</code>，不是一个链表结构，而是一个数组结构，用于更新真实 DOM。</p>\n<p>下面举一个例子，修改 App 组件的 state 后，下面的 span 标签对应的 <code>data-val</code>、<code>style</code>、<code>children</code> 都会相应的发生修改，同时，在控制台打印出 <code>updatePayload</code> 的结果。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n  <span class="token function-variable function">clickBtn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">clickBtn</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span>\n        <span class="token attr-name">data-val</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span><span class="token punctuation">}</span></span>\n        <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> fontSize<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">*</span> <span class="token number">15</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span>\n      <span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201012114009.png" alt="console"></p>\n<h3 id="%E5%89%AF%E4%BD%9C%E7%94%A8%E9%93%BE%E8%A1%A8">副作用链表<a class="anchor" href="#%E5%89%AF%E4%BD%9C%E7%94%A8%E9%93%BE%E8%A1%A8">§</a></h3>\n<p>在最后的更新阶段，为了不用遍历所有的节点，在 <code>completeWork</code> 过程结束后，会构造一个 effectList 连接所有 effectTag 不为 NoEffect 的节点，在 commit 阶段能够更高效的遍历节点。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 调用 completeWork()...</span>\n\n    <span class="token comment">// 构造 Effect List 过程</span>\n    <span class="token keyword">var</span> returnFiber <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">firstEffect</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>completedWork<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">firstEffect</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>completedWork<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">></span> <span class="token maybe-class-name">PerformedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> completedWork\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> completedWork\n        <span class="token punctuation">}</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> completedWork\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 判断 completedWork.sibling 是否存在...</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面的代码就是构造 effectList 的过程，光看代码还是比较难理解的，我们还是通过实际的代码来解释一下。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function-variable function">click</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> val <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> rows <span class="token operator">=</span> array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> row</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>row<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span>array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n          <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> col</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>col<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token punctuation">{</span>val<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n        <span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token punctuation">{</span>rows<span class="token punctuation">}</span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201012155512.png" alt="App"></p>\n<p>我们构造一个 2 * 2 的 Table，每次点击组件，td 的 children 都会发生修改，下面看看这个过程中的 effectList 是如何变化的。</p>\n<p>第一个 td 完成 <code>completeWork</code> 后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012153947.png" alt="1"></p>\n<p>第二个 td 完成 <code>completeWork</code> 后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154130.png" alt="2"></p>\n<p>两个 td 结束了 <code>completeWork</code> 流程，会回溯到 tr 进行 <code>completeWork</code> ，tr 结束流程后 ，table 会直接复用 tr 的 firstEffect 和 lastEffect，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154619.png" alt="3"></p>\n<p>后面两个 td 结束 <code>completeWork</code> 流程后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154701.png" alt="4"></p>\n<p>回溯到第二个 tr 进行 <code>completeWork</code> ，由于 table 已经存在 firstEffect 和 lastEffect，这里会直接修改 table 的 firstEffect 的 nextEffect，以及重新指定 lastEffect，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012155222.png" alt="5"></p>\n<p>最后回溯到 App 组件时，就会直接复用 table 的 firstEffect 和 lastEffect，最后 的EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012155348.png" alt="6"></p>\n<h2 id="%E6%8F%90%E4%BA%A4%E6%9B%B4%E6%96%B0">提交更新<a class="anchor" href="#%E6%8F%90%E4%BA%A4%E6%9B%B4%E6%96%B0">§</a></h2>\n<p>这一阶段的主要作用就是遍历 effectList 里面的节点，将更新反应到真实 DOM 中，当然还涉及一些生命周期钩子的调用，我们这里只展示最简单的逻辑。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n  <span class="token keyword">var</span> firstEffect <span class="token operator">=</span> finishedWork\n  <span class="token keyword">var</span> nextEffect <span class="token operator">=</span> firstEffect\n  <span class="token comment">// 遍历effectList</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>nextEffect <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> effectTag <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">effectTag</span>\n    <span class="token comment">// 根据 effectTag 进行不同的处理</span>\n    <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>effectTag<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 插入 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Placement</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token function">commitPlacement</span><span class="token punctuation">(</span>nextEffect<span class="token punctuation">)</span>\n        nextEffect<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">&amp;=</span> <span class="token operator">~</span><span class="token maybe-class-name">Placement</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 更新 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Update</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> current <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n        <span class="token function">commitWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> nextEffect<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 删除 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Deletion</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token function">commitDeletion</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> nextEffect<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    nextEffect <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">nextEffect</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里不再展开讲解每个 effect 下具体的操作，在遍历完 effectList 之后，就是将当前的 fiber 树进行切换。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n\n  <span class="token comment">// 遍历 effectList ……</span>\n\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> finishedWork <span class="token comment">// 切换到新的 fiber 树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>到这里整个更新流程就结束了，可以看到 Fiber 架构下，所有数据结构都是链表形式，链表的遍历都是通过循环的方式来实现的，看代码的过程中经常会被突然出现的 return、break 扰乱思路，所以要完全理解这个流程还是很不容易的。</p>\n<p>最后，希望大家在阅读文章的过程中能有收获，下一篇文章会开始写 Hooks 相关的内容。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "React \u67B6\u6784\u7684\u6F14\u53D8 - \u66F4\u65B0\u673A\u5236"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>前面的文章分析了 Concurrent 模式下异步更新的逻辑，以及 Fiber 架构是如何进行时间分片的，更新过程中的很多内容都省略了，评论区也收到了一些同学对更新过程的疑惑，今天的文章就来讲解下 React Fiber 架构的更新机制。</p>\n<h2 id="fiber-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84">Fiber 数据结构<a class="anchor" href="#fiber-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84">§</a></h2>\n<p>我们先回顾一下 Fiber 节点的数据结构（之前文章省略了一部分属性，所以和之前文章略有不同）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">FiberNode</span></span> <span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 节点 key，主要用于了优化列表 diff</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token operator">=</span> key\n  <span class="token comment">// 节点类型；FunctionComponent: 0, ClassComponent: 1, HostRoot: 3 ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">tag</span> <span class="token operator">=</span> tag\n\n  <span class="token comment">// 子节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 父节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token keyword control-flow">return</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span> \n  <span class="token comment">// 兄弟节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">sibling</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  \n  <span class="token comment">// 更新队列，用于暂存 setState 的值</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// 新传入的 props</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>\n  <span class="token comment">// 之前的 props</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">memoizedProps</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n  <span class="token comment">// 之前的 state</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">memoizedState</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 节点更新过期时间，用于时间分片</span>\n  <span class="token comment">// react 17 改为：lanes、childLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">childExpirationTime</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoLanes</span>\n\n  <span class="token comment">// 对应到页面的真实 DOM 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token comment">// Fiber 节点的副本，可以理解为备胎，主要用于提升更新的性能</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n\n  <span class="token comment">// 副作用相关，用于标记节点是否需要更新</span>\n  <span class="token comment">// 以及更新的类型：替换成新节点、更新属性、更新文本、删除……</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">=</span> <span class="token maybe-class-name">NoEffect</span>\n  <span class="token comment">// 指向下一个需要更新的节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6">缓存机制<a class="anchor" href="#%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6">§</a></h2>\n<p>可以注意到 Fiber 节点有个 <code>alternate</code> 属性，该属性在节点初始化的时候默认为空（<code>this.alternate = null</code>）。这个节点的作用就是用来缓存之前的 Fiber 节点，更新的时候会判断 <code>fiber.alternate</code> 是否为空来确定当前是首次渲染还是更新。下面我们上代码：</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ReactDOM</span></span> <span class="token keyword module">from</span> <span class="token string">\'react-dom\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token maybe-class-name">ReactDOM</span><span class="token punctuation">.</span><span class="token method function property-access">unstable_createRoot</span><span class="token punctuation">(</span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'root\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">App</span></span> <span class="token punctuation">/></span></span><span class="token punctuation">)</span>\n</code></pre>\n<p>在调用 createRoot 的时候，会先生成一个<code>FiberRootNode</code>，在 <code>FiberRootNode</code> 下会有个 current 属性，current 指向 <code>RootFiber</code> 可以理解为一个空 Fiber。后续调用的 render 方法，就是将传入的组件挂载到 <code>FiberRootNode.current</code>（即 <code>RootFiber</code>） 的空 Fiber 节点上。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 实验版本对外暴露的 createRoot 需要加上 `unstable_` 前缀</span>\nexports<span class="token punctuation">.</span><span class="token property-access">unstable_createRoot</span> <span class="token operator">=</span> createRoot\n\n<span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ReactDOMRoot</span></span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token comment">// createRootFiber => createFiber => return new FiberNode(tag);</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> <span class="token function">createRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 挂载一个空的 fiber 节点</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span> <span class="token operator">=</span> root\n<span class="token punctuation">}</span>\n<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span>\n  <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> <span class="token punctuation">{</span> element<span class="token operator">:</span> children <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> rootFiber <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token comment">// update对象放到 rootFiber 的 updateQueue 中</span>\n  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n  <span class="token comment">// 开始更新流程</span>\n  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>render</code> 最后调用 <code>scheduleUpdateOnFiber</code> 进入更新任务，该方法之前有说明，最后会通过 scheduleCallback 走 MessageChannel 消息进入下个任务队列，最后调用 <code>performConcurrentWorkOnRoot</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// scheduleUpdateOnFiber</span>\n<span class="token comment">// => ensureRootIsScheduled</span>\n<span class="token comment">// => scheduleCallback(performConcurrentWorkOnRoot)</span>\n<span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// workInProgressRoot 为空，则创建 workInProgress</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgressRoot <span class="token operator">!==</span> root<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  workInProgressRoot <span class="token operator">=</span> root\n  <span class="token keyword">var</span> current <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token keyword">var</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">alternate</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次构建，需要创建副本</span>\n    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\n    current<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新过程可以复用</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>开始更新时，如果 <code>workInProgress</code> 为空会指向一个新的空 Fiber 节点，表示正在进行工作的 Fiber 节点。</p>\n<pre class="language-js"><code class="language-js">workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\ncurrent<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009143621.png" alt="fiber tree"></p>\n<p>构造好 <code>workInProgress</code> 之后，就会开始在新的 RootFiber 下生成新的子 Fiber 节点了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 构造 workInProgress...</span>\n  <span class="token comment">// workInProgress.alternate = current</span>\n  <span class="token comment">// current.alternate = workInProgress</span>\n\n  <span class="token comment">// 进入遍历 fiber 树的流程</span>\n  <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> current <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token comment">// 省略后续代码...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>按照我们前面的案例， <code>workLoopConcurrent</code> 调用完成后，最后得到的 fiber 树如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div<span class="token operator">></span>val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009145645.png" alt="fiber tree"></p>\n<p>最后进入 Commit 阶段的时候，会切换 FiberRootNode 的 current 属性：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 结束遍历流程，fiber tree 已经构造完毕</span>\n\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span><span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> finishedWork\n  <span class="token function">commitRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> finishedWork <span class="token comment">// 切换到新的 fiber 树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009154353.png" alt="fiber tree"></p>\n<p>上面的流程为第一次渲染，通过 <code>setState({ val: 1 })</code> 更新时，<code>workInProgress</code> 会切换到 <code>root.current.alternate</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  workInProgressRoot <span class="token operator">=</span> root\n  <span class="token keyword">var</span> current <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token keyword">var</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">alternate</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次构建，需要创建副本</span>\n    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> current\n    current<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">=</span> workInProgress\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 更新过程可以复用</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009154849.png" alt="fiber tree"></p>\n<p>在后续的遍历过程中（<code>workLoopConcurrent()</code>），会在旧的 RootFiber 下构建一个新的 fiber tree，并且每个 fiber 节点的 alternate 都会指向 current fiber tree 下的节点。</p>\n<p><img src="https://file.shenfq.com/pic/20201009155147.png" alt="fiber tree"></p>\n<p>这样 FiberRootNode 的 current 属性就会轮流在两棵 fiber tree 不停的切换，即达到了缓存的目的，也不会过分的占用内存。</p>\n<h2 id="%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97">更新队列<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97">§</a></h2>\n<p>在 React 15 里，多次 setState 会被放到一个队列中，等待一次更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// setState 方法挂载到原型链上</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 setState 后，会调用内部的 updater.enqueueSetState</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingStateQueue 上暂存新的 state</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 将 setState 的值放入队列中</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>同样在 Fiber 架构中，也会有一个队列用来存放 setState 的值。每个 Fiber 节点都有一个 <code>updateQueue</code> 属性，这个属性就是用来缓存 setState 值的，只是结构从 React 15 的数组变成了链表结构。</p>\n<p>无论是首次 Render 的 Mount 阶段，还是 setState 的 Update 阶段，内部都会调用 <code>enqueueUpdate</code> 方法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// --- Render 阶段 ---</span>\n<span class="token keyword">function</span> <span class="token function">initializeUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>\n    baseState<span class="token operator">:</span> fiber<span class="token punctuation">.</span><span class="token property-access">memoizedState</span><span class="token punctuation">,</span>\n    firstBaseUpdate<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    lastBaseUpdate<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    shared<span class="token operator">:</span> <span class="token punctuation">{</span>\n      pending<span class="token operator">:</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    effects<span class="token operator">:</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n  fiber<span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> queue\n<span class="token punctuation">}</span>\n<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_internalRoot</span>\n  <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> <span class="token punctuation">{</span> element<span class="token operator">:</span> children <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> rootFiber <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">current</span>\n  <span class="token comment">// 初始化 rootFiber 的 updateQueue</span>\n  <span class="token function">initializeUpdateQueue</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n  <span class="token comment">// update 对象放到 rootFiber 的 updateQueue 中</span>\n  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n  <span class="token comment">// 开始更新流程</span>\n  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>rootFiber<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// --- Update 阶段 ---</span>\n<span class="token class-name">Component</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> classComponentUpdater <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">enqueueSetState</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">inst<span class="token punctuation">,</span> payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 获取实例对应的fiber</span>\n    <span class="token keyword">var</span> fiber <span class="token operator">=</span> <span class="token function">get</span><span class="token punctuation">(</span>inst<span class="token punctuation">)</span>\n    <span class="token keyword">var</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    update<span class="token punctuation">.</span><span class="token property-access">payload</span> <span class="token operator">=</span> payload\n\n    <span class="token comment">// update 对象放到 rootFiber 的 updateQueue 中</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> update<span class="token punctuation">)</span>\n    <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enqueueUpdate</code> 方法的主要作用就是将 setState 的值挂载到 Fiber 节点上。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span><span class="token property-access">updateQueue</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>updateQueue <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// updateQueue 为空则跳过</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">var</span> sharedQueue <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> pending <span class="token operator">=</span> sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    update<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    update<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> pending<span class="token punctuation">.</span><span class="token property-access">next</span><span class="token punctuation">;</span>\n    pending<span class="token punctuation">.</span><span class="token property-access">next</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>多次 setState 会在 <code>sharedQueue.pending</code> 上形成一个单向循环链表，具体例子更形象的展示下这个链表结构。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">click</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">3</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">></span>val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>点击 div 之后，会连续进行三次 setState，每次 setState 都会更新 updateQueue。</p>\n<p><img src="https://file.shenfq.com/pic/20201009235025.png" alt="第一次 setState"></p>\n<p><img src="https://file.shenfq.com/pic/20201009234928.png" alt="第二次 setState"></p>\n<p><img src="https://file.shenfq.com/pic/20201009234826.png" alt="第三次 setState"></p>\n<p>更新过程中，我们遍历下 updateQueue 链表，可以看到结果与预期的一致。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">let</span> $pending <span class="token operator">=</span> sharedQueue<span class="token punctuation">.</span><span class="token property-access">pending</span>\n<span class="token comment">// 遍历链表，在控制台输出 payload</span>\n<span class="token keyword control-flow">while</span><span class="token punctuation">(</span>$pending<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'update.payload\'</span><span class="token punctuation">,</span> $pending<span class="token punctuation">.</span><span class="token property-access">payload</span><span class="token punctuation">)</span>\n  $pending <span class="token operator">=</span> $pending<span class="token punctuation">.</span><span class="token property-access">next</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201009235244.png" alt="链表数据"></p>\n<h2 id="%E9%80%92%E5%BD%92-fiber-%E8%8A%82%E7%82%B9">递归 Fiber 节点<a class="anchor" href="#%E9%80%92%E5%BD%92-fiber-%E8%8A%82%E7%82%B9">§</a></h2>\n<p>Fiber 架构下每个节点都会经历<code>递（beginWork）</code>和<code>归（completeWork）</code>两个过程：</p>\n<ul>\n<li>beginWork：生成新的 state，调用 render 创建子节点，连接当前节点与子节点；</li>\n<li>completeWork：依据 EffectTag 收集 Effect，构造 Effect List；</li>\n</ul>\n<p>先回顾下这个流程：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> current <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n  <span class="token comment">// 返回当前 Fiber 的 child</span>\n  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>next <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// child 不存在</span>\n    <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// child 存在</span>\n    <span class="token comment">// 重置 workInProgress 为 child</span>\n    workInProgress <span class="token operator">=</span> next\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 向上回溯节点</span>\n  <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 收集副作用，主要是用于标记节点是否需要操作 DOM</span>\n    <span class="token keyword">var</span> current <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n    <span class="token function">completeWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> completedWork<span class="token punctuation">)</span>\n\n    <span class="token comment">// 省略构造 Effect List 过程</span>\n\n    <span class="token comment">// 获取 Fiber.sibling</span>\n    <span class="token keyword">let</span> siblingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">sibling</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>siblingFiber<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// sibling 存在，则跳出 complete 流程，继续 beginWork</span>\n      workInProgress <span class="token operator">=</span> siblingFiber\n      <span class="token keyword control-flow">return</span>\n    <span class="token punctuation">}</span>\n\n    completedWork <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n    workInProgress <span class="token operator">=</span> completedWork\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%80%92beginwork">递（beginWork）<a class="anchor" href="#%E9%80%92beginwork">§</a></h3>\n<p>先看看 <code>beginWork</code> 进行了哪些操作：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// current 不为空，表示需要进行 update</span>\n    <span class="token keyword">var</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span> <span class="token comment">// 原先传入的 props</span>\n    <span class="token keyword">var</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// 更新过程中新的 props</span>\n    <span class="token comment">// 组件的 props 发生变化，或者 type 发生变化</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldProps <span class="token operator">!==</span> newProps <span class="token operator">||</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">!==</span> current<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 设置更新标志位为 true</span>\n      didReceiveUpdate <span class="token operator">=</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// current 为空表示首次加载，需要进行 mount</span>\n    didReceiveUpdate <span class="token operator">=</span> <span class="token boolean">false</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token comment">// tag 表示组件类型，不用类型的组件调用不同方法获取 child</span>\n  <span class="token keyword control-flow">switch</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 函数组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">FunctionComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n    <span class="token comment">// Class组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ClassComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateClassComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n    <span class="token comment">// DOM 原生组件（div、span、button……）</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n    <span class="token comment">// DOM 文本组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostText</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">updateHostText</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>首先判断 <code>current（即：workInProgress.alternate）</code> 是否存在，如果存在表示需要更新，不存在就是首次加载，<code>didReceiveUpdate</code> 变量设置为 false，<code>didReceiveUpdate</code> 变量用于标记是否需要调用 render 新建 <code>fiber.child</code>，如果为 false 就会重新构建<code>fiber.child</code>，否则复用之前的 <code>fiber.child</code>。</p>\n<p>然后会依据 <code>workInProgress.tag</code> 调用不同的方法构建  <code>fiber.child</code>。关于 <code>workInProgress.tag</code> 的含义可以参考 <a href="https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactWorkTags.js">react/packages/shared/ReactWorkTags.js</a>，主要是用来区分每个节点各自的类型，下面是常用的几个：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> <span class="token maybe-class-name">FunctionComponent</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 函数组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">ClassComponent</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// Class组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">HostComponent</span> <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span> <span class="token comment">// 原生组件</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">HostText</span> <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span> <span class="token comment">// 文本组件</span>\n</code></pre>\n<p>调用的方法不一一展开讲解，我们只看看 <code>updateClassComponent</code>：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 更新 class 组件</span>\n<span class="token keyword">function</span> <span class="token function">updateClassComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 更新 state，省略了一万行代码，只保留了核心逻辑，看看就好</span>\n  <span class="token keyword">var</span> oldState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">memoizedState</span>\n  <span class="token keyword">var</span> newState <span class="token operator">=</span> oldState\n\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">updateQueue</span>\n  <span class="token keyword">var</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">.</span><span class="token property-access">pending</span>\n  <span class="token keyword">var</span> firstUpdate <span class="token operator">=</span> pendingQueue\n  <span class="token keyword">var</span> update <span class="token operator">=</span> pendingQueue\n\n  <span class="token keyword control-flow">do</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 合并 state</span>\n    <span class="token keyword">var</span> partialState <span class="token operator">=</span> update<span class="token punctuation">.</span><span class="token property-access">payload</span>\n    newState <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> newState<span class="token punctuation">,</span> partialState<span class="token punctuation">)</span>\n\n    <span class="token comment">// 链表遍历完毕</span>\n    update <span class="token operator">=</span> update<span class="token punctuation">.</span><span class="token property-access">next</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>update <span class="token operator">===</span> firstUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 链表遍历完毕</span>\n      queue<span class="token punctuation">.</span><span class="token property-access">shared</span><span class="token punctuation">.</span><span class="token property-access">pending</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n      <span class="token keyword control-flow">break</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n\n  workInProgress<span class="token punctuation">.</span><span class="token property-access">memoizedState</span> <span class="token operator">=</span> newState <span class="token comment">// state 更新完毕</span>\n  \n  <span class="token comment">// 检测 oldState 和 newState 是否一致，如果一致，跳过更新</span>\n  <span class="token comment">// 调用 componentWillUpdate 判断是否需要更新</span>\n  \n\n  <span class="token keyword">var</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span>\n  instance<span class="token punctuation">.</span><span class="token property-access">props</span> <span class="token operator">=</span> newProps\n  instance<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> newState\n\n  <span class="token comment">// 调用 Component 实例的 render</span>\n  <span class="token keyword">var</span> nextChildren <span class="token operator">=</span> instance<span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>首先遍历了之前提到的 <code>updateQueue</code> 更新 <code>state</code>，然后就是判断 <code>state</code> 是否更新，以此来推到组件是否需要更新（这部分代码省略了），最后调用的组件 <code>render</code> 方法生成子组件的虚拟 DOM。最后的 <code>reconcileChildren</code> 就是依据 <code>render</code> 的返回值来生成 fiber 节点并挂载到 <code>workInProgress.child</code> 上。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 构造子节点</span>\n<span class="token keyword">function</span> <span class="token function">reconcileChildren</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token function">mountChildFibers</span><span class="token punctuation">(</span>\n      workInProgress<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> nextChildren\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    workInProgress<span class="token punctuation">.</span><span class="token property-access">child</span> <span class="token operator">=</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span>\n      workInProgress<span class="token punctuation">,</span> current<span class="token punctuation">.</span><span class="token property-access">child</span><span class="token punctuation">,</span> nextChildren\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 两个方法本质上一样，只是一个需要生成新的 fiber，一个复用之前的</span>\n<span class="token keyword">var</span> reconcileChildFibers <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> mountChildFibers <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>\n\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ChildReconciler</span></span><span class="token punctuation">(</span><span class="token parameter">shouldTrackSideEffects</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 不同类型进行不同的处理</span>\n    <span class="token comment">// 返回对象</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'object\'</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>\n        <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>\n          returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> newChild\n        <span class="token punctuation">)</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回数组</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token method function property-access">isArray</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回字符串或数字，表明是文本节点</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">||</span>\n      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'number\'</span>\n    <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// ...</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 返回 null，直接删除节点</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>篇幅有限，看看 render 返回值为对象的情况（通常情况下，render 方法 return 的如果是 jsx 都会被转化为虚拟 DOM，而虚拟 DOM 必定是对象或数组）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">\'object\'</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>\n    <span class="token comment">// 构造 fiber，或者是复用 fiber</span>\n    <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>\n      returnFiber<span class="token punctuation">,</span> currentChild<span class="token punctuation">,</span> newChild\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 更新操作，需要设置 effectTag</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>shouldTrackSideEffects <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span><span class="token property-access">alternate</span> <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    newFiber<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">=</span> <span class="token maybe-class-name">Placement</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> newFiber\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%BD%92completework">归（completeWork）<a class="anchor" href="#%E5%BD%92completework">§</a></h3>\n<p>当 <code>fiber.child</code> 为空时，就会进入 <code>completeWork</code> 流程。而 <code>completeWork</code> 主要就是收集 <code>beginWork</code> 阶段设置的 <code>effectTag</code>，如果有设置 <code>effectTag</code> 就表明该节点发生了变更， <code>effectTag</code>  的主要类型如下（默认为 <code>NoEffect</code> ，表示节点无需进行操作，完整的定义可以参考 <a href="https://github.com/facebook/react/blob/v16.13.1/packages/shared/ReactSideEffectTags.js">react/packages/shared/ReactSideEffectTags.js</a>）：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">NoEffect</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000000000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">PerformedWork</span> <span class="token operator">=</span> <span class="token comment">/*                */</span> <span class="token number">0b000000000000001</span><span class="token punctuation">;</span>\n\n<span class="token comment">// You can change the rest (and add more).</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Placement</span> <span class="token operator">=</span> <span class="token comment">/*                    */</span> <span class="token number">0b000000000000010</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Update</span> <span class="token operator">=</span> <span class="token comment">/*                       */</span> <span class="token number">0b000000000000100</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">PlacementAndUpdate</span> <span class="token operator">=</span> <span class="token comment">/*           */</span> <span class="token number">0b000000000000110</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Deletion</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000001000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">ContentReset</span> <span class="token operator">=</span> <span class="token comment">/*                 */</span> <span class="token number">0b000000000010000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">Callback</span> <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b000000000100000</span><span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token maybe-class-name">DidCapture</span> <span class="token operator">=</span> <span class="token comment">/*                   */</span> <span class="token number">0b000000001000000</span><span class="token punctuation">;</span>\n</code></pre>\n<p>我们看看 <code>completeWork</code> 过程中，具体进行了哪些操作：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span><span class="token property-access">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 这些组件没有反应到 DOM 的 effect，跳过处理</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">Fragment</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">MemoComponent</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">LazyComponent</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ContextConsumer</span><span class="token operator">:</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">FunctionComponent</span><span class="token operator">:</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token comment">// class 组件</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">ClassComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 处理 context</span>\n      <span class="token keyword">var</span> <span class="token maybe-class-name">Component</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isContextProvider</span><span class="token punctuation">(</span><span class="token maybe-class-name">Component</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">popContext</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这里 Fiber 的 props 对应的就是 DOM 节点的 props</span>\n      <span class="token comment">// 例如： id、src、className ……</span>\n      <span class="token keyword">var</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// props</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>\n        current <span class="token operator">!==</span> <span class="token keyword null nil">null</span> <span class="token operator">&amp;&amp;</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">!=</span> <span class="token keyword null nil">null</span>\n      <span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// current 不为空，表示是更新操作</span>\n        <span class="token keyword">var</span> type <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">type</span>\n        <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// current 为空，表示需要渲染 DOM 节点</span>\n        <span class="token comment">// 实例化 DOM，挂载到 fiber.stateNode</span>\n        <span class="token keyword">var</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n        <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> instance\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">case</span> <span class="token maybe-class-name">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> newText <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">pendingProps</span> <span class="token comment">// props</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>current <span class="token operator">&amp;&amp;</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">!=</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> oldText <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span>\n        <span class="token comment">// 更新文本节点</span>\n        <span class="token function">updateHostText</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> oldText<span class="token punctuation">,</span> newText<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 实例文本节点</span>\n        workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token operator">=</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>与 <code>beginWork</code> 一样，<code>completeWork</code> 过程中也会依据 <code>workInProgress.tag</code> 来进行不同的处理，其他类型的组件基本可以略过，只用关注下 <code>HostComponent</code>、<code>HostText</code>，这两种类型的节点会反应到真实 DOM 中，所以会有所处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token function-variable function">updateHostComponent</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>\n  <span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span><span class="token property-access">memoizedProps</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>oldProps <span class="token operator">===</span> newProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 新旧 props 无变化</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span><span class="token property-access">stateNode</span> <span class="token comment">// DOM 实例</span>\n  <span class="token comment">// 对比新旧 props</span>\n  <span class="token keyword">var</span> updatePayload <span class="token operator">=</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span>\n  <span class="token comment">// 将发生变化的属性放入 updateQueue</span>\n  <span class="token comment">// 注意这里的 updateQueue 不同于 Class 组件对应的 fiber.updateQueue</span>\n  workInProgress<span class="token punctuation">.</span><span class="token property-access">updateQueue</span> <span class="token operator">=</span> updatePayload\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>updateHostComponent</code> 方法最后会通过 <code>diffProperties</code> 方法获取一个更新队列，挂载到 <code>fiber.updateQueue</code> 上，这里的 updateQueue 不同于 Class 组件对应的 <code>fiber.updateQueue</code>，不是一个链表结构，而是一个数组结构，用于更新真实 DOM。</p>\n<p>下面举一个例子，修改 App 组件的 state 后，下面的 span 标签对应的 <code>data-val</code>、<code>style</code>、<code>children</code> 都会相应的发生修改，同时，在控制台打印出 <code>updatePayload</code> 的结果。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">1</span> <span class="token punctuation">}</span>\n  <span class="token function-variable function">clickBtn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">clickBtn</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span>\n        <span class="token attr-name">data-val</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span><span class="token punctuation">}</span></span>\n        <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> fontSize<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">*</span> <span class="token number">15</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span>\n      <span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201012114009.png" alt="console"></p>\n<h3 id="%E5%89%AF%E4%BD%9C%E7%94%A8%E9%93%BE%E8%A1%A8">副作用链表<a class="anchor" href="#%E5%89%AF%E4%BD%9C%E7%94%A8%E9%93%BE%E8%A1%A8">§</a></h3>\n<p>在最后的更新阶段，为了不用遍历所有的节点，在 <code>completeWork</code> 过程结束后，会构造一个 effectList 连接所有 effectTag 不为 NoEffect 的节点，在 commit 阶段能够更高效的遍历节点。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> completedWork <span class="token operator">=</span> workInProgress\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 调用 completeWork()...</span>\n\n    <span class="token comment">// 构造 Effect List 过程</span>\n    <span class="token keyword">var</span> returnFiber <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token keyword control-flow">return</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">===</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">firstEffect</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>completedWork<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">firstEffect</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> completedWork<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>completedWork<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">></span> <span class="token maybe-class-name">PerformedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span><span class="token punctuation">.</span><span class="token property-access">nextEffect</span> <span class="token operator">=</span> completedWork\n        <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n          returnFiber<span class="token punctuation">.</span><span class="token property-access">firstEffect</span> <span class="token operator">=</span> completedWork\n        <span class="token punctuation">}</span>\n        returnFiber<span class="token punctuation">.</span><span class="token property-access">lastEffect</span> <span class="token operator">=</span> completedWork\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token comment">// 判断 completedWork.sibling 是否存在...</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面的代码就是构造 effectList 的过程，光看代码还是比较难理解的，我们还是通过实际的代码来解释一下。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function-variable function">click</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> val <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span>\n    <span class="token keyword">const</span> array <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">fill</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> rows <span class="token operator">=</span> array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> row</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tr</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>row<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n        </span><span class="token punctuation">{</span>array<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span>\n          <span class="token punctuation">(</span><span class="token parameter">_<span class="token punctuation">,</span> col</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>td</span> <span class="token attr-name">key</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>col<span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token punctuation">{</span>val<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>td</span><span class="token punctuation">></span></span>\n        <span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tr</span><span class="token punctuation">></span></span>\n    <span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>table</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token punctuation">{</span>rows<span class="token punctuation">}</span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>table</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/pic/20201012155512.png" alt="App"></p>\n<p>我们构造一个 2 * 2 的 Table，每次点击组件，td 的 children 都会发生修改，下面看看这个过程中的 effectList 是如何变化的。</p>\n<p>第一个 td 完成 <code>completeWork</code> 后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012153947.png" alt="1"></p>\n<p>第二个 td 完成 <code>completeWork</code> 后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154130.png" alt="2"></p>\n<p>两个 td 结束了 <code>completeWork</code> 流程，会回溯到 tr 进行 <code>completeWork</code> ，tr 结束流程后 ，table 会直接复用 tr 的 firstEffect 和 lastEffect，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154619.png" alt="3"></p>\n<p>后面两个 td 结束 <code>completeWork</code> 流程后，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012154701.png" alt="4"></p>\n<p>回溯到第二个 tr 进行 <code>completeWork</code> ，由于 table 已经存在 firstEffect 和 lastEffect，这里会直接修改 table 的 firstEffect 的 nextEffect，以及重新指定 lastEffect，EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012155222.png" alt="5"></p>\n<p>最后回溯到 App 组件时，就会直接复用 table 的 firstEffect 和 lastEffect，最后 的EffectList 结果如下：</p>\n<p><img src="https://file.shenfq.com/pic/20201012155348.png" alt="6"></p>\n<h2 id="%E6%8F%90%E4%BA%A4%E6%9B%B4%E6%96%B0">提交更新<a class="anchor" href="#%E6%8F%90%E4%BA%A4%E6%9B%B4%E6%96%B0">§</a></h2>\n<p>这一阶段的主要作用就是遍历 effectList 里面的节点，将更新反应到真实 DOM 中，当然还涉及一些生命周期钩子的调用，我们这里只展示最简单的逻辑。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n  <span class="token keyword">var</span> firstEffect <span class="token operator">=</span> finishedWork\n  <span class="token keyword">var</span> nextEffect <span class="token operator">=</span> firstEffect\n  <span class="token comment">// 遍历effectList</span>\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>nextEffect <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> effectTag <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">effectTag</span>\n    <span class="token comment">// 根据 effectTag 进行不同的处理</span>\n    <span class="token keyword control-flow">switch</span> <span class="token punctuation">(</span>effectTag<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 插入 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Placement</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token function">commitPlacement</span><span class="token punctuation">(</span>nextEffect<span class="token punctuation">)</span>\n        nextEffect<span class="token punctuation">.</span><span class="token property-access">effectTag</span> <span class="token operator">&amp;=</span> <span class="token operator">~</span><span class="token maybe-class-name">Placement</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 更新 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Update</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> current <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">alternate</span>\n        <span class="token function">commitWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> nextEffect<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n      <span class="token comment">// 删除 DOM 节点</span>\n      <span class="token keyword">case</span> <span class="token maybe-class-name">Deletion</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token function">commitDeletion</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> nextEffect<span class="token punctuation">)</span>\n        <span class="token keyword control-flow">break</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    nextEffect <span class="token operator">=</span> nextEffect<span class="token punctuation">.</span><span class="token property-access">nextEffect</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里不再展开讲解每个 effect 下具体的操作，在遍历完 effectList 之后，就是将当前的 fiber 树进行切换。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span>\n\n  <span class="token comment">// 遍历 effectList ……</span>\n\n  root<span class="token punctuation">.</span><span class="token property-access">finishedWork</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  root<span class="token punctuation">.</span><span class="token property-access">current</span> <span class="token operator">=</span> finishedWork <span class="token comment">// 切换到新的 fiber 树</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>到这里整个更新流程就结束了，可以看到 Fiber 架构下，所有数据结构都是链表形式，链表的遍历都是通过循环的方式来实现的，看代码的过程中经常会被突然出现的 return、break 扰乱思路，所以要完全理解这个流程还是很不容易的。</p>\n<p>最后，希望大家在阅读文章的过程中能有收获，下一篇文章会开始写 Hooks 相关的内容。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#fiber-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84" }, "Fiber \u6570\u636E\u7ED3\u6784")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6" }, "\u7F13\u5B58\u673A\u5236")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97" }, "\u66F4\u65B0\u961F\u5217")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E9%80%92%E5%BD%92-fiber-%E8%8A%82%E7%82%B9" }, "\u9012\u5F52 Fiber \u8282\u70B9"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E9%80%92beginwork" }, "\u9012\uFF08beginWork\uFF09")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%BD%92completework" }, "\u5F52\uFF08completeWork\uFF09")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%89%AF%E4%BD%9C%E7%94%A8%E9%93%BE%E8%A1%A8" }, "\u526F\u4F5C\u7528\u94FE\u8868")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%8F%90%E4%BA%A4%E6%9B%B4%E6%96%B0" }, "\u63D0\u4EA4\u66F4\u65B0")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/10/12",
    'updated': null,
    'excerpt': "前面的文章分析了 Concurrent 模式下异步更新的逻辑，以及 Fiber 架构是如何进行时间分片的，更新过程中的很多内容都省略了，评论区也收到了一些同学对更新过程的疑惑，今天的文章就来讲解下 React Fiber 架构的更新机制。 Fib...",
    'cover': "https://file.shenfq.com/pic/20201009143621.png",
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
                "count": 23
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
                "name": "随便写写",
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
                "name": "Go",
                "count": 8
            },
            {
                "name": "JavaScript",
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
                "name": "Generator",
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
                "name": "offer",
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
                "name": "消费主义",
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
                "name": "随便写写",
                "count": 1
            }
        ]
    }
};
