import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/【翻译】Vue.js 的注意事项与技巧.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/【翻译】Vue.js 的注意事项与技巧.html",
    'title': "【翻译】Vue.js 的注意事项与技巧",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>【翻译】Vue.js 的注意事项与技巧</h1>\n<p>原文链接：<a href="https://blog.webf.zone/vue-js-considerations-and-tricks-fa7e0e4bb7bb">Vue.js — Considerations and Tricks</a></p>\n<p><img src="https://file.shenfq.com/FjFxhMxwH4RWxzhXmnKlhcxjQ2Ap.png" alt=""></p>\n<p>Vue.js 是一个很棒的框架。然而，当你开始构建一个大型 JavaScript 项目的时候，你将对 Vue.js 感到一些困惑。这些困惑并不是来自框架本身，相反 Vue.js 团队会经常调整一些重要设计策略。</p>\n<p>相对于 React 和 Angular，Vue.js 面向一些不同水平的开发者。它更加的友好，不管是对初学者还是经验丰富的老手。它并不隐藏一些 DOM 操作，相反它与 DOM 配合的很好。</p>\n<p>这篇文章更像是一个目录，列举了我在 Vue.js 的初学路上遇到一些问题和技巧。理解这些关键性的设计技巧，有助于我们构建大型的 Web 应用。</p>\n<p>写这篇文章的时候是 2018 年 5 月 18 日，下面这些技巧依然是有效的。但是框架升级，或者浏览器底层或者 JS API 发生改变时，他们可能会变得不是那么有用。</p>\n<blockquote>\n<p>译者注：尽管 Vue.js 3 即将到来，但是下面的技巧大部分是有用的，因为 3 的版本并不会改变一些上层 API ，最大的特性可能是底层数据 Observer 改有 proxy 实现，以及源码使用 typescript 构建。</p>\n</blockquote>\n<hr>\n<h2 id="1%E4%B8%BA%E4%BB%80%E4%B9%88-vuejs-%E4%B8%8D%E4%BD%BF%E7%94%A8-es-classes-%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E5%86%99%E7%BB%84%E4%BB%B6">1、为什么 Vue.js 不使用 ES Classes 的方式编写组件<a class="anchor" href="#1%E4%B8%BA%E4%BB%80%E4%B9%88-vuejs-%E4%B8%8D%E4%BD%BF%E7%94%A8-es-classes-%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E5%86%99%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>如果你使用过类似于 Angular 的框架或者某些后端 OOP 语言后，那么你的第一个问题可能是：为什么不使用 Class 形式的组件？</p>\n<p>Vue.js 的作者在 GitHub issues 中很好的回答了这个问题：\n<a href="https://github.com/vuejs/vue/issues/2371">Use standard JS classes instead of custom syntax?</a></p>\n<p>为什么不使用 Class 这里有三个很重要的原因：</p>\n<ol>\n<li>ES Classes 不能够满足当前 Vue.js 的需求，ES Classes 标准还没有完全规范化，并且总是朝着错误的方向发展。如果 Classes 的私有属性和装饰器（当前已进入 Stage 3）稳定后，可能会有一定帮助。</li>\n<li>ES Classes 只适合于那些熟悉面向对象语言的人，它对哪些不使用复杂构建工具和编译器的人不够友好。</li>\n<li>优秀的 UI 组件层次结构一般都是组件的横向组合，它并不是基于继承的层次结构。而 Classes 形式显然更擅长的是后者。</li>\n</ol>\n<blockquote>\n<p>译者注：But，Vue.js 3.0 将支持基于 Class 的组件写法，真香。</p>\n</blockquote>\n<h2 id="2%E5%A6%82%E4%BD%95%E6%9E%84%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E8%B1%A1%E7%BB%84%E4%BB%B6">2、如何构建自己的抽象组件？<a class="anchor" href="#2%E5%A6%82%E4%BD%95%E6%9E%84%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E8%B1%A1%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>如果你想构建自己的抽象组件（比如 transition、keep-alive），这是一个比构建大型 web 应用更加疯狂地想法，这里有一些关于这个问题的讨论，但是并没有什么进展。</p>\n<p><a href="https://github.com/vuejs/vuejs.org/issues/720">Any plan for docs of abstract components?</a></p>\n<blockquote>\n<p>译者注：在 Vue.js 内部组件（transition、keep-alive）中，使用了一个 abstract 属性，用于声明抽象组件，这个属性作者并不打算开放给大家使用，所以文档也没有提及。但是如果你要使用也是可以的，那么你必须深入源码探索该属性有何作用。</p>\n</blockquote>\n<p>但是不要害怕，如果你可以很好地理解 slots ，你就可以构建自己的抽象组件了。这里有一篇很好的博客介绍了要如何做到这一点。</p>\n<p><a href="https://alligator.io/vuejs/vue-abstract-components/">Writing Abstract Components with Vue.js</a></p>\n<blockquote>\n<p>译者注：下面是《在 Vue.js 中构建抽象组件》的简单翻译</p>\n</blockquote>\n<pre><code>抽象组件与普通组件一样，只是它不会在界面上显示任何 DOM 元素。它们只是为现有组件添加额外的行为。\n就像很多你已经熟悉的 Vue.js 的内置组件，比如：`&lt;transition&gt;`、`&lt;keep-alive&gt;`、`&lt;slot&gt;`。\n\n现在展示一个案例，如何跟踪一个 DOM 已经进入了可视区域 ，让我们使用 IntersectionObserver API 来实现一个解决这个问题的抽象组件。\n（完整代码在这里：[vue-intersect](https://github.com/heavyy/vue-intersect)）\n</code></pre>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// IntersectionObserver.vue</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 在 Vue 中启用抽象组件</span>\n  <span class="token comment">// 此属性不在官方文档中， 可能随时发生更改，但是我们的组件必须使用它</span>\n  abstract<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token comment">// 重新实现一个 render 函数</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 我们不需要任何包裹的元素，只需要返回子组件即可</span>\n    <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$slots</span><span class="token punctuation">.</span><span class="token keyword module">default</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'IntersectionObserver.vue can only render one, and exactly one child component.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">mounted</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 创建一个 IntersectionObserver 实例</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IntersectionObserver</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">entries</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">$emit</span><span class="token punctuation">(</span>entries<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">isIntersecting</span> <span class="token operator">?</span> <span class="token string">\'intersect-enter\'</span> <span class="token operator">:</span> <span class="token string">\'intersect-leave\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>entries<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 需要等待下一个事件队列，保证子元素已经渲染</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">$nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span><span class="token punctuation">.</span><span class="token method function property-access">observe</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$slots</span><span class="token punctuation">.</span><span class="token keyword module">default</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">elm</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">destroyed</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 确保组件移除时，IntersectionObserver 实例也会停止监听</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span><span class="token punctuation">.</span><span class="token method function property-access">disconnect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre><code>让我们看看如何使用它？\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>intersection-observer</span> <span class="token attr-name">@intersect-enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleEnter<span class="token punctuation">"</span></span> <span class="token attr-name">@intersect-leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleLeave<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-honest-to-goodness-component</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-honest-to-goodness-component</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>intersection-observer</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>但是在这样做之前，请你三思。我们一般依赖 mixins 和一些纯函数来解决一些特殊场景的问题，你可以将 mixins 直接看做一个抽象组件。</p>\n<p><a href="https://stackoverflow.com/questions/35964116/how-do-i-extend-another-vuejs-component-in-a-single-file-component-es6-vue-loa/35964246#35964246">How do I extend another VueJS component in a single-file component? (ES6 vue-loader)</a></p>\n<h2 id="3%E6%88%91%E4%B8%8D%E5%A4%AA%E5%96%9C%E6%AC%A2-vuejs-%E7%9A%84%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%88%91%E6%9B%B4%E5%B8%8C%E6%9C%9B-htmlcss-%E5%92%8C-javascript-%E5%88%86%E7%A6%BB">3、我不太喜欢 Vue.js 的单文件组件，我更希望 HTML、CSS 和 JavaScript 分离。<a class="anchor" href="#3%E6%88%91%E4%B8%8D%E5%A4%AA%E5%96%9C%E6%AC%A2-vuejs-%E7%9A%84%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%88%91%E6%9B%B4%E5%B8%8C%E6%9C%9B-htmlcss-%E5%92%8C-javascript-%E5%88%86%E7%A6%BB">§</a></h2>\n<p>没有人阻止你这样做，如果你是个注重分离的哲学家，喜欢把不同的东西放在不同文件，或者讨厌编辑器对 <code>.vue</code> 文件的不稳定行为，那么你这么做也是可以的。你要做的很简单：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!--<a class="token url-link" href="https://vuejs.org/v2/guide/single-file-components.html">https://vuejs.org/v2/guide/single-file-components.html</a> --></span>\n<span class="token comment">&lt;!-- my-component.vue --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.html<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.css<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token style"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这么做，就会出现下一个问题：<strong>我的组件总是需要 4 个文件（vue + html + css + js）吗？我能不能摆脱 <code>.vue</code> 文件？</strong> 答案是肯定的，你可以使用 <a href="https://github.com/ktsn/vue-template-loader"><code>vue-template-loader</code></a>。</p>\n<p>我的同事还为此写了一篇很棒的教程：</p>\n<p><a href="https://alligator.io/vuejs/vue-template-loader/">Using vue-template-loader with Vue.js to Compile HTML Templates</a></p>\n<h2 id="4-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4、 函数式组件<a class="anchor" href="#4-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>感谢 React.js 让函数式组件很流行，这是因为他们无状态、易于测试。然而它们也存在一些问题。</p>\n<blockquote>\n<p>译者注：不了解 Vue.js 函数式组件的可以先在官方文档查看：<a href="https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">官方文档</a></p>\n</blockquote>\n<h3 id="41-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E4%B8%8D%E8%83%BD%E5%AF%B9%E5%8A%9F%E8%83%BD%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%9F%BA%E4%BA%8E-class-%E7%9A%84-component-%E8%A3%85%E9%A5%B0%E5%99%A8">4.1 为什么我不能对功能组件使用基于 Class 的 @Component 装饰器？<a class="anchor" href="#41-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E4%B8%8D%E8%83%BD%E5%AF%B9%E5%8A%9F%E8%83%BD%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%9F%BA%E4%BA%8E-class-%E7%9A%84-component-%E8%A3%85%E9%A5%B0%E5%99%A8">§</a></h3>\n<p>再次回到 Classes，它只是一种用于保存本地状态的数据结构。如果函数式组件是无状态的，那么使用 @Component 装饰器就是无意义的。</p>\n<p>这里有关于这个的讨论：</p>\n<p><a href="https://github.com/vuejs/vue-class-component/issues/120">How to create functional component in @Component?</a></p>\n<h3 id="42-%E5%A4%96%E9%83%A8%E7%B1%BB%E5%92%8C%E6%A0%B7%E5%BC%8F%E4%B8%8D%E5%BA%94%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4.2 外部类和样式不应用于函数式组件<a class="anchor" href="#42-%E5%A4%96%E9%83%A8%E7%B1%BB%E5%92%8C%E6%A0%B7%E5%BC%8F%E4%B8%8D%E5%BA%94%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">§</a></h3>\n<p>函数式组件不能像普通组件那样，绑定具体的类和样式，必须在 render 函数中手动应用这些绑定。</p>\n<p><a href="https://github.com/vuejs/vue-loader/issues/1014">DOM class attribute not rendered properly with functional components</a></p>\n<p><a href="https://github.com/vuejs/vue/issues/7554">class attribute ignored on functional components</a></p>\n<h3 id="43-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%80%BB%E6%98%AF%E4%BC%9A%E9%87%8D%E5%A4%8D%E6%B8%B2%E6%9F%93">4.3 函数式组件总是会重复渲染？<a class="anchor" href="#43-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%80%BB%E6%98%AF%E4%BC%9A%E9%87%8D%E5%A4%8D%E6%B8%B2%E6%9F%93">§</a></h3>\n<blockquote>\n<p>TLDR：在函数式组件中使用有状态组件时务必要小心</p>\n</blockquote>\n<p><a href="https://github.com/vuejs/vue/issues/4037">Functional components are re-rendered when props are unchanged.</a></p>\n<p>函数式组件相当于直接调用组件的 Render 函数，这意味着你应该：</p>\n<blockquote>\n<p>避免在 render 函数中直接使用有状态组件，因为这会在每次调用 render 函数时创建不同的组件实例。</p>\n</blockquote>\n<p><strong>如果函数式组件是叶子组件，会更好地利用它们。</strong> 需要注意的是，同样的行为也适用于 React.js。</p>\n<h3 id="44-%E5%A6%82%E4%BD%95%E5%9C%A8vuejs-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%A7%A6%E5%8F%91%E4%B8%80%E4%B8%AA%E4%BA%8B%E4%BB%B6">4.4 如何在Vue.js 函数式组件中触发一个事件？<a class="anchor" href="#44-%E5%A6%82%E4%BD%95%E5%9C%A8vuejs-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%A7%A6%E5%8F%91%E4%B8%80%E4%B8%AA%E4%BA%8B%E4%BB%B6">§</a></h3>\n<p>在从函数式组件中触发一个事件并不简单。不幸的是，文档中也没有提到这一点。函数式组件中不可用 <code>$emit</code> 方法。stack overflow 上有人讨论过这个问题:</p>\n<p><a href="https://stackoverflow.com/questions/50288996/how-to-emit-an-event-from-vue-js-functional-component">How to emit an event from Vue.js Functional component?</a></p>\n<h2 id="5vuejs-%E7%9A%84%E9%80%8F%E6%98%8E%E5%8C%85%E8%A3%B9%E7%BB%84%E4%BB%B6">5、Vue.js 的透明包裹组件<a class="anchor" href="#5vuejs-%E7%9A%84%E9%80%8F%E6%98%8E%E5%8C%85%E8%A3%B9%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>组件包裹一些DOM元素，并且公开了这些DOM元素的事件，而不是根DOM的节点实例。</p>\n<p>例如：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Wrapper component for input --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>focus<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这里我们真正感兴趣的是 <code>input</code> 节点，而不是 <code>div</code> 根节点，因为它主要是为了样式和修饰而添加的。用户可能对这个组件的几个输入事件感兴趣，比如 <code>blur</code>、<code>focus</code>、<code>click</code>、<code>hover</code>等等。这意味着我们必须重新绑定每个事件。我们的组件如下所示。</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Wrapper component for input --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>focus<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>click<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@blur</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>blur<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@hover</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>hover<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n        <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>实际上这是完全没必要的。简单的解决方案是使用 Vue 实例上的属性 <code>vm.$listeners</code> 将事件重新绑定到所需DOM 元素上：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Notice the use of $listeners --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-on</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$listeners<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n<span class="token comment">&lt;!-- Uses: @focus event will bind to internal input element --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>custom-input</span> <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>onFocus<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>custom-input</span><span class="token punctuation">></span></span>\n</code></pre>\n<h2 id="6%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%A0%E4%B8%8D%E8%83%BD%E5%9C%A8-slot-%E4%B8%8A%E7%BB%91%E5%AE%9A%E5%92%8C%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6">6、为什么你不能在 slot 上绑定和触发事件<a class="anchor" href="#6%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%A0%E4%B8%8D%E8%83%BD%E5%9C%A8-slot-%E4%B8%8A%E7%BB%91%E5%AE%9A%E5%92%8C%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6">§</a></h2>\n<p>我经常看到有些开发人员，在 slot 上进行事件的监听和分发，这是不可能的。</p>\n<p>组件的 slot 由调用它的父组件提供，这意味着所有事件都应该与父组件相关联。尝试去倾听这些变化意味着你的父子组件是紧密耦合的，不过有另一种方法可以做到这一点，Evan You解释得很好:</p>\n<p><a href="https://github.com/vuejs/vue/issues/4332#issuecomment-263444492">Is it possible to emit event from component inside slot  #4332</a></p>\n<p><a href="https://github.com/vuejs/vue/issues/4781">Suggestion: v-on on slots</a></p>\n<h2 id="7slot-%E4%B8%AD%E7%9A%84-slot%E8%AE%BF%E9%97%AE%E5%AD%99%E8%BE%88slot">7、slot 中的 slot（访问孙辈slot）<a class="anchor" href="#7slot-%E4%B8%AD%E7%9A%84-slot%E8%AE%BF%E9%97%AE%E5%AD%99%E8%BE%88slot">§</a></h2>\n<p>在某些时候，可能会遇到这种情况。假设有一个组件，比如 A ，它接受一些 slot 。遵循组合的原则，使用组件 A 构建另一个组件 B 。然后你把 B 用在 C 中。</p>\n<blockquote>\n<p>那么现在问题来了： 如何将 slot 从 C 组件传递到 A 组件?</p>\n</blockquote>\n<p>要回答这个问题，首先取决你使用何种方式构建组件？ 如果你是用 render 函数，那就很简单。你只需要在组件 B 的 render 函数中进行如下操作：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// Render function for component B</span>\n<span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'component-a\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        <span class="token comment">// Passing slots as they are to component A</span>\n        scopedSlot<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$scopedSlots</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>但是，如果你使用的是基于模板的方式，那么就有些糟糕了。幸运的是，在这个问题上有了进展：</p>\n<p><a href="https://github.com/vuejs/vue/pull/7765">feat(core): support passing down scopedSlots with v-bind</a></p>\n<hr>\n<p>希望这篇文章让你对 Vue.js 的设计思路有了更深入的了解，并为你提供了一些在高级场景中的技巧。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u3010\u7FFB\u8BD1\u3011Vue.js \u7684\u6CE8\u610F\u4E8B\u9879\u4E0E\u6280\u5DE7"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>原文链接：<a href="https://blog.webf.zone/vue-js-considerations-and-tricks-fa7e0e4bb7bb">Vue.js — Considerations and Tricks</a></p>\n<p><img src="https://file.shenfq.com/FjFxhMxwH4RWxzhXmnKlhcxjQ2Ap.png" alt=""></p>\n<p>Vue.js 是一个很棒的框架。然而，当你开始构建一个大型 JavaScript 项目的时候，你将对 Vue.js 感到一些困惑。这些困惑并不是来自框架本身，相反 Vue.js 团队会经常调整一些重要设计策略。</p>\n<p>相对于 React 和 Angular，Vue.js 面向一些不同水平的开发者。它更加的友好，不管是对初学者还是经验丰富的老手。它并不隐藏一些 DOM 操作，相反它与 DOM 配合的很好。</p>\n<p>这篇文章更像是一个目录，列举了我在 Vue.js 的初学路上遇到一些问题和技巧。理解这些关键性的设计技巧，有助于我们构建大型的 Web 应用。</p>\n<p>写这篇文章的时候是 2018 年 5 月 18 日，下面这些技巧依然是有效的。但是框架升级，或者浏览器底层或者 JS API 发生改变时，他们可能会变得不是那么有用。</p>\n<blockquote>\n<p>译者注：尽管 Vue.js 3 即将到来，但是下面的技巧大部分是有用的，因为 3 的版本并不会改变一些上层 API ，最大的特性可能是底层数据 Observer 改有 proxy 实现，以及源码使用 typescript 构建。</p>\n</blockquote>\n<hr>\n<h2 id="1%E4%B8%BA%E4%BB%80%E4%B9%88-vuejs-%E4%B8%8D%E4%BD%BF%E7%94%A8-es-classes-%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E5%86%99%E7%BB%84%E4%BB%B6">1、为什么 Vue.js 不使用 ES Classes 的方式编写组件<a class="anchor" href="#1%E4%B8%BA%E4%BB%80%E4%B9%88-vuejs-%E4%B8%8D%E4%BD%BF%E7%94%A8-es-classes-%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E5%86%99%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>如果你使用过类似于 Angular 的框架或者某些后端 OOP 语言后，那么你的第一个问题可能是：为什么不使用 Class 形式的组件？</p>\n<p>Vue.js 的作者在 GitHub issues 中很好的回答了这个问题：\n<a href="https://github.com/vuejs/vue/issues/2371">Use standard JS classes instead of custom syntax?</a></p>\n<p>为什么不使用 Class 这里有三个很重要的原因：</p>\n<ol>\n<li>ES Classes 不能够满足当前 Vue.js 的需求，ES Classes 标准还没有完全规范化，并且总是朝着错误的方向发展。如果 Classes 的私有属性和装饰器（当前已进入 Stage 3）稳定后，可能会有一定帮助。</li>\n<li>ES Classes 只适合于那些熟悉面向对象语言的人，它对哪些不使用复杂构建工具和编译器的人不够友好。</li>\n<li>优秀的 UI 组件层次结构一般都是组件的横向组合，它并不是基于继承的层次结构。而 Classes 形式显然更擅长的是后者。</li>\n</ol>\n<blockquote>\n<p>译者注：But，Vue.js 3.0 将支持基于 Class 的组件写法，真香。</p>\n</blockquote>\n<h2 id="2%E5%A6%82%E4%BD%95%E6%9E%84%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E8%B1%A1%E7%BB%84%E4%BB%B6">2、如何构建自己的抽象组件？<a class="anchor" href="#2%E5%A6%82%E4%BD%95%E6%9E%84%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E8%B1%A1%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>如果你想构建自己的抽象组件（比如 transition、keep-alive），这是一个比构建大型 web 应用更加疯狂地想法，这里有一些关于这个问题的讨论，但是并没有什么进展。</p>\n<p><a href="https://github.com/vuejs/vuejs.org/issues/720">Any plan for docs of abstract components?</a></p>\n<blockquote>\n<p>译者注：在 Vue.js 内部组件（transition、keep-alive）中，使用了一个 abstract 属性，用于声明抽象组件，这个属性作者并不打算开放给大家使用，所以文档也没有提及。但是如果你要使用也是可以的，那么你必须深入源码探索该属性有何作用。</p>\n</blockquote>\n<p>但是不要害怕，如果你可以很好地理解 slots ，你就可以构建自己的抽象组件了。这里有一篇很好的博客介绍了要如何做到这一点。</p>\n<p><a href="https://alligator.io/vuejs/vue-abstract-components/">Writing Abstract Components with Vue.js</a></p>\n<blockquote>\n<p>译者注：下面是《在 Vue.js 中构建抽象组件》的简单翻译</p>\n</blockquote>\n<pre><code>抽象组件与普通组件一样，只是它不会在界面上显示任何 DOM 元素。它们只是为现有组件添加额外的行为。\n就像很多你已经熟悉的 Vue.js 的内置组件，比如：`&lt;transition&gt;`、`&lt;keep-alive&gt;`、`&lt;slot&gt;`。\n\n现在展示一个案例，如何跟踪一个 DOM 已经进入了可视区域 ，让我们使用 IntersectionObserver API 来实现一个解决这个问题的抽象组件。\n（完整代码在这里：[vue-intersect](https://github.com/heavyy/vue-intersect)）\n</code></pre>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// IntersectionObserver.vue</span>\n<span class="token keyword module">export</span> <span class="token keyword module">default</span> <span class="token punctuation">{</span>\n  <span class="token comment">// 在 Vue 中启用抽象组件</span>\n  <span class="token comment">// 此属性不在官方文档中， 可能随时发生更改，但是我们的组件必须使用它</span>\n  abstract<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n  <span class="token comment">// 重新实现一个 render 函数</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 我们不需要任何包裹的元素，只需要返回子组件即可</span>\n    <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$slots</span><span class="token punctuation">.</span><span class="token keyword module">default</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword control-flow">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">\'IntersectionObserver.vue can only render one, and exactly one child component.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword control-flow">return</span> <span class="token keyword null nil">null</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">mounted</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 创建一个 IntersectionObserver 实例</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IntersectionObserver</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">entries</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">$emit</span><span class="token punctuation">(</span>entries<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">isIntersecting</span> <span class="token operator">?</span> <span class="token string">\'intersect-enter\'</span> <span class="token operator">:</span> <span class="token string">\'intersect-leave\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>entries<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// 需要等待下一个事件队列，保证子元素已经渲染</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token method function property-access">$nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span><span class="token punctuation">.</span><span class="token method function property-access">observe</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$slots</span><span class="token punctuation">.</span><span class="token keyword module">default</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token property-access">elm</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">destroyed</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 确保组件移除时，IntersectionObserver 实例也会停止监听</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">observer</span><span class="token punctuation">.</span><span class="token method function property-access">disconnect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<pre><code>让我们看看如何使用它？\n</code></pre>\n<pre class="language-html"><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>intersection-observer</span> <span class="token attr-name">@intersect-enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleEnter<span class="token punctuation">"</span></span> <span class="token attr-name">@intersect-leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleLeave<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-honest-to-goodness-component</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-honest-to-goodness-component</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>intersection-observer</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>但是在这样做之前，请你三思。我们一般依赖 mixins 和一些纯函数来解决一些特殊场景的问题，你可以将 mixins 直接看做一个抽象组件。</p>\n<p><a href="https://stackoverflow.com/questions/35964116/how-do-i-extend-another-vuejs-component-in-a-single-file-component-es6-vue-loa/35964246#35964246">How do I extend another VueJS component in a single-file component? (ES6 vue-loader)</a></p>\n<h2 id="3%E6%88%91%E4%B8%8D%E5%A4%AA%E5%96%9C%E6%AC%A2-vuejs-%E7%9A%84%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%88%91%E6%9B%B4%E5%B8%8C%E6%9C%9B-htmlcss-%E5%92%8C-javascript-%E5%88%86%E7%A6%BB">3、我不太喜欢 Vue.js 的单文件组件，我更希望 HTML、CSS 和 JavaScript 分离。<a class="anchor" href="#3%E6%88%91%E4%B8%8D%E5%A4%AA%E5%96%9C%E6%AC%A2-vuejs-%E7%9A%84%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%88%91%E6%9B%B4%E5%B8%8C%E6%9C%9B-htmlcss-%E5%92%8C-javascript-%E5%88%86%E7%A6%BB">§</a></h2>\n<p>没有人阻止你这样做，如果你是个注重分离的哲学家，喜欢把不同的东西放在不同文件，或者讨厌编辑器对 <code>.vue</code> 文件的不稳定行为，那么你这么做也是可以的。你要做的很简单：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!--<a class="token url-link" href="https://vuejs.org/v2/guide/single-file-components.html">https://vuejs.org/v2/guide/single-file-components.html</a> --></span>\n<span class="token comment">&lt;!-- my-component.vue --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.html<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>./my-component.css<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token style"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这么做，就会出现下一个问题：<strong>我的组件总是需要 4 个文件（vue + html + css + js）吗？我能不能摆脱 <code>.vue</code> 文件？</strong> 答案是肯定的，你可以使用 <a href="https://github.com/ktsn/vue-template-loader"><code>vue-template-loader</code></a>。</p>\n<p>我的同事还为此写了一篇很棒的教程：</p>\n<p><a href="https://alligator.io/vuejs/vue-template-loader/">Using vue-template-loader with Vue.js to Compile HTML Templates</a></p>\n<h2 id="4-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4、 函数式组件<a class="anchor" href="#4-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>感谢 React.js 让函数式组件很流行，这是因为他们无状态、易于测试。然而它们也存在一些问题。</p>\n<blockquote>\n<p>译者注：不了解 Vue.js 函数式组件的可以先在官方文档查看：<a href="https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">官方文档</a></p>\n</blockquote>\n<h3 id="41-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E4%B8%8D%E8%83%BD%E5%AF%B9%E5%8A%9F%E8%83%BD%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%9F%BA%E4%BA%8E-class-%E7%9A%84-component-%E8%A3%85%E9%A5%B0%E5%99%A8">4.1 为什么我不能对功能组件使用基于 Class 的 @Component 装饰器？<a class="anchor" href="#41-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E4%B8%8D%E8%83%BD%E5%AF%B9%E5%8A%9F%E8%83%BD%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%9F%BA%E4%BA%8E-class-%E7%9A%84-component-%E8%A3%85%E9%A5%B0%E5%99%A8">§</a></h3>\n<p>再次回到 Classes，它只是一种用于保存本地状态的数据结构。如果函数式组件是无状态的，那么使用 @Component 装饰器就是无意义的。</p>\n<p>这里有关于这个的讨论：</p>\n<p><a href="https://github.com/vuejs/vue-class-component/issues/120">How to create functional component in @Component?</a></p>\n<h3 id="42-%E5%A4%96%E9%83%A8%E7%B1%BB%E5%92%8C%E6%A0%B7%E5%BC%8F%E4%B8%8D%E5%BA%94%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4.2 外部类和样式不应用于函数式组件<a class="anchor" href="#42-%E5%A4%96%E9%83%A8%E7%B1%BB%E5%92%8C%E6%A0%B7%E5%BC%8F%E4%B8%8D%E5%BA%94%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">§</a></h3>\n<p>函数式组件不能像普通组件那样，绑定具体的类和样式，必须在 render 函数中手动应用这些绑定。</p>\n<p><a href="https://github.com/vuejs/vue-loader/issues/1014">DOM class attribute not rendered properly with functional components</a></p>\n<p><a href="https://github.com/vuejs/vue/issues/7554">class attribute ignored on functional components</a></p>\n<h3 id="43-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%80%BB%E6%98%AF%E4%BC%9A%E9%87%8D%E5%A4%8D%E6%B8%B2%E6%9F%93">4.3 函数式组件总是会重复渲染？<a class="anchor" href="#43-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%80%BB%E6%98%AF%E4%BC%9A%E9%87%8D%E5%A4%8D%E6%B8%B2%E6%9F%93">§</a></h3>\n<blockquote>\n<p>TLDR：在函数式组件中使用有状态组件时务必要小心</p>\n</blockquote>\n<p><a href="https://github.com/vuejs/vue/issues/4037">Functional components are re-rendered when props are unchanged.</a></p>\n<p>函数式组件相当于直接调用组件的 Render 函数，这意味着你应该：</p>\n<blockquote>\n<p>避免在 render 函数中直接使用有状态组件，因为这会在每次调用 render 函数时创建不同的组件实例。</p>\n</blockquote>\n<p><strong>如果函数式组件是叶子组件，会更好地利用它们。</strong> 需要注意的是，同样的行为也适用于 React.js。</p>\n<h3 id="44-%E5%A6%82%E4%BD%95%E5%9C%A8vuejs-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%A7%A6%E5%8F%91%E4%B8%80%E4%B8%AA%E4%BA%8B%E4%BB%B6">4.4 如何在Vue.js 函数式组件中触发一个事件？<a class="anchor" href="#44-%E5%A6%82%E4%BD%95%E5%9C%A8vuejs-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%A7%A6%E5%8F%91%E4%B8%80%E4%B8%AA%E4%BA%8B%E4%BB%B6">§</a></h3>\n<p>在从函数式组件中触发一个事件并不简单。不幸的是，文档中也没有提到这一点。函数式组件中不可用 <code>$emit</code> 方法。stack overflow 上有人讨论过这个问题:</p>\n<p><a href="https://stackoverflow.com/questions/50288996/how-to-emit-an-event-from-vue-js-functional-component">How to emit an event from Vue.js Functional component?</a></p>\n<h2 id="5vuejs-%E7%9A%84%E9%80%8F%E6%98%8E%E5%8C%85%E8%A3%B9%E7%BB%84%E4%BB%B6">5、Vue.js 的透明包裹组件<a class="anchor" href="#5vuejs-%E7%9A%84%E9%80%8F%E6%98%8E%E5%8C%85%E8%A3%B9%E7%BB%84%E4%BB%B6">§</a></h2>\n<p>组件包裹一些DOM元素，并且公开了这些DOM元素的事件，而不是根DOM的节点实例。</p>\n<p>例如：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Wrapper component for input --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>focus<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>这里我们真正感兴趣的是 <code>input</code> 节点，而不是 <code>div</code> 根节点，因为它主要是为了样式和修饰而添加的。用户可能对这个组件的几个输入事件感兴趣，比如 <code>blur</code>、<code>focus</code>、<code>click</code>、<code>hover</code>等等。这意味着我们必须重新绑定每个事件。我们的组件如下所示。</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Wrapper component for input --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>focus<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>click<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@blur</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>blur<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n            <span class="token attr-name">@hover</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$emit(<span class="token punctuation">\'</span>hover<span class="token punctuation">\'</span>)<span class="token punctuation">"</span></span>\n        <span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n</code></pre>\n<p>实际上这是完全没必要的。简单的解决方案是使用 Vue 实例上的属性 <code>vm.$listeners</code> 将事件重新绑定到所需DOM 元素上：</p>\n<pre class="language-html"><code class="language-html"><span class="token comment">&lt;!-- Notice the use of $listeners --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>wrapper-comp<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span><span class="token punctuation">></span></span>My Label<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">v-on</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>$listeners<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>\n<span class="token comment">&lt;!-- Uses: @focus event will bind to internal input element --></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>custom-input</span> <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>onFocus<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>custom-input</span><span class="token punctuation">></span></span>\n</code></pre>\n<h2 id="6%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%A0%E4%B8%8D%E8%83%BD%E5%9C%A8-slot-%E4%B8%8A%E7%BB%91%E5%AE%9A%E5%92%8C%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6">6、为什么你不能在 slot 上绑定和触发事件<a class="anchor" href="#6%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%A0%E4%B8%8D%E8%83%BD%E5%9C%A8-slot-%E4%B8%8A%E7%BB%91%E5%AE%9A%E5%92%8C%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6">§</a></h2>\n<p>我经常看到有些开发人员，在 slot 上进行事件的监听和分发，这是不可能的。</p>\n<p>组件的 slot 由调用它的父组件提供，这意味着所有事件都应该与父组件相关联。尝试去倾听这些变化意味着你的父子组件是紧密耦合的，不过有另一种方法可以做到这一点，Evan You解释得很好:</p>\n<p><a href="https://github.com/vuejs/vue/issues/4332#issuecomment-263444492">Is it possible to emit event from component inside slot  #4332</a></p>\n<p><a href="https://github.com/vuejs/vue/issues/4781">Suggestion: v-on on slots</a></p>\n<h2 id="7slot-%E4%B8%AD%E7%9A%84-slot%E8%AE%BF%E9%97%AE%E5%AD%99%E8%BE%88slot">7、slot 中的 slot（访问孙辈slot）<a class="anchor" href="#7slot-%E4%B8%AD%E7%9A%84-slot%E8%AE%BF%E9%97%AE%E5%AD%99%E8%BE%88slot">§</a></h2>\n<p>在某些时候，可能会遇到这种情况。假设有一个组件，比如 A ，它接受一些 slot 。遵循组合的原则，使用组件 A 构建另一个组件 B 。然后你把 B 用在 C 中。</p>\n<blockquote>\n<p>那么现在问题来了： 如何将 slot 从 C 组件传递到 A 组件?</p>\n</blockquote>\n<p>要回答这个问题，首先取决你使用何种方式构建组件？ 如果你是用 render 函数，那就很简单。你只需要在组件 B 的 render 函数中进行如下操作：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// Render function for component B</span>\n<span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">return</span> <span class="token function">h</span><span class="token punctuation">(</span><span class="token string">\'component-a\'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>\n        <span class="token comment">// Passing slots as they are to component A</span>\n        scopedSlot<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">$scopedSlots</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>但是，如果你使用的是基于模板的方式，那么就有些糟糕了。幸运的是，在这个问题上有了进展：</p>\n<p><a href="https://github.com/vuejs/vue/pull/7765">feat(core): support passing down scopedSlots with v-bind</a></p>\n<hr>\n<p>希望这篇文章让你对 Vue.js 的设计思路有了更深入的了解，并为你提供了一些在高级场景中的技巧。</p>'
        } }),
    'toc': React.createElement("aside", { dangerouslySetInnerHTML: {
            __html: '<nav class="toc"><ol><li><a href="#1%E4%B8%BA%E4%BB%80%E4%B9%88-vuejs-%E4%B8%8D%E4%BD%BF%E7%94%A8-es-classes-%E7%9A%84%E6%96%B9%E5%BC%8F%E7%BC%96%E5%86%99%E7%BB%84%E4%BB%B6">1、为什么 Vue.js 不使用 ES Classes 的方式编写组件</a></li><li><a href="#2%E5%A6%82%E4%BD%95%E6%9E%84%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E8%B1%A1%E7%BB%84%E4%BB%B6">2、如何构建自己的抽象组件？</a></li><li><a href="#3%E6%88%91%E4%B8%8D%E5%A4%AA%E5%96%9C%E6%AC%A2-vuejs-%E7%9A%84%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E6%88%91%E6%9B%B4%E5%B8%8C%E6%9C%9B-htmlcss-%E5%92%8C-javascript-%E5%88%86%E7%A6%BB">3、我不太喜欢 Vue.js 的单文件组件，我更希望 HTML、CSS 和 JavaScript 分离。</a></li><li><a href="#4-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4、 函数式组件</a><ol><li><a href="#41-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E4%B8%8D%E8%83%BD%E5%AF%B9%E5%8A%9F%E8%83%BD%E7%BB%84%E4%BB%B6%E4%BD%BF%E7%94%A8%E5%9F%BA%E4%BA%8E-class-%E7%9A%84-component-%E8%A3%85%E9%A5%B0%E5%99%A8">4.1 为什么我不能对功能组件使用基于 Class 的 @Component 装饰器？</a></li><li><a href="#42-%E5%A4%96%E9%83%A8%E7%B1%BB%E5%92%8C%E6%A0%B7%E5%BC%8F%E4%B8%8D%E5%BA%94%E7%94%A8%E4%BA%8E%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6">4.2 外部类和样式不应用于函数式组件</a></li><li><a href="#43-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E6%80%BB%E6%98%AF%E4%BC%9A%E9%87%8D%E5%A4%8D%E6%B8%B2%E6%9F%93">4.3 函数式组件总是会重复渲染？</a></li><li><a href="#44-%E5%A6%82%E4%BD%95%E5%9C%A8vuejs-%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%AD%E8%A7%A6%E5%8F%91%E4%B8%80%E4%B8%AA%E4%BA%8B%E4%BB%B6">4.4 如何在Vue.js 函数式组件中触发一个事件？</a></li></ol></li><li><a href="#5vuejs-%E7%9A%84%E9%80%8F%E6%98%8E%E5%8C%85%E8%A3%B9%E7%BB%84%E4%BB%B6">5、Vue.js 的透明包裹组件</a></li><li><a href="#6%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%A0%E4%B8%8D%E8%83%BD%E5%9C%A8-slot-%E4%B8%8A%E7%BB%91%E5%AE%9A%E5%92%8C%E8%A7%A6%E5%8F%91%E4%BA%8B%E4%BB%B6">6、为什么你不能在 slot 上绑定和触发事件</a></li><li><a href="#7slot-%E4%B8%AD%E7%9A%84-slot%E8%AE%BF%E9%97%AE%E5%AD%99%E8%BE%88slot">7、slot 中的 slot（访问孙辈slot）</a></li></ol></nav>'
        } }),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/03/31",
    'updated': null,
    'excerpt': "原文链接：Vue.js — Considerations and Tricks Vue.js 是一个很棒的框架。然而，当你开始构建一个大型 JavaScript 项目的时候，你将对 Vue.js 感到一些困惑。这些困惑并不是来自框架本身，相反 Vue.js 团队会经常调整一些重要...",
    'cover': "https://file.shenfq.com/FjFxhMxwH4RWxzhXmnKlhcxjQ2Ap.png",
    'categories': [
        "前端"
    ],
    'tags': [
        "前端框架",
        "Vue.js",
        "翻译"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 19
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
            }
        ]
    }
};
