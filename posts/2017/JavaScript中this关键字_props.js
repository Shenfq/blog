import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig },
    'pagePath': "posts/2017/JavaScript中this关键字.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2017/JavaScript中this关键字.html",
    'title': "JavaScript中this关键字",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>JavaScript中this关键字</h1>\n<p>this一直是js中一个老生常谈的东西，但是我们究竟该如何来理解它呢？<br>\n在《JavaScript高级程序设计》中，对this的解释是：</p>\n<blockquote>\n<p>this对象是在运行时基于函数的执行环境绑定的。</p>\n</blockquote>\n<p>我们来逐字解读这句话：</p>\n<ul>\n<li>this是一个对象</li>\n<li>this的产生与函数有关</li>\n<li>this与执行环境绑定</li>\n</ul>\n<p>说通俗一点就是，“<strong>谁调用的这个函数，this就是谁</strong>”。</p>\n<!-- more -->\n<hr>\n<h4 id="%E4%B8%80%E5%87%BD%E6%95%B0%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">一、函数直接调用中的this<a class="anchor" href="#%E4%B8%80%E5%87%BD%E6%95%B0%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">x</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//1</span>\n</code></pre>\n<p>js中有一个全局对象window，直接调用函数testThis时，就相当于调用window下的testThis方法，包括直接声明的变量也都是挂载在window对象下的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">innerX</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">1</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\ninnerX <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">innerX</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\nx <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">x</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\n\n</code></pre>\n<p>同理，在匿名函数中使用this也是指向的window，因为匿名函数的执行环境具有全局性。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//window</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是呢，凡事都有例外，js的例外就是严格模式。在严格模式中，禁止this关键字指向全局对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token string">\'use strict\'</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//undefined</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<hr>\n<h4 id="%E4%BA%8C%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">二、对象方法调用中的this<a class="anchor" href="#%E4%BA%8C%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>再举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> \n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\n</code></pre>\n<p>此时，showName方法中的this指向的是对象person，因为调用showName的是person对象，所以showName方法中的 <a href="http://this.name">this.name</a> 其实就是 <a href="http://person.name">person.name</a>。</p>\n<p>但是如果我们换个思路，把showName方法赋值给一个全局变量，然后在全局环境下调用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    showGlobalName <span class="token operator">=</span> person<span class="token punctuation">.</span><span class="token property-access">showName</span><span class="token punctuation">;</span>\n<span class="token function">showGlobalName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n</code></pre>\n<p>可以看到，在全局环境中调用showName方法时，this就会指向window。</p>\n<p>再换个思路，如果showName方法被其他对象调用呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    animal <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"dog"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> person<span class="token punctuation">.</span><span class="token property-access">showName</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nanimal<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'dog\'</span>\n</code></pre>\n<p>此时的name又变成了animal对象下的name，再复杂一点，如果调用方法的是对象下的一个属性，而这个属性是另个对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">showName</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"bodyParts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"hand"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> showName\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"showName"</span><span class="token operator">:</span> showName\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\nperson<span class="token punctuation">.</span><span class="token property-access">bodyParts</span><span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'hand\'</span>\n</code></pre>\n<p>虽然调用showName方法的最源头是person对象，但是最终调用的是person下的bodyParts，所以方法写在哪个对象下其实不重要，重要的是这个方法最后被谁调用了，<strong>this指向的永远是最终调用它的那个对象</strong>。讲来讲去，this也就那么回事，只要知道函数体的执行上下文就能知道this指向哪儿，这个规则在大多数情况下都适用，注意是<strong>大多数情况</strong>，少部分情况后面会讲。</p>\n<p>最后一个思考题，当方法返回一个匿名函数，这个匿名函数里面的this指向哪里？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"returnShowName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword control-flow">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnShowName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n</code></pre>\n<p>答案一目了然，匿名函数不管写在哪里，只要是被直接调用，它的this都是指向window，因为匿名函数的执行环境具有全局性。</p>\n<hr>\n<h4 id="%E4%B8%89new%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">三、new构造函数中的this<a class="anchor" href="#%E4%B8%89new%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>还是先举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> global <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Peson</span></span><span class="token punctuation">(</span><span class="token string">\'global\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'xiaoming\'</span>\n</code></pre>\n<p>首先不使用new操作符，直接调用Person函数，这时的this任然指向window。当使用了new操作符时，这个函数就被称为构造函数。</p>\n<p>所谓构造函数，就是用来构造一个对象的函数。构造函数总是与new操作符一起出现的，当没有new操作符时，该函数与普通函数无区别。</p>\n<p>对构造函数进行new操作的过程被称为实例化。new操作会返回一个被实例化的对象，而构造函数中的this指向的就是那个被实例化的对象，比如上面例子中的xiaoming。</p>\n<p><strong>关于构造函数有几点需要注意：</strong></p>\n<ol>\n<li>实例化对象默认会有constructor属性，指向构造函数；</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">.</span><span class="token property-access">constructor</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Person</span>\n\n</code></pre>\n<ol start="2">\n<li>实例化对象会继承构造函数的原型，可以调用构造函数原型上的所有方法；</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Person</span><span class="token punctuation">.</span><span class="token property-access">prototype</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">showName</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nxiaoming<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'xiaoming\'</span>\n\n</code></pre>\n<ol start="3">\n<li>如果构造函数返回了一个对象，那么实例对象就是返回的对象，所有通过this赋值的属性都将不存在</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">age</span>  <span class="token operator">=</span> age<span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">\'innerName\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Person</span><span class="token punctuation">.</span><span class="token property-access">prototype</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">showName</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// {name: \'innerName\'}</span>\n\n</code></pre>\n<hr>\n<h4 id="%E5%9B%9B%E9%80%9A%E8%BF%87callapply%E9%97%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E6%97%B6%E7%9A%84this">四、通过call、apply间接调用函数时的this<a class="anchor" href="#%E5%9B%9B%E9%80%9A%E8%BF%87callapply%E9%97%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E6%97%B6%E7%9A%84this">§</a></h4>\n<p><strong>又一次举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"object"</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">test</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\ntest<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// \'object\'</span>\ntest<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// \'object\'</span>\n</code></pre>\n<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call">call</a>与<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply">apply</a>方法都是挂载在Function原型下的方法，所有的函数都能使用。</p>\n<p>这两个函数既有相同之处也有不同之处：</p>\n<ul>\n<li>相同的地方就是它们的第一个参数会绑定到函数体的this上，如果不传参数，this默认还是绑定到window上。</li>\n<li>不同之处在于，call的后续参数会传递给调用函数作为参数，而apply的第二个参数为一个数组，数组里的元素就是调用函数的参数。</li>\n</ul>\n<p>语言很苍白，我只好写段代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">changeJob</span><span class="token punctuation">(</span><span class="token parameter">company<span class="token punctuation">,</span> work</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">company</span> <span class="token operator">=</span> company<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">work</span>    <span class="token operator">=</span> work<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nchangeJob<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>person<span class="token punctuation">,</span> <span class="token string">\'NASA\'</span><span class="token punctuation">,</span> <span class="token string">\'spaceman\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token property-access">work</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'spaceman\'</span>\n\nchangeJob<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>person<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'Temple\'</span><span class="token punctuation">,</span> <span class="token string">\'monk\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token property-access">work</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'monk\'</span>\n\n</code></pre>\n<p>有一点值得注意，这两个方法会把传入的参数转成对象类型，不管传入的字符串还是数字。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> number <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> string <span class="token operator">=</span> <span class="token string">\'string\'</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">getThisType</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\ngetThisType<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//object</span>\ngetThisType<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>string<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//object</span>\n</code></pre>\n<h4 id="%E4%BA%94%E9%80%9A%E8%BF%87bind%E6%94%B9%E5%8F%98%E5%87%BD%E6%95%B0%E7%9A%84this%E6%8C%87%E5%90%91">五、通过bind改变函数的this指向<a class="anchor" href="#%E4%BA%94%E9%80%9A%E8%BF%87bind%E6%94%B9%E5%8F%98%E5%87%BD%E6%95%B0%E7%9A%84this%E6%8C%87%E5%90%91">§</a></h4>\n<p><strong>最后举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">test</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// global</span>\n\n<span class="token keyword">var</span> newTest <span class="token operator">=</span> test<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">newTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// shenfq</span>\n</code></pre>\n<p>bind方法是ES5中新增的，和call、apply一样都是Function对象原型下的方法-- Function.prototype.bind ，所以每个函数都能直接调用。bind方法会返回一个与调用函数一样的函数，只是返回的函数内的this被永久绑定为bind方法的第一个参数，并且被bind绑定后的函数不能再被重新绑定。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">showName</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    animal <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"dog"</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> showPersonName <span class="token operator">=</span> showName<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    showAnimalName <span class="token operator">=</span> showPersonName<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>animal<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">showPersonName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//\'shenfq\'</span>\n<span class="token function">showAnimalName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//\'shenfq\'</span>\n</code></pre>\n<p>可以看到showPersonName方法先是对showName绑定了person对象，然后再对showPersonName重新绑定animal对象并没有生效。</p>\n<h4 id="%E5%85%AD%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">六、箭头函数中的this<a class="anchor" href="#%E5%85%AD%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>真的是最后一个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"returnArrow"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnArrow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\n</code></pre>\n<p>箭头函数是ES6中新增的一种语法糖，简单说就是匿名函数的简写，但是与匿名函数不同的是箭头函数中的this表示的是外层执行上下文，也就是说箭头函数的this就是外层函数的this。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"returnArrow"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">let</span> that <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> that<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnArrow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// true</span>\n</code></pre>\n<hr>\n<h4 id="%E8%A1%A5%E5%85%85">补充：<a class="anchor" href="#%E8%A1%A5%E5%85%85">§</a></h4>\n<p><strong>事件处理函数中的this：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> $btn <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'btn\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">showThis</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n$btn<span class="token punctuation">.</span><span class="token method function property-access">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'click\'</span><span class="token punctuation">,</span> showThis<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>点击按钮可以看到控制台打印出了元素节点。</p>\n<p><img src="//file.shenfq.com/17-10-12/25450020.jpg" alt="事件结果"></p>\n<p>其实事件函数中的this默认就是绑定事件的元素，调用事件函数时可以简单理解为</p>\n<blockquote>\n<p>$btn.showThis()</p>\n</blockquote>\n<p>只要单击了按钮就会已这种方式来触发事件函数，所以事件函数中的this表示元素节点，这也与之前定义的**“谁调用的这个函数，this就是谁”**相吻合。</p>\n<p><strong>eval中的this：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">eval</span><span class="token punctuation">(</span><span class="token string">\'console.log(this)\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//window</span>\n<span class="token keyword">var</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'object\'</span><span class="token punctuation">,</span>\n    <span class="token function-variable function">showThis</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">eval</span><span class="token punctuation">(</span><span class="token string">\'console.log(this)\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\nobj<span class="token punctuation">.</span><span class="token method function property-access">showThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// obj</span>\n</code></pre>\n<p><a href="http://www.nowamagic.net/librarys/veda/detail/1627">eval</a>是一个可以动态执行js代码的函数，能将传入其中的字符串当作js代码执行。这个方法一般用得比较少，因为很危险，想想动态执行代码，什么字符串都能执行，但是如果用得好也能带来很大的便利。</p>\n<p>eval中的this与箭头函数比较类似，与外层函数的this一致。</p>\n<p>当然这只针对现代浏览器，在一些低版本的浏览器上，比如ie7、低版本webkit，eval的this指向会有些不同。</p>\n<p>eval也可以在一些特殊情况下用来获取全局对象(window、global)，使用 <a href="https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript">(1,eval)(\'this\')</a>。</p>\n<hr>\n<p>先写这么多，有需要再补充 ^ _ ^</p>\n<h4 id="%E5%8F%82%E8%80%83">参考：<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h4>\n<ol>\n<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this">this - JavaScript | MDN</a></li>\n<li><a href="http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html">Javascript的this用法</a></li>\n<li><a href="https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript">(1,eval)(\'this\') vs eval(\'this\') in JavaScript?</a></li>\n</ol>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "JavaScript\u4E2Dthis\u5173\u952E\u5B57"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<p>this一直是js中一个老生常谈的东西，但是我们究竟该如何来理解它呢？<br>\n在《JavaScript高级程序设计》中，对this的解释是：</p>\n<blockquote>\n<p>this对象是在运行时基于函数的执行环境绑定的。</p>\n</blockquote>\n<p>我们来逐字解读这句话：</p>\n<ul>\n<li>this是一个对象</li>\n<li>this的产生与函数有关</li>\n<li>this与执行环境绑定</li>\n</ul>\n<p>说通俗一点就是，“<strong>谁调用的这个函数，this就是谁</strong>”。</p>\n<!-- more -->\n<hr>\n<h4 id="%E4%B8%80%E5%87%BD%E6%95%B0%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">一、函数直接调用中的this<a class="anchor" href="#%E4%B8%80%E5%87%BD%E6%95%B0%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n\n<span class="token keyword">function</span> <span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">x</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">//1</span>\n</code></pre>\n<p>js中有一个全局对象window，直接调用函数testThis时，就相当于调用window下的testThis方法，包括直接声明的变量也都是挂载在window对象下的。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">innerX</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token number">1</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token function">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token method function property-access">testThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\ninnerX <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">innerX</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\nx <span class="token operator">===</span> <span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">x</span><span class="token punctuation">;</span>  <span class="token comment">// true</span>\n\n</code></pre>\n<p>同理，在匿名函数中使用this也是指向的window，因为匿名函数的执行环境具有全局性。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//window</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>但是呢，凡事都有例外，js的例外就是严格模式。在严格模式中，禁止this关键字指向全局对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token string">\'use strict\'</span><span class="token punctuation">;</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//undefined</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<hr>\n<h4 id="%E4%BA%8C%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">二、对象方法调用中的this<a class="anchor" href="#%E4%BA%8C%E5%AF%B9%E8%B1%A1%E6%96%B9%E6%B3%95%E8%B0%83%E7%94%A8%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>再举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span> \n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\n</code></pre>\n<p>此时，showName方法中的this指向的是对象person，因为调用showName的是person对象，所以showName方法中的 <a href="http://this.name">this.name</a> 其实就是 <a href="http://person.name">person.name</a>。</p>\n<p>但是如果我们换个思路，把showName方法赋值给一个全局变量，然后在全局环境下调用。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    showGlobalName <span class="token operator">=</span> person<span class="token punctuation">.</span><span class="token property-access">showName</span><span class="token punctuation">;</span>\n<span class="token function">showGlobalName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n</code></pre>\n<p>可以看到，在全局环境中调用showName方法时，this就会指向window。</p>\n<p>再换个思路，如果showName方法被其他对象调用呢？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    animal <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"dog"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> person<span class="token punctuation">.</span><span class="token property-access">showName</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nanimal<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'dog\'</span>\n</code></pre>\n<p>此时的name又变成了animal对象下的name，再复杂一点，如果调用方法的是对象下的一个属性，而这个属性是另个对象。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">showName</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"bodyParts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"hand"</span><span class="token punctuation">,</span>\n        <span class="token string">"showName"</span><span class="token operator">:</span> showName\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token string">"showName"</span><span class="token operator">:</span> showName\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\nperson<span class="token punctuation">.</span><span class="token property-access">bodyParts</span><span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'hand\'</span>\n</code></pre>\n<p>虽然调用showName方法的最源头是person对象，但是最终调用的是person下的bodyParts，所以方法写在哪个对象下其实不重要，重要的是这个方法最后被谁调用了，<strong>this指向的永远是最终调用它的那个对象</strong>。讲来讲去，this也就那么回事，只要知道函数体的执行上下文就能知道this指向哪儿，这个规则在大多数情况下都适用，注意是<strong>大多数情况</strong>，少部分情况后面会讲。</p>\n<p>最后一个思考题，当方法返回一个匿名函数，这个匿名函数里面的this指向哪里？</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n        <span class="token string">"returnShowName"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            <span class="token keyword control-flow">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span> \n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnShowName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n</code></pre>\n<p>答案一目了然，匿名函数不管写在哪里，只要是被直接调用，它的this都是指向window，因为匿名函数的执行环境具有全局性。</p>\n<hr>\n<h4 id="%E4%B8%89new%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">三、new构造函数中的this<a class="anchor" href="#%E4%B8%89new%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>还是先举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> global <span class="token operator">=</span> <span class="token function"><span class="token maybe-class-name">Peson</span></span><span class="token punctuation">(</span><span class="token string">\'global\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n    xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token dom variable">window</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'global\'</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'xiaoming\'</span>\n</code></pre>\n<p>首先不使用new操作符，直接调用Person函数，这时的this任然指向window。当使用了new操作符时，这个函数就被称为构造函数。</p>\n<p>所谓构造函数，就是用来构造一个对象的函数。构造函数总是与new操作符一起出现的，当没有new操作符时，该函数与普通函数无区别。</p>\n<p>对构造函数进行new操作的过程被称为实例化。new操作会返回一个被实例化的对象，而构造函数中的this指向的就是那个被实例化的对象，比如上面例子中的xiaoming。</p>\n<p><strong>关于构造函数有几点需要注意：</strong></p>\n<ol>\n<li>实例化对象默认会有constructor属性，指向构造函数；</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">.</span><span class="token property-access">constructor</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Person</span>\n\n</code></pre>\n<ol start="2">\n<li>实例化对象会继承构造函数的原型，可以调用构造函数原型上的所有方法；</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Person</span><span class="token punctuation">.</span><span class="token property-access">prototype</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">showName</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nxiaoming<span class="token punctuation">.</span><span class="token method function property-access">showName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'xiaoming\'</span>\n\n</code></pre>\n<ol start="3">\n<li>如果构造函数返回了一个对象，那么实例对象就是返回的对象，所有通过this赋值的属性都将不存在</li>\n</ol>\n<pre class="language-javascript"><code class="language-javascript">\n<span class="token keyword">function</span> <span class="token function"><span class="token maybe-class-name">Person</span></span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span> <span class="token operator">=</span> name<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">age</span>  <span class="token operator">=</span> age<span class="token punctuation">;</span>\n    <span class="token keyword control-flow">return</span> <span class="token punctuation">{</span>\n        name<span class="token operator">:</span> <span class="token string">\'innerName\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token class-name">Person</span><span class="token punctuation">.</span><span class="token property-access">prototype</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token function-variable function">showName</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> xiaoming <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">\'xiaoming\'</span><span class="token punctuation">,</span> <span class="token number">18</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>xiaoming<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// {name: \'innerName\'}</span>\n\n</code></pre>\n<hr>\n<h4 id="%E5%9B%9B%E9%80%9A%E8%BF%87callapply%E9%97%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E6%97%B6%E7%9A%84this">四、通过call、apply间接调用函数时的this<a class="anchor" href="#%E5%9B%9B%E9%80%9A%E8%BF%87callapply%E9%97%B4%E6%8E%A5%E8%B0%83%E7%94%A8%E5%87%BD%E6%95%B0%E6%97%B6%E7%9A%84this">§</a></h4>\n<p><strong>又一次举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"object"</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">test</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\ntest<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// \'object\'</span>\ntest<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// \'object\'</span>\n</code></pre>\n<p><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call">call</a>与<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply">apply</a>方法都是挂载在Function原型下的方法，所有的函数都能使用。</p>\n<p>这两个函数既有相同之处也有不同之处：</p>\n<ul>\n<li>相同的地方就是它们的第一个参数会绑定到函数体的this上，如果不传参数，this默认还是绑定到window上。</li>\n<li>不同之处在于，call的后续参数会传递给调用函数作为参数，而apply的第二个参数为一个数组，数组里的元素就是调用函数的参数。</li>\n</ul>\n<p>语言很苍白，我只好写段代码：</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">changeJob</span><span class="token punctuation">(</span><span class="token parameter">company<span class="token punctuation">,</span> work</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">company</span> <span class="token operator">=</span> company<span class="token punctuation">;</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">work</span>    <span class="token operator">=</span> work<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nchangeJob<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>person<span class="token punctuation">,</span> <span class="token string">\'NASA\'</span><span class="token punctuation">,</span> <span class="token string">\'spaceman\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token property-access">work</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'spaceman\'</span>\n\nchangeJob<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>person<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'Temple\'</span><span class="token punctuation">,</span> <span class="token string">\'monk\'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token property-access">work</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'monk\'</span>\n\n</code></pre>\n<p>有一点值得注意，这两个方法会把传入的参数转成对象类型，不管传入的字符串还是数字。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> number <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">,</span> string <span class="token operator">=</span> <span class="token string">\'string\'</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">getThisType</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\ngetThisType<span class="token punctuation">.</span><span class="token method function property-access">call</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//object</span>\ngetThisType<span class="token punctuation">.</span><span class="token method function property-access">apply</span><span class="token punctuation">(</span>string<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//object</span>\n</code></pre>\n<h4 id="%E4%BA%94%E9%80%9A%E8%BF%87bind%E6%94%B9%E5%8F%98%E5%87%BD%E6%95%B0%E7%9A%84this%E6%8C%87%E5%90%91">五、通过bind改变函数的this指向<a class="anchor" href="#%E4%BA%94%E9%80%9A%E8%BF%87bind%E6%94%B9%E5%8F%98%E5%87%BD%E6%95%B0%E7%9A%84this%E6%8C%87%E5%90%91">§</a></h4>\n<p><strong>最后举个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token string">\'global\'</span><span class="token punctuation">,</span>\n    person <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">test</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// global</span>\n\n<span class="token keyword">var</span> newTest <span class="token operator">=</span> test<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">newTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// shenfq</span>\n</code></pre>\n<p>bind方法是ES5中新增的，和call、apply一样都是Function对象原型下的方法-- Function.prototype.bind ，所以每个函数都能直接调用。bind方法会返回一个与调用函数一样的函数，只是返回的函数内的this被永久绑定为bind方法的第一个参数，并且被bind绑定后的函数不能再被重新绑定。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">showName</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n<span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n    animal <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"dog"</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">var</span> showPersonName <span class="token operator">=</span> showName<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">,</span>\n    showAnimalName <span class="token operator">=</span> showPersonName<span class="token punctuation">.</span><span class="token method function property-access">bind</span><span class="token punctuation">(</span>animal<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token function">showPersonName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//\'shenfq\'</span>\n<span class="token function">showAnimalName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//\'shenfq\'</span>\n</code></pre>\n<p>可以看到showPersonName方法先是对showName绑定了person对象，然后再对showPersonName重新绑定animal对象并没有生效。</p>\n<h4 id="%E5%85%AD%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">六、箭头函数中的this<a class="anchor" href="#%E5%85%AD%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0%E4%B8%AD%E7%9A%84this">§</a></h4>\n<p><strong>真的是最后一个栗子：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"returnArrow"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token property-access">name</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnArrow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \'shenfq\'</span>\n</code></pre>\n<p>箭头函数是ES6中新增的一种语法糖，简单说就是匿名函数的简写，但是与匿名函数不同的是箭头函数中的this表示的是外层执行上下文，也就是说箭头函数的this就是外层函数的this。</p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> person <span class="token operator">=</span> <span class="token punctuation">{</span>\n    <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"shenfq"</span><span class="token punctuation">,</span>\n    <span class="token string">"returnArrow"</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token keyword">let</span> that <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>\n        <span class="token keyword control-flow">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n            <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> that<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\nperson<span class="token punctuation">.</span><span class="token method function property-access">returnArrow</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// true</span>\n</code></pre>\n<hr>\n<h4 id="%E8%A1%A5%E5%85%85">补充：<a class="anchor" href="#%E8%A1%A5%E5%85%85">§</a></h4>\n<p><strong>事件处理函数中的this：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> $btn <span class="token operator">=</span> <span class="token dom variable">document</span><span class="token punctuation">.</span><span class="token method function property-access">getElementById</span><span class="token punctuation">(</span><span class="token string">\'btn\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">function</span> <span class="token function">showThis</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n$btn<span class="token punctuation">.</span><span class="token method function property-access">addEventListener</span><span class="token punctuation">(</span><span class="token string">\'click\'</span><span class="token punctuation">,</span> showThis<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>点击按钮可以看到控制台打印出了元素节点。</p>\n<p><img src="//file.shenfq.com/17-10-12/25450020.jpg" alt="事件结果"></p>\n<p>其实事件函数中的this默认就是绑定事件的元素，调用事件函数时可以简单理解为</p>\n<blockquote>\n<p>$btn.showThis()</p>\n</blockquote>\n<p>只要单击了按钮就会已这种方式来触发事件函数，所以事件函数中的this表示元素节点，这也与之前定义的**“谁调用的这个函数，this就是谁”**相吻合。</p>\n<p><strong>eval中的this：</strong></p>\n<pre class="language-javascript"><code class="language-javascript"><span class="token function">eval</span><span class="token punctuation">(</span><span class="token string">\'console.log(this)\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//window</span>\n<span class="token keyword">var</span> obj <span class="token operator">=</span> <span class="token punctuation">{</span>\n    name<span class="token operator">:</span> <span class="token string">\'object\'</span><span class="token punctuation">,</span>\n    <span class="token function-variable function">showThis</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">eval</span><span class="token punctuation">(</span><span class="token string">\'console.log(this)\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\nobj<span class="token punctuation">.</span><span class="token method function property-access">showThis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// obj</span>\n</code></pre>\n<p><a href="http://www.nowamagic.net/librarys/veda/detail/1627">eval</a>是一个可以动态执行js代码的函数，能将传入其中的字符串当作js代码执行。这个方法一般用得比较少，因为很危险，想想动态执行代码，什么字符串都能执行，但是如果用得好也能带来很大的便利。</p>\n<p>eval中的this与箭头函数比较类似，与外层函数的this一致。</p>\n<p>当然这只针对现代浏览器，在一些低版本的浏览器上，比如ie7、低版本webkit，eval的this指向会有些不同。</p>\n<p>eval也可以在一些特殊情况下用来获取全局对象(window、global)，使用 <a href="https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript">(1,eval)(\'this\')</a>。</p>\n<hr>\n<p>先写这么多，有需要再补充 ^ _ ^</p>\n<h4 id="%E5%8F%82%E8%80%83">参考：<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h4>\n<ol>\n<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this">this - JavaScript | MDN</a></li>\n<li><a href="http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html">Javascript的this用法</a></li>\n<li><a href="https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript">(1,eval)(\'this\') vs eval(\'this\') in JavaScript?</a></li>\n</ol>'
        } }),
    'toc': null,
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2017/10/12",
    'updated': null,
    'excerpt': "this一直是js中一个老生常谈的东西，但是我们究竟该如何来理解它呢？ 在《JavaScript高级程序设计》中，对this的解释是： 我们来逐字解读这句话： - this是一个对象 - this的产生与函数有关 - this与执行环境绑定 说通俗一点就...",
    'cover': "//file.shenfq.com/17-10-12/25450020.jpg",
    'thumbnail': "//file.shenfq.com/17-10-12/58658380.jpg",
    'categories': [
        "前端"
    ],
    'tags': [
        "js基础",
        "this",
        "前端"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2020/如何让 Node.js 服务性能翻倍？.md",
                "title": "如何让 Node.js 服务性能翻倍？",
                "link": "posts/2020/如何让 Node.js 服务性能翻倍？.html",
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
