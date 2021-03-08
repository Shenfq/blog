import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/面向未来的前端构建工具-vite.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/面向未来的前端构建工具-vite.html",
    'title': "面向未来的前端构建工具-vite",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>面向未来的前端构建工具-vite</h1>\n<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>如果近期你有关注 Vue 的动态，就能发现 Vue 作者最近一直在捣鼓的新工具 <a href="https://github.com/vitejs/vite">vite</a>。vite 1.0 目前已经进入了 rc 版本，马上就要正式发布 1.0 的版本了。几个月前，尤雨溪就已经在微博介绍过了 vite ，是一个基于浏览器原生 ESM 的开发服务器。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-031703.png" alt="尤雨溪微博"></p>\n<p>早期 Webpack 刚出来的时候，是为了解决低版本浏览器不支持 ESM 模块化的问题，将各个分散的 JavaScript 模块合并成一个文件，同时将多个 JavaScript 脚本文件合并成一个文件，减少 HTTP 请求的数量，有助于提升页面首次访问的速度。后期 Webpack 乘胜追击，引入了 Loader、Plugin 机制，提供了各种构建相关的能力（babel转义、css合并、代码压缩），取代了同期的 Browserify、Gulp。</p>\n<p>如今，HTTP/2 的盛行，HTTP/3 也即将发行，再加上 5G 网络的商用，减少 HTTP 请求数量起到的作用已经微乎其微，而且新版的浏览器基本已经支持了 ESM（<code>&lt;script module&gt;</code>）。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-034308.png" alt="JavaScript modules"></p>\n<h2 id="%E4%B8%8A%E6%89%8B-vite">上手 vite<a class="anchor" href="#%E4%B8%8A%E6%89%8B-vite">§</a></h2>\n<p>vite 带着它的历史使命随之出现。由于省略了打包的过程，首次启动 vite 的时候可谓秒开。可以看下我录制的 Gif 图，完全无需等待就能进入开发。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-040532.gif" alt="启动 vite"></p>\n<p>想要尝试 vite ，可以直接通过如下命令：</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">npm</span> init vite-app <span class="token operator">&lt;</span>project-name<span class="token operator">></span>\n$ <span class="token builtin class-name">cd</span> <span class="token operator">&lt;</span>project-name<span class="token operator">></span>\n$ <span class="token function">npm</span> <span class="token function">install</span>\n$ <span class="token function">npm</span> run dev\n</code></pre>\n<p><code>npm init vite-app</code> 命令会执行 <code>npx create-vite-app</code>，从 npm 上拉取 <a href="https://www.npmjs.com/package/create-vite-app">create-vite-app</a> 模块，然后通过对应的模板生成模板文件到指定文件夹。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"vite-app"</span><span class="token punctuation">,</span>\n  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"vite"</span><span class="token punctuation">,</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"vite build"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vue"</span><span class="token operator">:</span> <span class="token string">"^3.0.0-rc.1"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vite"</span><span class="token operator">:</span> <span class="token string">"^1.0.0-rc.1"</span><span class="token punctuation">,</span>\n    <span class="token property">"@vue/compiler-sfc"</span><span class="token operator">:</span> <span class="token string">"^3.0.0-rc.1"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>目前 vite 都是和 vue 3 搭配使用，如果要在 vue 2 使用 vite 估计还得等正式版发布。当然，能上 vue 3 还是上 vue 3 吧，无论性能、包大小还有 ts 加持方面，vue 3 都远优于 vue 2 。除了 vue，vite 还提供了 react、preat 相关的模板。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-053915.png" alt="其他模板"></p>\n<p>生成的 vue 项目的目录结构如下。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-054618.png" alt="目录结构"></p>\n<p>项目的入口为 <code>index.html</code>，html 文件中直接使用了浏览器原生的 ESM（<code>type=&quot;module&quot;</code>） 能力。关于浏览器 ESM 能力的介绍，可以阅读我之前的文章<a href="https://blog.shenfq.com/2019/%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9A%84%E4%BB%8A%E7%94%9F/">《前端模块化的今生》</a>。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>所有的 js 文件经过 vite 处理后，其 import 的模块路径都会被修改，在前面加上 <code>/@modules/</code>。当浏览器请求 import 模块的时候，vite 会在 <code>node_modules</code> 中找到对应的文件进行返回。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> createApp <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">App</span></span> <span class="token keyword module">from</span> <span class="token string">\'./App.vue\'</span>\n<span class="token keyword module">import</span> <span class="token string">\'./index.css\'</span>\n\n<span class="token function">createApp</span><span class="token punctuation">(</span><span class="token maybe-class-name">App</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">mount</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-055051.png" alt="请求"></p>\n<p>这样就省略了打包的过程，大大提升了开发效率。当然 vite 也提供了生产模式，利用 Rollup 进行构建。</p>\n<h2 id="%E8%B0%88%E8%B0%88-snowpack">谈谈 snowpack<a class="anchor" href="#%E8%B0%88%E8%B0%88-snowpack">§</a></h2>\n<p>首次提出利用浏览器原生 ESM 能力的工具并非是 vite，而是一个叫做 <a href="https://github.com/pikapkg/snowpack">snowpack</a> 的工具。snowpack 在发布 1.0 之前，名字还叫做 <code>@pika/web</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-061256.png" alt="snowpack rename"></p>\n<p><a href="https://www.pika.dev/">pika</a> 团队之所以要做 snowpack ，是因为 pika 致力于为 web 应用提速 90%。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-060750.png" alt="pika"></p>\n<p>由于当前许多 web 应用都是在不同开源模块的基础上进行构建的，而这些开源模块都被 webpack 之类的打包工具打成了一个包，如果这些开源模块都来源于同一个 CDN 地址，且支持跨域缓存，那么这些开源模块都只需要加载一次，其他网站用到了同样的开源模块，就不需要重新在下载，直接读取本地缓存。</p>\n<p>举个例子，淘宝和天猫都是基于 react + redux + antd + loadsh 进行开发的，当我打开过淘宝之后，进入天猫这些开源模块都不用重新下载，只需要下载天猫页面相关的一些业务代码即可。为此，pika 专门建立了一个 CDN（<a href="https://www.skypack.dev/">skypack</a>） 用了下载 npm 上的一些 esm 模块。</p>\n<p>后来 snowpack 发布的时候，pika 团队顺便发表了一篇名为<a href="https://www.pika.dev/blog/pika-web-a-future-without-webpack">《A Future Without Webpack》</a> 的文章，告诉大家可以尝试抛弃 webpack，革 webpack 的命。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-132659.png" alt="snowpack"></p>\n<p>在 vite 的 README 中也提到了在某些方面参考了 snowpack，并且列举了 vite 与 snowpack 的异同。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-062710.png" alt="Different"></p>\n<p>snowpack 现在已经发布到 v2 了，我们可以找到 v1 时期的源码看看 snowpack 的早期实现。</p>\n<h3 id="%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90">源码解析<a class="anchor" href="#%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90">§</a></h3>\n<p>在 github 上，根据 git tag 可以找到 snowpack v1.0.0 的版本，下载下来发现好像有点 bug ，建议大家阅读源码的时候可以跳到 v1.2.0（<a href="https://github.com/pikapkg/snowpack/tree/v1.2.0">https://github.com/pikapkg/snowpack/tree/v1.2.0</a>）。</p>\n<p>在 <code>package.json</code> 中可以看到，snowpack 通过他们团队的 <code>@pika/pack</code> 进行打包，这个工具将打包流程进行了管道化，有点类似与 gulp，感兴趣可以了解了解，这里重点还是 snowpack 的原理。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"pika build"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// snowpack 的构建工具</span>\n  <span class="token property">"@pika/pack"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"pipeline"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-ts-standard-pkg"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-copy-assets"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-build-node"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-simple-bin"</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          <span class="token comment">// 通过 snowpack 运行命令</span>\n          <span class="token property">"bin"</span><span class="token operator">:</span> <span class="token string">"snowpack"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里我们以 vue 项目为例，使用 snowpack 运行一个 vue 2 的项目。目录结构如下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-121111.png" alt="目录结构"></p>\n<p>如果要在项目中引入 snowpack，需要在项目的 <code>package.json</code> 中，添加 snowpack 相关的配置，配置中比较重要的就是这个 <code>snowpack.webDependencies</code>，表示当前项目的依赖项，这两个文件会被 snowpack 打包到 <code>web_modules</code> 目录。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"snowpack"</span><span class="token punctuation">,</span>\n    <span class="token property">"start"</span><span class="token operator">:</span> <span class="token string">"serve ./"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"http-vue-loader"</span><span class="token operator">:</span> <span class="token string">"^1.4.2"</span><span class="token punctuation">,</span>\n    <span class="token property">"vue"</span><span class="token operator">:</span> <span class="token string">"^2.6.12"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"serve"</span><span class="token operator">:</span> <span class="token string">"^11.3.2"</span><span class="token punctuation">,</span>\n    <span class="token property">"snowpack"</span><span class="token operator">:</span> <span class="token string">"~1.2.0"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"snowpack"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"webDependencies"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">"http-vue-loader"</span><span class="token punctuation">,</span>\n      <span class="token string">"vue/dist/vue.esm.browser.js"</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>运行 <code>npm run build</code> 之后，会新生成一个 <code>web_modules</code> 目录，该目录下的文件就是我们在 <code>snowpack.webDependencies</code> 中声明的两个 js 文件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-122515.png" alt="npm run build"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-122603.png" alt="web_modules"></p>\n<p>snowpack 运行的时候，会调用源码 <code>src/index.ts</code> 中的 cli 方法，该方法的代码删减版如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/pikapkg/snowpack/blob/v1.2.0/src/index.ts">https://github.com/pikapkg/snowpack/blob/v1.2.0/src/index.ts</a></span>\n<span class="token keyword">const</span> cwd <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">cli</span><span class="token punctuation">(</span><span class="token parameter">args<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 解析命令行参数</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> dest <span class="token operator">=</span> <span class="token string">\'web_modules\'</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">yargs</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// esm 脚本文件的输出目录，默认为 web_modules</span>\n  <span class="token keyword">const</span> destLoc <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> dest<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json</span>\n  <span class="token keyword">const</span> pkgManifest<span class="token operator">:</span> any <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'package.json\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json 中的依赖模块</span>\n  <span class="token keyword">const</span> implicitDependencies <span class="token operator">=</span> <span class="token punctuation">[</span>\n    <span class="token spread operator">...</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>pkgManifest<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>pkgManifest<span class="token punctuation">.</span><span class="token property-access">peerDependencies</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json 中 snowpack 相关配置</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> webDependencies <span class="token punctuation">}</span> <span class="token operator">=</span> pkgManifest<span class="token punctuation">[</span><span class="token string">\'snowpack\'</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">{</span>\n    webDependencies<span class="token operator">:</span> <span class="token keyword nil">undefined</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">const</span> installTargets <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token comment">// 需要被安装的模块，如果没有该配置，会尝试安装所有 dependencies 内的模块</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>webDependencies<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    installTargets<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">scanDepList</span><span class="token punctuation">(</span>webDependencies<span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    installTargets<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">scanDepList</span><span class="token punctuation">(</span>implicitDependencies<span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 模块安装</span>\n  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">install</span><span class="token punctuation">(</span>installTargets<span class="token punctuation">,</span> installOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该方法会读取项目的 <code>package.json</code> 文件，如果有 <code>snowpack.webDependencies</code> 配置，会优先安装 <code>snowpack.webDependencies</code> 中声明的模块，如果没有该配置，会把 <code>dependencies</code> 和 <code>devDependencies</code> 中的模块都进行安装。所有的模块名都会通过 <code>scanDepList</code>，转化为特定格式，并且会把<code>glob</code>语法的模块名，经过 <code>glob</code> 还原成单个的文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">createInstallTarget</span><span class="token punctuation">(</span><span class="token parameter">specifier<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">InstallTarget</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    specifier<span class="token punctuation">,</span>\n    named<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">scanDepList</span><span class="token punctuation">(</span><span class="token parameter">depList<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> cwd<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">InstallTarget</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取 node_modules 路径</span>\n  <span class="token keyword">const</span> nodeModules <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'node_modules\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> depList\n    <span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">whitelistItem</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 判断文件名是否为 glob 语法 （e.g. `vue/*.js`）</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>glob<span class="token punctuation">.</span><span class="token method function property-access">hasMagic</span><span class="token punctuation">(</span>whitelistItem<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span><span class="token function">createInstallTarget</span><span class="token punctuation">(</span>whitelistItem<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 转换 glob 路径</span>\n        <span class="token keyword control-flow">return</span> <span class="token function">scanDepList</span><span class="token punctuation">(</span>glob<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span>whitelistItem，<span class="token punctuation">{</span>cwd<span class="token operator">:</span> nodeModules<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将所有文件合并成一个数组</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">flat<span class="token punctuation">,</span> item</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> flat<span class="token punctuation">.</span><span class="token method function property-access">concat</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后，所有的模块会经过 install 进行安装。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-131508.png" alt="install"></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 移除 .js、.mjs 后缀</span>\n<span class="token keyword">function</span> <span class="token function">getWebDependencyName</span><span class="token punctuation">(</span><span class="token parameter">dep<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> dep<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.m?js$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 获取模块的类型以及绝对路径</span>\n<span class="token keyword">function</span> <span class="token function">resolveWebDependency</span><span class="token punctuation">(</span><span class="token parameter">dep<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'JS\'</span> <span class="token operator">|</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">;</span>\n  loc<span class="token operator">:</span> string<span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> packagePattern <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RegExp</span><span class="token punctuation">(</span><span class="token string">\'^(?:@([^/]+?)[/])?([^/]+?)$\'</span><span class="token punctuation">)</span>\n  <span class="token comment">// 如果带有扩展名，且非 npm 模块，直接返回</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>packagePattern<span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> isJSFile <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.mjs\'</span><span class="token punctuation">,</span> <span class="token string">\'.cjs\'</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> isJSFile <span class="token operator">?</span> <span class="token string">\'JS\'</span> <span class="token operator">:</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">,</span>\n      <span class="token comment">// 还原绝对路径</span>\n      loc<span class="token operator">:</span> require<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dep<span class="token punctuation">,</span> <span class="token punctuation">{</span>paths<span class="token operator">:</span> <span class="token punctuation">[</span>cwd<span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果是 npm 模块，需要查找模块对应的 package.json 文件</span>\n  <span class="token keyword">const</span> manifestPath <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cwd<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/node_modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dep<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/package.json</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> manifestStr <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>manifestPath<span class="token punctuation">,</span> <span class="token punctuation">{</span>encoding<span class="token operator">:</span> <span class="token string">\'utf8\'</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> depManifest <span class="token operator">=</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>manifestStr<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 然后读取 package.json 中的 module属性、browser属性</span>\n  <span class="token keyword">let</span> foundEntrypoint<span class="token operator">:</span> string <span class="token operator">=</span>\n    depManifest<span class="token punctuation">[</span><span class="token string">\'browser:module\'</span><span class="token punctuation">]</span> <span class="token operator">||</span> depManifest<span class="token punctuation">.</span><span class="token property-access">module</span> <span class="token operator">||</span> depManifest<span class="token punctuation">.</span><span class="token property-access">browser</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>foundEntrypoint<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果都不存在就取 main 属性</span>\n    foundEntrypoint <span class="token operator">=</span> depManifest<span class="token punctuation">.</span><span class="token property-access">main</span> <span class="token operator">||</span> <span class="token string">\'index.js\'</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    type<span class="token operator">:</span> <span class="token string">\'JS\'</span><span class="token punctuation">,</span>\n    <span class="token comment">// 还原绝对路径</span>\n    loc<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cwd<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/node_modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dep<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span> foundEntrypoint<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 模块安装</span>\n<span class="token keyword">function</span> <span class="token function">install</span><span class="token punctuation">(</span><span class="token parameter">installTargets<span class="token punctuation">,</span> installOptions</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span>\n    destLoc\n  <span class="token punctuation">}</span> <span class="token operator">=</span> installOptions<span class="token punctuation">;</span>\n  <span class="token comment">// 使用 set 将待安装模块进行一次去重</span>\n  <span class="token keyword">const</span> allInstallSpecifiers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>installTargets<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> dep<span class="token punctuation">.</span><span class="token property-access">specifier</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 模块查找转化</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> installSpecifier <span class="token keyword">of</span> allInstallSpecifiers<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 移除 .js、.mjs 后缀</span>\n    <span class="token keyword">const</span> targetName <span class="token operator">=</span> <span class="token function">getWebDependencyName</span><span class="token punctuation">(</span>installSpecifier<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取文件类型，以及文件绝对路径</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> targetType<span class="token punctuation">,</span> loc<span class="token operator">:</span> targetLoc<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">resolveWebDependency</span><span class="token punctuation">(</span>installSpecifier<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>targetType <span class="token operator">===</span> <span class="token string">\'JS\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 脚本文件</span>\n      <span class="token keyword">const</span> hash <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">generateHashFromFile</span><span class="token punctuation">(</span>targetLoc<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token comment">// 添加到脚本依赖对象</span>\n      depObject<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> targetLoc<span class="token punctuation">;</span>\n      importMap<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">./</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>targetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rev=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>hash<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n      installResults<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span>installSpecifier<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>targetType <span class="token operator">===</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 静态资源</span>\n      <span class="token comment">// 添加到静态资源对象</span>\n      assetObject<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> targetLoc<span class="token punctuation">;</span>\n      installResults<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span>installSpecifier<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>depObject<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 通过 rollup 打包文件</span>\n    <span class="token keyword">const</span> packageBundle <span class="token operator">=</span> <span class="token keyword control-flow">await</span> rollup<span class="token punctuation">.</span><span class="token method function property-access">rollup</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      input<span class="token operator">:</span> depObject<span class="token punctuation">,</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token comment">// rollup 插件</span>\n        <span class="token comment">// 这里可以进行一些 babel 转义、代码压缩之类的操作</span>\n        <span class="token comment">// 还可以将一些 commonjs 的模块转化为 ESM 模块</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 文件输出到 web_modules 目录</span>\n    <span class="token keyword control-flow">await</span> packageBundle<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      dir<span class="token operator">:</span> destLoc<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 拷贝静态资源</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">entries</span><span class="token punctuation">(</span>assetObject<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>assetName<span class="token punctuation">,</span> assetLoc<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    mkdirp<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>destLoc<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>assetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">copyFileSync</span><span class="token punctuation">(</span>assetLoc<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>destLoc<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>assetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>基本原理已经分析完毕，下面看一看实际案例。我们在 html 中通过 <code>type=&quot;module&quot;</code> 的 script 标签引入 <code>index.js</code> 作为入口文件。</p>\n<pre class="language-html"><code class="language-html"><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>snowpack-vue-httpvueloader<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./assets/style.css<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>snowpack - Vue Example<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./js/index.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>然后在 <code>index.js</code> 中， import 在 <code>webDependenies</code> 中声明的两个 js 文件，并且在之前加上 <code>/web_modules</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'/web_modules/vue/dist/vue.esm.browser.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">httpVueLoader</span> <span class="token keyword module">from</span> <span class="token string">\'/web_modules/http-vue-loader.js\'</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>httpVueLoader<span class="token punctuation">)</span>\n\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  el<span class="token operator">:</span> <span class="token string">\'#app\'</span><span class="token punctuation">,</span>\n  components<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token string">\'url:./components/app.vue\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  template<span class="token operator">:</span> <span class="token string">\'&lt;app>&lt;/app>\'</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n</code></pre>\n<p>最后通过 <code>npm run start </code>，使用 <code>serve</code> 起一个 node 服务就可以正常访问了。</p>\n<p>可以看到 snowpack v1 的功能整体比较简陋，只是将需要依赖的模块从 node_modules 中提取到了 web_modules 中，中间通过 rollup 进行了一次编译。这里引入 rollup 主要是为了对 js 代码做一些压缩优化，还有将某些 commonjs 的模块转化为 ESM 的模块。</p>\n<p>但是最后还需要借助第三方模块来启动 node 服务，当时官方还热心的告诉你可以选择哪些第三方模块来提供服务。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-133649.png" alt="server"></p>\n<p>v2 版本已经支持内部启用一个 node server 来开发，而不需要借助，而且可以进行热更新。当然 v2 版本除了 js 模块还提供了 css 模块的支持。</p>\n<h2 id="vite-%E5%8E%9F%E7%90%86">vite 原理<a class="anchor" href="#vite-%E5%8E%9F%E7%90%86">§</a></h2>\n<p>在了解了 snowpack v1 的源码后，再回过头看看 vite 的原理。还是按照之前的方式，追溯到 <a href="https://github.com/vitejs/vite/tree/a4f093a0c364d4984bcd46291a2fa09818712a4d">vite v0.1.1</a>，代码量较少的时候，看看 vite 的思路。</p>\n<p>vite 在启动时，内部会启一个 http server，用于拦截页面的脚本文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了热更新相关代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/server.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/server.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports">http<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Server</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'http\'</span>\n<span class="token keyword module">import</span> <span class="token imports">serve</span> <span class="token keyword module">from</span> <span class="token string">\'serve-handler\'</span>\n\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> vueMiddleware <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./vueCompiler\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> resolveModule <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleResolver\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> rewrite <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleRewriter\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> sendJS <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./utils\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">createServer</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>\n  port <span class="token operator">=</span> <span class="token number">3000</span><span class="token punctuation">,</span>\n  cwd <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token operator">:</span> <span class="token maybe-class-name">ServerConfig</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token known-class-name class-name">Promise</span><span class="token operator">&lt;</span><span class="token maybe-class-name">Server</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> pathname <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span><span class="token property-access">url</span><span class="token operator">!</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">pathname</span><span class="token operator">!</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">startsWith</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 返回 import 的模块文件</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.vue\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 解析 vue 文件</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 读取 js 文本内容，然后使用 rewrite 处理</span>\n      <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token function">serve</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      <span class="token keyword">public</span><span class="token operator">:</span> cwd<span class="token punctuation">,</span>\n      <span class="token comment">// 默认返回 index.html</span>\n      rewrites<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> source<span class="token operator">:</span> <span class="token string">\'**\'</span><span class="token punctuation">,</span> destination<span class="token operator">:</span> <span class="token string">\'/index.html\'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'listening\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Running at <a class="token url-link" href="http://localhost:">http://localhost:</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>port<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n      <span class="token function">resolve</span><span class="token punctuation">(</span>server<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n    server<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span>port<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>访问 vite 服务的时候，默认会返回 index.html。</p>\n<pre class="language-html"><code class="language-html"><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>icon<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/favicon.ico<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Vite App<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E5%A4%84%E7%90%86-js-%E6%96%87%E4%BB%B6">处理 js 文件<a class="anchor" href="#%E5%A4%84%E7%90%86-js-%E6%96%87%E4%BB%B6">§</a></h3>\n<p>html 文件会请求 <code>/src/main.js</code>， vite 服务在返回 js 文件的时候，会使用 <code>rewrite</code> 方法对 js 文件内容进行一次替换。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 读取 js 文本内容，然后使用 rewrite 处理</span>\n  <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleRewriter.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleRewriter.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> parse <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@babel/parser\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">rewrite</span><span class="token punctuation">(</span><span class="token parameter">source<span class="token operator">:</span> string<span class="token punctuation">,</span> asSFCScript <span class="token operator">=</span> <span class="token boolean">false</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 通过 babel 解析，找到 import from、export default 相关代码</span>\n  <span class="token keyword">const</span> ast <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    sourceType<span class="token operator">:</span> <span class="token string">\'module\'</span><span class="token punctuation">,</span>\n    plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">\'bigInt\'</span><span class="token punctuation">,</span>\n      <span class="token string">\'optionalChaining\'</span><span class="token punctuation">,</span>\n      <span class="token string">\'nullishCoalescingOperator\'</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">program</span><span class="token punctuation">.</span><span class="token property-access">body</span>\n\n  <span class="token keyword">let</span> s <span class="token operator">=</span> source\n  ast<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'ImportDeclaration\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^[^\.\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 在 import 模块名称前加上 /__modules/</span>\n        <span class="token comment">// import { foo } from \'vue\' --> import { foo } from \'/__modules/vue\'</span>\n        s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span> \n          <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">"/__modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span><span class="token template-punctuation string">`</span></span>\n          <span class="token operator">+</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">end</span><span class="token punctuation">)</span> \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>asSFCScript <span class="token operator">&amp;&amp;</span> node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'ExportDefaultDeclaration\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// export default { xxx } --></span>\n      <span class="token comment">// let __script; export default (__script = { xxx })</span>\n      s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span>\n        <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">let __script; export default (__script = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>\n          s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">declaration</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span> \n         <span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)</span><span class="token template-punctuation string">`</span></span>\n        <span class="token operator">+</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">end</span><span class="token punctuation">)</span> \n      s<span class="token punctuation">.</span><span class="token method function property-access">overwrite</span><span class="token punctuation">(</span>\n        node<span class="token punctuation">.</span><span class="token property-access">start</span><span class="token operator">!</span><span class="token punctuation">,</span>\n        node<span class="token punctuation">.</span><span class="token property-access">declaration</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token operator">!</span><span class="token punctuation">,</span>\n        <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">let __script; export default (__script = </span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">)</span>\n      s<span class="token punctuation">.</span><span class="token method function property-access">appendRight</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">end</span><span class="token operator">!</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">)</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> s<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>html 文件请求 <code>/src/main.js</code>， 经过 vite 处理后，结果如下：</p>\n<pre class="language-diff"><code class="language-diff"><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span> import { createApp } from \'vue\'\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span> import { createApp } from \'/__modules/vue\'\n</span>import App from \'./App.vue\'\n\ncreateApp(App).mount(\'#app\')\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-034532.png" alt="main.js"></p>\n<h3 id="%E5%A4%84%E7%90%86-npm-%E6%A8%A1%E5%9D%97">处理 npm 模块<a class="anchor" href="#%E5%A4%84%E7%90%86-npm-%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>浏览器解析完 main.js 之后，会读取其中的 import 模块，进行请求。请求的文件如果是 <code>/__modules/</code> 开头的话，表明是一个 npm 模块，vite 会使用 <code>resolveModule</code> 方法进行处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// fetch /__modules/vue</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">startsWith</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 返回 import 的模块文件</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleResolver.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleResolver.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token keyword module">import</span> <span class="token imports">resolve</span> <span class="token keyword module">from</span> <span class="token string">\'resolve-from\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> sendJSStream <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./utils\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ServerResponse</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'http\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token operator">:</span> string<span class="token punctuation">,</span> cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> res<span class="token operator">:</span> <span class="token maybe-class-name">ServerResponse</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> modulePath<span class="token operator">:</span> string\n  modulePath <span class="token operator">=</span> <span class="token function">resolve</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'node_modules\'</span>， <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/package.json</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>id <span class="token operator">===</span> <span class="token string">\'vue\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果是 vue 模块，返回 vue.runtime.esm-browser.js</span>\n    modulePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>\n      path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token string">\'dist/vue.runtime.esm-browser.js\'</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 通过 package.json 文件，找到需要返回的 js 文件</span>\n    <span class="token keyword">const</span> pkg <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span>\n    modulePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span><span class="token punctuation">,</span> pkg<span class="token punctuation">.</span><span class="token property-access">module</span> <span class="token operator">||</span> pkg<span class="token punctuation">.</span><span class="token property-access">main</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">sendJSStream</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> modulePath<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%A4%84%E7%90%86-vue-%E6%96%87%E4%BB%B6">处理 vue 文件<a class="anchor" href="#%E5%A4%84%E7%90%86-vue-%E6%96%87%E4%BB%B6">§</a></h3>\n<p>main.js 除了获取框架代码，还 import 了一个 vue 组件。如果是 <code>.vue</code> 结尾的文件，vite 会通过 <code>vueMiddleware</code> 方法进行处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.vue\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 解析 vue 文件</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/vueCompiler.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/vueCompiler.ts</a></span>\n\n<span class="token keyword module">import</span> <span class="token imports">url</span> <span class="token keyword module">from</span> <span class="token string">\'url\'</span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> parse<span class="token punctuation">,</span> <span class="token maybe-class-name">SFCDescriptor</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> rewrite <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleRewriter\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> pathname<span class="token punctuation">,</span> query <span class="token punctuation">}</span> <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span><span class="token property-access">url</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> descriptor <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>content<span class="token punctuation">,</span> <span class="token punctuation">{</span> filename <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token comment">// vue 模板解析</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>query<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> code <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token template-punctuation string">`</span></span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">script</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>\n        descriptor<span class="token punctuation">.</span><span class="token property-access">script</span><span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span>\n        <span class="token boolean">true</span> <span class="token comment">/* rewrite default export to `script` */</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">const __script = {}; export default __script</span><span class="token template-punctuation string">`</span></span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">s<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>\n          pathname <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">?type=style&amp;index=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>i<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n        <span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">template</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport { render as __render } from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>\n        pathname <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">?type=template</span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n__script.render = __render</span><span class="token template-punctuation string">`</span></span>\n    <span class="token punctuation">}</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> code<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'template\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回模板</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>经过解析，<code>.vue</code> 文件返回的时候会被拆分成三个部分：script、style、template。</p>\n<pre class="language-html"><code class="language-html">// 解析前\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Vue logo<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./assets/logo.png<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>HelloWorld</span> <span class="token attr-name">msg</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Hello Vue 3.0 + Vite<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">HelloWorld</span></span> <span class="token keyword module">from</span> <span class="token string">"./components/HelloWorld.vue"</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  name<span class="token operator">:</span> <span class="token string">"App"</span><span class="token punctuation">,</span>\n  components<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">HelloWorld</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 解析后</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">HelloWorld</span></span> <span class="token keyword module">from</span> <span class="token string">"/src/components/HelloWorld.vue"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> __script<span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">(</span>__script <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">"App"</span><span class="token punctuation">,</span>\n    components<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token maybe-class-name">HelloWorld</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>render <span class="token keyword module">as</span> __render<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">"/src/App.vue?type=template"</span>\n__script<span class="token punctuation">.</span><span class="token property-access">render</span> <span class="token operator">=</span> __render\n</code></pre>\n<p>template 中的内容，会被 vue 解析成 render 方法。关于 vue 模板是如何编译成 render 方法的，可以看我的另一篇文章：<a href="https://blog.shenfq.com/2020/vue-%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/">《Vue 模板编译原理》</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>\n  parse<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">SFCDescriptor</span><span class="token punctuation">,</span>\n  compileTemplate\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'template\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回模板</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">compileTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token punctuation">,</span>\n      source<span class="token operator">:</span> template<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> code<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-061353.png" alt="模板"></p>\n<p>而 template 的样式</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>\n  parse<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">SFCDescriptor</span><span class="token punctuation">,</span>\n  compileStyle<span class="token punctuation">,</span>\n  compileTemplate\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n    <span class="token keyword">const</span> index <span class="token operator">=</span> <span class="token known-class-name class-name">Number</span><span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">index</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> style <span class="token operator">=</span> descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">compileStyle</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token punctuation">,</span>\n      source<span class="token operator">:</span> style<span class="token punctuation">.</span><span class="token property-access">content</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>\n      res<span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  const id = "vue-style-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>index<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"\n  let style = document.getElementById(id)\n  if (!style) {\n    style = document.createElement(\'style\')\n    style.id = id\n    document.head.appendChild(style)\n  }\n  style.textContent = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n    </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">.</span><span class="token method function property-access">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>style 的处理也不复杂，拿到 style 标签的内容，然后 js 通过创建一个 style 标签，将样式添加到 head 标签中。</p>\n<h3 id="%E5%B0%8F%E7%BB%93">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>这里只是简单的解析了 vite 是如何拦截请求，然后返回需要的文件的过程，省略了热更新的代码。而且待发布 vite v1 除了启动服务用来开发，还支持了 rollup 打包，输出生产环境代码的能力。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>vite 刚刚发布的时候，还只能做 vue 的配套工具使用，现在已经支持了 JSX、TypeScript、Web Assembly、PostCSS 等等一系列能力。我们就静静的等待 vue3 和 vite 的正式版发布吧，到底能不能革了 webpack 的命，就看天意了。</p>\n<p>对了，vite 和 vue 一样，来自法语，中文是「快」的意思。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-065154.png" alt="vite翻译"></p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u9762\u5411\u672A\u6765\u7684\u524D\u7AEF\u6784\u5EFA\u5DE5\u5177-vite"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>如果近期你有关注 Vue 的动态，就能发现 Vue 作者最近一直在捣鼓的新工具 <a href="https://github.com/vitejs/vite">vite</a>。vite 1.0 目前已经进入了 rc 版本，马上就要正式发布 1.0 的版本了。几个月前，尤雨溪就已经在微博介绍过了 vite ，是一个基于浏览器原生 ESM 的开发服务器。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-031703.png" alt="尤雨溪微博"></p>\n<p>早期 Webpack 刚出来的时候，是为了解决低版本浏览器不支持 ESM 模块化的问题，将各个分散的 JavaScript 模块合并成一个文件，同时将多个 JavaScript 脚本文件合并成一个文件，减少 HTTP 请求的数量，有助于提升页面首次访问的速度。后期 Webpack 乘胜追击，引入了 Loader、Plugin 机制，提供了各种构建相关的能力（babel转义、css合并、代码压缩），取代了同期的 Browserify、Gulp。</p>\n<p>如今，HTTP/2 的盛行，HTTP/3 也即将发行，再加上 5G 网络的商用，减少 HTTP 请求数量起到的作用已经微乎其微，而且新版的浏览器基本已经支持了 ESM（<code>&lt;script module&gt;</code>）。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-034308.png" alt="JavaScript modules"></p>\n<h2 id="%E4%B8%8A%E6%89%8B-vite">上手 vite<a class="anchor" href="#%E4%B8%8A%E6%89%8B-vite">§</a></h2>\n<p>vite 带着它的历史使命随之出现。由于省略了打包的过程，首次启动 vite 的时候可谓秒开。可以看下我录制的 Gif 图，完全无需等待就能进入开发。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-040532.gif" alt="启动 vite"></p>\n<p>想要尝试 vite ，可以直接通过如下命令：</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">npm</span> init vite-app <span class="token operator">&lt;</span>project-name<span class="token operator">></span>\n$ <span class="token builtin class-name">cd</span> <span class="token operator">&lt;</span>project-name<span class="token operator">></span>\n$ <span class="token function">npm</span> <span class="token function">install</span>\n$ <span class="token function">npm</span> run dev\n</code></pre>\n<p><code>npm init vite-app</code> 命令会执行 <code>npx create-vite-app</code>，从 npm 上拉取 <a href="https://www.npmjs.com/package/create-vite-app">create-vite-app</a> 模块，然后通过对应的模板生成模板文件到指定文件夹。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"vite-app"</span><span class="token punctuation">,</span>\n  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"vite"</span><span class="token punctuation">,</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"vite build"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vue"</span><span class="token operator">:</span> <span class="token string">"^3.0.0-rc.1"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"vite"</span><span class="token operator">:</span> <span class="token string">"^1.0.0-rc.1"</span><span class="token punctuation">,</span>\n    <span class="token property">"@vue/compiler-sfc"</span><span class="token operator">:</span> <span class="token string">"^3.0.0-rc.1"</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>目前 vite 都是和 vue 3 搭配使用，如果要在 vue 2 使用 vite 估计还得等正式版发布。当然，能上 vue 3 还是上 vue 3 吧，无论性能、包大小还有 ts 加持方面，vue 3 都远优于 vue 2 。除了 vue，vite 还提供了 react、preat 相关的模板。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-053915.png" alt="其他模板"></p>\n<p>生成的 vue 项目的目录结构如下。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-054618.png" alt="目录结构"></p>\n<p>项目的入口为 <code>index.html</code>，html 文件中直接使用了浏览器原生的 ESM（<code>type=&quot;module&quot;</code>） 能力。关于浏览器 ESM 能力的介绍，可以阅读我之前的文章<a href="https://blog.shenfq.com/2019/%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9A%84%E4%BB%8A%E7%94%9F/">《前端模块化的今生》</a>。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>所有的 js 文件经过 vite 处理后，其 import 的模块路径都会被修改，在前面加上 <code>/@modules/</code>。当浏览器请求 import 模块的时候，vite 会在 <code>node_modules</code> 中找到对应的文件进行返回。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> createApp <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">App</span></span> <span class="token keyword module">from</span> <span class="token string">\'./App.vue\'</span>\n<span class="token keyword module">import</span> <span class="token string">\'./index.css\'</span>\n\n<span class="token function">createApp</span><span class="token punctuation">(</span><span class="token maybe-class-name">App</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">mount</span><span class="token punctuation">(</span><span class="token string">\'#app\'</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-055051.png" alt="请求"></p>\n<p>这样就省略了打包的过程，大大提升了开发效率。当然 vite 也提供了生产模式，利用 Rollup 进行构建。</p>\n<h2 id="%E8%B0%88%E8%B0%88-snowpack">谈谈 snowpack<a class="anchor" href="#%E8%B0%88%E8%B0%88-snowpack">§</a></h2>\n<p>首次提出利用浏览器原生 ESM 能力的工具并非是 vite，而是一个叫做 <a href="https://github.com/pikapkg/snowpack">snowpack</a> 的工具。snowpack 在发布 1.0 之前，名字还叫做 <code>@pika/web</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-061256.png" alt="snowpack rename"></p>\n<p><a href="https://www.pika.dev/">pika</a> 团队之所以要做 snowpack ，是因为 pika 致力于为 web 应用提速 90%。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-060750.png" alt="pika"></p>\n<p>由于当前许多 web 应用都是在不同开源模块的基础上进行构建的，而这些开源模块都被 webpack 之类的打包工具打成了一个包，如果这些开源模块都来源于同一个 CDN 地址，且支持跨域缓存，那么这些开源模块都只需要加载一次，其他网站用到了同样的开源模块，就不需要重新在下载，直接读取本地缓存。</p>\n<p>举个例子，淘宝和天猫都是基于 react + redux + antd + loadsh 进行开发的，当我打开过淘宝之后，进入天猫这些开源模块都不用重新下载，只需要下载天猫页面相关的一些业务代码即可。为此，pika 专门建立了一个 CDN（<a href="https://www.skypack.dev/">skypack</a>） 用了下载 npm 上的一些 esm 模块。</p>\n<p>后来 snowpack 发布的时候，pika 团队顺便发表了一篇名为<a href="https://www.pika.dev/blog/pika-web-a-future-without-webpack">《A Future Without Webpack》</a> 的文章，告诉大家可以尝试抛弃 webpack，革 webpack 的命。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-132659.png" alt="snowpack"></p>\n<p>在 vite 的 README 中也提到了在某些方面参考了 snowpack，并且列举了 vite 与 snowpack 的异同。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-062710.png" alt="Different"></p>\n<p>snowpack 现在已经发布到 v2 了，我们可以找到 v1 时期的源码看看 snowpack 的早期实现。</p>\n<h3 id="%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90">源码解析<a class="anchor" href="#%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90">§</a></h3>\n<p>在 github 上，根据 git tag 可以找到 snowpack v1.0.0 的版本，下载下来发现好像有点 bug ，建议大家阅读源码的时候可以跳到 v1.2.0（<a href="https://github.com/pikapkg/snowpack/tree/v1.2.0">https://github.com/pikapkg/snowpack/tree/v1.2.0</a>）。</p>\n<p>在 <code>package.json</code> 中可以看到，snowpack 通过他们团队的 <code>@pika/pack</code> 进行打包，这个工具将打包流程进行了管道化，有点类似与 gulp，感兴趣可以了解了解，这里重点还是 snowpack 的原理。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"pika build"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// snowpack 的构建工具</span>\n  <span class="token property">"@pika/pack"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"pipeline"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-ts-standard-pkg"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-copy-assets"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-build-node"</span>\n      <span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">[</span>\n        <span class="token string">"@pika/plugin-simple-bin"</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n          <span class="token comment">// 通过 snowpack 运行命令</span>\n          <span class="token property">"bin"</span><span class="token operator">:</span> <span class="token string">"snowpack"</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这里我们以 vue 项目为例，使用 snowpack 运行一个 vue 2 的项目。目录结构如下：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-121111.png" alt="目录结构"></p>\n<p>如果要在项目中引入 snowpack，需要在项目的 <code>package.json</code> 中，添加 snowpack 相关的配置，配置中比较重要的就是这个 <code>snowpack.webDependencies</code>，表示当前项目的依赖项，这两个文件会被 snowpack 打包到 <code>web_modules</code> 目录。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"snowpack"</span><span class="token punctuation">,</span>\n    <span class="token property">"start"</span><span class="token operator">:</span> <span class="token string">"serve ./"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"http-vue-loader"</span><span class="token operator">:</span> <span class="token string">"^1.4.2"</span><span class="token punctuation">,</span>\n    <span class="token property">"vue"</span><span class="token operator">:</span> <span class="token string">"^2.6.12"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"serve"</span><span class="token operator">:</span> <span class="token string">"^11.3.2"</span><span class="token punctuation">,</span>\n    <span class="token property">"snowpack"</span><span class="token operator">:</span> <span class="token string">"~1.2.0"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token property">"snowpack"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"webDependencies"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">"http-vue-loader"</span><span class="token punctuation">,</span>\n      <span class="token string">"vue/dist/vue.esm.browser.js"</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>运行 <code>npm run build</code> 之后，会新生成一个 <code>web_modules</code> 目录，该目录下的文件就是我们在 <code>snowpack.webDependencies</code> 中声明的两个 js 文件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-122515.png" alt="npm run build"></p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-122603.png" alt="web_modules"></p>\n<p>snowpack 运行的时候，会调用源码 <code>src/index.ts</code> 中的 cli 方法，该方法的代码删减版如下：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/pikapkg/snowpack/blob/v1.2.0/src/index.ts">https://github.com/pikapkg/snowpack/blob/v1.2.0/src/index.ts</a></span>\n<span class="token keyword">const</span> cwd <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">cli</span><span class="token punctuation">(</span><span class="token parameter">args<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 解析命令行参数</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> dest <span class="token operator">=</span> <span class="token string">\'web_modules\'</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">yargs</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// esm 脚本文件的输出目录，默认为 web_modules</span>\n  <span class="token keyword">const</span> destLoc <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> dest<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json</span>\n  <span class="token keyword">const</span> pkgManifest<span class="token operator">:</span> any <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'package.json\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json 中的依赖模块</span>\n  <span class="token keyword">const</span> implicitDependencies <span class="token operator">=</span> <span class="token punctuation">[</span>\n    <span class="token spread operator">...</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>pkgManifest<span class="token punctuation">.</span><span class="token property-access">dependencies</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token spread operator">...</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>pkgManifest<span class="token punctuation">.</span><span class="token property-access">peerDependencies</span> <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token comment">// 获取 pkg.json 中 snowpack 相关配置</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> webDependencies <span class="token punctuation">}</span> <span class="token operator">=</span> pkgManifest<span class="token punctuation">[</span><span class="token string">\'snowpack\'</span><span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">{</span>\n    webDependencies<span class="token operator">:</span> <span class="token keyword nil">undefined</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">const</span> installTargets <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n  <span class="token comment">// 需要被安装的模块，如果没有该配置，会尝试安装所有 dependencies 内的模块</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>webDependencies<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    installTargets<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">scanDepList</span><span class="token punctuation">(</span>webDependencies<span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    installTargets<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token spread operator">...</span><span class="token method function property-access">scanDepList</span><span class="token punctuation">(</span>implicitDependencies<span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 模块安装</span>\n  <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">install</span><span class="token punctuation">(</span>installTargets<span class="token punctuation">,</span> installOptions<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>该方法会读取项目的 <code>package.json</code> 文件，如果有 <code>snowpack.webDependencies</code> 配置，会优先安装 <code>snowpack.webDependencies</code> 中声明的模块，如果没有该配置，会把 <code>dependencies</code> 和 <code>devDependencies</code> 中的模块都进行安装。所有的模块名都会通过 <code>scanDepList</code>，转化为特定格式，并且会把<code>glob</code>语法的模块名，经过 <code>glob</code> 还原成单个的文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">createInstallTarget</span><span class="token punctuation">(</span><span class="token parameter">specifier<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">InstallTarget</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    specifier<span class="token punctuation">,</span>\n    named<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">scanDepList</span><span class="token punctuation">(</span><span class="token parameter">depList<span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> cwd<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token maybe-class-name">InstallTarget</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 获取 node_modules 路径</span>\n  <span class="token keyword">const</span> nodeModules <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'node_modules\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">return</span> depList\n    <span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">whitelistItem</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token comment">// 判断文件名是否为 glob 语法 （e.g. `vue/*.js`）</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>glob<span class="token punctuation">.</span><span class="token method function property-access">hasMagic</span><span class="token punctuation">(</span>whitelistItem<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">[</span><span class="token function">createInstallTarget</span><span class="token punctuation">(</span>whitelistItem<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 转换 glob 路径</span>\n        <span class="token keyword control-flow">return</span> <span class="token function">scanDepList</span><span class="token punctuation">(</span>glob<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span>whitelistItem，<span class="token punctuation">{</span>cwd<span class="token operator">:</span> nodeModules<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将所有文件合并成一个数组</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">flat<span class="token punctuation">,</span> item</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> flat<span class="token punctuation">.</span><span class="token method function property-access">concat</span><span class="token punctuation">(</span>item<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>最后，所有的模块会经过 install 进行安装。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-131508.png" alt="install"></p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 移除 .js、.mjs 后缀</span>\n<span class="token keyword">function</span> <span class="token function">getWebDependencyName</span><span class="token punctuation">(</span><span class="token parameter">dep<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> dep<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.m?js$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 获取模块的类型以及绝对路径</span>\n<span class="token keyword">function</span> <span class="token function">resolveWebDependency</span><span class="token punctuation">(</span><span class="token parameter">dep<span class="token operator">:</span> string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  type<span class="token operator">:</span> <span class="token string">\'JS\'</span> <span class="token operator">|</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">;</span>\n  loc<span class="token operator">:</span> string<span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> packagePattern <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RegExp</span><span class="token punctuation">(</span><span class="token string">\'^(?:@([^/]+?)[/])?([^/]+?)$\'</span><span class="token punctuation">)</span>\n  <span class="token comment">// 如果带有扩展名，且非 npm 模块，直接返回</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>packagePattern<span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> isJSFile <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.mjs\'</span><span class="token punctuation">,</span> <span class="token string">\'.cjs\'</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">extname</span><span class="token punctuation">(</span>dep<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> isJSFile <span class="token operator">?</span> <span class="token string">\'JS\'</span> <span class="token operator">:</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">,</span>\n      <span class="token comment">// 还原绝对路径</span>\n      loc<span class="token operator">:</span> require<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>dep<span class="token punctuation">,</span> <span class="token punctuation">{</span>paths<span class="token operator">:</span> <span class="token punctuation">[</span>cwd<span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// 如果是 npm 模块，需要查找模块对应的 package.json 文件</span>\n  <span class="token keyword">const</span> manifestPath <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cwd<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/node_modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dep<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/package.json</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> manifestStr <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span>manifestPath<span class="token punctuation">,</span> <span class="token punctuation">{</span>encoding<span class="token operator">:</span> <span class="token string">\'utf8\'</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token keyword">const</span> depManifest <span class="token operator">=</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>manifestStr<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token comment">// 然后读取 package.json 中的 module属性、browser属性</span>\n  <span class="token keyword">let</span> foundEntrypoint<span class="token operator">:</span> string <span class="token operator">=</span>\n    depManifest<span class="token punctuation">[</span><span class="token string">\'browser:module\'</span><span class="token punctuation">]</span> <span class="token operator">||</span> depManifest<span class="token punctuation">.</span><span class="token property-access">module</span> <span class="token operator">||</span> depManifest<span class="token punctuation">.</span><span class="token property-access">browser</span><span class="token punctuation">;</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>foundEntrypoint<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果都不存在就取 main 属性</span>\n    foundEntrypoint <span class="token operator">=</span> depManifest<span class="token punctuation">.</span><span class="token property-access">main</span> <span class="token operator">||</span> <span class="token string">\'index.js\'</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n    type<span class="token operator">:</span> <span class="token string">\'JS\'</span><span class="token punctuation">,</span>\n    <span class="token comment">// 还原绝对路径</span>\n    loc<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cwd<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/node_modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dep<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span> foundEntrypoint<span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 模块安装</span>\n<span class="token keyword">function</span> <span class="token function">install</span><span class="token punctuation">(</span><span class="token parameter">installTargets<span class="token punctuation">,</span> installOptions</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span>\n    destLoc\n  <span class="token punctuation">}</span> <span class="token operator">=</span> installOptions<span class="token punctuation">;</span>\n  <span class="token comment">// 使用 set 将待安装模块进行一次去重</span>\n  <span class="token keyword">const</span> allInstallSpecifiers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span>installTargets<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token parameter">dep</span> <span class="token arrow operator">=></span> dep<span class="token punctuation">.</span><span class="token property-access">specifier</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 模块查找转化</span>\n  <span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> installSpecifier <span class="token keyword">of</span> allInstallSpecifiers<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 移除 .js、.mjs 后缀</span>\n    <span class="token keyword">const</span> targetName <span class="token operator">=</span> <span class="token function">getWebDependencyName</span><span class="token punctuation">(</span>installSpecifier<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 获取文件类型，以及文件绝对路径</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span>type<span class="token operator">:</span> targetType<span class="token punctuation">,</span> loc<span class="token operator">:</span> targetLoc<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">resolveWebDependency</span><span class="token punctuation">(</span>installSpecifier<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>targetType <span class="token operator">===</span> <span class="token string">\'JS\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 脚本文件</span>\n      <span class="token keyword">const</span> hash <span class="token operator">=</span> <span class="token keyword control-flow">await</span> <span class="token function">generateHashFromFile</span><span class="token punctuation">(</span>targetLoc<span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token comment">// 添加到脚本依赖对象</span>\n      depObject<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> targetLoc<span class="token punctuation">;</span>\n      importMap<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">./</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>targetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.js?rev=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>hash<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n      installResults<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span>installSpecifier<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>targetType <span class="token operator">===</span> <span class="token string">\'ASSET\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 静态资源</span>\n      <span class="token comment">// 添加到静态资源对象</span>\n      assetObject<span class="token punctuation">[</span>targetName<span class="token punctuation">]</span> <span class="token operator">=</span> targetLoc<span class="token punctuation">;</span>\n      installResults<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token punctuation">[</span>installSpecifier<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  \n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span>depObject<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">length</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 通过 rollup 打包文件</span>\n    <span class="token keyword">const</span> packageBundle <span class="token operator">=</span> <span class="token keyword control-flow">await</span> rollup<span class="token punctuation">.</span><span class="token method function property-access">rollup</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      input<span class="token operator">:</span> depObject<span class="token punctuation">,</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n        <span class="token comment">// rollup 插件</span>\n        <span class="token comment">// 这里可以进行一些 babel 转义、代码压缩之类的操作</span>\n        <span class="token comment">// 还可以将一些 commonjs 的模块转化为 ESM 模块</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token comment">// 文件输出到 web_modules 目录</span>\n    <span class="token keyword control-flow">await</span> packageBundle<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      dir<span class="token operator">:</span> destLoc<span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token comment">// 拷贝静态资源</span>\n  <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">entries</span><span class="token punctuation">(</span>assetObject<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>assetName<span class="token punctuation">,</span> assetLoc<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    mkdirp<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>destLoc<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>assetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">copyFileSync</span><span class="token punctuation">(</span>assetLoc<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>destLoc<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>assetName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>基本原理已经分析完毕，下面看一看实际案例。我们在 html 中通过 <code>type=&quot;module&quot;</code> 的 script 标签引入 <code>index.js</code> 作为入口文件。</p>\n<pre class="language-html"><code class="language-html"><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>snowpack-vue-httpvueloader<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./assets/style.css<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>snowpack - Vue Example<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./js/index.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>然后在 <code>index.js</code> 中， import 在 <code>webDependenies</code> 中声明的两个 js 文件，并且在之前加上 <code>/web_modules</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'/web_modules/vue/dist/vue.esm.browser.js\'</span>\n<span class="token keyword module">import</span> <span class="token imports">httpVueLoader</span> <span class="token keyword module">from</span> <span class="token string">\'/web_modules/http-vue-loader.js\'</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>httpVueLoader<span class="token punctuation">)</span>\n\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  el<span class="token operator">:</span> <span class="token string">\'#app\'</span><span class="token punctuation">,</span>\n  components<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token string">\'url:./components/app.vue\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  template<span class="token operator">:</span> <span class="token string">\'&lt;app>&lt;/app>\'</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n</code></pre>\n<p>最后通过 <code>npm run start </code>，使用 <code>serve</code> 起一个 node 服务就可以正常访问了。</p>\n<p>可以看到 snowpack v1 的功能整体比较简陋，只是将需要依赖的模块从 node_modules 中提取到了 web_modules 中，中间通过 rollup 进行了一次编译。这里引入 rollup 主要是为了对 js 代码做一些压缩优化，还有将某些 commonjs 的模块转化为 ESM 的模块。</p>\n<p>但是最后还需要借助第三方模块来启动 node 服务，当时官方还热心的告诉你可以选择哪些第三方模块来提供服务。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-06-133649.png" alt="server"></p>\n<p>v2 版本已经支持内部启用一个 node server 来开发，而不需要借助，而且可以进行热更新。当然 v2 版本除了 js 模块还提供了 css 模块的支持。</p>\n<h2 id="vite-%E5%8E%9F%E7%90%86">vite 原理<a class="anchor" href="#vite-%E5%8E%9F%E7%90%86">§</a></h2>\n<p>在了解了 snowpack v1 的源码后，再回过头看看 vite 的原理。还是按照之前的方式，追溯到 <a href="https://github.com/vitejs/vite/tree/a4f093a0c364d4984bcd46291a2fa09818712a4d">vite v0.1.1</a>，代码量较少的时候，看看 vite 的思路。</p>\n<p>vite 在启动时，内部会启一个 http server，用于拦截页面的脚本文件。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了热更新相关代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/server.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/server.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports">http<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Server</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'http\'</span>\n<span class="token keyword module">import</span> <span class="token imports">serve</span> <span class="token keyword module">from</span> <span class="token string">\'serve-handler\'</span>\n\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> vueMiddleware <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./vueCompiler\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> resolveModule <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleResolver\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> rewrite <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleRewriter\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> sendJS <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./utils\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">createServer</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>\n  port <span class="token operator">=</span> <span class="token number">3000</span><span class="token punctuation">,</span>\n  cwd <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token operator">:</span> <span class="token maybe-class-name">ServerConfig</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token known-class-name class-name">Promise</span><span class="token operator">&lt;</span><span class="token maybe-class-name">Server</span><span class="token operator">></span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> pathname <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span><span class="token property-access">url</span><span class="token operator">!</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">pathname</span><span class="token operator">!</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">startsWith</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 返回 import 的模块文件</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.vue\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 解析 vue 文件</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 读取 js 文本内容，然后使用 rewrite 处理</span>\n      <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n      <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n      <span class="token keyword control-flow">return</span> <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token function">serve</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n      <span class="token keyword">public</span><span class="token operator">:</span> cwd<span class="token punctuation">,</span>\n      <span class="token comment">// 默认返回 index.html</span>\n      rewrites<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> source<span class="token operator">:</span> <span class="token string">\'**\'</span><span class="token punctuation">,</span> destination<span class="token operator">:</span> <span class="token string">\'/index.html\'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    server<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'listening\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Running at <a class="token url-link" href="http://localhost:">http://localhost:</a></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>port<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n      <span class="token function">resolve</span><span class="token punctuation">(</span>server<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n    server<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span>port<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>访问 vite 服务的时候，默认会返回 index.html。</p>\n<pre class="language-html"><code class="language-html"><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>en<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>icon<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/favicon.ico<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Vite App<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>module<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/src/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E5%A4%84%E7%90%86-js-%E6%96%87%E4%BB%B6">处理 js 文件<a class="anchor" href="#%E5%A4%84%E7%90%86-js-%E6%96%87%E4%BB%B6">§</a></h3>\n<p>html 文件会请求 <code>/src/main.js</code>， vite 服务在返回 js 文件的时候，会使用 <code>rewrite</code> 方法对 js 文件内容进行一次替换。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.js\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 读取 js 文本内容，然后使用 rewrite 处理</span>\n  <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleRewriter.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleRewriter.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> parse <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@babel/parser\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">rewrite</span><span class="token punctuation">(</span><span class="token parameter">source<span class="token operator">:</span> string<span class="token punctuation">,</span> asSFCScript <span class="token operator">=</span> <span class="token boolean">false</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 通过 babel 解析，找到 import from、export default 相关代码</span>\n  <span class="token keyword">const</span> ast <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>source<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n    sourceType<span class="token operator">:</span> <span class="token string">\'module\'</span><span class="token punctuation">,</span>\n    plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">\'bigInt\'</span><span class="token punctuation">,</span>\n      <span class="token string">\'optionalChaining\'</span><span class="token punctuation">,</span>\n      <span class="token string">\'nullishCoalescingOperator\'</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">program</span><span class="token punctuation">.</span><span class="token property-access">body</span>\n\n  <span class="token keyword">let</span> s <span class="token operator">=</span> source\n  ast<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'ImportDeclaration\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^[^\.\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token method function property-access">test</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 在 import 模块名称前加上 /__modules/</span>\n        <span class="token comment">// import { foo } from \'vue\' --> import { foo } from \'/__modules/vue\'</span>\n        s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span> \n          <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">"/__modules/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">value</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span><span class="token template-punctuation string">`</span></span>\n          <span class="token operator">+</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">end</span><span class="token punctuation">)</span> \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>asSFCScript <span class="token operator">&amp;&amp;</span> node<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'ExportDefaultDeclaration\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// export default { xxx } --></span>\n      <span class="token comment">// let __script; export default (__script = { xxx })</span>\n      s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span>\n        <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">let __script; export default (__script = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>\n          s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">,</span> node<span class="token punctuation">.</span><span class="token property-access">declaration</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token punctuation">)</span> \n         <span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">)</span><span class="token template-punctuation string">`</span></span>\n        <span class="token operator">+</span> s<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">source</span><span class="token punctuation">.</span><span class="token property-access">end</span><span class="token punctuation">)</span> \n      s<span class="token punctuation">.</span><span class="token method function property-access">overwrite</span><span class="token punctuation">(</span>\n        node<span class="token punctuation">.</span><span class="token property-access">start</span><span class="token operator">!</span><span class="token punctuation">,</span>\n        node<span class="token punctuation">.</span><span class="token property-access">declaration</span><span class="token punctuation">.</span><span class="token property-access">start</span><span class="token operator">!</span><span class="token punctuation">,</span>\n        <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">let __script; export default (__script = </span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">)</span>\n      s<span class="token punctuation">.</span><span class="token method function property-access">appendRight</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">end</span><span class="token operator">!</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">)</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword control-flow">return</span> s<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>html 文件请求 <code>/src/main.js</code>， 经过 vite 处理后，结果如下：</p>\n<pre class="language-diff"><code class="language-diff"><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span> import { createApp } from \'vue\'\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span> import { createApp } from \'/__modules/vue\'\n</span>import App from \'./App.vue\'\n\ncreateApp(App).mount(\'#app\')\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-034532.png" alt="main.js"></p>\n<h3 id="%E5%A4%84%E7%90%86-npm-%E6%A8%A1%E5%9D%97">处理 npm 模块<a class="anchor" href="#%E5%A4%84%E7%90%86-npm-%E6%A8%A1%E5%9D%97">§</a></h3>\n<p>浏览器解析完 main.js 之后，会读取其中的 import 模块，进行请求。请求的文件如果是 <code>/__modules/</code> 开头的话，表明是一个 npm 模块，vite 会使用 <code>resolveModule</code> 方法进行处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// fetch /__modules/vue</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">startsWith</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 返回 import 的模块文件</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">replace</span><span class="token punctuation">(</span><span class="token string">\'/__modules/\'</span><span class="token punctuation">,</span> <span class="token string">\'\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> cwd<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleResolver.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/moduleResolver.ts</a></span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token keyword module">import</span> <span class="token imports">resolve</span> <span class="token keyword module">from</span> <span class="token string">\'resolve-from\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> sendJSStream <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./utils\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">ServerResponse</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'http\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">function</span> <span class="token function">resolveModule</span><span class="token punctuation">(</span><span class="token parameter">id<span class="token operator">:</span> string<span class="token punctuation">,</span> cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> res<span class="token operator">:</span> <span class="token maybe-class-name">ServerResponse</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">let</span> modulePath<span class="token operator">:</span> string\n  modulePath <span class="token operator">=</span> <span class="token function">resolve</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> <span class="token string">\'node_modules\'</span>， <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/package.json</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>id <span class="token operator">===</span> <span class="token string">\'vue\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 如果是 vue 模块，返回 vue.runtime.esm-browser.js</span>\n    modulePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>\n      path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token string">\'dist/vue.runtime.esm-browser.js\'</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 通过 package.json 文件，找到需要返回的 js 文件</span>\n    <span class="token keyword">const</span> pkg <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span>\n    modulePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">dirname</span><span class="token punctuation">(</span>modulePath<span class="token punctuation">)</span><span class="token punctuation">,</span> pkg<span class="token punctuation">.</span><span class="token property-access">module</span> <span class="token operator">||</span> pkg<span class="token punctuation">.</span><span class="token property-access">main</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token function">sendJSStream</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> modulePath<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%A4%84%E7%90%86-vue-%E6%96%87%E4%BB%B6">处理 vue 文件<a class="anchor" href="#%E5%A4%84%E7%90%86-vue-%E6%96%87%E4%BB%B6">§</a></h3>\n<p>main.js 除了获取框架代码，还 import 了一个 vue 组件。如果是 <code>.vue</code> 结尾的文件，vite 会通过 <code>vueMiddleware</code> 方法进行处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>pathname<span class="token punctuation">.</span><span class="token method function property-access">endsWith</span><span class="token punctuation">(</span><span class="token string">\'.vue\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 解析 vue 文件</span>\n  <span class="token keyword control-flow">return</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 精简了部分代码，如果想看完整版建议去 github</span>\n<span class="token comment">// <a class="token url-link" href="https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/vueCompiler.ts">https://github.com/vitejs/vite/blob/a4f093a0c3/src/server/vueCompiler.ts</a></span>\n\n<span class="token keyword module">import</span> <span class="token imports">url</span> <span class="token keyword module">from</span> <span class="token string">\'url\'</span>\n<span class="token keyword module">import</span> <span class="token imports">path</span> <span class="token keyword module">from</span> <span class="token string">\'path\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> parse<span class="token punctuation">,</span> <span class="token maybe-class-name">SFCDescriptor</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> rewrite <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'./moduleRewriter\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> pathname<span class="token punctuation">,</span> query <span class="token punctuation">}</span> <span class="token operator">=</span> url<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span><span class="token property-access">url</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> filename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>cwd<span class="token punctuation">,</span> pathname<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token keyword control-flow">await</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">\'utf-8\'</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> <span class="token punctuation">{</span> descriptor <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span>content<span class="token punctuation">,</span> <span class="token punctuation">{</span> filename <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token comment">// vue 模板解析</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>query<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> code <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token template-punctuation string">`</span></span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">script</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token function">rewrite</span><span class="token punctuation">(</span>\n        descriptor<span class="token punctuation">.</span><span class="token property-access">script</span><span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span>\n        <span class="token boolean">true</span> <span class="token comment">/* rewrite default export to `script` */</span>\n      <span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">const __script = {}; export default __script</span><span class="token template-punctuation string">`</span></span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">s<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>\n          pathname <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">?type=style&amp;index=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>i<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n        <span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span><span class="token property-access">template</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\nimport { render as __render } from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>\n        pathname <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">?type=template</span><span class="token template-punctuation string">`</span></span>\n      <span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n      code <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n__script.render = __render</span><span class="token template-punctuation string">`</span></span>\n    <span class="token punctuation">}</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> code<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'template\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回模板</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>经过解析，<code>.vue</code> 文件返回的时候会被拆分成三个部分：script、style、template。</p>\n<pre class="language-html"><code class="language-html">// 解析前\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">alt</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Vue logo<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./assets/logo.png<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>HelloWorld</span> <span class="token attr-name">msg</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Hello Vue 3.0 + Vite<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">HelloWorld</span></span> <span class="token keyword module">from</span> <span class="token string">"./components/HelloWorld.vue"</span><span class="token punctuation">;</span>\n\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  name<span class="token operator">:</span> <span class="token string">"App"</span><span class="token punctuation">,</span>\n  components<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">HelloWorld</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 解析后</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">HelloWorld</span></span> <span class="token keyword module">from</span> <span class="token string">"/src/components/HelloWorld.vue"</span><span class="token punctuation">;</span>\n\n<span class="token keyword">let</span> __script<span class="token punctuation">;</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">(</span>__script <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">"App"</span><span class="token punctuation">,</span>\n    components<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token maybe-class-name">HelloWorld</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>render <span class="token keyword module">as</span> __render<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">"/src/App.vue?type=template"</span>\n__script<span class="token punctuation">.</span><span class="token property-access">render</span> <span class="token operator">=</span> __render\n</code></pre>\n<p>template 中的内容，会被 vue 解析成 render 方法。关于 vue 模板是如何编译成 render 方法的，可以看我的另一篇文章：<a href="https://blog.shenfq.com/2020/vue-%E6%A8%A1%E6%9D%BF%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/">《Vue 模板编译原理》</a>。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>\n  parse<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">SFCDescriptor</span><span class="token punctuation">,</span>\n  compileTemplate\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'template\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回模板</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">compileTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token punctuation">,</span>\n      source<span class="token operator">:</span> template<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>res<span class="token punctuation">,</span> code<span class="token punctuation">)</span>\n    <span class="token keyword control-flow">return</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-061353.png" alt="模板"></p>\n<p>而 template 的样式</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span>\n  parse<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">SFCDescriptor</span><span class="token punctuation">,</span>\n  compileStyle<span class="token punctuation">,</span>\n  compileTemplate\n<span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'@vue/compiler-sfc\'</span>\n\n<span class="token keyword module">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">vueMiddleware</span><span class="token punctuation">(</span>\n  <span class="token parameter">cwd<span class="token operator">:</span> string<span class="token punctuation">,</span> req<span class="token punctuation">,</span> res</span>\n<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// ...</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">type</span> <span class="token operator">===</span> <span class="token string">\'style\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 返回样式</span>\n    <span class="token keyword">const</span> index <span class="token operator">=</span> <span class="token known-class-name class-name">Number</span><span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token property-access">index</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> style <span class="token operator">=</span> descriptor<span class="token punctuation">.</span><span class="token property-access">styles</span><span class="token punctuation">[</span>index<span class="token punctuation">]</span>\n    <span class="token keyword">const</span> <span class="token punctuation">{</span> code <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">compileStyle</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token punctuation">,</span>\n      source<span class="token operator">:</span> style<span class="token punctuation">.</span><span class="token property-access">content</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">sendJS</span><span class="token punctuation">(</span>\n      res<span class="token punctuation">,</span>\n      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  const id = "vue-style-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>index<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"\n  let style = document.getElementById(id)\n  if (!style) {\n    style = document.createElement(\'style\')\n    style.id = id\n    document.head.appendChild(style)\n  }\n  style.textContent = </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n    </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">.</span><span class="token method function property-access">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>style 的处理也不复杂，拿到 style 标签的内容，然后 js 通过创建一个 style 标签，将样式添加到 head 标签中。</p>\n<h3 id="%E5%B0%8F%E7%BB%93">小结<a class="anchor" href="#%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>这里只是简单的解析了 vite 是如何拦截请求，然后返回需要的文件的过程，省略了热更新的代码。而且待发布 vite v1 除了启动服务用来开发，还支持了 rollup 打包，输出生产环境代码的能力。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>vite 刚刚发布的时候，还只能做 vue 的配套工具使用，现在已经支持了 JSX、TypeScript、Web Assembly、PostCSS 等等一系列能力。我们就静静的等待 vue3 和 vite 的正式版发布吧，到底能不能革了 webpack 的命，就看天意了。</p>\n<p>对了，vite 和 vue 一样，来自法语，中文是「快」的意思。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-09-07-065154.png" alt="vite翻译"></p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%89%8D%E8%A8%80" }, "\u524D\u8A00")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%B8%8A%E6%89%8B-vite" }, "\u4E0A\u624B vite")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%B0%88%E8%B0%88-snowpack" }, "\u8C08\u8C08 snowpack"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90" }, "\u6E90\u7801\u89E3\u6790")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#vite-%E5%8E%9F%E7%90%86" }, "vite \u539F\u7406"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%A4%84%E7%90%86-js-%E6%96%87%E4%BB%B6" }, "\u5904\u7406 js \u6587\u4EF6")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%A4%84%E7%90%86-npm-%E6%A8%A1%E5%9D%97" }, "\u5904\u7406 npm \u6A21\u5757")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%A4%84%E7%90%86-vue-%E6%96%87%E4%BB%B6" }, "\u5904\u7406 vue \u6587\u4EF6")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B0%8F%E7%BB%93" }, "\u5C0F\u7ED3")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/09/07",
    'updated': null,
    'excerpt': "前言 如果近期你有关注 Vue 的动态，就能发现 Vue 作者最近一直在捣鼓的新工具 vite。vite 1.0 目前已经进入了 rc 版本，马上就要正式发布 1.0 的版本了。几个月前，尤雨溪就已经在微博介绍过了 vite ，是一个基于浏览器原生 E...",
    'cover': "https://file.shenfq.com/ipic/2020-09-06-031703.png",
    'categories': [
        "前端工程"
    ],
    'tags': [
        "前端",
        "模块化",
        "前端工程化",
        "Vue.js",
        "JavaScript"
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
                    "前端思考"
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
                "name": "React",
                "count": 5
            },
            {
                "name": "工作",
                "count": 5
            },
            {
                "name": "总结",
                "count": 5
            },
            {
                "name": "感悟",
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
