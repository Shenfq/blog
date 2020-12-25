import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig },
    'pagePath': "posts/2018/ElementUI的构建流程.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2018/ElementUI的构建流程.html",
    'title': "ElementUI的构建流程",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>ElementUI的构建流程</h1>\n<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>最近一直在着手做一个与业务强相关的组件库，一直在思考要从哪里下手，怎么来设计这个组件库，因为业务上一直在使用ElementUI（以下简称Element），于是想参考了一下Element组件库的设计，看看Element构建方式，并且总结成了这篇文章。</p>\n<p><img src="https://file.shenfq.com/18-9-14/48784910.jpg" alt="logo"></p>\n<!-- more -->\n<h2 id="element%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84">Element的目录结构<a class="anchor" href="#element%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84">§</a></h2>\n<p>废话不多说，先看看目录结构，从目录结构入手，一步步进行分解。</p>\n<pre class="language-autoit"><code class="language-autoit">├─build <span class="token operator">/</span><span class="token operator">/</span> 构建相关的脚本和配置\n├─examples <span class="token operator">/</span><span class="token operator">/</span> 用于展示Element组件的demo\n├─lib <span class="token operator">/</span><span class="token operator">/</span> 构建后生成的文件，发布到npm包\n├─packages <span class="token operator">/</span><span class="token operator">/</span> 组件代码\n├─src <span class="token operator">/</span><span class="token operator">/</span> 引入组件的入口文件\n├─test <span class="token operator">/</span><span class="token operator">/</span> 测试代码\n├─Makefile <span class="token operator">/</span><span class="token operator">/</span> 构建文件\n├─components<span class="token punctuation">.</span>json <span class="token operator">/</span><span class="token operator">/</span> 组件列表\n└─package<span class="token punctuation">.</span>json\n</code></pre>\n<h2 id="%E6%9C%89%E5%93%AA%E4%BA%9B%E6%9E%84%E5%BB%BA%E5%91%BD%E4%BB%A4">有哪些构建命令<a class="anchor" href="#%E6%9C%89%E5%93%AA%E4%BA%9B%E6%9E%84%E5%BB%BA%E5%91%BD%E4%BB%A4">§</a></h2>\n<p>刚打开的时候看到了一个Makefile文件，如果学过c/c++的同学对这个东西应该不陌生，当时看到后台同学发布版本时，写下了一句<code>make love</code>，把我和我的小伙伴们都惊呆了。说正紧的，makefile可以说是比较早出现在UNIX 系统中的工程化工具，通过一个简单的<code>make XXX</code>来执行一系列的编译和链接操作。不懂makefile文件的可以看这篇文章了解下：<a href="https://segmentfault.com/a/1190000004437816#articleHeader11">前端入门-&gt;makefile</a></p>\n<p>当我们打开Element的Makefile时，发现里面的操作都是npm script的命令，我不知道为什么还要引入Makefile，直接使用<code>npm run xxx</code>就好了呀。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token keyword">default</span><span class="token punctuation">:</span> help\n\ninstall<span class="token punctuation">:</span>\n  npm install\n  \nnew<span class="token punctuation">:</span>\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>new<span class="token punctuation">.</span>js $<span class="token punctuation">(</span>filter<span class="token operator">-</span>out $@<span class="token punctuation">,</span>$<span class="token punctuation">(</span>MAKECMDGOALS<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  \ndev<span class="token punctuation">:</span>\n  npm run dev\n  \ndeploy<span class="token punctuation">:</span>\n  <span class="token variable">@npm</span> run deploy\n  \ndist<span class="token punctuation">:</span> install\n  npm run dist\n  \npub<span class="token punctuation">:</span>\n  npm run pub\n  \nhelp<span class="token punctuation">:</span>\n  <span class="token variable">@echo</span> <span class="token string">"make 命令使用说明"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make install  ---  安装依赖"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make new &lt;component-name> [中文名]  ---  创建新组件 package. 例如 \'make new button 按钮\'"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make dev  ---  开发模式"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make dist  ---  编译项目，生成目标文件"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make deploy  ---  部署 demo"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make pub  ---  发布到 npm 上"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make new-lang &lt;lang>  ---  为网站添加新语言. 例如 \'make new-lang fr\'"</span>\n</code></pre>\n<h2 id="%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">开发模式与构建入口文件<a class="anchor" href="#%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">§</a></h2>\n<p>这里我们只挑选几个重要的看看。首先看到<code>make install</code>，使用的是npm进行依赖安装，但是Element实际上是使用yarn进行依赖管理，所以如果你要在本地进行Element开发的话，最好使用yarn进行依赖安装。在官方的<a href="https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md#%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA">贡献指南</a>也有提到。</p>\n<p><img src="https://file.shenfq.com/18-9-8/65602547.jpg" alt="贡献指南"></p>\n<p>同时在package.json文件中有个bootstrap命令就是使用yarn来安装依赖。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"bootstrap"</span><span class="token punctuation">:</span> <span class="token string">"yarn || npm i"</span><span class="token punctuation">,</span>\n</code></pre>\n<p>安装完依赖之后，就可以进行开发了，运行<code>npm run dev</code>，可以通过webpack-dev-sever在本地运行Element官网的demo。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"dev"</span><span class="token punctuation">:</span> "\n    npm run bootstrap <span class="token operator">&amp;</span><span class="token operator">&amp;</span> <span class="token operator">/</span><span class="token operator">/</span> 依赖安装\n    npm run build<span class="token punctuation">:</span>file <span class="token operator">&amp;</span><span class="token operator">&amp;</span> <span class="token operator">/</span><span class="token operator">/</span> 目标文件生成\n    cross<span class="token operator">-</span>env NODE_ENV<span class="token operator">=</span>development webpack<span class="token operator">-</span>dev<span class="token operator">-</span>server <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>demo<span class="token punctuation">.</span>js <span class="token operator">&amp;</span> \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>template<span class="token punctuation">.</span>js\n"\n\n<span class="token string">"build:file"</span><span class="token punctuation">:</span> " \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>iconInit<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 解析icon<span class="token punctuation">.</span>scss，将所有小图标的name存入examples<span class="token operator">/</span>icon<span class="token punctuation">.</span>json\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>build<span class="token operator">-</span>entry<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 根据components<span class="token punctuation">.</span>json，生成入口文件\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>i18n<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 根据examples<span class="token operator">/</span>i18n<span class="token operator">/</span>page<span class="token punctuation">.</span>json和模板，生成不同语言的demo\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>version<span class="token punctuation">.</span>js <span class="token operator">/</span><span class="token operator">/</span> 生成examples<span class="token operator">/</span>versions<span class="token punctuation">.</span>json，键值对，各个大版本号对应的最新版本\n"\n</code></pre>\n<p>在通过webpack-dev-server运行demo时，有个前置条件，就是通过<code>npm run build:file</code>生成目标文件。这里主要看下<code>node build/bin/build-entry.js</code>，这个脚本用于生成Element的入口js。先是读取根目录的components.json，这个json文件维护着Element的所有的组件名，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行import，对外暴露install方法，把所有import的组件通过<code>Vue.component(name, component)</code>方式注册为全局组件，并且把一些弹窗类的组件挂载到Vue的原型链上。具体代码如下（ps：对代码进行一些精简，具体逻辑不变）：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> render <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'json-templater/string\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> endOfLine <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token constant">EOL</span><span class="token punctuation">;</span> <span class="token comment">// 换行符</span>\n\n<span class="token keyword">var</span> includeComponentTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> installTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> listTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> componentName <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//将组件名转为驼峰</span>\n  <span class="token keyword">var</span> componetPath <span class="token operator">=</span> <span class="token maybe-class-name">Components</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'.</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componetPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\';</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 这几个特殊组件不能直接注册成全局组件，需要挂载到Vue的原型链上</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'Loading\'</span><span class="token punctuation">,</span> <span class="token string">\'MessageBox\'</span><span class="token punctuation">,</span> <span class="token string">\'Notification\'</span><span class="token punctuation">,</span> <span class="token string">\'Message\'</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>componentName<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    installTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentName <span class="token operator">!==</span> <span class="token string">\'Loading\'</span><span class="token punctuation">)</span> listTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> template <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">/* Automatically generated by \'./build/bin/build-entry.js\' */\n\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\nimport locale from \'element-ui/src/locale\';\nimport CollapseTransition from \'element-ui/src/transitions/collapse-transition\';\n\nconst components = [\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,\n  CollapseTransition\n];\n\nconst install = function(Vue, opts = {}) {\n  locale.use(opts.locale);\n  locale.i18n(opts.i18n);\n\n  components.forEach(component => {\n    Vue.component(component.name, component);\n  });\n\n  Vue.use(Loading.directive);\n\n  Vue.prototype.$ELEMENT = {\n    size: opts.size || \'\',\n    zIndex: opts.zIndex || 2000\n  };\n\n  Vue.prototype.$loading = Loading.service;\n  Vue.prototype.$msgbox = MessageBox;\n  Vue.prototype.$alert = MessageBox.alert;\n  Vue.prototype.$confirm = MessageBox.confirm;\n  Vue.prototype.$prompt = MessageBox.prompt;\n  Vue.prototype.$notify = Notification;\n  Vue.prototype.$message = Message;\n\n};\n\n/* istanbul ignore if */\nif (typeof window !== \'undefined\' &amp;&amp; window.Vue) {\n  install(window.Vue);\n}\n\nmodule.exports = {\n  version: \'</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">VERSION</span> <span class="token operator">||</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../package.json\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">version</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\',\n  locale: locale.use,\n  i18n: locale.i18n,\n  install,\n  CollapseTransition,\n  Loading,\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>listTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n};\n\nmodule.exports.default = module.exports;\n</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n\n<span class="token comment">// 写文件</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">writeFileSync</span><span class="token punctuation">(</span><span class="token constant">OUTPUT_PATH</span><span class="token punctuation">,</span> template<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'[build entry] DONE:\'</span><span class="token punctuation">,</span> <span class="token constant">OUTPUT_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n</code></pre>\n<p>最后生成的代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* Automatically generated by \'./build/bin/build-entry.js\' */</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Button</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/button/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Table</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/table/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Form</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/form/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Row</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/row/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Col</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/col/index.js\'</span><span class="token punctuation">;</span>\n<span class="token comment">// some others Component</span>\n<span class="token keyword module">import</span> <span class="token imports">locale</span> <span class="token keyword module">from</span> <span class="token string">\'element-ui/src/locale\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">CollapseTransition</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui/src/transitions/collapse-transition\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token maybe-class-name">Button</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Table</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Form</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Row</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Menu</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Col</span><span class="token punctuation">,</span>\n  <span class="token comment">// some others Component</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token function-variable function">install</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token maybe-class-name">Vue</span><span class="token punctuation">,</span> opts <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  locale<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">locale</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  locale<span class="token punctuation">.</span><span class="token method function property-access">i18n</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">i18n</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  components<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">component</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">component</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Loading</span><span class="token punctuation">.</span><span class="token property-access">directive</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$</span><span class="token constant">ELEMENT</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    size<span class="token operator">:</span> opts<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">||</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n    zIndex<span class="token operator">:</span> opts<span class="token punctuation">.</span><span class="token property-access">zIndex</span> <span class="token operator">||</span> <span class="token number">2000</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$loading</span> <span class="token operator">=</span> <span class="token maybe-class-name">Loading</span><span class="token punctuation">.</span><span class="token property-access">service</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$msgbox</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$alert</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">alert</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$confirm</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">confirm</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$prompt</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">prompt</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$notify</span> <span class="token operator">=</span> <span class="token maybe-class-name">Notification</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$message</span> <span class="token operator">=</span> <span class="token maybe-class-name">Message</span><span class="token punctuation">;</span>\n\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">/* istanbul ignore if */</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token dom variable">window</span> <span class="token operator">!==</span> <span class="token string">\'undefined\'</span> <span class="token operator">&amp;&amp;</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Vue</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">install</span><span class="token punctuation">(</span><span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Vue</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  version<span class="token operator">:</span> <span class="token string">\'2.4.6\'</span><span class="token punctuation">,</span>\n  locale<span class="token operator">:</span> locale<span class="token punctuation">.</span><span class="token property-access">use</span><span class="token punctuation">,</span>\n  i18n<span class="token operator">:</span> locale<span class="token punctuation">.</span><span class="token property-access">i18n</span><span class="token punctuation">,</span>\n  install<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Button</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Table</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Form</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Row</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Menu</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Col</span><span class="token punctuation">,</span>\n  <span class="token comment">// some others Component</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">.</span><span class="token keyword module">default</span> <span class="token operator">=</span> module<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最后有个写法需要注意：<code>module.exports.default = module.exports;</code>，这里是为了兼容ESmodule，因为es6的模块<code>export default xxx</code>，在webpack中最后会变成类似于<code>exports.default = xxx</code>的形式，而<code>import ElementUI from \'element-ui\';</code>会变成<code>ElementUI = require(\'element-ui\').default</code>的形式，为了让ESmodule识别这种commonjs的写法，就需要加上default。</p>\n<p>exports对外暴露的install方法就是把Element组件注册会全局组件的方法。当我们使用<code>Vue.use</code>时，就会调用对外暴露的install方法。如果我们直接通过script的方式引入vue和Element，检测到Vue为全局变量时，也会调用install方法。</p>\n<pre class="language-html"><code class="language-html">// 使用方式1\n<span class="token comment">&lt;!-- import Vue before Element --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://unpkg.com/vue/dist/vue.js">https://unpkg.com/vue/dist/vue.js</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token comment">&lt;!-- import JavaScript --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://unpkg.com/element-ui/lib/index.js">https://unpkg.com/element-ui/lib/index.js</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n// 使用方式2\nimport Vue from \'vue\';\nimport ElementUI from \'element-ui\';\nimport \'element-ui/lib/theme-chalk/index.css\';\n\nVue.use(ElementUI); // 此时会调用ElementUI.install()\n\n</code></pre>\n<p>在module.exports对象中，除了暴露install方法外，还把所有组件进行了对外的暴露，方便引入单个组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">Button</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui\'</span><span class="token punctuation">;</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Button</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是如果你有进行按需加载，使用Element官方的babel-plugin-component插件，上面代码会转换成如下形式：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> _button <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/button\'</span><span class="token punctuation">)</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/theme-chalk/button.css\'</span><span class="token punctuation">)</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>_button<span class="token punctuation">)</span>\n</code></pre>\n<p>那么前面module.exports对外暴露的单组件好像也没什么用。\n不过这里使用<code>npm run build:file</code>生成文件的方式是可取的，因为在实际项目中，我们每新增一个组件，只需要修改components.json文件，然后使用<code>npm run build:file</code>重新生成代码就可以了，不需要手动去修改多个文件。</p>\n<p>在生成了入口文件的index.js之后就会运行webpack-dev-server。</p>\n<pre class="language-bash"><code class="language-bash">webpack-dev-server --config build/webpack.demo.js\n</code></pre>\n<p>接下来看下webpack.demo.js的入口文件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// webpack.demo.js</span>\n<span class="token keyword">const</span> webpackConfig <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./examples/entry.js\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./examples/element-ui/\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">CI_ENV</span> <span class="token operator">||</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].[hash:7].js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> isProd <span class="token operator">?</span> <span class="token string">\'[name].[hash:7].js\'</span> <span class="token operator">:</span> <span class="token string">\'[name].js\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  resolve<span class="token operator">:</span> <span class="token punctuation">{</span>\n    extensions<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.vue\'</span><span class="token punctuation">,</span> <span class="token string">\'.json\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n    alias<span class="token operator">:</span> <span class="token punctuation">{</span>\n      main<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../src\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      packages<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../packages\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      examples<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../examples\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token string">\'element-ui\'</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    modules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'node_modules\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ... some other config</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// examples/entry.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Element</span></span> <span class="token keyword module">from</span> <span class="token string">\'main/index.js\'</span><span class="token punctuation">;</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Element</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h2 id="%E6%96%B0%E5%BB%BA%E7%BB%84%E4%BB%B6">新建组件<a class="anchor" href="#%E6%96%B0%E5%BB%BA%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>entry.js就是直接引入的之前build:file中生成的index.js的Element的入口文件。因为这篇文章主要讲构建流程，所以不会仔细看demo的源码。下面看看Element如何新建一个组件，在Makefile可以看到使用<code>make new xxx</code>新建一个组件。。</p>\n<pre class="language-autoit"><code class="language-autoit">new<span class="token punctuation">:</span>\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>new<span class="token punctuation">.</span>js $<span class="token punctuation">(</span>filter<span class="token operator">-</span>out $@<span class="token punctuation">,</span>$<span class="token punctuation">(</span>MAKECMDGOALS<span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p>这后面的<code>$(filter-out $@,$(MAKECMDGOALS))</code>就是把命令行输入的参数直接传输给<code>node build/bin/new.js</code>，具体细节这里不展开，还是直接看看<code>build/bin/new.js</code>的具体细节。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 参数校验</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'[组件名]必填 - Please enter new component name\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> fileSave <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'file-save\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// 获取命令行的参数</span>\n<span class="token comment">// e.g. node new.js input 输入框 </span>\n<span class="token comment">// process.argv表示命令行的参数数组</span>\n<span class="token comment">// 0是node，1是new.js，2和3就是后面两个参数</span>\n<span class="token keyword">const</span> componentname <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 组件名</span>\n<span class="token keyword">const</span> chineseName <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">||</span> componentname<span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentName</span> <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>componentname<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 转成驼峰表示</span>\n<span class="token comment">// 组件所在的目录文件</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">PackagePath</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../../packages\'</span><span class="token punctuation">,</span> componentname<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 检查components.json中是否已经存在同名组件</span>\n<span class="token keyword">const</span> componentsFile <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已存在.</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// componentsFile中写入新的组件键值对</span>\ncomponentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">./packages/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/index.js</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n<span class="token function">fileSave</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>componentsFile<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n<span class="token keyword">const</span> <span class="token maybe-class-name">Files</span> <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">index.js相关模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> \n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'src/main.vue\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件相关的模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 下面三个文件是的对应的中英文api文档</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/zh-CN\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>chineseName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/en-US\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/es\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  \n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../test/unit/specs\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.spec.js</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件相关测试用例的模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../packages/theme-chalk/src\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.scss</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件的样式文件</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../types\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.d.ts</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件的types文件，用于语法提示</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 生成组件必要的文件</span>\n<span class="token maybe-class-name">Files</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">file</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token function">fileSave</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token maybe-class-name">PackagePath</span><span class="token punctuation">,</span> file<span class="token punctuation">.</span><span class="token property-access">filename</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这个脚本最终会在<code>components.json</code>写入组件相关的键值对，同时在packages目录创建对应的组件文件，并在<code>packages/theme-chalk/src</code>目录下创建一个样式文件，Element的样式是使用sass进行预编译的，所以生成是<code>.scss</code>文件。大致看下packages目录下生成的文件的模板：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n  content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'./src/main\';\n\n  /* istanbul ignore next */\n  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.install = function(Vue) {\n    Vue.component(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.name, </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">);\n  };\n\n  export default </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">;\n  </span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">{</span>\n  filename<span class="token operator">:</span> <span class="token string">\'src/main.vue\'</span><span class="token punctuation">,</span>\n  content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  &lt;template>\n    &lt;div class="el-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">">&lt;/div>\n  &lt;/template>\n\n  &lt;script>\n    export default {\n      name: \'El</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'\n    };\n  &lt;/script>\n  </span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>每个组件都会对外单独暴露一个install方法，因为Element支持按需加载。同时，每个组件名都会加上<code>El</code>前缀。，所以我们使用Element组件时，经常是这样的<code>el-xxx</code>，这符合W3C的自定义HTML标签的<a href="https://www.w3.org/TR/custom-elements/#concepts">规范</a>（小写，并且包含一个短杠）。</p>\n<h2 id="%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B">打包流程<a class="anchor" href="#%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B">§</a></h2>\n<p>由于现代前端的复杂环境，代码写好之后并不能直接使用，被拆成模块的代码，需要通过打包工具进行打包成一个单独的js文件。并且由于各种浏览器的兼容性问题，还需要把ES6语法转译为ES5，sass、less等css预编译语言需要经过编译生成浏览器真正能够运行的css文件。所以，当我们通过<code>npm run new component</code>新建一个组件，并通过<code>npm run dev</code>在本地调试好代码后，需要把进行打包操作，才能真正发布到npm上。</p>\n<p>这里运行<code>npm run dist</code>进行Element的打包操作，具体命令如下。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"dist"</span><span class="token punctuation">:</span> "\n    npm run clean <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>file <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run lint <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>conf<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>common<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>component<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>utils <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>umd <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>theme\n"\n</code></pre>\n<p><img src="https://file.shenfq.com/18-9-14/30112392.jpg" alt="流程图"></p>\n<p>下面一步步拆解上述流程。</p>\n<h4 id="%E6%B8%85%E7%90%86%E6%96%87%E4%BB%B6">清理文件<a class="anchor" href="#%E6%B8%85%E7%90%86%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"clean"</span><span class="token punctuation">:</span> <span class="token string">"rimraf lib &amp;&amp; rimraf packages/*/lib &amp;&amp; rimraf test/**/coverage"</span>\n</code></pre>\n<p>使用<code>npm run clean</code>会删除之前打包生成的文件，这里直接使用了一个node包：rimraf，类似于linux下的<code>rm -rf</code>。</p>\n<h4 id="%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90">入口文件生成<a class="anchor" href="#%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90">§</a></h4>\n<p><code>npm run build:file</code>在前面已经介绍过了，通过components.json生成入口文件。</p>\n<h4 id="%E4%BB%A3%E7%A0%81%E6%A3%80%E6%9F%A5">代码检查<a class="anchor" href="#%E4%BB%A3%E7%A0%81%E6%A3%80%E6%9F%A5">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"lint"</span><span class="token punctuation">:</span> <span class="token string">"eslint src/**/* test/**/* packages/**/* build/**/* --quiet"</span>\n</code></pre>\n<p>使用ESLint对多个目录下的文件进行lint操作。</p>\n<h4 id="%E6%96%87%E4%BB%B6%E6%89%93%E5%8C%85">文件打包<a class="anchor" href="#%E6%96%87%E4%BB%B6%E6%89%93%E5%8C%85">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>conf<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \nwebpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>common<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \nwebpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>component<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n</code></pre>\n<p>这里直接使用原生webpack进行打包操作，webpack版本为：3.7.1。在Element@2.4.0之前，使用的打包工具为<a href="https://github.com/ElemeFE/cooking/blob/master/README_zh-cn.md"><code>cooking</code></a>，但是这个工具是基于webpack2，很久没有更新（ps. 项目中能使用webpack最好使用webpack，多阅读官网的文档，虽然文档很烂，其他第三方对webpack进行包装的构建工具，很容易突然就不更新了，到时候要迁移会很麻烦）。</p>\n<p>这三个配置文件的配置基本类似，区别在entry和output。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// webpack.conf.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'./src/index.js\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'umd\'</span><span class="token punctuation">,</span>\n    library<span class="token operator">:</span> <span class="token string">\'ELEMENT\'</span><span class="token punctuation">,</span>\n    umdNamedDefine<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// webpack.common.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'./src/index.js\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'element-ui.common.js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'commonjs2\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// webpack.component.js</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token maybe-class-name">Components</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'commonjs2\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>webpack.conf.js 与 webpack.common.js打包的入口文件都是<code>src/index.js</code>，该文件通过<code>npm run build:file</code>生成。不同之处在于输出文件，两个配置生成的js都在lib目录，重点在于libraryTarget，一个是umd，一个是commonjs2。还一个 webpack.component.js 的入口文件为 components.json 中的所有组件，表示packages目录下的所有组件都会在lib文件夹下生成也单独的js文件，这些组件单独的js文件就是用来做按需加载的，如果需要哪个组件，就会单独import这个组件js。</p>\n<p>当我们直接在代码中引入整个Element的时候，加载的是 webpack.common.js 打包生成的 element-ui.common.js 文件。因为我们引入npm包的时候，会根据package.json中的main字段来查找入口文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// package.json</span>\n<span class="token string">"main"</span><span class="token operator">:</span> <span class="token string">"lib/element-ui.common.js"</span>\n</code></pre>\n<h4 id="%E8%BD%AC%E8%AF%91%E5%B7%A5%E5%85%B7%E6%96%B9%E6%B3%95">转译工具方法<a class="anchor" href="#%E8%BD%AC%E8%AF%91%E5%B7%A5%E5%85%B7%E6%96%B9%E6%B3%95">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"build:utils"</span><span class="token punctuation">:</span> <span class="token string">"cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js"</span><span class="token punctuation">,</span>\n</code></pre>\n<p>这一部分是吧src目录下的除了index.js入口文件外的其他文件通过babel转译，然后移动到lib文件夹下。</p>\n<pre class="language-autoit"><code class="language-autoit">└─src\n    ├─directives\n    ├─locale\n    ├─mixins\n    ├─transitions\n    ├─popup\n    └─index<span class="token punctuation">.</span>js\n</code></pre>\n<p>在src目录下，除了index.js外，还有一些其他文件夹，这些是Element组件中经常使用的工具方法。如果你对Element的源码足够熟悉，可以直接把Element中一些工具方法拿来使用，不再需要安装其他的包。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/utils/date\'</span><span class="token punctuation">)</span>\n\ndate<span class="token punctuation">.</span><span class="token method function property-access">format</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">,</span> <span class="token string">\'HH:mm:ss\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E7%94%9F%E6%88%90%E6%A0%B7%E5%BC%8F%E6%96%87%E4%BB%B6">生成样式文件<a class="anchor" href="#%E7%94%9F%E6%88%90%E6%A0%B7%E5%BC%8F%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"build:theme"</span><span class="token punctuation">:</span> "\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>gen<span class="token operator">-</span>cssfile <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n  gulp build <span class="token operator">-</span><span class="token operator">-</span>gulpfile packages<span class="token operator">/</span>theme<span class="token operator">-</span>chalk<span class="token operator">/</span>gulpfile<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n  cp<span class="token operator">-</span>cli packages<span class="token operator">/</span>theme<span class="token operator">-</span>chalk<span class="token operator">/</span>lib lib<span class="token operator">/</span>theme<span class="token operator">-</span>chalk\n"\n</code></pre>\n<p>这里直接使用gulp将scss文件转为css文件。</p>\n<pre class="language-javascript"><code class="language-javascript">gulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./src/*.scss\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>sass<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">autoprefixer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      browsers<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'ie > 9\'</span><span class="token punctuation">,</span> <span class="token string">\'last 2 versions\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      cascade<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">cssmin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最终我们引入的<code>element-ui/lib/theme-chalk/index.css</code>，其源文件只不过是把所有组件的scss文件进行import。这个index.scss是在运行gulp之前，通过<code>node build/bin/gen-cssfile</code>命令生成的，逻辑与生成js的入口文件类似，同样是遍历components.json。</p>\n<p><img src="https://file.shenfq.com/18-9-16/48946057.jpg" alt="index.scss"></p>\n<h2 id="%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B">发布流程<a class="anchor" href="#%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B">§</a></h2>\n<p>代码经过之前的编译，就到了发布流程，在Element中发布主要是用shell脚本实现的。Element发布一共涉及三个部分。</p>\n<ol>\n<li>git发布</li>\n<li>npm发布</li>\n<li>官网发布</li>\n</ol>\n<pre class="language-autoit"><code class="language-autoit"><span class="token operator">/</span><span class="token operator">/</span> 新版本发布\n<span class="token string">"pub"</span><span class="token punctuation">:</span> "\n    npm run bootstrap <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>git<span class="token operator">-</span>release<span class="token punctuation">.</span>sh <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>release<span class="token punctuation">.</span>sh <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>gen<span class="token operator">-</span>indices<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>deploy<span class="token operator">-</span>faas<span class="token punctuation">.</span>sh\n"\n</code></pre>\n<h4 id="git%E5%86%B2%E7%AA%81%E6%A3%80%E6%B5%8B">git冲突检测<a class="anchor" href="#git%E5%86%B2%E7%AA%81%E6%A3%80%E6%B5%8B">§</a></h4>\n<p>运行 <a href="http://git-release.sh">git-release.sh</a> 进行git冲突的检测，这里主要是检测dev分支是否冲突，因为Element是在dev分支进行开发的（这个才Element官方的开发指南也有提到），只有在最后发布时，才merge到master。</p>\n<p><img src="https://file.shenfq.com/18-9-16/41638093.jpg" alt="开发指南"></p>\n<pre class="language-bash"><code class="language-bash"><span class="token shebang important">#!/usr/bin/env sh</span>\n<span class="token comment"># 切换至dev分支</span>\n<span class="token function">git</span> checkout dev\n\n<span class="token comment"># 检测本地和暂存区是否还有未提交的文件</span>\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> -n <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> status --porcelain<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'Unclean working tree. Commit or stash changes first.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n<span class="token comment"># 检测本地分支是否有误</span>\n<span class="token keyword">if</span> <span class="token operator">!</span> <span class="token function">git</span> fetch --quiet <span class="token operator"><span class="token file-descriptor important">2</span>></span>/dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'There was a problem fetching your branch. Run <span class="token variable"><span class="token variable">`</span><span class="token function">git</span> fetch<span class="token variable">`</span></span> to see more...\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n<span class="token comment"># 检测本地分支是否落后远程分支</span>\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> <span class="token string">"0"</span> <span class="token operator">!=</span> <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> rev-list --count --left-only @<span class="token string">\'{u}\'</span><span class="token punctuation">..</span>.HEAD<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'Remote history differ. Please pull changes.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n\n<span class="token builtin class-name">echo</span> <span class="token string">\'No conflicts.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n</code></pre>\n<h4 id="git%E5%8F%91%E5%B8%83npm%E5%8F%91%E5%B8%83">git发布；npm发布<a class="anchor" href="#git%E5%8F%91%E5%B8%83npm%E5%8F%91%E5%B8%83">§</a></h4>\n<p>检测到git在dev分支上没有冲突后，<a href="http://xn--release-zx2ll52i774ctb5a.sh">立即执行release.sh</a>。</p>\n<p><img src="https://file.shenfq.com/18-9-17/55012829.jpg" alt="发布"></p>\n<p>这一部分代码比较简单，可以直接在<a href="https://github.com/ElemeFE/element/blob/dev/build/release.sh">github</a>上查看。上述发布流程，省略了一个部分，就是Element会将其样式也发布到<a href="https://www.npmjs.com/package/element-theme-chalk">npm</a>上。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># publish theme</span>\n<span class="token builtin class-name">echo</span> <span class="token string">"Releasing theme-chalk <span class="token variable">$VERSION</span> ..."</span>\n<span class="token builtin class-name">cd</span> packages/theme-chalk\n<span class="token function">npm</span> version <span class="token variable">$VERSION</span> --message <span class="token string">"[release] <span class="token variable">$VERSION</span>"</span>\n<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token variable">$VERSION</span> <span class="token operator">=</span>~ <span class="token string">"beta"</span> <span class="token punctuation">]</span><span class="token punctuation">]</span>\n<span class="token keyword">then</span>\n  <span class="token function">npm</span> publish --tag beta\n<span class="token keyword">else</span>\n  <span class="token function">npm</span> publish\n<span class="token keyword">fi</span>\n</code></pre>\n<p>如果你只想使用Element的样式，不使用它的Vue组件，你也可以直接在npm上下载他们的样式，不过一般也没人这么做吧。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> -S element-theme-chalk\n</code></pre>\n<h4 id="%E5%AE%98%E7%BD%91%E6%9B%B4%E6%96%B0">官网更新<a class="anchor" href="#%E5%AE%98%E7%BD%91%E6%9B%B4%E6%96%B0">§</a></h4>\n<p>这一步就不详细说了，因为不在文章想说的构建流程之列。</p>\n<p>大致就是将静态资源生成到<code>examples/element-ui</code>目录下，然后放到<code>gh-pages</code>分支，这样就能通过github pages的方式访问。不信，你访问试试。</p>\n<blockquote>\n<p><a href="http://elemefe.github.io/element">http://elemefe.github.io/element</a></p>\n</blockquote>\n<p>同时在该分支下，写入了CNAME文件，这样访问<a href="element.eleme.io">element.eleme.io</a>也能定向到element的github pages了。</p>\n<pre class="language-autoit"><code class="language-autoit">echo element<span class="token punctuation">.</span>eleme<span class="token punctuation">.</span>io<span class="token operator">></span><span class="token operator">></span>examples<span class="token operator">/</span>element<span class="token operator">-</span>ui<span class="token operator">/</span>CNAME\n</code></pre>\n<p><img src="https://file.shenfq.com/18-9-17/84798170.jpg" alt="域名重定向"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>Element的代码总体看下来，还是十分流畅的，对自己做组件化帮助很大。刚开始写这篇文章的时候，标题写着<code>主流组件库的构建流程</code>，想把Element和antd的构建流程都写出来，写完Element才发现这个坑开得好大，于是麻溜的把标题改成<code>Element的构建流程</code>。当然Element除了其构建流程，本身很多组件的实现思路也很优雅，大家感兴趣可以去看一看。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "ElementUI\u7684\u6784\u5EFA\u6D41\u7A0B"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E8%83%8C%E6%99%AF">背景<a class="anchor" href="#%E8%83%8C%E6%99%AF">§</a></h2>\n<p>最近一直在着手做一个与业务强相关的组件库，一直在思考要从哪里下手，怎么来设计这个组件库，因为业务上一直在使用ElementUI（以下简称Element），于是想参考了一下Element组件库的设计，看看Element构建方式，并且总结成了这篇文章。</p>\n<p><img src="https://file.shenfq.com/18-9-14/48784910.jpg" alt="logo"></p>\n<!-- more -->\n<h2 id="element%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84">Element的目录结构<a class="anchor" href="#element%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84">§</a></h2>\n<p>废话不多说，先看看目录结构，从目录结构入手，一步步进行分解。</p>\n<pre class="language-autoit"><code class="language-autoit">├─build <span class="token operator">/</span><span class="token operator">/</span> 构建相关的脚本和配置\n├─examples <span class="token operator">/</span><span class="token operator">/</span> 用于展示Element组件的demo\n├─lib <span class="token operator">/</span><span class="token operator">/</span> 构建后生成的文件，发布到npm包\n├─packages <span class="token operator">/</span><span class="token operator">/</span> 组件代码\n├─src <span class="token operator">/</span><span class="token operator">/</span> 引入组件的入口文件\n├─test <span class="token operator">/</span><span class="token operator">/</span> 测试代码\n├─Makefile <span class="token operator">/</span><span class="token operator">/</span> 构建文件\n├─components<span class="token punctuation">.</span>json <span class="token operator">/</span><span class="token operator">/</span> 组件列表\n└─package<span class="token punctuation">.</span>json\n</code></pre>\n<h2 id="%E6%9C%89%E5%93%AA%E4%BA%9B%E6%9E%84%E5%BB%BA%E5%91%BD%E4%BB%A4">有哪些构建命令<a class="anchor" href="#%E6%9C%89%E5%93%AA%E4%BA%9B%E6%9E%84%E5%BB%BA%E5%91%BD%E4%BB%A4">§</a></h2>\n<p>刚打开的时候看到了一个Makefile文件，如果学过c/c++的同学对这个东西应该不陌生，当时看到后台同学发布版本时，写下了一句<code>make love</code>，把我和我的小伙伴们都惊呆了。说正紧的，makefile可以说是比较早出现在UNIX 系统中的工程化工具，通过一个简单的<code>make XXX</code>来执行一系列的编译和链接操作。不懂makefile文件的可以看这篇文章了解下：<a href="https://segmentfault.com/a/1190000004437816#articleHeader11">前端入门-&gt;makefile</a></p>\n<p>当我们打开Element的Makefile时，发现里面的操作都是npm script的命令，我不知道为什么还要引入Makefile，直接使用<code>npm run xxx</code>就好了呀。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token keyword">default</span><span class="token punctuation">:</span> help\n\ninstall<span class="token punctuation">:</span>\n  npm install\n  \nnew<span class="token punctuation">:</span>\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>new<span class="token punctuation">.</span>js $<span class="token punctuation">(</span>filter<span class="token operator">-</span>out $@<span class="token punctuation">,</span>$<span class="token punctuation">(</span>MAKECMDGOALS<span class="token punctuation">)</span><span class="token punctuation">)</span>\n  \ndev<span class="token punctuation">:</span>\n  npm run dev\n  \ndeploy<span class="token punctuation">:</span>\n  <span class="token variable">@npm</span> run deploy\n  \ndist<span class="token punctuation">:</span> install\n  npm run dist\n  \npub<span class="token punctuation">:</span>\n  npm run pub\n  \nhelp<span class="token punctuation">:</span>\n  <span class="token variable">@echo</span> <span class="token string">"make 命令使用说明"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make install  ---  安装依赖"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make new &lt;component-name> [中文名]  ---  创建新组件 package. 例如 \'make new button 按钮\'"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make dev  ---  开发模式"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make dist  ---  编译项目，生成目标文件"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make deploy  ---  部署 demo"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make pub  ---  发布到 npm 上"</span>\n  <span class="token variable">@echo</span> <span class="token string">"make new-lang &lt;lang>  ---  为网站添加新语言. 例如 \'make new-lang fr\'"</span>\n</code></pre>\n<h2 id="%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">开发模式与构建入口文件<a class="anchor" href="#%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">§</a></h2>\n<p>这里我们只挑选几个重要的看看。首先看到<code>make install</code>，使用的是npm进行依赖安装，但是Element实际上是使用yarn进行依赖管理，所以如果你要在本地进行Element开发的话，最好使用yarn进行依赖安装。在官方的<a href="https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md#%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA">贡献指南</a>也有提到。</p>\n<p><img src="https://file.shenfq.com/18-9-8/65602547.jpg" alt="贡献指南"></p>\n<p>同时在package.json文件中有个bootstrap命令就是使用yarn来安装依赖。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"bootstrap"</span><span class="token punctuation">:</span> <span class="token string">"yarn || npm i"</span><span class="token punctuation">,</span>\n</code></pre>\n<p>安装完依赖之后，就可以进行开发了，运行<code>npm run dev</code>，可以通过webpack-dev-sever在本地运行Element官网的demo。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"dev"</span><span class="token punctuation">:</span> "\n    npm run bootstrap <span class="token operator">&amp;</span><span class="token operator">&amp;</span> <span class="token operator">/</span><span class="token operator">/</span> 依赖安装\n    npm run build<span class="token punctuation">:</span>file <span class="token operator">&amp;</span><span class="token operator">&amp;</span> <span class="token operator">/</span><span class="token operator">/</span> 目标文件生成\n    cross<span class="token operator">-</span>env NODE_ENV<span class="token operator">=</span>development webpack<span class="token operator">-</span>dev<span class="token operator">-</span>server <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>demo<span class="token punctuation">.</span>js <span class="token operator">&amp;</span> \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>template<span class="token punctuation">.</span>js\n"\n\n<span class="token string">"build:file"</span><span class="token punctuation">:</span> " \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>iconInit<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 解析icon<span class="token punctuation">.</span>scss，将所有小图标的name存入examples<span class="token operator">/</span>icon<span class="token punctuation">.</span>json\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>build<span class="token operator">-</span>entry<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 根据components<span class="token punctuation">.</span>json，生成入口文件\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>i18n<span class="token punctuation">.</span>js <span class="token operator">&amp;</span>  <span class="token operator">/</span><span class="token operator">/</span> 根据examples<span class="token operator">/</span>i18n<span class="token operator">/</span>page<span class="token punctuation">.</span>json和模板，生成不同语言的demo\n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>version<span class="token punctuation">.</span>js <span class="token operator">/</span><span class="token operator">/</span> 生成examples<span class="token operator">/</span>versions<span class="token punctuation">.</span>json，键值对，各个大版本号对应的最新版本\n"\n</code></pre>\n<p>在通过webpack-dev-server运行demo时，有个前置条件，就是通过<code>npm run build:file</code>生成目标文件。这里主要看下<code>node build/bin/build-entry.js</code>，这个脚本用于生成Element的入口js。先是读取根目录的components.json，这个json文件维护着Element的所有的组件名，键为组件名，值为组件源码的入口文件；然后遍历键值，将所有组件进行import，对外暴露install方法，把所有import的组件通过<code>Vue.component(name, component)</code>方式注册为全局组件，并且把一些弹窗类的组件挂载到Vue的原型链上。具体代码如下（ps：对代码进行一些精简，具体逻辑不变）：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> render <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'json-templater/string\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> endOfLine <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'os\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token constant">EOL</span><span class="token punctuation">;</span> <span class="token comment">// 换行符</span>\n\n<span class="token keyword">var</span> includeComponentTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> installTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> listTemplate <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">keys</span><span class="token punctuation">(</span><span class="token maybe-class-name">Components</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">name</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> componentName <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//将组件名转为驼峰</span>\n  <span class="token keyword">var</span> componetPath <span class="token operator">=</span> <span class="token maybe-class-name">Components</span><span class="token punctuation">[</span>name<span class="token punctuation">]</span>\n  includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'.</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componetPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\';</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n  <span class="token comment">// 这几个特殊组件不能直接注册成全局组件，需要挂载到Vue的原型链上</span>\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'Loading\'</span><span class="token punctuation">,</span> <span class="token string">\'MessageBox\'</span><span class="token punctuation">,</span> <span class="token string">\'Notification\'</span><span class="token punctuation">,</span> <span class="token string">\'Message\'</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token method function property-access">indexOf</span><span class="token punctuation">(</span>componentName<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    installTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentName <span class="token operator">!==</span> <span class="token string">\'Loading\'</span><span class="token punctuation">)</span> listTemplate<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> template <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">/* Automatically generated by \'./build/bin/build-entry.js\' */\n\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>includeComponentTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\nimport locale from \'element-ui/src/locale\';\nimport CollapseTransition from \'element-ui/src/transitions/collapse-transition\';\n\nconst components = [\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>installTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,\n  CollapseTransition\n];\n\nconst install = function(Vue, opts = {}) {\n  locale.use(opts.locale);\n  locale.i18n(opts.i18n);\n\n  components.forEach(component => {\n    Vue.component(component.name, component);\n  });\n\n  Vue.use(Loading.directive);\n\n  Vue.prototype.$ELEMENT = {\n    size: opts.size || \'\',\n    zIndex: opts.zIndex || 2000\n  };\n\n  Vue.prototype.$loading = Loading.service;\n  Vue.prototype.$msgbox = MessageBox;\n  Vue.prototype.$alert = MessageBox.alert;\n  Vue.prototype.$confirm = MessageBox.confirm;\n  Vue.prototype.$prompt = MessageBox.prompt;\n  Vue.prototype.$notify = Notification;\n  Vue.prototype.$message = Message;\n\n};\n\n/* istanbul ignore if */\nif (typeof window !== \'undefined\' &amp;&amp; window.Vue) {\n  install(window.Vue);\n}\n\nmodule.exports = {\n  version: \'</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">VERSION</span> <span class="token operator">||</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../package.json\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">version</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\',\n  locale: locale.use,\n  i18n: locale.i18n,\n  install,\n  CollapseTransition,\n  Loading,\n</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>listTemplate<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\',\'</span> <span class="token operator">+</span> endOfLine<span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n};\n\nmodule.exports.default = module.exports;\n</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n\n<span class="token comment">// 写文件</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">writeFileSync</span><span class="token punctuation">(</span><span class="token constant">OUTPUT_PATH</span><span class="token punctuation">,</span> template<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'[build entry] DONE:\'</span><span class="token punctuation">,</span> <span class="token constant">OUTPUT_PATH</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n</code></pre>\n<p>最后生成的代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* Automatically generated by \'./build/bin/build-entry.js\' */</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Button</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/button/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Table</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/table/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Form</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/form/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Row</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/row/index.js\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Col</span></span> <span class="token keyword module">from</span> <span class="token string">\'../packages/col/index.js\'</span><span class="token punctuation">;</span>\n<span class="token comment">// some others Component</span>\n<span class="token keyword module">import</span> <span class="token imports">locale</span> <span class="token keyword module">from</span> <span class="token string">\'element-ui/src/locale\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">CollapseTransition</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui/src/transitions/collapse-transition\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> components <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token maybe-class-name">Button</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Table</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Form</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Row</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Menu</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Col</span><span class="token punctuation">,</span>\n  <span class="token comment">// some others Component</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token keyword">const</span> <span class="token function-variable function">install</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token maybe-class-name">Vue</span><span class="token punctuation">,</span> opts <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  locale<span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">locale</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  locale<span class="token punctuation">.</span><span class="token method function property-access">i18n</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span><span class="token property-access">i18n</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  components<span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">component</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">component</span><span class="token punctuation">(</span>component<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">,</span> component<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Loading</span><span class="token punctuation">.</span><span class="token property-access">directive</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$</span><span class="token constant">ELEMENT</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    size<span class="token operator">:</span> opts<span class="token punctuation">.</span><span class="token property-access">size</span> <span class="token operator">||</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n    zIndex<span class="token operator">:</span> opts<span class="token punctuation">.</span><span class="token property-access">zIndex</span> <span class="token operator">||</span> <span class="token number">2000</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$loading</span> <span class="token operator">=</span> <span class="token maybe-class-name">Loading</span><span class="token punctuation">.</span><span class="token property-access">service</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$msgbox</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$alert</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">alert</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$confirm</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">confirm</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$prompt</span> <span class="token operator">=</span> <span class="token maybe-class-name">MessageBox</span><span class="token punctuation">.</span><span class="token property-access">prompt</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$notify</span> <span class="token operator">=</span> <span class="token maybe-class-name">Notification</span><span class="token punctuation">;</span>\n  <span class="token class-name">Vue</span><span class="token punctuation">.</span><span class="token property-access">prototype</span><span class="token punctuation">.</span><span class="token property-access">$message</span> <span class="token operator">=</span> <span class="token maybe-class-name">Message</span><span class="token punctuation">;</span>\n\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token comment">/* istanbul ignore if */</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token dom variable">window</span> <span class="token operator">!==</span> <span class="token string">\'undefined\'</span> <span class="token operator">&amp;&amp;</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Vue</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token function">install</span><span class="token punctuation">(</span><span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">Vue</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  version<span class="token operator">:</span> <span class="token string">\'2.4.6\'</span><span class="token punctuation">,</span>\n  locale<span class="token operator">:</span> locale<span class="token punctuation">.</span><span class="token property-access">use</span><span class="token punctuation">,</span>\n  i18n<span class="token operator">:</span> locale<span class="token punctuation">.</span><span class="token property-access">i18n</span><span class="token punctuation">,</span>\n  install<span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Button</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Table</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Form</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Row</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Menu</span><span class="token punctuation">,</span>\n  <span class="token maybe-class-name">Col</span><span class="token punctuation">,</span>\n  <span class="token comment">// some others Component</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">.</span><span class="token keyword module">default</span> <span class="token operator">=</span> module<span class="token punctuation">.</span><span class="token property-access">exports</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最后有个写法需要注意：<code>module.exports.default = module.exports;</code>，这里是为了兼容ESmodule，因为es6的模块<code>export default xxx</code>，在webpack中最后会变成类似于<code>exports.default = xxx</code>的形式，而<code>import ElementUI from \'element-ui\';</code>会变成<code>ElementUI = require(\'element-ui\').default</code>的形式，为了让ESmodule识别这种commonjs的写法，就需要加上default。</p>\n<p>exports对外暴露的install方法就是把Element组件注册会全局组件的方法。当我们使用<code>Vue.use</code>时，就会调用对外暴露的install方法。如果我们直接通过script的方式引入vue和Element，检测到Vue为全局变量时，也会调用install方法。</p>\n<pre class="language-html"><code class="language-html">// 使用方式1\n<span class="token comment">&lt;!-- import Vue before Element --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://unpkg.com/vue/dist/vue.js">https://unpkg.com/vue/dist/vue.js</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token comment">&lt;!-- import JavaScript --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://unpkg.com/element-ui/lib/index.js">https://unpkg.com/element-ui/lib/index.js</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n\n// 使用方式2\nimport Vue from \'vue\';\nimport ElementUI from \'element-ui\';\nimport \'element-ui/lib/theme-chalk/index.css\';\n\nVue.use(ElementUI); // 此时会调用ElementUI.install()\n\n</code></pre>\n<p>在module.exports对象中，除了暴露install方法外，还把所有组件进行了对外的暴露，方便引入单个组件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword module">import</span> <span class="token imports"><span class="token punctuation">{</span> <span class="token maybe-class-name">Button</span> <span class="token punctuation">}</span></span> <span class="token keyword module">from</span> <span class="token string">\'element-ui\'</span><span class="token punctuation">;</span>\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Button</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是如果你有进行按需加载，使用Element官方的babel-plugin-component插件，上面代码会转换成如下形式：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> _button <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/button\'</span><span class="token punctuation">)</span>\n<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/theme-chalk/button.css\'</span><span class="token punctuation">)</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span>_button<span class="token punctuation">)</span>\n</code></pre>\n<p>那么前面module.exports对外暴露的单组件好像也没什么用。\n不过这里使用<code>npm run build:file</code>生成文件的方式是可取的，因为在实际项目中，我们每新增一个组件，只需要修改components.json文件，然后使用<code>npm run build:file</code>重新生成代码就可以了，不需要手动去修改多个文件。</p>\n<p>在生成了入口文件的index.js之后就会运行webpack-dev-server。</p>\n<pre class="language-bash"><code class="language-bash">webpack-dev-server --config build/webpack.demo.js\n</code></pre>\n<p>接下来看下webpack.demo.js的入口文件：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// webpack.demo.js</span>\n<span class="token keyword">const</span> webpackConfig <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token string">\'./examples/entry.js\'</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./examples/element-ui/\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> process<span class="token punctuation">.</span><span class="token property-access">env</span><span class="token punctuation">.</span><span class="token constant">CI_ENV</span> <span class="token operator">||</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].[hash:7].js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> isProd <span class="token operator">?</span> <span class="token string">\'[name].[hash:7].js\'</span> <span class="token operator">:</span> <span class="token string">\'[name].js\'</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  resolve<span class="token operator">:</span> <span class="token punctuation">{</span>\n    extensions<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'.js\'</span><span class="token punctuation">,</span> <span class="token string">\'.vue\'</span><span class="token punctuation">,</span> <span class="token string">\'.json\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n    alias<span class="token operator">:</span> <span class="token punctuation">{</span>\n      main<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../src\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      packages<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../packages\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      examples<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../examples\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token string">\'element-ui\'</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    modules<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'node_modules\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n  <span class="token comment">// ... some other config</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// examples/entry.js</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Vue</span></span> <span class="token keyword module">from</span> <span class="token string">\'vue\'</span><span class="token punctuation">;</span>\n<span class="token keyword module">import</span> <span class="token imports"><span class="token maybe-class-name">Element</span></span> <span class="token keyword module">from</span> <span class="token string">\'main/index.js\'</span><span class="token punctuation">;</span>\n\n<span class="token maybe-class-name">Vue</span><span class="token punctuation">.</span><span class="token method function property-access">use</span><span class="token punctuation">(</span><span class="token maybe-class-name">Element</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<h2 id="%E6%96%B0%E5%BB%BA%E7%BB%84%E4%BB%B6">新建组件<a class="anchor" href="#%E6%96%B0%E5%BB%BA%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>entry.js就是直接引入的之前build:file中生成的index.js的Element的入口文件。因为这篇文章主要讲构建流程，所以不会仔细看demo的源码。下面看看Element如何新建一个组件，在Makefile可以看到使用<code>make new xxx</code>新建一个组件。。</p>\n<pre class="language-autoit"><code class="language-autoit">new<span class="token punctuation">:</span>\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>new<span class="token punctuation">.</span>js $<span class="token punctuation">(</span>filter<span class="token operator">-</span>out $@<span class="token punctuation">,</span>$<span class="token punctuation">(</span>MAKECMDGOALS<span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p>这后面的<code>$(filter-out $@,$(MAKECMDGOALS))</code>就是把命令行输入的参数直接传输给<code>node build/bin/new.js</code>，具体细节这里不展开，还是直接看看<code>build/bin/new.js</code>的具体细节。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 参数校验</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'[组件名]必填 - Please enter new component name\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'path\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> fileSave <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'file-save\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> uppercamelcase <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'uppercamelcase\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token comment">// 获取命令行的参数</span>\n<span class="token comment">// e.g. node new.js input 输入框 </span>\n<span class="token comment">// process.argv表示命令行的参数数组</span>\n<span class="token comment">// 0是node，1是new.js，2和3就是后面两个参数</span>\n<span class="token keyword">const</span> componentname <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 组件名</span>\n<span class="token keyword">const</span> chineseName <span class="token operator">=</span> process<span class="token punctuation">.</span><span class="token property-access">argv</span><span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span> <span class="token operator">||</span> componentname<span class="token punctuation">;</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">ComponentName</span> <span class="token operator">=</span> <span class="token function">uppercamelcase</span><span class="token punctuation">(</span>componentname<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 转成驼峰表示</span>\n<span class="token comment">// 组件所在的目录文件</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">PackagePath</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../../packages\'</span><span class="token punctuation">,</span> componentname<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 检查components.json中是否已经存在同名组件</span>\n<span class="token keyword">const</span> componentsFile <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>componentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 已存在.</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  process<span class="token punctuation">.</span><span class="token method function property-access">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// componentsFile中写入新的组件键值对</span>\ncomponentsFile<span class="token punctuation">[</span>componentname<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">./packages/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/index.js</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n<span class="token function">fileSave</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'../../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token known-class-name class-name">JSON</span><span class="token punctuation">.</span><span class="token method function property-access">stringify</span><span class="token punctuation">(</span>componentsFile<span class="token punctuation">,</span> <span class="token keyword null nil">null</span><span class="token punctuation">,</span> <span class="token string">\'  \'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  \n<span class="token keyword">const</span> <span class="token maybe-class-name">Files</span> <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">index.js相关模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span> \n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> <span class="token string">\'src/main.vue\'</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件相关的模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token comment">// 下面三个文件是的对应的中英文api文档</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/zh-CN\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>chineseName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/en-US\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../examples/docs/es\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.md</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">## </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  \n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../test/unit/specs\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.spec.js</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件相关测试用例的模板</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../packages/theme-chalk/src\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.scss</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件的样式文件</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">{</span>\n    filename<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token string">\'../../types\'</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.d.ts</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">组件的types文件，用于语法提示</span><span class="token template-punctuation string">`</span></span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n<span class="token comment">// 生成组件必要的文件</span>\n<span class="token maybe-class-name">Files</span><span class="token punctuation">.</span><span class="token method function property-access">forEach</span><span class="token punctuation">(</span><span class="token parameter">file</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token function">fileSave</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span><span class="token maybe-class-name">PackagePath</span><span class="token punctuation">,</span> file<span class="token punctuation">.</span><span class="token property-access">filename</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token property-access">content</span><span class="token punctuation">,</span> <span class="token string">\'utf8\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>这个脚本最终会在<code>components.json</code>写入组件相关的键值对，同时在packages目录创建对应的组件文件，并在<code>packages/theme-chalk/src</code>目录下创建一个样式文件，Element的样式是使用sass进行预编译的，所以生成是<code>.scss</code>文件。大致看下packages目录下生成的文件的模板：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n  content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  import </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> from \'./src/main\';\n\n  /* istanbul ignore next */\n  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.install = function(Vue) {\n    Vue.component(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.name, </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">);\n  };\n\n  export default </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">;\n  </span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n<span class="token punctuation">{</span>\n  filename<span class="token operator">:</span> <span class="token string">\'src/main.vue\'</span><span class="token punctuation">,</span>\n  content<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  &lt;template>\n    &lt;div class="el-</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>componentname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">">&lt;/div>\n  &lt;/template>\n\n  &lt;script>\n    export default {\n      name: \'El</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token maybe-class-name">ComponentName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\'\n    };\n  &lt;/script>\n  </span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>每个组件都会对外单独暴露一个install方法，因为Element支持按需加载。同时，每个组件名都会加上<code>El</code>前缀。，所以我们使用Element组件时，经常是这样的<code>el-xxx</code>，这符合W3C的自定义HTML标签的<a href="https://www.w3.org/TR/custom-elements/#concepts">规范</a>（小写，并且包含一个短杠）。</p>\n<h2 id="%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B">打包流程<a class="anchor" href="#%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B">§</a></h2>\n<p>由于现代前端的复杂环境，代码写好之后并不能直接使用，被拆成模块的代码，需要通过打包工具进行打包成一个单独的js文件。并且由于各种浏览器的兼容性问题，还需要把ES6语法转译为ES5，sass、less等css预编译语言需要经过编译生成浏览器真正能够运行的css文件。所以，当我们通过<code>npm run new component</code>新建一个组件，并通过<code>npm run dev</code>在本地调试好代码后，需要把进行打包操作，才能真正发布到npm上。</p>\n<p>这里运行<code>npm run dist</code>进行Element的打包操作，具体命令如下。</p>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"dist"</span><span class="token punctuation">:</span> "\n    npm run clean <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>file <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run lint <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>conf<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>common<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>component<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>utils <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>umd <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    npm run build<span class="token punctuation">:</span>theme\n"\n</code></pre>\n<p><img src="https://file.shenfq.com/18-9-14/30112392.jpg" alt="流程图"></p>\n<p>下面一步步拆解上述流程。</p>\n<h4 id="%E6%B8%85%E7%90%86%E6%96%87%E4%BB%B6">清理文件<a class="anchor" href="#%E6%B8%85%E7%90%86%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"clean"</span><span class="token punctuation">:</span> <span class="token string">"rimraf lib &amp;&amp; rimraf packages/*/lib &amp;&amp; rimraf test/**/coverage"</span>\n</code></pre>\n<p>使用<code>npm run clean</code>会删除之前打包生成的文件，这里直接使用了一个node包：rimraf，类似于linux下的<code>rm -rf</code>。</p>\n<h4 id="%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90">入口文件生成<a class="anchor" href="#%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6%E7%94%9F%E6%88%90">§</a></h4>\n<p><code>npm run build:file</code>在前面已经介绍过了，通过components.json生成入口文件。</p>\n<h4 id="%E4%BB%A3%E7%A0%81%E6%A3%80%E6%9F%A5">代码检查<a class="anchor" href="#%E4%BB%A3%E7%A0%81%E6%A3%80%E6%9F%A5">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"lint"</span><span class="token punctuation">:</span> <span class="token string">"eslint src/**/* test/**/* packages/**/* build/**/* --quiet"</span>\n</code></pre>\n<p>使用ESLint对多个目录下的文件进行lint操作。</p>\n<h4 id="%E6%96%87%E4%BB%B6%E6%89%93%E5%8C%85">文件打包<a class="anchor" href="#%E6%96%87%E4%BB%B6%E6%89%93%E5%8C%85">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">webpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>conf<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \nwebpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>common<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \nwebpack <span class="token operator">-</span><span class="token operator">-</span>config build<span class="token operator">/</span>webpack<span class="token punctuation">.</span>component<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n</code></pre>\n<p>这里直接使用原生webpack进行打包操作，webpack版本为：3.7.1。在Element@2.4.0之前，使用的打包工具为<a href="https://github.com/ElemeFE/cooking/blob/master/README_zh-cn.md"><code>cooking</code></a>，但是这个工具是基于webpack2，很久没有更新（ps. 项目中能使用webpack最好使用webpack，多阅读官网的文档，虽然文档很烂，其他第三方对webpack进行包装的构建工具，很容易突然就不更新了，到时候要迁移会很麻烦）。</p>\n<p>这三个配置文件的配置基本类似，区别在entry和output。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// webpack.conf.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'./src/index.js\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'index.js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'umd\'</span><span class="token punctuation">,</span>\n    library<span class="token operator">:</span> <span class="token string">\'ELEMENT\'</span><span class="token punctuation">,</span>\n    umdNamedDefine<span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// webpack.common.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token punctuation">{</span>\n    app<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'./src/index.js\'</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'element-ui.common.js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'commonjs2\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// webpack.component.js</span>\n<span class="token keyword">const</span> <span class="token maybe-class-name">Components</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'../components.json\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  entry<span class="token operator">:</span> <span class="token maybe-class-name">Components</span><span class="token punctuation">,</span>\n  output<span class="token operator">:</span> <span class="token punctuation">{</span>\n    path<span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token method function property-access">resolve</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token method function property-access">cwd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    publicPath<span class="token operator">:</span> <span class="token string">\'/dist/\'</span><span class="token punctuation">,</span>\n    filename<span class="token operator">:</span> <span class="token string">\'[name].js\'</span><span class="token punctuation">,</span>\n    chunkFilename<span class="token operator">:</span> <span class="token string">\'[id].js\'</span><span class="token punctuation">,</span>\n    libraryTarget<span class="token operator">:</span> <span class="token string">\'commonjs2\'</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>webpack.conf.js 与 webpack.common.js打包的入口文件都是<code>src/index.js</code>，该文件通过<code>npm run build:file</code>生成。不同之处在于输出文件，两个配置生成的js都在lib目录，重点在于libraryTarget，一个是umd，一个是commonjs2。还一个 webpack.component.js 的入口文件为 components.json 中的所有组件，表示packages目录下的所有组件都会在lib文件夹下生成也单独的js文件，这些组件单独的js文件就是用来做按需加载的，如果需要哪个组件，就会单独import这个组件js。</p>\n<p>当我们直接在代码中引入整个Element的时候，加载的是 webpack.common.js 打包生成的 element-ui.common.js 文件。因为我们引入npm包的时候，会根据package.json中的main字段来查找入口文件。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// package.json</span>\n<span class="token string">"main"</span><span class="token operator">:</span> <span class="token string">"lib/element-ui.common.js"</span>\n</code></pre>\n<h4 id="%E8%BD%AC%E8%AF%91%E5%B7%A5%E5%85%B7%E6%96%B9%E6%B3%95">转译工具方法<a class="anchor" href="#%E8%BD%AC%E8%AF%91%E5%B7%A5%E5%85%B7%E6%96%B9%E6%B3%95">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"build:utils"</span><span class="token punctuation">:</span> <span class="token string">"cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js"</span><span class="token punctuation">,</span>\n</code></pre>\n<p>这一部分是吧src目录下的除了index.js入口文件外的其他文件通过babel转译，然后移动到lib文件夹下。</p>\n<pre class="language-autoit"><code class="language-autoit">└─src\n    ├─directives\n    ├─locale\n    ├─mixins\n    ├─transitions\n    ├─popup\n    └─index<span class="token punctuation">.</span>js\n</code></pre>\n<p>在src目录下，除了index.js外，还有一些其他文件夹，这些是Element组件中经常使用的工具方法。如果你对Element的源码足够熟悉，可以直接把Element中一些工具方法拿来使用，不再需要安装其他的包。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> date <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'element-ui/lib/utils/date\'</span><span class="token punctuation">)</span>\n\ndate<span class="token punctuation">.</span><span class="token method function property-access">format</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">,</span> <span class="token string">\'HH:mm:ss\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E7%94%9F%E6%88%90%E6%A0%B7%E5%BC%8F%E6%96%87%E4%BB%B6">生成样式文件<a class="anchor" href="#%E7%94%9F%E6%88%90%E6%A0%B7%E5%BC%8F%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit"><span class="token string">"build:theme"</span><span class="token punctuation">:</span> "\n  node build<span class="token operator">/</span>bin<span class="token operator">/</span>gen<span class="token operator">-</span>cssfile <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n  gulp build <span class="token operator">-</span><span class="token operator">-</span>gulpfile packages<span class="token operator">/</span>theme<span class="token operator">-</span>chalk<span class="token operator">/</span>gulpfile<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n  cp<span class="token operator">-</span>cli packages<span class="token operator">/</span>theme<span class="token operator">-</span>chalk<span class="token operator">/</span>lib lib<span class="token operator">/</span>theme<span class="token operator">-</span>chalk\n"\n</code></pre>\n<p>这里直接使用gulp将scss文件转为css文件。</p>\n<pre class="language-javascript"><code class="language-javascript">gulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./src/*.scss\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>sass<span class="token punctuation">.</span><span class="token method function property-access">sync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">autoprefixer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      browsers<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">\'ie > 9\'</span><span class="token punctuation">,</span> <span class="token string">\'last 2 versions\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      cascade<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">cssmin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./lib\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>最终我们引入的<code>element-ui/lib/theme-chalk/index.css</code>，其源文件只不过是把所有组件的scss文件进行import。这个index.scss是在运行gulp之前，通过<code>node build/bin/gen-cssfile</code>命令生成的，逻辑与生成js的入口文件类似，同样是遍历components.json。</p>\n<p><img src="https://file.shenfq.com/18-9-16/48946057.jpg" alt="index.scss"></p>\n<h2 id="%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B">发布流程<a class="anchor" href="#%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B">§</a></h2>\n<p>代码经过之前的编译，就到了发布流程，在Element中发布主要是用shell脚本实现的。Element发布一共涉及三个部分。</p>\n<ol>\n<li>git发布</li>\n<li>npm发布</li>\n<li>官网发布</li>\n</ol>\n<pre class="language-autoit"><code class="language-autoit"><span class="token operator">/</span><span class="token operator">/</span> 新版本发布\n<span class="token string">"pub"</span><span class="token punctuation">:</span> "\n    npm run bootstrap <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>git<span class="token operator">-</span>release<span class="token punctuation">.</span>sh <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>release<span class="token punctuation">.</span>sh <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    node build<span class="token operator">/</span>bin<span class="token operator">/</span>gen<span class="token operator">-</span>indices<span class="token punctuation">.</span>js <span class="token operator">&amp;</span><span class="token operator">&amp;</span> \n    sh build<span class="token operator">/</span>deploy<span class="token operator">-</span>faas<span class="token punctuation">.</span>sh\n"\n</code></pre>\n<h4 id="git%E5%86%B2%E7%AA%81%E6%A3%80%E6%B5%8B">git冲突检测<a class="anchor" href="#git%E5%86%B2%E7%AA%81%E6%A3%80%E6%B5%8B">§</a></h4>\n<p>运行 <a href="http://git-release.sh">git-release.sh</a> 进行git冲突的检测，这里主要是检测dev分支是否冲突，因为Element是在dev分支进行开发的（这个才Element官方的开发指南也有提到），只有在最后发布时，才merge到master。</p>\n<p><img src="https://file.shenfq.com/18-9-16/41638093.jpg" alt="开发指南"></p>\n<pre class="language-bash"><code class="language-bash"><span class="token shebang important">#!/usr/bin/env sh</span>\n<span class="token comment"># 切换至dev分支</span>\n<span class="token function">git</span> checkout dev\n\n<span class="token comment"># 检测本地和暂存区是否还有未提交的文件</span>\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> -n <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> status --porcelain<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'Unclean working tree. Commit or stash changes first.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n<span class="token comment"># 检测本地分支是否有误</span>\n<span class="token keyword">if</span> <span class="token operator">!</span> <span class="token function">git</span> fetch --quiet <span class="token operator"><span class="token file-descriptor important">2</span>></span>/dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'There was a problem fetching your branch. Run <span class="token variable"><span class="token variable">`</span><span class="token function">git</span> fetch<span class="token variable">`</span></span> to see more...\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n<span class="token comment"># 检测本地分支是否落后远程分支</span>\n<span class="token keyword">if</span> <span class="token builtin class-name">test</span> <span class="token string">"0"</span> <span class="token operator">!=</span> <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> rev-list --count --left-only @<span class="token string">\'{u}\'</span><span class="token punctuation">..</span>.HEAD<span class="token variable">)</span></span>"</span><span class="token punctuation">;</span> <span class="token keyword">then</span>\n  <span class="token builtin class-name">echo</span> <span class="token string">\'Remote history differ. Please pull changes.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n  <span class="token builtin class-name">exit</span> <span class="token number">128</span><span class="token punctuation">;</span>\n<span class="token keyword">fi</span>\n\n<span class="token builtin class-name">echo</span> <span class="token string">\'No conflicts.\'</span> <span class="token operator">></span><span class="token file-descriptor important">&amp;2</span><span class="token punctuation">;</span>\n</code></pre>\n<h4 id="git%E5%8F%91%E5%B8%83npm%E5%8F%91%E5%B8%83">git发布；npm发布<a class="anchor" href="#git%E5%8F%91%E5%B8%83npm%E5%8F%91%E5%B8%83">§</a></h4>\n<p>检测到git在dev分支上没有冲突后，<a href="http://xn--release-zx2ll52i774ctb5a.sh">立即执行release.sh</a>。</p>\n<p><img src="https://file.shenfq.com/18-9-17/55012829.jpg" alt="发布"></p>\n<p>这一部分代码比较简单，可以直接在<a href="https://github.com/ElemeFE/element/blob/dev/build/release.sh">github</a>上查看。上述发布流程，省略了一个部分，就是Element会将其样式也发布到<a href="https://www.npmjs.com/package/element-theme-chalk">npm</a>上。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># publish theme</span>\n<span class="token builtin class-name">echo</span> <span class="token string">"Releasing theme-chalk <span class="token variable">$VERSION</span> ..."</span>\n<span class="token builtin class-name">cd</span> packages/theme-chalk\n<span class="token function">npm</span> version <span class="token variable">$VERSION</span> --message <span class="token string">"[release] <span class="token variable">$VERSION</span>"</span>\n<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token variable">$VERSION</span> <span class="token operator">=</span>~ <span class="token string">"beta"</span> <span class="token punctuation">]</span><span class="token punctuation">]</span>\n<span class="token keyword">then</span>\n  <span class="token function">npm</span> publish --tag beta\n<span class="token keyword">else</span>\n  <span class="token function">npm</span> publish\n<span class="token keyword">fi</span>\n</code></pre>\n<p>如果你只想使用Element的样式，不使用它的Vue组件，你也可以直接在npm上下载他们的样式，不过一般也没人这么做吧。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> -S element-theme-chalk\n</code></pre>\n<h4 id="%E5%AE%98%E7%BD%91%E6%9B%B4%E6%96%B0">官网更新<a class="anchor" href="#%E5%AE%98%E7%BD%91%E6%9B%B4%E6%96%B0">§</a></h4>\n<p>这一步就不详细说了，因为不在文章想说的构建流程之列。</p>\n<p>大致就是将静态资源生成到<code>examples/element-ui</code>目录下，然后放到<code>gh-pages</code>分支，这样就能通过github pages的方式访问。不信，你访问试试。</p>\n<blockquote>\n<p><a href="http://elemefe.github.io/element">http://elemefe.github.io/element</a></p>\n</blockquote>\n<p>同时在该分支下，写入了CNAME文件，这样访问<a href="element.eleme.io">element.eleme.io</a>也能定向到element的github pages了。</p>\n<pre class="language-autoit"><code class="language-autoit">echo element<span class="token punctuation">.</span>eleme<span class="token punctuation">.</span>io<span class="token operator">></span><span class="token operator">></span>examples<span class="token operator">/</span>element<span class="token operator">-</span>ui<span class="token operator">/</span>CNAME\n</code></pre>\n<p><img src="https://file.shenfq.com/18-9-17/84798170.jpg" alt="域名重定向"></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>Element的代码总体看下来，还是十分流畅的，对自己做组件化帮助很大。刚开始写这篇文章的时候，标题写着<code>主流组件库的构建流程</code>，想把Element和antd的构建流程都写出来，写完Element才发现这个坑开得好大，于是麻溜的把标题改成<code>Element的构建流程</code>。当然Element除了其构建流程，本身很多组件的实现思路也很优雅，大家感兴趣可以去看一看。</p>'
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#%E8%83%8C%E6%99%AF">背景</a></li><li><a href="#element%E7%9A%84%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84">Element的目录结构</a></li><li><a href="#%E6%9C%89%E5%93%AA%E4%BA%9B%E6%9E%84%E5%BB%BA%E5%91%BD%E4%BB%A4">有哪些构建命令</a></li><li><a href="#%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9E%84%E5%BB%BA%E5%85%A5%E5%8F%A3%E6%96%87%E4%BB%B6">开发模式与构建入口文件</a></li><li><a href="#%E6%96%B0%E5%BB%BA%E7%BB%84%E4%BB%B6">新建组件</a></li><li><a href="#%E6%89%93%E5%8C%85%E6%B5%81%E7%A8%8B">打包流程</a><ol></ol></li><li><a href="#%E5%8F%91%E5%B8%83%E6%B5%81%E7%A8%8B">发布流程</a><ol></ol></li><li><a href="#%E6%80%BB%E7%BB%93">总结</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2018/09/17",
    'updated': null,
    'excerpt': "背景 最近一直在着手做一个与业务强相关的组件库，一直在思考要从哪里下手，怎么来设计这个组件库，因为业务上一直在使用ElementUI（以下简称Element），于是想参考了一下Element组件库的设计，看看Element构建方式，并且总结成...",
    'cover': "https://file.shenfq.com/18-9-14/48784910.jpg",
    'categories': [
        "前端"
    ],
    'tags': [
        "前端",
        "组件化",
        "工程化"
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
                "pagePath": "posts/2020/Node.js 服务性能翻倍的秘密（二）.md",
                "title": "Node.js 服务性能翻倍的秘密（二）",
                "link": "posts/2020/Node.js 服务性能翻倍的秘密（二）.html",
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
                "excerpt": "前言 前一篇文章介绍了 fastify 通过 schema 来序列化 JSON，为 Node.js 服务提升性能的方法。今天的文章会介绍 fastify 使用的路由库，翻阅其源码（lib/route.js）可以发现，fastify 的路由库并不是内置的，而是使用了一个叫做...",
                "cover": "https://file.shenfq.com/pic/20201218150431.png"
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
                "name": "fastify",
                "count": 2
            },
            {
                "name": "JSON",
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
