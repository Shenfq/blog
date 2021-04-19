import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/前端模块化的今生.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/前端模块化的今生.html",
    'title': "前端模块化的今生",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>前端模块化的今生</h1>\n<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>众所周知，早期 JavaScript 原生并不支持模块化，直到 2015 年，TC39 发布 ES6，其中有一个规范就是 <code>ES modules</code>（为了方便表述，后面统一简称 ESM）。但是在 ES6 规范提出前，就已经存在了一些模块化方案，比如 CommonJS（in Node.js）、AMD。ESM 与这些规范的共同点就是都支持导入（import）和导出（export）语法，只是其行为的关键词也一些差异。</p>\n<h4 id="commonjs">CommonJS<a class="anchor" href="#commonjs">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> add\n<span class="token comment">// index.js</span>\n<span class="token keyword">const</span> add <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./add\'</span><span class="token punctuation">)</span>\n<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="amd">AMD<a class="anchor" href="#amd">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\n  <span class="token keyword control-flow">return</span> add\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// index.js</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'./add\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">add</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="esm">ESM<a class="anchor" href="#esm">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> add\n<span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports">add</span> <span class="token keyword module">from</span> <span class="token string">\'./add\'</span>\n<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n\n</code></pre>\n<p>关于 JavaScript 模块化出现的背景在上一章（<a href="https://blog.shenfq.com/2019/ck2lcgcxq001u2ise7lmss6zw/">《前端模块化的前世》</a>）已经有所介绍，这里不再赘述。但是 ESM 的出现不同于其他的规范，因为这是 JavaScript 官方推出的模块化方案，相比于 CommonJS 和 AMD 方案，ESM采用了完全静态化的方式进行模块的加载。</p>\n<h2 id="esm%E8%A7%84%E8%8C%83">ESM规范<a class="anchor" href="#esm%E8%A7%84%E8%8C%83">§</a></h2>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%87%BA">模块导出<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%87%BA">§</a></h3>\n<p>模块导出只有一个关键词：<code>export</code>，最简单的方法就是在声明的变量前面直接加上 export 关键词。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n</code></pre>\n<p>可以在 const、let、var 前直接加上 export，也可以在 function 或者 class 前面直接加上 export。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> name\n<span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword">class</span> <span class="token class-name">Logger</span> <span class="token punctuation">{</span>\n  <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token spread operator">...</span>args<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面的导出方法也可以使用大括号的方式进行简写。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword">function</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> name\n<span class="token punctuation">}</span>\n<span class="token keyword">class</span> <span class="token class-name">Logger</span> <span class="token punctuation">{</span>\n  <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token spread operator">...</span>args<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName<span class="token punctuation">,</span> <span class="token maybe-class-name">Logger</span> <span class="token punctuation">}</span></span>\n</code></pre>\n<p>最后一种语法，也是我们经常使用的，导出默认模块。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%85%A5">模块导入<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%85%A5">§</a></h3>\n<p>模块的导入使用<code>import</code>，并配合 <code>from</code> 关键词。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">name</span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<p>这样直接导入的方式，<code>module.js</code> 中必须使用 <code>export default</code>，也就是说 import 语法，默认导入的是<code>default</code>模块。如果想要导入其他模块，就必须使用对象展开的语法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n</code></pre>\n<p>如果模块文件同时导出了默认模块，和其他模块，在导入时，也可以同时将两者导入。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">name<span class="token punctuation">,</span> <span class="token punctuation">{</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">//module.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<p>当然，ESM 也提供了重命名的语法，将导入的模块进行重新命名。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token operator">*</span> <span class="token keyword module">as</span> mod</span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n<span class="token keyword">let</span> name <span class="token operator">=</span> <span class="token string">\'\'</span>\nname <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">name</span>\nname <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n</code></pre>\n<p>上述写法就相当于于将模块导出的对象进行重新赋值：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n<span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span>\n</code></pre>\n<p>同时也可以对单独的变量进行重命名：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token keyword module">as</span> getModName <span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%AF%BC%E5%85%A5%E5%90%8C%E6%97%B6%E8%BF%9B%E8%A1%8C%E5%AF%BC%E5%87%BA">导入同时进行导出<a class="anchor" href="#%E5%AF%BC%E5%85%A5%E5%90%8C%E6%97%B6%E8%BF%9B%E8%A1%8C%E5%AF%BC%E5%87%BA">§</a></h3>\n<p>如果有两个模块 a 和 b ，同时引入了模块 c，但是这两个模块还需要导入模块 d，如果模块 a、b 在导入 c 之后，再导入 d 也是可以的，但是有些繁琐，我们可以直接在模块 c 里面导入模块 d，再把模块 d 暴露出去。</p>\n<p><img src="https://file.shenfq.com/zbsq0.png" alt="模块关系"></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// module_c.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module_d.js\'</span>\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span>\n</code></pre>\n<p>这么写看起来还是有些麻烦，这里 ESM 提供了一种将 import 和 export 进行结合的语法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module_d.js\'</span>\n</code></pre>\n<p>上面是 ESM 规范的一些基本语法，如果想了解更多，可以翻阅阮老师的 <a href="http://es6.ruanyifeng.com/#docs/module">《ES6 入门》</a>。</p>\n<h3 id="esm-%E4%B8%8E-commonjs-%E7%9A%84%E5%B7%AE%E5%BC%82">ESM 与 CommonJS 的差异<a class="anchor" href="#esm-%E4%B8%8E-commonjs-%E7%9A%84%E5%B7%AE%E5%BC%82">§</a></h3>\n<p>首先肯定是语法上的差异，前面也已经简单介绍过了，一个使用 <code>import/export</code> 语法，一个使用 <code>require/module</code> 语法。</p>\n<p>另一个 ESM 与 CommonJS 显著的差异在于，ESM 导入模块的变量都是强绑定，导出模块的变量一旦发生变化，对应导入模块的变量也会跟随变化，而 CommonJS 中导入的模块都是值传递与引用传递，类似于函数传参（基本类型进行值传递，相当于拷贝变量，非基础类型【对象、数组】，进行引用传递）。</p>\n<p>下面我们看下详细的案例：</p>\n<p><strong>CommonJS</strong></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.js</span>\n<span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./b\'</span><span class="token punctuation">)</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n\n<span class="token comment">// b.js</span>\n<span class="token keyword">let</span> mod <span class="token operator">=</span> <span class="token string">\'first value\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  mod <span class="token operator">=</span> <span class="token string">\'second value\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> mod\n</code></pre>\n<pre class="language-bash"><code class="language-bash">$ node a.js\nfirst value\n</code></pre>\n<p><strong>ESM</strong></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.mjs</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> mod <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./b.mjs\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n\n<span class="token comment">// b.mjs</span>\n<span class="token keyword module">export</span> <span class="token keyword">let</span> mod <span class="token operator">=</span> <span class="token string">\'first value\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  mod <span class="token operator">=</span> <span class="token string">\'second value\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span>\n</code></pre>\n<pre class="language-bash"><code class="language-bash">$ node --experimental-modules a.mjs\n<span class="token comment"># (node:99615) ExperimentalWarning: The ESM module loader is experimental.</span>\nsecond value\n</code></pre>\n<p>另外，CommonJS 的模块实现，实际是给每个模块文件做了一层函数包裹，从而使得每个模块获取 <code>require/module</code>、<code>__filename/__dirname</code> 变量。那上面的 <code>a.js</code> 来举例，实际执行过程中 <code>a.js</code> 运行代码如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.js</span>\n<span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">exports<span class="token punctuation">,</span> require<span class="token punctuation">,</span> module<span class="token punctuation">,</span> __filename<span class="token punctuation">,</span> __dirname</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./b\'</span><span class="token punctuation">)</span>\n  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>而 ESM 的模块是通过 <code>import/export</code> 关键词来实现，没有对应的函数包裹，所以在 ESM 模块中，需要使用 <code>import.meta</code> 变量来获取 <code>__filename/__dirname</code>。<code>import.meta</code> 是 ECMAScript 实现的一个包含模块元数据的特定对象，主要用于存放模块的 <code>url</code>，而 node 中只支持加载本地模块，所以 url 都是使用 <code>file:</code> 协议。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">url</span> <span class="token keyword module">from</span> <span class="token string">\'url\'</span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token comment">// import.meta: { url: <a class="token url-link" href="file:///Users/dev/mjs/a.mjs">file:///Users/dev/mjs/a.mjs</a> }</span>\n<span class="token keyword">const</span> __filename <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">fileURLToPath</span><span class="token punctuation">(</span><span class="token keyword module">import</span><span class="token punctuation">.</span><span class="token property-access">meta</span><span class="token punctuation">.</span><span class="token property-access">url</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> __dirname <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>__filename<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8E%9F%E7%90%86">加载的原理<a class="anchor" href="#%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8E%9F%E7%90%86">§</a></h2>\n<p>步骤：</p>\n<ol>\n<li>Construction（构造）：下载所有的文件并且解析为module records。</li>\n<li>Instantiation（实例）：把所有导出的变量入内存指定位置（但是暂时还不求值）。然后，让导出和导入都指向内存指定位置。这叫做『linking(链接)』。</li>\n<li>Evaluation（求值）：执行代码，得到变量的值然后放到内存对应位置。</li>\n</ol>\n<h3 id="%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95">模块记录<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95">§</a></h3>\n<p>所有的模块化开发，都是从一个入口文件开始，无论是 Node.js 还是浏览器，都会根据这个入口文件进行检索，一步一步找到其他所有的依赖文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Node.js: main.mjs</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Log</span></span> <span class="token keyword module">from</span> <span class="token string">\'./log.mjs\'</span>\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- chrome、firefox --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./log.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>值得注意的是，刚开始拿到入口文件，我们并不知道它依赖了哪些模块，所以必须先通过 js 引擎静态分析，得到一个模块记录，该记录包含了该文件的依赖项。所以，一开始拿到的 js 文件并不会执行，只是会将文件转换得到一个模块记录（module records）。所有的 import 模块都在模块记录的 <code>importEntries</code> 字段中记录，更多模块记录相关的字段可以查阅<a href="https://tc39.es/ecma262/#table-38">tc39.es</a>。</p>\n<p><img src="https://file.shenfq.com/r50gc.png" alt="模块记录"></p>\n<h3 id="%E6%A8%A1%E5%9D%97%E6%9E%84%E9%80%A0">模块构造<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E6%9E%84%E9%80%A0">§</a></h3>\n<p>得到模块记录后，会下载所有依赖，并再次将依赖文件转换为模块记录，一直持续到没有依赖文件为止，这个过程被称为『构造』（construction）。</p>\n<p>模块构造包括如下三个步骤：</p>\n<ol>\n<li>模块识别（解析依赖模块 url，找到真实的下载路径）；</li>\n<li>文件下载（从指定的 url 进行下载，或从文件系统进行加载）；</li>\n<li>转化为模块记录（module records）。</li>\n</ol>\n<p>对于如何将模块文件转化为模块记录，ESM 规范有详细的说明，但是在构造这个步骤中，要怎么下载得到这些依赖的模块文件，在 ESM 规范中并没有对应的说明。因为如何下载文件，在服务端和客户端都有不同的实现规范。比如，在浏览器中，如何下载文件是属于 HTML 规范（浏览器的模块加载都是使用的 script 标签）。</p>\n<p>虽然下载完全不属于 ESM 的现有规范，但在 <code>import</code> 语句中还有一个引用模块的 url 地址，关于这个地址需要如何转化，在 Node 和浏览器之间有会出现一些差异。简单来说，在 Node 中可以直接 import 在 node_modules 中的模块，而在浏览器中并不能直接这么做，因为浏览器无法正确的找到服务器上的 node_modules 目录在哪里。好在有一个叫做 <a href="https://github.com/WICG/import-maps">import-maps</a> 的提案，该提案主要就是用来解决浏览器无法直接导入模块标识符的问题。但是，在该提案未被完全实现之前，浏览器中依然只能使用 url 进行模块导入。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>importmap<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token punctuation">{</span>\n  <span class="token string">"imports"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"jQuery"</span><span class="token operator">:</span> <span class="token string">"/node_modules/jquery/dist/jquery.js"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword module">import</span> <span class="token imports">$</span> <span class="token keyword module">from</span> <span class="token string">\'jQuery\'</span>\n  <span class="token function">$</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">html</span><span class="token punctuation">(</span><span class="token string">\'init\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>下载好的模块，都会被转化为模块记录然后缓存到 <code>module map</code> 中，遇到不同文件获取的相同依赖，都会直接在 <code>module map</code> 缓存中获取。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// log.js</span>\n<span class="token keyword">const</span> log <span class="token operator">=</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token property-access">log</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> log\n\n<span class="token comment">// file.js</span>\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> \n  readFileSync <span class="token keyword module">as</span> read<span class="token punctuation">,</span>\n  writeFileSync <span class="token keyword module">as</span> write\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'fs\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/3u8rz.png" alt="module map"></p>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AE%9E%E4%BE%8B">模块实例<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AE%9E%E4%BE%8B">§</a></h3>\n<p>获取到所有依赖文件并建立好 <code>module map</code> 后，就会找到所有模块记录，并取出其中的所有导出的变量，然后，将所有变量一一对应到内存中，将对应关系存储到『模块环境记录』（module environment record）中。当然当前内存中的变量并没有值，只是初始化了对应关系。初始化导出变量和内存的对应关系后，紧接着会设置模块导入和内存的对应关系，确保相同变量的导入和导出都指向了同一个内存区域，并保证所有的导入都能找到对应的导出。</p>\n<p><img src="https://file.shenfq.com/754dc.png" alt="模块连接"></p>\n<p>由于导入和导出指向同一内存区域，所以导出值一旦发生变化，导入值也会变化，不同于 CommonJS，CommonJS 的所有值都是基于拷贝的。连接到导入导出变量后，我们就需要将对应的值放入到内存中，下面就要进入到求值的步骤了。</p>\n<h3 id="%E6%A8%A1%E5%9D%97%E6%B1%82%E5%80%BC">模块求值<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E6%B1%82%E5%80%BC">§</a></h3>\n<p>求值步骤相对简单，只要运行代码把计算出来的值填入之前记录的内存地址就可以了。到这里就已经能够愉快的使用 ESM 模块化了。</p>\n<h2 id="esm%E7%9A%84%E8%BF%9B%E5%B1%95">ESM的进展<a class="anchor" href="#esm%E7%9A%84%E8%BF%9B%E5%B1%95">§</a></h2>\n<p>因为 ESM 出现较晚，服务端已有 CommonJS 方案，客户端又有 webpack 打包工具，所以 ESM 的推广不得不说还是十分艰难的。</p>\n<h3 id="%E5%AE%A2%E6%88%B7%E7%AB%AF">客户端<a class="anchor" href="#%E5%AE%A2%E6%88%B7%E7%AB%AF">§</a></h3>\n<p>我们先看看客户端的支持情况，这里推荐大家到 <a href="https://caniuse.com/#feat=es6-module">Can I Use</a> 直接查看，下图是 <code>2019/11</code>的截图。</p>\n<p><img src="https://file.shenfq.com/wle9v.png" alt="Can I use"></p>\n<p>目前为止，主流浏览器都已经支持 ESM 了，只需在 <code>script</code> 标签传入指定的 <code>type=&quot;module&quot;</code> 即可。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>另外，我们知道在 Node.js 中，要使用 ESM 有时候需要用到 .mjs 后缀，但是浏览器并不关心文件后缀，只需要 http 响应头的MIME类型正确即可（<code>Content-Type: text/javascript</code>）。同时，当 <code>type=&quot;module&quot;</code> 时，默认启用 <code>defer</code> 来加载脚本。这里补充一张 defer、async 差异图。</p>\n<p><img src="https://file.shenfq.com/cfnmx.png" alt="img"></p>\n<p>我们知道浏览器不支持 <code>script</code> 的时候，提供了 <code>noscript</code> 标签用于降级处理，模块化也提供了类似的标签。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">nomodule</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前浏览器不支持 ESM ！！！\'</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这样我们就能针对支持 ESM 的浏览器直接使用模块化方案加载文件，不支持的浏览器还是使用 webpack 打包的版本。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">nomodule</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/app.[hash].js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E9%A2%84%E5%8A%A0%E8%BD%BD">预加载<a class="anchor" href="#%E9%A2%84%E5%8A%A0%E8%BD%BD">§</a></h4>\n<p>我们知道浏览器的 link 标签可以用作资源的预加载，比如我需要预先加载 <code>main.js</code> 文件：</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>preload<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>link</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>如果这个 <code>main.js</code> 文件是一个模块化文件，浏览器仅仅预先加载单独这一个文件是没有意义的，前面我们也说过，一个模块化文件下载后还需要转化得到模块记录，进行模块实例、模块求值这些操作，所以我们得想办法告诉浏览器，这个文件是一个模块化的文件，所以浏览器提供了一种新的 rel 类型，专门用于模块化文件的预加载。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>modulepreload<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>link</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%8E%B0%E7%8A%B6">现状<a class="anchor" href="#%E7%8E%B0%E7%8A%B6">§</a></h4>\n<p>虽然主流浏览器都已经支持了 ESM，但是根据 <a href="https://www.chromestatus.com/metrics/feature/timeline/popularity/2062">chrome 的统计</a>，有用到 <code>&lt;script type=&quot;module&quot;&gt;</code> 的页面只有 1%。截图时间为 <code>2019/11</code>。</p>\n<p><img src="https://file.shenfq.com/47tn2.png" alt="统计"></p>\n<h3 id="%E6%9C%8D%E5%8A%A1%E7%AB%AF">服务端<a class="anchor" href="#%E6%9C%8D%E5%8A%A1%E7%AB%AF">§</a></h3>\n<p>浏览器能够通过 script 标签指定当前脚本是否作为模块处理，但是在 Node.js 中没有很明确的方式来表示是否需要使用 ESM，而且 Node.js 中本身就已经有了 CommonJS 的标准模块化方案。就算开启了 ESM，又通过何种方式来判断当前入口文件导入的模块到底是使用的 ESM 还是 CommonJS 呢？为了解决上述问题，node 社区开始出现了 ESM 的相关草案，具体可以在 <a href="https://github.com/nodejs/node-eps/blob/master/002-es-modules.md">github</a> 上查阅。</p>\n<p>2017年发布的 Node.js 8.5.0 开启了 ESM 的实验性支持，在启动程序时，加上 <code>--experimental-modules</code> 来开启对 ESM 的支持，并将 <code>.mjs</code> 后缀的文件当做 ESM 来解析。早期的期望是在 Node.js 12 达到 LTS 状态正式发布，然后期望并没有实现，直到最近的 13.2.0 版本才正式支持 ESM，也就是取消了 <code>--experimental-modules</code> 启动参数。具体细节可以查看 Node.js 13.2.0 的<a href="https://nodejs.org/api/esm.html#esm_ecmascript_modules">官方文档</a>。</p>\n<p>关于 <code>.mjs</code> 后缀社区有两种完全不同的态度。支持的一方认为通过文件后缀区分类型是最简单也是最明确的方式，且社区早已有类似案例，例如，<code>.jsx</code> 用于 React 组件、<code>.ts</code> 用于 ts 文件；而支持的一方认为，<code>.js</code> 作为 js 后缀已经存在这么多年，视觉上很难接受一个 <code>.mjs</code> 也是 js 文件，而且现有的很多工具都是以 <code>.js</code> 后缀来识别 js 文件，如果引入了 <code>.mjs</code> 方案，就有大批量的工具需要修改来有效的适配 ESM。</p>\n<p>所以除了 <code>.mjs</code> 后缀指定 ESM 外，还可以使用 <code>pkg.json</code> 文件的 <code>type</code> 属性。如果 type 属性为 module，则表示当前模块应使用 ESM 来解析模块，否则使用 CommonJS 解析模块。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"module"</span> <span class="token comment">// module | commonjs(default)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>当然有些本地文件是没有 <code>pkg.json</code> 的，但是你又不想使用 <code>.mjs</code> 后缀，这时候只需要在命令行加上一个启动参数 <code>--input-type=module</code>。同时 <code>input-type</code> 也支持 commonjs 参数来指定使用 CommonJS（<code>-—input-type=commonjs</code>）。</p>\n<p>总结一下，Node.js 中，以下三种情况会启用 ESM 的模块加载方式：</p>\n<ol>\n<li>文件后缀为<code>.mjs</code>;</li>\n<li><code>pkg.json</code> 中 type 字段指定为 <code>module</code>；</li>\n<li>启动参数添加 <code>--input-type=module</code>。</li>\n</ol>\n<p>同样，也有三种情况会启用 CommonJS 的模块加载方式：</p>\n<ol>\n<li>文件后缀为<code>.cjs</code>;</li>\n<li><code>pkg.json</code> 中 type 字段指定为 <code>commonjs</code>；</li>\n<li>启动参数添加 <code>--input-type=commonjs</code>。</li>\n</ol>\n<p>虽然 13.2 版本去除了 <code>--experimental-modules</code> 的启动参数，但是按照文档的说法，在 Node.js 中使用 ESM 依旧是实验特性。</p>\n<blockquote>\n<p><a href="https://nodejs.org/api/documentation.html#documentation_stability_index">Stability: 1</a> - Experimental</p>\n</blockquote>\n<p>不过，相信等到 Node.js 14 LTS 版本发布时，ESM 的支持应该就能进入稳定阶段了，这里还有一个 Node.js 关于 ESM 的整个<a href="https://github.com/nodejs/modules/blob/master/doc/plan-for-new-modules-implementation.md">计划列表</a>可以查阅。</p>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="https://github.com/nodejs/modules/">nodejs/modules</a></li>\n<li><a href="https://2ality.com/2017/05/es-module-specifiers.html">Module specifiers: what’s new with ES modules?</a></li>\n<li><a href="https://segmentfault.com/a/1190000014318751">图说 ES Modules</a>（<a href="https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/">ES modules: A cartoon deep-dive</a>）</li>\n</ul>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u524D\u7AEF\u6A21\u5757\u5316\u7684\u4ECA\u751F"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>众所周知，早期 JavaScript 原生并不支持模块化，直到 2015 年，TC39 发布 ES6，其中有一个规范就是 <code>ES modules</code>（为了方便表述，后面统一简称 ESM）。但是在 ES6 规范提出前，就已经存在了一些模块化方案，比如 CommonJS（in Node.js）、AMD。ESM 与这些规范的共同点就是都支持导入（import）和导出（export）语法，只是其行为的关键词也一些差异。</p>\n<h4 id="commonjs">CommonJS<a class="anchor" href="#commonjs">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> add\n<span class="token comment">// index.js</span>\n<span class="token keyword">const</span> add <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./add\'</span><span class="token punctuation">)</span>\n<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="amd">AMD<a class="anchor" href="#amd">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\n  <span class="token keyword control-flow">return</span> add\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// index.js</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'./add\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">add</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="esm">ESM<a class="anchor" href="#esm">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// add.js</span>\n<span class="token keyword">const</span> <span class="token function-variable function">add</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> a <span class="token operator">+</span> b\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> add\n<span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports">add</span> <span class="token keyword module">from</span> <span class="token string">\'./add\'</span>\n<span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span>\n\n</code></pre>\n<p>关于 JavaScript 模块化出现的背景在上一章（<a href="https://blog.shenfq.com/2019/ck2lcgcxq001u2ise7lmss6zw/">《前端模块化的前世》</a>）已经有所介绍，这里不再赘述。但是 ESM 的出现不同于其他的规范，因为这是 JavaScript 官方推出的模块化方案，相比于 CommonJS 和 AMD 方案，ESM采用了完全静态化的方式进行模块的加载。</p>\n<h2 id="esm%E8%A7%84%E8%8C%83">ESM规范<a class="anchor" href="#esm%E8%A7%84%E8%8C%83">§</a></h2>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%87%BA">模块导出<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%87%BA">§</a></h3>\n<p>模块导出只有一个关键词：<code>export</code>，最简单的方法就是在声明的变量前面直接加上 export 关键词。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n</code></pre>\n<p>可以在 const、let、var 前直接加上 export，也可以在 function 或者 class 前面直接加上 export。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> name\n<span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword">class</span> <span class="token class-name">Logger</span> <span class="token punctuation">{</span>\n  <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token spread operator">...</span>args<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面的导出方法也可以使用大括号的方式进行简写。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword">function</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> name\n<span class="token punctuation">}</span>\n<span class="token keyword">class</span> <span class="token class-name">Logger</span> <span class="token punctuation">{</span>\n  <span class="token function">log</span><span class="token punctuation">(</span><span class="token parameter"><span class="token spread operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token spread operator">...</span>args<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName<span class="token punctuation">,</span> <span class="token maybe-class-name">Logger</span> <span class="token punctuation">}</span></span>\n</code></pre>\n<p>最后一种语法，也是我们经常使用的，导出默认模块。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%85%A5">模块导入<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%85%A5">§</a></h3>\n<p>模块的导入使用<code>import</code>，并配合 <code>from</code> 关键词。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">name</span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<p>这样直接导入的方式，<code>module.js</code> 中必须使用 <code>export default</code>，也就是说 import 语法，默认导入的是<code>default</code>模块。如果想要导入其他模块，就必须使用对象展开的语法。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n</code></pre>\n<p>如果模块文件同时导出了默认模块，和其他模块，在导入时，也可以同时将两者导入。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports">name<span class="token punctuation">,</span> <span class="token punctuation">{</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n\n<span class="token comment">//module.js</span>\n<span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> name\n</code></pre>\n<p>当然，ESM 也提供了重命名的语法，将导入的模块进行重新命名。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token operator">*</span> <span class="token keyword module">as</span> mod</span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n<span class="token keyword">let</span> name <span class="token operator">=</span> <span class="token string">\'\'</span>\nname <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">name</span>\nname <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment">// module.js</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> name <span class="token operator">=</span> <span class="token string">\'Shenfq\'</span>\n<span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">getName</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> name\n</code></pre>\n<p>上述写法就相当于于将模块导出的对象进行重新赋值：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module.js\'</span>\n<span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span>\n</code></pre>\n<p>同时也可以对单独的变量进行重命名：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// main.js</span>\n<span class="token keyword module">import</span> <span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token keyword module">as</span> getModName <span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%AF%BC%E5%85%A5%E5%90%8C%E6%97%B6%E8%BF%9B%E8%A1%8C%E5%AF%BC%E5%87%BA">导入同时进行导出<a class="anchor" href="#%E5%AF%BC%E5%85%A5%E5%90%8C%E6%97%B6%E8%BF%9B%E8%A1%8C%E5%AF%BC%E5%87%BA">§</a></h3>\n<p>如果有两个模块 a 和 b ，同时引入了模块 c，但是这两个模块还需要导入模块 d，如果模块 a、b 在导入 c 之后，再导入 d 也是可以的，但是有些繁琐，我们可以直接在模块 c 里面导入模块 d，再把模块 d 暴露出去。</p>\n<p><img src="https://file.shenfq.com/zbsq0.png" alt="模块关系"></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// module_c.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module_d.js\'</span>\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span>\n</code></pre>\n<p>这么写看起来还是有些麻烦，这里 ESM 提供了一种将 import 和 export 进行结合的语法。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> name<span class="token punctuation">,</span> getName <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./module_d.js\'</span>\n</code></pre>\n<p>上面是 ESM 规范的一些基本语法，如果想了解更多，可以翻阅阮老师的 <a href="http://es6.ruanyifeng.com/#docs/module">《ES6 入门》</a>。</p>\n<h3 id="esm-%E4%B8%8E-commonjs-%E7%9A%84%E5%B7%AE%E5%BC%82">ESM 与 CommonJS 的差异<a class="anchor" href="#esm-%E4%B8%8E-commonjs-%E7%9A%84%E5%B7%AE%E5%BC%82">§</a></h3>\n<p>首先肯定是语法上的差异，前面也已经简单介绍过了，一个使用 <code>import/export</code> 语法，一个使用 <code>require/module</code> 语法。</p>\n<p>另一个 ESM 与 CommonJS 显著的差异在于，ESM 导入模块的变量都是强绑定，导出模块的变量一旦发生变化，对应导入模块的变量也会跟随变化，而 CommonJS 中导入的模块都是值传递与引用传递，类似于函数传参（基本类型进行值传递，相当于拷贝变量，非基础类型【对象、数组】，进行引用传递）。</p>\n<p>下面我们看下详细的案例：</p>\n<p><strong>CommonJS</strong></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.js</span>\n<span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./b\'</span><span class="token punctuation">)</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n\n<span class="token comment">// b.js</span>\n<span class="token keyword">let</span> mod <span class="token operator">=</span> <span class="token string">\'first value\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  mod <span class="token operator">=</span> <span class="token string">\'second value\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> mod\n</code></pre>\n<pre class="language-bash"><code class="language-bash">$ node a.js\nfirst value\n</code></pre>\n<p><strong>ESM</strong></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.mjs</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> mod <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./b.mjs\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n\n<span class="token comment">// b.mjs</span>\n<span class="token keyword module">export</span> <span class="token keyword">let</span> mod <span class="token operator">=</span> <span class="token string">\'first value\'</span>\n\n<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  mod <span class="token operator">=</span> <span class="token string">\'second value\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span>\n</code></pre>\n<pre class="language-bash"><code class="language-bash">$ node --experimental-modules a.mjs\n<span class="token comment"># (node:99615) ExperimentalWarning: The ESM module loader is experimental.</span>\nsecond value\n</code></pre>\n<p>另外，CommonJS 的模块实现，实际是给每个模块文件做了一层函数包裹，从而使得每个模块获取 <code>require/module</code>、<code>__filename/__dirname</code> 变量。那上面的 <code>a.js</code> 来举例，实际执行过程中 <code>a.js</code> 运行代码如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// a.js</span>\n<span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">exports<span class="token punctuation">,</span> require<span class="token punctuation">,</span> module<span class="token punctuation">,</span> __filename<span class="token punctuation">,</span> __dirname</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> mod <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./b\'</span><span class="token punctuation">)</span>\n  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>而 ESM 的模块是通过 <code>import/export</code> 关键词来实现，没有对应的函数包裹，所以在 ESM 模块中，需要使用 <code>import.meta</code> 变量来获取 <code>__filename/__dirname</code>。<code>import.meta</code> 是 ECMAScript 实现的一个包含模块元数据的特定对象，主要用于存放模块的 <code>url</code>，而 node 中只支持加载本地模块，所以 url 都是使用 <code>file:</code> 协议。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">url</span> <span class="token keyword module">from</span> <span class="token string">\'url\'</span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token comment">// import.meta: { url: <a class="token url-link" href="file:///Users/dev/mjs/a.mjs">file:///Users/dev/mjs/a.mjs</a> }</span>\n<span class="token keyword">const</span> __filename <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">fileURLToPath</span><span class="token punctuation">(</span><span class="token keyword module">import</span><span class="token punctuation">.</span><span class="token property-access">meta</span><span class="token punctuation">.</span><span class="token property-access">url</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> __dirname <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>__filename<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8E%9F%E7%90%86">加载的原理<a class="anchor" href="#%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8E%9F%E7%90%86">§</a></h2>\n<p>步骤：</p>\n<ol>\n<li>Construction（构造）：下载所有的文件并且解析为module records。</li>\n<li>Instantiation（实例）：把所有导出的变量入内存指定位置（但是暂时还不求值）。然后，让导出和导入都指向内存指定位置。这叫做『linking(链接)』。</li>\n<li>Evaluation（求值）：执行代码，得到变量的值然后放到内存对应位置。</li>\n</ol>\n<h3 id="%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95">模块记录<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95">§</a></h3>\n<p>所有的模块化开发，都是从一个入口文件开始，无论是 Node.js 还是浏览器，都会根据这个入口文件进行检索，一步一步找到其他所有的依赖文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Node.js: main.mjs</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Log</span></span> <span class="token keyword module">from</span> <span class="token string">\'./log.mjs\'</span>\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- chrome、firefox --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./log.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>值得注意的是，刚开始拿到入口文件，我们并不知道它依赖了哪些模块，所以必须先通过 js 引擎静态分析，得到一个模块记录，该记录包含了该文件的依赖项。所以，一开始拿到的 js 文件并不会执行，只是会将文件转换得到一个模块记录（module records）。所有的 import 模块都在模块记录的 <code>importEntries</code> 字段中记录，更多模块记录相关的字段可以查阅<a href="https://tc39.es/ecma262/#table-38">tc39.es</a>。</p>\n<p><img src="https://file.shenfq.com/r50gc.png" alt="模块记录"></p>\n<h3 id="%E6%A8%A1%E5%9D%97%E6%9E%84%E9%80%A0">模块构造<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E6%9E%84%E9%80%A0">§</a></h3>\n<p>得到模块记录后，会下载所有依赖，并再次将依赖文件转换为模块记录，一直持续到没有依赖文件为止，这个过程被称为『构造』（construction）。</p>\n<p>模块构造包括如下三个步骤：</p>\n<ol>\n<li>模块识别（解析依赖模块 url，找到真实的下载路径）；</li>\n<li>文件下载（从指定的 url 进行下载，或从文件系统进行加载）；</li>\n<li>转化为模块记录（module records）。</li>\n</ol>\n<p>对于如何将模块文件转化为模块记录，ESM 规范有详细的说明，但是在构造这个步骤中，要怎么下载得到这些依赖的模块文件，在 ESM 规范中并没有对应的说明。因为如何下载文件，在服务端和客户端都有不同的实现规范。比如，在浏览器中，如何下载文件是属于 HTML 规范（浏览器的模块加载都是使用的 script 标签）。</p>\n<p>虽然下载完全不属于 ESM 的现有规范，但在 <code>import</code> 语句中还有一个引用模块的 url 地址，关于这个地址需要如何转化，在 Node 和浏览器之间有会出现一些差异。简单来说，在 Node 中可以直接 import 在 node_modules 中的模块，而在浏览器中并不能直接这么做，因为浏览器无法正确的找到服务器上的 node_modules 目录在哪里。好在有一个叫做 <a href="https://github.com/WICG/import-maps">import-maps</a> 的提案，该提案主要就是用来解决浏览器无法直接导入模块标识符的问题。但是，在该提案未被完全实现之前，浏览器中依然只能使用 url 进行模块导入。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>importmap<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token punctuation">{</span>\n  <span class="token string">"imports"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"jQuery"</span><span class="token operator">:</span> <span class="token string">"/node_modules/jquery/dist/jquery.js"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token keyword module">import</span> <span class="token imports">$</span> <span class="token keyword module">from</span> <span class="token string">\'jQuery\'</span>\n  <span class="token function">$</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">html</span><span class="token punctuation">(</span><span class="token string">\'init\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>下载好的模块，都会被转化为模块记录然后缓存到 <code>module map</code> 中，遇到不同文件获取的相同依赖，都会直接在 <code>module map</code> 缓存中获取。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// log.js</span>\n<span class="token keyword">const</span> log <span class="token operator">=</span> <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token property-access">log</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> log\n\n<span class="token comment">// file.js</span>\n<span class="token keyword module">export</span> <span class="token exports"><span class="token punctuation">{</span> \n  readFileSync <span class="token keyword module">as</span> read<span class="token punctuation">,</span>\n  writeFileSync <span class="token keyword module">as</span> write\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'fs\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/3u8rz.png" alt="module map"></p>\n<h3 id="%E6%A8%A1%E5%9D%97%E5%AE%9E%E4%BE%8B">模块实例<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E5%AE%9E%E4%BE%8B">§</a></h3>\n<p>获取到所有依赖文件并建立好 <code>module map</code> 后，就会找到所有模块记录，并取出其中的所有导出的变量，然后，将所有变量一一对应到内存中，将对应关系存储到『模块环境记录』（module environment record）中。当然当前内存中的变量并没有值，只是初始化了对应关系。初始化导出变量和内存的对应关系后，紧接着会设置模块导入和内存的对应关系，确保相同变量的导入和导出都指向了同一个内存区域，并保证所有的导入都能找到对应的导出。</p>\n<p><img src="https://file.shenfq.com/754dc.png" alt="模块连接"></p>\n<p>由于导入和导出指向同一内存区域，所以导出值一旦发生变化，导入值也会变化，不同于 CommonJS，CommonJS 的所有值都是基于拷贝的。连接到导入导出变量后，我们就需要将对应的值放入到内存中，下面就要进入到求值的步骤了。</p>\n<h3 id="%E6%A8%A1%E5%9D%97%E6%B1%82%E5%80%BC">模块求值<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E6%B1%82%E5%80%BC">§</a></h3>\n<p>求值步骤相对简单，只要运行代码把计算出来的值填入之前记录的内存地址就可以了。到这里就已经能够愉快的使用 ESM 模块化了。</p>\n<h2 id="esm%E7%9A%84%E8%BF%9B%E5%B1%95">ESM的进展<a class="anchor" href="#esm%E7%9A%84%E8%BF%9B%E5%B1%95">§</a></h2>\n<p>因为 ESM 出现较晚，服务端已有 CommonJS 方案，客户端又有 webpack 打包工具，所以 ESM 的推广不得不说还是十分艰难的。</p>\n<h3 id="%E5%AE%A2%E6%88%B7%E7%AB%AF">客户端<a class="anchor" href="#%E5%AE%A2%E6%88%B7%E7%AB%AF">§</a></h3>\n<p>我们先看看客户端的支持情况，这里推荐大家到 <a href="https://caniuse.com/#feat=es6-module">Can I Use</a> 直接查看，下图是 <code>2019/11</code>的截图。</p>\n<p><img src="https://file.shenfq.com/wle9v.png" alt="Can I use"></p>\n<p>目前为止，主流浏览器都已经支持 ESM 了，只需在 <code>script</code> 标签传入指定的 <code>type=&quot;module&quot;</code> 即可。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>另外，我们知道在 Node.js 中，要使用 ESM 有时候需要用到 .mjs 后缀，但是浏览器并不关心文件后缀，只需要 http 响应头的MIME类型正确即可（<code>Content-Type: text/javascript</code>）。同时，当 <code>type=&quot;module&quot;</code> 时，默认启用 <code>defer</code> 来加载脚本。这里补充一张 defer、async 差异图。</p>\n<p><img src="https://file.shenfq.com/cfnmx.png" alt="img"></p>\n<p>我们知道浏览器不支持 <code>script</code> 的时候，提供了 <code>noscript</code> 标签用于降级处理，模块化也提供了类似的标签。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">nomodule</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前浏览器不支持 ESM ！！！\'</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这样我们就能针对支持 ESM 的浏览器直接使用模块化方案加载文件，不支持的浏览器还是使用 webpack 打包的版本。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">nomodule</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/app.[hash].js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E9%A2%84%E5%8A%A0%E8%BD%BD">预加载<a class="anchor" href="#%E9%A2%84%E5%8A%A0%E8%BD%BD">§</a></h4>\n<p>我们知道浏览器的 link 标签可以用作资源的预加载，比如我需要预先加载 <code>main.js</code> 文件：</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>preload<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>link</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>如果这个 <code>main.js</code> 文件是一个模块化文件，浏览器仅仅预先加载单独这一个文件是没有意义的，前面我们也说过，一个模块化文件下载后还需要转化得到模块记录，进行模块实例、模块求值这些操作，所以我们得想办法告诉浏览器，这个文件是一个模块化的文件，所以浏览器提供了一种新的 rel 类型，专门用于模块化文件的预加载。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>modulepreload<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>link</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%8E%B0%E7%8A%B6">现状<a class="anchor" href="#%E7%8E%B0%E7%8A%B6">§</a></h4>\n<p>虽然主流浏览器都已经支持了 ESM，但是根据 <a href="https://www.chromestatus.com/metrics/feature/timeline/popularity/2062">chrome 的统计</a>，有用到 <code>&lt;script type=&quot;module&quot;&gt;</code> 的页面只有 1%。截图时间为 <code>2019/11</code>。</p>\n<p><img src="https://file.shenfq.com/47tn2.png" alt="统计"></p>\n<h3 id="%E6%9C%8D%E5%8A%A1%E7%AB%AF">服务端<a class="anchor" href="#%E6%9C%8D%E5%8A%A1%E7%AB%AF">§</a></h3>\n<p>浏览器能够通过 script 标签指定当前脚本是否作为模块处理，但是在 Node.js 中没有很明确的方式来表示是否需要使用 ESM，而且 Node.js 中本身就已经有了 CommonJS 的标准模块化方案。就算开启了 ESM，又通过何种方式来判断当前入口文件导入的模块到底是使用的 ESM 还是 CommonJS 呢？为了解决上述问题，node 社区开始出现了 ESM 的相关草案，具体可以在 <a href="https://github.com/nodejs/node-eps/blob/master/002-es-modules.md">github</a> 上查阅。</p>\n<p>2017年发布的 Node.js 8.5.0 开启了 ESM 的实验性支持，在启动程序时，加上 <code>--experimental-modules</code> 来开启对 ESM 的支持，并将 <code>.mjs</code> 后缀的文件当做 ESM 来解析。早期的期望是在 Node.js 12 达到 LTS 状态正式发布，然后期望并没有实现，直到最近的 13.2.0 版本才正式支持 ESM，也就是取消了 <code>--experimental-modules</code> 启动参数。具体细节可以查看 Node.js 13.2.0 的<a href="https://nodejs.org/api/esm.html#esm_ecmascript_modules">官方文档</a>。</p>\n<p>关于 <code>.mjs</code> 后缀社区有两种完全不同的态度。支持的一方认为通过文件后缀区分类型是最简单也是最明确的方式，且社区早已有类似案例，例如，<code>.jsx</code> 用于 React 组件、<code>.ts</code> 用于 ts 文件；而支持的一方认为，<code>.js</code> 作为 js 后缀已经存在这么多年，视觉上很难接受一个 <code>.mjs</code> 也是 js 文件，而且现有的很多工具都是以 <code>.js</code> 后缀来识别 js 文件，如果引入了 <code>.mjs</code> 方案，就有大批量的工具需要修改来有效的适配 ESM。</p>\n<p>所以除了 <code>.mjs</code> 后缀指定 ESM 外，还可以使用 <code>pkg.json</code> 文件的 <code>type</code> 属性。如果 type 属性为 module，则表示当前模块应使用 ESM 来解析模块，否则使用 CommonJS 解析模块。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"module"</span> <span class="token comment">// module | commonjs(default)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>当然有些本地文件是没有 <code>pkg.json</code> 的，但是你又不想使用 <code>.mjs</code> 后缀，这时候只需要在命令行加上一个启动参数 <code>--input-type=module</code>。同时 <code>input-type</code> 也支持 commonjs 参数来指定使用 CommonJS（<code>-—input-type=commonjs</code>）。</p>\n<p>总结一下，Node.js 中，以下三种情况会启用 ESM 的模块加载方式：</p>\n<ol>\n<li>文件后缀为<code>.mjs</code>;</li>\n<li><code>pkg.json</code> 中 type 字段指定为 <code>module</code>；</li>\n<li>启动参数添加 <code>--input-type=module</code>。</li>\n</ol>\n<p>同样，也有三种情况会启用 CommonJS 的模块加载方式：</p>\n<ol>\n<li>文件后缀为<code>.cjs</code>;</li>\n<li><code>pkg.json</code> 中 type 字段指定为 <code>commonjs</code>；</li>\n<li>启动参数添加 <code>--input-type=commonjs</code>。</li>\n</ol>\n<p>虽然 13.2 版本去除了 <code>--experimental-modules</code> 的启动参数，但是按照文档的说法，在 Node.js 中使用 ESM 依旧是实验特性。</p>\n<blockquote>\n<p><a href="https://nodejs.org/api/documentation.html#documentation_stability_index">Stability: 1</a> - Experimental</p>\n</blockquote>\n<p>不过，相信等到 Node.js 14 LTS 版本发布时，ESM 的支持应该就能进入稳定阶段了，这里还有一个 Node.js 关于 ESM 的整个<a href="https://github.com/nodejs/modules/blob/master/doc/plan-for-new-modules-implementation.md">计划列表</a>可以查阅。</p>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="https://github.com/nodejs/modules/">nodejs/modules</a></li>\n<li><a href="https://2ality.com/2017/05/es-module-specifiers.html">Module specifiers: what’s new with ES modules?</a></li>\n<li><a href="https://segmentfault.com/a/1190000014318751">图说 ES Modules</a>（<a href="https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/">ES modules: A cartoon deep-dive</a>）</li>\n</ul>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%83%8C%E6%99%AF" }, "\u80CC\u666F"),
                React.createElement("ol", null)),
            React.createElement("li", null,
                React.createElement("a", { href: "#esm%E8%A7%84%E8%8C%83" }, "ESM\u89C4\u8303"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%87%BA" }, "\u6A21\u5757\u5BFC\u51FA")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E5%AF%BC%E5%85%A5" }, "\u6A21\u5757\u5BFC\u5165")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%AF%BC%E5%85%A5%E5%90%8C%E6%97%B6%E8%BF%9B%E8%A1%8C%E5%AF%BC%E5%87%BA" }, "\u5BFC\u5165\u540C\u65F6\u8FDB\u884C\u5BFC\u51FA")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#esm-%E4%B8%8E-commonjs-%E7%9A%84%E5%B7%AE%E5%BC%82" }, "ESM \u4E0E CommonJS \u7684\u5DEE\u5F02")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%8A%A0%E8%BD%BD%E7%9A%84%E5%8E%9F%E7%90%86" }, "\u52A0\u8F7D\u7684\u539F\u7406"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E8%AE%B0%E5%BD%95" }, "\u6A21\u5757\u8BB0\u5F55")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E6%9E%84%E9%80%A0" }, "\u6A21\u5757\u6784\u9020")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E5%AE%9E%E4%BE%8B" }, "\u6A21\u5757\u5B9E\u4F8B")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E6%B1%82%E5%80%BC" }, "\u6A21\u5757\u6C42\u503C")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#esm%E7%9A%84%E8%BF%9B%E5%B1%95" }, "ESM\u7684\u8FDB\u5C55"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%AE%A2%E6%88%B7%E7%AB%AF" }, "\u5BA2\u6237\u7AEF"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%9C%8D%E5%8A%A1%E7%AB%AF" }, "\u670D\u52A1\u7AEF")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%8F%82%E8%80%83" }, "\u53C2\u8003")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/11/30",
    'updated': null,
    'excerpt': "背景 众所周知，早期 JavaScript 原生并不支持模块化，直到 2015 年，TC39 发布 ES6，其中有一个规范就是 ES modules（为了方便表述，后面统一简称 ESM）。但是在 ES6 规范提出前，就已经存在了一些模块化方案，比如 CommonJS（...",
    'cover': "https://file.shenfq.com/zbsq0.png",
    'categories': [
        "模块化"
    ],
    'tags': [
        "前端",
        "前端工程化",
        "前端模块化",
        "CommonJS",
        "ES Module"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "name": "Go",
                "count": 5
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
                "name": "Go",
                "count": 5
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
            }
        ]
    }
};
