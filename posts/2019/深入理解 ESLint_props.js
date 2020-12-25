import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig },
    'pagePath': "posts/2019/深入理解 ESLint.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/深入理解 ESLint.html",
    'title': "深入理解 ESLint",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>深入理解 ESLint</h1>\n<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>小沈是一个刚刚开始工作的前端实习生，第一次进行团队开发，难免有些紧张。在导师的安排下，拿到了项目的 git 权限，开始进行 clone。</p>\n<pre class="language-autoit"><code class="language-autoit">$ git clone git<span class="token variable">@github</span><span class="token punctuation">.</span>com<span class="token punctuation">:</span>company<span class="token operator">/</span>project<span class="token punctuation">.</span>git\n</code></pre>\n<p>小沈开始细细品味着同事们的代码，终于在他的不懈努力下，发现了老王 2 年前写的一个 bug，跟导师报备之后，小沈开始着手修改。年轻人嘛，容易冲动，不仅修复了老王的 bug，还把这部分代码进行了重构，使用了前两天刚刚从书里学会的策略模式，去掉了一些不必要 if else 逻辑。小沈潇洒的摸了摸自己稀疏的头发，得意的准备提交代码，想着第一天刚来就秀了下自己的超强的编码能力。接下来可怕的事情发生了，代码死活不能通过 lint 工具的检测，急得他面红耳赤，赶紧跑去问导师，导师告诉他，只要按照控制台的 warning 修改代码就好。小沈反驳道，这个 lint 工具非让我去掉分号，我在学校的时候，老师就教我分号是必不可少的，没有分号的代码是不完美的。导师无奈的笑了笑，打开了小沈的实习评分表，在团队合作一项中勾选『较差』。</p>\n<p>不服气的小沈，写了一篇博客发布到了 CSDN 上，还收获了不少阅读量。</p>\n<p><img src="https://file.shenfq.com/20190727153755.png" alt="image"></p>\n<h4 id="%E9%97%AE%E5%B7%A5%E4%BD%9C%E7%AC%AC%E4%B8%80%E5%A4%A9%E5%B0%8F%E6%B2%88%E7%8A%AF%E4%BA%86%E5%93%AA%E4%BA%9B%E9%94%99%E8%AF%AF">问：工作第一天小沈犯了哪些错误？<a class="anchor" href="#%E9%97%AE%E5%B7%A5%E4%BD%9C%E7%AC%AC%E4%B8%80%E5%A4%A9%E5%B0%8F%E6%B2%88%E7%8A%AF%E4%BA%86%E5%93%AA%E4%BA%9B%E9%94%99%E8%AF%AF">§</a></h4>\n<ol>\n<li>对不了解的业务代码进行重构，这是业务开发的大忌；</li>\n<li>没有遵守团队规范，团队开发带有太强的个人情绪；</li>\n<li>上面都是我编的，听说现在写文章开头都要编个故事。</li>\n</ol>\n<h2 id="lint-%E5%B7%A5%E5%85%B7%E7%AE%80%E5%8F%B2">lint 工具简史<a class="anchor" href="#lint-%E5%B7%A5%E5%85%B7%E7%AE%80%E5%8F%B2">§</a></h2>\n<blockquote>\n<p>在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。    -- by wikipedia</p>\n</blockquote>\n<p>在 JavaScript 20 多年的发展历程中，也出现过许许多多的 lint 工具，下面就来介绍下主流的三款 lint 工具。</p>\n<ol>\n<li>JSLint</li>\n<li>JSHint</li>\n<li>ESLint</li>\n</ol>\n<p><img src="https://file.shenfq.com/2019-7-27-15-40-6.comywsres26205WEBRESOURCE0bbfb328d288ee97233c5811224582f8" alt="image"></p>\n<h3 id="jslint"><a href="http://www.jslint.com/">JSLint</a><a class="anchor" href="#jslint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153752.png" alt="JSLint logo"></p>\n<p>JSLint 可以说是最早出现的 JavaScript 的 lint 工具，由 Douglas Crockford (《JavaScript 语言精粹》作者) 开发。从《JavaScript 语言精粹》的笔风就能看出，Douglas 是个眼里容不得瑕疵的人，所以 JSLint 也继承了这个特色，JSLint 的所有规则都是由 Douglas 自己定义的，可以说这是一个极具 Douglas 个人风格的 lint 工具，如果你要使用它，就必须接受它所有规则。值得称赞的是，JSLint 依然在更新，而且也提供了 node 版本：<a href="https://www.npmjs.com/package/jslint">node-jslint</a>。</p>\n<h3 id="jshint"><a href="https://jshint.com/">JSHint</a><a class="anchor" href="#jshint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153753.png" alt="JSHint logo"></p>\n<p>由于 JSLint 让很多人无法忍受它的规则，感觉受到了压迫，所以 Anton Kovalyov (现在在 Medium 工作) 基于 JSLint 开发了 JSHint。JSHint 在 JSLint 的基础上提供了丰富的配置项，给了开发者极大的自由，JSHint 一开始就保持着开源软件的风格，由社区进行驱动，发展十分迅速。早起 jQuery 也是使用 JSHint 进行代码检查的，不过现在已经转移到 ESLint 了。</p>\n<h3 id="eslint"><a href="https://cn.eslint.org/">ESLint</a><a class="anchor" href="#eslint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153754.png" alt="ESLint logo"></p>\n<p>ESLint 由 Nicholas C. Zakas (《JavaScript 高级程序设计》作者) 于2013年6月创建，它的出现因为 Zakas 想使用 JSHint 添加一条自定义的规则，但是发现 JSHint 不支持，于是自己开发了一个。</p>\n<p>ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。</p>\n<p><a href="https://github.com/eslint/eslint/blob/v0.0.2/lib/jscheck.js#L70">早期源码</a>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> ast <span class="token operator">=</span> esprima<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>text<span class="token punctuation">,</span> <span class="token punctuation">{</span> loc<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> range<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    walk <span class="token operator">=</span> <span class="token function">astw</span><span class="token punctuation">(</span>ast<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">walk</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    api<span class="token punctuation">.</span><span class="token method function property-access">emit</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword control-flow">return</span> messages<span class="token punctuation">;</span>\n</code></pre>\n<p>但是，那个时候 ESLint 并没有大火，因为需要将源代码转成 AST，运行速度上输给了 JSHint ，并且 JSHint 当时已经有完善的生态（编辑器的支持）。真正让 ESLint 大火是因为 ES6 的出现。</p>\n<p>ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让ESLint 成为最快支持 ES6 语法的 lint 工具。</p>\n<p><img src="https://file.shenfq.com/20190727153757.png" alt="谷歌趋势"></p>\n<p>在 2016 年，ESLint整合了与它同时诞生的另一个 lint 工具：JSCS，因为它与 ESLint 具有异曲同工之妙，都是通过生成 AST 的方式进行规则检测。</p>\n<p><img src="https://file.shenfq.com/20190727153756.png" alt="ESLint整合JSCS"></p>\n<p>自此，ESLint 在 JS Linter 领域一统江湖，成为前端界的主流工具。</p>\n<h2 id="lint-%E5%B7%A5%E5%85%B7%E7%9A%84%E6%84%8F%E4%B9%89">Lint 工具的意义<a class="anchor" href="#lint-%E5%B7%A5%E5%85%B7%E7%9A%84%E6%84%8F%E4%B9%89">§</a></h2>\n<p>下面一起来思考一个问题：Lint 工具对工程师来说到底是代码质量的保证还是一种束缚？</p>\n<p>然后，我们再看看 ESLint 官网的简介：</p>\n<blockquote>\n<p>代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。</p>\n</blockquote>\n<blockquote>\n<p>JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。</p>\n</blockquote>\n<p>因为 JavaScript 这门神奇的语言，在带给我们灵活性的同时，也埋下了一些坑。比如 <code>==</code> 涉及到的弱类型转换，着实让人很苦恼，还有 <code>this</code> 的指向，也是一个让人迷惑的东西。而 Lint 工具就很好的解决了这个问题，干脆禁止你使用 <code>==</code> ，这种做法虽然限制了语言的灵活性，但是带来的收益也是可观的。</p>\n<p>还有就是作为一门动态语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行才发现，这给我们调试工作增加了一些负担，而 Lint 工具相当于为语言增加了编译过程，在代码运行前进行静态分析找到出错的地方。</p>\n<p>所以汇总一下，Lint工具的优势：</p>\n<h4 id="1-%E9%81%BF%E5%85%8D%E4%BD%8E%E7%BA%A7bug%E6%89%BE%E5%87%BA%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%E7%9A%84%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF">1. 避免低级bug，找出可能发生的语法错误<a class="anchor" href="#1-%E9%81%BF%E5%85%8D%E4%BD%8E%E7%BA%A7bug%E6%89%BE%E5%87%BA%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%E7%9A%84%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF">§</a></h4>\n<blockquote>\n<p>使用未声明变量、修改 const 变量……</p>\n</blockquote>\n<h4 id="2-%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E7%9A%84%E4%BB%A3%E7%A0%81">2. 提示删除多余的代码<a class="anchor" href="#2-%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E7%9A%84%E4%BB%A3%E7%A0%81">§</a></h4>\n<blockquote>\n<p>声明而未使用的变量、重复的 case ……</p>\n</blockquote>\n<h4 id="3-%E7%A1%AE%E4%BF%9D%E4%BB%A3%E7%A0%81%E9%81%B5%E5%BE%AA%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5">3. 确保代码遵循最佳实践<a class="anchor" href="#3-%E7%A1%AE%E4%BF%9D%E4%BB%A3%E7%A0%81%E9%81%B5%E5%BE%AA%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5">§</a></h4>\n<blockquote>\n<p>可参考 <a href="https://github.com/airbnb/javascript">airbnb style</a>、<a href="https://github.com/standard/standard">javascript standard</a></p>\n</blockquote>\n<h4 id="4-%E7%BB%9F%E4%B8%80%E5%9B%A2%E9%98%9F%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC">4. 统一团队的代码风格<a class="anchor" href="#4-%E7%BB%9F%E4%B8%80%E5%9B%A2%E9%98%9F%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC">§</a></h4>\n<blockquote>\n<p>加不加分号？使用 tab 还是空格？</p>\n</blockquote>\n<h2 id="%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F">使用方式<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F">§</a></h2>\n<p>说了那么多，还是来看下有点实际意义的，ESLint 到底是如何使用的。</p>\n<h3 id="%E5%88%9D%E5%A7%8B%E5%8C%96">初始化<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96">§</a></h3>\n<p>如果想在现有项目中引入 ESLint，可以直接运行下面的命令：</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 全局安装 ESLint</span>\n$ <span class="token function">npm</span> <span class="token function">install</span> -g eslint\n\n<span class="token comment"># 进入项目</span>\n$ <span class="token builtin class-name">cd</span> ~/Code/ESLint-demo\n\n<span class="token comment"># 初始化 package.json</span>\n$ <span class="token function">npm</span> init -f\n\n<span class="token comment"># 初始化 ESLint 配置</span>\n$ eslint --init\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153759.png" alt="image"></p>\n<p>在使用 <code>eslint --init</code> 后，会出现很多用户配置项，具体可以参考：<a href="https://github.com/eslint/eslint/blob/v6.0.1/lib/init/config-initializer.js#L432">eslint cli 部分的源码</a>。</p>\n<p>经过一系列一问一答的环节后，你会发现在你文件夹的根目录生成了一个 <code>.eslintrc.js</code> 文件。</p>\n<p><img src="https://file.shenfq.com/20190727153800.png" alt="image"></p>\n<h3 id="%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F">配置方式<a class="anchor" href="#%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F">§</a></h3>\n<p>ESLint 一共有两种配置方式：</p>\n<h4 id="1-%E4%BD%BF%E7%94%A8%E6%B3%A8%E9%87%8A%E6%8A%8A-lint-%E8%A7%84%E5%88%99%E7%9B%B4%E6%8E%A5%E5%B5%8C%E5%85%A5%E5%88%B0%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD">1. 使用注释把 lint 规则直接嵌入到源代码中<a class="anchor" href="#1-%E4%BD%BF%E7%94%A8%E6%B3%A8%E9%87%8A%E6%8A%8A-lint-%E8%A7%84%E5%88%99%E7%9B%B4%E6%8E%A5%E5%B5%8C%E5%85%A5%E5%88%B0%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD">§</a></h4>\n<p>这是最简单粗暴的方式，直接在源代码中使用 ESLint 能够识别的注释方式，进行 lint 规则的定义。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* eslint eqeqeq: "error" */</span>\n<span class="token keyword">var</span> num <span class="token operator">=</span> <span class="token number">1</span>\nnum <span class="token operator">==</span> <span class="token string">\'1\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153758.png" alt="image"></p>\n<p>当然我们一般使用注释是为了临时禁止某些严格的 lint 规则出现的警告：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* eslint-disable */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'该注释放在文件顶部，整个文件都不会出现 lint 警告\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-enable */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'重新启用 lint 告警\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-disable eqeqeq */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'只禁止某一个或多个规则\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-disable-next-line */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前行禁止 lint 警告\'</span><span class="token punctuation">)</span>\n\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前行禁止 lint 警告\'</span><span class="token punctuation">)</span> <span class="token comment">// eslint-disable-line</span>\n</code></pre>\n<h4 id="2-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E8%BF%9B%E8%A1%8C-lint-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE">2. 使用配置文件进行 lint 规则配置<a class="anchor" href="#2-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E8%BF%9B%E8%A1%8C-lint-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>在初始化过程中，有一个选项就是使用什么文件类型进行 lint 配置（<code>What format do you want your config file to be in?</code>）：</p>\n<pre class="language-autoit"><code class="language-autoit">{\n    type<span class="token punctuation">:</span> <span class="token string">"list"</span><span class="token punctuation">,</span>\n    name<span class="token punctuation">:</span> <span class="token string">"format"</span><span class="token punctuation">,</span>\n    message<span class="token punctuation">:</span> <span class="token string">"What format do you want your config file to be in?"</span><span class="token punctuation">,</span>\n    <span class="token keyword">default</span><span class="token punctuation">:</span> <span class="token string">"JavaScript"</span><span class="token punctuation">,</span>\n    choices<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"JavaScript"</span><span class="token punctuation">,</span> <span class="token string">"YAML"</span><span class="token punctuation">,</span> <span class="token string">"JSON"</span><span class="token punctuation">]</span>\n}\n</code></pre>\n<p>官方一共提供了三个选项：</p>\n<ol>\n<li>JavaScript (eslintrc.js)</li>\n<li>YAML (eslintrc.yaml)</li>\n<li>JSON (eslintrc.json)</li>\n</ol>\n<p>另外，你也可以自己在 <code>package.json</code> 文件中添加 <code>eslintConfig</code> 字段进行配置。</p>\n<p>翻阅 ESLint <a href="https://github.com/eslint/eslint/blob/v6.0.1/lib/cli-engine/config-array-factory.js#L52">源码</a>可以看到，其配置文件的优先级如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> configFilenames <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token string">".eslintrc.js"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.yaml"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.yml"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.json"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc"</span><span class="token punctuation">,</span>\n  <span class="token string">"package.json"</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre>\n<pre class="language-autoit"><code class="language-autoit"><span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>js <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>yaml  <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>yml <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>json <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc <span class="token operator">></span> package<span class="token punctuation">.</span>json\n</code></pre>\n<p>当然你也可以使用 cli 自己指定配置文件路径：</p>\n<p><img src="https://file.shenfq.com/20190727153813.png" alt="image"></p>\n<h4 id="%E9%A1%B9%E7%9B%AE%E7%BA%A7%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BA%A7%E7%9A%84%E9%85%8D%E7%BD%AE">项目级与目录级的配置<a class="anchor" href="#%E9%A1%B9%E7%9B%AE%E7%BA%A7%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BA%A7%E7%9A%84%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>我们有如下目录结构，此时在根目录运行 ESLint，那么我们将得到两个配置文件 <code>.eslintrc.js</code>（项目级配置） 和 <code>src/.eslintrc.js</code>（目录级配置），这两个配置文件会进行合并，但是 <code>src/.eslintrc.js</code> 具有更高的优先级。</p>\n<p><img src="https://file.shenfq.com/20190727153810.png" alt="目录结构"></p>\n<p>但是，我们只要在 <code>src/.eslintrc.js</code> 中配置 <code>&quot;root&quot;: true</code>，那么 ESLint 就会认为 <code>src</code> 目录为根目录，不再向上查找配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"root"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0">配置参数<a class="anchor" href="#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0">§</a></h3>\n<p>下面我们一起来细细品味 ESLinte 的配置规则。</p>\n<h4 id="%E8%A7%A3%E6%9E%90%E5%99%A8%E9%85%8D%E7%BD%AE">解析器配置<a class="anchor" href="#%E8%A7%A3%E6%9E%90%E5%99%A8%E9%85%8D%E7%BD%AE">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token comment">// 解析器类型</span>\n  <span class="token comment">// espima(默认), babel-eslint, @typescript-eslint/parse</span>\n  <span class="token string">"parse"</span><span class="token operator">:</span> <span class="token string">"esprima"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 解析器配置参数</span>\n  <span class="token string">"parseOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 代码类型：script(默认), module</span>\n    <span class="token string">"sourceType"</span><span class="token operator">:</span> <span class="token string">"script"</span><span class="token punctuation">,</span>\n    <span class="token comment">// es 版本号，默认为 5，也可以是用年份，比如 2015 (同 6)</span>\n    <span class="token string">"ecamVersion"</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span>\n    <span class="token comment">// es 特性配置</span>\n    <span class="token string">"ecmaFeatures"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"globalReturn"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 允许在全局作用域下使用 return 语句</span>\n        <span class="token string">"impliedStrict"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 启用全局 strict mode </span>\n        <span class="token string">"jsx"</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token comment">// 启用 JSX</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>对于 <code>@typescript-eslint/parse</code> 这个解析器，主要是为了替代之前存在的 TSLint，TS 团队因为 ESLint 生态的繁荣，且 ESLint 具有更多的配置项，不得不抛弃 TSLint 转而实现一个 ESLint 的解析器。同时，该解析器拥有<a href="https://www.npmjs.com/package/@typescript-eslint/parser#configuration">不同的配置</a>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"parserOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"ecmaFeatures"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"jsx"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"useJSXTextNode"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"project"</span><span class="token operator">:</span> <span class="token string">"./tsconfig.json"</span><span class="token punctuation">,</span>\n    <span class="token string">"tsconfigRootDir"</span><span class="token operator">:</span> <span class="token string">"../../"</span><span class="token punctuation">,</span>\n    <span class="token string">"extraFileExtensions"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">".vue"</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F">环境与全局变量<a class="anchor" href="#%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F">§</a></h4>\n<p>ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"globals"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 声明 jQuery 对象为全局变量</span>\n    <span class="token string">"$"</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token comment">// true表示该变量为 writeable，而 false 表示 readonly</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>globals</code> 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 <code>env</code> ，这是对一个环境定义的一组全局变量的预设（类似于 babel 的 presets）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"amd"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"commonjs"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"jquery"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可选的环境很多，预设值都在<a href="https://github.com/eslint/eslint/blob/v6.0.1/conf/environments.js">这个文件</a>中进行定义，查看源码可以发现，其预设变量都引用自 <a href="https://github.com/sindresorhus/globals/blob/master/globals.json"><code>globals</code></a> 包。</p>\n<p><img src="https://file.shenfq.com/20190727153811.png" alt="env"></p>\n<p><img src="https://file.shenfq.com/20190727153809.png" alt="env"></p>\n<h3 id="%E8%A7%84%E5%88%99%E8%AE%BE%E7%BD%AE">规则设置<a class="anchor" href="#%E8%A7%84%E5%88%99%E8%AE%BE%E7%BD%AE">§</a></h3>\n<p>ESLint 附带有<a href="https://cn.eslint.org/docs/rules/">大量的规则</a>，你可以在配置文件的 <code>rules</code> 属性中配置你想要的规则。每一条规则接受一个参数，参数的值如下：</p>\n<ul>\n<li>&quot;off&quot; 或 0：关闭规则</li>\n<li>&quot;warn&quot; 或 1：开启规则，warn 级别的错误 (不会导致程序退出)</li>\n<li>&quot;error&quot; 或 2：开启规则，error级别的错误(当被触发的时候，程序会退出)</li>\n</ul>\n<p>举个例子，我们先写一段使用了平等(equality)的代码，然后对 <code>eqeqeq</code> 规则分别进行不同的配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// demo.js</span>\n<span class="token keyword">var</span> num <span class="token operator">=</span> <span class="token number">1</span>\nnum <span class="token operator">==</span> <span class="token string">\'1\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153814.png" alt="eqeqeq 规则校验"></p>\n<p>这里使用了命令行的配置方式，如果你只想对单个文件进行某个规则的校验就可以使用这种方式。</p>\n<p>但是，事情往往没有我们想象中那么简单，ESLint 的规则不仅只有关闭和开启这么简单，每一条规则还有自己的配置项。如果需要对某个规则进行配置，就需要使用数组形式的参数。</p>\n<p>我们看下 <code>quotes</code> 规则，根据官网介绍，它支持字符串和对象两个配置项。</p>\n<p><img src="https://file.shenfq.com/20190727153812.png" alt="quotes"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"rules"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 使用数组形式，对规则进行配置</span>\n    <span class="token comment">// 第一个参数为是否启用规则</span>\n    <span class="token comment">// 后面的参数才是规则的配置项</span>\n    <span class="token string">"quotes"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">"error"</span><span class="token punctuation">,</span>\n      <span class="token string">"single"</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token string">"avoidEscape"</span><span class="token operator">:</span> <span class="token boolean">true</span> \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>根据上面的规则：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// bad</span>\n<span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token string">"test \'ESLint\' rule"</span>\n\n<span class="token comment">// good</span>\n<span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token string">\'test "ESLint" rule\'</span>\n</code></pre>\n<h3 id="%E6%89%A9%E5%B1%95">扩展<a class="anchor" href="#%E6%89%A9%E5%B1%95">§</a></h3>\n<p>扩展就是直接使用别人已经写好的 lint 规则，方便快捷。扩展一般支持三种类型：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"extends"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"eslint:recommended"</span><span class="token punctuation">,</span>\n    <span class="token string">"plugin:react/recommended"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-config-standard"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ul>\n<li><code>eslint:</code> 开头的是 ESLint 官方的扩展，一共有两个：<a href="https://github.com/eslint/eslint/blob/v6.0.1/conf/eslint-recommended.js"><code>eslint:recommended</code></a> 、<a href="https://github.com/eslint/eslint/blob/master/conf/eslint-all.js"><code>eslint:all</code></a>。</li>\n<li><code>plugin:</code> 开头的是扩展是插件类型，也可以直接在 <code>plugins</code> 属性中进行设置，后面一节会详细讲到。</li>\n<li>最后一种扩展来自 npm 包，官方规定 npm 包的扩展必须以 <code>eslint-config-</code> 开头，使用时可以省略这个头，上面案例中 <code>eslint-config-standard</code> 可以直接简写成 <code>standard</code>。</li>\n</ul>\n<p>如果你觉得自己的配置十分满意，也可以将自己的 lint 配置发布到 npm 包，只要将包名命名为 <code>eslint-config-xxx</code> 即可，同时，需要在 package.json 的 peerDependencies 字段中声明你依赖的 ESLint 的版本号。</p>\n<h3 id="%E6%8F%92%E4%BB%B6">插件<a class="anchor" href="#%E6%8F%92%E4%BB%B6">§</a></h3>\n<h4 id="%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6">使用插件<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6">§</a></h4>\n<p>虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。</p>\n<p>这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 <code>eslint-plugin-</code> 开头，使用的时候也可以省略这个头。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> --save-dev eslint-plugin-vue eslint-plugin-react\n</code></pre>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"react"</span><span class="token punctuation">,</span> <span class="token comment">// eslint-plugin-react</span>\n    <span class="token string">"vue"</span><span class="token punctuation">,</span>   <span class="token comment">// eslint-plugin-vue</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>或者是在扩展中引入插件，前面有提到 <code>plugin:</code> 开头的是扩展是进行插件的加载。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"extends"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"plugin:react/recommended"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>通过扩展的方式加载插件的规则如下：</p>\n<pre class="language-javascript"><code class="language-javascript">extPlugin <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">plugin:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>pluginName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>configName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>对照上面的案例，插件名(pluginName) 为 react，也就是之前安装 <code>eslint-plugin-react</code> 包，配置名(configName)为 recommended。那么这个配置名又是从哪里来的呢？</p>\n<p>可以看到 <code>eslint-plugin-react</code> 的<a href="https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L108">源码</a>。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 自定义的 rule</span>\n  rules<span class="token operator">:</span> allRules<span class="token punctuation">,</span>\n  <span class="token comment">// 可用的扩展</span>\n  configs<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// plugin:react/recommended</span>\n    recomended<span class="token operator">:</span> <span class="token punctuation">{</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'react\'</span> <span class="token punctuation">]</span>\n      rules<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token comment">// plugin:react/all</span>\n    all<span class="token operator">:</span> <span class="token punctuation">{</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'react\'</span> <span class="token punctuation">]</span>\n      rules<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>配置名是插件配置的 configs 属性定义的，这里的配置其实就是 ESLint 的扩展，通过这种方式即可以加载插件，又可以加载扩展。</p>\n<h4 id="%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6">开发插件<a class="anchor" href="#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6">§</a></h4>\n<p>ESLint 官方为了方便开发者，提供了 Yeoman 的模板（generator-eslint）。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 安装模块</span>\n<span class="token function">npm</span> <span class="token function">install</span> -g yo generator-eslint\n\n<span class="token comment"># 创建目录</span>\n<span class="token function">mkdir</span> eslint-plugin-demo\n<span class="token builtin class-name">cd</span> eslint-plugin-demo\n\n<span class="token comment"># 创建模板</span>\nyo eslint:plugin\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-27-16-2-20" alt="eslint:plugin"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-16-5-24.png" alt="eslint:plugin 目录"></p>\n<p>创建好项目之后，就可以开始创建一条规则了，幸运的是 generator-eslint 除了能够生成插件的模板代码外，还具有创建规则的模板代码。打开之前创建的 <code>eslint-plugin-demo</code> 文件夹，在该目录下添加一条规则，我希望这条规则能检测出我的代码里面是否有 <code>console</code> ，所以，我给该规则命名为 <code>disable-console</code>。</p>\n<pre class="language-bash"><code class="language-bash">yo eslint:rule\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-27-16-36-30.png" alt="eslint:rule"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-16-38-5.png" alt="eslint:rule 目录"></p>\n<p>接下来我们看看如何来指定 ESLinte 的一个规则：</p>\n<p>打开 <code>lib/rules/disable-console.js</code> ，可以看到默认的模板代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  meta<span class="token operator">:</span> <span class="token punctuation">{</span>\n    docs<span class="token operator">:</span> <span class="token punctuation">{</span>\n      description<span class="token operator">:</span> <span class="token string">"disable console"</span><span class="token punctuation">,</span>\n      category<span class="token operator">:</span> <span class="token string">"Fill me in"</span><span class="token punctuation">,</span>\n      recommended<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    schema<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// variables should be defined here</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token comment">// give me methods</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>简单的介绍下其中的参数（更详细的介绍可以查看<a href="https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics">官方文档</a>）：</p>\n<ul>\n<li>meta：规则的一些描述信息\n<ul>\n<li>docs：规则的描述对象\n<ul>\n<li>descrition(string)：规则的简短描述</li>\n<li>category(string)： 规则的类别（具体类别可以查看<a href="https://cn.eslint.org/docs/rules/">官网</a>）</li>\n<li>recommended(boolean)：是否加入 <code>eslint:recommended</code></li>\n</ul>\n</li>\n<li>schema(array)：规则所接受的配置项</li>\n</ul>\n</li>\n<li>create：返回一个对象，该对象包含 ESLint 在遍历 JavaScript 代码 AST 时，所触发的一系列事件勾子。</li>\n</ul>\n<p>在详细讲解如何创建一个规则之前，我们先来谈谈 AST（抽象语法树）。ESLint 使用了一个叫做 Espree 的 JavaScript 解析器来把 JavaScript 代码解析为一个 AST 。然后深度遍历 AST，每条规则都会对匹配的过程进行监听，每当匹配到一个类型，相应的规则就会进行检查。为了方便查看 AST 的各个节点类型，这里提供一个网站能十分清晰的查看一段代码解析成 AST 之后的样子：<a href="https://astexplorer.net/">astexplorer</a>。如果你想找到所有 AST 节点的类型，可以查看 <a href="https://github.com/estree/estree">estree</a>。</p>\n<p><img src="https://file.shenfq.com/2019-7-27-23-27-1.png" alt="astexplorer"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-23-35-57.png" alt="astexplorer"></p>\n<p>可以看到 <code>console.log()</code> 属于 <code>ExpressionStatement(表达式语句)</code> 中的 <code>CallExpression(调用语句)</code>。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"ExpressionStatement"</span><span class="token punctuation">,</span>\n  <span class="token string">"expression"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"CallExpression"</span><span class="token punctuation">,</span>\n    <span class="token string">"callee"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"MemberExpression"</span><span class="token punctuation">,</span>\n      <span class="token string">"object"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"Identifier"</span><span class="token punctuation">,</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"console"</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token string">"property"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"Identifier"</span><span class="token punctuation">,</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"log"</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token string">"computed"</span><span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>所以，我们要判断代码中是否调用了 <code>console</code>，可以在 create 方法返回的对象中，写一个 CallExpression 方法，在 ESLint 遍历 AST 的过程中，对调用语句进行监听，然后检查该调用语句是否为 <code>console</code> 调用。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token function"><span class="token maybe-class-name">CallExpression</span></span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取调用语句的调用对象</span>\n        <span class="token keyword">const</span> callObj <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">object</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>callObj<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callObj<span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">===</span> <span class="token string">\'console\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 如果调用对象为 console，通知 ESLint</span>\n          context<span class="token punctuation">.</span><span class="token method function property-access">report</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            node<span class="token punctuation">,</span>\n            message<span class="token operator">:</span> <span class="token string">\'error: should remove console\'</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看到我们最后通过 <code>context.report</code> 方法，告诉 ESLint 这是一段有问题的代码，具体要怎么处理，就要看 ESLint 配置中，该条规则是 <code>[off, warn, error]</code> 中的哪一个了。</p>\n<p>之前介绍规则的时候，有讲到规则是可以接受配置的，下面看看我们自己制定规则的时候，要如何接受配置项。其实很简单，只需要在 mate 对象的 schema 中定义好参数的类型，然后在 create 方法中，通过 <code>context.options</code> 获取即可。下面对 <code>disable-console</code> 进行修改，毕竟禁止所有的 console 太过严格，我们可以添加一个参数，该参数是一个数组，表示允许调用的 console 方法。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  meta<span class="token operator">:</span> <span class="token punctuation">{</span>\n    docs<span class="token operator">:</span> <span class="token punctuation">{</span>\n      description<span class="token operator">:</span> <span class="token string">"disable console"</span><span class="token punctuation">,</span> <span class="token comment">// 规则描述</span>\n      category<span class="token operator">:</span> <span class="token string">"Possible Errors"</span><span class="token punctuation">,</span>    <span class="token comment">// 规则类别</span>\n      recommended<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    schema<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token comment">// 接受一个参数</span>\n      <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token string">\'array\'</span><span class="token punctuation">,</span> <span class="token comment">// 接受参数类型为数组</span>\n        items<span class="token operator">:</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'string\'</span> <span class="token comment">// 数组的每一项为一个字符串</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> logs <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token comment">// console 的所以方法</span>\n        <span class="token string">"debug"</span><span class="token punctuation">,</span> <span class="token string">"error"</span><span class="token punctuation">,</span> <span class="token string">"info"</span><span class="token punctuation">,</span> <span class="token string">"log"</span><span class="token punctuation">,</span> <span class="token string">"warn"</span><span class="token punctuation">,</span> \n        <span class="token string">"dir"</span><span class="token punctuation">,</span> <span class="token string">"dirxml"</span><span class="token punctuation">,</span> <span class="token string">"table"</span><span class="token punctuation">,</span> <span class="token string">"trace"</span><span class="token punctuation">,</span> \n        <span class="token string">"group"</span><span class="token punctuation">,</span> <span class="token string">"groupCollapsed"</span><span class="token punctuation">,</span> <span class="token string">"groupEnd"</span><span class="token punctuation">,</span> \n        <span class="token string">"clear"</span><span class="token punctuation">,</span> <span class="token string">"count"</span><span class="token punctuation">,</span> <span class="token string">"countReset"</span><span class="token punctuation">,</span> <span class="token string">"assert"</span><span class="token punctuation">,</span> \n        <span class="token string">"profile"</span><span class="token punctuation">,</span> <span class="token string">"profileEnd"</span><span class="token punctuation">,</span> \n        <span class="token string">"time"</span><span class="token punctuation">,</span> <span class="token string">"timeLog"</span><span class="token punctuation">,</span> <span class="token string">"timeEnd"</span><span class="token punctuation">,</span> <span class="token string">"timeStamp"</span><span class="token punctuation">,</span> \n        <span class="token string">"context"</span><span class="token punctuation">,</span> <span class="token string">"memory"</span>\n    <span class="token punctuation">]</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token function"><span class="token maybe-class-name">CallExpression</span></span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n         <span class="token comment">// 接受的参数</span>\n        <span class="token keyword">const</span> allowLogs <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token property-access">options</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n        <span class="token keyword">const</span> disableLogs <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token method function property-access">isArray</span><span class="token punctuation">(</span>allowLogs<span class="token punctuation">)</span>\n          <span class="token comment">// 过滤掉允许调用的方法</span>\n          <span class="token operator">?</span> logs<span class="token punctuation">.</span><span class="token method function property-access">filter</span><span class="token punctuation">(</span><span class="token parameter">log</span> <span class="token arrow operator">=></span> <span class="token operator">!</span>allowLogs<span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span><span class="token punctuation">)</span>\n          <span class="token operator">:</span> logs\n        <span class="token keyword">const</span> callObj <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">object</span>\n        <span class="token keyword">const</span> callProp <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">property</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>callObj <span class="token operator">||</span> <span class="token operator">!</span>callProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callObj<span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">!==</span> <span class="token string">\'console\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 检测掉不允许调用的 console 方法</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>disableLogs<span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>callProp<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          context<span class="token punctuation">.</span><span class="token method function property-access">report</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            node<span class="token punctuation">,</span>\n            message<span class="token operator">:</span> <span class="token string">\'error: should remove console\'</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>规则写完之后，打开 <code>tests/rules/disable-console.js</code> ，编写测试用例。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> rule <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../../../lib/rules/disable-console"</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">RuleTester</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"eslint"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">RuleTester</span></span>\n\n<span class="token keyword">var</span> ruleTester <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RuleTester</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nruleTester<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token string">"disable-console"</span><span class="token punctuation">,</span> rule<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  valid<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n    code<span class="token operator">:</span> <span class="token string">"console.info(test)"</span><span class="token punctuation">,</span>\n    options<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">\'info\'</span><span class="token punctuation">]</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  invalid<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n    code<span class="token operator">:</span> <span class="token string">"console.log(test)"</span><span class="token punctuation">,</span>\n    errors<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> message<span class="token operator">:</span> <span class="token string">"error: should remove console"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-28-0-38-3.png" alt="test"></p>\n<p>最后，只需要引入插件，然后开启规则即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// eslintrc.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'demo\'</span> <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  rules<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">\'demo/disable-console\'</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">\'error\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span> <span class="token string">\'info\'</span> <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-28-1-1-19.png" alt="use plugin demo"></p>\n<h2 id="%E6%9C%80%E4%BD%B3%E9%85%8D%E7%BD%AE">最佳配置<a class="anchor" href="#%E6%9C%80%E4%BD%B3%E9%85%8D%E7%BD%AE">§</a></h2>\n<p><img src="https://file.shenfq.com/20190728133740.png" alt="最佳配置"></p>\n<p>业界有许多 JavaScript 的推荐编码规范，较为出名的就是下面两个：</p>\n<ol>\n<li><a href="https://github.com/airbnb/javascript">airbnb style</a></li>\n<li><a href="https://github.com/standard/standard">javascript standard</a></li>\n</ol>\n<p>同时这里也推荐 AlloyTeam 的 <a href="https://github.com/AlloyTeam/eslint-config-alloy">eslint-config-alloy</a>。</p>\n<p>但是代码规范这个东西，最好是团队成员之间一起来制定，确保大家都能够接受，如果实在是有人有异议，就只能少数服从多数了。虽然这节的标题叫最佳配置，但是软件行业并有没有什么方案是最佳方案，即使 javascript standard 也不是 javascript 标准的编码规范，它仅仅只是叫这个名字而已，只有适合的才是最好的。</p>\n<p>最后安利一下，将 ESLint 和 Prettier 结合使用，不仅统一编码规范，也能统一代码风格。具体实践方式，请参考我的文章：<a href="https://juejin.im/post/5b27a326e51d45588a7dac57">使用ESLint+Prettier来统一前端代码风格</a>。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>看到这里我们做一个总结，JavaScript 的 linter 工具发展历史其实也不算短，ESLint 之所以能够后来者居上，主要原因还是 JSLint 和 JSHint 采用自顶向下的方式来解析代码，并且早期 JavaScript 语法万年不更新，能这种方式够以较快的速度来解析代码，找到可能存在的语法错误和不规范的代码。但是 ES6 发布之后，JavaScript 语法发生了很多的改动，比如：箭头函数、模板字符串、扩展运算符……，这些语法的发布，导致 JSLint 和 JSHint 如果不更新解析器就没法检测 ES6 的代码。而 ESLint 另辟蹊径，采用 AST 的方式对代码进行静态分析，并保留了强大的可扩展性和灵活的配置能力。这也告诉我们，在日常的编码过程中，一定要考虑到后续的扩展能力。</p>\n<p>正是因为这个强大扩展能力，让业界的很多 JavaScript 编码规范能够在各个团队进行快速的落地，并且团队自己定制的代码规范也可以对外共享。</p>\n<p>最后，希望你通过上面的学习已经理解了 ESLint 带来的好处，同时掌握了 ESLint 的用法，并可以为现有的项目引入 ESLint 改善项目的代码质量。</p>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="https://cn.eslint.org/">ESLint 官网</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/34656263/">JS Linter 进化史</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/53680918">ESLint 工作原理探讨</a></li>\n</ul>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u6DF1\u5165\u7406\u89E3 ESLint"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>小沈是一个刚刚开始工作的前端实习生，第一次进行团队开发，难免有些紧张。在导师的安排下，拿到了项目的 git 权限，开始进行 clone。</p>\n<pre class="language-autoit"><code class="language-autoit">$ git clone git<span class="token variable">@github</span><span class="token punctuation">.</span>com<span class="token punctuation">:</span>company<span class="token operator">/</span>project<span class="token punctuation">.</span>git\n</code></pre>\n<p>小沈开始细细品味着同事们的代码，终于在他的不懈努力下，发现了老王 2 年前写的一个 bug，跟导师报备之后，小沈开始着手修改。年轻人嘛，容易冲动，不仅修复了老王的 bug，还把这部分代码进行了重构，使用了前两天刚刚从书里学会的策略模式，去掉了一些不必要 if else 逻辑。小沈潇洒的摸了摸自己稀疏的头发，得意的准备提交代码，想着第一天刚来就秀了下自己的超强的编码能力。接下来可怕的事情发生了，代码死活不能通过 lint 工具的检测，急得他面红耳赤，赶紧跑去问导师，导师告诉他，只要按照控制台的 warning 修改代码就好。小沈反驳道，这个 lint 工具非让我去掉分号，我在学校的时候，老师就教我分号是必不可少的，没有分号的代码是不完美的。导师无奈的笑了笑，打开了小沈的实习评分表，在团队合作一项中勾选『较差』。</p>\n<p>不服气的小沈，写了一篇博客发布到了 CSDN 上，还收获了不少阅读量。</p>\n<p><img src="https://file.shenfq.com/20190727153755.png" alt="image"></p>\n<h4 id="%E9%97%AE%E5%B7%A5%E4%BD%9C%E7%AC%AC%E4%B8%80%E5%A4%A9%E5%B0%8F%E6%B2%88%E7%8A%AF%E4%BA%86%E5%93%AA%E4%BA%9B%E9%94%99%E8%AF%AF">问：工作第一天小沈犯了哪些错误？<a class="anchor" href="#%E9%97%AE%E5%B7%A5%E4%BD%9C%E7%AC%AC%E4%B8%80%E5%A4%A9%E5%B0%8F%E6%B2%88%E7%8A%AF%E4%BA%86%E5%93%AA%E4%BA%9B%E9%94%99%E8%AF%AF">§</a></h4>\n<ol>\n<li>对不了解的业务代码进行重构，这是业务开发的大忌；</li>\n<li>没有遵守团队规范，团队开发带有太强的个人情绪；</li>\n<li>上面都是我编的，听说现在写文章开头都要编个故事。</li>\n</ol>\n<h2 id="lint-%E5%B7%A5%E5%85%B7%E7%AE%80%E5%8F%B2">lint 工具简史<a class="anchor" href="#lint-%E5%B7%A5%E5%85%B7%E7%AE%80%E5%8F%B2">§</a></h2>\n<blockquote>\n<p>在计算机科学中，lint是一种工具的名称，它用来标记代码中，某些可疑的、不具结构性（可能造成bug）的语句。它是一种静态程序分析工具，最早适用于C语言，在UNIX平台上开发出来。后来它成为通用术语，可用于描述在任何一种编程语言中，用来标记代码中有疑义语句的工具。    -- by wikipedia</p>\n</blockquote>\n<p>在 JavaScript 20 多年的发展历程中，也出现过许许多多的 lint 工具，下面就来介绍下主流的三款 lint 工具。</p>\n<ol>\n<li>JSLint</li>\n<li>JSHint</li>\n<li>ESLint</li>\n</ol>\n<p><img src="https://file.shenfq.com/2019-7-27-15-40-6.comywsres26205WEBRESOURCE0bbfb328d288ee97233c5811224582f8" alt="image"></p>\n<h3 id="jslint"><a href="http://www.jslint.com/">JSLint</a><a class="anchor" href="#jslint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153752.png" alt="JSLint logo"></p>\n<p>JSLint 可以说是最早出现的 JavaScript 的 lint 工具，由 Douglas Crockford (《JavaScript 语言精粹》作者) 开发。从《JavaScript 语言精粹》的笔风就能看出，Douglas 是个眼里容不得瑕疵的人，所以 JSLint 也继承了这个特色，JSLint 的所有规则都是由 Douglas 自己定义的，可以说这是一个极具 Douglas 个人风格的 lint 工具，如果你要使用它，就必须接受它所有规则。值得称赞的是，JSLint 依然在更新，而且也提供了 node 版本：<a href="https://www.npmjs.com/package/jslint">node-jslint</a>。</p>\n<h3 id="jshint"><a href="https://jshint.com/">JSHint</a><a class="anchor" href="#jshint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153753.png" alt="JSHint logo"></p>\n<p>由于 JSLint 让很多人无法忍受它的规则，感觉受到了压迫，所以 Anton Kovalyov (现在在 Medium 工作) 基于 JSLint 开发了 JSHint。JSHint 在 JSLint 的基础上提供了丰富的配置项，给了开发者极大的自由，JSHint 一开始就保持着开源软件的风格，由社区进行驱动，发展十分迅速。早起 jQuery 也是使用 JSHint 进行代码检查的，不过现在已经转移到 ESLint 了。</p>\n<h3 id="eslint"><a href="https://cn.eslint.org/">ESLint</a><a class="anchor" href="#eslint">§</a></h3>\n<p><img src="https://file.shenfq.com/20190727153754.png" alt="ESLint logo"></p>\n<p>ESLint 由 Nicholas C. Zakas (《JavaScript 高级程序设计》作者) 于2013年6月创建，它的出现因为 Zakas 想使用 JSHint 添加一条自定义的规则，但是发现 JSHint 不支持，于是自己开发了一个。</p>\n<p>ESLint 号称下一代的 JS Linter 工具，它的灵感来源于 PHP Linter，将源代码解析成 AST，然后检测 AST 来判断代码是否符合规则。ESLint 使用 esprima 将源代码解析吃成 AST，然后你就可以使用任意规则来检测 AST 是否符合预期，这也是 ESLint 高可扩展性的原因。</p>\n<p><a href="https://github.com/eslint/eslint/blob/v0.0.2/lib/jscheck.js#L70">早期源码</a>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> ast <span class="token operator">=</span> esprima<span class="token punctuation">.</span><span class="token method function property-access">parse</span><span class="token punctuation">(</span>text<span class="token punctuation">,</span> <span class="token punctuation">{</span> loc<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> range<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    walk <span class="token operator">=</span> <span class="token function">astw</span><span class="token punctuation">(</span>ast<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">walk</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    api<span class="token punctuation">.</span><span class="token method function property-access">emit</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span><span class="token property-access">type</span><span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword control-flow">return</span> messages<span class="token punctuation">;</span>\n</code></pre>\n<p>但是，那个时候 ESLint 并没有大火，因为需要将源代码转成 AST，运行速度上输给了 JSHint ，并且 JSHint 当时已经有完善的生态（编辑器的支持）。真正让 ESLint 大火是因为 ES6 的出现。</p>\n<p>ES6 发布后，因为新增了很多语法，JSHint 短期内无法提供支持，而 ESLint 只需要有合适的解析器就能够进行 lint 检查。这时 babel 为 ESLint 提供了支持，开发了 babel-eslint，让ESLint 成为最快支持 ES6 语法的 lint 工具。</p>\n<p><img src="https://file.shenfq.com/20190727153757.png" alt="谷歌趋势"></p>\n<p>在 2016 年，ESLint整合了与它同时诞生的另一个 lint 工具：JSCS，因为它与 ESLint 具有异曲同工之妙，都是通过生成 AST 的方式进行规则检测。</p>\n<p><img src="https://file.shenfq.com/20190727153756.png" alt="ESLint整合JSCS"></p>\n<p>自此，ESLint 在 JS Linter 领域一统江湖，成为前端界的主流工具。</p>\n<h2 id="lint-%E5%B7%A5%E5%85%B7%E7%9A%84%E6%84%8F%E4%B9%89">Lint 工具的意义<a class="anchor" href="#lint-%E5%B7%A5%E5%85%B7%E7%9A%84%E6%84%8F%E4%B9%89">§</a></h2>\n<p>下面一起来思考一个问题：Lint 工具对工程师来说到底是代码质量的保证还是一种束缚？</p>\n<p>然后，我们再看看 ESLint 官网的简介：</p>\n<blockquote>\n<p>代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。</p>\n</blockquote>\n<blockquote>\n<p>JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。</p>\n</blockquote>\n<p>因为 JavaScript 这门神奇的语言，在带给我们灵活性的同时，也埋下了一些坑。比如 <code>==</code> 涉及到的弱类型转换，着实让人很苦恼，还有 <code>this</code> 的指向，也是一个让人迷惑的东西。而 Lint 工具就很好的解决了这个问题，干脆禁止你使用 <code>==</code> ，这种做法虽然限制了语言的灵活性，但是带来的收益也是可观的。</p>\n<p>还有就是作为一门动态语言，因为缺少编译过程，有些本可以在编译过程中发现的错误，只能等到运行才发现，这给我们调试工作增加了一些负担，而 Lint 工具相当于为语言增加了编译过程，在代码运行前进行静态分析找到出错的地方。</p>\n<p>所以汇总一下，Lint工具的优势：</p>\n<h4 id="1-%E9%81%BF%E5%85%8D%E4%BD%8E%E7%BA%A7bug%E6%89%BE%E5%87%BA%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%E7%9A%84%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF">1. 避免低级bug，找出可能发生的语法错误<a class="anchor" href="#1-%E9%81%BF%E5%85%8D%E4%BD%8E%E7%BA%A7bug%E6%89%BE%E5%87%BA%E5%8F%AF%E8%83%BD%E5%8F%91%E7%94%9F%E7%9A%84%E8%AF%AD%E6%B3%95%E9%94%99%E8%AF%AF">§</a></h4>\n<blockquote>\n<p>使用未声明变量、修改 const 变量……</p>\n</blockquote>\n<h4 id="2-%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E7%9A%84%E4%BB%A3%E7%A0%81">2. 提示删除多余的代码<a class="anchor" href="#2-%E6%8F%90%E7%A4%BA%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E7%9A%84%E4%BB%A3%E7%A0%81">§</a></h4>\n<blockquote>\n<p>声明而未使用的变量、重复的 case ……</p>\n</blockquote>\n<h4 id="3-%E7%A1%AE%E4%BF%9D%E4%BB%A3%E7%A0%81%E9%81%B5%E5%BE%AA%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5">3. 确保代码遵循最佳实践<a class="anchor" href="#3-%E7%A1%AE%E4%BF%9D%E4%BB%A3%E7%A0%81%E9%81%B5%E5%BE%AA%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5">§</a></h4>\n<blockquote>\n<p>可参考 <a href="https://github.com/airbnb/javascript">airbnb style</a>、<a href="https://github.com/standard/standard">javascript standard</a></p>\n</blockquote>\n<h4 id="4-%E7%BB%9F%E4%B8%80%E5%9B%A2%E9%98%9F%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC">4. 统一团队的代码风格<a class="anchor" href="#4-%E7%BB%9F%E4%B8%80%E5%9B%A2%E9%98%9F%E7%9A%84%E4%BB%A3%E7%A0%81%E9%A3%8E%E6%A0%BC">§</a></h4>\n<blockquote>\n<p>加不加分号？使用 tab 还是空格？</p>\n</blockquote>\n<h2 id="%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F">使用方式<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F">§</a></h2>\n<p>说了那么多，还是来看下有点实际意义的，ESLint 到底是如何使用的。</p>\n<h3 id="%E5%88%9D%E5%A7%8B%E5%8C%96">初始化<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96">§</a></h3>\n<p>如果想在现有项目中引入 ESLint，可以直接运行下面的命令：</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 全局安装 ESLint</span>\n$ <span class="token function">npm</span> <span class="token function">install</span> -g eslint\n\n<span class="token comment"># 进入项目</span>\n$ <span class="token builtin class-name">cd</span> ~/Code/ESLint-demo\n\n<span class="token comment"># 初始化 package.json</span>\n$ <span class="token function">npm</span> init -f\n\n<span class="token comment"># 初始化 ESLint 配置</span>\n$ eslint --init\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153759.png" alt="image"></p>\n<p>在使用 <code>eslint --init</code> 后，会出现很多用户配置项，具体可以参考：<a href="https://github.com/eslint/eslint/blob/v6.0.1/lib/init/config-initializer.js#L432">eslint cli 部分的源码</a>。</p>\n<p>经过一系列一问一答的环节后，你会发现在你文件夹的根目录生成了一个 <code>.eslintrc.js</code> 文件。</p>\n<p><img src="https://file.shenfq.com/20190727153800.png" alt="image"></p>\n<h3 id="%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F">配置方式<a class="anchor" href="#%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F">§</a></h3>\n<p>ESLint 一共有两种配置方式：</p>\n<h4 id="1-%E4%BD%BF%E7%94%A8%E6%B3%A8%E9%87%8A%E6%8A%8A-lint-%E8%A7%84%E5%88%99%E7%9B%B4%E6%8E%A5%E5%B5%8C%E5%85%A5%E5%88%B0%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD">1. 使用注释把 lint 规则直接嵌入到源代码中<a class="anchor" href="#1-%E4%BD%BF%E7%94%A8%E6%B3%A8%E9%87%8A%E6%8A%8A-lint-%E8%A7%84%E5%88%99%E7%9B%B4%E6%8E%A5%E5%B5%8C%E5%85%A5%E5%88%B0%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD">§</a></h4>\n<p>这是最简单粗暴的方式，直接在源代码中使用 ESLint 能够识别的注释方式，进行 lint 规则的定义。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* eslint eqeqeq: "error" */</span>\n<span class="token keyword">var</span> num <span class="token operator">=</span> <span class="token number">1</span>\nnum <span class="token operator">==</span> <span class="token string">\'1\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153758.png" alt="image"></p>\n<p>当然我们一般使用注释是为了临时禁止某些严格的 lint 规则出现的警告：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">/* eslint-disable */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'该注释放在文件顶部，整个文件都不会出现 lint 警告\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-enable */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'重新启用 lint 告警\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-disable eqeqeq */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'只禁止某一个或多个规则\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">/* eslint-disable-next-line */</span>\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前行禁止 lint 警告\'</span><span class="token punctuation">)</span>\n\n<span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">\'当前行禁止 lint 警告\'</span><span class="token punctuation">)</span> <span class="token comment">// eslint-disable-line</span>\n</code></pre>\n<h4 id="2-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E8%BF%9B%E8%A1%8C-lint-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE">2. 使用配置文件进行 lint 规则配置<a class="anchor" href="#2-%E4%BD%BF%E7%94%A8%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E8%BF%9B%E8%A1%8C-lint-%E8%A7%84%E5%88%99%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>在初始化过程中，有一个选项就是使用什么文件类型进行 lint 配置（<code>What format do you want your config file to be in?</code>）：</p>\n<pre class="language-autoit"><code class="language-autoit">{\n    type<span class="token punctuation">:</span> <span class="token string">"list"</span><span class="token punctuation">,</span>\n    name<span class="token punctuation">:</span> <span class="token string">"format"</span><span class="token punctuation">,</span>\n    message<span class="token punctuation">:</span> <span class="token string">"What format do you want your config file to be in?"</span><span class="token punctuation">,</span>\n    <span class="token keyword">default</span><span class="token punctuation">:</span> <span class="token string">"JavaScript"</span><span class="token punctuation">,</span>\n    choices<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"JavaScript"</span><span class="token punctuation">,</span> <span class="token string">"YAML"</span><span class="token punctuation">,</span> <span class="token string">"JSON"</span><span class="token punctuation">]</span>\n}\n</code></pre>\n<p>官方一共提供了三个选项：</p>\n<ol>\n<li>JavaScript (eslintrc.js)</li>\n<li>YAML (eslintrc.yaml)</li>\n<li>JSON (eslintrc.json)</li>\n</ol>\n<p>另外，你也可以自己在 <code>package.json</code> 文件中添加 <code>eslintConfig</code> 字段进行配置。</p>\n<p>翻阅 ESLint <a href="https://github.com/eslint/eslint/blob/v6.0.1/lib/cli-engine/config-array-factory.js#L52">源码</a>可以看到，其配置文件的优先级如下：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">const</span> configFilenames <span class="token operator">=</span> <span class="token punctuation">[</span>\n  <span class="token string">".eslintrc.js"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.yaml"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.yml"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc.json"</span><span class="token punctuation">,</span>\n  <span class="token string">".eslintrc"</span><span class="token punctuation">,</span>\n  <span class="token string">"package.json"</span>\n<span class="token punctuation">]</span><span class="token punctuation">;</span>\n</code></pre>\n<pre class="language-autoit"><code class="language-autoit"><span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>js <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>yaml  <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>yml <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc<span class="token punctuation">.</span>json <span class="token operator">></span> <span class="token punctuation">.</span>eslintrc <span class="token operator">></span> package<span class="token punctuation">.</span>json\n</code></pre>\n<p>当然你也可以使用 cli 自己指定配置文件路径：</p>\n<p><img src="https://file.shenfq.com/20190727153813.png" alt="image"></p>\n<h4 id="%E9%A1%B9%E7%9B%AE%E7%BA%A7%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BA%A7%E7%9A%84%E9%85%8D%E7%BD%AE">项目级与目录级的配置<a class="anchor" href="#%E9%A1%B9%E7%9B%AE%E7%BA%A7%E4%B8%8E%E7%9B%AE%E5%BD%95%E7%BA%A7%E7%9A%84%E9%85%8D%E7%BD%AE">§</a></h4>\n<p>我们有如下目录结构，此时在根目录运行 ESLint，那么我们将得到两个配置文件 <code>.eslintrc.js</code>（项目级配置） 和 <code>src/.eslintrc.js</code>（目录级配置），这两个配置文件会进行合并，但是 <code>src/.eslintrc.js</code> 具有更高的优先级。</p>\n<p><img src="https://file.shenfq.com/20190727153810.png" alt="目录结构"></p>\n<p>但是，我们只要在 <code>src/.eslintrc.js</code> 中配置 <code>&quot;root&quot;: true</code>，那么 ESLint 就会认为 <code>src</code> 目录为根目录，不再向上查找配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"root"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0">配置参数<a class="anchor" href="#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0">§</a></h3>\n<p>下面我们一起来细细品味 ESLinte 的配置规则。</p>\n<h4 id="%E8%A7%A3%E6%9E%90%E5%99%A8%E9%85%8D%E7%BD%AE">解析器配置<a class="anchor" href="#%E8%A7%A3%E6%9E%90%E5%99%A8%E9%85%8D%E7%BD%AE">§</a></h4>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token comment">// 解析器类型</span>\n  <span class="token comment">// espima(默认), babel-eslint, @typescript-eslint/parse</span>\n  <span class="token string">"parse"</span><span class="token operator">:</span> <span class="token string">"esprima"</span><span class="token punctuation">,</span>\n  <span class="token comment">// 解析器配置参数</span>\n  <span class="token string">"parseOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 代码类型：script(默认), module</span>\n    <span class="token string">"sourceType"</span><span class="token operator">:</span> <span class="token string">"script"</span><span class="token punctuation">,</span>\n    <span class="token comment">// es 版本号，默认为 5，也可以是用年份，比如 2015 (同 6)</span>\n    <span class="token string">"ecamVersion"</span><span class="token operator">:</span> <span class="token number">6</span><span class="token punctuation">,</span>\n    <span class="token comment">// es 特性配置</span>\n    <span class="token string">"ecmaFeatures"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"globalReturn"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 允许在全局作用域下使用 return 语句</span>\n        <span class="token string">"impliedStrict"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 启用全局 strict mode </span>\n        <span class="token string">"jsx"</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token comment">// 启用 JSX</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>对于 <code>@typescript-eslint/parse</code> 这个解析器，主要是为了替代之前存在的 TSLint，TS 团队因为 ESLint 生态的繁荣，且 ESLint 具有更多的配置项，不得不抛弃 TSLint 转而实现一个 ESLint 的解析器。同时，该解析器拥有<a href="https://www.npmjs.com/package/@typescript-eslint/parser#configuration">不同的配置</a>：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"parserOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"ecmaFeatures"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"jsx"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"useJSXTextNode"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"project"</span><span class="token operator">:</span> <span class="token string">"./tsconfig.json"</span><span class="token punctuation">,</span>\n    <span class="token string">"tsconfigRootDir"</span><span class="token operator">:</span> <span class="token string">"../../"</span><span class="token punctuation">,</span>\n    <span class="token string">"extraFileExtensions"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">".vue"</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F">环境与全局变量<a class="anchor" href="#%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F">§</a></h4>\n<p>ESLint 会检测未声明的变量，并发出警告，但是有些变量是我们引入的库声明的，这里就需要提前在配置中声明。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"globals"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 声明 jQuery 对象为全局变量</span>\n    <span class="token string">"$"</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token comment">// true表示该变量为 writeable，而 false 表示 readonly</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>在 <code>globals</code> 中一个个的进行声明未免有点繁琐，这个时候就需要使用到 <code>env</code> ，这是对一个环境定义的一组全局变量的预设（类似于 babel 的 presets）。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"env"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"amd"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"commonjs"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n    <span class="token string">"jquery"</span><span class="token operator">:</span> <span class="token boolean">true</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可选的环境很多，预设值都在<a href="https://github.com/eslint/eslint/blob/v6.0.1/conf/environments.js">这个文件</a>中进行定义，查看源码可以发现，其预设变量都引用自 <a href="https://github.com/sindresorhus/globals/blob/master/globals.json"><code>globals</code></a> 包。</p>\n<p><img src="https://file.shenfq.com/20190727153811.png" alt="env"></p>\n<p><img src="https://file.shenfq.com/20190727153809.png" alt="env"></p>\n<h3 id="%E8%A7%84%E5%88%99%E8%AE%BE%E7%BD%AE">规则设置<a class="anchor" href="#%E8%A7%84%E5%88%99%E8%AE%BE%E7%BD%AE">§</a></h3>\n<p>ESLint 附带有<a href="https://cn.eslint.org/docs/rules/">大量的规则</a>，你可以在配置文件的 <code>rules</code> 属性中配置你想要的规则。每一条规则接受一个参数，参数的值如下：</p>\n<ul>\n<li>&quot;off&quot; 或 0：关闭规则</li>\n<li>&quot;warn&quot; 或 1：开启规则，warn 级别的错误 (不会导致程序退出)</li>\n<li>&quot;error&quot; 或 2：开启规则，error级别的错误(当被触发的时候，程序会退出)</li>\n</ul>\n<p>举个例子，我们先写一段使用了平等(equality)的代码，然后对 <code>eqeqeq</code> 规则分别进行不同的配置。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// demo.js</span>\n<span class="token keyword">var</span> num <span class="token operator">=</span> <span class="token number">1</span>\nnum <span class="token operator">==</span> <span class="token string">\'1\'</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/20190727153814.png" alt="eqeqeq 规则校验"></p>\n<p>这里使用了命令行的配置方式，如果你只想对单个文件进行某个规则的校验就可以使用这种方式。</p>\n<p>但是，事情往往没有我们想象中那么简单，ESLint 的规则不仅只有关闭和开启这么简单，每一条规则还有自己的配置项。如果需要对某个规则进行配置，就需要使用数组形式的参数。</p>\n<p>我们看下 <code>quotes</code> 规则，根据官网介绍，它支持字符串和对象两个配置项。</p>\n<p><img src="https://file.shenfq.com/20190727153812.png" alt="quotes"></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"rules"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 使用数组形式，对规则进行配置</span>\n    <span class="token comment">// 第一个参数为是否启用规则</span>\n    <span class="token comment">// 后面的参数才是规则的配置项</span>\n    <span class="token string">"quotes"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">"error"</span><span class="token punctuation">,</span>\n      <span class="token string">"single"</span><span class="token punctuation">,</span>\n      <span class="token punctuation">{</span>\n        <span class="token string">"avoidEscape"</span><span class="token operator">:</span> <span class="token boolean">true</span> \n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>根据上面的规则：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// bad</span>\n<span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token string">"test \'ESLint\' rule"</span>\n\n<span class="token comment">// good</span>\n<span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token string">\'test "ESLint" rule\'</span>\n</code></pre>\n<h3 id="%E6%89%A9%E5%B1%95">扩展<a class="anchor" href="#%E6%89%A9%E5%B1%95">§</a></h3>\n<p>扩展就是直接使用别人已经写好的 lint 规则，方便快捷。扩展一般支持三种类型：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"extends"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"eslint:recommended"</span><span class="token punctuation">,</span>\n    <span class="token string">"plugin:react/recommended"</span><span class="token punctuation">,</span>\n    <span class="token string">"eslint-config-standard"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<ul>\n<li><code>eslint:</code> 开头的是 ESLint 官方的扩展，一共有两个：<a href="https://github.com/eslint/eslint/blob/v6.0.1/conf/eslint-recommended.js"><code>eslint:recommended</code></a> 、<a href="https://github.com/eslint/eslint/blob/master/conf/eslint-all.js"><code>eslint:all</code></a>。</li>\n<li><code>plugin:</code> 开头的是扩展是插件类型，也可以直接在 <code>plugins</code> 属性中进行设置，后面一节会详细讲到。</li>\n<li>最后一种扩展来自 npm 包，官方规定 npm 包的扩展必须以 <code>eslint-config-</code> 开头，使用时可以省略这个头，上面案例中 <code>eslint-config-standard</code> 可以直接简写成 <code>standard</code>。</li>\n</ul>\n<p>如果你觉得自己的配置十分满意，也可以将自己的 lint 配置发布到 npm 包，只要将包名命名为 <code>eslint-config-xxx</code> 即可，同时，需要在 package.json 的 peerDependencies 字段中声明你依赖的 ESLint 的版本号。</p>\n<h3 id="%E6%8F%92%E4%BB%B6">插件<a class="anchor" href="#%E6%8F%92%E4%BB%B6">§</a></h3>\n<h4 id="%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6">使用插件<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6">§</a></h4>\n<p>虽然官方提供了上百种的规则可供选择，但是这还不够，因为官方的规则只能检查标准的 JavaScript 语法，如果你写的是 JSX 或者 Vue 单文件组件，ESLint 的规则就开始束手无策了。</p>\n<p>这个时候就需要安装 ESLint 的插件，来定制一些特定的规则进行检查。ESLint 的插件与扩展一样有固定的命名格式，以 <code>eslint-plugin-</code> 开头，使用的时候也可以省略这个头。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> --save-dev eslint-plugin-vue eslint-plugin-react\n</code></pre>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"react"</span><span class="token punctuation">,</span> <span class="token comment">// eslint-plugin-react</span>\n    <span class="token string">"vue"</span><span class="token punctuation">,</span>   <span class="token comment">// eslint-plugin-vue</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>或者是在扩展中引入插件，前面有提到 <code>plugin:</code> 开头的是扩展是进行插件的加载。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"extends"</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n    <span class="token string">"plugin:react/recommended"</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>通过扩展的方式加载插件的规则如下：</p>\n<pre class="language-javascript"><code class="language-javascript">extPlugin <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">plugin:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>pluginName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>configName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>对照上面的案例，插件名(pluginName) 为 react，也就是之前安装 <code>eslint-plugin-react</code> 包，配置名(configName)为 recommended。那么这个配置名又是从哪里来的呢？</p>\n<p>可以看到 <code>eslint-plugin-react</code> 的<a href="https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js#L108">源码</a>。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 自定义的 rule</span>\n  rules<span class="token operator">:</span> allRules<span class="token punctuation">,</span>\n  <span class="token comment">// 可用的扩展</span>\n  configs<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token comment">// plugin:react/recommended</span>\n    recomended<span class="token operator">:</span> <span class="token punctuation">{</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'react\'</span> <span class="token punctuation">]</span>\n      rules<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token comment">// plugin:react/all</span>\n    all<span class="token operator">:</span> <span class="token punctuation">{</span>\n      plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'react\'</span> <span class="token punctuation">]</span>\n      rules<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token spread operator">...</span><span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>配置名是插件配置的 configs 属性定义的，这里的配置其实就是 ESLint 的扩展，通过这种方式即可以加载插件，又可以加载扩展。</p>\n<h4 id="%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6">开发插件<a class="anchor" href="#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6">§</a></h4>\n<p>ESLint 官方为了方便开发者，提供了 Yeoman 的模板（generator-eslint）。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 安装模块</span>\n<span class="token function">npm</span> <span class="token function">install</span> -g yo generator-eslint\n\n<span class="token comment"># 创建目录</span>\n<span class="token function">mkdir</span> eslint-plugin-demo\n<span class="token builtin class-name">cd</span> eslint-plugin-demo\n\n<span class="token comment"># 创建模板</span>\nyo eslint:plugin\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-27-16-2-20" alt="eslint:plugin"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-16-5-24.png" alt="eslint:plugin 目录"></p>\n<p>创建好项目之后，就可以开始创建一条规则了，幸运的是 generator-eslint 除了能够生成插件的模板代码外，还具有创建规则的模板代码。打开之前创建的 <code>eslint-plugin-demo</code> 文件夹，在该目录下添加一条规则，我希望这条规则能检测出我的代码里面是否有 <code>console</code> ，所以，我给该规则命名为 <code>disable-console</code>。</p>\n<pre class="language-bash"><code class="language-bash">yo eslint:rule\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-27-16-36-30.png" alt="eslint:rule"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-16-38-5.png" alt="eslint:rule 目录"></p>\n<p>接下来我们看看如何来指定 ESLinte 的一个规则：</p>\n<p>打开 <code>lib/rules/disable-console.js</code> ，可以看到默认的模板代码如下：</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  meta<span class="token operator">:</span> <span class="token punctuation">{</span>\n    docs<span class="token operator">:</span> <span class="token punctuation">{</span>\n      description<span class="token operator">:</span> <span class="token string">"disable console"</span><span class="token punctuation">,</span>\n      category<span class="token operator">:</span> <span class="token string">"Fill me in"</span><span class="token punctuation">,</span>\n      recommended<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    schema<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// variables should be defined here</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token comment">// give me methods</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n<p>简单的介绍下其中的参数（更详细的介绍可以查看<a href="https://cn.eslint.org/docs/developer-guide/working-with-rules#rule-basics">官方文档</a>）：</p>\n<ul>\n<li>meta：规则的一些描述信息\n<ul>\n<li>docs：规则的描述对象\n<ul>\n<li>descrition(string)：规则的简短描述</li>\n<li>category(string)： 规则的类别（具体类别可以查看<a href="https://cn.eslint.org/docs/rules/">官网</a>）</li>\n<li>recommended(boolean)：是否加入 <code>eslint:recommended</code></li>\n</ul>\n</li>\n<li>schema(array)：规则所接受的配置项</li>\n</ul>\n</li>\n<li>create：返回一个对象，该对象包含 ESLint 在遍历 JavaScript 代码 AST 时，所触发的一系列事件勾子。</li>\n</ul>\n<p>在详细讲解如何创建一个规则之前，我们先来谈谈 AST（抽象语法树）。ESLint 使用了一个叫做 Espree 的 JavaScript 解析器来把 JavaScript 代码解析为一个 AST 。然后深度遍历 AST，每条规则都会对匹配的过程进行监听，每当匹配到一个类型，相应的规则就会进行检查。为了方便查看 AST 的各个节点类型，这里提供一个网站能十分清晰的查看一段代码解析成 AST 之后的样子：<a href="https://astexplorer.net/">astexplorer</a>。如果你想找到所有 AST 节点的类型，可以查看 <a href="https://github.com/estree/estree">estree</a>。</p>\n<p><img src="https://file.shenfq.com/2019-7-27-23-27-1.png" alt="astexplorer"></p>\n<p><img src="https://file.shenfq.com/2019-7-27-23-35-57.png" alt="astexplorer"></p>\n<p>可以看到 <code>console.log()</code> 属于 <code>ExpressionStatement(表达式语句)</code> 中的 <code>CallExpression(调用语句)</code>。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">{</span>\n  <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"ExpressionStatement"</span><span class="token punctuation">,</span>\n  <span class="token string">"expression"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"CallExpression"</span><span class="token punctuation">,</span>\n    <span class="token string">"callee"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n      <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"MemberExpression"</span><span class="token punctuation">,</span>\n      <span class="token string">"object"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"Identifier"</span><span class="token punctuation">,</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"console"</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token string">"property"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"type"</span><span class="token operator">:</span> <span class="token string">"Identifier"</span><span class="token punctuation">,</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"log"</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n      <span class="token string">"computed"</span><span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>所以，我们要判断代码中是否调用了 <code>console</code>，可以在 create 方法返回的对象中，写一个 CallExpression 方法，在 ESLint 遍历 AST 的过程中，对调用语句进行监听，然后检查该调用语句是否为 <code>console</code> 调用。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token function"><span class="token maybe-class-name">CallExpression</span></span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 获取调用语句的调用对象</span>\n        <span class="token keyword">const</span> callObj <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">object</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>callObj<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callObj<span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">===</span> <span class="token string">\'console\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token comment">// 如果调用对象为 console，通知 ESLint</span>\n          context<span class="token punctuation">.</span><span class="token method function property-access">report</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            node<span class="token punctuation">,</span>\n            message<span class="token operator">:</span> <span class="token string">\'error: should remove console\'</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>可以看到我们最后通过 <code>context.report</code> 方法，告诉 ESLint 这是一段有问题的代码，具体要怎么处理，就要看 ESLint 配置中，该条规则是 <code>[off, warn, error]</code> 中的哪一个了。</p>\n<p>之前介绍规则的时候，有讲到规则是可以接受配置的，下面看看我们自己制定规则的时候，要如何接受配置项。其实很简单，只需要在 mate 对象的 schema 中定义好参数的类型，然后在 create 方法中，通过 <code>context.options</code> 获取即可。下面对 <code>disable-console</code> 进行修改，毕竟禁止所有的 console 太过严格，我们可以添加一个参数，该参数是一个数组，表示允许调用的 console 方法。</p>\n<pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  meta<span class="token operator">:</span> <span class="token punctuation">{</span>\n    docs<span class="token operator">:</span> <span class="token punctuation">{</span>\n      description<span class="token operator">:</span> <span class="token string">"disable console"</span><span class="token punctuation">,</span> <span class="token comment">// 规则描述</span>\n      category<span class="token operator">:</span> <span class="token string">"Possible Errors"</span><span class="token punctuation">,</span>    <span class="token comment">// 规则类别</span>\n      recommended<span class="token operator">:</span> <span class="token boolean">false</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    schema<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token comment">// 接受一个参数</span>\n      <span class="token punctuation">{</span>\n        type<span class="token operator">:</span> <span class="token string">\'array\'</span><span class="token punctuation">,</span> <span class="token comment">// 接受参数类型为数组</span>\n        items<span class="token operator">:</span> <span class="token punctuation">{</span>\n          type<span class="token operator">:</span> <span class="token string">\'string\'</span> <span class="token comment">// 数组的每一项为一个字符串</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n  <span class="token function-variable function">create</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> logs <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token comment">// console 的所以方法</span>\n        <span class="token string">"debug"</span><span class="token punctuation">,</span> <span class="token string">"error"</span><span class="token punctuation">,</span> <span class="token string">"info"</span><span class="token punctuation">,</span> <span class="token string">"log"</span><span class="token punctuation">,</span> <span class="token string">"warn"</span><span class="token punctuation">,</span> \n        <span class="token string">"dir"</span><span class="token punctuation">,</span> <span class="token string">"dirxml"</span><span class="token punctuation">,</span> <span class="token string">"table"</span><span class="token punctuation">,</span> <span class="token string">"trace"</span><span class="token punctuation">,</span> \n        <span class="token string">"group"</span><span class="token punctuation">,</span> <span class="token string">"groupCollapsed"</span><span class="token punctuation">,</span> <span class="token string">"groupEnd"</span><span class="token punctuation">,</span> \n        <span class="token string">"clear"</span><span class="token punctuation">,</span> <span class="token string">"count"</span><span class="token punctuation">,</span> <span class="token string">"countReset"</span><span class="token punctuation">,</span> <span class="token string">"assert"</span><span class="token punctuation">,</span> \n        <span class="token string">"profile"</span><span class="token punctuation">,</span> <span class="token string">"profileEnd"</span><span class="token punctuation">,</span> \n        <span class="token string">"time"</span><span class="token punctuation">,</span> <span class="token string">"timeLog"</span><span class="token punctuation">,</span> <span class="token string">"timeEnd"</span><span class="token punctuation">,</span> <span class="token string">"timeStamp"</span><span class="token punctuation">,</span> \n        <span class="token string">"context"</span><span class="token punctuation">,</span> <span class="token string">"memory"</span>\n    <span class="token punctuation">]</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n      <span class="token function"><span class="token maybe-class-name">CallExpression</span></span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n         <span class="token comment">// 接受的参数</span>\n        <span class="token keyword">const</span> allowLogs <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token property-access">options</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>\n        <span class="token keyword">const</span> disableLogs <span class="token operator">=</span> <span class="token known-class-name class-name">Array</span><span class="token punctuation">.</span><span class="token method function property-access">isArray</span><span class="token punctuation">(</span>allowLogs<span class="token punctuation">)</span>\n          <span class="token comment">// 过滤掉允许调用的方法</span>\n          <span class="token operator">?</span> logs<span class="token punctuation">.</span><span class="token method function property-access">filter</span><span class="token punctuation">(</span><span class="token parameter">log</span> <span class="token arrow operator">=></span> <span class="token operator">!</span>allowLogs<span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span><span class="token punctuation">)</span>\n          <span class="token operator">:</span> logs\n        <span class="token keyword">const</span> callObj <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">object</span>\n        <span class="token keyword">const</span> callProp <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token property-access">callee</span><span class="token punctuation">.</span><span class="token property-access">property</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>callObj <span class="token operator">||</span> <span class="token operator">!</span>callProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>callObj<span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">!==</span> <span class="token string">\'console\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword control-flow">return</span>\n        <span class="token punctuation">}</span>\n        <span class="token comment">// 检测掉不允许调用的 console 方法</span>\n        <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>disableLogs<span class="token punctuation">.</span><span class="token method function property-access">includes</span><span class="token punctuation">(</span>callProp<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          context<span class="token punctuation">.</span><span class="token method function property-access">report</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            node<span class="token punctuation">,</span>\n            message<span class="token operator">:</span> <span class="token string">\'error: should remove console\'</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>规则写完之后，打开 <code>tests/rules/disable-console.js</code> ，编写测试用例。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> rule <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../../../lib/rules/disable-console"</span><span class="token punctuation">)</span>\n<span class="token keyword">var</span> <span class="token maybe-class-name">RuleTester</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"eslint"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access"><span class="token maybe-class-name">RuleTester</span></span>\n\n<span class="token keyword">var</span> ruleTester <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RuleTester</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\nruleTester<span class="token punctuation">.</span><span class="token method function property-access">run</span><span class="token punctuation">(</span><span class="token string">"disable-console"</span><span class="token punctuation">,</span> rule<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  valid<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n    code<span class="token operator">:</span> <span class="token string">"console.info(test)"</span><span class="token punctuation">,</span>\n    options<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">\'info\'</span><span class="token punctuation">]</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n  invalid<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>\n    code<span class="token operator">:</span> <span class="token string">"console.log(test)"</span><span class="token punctuation">,</span>\n    errors<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> message<span class="token operator">:</span> <span class="token string">"error: should remove console"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>\n  <span class="token punctuation">}</span><span class="token punctuation">]</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-28-0-38-3.png" alt="test"></p>\n<p>最后，只需要引入插件，然后开启规则即可。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// eslintrc.js</span>\nmodule<span class="token punctuation">.</span><span class="token property-access">exports</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  plugins<span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">\'demo\'</span> <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  rules<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token string">\'demo/disable-console\'</span><span class="token operator">:</span> <span class="token punctuation">[</span>\n      <span class="token string">\'error\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span> <span class="token string">\'info\'</span> <span class="token punctuation">]</span>\n    <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/2019-7-28-1-1-19.png" alt="use plugin demo"></p>\n<h2 id="%E6%9C%80%E4%BD%B3%E9%85%8D%E7%BD%AE">最佳配置<a class="anchor" href="#%E6%9C%80%E4%BD%B3%E9%85%8D%E7%BD%AE">§</a></h2>\n<p><img src="https://file.shenfq.com/20190728133740.png" alt="最佳配置"></p>\n<p>业界有许多 JavaScript 的推荐编码规范，较为出名的就是下面两个：</p>\n<ol>\n<li><a href="https://github.com/airbnb/javascript">airbnb style</a></li>\n<li><a href="https://github.com/standard/standard">javascript standard</a></li>\n</ol>\n<p>同时这里也推荐 AlloyTeam 的 <a href="https://github.com/AlloyTeam/eslint-config-alloy">eslint-config-alloy</a>。</p>\n<p>但是代码规范这个东西，最好是团队成员之间一起来制定，确保大家都能够接受，如果实在是有人有异议，就只能少数服从多数了。虽然这节的标题叫最佳配置，但是软件行业并有没有什么方案是最佳方案，即使 javascript standard 也不是 javascript 标准的编码规范，它仅仅只是叫这个名字而已，只有适合的才是最好的。</p>\n<p>最后安利一下，将 ESLint 和 Prettier 结合使用，不仅统一编码规范，也能统一代码风格。具体实践方式，请参考我的文章：<a href="https://juejin.im/post/5b27a326e51d45588a7dac57">使用ESLint+Prettier来统一前端代码风格</a>。</p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>看到这里我们做一个总结，JavaScript 的 linter 工具发展历史其实也不算短，ESLint 之所以能够后来者居上，主要原因还是 JSLint 和 JSHint 采用自顶向下的方式来解析代码，并且早期 JavaScript 语法万年不更新，能这种方式够以较快的速度来解析代码，找到可能存在的语法错误和不规范的代码。但是 ES6 发布之后，JavaScript 语法发生了很多的改动，比如：箭头函数、模板字符串、扩展运算符……，这些语法的发布，导致 JSLint 和 JSHint 如果不更新解析器就没法检测 ES6 的代码。而 ESLint 另辟蹊径，采用 AST 的方式对代码进行静态分析，并保留了强大的可扩展性和灵活的配置能力。这也告诉我们，在日常的编码过程中，一定要考虑到后续的扩展能力。</p>\n<p>正是因为这个强大扩展能力，让业界的很多 JavaScript 编码规范能够在各个团队进行快速的落地，并且团队自己定制的代码规范也可以对外共享。</p>\n<p>最后，希望你通过上面的学习已经理解了 ESLint 带来的好处，同时掌握了 ESLint 的用法，并可以为现有的项目引入 ESLint 改善项目的代码质量。</p>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="https://cn.eslint.org/">ESLint 官网</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/34656263/">JS Linter 进化史</a></li>\n<li><a href="https://zhuanlan.zhihu.com/p/53680918">ESLint 工作原理探讨</a></li>\n</ul>'
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#%E5%89%8D%E8%A8%80">前言</a><ol></ol></li><li><a href="#lint-%E5%B7%A5%E5%85%B7%E7%AE%80%E5%8F%B2">lint 工具简史</a><ol><li><a href="#jslint">JSLint</a></li><li><a href="#jshint">JSHint</a></li><li><a href="#eslint">ESLint</a></li></ol></li><li><a href="#lint-%E5%B7%A5%E5%85%B7%E7%9A%84%E6%84%8F%E4%B9%89">Lint 工具的意义</a><ol></ol></li><li><a href="#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F">使用方式</a><ol><li><a href="#%E5%88%9D%E5%A7%8B%E5%8C%96">初始化</a></li><li><a href="#%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F">配置方式</a><ol></ol></li><li><a href="#%E9%85%8D%E7%BD%AE%E5%8F%82%E6%95%B0">配置参数</a><ol></ol></li><li><a href="#%E8%A7%84%E5%88%99%E8%AE%BE%E7%BD%AE">规则设置</a></li><li><a href="#%E6%89%A9%E5%B1%95">扩展</a></li><li><a href="#%E6%8F%92%E4%BB%B6">插件</a><ol></ol></li></ol></li><li><a href="#%E6%9C%80%E4%BD%B3%E9%85%8D%E7%BD%AE">最佳配置</a></li><li><a href="#%E6%80%BB%E7%BB%93">总结</a></li><li><a href="#%E5%8F%82%E8%80%83">参考</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/07/28",
    'updated': null,
    'excerpt': "前言 小沈是一个刚刚开始工作的前端实习生，第一次进行团队开发，难免有些紧张。在导师的安排下，拿到了项目的 git 权限，开始进行 clone。 $ git clone git@github.com:company/project.git 小沈开始细细品味着同事们的代码，...",
    'cover': "https://file.shenfq.com/20190727153755.png",
    'categories': [
        "前端工程"
    ],
    'tags': [
        "前端",
        "前端工程化",
        "前端工具",
        "ESLint",
        "代码格式化"
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
