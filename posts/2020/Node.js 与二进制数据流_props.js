import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/Node.js 与二进制数据流.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/Node.js 与二进制数据流.html",
    'title': "Node.js 与二进制数据流",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>Node.js 与二进制数据流</h1>\n<h2 id="%E8%AE%A4%E8%AF%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">认识二进制数据<a class="anchor" href="#%E8%AE%A4%E8%AF%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">§</a></h2>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-040056.jpg" alt="二进制数据"></p>\n<blockquote>\n<p>二进制是计算技术中广泛采用的一种数制。二进制数据是用0和1两个数码来表示的数。它的基数为2，进位规则是“逢二进一”，借位规则是“借一当二”，由18世纪德国数理哲学大师<a href="https://baike.baidu.com/item/%E8%8E%B1%E5%B8%83%E5%B0%BC%E5%85%B9/389878">莱布尼兹</a>发现。</p>\n<p>—— 百度百科</p>\n</blockquote>\n<p>二进制数据就像上图一样，由0和1来存储数据。普通的十进制数转化成二进制数一般采用&quot;除2取余，逆序排列&quot;法，用2整除十进制整数，可以得到一个商和余数；再用2去除商，又会得到一个商和余数，如此进行，直到商为小于1时为止，然后把先得到的余数作为二进制数的低位有效位，后得到的余数作为二进制数的高位有效位，依次排列起来。例如，数字10转成二进制就是<code>1010</code>，那么数字10在计算机中就以<code>1010</code>的形式存储。</p>\n<p>而字母和一些符号则需要通过 ASCII 码来对应，例如，字母a对应的 ACSII 码是 97，二进制表示就是<code>0110 0001</code>。JavaScript 中可以使用 <code>charCodeAt</code> 方法获取字符对应的 ASCII：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-17-114252.png" alt="ASCII"></p>\n<p>除了ASCII外，还有一些其他的编码方式来映射不同字符，比如我们使用的汉字，通过 JavaScript 的 charCodeAt 方法得到的是其 <code>UTF-16</code> 的编码。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-17-114211.png" alt="中文的编码"></p>\n<h3 id="node-%E5%A4%84%E7%90%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">Node 处理二进制数据<a class="anchor" href="#node-%E5%A4%84%E7%90%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>JavaScript 在诞生初期主要用于表单信息的处理，所以 JavaScript 天生擅长对字符串进行处理，可以看到 String 的原型提供特别多便利的字符串操作方式。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-13-115403.png" alt="String.prototype"></p>\n<p>但是，在服务端如果只能操作字符是远远不够的，特别是网络和文件的一些 IO 操作上，还需要支持二进制数据流的操作，而 Node.js 的 Buffer 就是为了支持这些而存在的。好在 ES6 发布后，引入了<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays">类型数组</a>（TypedArray）的概念，又逐步补充了二进制数据处理的能力，现在在 Node.js 中也可以直接使用，但是在 Node.js 中，还是 Buffer 更加适合二进制数据的处理，而且拥有更优的性能，当然 Buffer 也可以直接看做 TypedArray 中的  <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a>。除了 Buffer，Node.js 中还提供了 stream 接口，主要用于处理大文件的 IO 操作，相对于将文件分批分片进行处理。</p>\n<h2 id="%E8%AE%A4%E8%AF%86-buffer">认识 Buffer<a class="anchor" href="#%E8%AE%A4%E8%AF%86-buffer">§</a></h2>\n<p>Buffer 直译成中文是『缓冲区』的意思，顾名思义，在 Node.js 中实例化的 Buffer 也是专门用来存放二进制数据的缓冲区。一个 Buffer 可以理解成开辟的一块内存区域，Buffer 的大小就是开辟的内存区域的大小。下面来看看Buffer 的基本使用方法。</p>\n<h3 id="api-%E7%AE%80%E4%BB%8B">API 简介<a class="anchor" href="#api-%E7%AE%80%E4%BB%8B">§</a></h3>\n<p>早期的 Buffer 通过构造函数进行创建，通过不同的参数分配不同的 Buffer。</p>\n<h4 id="new-buffersize">new Buffer(size)<a class="anchor" href="#new-buffersize">§</a></h4>\n<p>创建大小为 size(number) 的 Buffer。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 00 00 00 00 00></span>\n</code></pre>\n<h4 id="new-bufferarray">new Buffer(array)<a class="anchor" href="#new-bufferarray">§</a></h4>\n<p>使用八位字节数组 array 分配一个新的 Buffer。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0x74</span><span class="token punctuation">,</span> <span class="token number">0x65</span><span class="token punctuation">,</span> <span class="token number">0x73</span><span class="token punctuation">,</span> <span class="token number">0x74</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 74 65 73 74></span>\n<span class="token comment">// 对应 ASCII 码，这几个16进制数分别对应 t e s t</span>\n\n<span class="token comment">// 将 Buffer 实例转为字符串得到如下结果</span>\nbuf<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// \'test\'</span>\n</code></pre>\n<h4 id="new-bufferbuffer">new Buffer(buffer)<a class="anchor" href="#new-bufferbuffer">§</a></h4>\n<p>拷贝 buffer 的数据到新建的 Buffer 实例。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token string">\'test\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buf2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span>buf1<span class="token punctuation">)</span>\n</code></pre>\n<h4 id="new-bufferstring-encoding">new Buffer(string[, encoding])<a class="anchor" href="#new-bufferstring-encoding">§</a></h4>\n<p>创建内容为 string 的 Buffer，指定编码方式为 encoding。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token string">\'test\'</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 74 65 73 74></span>\n<span class="token comment">// 可以看到结果与 new Buffer([0x74, 0x65, 0x73, 0x74]) 一致</span>\n\nbuf<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// \'test\'</span>\n</code></pre>\n<h3 id="%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-buffer">更安全的 Buffer<a class="anchor" href="#%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-buffer">§</a></h3>\n<p>由于 Buffer 实例因第一个参数类型而执行不同的结果，如果开发者不对参数进行校验，很容易导致一些安全问题。例如，我要创建一个内容为字符串 <code>&quot;20&quot;</code> 的 Buffer，而错误的传入了数字 <code>20</code>，结果创建了一个长度为 20 的Buffer 实例。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-035250.png" alt="不安全的Buffer"></p>\n<p>可以看到上图，Node.js 8 之前，为了高性能的考虑，Buffer 开辟的内存空间并未释放之前已存在的数据，直接将这个 Buffer 返回可能导致敏感信息的泄露。因此，Buffer 类在 Node.js 8 前后有一次大调整，不再推荐使用 Buffer 构造函数实例 Buffer，而是改用<code>Buffer.from()</code>、<code>Buffer.alloc()</code> 与 <code>Buffer.allocUnsafe()</code> 来替代 <code>new Buffer()</code>。</p>\n<h4 id="bufferfrom">Buffer.from()<a class="anchor" href="#bufferfrom">§</a></h4>\n<p>该方法用于替代 <code>new Buffer(string)</code>、<code>new Buffer(array)</code>、<code>new Buffer(buffer)</code>。</p>\n<h4 id="bufferallocsize-fill-encoding">Buffer.alloc(size[, fill[, encoding]])<a class="anchor" href="#bufferallocsize-fill-encoding">§</a></h4>\n<p>该方法用于替代 <code>new Buffer(size)</code>，其创建的 Buffer 实例默认会使用 0 填充内存，也就是会将内存之前的数据全部覆盖掉，比之前的 <code>new Buffer(size)</code> 更加安全，因为要覆盖之前的内存空间，也意味着更低的性能。</p>\n<p>同时，size 参数如果不是一个数字，会抛出 TypeError。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-035348.png" alt="安全的Buffer"></p>\n<h4 id="bufferallocunsafesize">Buffer.allocUnsafe(size)<a class="anchor" href="#bufferallocunsafesize">§</a></h4>\n<p>该方法与之前的 <code>new Buffer(size)</code> 保持一致，虽然该方法不安全，但是相比起 <code>alloc</code> 具有明显的性能优势。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-040209.png" alt="不安全的Buffer"></p>\n<h3 id="buffer-%E7%9A%84%E7%BC%96%E7%A0%81">Buffer 的编码<a class="anchor" href="#buffer-%E7%9A%84%E7%BC%96%E7%A0%81">§</a></h3>\n<p>前面介绍过二进制数据与字符对应需要指定编码，同理将字符串转化为 Buffer、Buffer 转化为字符串都是需要指定编码的。</p>\n<p>Node.js 目前支持的编码方式如下：</p>\n<ul>\n<li><code>hex</code>：将每个字节编码成两个十六进制的字符。</li>\n<li><code>ascii</code>：仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位。</li>\n<li><code>utf8</code>：多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。</li>\n<li><code>utf16le</code>：2 或 4 个字节，小端序编码的 Unicode 字符。</li>\n<li><code>ucs2</code>：<code>utf16le</code> 的别名。</li>\n<li><code>base64</code>：Base64 编码。</li>\n<li><code>latin1</code>：一种将 <code>Buffer</code> 编码成单字节编码字符串的方法。</li>\n<li><code>binary</code>：<code>latin1</code> 的别名。</li>\n</ul>\n<p>比较常用的就是 <code>UTF-8</code>、<code>UTF-16</code>、<code>ASCII</code>，前面说过 JavaScript 的 <code>charCodeAt</code> 使用的是 <code>UTF-16</code> 编码方式，或者说 JavaScript 中的字符串都是通过 <code>UTF-16</code> 存储的，不过 Buffer 默认的编码是 <code>UTF-8</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-040426.png" alt="Buffer编码"></p>\n<p>可以看到一个汉字在 <code>UTF-8</code> 下需要占用 3 个字节，而 <code>UTF-16</code> 只需要 2 个字节。主要原因是 <code>UTF-8</code> 是一种可变长的字符编码，大部分字符使用 1 个字节表示更加节省空间，而某些超出一个字节的字符，则需要用到 2 个或 3 个字节表示，大部分汉字在 <code>UTF-8</code> 中都需要用到 3 个字节来表示。<code>UTF-16</code> 则全部使用 2 个字节来表示，对于一下超出了 2 字节的字符，需要用到 4 个字节表示。 2 个字节表示的 <code>UTF-16</code> 编码与 Unicode 完全一致，通过<a href="http://www.chi2ko.com/tool/CJK.htm">汉字Unicode编码表</a>可以找到大部分中文所对应的 Unicode 编码。前面提到的 『汉』，通过 Unicode 表示为 <code>6C49</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-054921.png" alt="编码表"></p>\n<p>这里提到的 Unicode 编码又被称为统一码、万国码、单一码，它为每种语言都设定了统一且唯一的二进制编码，而上面说的 <code>UTF-8</code>、<code>UTF-16</code> 都是他的一种实现方式。更多关于编码的细节不再赘述，也不是本文的重点，如果想了解更多可自行搜索。</p>\n<h4 id="%E4%B9%B1%E7%A0%81%E7%9A%84%E5%8E%9F%E5%9B%A0">乱码的原因<a class="anchor" href="#%E4%B9%B1%E7%A0%81%E7%9A%84%E5%8E%9F%E5%9B%A0">§</a></h4>\n<p>我们经常会出现一些乱码的情况，就是因为在字符串与 Buffer 的转化过程中，使用了不同编码导致的。</p>\n<p>我们先新建一个文本文件，然后通过 utf16 编码保存，然后通过 Node.js 读取改文件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025353.png" alt="utf16文本"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span><span class="token string">\'./1.txt\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>buffer<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025613.png" alt="输出乱码"></p>\n<p>由于 Buffer 在调用 toString 方法时，默认使用的是 utf8 编码，所以输出了乱码，这里我们将 toString 的编码方式改成 utf16 就可以正常输出了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span><span class="token string">\'./1.txt\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>buffer<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token string">\'utf16le\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025743.png" alt="正常输出"></p>\n<h2 id="%E8%AE%A4%E8%AF%86-stream">认识 Stream<a class="anchor" href="#%E8%AE%A4%E8%AF%86-stream">§</a></h2>\n<p>前面我们说过，在 Node.js 中可以利用 Buffer 来存放一段二进制数据，但是如果这个数据量非常的大使用 Buffer 就会消耗相当大的内存，这个时候就需要用到 Node.js 中的 Stream（流）。要理解流，就必须知道管道的概念。</p>\n<blockquote>\n<p>在<a href="https://zh.wikipedia.org/wiki/Unix-like">类Unix</a><a href="https://zh.wikipedia.org/wiki/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F">操作系统</a>（以及一些其他借用了这个设计的操作系统，如Windows）中，<strong>管道</strong>是一系列将<a href="https://zh.wikipedia.org/wiki/%E6%A0%87%E5%87%86%E6%B5%81">标准输入输出</a>链接起来的<a href="https://zh.wikipedia.org/wiki/%E8%BF%9B%E7%A8%8B">进程</a>，其中每一个进程的<a href="https://zh.wikipedia.org/wiki/Stdout">输出</a>被直接作为下一个进程的<a href="https://zh.wikipedia.org/wiki/Stdin">输入</a>。 这个概念是由<a href="https://zh.wikipedia.org/wiki/%E9%81%93%E6%A0%BC%E6%8B%89%E6%96%AF%C2%B7%E9%BA%A5%E5%85%8B%E7%BE%85%E4%BC%8A">道格拉斯·麦克罗伊</a>为<a href="https://zh.wikipedia.org/wiki/Unix_shell">Unix 命令行</a>发明的，因与物理上的<a href="https://zh.wikipedia.org/wiki/%E7%AE%A1%E9%81%93">管道</a>相似而得名。</p>\n<p>-- 摘自维基百科</p>\n</blockquote>\n<p>我们经常在 Linux 命令行使用管道，将一个命令的结果传输给另一个命令，例如，用来搜索文件。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">ls</span> <span class="token operator">|</span> <span class="token function">grep</span> code\n</code></pre>\n<p>这里使用 <code>ls</code> 列出当前目录的文件，然后交由 <code>grep</code> 查找包含 <code>code</code> 关键词的文件。</p>\n<p>在前端的构建工具 <code>gulp</code> 中也用到了管道的概念，因为使用了管道的方式来进行构建，大大简化了工作流，用户量一下子就超越了 <code>grunt</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 使用 gulp 编译 scss</span>\n<span class="token keyword">const</span> gulp <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> sass <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp-sass\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> csso <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp-csso\'</span><span class="token punctuation">)</span>\n\ngulp<span class="token punctuation">.</span><span class="token method function property-access">task</span><span class="token punctuation">(</span><span class="token string">\'sass\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> gulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./**/*.scss\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">sass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// scss 转 css</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">csso</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 压缩 css</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./css\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>前面说了这么多管道，那管道和流直接应该怎么联系呢。流可以理解为水流，水要流向哪里，就是由管道来决定的，如果没有管道，水也就不能形成水流了，所以流必须要依附管道。在 Node.js 中所有的 IO 操作都可以通过流来完成，因为 IO 操作的本质就是从一个地方流向另一个地方。例如，一次网络请求，就是将服务端的数据流向客户端。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">request<span class="token punctuation">,</span> response</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token comment">// 创建数据流</span>\n    <span class="token keyword">const</span> stream <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将数据流通过管道传输给响应流</span>\n    stream<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nserver<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8100</span><span class="token punctuation">)</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// data.json</span>\n<span class="token punctuation">{</span> <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"data"</span> <span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-012721.png" alt="pipe"></p>\n<p>使用 Stream 会一边读取 <code>data.json</code> 一边将数据写入响应流，而不是像 Buffer 一样，先将整个 <code>data.json</code> 读取到内存，然后一次性输出到响应中，所以使用 Stream 的时候会更加节约内存。</p>\n<p>其实 Stream 在内部依然是运作在 Buffer 上。如果我们把一段二进制数据比做一桶水，那么通过 Buffer 进行文件传输就是直接将一桶水倒入到另一个桶里面，而使用 Stream，就是将桶里面的水通过管道一点点的抽取过去。</p>\n<h3 id="stream-%E4%B8%8E-buffer-%E5%86%85%E5%AD%98%E6%B6%88%E8%80%97%E5%AF%B9%E6%AF%94">Stream 与 Buffer 内存消耗对比<a class="anchor" href="#stream-%E4%B8%8E-buffer-%E5%86%85%E5%AD%98%E6%B6%88%E8%80%97%E5%AF%B9%E6%AF%94">§</a></h3>\n<p>这里如果只是口头说说可能感知不明显，现在分别通过 Stream 和 Buffer 来复制一个 2G 大小的文件，看看 node 进程的内存消耗。</p>\n<h4 id="stream-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">Stream 复制文件<a class="anchor" href="#stream-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Stream 复制文件</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'finish\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-10-025259.png" alt="stream内存占用"></p>\n<h4 id="buffer-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">Buffer 复制文件<a class="anchor" href="#buffer-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Buffer 复制文件</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\n<span class="token comment">// fs.readFile 直接输出的是文件 Buffer</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> buffer</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">writeFile</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">,</span> buffer<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-10-025426.png" alt="buffer内存占用"></p>\n<p>通过上图的结果可以看出，通过 Stream 拷贝时，只占用了我电脑 0.6% 的内存，而使用 Buffer 时，占用了 15.3% 的内存。</p>\n<h3 id="api-%E7%AE%80%E4%BB%8B-1">API 简介<a class="anchor" href="#api-%E7%AE%80%E4%BB%8B-1">§</a></h3>\n<p>在 Node.js 中，Steam 一共被分为五种类型。</p>\n<ul>\n<li>可读流（Readable），可读取数据的流；</li>\n<li>可写流（Writable），可写入数据的流；</li>\n<li>双工流（Duplex），可读又可写的流；</li>\n<li>转化流（Transform），在读写过程中可任意修改和转换数据的流（也是可读写的流）；</li>\n</ul>\n<p>所有的流都可以通过 <code>.pipe</code> 也就是管道（类似于 linux 中的 <code>|</code>）来进行数据的消费。另外，也可以通过事件来监听数据的流动。不管是文件的读写，还是 http 的请求、响应都会在内部自动创建 Stream，读取文件时，会创建一个可读流，输出文件时，会创建可写流。</p>\n<p>####可读流（Readable）</p>\n<p>虽然叫做可读流，但是可读流也是可写的，只是这个写操作一般是在内部进行的，外部只需要读取就行了。</p>\n<p>可读流一般分为两种模式：</p>\n<ul>\n<li>流动模式：表示正在读取数据，一般通过事件监听来获取流中的数据。</li>\n<li>暂停模式：此时流中的数据不会被消耗，如果在暂停模式需要读取可读流的数据，需要显式调用<code>stram.read()</code>。</li>\n</ul>\n<p>可读流在创建时，默认为暂停模式，一旦调用了 <code>.pipe</code>，或者监听了 <code>data</code> 事件，就会自动切换到流动模式。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Readable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可读流</span>\n<span class="token keyword">const</span> readable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Readable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 绑定 data 事件，将模式变为流动模式</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token parameter">chunk</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'chunk:\'</span><span class="token punctuation">,</span> chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 输出 chunk</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入 5 个字母</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">97</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">102</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> str <span class="token operator">=</span> <span class="token known-class-name class-name">String</span><span class="token punctuation">.</span><span class="token method function property-access">fromCharCode</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 推入 `null` 表示流已经结束</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-035958.png" alt="事件读取可读流"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Readable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可读流</span>\n<span class="token keyword">const</span> readable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Readable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入 5 个字母</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">97</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">102</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> str <span class="token operator">=</span> <span class="token known-class-name class-name">String</span><span class="token punctuation">.</span><span class="token method function property-access">fromCharCode</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 推入 `null` 表示流已经结束</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n<span class="token comment">// 通过管道将流的数据输出到控制台</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token property-access">stdout</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-040239.png" alt="管道输出可读流"></p>\n<p>上面的代码都是手动创建可读流，然后通过 <code>push</code> 方法往流里面写数据的。前面说过，Node.js 中数据的写入都是内部实现的，下面通过读取文件的 fs 创建的可读流来举例：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建 data.json 文件的可读流</span>\n<span class="token keyword">const</span> read <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 监听 data 事件，此时变成流动模式</span>\nread<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token parameter">json</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'json:\'</span><span class="token punctuation">,</span> json<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-054231.png" alt="fs.createReadStream"></p>\n<h4 id="%E5%8F%AF%E5%86%99%E6%B5%81writable">可写流（Writable）<a class="anchor" href="#%E5%8F%AF%E5%86%99%E6%B5%81writable">§</a></h4>\n<p>可写流对比起可读流，它是真的只能写，属于只进不出的类型，类似于貔貅。</p>\n<p>创建可写流的时候，必须手动实现一个 <code>_write()</code> 方法，因为前面有下划线前缀表明这是内部方法，一般不由用户直接实现，所以该方法都是在 Node.js 内部定义，例如，文件可写流会在该方法中将传入的 <code>Buffer</code> 写入到指定文本中。</p>\n<p>写入如果结束，一般需要调用可写流的 <code>.end()</code> 方法，表示结束本次写入，此时还会调用 <code>finish</code> 事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Writable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Writable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 绑定 _write 方法，在控制台输出写入的数据</span>\nwritable<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_write</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">chunk</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 写入数据</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token string">\'abc\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><code>_write</code> 方法也可以在实例可写流的时候，通过传入对象的 <code>write</code> 属性来实现。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Writable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Writable</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token comment">// 同，绑定 _write 方法</span>\n  <span class="token function">write</span><span class="token punctuation">(</span><span class="token parameter">chunk</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入数据</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token string">\'abc\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-093306.png" alt="手动写入"></p>\n<p>下面看看 Node.js 中内部通过 fs 创建的可写流。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 写入数据，与自己手动创建的可写流一致</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{\n  "name": "data"\n}</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>看到这里就能理解，Node.js 在 http 响应时，需要调用 <code>.end()</code> 方法来结束响应，其实内部就是一个可写流。现在再回看前面通过 Stream 来复制文件的代码就更加容易理解了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'finish\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E5%8F%8C%E5%B7%A5%E6%B5%81duplex">双工流（Duplex）<a class="anchor" href="#%E5%8F%8C%E5%B7%A5%E6%B5%81duplex">§</a></h4>\n<p>双工流同时实现了 Readable 和 Writable，具体用法可以参照可读流和可写流，这里就不占用文章篇幅了。</p>\n<h4 id="%E7%AE%A1%E9%81%93%E4%B8%B2%E8%81%94">管道串联<a class="anchor" href="#%E7%AE%A1%E9%81%93%E4%B8%B2%E8%81%94">§</a></h4>\n<p>前面介绍了通过管道（<code>.pipe()</code>）可以将一个桶里的数据转移到另一个桶里，但是有多个桶的时候，我们就需要多次调用 <code>.pipe()</code>。例如，我们有一个文件，需要经过 gzip 压缩后重新输出。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> zlib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'zlib\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> gzip <span class="token operator">=</span> zlib<span class="token punctuation">.</span><span class="token method function property-access">createGzip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// gzip 为一个双工流，可读可写</span>\n<span class="token keyword">const</span> input <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> output <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json.gz\'</span><span class="token punctuation">)</span>\n\ninput<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gzip<span class="token punctuation">)</span> <span class="token comment">// 文件压缩</span>\ngzip<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span> <span class="token comment">// 压缩后输出</span>\n</code></pre>\n<p>面对这种情况，Node.js 提供了 <code>pipeline()</code> api，可以一次性完成多个管道操作，而且还支持错误处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> pipeline <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> zlib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'zlib\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> gzip <span class="token operator">=</span> zlib<span class="token punctuation">.</span><span class="token method function property-access">createGzip</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> input <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> output <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json.gz\'</span><span class="token punctuation">)</span>\n\n<span class="token function">pipeline</span><span class="token punctuation">(</span>\n  input<span class="token punctuation">,</span>   <span class="token comment">// 输入</span>\n  gzip<span class="token punctuation">,</span>    <span class="token comment">// 压缩</span>\n  output<span class="token punctuation">,</span>  <span class="token comment">// 输出</span>\n  <span class="token comment">// 最后一个参数为回调函数，用于错误捕获</span>\n  <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'压缩失败\'</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'压缩成功\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html">字符编码笔记</a></li>\n<li><a href="http://nodejs.cn/api/buffer.html">Buffer | Node.js API</a></li>\n<li><a href="http://nodejs.cn/api/stream.html">stream | Node.js API</a></li>\n<li><a href="https://github.com/jabez128/stream-handbook">stream-handbook</a></li>\n</ul>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "Node.js \u4E0E\u4E8C\u8FDB\u5236\u6570\u636E\u6D41"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E8%AE%A4%E8%AF%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">认识二进制数据<a class="anchor" href="#%E8%AE%A4%E8%AF%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">§</a></h2>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-040056.jpg" alt="二进制数据"></p>\n<blockquote>\n<p>二进制是计算技术中广泛采用的一种数制。二进制数据是用0和1两个数码来表示的数。它的基数为2，进位规则是“逢二进一”，借位规则是“借一当二”，由18世纪德国数理哲学大师<a href="https://baike.baidu.com/item/%E8%8E%B1%E5%B8%83%E5%B0%BC%E5%85%B9/389878">莱布尼兹</a>发现。</p>\n<p>—— 百度百科</p>\n</blockquote>\n<p>二进制数据就像上图一样，由0和1来存储数据。普通的十进制数转化成二进制数一般采用&quot;除2取余，逆序排列&quot;法，用2整除十进制整数，可以得到一个商和余数；再用2去除商，又会得到一个商和余数，如此进行，直到商为小于1时为止，然后把先得到的余数作为二进制数的低位有效位，后得到的余数作为二进制数的高位有效位，依次排列起来。例如，数字10转成二进制就是<code>1010</code>，那么数字10在计算机中就以<code>1010</code>的形式存储。</p>\n<p>而字母和一些符号则需要通过 ASCII 码来对应，例如，字母a对应的 ACSII 码是 97，二进制表示就是<code>0110 0001</code>。JavaScript 中可以使用 <code>charCodeAt</code> 方法获取字符对应的 ASCII：</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-17-114252.png" alt="ASCII"></p>\n<p>除了ASCII外，还有一些其他的编码方式来映射不同字符，比如我们使用的汉字，通过 JavaScript 的 charCodeAt 方法得到的是其 <code>UTF-16</code> 的编码。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-17-114211.png" alt="中文的编码"></p>\n<h3 id="node-%E5%A4%84%E7%90%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">Node 处理二进制数据<a class="anchor" href="#node-%E5%A4%84%E7%90%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>JavaScript 在诞生初期主要用于表单信息的处理，所以 JavaScript 天生擅长对字符串进行处理，可以看到 String 的原型提供特别多便利的字符串操作方式。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-13-115403.png" alt="String.prototype"></p>\n<p>但是，在服务端如果只能操作字符是远远不够的，特别是网络和文件的一些 IO 操作上，还需要支持二进制数据流的操作，而 Node.js 的 Buffer 就是为了支持这些而存在的。好在 ES6 发布后，引入了<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays">类型数组</a>（TypedArray）的概念，又逐步补充了二进制数据处理的能力，现在在 Node.js 中也可以直接使用，但是在 Node.js 中，还是 Buffer 更加适合二进制数据的处理，而且拥有更优的性能，当然 Buffer 也可以直接看做 TypedArray 中的  <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array">Uint8Array</a>。除了 Buffer，Node.js 中还提供了 stream 接口，主要用于处理大文件的 IO 操作，相对于将文件分批分片进行处理。</p>\n<h2 id="%E8%AE%A4%E8%AF%86-buffer">认识 Buffer<a class="anchor" href="#%E8%AE%A4%E8%AF%86-buffer">§</a></h2>\n<p>Buffer 直译成中文是『缓冲区』的意思，顾名思义，在 Node.js 中实例化的 Buffer 也是专门用来存放二进制数据的缓冲区。一个 Buffer 可以理解成开辟的一块内存区域，Buffer 的大小就是开辟的内存区域的大小。下面来看看Buffer 的基本使用方法。</p>\n<h3 id="api-%E7%AE%80%E4%BB%8B">API 简介<a class="anchor" href="#api-%E7%AE%80%E4%BB%8B">§</a></h3>\n<p>早期的 Buffer 通过构造函数进行创建，通过不同的参数分配不同的 Buffer。</p>\n<h4 id="new-buffersize">new Buffer(size)<a class="anchor" href="#new-buffersize">§</a></h4>\n<p>创建大小为 size(number) 的 Buffer。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 00 00 00 00 00></span>\n</code></pre>\n<h4 id="new-bufferarray">new Buffer(array)<a class="anchor" href="#new-bufferarray">§</a></h4>\n<p>使用八位字节数组 array 分配一个新的 Buffer。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0x74</span><span class="token punctuation">,</span> <span class="token number">0x65</span><span class="token punctuation">,</span> <span class="token number">0x73</span><span class="token punctuation">,</span> <span class="token number">0x74</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 74 65 73 74></span>\n<span class="token comment">// 对应 ASCII 码，这几个16进制数分别对应 t e s t</span>\n\n<span class="token comment">// 将 Buffer 实例转为字符串得到如下结果</span>\nbuf<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// \'test\'</span>\n</code></pre>\n<h4 id="new-bufferbuffer">new Buffer(buffer)<a class="anchor" href="#new-bufferbuffer">§</a></h4>\n<p>拷贝 buffer 的数据到新建的 Buffer 实例。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token string">\'test\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buf2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span>buf1<span class="token punctuation">)</span>\n</code></pre>\n<h4 id="new-bufferstring-encoding">new Buffer(string[, encoding])<a class="anchor" href="#new-bufferstring-encoding">§</a></h4>\n<p>创建内容为 string 的 Buffer，指定编码方式为 encoding。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> buf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Buffer</span><span class="token punctuation">(</span><span class="token string">\'test\'</span><span class="token punctuation">)</span>\n<span class="token comment">// &lt;Buffer 74 65 73 74></span>\n<span class="token comment">// 可以看到结果与 new Buffer([0x74, 0x65, 0x73, 0x74]) 一致</span>\n\nbuf<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// \'test\'</span>\n</code></pre>\n<h3 id="%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-buffer">更安全的 Buffer<a class="anchor" href="#%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-buffer">§</a></h3>\n<p>由于 Buffer 实例因第一个参数类型而执行不同的结果，如果开发者不对参数进行校验，很容易导致一些安全问题。例如，我要创建一个内容为字符串 <code>&quot;20&quot;</code> 的 Buffer，而错误的传入了数字 <code>20</code>，结果创建了一个长度为 20 的Buffer 实例。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-035250.png" alt="不安全的Buffer"></p>\n<p>可以看到上图，Node.js 8 之前，为了高性能的考虑，Buffer 开辟的内存空间并未释放之前已存在的数据，直接将这个 Buffer 返回可能导致敏感信息的泄露。因此，Buffer 类在 Node.js 8 前后有一次大调整，不再推荐使用 Buffer 构造函数实例 Buffer，而是改用<code>Buffer.from()</code>、<code>Buffer.alloc()</code> 与 <code>Buffer.allocUnsafe()</code> 来替代 <code>new Buffer()</code>。</p>\n<h4 id="bufferfrom">Buffer.from()<a class="anchor" href="#bufferfrom">§</a></h4>\n<p>该方法用于替代 <code>new Buffer(string)</code>、<code>new Buffer(array)</code>、<code>new Buffer(buffer)</code>。</p>\n<h4 id="bufferallocsize-fill-encoding">Buffer.alloc(size[, fill[, encoding]])<a class="anchor" href="#bufferallocsize-fill-encoding">§</a></h4>\n<p>该方法用于替代 <code>new Buffer(size)</code>，其创建的 Buffer 实例默认会使用 0 填充内存，也就是会将内存之前的数据全部覆盖掉，比之前的 <code>new Buffer(size)</code> 更加安全，因为要覆盖之前的内存空间，也意味着更低的性能。</p>\n<p>同时，size 参数如果不是一个数字，会抛出 TypeError。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-16-035348.png" alt="安全的Buffer"></p>\n<h4 id="bufferallocunsafesize">Buffer.allocUnsafe(size)<a class="anchor" href="#bufferallocunsafesize">§</a></h4>\n<p>该方法与之前的 <code>new Buffer(size)</code> 保持一致，虽然该方法不安全，但是相比起 <code>alloc</code> 具有明显的性能优势。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-040209.png" alt="不安全的Buffer"></p>\n<h3 id="buffer-%E7%9A%84%E7%BC%96%E7%A0%81">Buffer 的编码<a class="anchor" href="#buffer-%E7%9A%84%E7%BC%96%E7%A0%81">§</a></h3>\n<p>前面介绍过二进制数据与字符对应需要指定编码，同理将字符串转化为 Buffer、Buffer 转化为字符串都是需要指定编码的。</p>\n<p>Node.js 目前支持的编码方式如下：</p>\n<ul>\n<li><code>hex</code>：将每个字节编码成两个十六进制的字符。</li>\n<li><code>ascii</code>：仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位。</li>\n<li><code>utf8</code>：多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。</li>\n<li><code>utf16le</code>：2 或 4 个字节，小端序编码的 Unicode 字符。</li>\n<li><code>ucs2</code>：<code>utf16le</code> 的别名。</li>\n<li><code>base64</code>：Base64 编码。</li>\n<li><code>latin1</code>：一种将 <code>Buffer</code> 编码成单字节编码字符串的方法。</li>\n<li><code>binary</code>：<code>latin1</code> 的别名。</li>\n</ul>\n<p>比较常用的就是 <code>UTF-8</code>、<code>UTF-16</code>、<code>ASCII</code>，前面说过 JavaScript 的 <code>charCodeAt</code> 使用的是 <code>UTF-16</code> 编码方式，或者说 JavaScript 中的字符串都是通过 <code>UTF-16</code> 存储的，不过 Buffer 默认的编码是 <code>UTF-8</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-040426.png" alt="Buffer编码"></p>\n<p>可以看到一个汉字在 <code>UTF-8</code> 下需要占用 3 个字节，而 <code>UTF-16</code> 只需要 2 个字节。主要原因是 <code>UTF-8</code> 是一种可变长的字符编码，大部分字符使用 1 个字节表示更加节省空间，而某些超出一个字节的字符，则需要用到 2 个或 3 个字节表示，大部分汉字在 <code>UTF-8</code> 中都需要用到 3 个字节来表示。<code>UTF-16</code> 则全部使用 2 个字节来表示，对于一下超出了 2 字节的字符，需要用到 4 个字节表示。 2 个字节表示的 <code>UTF-16</code> 编码与 Unicode 完全一致，通过<a href="http://www.chi2ko.com/tool/CJK.htm">汉字Unicode编码表</a>可以找到大部分中文所对应的 Unicode 编码。前面提到的 『汉』，通过 Unicode 表示为 <code>6C49</code>。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-04-19-054921.png" alt="编码表"></p>\n<p>这里提到的 Unicode 编码又被称为统一码、万国码、单一码，它为每种语言都设定了统一且唯一的二进制编码，而上面说的 <code>UTF-8</code>、<code>UTF-16</code> 都是他的一种实现方式。更多关于编码的细节不再赘述，也不是本文的重点，如果想了解更多可自行搜索。</p>\n<h4 id="%E4%B9%B1%E7%A0%81%E7%9A%84%E5%8E%9F%E5%9B%A0">乱码的原因<a class="anchor" href="#%E4%B9%B1%E7%A0%81%E7%9A%84%E5%8E%9F%E5%9B%A0">§</a></h4>\n<p>我们经常会出现一些乱码的情况，就是因为在字符串与 Buffer 的转化过程中，使用了不同编码导致的。</p>\n<p>我们先新建一个文本文件，然后通过 utf16 编码保存，然后通过 Node.js 读取改文件。</p>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025353.png" alt="utf16文本"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span><span class="token string">\'./1.txt\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>buffer<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025613.png" alt="输出乱码"></p>\n<p>由于 Buffer 在调用 toString 方法时，默认使用的是 utf8 编码，所以输出了乱码，这里我们将 toString 的编码方式改成 utf16 就可以正常输出了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> buffer <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">readFileSync</span><span class="token punctuation">(</span><span class="token string">\'./1.txt\'</span><span class="token punctuation">)</span>\n<span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>buffer<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token string">\'utf16le\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-17-025743.png" alt="正常输出"></p>\n<h2 id="%E8%AE%A4%E8%AF%86-stream">认识 Stream<a class="anchor" href="#%E8%AE%A4%E8%AF%86-stream">§</a></h2>\n<p>前面我们说过，在 Node.js 中可以利用 Buffer 来存放一段二进制数据，但是如果这个数据量非常的大使用 Buffer 就会消耗相当大的内存，这个时候就需要用到 Node.js 中的 Stream（流）。要理解流，就必须知道管道的概念。</p>\n<blockquote>\n<p>在<a href="https://zh.wikipedia.org/wiki/Unix-like">类Unix</a><a href="https://zh.wikipedia.org/wiki/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F">操作系统</a>（以及一些其他借用了这个设计的操作系统，如Windows）中，<strong>管道</strong>是一系列将<a href="https://zh.wikipedia.org/wiki/%E6%A0%87%E5%87%86%E6%B5%81">标准输入输出</a>链接起来的<a href="https://zh.wikipedia.org/wiki/%E8%BF%9B%E7%A8%8B">进程</a>，其中每一个进程的<a href="https://zh.wikipedia.org/wiki/Stdout">输出</a>被直接作为下一个进程的<a href="https://zh.wikipedia.org/wiki/Stdin">输入</a>。 这个概念是由<a href="https://zh.wikipedia.org/wiki/%E9%81%93%E6%A0%BC%E6%8B%89%E6%96%AF%C2%B7%E9%BA%A5%E5%85%8B%E7%BE%85%E4%BC%8A">道格拉斯·麦克罗伊</a>为<a href="https://zh.wikipedia.org/wiki/Unix_shell">Unix 命令行</a>发明的，因与物理上的<a href="https://zh.wikipedia.org/wiki/%E7%AE%A1%E9%81%93">管道</a>相似而得名。</p>\n<p>-- 摘自维基百科</p>\n</blockquote>\n<p>我们经常在 Linux 命令行使用管道，将一个命令的结果传输给另一个命令，例如，用来搜索文件。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token function">ls</span> <span class="token operator">|</span> <span class="token function">grep</span> code\n</code></pre>\n<p>这里使用 <code>ls</code> 列出当前目录的文件，然后交由 <code>grep</code> 查找包含 <code>code</code> 关键词的文件。</p>\n<p>在前端的构建工具 <code>gulp</code> 中也用到了管道的概念，因为使用了管道的方式来进行构建，大大简化了工作流，用户量一下子就超越了 <code>grunt</code>。</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// 使用 gulp 编译 scss</span>\n<span class="token keyword">const</span> gulp <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> sass <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp-sass\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> csso <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp-csso\'</span><span class="token punctuation">)</span>\n\ngulp<span class="token punctuation">.</span><span class="token method function property-access">task</span><span class="token punctuation">(</span><span class="token string">\'sass\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword control-flow">return</span> gulp<span class="token punctuation">.</span><span class="token method function property-access">src</span><span class="token punctuation">(</span><span class="token string">\'./**/*.scss\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">sass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// scss 转 css</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span><span class="token function">csso</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 压缩 css</span>\n    <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token method function property-access">dest</span><span class="token punctuation">(</span><span class="token string">\'./css\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p>前面说了这么多管道，那管道和流直接应该怎么联系呢。流可以理解为水流，水要流向哪里，就是由管道来决定的，如果没有管道，水也就不能形成水流了，所以流必须要依附管道。在 Node.js 中所有的 IO 操作都可以通过流来完成，因为 IO 操作的本质就是从一个地方流向另一个地方。例如，一次网络请求，就是将服务端的数据流向客户端。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'http\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token method function property-access">createServer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">request<span class="token punctuation">,</span> response</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token comment">// 创建数据流</span>\n    <span class="token keyword">const</span> stream <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n    <span class="token comment">// 将数据流通过管道传输给响应流</span>\n    stream<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>response<span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nserver<span class="token punctuation">.</span><span class="token method function property-access">listen</span><span class="token punctuation">(</span><span class="token number">8100</span><span class="token punctuation">)</span>\n</code></pre>\n<pre class="language-js"><code class="language-js"><span class="token comment">// data.json</span>\n<span class="token punctuation">{</span> <span class="token string">"name"</span><span class="token operator">:</span> <span class="token string">"data"</span> <span class="token punctuation">}</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-012721.png" alt="pipe"></p>\n<p>使用 Stream 会一边读取 <code>data.json</code> 一边将数据写入响应流，而不是像 Buffer 一样，先将整个 <code>data.json</code> 读取到内存，然后一次性输出到响应中，所以使用 Stream 的时候会更加节约内存。</p>\n<p>其实 Stream 在内部依然是运作在 Buffer 上。如果我们把一段二进制数据比做一桶水，那么通过 Buffer 进行文件传输就是直接将一桶水倒入到另一个桶里面，而使用 Stream，就是将桶里面的水通过管道一点点的抽取过去。</p>\n<h3 id="stream-%E4%B8%8E-buffer-%E5%86%85%E5%AD%98%E6%B6%88%E8%80%97%E5%AF%B9%E6%AF%94">Stream 与 Buffer 内存消耗对比<a class="anchor" href="#stream-%E4%B8%8E-buffer-%E5%86%85%E5%AD%98%E6%B6%88%E8%80%97%E5%AF%B9%E6%AF%94">§</a></h3>\n<p>这里如果只是口头说说可能感知不明显，现在分别通过 Stream 和 Buffer 来复制一个 2G 大小的文件，看看 node 进程的内存消耗。</p>\n<h4 id="stream-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">Stream 复制文件<a class="anchor" href="#stream-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Stream 复制文件</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'finish\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-10-025259.png" alt="stream内存占用"></p>\n<h4 id="buffer-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">Buffer 复制文件<a class="anchor" href="#buffer-%E5%A4%8D%E5%88%B6%E6%96%87%E4%BB%B6">§</a></h4>\n<pre class="language-js"><code class="language-js"><span class="token comment">// Buffer 复制文件</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\n<span class="token comment">// fs.readFile 直接输出的是文件 Buffer</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">readFile</span><span class="token punctuation">(</span>file<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> buffer</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    fs<span class="token punctuation">.</span><span class="token method function property-access">writeFile</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">,</span> buffer<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n        <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-05-10-025426.png" alt="buffer内存占用"></p>\n<p>通过上图的结果可以看出，通过 Stream 拷贝时，只占用了我电脑 0.6% 的内存，而使用 Buffer 时，占用了 15.3% 的内存。</p>\n<h3 id="api-%E7%AE%80%E4%BB%8B-1">API 简介<a class="anchor" href="#api-%E7%AE%80%E4%BB%8B-1">§</a></h3>\n<p>在 Node.js 中，Steam 一共被分为五种类型。</p>\n<ul>\n<li>可读流（Readable），可读取数据的流；</li>\n<li>可写流（Writable），可写入数据的流；</li>\n<li>双工流（Duplex），可读又可写的流；</li>\n<li>转化流（Transform），在读写过程中可任意修改和转换数据的流（也是可读写的流）；</li>\n</ul>\n<p>所有的流都可以通过 <code>.pipe</code> 也就是管道（类似于 linux 中的 <code>|</code>）来进行数据的消费。另外，也可以通过事件来监听数据的流动。不管是文件的读写，还是 http 的请求、响应都会在内部自动创建 Stream，读取文件时，会创建一个可读流，输出文件时，会创建可写流。</p>\n<p>####可读流（Readable）</p>\n<p>虽然叫做可读流，但是可读流也是可写的，只是这个写操作一般是在内部进行的，外部只需要读取就行了。</p>\n<p>可读流一般分为两种模式：</p>\n<ul>\n<li>流动模式：表示正在读取数据，一般通过事件监听来获取流中的数据。</li>\n<li>暂停模式：此时流中的数据不会被消耗，如果在暂停模式需要读取可读流的数据，需要显式调用<code>stram.read()</code>。</li>\n</ul>\n<p>可读流在创建时，默认为暂停模式，一旦调用了 <code>.pipe</code>，或者监听了 <code>data</code> 事件，就会自动切换到流动模式。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Readable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可读流</span>\n<span class="token keyword">const</span> readable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Readable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 绑定 data 事件，将模式变为流动模式</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token parameter">chunk</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'chunk:\'</span><span class="token punctuation">,</span> chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 输出 chunk</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入 5 个字母</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">97</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">102</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> str <span class="token operator">=</span> <span class="token known-class-name class-name">String</span><span class="token punctuation">.</span><span class="token method function property-access">fromCharCode</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 推入 `null` 表示流已经结束</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-035958.png" alt="事件读取可读流"></p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Readable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可读流</span>\n<span class="token keyword">const</span> readable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Readable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入 5 个字母</span>\n<span class="token keyword control-flow">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">97</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">102</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> str <span class="token operator">=</span> <span class="token known-class-name class-name">String</span><span class="token punctuation">.</span><span class="token method function property-access">fromCharCode</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  readable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 推入 `null` 表示流已经结束</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token string">\'\n\'</span><span class="token punctuation">)</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">push</span><span class="token punctuation">(</span><span class="token keyword null nil">null</span><span class="token punctuation">)</span>\n<span class="token comment">// 通过管道将流的数据输出到控制台</span>\nreadable<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span><span class="token property-access">stdout</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-040239.png" alt="管道输出可读流"></p>\n<p>上面的代码都是手动创建可读流，然后通过 <code>push</code> 方法往流里面写数据的。前面说过，Node.js 中数据的写入都是内部实现的，下面通过读取文件的 fs 创建的可读流来举例：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建 data.json 文件的可读流</span>\n<span class="token keyword">const</span> read <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 监听 data 事件，此时变成流动模式</span>\nread<span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'data\'</span><span class="token punctuation">,</span> <span class="token parameter">json</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'json:\'</span><span class="token punctuation">,</span> json<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-054231.png" alt="fs.createReadStream"></p>\n<h4 id="%E5%8F%AF%E5%86%99%E6%B5%81writable">可写流（Writable）<a class="anchor" href="#%E5%8F%AF%E5%86%99%E6%B5%81writable">§</a></h4>\n<p>可写流对比起可读流，它是真的只能写，属于只进不出的类型，类似于貔貅。</p>\n<p>创建可写流的时候，必须手动实现一个 <code>_write()</code> 方法，因为前面有下划线前缀表明这是内部方法，一般不由用户直接实现，所以该方法都是在 Node.js 内部定义，例如，文件可写流会在该方法中将传入的 <code>Buffer</code> 写入到指定文本中。</p>\n<p>写入如果结束，一般需要调用可写流的 <code>.end()</code> 方法，表示结束本次写入，此时还会调用 <code>finish</code> 事件。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Writable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Writable</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token comment">// 绑定 _write 方法，在控制台输出写入的数据</span>\nwritable<span class="token punctuation">.</span><span class="token method-variable function-variable method function property-access">_write</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">chunk</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// 写入数据</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token string">\'abc\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><code>_write</code> 方法也可以在实例可写流的时候，通过传入对象的 <code>write</code> 属性来实现。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token maybe-class-name">Writable</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Writable</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n  <span class="token comment">// 同，绑定 _write 方法</span>\n  <span class="token function">write</span><span class="token punctuation">(</span><span class="token parameter">chunk</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span>chunk<span class="token punctuation">.</span><span class="token method function property-access">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token comment">// 写入数据</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token string">\'abc\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/ipic/2020-06-30-093306.png" alt="手动写入"></p>\n<p>下面看看 Node.js 中内部通过 fs 创建的可写流。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token comment">// 创建可写流</span>\n<span class="token keyword">const</span> writable <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n\n<span class="token comment">// 写入数据，与自己手动创建的可写流一致</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">write</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">{\n  "name": "data"\n}</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n<span class="token comment">// 结束写入</span>\nwritable<span class="token punctuation">.</span><span class="token method function property-access">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n<p>看到这里就能理解，Node.js 在 http 响应时，需要调用 <code>.end()</code> 方法来结束响应，其实内部就是一个可写流。现在再回看前面通过 Stream 来复制文件的代码就更加容易理解了。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">const</span> file <span class="token operator">=</span> <span class="token string">\'./file.mp4\'</span><span class="token punctuation">;</span>\nfs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./file.copy.mp4\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token method function property-access">on</span><span class="token punctuation">(</span><span class="token string">\'finish\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'file successfully copy\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E5%8F%8C%E5%B7%A5%E6%B5%81duplex">双工流（Duplex）<a class="anchor" href="#%E5%8F%8C%E5%B7%A5%E6%B5%81duplex">§</a></h4>\n<p>双工流同时实现了 Readable 和 Writable，具体用法可以参照可读流和可写流，这里就不占用文章篇幅了。</p>\n<h4 id="%E7%AE%A1%E9%81%93%E4%B8%B2%E8%81%94">管道串联<a class="anchor" href="#%E7%AE%A1%E9%81%93%E4%B8%B2%E8%81%94">§</a></h4>\n<p>前面介绍了通过管道（<code>.pipe()</code>）可以将一个桶里的数据转移到另一个桶里，但是有多个桶的时候，我们就需要多次调用 <code>.pipe()</code>。例如，我们有一个文件，需要经过 gzip 压缩后重新输出。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> zlib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'zlib\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> gzip <span class="token operator">=</span> zlib<span class="token punctuation">.</span><span class="token method function property-access">createGzip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// gzip 为一个双工流，可读可写</span>\n<span class="token keyword">const</span> input <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> output <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json.gz\'</span><span class="token punctuation">)</span>\n\ninput<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>gzip<span class="token punctuation">)</span> <span class="token comment">// 文件压缩</span>\ngzip<span class="token punctuation">.</span><span class="token method function property-access">pipe</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span> <span class="token comment">// 压缩后输出</span>\n</code></pre>\n<p>面对这种情况，Node.js 提供了 <code>pipeline()</code> api，可以一次性完成多个管道操作，而且还支持错误处理。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> <span class="token punctuation">{</span> pipeline <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'stream\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'fs\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> zlib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'zlib\'</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> gzip <span class="token operator">=</span> zlib<span class="token punctuation">.</span><span class="token method function property-access">createGzip</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> input <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createReadStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> output <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token method function property-access">createWriteStream</span><span class="token punctuation">(</span><span class="token string">\'./data.json.gz\'</span><span class="token punctuation">)</span>\n\n<span class="token function">pipeline</span><span class="token punctuation">(</span>\n  input<span class="token punctuation">,</span>   <span class="token comment">// 输入</span>\n  gzip<span class="token punctuation">,</span>    <span class="token comment">// 压缩</span>\n  output<span class="token punctuation">,</span>  <span class="token comment">// 输出</span>\n  <span class="token comment">// 最后一个参数为回调函数，用于错误捕获</span>\n  <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">error</span><span class="token punctuation">(</span><span class="token string">\'压缩失败\'</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword control-flow">else</span> <span class="token punctuation">{</span>\n      <span class="token console class-name">console</span><span class="token punctuation">.</span><span class="token method function property-access">log</span><span class="token punctuation">(</span><span class="token string">\'压缩成功\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">)</span>\n</code></pre>\n<h2 id="%E5%8F%82%E8%80%83">参考<a class="anchor" href="#%E5%8F%82%E8%80%83">§</a></h2>\n<ul>\n<li><a href="http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html">字符编码笔记</a></li>\n<li><a href="http://nodejs.cn/api/buffer.html">Buffer | Node.js API</a></li>\n<li><a href="http://nodejs.cn/api/stream.html">stream | Node.js API</a></li>\n<li><a href="https://github.com/jabez128/stream-handbook">stream-handbook</a></li>\n</ul>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%AE%A4%E8%AF%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE" }, "\u8BA4\u8BC6\u4E8C\u8FDB\u5236\u6570\u636E"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#node-%E5%A4%84%E7%90%86%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0%E6%8D%AE" }, "Node \u5904\u7406\u4E8C\u8FDB\u5236\u6570\u636E")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%AE%A4%E8%AF%86-buffer" }, "\u8BA4\u8BC6 Buffer"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#api-%E7%AE%80%E4%BB%8B" }, "API \u7B80\u4ECB"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%9B%B4%E5%AE%89%E5%85%A8%E7%9A%84-buffer" }, "\u66F4\u5B89\u5168\u7684 Buffer"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#buffer-%E7%9A%84%E7%BC%96%E7%A0%81" }, "Buffer \u7684\u7F16\u7801"),
                        React.createElement("ol", null)))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E8%AE%A4%E8%AF%86-stream" }, "\u8BA4\u8BC6 Stream"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#stream-%E4%B8%8E-buffer-%E5%86%85%E5%AD%98%E6%B6%88%E8%80%97%E5%AF%B9%E6%AF%94" }, "Stream \u4E0E Buffer \u5185\u5B58\u6D88\u8017\u5BF9\u6BD4"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#api-%E7%AE%80%E4%BB%8B-1" }, "API \u7B80\u4ECB"),
                        React.createElement("ol", null)))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%8F%82%E8%80%83" }, "\u53C2\u8003")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/06/30",
    'updated': null,
    'excerpt': "认识二进制数据 二进制数据就像上图一样，由0和1来存储数据。普通的十进制数转化成二进制数一般采用\"除2取余，逆序排列\"法，用2整除十进制整数，可以得到一个商和余数；再用2去除商，又会得到一个商和余数，如此进行，直到商为...",
    'cover': "https://file.shenfq.com/ipic/2020-04-16-040056.jpg",
    'categories': [
        "Node.js"
    ],
    'tags': [
        "Node",
        "Buffer",
        "Stream",
        "二进制"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "name": "年终总结",
                "count": 4
            },
            {
                "name": "Go",
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
                "name": "React",
                "count": 5
            },
            {
                "name": "翻译",
                "count": 5
            },
            {
                "name": "Go",
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
