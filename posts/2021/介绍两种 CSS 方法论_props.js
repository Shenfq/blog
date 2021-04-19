import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2021/介绍两种 CSS 方法论.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2021/介绍两种 CSS 方法论.html",
    'title': "介绍两种 CSS 方法论",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>介绍两种 CSS 方法论</h1>\n<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>说起 CSS 命名规范，大家应该都很熟悉，或者应该听说过 <a href="https://en.bem.info/"><code>BEM</code></a> 。BEM 是由 Yandex 团队提出的一种 CSS Class 命名方法，旨在帮助开发人员创建更好的且结构一致的 CSS 模块。</p>\n<p>BEM 将页面的类名分为<code>块（Block）</code>、<code>元素（Element）</code>、<code>修饰符（Modifier）</code>。</p>\n<ul>\n<li>块（Block）：一个块是视觉上或者语义上的一个整体，它是一个具体且唯一的一个元素，例如，页面上的一个弹窗，或者是一个搜索框；</li>\n<li>元素（Element）：一般认为是块的组成部分，元素比较用它父级的块名称做为前缀，例如，弹窗的标题、关闭按钮、确认按钮；</li>\n<li>修饰符（Modifier）：修饰符表示一个具体元素的特定状态，例如，关闭按钮在鼠标没放上去和放上去的时候，呈现的两种状态。</li>\n</ul>\n<p>现在用 Bootstrap 的弹窗组件，举一个更加具体的例子：</p>\n<p><img src="https://file.shenfq.com/pic/20210103214204.png" alt=""></p>\n<p>鼠标放上去和没放上去的状态是有区别的。</p>\n<p><img src="https://file.shenfq.com/pic/20210103214329.png" alt=""></p>\n<p>通过上面的示例可以看出，块与元素是通过<code>两个下划线（__）</code>连接的，而元素和修饰符之间是通过<code>两个短横线（--）</code>连接的。</p>\n<p>当然，今天的文章不会着重介绍什么是 BEM，如果你之前没接触过 BEM 可以尝试去了解一下，并且多在在项目中试用几次，感受他的魅力。另外，现在网上已经有非常多的文章在介绍 BEM 了，耐心找，肯定能找到优秀的教程的。今天的文章会分享比较少人介绍的两种 CSS 方法论：SUIT CSS 和 SMACSS。</p>\n<h2 id="suit-css">SUIT CSS<a class="anchor" href="#suit-css">§</a></h2>\n<blockquote>\n<p>官方文档：SUIT CSS命名约定(<a href="https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md">https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md</a>)</p>\n</blockquote>\n<p>SUIT CSS是一种基于组件开发的 CSS 的方法论，它将类名分为两种类型：<code>工具类</code>和<code>组件类</code>。</p>\n<h3 id="%E5%B7%A5%E5%85%B7%E7%B1%BB">工具类<a class="anchor" href="#%E5%B7%A5%E5%85%B7%E7%B1%BB">§</a></h3>\n<p>CSS 中有很多固定工具类，比如：左右浮动、文本截断、垂直居中……。工具类的作用是帮助程序减少一些重复代码，并提供一致的实现。</p>\n<p><strong>命名规则：</strong><code>u-[sm-|md-|lg-]&lt;工具类名&gt;</code>。工具类使用 <code>u-</code> 打头，后面接类名（类名使用驼峰的方式命名），中间可以加上 <code>sm</code>、<code>md</code>、<code>lg</code> 这种响应式的规则。</p>\n<p><strong>举个栗子：</strong></p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-cf<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token comment">&lt;!-- 左浮动 --></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-floatLeft<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://blog.shenfq.com/">https://blog.shenfq.com/</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    👉看看我的博客\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n  <span class="token comment">&lt;!-- 文本截断，最大宽度200px --></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-textBreak u-maxWidth200<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E7%BB%84%E4%BB%B6%E7%B1%BB">组件类<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%B1%BB">§</a></h3>\n<p>组件类用来描述一个个具体的组件，组件是构成一个具体应用程序的基石，所以组件的设计特别重要。</p>\n<p><strong>命名规则：</strong><code>[&lt;命名空间&gt;-]&lt;组件名&gt;[-后代名][--修饰符]</code>，这样的命名方式，在编写 HTML 和 CSS 的时候有几个好处：</p>\n<ul>\n<li>有助于区分组件的根元素，后代元素，以及用来修饰的类；</li>\n<li>降级类名重复的几率；</li>\n<li>能够让类名更具有语义化；</li>\n</ul>\n<p>下面来看看命名规则的各个部分的具体作用：</p>\n<h4 id="%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E5%8F%AF%E9%80%89">命名空间（可选）<a class="anchor" href="#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E5%8F%AF%E9%80%89">§</a></h4>\n<p>命名空间是可选的，如果你希望避免自己定义的组件类名与引入的第三方样式类名发生冲突，则可以为自己的类名加上命名空间。但是，如果你们业务中不存在第三方的样式，则可以不带命名空间。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.sfq-Modal</span></span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">/* 我的弹窗组件 */</span>\n<span class="token selector"><span class="token class">.sfq-Button</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">/* 我的按钮组件 */</span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D">组件名<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D">§</a></h4>\n<p>组件名使用大驼峰规则（首字母大写的驼峰规则，Pascal Case）来命名，使用这种方式也可以尽可能的避免出现同名样式的冲突。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.Modal</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  …\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%90%8E%E4%BB%A3%E5%90%8D">组件名-后代名<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%90%8E%E4%BB%A3%E5%90%8D">§</a></h4>\n<p>组件的后代指附加在组件上的一部分，例如，弹窗组件的标题、按钮等等。后代名称使用小驼峰规则（首字母大写的驼峰规则，Camel Case）命名。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-title<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-titleName<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-closeBtn<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>X<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-content<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D--%E4%BF%AE%E9%A5%B0%E7%AC%A6">组件名--修饰符<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D--%E4%BF%AE%E9%A5%B0%E7%AC%A6">§</a></h4>\n<p>修饰符是一种表示组件特定状态的类名，修饰符名称同样使用小驼峰规则来命名，并且和组件名直接需要用<code>两个短横线（--）</code>进行连接，这与 BEM 表现一致。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Button Button--default<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点击关注「更了不起的前端」<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Button Button--primary<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点击关注「更了不起的前端」<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E5%8F%98%E9%87%8F%E5%90%8D">变量名<a class="anchor" href="#%E5%8F%98%E9%87%8F%E5%90%8D">§</a></h3>\n<p>SUIT CSS 除了定义了工具类、组件类这两种命名方式外，还有定义了 CSS 变量的命名方式。<strong>命名规则：</strong> <code>--组件名[-后代名|--修饰符]-(CSS属性|变量名)</code>。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token pseudo-class">:root</span></span> <span class="token punctuation">{</span>\n  <span class="token comment">/* 基础按钮的背景色 */</span>\n  <span class="token variable">--Button--default-backgroundColor</span><span class="token punctuation">:</span> <span class="token hexcode color">#909399</span><span class="token punctuation">;</span>\n  <span class="token comment">/* 主要按钮的背景色 */</span>\n  <span class="token variable">--Button--primary-backgroundColor</span><span class="token punctuation">:</span> <span class="token hexcode color">#409EFF</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="suit-css-%E5%B0%8F%E7%BB%93">SUIT CSS 小结<a class="anchor" href="#suit-css-%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>SUIT CSS 除了定义了工具类、组件类的命名方式外，还提供了完整的基础类，以及测试套件用来检测你的 CSS 类名是否符合规范，具体使用方法可以查看<a href="https://github.com/suitcss/suit">官方文档（https://github.com/suitcss/suit）</a>。SUIT CSS 可以说在 BEM 的基础上进行了改进，特别是去除了双下划线的设计，在观感上就比 BEM 美观了许多，而且各种名称都是通过驼峰的方式命名，省略了部分短横线，这让 SUIT CSS 的类名的长度上也会比 BEM 更加精简。</p>\n<h2 id="smacss">SMACSS<a class="anchor" href="#smacss">§</a></h2>\n<blockquote>\n<p>SMACSS 官网：<a href="http://smacss.com/">http://smacss.com/</a></p>\n</blockquote>\n<p>SMACSS （Scalable and Modular Architecture for CSS）是一套易开发，易维护的 CSS 编写的方法论，它将 CSS 规则一共分为五大类：</p>\n<ol>\n<li>Base（基础）</li>\n<li>Layout（布局）</li>\n<li>Module（模块）</li>\n<li>State（状态）</li>\n<li>Theme（主题）</li>\n</ol>\n<p>你应该能在你现有项目的样式里发现上面的五个分类，这几种类型的样式混合在一起会让你的代码显得特别复杂，如果你有意识将这些样式归类，将大大降低复杂度。除了将样式归类之外，每个类别还有一些适用的准则。</p>\n<h3 id="%E5%9F%BA%E7%A1%80%E8%A7%84%E5%88%99">基础规则<a class="anchor" href="#%E5%9F%BA%E7%A1%80%E8%A7%84%E5%88%99">§</a></h3>\n<p>基础规则作用于元素选择器，用于定义 HTML 标签的默认样式。基础样式主要用于设置标题大小，默认链接颜色，默认字体样式以及<code>body</code>背景等。</p>\n<pre class="language-css"><code class="language-css"><span class="token comment">/* 基础样式示例 */</span>\n<span class="token selector">body<span class="token punctuation">,</span> form</span> <span class="token punctuation">{</span>\n    <span class="token property">margin</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">;</span>\n    <span class="token property">padding</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">a</span> <span class="token punctuation">{</span>\n    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token hexcode color">#039</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">a<span class="token pseudo-class">:hover</span></span> <span class="token punctuation">{</span>\n    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token hexcode color">#03F</span><span class="token punctuation">;</span>    \n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B8%83%E5%B1%80%E8%A7%84%E5%88%99">布局规则<a class="anchor" href="#%E5%B8%83%E5%B1%80%E8%A7%84%E5%88%99">§</a></h3>\n<p>CSS 的本质上来说就是布局页面中的元素的，但是，页面各个元素也是有主次之分的。例如，头部、尾部这种大的区块就是主要组件，我们称之为布局（Layout）。而导航栏（属于头部），网站说明（属于尾部）这种区块为次要组件，我们称之为模块（Module）。</p>\n<p>下面举个具体的案例，来看看掘金的页面布局：</p>\n<p><img src="https://file.shenfq.com/pic/20210105110758.png" alt="juejin.cn"></p>\n<p>页面上有一个头部，一个导航条，一个内容区域以及一个侧边栏，这些都属于布局的部分。</p>\n<p><img src="https://file.shenfq.com/pic/20210105111358.png" alt="juejin.cn"></p>\n<p>SMACSS 中允许在布局样式中，使用 ID 选择器，有助于在 HTML 中一眼区分出节点在布局中的位置。其他的非 ID 选择器的类，需要添加 <code>l-</code> 前缀，表示这属于布局样式。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>header<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>navigation<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>content<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>l-left<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>sidebar<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>l-right<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E6%A8%A1%E5%9D%97%E8%A7%84%E5%88%99">模块规则<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E8%A7%84%E5%88%99">§</a></h3>\n<p>前面提到过模块，模块是相对与布局组件来说，更加松散的次要组件，这个区分确实比较模糊，所以有一些方案也取消了布局规则，将所有可重用组件都划分为模块。</p>\n<p>模块规则在官方文档没有详细的命名风格，我看了很多文章，在命名模块的时候基本都是在参考 BEM，所以这里不再单独介绍。</p>\n<h3 id="%E7%8A%B6%E6%80%81%E8%A7%84%E5%88%99">状态规则<a class="anchor" href="#%E7%8A%B6%E6%80%81%E8%A7%84%E5%88%99">§</a></h3>\n<p>状态是用来描述模块在不同状态下的外观，使用 <code>is-</code> 前缀，这有助于我们在 HTML 中区分元素的状态。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>header<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token comment">&lt;!-- 表示被选中 --></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav--item is-selected<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav--item<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>某些状态优先级比较高，可以酌情加上 <code>!important</code>，例如用来控制元素显示或隐藏的。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.is-hide</span></span> <span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> none <span class="token important">!important</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token selector"><span class="token class">.is-show</span></span> <span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> block <span class="token important">!important</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="smacss-%E5%B0%8F%E7%BB%93">SMACSS 小结<a class="anchor" href="#smacss-%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>这里没有特别介绍主题规则，因为主题在当前这个时间，基本已经被 CSS 变量所替代。SMACSS 有很多的规则这里没有详细列出来，但是在关于 CSS 如何命名方面的规则其实比较少，而且它的布局规则与模块规则确实有些模糊，不太好区分。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u4ECB\u7ECD\u4E24\u79CD CSS \u65B9\u6CD5\u8BBA"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E5%89%8D%E8%A8%80">前言<a class="anchor" href="#%E5%89%8D%E8%A8%80">§</a></h2>\n<p>说起 CSS 命名规范，大家应该都很熟悉，或者应该听说过 <a href="https://en.bem.info/"><code>BEM</code></a> 。BEM 是由 Yandex 团队提出的一种 CSS Class 命名方法，旨在帮助开发人员创建更好的且结构一致的 CSS 模块。</p>\n<p>BEM 将页面的类名分为<code>块（Block）</code>、<code>元素（Element）</code>、<code>修饰符（Modifier）</code>。</p>\n<ul>\n<li>块（Block）：一个块是视觉上或者语义上的一个整体，它是一个具体且唯一的一个元素，例如，页面上的一个弹窗，或者是一个搜索框；</li>\n<li>元素（Element）：一般认为是块的组成部分，元素比较用它父级的块名称做为前缀，例如，弹窗的标题、关闭按钮、确认按钮；</li>\n<li>修饰符（Modifier）：修饰符表示一个具体元素的特定状态，例如，关闭按钮在鼠标没放上去和放上去的时候，呈现的两种状态。</li>\n</ul>\n<p>现在用 Bootstrap 的弹窗组件，举一个更加具体的例子：</p>\n<p><img src="https://file.shenfq.com/pic/20210103214204.png" alt=""></p>\n<p>鼠标放上去和没放上去的状态是有区别的。</p>\n<p><img src="https://file.shenfq.com/pic/20210103214329.png" alt=""></p>\n<p>通过上面的示例可以看出，块与元素是通过<code>两个下划线（__）</code>连接的，而元素和修饰符之间是通过<code>两个短横线（--）</code>连接的。</p>\n<p>当然，今天的文章不会着重介绍什么是 BEM，如果你之前没接触过 BEM 可以尝试去了解一下，并且多在在项目中试用几次，感受他的魅力。另外，现在网上已经有非常多的文章在介绍 BEM 了，耐心找，肯定能找到优秀的教程的。今天的文章会分享比较少人介绍的两种 CSS 方法论：SUIT CSS 和 SMACSS。</p>\n<h2 id="suit-css">SUIT CSS<a class="anchor" href="#suit-css">§</a></h2>\n<blockquote>\n<p>官方文档：SUIT CSS命名约定(<a href="https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md">https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md</a>)</p>\n</blockquote>\n<p>SUIT CSS是一种基于组件开发的 CSS 的方法论，它将类名分为两种类型：<code>工具类</code>和<code>组件类</code>。</p>\n<h3 id="%E5%B7%A5%E5%85%B7%E7%B1%BB">工具类<a class="anchor" href="#%E5%B7%A5%E5%85%B7%E7%B1%BB">§</a></h3>\n<p>CSS 中有很多固定工具类，比如：左右浮动、文本截断、垂直居中……。工具类的作用是帮助程序减少一些重复代码，并提供一致的实现。</p>\n<p><strong>命名规则：</strong><code>u-[sm-|md-|lg-]&lt;工具类名&gt;</code>。工具类使用 <code>u-</code> 打头，后面接类名（类名使用驼峰的方式命名），中间可以加上 <code>sm</code>、<code>md</code>、<code>lg</code> 这种响应式的规则。</p>\n<p><strong>举个栗子：</strong></p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-cf<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token comment">&lt;!-- 左浮动 --></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-floatLeft<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><a class="token url-link" href="https://blog.shenfq.com/">https://blog.shenfq.com/</a><span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    👉看看我的博客\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>\n  <span class="token comment">&lt;!-- 文本截断，最大宽度200px --></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>u-textBreak u-maxWidth200<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E7%BB%84%E4%BB%B6%E7%B1%BB">组件类<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E7%B1%BB">§</a></h3>\n<p>组件类用来描述一个个具体的组件，组件是构成一个具体应用程序的基石，所以组件的设计特别重要。</p>\n<p><strong>命名规则：</strong><code>[&lt;命名空间&gt;-]&lt;组件名&gt;[-后代名][--修饰符]</code>，这样的命名方式，在编写 HTML 和 CSS 的时候有几个好处：</p>\n<ul>\n<li>有助于区分组件的根元素，后代元素，以及用来修饰的类；</li>\n<li>降级类名重复的几率；</li>\n<li>能够让类名更具有语义化；</li>\n</ul>\n<p>下面来看看命名规则的各个部分的具体作用：</p>\n<h4 id="%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E5%8F%AF%E9%80%89">命名空间（可选）<a class="anchor" href="#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E5%8F%AF%E9%80%89">§</a></h4>\n<p>命名空间是可选的，如果你希望避免自己定义的组件类名与引入的第三方样式类名发生冲突，则可以为自己的类名加上命名空间。但是，如果你们业务中不存在第三方的样式，则可以不带命名空间。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.sfq-Modal</span></span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">/* 我的弹窗组件 */</span>\n<span class="token selector"><span class="token class">.sfq-Button</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token comment">/* 我的按钮组件 */</span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D">组件名<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D">§</a></h4>\n<p>组件名使用大驼峰规则（首字母大写的驼峰规则，Pascal Case）来命名，使用这种方式也可以尽可能的避免出现同名样式的冲突。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.Modal</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  …\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%90%8E%E4%BB%A3%E5%90%8D">组件名-后代名<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D-%E5%90%8E%E4%BB%A3%E5%90%8D">§</a></h4>\n<p>组件的后代指附加在组件上的一部分，例如，弹窗组件的标题、按钮等等。后代名称使用小驼峰规则（首字母大写的驼峰规则，Camel Case）命名。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-title<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-titleName<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-closeBtn<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>X<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Modal-content<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    爱折腾的前端工程师，欢迎关注我的公众号「更了不起的前端」\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h4 id="%E7%BB%84%E4%BB%B6%E5%90%8D--%E4%BF%AE%E9%A5%B0%E7%AC%A6">组件名--修饰符<a class="anchor" href="#%E7%BB%84%E4%BB%B6%E5%90%8D--%E4%BF%AE%E9%A5%B0%E7%AC%A6">§</a></h4>\n<p>修饰符是一种表示组件特定状态的类名，修饰符名称同样使用小驼峰规则来命名，并且和组件名直接需要用<code>两个短横线（--）</code>进行连接，这与 BEM 表现一致。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Button Button--default<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点击关注「更了不起的前端」<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Button Button--primary<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点击关注「更了不起的前端」<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E5%8F%98%E9%87%8F%E5%90%8D">变量名<a class="anchor" href="#%E5%8F%98%E9%87%8F%E5%90%8D">§</a></h3>\n<p>SUIT CSS 除了定义了工具类、组件类这两种命名方式外，还有定义了 CSS 变量的命名方式。<strong>命名规则：</strong> <code>--组件名[-后代名|--修饰符]-(CSS属性|变量名)</code>。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token pseudo-class">:root</span></span> <span class="token punctuation">{</span>\n  <span class="token comment">/* 基础按钮的背景色 */</span>\n  <span class="token variable">--Button--default-backgroundColor</span><span class="token punctuation">:</span> <span class="token hexcode color">#909399</span><span class="token punctuation">;</span>\n  <span class="token comment">/* 主要按钮的背景色 */</span>\n  <span class="token variable">--Button--primary-backgroundColor</span><span class="token punctuation">:</span> <span class="token hexcode color">#409EFF</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="suit-css-%E5%B0%8F%E7%BB%93">SUIT CSS 小结<a class="anchor" href="#suit-css-%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>SUIT CSS 除了定义了工具类、组件类的命名方式外，还提供了完整的基础类，以及测试套件用来检测你的 CSS 类名是否符合规范，具体使用方法可以查看<a href="https://github.com/suitcss/suit">官方文档（https://github.com/suitcss/suit）</a>。SUIT CSS 可以说在 BEM 的基础上进行了改进，特别是去除了双下划线的设计，在观感上就比 BEM 美观了许多，而且各种名称都是通过驼峰的方式命名，省略了部分短横线，这让 SUIT CSS 的类名的长度上也会比 BEM 更加精简。</p>\n<h2 id="smacss">SMACSS<a class="anchor" href="#smacss">§</a></h2>\n<blockquote>\n<p>SMACSS 官网：<a href="http://smacss.com/">http://smacss.com/</a></p>\n</blockquote>\n<p>SMACSS （Scalable and Modular Architecture for CSS）是一套易开发，易维护的 CSS 编写的方法论，它将 CSS 规则一共分为五大类：</p>\n<ol>\n<li>Base（基础）</li>\n<li>Layout（布局）</li>\n<li>Module（模块）</li>\n<li>State（状态）</li>\n<li>Theme（主题）</li>\n</ol>\n<p>你应该能在你现有项目的样式里发现上面的五个分类，这几种类型的样式混合在一起会让你的代码显得特别复杂，如果你有意识将这些样式归类，将大大降低复杂度。除了将样式归类之外，每个类别还有一些适用的准则。</p>\n<h3 id="%E5%9F%BA%E7%A1%80%E8%A7%84%E5%88%99">基础规则<a class="anchor" href="#%E5%9F%BA%E7%A1%80%E8%A7%84%E5%88%99">§</a></h3>\n<p>基础规则作用于元素选择器，用于定义 HTML 标签的默认样式。基础样式主要用于设置标题大小，默认链接颜色，默认字体样式以及<code>body</code>背景等。</p>\n<pre class="language-css"><code class="language-css"><span class="token comment">/* 基础样式示例 */</span>\n<span class="token selector">body<span class="token punctuation">,</span> form</span> <span class="token punctuation">{</span>\n    <span class="token property">margin</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">;</span>\n    <span class="token property">padding</span><span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">a</span> <span class="token punctuation">{</span>\n    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token hexcode color">#039</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">a<span class="token pseudo-class">:hover</span></span> <span class="token punctuation">{</span>\n    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token hexcode color">#03F</span><span class="token punctuation">;</span>    \n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="%E5%B8%83%E5%B1%80%E8%A7%84%E5%88%99">布局规则<a class="anchor" href="#%E5%B8%83%E5%B1%80%E8%A7%84%E5%88%99">§</a></h3>\n<p>CSS 的本质上来说就是布局页面中的元素的，但是，页面各个元素也是有主次之分的。例如，头部、尾部这种大的区块就是主要组件，我们称之为布局（Layout）。而导航栏（属于头部），网站说明（属于尾部）这种区块为次要组件，我们称之为模块（Module）。</p>\n<p>下面举个具体的案例，来看看掘金的页面布局：</p>\n<p><img src="https://file.shenfq.com/pic/20210105110758.png" alt="juejin.cn"></p>\n<p>页面上有一个头部，一个导航条，一个内容区域以及一个侧边栏，这些都属于布局的部分。</p>\n<p><img src="https://file.shenfq.com/pic/20210105111358.png" alt="juejin.cn"></p>\n<p>SMACSS 中允许在布局样式中，使用 ID 选择器，有助于在 HTML 中一眼区分出节点在布局中的位置。其他的非 ID 选择器的类，需要添加 <code>l-</code> 前缀，表示这属于布局样式。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>header<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>navigation<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>content<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>l-left<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>sidebar<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>l-right<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n</code></pre>\n<h3 id="%E6%A8%A1%E5%9D%97%E8%A7%84%E5%88%99">模块规则<a class="anchor" href="#%E6%A8%A1%E5%9D%97%E8%A7%84%E5%88%99">§</a></h3>\n<p>前面提到过模块，模块是相对与布局组件来说，更加松散的次要组件，这个区分确实比较模糊，所以有一些方案也取消了布局规则，将所有可重用组件都划分为模块。</p>\n<p>模块规则在官方文档没有详细的命名风格，我看了很多文章，在命名模块的时候基本都是在参考 BEM，所以这里不再单独介绍。</p>\n<h3 id="%E7%8A%B6%E6%80%81%E8%A7%84%E5%88%99">状态规则<a class="anchor" href="#%E7%8A%B6%E6%80%81%E8%A7%84%E5%88%99">§</a></h3>\n<p>状态是用来描述模块在不同状态下的外观，使用 <code>is-</code> 前缀，这有助于我们在 HTML 中区分元素的状态。</p>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>header</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>header<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n    <span class="token comment">&lt;!-- 表示被选中 --></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav--item is-selected<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav--item<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>欢迎关注<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>header</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>某些状态优先级比较高，可以酌情加上 <code>!important</code>，例如用来控制元素显示或隐藏的。</p>\n<pre class="language-css"><code class="language-css"><span class="token selector"><span class="token class">.is-hide</span></span> <span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> none <span class="token important">!important</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token selector"><span class="token class">.is-show</span></span> <span class="token punctuation">{</span>\n    <span class="token property">display</span><span class="token punctuation">:</span> block <span class="token important">!important</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h3 id="smacss-%E5%B0%8F%E7%BB%93">SMACSS 小结<a class="anchor" href="#smacss-%E5%B0%8F%E7%BB%93">§</a></h3>\n<p>这里没有特别介绍主题规则，因为主题在当前这个时间，基本已经被 CSS 变量所替代。SMACSS 有很多的规则这里没有详细列出来，但是在关于 CSS 如何命名方面的规则其实比较少，而且它的布局规则与模块规则确实有些模糊，不太好区分。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%89%8D%E8%A8%80" }, "\u524D\u8A00")),
            React.createElement("li", null,
                React.createElement("a", { href: "#suit-css" }, "SUIT CSS"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B7%A5%E5%85%B7%E7%B1%BB" }, "\u5DE5\u5177\u7C7B")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%BB%84%E4%BB%B6%E7%B1%BB" }, "\u7EC4\u4EF6\u7C7B"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%8F%98%E9%87%8F%E5%90%8D" }, "\u53D8\u91CF\u540D")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#suit-css-%E5%B0%8F%E7%BB%93" }, "SUIT CSS \u5C0F\u7ED3")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#smacss" }, "SMACSS"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%9F%BA%E7%A1%80%E8%A7%84%E5%88%99" }, "\u57FA\u7840\u89C4\u5219")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%B8%83%E5%B1%80%E8%A7%84%E5%88%99" }, "\u5E03\u5C40\u89C4\u5219")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A8%A1%E5%9D%97%E8%A7%84%E5%88%99" }, "\u6A21\u5757\u89C4\u5219")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%8A%B6%E6%80%81%E8%A7%84%E5%88%99" }, "\u72B6\u6001\u89C4\u5219")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#smacss-%E5%B0%8F%E7%BB%93" }, "SMACSS \u5C0F\u7ED3")))))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2021/01/05",
    'updated': null,
    'excerpt': "前言 说起 CSS 命名规范，大家应该都很熟悉，或者应该听说过 BEM 。BEM 是由 Yandex 团队提出的一种 CSS Class 命名方法，旨在帮助开发人员创建更好的且结构一致的 CSS 模块。 BEM 将页面的类名分为块（Block）、元素（Element...",
    'cover': "https://file.shenfq.com/pic/20210103214204.png",
    'categories': [
        "前端"
    ],
    'tags': [
        "CSS",
        "前端",
        "样式",
        "组件化",
        "工程化"
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
