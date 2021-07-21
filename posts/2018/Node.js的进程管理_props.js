import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2018/Node.js的进程管理.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/Node.js的进程管理.html",
    'title': "Node.js的进程管理",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>Node.js的进程管理</h1>\n<p>众所周知Node基于V8，而在V8中JavaScript是单线程运行的，这里的单线程不是指Node启动的时候就只有一个线程，而是说运行JavaScript代码是在单线程上，Node还有其他线程，比如进行异步IO操作的IO线程。这种单线程模型带来的好处就是系统调度过程中不会频繁进行上下文切换，提升了单核CPU的利用率。</p>\n<p>但是这种做法有个缺陷，就是我们无法利用服务器CPU多核的性能，一个Node进程只能利用一个CPU。而且单线程模式下一旦代码崩溃就是整个程序崩溃。通常解决方案就是使用Node的cluster模块，通过<code>master-worker</code>模式启用多个进程实例。下面我们详细讲述下，Node如何使用多进程模型利用多核CPU，以及自带的cluster模块具体的工作原理。</p>\n<!-- more -->\n<h2 id="%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%AD%90%E8%BF%9B%E7%A8%8B">如何创建子进程<a class="anchor" href="#%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%AD%90%E8%BF%9B%E7%A8%8B">§</a></h2>\n<p>node提供了<code>child_process</code>模块用来进行子进程的创建，该模块一共有四个方法用来创建子进程。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> spawn<span class="token punctuation">,</span> exec<span class="token punctuation">,</span> execFile<span class="token punctuation">,</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token function">spawn</span><span class="token punctuation">(</span>command<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">exec</span><span class="token punctuation">(</span>command<span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> callback<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">execFile</span><span class="token punctuation">(</span>file<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> callback<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">fork</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<h3 id="spawn">spawn<a class="anchor" href="#spawn">§</a></h3>\n<p>首先认识一下spawn方法，下面是Node文档的官方实例。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> spawn <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">spawn</span><span class="token punctuation">(</span><span class="token string">\'ls\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'-lh\'</span><span class="token punctuation">,</span> <span class="token string">\'/home\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'close\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">子进程退出码：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> stdin<span class="token punctuation">,</span> stdout<span class="token punctuation">,</span> stderr <span class="token punctuation">}</span> <span class="token operator">=</span> child\n\nstdout<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stdout: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nstderr<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stderr: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过spawn创建的子进程，继承自EventEmitter，所以可以在上面进行事件（<code>discount</code>，<code>error</code>，<code>close</code>，<code>message</code>）的监听。同时子进程具有三个输入输出流：stdin、stdout、stderr，通过这三个流，可以实时获取子进程的输入输出和错误信息。</p>\n<p>这个方法的最终实现基于libuv，这里不再展开讨论，感兴趣可以查看<a href="https://github.com/nodejs/node/blob/v10.14.2/src/process_wrap.cc#L256">源码</a>。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token operator">/</span><span class="token operator">/</span> 调用libuv的api，初始化一个进程\nint err <span class="token operator">=</span> <span class="token function">uv_spawn</span><span class="token punctuation">(</span>env<span class="token operator">-</span><span class="token operator">></span><span class="token function">event_loop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>wrap<span class="token operator">-</span><span class="token operator">></span>process_<span class="token punctuation">,</span> <span class="token operator">&amp;</span>options<span class="token punctuation">)</span><span class="token comment">;</span>\n</code></pre>\n<h3 id="execexecfile">exec/execFile<a class="anchor" href="#execexecfile">§</a></h3>\n<p>之所以把这两个放到一起，是因为exec最后调用的就是execFile方法，源码在<a href="https://github.com/nodejs/node/blob/v10.14.2/lib/child_process.js#L150">这里</a>。唯一的区别是，exec中调用的<code>normalizeExecArgs</code>方法会将opts的shell属性默认设置为true。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exec</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">exec</span><span class="token punctuation">(</span><span class="token comment">/* command , options, callback */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> opts <span class="token operator">=</span> normalizeExecArgs<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> exports<span class="token punctuation">.</span><span class="token method function property-access">execFile</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">file</span><span class="token punctuation">,</span> opts<span class="token punctuation">.</span><span class="token property-access">options</span><span class="token punctuation">,</span> opts<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">normalizeExecArgs</span><span class="token punctuation">(</span><span class="token parameter">command<span class="token punctuation">,</span> options<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  options <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>options <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">=</span> <span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">?</span> options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span> options <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在execFile中，最终调用的是<code>spawn</code>方法。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">execFile</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">execFile</span><span class="token punctuation">(</span>file <span class="token comment">/* , args, options, callback */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> callback<span class="token punctuation">;</span>\n  <span class="token keyword">let</span> options<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token function">spawn</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> args<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token comment">// ... some options</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword control-flow">return</span> child<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>exec会将spawn的输入输出流转换成String，默认使用UTF-8的编码，然后传递给回调函数，使用回调方式在node中较为熟悉，比流更容易操作，所以我们能使用exec方法执行一些<code>shell</code>命令，然后在回调中获取返回值。有点需要注意，这里的buffer是有最大缓存区的，如果超出会直接被kill掉，可用通过maxBuffer属性进行配置（默认: 200*1024）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> exec <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">\'ls -lh /home\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> stdout<span class="token punctuation">,</span> stderr</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stdout: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>stdout<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stderr: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>stderr<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h3 id="fork">fork<a class="anchor" href="#fork">§</a></h3>\n<p>fork最后也是调用spawn来创建子进程，但是fork是spawn的一种特殊情况，用于衍生新的 Node.js 进程，会产生一个新的V8实例，所以执行fork方法时需要指定一个js文件。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fork</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">fork</span><span class="token punctuation">(</span>modulePath <span class="token comment">/* , args, options */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  \n  options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token function">spawn</span><span class="token punctuation">(</span>options<span class="token punctuation">.</span><span class="token property-access">execPath</span><span class="token punctuation">,</span> args<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过fork创建子进程之后，父子进程直接会创建一个IPC（进程间通信）通道，方便父子进程直接通信，在js层使用 <code>process.send(message)</code> 和 <code>process.on(\'message\', msg =&gt; {})</code> 进行通信。而在底层，实现进程间通信的方式有很多，Node的进程间通信基于libuv实现，不同操作系统实现方式不一致。在*unix系统中采用Unix Domain Socket方式实现，Windows中使用命名管道的方式实现。</p>\n<blockquote>\n<p>常见进程间通信方式：消息队列、共享内存、pipe、信号量、套接字</p>\n</blockquote>\n<p>下面是一个父子进程通信的实例。</p>\n<p><strong>parent.js</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'child.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token parameter">msg</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'message from child\'</span><span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token string">\'hello child, I\'m master\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><strong>child.js</strong></p>\n<pre class="language-javascript"><code class="language-javascript">process<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token parameter">msg</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'message from master:\'</span><span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">let</span> counter <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    child<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    counter<span class="token operator">:</span> counter<span class="token operator">++</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/37414156.jpg" alt="image"></p>\n<h3 id="%E5%B0%8F%E7%BB%93">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>其实可以看到，这些方法都是对spawn方法的复用，然后spawn方法底层调用了libuv进行进程的管理，具体可以看下图。</p>\n<p><img src="https://file.shenfq.com/19-1-9/67988038.jpg" alt="image"></p>\n<h2 id="%E5%88%A9%E7%94%A8fork%E5%AE%9E%E7%8E%B0master-worker%E6%A8%A1%E5%9E%8B">利用fork实现<code>master-worker</code>模型<a class="anchor" href="#%E5%88%A9%E7%94%A8fork%E5%AE%9E%E7%8E%B0master-worker%E6%A8%A1%E5%9E%8B">§</a></h2>\n<p>首先来看看，如果我们在<code>child.js</code>中启动一个http服务会发生什么情况。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span><span class="token string">\'./child.js\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// child.js</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span>\nhttp<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  res<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'Hello World\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/87041789.jpg" alt="image"></p>\n<pre class="language-autoit"><code class="language-autoit">              <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n              |              |\n              |    master    |\n              |              |\n     <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span> <span class="token operator">-</span><span class="token operator">-</span> <span class="token operator">-</span><span class="token operator">-</span> <span class="token operator">-</span>\n     |                                 |\n     |                          Error<span class="token punctuation">:</span> listen EADDRINUSE\n     |                                 |\n     |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n|         |                      |         |\n| worker1 |                      | worker2 |\n|         |                      |         |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n   ：<span class="token number">8000</span>                            ：<span class="token number">8000</span>\n\n</code></pre>\n<p>我们fork了两个子进程，因为两个子进程同时对一个端口进行监听，Node会直接抛出一个异常（<code>Error: listen EADDRINUSE</code>），如上图所示。那么我们能不能使用代理模式，同时监听多个端口，让master进程监听80端口收到请求时，再将请求分发给不同服务，而且master进程还能做适当的负载均衡。</p>\n<pre class="language-autoit"><code class="language-autoit">              <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n              |              |\n              |    master    |\n              |     ：<span class="token number">80</span>     |\n     <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n     |                                 |\n     |                                 |\n     |                                 |\n     |                                 |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n|         |                      |         |\n| worker1 |                      | worker2 |\n|         |                      |         |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n   ：<span class="token number">8000</span>                            ：<span class="token number">8001</span>\n</code></pre>\n<p>但是这么做又会带来另一个问题，代理模式中十分消耗文件描述符（linux系统默认的最大文件描述符限制是1024），文件描述符在windows系统中称为句柄（handle），习惯性的我们也可以称linux中的文件描述符为句柄。当用户进行访问，首先连接到master进程，会消耗一个句柄，然后master进程再代理到worker进程又会消耗掉一个句柄，所以这种做法十分浪费系统资源。为了解决这个问题，Node的进程间通信可以发送句柄，节省系统资源。</p>\n<blockquote>\n<p>句柄是一种特殊的智能指针 。当一个应用程序要引用其他系统（如数据库、操作系统）所管理的内存块或对象时，就要使用句柄。</p>\n</blockquote>\n<p>我们可以在master进程启动一个tcp服务，然后通过IPC将服务的句柄发送给子进程，子进程再对服务的连接事件进行监听，具体代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">var</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> server <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'net\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nserver<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'connection\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">socket</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  socket<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'handled by master\'</span><span class="token punctuation">)</span> <span class="token comment">// 响应来自master</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\nserver<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'master listening on: \'</span><span class="token punctuation">,</span> <span class="token number">3000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span><span class="token string">\'./child.js\'</span><span class="token punctuation">)</span>\n  child<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token string">\'server\'</span><span class="token punctuation">,</span> server<span class="token punctuation">)</span> <span class="token comment">// 发送句柄给worker</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'worker create, pid is \'</span><span class="token punctuation">,</span> child<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// child.js</span>\nprocess<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">msg<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>msg <span class="token operator">!==</span> <span class="token string">\'server\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取到句柄后，进行请求的监听</span>\n  handler<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'connection\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">socket</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    socket<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'handled by worker, pid is \'</span> <span class="token operator">+</span> process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token punctuation">)</span>  \n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/4257973.jpg" alt="启动服务"></p>\n<p>下面我们通过<code>curl</code>连续请求 5 次服务。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token keyword">for</span> <span class="token for-or-select variable">varible1</span> <span class="token keyword">in</span> <span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token number">5</span><span class="token punctuation">}</span>\n<span class="token keyword">do</span>\n  <span class="token function">curl</span> <span class="token string">"localhost:3000"</span>\n<span class="token keyword">done</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/13847319.jpg" alt="请求服务"></p>\n<p>可以看到，响应请求的可以是父进程，也可以是不同子进程，多个进程对同一个服务响应的连接事件监听，谁先抢占，就由谁进行响应。这里就会出现一个Linux网络编程中很常见的事件，当多个进程同时监听网络的连接事件，当这个有新的连接到达时，这些进程被同时唤醒，这被称为“惊群”。这样导致的情况就是，一旦事件到达，每个进程同时去响应这一个事件，而最终只有一个进程能处理事件成功，其他的进程在处理该事件失败后重新休眠，造成了系统资源的浪费。</p>\n<p><img src="https://file.shenfq.com/19-1-9/82240458.jpg" alt="image"></p>\n<blockquote>\n<p>ps：在windows系统上，永远都是最后定义的子进程抢占到句柄，这可能和libuv的实现机制有关，具体原因往有大佬能够指点。</p>\n</blockquote>\n<p><img src="https://file.shenfq.com/19-1-9/19078214.jpg" alt="image"></p>\n<p>出现这样的问题肯定是大家都不愿意的嘛，这个时候我们就想起了<code>nginx</code>的好了，这里<a href="https://blog.csdn.net/russell_tao/article/details/7204260">有篇文章</a>讲解了nginx是如何解决“惊群”的，利用nginx的反向代理可以有效地解决这个问题，毕竟nginx本来就很擅长这种问题。</p>\n<pre class="language-autoit"><code class="language-autoit">http { \n  upstream node { \n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8000</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8001</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8002</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8003</span><span class="token comment">;</span>\n      keepalive <span class="token number">64</span><span class="token comment">;</span>\n  } \n  server { \n       listen <span class="token number">80</span><span class="token comment">; </span>\n       server_name shenfq<span class="token punctuation">.</span>com<span class="token comment">; </span>\n       location <span class="token operator">/</span> { \n            proxy_set_header X<span class="token operator">-</span>Real<span class="token operator">-</span>IP <span class="token variable">$remote_addr</span><span class="token comment">;</span>\n            proxy_set_header X<span class="token operator">-</span>Forwarded<span class="token operator">-</span><span class="token keyword">For</span> <span class="token variable">$proxy_add_x_forwarded_for</span><span class="token comment">;</span>\n            proxy_set_header Host <span class="token variable">$http_host</span><span class="token comment">;</span>\n            proxy_set_header X<span class="token operator">-</span>Nginx<span class="token operator">-</span>Proxy <span class="token boolean">true</span><span class="token comment">;</span>\n            proxy_set_header Connection <span class="token string">""</span><span class="token comment">;</span>\n            proxy_pass http<span class="token punctuation">:</span><span class="token operator">/</span><span class="token operator">/</span>node<span class="token comment">; # 这里要和最上面upstream后的应用名一致，可以自定义</span>\n       } \n  }\n}\n</code></pre>\n<h3 id="%E5%B0%8F%E7%BB%93-1">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93-1">§</a></h3>\n<p>如果我们自己用Node原生来实现一个多进程模型，存在这样或者那样的问题，虽然最终我们借助了nginx达到了这个目的，但是使用nginx的话，我们需要另外维护一套nginx的配置，而且如果有一个Node服务挂了，nginx并不知道，还是会将请求转发到那个端口。</p>\n<h2 id="cluster%E6%A8%A1%E5%9D%97">cluster模块<a class="anchor" href="#cluster%E6%A8%A1%E5%9D%97">§</a></h2>\n<p>除了用nginx做反向代理，node本身也提供了一个<code>cluster</code>模块，用于多核CPU环境下多进程的负载均衡。cluster模块创建子进程本质上是通过child_procee.fork，利用该模块可以很容易的创建共享同一端口的子进程服务器。</p>\n<h3 id="%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97">上手指南<a class="anchor" href="#%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97">§</a></h3>\n<p>有了这个模块，你会感觉实现Node的单机集群是多么容易的一件事情。下面看看官方实例，短短的十几行代码就实现了一个多进程的Node服务，且自带负载均衡。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> cluster <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> numCPUs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">cpus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span>\n\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">isMaster</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 判断是否为主进程</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">主进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 正在运行</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 衍生工作进程。</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> numCPUs<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    cluster<span class="token punctuation">.</span><span class="token method function property-access">fork</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'exit\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">worker<span class="token punctuation">,</span> code<span class="token punctuation">,</span> signal</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">工作进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已退出</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// 子进程进行服务器创建</span>\n  <span class="token comment">// 工作进程可以共享任何 TCP 连接。</span>\n  <span class="token comment">// 在本例子中，共享的是一个 HTTP 服务器。</span>\n  http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    res<span class="token punctuation">.</span><span class="token method function property-access">writeHead</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    res<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'hello world\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">工作进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已启动</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/33436044.jpg" alt="image"></p>\n<h2 id="cluster%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">cluster模块源码分析<a class="anchor" href="#cluster%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">§</a></h2>\n<p>首先看代码，通过<code>isMaster</code>来判断是否为主进程，如果是主进程进行fork操作，子进程创建服务器。这里cluster进行fork操作时，执行的是当前文件。<code>cluster.fork</code>最终调用的<code>child_process.fork</code>，且第一个参数为<code>process.argv.slice(2)</code>，在fork子进程之后，会对其internalMessage事件进行监听，这个后面会提到，具体代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fork</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">env</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">setupMaster</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> id <span class="token operator">=</span> <span class="token operator">++</span>ids<span class="token punctuation">;</span>\n  <span class="token keyword">const</span> workerProcess <span class="token operator">=</span> <span class="token function">createWorkerProcess</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> env<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    id<span class="token operator">:</span> id<span class="token punctuation">,</span>\n    process<span class="token operator">:</span> workerProcess\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 监听子进程的消息</span>\n  worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token comment">// 配置master进程</span>\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setupMaster</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  cluster<span class="token punctuation">.</span><span class="token property-access">settings</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    args<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    exec<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n    execArgv<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">execArgv</span><span class="token punctuation">,</span>\n    silent<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>options\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 创建子进程</span>\n<span class="token keyword">function</span> <span class="token function">createWorkerProcess</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> env</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">fork</span><span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">.</span><span class="token property-access">exec</span><span class="token punctuation">,</span> cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">.</span><span class="token property-access">args</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token comment">// some options</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%AD%90%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3%E7%9B%91%E5%90%AC%E9%97%AE%E9%A2%98">子进程端口监听问题<a class="anchor" href="#%E5%AD%90%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3%E7%9B%91%E5%90%AC%E9%97%AE%E9%A2%98">§</a></h3>\n<p>这里会有一个问题，子进程全部都在监听同一个端口，我们之前已经试验过，服务监听同一个端口会出现端口占用的问题，那么cluster模块如何保证端口不冲突的呢？ 查阅<a href="https://github.com/nodejs/node/blob/v10.14.2/lib/_http_server.js#L309">源码</a>发现，http模块的createServer继承自net模块。</p>\n<pre class="language-javascript"><code class="language-javascript">util<span class="token punctuation">.</span><span class="token method function property-access">inherits</span><span class="token punctuation">(</span><span class="token maybe-class-name">Server</span><span class="token punctuation">,</span> net<span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Server</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>而在net模块中，listen方法会调用listenInCluster方法，listenInCluster判断当前是否为master进程。</p>\n<p><a href="https://github.com/nodejs/node/blob/v10.14.2/lib/net.js#L1370">lib/net.js</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Server</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">listen</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">===</span> <span class="token string">\'number\'</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">===</span> <span class="token string">\'string\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果listen方法只传入了端口号，最后会走到这里</span>\n    <span class="token function">listenInCluster</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">|</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> <span class="token keyword nil">undefined</span><span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token property-access">exclusive</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">listenInCluster</span><span class="token punctuation">(</span><span class="token parameter">server<span class="token punctuation">,</span> address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> exclusive<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> cluster <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">isMaster</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果是主进程则启动一个服务</span>\n    <span class="token comment">// 但是主进程没有调用过listen方法，所以没有走这里一步</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> serverQuery <span class="token operator">=</span> <span class="token punctuation">{</span>\n    address<span class="token operator">:</span> address<span class="token punctuation">,</span>\n    port<span class="token operator">:</span> port<span class="token punctuation">,</span>\n    addressType<span class="token operator">:</span> addressType<span class="token punctuation">,</span>\n    fd<span class="token operator">:</span> fd<span class="token punctuation">,</span>\n    flags<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n \n  <span class="token comment">// 子进程获取主进程服务的句柄</span>\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">_getServer</span><span class="token punctuation">(</span>server<span class="token punctuation">,</span> serverQuery<span class="token punctuation">,</span> listenOnMasterHandle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword">function</span> <span class="token function">listenOnMasterHandle</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    server<span class="token punctuation">.</span><span class="token property-access">_handle</span> <span class="token operator">=</span> handle<span class="token punctuation">;</span> <span class="token comment">// 重写handle，对listen方法进行了hack</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>看上面代码可以知道，真正启动服务的方法为<code>server._listen2</code>。在<code>_listen2</code>方法中，最终调用的是<code>_handle</code>下的listen方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">setupListenHandle</span><span class="token punctuation">(</span><span class="token parameter">address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">.</span><span class="token property-access">onconnection</span> <span class="token operator">=</span> onconnection<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> err <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span>backlog <span class="token operator">||</span> <span class="token number">511</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Server</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">_listen2</span> <span class="token operator">=</span> setupListenHandle<span class="token punctuation">;</span>  <span class="token comment">// legacy alias</span>\n</code></pre>\n<p>那么<code>cluster._getServer</code>方法到底做了什么呢？</p>\n<p>搜寻它的源码，首先向master进程发送了一个消息，消息类型为<code>queryServer</code>。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// child.js</span>\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_getServer</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> options<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  \n  <span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token punctuation">{</span>\n    act<span class="token operator">:</span> <span class="token string">\'queryServer\'</span><span class="token punctuation">,</span>\n    index<span class="token punctuation">,</span>\n    data<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>options\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 发送消息到master进程，消息类型为 queryServer</span>\n  <span class="token function">send</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">reply<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">rr</span><span class="token punctuation">(</span>reply<span class="token punctuation">,</span> indexesKey<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>              <span class="token comment">// Round-robin.</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这里的rr方法，对前面提到的<code>_handle.listen</code>进行了hack，所有子进程的listen其实是不起作用的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">rr</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> indexesKey<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">errno</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">errno</span><span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">var</span> key <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token parameter">backlog</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// listen方法直接返回0，不再进行端口监听</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span> act<span class="token operator">:</span> <span class="token string">\'close\'</span><span class="token punctuation">,</span> key <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">getsockname</span><span class="token punctuation">(</span><span class="token parameter">out</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> handle <span class="token operator">=</span> <span class="token punctuation">{</span> close<span class="token punctuation">,</span> listen<span class="token punctuation">,</span> ref<span class="token operator">:</span> noop<span class="token punctuation">,</span> unref<span class="token operator">:</span> noop <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  \n  handles<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 根据key将工作进程的 handle 进行缓存</span>\n  <span class="token function">cb</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 这里的cb回调就是前面_getServer方法传入的。 参考之前net模块的listen方法</span>\n<span class="token keyword">function</span> <span class="token function">listenOnMasterHandle</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  server<span class="token punctuation">.</span><span class="token property-access">_handle</span> <span class="token operator">=</span> handle<span class="token punctuation">;</span> <span class="token comment">// 重写handle，对listen方法进行了hack</span>\n  <span class="token comment">// 该方法调用后，会对handle绑定一个 onconnection 方法，最后会进行调用</span>\n  server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<h3 id="%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1">主进程与子进程通信<a class="anchor" href="#%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1">§</a></h3>\n<p>那么到底在哪里对端口进行了监听呢？</p>\n<p>前面提到过，fork子进程的时候，对子进程进行了internalMessage事件的监听。</p>\n<pre class="language-autoit"><code class="language-autoit">worker<span class="token punctuation">.</span>process<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token comment">;</span>\n</code></pre>\n<p>子进程向master进程发送消息，一般使用<code>process.send</code>方法，会被监听的<code>message</code>事件所接收。这里是因为发送的message指定了<code>cmd: \'NODE_CLUSTER\'</code>，只要cmd字段以<code>NODE_</code>开头，这样消息就会认为是内部通信，被internalMessage事件所接收。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// child.js</span>\n<span class="token keyword">function</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">sendHelper</span><span class="token punctuation">(</span>process<span class="token punctuation">,</span> message<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// utils.js</span>\n<span class="token keyword">function</span> <span class="token function">sendHelper</span><span class="token punctuation">(</span><span class="token parameter">proc<span class="token punctuation">,</span> message<span class="token punctuation">,</span> handle<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>proc<span class="token punctuation">.</span><span class="token property-access">connected</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// Mark message as internal. See INTERNAL_PREFIX in lib/child_process.js</span>\n  message <span class="token operator">=</span> <span class="token punctuation">{</span> cmd<span class="token operator">:</span> <span class="token string">\'NODE_CLUSTER\'</span><span class="token punctuation">,</span> <span class="token spread operator">...</span>message<span class="token punctuation">,</span> seq <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> cb <span class="token operator">===</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span>\n    callbacks<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>seq<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  seq <span class="token operator">+=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> proc<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>master进程接收到消息后，根据act的类型开始执行不同的方法，这里act为<code>queryServer</code>。queryServer方法会构造一个key，如果这个key（规则主要为地址+端口+文件描述符）之前不存在，则对<code>RoundRobinHandle</code>构造函数进行了实例化，RoundRobinHandle构造函数中启动了一个TCP服务，并对之前指定的端口进行了监听。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">const</span> handles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">onmessage</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'online\'</span><span class="token punctuation">)</span>\n    <span class="token function">online</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'queryServer\'</span><span class="token punctuation">)</span>\n    <span class="token function">queryServer</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// other act logic</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">queryServer</span><span class="token punctuation">(</span><span class="token parameter">worker<span class="token punctuation">,</span> message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword">const</span> key <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">address</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">port</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">addressType</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token template-punctuation string">`</span></span> <span class="token operator">+</span>\n              <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">fd</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">index</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> handle <span class="token operator">=</span> handles<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 如果之前没有对该key进行实例化，则进行实例化</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>handle <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> address <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">address</span><span class="token punctuation">;</span>\n    <span class="token comment">// const RoundRobinHandle = require(\'internal/cluster/round_robin_handle\');</span>\n    <span class="token keyword">var</span> constructor <span class="token operator">=</span> <span class="token maybe-class-name">RoundRobinHandle</span><span class="token punctuation">;</span>\n\n    handle <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">constructor</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span>\n                             address<span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">port</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">addressType</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">fd</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">flags</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    handles<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// internal/cluster/round_robin_handle</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">RoundRobinHandle</span></span><span class="token punctuation">(</span><span class="token parameter">key<span class="token punctuation">,</span> address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span> <span class="token operator">=</span> net<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span>assert<span class="token punctuation">.</span><span class="token property-access">fail</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 这里启动一个TCP服务器</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token punctuation">{</span> port<span class="token punctuation">,</span> host <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// TCP服务器启动时的事件</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token method function property-access">once</span><span class="token punctuation">(</span><span class="token string">\'listening\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onconnection</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看到TCP服务启动后，立马对<code>connection</code>事件进行了监听，会调用RoundRobinHandle的distribute方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// RoundRobinHandle</span>\n<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onconnection</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// distribute 对工作进程进行分发</span>\n<span class="token class-name">RoundRobinHandle</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">distribute</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handles</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 存入TCP服务的句柄</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">free</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 取出第一个工作进程</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>worker<span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">handoff</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 切换到工作进程</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token class-name">RoundRobinHandle</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">handoff</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">worker</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> handle <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handles</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 获取TCP服务句柄</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>handle <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">free</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 将该工作进程重新放入队列中</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token punctuation">{</span> act<span class="token operator">:</span> <span class="token string">\'newconn\'</span><span class="token punctuation">,</span> key<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 向工作进程发送一个类型为 newconn 的消息以及TCP服务的句柄</span>\n  <span class="token function">sendHelper</span><span class="token punctuation">(</span>worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">,</span> message<span class="token punctuation">,</span> handle<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">reply</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>reply<span class="token punctuation">.</span><span class="token property-access">accepted</span><span class="token punctuation">)</span>\n      handle<span class="token punctuation">.</span><span class="token method function property-access">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">else</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 工作进程不能正常运行，启动下一个</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">handoff</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在子进程中也有对内部消息进行监听，在<code>cluster/child.js</code>中，有个<code>cluster._setupWorker</code>方法，该方法会对内部消息监听，该方法的在<code>lib/internal/bootstrap/node.js</code>中调用，这个文件是每次启动node命令后，由C++模块调用的。</p>\n<p><a href="https://github.com/nodejs/node/blob/v10.14.2/lib/internal/bootstrap/node.js#L337">链接</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">startup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">startExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">startExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">prepareUserCodeExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">prepareUserCodeExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">NODE_UNIQUE_ID</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> cluster <span class="token operator">=</span> <span class="token maybe-class-name">NativeModule</span><span class="token punctuation">.</span><span class="token method function property-access">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    cluster<span class="token punctuation">.</span><span class="token method function property-access">_setupWorker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">delete</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">NODE_UNIQUE_ID</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">startup</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>下面看看_setupWorker方法做了什么。</p>\n<pre class="language-javascript"><code class="language-javascript">cluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_setupWorker</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">onmessage</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果act为 newconn 调用onconnection方法</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'newconn\'</span><span class="token punctuation">)</span>\n      <span class="token function">onconnection</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'disconnect\'</span><span class="token punctuation">)</span>\n      _disconnect<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">onconnection</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> key <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> server <span class="token operator">=</span> handles<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> accepted <span class="token operator">=</span> server <span class="token operator">!==</span> <span class="token keyword nil">undefined</span><span class="token punctuation">;</span>\n\n  <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span> ack<span class="token operator">:</span> message<span class="token punctuation">.</span><span class="token property-access">seq</span><span class="token punctuation">,</span> accepted <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>accepted<span class="token punctuation">)</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">onconnection</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 调用net中的onconnection方法</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后子进程获取到客户端句柄后，调用net模块的onconnection，对Socket进行实例化，后面就与其他http请求的逻辑一致了，不再细讲。</p>\n<p>至此，cluster模块的逻辑就走通了。</p>\n<h2 id="%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5">参考链接<a class="anchor" href="#%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5">§</a></h2>\n<ul>\n<li><a href="https://github.com/hustxiaoc/node.js/issues/11">当我们谈论 cluster 时我们在谈论什么</a></li>\n<li><a href="https://cnodejs.org/topic/56e84480833b7c8a0492e20c">通过源码解析 Node.js 中 cluster 模块的主要功能实现</a></li>\n<li><a href="http://nodejs.cn/api/child_process.html">child_process 文档</a></li>\n<li><a href="http://nodejs.cn/api/cluster.html">cluster 文档</a></li>\n</ul>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "Node.js\u7684\u8FDB\u7A0B\u7BA1\u7406"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>众所周知Node基于V8，而在V8中JavaScript是单线程运行的，这里的单线程不是指Node启动的时候就只有一个线程，而是说运行JavaScript代码是在单线程上，Node还有其他线程，比如进行异步IO操作的IO线程。这种单线程模型带来的好处就是系统调度过程中不会频繁进行上下文切换，提升了单核CPU的利用率。</p>\n<p>但是这种做法有个缺陷，就是我们无法利用服务器CPU多核的性能，一个Node进程只能利用一个CPU。而且单线程模式下一旦代码崩溃就是整个程序崩溃。通常解决方案就是使用Node的cluster模块，通过<code>master-worker</code>模式启用多个进程实例。下面我们详细讲述下，Node如何使用多进程模型利用多核CPU，以及自带的cluster模块具体的工作原理。</p>\n<!-- more -->\n<h2 id="%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%AD%90%E8%BF%9B%E7%A8%8B">如何创建子进程<a class="anchor" href="#%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%AD%90%E8%BF%9B%E7%A8%8B">§</a></h2>\n<p>node提供了<code>child_process</code>模块用来进行子进程的创建，该模块一共有四个方法用来创建子进程。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> spawn<span class="token punctuation">,</span> exec<span class="token punctuation">,</span> execFile<span class="token punctuation">,</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token function">spawn</span><span class="token punctuation">(</span>command<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">exec</span><span class="token punctuation">(</span>command<span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> callback<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">execFile</span><span class="token punctuation">(</span>file<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> callback<span class="token punctuation">]</span><span class="token punctuation">)</span>\n\n<span class="token function">fork</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">[</span><span class="token punctuation">,</span> args<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">,</span> options<span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<h3 id="spawn">spawn<a class="anchor" href="#spawn">§</a></h3>\n<p>首先认识一下spawn方法，下面是Node文档的官方实例。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> spawn <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">spawn</span><span class="token punctuation">(</span><span class="token string">\'ls\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'-lh\'</span><span class="token punctuation">,</span> <span class="token string">\'/home\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'close\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">code</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">子进程退出码：</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>code<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> stdin<span class="token punctuation">,</span> stdout<span class="token punctuation">,</span> stderr <span class="token punctuation">}</span> <span class="token operator">=</span> child\n\nstdout<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stdout: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nstderr<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stderr: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过spawn创建的子进程，继承自EventEmitter，所以可以在上面进行事件（<code>discount</code>，<code>error</code>，<code>close</code>，<code>message</code>）的监听。同时子进程具有三个输入输出流：stdin、stdout、stderr，通过这三个流，可以实时获取子进程的输入输出和错误信息。</p>\n<p>这个方法的最终实现基于libuv，这里不再展开讨论，感兴趣可以查看<a href="https://github.com/nodejs/node/blob/v10.14.2/src/process_wrap.cc#L256">源码</a>。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token operator">/</span><span class="token operator">/</span> 调用libuv的api，初始化一个进程\nint err <span class="token operator">=</span> <span class="token function">uv_spawn</span><span class="token punctuation">(</span>env<span class="token operator">-</span><span class="token operator">></span><span class="token function">event_loop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>wrap<span class="token operator">-</span><span class="token operator">></span>process_<span class="token punctuation">,</span> <span class="token operator">&amp;</span>options<span class="token punctuation">)</span><span class="token comment">;</span>\n</code></pre>\n<h3 id="execexecfile">exec/execFile<a class="anchor" href="#execexecfile">§</a></h3>\n<p>之所以把这两个放到一起，是因为exec最后调用的就是execFile方法，源码在<a href="https://github.com/nodejs/node/blob/v10.14.2/lib/child_process.js#L150">这里</a>。唯一的区别是，exec中调用的<code>normalizeExecArgs</code>方法会将opts的shell属性默认设置为true。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exec</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">exec</span><span class="token punctuation">(</span><span class="token comment">/* command , options, callback */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> opts <span class="token operator">=</span> normalizeExecArgs<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> exports<span class="token punctuation">.</span><span class="token method function property-access">execFile</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">file</span><span class="token punctuation">,</span> opts<span class="token punctuation">.</span><span class="token property-access">options</span><span class="token punctuation">,</span> opts<span class="token punctuation">.</span><span class="token property-access">callback</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">normalizeExecArgs</span><span class="token punctuation">(</span><span class="token parameter">command<span class="token punctuation">,</span> options<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  options <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token spread operator">...</span>options <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">=</span> <span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">===</span> <span class="token string">\'string\'</span> <span class="token operator">?</span> options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span> options <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在execFile中，最终调用的是<code>spawn</code>方法。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">execFile</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">execFile</span><span class="token punctuation">(</span>file <span class="token comment">/* , args, options, callback */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token keyword">let</span> callback<span class="token punctuation">;</span>\n  <span class="token keyword">let</span> options<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token function">spawn</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> args<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token comment">// ... some options</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword control-flow">return</span> child<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>exec会将spawn的输入输出流转换成String，默认使用UTF-8的编码，然后传递给回调函数，使用回调方式在node中较为熟悉，比流更容易操作，所以我们能使用exec方法执行一些<code>shell</code>命令，然后在回调中获取返回值。有点需要注意，这里的buffer是有最大缓存区的，如果超出会直接被kill掉，可用通过maxBuffer属性进行配置（默认: 200*1024）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> exec <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">\'ls -lh /home\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> stdout<span class="token punctuation">,</span> stderr</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stdout: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>stdout<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">stderr: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>stderr<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h3 id="fork">fork<a class="anchor" href="#fork">§</a></h3>\n<p>fork最后也是调用spawn来创建子进程，但是fork是spawn的一种特殊情况，用于衍生新的 Node.js 进程，会产生一个新的V8实例，所以执行fork方法时需要指定一个js文件。</p>\n<pre class="language-javascript"><code class="language-javascript">exports<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fork</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">fork</span><span class="token punctuation">(</span>modulePath <span class="token comment">/* , args, options */</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  \n  options<span class="token punctuation">.</span><span class="token property-access">shell</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token function">spawn</span><span class="token punctuation">(</span>options<span class="token punctuation">.</span><span class="token property-access">execPath</span><span class="token punctuation">,</span> args<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>通过fork创建子进程之后，父子进程直接会创建一个IPC（进程间通信）通道，方便父子进程直接通信，在js层使用 <code>process.send(message)</code> 和 <code>process.on(\'message\', msg =&gt; {})</code> 进行通信。而在底层，实现进程间通信的方式有很多，Node的进程间通信基于libuv实现，不同操作系统实现方式不一致。在*unix系统中采用Unix Domain Socket方式实现，Windows中使用命名管道的方式实现。</p>\n<blockquote>\n<p>常见进程间通信方式：消息队列、共享内存、pipe、信号量、套接字</p>\n</blockquote>\n<p>下面是一个父子进程通信的实例。</p>\n<p><strong>parent.js</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'child.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token parameter">msg</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'message from child\'</span><span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nchild<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token string">\'hello child, I\'m master\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><strong>child.js</strong></p>\n<pre class="language-javascript"><code class="language-javascript">process<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token parameter">msg</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'message from master:\'</span><span class="token punctuation">,</span> msg<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">let</span> counter <span class="token operator">=</span> <span class="token number">0</span>\n<span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    child<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    counter<span class="token operator">:</span> counter<span class="token operator">++</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/37414156.jpg" alt="image"></p>\n<h3 id="%E5%B0%8F%E7%BB%93">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>其实可以看到，这些方法都是对spawn方法的复用，然后spawn方法底层调用了libuv进行进程的管理，具体可以看下图。</p>\n<p><img src="https://file.shenfq.com/19-1-9/67988038.jpg" alt="image"></p>\n<h2 id="%E5%88%A9%E7%94%A8fork%E5%AE%9E%E7%8E%B0master-worker%E6%A8%A1%E5%9E%8B">利用fork实现<code>master-worker</code>模型<a class="anchor" href="#%E5%88%A9%E7%94%A8fork%E5%AE%9E%E7%8E%B0master-worker%E6%A8%A1%E5%9E%8B">§</a></h2>\n<p>首先来看看，如果我们在<code>child.js</code>中启动一个http服务会发生什么情况。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span><span class="token string">\'./child.js\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// child.js</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span>\nhttp<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  res<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'Hello World\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/87041789.jpg" alt="image"></p>\n<pre class="language-autoit"><code class="language-autoit">              <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n              |              |\n              |    master    |\n              |              |\n     <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span> <span class="token operator">-</span><span class="token operator">-</span> <span class="token operator">-</span><span class="token operator">-</span> <span class="token operator">-</span>\n     |                                 |\n     |                          Error<span class="token punctuation">:</span> listen EADDRINUSE\n     |                                 |\n     |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n|         |                      |         |\n| worker1 |                      | worker2 |\n|         |                      |         |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n   ：<span class="token number">8000</span>                            ：<span class="token number">8000</span>\n\n</code></pre>\n<p>我们fork了两个子进程，因为两个子进程同时对一个端口进行监听，Node会直接抛出一个异常（<code>Error: listen EADDRINUSE</code>），如上图所示。那么我们能不能使用代理模式，同时监听多个端口，让master进程监听80端口收到请求时，再将请求分发给不同服务，而且master进程还能做适当的负载均衡。</p>\n<pre class="language-autoit"><code class="language-autoit">              <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n              |              |\n              |    master    |\n              |     ：<span class="token number">80</span>     |\n     <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n     |                                 |\n     |                                 |\n     |                                 |\n     |                                 |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span>v<span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n|         |                      |         |\n| worker1 |                      | worker2 |\n|         |                      |         |\n<span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>                      <span class="token operator">+</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">-</span><span class="token operator">+</span>\n   ：<span class="token number">8000</span>                            ：<span class="token number">8001</span>\n</code></pre>\n<p>但是这么做又会带来另一个问题，代理模式中十分消耗文件描述符（linux系统默认的最大文件描述符限制是1024），文件描述符在windows系统中称为句柄（handle），习惯性的我们也可以称linux中的文件描述符为句柄。当用户进行访问，首先连接到master进程，会消耗一个句柄，然后master进程再代理到worker进程又会消耗掉一个句柄，所以这种做法十分浪费系统资源。为了解决这个问题，Node的进程间通信可以发送句柄，节省系统资源。</p>\n<blockquote>\n<p>句柄是一种特殊的智能指针 。当一个应用程序要引用其他系统（如数据库、操作系统）所管理的内存块或对象时，就要使用句柄。</p>\n</blockquote>\n<p>我们可以在master进程启动一个tcp服务，然后通过IPC将服务的句柄发送给子进程，子进程再对服务的连接事件进行监听，具体代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">var</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> server <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'net\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nserver<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'connection\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">socket</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  socket<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'handled by master\'</span><span class="token punctuation">)</span> <span class="token comment">// 响应来自master</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\nserver<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'master listening on: \'</span><span class="token punctuation">,</span> <span class="token number">3000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token function">fork</span><span class="token punctuation">(</span><span class="token string">\'./child.js\'</span><span class="token punctuation">)</span>\n  child<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span><span class="token string">\'server\'</span><span class="token punctuation">,</span> server<span class="token punctuation">)</span> <span class="token comment">// 发送句柄给worker</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'worker create, pid is \'</span><span class="token punctuation">,</span> child<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// child.js</span>\nprocess<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'message\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">msg<span class="token punctuation">,</span> handler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>msg <span class="token operator">!==</span> <span class="token string">\'server\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 获取到句柄后，进行请求的监听</span>\n  handler<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'connection\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">socket</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    socket<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'handled by worker, pid is \'</span> <span class="token operator">+</span> process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token punctuation">)</span>  \n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/4257973.jpg" alt="启动服务"></p>\n<p>下面我们通过<code>curl</code>连续请求 5 次服务。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token keyword">for</span> <span class="token for-or-select variable">varible1</span> <span class="token keyword">in</span> <span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">..</span><span class="token number">5</span><span class="token punctuation">}</span>\n<span class="token keyword">do</span>\n  <span class="token function">curl</span> <span class="token string">"localhost:3000"</span>\n<span class="token keyword">done</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/13847319.jpg" alt="请求服务"></p>\n<p>可以看到，响应请求的可以是父进程，也可以是不同子进程，多个进程对同一个服务响应的连接事件监听，谁先抢占，就由谁进行响应。这里就会出现一个Linux网络编程中很常见的事件，当多个进程同时监听网络的连接事件，当这个有新的连接到达时，这些进程被同时唤醒，这被称为“惊群”。这样导致的情况就是，一旦事件到达，每个进程同时去响应这一个事件，而最终只有一个进程能处理事件成功，其他的进程在处理该事件失败后重新休眠，造成了系统资源的浪费。</p>\n<p><img src="https://file.shenfq.com/19-1-9/82240458.jpg" alt="image"></p>\n<blockquote>\n<p>ps：在windows系统上，永远都是最后定义的子进程抢占到句柄，这可能和libuv的实现机制有关，具体原因往有大佬能够指点。</p>\n</blockquote>\n<p><img src="https://file.shenfq.com/19-1-9/19078214.jpg" alt="image"></p>\n<p>出现这样的问题肯定是大家都不愿意的嘛，这个时候我们就想起了<code>nginx</code>的好了，这里<a href="https://blog.csdn.net/russell_tao/article/details/7204260">有篇文章</a>讲解了nginx是如何解决“惊群”的，利用nginx的反向代理可以有效地解决这个问题，毕竟nginx本来就很擅长这种问题。</p>\n<pre class="language-autoit"><code class="language-autoit">http { \n  upstream node { \n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8000</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8001</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8002</span><span class="token comment">; </span>\n      server <span class="token number">127.0</span><span class="token punctuation">.</span><span class="token number">0.1</span><span class="token punctuation">:</span><span class="token number">8003</span><span class="token comment">;</span>\n      keepalive <span class="token number">64</span><span class="token comment">;</span>\n  } \n  server { \n       listen <span class="token number">80</span><span class="token comment">; </span>\n       server_name shenfq<span class="token punctuation">.</span>com<span class="token comment">; </span>\n       location <span class="token operator">/</span> { \n            proxy_set_header X<span class="token operator">-</span>Real<span class="token operator">-</span>IP <span class="token variable">$remote_addr</span><span class="token comment">;</span>\n            proxy_set_header X<span class="token operator">-</span>Forwarded<span class="token operator">-</span><span class="token keyword">For</span> <span class="token variable">$proxy_add_x_forwarded_for</span><span class="token comment">;</span>\n            proxy_set_header Host <span class="token variable">$http_host</span><span class="token comment">;</span>\n            proxy_set_header X<span class="token operator">-</span>Nginx<span class="token operator">-</span>Proxy <span class="token boolean">true</span><span class="token comment">;</span>\n            proxy_set_header Connection <span class="token string">""</span><span class="token comment">;</span>\n            proxy_pass http<span class="token punctuation">:</span><span class="token operator">/</span><span class="token operator">/</span>node<span class="token comment">; # 这里要和最上面upstream后的应用名一致，可以自定义</span>\n       } \n  }\n}\n</code></pre>\n<h3 id="%E5%B0%8F%E7%BB%93-1">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93-1">§</a></h3>\n<p>如果我们自己用Node原生来实现一个多进程模型，存在这样或者那样的问题，虽然最终我们借助了nginx达到了这个目的，但是使用nginx的话，我们需要另外维护一套nginx的配置，而且如果有一个Node服务挂了，nginx并不知道，还是会将请求转发到那个端口。</p>\n<h2 id="cluster%E6%A8%A1%E5%9D%97">cluster模块<a class="anchor" href="#cluster%E6%A8%A1%E5%9D%97">§</a></h2>\n<p>除了用nginx做反向代理，node本身也提供了一个<code>cluster</code>模块，用于多核CPU环境下多进程的负载均衡。cluster模块创建子进程本质上是通过child_procee.fork，利用该模块可以很容易的创建共享同一端口的子进程服务器。</p>\n<h3 id="%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97">上手指南<a class="anchor" href="#%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97">§</a></h3>\n<p>有了这个模块，你会感觉实现Node的单机集群是多么容易的一件事情。下面看看官方实例，短短的十几行代码就实现了一个多进程的Node服务，且自带负载均衡。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> cluster <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> numCPUs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">cpus</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span>\n\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">isMaster</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 判断是否为主进程</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">主进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 正在运行</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 衍生工作进程。</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> numCPUs<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    cluster<span class="token punctuation">.</span><span class="token method function property-access">fork</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'exit\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">worker<span class="token punctuation">,</span> code<span class="token punctuation">,</span> signal</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">工作进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已退出</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span> <span class="token comment">// 子进程进行服务器创建</span>\n  <span class="token comment">// 工作进程可以共享任何 TCP 连接。</span>\n  <span class="token comment">// 在本例子中，共享的是一个 HTTP 服务器。</span>\n  http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    res<span class="token punctuation">.</span><span class="token method function property-access">writeHead</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    res<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'hello world\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">工作进程 </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">pid</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已启动</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/19-1-9/33436044.jpg" alt="image"></p>\n<h2 id="cluster%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">cluster模块源码分析<a class="anchor" href="#cluster%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90">§</a></h2>\n<p>首先看代码，通过<code>isMaster</code>来判断是否为主进程，如果是主进程进行fork操作，子进程创建服务器。这里cluster进行fork操作时，执行的是当前文件。<code>cluster.fork</code>最终调用的<code>child_process.fork</code>，且第一个参数为<code>process.argv.slice(2)</code>，在fork子进程之后，会对其internalMessage事件进行监听，这个后面会提到，具体代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token punctuation">{</span> fork <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'child_process\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fork</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">env</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">setupMaster</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> id <span class="token operator">=</span> <span class="token operator">++</span>ids<span class="token punctuation">;</span>\n  <span class="token keyword">const</span> workerProcess <span class="token operator">=</span> <span class="token function">createWorkerProcess</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> env<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Worker</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n    id<span class="token operator">:</span> id<span class="token punctuation">,</span>\n    process<span class="token operator">:</span> workerProcess\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 监听子进程的消息</span>\n  worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token comment">// 配置master进程</span>\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">setupMaster</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  cluster<span class="token punctuation">.</span><span class="token property-access">settings</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    args<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    exec<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n    execArgv<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">execArgv</span><span class="token punctuation">,</span>\n    silent<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>options\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 创建子进程</span>\n<span class="token keyword">function</span> <span class="token function">createWorkerProcess</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> env</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">fork</span><span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">.</span><span class="token property-access">exec</span><span class="token punctuation">,</span> cluster<span class="token punctuation">.</span><span class="token property-access">settings</span><span class="token punctuation">.</span><span class="token property-access">args</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    <span class="token comment">// some options</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%AD%90%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3%E7%9B%91%E5%90%AC%E9%97%AE%E9%A2%98">子进程端口监听问题<a class="anchor" href="#%E5%AD%90%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3%E7%9B%91%E5%90%AC%E9%97%AE%E9%A2%98">§</a></h3>\n<p>这里会有一个问题，子进程全部都在监听同一个端口，我们之前已经试验过，服务监听同一个端口会出现端口占用的问题，那么cluster模块如何保证端口不冲突的呢？ 查阅<a href="https://github.com/nodejs/node/blob/v10.14.2/lib/_http_server.js#L309">源码</a>发现，http模块的createServer继承自net模块。</p>\n<pre class="language-javascript"><code class="language-javascript">util<span class="token punctuation">.</span><span class="token method function property-access">inherits</span><span class="token punctuation">(</span><span class="token maybe-class-name">Server</span><span class="token punctuation">,</span> net<span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Server</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>而在net模块中，listen方法会调用listenInCluster方法，listenInCluster判断当前是否为master进程。</p>\n<p><a href="https://github.com/nodejs/node/blob/v10.14.2/lib/net.js#L1370">lib/net.js</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Server</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">listen</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">===</span> <span class="token string">\'number\'</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">===</span> <span class="token string">\'string\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果listen方法只传入了端口号，最后会走到这里</span>\n    <span class="token function">listenInCluster</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token property-access">port</span> <span class="token operator">|</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> <span class="token keyword nil">undefined</span><span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token property-access">exclusive</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">listenInCluster</span><span class="token punctuation">(</span><span class="token parameter">server<span class="token punctuation">,</span> address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> exclusive<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> cluster <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>cluster<span class="token punctuation">.</span><span class="token property-access">isMaster</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果是主进程则启动一个服务</span>\n    <span class="token comment">// 但是主进程没有调用过listen方法，所以没有走这里一步</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> serverQuery <span class="token operator">=</span> <span class="token punctuation">{</span>\n    address<span class="token operator">:</span> address<span class="token punctuation">,</span>\n    port<span class="token operator">:</span> port<span class="token punctuation">,</span>\n    addressType<span class="token operator">:</span> addressType<span class="token punctuation">,</span>\n    fd<span class="token operator">:</span> fd<span class="token punctuation">,</span>\n    flags<span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n \n  <span class="token comment">// 子进程获取主进程服务的句柄</span>\n  cluster<span class="token punctuation">.</span><span class="token method function property-access">_getServer</span><span class="token punctuation">(</span>server<span class="token punctuation">,</span> serverQuery<span class="token punctuation">,</span> listenOnMasterHandle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token keyword">function</span> <span class="token function">listenOnMasterHandle</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    server<span class="token punctuation">.</span><span class="token property-access">_handle</span> <span class="token operator">=</span> handle<span class="token punctuation">;</span> <span class="token comment">// 重写handle，对listen方法进行了hack</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>看上面代码可以知道，真正启动服务的方法为<code>server._listen2</code>。在<code>_listen2</code>方法中，最终调用的是<code>_handle</code>下的listen方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">setupListenHandle</span><span class="token punctuation">(</span><span class="token parameter">address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">.</span><span class="token property-access">onconnection</span> <span class="token operator">=</span> onconnection<span class="token punctuation">;</span>\n  <span class="token keyword">var</span> err <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span>backlog <span class="token operator">||</span> <span class="token number">511</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Server</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">_listen2</span> <span class="token operator">=</span> setupListenHandle<span class="token punctuation">;</span>  <span class="token comment">// legacy alias</span>\n</code></pre>\n<p>那么<code>cluster._getServer</code>方法到底做了什么呢？</p>\n<p>搜寻它的源码，首先向master进程发送了一个消息，消息类型为<code>queryServer</code>。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// child.js</span>\ncluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_getServer</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">obj<span class="token punctuation">,</span> options<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  \n  <span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token punctuation">{</span>\n    act<span class="token operator">:</span> <span class="token string">\'queryServer\'</span><span class="token punctuation">,</span>\n    index<span class="token punctuation">,</span>\n    data<span class="token operator">:</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span>options\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 发送消息到master进程，消息类型为 queryServer</span>\n  <span class="token function">send</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">reply<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">rr</span><span class="token punctuation">(</span>reply<span class="token punctuation">,</span> indexesKey<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>              <span class="token comment">// Round-robin.</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这里的rr方法，对前面提到的<code>_handle.listen</code>进行了hack，所有子进程的listen其实是不起作用的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">rr</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> indexesKey<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">errno</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">cb</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">errno</span><span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">var</span> key <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token parameter">backlog</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// listen方法直接返回0，不再进行端口监听</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span> act<span class="token operator">:</span> <span class="token string">\'close\'</span><span class="token punctuation">,</span> key <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">getsockname</span><span class="token punctuation">(</span><span class="token parameter">out</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">0</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> handle <span class="token operator">=</span> <span class="token punctuation">{</span> close<span class="token punctuation">,</span> listen<span class="token punctuation">,</span> ref<span class="token operator">:</span> noop<span class="token punctuation">,</span> unref<span class="token operator">:</span> noop <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  \n  handles<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 根据key将工作进程的 handle 进行缓存</span>\n  <span class="token function">cb</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 这里的cb回调就是前面_getServer方法传入的。 参考之前net模块的listen方法</span>\n<span class="token keyword">function</span> <span class="token function">listenOnMasterHandle</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  server<span class="token punctuation">.</span><span class="token property-access">_handle</span> <span class="token operator">=</span> handle<span class="token punctuation">;</span> <span class="token comment">// 重写handle，对listen方法进行了hack</span>\n  <span class="token comment">// 该方法调用后，会对handle绑定一个 onconnection 方法，最后会进行调用</span>\n  server<span class="token punctuation">.</span><span class="token method function property-access">_listen2</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> backlog<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<h3 id="%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1">主进程与子进程通信<a class="anchor" href="#%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1">§</a></h3>\n<p>那么到底在哪里对端口进行了监听呢？</p>\n<p>前面提到过，fork子进程的时候，对子进程进行了internalMessage事件的监听。</p>\n<pre class="language-autoit"><code class="language-autoit">worker<span class="token punctuation">.</span>process<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token comment">;</span>\n</code></pre>\n<p>子进程向master进程发送消息，一般使用<code>process.send</code>方法，会被监听的<code>message</code>事件所接收。这里是因为发送的message指定了<code>cmd: \'NODE_CLUSTER\'</code>，只要cmd字段以<code>NODE_</code>开头，这样消息就会认为是内部通信，被internalMessage事件所接收。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// child.js</span>\n<span class="token keyword">function</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">sendHelper</span><span class="token punctuation">(</span>process<span class="token punctuation">,</span> message<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// utils.js</span>\n<span class="token keyword">function</span> <span class="token function">sendHelper</span><span class="token punctuation">(</span><span class="token parameter">proc<span class="token punctuation">,</span> message<span class="token punctuation">,</span> handle<span class="token punctuation">,</span> cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>proc<span class="token punctuation">.</span><span class="token property-access">connected</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// Mark message as internal. See INTERNAL_PREFIX in lib/child_process.js</span>\n  message <span class="token operator">=</span> <span class="token punctuation">{</span> cmd<span class="token operator">:</span> <span class="token string">\'NODE_CLUSTER\'</span><span class="token punctuation">,</span> <span class="token spread operator">...</span>message<span class="token punctuation">,</span> seq <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> cb <span class="token operator">===</span> <span class="token string">\'function\'</span><span class="token punctuation">)</span>\n    callbacks<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>seq<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  seq <span class="token operator">+=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> proc<span class="token punctuation">.</span><span class="token method function property-access">send</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>master进程接收到消息后，根据act的类型开始执行不同的方法，这里act为<code>queryServer</code>。queryServer方法会构造一个key，如果这个key（规则主要为地址+端口+文件描述符）之前不存在，则对<code>RoundRobinHandle</code>构造函数进行了实例化，RoundRobinHandle构造函数中启动了一个TCP服务，并对之前指定的端口进行了监听。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// master.js</span>\n<span class="token keyword">const</span> handles <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">onmessage</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'online\'</span><span class="token punctuation">)</span>\n    <span class="token function">online</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'queryServer\'</span><span class="token punctuation">)</span>\n    <span class="token function">queryServer</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// other act logic</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">queryServer</span><span class="token punctuation">(</span><span class="token parameter">worker<span class="token punctuation">,</span> message</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword">const</span> key <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">address</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">port</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">addressType</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token template-punctuation string">`</span></span> <span class="token operator">+</span>\n              <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">fd</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token punctuation">.</span><span class="token property-access">index</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> handle <span class="token operator">=</span> handles<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 如果之前没有对该key进行实例化，则进行实例化</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>handle <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> address <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">address</span><span class="token punctuation">;</span>\n    <span class="token comment">// const RoundRobinHandle = require(\'internal/cluster/round_robin_handle\');</span>\n    <span class="token keyword">var</span> constructor <span class="token operator">=</span> <span class="token maybe-class-name">RoundRobinHandle</span><span class="token punctuation">;</span>\n\n    handle <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">constructor</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span>\n                             address<span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">port</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">addressType</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">fd</span><span class="token punctuation">,</span>\n                             message<span class="token punctuation">.</span><span class="token property-access">flags</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    handles<span class="token punctuation">.</span><span class="token method function property-access">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// internal/cluster/round_robin_handle</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">RoundRobinHandle</span></span><span class="token punctuation">(</span><span class="token parameter">key<span class="token punctuation">,</span> address<span class="token punctuation">,</span> port<span class="token punctuation">,</span> addressType<span class="token punctuation">,</span> fd<span class="token punctuation">,</span> flags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span> <span class="token operator">=</span> net<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span>assert<span class="token punctuation">.</span><span class="token property-access">fail</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 这里启动一个TCP服务器</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token punctuation">{</span> port<span class="token punctuation">,</span> host <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// TCP服务器启动时的事件</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token method function property-access">once</span><span class="token punctuation">(</span><span class="token string">\'listening\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">server</span><span class="token punctuation">.</span><span class="token property-access">_handle</span><span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onconnection</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// ...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看到TCP服务启动后，立马对<code>connection</code>事件进行了监听，会调用RoundRobinHandle的distribute方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// RoundRobinHandle</span>\n<span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handle</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onconnection</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// distribute 对工作进程进行分发</span>\n<span class="token class-name">RoundRobinHandle</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">distribute</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handles</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 存入TCP服务的句柄</span>\n  <span class="token keyword">const</span> worker <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">free</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 取出第一个工作进程</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>worker<span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">handoff</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 切换到工作进程</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token class-name">RoundRobinHandle</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">handoff</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">worker</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> handle <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">handles</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 获取TCP服务句柄</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>handle <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">free</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 将该工作进程重新放入队列中</span>\n    <span class="token keyword control-flow">return</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword">const</span> message <span class="token operator">=</span> <span class="token punctuation">{</span> act<span class="token operator">:</span> <span class="token string">\'newconn\'</span><span class="token punctuation">,</span> key<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">key</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token comment">// 向工作进程发送一个类型为 newconn 的消息以及TCP服务的句柄</span>\n  <span class="token function">sendHelper</span><span class="token punctuation">(</span>worker<span class="token punctuation">.</span><span class="token property-access">process</span><span class="token punctuation">,</span> message<span class="token punctuation">,</span> handle<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">reply</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>reply<span class="token punctuation">.</span><span class="token property-access">accepted</span><span class="token punctuation">)</span>\n      handle<span class="token punctuation">.</span><span class="token method function property-access">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">else</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">distribute</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 工作进程不能正常运行，启动下一个</span>\n\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">handoff</span><span class="token punctuation">(</span>worker<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>在子进程中也有对内部消息进行监听，在<code>cluster/child.js</code>中，有个<code>cluster._setupWorker</code>方法，该方法会对内部消息监听，该方法的在<code>lib/internal/bootstrap/node.js</code>中调用，这个文件是每次启动node命令后，由C++模块调用的。</p>\n<p><a href="https://github.com/nodejs/node/blob/v10.14.2/lib/internal/bootstrap/node.js#L337">链接</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">startup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">startExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">startExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token function">prepareUserCodeExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function">prepareUserCodeExecution</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">NODE_UNIQUE_ID</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> cluster <span class="token operator">=</span> <span class="token maybe-class-name">NativeModule</span><span class="token punctuation">.</span><span class="token method function property-access">require</span><span class="token punctuation">(</span><span class="token string">\'cluster\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    cluster<span class="token punctuation">.</span><span class="token method function property-access">_setupWorker</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">delete</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">NODE_UNIQUE_ID</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">startup</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>下面看看_setupWorker方法做了什么。</p>\n<pre class="language-javascript"><code class="language-javascript">cluster<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_setupWorker</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'internalMessage\'</span><span class="token punctuation">,</span> <span class="token function">internal</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> onmessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">function</span> <span class="token function">onmessage</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果act为 newconn 调用onconnection方法</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'newconn\'</span><span class="token punctuation">)</span>\n      <span class="token function">onconnection</span><span class="token punctuation">(</span>message<span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token property-access">act</span> <span class="token operator">===</span> <span class="token string">\'disconnect\'</span><span class="token punctuation">)</span>\n      _disconnect<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>worker<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">onconnection</span><span class="token punctuation">(</span><span class="token parameter">message<span class="token punctuation">,</span> handle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> key <span class="token operator">=</span> message<span class="token punctuation">.</span><span class="token property-access">key</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> server <span class="token operator">=</span> handles<span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> accepted <span class="token operator">=</span> server <span class="token operator">!==</span> <span class="token keyword nil">undefined</span><span class="token punctuation">;</span>\n\n  <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span> ack<span class="token operator">:</span> message<span class="token punctuation">.</span><span class="token property-access">seq</span><span class="token punctuation">,</span> accepted <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>accepted<span class="token punctuation">)</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">onconnection</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> handle<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 调用net中的onconnection方法</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后子进程获取到客户端句柄后，调用net模块的onconnection，对Socket进行实例化，后面就与其他http请求的逻辑一致了，不再细讲。</p>\n<p>至此，cluster模块的逻辑就走通了。</p>\n<h2 id="%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5">参考链接<a class="anchor" href="#%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5">§</a></h2>\n<ul>\n<li><a href="https://github.com/hustxiaoc/node.js/issues/11">当我们谈论 cluster 时我们在谈论什么</a></li>\n<li><a href="https://cnodejs.org/topic/56e84480833b7c8a0492e20c">通过源码解析 Node.js 中 cluster 模块的主要功能实现</a></li>\n<li><a href="http://nodejs.cn/api/child_process.html">child_process 文档</a></li>\n<li><a href="http://nodejs.cn/api/cluster.html">cluster 文档</a></li>\n</ul>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%AD%90%E8%BF%9B%E7%A8%8B" }, "\u5982\u4F55\u521B\u5EFA\u5B50\u8FDB\u7A0B"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#spawn" }, "spawn")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#execexecfile" }, "exec/execFile")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#fork" }, "fork")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B0%8F%E7%BB%93" }, "\u5C0F\u7ED3")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%88%A9%E7%94%A8fork%E5%AE%9E%E7%8E%B0master-worker%E6%A8%A1%E5%9E%8B" }, "\u5229\u7528fork\u5B9E\u73B0master-worker\u6A21\u578B"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B0%8F%E7%BB%93-1" }, "\u5C0F\u7ED3")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#cluster%E6%A8%A1%E5%9D%97" }, "cluster\u6A21\u5757"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97" }, "\u4E0A\u624B\u6307\u5357")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#cluster%E6%A8%A1%E5%9D%97%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90" }, "cluster\u6A21\u5757\u6E90\u7801\u5206\u6790"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%AD%90%E8%BF%9B%E7%A8%8B%E7%AB%AF%E5%8F%A3%E7%9B%91%E5%90%AC%E9%97%AE%E9%A2%98" }, "\u5B50\u8FDB\u7A0B\u7AEF\u53E3\u76D1\u542C\u95EE\u9898")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%B8%BB%E8%BF%9B%E7%A8%8B%E4%B8%8E%E5%AD%90%E8%BF%9B%E7%A8%8B%E9%80%9A%E4%BF%A1" }, "\u4E3B\u8FDB\u7A0B\u4E0E\u5B50\u8FDB\u7A0B\u901A\u4FE1")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%8F%82%E8%80%83%E9%93%BE%E6%8E%A5" }, "\u53C2\u8003\u94FE\u63A5")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/12/28",
    'updated': null,
    'excerpt': "众所周知Node基于V8，而在V8中JavaScript是单线程运行的，这里的单线程不是指Node启动的时候就只有一个线程，而是说运行JavaScript代码是在单线程上，Node还有其他线程，比如进行异步IO操作的IO线程。这种单线程模型带来的好处...",
    'cover': "https://file.shenfq.com/19-1-9/37414156.jpg",
    'categories': [
        "Node.js"
    ],
    'tags': [
        "前端",
        "Node",
        "多进程",
        "cluster",
        "负载均衡"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 24
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
                "count": 25
            },
            {
                "name": "前端工程化",
                "count": 11
            },
            {
                "name": "前端框架",
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
