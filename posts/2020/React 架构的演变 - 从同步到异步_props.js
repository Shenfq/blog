import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/React 架构的演变 - 从同步到异步.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/React 架构的演变 - 从同步到异步.html",
    'title': "React 架构的演变 - 从同步到异步",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>React 架构的演变 - 从同步到异步</h1>\n<p>写这篇文章的目的，主要是想弄懂 React 最新的 fiber 架构到底是什么东西，但是看了网上的很多文章，要不模棱两可，要不就是一顿复制粘贴，根本看不懂，于是开始认真钻研源码。钻研过程中，发现我想得太简单了，React 源码的复杂程度远超我的想象，于是打算分几个模块了剖析，今天先讲一讲 React 的更新策略从同步变为异步的演变过程。</p>\n<h2 id="%E4%BB%8E-setstate-%E8%AF%B4%E8%B5%B7">从 setState 说起<a class="anchor" href="#%E4%BB%8E-setstate-%E8%AF%B4%E8%B5%B7">§</a></h2>\n<p>React 16 之所以要进行一次大重构，是因为 React 之前的版本有一些不可避免的缺陷，一些更新操作，需要由同步改成异步。所以我们先聊聊 React 15 是如何进行一次 setState 的。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 第二次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 第三次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'in callback\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text"> val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text"> </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>熟悉 React 的同学应该知道，在 React 的生命周期内，多次 setState 会被合并成一次，这里虽然连续进行了三次 setState，<code>state.val</code> 的值实际上只重新计算了一次。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-064122.png" alt="render结果"></p>\n<p>每次 setState 之后，立即获取 state 会发现并没有更新，只有在 setState 的回调函数内才能拿到最新的结果，这点通过我们在控制台输出的结果就可以证实。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-064348.png" alt="控制台输出"></p>\n<p>网上有很多文章称 setState 是『异步操作』，所以导致 setState 之后并不能获取到最新值，其实这个观点是错误的。setState 是一次同步操作，只是每次操作之后并没有立即执行，而是将 setState 进行了缓存，mount 流程结束或事件操作结束，才会拿出所有的 state 进行一次计算。如果 setState 脱离了 <code>React 的生命周期</code>或者 <code>React 提供的事件流</code>，setState 之后就能立即拿到结果。</p>\n<p>我们修改上面的代码，将 setState 放入 setTimeout 中，在下一个任务队列进行执行。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 第一次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n      <span class="token comment">// 第二次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text"> val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text"> </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>可以看到，setState 之后就能立即看到<code>state.val</code> 的值发生了变化。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-065254.png" alt="控制台输出"></p>\n<p>为了更加深入理解 setState，下面简单讲解一下React 15 中 setState 的更新逻辑，下面的代码是对源码的一些精简，并非完整逻辑。</p>\n<h3 id="%E6%97%A7%E7%89%88%E6%9C%AC-setstate-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">旧版本 setState 源码分析<a class="anchor" href="#%E6%97%A7%E7%89%88%E6%9C%AC-setstate-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">§</a></h3>\n<p>setState 的主要逻辑都在 ReactUpdateQueue 中实现，在调用 setState 后，并没有立即修改 state，而是将传入的参数放到了组件内部的 <code>_pendingStateQueue</code> 中，之后调用 <code>enqueueUpdate</code> 来进行更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 对外暴露的 React.Component</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ReactComponent</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span> <span class="token operator">=</span> <span class="token maybe-class-name">ReactUpdateQueue</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// setState 方法挂载到原型链上</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 setState 后，会调用内部的 updater.enqueueSetState</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueCallback</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> callback<span class="token punctuation">,</span> <span class="token string">\'setState\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingStateQueue 上暂存新的 state</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">;</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">enqueueCallback</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> callerName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingCallbacks 上暂存 callback</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span> <span class="token operator">=</span> <span class="token punctuation">[</span>callback<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enqueueUpdate</code> 首先会通过 <code>batchingStrategy.isBatchingUpdates</code> 判断当前是否在更新流程，如果不在更新流程，会调用 <code>batchingStrategy.batchedUpdates()</code> 进行更新。如果在流程中，会将待更新的组件放入 <code>dirtyComponents</code> 进行缓存。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> dirtyComponents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>batchingStrategy<span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 开始进行批量更新</span>\n    batchingStrategy<span class="token punctuation">.</span><span class="token method function property-access">batchedUpdates</span><span class="token punctuation">(</span>enqueueUpdate<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果在更新流程，则将组件放入脏组件队列，表示组件待更新</span>\n  dirtyComponents<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>batchingStrategy</code> 是 React 进行批处理的一种策略，该策略的实现基于 <code>Transaction</code>，虽然名字和数据库的事务一样，但是做的事情却不一样。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">ReactDefaultBatchingStrategyTransaction</span> <span class="token keyword">extends</span> <span class="token class-name">Transaction</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">reinitializeTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">getTransactionWrappers</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        close<span class="token operator">:</span> <span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">flushBatchedUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token function-variable function">close</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> transaction <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactDefaultBatchingStrategyTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> batchingStrategy <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 判断是否在更新流程中</span>\n  isBatchingUpdates<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n  <span class="token comment">// 开始进行批量更新</span>\n  <span class="token function-variable function">batchedUpdates</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 获取之前的更新状态</span>\n    <span class="token keyword">var</span> alreadyBatchingUpdates <span class="token operator">=</span> <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">;</span>\n    <span class="token comment">// 将更新状态修改为 true</span>\n    <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>alreadyBatchingUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果已经在更新状态中，等待之前的更新结束</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">callback</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 进行更新</span>\n      <span class="token keyword control-flow">return</span> transaction<span class="token punctuation">.</span><span class="token method function property-access">perform</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Transaction</code> 通过 perform 方法启动，然后通过扩展的 <code>getTransactionWrappers</code> 获取一个数组，该数组内存在多个 wrapper 对象，每个对象包含两个属性：<code>initialize</code>、<code>close</code>。perform 中会先调用所有的 <code>wrapper.initialize</code>，然后调用传入的回调，最后调用所有的 <code>wrapper.close</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Transaction</span> <span class="token punctuation">{</span>\n  <span class="token function">reinitializeTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getTransactionWrappers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">perform</span><span class="token punctuation">(</span><span class="token parameter">method<span class="token punctuation">,</span> scope<span class="token punctuation">,</span> <span class="token spread operator">...</span>param</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">initializeAll</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> ret <span class="token operator">=</span> method<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> <span class="token spread operator">...</span>param<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">closeAll</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> ret<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">initializeAll</span><span class="token punctuation">(</span><span class="token parameter">startIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> transactionWrappers <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> startIndex<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> transactionWrappers<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> wrapper <span class="token operator">=</span> transactionWrappers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n      wrapper<span class="token punctuation">.</span><span class="token method function property-access">initialize</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">closeAll</span><span class="token punctuation">(</span><span class="token parameter">startIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> transactionWrappers <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> startIndex<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> transactionWrappers<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> wrapper <span class="token operator">=</span> transactionWrappers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n      wrapper<span class="token punctuation">.</span><span class="token method function property-access">close</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-075910.png" alt="transaction.perform"></p>\n<p>React 源代码的注释中，也形象的展示了这一过程。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">/*\n*                       wrappers (injected at creation time)\n*                                      +        +\n*                                      |        |\n*                    +-----------------|--------|--------------+\n*                    |                 v        |              |\n*                    |      +---------------+   |              |\n*                    |   +--|    wrapper1   |---|----+         |\n*                    |   |  +---------------+   v    |         |\n*                    |   |          +-------------+  |         |\n*                    |   |     +----|   wrapper2  |--------+   |\n*                    |   |     |    +-------------+  |     |   |\n*                    |   |     |                     |     |   |\n*                    |   v     v                     v     v   | wrapper\n*                    | +---+ +---+   +---------+   +---+ +---+ | invariants\n* perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained\n* +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | +---+ +---+   +---------+   +---+ +---+ |\n*                    |  initialize                    close    |\n*                    +-----------------------------------------+\n*/</span>\n</code></pre>\n<p>我们简化一下代码，再重新看一下 setState 的流程。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 1. 调用 Component.setState</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 2. 调用 ReactUpdateQueue.enqueueSetState，将 state 值放到 _pendingStateQueue 进行缓存</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">||</span> <span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 3. 判断是否在更新过程中，如果不在就进行更新</span>\n<span class="token keyword">var</span> dirtyComponents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 如果之前没有更新，此时的 isBatchingUpdates 肯定是 false</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>batchingStrategy<span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 调用 batchingStrategy.batchedUpdates 进行更新</span>\n    batchingStrategy<span class="token punctuation">.</span><span class="token method function property-access">batchedUpdates</span><span class="token punctuation">(</span>enqueueUpdate<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  dirtyComponents<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 4. 进行更新，更新逻辑放入事务中进行处理</span>\n<span class="token keyword">var</span> batchingStrategy <span class="token operator">=</span> <span class="token punctuation">{</span>\n  isBatchingUpdates<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n  <span class="token comment">// 注意：此时的 callback 为 enqueueUpdate </span>\n  <span class="token function-variable function">batchedUpdates</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> alreadyBatchingUpdates <span class="token operator">=</span> <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">;</span>\n    <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>alreadyBatchingUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果已经在更新状态中，重新调用 enqueueUpdate，将 component 放入 dirtyComponents</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">callback</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 进行事务操作</span>\n      <span class="token keyword control-flow">return</span> transaction<span class="token punctuation">.</span><span class="token method function property-access">perform</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>启动事务可以拆分成三步来看：</p>\n<ol>\n<li>先执行 wrapper 的 initialize，此时的 initialize 都是一些空函数，可以直接跳过；</li>\n<li>然后执行 callback（也就是 enqueueUpdate），执行 enqueueUpdate 时，由于已经进入了更新状态，<code>batchingStrategy.isBatchingUpdates</code> 被修改成了 <code>true</code>，所以最后还是会把 component 放入脏组件队列，等待更新；</li>\n<li>后面执行的两个 close 方法，第一个方法的 <code>flushBatchedUpdates</code> 是用来进行组件更新的，第二个方法用来修改更新状态，表示更新已经结束。</li>\n</ol>\n<pre class="language-js"><code class="language-js"><span class="token function">getTransactionWrappers</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      close<span class="token operator">:</span> <span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">flushBatchedUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">close</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>flushBatchedUpdates</code> 里面会取出所有的脏组件队列进行 diff，最后更新到 DOM。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">flushBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>dirtyComponents<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">runBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">runBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了一些去重和排序的操作</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> dirtyComponents<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> component <span class="token operator">=</span> dirtyComponents<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 判断组件是否需要更新，然后进行 diff 操作，最后更新 DOM。</span>\n    <span class="token maybe-class-name">ReactReconciler</span><span class="token punctuation">.</span><span class="token method function property-access">performUpdateIfNecessary</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>performUpdateIfNecessary()</code> 会调用 <code>Component.updateComponent()</code>，在 <code>updateComponent()</code> 中，会从 <code>_pendingStateQueue</code> 中取出所有的值来更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 获取最新的 state</span>\n<span class="token function">_processPendingState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> inst <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_instance</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">var</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>inst<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> queue<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> partial <span class="token operator">=</span> queue<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span>\n      nextState<span class="token punctuation">,</span>\n      <span class="token keyword">typeof</span> partial <span class="token operator">===</span> <span class="token string">\'function\'</span> <span class="token operator">?</span> <span class="token function">partial</span><span class="token punctuation">(</span>inst<span class="token punctuation">,</span> nextState<span class="token punctuation">)</span> <span class="token operator">:</span> partial\n   <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> nextState<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 更新组件</span>\n<span class="token function">updateComponent</span><span class="token punctuation">(</span><span class="token parameter">prevParentElement<span class="token punctuation">,</span> nextParentElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> inst <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_instance</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> prevProps <span class="token operator">=</span> prevParentElement<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> nextProps <span class="token operator">=</span> nextParentElement<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> nextState <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">_processPendingState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> shouldUpdate <span class="token operator">=</span> \n      <span class="token operator">!</span><span class="token function">shallowEqual</span><span class="token punctuation">(</span>prevProps<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span> <span class="token operator">||</span>\n      <span class="token operator">!</span><span class="token function">shallowEqual</span><span class="token punctuation">(</span>inst<span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">,</span> nextState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>shouldUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// diff 、update DOM</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    inst<span class="token punctuation">.</span><span class="token property-access">props</span> <span class="token operator">=</span> nextProps<span class="token punctuation">;</span>\n    inst<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> nextState<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 后续的操作包括判断组件是否需要更新、diff、更新到 DOM</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="setstate-%E5%90%88%E5%B9%B6%E5%8E%9F%E5%9B%A0">setState 合并原因<a class="anchor" href="#setstate-%E5%90%88%E5%B9%B6%E5%8E%9F%E5%9B%A0">§</a></h3>\n<p>按照刚刚讲解的逻辑，setState 的时候，<code>batchingStrategy.isBatchingUpdates</code> 为 <code>false</code> 会开启一个事务，将组件放入脏组件队列，最后进行更新操作，而且这里都是同步操作。讲道理，setState 之后，我们可以立即拿到最新的 state。</p>\n<p>然而，事实并非如此，在 React 的生命周期及其事件流中，<code>batchingStrategy.isBatchingUpdates</code> 的值早就被修改成了 <code>true</code>。可以看看下面两张图：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-19-122451.png" alt="Mount"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-19-122327.png" alt="事件调用"></p>\n<p>在组件 mount 和事件调用的时候，都会调用 <code>batchedUpdates</code>，这个时候已经开始了事务，所以只要不脱离 React，不管多少次 setState 都会把其组件放入脏组件队列等待更新。一旦脱离 React 的管理，比如在 setTimeout 中，setState 立马变成单打独斗。</p>\n<h2 id="concurrent-%E6%A8%A1%E5%BC%8F">Concurrent 模式<a class="anchor" href="#concurrent-%E6%A8%A1%E5%BC%8F">§</a></h2>\n<p>React 16 引入的 Fiber 架构，就是为了后续的异步渲染能力做铺垫，虽然架构已经切换，但是异步渲染的能力并没有正式上线，我们只能在实验版中使用。异步渲染指的是 <a href="https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html">Concurrent 模式</a>，下面是官网的介绍：</p>\n<blockquote>\n<p>Concurrent 模式是 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。</p>\n</blockquote>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-020049.png" alt="优点"></p>\n<p>除了 Concurrent 模式，React 还提供了另外两个模式， Legacy 模式依旧是同步更新的方式，可以认为和旧版本保持一致的兼容模式，而 Blocking 模式是一个过渡版本。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-141550.png" alt="模式差异"></p>\n<p>Concurrent 模式说白就是让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。</p>\n<blockquote>\n<p>浏览器是单线程，它将 GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。当做某件事，只有将它做完才能做下一件事。如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化，一些 DOM 操作，内部也会对 reflow 进行处理。reflow 是一个性能黑洞，很可能让页面的大多数元素进行重新布局。</p>\n<p>浏览器的运作流程: <code>渲染 -&gt; tasks -&gt; 渲染 -&gt; tasks -&gt; 渲染 -&gt; ....</code></p>\n<p>这些 tasks 中有些我们可控，有些不可控，比如 setTimeout 什么时候执行不好说，它总是不准时；资源加载时间不可控。但一些JS我们可以控制，让它们分派执行，tasks的时长不宜过长，这样浏览器就有时间优化 JS 代码与修正 reflow ！</p>\n<p>总结一句，<strong>就是让浏览器休息好，浏览器就能跑得更快</strong>。</p>\n<p>-- by 司徒正美 <a href="https://zhuanlan.zhihu.com/p/37095662">《React Fiber架构》</a></p>\n</blockquote>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-020125.png" alt="模式差异"></p>\n<p>这里有个 demo，上面是一个🌟围绕☀️运转的动画，下面是 React 定时 setState 更新视图，同步模式下，每次 setState 都会造成上面的动画卡顿，而异步模式下的动画就很流畅。</p>\n<p><strong><a href="https://pomber.github.io/incremental-rendering-demo/react-sync.html">同步模式</a>：</strong></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-061056.gif" alt="同步模式"></p>\n<p><strong><a href="https://pomber.github.io/incremental-rendering-demo/react-async.html">异步模式</a>：</strong></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-061249.gif" alt="异步模式"></p>\n<h3 id="%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8">如何使用<a class="anchor" href="#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8">§</a></h3>\n<p>虽然很多文章都在介绍 Concurrent 模式，但是这个能力并没有真正上线，想要使用只能安装实验版本。也可以直接通过这个 cdn ：<a href="https://unpkg.com/browse/react@0.0.0-experimental-94c0244ba/">https://unpkg.com/browse/react@0.0.0-experimental-94c0244ba/</a> 。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> <a class="token email-link" href="mailto:react@experimental">react@experimental</a> <a class="token email-link" href="mailto:react-dom@experimental">react-dom@experimental</a>\n</code></pre>\n<p>如果要开启 Concurrent 模式，不能使用之前的 <code>ReactDOM.render</code>，需要替换成 <code>ReactDOM.createRoot</code>，而在实验版本中，由于 API 不够稳定， 需要通过 <code>ReactDOM.unstable_createRoot</code> 来启用 Concurrent 模式。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ReactDOM</span></span> <span class="token keyword module">from</span> <span class="token string">\'react-dom\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">App</span></span> <span class="token keyword module">from</span> <span class="token string">\'./App\'</span><span class="token punctuation">;</span>\n\n<span class="token maybe-class-name">ReactDOM</span><span class="token punctuation">.</span><span class="token method function property-access">unstable_createRoot</span><span class="token punctuation">(</span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'root\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token maybe-class-name">App</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h3 id="setstate-%E5%90%88%E5%B9%B6%E6%9B%B4%E6%96%B0">setState 合并更新<a class="anchor" href="#setstate-%E5%90%88%E5%B9%B6%E6%9B%B4%E6%96%B0">§</a></h3>\n<p>还记得之前 React15 的案例中，setTimeout 中进行 setState ，<code>state.val</code> 的值会立即发生变化。同样的代码，我们拿到 Concurrent 模式下运行一次。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 第一次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n      <span class="token comment">// 第二次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      \n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div<span class="token operator">></span> val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span> <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-142406.png" alt="控制台输出"></p>\n<p>说明在 Concurrent 模式下，即使脱离了 React 的生命周期，setState 依旧能够合并更新。主要原因是 Concurrent 模式下，真正的更新操作被移到了下一个事件队列中，类似于 Vue 的 nextTick。</p>\n<h3 id="%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6%E5%8F%98%E6%9B%B4">更新机制变更<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6%E5%8F%98%E6%9B%B4">§</a></h3>\n<p>我们修改一下 demo，然后看下点击按钮之后的调用栈。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">click add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-053734.png" alt="调用栈"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-054804.png" alt="调用栈"></p>\n<p><code>onClick</code> 触发后，进行 setState 操作，然后调用 enquueState 方法，到这里看起来好像和之前的模式一样，但是后面的操作基本都变了，因为 React 16 中已经没有了事务一说。</p>\n<pre class="language-js"><code class="language-js"><span class="token maybe-class-name">Component</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">enquueState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">scheduleUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token arrow operator">=></span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token parameter">flushWork</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>真正的异步化逻辑就在 <code>requestHostCallback</code>、<code>postMessage</code> 里面，这是 React 内部自己实现的一个调度器：<a href="https://github.com/facebook/react/blob/v16.13.1/packages/scheduler/index.js">https://github.com/facebook/react/blob/v16.13.1/packages/scheduler/index.js</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">unstable_scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">priorityLevel<span class="token punctuation">,</span> calback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> startTime <span class="token operator">=</span> currentTime <span class="token operator">+</span> delay<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> newTask <span class="token operator">=</span> <span class="token punctuation">{</span>\n    id<span class="token operator">:</span> taskIdCounter<span class="token operator">++</span><span class="token punctuation">,</span>\n    startTime<span class="token operator">:</span> startTime<span class="token punctuation">,</span>           <span class="token comment">// 任务开始时间</span>\n    expirationTime<span class="token operator">:</span> expirationTime<span class="token punctuation">,</span> <span class="token comment">// 任务终止时间</span>\n    priorityLevel<span class="token operator">:</span> priorityLevel<span class="token punctuation">,</span>   <span class="token comment">// 调度优先级</span>\n    callback<span class="token operator">:</span> callback<span class="token punctuation">,</span>             <span class="token comment">// 回调函数</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>startTime <span class="token operator">></span> currentTime<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 超时处理，将任务放到 taskQueue，下一个时间片执行</span>\n    <span class="token comment">// 源码中其实是 timerQueue，后续会有个操作将 timerQueue 的 task 转移到 taskQueue</span>\n    <span class="token function">push</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">,</span> newTask<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token function">requestHostCallback</span><span class="token punctuation">(</span>flushWork<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> newTask<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>requestHostCallback 的实现依赖于 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel">MessageChannel</a>，但是 MessageChannel 在这里并不是做消息通信用的，而是利用它的异步能力，给浏览器一个喘息的机会。说起 MessageChannel，Vue 2.5 的 nextTick 也有使用，但是 2.6 发布时又取消了。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-070234.png" alt="vue@2.5"></p>\n<p>MessageChannel 会暴露两个对象，<code>port1</code> 和 <code>port2</code>，<code>port1</code> 发送的消息能被 <code>port2</code> 接收，同样 <code>port2</code> 发送的消息也能被 <code>port1</code> 接收，只是接收消息的时机会放到下一个 macroTask 中。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> <span class="token punctuation">{</span> port1<span class="token punctuation">,</span> port2 <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// port1 接收 port2 的消息</span>\nport1<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">msg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'MessageChannel exec\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token comment">// port2 发送消息</span>\nport2<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n\n<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token parameter">r</span> <span class="token arrow operator">=></span> <span class="token function">r</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'promise exec\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'setTimeout exec\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'start run\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-035707.png" alt="执行结果"></p>\n<p>可以看到，<code>port1</code> 接收消息的时机比 Promise 所在的 microTask 要晚，但是早于 setTimeout。React 利用这个能力，给了浏览器一个喘息的时间，不至于被饿死。</p>\n<p>还是之前的案例，同步更新时没有给浏览器任何喘息，造成视图的卡顿。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-071927.png" alt="同步更新"></p>\n<p>异步更新时，拆分了时间片，给了浏览器充分的时间更新动画。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-072105.png" alt="异步更新"></p>\n<p>还是回到代码层面，看看 React 是如何利用 MessageChannel 的。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 更新状态</span>\n<span class="token keyword">var</span> scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span> <span class="token comment">// 全局的回调</span>\n<span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> port <span class="token operator">=</span> channel<span class="token punctuation">.</span><span class="token property-access">port2</span><span class="token punctuation">;</span>\n\nchannel<span class="token punctuation">.</span><span class="token property-access">port1</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>scheduledHostCallback <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 重置超时时间</span>\n    deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval<span class="token punctuation">;</span>\n    <span class="token keyword">var</span> hasTimeRemaining <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 执行 callback</span>\n    <span class="token keyword">var</span> hasMoreWork <span class="token operator">=</span> <span class="token function">scheduledHostCallback</span><span class="token punctuation">(</span>hasTimeRemaining<span class="token punctuation">,</span> currentTime<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 已经没有任务了，修改状态</span>\n      isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 还有任务，放到下个任务队列执行，给浏览器喘息的机会</span>\n      port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token function-variable function">requestHostCallback</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// callback 挂载到 scheduledHostCallback</span>\n  scheduledHostCallback <span class="token operator">=</span> callback<span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMessageLoopRunning<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token comment">// 推送消息，下个队列队列调用 callback</span>\n    port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>再看看之前传入的 callback（<code>flushWork</code>），调用 <code>workLoop</code>，取出 taskQueue 中的任务执行。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了相当多的代码</span>\n<span class="token keyword">function</span> <span class="token function">flushWork</span><span class="token punctuation">(</span><span class="token parameter">hasTimeRemaining<span class="token punctuation">,</span> initialTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">workLoop</span><span class="token punctuation">(</span>hasTimeRemaining<span class="token punctuation">,</span> initialTime<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">workLoop</span><span class="token punctuation">(</span><span class="token parameter">hasTimeRemaining<span class="token punctuation">,</span> initialTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> initialTime<span class="token punctuation">;</span>\n  <span class="token comment">// scheduleCallback 进行了 taskQueue 的 push 操作</span>\n  <span class="token comment">// 这里是获取之前时间片未执行的操作</span>\n  currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>currentTask<span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">></span> currentTime<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 超时需要中断任务</span>\n      <span class="token keyword control-flow">break</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    currentTask<span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>         <span class="token comment">// 执行任务回调</span>\n    currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 重置当前时间</span>\n    currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 获取新的任务</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果当前任务不为空，表明是超时中断，返回 true</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看出，React 通过 expirationTime 来判断是否超时，如果超时就把任务放到后面来执行。所以，异步模型中 setTimeout 里面进行 setState，只要当前时间片没有结束（currentTime 小于 expirationTime），依旧可以将多个 setState 合并成一个。</p>\n<p>接下来我们再做一个实验，在 setTimeout 中连续进行 500 次的 setState，看看最后生效的次数。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">500</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">click add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>先看看同步模式下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-080523.gif" alt="同步模式"></p>\n<p>再看看异步模式下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-080619.gif" alt="异步模式"></p>\n<p>最后 setState 的次数是 81 次，表明这里的操作在 81 个时间片下进行的，每个时间片更新了一次。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>这篇文章前后花费时间比较久，看 React 的源码确实很痛苦，因为之前没有了解过，刚开始是看一些文章的分析，但是很多模棱两可的地方，无奈只能在源码上进行 debug，而且一次性看了 React 15、16 两个版本的代码，感觉脑子都有些不够用了。</p>\n<p>当然这篇文章只是简单介绍了更新机制从同步到异步的过程，其实 React 16 的更新除了异步之外，在时间片的划分、任务的优先级上还有很多细节，这些东西放到下篇文章来讲，不知不觉又是一个新坑。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "React \u67B6\u6784\u7684\u6F14\u53D8 - \u4ECE\u540C\u6B65\u5230\u5F02\u6B65"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>写这篇文章的目的，主要是想弄懂 React 最新的 fiber 架构到底是什么东西，但是看了网上的很多文章，要不模棱两可，要不就是一顿复制粘贴，根本看不懂，于是开始认真钻研源码。钻研过程中，发现我想得太简单了，React 源码的复杂程度远超我的想象，于是打算分几个模块了剖析，今天先讲一讲 React 的更新策略从同步变为异步的演变过程。</p>\n<h2 id="%E4%BB%8E-setstate-%E8%AF%B4%E8%B5%B7">从 setState 说起<a class="anchor" href="#%E4%BB%8E-setstate-%E8%AF%B4%E8%B5%B7">§</a></h2>\n<p>React 16 之所以要进行一次大重构，是因为 React 之前的版本有一些不可避免的缺陷，一些更新操作，需要由同步改成异步。所以我们先聊聊 React 15 是如何进行一次 setState 的。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 第一次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 第二次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 第三次调用</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'in callback\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text"> val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text"> </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>熟悉 React 的同学应该知道，在 React 的生命周期内，多次 setState 会被合并成一次，这里虽然连续进行了三次 setState，<code>state.val</code> 的值实际上只重新计算了一次。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-064122.png" alt="render结果"></p>\n<p>每次 setState 之后，立即获取 state 会发现并没有更新，只有在 setState 的回调函数内才能拿到最新的结果，这点通过我们在控制台输出的结果就可以证实。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-064348.png" alt="控制台输出"></p>\n<p>网上有很多文章称 setState 是『异步操作』，所以导致 setState 之后并不能获取到最新值，其实这个观点是错误的。setState 是一次同步操作，只是每次操作之后并没有立即执行，而是将 setState 进行了缓存，mount 流程结束或事件操作结束，才会拿出所有的 state 进行一次计算。如果 setState 脱离了 <code>React 的生命周期</code>或者 <code>React 提供的事件流</code>，setState 之后就能立即拿到结果。</p>\n<p>我们修改上面的代码，将 setState 放入 setTimeout 中，在下一个任务队列进行执行。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 第一次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n      <span class="token comment">// 第二次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text"> val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token plain-text"> </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>可以看到，setState 之后就能立即看到<code>state.val</code> 的值发生了变化。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-065254.png" alt="控制台输出"></p>\n<p>为了更加深入理解 setState，下面简单讲解一下React 15 中 setState 的更新逻辑，下面的代码是对源码的一些精简，并非完整逻辑。</p>\n<h3 id="%E6%97%A7%E7%89%88%E6%9C%AC-setstate-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">旧版本 setState 源码分析<a class="anchor" href="#%E6%97%A7%E7%89%88%E6%9C%AC-setstate-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">§</a></h3>\n<p>setState 的主要逻辑都在 ReactUpdateQueue 中实现，在调用 setState 后，并没有立即修改 state，而是将传入的参数放到了组件内部的 <code>_pendingStateQueue</code> 中，之后调用 <code>enqueueUpdate</code> 来进行更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 对外暴露的 React.Component</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">ReactComponent</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span> <span class="token operator">=</span> <span class="token maybe-class-name">ReactUpdateQueue</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// setState 方法挂载到原型链上</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 调用 setState 后，会调用内部的 updater.enqueueSetState</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueCallback</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> callback<span class="token punctuation">,</span> <span class="token string">\'setState\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingStateQueue 上暂存新的 state</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">;</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">enqueueCallback</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> callerName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 在组件的 _pendingCallbacks 上暂存 callback</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      component<span class="token punctuation">.</span><span class="token property-access">_pendingCallbacks</span> <span class="token operator">=</span> <span class="token punctuation">[</span>callback<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>enqueueUpdate</code> 首先会通过 <code>batchingStrategy.isBatchingUpdates</code> 判断当前是否在更新流程，如果不在更新流程，会调用 <code>batchingStrategy.batchedUpdates()</code> 进行更新。如果在流程中，会将待更新的组件放入 <code>dirtyComponents</code> 进行缓存。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> dirtyComponents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>batchingStrategy<span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 开始进行批量更新</span>\n    batchingStrategy<span class="token punctuation">.</span><span class="token method function property-access">batchedUpdates</span><span class="token punctuation">(</span>enqueueUpdate<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果在更新流程，则将组件放入脏组件队列，表示组件待更新</span>\n  dirtyComponents<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>batchingStrategy</code> 是 React 进行批处理的一种策略，该策略的实现基于 <code>Transaction</code>，虽然名字和数据库的事务一样，但是做的事情却不一样。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">ReactDefaultBatchingStrategyTransaction</span> <span class="token keyword">extends</span> <span class="token class-name">Transaction</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">reinitializeTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">getTransactionWrappers</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        close<span class="token operator">:</span> <span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">flushBatchedUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token function-variable function">close</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n          <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> transaction <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactDefaultBatchingStrategyTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> batchingStrategy <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 判断是否在更新流程中</span>\n  isBatchingUpdates<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n  <span class="token comment">// 开始进行批量更新</span>\n  <span class="token function-variable function">batchedUpdates</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 获取之前的更新状态</span>\n    <span class="token keyword">var</span> alreadyBatchingUpdates <span class="token operator">=</span> <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">;</span>\n    <span class="token comment">// 将更新状态修改为 true</span>\n    <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>alreadyBatchingUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果已经在更新状态中，等待之前的更新结束</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">callback</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 进行更新</span>\n      <span class="token keyword control-flow">return</span> transaction<span class="token punctuation">.</span><span class="token method function property-access">perform</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p><code>Transaction</code> 通过 perform 方法启动，然后通过扩展的 <code>getTransactionWrappers</code> 获取一个数组，该数组内存在多个 wrapper 对象，每个对象包含两个属性：<code>initialize</code>、<code>close</code>。perform 中会先调用所有的 <code>wrapper.initialize</code>，然后调用传入的回调，最后调用所有的 <code>wrapper.close</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">class</span> <span class="token class-name">Transaction</span> <span class="token punctuation">{</span>\n  <span class="token function">reinitializeTransaction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">getTransactionWrappers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">perform</span><span class="token punctuation">(</span><span class="token parameter">method<span class="token punctuation">,</span> scope<span class="token punctuation">,</span> <span class="token spread operator">...</span>param</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">initializeAll</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> ret <span class="token operator">=</span> method<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>scope<span class="token punctuation">,</span> <span class="token spread operator">...</span>param<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">closeAll</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> ret<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">initializeAll</span><span class="token punctuation">(</span><span class="token parameter">startIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> transactionWrappers <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> startIndex<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> transactionWrappers<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> wrapper <span class="token operator">=</span> transactionWrappers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n      wrapper<span class="token punctuation">.</span><span class="token method function property-access">initialize</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">closeAll</span><span class="token punctuation">(</span><span class="token parameter">startIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> transactionWrappers <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">transactionWrappers</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> startIndex<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> transactionWrappers<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> wrapper <span class="token operator">=</span> transactionWrappers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n      wrapper<span class="token punctuation">.</span><span class="token method function property-access">close</span><span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-075910.png" alt="transaction.perform"></p>\n<p>React 源代码的注释中，也形象的展示了这一过程。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">/*\n*                       wrappers (injected at creation time)\n*                                      +        +\n*                                      |        |\n*                    +-----------------|--------|--------------+\n*                    |                 v        |              |\n*                    |      +---------------+   |              |\n*                    |   +--|    wrapper1   |---|----+         |\n*                    |   |  +---------------+   v    |         |\n*                    |   |          +-------------+  |         |\n*                    |   |     +----|   wrapper2  |--------+   |\n*                    |   |     |    +-------------+  |     |   |\n*                    |   |     |                     |     |   |\n*                    |   v     v                     v     v   | wrapper\n*                    | +---+ +---+   +---------+   +---+ +---+ | invariants\n* perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained\n* +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | |   | |   |   |         |   |   | |   | |\n*                    | +---+ +---+   +---------+   +---+ +---+ |\n*                    |  initialize                    close    |\n*                    +-----------------------------------------+\n*/</span>\n</code></pre>\n<p>我们简化一下代码，再重新看一下 setState 的流程。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 1. 调用 Component.setState</span>\n<span class="token class-name">ReactComponent</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setState</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">updater</span><span class="token punctuation">.</span><span class="token method function property-access">enqueueSetState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 2. 调用 ReactUpdateQueue.enqueueSetState，将 state 值放到 _pendingStateQueue 进行缓存</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">ReactUpdateQueue</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">enqueueSetState</span><span class="token punctuation">(</span><span class="token parameter">component<span class="token punctuation">,</span> partialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> queue <span class="token operator">=</span> component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">||</span> <span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    queue<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>partialState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 3. 判断是否在更新过程中，如果不在就进行更新</span>\n<span class="token keyword">var</span> dirtyComponents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 如果之前没有更新，此时的 isBatchingUpdates 肯定是 false</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>batchingStrategy<span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 调用 batchingStrategy.batchedUpdates 进行更新</span>\n    batchingStrategy<span class="token punctuation">.</span><span class="token method function property-access">batchedUpdates</span><span class="token punctuation">(</span>enqueueUpdate<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  dirtyComponents<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 4. 进行更新，更新逻辑放入事务中进行处理</span>\n<span class="token keyword">var</span> batchingStrategy <span class="token operator">=</span> <span class="token punctuation">{</span>\n  isBatchingUpdates<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n  <span class="token comment">// 注意：此时的 callback 为 enqueueUpdate </span>\n  <span class="token function-variable function">batchedUpdates</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback<span class="token punctuation">,</span> component</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> alreadyBatchingUpdates <span class="token operator">=</span> <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span><span class="token punctuation">;</span>\n    <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>alreadyBatchingUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 如果已经在更新状态中，重新调用 enqueueUpdate，将 component 放入 dirtyComponents</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">callback</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 进行事务操作</span>\n      <span class="token keyword control-flow">return</span> transaction<span class="token punctuation">.</span><span class="token method function property-access">perform</span><span class="token punctuation">(</span>callback<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>启动事务可以拆分成三步来看：</p>\n<ol>\n<li>先执行 wrapper 的 initialize，此时的 initialize 都是一些空函数，可以直接跳过；</li>\n<li>然后执行 callback（也就是 enqueueUpdate），执行 enqueueUpdate 时，由于已经进入了更新状态，<code>batchingStrategy.isBatchingUpdates</code> 被修改成了 <code>true</code>，所以最后还是会把 component 放入脏组件队列，等待更新；</li>\n<li>后面执行的两个 close 方法，第一个方法的 <code>flushBatchedUpdates</code> 是用来进行组件更新的，第二个方法用来修改更新状态，表示更新已经结束。</li>\n</ol>\n<pre class="language-js"><code class="language-js"><span class="token function">getTransactionWrappers</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      close<span class="token operator">:</span> <span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">flushBatchedUpdates</span><span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span><span class="token maybe-class-name">ReactUpdates</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      <span class="token function-variable function">initialize</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">close</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token maybe-class-name">ReactDefaultBatchingStrategy</span><span class="token punctuation">.</span><span class="token property-access">isBatchingUpdates</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>flushBatchedUpdates</code> 里面会取出所有的脏组件队列进行 diff，最后更新到 DOM。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">flushBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>dirtyComponents<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">runBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">runBatchedUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 省略了一些去重和排序的操作</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> dirtyComponents<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> component <span class="token operator">=</span> dirtyComponents<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 判断组件是否需要更新，然后进行 diff 操作，最后更新 DOM。</span>\n    <span class="token maybe-class-name">ReactReconciler</span><span class="token punctuation">.</span><span class="token method function property-access">performUpdateIfNecessary</span><span class="token punctuation">(</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><code>performUpdateIfNecessary()</code> 会调用 <code>Component.updateComponent()</code>，在 <code>updateComponent()</code> 中，会从 <code>_pendingStateQueue</code> 中取出所有的值来更新。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 获取最新的 state</span>\n<span class="token function">_processPendingState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> inst <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_instance</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> queue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_pendingStateQueue</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">var</span> nextState <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>inst<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> queue<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> partial <span class="token operator">=</span> queue<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">assign</span><span class="token punctuation">(</span>\n      nextState<span class="token punctuation">,</span>\n      <span class="token keyword">typeof</span> partial <span class="token operator">===</span> <span class="token string">\'function\'</span> <span class="token operator">?</span> <span class="token function">partial</span><span class="token punctuation">(</span>inst<span class="token punctuation">,</span> nextState<span class="token punctuation">)</span> <span class="token operator">:</span> partial\n   <span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> nextState<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 更新组件</span>\n<span class="token function">updateComponent</span><span class="token punctuation">(</span><span class="token parameter">prevParentElement<span class="token punctuation">,</span> nextParentElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> inst <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_instance</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> prevProps <span class="token operator">=</span> prevParentElement<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> nextProps <span class="token operator">=</span> nextParentElement<span class="token punctuation">.</span><span class="token property-access">props</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> nextState <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">_processPendingState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> shouldUpdate <span class="token operator">=</span> \n      <span class="token operator">!</span><span class="token function">shallowEqual</span><span class="token punctuation">(</span>prevProps<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span> <span class="token operator">||</span>\n      <span class="token operator">!</span><span class="token function">shallowEqual</span><span class="token punctuation">(</span>inst<span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">,</span> nextState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>shouldUpdate<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// diff 、update DOM</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    inst<span class="token punctuation">.</span><span class="token property-access">props</span> <span class="token operator">=</span> nextProps<span class="token punctuation">;</span>\n    inst<span class="token punctuation">.</span><span class="token property-access">state</span> <span class="token operator">=</span> nextState<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 后续的操作包括判断组件是否需要更新、diff、更新到 DOM</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="setstate-%E5%90%88%E5%B9%B6%E5%8E%9F%E5%9B%A0">setState 合并原因<a class="anchor" href="#setstate-%E5%90%88%E5%B9%B6%E5%8E%9F%E5%9B%A0">§</a></h3>\n<p>按照刚刚讲解的逻辑，setState 的时候，<code>batchingStrategy.isBatchingUpdates</code> 为 <code>false</code> 会开启一个事务，将组件放入脏组件队列，最后进行更新操作，而且这里都是同步操作。讲道理，setState 之后，我们可以立即拿到最新的 state。</p>\n<p>然而，事实并非如此，在 React 的生命周期及其事件流中，<code>batchingStrategy.isBatchingUpdates</code> 的值早就被修改成了 <code>true</code>。可以看看下面两张图：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-19-122451.png" alt="Mount"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-19-122327.png" alt="事件调用"></p>\n<p>在组件 mount 和事件调用的时候，都会调用 <code>batchedUpdates</code>，这个时候已经开始了事务，所以只要不脱离 React，不管多少次 setState 都会把其组件放入脏组件队列等待更新。一旦脱离 React 的管理，比如在 setTimeout 中，setState 立马变成单打独斗。</p>\n<h2 id="concurrent-%E6%A8%A1%E5%BC%8F">Concurrent 模式<a class="anchor" href="#concurrent-%E6%A8%A1%E5%BC%8F">§</a></h2>\n<p>React 16 引入的 Fiber 架构，就是为了后续的异步渲染能力做铺垫，虽然架构已经切换，但是异步渲染的能力并没有正式上线，我们只能在实验版中使用。异步渲染指的是 <a href="https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html">Concurrent 模式</a>，下面是官网的介绍：</p>\n<blockquote>\n<p>Concurrent 模式是 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。</p>\n</blockquote>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-020049.png" alt="优点"></p>\n<p>除了 Concurrent 模式，React 还提供了另外两个模式， Legacy 模式依旧是同步更新的方式，可以认为和旧版本保持一致的兼容模式，而 Blocking 模式是一个过渡版本。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-141550.png" alt="模式差异"></p>\n<p>Concurrent 模式说白就是让组件更新异步化，切分时间片，渲染之前的调度、diff、更新都只在指定时间片进行，如果超时就暂停放到下个时间片进行，中途给浏览器一个喘息的时间。</p>\n<blockquote>\n<p>浏览器是单线程，它将 GUI 描绘，时间器处理，事件处理，JS 执行，远程资源加载统统放在一起。当做某件事，只有将它做完才能做下一件事。如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化，一些 DOM 操作，内部也会对 reflow 进行处理。reflow 是一个性能黑洞，很可能让页面的大多数元素进行重新布局。</p>\n<p>浏览器的运作流程: <code>渲染 -&gt; tasks -&gt; 渲染 -&gt; tasks -&gt; 渲染 -&gt; ....</code></p>\n<p>这些 tasks 中有些我们可控，有些不可控，比如 setTimeout 什么时候执行不好说，它总是不准时；资源加载时间不可控。但一些JS我们可以控制，让它们分派执行，tasks的时长不宜过长，这样浏览器就有时间优化 JS 代码与修正 reflow ！</p>\n<p>总结一句，<strong>就是让浏览器休息好，浏览器就能跑得更快</strong>。</p>\n<p>-- by 司徒正美 <a href="https://zhuanlan.zhihu.com/p/37095662">《React Fiber架构》</a></p>\n</blockquote>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-020125.png" alt="模式差异"></p>\n<p>这里有个 demo，上面是一个🌟围绕☀️运转的动画，下面是 React 定时 setState 更新视图，同步模式下，每次 setState 都会造成上面的动画卡顿，而异步模式下的动画就很流畅。</p>\n<p><strong><a href="https://pomber.github.io/incremental-rendering-demo/react-sync.html">同步模式</a>：</strong></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-061056.gif" alt="同步模式"></p>\n<p><strong><a href="https://pomber.github.io/incremental-rendering-demo/react-async.html">异步模式</a>：</strong></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-061249.gif" alt="异步模式"></p>\n<h3 id="%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8">如何使用<a class="anchor" href="#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8">§</a></h3>\n<p>虽然很多文章都在介绍 Concurrent 模式，但是这个能力并没有真正上线，想要使用只能安装实验版本。也可以直接通过这个 cdn ：<a href="https://unpkg.com/browse/react@0.0.0-experimental-94c0244ba/">https://unpkg.com/browse/react@0.0.0-experimental-94c0244ba/</a> 。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> <a class="token email-link" href="mailto:react@experimental">react@experimental</a> <a class="token email-link" href="mailto:react-dom@experimental">react-dom@experimental</a>\n</code></pre>\n<p>如果要开启 Concurrent 模式，不能使用之前的 <code>ReactDOM.render</code>，需要替换成 <code>ReactDOM.createRoot</code>，而在实验版本中，由于 API 不够稳定， 需要通过 <code>ReactDOM.unstable_createRoot</code> 来启用 Concurrent 模式。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">ReactDOM</span></span> <span class="token keyword module">from</span> <span class="token string">\'react-dom\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">App</span></span> <span class="token keyword module">from</span> <span class="token string">\'./App\'</span><span class="token punctuation">;</span>\n\n<span class="token maybe-class-name">ReactDOM</span><span class="token punctuation">.</span><span class="token method function property-access">unstable_createRoot</span><span class="token punctuation">(</span>\n  <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'root\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span><span class="token maybe-class-name">App</span> <span class="token operator">/</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h3 id="setstate-%E5%90%88%E5%B9%B6%E6%9B%B4%E6%96%B0">setState 合并更新<a class="anchor" href="#setstate-%E5%90%88%E5%B9%B6%E6%9B%B4%E6%96%B0">§</a></h3>\n<p>还记得之前 React15 的案例中，setTimeout 中进行 setState ，<code>state.val</code> 的值会立即发生变化。同样的代码，我们拿到 Concurrent 模式下运行一次。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 第一次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'first setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n      <span class="token comment">// 第二次调用</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'second setState\'</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      \n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token operator">&lt;</span>div<span class="token operator">></span> val<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span> <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-22-142406.png" alt="控制台输出"></p>\n<p>说明在 Concurrent 模式下，即使脱离了 React 的生命周期，setState 依旧能够合并更新。主要原因是 Concurrent 模式下，真正的更新操作被移到了下一个事件队列中，类似于 Vue 的 nextTick。</p>\n<h3 id="%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6%E5%8F%98%E6%9B%B4">更新机制变更<a class="anchor" href="#%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6%E5%8F%98%E6%9B%B4">§</a></h3>\n<p>我们修改一下 demo，然后看下点击按钮之后的调用栈。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">click add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-053734.png" alt="调用栈"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-054804.png" alt="调用栈"></p>\n<p><code>onClick</code> 触发后，进行 setState 操作，然后调用 enquueState 方法，到这里看起来好像和之前的模式一样，但是后面的操作基本都变了，因为 React 16 中已经没有了事务一说。</p>\n<pre class="language-js"><code class="language-js"><span class="token maybe-class-name">Component</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">enquueState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">scheduleUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token arrow operator">=></span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token parameter">flushWork</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>真正的异步化逻辑就在 <code>requestHostCallback</code>、<code>postMessage</code> 里面，这是 React 内部自己实现的一个调度器：<a href="https://github.com/facebook/react/blob/v16.13.1/packages/scheduler/index.js">https://github.com/facebook/react/blob/v16.13.1/packages/scheduler/index.js</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">unstable_scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">priorityLevel<span class="token punctuation">,</span> calback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> startTime <span class="token operator">=</span> currentTime <span class="token operator">+</span> delay<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> newTask <span class="token operator">=</span> <span class="token punctuation">{</span>\n    id<span class="token operator">:</span> taskIdCounter<span class="token operator">++</span><span class="token punctuation">,</span>\n    startTime<span class="token operator">:</span> startTime<span class="token punctuation">,</span>           <span class="token comment">// 任务开始时间</span>\n    expirationTime<span class="token operator">:</span> expirationTime<span class="token punctuation">,</span> <span class="token comment">// 任务终止时间</span>\n    priorityLevel<span class="token operator">:</span> priorityLevel<span class="token punctuation">,</span>   <span class="token comment">// 调度优先级</span>\n    callback<span class="token operator">:</span> callback<span class="token punctuation">,</span>             <span class="token comment">// 回调函数</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>startTime <span class="token operator">></span> currentTime<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 超时处理，将任务放到 taskQueue，下一个时间片执行</span>\n    <span class="token comment">// 源码中其实是 timerQueue，后续会有个操作将 timerQueue 的 task 转移到 taskQueue</span>\n    <span class="token function">push</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">,</span> newTask<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token function">requestHostCallback</span><span class="token punctuation">(</span>flushWork<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> newTask<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>requestHostCallback 的实现依赖于 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel">MessageChannel</a>，但是 MessageChannel 在这里并不是做消息通信用的，而是利用它的异步能力，给浏览器一个喘息的机会。说起 MessageChannel，Vue 2.5 的 nextTick 也有使用，但是 2.6 发布时又取消了。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-070234.png" alt="vue@2.5"></p>\n<p>MessageChannel 会暴露两个对象，<code>port1</code> 和 <code>port2</code>，<code>port1</code> 发送的消息能被 <code>port2</code> 接收，同样 <code>port2</code> 发送的消息也能被 <code>port1</code> 接收，只是接收消息的时机会放到下一个 macroTask 中。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> <span class="token punctuation">{</span> port1<span class="token punctuation">,</span> port2 <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// port1 接收 port2 的消息</span>\nport1<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">msg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'MessageChannel exec\'</span><span class="token punctuation">)</span> <span class="token punctuation">}</span>\n<span class="token comment">// port2 发送消息</span>\nport2<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n\n<span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token parameter">r</span> <span class="token arrow operator">=></span> <span class="token function">r</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'promise exec\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'setTimeout exec\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'start run\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-035707.png" alt="执行结果"></p>\n<p>可以看到，<code>port1</code> 接收消息的时机比 Promise 所在的 microTask 要晚，但是早于 setTimeout。React 利用这个能力，给了浏览器一个喘息的时间，不至于被饿死。</p>\n<p>还是之前的案例，同步更新时没有给浏览器任何喘息，造成视图的卡顿。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-071927.png" alt="同步更新"></p>\n<p>异步更新时，拆分了时间片，给了浏览器充分的时间更新动画。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-072105.png" alt="异步更新"></p>\n<p>还是回到代码层面，看看 React 是如何利用 MessageChannel 的。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">var</span> isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 更新状态</span>\n<span class="token keyword">var</span> scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span> <span class="token comment">// 全局的回调</span>\n<span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> port <span class="token operator">=</span> channel<span class="token punctuation">.</span><span class="token property-access">port2</span><span class="token punctuation">;</span>\n\nchannel<span class="token punctuation">.</span><span class="token property-access">port1</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>scheduledHostCallback <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 重置超时时间</span>\n    deadline <span class="token operator">=</span> currentTime <span class="token operator">+</span> yieldInterval<span class="token punctuation">;</span>\n    <span class="token keyword">var</span> hasTimeRemaining <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 执行 callback</span>\n    <span class="token keyword">var</span> hasMoreWork <span class="token operator">=</span> <span class="token function">scheduledHostCallback</span><span class="token punctuation">(</span>hasTimeRemaining<span class="token punctuation">,</span> currentTime<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 已经没有任务了，修改状态</span>\n      isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n      scheduledHostCallback <span class="token operator">=</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 还有任务，放到下个任务队列执行，给浏览器喘息的机会</span>\n      port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token function-variable function">requestHostCallback</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// callback 挂载到 scheduledHostCallback</span>\n  scheduledHostCallback <span class="token operator">=</span> callback<span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMessageLoopRunning<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    isMessageLoopRunning <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n    <span class="token comment">// 推送消息，下个队列队列调用 callback</span>\n    port<span class="token punctuation">.</span><span class="token method function property-access">postMessage</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>再看看之前传入的 callback（<code>flushWork</code>），调用 <code>workLoop</code>，取出 taskQueue 中的任务执行。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了相当多的代码</span>\n<span class="token keyword">function</span> <span class="token function">flushWork</span><span class="token punctuation">(</span><span class="token parameter">hasTimeRemaining<span class="token punctuation">,</span> initialTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">workLoop</span><span class="token punctuation">(</span>hasTimeRemaining<span class="token punctuation">,</span> initialTime<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">workLoop</span><span class="token punctuation">(</span><span class="token parameter">hasTimeRemaining<span class="token punctuation">,</span> initialTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> currentTime <span class="token operator">=</span> initialTime<span class="token punctuation">;</span>\n  <span class="token comment">// scheduleCallback 进行了 taskQueue 的 push 操作</span>\n  <span class="token comment">// 这里是获取之前时间片未执行的操作</span>\n  currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>currentTask<span class="token punctuation">.</span><span class="token property-access">expirationTime</span> <span class="token operator">></span> currentTime<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 超时需要中断任务</span>\n      <span class="token keyword control-flow">break</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    currentTask<span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>         <span class="token comment">// 执行任务回调</span>\n    currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 重置当前时间</span>\n    currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 获取新的任务</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果当前任务不为空，表明是超时中断，返回 true</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看出，React 通过 expirationTime 来判断是否超时，如果超时就把任务放到后面来执行。所以，异步模型中 setTimeout 里面进行 setState，只要当前时间片没有结束（currentTime 小于 expirationTime），依旧可以将多个 setState 合并成一个。</p>\n<p>接下来我们再做一个实验，在 setTimeout 中连续进行 500 次的 setState，看看最后生效的次数。</p>\n<pre class="language-jsx"><code class="language-jsx"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">React</span></span> <span class="token keyword module">from</span> <span class="token string">\'react\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">React<span class="token punctuation">.</span>Component</span> <span class="token punctuation">{</span>\n  state <span class="token operator">=</span> <span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span>\n  <span class="token function">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">500</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> val<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token operator">+</span> <span class="token number">1</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">clickBtn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">></span></span><span class="token plain-text">click add</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span><span class="token plain-text">\n      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">val: </span><span class="token punctuation">{</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">state</span><span class="token punctuation">.</span><span class="token property-access">val</span> <span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token plain-text">\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token maybe-class-name">App</span><span class="token punctuation">;</span>\n</code></pre>\n<p>先看看同步模式下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-080523.gif" alt="同步模式"></p>\n<p>再看看异步模式下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-23-080619.gif" alt="异步模式"></p>\n<p>最后 setState 的次数是 81 次，表明这里的操作在 81 个时间片下进行的，每个时间片更新了一次。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>这篇文章前后花费时间比较久，看 React 的源码确实很痛苦，因为之前没有了解过，刚开始是看一些文章的分析，但是很多模棱两可的地方，无奈只能在源码上进行 debug，而且一次性看了 React 15、16 两个版本的代码，感觉脑子都有些不够用了。</p>\n<p>当然这篇文章只是简单介绍了更新机制从同步到异步的过程，其实 React 16 的更新除了异步之外，在时间片的划分、任务的优先级上还有很多细节，这些东西放到下篇文章来讲，不知不觉又是一个新坑。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%BB%8E-setstate-%E8%AF%B4%E8%B5%B7" }, "\u4ECE setState \u8BF4\u8D77"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%97%A7%E7%89%88%E6%9C%AC-setstate-%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90" }, "\u65E7\u7248\u672C setState \u6E90\u7801\u5206\u6790")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#setstate-%E5%90%88%E5%B9%B6%E5%8E%9F%E5%9B%A0" }, "setState \u5408\u5E76\u539F\u56E0")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#concurrent-%E6%A8%A1%E5%BC%8F" }, "Concurrent \u6A21\u5F0F"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8" }, "\u5982\u4F55\u4F7F\u7528")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#setstate-%E5%90%88%E5%B9%B6%E6%9B%B4%E6%96%B0" }, "setState \u5408\u5E76\u66F4\u65B0")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%9B%B4%E6%96%B0%E6%9C%BA%E5%88%B6%E5%8F%98%E6%9B%B4" }, "\u66F4\u65B0\u673A\u5236\u53D8\u66F4")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/09/23",
    'updated': null,
    'excerpt': "写这篇文章的目的，主要是想弄懂 React 最新的 fiber 架构到底是什么东西，但是看了网上的很多文章，要不模棱两可，要不就是一顿复制粘贴，根本看不懂，于是开始认真钻研源码。钻研过程中，发现我想得太简单了，React 源码的复...",
    'cover': "https://file.shenfq.com/ipic/2020-09-22-064122.png",
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
                "excerpt": "前言 早期的 Web 应用中，与后台进行交互时，需要进行 form 表单的提交，然后在页面刷新后给用户反馈结果。在页面刷新过程做，后台会重新返回一段 HTML 代码，这段 HTML 中的大部分内容与之前页面基本相同，这势必造成了流量的...",
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
                "name": "Node.js",
                "count": 8
            },
            {
                "name": "Go",
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
                "name": "随便写写",
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
                "name": "JavaScript",
                "count": 8
            },
            {
                "name": "Go",
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
                "name": "随便写写",
                "count": 1
            }
        ]
    }
};
