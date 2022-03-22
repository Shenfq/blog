import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2018/seajs源码解读.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/seajs源码解读.html",
    'title': "seajs源码解读",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>seajs源码解读</h1>\n<p>近几年前端工程化越来越完善，打包工具也已经是前端标配了，像seajs这种老古董早已停止维护，而且使用的人估计也几个了。但这并不能阻止好奇的我，为了了解当年的前端前辈们是如何在浏览器进行代码模块化的，我鼓起勇气翻开了Seajs的源码。下面就和我一起细细品味Seajs源码吧。</p>\n<!-- more -->\n<h2 id="%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8seajs">如何使用seajs<a class="anchor" href="#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8seajs">§</a></h2>\n<p>在看Seajs源码之前，先看看Seajs是如何使用的，毕竟刚入行的时候，大家就都使用browserify、webpack之类的东西了，还从来没有用过Seajs。</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- 首先在页面中引入sea.js，也可以使用CDN资源 --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/javascript<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./sea.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token comment">// 设置一些参数</span>\nseajs<span class="token punctuation">.</span><span class="token method function property-access">config</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  debug<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// debug为false时，在模块加载完毕后会移除head中的script标签</span>\n  base<span class="token operator">:</span> <span class="token string">\'./js/\'</span><span class="token punctuation">,</span> <span class="token comment">// 通过路径加载其他模块的默认根目录</span>\n  alias<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">// 别名</span>\n    jquery<span class="token operator">:</span> <span class="token string">\'<a class="token url-link" href="https://cdn.bootcss.com/jquery/3.2.1/jquery">https://cdn.bootcss.com/jquery/3.2.1/jquery</a>\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nseajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">alert</span><span class="token punctuation">(</span>main<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n//main.js\ndefine(function (require, exports, module) {\n  // require(\'jquery\')\n  // var $ = window.$\n\n  module.exports = \'main-module\'\n})\n</code></pre>\n<h2 id="seajs%E7%9A%84%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE">seajs的参数配置<a class="anchor" href="#seajs%E7%9A%84%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE">§</a></h2>\n<p>首先通过script导入seajs，然后对seajs进行一些配置。seajs的配置参数很多具体不详细介绍，seajs将配置项会存入一个私有对象data中，并且如果之前有设置过某个属性，并且这个属性是数组或者对象，会将新值与旧值进行合并。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">global<span class="token punctuation">,</span> <span class="token keyword nil">undefined</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>global<span class="token punctuation">.</span><span class="token property-access">seajs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">var</span> data <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">data</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  \n  seajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">config</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">configData</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> key <span class="token keyword">in</span> configData<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> curr <span class="token operator">=</span> configData<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token comment">// 获取当前配置</span>\n      <span class="token keyword">var</span> prev <span class="token operator">=</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token comment">// 获取之前的配置</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prev <span class="token operator">&amp;&amp;</span> <span class="token function">isObject</span><span class="token punctuation">(</span>prev<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 如果之前已经设置过，且为一个对象</span>\n        <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> k <span class="token keyword">in</span> curr<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          prev<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> curr<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token comment">// 用新值覆盖旧值，旧值保留不变</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 如果之前的值为数组，进行concat</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>prev<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          curr <span class="token operator">=</span> prev<span class="token punctuation">.</span><span class="token method function property-access">concat</span><span class="token punctuation">(</span>curr<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 确保 base 为一个路径</span>\n        <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>key <span class="token operator">===</span> <span class="token string">"base"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 必须已 "/" 结尾</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>curr<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token string">"/"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            curr <span class="token operator">+=</span> <span class="token string">"/"</span>\n          <span class="token punctuation">}</span>\n          curr <span class="token operator">=</span> <span class="token function">addBase</span><span class="token punctuation">(</span>curr<span class="token punctuation">)</span> <span class="token comment">// 转换为绝对路径</span>\n        <span class="token punctuation">}</span>\n\n        <span class="token comment">// Set config</span>\n        data<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> curr  \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>设置的时候还有个比较特殊的地方，就是base这个属性。这表示所有模块加载的基础路径，所以格式必须为一个路径，并且该路径最后会转换为绝对路径。比如，我的配置为<code>base: \'./js\'</code>，我当前访问的域名为<code>http://qq.com/web/index.html</code>，最后base属性会被转化为<code>http://qq.com/web/js/</code>。然后，所有依赖的模块id都会根据该路径转换为uri，除非有定义其他配置，关于配置点到为止，到用到的地方再来细说。</p>\n<h2 id="%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E4%B8%8E%E6%89%A7%E8%A1%8C">模块的加载与执行<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E4%B8%8E%E6%89%A7%E8%A1%8C">§</a></h2>\n<p>下面我们调用了use方法，该方法就是用来加载模块的地方，类似与requirejs中的require方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// requirejs</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'main\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>main<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>只是这里的依赖项，seajs可以传入字符串，而requirejs必须为一个数组，seajs会将字符串转为数组，在内部seajs.use会直接调用Module.use。这个Module为一个构造函数，里面挂载了所有与模块加载相关的方法，还有很多静态方法，比如实例化Module、转换模块id为uri、定义模块等等，废话不多说直接看代码。</p>\n<pre class="language-javascript"><code class="language-javascript">seajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>ids<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> data<span class="token punctuation">.</span><span class="token property-access">cwd</span> <span class="token operator">+</span> <span class="token string">"_use_"</span> <span class="token operator">+</span> <span class="token function">cid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> seajs\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 该方法用来加载一个匿名模块</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> uri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果是通过seajs.use调用，uri是自动生成的</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>\n    uri<span class="token punctuation">,</span>\n    <span class="token function">isArray</span><span class="token punctuation">(</span>ids<span class="token punctuation">)</span> <span class="token operator">?</span> ids <span class="token operator">:</span> <span class="token punctuation">[</span>ids<span class="token punctuation">]</span> <span class="token comment">// 这里会将依赖模块转成数组</span>\n  <span class="token punctuation">)</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span> <span class="token comment">// 表示当前模块的入口为本身，后面还会把这个值传入他的依赖模块</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">history</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token comment">// 这个值后面会用来标识依赖模块是否已经全部加载完毕</span>\n\n  mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">callback</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//设置模块加载完毕的回调，这一部分很重要，尤其是exec方法</span>\n    <span class="token keyword">var</span> exports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      exports<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      callback<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>global<span class="token punctuation">,</span> exports<span class="token punctuation">)</span> <span class="token comment">//执行回调</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  mod<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这个use方法一共做了三件事：</p>\n<ol>\n<li>调用Module.get，进行Module实例化</li>\n<li>为模块绑定回调函数</li>\n<li>调用load，进行依赖模块的加载</li>\n</ol>\n<h3 id="%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%A8%A1%E5%9D%97%E4%B8%80%E5%88%87%E7%9A%84%E5%BC%80%E7%AB%AF">实例化模块，一切的开端<a class="anchor" href="#%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%A8%A1%E5%9D%97%E4%B8%80%E5%88%87%E7%9A%84%E5%BC%80%E7%AB%AF">§</a></h3>\n<p>首先use方法调用了get静态方法，这个方法是对Module进行实例化，并且将实例化的对象存入到全局对象cachedMods中进行缓存，并且以uri作为模块的标识，如果之后有其他模块加载该模块就能直接在缓存中获取。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> cachedMods <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">cache</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 模块的缓存对象</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">get</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> cachedMods<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">(</span>cachedMods<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Module</span></span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">uri</span> <span class="token operator">=</span> uri\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">=</span> deps <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// Ref the dependence modules</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>绑定的回调函数会在所有模块加载完毕之后调用，我们先跳过，直接看load方法。load方法会先把所有依赖的模块id转为uri，然后进行实例化，最后调用fetch方法，绑定模块加载成功或失败的回调，最后进行模块加载。具体代码如下<code>(代码经过精简)</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 所有依赖加载完毕后执行 onload</span>\n<span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">load</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADING</span> <span class="token comment">// 状态置为模块加载中</span>\n  \n  <span class="token comment">// 调用resolve方法，将模块id转为uri。</span>\n  <span class="token comment">// 比如之前的"mian"，会在前面加上我们之前设置的base，然后在后面拼上js后缀</span>\n  <span class="token comment">// 最后变成: "<a class="token url-link" href="http://qq.com/web/js/main.js">http://qq.com/web/js/main.js</a>"</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 遍历所有依赖项的uri，然后进行依赖模块的实例化</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 将entry传入到所有的依赖模块，这个entry是我们在use方法的时候设置的</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">pass</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token method function property-access">onload</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 开始进行并行加载</span>\n  <span class="token keyword">var</span> requestCache <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token keyword">var</span> m\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    m <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">// 获取之前实例化的模块对象</span>\n    m<span class="token punctuation">.</span><span class="token method function property-access">fetch</span><span class="token punctuation">(</span>requestCache<span class="token punctuation">)</span> <span class="token comment">// 进行fetch</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 发送请求进行模块的加载</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> requestUri <span class="token keyword">in</span> requestCache<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>requestCache<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      requestCache<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">//调用 seajs.request</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B0%86%E6%A8%A1%E5%9D%97id%E8%BD%AC%E4%B8%BAuri">将模块id转为uri<a class="anchor" href="#%E5%B0%86%E6%A8%A1%E5%9D%97id%E8%BD%AC%E4%B8%BAuri">§</a></h3>\n<p>resolve方法实现可以稍微看下，基本上是把config里面的参数拿出来，进行拼接uri的处理。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> ids <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token comment">// 取出所有依赖模块的id</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token comment">// 进行遍历操作</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> ids<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>ids<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> mod<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">)</span> <span class="token comment">//将模块id转为uri</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> uris\n<span class="token punctuation">}</span>\n\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> refUri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> emitData <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> id<span class="token punctuation">,</span> refUri<span class="token operator">:</span> refUri <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> seajs<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>emitData<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> refUri<span class="token punctuation">)</span> <span class="token comment">// 调用 id2Uri</span>\n<span class="token punctuation">}</span>\n\nseajs<span class="token punctuation">.</span><span class="token property-access">resolve</span> <span class="token operator">=</span> id2Uri\n\n<span class="token keyword">function</span> <span class="token function">id2Uri</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> refUri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 将id转为uri，转换配置中的一些变量</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>id<span class="token punctuation">)</span> <span class="token keyword control-flow">return</span> <span class="token string">""</span>\n\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parsePaths</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseVars</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">normalize</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n\n  <span class="token keyword">var</span> uri <span class="token operator">=</span> <span class="token function">addBase</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> refUri<span class="token punctuation">)</span>\n  uri <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  uri <span class="token operator">=</span> <span class="token function">parseMap</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> uri\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后就是调用了<code>id2Uri</code>，将id转为uri，其中调用了很多的<code>parse</code>方法，这些方法不一一去看，原理大致一样，主要看下<code>parseAlias</code>。如果这个id有定义过alias，将alias取出，比如id为<code>&quot;jquery&quot;</code>，之前在定义alias中又有定义<code>jquery: \'https://cdn.bootcss.com/jquery/3.2.1/jquery\'</code>，则将id转化为<code>\'https://cdn.bootcss.com/jquery/3.2.1/jquery\'</code>。代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果有定义alias，将id替换为别名对应的地址</span>\n  <span class="token keyword">var</span> alias <span class="token operator">=</span> data<span class="token punctuation">.</span><span class="token property-access">alias</span>\n  <span class="token keyword control-flow">return</span> alias <span class="token operator">&amp;&amp;</span> <span class="token function">isString</span><span class="token punctuation">(</span>alias<span class="token punctuation">[</span>id<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">?</span> alias<span class="token punctuation">[</span>id<span class="token punctuation">]</span> <span class="token operator">:</span> id\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E4%B8%BA%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%85%A5%E5%8F%A3%E6%96%B9%E4%BE%BF%E8%BF%BD%E6%A0%B9%E6%BA%AF%E6%BA%90">为依赖添加入口，方便追根溯源<a class="anchor" href="#%E4%B8%BA%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%85%A5%E5%8F%A3%E6%96%B9%E4%BE%BF%E8%BF%BD%E6%A0%B9%E6%BA%AF%E6%BA%90">§</a></h3>\n<p>resolve之后获得uri，通过uri进行Module的实例化，然后调用pass方法，这个方法主要是记录入口模块到底有多少个未加载的依赖项，存入到remain中，并将entry都存入到依赖模块的_entry属性中，方便回溯。而这个remain用于计数，最后onload的模块数与remain相等就激活entry模块的回调。具体代码如下<code>(代码经过精简)</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">pass</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> len <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token comment">// 遍历入口模块的_entry属性，这个属性一般只有一个值，就是它本身</span>\n  <span class="token comment">// 具体可以回去看use方法 -> mod._entry.push(mod)</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> entry <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token comment">// 获取入口模块</span>\n    <span class="token keyword">var</span> count <span class="token operator">=</span> <span class="token number">0</span> <span class="token comment">// 计数器，用于统计未进行加载的模块</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> m <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">//取出依赖的模块</span>\n      <span class="token comment">// 如果模块未加载，并且在entry中未使用，将entry传递给依赖</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>m<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">&lt;</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADED</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>entry<span class="token punctuation">.</span><span class="token property-access">history</span><span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        entry<span class="token punctuation">.</span><span class="token property-access">history</span><span class="token punctuation">[</span>m<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">// 在入口模块标识曾经加载过该依赖模块</span>\n        count<span class="token operator">++</span>\n        m<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>entry<span class="token punctuation">)</span> <span class="token comment">// 将入口模块存入依赖模块的_entry属性</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 如果未加载的依赖模块大于0</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>count <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这里`count - 1`的原因也可以回去看use方法 -> mod.remain = 1</span>\n      <span class="token comment">// remain的初始值就是1，表示默认就会有一个未加载的模块，所有需要减1</span>\n      entry<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">+=</span> count <span class="token operator">-</span> <span class="token number">1</span>\n      <span class="token comment">// 如果有未加载的依赖项，则移除掉入口模块的entry</span>\n      mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      i<span class="token operator">--</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97">如何发起请求，下载其他依赖模块？<a class="anchor" href="#%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>总的来说pass方法就是记录了remain的数值，接下来就是重头戏了，调用所有依赖项的fetch方法，然后进行依赖模块的加载。调用fetch方法的时候会传入一个requestCache对象，该对象用来缓存所有依赖模块的request方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> requestCache <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  m <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">// 获取之前实例化的模块对象</span>\n  m<span class="token punctuation">.</span><span class="token method function property-access">fetch</span><span class="token punctuation">(</span>requestCache<span class="token punctuation">)</span> <span class="token comment">// 进行fetch</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fetch</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">requestCache</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> uri <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">uri</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">FETCHING</span>\n  callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>mod<span class="token punctuation">]</span>\n\n  <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"request"</span><span class="token punctuation">,</span> emitData <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token comment">// 设置加载script时的一些数据</span>\n    uri<span class="token operator">:</span> uri<span class="token punctuation">,</span>\n    requestUri<span class="token operator">:</span> requestUri<span class="token punctuation">,</span>\n    onRequest<span class="token operator">:</span> onRequest<span class="token punctuation">,</span>\n    charset<span class="token operator">:</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">)</span> <span class="token operator">?</span> data<span class="token punctuation">.</span><span class="token method function property-access">charset</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span> <span class="token operator">:</span> data<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">,</span>\n    crossorigin<span class="token operator">:</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span><span class="token property-access">crossorigin</span><span class="token punctuation">)</span> <span class="token operator">?</span> data<span class="token punctuation">.</span><span class="token method function property-access">crossorigin</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span> <span class="token operator">:</span> data<span class="token punctuation">.</span><span class="token property-access">crossorigin</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>emitData<span class="token punctuation">.</span><span class="token property-access">requested</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//发送请求加载js文件</span>\n    requestCache<span class="token punctuation">[</span>emitData<span class="token punctuation">.</span><span class="token property-access">requestUri</span><span class="token punctuation">]</span> <span class="token operator">=</span> sendRequest\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">sendRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 被request方法，最终会调用 seajs.request</span>\n    seajs<span class="token punctuation">.</span><span class="token method function property-access">request</span><span class="token punctuation">(</span>emitData<span class="token punctuation">.</span><span class="token property-access">requestUri</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">onRequest</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">crossorigin</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">onRequest</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载完毕的回调</span>\n    <span class="token keyword">var</span> m<span class="token punctuation">,</span> mods <span class="token operator">=</span> callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span>\n    <span class="token keyword">delete</span> callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span>\n    <span class="token comment">// 保存元数据到匿名模块，uri为请求js的uri</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>anonymousMeta<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> anonymousMeta<span class="token punctuation">)</span>\n      anonymousMeta <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>m <span class="token operator">=</span> mods<span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// When 404 occurs, the params error will be true</span>\n      <span class="token keyword control-flow">if</span><span class="token punctuation">(</span>error <span class="token operator">===</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        m<span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        m<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>经过fetch操作后，能够得到一个<code>requestCache</code>对象，该对象缓存了模块的加载方法，从上面代码就能看到，该方法最后调用的是<code>seajs.request</code>方法，并且传入了一个onRequest回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> requestUri <span class="token keyword">in</span> requestCache<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  requestCache<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">//调用 seajs.request</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//用来加载js脚本的方法</span>\nseajs<span class="token punctuation">.</span><span class="token property-access">request</span> <span class="token operator">=</span> request\n\n<span class="token keyword">function</span> <span class="token function">request</span><span class="token punctuation">(</span><span class="token parameter">url<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> charset<span class="token punctuation">,</span> crossorigin</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> node <span class="token operator">=</span> doc<span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span><span class="token string">"script"</span><span class="token punctuation">)</span>\n  <span class="token function">addOnload</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> url<span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">async</span> <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">//异步加载</span>\n  node<span class="token punctuation">.</span><span class="token property-access">src</span> <span class="token operator">=</span> url\n  head<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">addOnload</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  node<span class="token punctuation">.</span><span class="token property-access">onload</span> <span class="token operator">=</span> onload\n  node<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"error"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> uri<span class="token operator">:</span> url<span class="token punctuation">,</span> node<span class="token operator">:</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">onload</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">onload</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    node<span class="token punctuation">.</span><span class="token property-access">onload</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">onerror</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">onreadystatechange</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    <span class="token comment">// 脚本加载完毕的回调</span>\n    <span class="token function">callback</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%80%9A%E7%9F%A5%E5%85%A5%E5%8F%A3%E6%A8%A1%E5%9D%97">通知入口模块<a class="anchor" href="#%E9%80%9A%E7%9F%A5%E5%85%A5%E5%8F%A3%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>上面就是request的逻辑，只不过删除了一些兼容代码，其实原理很简单，和requirejs一样，都是创建script标签，绑定onload事件，然后插入head中。在onload事件发生时，会调用之前fetch定义的onRequest方法，该方法最后会调用load方法。没错这个load方法又出现了，那么依赖模块调用和入口模块调用有什么区别呢，主要体现在下面代码中：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">onload</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果这个依赖模块没有另外的依赖模块，那么他的entry就会存在，然后调用onload模块，但是如果这个代码中有<code>define</code>方法，并且还有其他依赖项，就会走上面那么逻辑，遍历依赖项，转换uri，调用fetch巴拉巴拉。这个后面再看，先看看onload会做什么。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onload</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADED</span> \n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> entry <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token comment">// 每次加载完毕一个依赖模块，remain就-1</span>\n    <span class="token comment">// 直到remain为0，就表示所有依赖模块加载完毕</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">--</span>entry<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 最后就会调用entry的callback方法</span>\n      <span class="token comment">// 这就是前面为什么要给每个依赖模块存入entry</span>\n      entry<span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E6%89%A7%E8%A1%8C%E5%AE%8C%E6%88%90%E5%85%A8%E9%83%A8%E6%93%8D%E4%BD%9C">依赖模块执行，完成全部操作<a class="anchor" href="#%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E6%89%A7%E8%A1%8C%E5%AE%8C%E6%88%90%E5%85%A8%E9%83%A8%E6%93%8D%E4%BD%9C">§</a></h3>\n<p>还记得最开始use方法中给入口模块设置callback方法吗，没错，兜兜转转我们又回到了起点。</p>\n<pre class="language-javascript"><code class="language-javascript">mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">callback</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//设置模块加载完毕的回调</span>\n  <span class="token keyword">var</span> exports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 执行所有依赖模块的exec方法，存入exports数组</span>\n    exports<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    callback<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>global<span class="token punctuation">,</span> exports<span class="token punctuation">)</span> <span class="token comment">//执行回调</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 移除一些属性</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">callback</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">history</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">remain</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>那么这个exec到底做了什么呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exec</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">EXECUTING</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> m <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>id<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">return</span> m<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> factory <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">factory</span>\n\n  <span class="token comment">// 调用define定义的回调</span>\n  <span class="token comment">// 传入commonjs相关三个参数: require, module.exports, module</span>\n  <span class="token keyword">var</span> exports <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> require<span class="token punctuation">,</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>exports <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    exports <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token comment">//如果函数没有返回值，就取mod.exports</span>\n  <span class="token punctuation">}</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> exports\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">EXECUTED</span>\n\n  <span class="token keyword control-flow">return</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token comment">// 返回模块的exports</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里的factory就是依赖模块define中定义的回调函数，例如我们加载的<code>main.js</code>中，定义了一个模块。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token string">\'main-module\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>那么调用这个factory的时候，exports就为module.exports，也是是字符串<code>&quot;main-moudle&quot;</code>。最后callback传入的参数就是<code>&quot;main-moudle&quot;</code>。所以我们执行最开头写的那段代码，最后会在页面上弹出<code>main-moudle</code>。</p>\n<p><img src="https://file.shenfq.com/18-8-13/86590747.jpg" alt="执行结果"></p>\n<h2 id="define%E5%AE%9A%E4%B9%89%E6%A8%A1%E5%9D%97">define定义模块<a class="anchor" href="#define%E5%AE%9A%E4%B9%89%E6%A8%A1%E5%9D%97">§</a></h2>\n<p>你以为到这里就结束了吗？并没有。前面只说了加载依赖模块中define方法中没有其他依赖，那如果有其他依赖呢？废话不多说，先看看define方法做了什么：</p>\n<pre class="language-javascript"><code class="language-javascript">global<span class="token punctuation">.</span><span class="token property-access">define</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">define</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">define</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> factory</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> argsLen <span class="token operator">=</span> arguments<span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token comment">// 参数校准</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>argsLen <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    factory <span class="token operator">=</span> id\n    id <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>argsLen <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    factory <span class="token operator">=</span> deps\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      deps <span class="token operator">=</span> id\n      id <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      deps <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 如果没有直接传入依赖数组</span>\n  <span class="token comment">// 则从factory中提取所有的依赖模块到dep数组中</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isArray</span><span class="token punctuation">(</span>deps<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    deps <span class="token operator">=</span> <span class="token keyword">typeof</span> parseDependencies <span class="token operator">===</span> <span class="token string">"undefined"</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token function">parseDependencies</span><span class="token punctuation">(</span>factory<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> meta <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载与定义的元数据</span>\n    id<span class="token operator">:</span> id<span class="token punctuation">,</span>\n    uri<span class="token operator">:</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    deps<span class="token operator">:</span> deps<span class="token punctuation">,</span>\n    factory<span class="token operator">:</span> factory\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 激活define事件, used in nocache plugin, seajs node version etc</span>\n  <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"define"</span><span class="token punctuation">,</span> meta<span class="token punctuation">)</span>\n\n  meta<span class="token punctuation">.</span><span class="token property-access">uri</span> <span class="token operator">?</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>meta<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">,</span> meta<span class="token punctuation">)</span> <span class="token operator">:</span>\n    <span class="token comment">// 在脚本加载完毕的onload事件进行save</span>\n    anonymousMeta <span class="token operator">=</span> meta\n  <span class="token punctuation">}</span>\n</code></pre>\n<p>首先进行了参数的修正，这个逻辑很简单，直接跳过。第二步判断了有没有依赖数组，如果没有，就通过parseDependencies方法从factory中获取。这个方法很有意思，是一个状态机，会一步步的去解析字符串，匹配到require，将其中的模块取出，最后放到一个数组里。这个方法在requirejs中是通过正则实现的，早期seajs也是通过正则匹配的，后来改成了这种状态机的方式，可能是考虑到性能的问题。seajs的仓库中专门有一个模块来讲这个东西的，请看<a href="https://github.com/seajs/crequire">链接</a>。</p>\n<p>获取到依赖模块之后又设置了一个meta对象，这个就表示这个模块的原数据，里面有记录模块的依赖项、id、factory等。如果这个模块define的时候没有设置id，就表示是个匿名模块，那怎么才能与之前发起请求的那个mod相匹配呢？</p>\n<p>这里就有了一个全局变量<code>anonymousMeta</code>，先将元数据放入这个对象。然后回过头看看模块加载时设置的onload函数里面有一段就是获取这个全局变量的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">onRequest</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载完毕的回调</span>\n<span class="token spread operator">...</span>\n  <span class="token comment">// 保存元数据到匿名模块，uri为请求js的uri</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>anonymousMeta<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> anonymousMeta<span class="token punctuation">)</span>\n    anonymousMeta <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>不管是不是匿名模块，最后都是通过save方法，将元数据存入到mod中。</p>\n<pre class="language-javascript"><code class="language-javascript"> <span class="token comment">// 存储元数据到 cachedMods 中</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">save</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> meta</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">&lt;</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">SAVED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">||</span> uri\n    mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">factory</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">factory</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">SAVED</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里完成之后，就是和前面的逻辑一样了，先去校验当前模块有没有依赖项，如果有依赖项，就去加载依赖项和use的逻辑是一样的，等依赖项全部加载完毕后，通知入口模块的remain减1，知道remain为0，最后调用入口模块的回调方法。整个seajs的逻辑就已经全部走通，Yeah！</p>\n<hr>\n<h2 id="%E7%BB%93%E8%AF%AD">结语<a class="anchor" href="#%E7%BB%93%E8%AF%AD">§</a></h2>\n<p>有过看requirejs的经验，再来看seajs还是顺畅很多，对模块化的理解有了更加深刻的理解。阅读源码之前还是得对框架有个基本认识，并且有使用过，要不然很多地方都很懵懂。所以以后还是阅读一些工作中有经常使用的框架或类库的源码进行阅读，不能总像个无头苍蝇一样。</p>\n<p>最后用一张流程图，总结下seajs的加载过程。</p>\n<p><img src="https://file.shenfq.com/18-8-12/312991.jpg" alt="seajs加载流程图"></p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "seajs\u6E90\u7801\u89E3\u8BFB"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>近几年前端工程化越来越完善，打包工具也已经是前端标配了，像seajs这种老古董早已停止维护，而且使用的人估计也几个了。但这并不能阻止好奇的我，为了了解当年的前端前辈们是如何在浏览器进行代码模块化的，我鼓起勇气翻开了Seajs的源码。下面就和我一起细细品味Seajs源码吧。</p>\n<!-- more -->\n<h2 id="%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8seajs">如何使用seajs<a class="anchor" href="#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8seajs">§</a></h2>\n<p>在看Seajs源码之前，先看看Seajs是如何使用的，毕竟刚入行的时候，大家就都使用browserify、webpack之类的东西了，还从来没有用过Seajs。</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- 首先在页面中引入sea.js，也可以使用CDN资源 --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/javascript<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./sea.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token comment">// 设置一些参数</span>\nseajs<span class="token punctuation">.</span><span class="token method function property-access">config</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  debug<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// debug为false时，在模块加载完毕后会移除head中的script标签</span>\n  base<span class="token operator">:</span> <span class="token string">\'./js/\'</span><span class="token punctuation">,</span> <span class="token comment">// 通过路径加载其他模块的默认根目录</span>\n  alias<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token comment">// 别名</span>\n    jquery<span class="token operator">:</span> <span class="token string">\'<a class="token url-link" href="https://cdn.bootcss.com/jquery/3.2.1/jquery">https://cdn.bootcss.com/jquery/3.2.1/jquery</a>\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nseajs<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token string">\'main\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">alert</span><span class="token punctuation">(</span>main<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n//main.js\ndefine(function (require, exports, module) {\n  // require(\'jquery\')\n  // var $ = window.$\n\n  module.exports = \'main-module\'\n})\n</code></pre>\n<h2 id="seajs%E7%9A%84%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE">seajs的参数配置<a class="anchor" href="#seajs%E7%9A%84%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE">§</a></h2>\n<p>首先通过script导入seajs，然后对seajs进行一些配置。seajs的配置参数很多具体不详细介绍，seajs将配置项会存入一个私有对象data中，并且如果之前有设置过某个属性，并且这个属性是数组或者对象，会将新值与旧值进行合并。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">global<span class="token punctuation">,</span> <span class="token keyword nil">undefined</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>global<span class="token punctuation">.</span><span class="token property-access">seajs</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">var</span> data <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">data</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  \n  seajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">config</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">configData</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> key <span class="token keyword">in</span> configData<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> curr <span class="token operator">=</span> configData<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token comment">// 获取当前配置</span>\n      <span class="token keyword">var</span> prev <span class="token operator">=</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token comment">// 获取之前的配置</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>prev <span class="token operator">&amp;&amp;</span> <span class="token function">isObject</span><span class="token punctuation">(</span>prev<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 如果之前已经设置过，且为一个对象</span>\n        <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> k <span class="token keyword">in</span> curr<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          prev<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token operator">=</span> curr<span class="token punctuation">[</span>k<span class="token punctuation">]</span> <span class="token comment">// 用新值覆盖旧值，旧值保留不变</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 如果之前的值为数组，进行concat</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>prev<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          curr <span class="token operator">=</span> prev<span class="token punctuation">.</span><span class="token method function property-access">concat</span><span class="token punctuation">(</span>curr<span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 确保 base 为一个路径</span>\n        <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>key <span class="token operator">===</span> <span class="token string">"base"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 必须已 "/" 结尾</span>\n          <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>curr<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token string">"/"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            curr <span class="token operator">+=</span> <span class="token string">"/"</span>\n          <span class="token punctuation">}</span>\n          curr <span class="token operator">=</span> <span class="token function">addBase</span><span class="token punctuation">(</span>curr<span class="token punctuation">)</span> <span class="token comment">// 转换为绝对路径</span>\n        <span class="token punctuation">}</span>\n\n        <span class="token comment">// Set config</span>\n        data<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> curr  \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>设置的时候还有个比较特殊的地方，就是base这个属性。这表示所有模块加载的基础路径，所以格式必须为一个路径，并且该路径最后会转换为绝对路径。比如，我的配置为<code>base: \'./js\'</code>，我当前访问的域名为<code>http://qq.com/web/index.html</code>，最后base属性会被转化为<code>http://qq.com/web/js/</code>。然后，所有依赖的模块id都会根据该路径转换为uri，除非有定义其他配置，关于配置点到为止，到用到的地方再来细说。</p>\n<h2 id="%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E4%B8%8E%E6%89%A7%E8%A1%8C">模块的加载与执行<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E4%B8%8E%E6%89%A7%E8%A1%8C">§</a></h2>\n<p>下面我们调用了use方法，该方法就是用来加载模块的地方，类似与requirejs中的require方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// requirejs</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'main\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">main</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>main<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>只是这里的依赖项，seajs可以传入字符串，而requirejs必须为一个数组，seajs会将字符串转为数组，在内部seajs.use会直接调用Module.use。这个Module为一个构造函数，里面挂载了所有与模块加载相关的方法，还有很多静态方法，比如实例化Module、转换模块id为uri、定义模块等等，废话不多说直接看代码。</p>\n<pre class="language-javascript"><code class="language-javascript">seajs<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>ids<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> data<span class="token punctuation">.</span><span class="token property-access">cwd</span> <span class="token operator">+</span> <span class="token string">"_use_"</span> <span class="token operator">+</span> <span class="token function">cid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> seajs\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 该方法用来加载一个匿名模块</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">use</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">ids<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> uri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果是通过seajs.use调用，uri是自动生成的</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>\n    uri<span class="token punctuation">,</span>\n    <span class="token function">isArray</span><span class="token punctuation">(</span>ids<span class="token punctuation">)</span> <span class="token operator">?</span> ids <span class="token operator">:</span> <span class="token punctuation">[</span>ids<span class="token punctuation">]</span> <span class="token comment">// 这里会将依赖模块转成数组</span>\n  <span class="token punctuation">)</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>mod<span class="token punctuation">)</span> <span class="token comment">// 表示当前模块的入口为本身，后面还会把这个值传入他的依赖模块</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">history</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token comment">// 这个值后面会用来标识依赖模块是否已经全部加载完毕</span>\n\n  mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">callback</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//设置模块加载完毕的回调，这一部分很重要，尤其是exec方法</span>\n    <span class="token keyword">var</span> exports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      exports<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      callback<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>global<span class="token punctuation">,</span> exports<span class="token punctuation">)</span> <span class="token comment">//执行回调</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  mod<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这个use方法一共做了三件事：</p>\n<ol>\n<li>调用Module.get，进行Module实例化</li>\n<li>为模块绑定回调函数</li>\n<li>调用load，进行依赖模块的加载</li>\n</ol>\n<h3 id="%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%A8%A1%E5%9D%97%E4%B8%80%E5%88%87%E7%9A%84%E5%BC%80%E7%AB%AF">实例化模块，一切的开端<a class="anchor" href="#%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%A8%A1%E5%9D%97%E4%B8%80%E5%88%87%E7%9A%84%E5%BC%80%E7%AB%AF">§</a></h3>\n<p>首先use方法调用了get静态方法，这个方法是对Module进行实例化，并且将实例化的对象存入到全局对象cachedMods中进行缓存，并且以uri作为模块的标识，如果之后有其他模块加载该模块就能直接在缓存中获取。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> cachedMods <span class="token operator">=</span> seajs<span class="token punctuation">.</span><span class="token property-access">cache</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// 模块的缓存对象</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">get</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> cachedMods<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">(</span>cachedMods<span class="token punctuation">[</span>uri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Module</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Module</span></span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">uri</span> <span class="token operator">=</span> uri\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">=</span> deps <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">// Ref the dependence modules</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>绑定的回调函数会在所有模块加载完毕之后调用，我们先跳过，直接看load方法。load方法会先把所有依赖的模块id转为uri，然后进行实例化，最后调用fetch方法，绑定模块加载成功或失败的回调，最后进行模块加载。具体代码如下<code>(代码经过精简)</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 所有依赖加载完毕后执行 onload</span>\n<span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">load</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADING</span> <span class="token comment">// 状态置为模块加载中</span>\n  \n  <span class="token comment">// 调用resolve方法，将模块id转为uri。</span>\n  <span class="token comment">// 比如之前的"mian"，会在前面加上我们之前设置的base，然后在后面拼上js后缀</span>\n  <span class="token comment">// 最后变成: "<a class="token url-link" href="http://qq.com/web/js/main.js">http://qq.com/web/js/main.js</a>"</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token comment">// 遍历所有依赖项的uri，然后进行依赖模块的实例化</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 将entry传入到所有的依赖模块，这个entry是我们在use方法的时候设置的</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">pass</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token method function property-access">onload</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 开始进行并行加载</span>\n  <span class="token keyword">var</span> requestCache <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n  <span class="token keyword">var</span> m\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    m <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">// 获取之前实例化的模块对象</span>\n    m<span class="token punctuation">.</span><span class="token method function property-access">fetch</span><span class="token punctuation">(</span>requestCache<span class="token punctuation">)</span> <span class="token comment">// 进行fetch</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 发送请求进行模块的加载</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> requestUri <span class="token keyword">in</span> requestCache<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>requestCache<span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      requestCache<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">//调用 seajs.request</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B0%86%E6%A8%A1%E5%9D%97id%E8%BD%AC%E4%B8%BAuri">将模块id转为uri<a class="anchor" href="#%E5%B0%86%E6%A8%A1%E5%9D%97id%E8%BD%AC%E4%B8%BAuri">§</a></h3>\n<p>resolve方法实现可以稍微看下，基本上是把config里面的参数拿出来，进行拼接uri的处理。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> ids <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token comment">// 取出所有依赖模块的id</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token comment">// 进行遍历操作</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> ids<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>ids<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> mod<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">)</span> <span class="token comment">//将模块id转为uri</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> uris\n<span class="token punctuation">}</span>\n\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> refUri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> emitData <span class="token operator">=</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> id<span class="token punctuation">,</span> refUri<span class="token operator">:</span> refUri <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> seajs<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>emitData<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">,</span> refUri<span class="token punctuation">)</span> <span class="token comment">// 调用 id2Uri</span>\n<span class="token punctuation">}</span>\n\nseajs<span class="token punctuation">.</span><span class="token property-access">resolve</span> <span class="token operator">=</span> id2Uri\n\n<span class="token keyword">function</span> <span class="token function">id2Uri</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> refUri</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 将id转为uri，转换配置中的一些变量</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>id<span class="token punctuation">)</span> <span class="token keyword control-flow">return</span> <span class="token string">""</span>\n\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parsePaths</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseVars</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">normalize</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n  id <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>\n\n  <span class="token keyword">var</span> uri <span class="token operator">=</span> <span class="token function">addBase</span><span class="token punctuation">(</span>id<span class="token punctuation">,</span> refUri<span class="token punctuation">)</span>\n  uri <span class="token operator">=</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  uri <span class="token operator">=</span> <span class="token function">parseMap</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> uri\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后就是调用了<code>id2Uri</code>，将id转为uri，其中调用了很多的<code>parse</code>方法，这些方法不一一去看，原理大致一样，主要看下<code>parseAlias</code>。如果这个id有定义过alias，将alias取出，比如id为<code>&quot;jquery&quot;</code>，之前在定义alias中又有定义<code>jquery: \'https://cdn.bootcss.com/jquery/3.2.1/jquery\'</code>，则将id转化为<code>\'https://cdn.bootcss.com/jquery/3.2.1/jquery\'</code>。代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">parseAlias</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果有定义alias，将id替换为别名对应的地址</span>\n  <span class="token keyword">var</span> alias <span class="token operator">=</span> data<span class="token punctuation">.</span><span class="token property-access">alias</span>\n  <span class="token keyword control-flow">return</span> alias <span class="token operator">&amp;&amp;</span> <span class="token function">isString</span><span class="token punctuation">(</span>alias<span class="token punctuation">[</span>id<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">?</span> alias<span class="token punctuation">[</span>id<span class="token punctuation">]</span> <span class="token operator">:</span> id\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E4%B8%BA%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%85%A5%E5%8F%A3%E6%96%B9%E4%BE%BF%E8%BF%BD%E6%A0%B9%E6%BA%AF%E6%BA%90">为依赖添加入口，方便追根溯源<a class="anchor" href="#%E4%B8%BA%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%85%A5%E5%8F%A3%E6%96%B9%E4%BE%BF%E8%BF%BD%E6%A0%B9%E6%BA%AF%E6%BA%90">§</a></h3>\n<p>resolve之后获得uri，通过uri进行Module的实例化，然后调用pass方法，这个方法主要是记录入口模块到底有多少个未加载的依赖项，存入到remain中，并将entry都存入到依赖模块的_entry属性中，方便回溯。而这个remain用于计数，最后onload的模块数与remain相等就激活entry模块的回调。具体代码如下<code>(代码经过精简)</code>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">pass</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> len <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token comment">// 遍历入口模块的_entry属性，这个属性一般只有一个值，就是它本身</span>\n  <span class="token comment">// 具体可以回去看use方法 -> mod._entry.push(mod)</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> entry <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token comment">// 获取入口模块</span>\n    <span class="token keyword">var</span> count <span class="token operator">=</span> <span class="token number">0</span> <span class="token comment">// 计数器，用于统计未进行加载的模块</span>\n    <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">var</span> m <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span><span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">//取出依赖的模块</span>\n      <span class="token comment">// 如果模块未加载，并且在entry中未使用，将entry传递给依赖</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>m<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">&lt;</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADED</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>entry<span class="token punctuation">.</span><span class="token property-access">history</span><span class="token punctuation">.</span><span class="token method function property-access">hasOwnProperty</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        entry<span class="token punctuation">.</span><span class="token property-access">history</span><span class="token punctuation">[</span>m<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">// 在入口模块标识曾经加载过该依赖模块</span>\n        count<span class="token operator">++</span>\n        m<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>entry<span class="token punctuation">)</span> <span class="token comment">// 将入口模块存入依赖模块的_entry属性</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 如果未加载的依赖模块大于0</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>count <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 这里`count - 1`的原因也可以回去看use方法 -> mod.remain = 1</span>\n      <span class="token comment">// remain的初始值就是1，表示默认就会有一个未加载的模块，所有需要减1</span>\n      entry<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">+=</span> count <span class="token operator">-</span> <span class="token number">1</span>\n      <span class="token comment">// 如果有未加载的依赖项，则移除掉入口模块的entry</span>\n      mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      i<span class="token operator">--</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97">如何发起请求，下载其他依赖模块？<a class="anchor" href="#%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>总的来说pass方法就是记录了remain的数值，接下来就是重头戏了，调用所有依赖项的fetch方法，然后进行依赖模块的加载。调用fetch方法的时候会传入一个requestCache对象，该对象用来缓存所有依赖模块的request方法。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> requestCache <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  m <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token comment">// 获取之前实例化的模块对象</span>\n  m<span class="token punctuation">.</span><span class="token method function property-access">fetch</span><span class="token punctuation">(</span>requestCache<span class="token punctuation">)</span> <span class="token comment">// 进行fetch</span>\n<span class="token punctuation">}</span>\n\n<span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">fetch</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">requestCache</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  <span class="token keyword">var</span> uri <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">uri</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">FETCHING</span>\n  callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>mod<span class="token punctuation">]</span>\n\n  <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"request"</span><span class="token punctuation">,</span> emitData <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token comment">// 设置加载script时的一些数据</span>\n    uri<span class="token operator">:</span> uri<span class="token punctuation">,</span>\n    requestUri<span class="token operator">:</span> requestUri<span class="token punctuation">,</span>\n    onRequest<span class="token operator">:</span> onRequest<span class="token punctuation">,</span>\n    charset<span class="token operator">:</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">)</span> <span class="token operator">?</span> data<span class="token punctuation">.</span><span class="token method function property-access">charset</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span> <span class="token operator">:</span> data<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">,</span>\n    crossorigin<span class="token operator">:</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span><span class="token property-access">crossorigin</span><span class="token punctuation">)</span> <span class="token operator">?</span> data<span class="token punctuation">.</span><span class="token method function property-access">crossorigin</span><span class="token punctuation">(</span>requestUri<span class="token punctuation">)</span> <span class="token operator">:</span> data<span class="token punctuation">.</span><span class="token property-access">crossorigin</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>emitData<span class="token punctuation">.</span><span class="token property-access">requested</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//发送请求加载js文件</span>\n    requestCache<span class="token punctuation">[</span>emitData<span class="token punctuation">.</span><span class="token property-access">requestUri</span><span class="token punctuation">]</span> <span class="token operator">=</span> sendRequest\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">sendRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 被request方法，最终会调用 seajs.request</span>\n    seajs<span class="token punctuation">.</span><span class="token method function property-access">request</span><span class="token punctuation">(</span>emitData<span class="token punctuation">.</span><span class="token property-access">requestUri</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">onRequest</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">charset</span><span class="token punctuation">,</span> emitData<span class="token punctuation">.</span><span class="token property-access">crossorigin</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">onRequest</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载完毕的回调</span>\n    <span class="token keyword">var</span> m<span class="token punctuation">,</span> mods <span class="token operator">=</span> callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span>\n    <span class="token keyword">delete</span> callbackList<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span>\n    <span class="token comment">// 保存元数据到匿名模块，uri为请求js的uri</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>anonymousMeta<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> anonymousMeta<span class="token punctuation">)</span>\n      anonymousMeta <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>m <span class="token operator">=</span> mods<span class="token punctuation">.</span><span class="token method function property-access">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// When 404 occurs, the params error will be true</span>\n      <span class="token keyword control-flow">if</span><span class="token punctuation">(</span>error <span class="token operator">===</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        m<span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n      <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        m<span class="token punctuation">.</span><span class="token method function property-access">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>经过fetch操作后，能够得到一个<code>requestCache</code>对象，该对象缓存了模块的加载方法，从上面代码就能看到，该方法最后调用的是<code>seajs.request</code>方法，并且传入了一个onRequest回调。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> requestUri <span class="token keyword">in</span> requestCache<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  requestCache<span class="token punctuation">[</span>requestUri<span class="token punctuation">]</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">//调用 seajs.request</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//用来加载js脚本的方法</span>\nseajs<span class="token punctuation">.</span><span class="token property-access">request</span> <span class="token operator">=</span> request\n\n<span class="token keyword">function</span> <span class="token function">request</span><span class="token punctuation">(</span><span class="token parameter">url<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> charset<span class="token punctuation">,</span> crossorigin</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> node <span class="token operator">=</span> doc<span class="token punctuation">.</span><span class="token method function property-access">createElement</span><span class="token punctuation">(</span><span class="token string">"script"</span><span class="token punctuation">)</span>\n  <span class="token function">addOnload</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> url<span class="token punctuation">)</span>\n  node<span class="token punctuation">.</span><span class="token property-access">async</span> <span class="token operator">=</span> <span class="token boolean">true</span> <span class="token comment">//异步加载</span>\n  node<span class="token punctuation">.</span><span class="token property-access">src</span> <span class="token operator">=</span> url\n  head<span class="token punctuation">.</span><span class="token method function property-access">appendChild</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">addOnload</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> callback<span class="token punctuation">,</span> url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  node<span class="token punctuation">.</span><span class="token property-access">onload</span> <span class="token operator">=</span> onload\n  node<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onerror</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"error"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> uri<span class="token operator">:</span> url<span class="token punctuation">,</span> node<span class="token operator">:</span> node <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">onload</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">onload</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    node<span class="token punctuation">.</span><span class="token property-access">onload</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">onerror</span> <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">onreadystatechange</span> <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n    <span class="token comment">// 脚本加载完毕的回调</span>\n    <span class="token function">callback</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%80%9A%E7%9F%A5%E5%85%A5%E5%8F%A3%E6%A8%A1%E5%9D%97">通知入口模块<a class="anchor" href="#%E9%80%9A%E7%9F%A5%E5%85%A5%E5%8F%A3%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>上面就是request的逻辑，只不过删除了一些兼容代码，其实原理很简单，和requirejs一样，都是创建script标签，绑定onload事件，然后插入head中。在onload事件发生时，会调用之前fetch定义的onRequest方法，该方法最后会调用load方法。没错这个load方法又出现了，那么依赖模块调用和入口模块调用有什么区别呢，主要体现在下面代码中：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  mod<span class="token punctuation">.</span><span class="token method function property-access">onload</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果这个依赖模块没有另外的依赖模块，那么他的entry就会存在，然后调用onload模块，但是如果这个代码中有<code>define</code>方法，并且还有其他依赖项，就会走上面那么逻辑，遍历依赖项，转换uri，调用fetch巴拉巴拉。这个后面再看，先看看onload会做什么。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">onload</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">LOADED</span> \n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> entry <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token comment">// 每次加载完毕一个依赖模块，remain就-1</span>\n    <span class="token comment">// 直到remain为0，就表示所有依赖模块加载完毕</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">--</span>entry<span class="token punctuation">.</span><span class="token property-access">remain</span> <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 最后就会调用entry的callback方法</span>\n      <span class="token comment">// 这就是前面为什么要给每个依赖模块存入entry</span>\n      entry<span class="token punctuation">.</span><span class="token method function property-access">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E6%89%A7%E8%A1%8C%E5%AE%8C%E6%88%90%E5%85%A8%E9%83%A8%E6%93%8D%E4%BD%9C">依赖模块执行，完成全部操作<a class="anchor" href="#%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E6%89%A7%E8%A1%8C%E5%AE%8C%E6%88%90%E5%85%A8%E9%83%A8%E6%93%8D%E4%BD%9C">§</a></h3>\n<p>还记得最开始use方法中给入口模块设置callback方法吗，没错，兜兜转转我们又回到了起点。</p>\n<pre class="language-javascript"><code class="language-javascript">mod<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">callback</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//设置模块加载完毕的回调</span>\n  <span class="token keyword">var</span> exports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token keyword">var</span> uris <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> len <span class="token operator">=</span> uris<span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> len<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 执行所有依赖模块的exec方法，存入exports数组</span>\n    exports<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> cachedMods<span class="token punctuation">[</span>uris<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callback<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    callback<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>global<span class="token punctuation">,</span> exports<span class="token punctuation">)</span> <span class="token comment">//执行回调</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 移除一些属性</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">callback</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">history</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">remain</span>\n  <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>那么这个exec到底做了什么呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">exec</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token keyword">this</span>\n\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">EXECUTING</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>mod<span class="token punctuation">.</span><span class="token property-access">_entry</span><span class="token punctuation">.</span><span class="token property-access">length</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">delete</span> mod<span class="token punctuation">.</span><span class="token property-access">_entry</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">function</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token parameter">id</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> m <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">deps</span><span class="token punctuation">[</span>id<span class="token punctuation">]</span>\n    <span class="token keyword control-flow">return</span> m<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> factory <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">factory</span>\n\n  <span class="token comment">// 调用define定义的回调</span>\n  <span class="token comment">// 传入commonjs相关三个参数: require, module.exports, module</span>\n  <span class="token keyword">var</span> exports <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> require<span class="token punctuation">,</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>exports <span class="token operator">===</span> <span class="token keyword nil">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    exports <span class="token operator">=</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token comment">//如果函数没有返回值，就取mod.exports</span>\n  <span class="token punctuation">}</span>\n  mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> exports\n  mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">EXECUTED</span>\n\n  <span class="token keyword control-flow">return</span> mod<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token comment">// 返回模块的exports</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里的factory就是依赖模块define中定义的回调函数，例如我们加载的<code>main.js</code>中，定义了一个模块。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">define</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">require<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token string">\'main-module\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>那么调用这个factory的时候，exports就为module.exports，也是是字符串<code>&quot;main-moudle&quot;</code>。最后callback传入的参数就是<code>&quot;main-moudle&quot;</code>。所以我们执行最开头写的那段代码，最后会在页面上弹出<code>main-moudle</code>。</p>\n<p><img src="https://file.shenfq.com/18-8-13/86590747.jpg" alt="执行结果"></p>\n<h2 id="define%E5%AE%9A%E4%B9%89%E6%A8%A1%E5%9D%97">define定义模块<a class="anchor" href="#define%E5%AE%9A%E4%B9%89%E6%A8%A1%E5%9D%97">§</a></h2>\n<p>你以为到这里就结束了吗？并没有。前面只说了加载依赖模块中define方法中没有其他依赖，那如果有其他依赖呢？废话不多说，先看看define方法做了什么：</p>\n<pre class="language-javascript"><code class="language-javascript">global<span class="token punctuation">.</span><span class="token property-access">define</span> <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token property-access">define</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">define</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">id<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> factory</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> argsLen <span class="token operator">=</span> arguments<span class="token punctuation">.</span><span class="token property-access">length</span>\n\n  <span class="token comment">// 参数校准</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>argsLen <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    factory <span class="token operator">=</span> id\n    id <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>argsLen <span class="token operator">===</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    factory <span class="token operator">=</span> deps\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      deps <span class="token operator">=</span> id\n      id <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      deps <span class="token operator">=</span> <span class="token keyword nil">undefined</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 如果没有直接传入依赖数组</span>\n  <span class="token comment">// 则从factory中提取所有的依赖模块到dep数组中</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">isArray</span><span class="token punctuation">(</span>deps<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">isFunction</span><span class="token punctuation">(</span>factory<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    deps <span class="token operator">=</span> <span class="token keyword">typeof</span> parseDependencies <span class="token operator">===</span> <span class="token string">"undefined"</span> <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token function">parseDependencies</span><span class="token punctuation">(</span>factory<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">var</span> meta <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载与定义的元数据</span>\n    id<span class="token operator">:</span> id<span class="token punctuation">,</span>\n    uri<span class="token operator">:</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    deps<span class="token operator">:</span> deps<span class="token punctuation">,</span>\n    factory<span class="token operator">:</span> factory\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 激活define事件, used in nocache plugin, seajs node version etc</span>\n  <span class="token function">emit</span><span class="token punctuation">(</span><span class="token string">"define"</span><span class="token punctuation">,</span> meta<span class="token punctuation">)</span>\n\n  meta<span class="token punctuation">.</span><span class="token property-access">uri</span> <span class="token operator">?</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>meta<span class="token punctuation">.</span><span class="token property-access">uri</span><span class="token punctuation">,</span> meta<span class="token punctuation">)</span> <span class="token operator">:</span>\n    <span class="token comment">// 在脚本加载完毕的onload事件进行save</span>\n    anonymousMeta <span class="token operator">=</span> meta\n  <span class="token punctuation">}</span>\n</code></pre>\n<p>首先进行了参数的修正，这个逻辑很简单，直接跳过。第二步判断了有没有依赖数组，如果没有，就通过parseDependencies方法从factory中获取。这个方法很有意思，是一个状态机，会一步步的去解析字符串，匹配到require，将其中的模块取出，最后放到一个数组里。这个方法在requirejs中是通过正则实现的，早期seajs也是通过正则匹配的，后来改成了这种状态机的方式，可能是考虑到性能的问题。seajs的仓库中专门有一个模块来讲这个东西的，请看<a href="https://github.com/seajs/crequire">链接</a>。</p>\n<p>获取到依赖模块之后又设置了一个meta对象，这个就表示这个模块的原数据，里面有记录模块的依赖项、id、factory等。如果这个模块define的时候没有设置id，就表示是个匿名模块，那怎么才能与之前发起请求的那个mod相匹配呢？</p>\n<p>这里就有了一个全局变量<code>anonymousMeta</code>，先将元数据放入这个对象。然后回过头看看模块加载时设置的onload函数里面有一段就是获取这个全局变量的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">onRequest</span><span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//模块加载完毕的回调</span>\n<span class="token spread operator">...</span>\n  <span class="token comment">// 保存元数据到匿名模块，uri为请求js的uri</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>anonymousMeta<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">save</span><span class="token punctuation">(</span>uri<span class="token punctuation">,</span> anonymousMeta<span class="token punctuation">)</span>\n    anonymousMeta <span class="token operator">=</span> <span class="token keyword null nil">null</span>\n  <span class="token punctuation">}</span>\n<span class="token spread operator">...</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>不管是不是匿名模块，最后都是通过save方法，将元数据存入到mod中。</p>\n<pre class="language-javascript"><code class="language-javascript"> <span class="token comment">// 存储元数据到 cachedMods 中</span>\n<span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">save</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">uri<span class="token punctuation">,</span> meta</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> mod <span class="token operator">=</span> <span class="token maybe-class-name">Module</span><span class="token punctuation">.</span><span class="token method function property-access">get</span><span class="token punctuation">(</span>uri<span class="token punctuation">)</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">&lt;</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">SAVED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">id</span> <span class="token operator">||</span> uri\n    mod<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">deps</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">factory</span> <span class="token operator">=</span> meta<span class="token punctuation">.</span><span class="token property-access">factory</span>\n    mod<span class="token punctuation">.</span><span class="token property-access">status</span> <span class="token operator">=</span> <span class="token constant">STATUS</span><span class="token punctuation">.</span><span class="token constant">SAVED</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里完成之后，就是和前面的逻辑一样了，先去校验当前模块有没有依赖项，如果有依赖项，就去加载依赖项和use的逻辑是一样的，等依赖项全部加载完毕后，通知入口模块的remain减1，知道remain为0，最后调用入口模块的回调方法。整个seajs的逻辑就已经全部走通，Yeah！</p>\n<hr>\n<h2 id="%E7%BB%93%E8%AF%AD">结语<a class="anchor" href="#%E7%BB%93%E8%AF%AD">§</a></h2>\n<p>有过看requirejs的经验，再来看seajs还是顺畅很多，对模块化的理解有了更加深刻的理解。阅读源码之前还是得对框架有个基本认识，并且有使用过，要不然很多地方都很懵懂。所以以后还是阅读一些工作中有经常使用的框架或类库的源码进行阅读，不能总像个无头苍蝇一样。</p>\n<p>最后用一张流程图，总结下seajs的加载过程。</p>\n<p><img src="https://file.shenfq.com/18-8-12/312991.jpg" alt="seajs加载流程图"></p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8seajs" }, "\u5982\u4F55\u4F7F\u7528seajs")),
            React.createElement("li", null,
                React.createElement("a", { href: "#seajs%E7%9A%84%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE" }, "seajs\u7684\u53C2\u6570\u914D\u7F6E")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E7%9A%84%E5%8A%A0%E8%BD%BD%E4%B8%8E%E6%89%A7%E8%A1%8C" }, "\u6A21\u5757\u7684\u52A0\u8F7D\u4E0E\u6267\u884C"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%AE%9E%E4%BE%8B%E5%8C%96%E6%A8%A1%E5%9D%97%E4%B8%80%E5%88%87%E7%9A%84%E5%BC%80%E7%AB%AF" }, "\u5B9E\u4F8B\u5316\u6A21\u5757\uFF0C\u4E00\u5207\u7684\u5F00\u7AEF")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B0%86%E6%A8%A1%E5%9D%97id%E8%BD%AC%E4%B8%BAuri" }, "\u5C06\u6A21\u5757id\u8F6C\u4E3Auri")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%B8%BA%E4%BE%9D%E8%B5%96%E6%B7%BB%E5%8A%A0%E5%85%A5%E5%8F%A3%E6%96%B9%E4%BE%BF%E8%BF%BD%E6%A0%B9%E6%BA%AF%E6%BA%90" }, "\u4E3A\u4F9D\u8D56\u6DFB\u52A0\u5165\u53E3\uFF0C\u65B9\u4FBF\u8FFD\u6839\u6EAF\u6E90")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%A6%82%E4%BD%95%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E4%B8%8B%E8%BD%BD%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97" }, "\u5982\u4F55\u53D1\u8D77\u8BF7\u6C42\uFF0C\u4E0B\u8F7D\u5176\u4ED6\u4F9D\u8D56\u6A21\u5757\uFF1F")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E9%80%9A%E7%9F%A5%E5%85%A5%E5%8F%A3%E6%A8%A1%E5%9D%97" }, "\u901A\u77E5\u5165\u53E3\u6A21\u5757")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%9D%97%E6%89%A7%E8%A1%8C%E5%AE%8C%E6%88%90%E5%85%A8%E9%83%A8%E6%93%8D%E4%BD%9C" }, "\u4F9D\u8D56\u6A21\u5757\u6267\u884C\uFF0C\u5B8C\u6210\u5168\u90E8\u64CD\u4F5C")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#define%E5%AE%9A%E4%B9%89%E6%A8%A1%E5%9D%97" }, "define\u5B9A\u4E49\u6A21\u5757")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%BB%93%E8%AF%AD" }, "\u7ED3\u8BED")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/08/15",
    'updated': null,
    'excerpt': "近几年前端工程化越来越完善，打包工具也已经是前端标配了，像seajs这种老古董早已停止维护，而且使用的人估计也几个了。但这并不能阻止好奇的我，为了了解当年的前端前辈们是如何在浏览器进行代码模块化的，我鼓起勇气翻开了S...",
    'cover': "https://file.shenfq.com/18-8-13/86590747.jpg",
    'thumbnail': "//file.shenfq.com/18-8-16/90186127.jpg",
    'categories': [
        "模块化"
    ],
    'tags': [
        "模块化",
        "前端",
        "前端工程化"
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
                "excerpt": "上次的文章介绍了 LRU 算法，今天打算来介绍一下 LFU 算法。在上篇文章中有提到， LFU（Least frequently used：最少使用）算法与 LRU 算法只是在淘汰策略上有所不同，LRU 倾向于保留最近有使用的数据，而 LFU 倾向于保留使用频..."
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
