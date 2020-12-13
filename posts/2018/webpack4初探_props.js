import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig },
    'pagePath': "posts/2018/webpack4初探.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/webpack4初探.html",
    'title': "webpack4初探",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>webpack4初探</h1>\n<h2 id="%E4%B8%80%E5%89%8D%E8%A8%80">一、前言<a class="anchor" href="#%E4%B8%80%E5%89%8D%E8%A8%80">§</a></h2>\n<p>2018/2/25，webpack4正式发布，距离现在已经过去三个多月了，也逐渐趋于稳定，而且现在的最新版本都到了4.12.0（版本迭代快得真是让人害怕）。</p>\n<p>很多人都说webpack复杂，难以理解，很大一部分原因是webpack是基于配置的，可配置项很多，并且每个参数传入的形式多种多样（可以是字符串、数组、对象、函数。。。），文档介绍也比较模糊，这么多的配置项各种排列组合，想想都复杂。而gulp基于流的方式来处理文件，无论从理解上，还是功能上都很容易上手。</p>\n<!-- more -->\n<p><img src="//file.shenfq.com/18-6-9/66027398.jpg" alt="最新版本"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//gulp</span>\ngulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./src/js/**/*.js\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token string">\'babel\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token string">\'uglifyjs\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./dist/js\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">//webpack</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./src/main.js\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> __dirname <span class="token operator">+</span> <span class="token string">\'/dist/app.js\'</span><span class="token punctuation">,</span>\n  module<span class="token operator">:</span> <span class="token punctuation">{</span>\n    rules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n      loader<span class="token operator">:</span> <span class="token string">\'babel-loader\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'uglifyjs-webpack-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面简单对比了webpack与gulp配置的区别，当然这样比较是有问题的，gulp并不能进行模块化的处理。这里主要是想告诉大家使用gulp的时候，我们能明确的知道js文件是先进行babel转译，然后进行压缩混淆，最后输出文件。而webpack对我们来说完全是个黑盒，完全不知道plugins的执行顺序。正是因为这些原因，我们常常在使用webpack时有一些不安，不知道这个配置到底有没有生效，我要按某种方式打包到底该如何配置？</p>\n<p>为了解决上面的问题，webpack4引入了<code>零配置</code>的概念（Parcel ？？？），实际体验下来还是要写不少配置。\n但是这不是重点，重点是官方宣传webpack4能够提升构建速度60%-98%，真的让人心动。</p>\n<h2 id="%E4%BA%8C%E5%88%B0%E5%BA%95%E6%80%8E%E4%B9%88%E5%8D%87%E7%BA%A7">二、到底怎么升级<a class="anchor" href="#%E4%BA%8C%E5%88%B0%E5%BA%95%E6%80%8E%E4%B9%88%E5%8D%87%E7%BA%A7">§</a></h2>\n<h4 id="0%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE">0、初始化配置<a class="anchor" href="#0%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>首先安装最新版的webpack和webpack-dev-server，然后再安装webpack-cli。webpack4将命令行相关的操作抽离到了webpack-cli中，所以，要使用webpack4，必须安装webpack-cli。当然，如果你不想使用webpack-cli，社区也有替代方案<a href="https://github.com/webpack-contrib/webpack-command">webpack-command</a>，虽然它与webpack-cli区别不大，但是还是建议使用官方推荐的webpack-cli。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> i webpack@4 webpack-dev-server@3 --save-dev\n<span class="token function">npm</span> i webpack-cli --save-dev\n</code></pre>\n<p>webpack-cli除了能在命令行接受参数运行webpack外，还具备<code>migrate</code>和<code>init</code>功能。</p>\n<ol>\n<li>migrate用来升级webpack配置，能将webpack1的api升级到webpack2，现在用处不大。</li>\n</ol>\n<pre class="language-diff"><code class="language-diff">$ webpack-cli migrate ./webpack.config.js\n<span class="token unchanged"><span class="token prefix unchanged"> </span>✔ Reading webpack config\n<span class="token prefix unchanged"> </span>✔ Migrating config from v1 to v2\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>    loaders: [\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>      rules: [\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>        loader: \'babel\',\n<span class="token prefix deleted">-</span>          query: {\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>            use: [{\n<span class="token prefix inserted">+</span>              loader: \'babel-loader\'\n<span class="token prefix inserted">+</span>            }],\n<span class="token prefix inserted">+</span>            options: {\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>              loader: ExtractTextPlugin.extract(\'style\', \'css!sass\')\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>              use: ExtractTextPlugin.extract({\n<span class="token prefix inserted">+</span>                fallback: \'style\',\n<span class="token prefix inserted">+</span>                use: \'css!sass\'\n<span class="token prefix inserted">+</span>              })\n</span>? Are you sure these changes are fine? Yes\n\n<span class="token unchanged"><span class="token prefix unchanged"> </span>✔︎ New webpack v2 config file is at /home/webpack-cli/build/webpack.config.js\n</span></code></pre>\n<ol start="2">\n<li>init可以快速生成一个webpack配置文件的模版，不过用处也不大，毕竟现在的脚手架都集成了webpack的配置。</li>\n</ol>\n<pre class="language-autoit"><code class="language-autoit">webpack<span class="token operator">-</span>cli init\n\n<span class="token number">1</span><span class="token punctuation">.</span> Will your application have multiple bundles<span class="token operator">?</span> No <span class="token operator">/</span><span class="token operator">/</span> 如果是多入口应用，可以传入一个object\n<span class="token number">2</span><span class="token punctuation">.</span> Which module will be the first <span class="token keyword">to</span> enter the application<span class="token operator">?</span> <span class="token punctuation">[</span>example<span class="token punctuation">:</span> <span class="token string">\'./src/index\'</span><span class="token punctuation">]</span> <span class="token punctuation">.</span><span class="token operator">/</span>src<span class="token operator">/</span>index <span class="token operator">/</span><span class="token operator">/</span> 程序入口\n<span class="token number">3</span><span class="token punctuation">.</span> What is the location of <span class="token string">"app"</span><span class="token operator">?</span> <span class="token punctuation">[</span>example<span class="token punctuation">:</span> <span class="token string">"./src/app"</span><span class="token punctuation">]</span> <span class="token string">\'./src/app\'</span>\n<span class="token number">4</span><span class="token punctuation">.</span> Which folder will your generated bundles be <span class="token keyword">in</span><span class="token operator">?</span> <span class="token punctuation">[</span><span class="token keyword">default</span><span class="token punctuation">:</span> dist<span class="token punctuation">]</span>\n<span class="token number">5</span><span class="token punctuation">.</span> Are you going <span class="token keyword">to</span> use this <span class="token keyword">in</span> production<span class="token operator">?</span> No\n<span class="token number">6</span><span class="token punctuation">.</span> Will you be using ES2015<span class="token operator">?</span> Yes <span class="token operator">/</span><span class="token operator">/</span>是否使用ES6语法，自动添加babel<span class="token operator">-</span>loader\n<span class="token number">7</span><span class="token punctuation">.</span> Will you use one of the below CSS solutions<span class="token operator">?</span> SASS <span class="token operator">/</span><span class="token operator">/</span> 根据选择的样式类型，自动生成 loader 配置\n<span class="token number">8</span><span class="token punctuation">.</span> <span class="token keyword">If</span> you want <span class="token keyword">to</span> bundle your CSS files<span class="token punctuation">,</span> what will you name the bundle<span class="token operator">?</span> <span class="token punctuation">(</span>press enter <span class="token keyword">to</span> skip<span class="token punctuation">)</span>\n<span class="token number">9</span><span class="token punctuation">.</span> Name your <span class="token string">\'webpack.[name].js?\'</span> <span class="token punctuation">[</span><span class="token keyword">default</span><span class="token punctuation">:</span> <span class="token string">\'config\'</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token operator">/</span><span class="token operator">/</span> webpack<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js\n\nCongratulations! Your new webpack configuration file has been created!\n</code></pre>\n<p>更详细介绍请查看webpack-cli的<a href="https://github.com/webpack/webpack-cli/blob/master/README.md">文档</a></p>\n<h4 id="1%E9%9B%B6%E9%85%8D%E7%BD%AE">1、零配置<a class="anchor" href="#1%E9%9B%B6%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>零配置就意味着webpack4具有默认配置，webpack运行时，会根据<code>mode</code>的值采取不同的默认配置。如果你没有给webpack传入mode，会抛出错误，并提示我们如果要使用webpack就需要设置一个mode。</p>\n<p><img src="//file.shenfq.com/18-6-4/38892042.jpg" alt="没有使用mode"></p>\n<blockquote>\n<p>The \'mode\' option has not been set, webpack will fallback to \'production\' for this value. Set \'mode\' option to \'development\' or \'production\' to enable defaults for each environment.\nYou can also set it to \'none\' to disable any default behavior. Learn more: <a href="https://webpack.js.org/concepts/mode/">https://webpack.js.org/concepts/mode/</a></p>\n</blockquote>\n<p>mode一共有如下三种配置：</p>\n<ol>\n<li>\n<p>none</p>\n<p>这个配置的意思就是不使用任何默认配置</p>\n</li>\n<li>\n<p>development，开发环境下的默认配置</p>\n</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">//开发环境下默认启用cache，在内存中对已经构建的部分进行缓存</span>\n  <span class="token comment">//避免其他模块修改，但是该模块未修改时候，重新构建，能够更快的进行增量构建</span>\n  <span class="token comment">//属于空间换时间的做法</span>\n  cache<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> \n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    pathinfo<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token comment">//输入代码添加额外的路径注释，提高代码可读性</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  devtools<span class="token operator">:</span> <span class="token string">"eval"</span><span class="token punctuation">,</span> <span class="token comment">//sourceMap为eval类型</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">//默认添加NODE_ENV为development</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>DefinePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"process.env.NODE_ENV"</span><span class="token operator">:</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span><span class="token string">"development"</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    namedModules<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//取代插件中的 new webpack.NamedModulesPlugin()</span>\n    namedChunks<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ol start="3">\n<li>production，生产环境下的默认配置</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token dom variable">performance</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    hints<span class="token operator">:</span> <span class="token string">\'warning\'</span><span class="token punctuation">,</span>\n    maxAssetSize<span class="token operator">:</span> <span class="token number">250000</span><span class="token punctuation">,</span> <span class="token comment">//单文件超过250k，命令行告警</span>\n    maxEntrypointSize<span class="token operator">:</span> <span class="token number">250000</span><span class="token punctuation">,</span> <span class="token comment">//首次加载文件总和超过250k，命令行告警</span>\n  <span class="token punctuation">}</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">//默认添加NODE_ENV为production</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>DefinePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"process.env.NODE_ENV"</span><span class="token operator">:</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span><span class="token string">"production"</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimize<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//取代 new UglifyJsPlugin(/* ... */)</span>\n    providedExports<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    usedExports<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake</span>\n    <span class="token comment">//依赖于optimization.providedExports和optimization.usedExports</span>\n    sideEffects<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//取代 new webpack.optimize.ModuleConcatenationPlugin()</span>\n    concatenateModules<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。</span>\n    noEmitOnErrors<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>其他的一些默认值：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  context<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./src\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> <span class="token string">\'dist\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].js\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  rules<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">"javascript/auto"</span><span class="token punctuation">,</span>\n      resolve<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.mjs$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"javascript/esm"</span><span class="token punctuation">,</span>\n      resolve<span class="token operator">:</span> <span class="token punctuation">{</span>\n        mainFields<span class="token operator">:</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"web"</span> <span class="token operator">||</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"webworker"</span> <span class="token operator">||</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"electron-renderer"</span>\n          <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token string">"browser"</span><span class="token punctuation">,</span> <span class="token string">"main"</span><span class="token punctuation">]</span>\n          <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"main"</span><span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.json$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"json"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.wasm$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"webassembly/experimental"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果想查看更多webpack4相关的默认配置，<a href="https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js">到这里来</a>。可以看到webpack4把很多插件相关的配置都迁移到了optimization中，但是我们看看<a href="https://webpack.js.org/configuration/optimization/#optimization-noemitonerrors">官方文档</a>对optimization的介绍简直寥寥无几，而在默认配置的代码中，webpack对optimization的配置有十几项，反正我是怕了。</p>\n<p><img src="//file.shenfq.com/18-6-4/22804701.jpg" alt="文档对optimization的介绍"></p>\n<p>虽然api发生了一些变化，好的一面就是有了这些默认值，我们想通过webpack构建一个项目比以前要简单很多，如果你只是想简单的进行打包，在package.json中添加如下两个script，包你满意。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"webpack-dev-server --mode development"</span><span class="token punctuation">,</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"webpack --mode production"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>开发环境使用webpack-dev-server，边预览边打包再也不用f5，简直爽歪歪；生产环境直接生成打包后的文件到dist目录</p>\n<h4 id="2loader%E4%B8%8Eplugin%E7%9A%84%E5%8D%87%E7%BA%A7">2、loader与plugin的升级<a class="anchor" href="#2loader%E4%B8%8Eplugin%E7%9A%84%E5%8D%87%E7%BA%A7">§</a></h4>\n<p>loader的升级就是一次大换血，之前适配webpack3的loader都需要升级才能适配webpack4。如果你使用了不兼容的loader，webpack会告诉你：</p>\n<blockquote>\n<p>DeprecationWarning: Tapable.apply is deprecated. Call apply on the plugin directly instead</p>\n</blockquote>\n<blockquote>\n<p>DeprecationWarning: Tapable.plugin is deprecated. Use new API on <code>.hooks</code> instead</p>\n</blockquote>\n<p>如果在运行过程中遇到这两个警告，就表示你有loader或者plugin没有升级。造成这两个错误的原因是，webpack4使用的新的插件系统，并且破坏性的对api进行了更新，不过好在这只是警告，不会导致程序退出，不过建议最好是进行升级。对于loader最好全部进行一次升级，反正也不亏，百利而无一害。</p>\n<p>关于plugin，有两个坑，一个是<code>extract-text-webpack-plugin</code>，还一个是<code>html-webpack-plugin</code>。</p>\n<p>先说说<code>extract-text-webpack-plugin</code>，这个插件主要用于将多个css合并成一个css，减少http请求，命名时支持contenthash(根据文本内容生成hash)。但是webpack4使用有些问题，所以官方推荐使用<code>mini-css-extract-plugin</code>。</p>\n<blockquote>\n<p>⚠️ Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead.</p>\n</blockquote>\n<p>这里改动比较小，只要替换下插件，然后改动下css相关的loader就行了：</p>\n<pre class="language-diff"><code class="language-diff"><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>const ExtractTextPlugin = require(\'extract-text-webpack-plugin\')\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')\n</span>\nmodule.exports = {\n<span class="token unchanged"><span class="token prefix unchanged"> </span> module: {\n<span class="token prefix unchanged"> </span>   rules: [\n<span class="token prefix unchanged"> </span>     {\n<span class="token prefix unchanged"> </span>       test: /\.css$/,\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>       use: ExtractTextPlugin.extract({\n<span class="token prefix deleted">-</span>         use: [{\n<span class="token prefix deleted">-</span>           loader: \'css-loader\',\n<span class="token prefix deleted">-</span>           options: {\n<span class="token prefix deleted">-</span>             minimize: process.env.NODE_ENV === \'production\'\n<span class="token prefix deleted">-</span>           }\n<span class="token prefix deleted">-</span>         }],\n<span class="token prefix deleted">-</span>         fallback: \'vue-style-loader\'\n<span class="token prefix deleted">-</span>       })\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>       use: [\n<span class="token prefix inserted">+</span>         MiniCssExtractPlugin.loader,\n<span class="token prefix inserted">+</span>         {\n<span class="token prefix inserted">+</span>           loader: \'css-loader\',\n<span class="token prefix inserted">+</span>           options: {\n<span class="token prefix inserted">+</span>           minimize: process.env.NODE_ENV === \'production\'\n<span class="token prefix inserted">+</span>         }\n<span class="token prefix inserted">+</span>       ],\n</span><span class="token unchanged"><span class="token prefix unchanged"> </span>     }\n<span class="token prefix unchanged"> </span>   ]\n<span class="token prefix unchanged"> </span> },\n<span class="token prefix unchanged"> </span> plugins:[\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>   new ExtractTextPlugin({\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>   new MiniCssExtractPlugin({\n</span><span class="token unchanged"><span class="token prefix unchanged"> </span>     filename: \'css/[name].css\',\n<span class="token prefix unchanged"> </span>   }),\n<span class="token prefix unchanged"> </span> ...\n<span class="token prefix unchanged"> </span> ]\n</span>}\n\n</code></pre>\n<p>然后看看<code>html-webpack-plugin</code>，将这个插件升级到最新版本，一般情况没啥问题，但是有个坑，最好是把<code>chunksSortMode</code>这个选项设置为none。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token maybe-class-name">HtmlWebpackPlugin</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'html-webpack-plugin\'</span><span class="token punctuation">)</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span><span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">HtmlWebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token operator">:</span> <span class="token string">\'index.html\'</span><span class="token punctuation">,</span>\n      template<span class="token operator">:</span> <span class="token string">\'index.html\'</span><span class="token punctuation">,</span>\n      inject<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      hash<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      chunksSortMode<span class="token operator">:</span> <span class="token string">\'none\'</span> <span class="token comment">//如果使用webpack4将该配置项设置为\'none\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<p>官方有个<a href="https://github.com/jantimon/html-webpack-plugin/issues/870">issues</a>讨论了这个问题，感兴趣可以去看看。目前作者还在寻找解决方案中。\n<img src="//file.shenfq.com/18-6-7/22043868.jpg" alt="html-webpack-plugin issues"></p>\n<p>另外，webpack-dev-server也有个升级版本，叫做<a href="https://www.npmjs.com/package/webpack-serve">webpack-serve</a>，功能比webpack-dev-server强大，支持HTTP2、使用WebSockets做热更新，暂时还在观望中，后续采坑。</p>\n<h4 id="3webpack4%E7%9A%84%E6%A8%A1%E5%9D%97%E6%8B%86%E5%88%86">3、webpack4的模块拆分<a class="anchor" href="#3webpack4%E7%9A%84%E6%A8%A1%E5%9D%97%E6%8B%86%E5%88%86">§</a></h4>\n<p>webpack3中，我们经常使用<code>CommonsChunkPlugin</code>进行模块的拆分，将代码中的公共部分，以及变动较少的框架或者库提取到一个单独的文件中，比如我们引入的框架代码(vue、react)。只要页面加载过一次之后，抽离出来的代码就可以放入缓存中，而不是每次加载页面都重新加载全部资源。</p>\n<p>CommonsChunkPlugin的常规用法如下：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>CommonsChunkPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token comment">//将node_modules中的代码放入vendor.js中</span>\n      name<span class="token operator">:</span> <span class="token string">"vendor"</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">minChunks</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> module<span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">&amp;&amp;</span> module<span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span><span class="token string">"node_modules"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>CommonsChunkPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token comment">//将webpack中runtime相关的代码放入manifest.js中</span>\n      name<span class="token operator">:</span> <span class="token string">"manifest"</span><span class="token punctuation">,</span>\n      minChunks<span class="token operator">:</span> <span class="token number">Infinity</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>之前<code>CommonsChunkPlugin</code>虽然能用，但是配置不够灵活，难以理解，minChunks有时候为数字，有时候为函数，并且如果同步模块与异步模块都引入了相同的module并不能将公共部分提取出来，最后打包生成的js还是存在相同的module。</p>\n<p>现在webpack4使用<code>optimization.splitChunks</code>来进行代码的拆分，使用<code>optimization.runtimeChunk</code>来提取webpack的runtime代码，引入了新的<code>cacheGroups</code>概念。并且webpack4中optimization提供如下默认值，官方称这种默认配置是保持web性能的最佳实践，不要手贱去修改，就算你要改也要多测试（官方就是这么自信）。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimize<span class="token operator">:</span> env <span class="token operator">===</span> <span class="token string">\'production\'</span> <span class="token operator">?</span> <span class="token boolean">true</span> <span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//是否进行代码压缩</span>\n    splitChunks<span class="token operator">:</span> <span class="token punctuation">{</span>\n      chunks<span class="token operator">:</span> <span class="token string">"async"</span><span class="token punctuation">,</span>\n      minSize<span class="token operator">:</span> <span class="token number">30000</span><span class="token punctuation">,</span> <span class="token comment">//模块大于30k会被抽离到公共模块</span>\n      minChunks<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">//模块出现1次就会被抽离到公共模块</span>\n      maxAsyncRequests<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token comment">//异步模块，一次最多只能被加载5个</span>\n      maxInitialRequests<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token comment">//入口模块最多只能加载3个</span>\n      name<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      cacheGroups<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token keyword module">default</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          minChunks<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n        priority<span class="token operator">:</span> <span class="token operator">-</span><span class="token number">20</span>\n        reuseExistingChunk<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      vendors<span class="token operator">:</span> <span class="token punctuation">{</span>\n        test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\\/]node_modules[\\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n        priority<span class="token operator">:</span> <span class="token operator">-</span><span class="token number">10</span>\n      <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    runtimeChunk <span class="token punctuation">{</span>\n      name<span class="token operator">:</span> <span class="token string">"runtime"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>有了这些默认配置，我们几乎不需要任何成功就能删除之前CommonChunkPlugin的代码，好神奇。</p>\n<h5 id="%E4%BB%80%E4%B9%88%E6%A8%A1%E5%9D%97%E4%BC%9A%E8%BF%9B%E8%A1%8C%E6%8F%90%E5%8F%96">什么模块会进行提取？<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%A8%A1%E5%9D%97%E4%BC%9A%E8%BF%9B%E8%A1%8C%E6%8F%90%E5%8F%96">§</a></h5>\n<p>通过判断<code>splitChunks.chunks</code>的值来确定哪些模块会提取公共模块，该配置一共有三个选项，<code>initial</code>、<code>async</code>、 <code>all</code>。\n默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码。</p>\n<p>这里有个概念需要明确，webpack中什么是初始入口模块，什么是异步加载模块。e.g.</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//webpack.config.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    main<span class="token operator">:</span> <span class="token string">\'src/index.js\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: "asyncModule" */</span><span class="token string">\'./a.js\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token parameter">mod</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'loaded module a\'</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'initial module\'</span><span class="token punctuation">)</span>\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">//a.js</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">\'module a\'</span> <span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> _<span class="token punctuation">.</span><span class="token method function property-access">clone</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>\n</code></pre>\n<p>上面的代码中，<code>index.js</code>在webpack的entry配置中，这是打包的入口，所以这个模块是初始入口模块。再看看<code>index.js</code>中使用了动态import语法，对<code>a.js</code>（该异步模块被命名为asyncModule）进行异步加载，则<code>a.js</code>就是一个异步加载模块。再看看<code>index.js</code>和<code>a.js</code>都有来自<code>node_modules</code>的模块，按照之前的规则，splitChunks.chunks默认为<code>async</code>，所以会被提取到vendors中的只有webpackChunkName中的模块。</p>\n<p><img src="//file.shenfq.com/18-6-9/6383332.jpg" alt="chunks为async"></p>\n<p>如果我们把splitChunks.chunks改成all，main中来自<code>node_modules</code>的模块也会被进行提取了。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    splitChunks<span class="token operator">:</span> <span class="token punctuation">{</span>\n      chunks<span class="token operator">:</span> <span class="token string">"all"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-6-9/30305961.jpg" alt="chunks为all"></p>\n<p>现在我们在<code>index.js</code>中也引入lodash，看看入口模块和异步模块的公共模块还会不会像CommonsChunkPlugin一样被重复打包。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n\n<span class="token keyword module">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: "asyncModule" */</span><span class="token string">\'./a.js\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token parameter">mod</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'loaded module a\'</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'initial module\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>_<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token parameter">a</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> a <span class="token operator">*</span> <span class="token number">10</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">//a.js</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">\'module a\'</span> <span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> _<span class="token punctuation">.</span><span class="token method function property-access">clone</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-6-9/67725879.jpg" alt="解决了CommonsChunkPlugin的问题"></p>\n<p>可以看到之前CommonsChunkPlugin的问题已经被解决了，main模块与asyncModule模块共同的lodash都被打包进了<code>vendors~main.js</code>中。</p>\n<h5 id="%E6%8F%90%E5%8F%96%E7%9A%84%E8%A7%84%E5%88%99%E6%98%AF%E4%BB%80%E4%B9%88">提取的规则是什么？<a class="anchor" href="#%E6%8F%90%E5%8F%96%E7%9A%84%E8%A7%84%E5%88%99%E6%98%AF%E4%BB%80%E4%B9%88">§</a></h5>\n<p><code>splitChunks.cacheGroups</code>配置项就是用来表示，会提取到公共模块的一个集合，也就是一个提取规则。像前面的<code>vendor</code>，就是webpack4默认提供的一个cacheGroup，表示来自node_modules的模块为一个集合。</p>\n<p>除了cacheGroups配置项外，可以看下其他的几个默认规则。</p>\n<ol>\n<li>被提取的模块必须大于30kb；</li>\n<li>模块被引入的次数必须大于1次；</li>\n<li>对于异步模块，生成的公共模块文件不能超出5个；</li>\n<li>对于入口模块，抽离出的公共模块文件不能超出3个。</li>\n</ol>\n<p>对应到代码中就是这四个配置：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    minSize<span class="token operator">:</span> <span class="token number">30000</span><span class="token punctuation">,</span>\n    minChunks<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    maxAsyncRequests<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>\n    maxInitialRequests<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E4%B8%89%E8%B5%A0%E9%80%81webpack%E5%B8%B8%E8%A7%81%E4%BC%98%E5%8C%96%E6%96%B9%E5%BC%8F">三、赠送webpack常见优化方式<a class="anchor" href="#%E4%B8%89%E8%B5%A0%E9%80%81webpack%E5%B8%B8%E8%A7%81%E4%BC%98%E5%8C%96%E6%96%B9%E5%BC%8F">§</a></h2>\n<h4 id="1%E4%B8%80%E4%B8%AA%E4%BA%BA%E4%B8%8D%E8%A1%8C%E5%A4%A7%E5%AE%B6%E4%B8%80%E8%B5%B7%E4%B8%8A">1、一个人不行，大家一起上<a class="anchor" href="#1%E4%B8%80%E4%B8%AA%E4%BA%BA%E4%B8%8D%E8%A1%8C%E5%A4%A7%E5%AE%B6%E4%B8%80%E8%B5%B7%E4%B8%8A">§</a></h4>\n<p>webpack是一个基于node的前端打包工具，但是node基于v8运行时只能是单线程，但是node中能够fork子进程。所以我们可以使用多进程的方式运行loader，和压缩js，社区有两个插件就是专门干这两个事的：HappyPack、ParallelUglifyPlugin。</p>\n<p>使用<a href="https://github.com/amireh/happypack">HappyPack</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  module<span class="token operator">:</span> <span class="token punctuation">{</span>\n    rules<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n        <span class="token comment">// loader: \'babel-loader\'</span>\n        loader<span class="token operator">:</span> <span class="token string">\'happypack/loader?id=babel\'</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'happypack\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      id<span class="token operator">:</span> <span class="token string">\'babel\'</span><span class="token punctuation">,</span>\n      loaders<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'babel-loader\'</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>使用<a href="https://github.com/gdborton/webpack-parallel-uglify-plugin">ParallelUglifyPlugin</a></p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimizer<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack-parallel-uglify-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        <span class="token comment">// 配置项</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="2%E6%89%93%E5%8C%85%E5%86%8D%E6%89%93%E5%8C%85">2、打包再打包<a class="anchor" href="#2%E6%89%93%E5%8C%85%E5%86%8D%E6%89%93%E5%8C%85">§</a></h4>\n<p>使windows的时候，我们经常会看到一些<code>.dll</code>文件，dll文件被称为动态链接库，里面包含了程序运行时的一些动态函数库，多个程序可以共用一个dll文件，可以减少程序运行时的物理内存。</p>\n<p>webpack中我们也可以引入dll的概念，使用<a href="https://webpack.js.org/plugins/dll-plugin/">DllPlugin</a>插件，将不经常变化的框架代码打包到一个js中，比如叫做dll.js。在打包的过程中，如果检测到某个块已经在dll.js中就不会再打包。之前DllPlugin与CommonsChunkPlugin并能相互兼容，本是同根生相煎何太急。但是升级到webpack4之后，问题就迎刃而解了。</p>\n<p>使用DllPlugin的时候，要先写另外一个webpack配置文件，用来生成dll文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//webpack.vue.dll.js</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 把 vue 相关模块的放到一个单独的动态链接库</span>\n    vue<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'vue\'</span><span class="token punctuation">,</span> <span class="token string">\'vue-router\'</span><span class="token punctuation">,</span> <span class="token string">\'vuex\'</span><span class="token punctuation">,</span> <span class="token string">\'element-ui\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].dll.js\'</span><span class="token punctuation">,</span> <span class="token comment">//生成vue.dll.js</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'dist\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    library<span class="token operator">:</span> <span class="token string">\'_dll_[name]\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack/lib/DllPlugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      name<span class="token operator">:</span> <span class="token string">\'_dll_[name]\'</span><span class="token punctuation">,</span>\n      <span class="token comment">// manifest.json 描述动态链接库包含了哪些内容</span>\n      path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'dist\'</span><span class="token punctuation">,</span> <span class="token string">\'[name].manifest.json\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>然后在之前的webpack配置中，引入dll。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">// 只要引入manifest.json就能知道哪些模块再dll文件中，在打包过程会忽略这些模块</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack/lib/DllReferencePlugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      manifest<span class="token operator">:</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./dist/vue.manifest.json\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  devtool<span class="token operator">:</span> <span class="token string">\'source-map\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最后生成html文件的时候，一定要先引入dll文件。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/vue.dll.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="3%E4%BD%A0%E8%83%96%E4%BD%A0%E5%85%88%E8%B7%91%E9%83%A8%E5%88%86%E4%BB%A3%E7%A0%81%E9%A2%84%E5%85%88%E8%BF%90%E8%A1%8C">3、你胖你先跑，部分代码预先运行<a class="anchor" href="#3%E4%BD%A0%E8%83%96%E4%BD%A0%E5%85%88%E8%B7%91%E9%83%A8%E5%88%86%E4%BB%A3%E7%A0%81%E9%A2%84%E5%85%88%E8%BF%90%E8%A1%8C">§</a></h4>\n<p>前面的优化都是优化打包速度，或者减少重复模块的。这里有一种优化方式，能够减少代码量，并且减少客户端的运行时间。</p>\n<p>使用<a href="https://prepack.io/">Prepack</a>，这是facebook开源的一款工具，能够运行你的代码中部分能够提前运行的代码，减少在线上真实运行的代码。</p>\n<p>官方的demo如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//input</span>\n<span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">return</span> <span class="token string">\'hello\'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n  <span class="token keyword">function</span> <span class="token function">world</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">return</span> <span class="token string">\'world\'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n  global<span class="token punctuation">.</span><span class="token property-access">s</span> <span class="token operator">=</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">\' \'</span> <span class="token operator">+</span> <span class="token function">world</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">//output</span>\ns <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span>\n</code></pre>\n<p>想在webpack中接入也比较简单，社区以及有了对应的插件<a href="https://github.com/gajus/prepack-webpack-plugin">prepack-webpack-plugin</a>，目前正式环境运用较少，还有些坑，可以继续观望。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'prepack-webpack-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这里简单罗列了一些webpack的优化策略，但是有些优化策略还是还是要酌情考虑。比如多进程跑loader，如果你项目比较小，开了之后可能变慢了，因为本来打包时间就比较短，用来fork子进程的时间，说不定都已经跑完了。记住<code>过早的优化就是万恶之源</code>。</p>\n<h2 id="%E5%9B%9B%E6%80%BB%E7%BB%93">四、总结<a class="anchor" href="#%E5%9B%9B%E6%80%BB%E7%BB%93">§</a></h2>\n<p>webpack4带了很多新的特性，也大大加快的打包时间，并且减少了打包后的文件体积。期待webpack5的更多新特性，比如，以html或css为文件入口（鄙人认为html才是前端模块化的真正入口，浏览器的入口就是html，浏览器在真正的亲爹，不和爹亲和谁亲），默认开启多进程打包，加入文件的长期缓存，更多的拓展零配置。</p>\n<p>同时也要感谢前端社区其它的优秀的打包工具，感谢rollup，感谢parcel。</p>\n<h2 id="%E4%BA%94%E5%8F%82%E8%80%83">五、参考<a class="anchor" href="#%E4%BA%94%E5%8F%82%E8%80%83">§</a></h2>\n<ol>\n<li><a href="https://zhuanlan.zhihu.com/p/32148338">webpack 为什么这么难用？</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/35407642">Webpack 4进阶</a></li>\n<li><a href="https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693">RIP CommonsChunkPlugin</a></li>\n<li><a href="https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a">webpack 4: mode and optimization</a></li>\n<li><a href="https://github.com/dwqs/blog/issues/60">webpack 4 不完全迁移指北</a></li>\n</ol>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "webpack4\u521D\u63A2"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E4%B8%80%E5%89%8D%E8%A8%80">一、前言<a class="anchor" href="#%E4%B8%80%E5%89%8D%E8%A8%80">§</a></h2>\n<p>2018/2/25，webpack4正式发布，距离现在已经过去三个多月了，也逐渐趋于稳定，而且现在的最新版本都到了4.12.0（版本迭代快得真是让人害怕）。</p>\n<p>很多人都说webpack复杂，难以理解，很大一部分原因是webpack是基于配置的，可配置项很多，并且每个参数传入的形式多种多样（可以是字符串、数组、对象、函数。。。），文档介绍也比较模糊，这么多的配置项各种排列组合，想想都复杂。而gulp基于流的方式来处理文件，无论从理解上，还是功能上都很容易上手。</p>\n<!-- more -->\n<p><img src="//file.shenfq.com/18-6-9/66027398.jpg" alt="最新版本"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//gulp</span>\ngulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./src/js/**/*.js\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token string">\'babel\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token string">\'uglifyjs\'</span><span class="token punctuation">)</span>\n<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./dist/js\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">//webpack</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./src/main.js\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> __dirname <span class="token operator">+</span> <span class="token string">\'/dist/app.js\'</span><span class="token punctuation">,</span>\n  module<span class="token operator">:</span> <span class="token punctuation">{</span>\n    rules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n      loader<span class="token operator">:</span> <span class="token string">\'babel-loader\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'uglifyjs-webpack-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>上面简单对比了webpack与gulp配置的区别，当然这样比较是有问题的，gulp并不能进行模块化的处理。这里主要是想告诉大家使用gulp的时候，我们能明确的知道js文件是先进行babel转译，然后进行压缩混淆，最后输出文件。而webpack对我们来说完全是个黑盒，完全不知道plugins的执行顺序。正是因为这些原因，我们常常在使用webpack时有一些不安，不知道这个配置到底有没有生效，我要按某种方式打包到底该如何配置？</p>\n<p>为了解决上面的问题，webpack4引入了<code>零配置</code>的概念（Parcel ？？？），实际体验下来还是要写不少配置。\n但是这不是重点，重点是官方宣传webpack4能够提升构建速度60%-98%，真的让人心动。</p>\n<h2 id="%E4%BA%8C%E5%88%B0%E5%BA%95%E6%80%8E%E4%B9%88%E5%8D%87%E7%BA%A7">二、到底怎么升级<a class="anchor" href="#%E4%BA%8C%E5%88%B0%E5%BA%95%E6%80%8E%E4%B9%88%E5%8D%87%E7%BA%A7">§</a></h2>\n<h4 id="0%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE">0、初始化配置<a class="anchor" href="#0%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>首先安装最新版的webpack和webpack-dev-server，然后再安装webpack-cli。webpack4将命令行相关的操作抽离到了webpack-cli中，所以，要使用webpack4，必须安装webpack-cli。当然，如果你不想使用webpack-cli，社区也有替代方案<a href="https://github.com/webpack-contrib/webpack-command">webpack-command</a>，虽然它与webpack-cli区别不大，但是还是建议使用官方推荐的webpack-cli。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> i webpack@4 webpack-dev-server@3 --save-dev\n<span class="token function">npm</span> i webpack-cli --save-dev\n</code></pre>\n<p>webpack-cli除了能在命令行接受参数运行webpack外，还具备<code>migrate</code>和<code>init</code>功能。</p>\n<ol>\n<li>migrate用来升级webpack配置，能将webpack1的api升级到webpack2，现在用处不大。</li>\n</ol>\n<pre class="language-diff"><code class="language-diff">$ webpack-cli migrate ./webpack.config.js\n<span class="token unchanged"><span class="token prefix unchanged"> </span>✔ Reading webpack config\n<span class="token prefix unchanged"> </span>✔ Migrating config from v1 to v2\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>    loaders: [\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>      rules: [\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>        loader: \'babel\',\n<span class="token prefix deleted">-</span>          query: {\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>            use: [{\n<span class="token prefix inserted">+</span>              loader: \'babel-loader\'\n<span class="token prefix inserted">+</span>            }],\n<span class="token prefix inserted">+</span>            options: {\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>              loader: ExtractTextPlugin.extract(\'style\', \'css!sass\')\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>              use: ExtractTextPlugin.extract({\n<span class="token prefix inserted">+</span>                fallback: \'style\',\n<span class="token prefix inserted">+</span>                use: \'css!sass\'\n<span class="token prefix inserted">+</span>              })\n</span>? Are you sure these changes are fine? Yes\n\n<span class="token unchanged"><span class="token prefix unchanged"> </span>✔︎ New webpack v2 config file is at /home/webpack-cli/build/webpack.config.js\n</span></code></pre>\n<ol start="2">\n<li>init可以快速生成一个webpack配置文件的模版，不过用处也不大，毕竟现在的脚手架都集成了webpack的配置。</li>\n</ol>\n<pre class="language-autoit"><code class="language-autoit">webpack<span class="token operator">-</span>cli init\n\n<span class="token number">1</span><span class="token punctuation">.</span> Will your application have multiple bundles<span class="token operator">?</span> No <span class="token operator">/</span><span class="token operator">/</span> 如果是多入口应用，可以传入一个object\n<span class="token number">2</span><span class="token punctuation">.</span> Which module will be the first <span class="token keyword">to</span> enter the application<span class="token operator">?</span> <span class="token punctuation">[</span>example<span class="token punctuation">:</span> <span class="token string">\'./src/index\'</span><span class="token punctuation">]</span> <span class="token punctuation">.</span><span class="token operator">/</span>src<span class="token operator">/</span>index <span class="token operator">/</span><span class="token operator">/</span> 程序入口\n<span class="token number">3</span><span class="token punctuation">.</span> What is the location of <span class="token string">"app"</span><span class="token operator">?</span> <span class="token punctuation">[</span>example<span class="token punctuation">:</span> <span class="token string">"./src/app"</span><span class="token punctuation">]</span> <span class="token string">\'./src/app\'</span>\n<span class="token number">4</span><span class="token punctuation">.</span> Which folder will your generated bundles be <span class="token keyword">in</span><span class="token operator">?</span> <span class="token punctuation">[</span><span class="token keyword">default</span><span class="token punctuation">:</span> dist<span class="token punctuation">]</span>\n<span class="token number">5</span><span class="token punctuation">.</span> Are you going <span class="token keyword">to</span> use this <span class="token keyword">in</span> production<span class="token operator">?</span> No\n<span class="token number">6</span><span class="token punctuation">.</span> Will you be using ES2015<span class="token operator">?</span> Yes <span class="token operator">/</span><span class="token operator">/</span>是否使用ES6语法，自动添加babel<span class="token operator">-</span>loader\n<span class="token number">7</span><span class="token punctuation">.</span> Will you use one of the below CSS solutions<span class="token operator">?</span> SASS <span class="token operator">/</span><span class="token operator">/</span> 根据选择的样式类型，自动生成 loader 配置\n<span class="token number">8</span><span class="token punctuation">.</span> <span class="token keyword">If</span> you want <span class="token keyword">to</span> bundle your CSS files<span class="token punctuation">,</span> what will you name the bundle<span class="token operator">?</span> <span class="token punctuation">(</span>press enter <span class="token keyword">to</span> skip<span class="token punctuation">)</span>\n<span class="token number">9</span><span class="token punctuation">.</span> Name your <span class="token string">\'webpack.[name].js?\'</span> <span class="token punctuation">[</span><span class="token keyword">default</span><span class="token punctuation">:</span> <span class="token string">\'config\'</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token operator">/</span><span class="token operator">/</span> webpack<span class="token punctuation">.</span>config<span class="token punctuation">.</span>js\n\nCongratulations! Your new webpack configuration file has been created!\n</code></pre>\n<p>更详细介绍请查看webpack-cli的<a href="https://github.com/webpack/webpack-cli/blob/master/README.md">文档</a></p>\n<h4 id="1%E9%9B%B6%E9%85%8D%E7%BD%AE">1、零配置<a class="anchor" href="#1%E9%9B%B6%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>零配置就意味着webpack4具有默认配置，webpack运行时，会根据<code>mode</code>的值采取不同的默认配置。如果你没有给webpack传入mode，会抛出错误，并提示我们如果要使用webpack就需要设置一个mode。</p>\n<p><img src="//file.shenfq.com/18-6-4/38892042.jpg" alt="没有使用mode"></p>\n<blockquote>\n<p>The \'mode\' option has not been set, webpack will fallback to \'production\' for this value. Set \'mode\' option to \'development\' or \'production\' to enable defaults for each environment.\nYou can also set it to \'none\' to disable any default behavior. Learn more: <a href="https://webpack.js.org/concepts/mode/">https://webpack.js.org/concepts/mode/</a></p>\n</blockquote>\n<p>mode一共有如下三种配置：</p>\n<ol>\n<li>\n<p>none</p>\n<p>这个配置的意思就是不使用任何默认配置</p>\n</li>\n<li>\n<p>development，开发环境下的默认配置</p>\n</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">//开发环境下默认启用cache，在内存中对已经构建的部分进行缓存</span>\n  <span class="token comment">//避免其他模块修改，但是该模块未修改时候，重新构建，能够更快的进行增量构建</span>\n  <span class="token comment">//属于空间换时间的做法</span>\n  cache<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> \n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    pathinfo<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token comment">//输入代码添加额外的路径注释，提高代码可读性</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  devtools<span class="token operator">:</span> <span class="token string">"eval"</span><span class="token punctuation">,</span> <span class="token comment">//sourceMap为eval类型</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">//默认添加NODE_ENV为development</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>DefinePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"process.env.NODE_ENV"</span><span class="token operator">:</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span><span class="token string">"development"</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    namedModules<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//取代插件中的 new webpack.NamedModulesPlugin()</span>\n    namedChunks<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ol start="3">\n<li>production，生产环境下的默认配置</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token dom variable">performance</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    hints<span class="token operator">:</span> <span class="token string">\'warning\'</span><span class="token punctuation">,</span>\n    maxAssetSize<span class="token operator">:</span> <span class="token number">250000</span><span class="token punctuation">,</span> <span class="token comment">//单文件超过250k，命令行告警</span>\n    maxEntrypointSize<span class="token operator">:</span> <span class="token number">250000</span><span class="token punctuation">,</span> <span class="token comment">//首次加载文件总和超过250k，命令行告警</span>\n  <span class="token punctuation">}</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">//默认添加NODE_ENV为production</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>DefinePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token string">"process.env.NODE_ENV"</span><span class="token operator">:</span> <span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span><span class="token string">"production"</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimize<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">//取代 new UglifyJsPlugin(/* ... */)</span>\n    providedExports<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    usedExports<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake</span>\n    <span class="token comment">//依赖于optimization.providedExports和optimization.usedExports</span>\n    sideEffects<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//取代 new webpack.optimize.ModuleConcatenationPlugin()</span>\n    concatenateModules<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token comment">//取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。</span>\n    noEmitOnErrors<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>其他的一些默认值：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  context<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./src\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> <span class="token string">\'dist\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].js\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  rules<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      type<span class="token operator">:</span> <span class="token string">"javascript/auto"</span><span class="token punctuation">,</span>\n      resolve<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.mjs$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"javascript/esm"</span><span class="token punctuation">,</span>\n      resolve<span class="token operator">:</span> <span class="token punctuation">{</span>\n        mainFields<span class="token operator">:</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"web"</span> <span class="token operator">||</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"webworker"</span> <span class="token operator">||</span>\n        options<span class="token punctuation">.</span><span class="token property-access">target</span> <span class="token operator">===</span> <span class="token string">"electron-renderer"</span>\n          <span class="token operator">?</span> <span class="token punctuation">[</span><span class="token string">"browser"</span><span class="token punctuation">,</span> <span class="token string">"main"</span><span class="token punctuation">]</span>\n          <span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"main"</span><span class="token punctuation">]</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.json$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"json"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span>\n      test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.wasm$</span><span class="token regex-delimiter">/</span><span class="token regex-flags">i</span></span><span class="token punctuation">,</span>\n      type<span class="token operator">:</span> <span class="token string">"webassembly/experimental"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>如果想查看更多webpack4相关的默认配置，<a href="https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js">到这里来</a>。可以看到webpack4把很多插件相关的配置都迁移到了optimization中，但是我们看看<a href="https://webpack.js.org/configuration/optimization/#optimization-noemitonerrors">官方文档</a>对optimization的介绍简直寥寥无几，而在默认配置的代码中，webpack对optimization的配置有十几项，反正我是怕了。</p>\n<p><img src="//file.shenfq.com/18-6-4/22804701.jpg" alt="文档对optimization的介绍"></p>\n<p>虽然api发生了一些变化，好的一面就是有了这些默认值，我们想通过webpack构建一个项目比以前要简单很多，如果你只是想简单的进行打包，在package.json中添加如下两个script，包你满意。</p>\n<pre class="language-json"><code class="language-json"><span class="token punctuation">{</span>\n  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"webpack-dev-server --mode development"</span><span class="token punctuation">,</span>\n    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"webpack --mode production"</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>开发环境使用webpack-dev-server，边预览边打包再也不用f5，简直爽歪歪；生产环境直接生成打包后的文件到dist目录</p>\n<h4 id="2loader%E4%B8%8Eplugin%E7%9A%84%E5%8D%87%E7%BA%A7">2、loader与plugin的升级<a class="anchor" href="#2loader%E4%B8%8Eplugin%E7%9A%84%E5%8D%87%E7%BA%A7">§</a></h4>\n<p>loader的升级就是一次大换血，之前适配webpack3的loader都需要升级才能适配webpack4。如果你使用了不兼容的loader，webpack会告诉你：</p>\n<blockquote>\n<p>DeprecationWarning: Tapable.apply is deprecated. Call apply on the plugin directly instead</p>\n</blockquote>\n<blockquote>\n<p>DeprecationWarning: Tapable.plugin is deprecated. Use new API on <code>.hooks</code> instead</p>\n</blockquote>\n<p>如果在运行过程中遇到这两个警告，就表示你有loader或者plugin没有升级。造成这两个错误的原因是，webpack4使用的新的插件系统，并且破坏性的对api进行了更新，不过好在这只是警告，不会导致程序退出，不过建议最好是进行升级。对于loader最好全部进行一次升级，反正也不亏，百利而无一害。</p>\n<p>关于plugin，有两个坑，一个是<code>extract-text-webpack-plugin</code>，还一个是<code>html-webpack-plugin</code>。</p>\n<p>先说说<code>extract-text-webpack-plugin</code>，这个插件主要用于将多个css合并成一个css，减少http请求，命名时支持contenthash(根据文本内容生成hash)。但是webpack4使用有些问题，所以官方推荐使用<code>mini-css-extract-plugin</code>。</p>\n<blockquote>\n<p>⚠️ Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead.</p>\n</blockquote>\n<p>这里改动比较小，只要替换下插件，然后改动下css相关的loader就行了：</p>\n<pre class="language-diff"><code class="language-diff"><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>const ExtractTextPlugin = require(\'extract-text-webpack-plugin\')\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')\n</span>\nmodule.exports = {\n<span class="token unchanged"><span class="token prefix unchanged"> </span> module: {\n<span class="token prefix unchanged"> </span>   rules: [\n<span class="token prefix unchanged"> </span>     {\n<span class="token prefix unchanged"> </span>       test: /\.css$/,\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>       use: ExtractTextPlugin.extract({\n<span class="token prefix deleted">-</span>         use: [{\n<span class="token prefix deleted">-</span>           loader: \'css-loader\',\n<span class="token prefix deleted">-</span>           options: {\n<span class="token prefix deleted">-</span>             minimize: process.env.NODE_ENV === \'production\'\n<span class="token prefix deleted">-</span>           }\n<span class="token prefix deleted">-</span>         }],\n<span class="token prefix deleted">-</span>         fallback: \'vue-style-loader\'\n<span class="token prefix deleted">-</span>       })\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>       use: [\n<span class="token prefix inserted">+</span>         MiniCssExtractPlugin.loader,\n<span class="token prefix inserted">+</span>         {\n<span class="token prefix inserted">+</span>           loader: \'css-loader\',\n<span class="token prefix inserted">+</span>           options: {\n<span class="token prefix inserted">+</span>           minimize: process.env.NODE_ENV === \'production\'\n<span class="token prefix inserted">+</span>         }\n<span class="token prefix inserted">+</span>       ],\n</span><span class="token unchanged"><span class="token prefix unchanged"> </span>     }\n<span class="token prefix unchanged"> </span>   ]\n<span class="token prefix unchanged"> </span> },\n<span class="token prefix unchanged"> </span> plugins:[\n</span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span>   new ExtractTextPlugin({\n</span><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span>   new MiniCssExtractPlugin({\n</span><span class="token unchanged"><span class="token prefix unchanged"> </span>     filename: \'css/[name].css\',\n<span class="token prefix unchanged"> </span>   }),\n<span class="token prefix unchanged"> </span> ...\n<span class="token prefix unchanged"> </span> ]\n</span>}\n\n</code></pre>\n<p>然后看看<code>html-webpack-plugin</code>，将这个插件升级到最新版本，一般情况没啥问题，但是有个坑，最好是把<code>chunksSortMode</code>这个选项设置为none。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> <span class="token maybe-class-name">HtmlWebpackPlugin</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'html-webpack-plugin\'</span><span class="token punctuation">)</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span><span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">HtmlWebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      filename<span class="token operator">:</span> <span class="token string">\'index.html\'</span><span class="token punctuation">,</span>\n      template<span class="token operator">:</span> <span class="token string">\'index.html\'</span><span class="token punctuation">,</span>\n      inject<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      hash<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      chunksSortMode<span class="token operator">:</span> <span class="token string">\'none\'</span> <span class="token comment">//如果使用webpack4将该配置项设置为\'none\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n</code></pre>\n<p>官方有个<a href="https://github.com/jantimon/html-webpack-plugin/issues/870">issues</a>讨论了这个问题，感兴趣可以去看看。目前作者还在寻找解决方案中。\n<img src="//file.shenfq.com/18-6-7/22043868.jpg" alt="html-webpack-plugin issues"></p>\n<p>另外，webpack-dev-server也有个升级版本，叫做<a href="https://www.npmjs.com/package/webpack-serve">webpack-serve</a>，功能比webpack-dev-server强大，支持HTTP2、使用WebSockets做热更新，暂时还在观望中，后续采坑。</p>\n<h4 id="3webpack4%E7%9A%84%E6%A8%A1%E5%9D%97%E6%8B%86%E5%88%86">3、webpack4的模块拆分<a class="anchor" href="#3webpack4%E7%9A%84%E6%A8%A1%E5%9D%97%E6%8B%86%E5%88%86">§</a></h4>\n<p>webpack3中，我们经常使用<code>CommonsChunkPlugin</code>进行模块的拆分，将代码中的公共部分，以及变动较少的框架或者库提取到一个单独的文件中，比如我们引入的框架代码(vue、react)。只要页面加载过一次之后，抽离出来的代码就可以放入缓存中，而不是每次加载页面都重新加载全部资源。</p>\n<p>CommonsChunkPlugin的常规用法如下：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>CommonsChunkPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token comment">//将node_modules中的代码放入vendor.js中</span>\n      name<span class="token operator">:</span> <span class="token string">"vendor"</span><span class="token punctuation">,</span>\n      <span class="token function-variable function">minChunks</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span><span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> module<span class="token punctuation">.</span><span class="token property-access">context</span> <span class="token operator">&amp;&amp;</span> module<span class="token punctuation">.</span><span class="token property-access">context</span><span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span><span class="token string">"node_modules"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>CommonsChunkPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token comment">//将webpack中runtime相关的代码放入manifest.js中</span>\n      name<span class="token operator">:</span> <span class="token string">"manifest"</span><span class="token punctuation">,</span>\n      minChunks<span class="token operator">:</span> <span class="token number">Infinity</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>之前<code>CommonsChunkPlugin</code>虽然能用，但是配置不够灵活，难以理解，minChunks有时候为数字，有时候为函数，并且如果同步模块与异步模块都引入了相同的module并不能将公共部分提取出来，最后打包生成的js还是存在相同的module。</p>\n<p>现在webpack4使用<code>optimization.splitChunks</code>来进行代码的拆分，使用<code>optimization.runtimeChunk</code>来提取webpack的runtime代码，引入了新的<code>cacheGroups</code>概念。并且webpack4中optimization提供如下默认值，官方称这种默认配置是保持web性能的最佳实践，不要手贱去修改，就算你要改也要多测试（官方就是这么自信）。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimize<span class="token operator">:</span> env <span class="token operator">===</span> <span class="token string">\'production\'</span> <span class="token operator">?</span> <span class="token boolean">true</span> <span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">//是否进行代码压缩</span>\n    splitChunks<span class="token operator">:</span> <span class="token punctuation">{</span>\n      chunks<span class="token operator">:</span> <span class="token string">"async"</span><span class="token punctuation">,</span>\n      minSize<span class="token operator">:</span> <span class="token number">30000</span><span class="token punctuation">,</span> <span class="token comment">//模块大于30k会被抽离到公共模块</span>\n      minChunks<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token comment">//模块出现1次就会被抽离到公共模块</span>\n      maxAsyncRequests<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token comment">//异步模块，一次最多只能被加载5个</span>\n      maxInitialRequests<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token comment">//入口模块最多只能加载3个</span>\n      name<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      cacheGroups<span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token keyword module">default</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n          minChunks<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>\n        priority<span class="token operator">:</span> <span class="token operator">-</span><span class="token number">20</span>\n        reuseExistingChunk<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      vendors<span class="token operator">:</span> <span class="token punctuation">{</span>\n        test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">[\\/]node_modules[\\/]</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n        priority<span class="token operator">:</span> <span class="token operator">-</span><span class="token number">10</span>\n      <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    runtimeChunk <span class="token punctuation">{</span>\n      name<span class="token operator">:</span> <span class="token string">"runtime"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>有了这些默认配置，我们几乎不需要任何成功就能删除之前CommonChunkPlugin的代码，好神奇。</p>\n<h5 id="%E4%BB%80%E4%B9%88%E6%A8%A1%E5%9D%97%E4%BC%9A%E8%BF%9B%E8%A1%8C%E6%8F%90%E5%8F%96">什么模块会进行提取？<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%A8%A1%E5%9D%97%E4%BC%9A%E8%BF%9B%E8%A1%8C%E6%8F%90%E5%8F%96">§</a></h5>\n<p>通过判断<code>splitChunks.chunks</code>的值来确定哪些模块会提取公共模块，该配置一共有三个选项，<code>initial</code>、<code>async</code>、 <code>all</code>。\n默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码。</p>\n<p>这里有个概念需要明确，webpack中什么是初始入口模块，什么是异步加载模块。e.g.</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//webpack.config.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    main<span class="token operator">:</span> <span class="token string">\'src/index.js\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: "asyncModule" */</span><span class="token string">\'./a.js\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token parameter">mod</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'loaded module a\'</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'initial module\'</span><span class="token punctuation">)</span>\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">//a.js</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">\'module a\'</span> <span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> _<span class="token punctuation">.</span><span class="token method function property-access">clone</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>\n</code></pre>\n<p>上面的代码中，<code>index.js</code>在webpack的entry配置中，这是打包的入口，所以这个模块是初始入口模块。再看看<code>index.js</code>中使用了动态import语法，对<code>a.js</code>（该异步模块被命名为asyncModule）进行异步加载，则<code>a.js</code>就是一个异步加载模块。再看看<code>index.js</code>和<code>a.js</code>都有来自<code>node_modules</code>的模块，按照之前的规则，splitChunks.chunks默认为<code>async</code>，所以会被提取到vendors中的只有webpackChunkName中的模块。</p>\n<p><img src="//file.shenfq.com/18-6-9/6383332.jpg" alt="chunks为async"></p>\n<p>如果我们把splitChunks.chunks改成all，main中来自<code>node_modules</code>的模块也会被进行提取了。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    splitChunks<span class="token operator">:</span> <span class="token punctuation">{</span>\n      chunks<span class="token operator">:</span> <span class="token string">"all"</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-6-9/30305961.jpg" alt="chunks为all"></p>\n<p>现在我们在<code>index.js</code>中也引入lodash，看看入口模块和异步模块的公共模块还会不会像CommonsChunkPlugin一样被重复打包。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//index.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n\n<span class="token keyword module">import</span><span class="token punctuation">(</span><span class="token comment">/* webpackChunkName: "asyncModule" */</span><span class="token string">\'./a.js\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">then</span><span class="token punctuation">(</span><span class="token parameter">mod</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'loaded module a\'</span><span class="token punctuation">,</span> mod<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'initial module\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>_<span class="token punctuation">.</span><span class="token method function property-access">map</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token parameter">a</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> a <span class="token operator">*</span> <span class="token number">10</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">//a.js</span>\n<span class="token keyword module">import</span> <span class="token imports">_</span> <span class="token keyword module">from</span> <span class="token string">\'lodash\'</span>\n<span class="token keyword">const</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">\'module a\'</span> <span class="token punctuation">}</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> _<span class="token punctuation">.</span><span class="token method function property-access">clone</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>\n</code></pre>\n<p><img src="//file.shenfq.com/18-6-9/67725879.jpg" alt="解决了CommonsChunkPlugin的问题"></p>\n<p>可以看到之前CommonsChunkPlugin的问题已经被解决了，main模块与asyncModule模块共同的lodash都被打包进了<code>vendors~main.js</code>中。</p>\n<h5 id="%E6%8F%90%E5%8F%96%E7%9A%84%E8%A7%84%E5%88%99%E6%98%AF%E4%BB%80%E4%B9%88">提取的规则是什么？<a class="anchor" href="#%E6%8F%90%E5%8F%96%E7%9A%84%E8%A7%84%E5%88%99%E6%98%AF%E4%BB%80%E4%B9%88">§</a></h5>\n<p><code>splitChunks.cacheGroups</code>配置项就是用来表示，会提取到公共模块的一个集合，也就是一个提取规则。像前面的<code>vendor</code>，就是webpack4默认提供的一个cacheGroup，表示来自node_modules的模块为一个集合。</p>\n<p>除了cacheGroups配置项外，可以看下其他的几个默认规则。</p>\n<ol>\n<li>被提取的模块必须大于30kb；</li>\n<li>模块被引入的次数必须大于1次；</li>\n<li>对于异步模块，生成的公共模块文件不能超出5个；</li>\n<li>对于入口模块，抽离出的公共模块文件不能超出3个。</li>\n</ol>\n<p>对应到代码中就是这四个配置：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n    minSize<span class="token operator">:</span> <span class="token number">30000</span><span class="token punctuation">,</span>\n    minChunks<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n    maxAsyncRequests<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>\n    maxInitialRequests<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h2 id="%E4%B8%89%E8%B5%A0%E9%80%81webpack%E5%B8%B8%E8%A7%81%E4%BC%98%E5%8C%96%E6%96%B9%E5%BC%8F">三、赠送webpack常见优化方式<a class="anchor" href="#%E4%B8%89%E8%B5%A0%E9%80%81webpack%E5%B8%B8%E8%A7%81%E4%BC%98%E5%8C%96%E6%96%B9%E5%BC%8F">§</a></h2>\n<h4 id="1%E4%B8%80%E4%B8%AA%E4%BA%BA%E4%B8%8D%E8%A1%8C%E5%A4%A7%E5%AE%B6%E4%B8%80%E8%B5%B7%E4%B8%8A">1、一个人不行，大家一起上<a class="anchor" href="#1%E4%B8%80%E4%B8%AA%E4%BA%BA%E4%B8%8D%E8%A1%8C%E5%A4%A7%E5%AE%B6%E4%B8%80%E8%B5%B7%E4%B8%8A">§</a></h4>\n<p>webpack是一个基于node的前端打包工具，但是node基于v8运行时只能是单线程，但是node中能够fork子进程。所以我们可以使用多进程的方式运行loader，和压缩js，社区有两个插件就是专门干这两个事的：HappyPack、ParallelUglifyPlugin。</p>\n<p>使用<a href="https://github.com/amireh/happypack">HappyPack</a></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  module<span class="token operator">:</span> <span class="token punctuation">{</span>\n    rules<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token punctuation">{</span>\n        test<span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>\n        <span class="token comment">// loader: \'babel-loader\'</span>\n        loader<span class="token operator">:</span> <span class="token string">\'happypack/loader?id=babel\'</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'happypack\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      id<span class="token operator">:</span> <span class="token string">\'babel\'</span><span class="token punctuation">,</span>\n      loaders<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'babel-loader\'</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>使用<a href="https://github.com/gdborton/webpack-parallel-uglify-plugin">ParallelUglifyPlugin</a></p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  optimization<span class="token operator">:</span> <span class="token punctuation">{</span>\n    minimizer<span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack-parallel-uglify-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        <span class="token comment">// 配置项</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="2%E6%89%93%E5%8C%85%E5%86%8D%E6%89%93%E5%8C%85">2、打包再打包<a class="anchor" href="#2%E6%89%93%E5%8C%85%E5%86%8D%E6%89%93%E5%8C%85">§</a></h4>\n<p>使windows的时候，我们经常会看到一些<code>.dll</code>文件，dll文件被称为动态链接库，里面包含了程序运行时的一些动态函数库，多个程序可以共用一个dll文件，可以减少程序运行时的物理内存。</p>\n<p>webpack中我们也可以引入dll的概念，使用<a href="https://webpack.js.org/plugins/dll-plugin/">DllPlugin</a>插件，将不经常变化的框架代码打包到一个js中，比如叫做dll.js。在打包的过程中，如果检测到某个块已经在dll.js中就不会再打包。之前DllPlugin与CommonsChunkPlugin并能相互兼容，本是同根生相煎何太急。但是升级到webpack4之后，问题就迎刃而解了。</p>\n<p>使用DllPlugin的时候，要先写另外一个webpack配置文件，用来生成dll文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//webpack.vue.dll.js</span>\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 把 vue 相关模块的放到一个单独的动态链接库</span>\n    vue<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'vue\'</span><span class="token punctuation">,</span> <span class="token string">\'vue-router\'</span><span class="token punctuation">,</span> <span class="token string">\'vuex\'</span><span class="token punctuation">,</span> <span class="token string">\'element-ui\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].dll.js\'</span><span class="token punctuation">,</span> <span class="token comment">//生成vue.dll.js</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'dist\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    library<span class="token operator">:</span> <span class="token string">\'_dll_[name]\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack/lib/DllPlugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      name<span class="token operator">:</span> <span class="token string">\'_dll_[name]\'</span><span class="token punctuation">,</span>\n      <span class="token comment">// manifest.json 描述动态链接库包含了哪些内容</span>\n      path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'dist\'</span><span class="token punctuation">,</span> <span class="token string">\'[name].manifest.json\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>然后在之前的webpack配置中，引入dll。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token comment">// 只要引入manifest.json就能知道哪些模块再dll文件中，在打包过程会忽略这些模块</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'webpack/lib/DllReferencePlugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      manifest<span class="token operator">:</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./dist/vue.manifest.json\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  devtool<span class="token operator">:</span> <span class="token string">\'source-map\'</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最后生成html文件的时候，一定要先引入dll文件。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>UTF-8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>app<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/vue.dll.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./dist/main.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="3%E4%BD%A0%E8%83%96%E4%BD%A0%E5%85%88%E8%B7%91%E9%83%A8%E5%88%86%E4%BB%A3%E7%A0%81%E9%A2%84%E5%85%88%E8%BF%90%E8%A1%8C">3、你胖你先跑，部分代码预先运行<a class="anchor" href="#3%E4%BD%A0%E8%83%96%E4%BD%A0%E5%85%88%E8%B7%91%E9%83%A8%E5%88%86%E4%BB%A3%E7%A0%81%E9%A2%84%E5%85%88%E8%BF%90%E8%A1%8C">§</a></h4>\n<p>前面的优化都是优化打包速度，或者减少重复模块的。这里有一种优化方式，能够减少代码量，并且减少客户端的运行时间。</p>\n<p>使用<a href="https://prepack.io/">Prepack</a>，这是facebook开源的一款工具，能够运行你的代码中部分能够提前运行的代码，减少在线上真实运行的代码。</p>\n<p>官方的demo如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">//input</span>\n<span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">return</span> <span class="token string">\'hello\'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n  <span class="token keyword">function</span> <span class="token function">world</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword control-flow">return</span> <span class="token string">\'world\'</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n  global<span class="token punctuation">.</span><span class="token property-access">s</span> <span class="token operator">=</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">\' \'</span> <span class="token operator">+</span> <span class="token function">world</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">//output</span>\ns <span class="token operator">=</span> <span class="token string">"hello world"</span><span class="token punctuation">;</span>\n</code></pre>\n<p>想在webpack中接入也比较简单，社区以及有了对应的插件<a href="https://github.com/gajus/prepack-webpack-plugin">prepack-webpack-plugin</a>，目前正式环境运用较少，还有些坑，可以继续观望。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">require</span><span class="token punctuation">(</span><span class="token string">\'prepack-webpack-plugin\'</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这里简单罗列了一些webpack的优化策略，但是有些优化策略还是还是要酌情考虑。比如多进程跑loader，如果你项目比较小，开了之后可能变慢了，因为本来打包时间就比较短，用来fork子进程的时间，说不定都已经跑完了。记住<code>过早的优化就是万恶之源</code>。</p>\n<h2 id="%E5%9B%9B%E6%80%BB%E7%BB%93">四、总结<a class="anchor" href="#%E5%9B%9B%E6%80%BB%E7%BB%93">§</a></h2>\n<p>webpack4带了很多新的特性，也大大加快的打包时间，并且减少了打包后的文件体积。期待webpack5的更多新特性，比如，以html或css为文件入口（鄙人认为html才是前端模块化的真正入口，浏览器的入口就是html，浏览器在真正的亲爹，不和爹亲和谁亲），默认开启多进程打包，加入文件的长期缓存，更多的拓展零配置。</p>\n<p>同时也要感谢前端社区其它的优秀的打包工具，感谢rollup，感谢parcel。</p>\n<h2 id="%E4%BA%94%E5%8F%82%E8%80%83">五、参考<a class="anchor" href="#%E4%BA%94%E5%8F%82%E8%80%83">§</a></h2>\n<ol>\n<li><a href="https://zhuanlan.zhihu.com/p/32148338">webpack 为什么这么难用？</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/35407642">Webpack 4进阶</a></li>\n<li><a href="https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693">RIP CommonsChunkPlugin</a></li>\n<li><a href="https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a">webpack 4: mode and optimization</a></li>\n<li><a href="https://github.com/dwqs/blog/issues/60">webpack 4 不完全迁移指北</a></li>\n</ol>'
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#%E4%B8%80%E5%89%8D%E8%A8%80">一、前言</a></li><li><a href="#%E4%BA%8C%E5%88%B0%E5%BA%95%E6%80%8E%E4%B9%88%E5%8D%87%E7%BA%A7">二、到底怎么升级</a><ol></ol></li><li><a href="#%E4%B8%89%E8%B5%A0%E9%80%81webpack%E5%B8%B8%E8%A7%81%E4%BC%98%E5%8C%96%E6%96%B9%E5%BC%8F">三、赠送webpack常见优化方式</a><ol></ol></li><li><a href="#%E5%9B%9B%E6%80%BB%E7%BB%93">四、总结</a></li><li><a href="#%E4%BA%94%E5%8F%82%E8%80%83">五、参考</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/06/09",
    'updated': null,
    'excerpt': "一、前言 2018/2/25，webpack4正式发布，距离现在已经过去三个多月了，也逐渐趋于稳定，而且现在的最新版本都到了4.12.0（版本迭代快得真是让人害怕）。 很多人都说webpack复杂，难以理解，很大一部分原因是webpack是基于配置的...",
    'cover': "//file.shenfq.com/18-6-9/66027398.jpg",
    'thumbnail': "//file.shenfq.com/18-8-16/87018253.jpg",
    'categories': [
        "前端工程"
    ],
    'tags': [
        "前端",
        "模块化",
        "前端工程化",
        "webpack"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
