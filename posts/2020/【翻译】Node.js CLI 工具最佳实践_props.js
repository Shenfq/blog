import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2020/【翻译】Node.js CLI 工具最佳实践.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2020/【翻译】Node.js CLI 工具最佳实践.html",
    'title': "【翻译】Node.js CLI 工具最佳实践",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>【翻译】Node.js CLI 工具最佳实践</h1>\n<blockquote>\n<p><a href="https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/3afe1ab0a5b506ef8c32903c4bf253a4cdb4bddd/README.md#shell-interpreters-vary">原文链接</a></p>\n</blockquote>\n<p>这是一个关于如何构建成功的、可移植的、对用户友好的Node.js 命令行工具（CLI）最佳实践的集合。</p>\n<h2 id="%E4%B8%BA%E4%BB%80%E4%B9%88%E5%86%99%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0">为什么写这篇文章？<a class="anchor" href="#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%86%99%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0">§</a></h2>\n<p>一个糟糕的 CLI 工具会让用户觉得难用，而构建一个成功的 CLI 需要密切关注很多细节，同时需要站在用户的角度，创造良好的用户体验。要做到这些特别不容易。</p>\n<p>在这个指南中，我列出了在各个重点领域的最佳实践，都是 CLI 工具交互最理想的用户体验。</p>\n<h2 id="%E7%89%B9%E6%80%A7">特性：<a class="anchor" href="#%E7%89%B9%E6%80%A7">§</a></h2>\n<ul>\n<li>✅ 构建成功的 Node.js CLI 工具的 21 种最佳实践</li>\n<li>❤️ 帮忙翻译成其他语言</li>\n<li>🙏 欢迎捐赠</li>\n<li>最近更新时间：2020-02-14</li>\n</ul>\n<h2 id="%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%91">为什么是我？<a class="anchor" href="#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%91">§</a></h2>\n<p>我叫Liran Tal，我一直专注于构建命令行工具。</p>\n<p>我最近的一些工作就是构建Node.js CLI，包括以下开源项目：</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th><a href="https://github.com/lirantal/dockly"><strong>Dockly</strong></a></th>\n<th><a href="https://github.com/lirantal/npq"><strong>npq</strong></a></th>\n<th><a href="https://github.com/lirantal/lockfile-lint"><strong>lockfile-lint</strong></a></th>\n<th><a href="https://github.com/lirantal/is-website-vulnerable"><strong>is-website-vulnerable</strong></a></th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>沉浸式终端界面，用于管理Docker容器和服务</td>\n<td>通过在安装过程中进行检查，以安全地使用npm / yarn 安装的软件包</td>\n<td>整理 npm 或 yarn 的 lock 文件以分析和检测安全问题</td>\n<td>在网站引用的 JS 库中查找公开的安全漏洞</td>\n</tr>\n</tbody>\n</table></div>\n<hr>\n<h2 id="1-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%9A%84%E7%BB%8F%E9%AA%8C">1 命令行的经验<a class="anchor" href="#1-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%9A%84%E7%BB%8F%E9%AA%8C">§</a></h2>\n<p>本节将会介绍创建美观且高可用的 Node.js 命令行工具相关的最佳实践。</p>\n<h3 id="11-%E5%B0%8A%E9%87%8D-posix">1.1 尊重 POSIX<a class="anchor" href="#11-%E5%B0%8A%E9%87%8D-posix">§</a></h3>\n<p>✅ <strong>正确：</strong> 使用兼容 <a href="https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html">POSIX-compliant</a> 命令行的语法，因为这是被广泛接受的命令行工具的标准。</p>\n<p>❌ <strong>错误：</strong> 当用户使用CLI，其命令行参数与他们过去的使用习惯不一致时，会感觉很难适应。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>Unix-like 操作系统普及了命令行工具，比如awk，sed。这样的工具已经有效地标准化了命令行选项「options」（又名标志「flags」），选项参数和其他操作的行为。</p>\n<p>一些案例：</p>\n<ul>\n<li>在帮助「help」中将选项参数「option-arguments」标记为方括号([])，以表示它们是可选的，或者使用尖括号(&lt;&gt;)，表示它们是必需的。</li>\n<li>参数可以使用单字符缩写，一般是 <code>-</code> 加上一个字母或数字。</li>\n<li>多个没有值的选型可进行组合，比如：<code>cli -abc</code> 等价于 <code>cli -a -b -c</code>。</li>\n</ul>\n<p>用户一般都会希望你的命令行工具与其他Unix工具具有类似的约定。</p>\n<h3 id="12-%E6%9E%84%E5%BB%BA%E5%8F%8B%E5%A5%BD%E7%9A%84-cli">1.2 构建友好的 CLI<a class="anchor" href="#12-%E6%9E%84%E5%BB%BA%E5%8F%8B%E5%A5%BD%E7%9A%84-cli">§</a></h3>\n<p>✅ <strong>正确：</strong> 尽可能多的输出一些信息以帮助用户成功使用 CLI。</p>\n<p>❌ <strong>错误：</strong> 由于 CLI 一直启动失败，又没有为用户提供足够的帮助，会让用户产生明显的挫败感。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>命令行工具的界面一定程度上应与 Web 用户界面类似，尽可能的保证程序能正常使用。</p>\n<p>构建一个对用户友好的 CLI 应该尽可能的为用户提供支持。作为实例，我们讨论下 <code>curl</code> 命令的交互，该命令期望将 URL 作为主要的数据输入，而用户却没有提供 URL，这时候命令行会提示用户通读 <code>curl --help</code> 的输出信息。但是，对用户友好的 CLI 工具会显示一个可交互式的提示，捕获用户的输入，从而正常运行。</p>\n<h3 id="13-%E6%9C%89%E7%8A%B6%E6%80%81%E7%9A%84%E6%95%B0%E6%8D%AE">1.3 有状态的数据<a class="anchor" href="#13-%E6%9C%89%E7%8A%B6%E6%80%81%E7%9A%84%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>✅ <strong>正确：</strong> 在多次调用 CLI 的过程中，提供有状态的体验，记住这些数据，以提供无缝的交互体验。</p>\n<p>❌ <strong>错误：</strong> 用户多次调用 CLI 重复提供相同的信息，会让用户感到厌烦。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>你需要为 CLI 工具提供持续缓存，比如记住用户名、电子邮件、token 或者是 CLI 多次调用的一些首选项。可以使用以下工具来保留用户的这些配置。</p>\n<ul>\n<li>\n<p><a href="https://www.npmjs.com/package/configstore">configstore</a></p>\n</li>\n<li>\n<p><a href="https://www.npmjs.com/package/conf">conf</a></p>\n</li>\n</ul>\n<h3 id="14-%E6%8F%90%E4%BE%9B%E5%A4%9A%E5%BD%A9%E7%9A%84%E4%BD%93%E9%AA%8C">1.4 提供多彩的体验<a class="anchor" href="#14-%E6%8F%90%E4%BE%9B%E5%A4%9A%E5%BD%A9%E7%9A%84%E4%BD%93%E9%AA%8C">§</a></h3>\n<p>✅ <strong>正确：</strong> 在 CLI 工具中使用颜色来突出显示一些信息，并且提供降级方案，进行检测，自动退出以免输出乱码。</p>\n<p>❌ <strong>错误：</strong> 苍白的输出可能会让用户丢失重要的信息，尤其是文本较多的时候。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>大多数的命令行工具都支持彩色文本，通过特定的 ANSI 编码来启用。\n命令行工具输出彩色文本可带来更丰富的体验和更多的交互。但是，不受支持的终端可能会在屏幕上以乱码信息的形式输出。此外，CLI 也可能用于不支持彩色输出的连续集成中。</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/chalk">chalk</a></li>\n<li><a href="https://www.npmjs.com/package/colors">colors</a></li>\n</ul>\n<h3 id="15-%E4%B8%B0%E5%AF%8C%E7%9A%84%E4%BA%A4%E4%BA%92">1.5 丰富的交互<a class="anchor" href="#15-%E4%B8%B0%E5%AF%8C%E7%9A%84%E4%BA%A4%E4%BA%92">§</a></h3>\n<p>✅ <strong>正确：</strong>  提供除了文本输入之外的其他交互形式，为用户提供更加丰富的体验。</p>\n<p>❌ <strong>错误：</strong> 当输入的信息是固定的选项（类似下拉菜单）时，文本输入的形式可能会给用户带来麻烦。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>可以以提示输入的方式引入更加丰富的交互方式，提示输入比自由的文本输入更高端。例如，下拉列表、单选按钮切换、隐藏密码输入。丰富交互的另一个方面就是动画以及进度条，在 CLI 执行异步工作时，都能为用户提供更好的体验。</p>\n<p>许多 CLI 提供默认的命令行参数，而无需用户进一步交互。不强迫用户提供一些非必要的参数。</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/prompts">prompts</a></li>\n<li><a href="https://www.npmjs.com/package/enquirer">enquirer</a></li>\n<li><a href="https://www.npmjs.com/package/ink">ink</a></li>\n<li><a href="https://www.npmjs.com/package/chalk">ora</a></li>\n</ul>\n<h3 id="16-%E6%97%A0%E5%A4%84%E4%B8%8D%E5%9C%A8%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5">1.6 无处不在的超链接<a class="anchor" href="#16-%E6%97%A0%E5%A4%84%E4%B8%8D%E5%9C%A8%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5">§</a></h3>\n<p>✅ <strong>正确：</strong>  URL（<a href="https://www.github.com">https://www.github.com</a>）和源代码（<code>src/Util.js:2:75</code>）使用格式正确的文本输出，因为这两者都是现代终端可点击的链接。</p>\n<p>❌ <strong>错误：</strong> 避免使用<code>git.io/abc</code>之类的非交互式的链接，该链接需要用户手动复制和粘贴。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>如果你要分享的信息在 Url 链接中，或者是某个文件的特定行列，则需要向用户提供正确的格式的链接，用户一旦点击它们，就会打开浏览器或者在IDE跳到特定位置。</p>\n<h3 id="17-%E9%9B%B6%E9%85%8D%E7%BD%AE">1.7 零配置<a class="anchor" href="#17-%E9%9B%B6%E9%85%8D%E7%BD%AE">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过自动检测所需的配置和命令行参数，达到即开即用的体验。</p>\n<p>❌ <strong>错误：</strong> 如果可以以可靠的方式自动检测命令行参数，并且调用的操作不需用户显式确认（例如确认删除），则不要强制用户交互。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>旨在在运行 CLI 工具时提供“即开即用”的体验。</p>\n<ul>\n<li>The <a href="https://jestjs.io/">Jest JavaScript Testing Framework</a></li>\n<li><a href="https://parceljs.org/">Parcel</a>, a web application bundler</li>\n</ul>\n<h2 id="2-%E5%8F%91%E5%B8%83">2 发布<a class="anchor" href="#2-%E5%8F%91%E5%B8%83">§</a></h2>\n<p>本节介绍了如何以最佳方式分发和打包 Node.js CLI 工具的最佳实践。</p>\n<h3 id="21-%E6%9C%80%E5%B0%8F%E5%8C%96%E7%9A%84%E4%BE%9D%E8%B5%96">2.1 最小化的依赖<a class="anchor" href="#21-%E6%9C%80%E5%B0%8F%E5%8C%96%E7%9A%84%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 最大程度地减少生产环境的依赖项，并且使用可替代的最小的依赖包，确保这是一个尽可能小的 Node.js 包。但是，也不能过于谨慎因此重复发明轮子而过度优化依赖。</p>\n<p>❌ <strong>错误：</strong> 应用中依赖的大小将决定 CLI 的安装时间，从而导致糟糕的用户体验。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用 <code>npx</code> 可以快速调用通过 <code>npm install</code> 安装的 Node.js CLI 模块，这可提供更好的用户体验。这有助于将整体的依赖关系和传递依赖关系保持在合理大小。</p>\n<p>npm 全局安装模块，安装过程会变得缓慢，这是一个糟糕的体验。通过 npx 总是获取当前项目安装的模块（当前文件夹的node_modules），因此使用 <code>npx</code> 来调用 CLI 可能会降低性能。</p>\n<h3 id="22-%E4%BD%BF%E7%94%A8%E6%96%87%E4%BB%B6%E9%94%81">2.2 使用文件锁<a class="anchor" href="#22-%E4%BD%BF%E7%94%A8%E6%96%87%E4%BB%B6%E9%94%81">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过 npm 提供的 package-lock.json 来锁定安装包，以确保用户安装的时候使用的依赖版本是准确的。</p>\n<p>❌ <strong>错误：</strong> 不锁定依赖的版本，意味着 npm 将在安装过程中自己解决他们，从而导致安装依赖的版本范围扩大，这会引入无法控制的更改，可能会让 CLI 无法成功运行。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>通常，npm 包在发布时只定义其直接的依赖项及其版本范围，并且 npm 会在安装时解析所有间接依赖项的版本。随着时间的流逝，间接的依赖项版本会有所不同，因为依赖项随时会发布新版本。\n尽管维护人员已广泛使用<a href="https://semver.org/">版本控制语义</a>，但是 npm 会为安装的包引入许多间接的依赖关系，这些间接依赖提升了破坏您的应用程序的风险。\n使用 package-lock.json 会带给用户更好的安全感。将要安装的依赖项固定到特定版本，因此，即使这些依赖项发布了较新的版本，也不会安装它们。这将让您有责任保持对依赖项的关注，了解依赖项中任何安全相关的修复，并通过定期发布 CLI 工具进行安全更新。可以考虑使用<a href="https://snyk.io/">Snyk</a> 来自动修复整个依赖性树中的安全性问题。<em>注：我是Snyk的开发者开发者。</em>\n参考：</p>\n<ul>\n<li><a href="https://snyk.io/blog/making-sense-of-package-lock-files-in-the-npm-ecosystem/">Do you really know how a lockfile works for yarn and npm packages?</a></li>\n<li><a href="https://next.yarnpkg.com/advanced/qa/#should-lockfiles-be-committed-to-the-repository">Yarn docs: Should lockfiles be committed to the repository?</a></li>\n</ul>\n<h2 id="3-%E9%80%9A%E7%94%A8%E6%80%A7">3 通用性<a class="anchor" href="#3-%E9%80%9A%E7%94%A8%E6%80%A7">§</a></h2>\n<p>本节将介绍使 Node.js CLI 与其他命令行工具无缝集成有关的最佳实践，并遵循 CLI 正常运行的约定。</p>\n<p>本节将回答以下问题：</p>\n<ul>\n<li>我可以导出 CLI 的输出以便于分析吗？</li>\n<li>我可以将 CLI 的输出通过管道传递到另一个命令行工具的输入吗？</li>\n<li>是否可以将其他工具的结果通过管道传输到此 CLI？</li>\n</ul>\n<h3 id="31-%E6%8E%A5%E5%8F%97-stdin-%E4%BD%9C%E4%B8%BA%E8%BE%93%E5%85%A5">3.1 接受 STDIN 作为输入<a class="anchor" href="#31-%E6%8E%A5%E5%8F%97-stdin-%E4%BD%9C%E4%B8%BA%E8%BE%93%E5%85%A5">§</a></h3>\n<p>✅ <strong>正确：</strong> 对于数据驱动的命令行应用，用户可以轻松的通过管道将数据输入到 STDIN。</p>\n<p>❌ <strong>错误：</strong> 其他的命令行工具可能无法直接提供数据输入到你的 CLI 中，这会阻止某些代码的正常运行，例如：</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">curl</span> -s <span class="token string">"<a class="token url-link" href="https://api.example.com/data.json">https://api.example.com/data.json</a>"</span> <span class="token operator">|</span> your_cli\n</code></pre>\n<p>➡️ <strong>细节：</strong></p>\n<p>如果命令行工具需要处理某些数据，比如，指定 JSON 文件执行某种任务，一般使用 <code>--file file.json</code> 的命令行参数。</p>\n<h3 id="32-%E7%BB%93%E6%9E%84%E5%8C%96%E8%BE%93%E5%87%BA">3.2 结构化输出<a class="anchor" href="#32-%E7%BB%93%E6%9E%84%E5%8C%96%E8%BE%93%E5%87%BA">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过某个参数来允许应用的结果进行结构化的输出，这样使得数据更容易处理和解析。</p>\n<p>❌ <strong>错误：</strong> 用户可能需要使用复杂的正则来解析和匹配 CLI 的输出结果。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>对于 CLI 的用户来说，解析数据并使用数据来执行其他任务（比如，提供给 web 仪表盘或电子邮件）通常很有用。\n能够轻松地从命令行输出中得到需要的数据，这将为 CLI 的用户提供更好的体验。</p>\n<h3 id="33-%E8%B7%A8%E5%B9%B3%E5%8F%B0">3.3 跨平台<a class="anchor" href="#33-%E8%B7%A8%E5%B9%B3%E5%8F%B0">§</a></h3>\n<p>✅ <strong>正确：</strong> 如果希望 CLI 能够跨平台工作，则必须注意命令行 shell 和子系统（如文件系统）的语义。</p>\n<p>❌ <strong>错误：</strong> 由于错误的路径分隔符等因素，CLI 将在一些操作系统上无法运行，即使代码中没有明显的功能差异。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>单纯从代码的角度来看，功能没有被剥离，并且应该在不同的操作系统中执行良好，但是一些遗漏的细节可能会使程序无法运行。让我们来研究几个必须遵守跨平台规范的案例。</p>\n<h4 id="%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%9A%84%E5%91%BD%E4%BB%A4">产生错误的命令<a class="anchor" href="#%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%9A%84%E5%91%BD%E4%BB%A4">§</a></h4>\n<p>有时候我们需要运行 Node.js 程序的进程，假设您有如下的脚本：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// program.js</span>\n#<span class="token operator">!</span><span class="token operator">/</span>usr<span class="token operator">/</span>bin<span class="token operator">/</span>env bin\n\n<span class="token comment">// your app code</span>\n</code></pre>\n<p>然后使用如下方式启动。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> cliExecPath <span class="token operator">=</span> <span class="token string">\'program.js\'</span>\n<span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">spawn</span><span class="token punctuation">(</span>cliExecPath<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<p>上面的代码能工作，但是下面这样更好。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> cliExecPath <span class="token operator">=</span> <span class="token string">\'program.js\'</span>\n<span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">spawn</span><span class="token punctuation">(</span><span class="token string">\'node\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>cliExecPath<span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<p>为什么这样更好呢？因为 <code>program.js</code> 代码以类 Unix 的  <a href="https://en.wikipedia.org/wiki/Shebang_(Unix)">Shebang</a> 符号开始，但是由于这不是跨平台的标准，Windows 不知道如何解析。</p>\n<p>在 <code>package.json</code> 中也是如此，如下方式定义 <code>npm script</code> 是不正确的：</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"postinstall"</span><span class="token operator">:</span> <span class="token string">"myInstall.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这是因为 Windows 无法理解 <code>myinstall.js</code> 中的 Shebang ，并且不知道如何使用 <code>node</code> 解释器运行它。</p>\n<p>相反，请使用如下方法：</p>\n<pre class="language-js"><code class="language-js"><span class="token string">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token string">"postinstall"</span><span class="token operator">:</span> <span class="token string">"node myInstall.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E4%B8%8D%E5%90%8C%E7%9A%84-shell-%E8%A7%A3%E9%87%8A%E5%99%A8">不同的 shell 解释器<a class="anchor" href="#%E4%B8%8D%E5%90%8C%E7%9A%84-shell-%E8%A7%A3%E9%87%8A%E5%99%A8">§</a></h4>\n<p>并不是所有的字符在不同的 shell 解释器都能得到相同的处理。</p>\n<p>例如， Windows 的命令提示符不会像 bash shell 那样将单引号当做双引号，因此它不知道单引号内的所有字符属于同一个字符串组，这会导致错误。</p>\n<p>下面的命令会导致在 Windows 环境下失效：</p>\n<pre class="language-json"><code class="language-json"><span class="token comment">// package.json</span>\n<span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"prettier-standard \'**/*.js\'"</span><span class="token punctuation">,</span>\n  ...\n<span class="token punctuation">}</span>\n</code></pre>\n<p>应该按照如下方式：</p>\n<pre class="language-json"><code class="language-json"><span class="token comment">// package.json</span>\n<span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"prettier-standard \"**/*.js\""</span><span class="token punctuation">,</span>\n  ...\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E9%81%BF%E5%85%8D%E6%89%8B%E5%8A%A8%E8%BF%9E%E6%8E%A5%E8%B7%AF%E5%BE%84">避免手动连接路径<a class="anchor" href="#%E9%81%BF%E5%85%8D%E6%89%8B%E5%8A%A8%E8%BF%9E%E6%8E%A5%E8%B7%AF%E5%BE%84">§</a></h4>\n<p>不同平台会使用不同的路径连接符，当通过手动连接它们时，会导致程序不能在不同的平台之前相互操作。</p>\n<p>让我们看看一个不好的案例：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> myPath <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>__dirname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/../bin/myBin.js</span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>它使用的是正斜杠，但是 Windows 上是使用反斜杠作为路径的分割符。所以我们不要通过手动的方式构建文件系统路径，而是使用 Node.js 的路径模块:</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> myPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'..\'</span><span class="token punctuation">,</span> <span class="token string">\'bin\'</span><span class="token punctuation">,</span> <span class="token string">\'myBin.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E9%81%BF%E5%85%8D%E4%BD%BF%E7%94%A8%E5%88%86%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%91%BD%E4%BB%A4">避免使用分号链接命令<a class="anchor" href="#%E9%81%BF%E5%85%8D%E4%BD%BF%E7%94%A8%E5%88%86%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%91%BD%E4%BB%A4">§</a></h4>\n<p>我们在 Linux 上一般都使用分号来顺序链接要运行的命令，例如：<code>cd /tmp;ls</code>。但是，在 Windows 上执行相同的操作会失败。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">; </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath2<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n</code></pre>\n<p>我们可以使用 <code>&amp;&amp;</code> 或者 <code>||</code>：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> || </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath2<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n</code></pre>\n<h3 id="34-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">3.4 允许环境覆盖<a class="anchor" href="#34-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 允许从环境变量中读取配置，并且当它与命令行参数冲突时，允许环境变量被覆盖。</p>\n<p>❌ <strong>错误：</strong> 尽量不要使用自定义配置。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用环境变量调整配置，这是许多工具中用于修改 CLI 工具行为的常用方法。</p>\n<p>当命令行参数和环境变量都配置相同的设置时，应该给环境变量一个优先级来覆盖该设置。</p>\n<h2 id="4-%E6%98%93%E7%94%A8%E6%80%A7">4 易用性<a class="anchor" href="#4-%E6%98%93%E7%94%A8%E6%80%A7">§</a></h2>\n<p>本节将介绍，如何在用户缺乏开发者设计工具所需环境的情况下，更加容易地使用 Node.js CLI。</p>\n<h3 id="41-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">4.1 允许环境覆盖<a class="anchor" href="#41-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 为 CLI 创建一个 docker 镜像，并将其发布到Docker Hub之类的公共仓库中，以便没有 Node.js 环境的用户可以使用它。</p>\n<p>❌ <strong>错误：</strong> 没有 Node.js 环境的用户将没有 npm 或 npx ，因此将无法运行您的 CLI 工具。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>从 npm 仓库中下载 Node.js CLI 工具通常将使用 Node.js 工具链（例如 npm 或 npx）来完成。这在JavaScript 和 Node.js 开发者中很容易完成。</p>\n<p>但是，如果您将 CLI 程序提供给大众使用，而不管他们是否熟悉 JavaScript 或该工具是否可用，那么将限制 CLI 程序仅以 npm 仓库形式的安装分发。如果您的 CLI 工具打算在CI环境中使用，则可能还需要安装那些与Node.js 相关的工具链依赖项。</p>\n<p>打包和分发可执行文件的方式有很多，将预先绑定了 CLI 工具的Docker容器进行容器化，这是一种容易使用方法并且不需要太多依赖关系（除了需要 Docker 环境之外）。</p>\n<h3 id="42-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7">4.2 优雅降级<a class="anchor" href="#42-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7">§</a></h3>\n<p>✅ <strong>正确：</strong> 在用户不受支持的环境中提供没有彩色和丰富交互的输出，比如跳过某些交互直接提供 JSON 格式的输出。</p>\n<p>❌ <strong>错误：</strong> 对于不受支持的终端用户，使用终端交互可能会显著降低最终用户体验，并阻止他们使用您的 CLI 工具。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>对于那些拥有丰富交互形式的终端的用户来说，彩色输出、ascii图表、终端动画会带来很好的用户体验，但是对于没有这些特性的终端用户来说，它可能会显示一下乱码或者完全无法操作。</p>\n<p>要使终端不受支持的用户正确使用您的 CLI 工具，您有如下选择:</p>\n<ul>\n<li>\n<p>自动检测终端能力，并在运行时评估是否对 CLI 的交互性进行降级；</p>\n</li>\n<li>\n<p>为用户提供一个选项来显式地进行降级，例如通过提供一个 <code>--json</code> 命令行参数来强制输出原始数据。</p>\n</li>\n</ul>\n<h3 id="43-nodejs-%E7%89%88%E6%9C%AC%E5%85%BC%E5%AE%B9">4.3 Node.js 版本兼容<a class="anchor" href="#43-nodejs-%E7%89%88%E6%9C%AC%E5%85%BC%E5%AE%B9">§</a></h3>\n<p>✅ <strong>正确：</strong> 支持目前还在维护的 <a href="https://nodejs.org/en/about/releases">Node.js 版本</a> 。</p>\n<p>❌ <strong>错误：</strong> 试图与不受支持的Node.js版本保持兼容的代码库将很难维护，并且会失去使用语言新特性的有点。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>有时可能需要专门针对缺少新的 ECAMScript 特性的旧 Node.js 版本兼容。例如，如果您正在构建一个主要面向DevOps 的Node.js CLI，那么他们可能没有一个理想的 Node.js 环境或者是最新的 runtime。比如，Debian Stretch (oldstable) 附带就是 <a href="https://packages.debian.org/search?suite=default&amp;section=all&amp;arch=any&amp;searchon=names&amp;keywords=nodejs">Node.js 8.11.1</a>.。</p>\n<p>如果你的需要兼容旧版本的 Node. js 如 Node. js 8、6、4，最好是使用 Babel 之类的编译器来确保生成的代码与V8 JavaScript 引擎的版本兼容，并与这些版本附带的Node.js runtime 兼容。</p>\n<p>绝对不要因此简化你的代码，来使用一些旧的 ECMAScript 语言规范，因为这会产生代码维护相关的问题。</p>\n<h3 id="44-%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B-nodejs-runtime">4.4 自动检测 Node.js runtime<a class="anchor" href="#44-%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B-nodejs-runtime">§</a></h3>\n<p>✅ <strong>正确：</strong> 在 Shebang 声明中使用与安装位置无关的引用，该引用可根据运行时环境自动定位 Node.js run</p>\n<p>time。</p>\n<p>❌ <strong>错误：</strong> 硬编码 Node.js runtime 位置，如 <code>#!/usr/local/bin/node</code> ，仅特定于您自己的环境，这可能使 CLI 工具在其他 Node.js 安装目录不同的环境中无法工作。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>首先在 <code>cli.js</code> 文件的顶部添加 <code>#!/usr/local/bin/node</code>，然后通过 <code>node cli.js</code> 来启动 Node.js CLI，这是一个容易的开始。但是，这是一种有缺陷的方法，因为其他用户的环境无法保证 <code>node</code> 可执行文件的位置。</p>\n<p>我们可以将 <code>#!/usr/bin/env node</code> 作为最佳实践，但是这仍然假设 Node.js runtime 是被 bin/node 引用，而不是 bin/nodejs 或其他。</p>\n<h2 id="5-%E6%B5%8B%E8%AF%95">5 测试<a class="anchor" href="#5-%E6%B5%8B%E8%AF%95">§</a></h2>\n<h3 id="51-%E4%B8%8D%E8%A6%81%E4%BF%A1%E4%BB%BB%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83">5.1 不要信任语言环境<a class="anchor" href="#51-%E4%B8%8D%E8%A6%81%E4%BF%A1%E4%BB%BB%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83">§</a></h3>\n<p>✅ <strong>正确：</strong> 不要假定输出文本与您声明的字符串等效，因为测试可能在与您的语言环境不同，比如在非英语环境的系统上运行。</p>\n<p>❌ <strong>错误：</strong> 当开发人员在非英语语言环境的系统上进行测试时，开发人员将遇到测试失败。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>当您运行 CLI 并解析输出来测试 CLI 时，您可能倾向于使用  grep  命令，以确保某些字符存在于输出中，例如在不带参数的情况下运行 CLI 时：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token function">execSync</span><span class="token punctuation">(</span>cli<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">expect</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">to</span><span class="token punctuation">.</span><span class="token method function property-access">contain</span><span class="token punctuation">(</span><span class="token string">"Examples:"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>如果在非英语的语言环境中运行测试，并且 CLI 参数解析库支持自动检测语言环境并采用该语言环境，则输出从 <code>Examples</code> 转换成了 “语言环境” 的语言，测试将失败。</p>\n<h2 id="6-%E9%94%99%E8%AF%AF">6 错误<a class="anchor" href="#6-%E9%94%99%E8%AF%AF">§</a></h2>\n<h3 id="61-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF">6.1 错误信息<a class="anchor" href="#61-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF">§</a></h3>\n<p>✅ <strong>正确：</strong> 在展示错误信息时，提供可以在项目文档中查找的可跟踪错误的代码，从而简化错误消息的排除。</p>\n<p>❌ <strong>错误：</strong> 一般的错误消息往往模棱两可，用户很难搜索解决方案。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>返回错误消息时，请确保它们包含特定的错误代码，以便以后查阅。与HTTP状态代码非常相似，因此 CLI 工具需要命名或编码错误。</p>\n<p>例如：</p>\n<pre class="language-bash"><code class="language-bash">$ my-cli-tool --doSomething\n\nError <span class="token punctuation">(</span>E4002<span class="token punctuation">)</span>: please provide an API token via environment variables\n</code></pre>\n<h3 id="62-%E5%8F%AF%E8%A1%8C%E7%9A%84%E9%94%99%E8%AF%AF">6.2 可行的错误<a class="anchor" href="#62-%E5%8F%AF%E8%A1%8C%E7%9A%84%E9%94%99%E8%AF%AF">§</a></h3>\n<p>✅ <strong>正确：</strong> 错误消息应告诉用户解决方案是什么，而不是仅仅提示这里存在错误。</p>\n<p>❌ <strong>错误：</strong> 面对错误消息，如果没有任何解决错误的提示，则用户可能无法成功使用 CLI。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>例如：</p>\n<pre class="language-bash"><code class="language-bash">$ my-cli-tool --doSomething\n\nError <span class="token punctuation">(</span>E4002<span class="token punctuation">)</span>: please provide an API token via environment variables\n</code></pre>\n<h3 id="63-%E6%8F%90%E4%BE%9B%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F">6.3 提供调试模式<a class="anchor" href="#63-%E6%8F%90%E4%BE%9B%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F">§</a></h3>\n<p>✅ <strong>正确：</strong> 如果高级用户需要诊断问题，则给他们提供更详细的信息</p>\n<p>❌ <strong>错误：</strong> 不要关闭调试功能。因为只是从用户那里收集反馈，并让他们查明错误原因将特别困难。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用环境变量或命令行参数来设置调试模式并打开详细输出信息。在代码中有意义的地方，植入调试消息，以帮助用户和维护者理解程序，输入和输出以及其他使解决问题变得容易的信息。</p>\n<p>参考开源软件包：</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/debug">debug</a></li>\n</ul>\n<hr>\n<h2 id="%E4%BD%9C%E8%80%85">作者<a class="anchor" href="#%E4%BD%9C%E8%80%85">§</a></h2>\n<p><strong>Node.js CLI Apps Best Practices</strong> © <a href="https://github.com/lirantal">Liran Tal</a>, Released under <a href="https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/master/LICENSE">CC BY-SA 4.0</a> License.</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u3010\u7FFB\u8BD1\u3011Node.js CLI \u5DE5\u5177\u6700\u4F73\u5B9E\u8DF5"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<blockquote>\n<p><a href="https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/3afe1ab0a5b506ef8c32903c4bf253a4cdb4bddd/README.md#shell-interpreters-vary">原文链接</a></p>\n</blockquote>\n<p>这是一个关于如何构建成功的、可移植的、对用户友好的Node.js 命令行工具（CLI）最佳实践的集合。</p>\n<h2 id="%E4%B8%BA%E4%BB%80%E4%B9%88%E5%86%99%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0">为什么写这篇文章？<a class="anchor" href="#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%86%99%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0">§</a></h2>\n<p>一个糟糕的 CLI 工具会让用户觉得难用，而构建一个成功的 CLI 需要密切关注很多细节，同时需要站在用户的角度，创造良好的用户体验。要做到这些特别不容易。</p>\n<p>在这个指南中，我列出了在各个重点领域的最佳实践，都是 CLI 工具交互最理想的用户体验。</p>\n<h2 id="%E7%89%B9%E6%80%A7">特性：<a class="anchor" href="#%E7%89%B9%E6%80%A7">§</a></h2>\n<ul>\n<li>✅ 构建成功的 Node.js CLI 工具的 21 种最佳实践</li>\n<li>❤️ 帮忙翻译成其他语言</li>\n<li>🙏 欢迎捐赠</li>\n<li>最近更新时间：2020-02-14</li>\n</ul>\n<h2 id="%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%91">为什么是我？<a class="anchor" href="#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%91">§</a></h2>\n<p>我叫Liran Tal，我一直专注于构建命令行工具。</p>\n<p>我最近的一些工作就是构建Node.js CLI，包括以下开源项目：</p>\n<div class="table_wrapper"><table>\n<thead>\n<tr>\n<th><a href="https://github.com/lirantal/dockly"><strong>Dockly</strong></a></th>\n<th><a href="https://github.com/lirantal/npq"><strong>npq</strong></a></th>\n<th><a href="https://github.com/lirantal/lockfile-lint"><strong>lockfile-lint</strong></a></th>\n<th><a href="https://github.com/lirantal/is-website-vulnerable"><strong>is-website-vulnerable</strong></a></th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>沉浸式终端界面，用于管理Docker容器和服务</td>\n<td>通过在安装过程中进行检查，以安全地使用npm / yarn 安装的软件包</td>\n<td>整理 npm 或 yarn 的 lock 文件以分析和检测安全问题</td>\n<td>在网站引用的 JS 库中查找公开的安全漏洞</td>\n</tr>\n</tbody>\n</table></div>\n<hr>\n<h2 id="1-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%9A%84%E7%BB%8F%E9%AA%8C">1 命令行的经验<a class="anchor" href="#1-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%9A%84%E7%BB%8F%E9%AA%8C">§</a></h2>\n<p>本节将会介绍创建美观且高可用的 Node.js 命令行工具相关的最佳实践。</p>\n<h3 id="11-%E5%B0%8A%E9%87%8D-posix">1.1 尊重 POSIX<a class="anchor" href="#11-%E5%B0%8A%E9%87%8D-posix">§</a></h3>\n<p>✅ <strong>正确：</strong> 使用兼容 <a href="https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html">POSIX-compliant</a> 命令行的语法，因为这是被广泛接受的命令行工具的标准。</p>\n<p>❌ <strong>错误：</strong> 当用户使用CLI，其命令行参数与他们过去的使用习惯不一致时，会感觉很难适应。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>Unix-like 操作系统普及了命令行工具，比如awk，sed。这样的工具已经有效地标准化了命令行选项「options」（又名标志「flags」），选项参数和其他操作的行为。</p>\n<p>一些案例：</p>\n<ul>\n<li>在帮助「help」中将选项参数「option-arguments」标记为方括号([])，以表示它们是可选的，或者使用尖括号(&lt;&gt;)，表示它们是必需的。</li>\n<li>参数可以使用单字符缩写，一般是 <code>-</code> 加上一个字母或数字。</li>\n<li>多个没有值的选型可进行组合，比如：<code>cli -abc</code> 等价于 <code>cli -a -b -c</code>。</li>\n</ul>\n<p>用户一般都会希望你的命令行工具与其他Unix工具具有类似的约定。</p>\n<h3 id="12-%E6%9E%84%E5%BB%BA%E5%8F%8B%E5%A5%BD%E7%9A%84-cli">1.2 构建友好的 CLI<a class="anchor" href="#12-%E6%9E%84%E5%BB%BA%E5%8F%8B%E5%A5%BD%E7%9A%84-cli">§</a></h3>\n<p>✅ <strong>正确：</strong> 尽可能多的输出一些信息以帮助用户成功使用 CLI。</p>\n<p>❌ <strong>错误：</strong> 由于 CLI 一直启动失败，又没有为用户提供足够的帮助，会让用户产生明显的挫败感。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>命令行工具的界面一定程度上应与 Web 用户界面类似，尽可能的保证程序能正常使用。</p>\n<p>构建一个对用户友好的 CLI 应该尽可能的为用户提供支持。作为实例，我们讨论下 <code>curl</code> 命令的交互，该命令期望将 URL 作为主要的数据输入，而用户却没有提供 URL，这时候命令行会提示用户通读 <code>curl --help</code> 的输出信息。但是，对用户友好的 CLI 工具会显示一个可交互式的提示，捕获用户的输入，从而正常运行。</p>\n<h3 id="13-%E6%9C%89%E7%8A%B6%E6%80%81%E7%9A%84%E6%95%B0%E6%8D%AE">1.3 有状态的数据<a class="anchor" href="#13-%E6%9C%89%E7%8A%B6%E6%80%81%E7%9A%84%E6%95%B0%E6%8D%AE">§</a></h3>\n<p>✅ <strong>正确：</strong> 在多次调用 CLI 的过程中，提供有状态的体验，记住这些数据，以提供无缝的交互体验。</p>\n<p>❌ <strong>错误：</strong> 用户多次调用 CLI 重复提供相同的信息，会让用户感到厌烦。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>你需要为 CLI 工具提供持续缓存，比如记住用户名、电子邮件、token 或者是 CLI 多次调用的一些首选项。可以使用以下工具来保留用户的这些配置。</p>\n<ul>\n<li>\n<p><a href="https://www.npmjs.com/package/configstore">configstore</a></p>\n</li>\n<li>\n<p><a href="https://www.npmjs.com/package/conf">conf</a></p>\n</li>\n</ul>\n<h3 id="14-%E6%8F%90%E4%BE%9B%E5%A4%9A%E5%BD%A9%E7%9A%84%E4%BD%93%E9%AA%8C">1.4 提供多彩的体验<a class="anchor" href="#14-%E6%8F%90%E4%BE%9B%E5%A4%9A%E5%BD%A9%E7%9A%84%E4%BD%93%E9%AA%8C">§</a></h3>\n<p>✅ <strong>正确：</strong> 在 CLI 工具中使用颜色来突出显示一些信息，并且提供降级方案，进行检测，自动退出以免输出乱码。</p>\n<p>❌ <strong>错误：</strong> 苍白的输出可能会让用户丢失重要的信息，尤其是文本较多的时候。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>大多数的命令行工具都支持彩色文本，通过特定的 ANSI 编码来启用。\n命令行工具输出彩色文本可带来更丰富的体验和更多的交互。但是，不受支持的终端可能会在屏幕上以乱码信息的形式输出。此外，CLI 也可能用于不支持彩色输出的连续集成中。</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/chalk">chalk</a></li>\n<li><a href="https://www.npmjs.com/package/colors">colors</a></li>\n</ul>\n<h3 id="15-%E4%B8%B0%E5%AF%8C%E7%9A%84%E4%BA%A4%E4%BA%92">1.5 丰富的交互<a class="anchor" href="#15-%E4%B8%B0%E5%AF%8C%E7%9A%84%E4%BA%A4%E4%BA%92">§</a></h3>\n<p>✅ <strong>正确：</strong>  提供除了文本输入之外的其他交互形式，为用户提供更加丰富的体验。</p>\n<p>❌ <strong>错误：</strong> 当输入的信息是固定的选项（类似下拉菜单）时，文本输入的形式可能会给用户带来麻烦。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>可以以提示输入的方式引入更加丰富的交互方式，提示输入比自由的文本输入更高端。例如，下拉列表、单选按钮切换、隐藏密码输入。丰富交互的另一个方面就是动画以及进度条，在 CLI 执行异步工作时，都能为用户提供更好的体验。</p>\n<p>许多 CLI 提供默认的命令行参数，而无需用户进一步交互。不强迫用户提供一些非必要的参数。</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/prompts">prompts</a></li>\n<li><a href="https://www.npmjs.com/package/enquirer">enquirer</a></li>\n<li><a href="https://www.npmjs.com/package/ink">ink</a></li>\n<li><a href="https://www.npmjs.com/package/chalk">ora</a></li>\n</ul>\n<h3 id="16-%E6%97%A0%E5%A4%84%E4%B8%8D%E5%9C%A8%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5">1.6 无处不在的超链接<a class="anchor" href="#16-%E6%97%A0%E5%A4%84%E4%B8%8D%E5%9C%A8%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5">§</a></h3>\n<p>✅ <strong>正确：</strong>  URL（<a href="https://www.github.com">https://www.github.com</a>）和源代码（<code>src/Util.js:2:75</code>）使用格式正确的文本输出，因为这两者都是现代终端可点击的链接。</p>\n<p>❌ <strong>错误：</strong> 避免使用<code>git.io/abc</code>之类的非交互式的链接，该链接需要用户手动复制和粘贴。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>如果你要分享的信息在 Url 链接中，或者是某个文件的特定行列，则需要向用户提供正确的格式的链接，用户一旦点击它们，就会打开浏览器或者在IDE跳到特定位置。</p>\n<h3 id="17-%E9%9B%B6%E9%85%8D%E7%BD%AE">1.7 零配置<a class="anchor" href="#17-%E9%9B%B6%E9%85%8D%E7%BD%AE">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过自动检测所需的配置和命令行参数，达到即开即用的体验。</p>\n<p>❌ <strong>错误：</strong> 如果可以以可靠的方式自动检测命令行参数，并且调用的操作不需用户显式确认（例如确认删除），则不要强制用户交互。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>旨在在运行 CLI 工具时提供“即开即用”的体验。</p>\n<ul>\n<li>The <a href="https://jestjs.io/">Jest JavaScript Testing Framework</a></li>\n<li><a href="https://parceljs.org/">Parcel</a>, a web application bundler</li>\n</ul>\n<h2 id="2-%E5%8F%91%E5%B8%83">2 发布<a class="anchor" href="#2-%E5%8F%91%E5%B8%83">§</a></h2>\n<p>本节介绍了如何以最佳方式分发和打包 Node.js CLI 工具的最佳实践。</p>\n<h3 id="21-%E6%9C%80%E5%B0%8F%E5%8C%96%E7%9A%84%E4%BE%9D%E8%B5%96">2.1 最小化的依赖<a class="anchor" href="#21-%E6%9C%80%E5%B0%8F%E5%8C%96%E7%9A%84%E4%BE%9D%E8%B5%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 最大程度地减少生产环境的依赖项，并且使用可替代的最小的依赖包，确保这是一个尽可能小的 Node.js 包。但是，也不能过于谨慎因此重复发明轮子而过度优化依赖。</p>\n<p>❌ <strong>错误：</strong> 应用中依赖的大小将决定 CLI 的安装时间，从而导致糟糕的用户体验。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用 <code>npx</code> 可以快速调用通过 <code>npm install</code> 安装的 Node.js CLI 模块，这可提供更好的用户体验。这有助于将整体的依赖关系和传递依赖关系保持在合理大小。</p>\n<p>npm 全局安装模块，安装过程会变得缓慢，这是一个糟糕的体验。通过 npx 总是获取当前项目安装的模块（当前文件夹的node_modules），因此使用 <code>npx</code> 来调用 CLI 可能会降低性能。</p>\n<h3 id="22-%E4%BD%BF%E7%94%A8%E6%96%87%E4%BB%B6%E9%94%81">2.2 使用文件锁<a class="anchor" href="#22-%E4%BD%BF%E7%94%A8%E6%96%87%E4%BB%B6%E9%94%81">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过 npm 提供的 package-lock.json 来锁定安装包，以确保用户安装的时候使用的依赖版本是准确的。</p>\n<p>❌ <strong>错误：</strong> 不锁定依赖的版本，意味着 npm 将在安装过程中自己解决他们，从而导致安装依赖的版本范围扩大，这会引入无法控制的更改，可能会让 CLI 无法成功运行。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>通常，npm 包在发布时只定义其直接的依赖项及其版本范围，并且 npm 会在安装时解析所有间接依赖项的版本。随着时间的流逝，间接的依赖项版本会有所不同，因为依赖项随时会发布新版本。\n尽管维护人员已广泛使用<a href="https://semver.org/">版本控制语义</a>，但是 npm 会为安装的包引入许多间接的依赖关系，这些间接依赖提升了破坏您的应用程序的风险。\n使用 package-lock.json 会带给用户更好的安全感。将要安装的依赖项固定到特定版本，因此，即使这些依赖项发布了较新的版本，也不会安装它们。这将让您有责任保持对依赖项的关注，了解依赖项中任何安全相关的修复，并通过定期发布 CLI 工具进行安全更新。可以考虑使用<a href="https://snyk.io/">Snyk</a> 来自动修复整个依赖性树中的安全性问题。<em>注：我是Snyk的开发者开发者。</em>\n参考：</p>\n<ul>\n<li><a href="https://snyk.io/blog/making-sense-of-package-lock-files-in-the-npm-ecosystem/">Do you really know how a lockfile works for yarn and npm packages?</a></li>\n<li><a href="https://next.yarnpkg.com/advanced/qa/#should-lockfiles-be-committed-to-the-repository">Yarn docs: Should lockfiles be committed to the repository?</a></li>\n</ul>\n<h2 id="3-%E9%80%9A%E7%94%A8%E6%80%A7">3 通用性<a class="anchor" href="#3-%E9%80%9A%E7%94%A8%E6%80%A7">§</a></h2>\n<p>本节将介绍使 Node.js CLI 与其他命令行工具无缝集成有关的最佳实践，并遵循 CLI 正常运行的约定。</p>\n<p>本节将回答以下问题：</p>\n<ul>\n<li>我可以导出 CLI 的输出以便于分析吗？</li>\n<li>我可以将 CLI 的输出通过管道传递到另一个命令行工具的输入吗？</li>\n<li>是否可以将其他工具的结果通过管道传输到此 CLI？</li>\n</ul>\n<h3 id="31-%E6%8E%A5%E5%8F%97-stdin-%E4%BD%9C%E4%B8%BA%E8%BE%93%E5%85%A5">3.1 接受 STDIN 作为输入<a class="anchor" href="#31-%E6%8E%A5%E5%8F%97-stdin-%E4%BD%9C%E4%B8%BA%E8%BE%93%E5%85%A5">§</a></h3>\n<p>✅ <strong>正确：</strong> 对于数据驱动的命令行应用，用户可以轻松的通过管道将数据输入到 STDIN。</p>\n<p>❌ <strong>错误：</strong> 其他的命令行工具可能无法直接提供数据输入到你的 CLI 中，这会阻止某些代码的正常运行，例如：</p>\n<pre class="language-bash"><code class="language-bash">$ <span class="token function">curl</span> -s <span class="token string">"<a class="token url-link" href="https://api.example.com/data.json">https://api.example.com/data.json</a>"</span> <span class="token operator">|</span> your_cli\n</code></pre>\n<p>➡️ <strong>细节：</strong></p>\n<p>如果命令行工具需要处理某些数据，比如，指定 JSON 文件执行某种任务，一般使用 <code>--file file.json</code> 的命令行参数。</p>\n<h3 id="32-%E7%BB%93%E6%9E%84%E5%8C%96%E8%BE%93%E5%87%BA">3.2 结构化输出<a class="anchor" href="#32-%E7%BB%93%E6%9E%84%E5%8C%96%E8%BE%93%E5%87%BA">§</a></h3>\n<p>✅ <strong>正确：</strong> 通过某个参数来允许应用的结果进行结构化的输出，这样使得数据更容易处理和解析。</p>\n<p>❌ <strong>错误：</strong> 用户可能需要使用复杂的正则来解析和匹配 CLI 的输出结果。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>对于 CLI 的用户来说，解析数据并使用数据来执行其他任务（比如，提供给 web 仪表盘或电子邮件）通常很有用。\n能够轻松地从命令行输出中得到需要的数据，这将为 CLI 的用户提供更好的体验。</p>\n<h3 id="33-%E8%B7%A8%E5%B9%B3%E5%8F%B0">3.3 跨平台<a class="anchor" href="#33-%E8%B7%A8%E5%B9%B3%E5%8F%B0">§</a></h3>\n<p>✅ <strong>正确：</strong> 如果希望 CLI 能够跨平台工作，则必须注意命令行 shell 和子系统（如文件系统）的语义。</p>\n<p>❌ <strong>错误：</strong> 由于错误的路径分隔符等因素，CLI 将在一些操作系统上无法运行，即使代码中没有明显的功能差异。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>单纯从代码的角度来看，功能没有被剥离，并且应该在不同的操作系统中执行良好，但是一些遗漏的细节可能会使程序无法运行。让我们来研究几个必须遵守跨平台规范的案例。</p>\n<h4 id="%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%9A%84%E5%91%BD%E4%BB%A4">产生错误的命令<a class="anchor" href="#%E4%BA%A7%E7%94%9F%E9%94%99%E8%AF%AF%E7%9A%84%E5%91%BD%E4%BB%A4">§</a></h4>\n<p>有时候我们需要运行 Node.js 程序的进程，假设您有如下的脚本：</p>\n<pre class="language-js"><code class="language-js"><span class="token comment">// program.js</span>\n#<span class="token operator">!</span><span class="token operator">/</span>usr<span class="token operator">/</span>bin<span class="token operator">/</span>env bin\n\n<span class="token comment">// your app code</span>\n</code></pre>\n<p>然后使用如下方式启动。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> cliExecPath <span class="token operator">=</span> <span class="token string">\'program.js\'</span>\n<span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">spawn</span><span class="token punctuation">(</span>cliExecPath<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<p>上面的代码能工作，但是下面这样更好。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> cliExecPath <span class="token operator">=</span> <span class="token string">\'program.js\'</span>\n<span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">spawn</span><span class="token punctuation">(</span><span class="token string">\'node\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>cliExecPath<span class="token punctuation">]</span><span class="token punctuation">)</span>\n</code></pre>\n<p>为什么这样更好呢？因为 <code>program.js</code> 代码以类 Unix 的  <a href="https://en.wikipedia.org/wiki/Shebang_(Unix)">Shebang</a> 符号开始，但是由于这不是跨平台的标准，Windows 不知道如何解析。</p>\n<p>在 <code>package.json</code> 中也是如此，如下方式定义 <code>npm script</code> 是不正确的：</p>\n<pre class="language-json"><code class="language-json"><span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"postinstall"</span><span class="token operator">:</span> <span class="token string">"myInstall.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<p>这是因为 Windows 无法理解 <code>myinstall.js</code> 中的 Shebang ，并且不知道如何使用 <code>node</code> 解释器运行它。</p>\n<p>相反，请使用如下方法：</p>\n<pre class="language-js"><code class="language-js"><span class="token string">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token string">"postinstall"</span><span class="token operator">:</span> <span class="token string">"node myInstall.js"</span>\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E4%B8%8D%E5%90%8C%E7%9A%84-shell-%E8%A7%A3%E9%87%8A%E5%99%A8">不同的 shell 解释器<a class="anchor" href="#%E4%B8%8D%E5%90%8C%E7%9A%84-shell-%E8%A7%A3%E9%87%8A%E5%99%A8">§</a></h4>\n<p>并不是所有的字符在不同的 shell 解释器都能得到相同的处理。</p>\n<p>例如， Windows 的命令提示符不会像 bash shell 那样将单引号当做双引号，因此它不知道单引号内的所有字符属于同一个字符串组，这会导致错误。</p>\n<p>下面的命令会导致在 Windows 环境下失效：</p>\n<pre class="language-json"><code class="language-json"><span class="token comment">// package.json</span>\n<span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"prettier-standard \'**/*.js\'"</span><span class="token punctuation">,</span>\n  ...\n<span class="token punctuation">}</span>\n</code></pre>\n<p>应该按照如下方式：</p>\n<pre class="language-json"><code class="language-json"><span class="token comment">// package.json</span>\n<span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>\n  <span class="token property">"format"</span><span class="token operator">:</span> <span class="token string">"prettier-standard \"**/*.js\""</span><span class="token punctuation">,</span>\n  ...\n<span class="token punctuation">}</span>\n</code></pre>\n<h4 id="%E9%81%BF%E5%85%8D%E6%89%8B%E5%8A%A8%E8%BF%9E%E6%8E%A5%E8%B7%AF%E5%BE%84">避免手动连接路径<a class="anchor" href="#%E9%81%BF%E5%85%8D%E6%89%8B%E5%8A%A8%E8%BF%9E%E6%8E%A5%E8%B7%AF%E5%BE%84">§</a></h4>\n<p>不同平台会使用不同的路径连接符，当通过手动连接它们时，会导致程序不能在不同的平台之前相互操作。</p>\n<p>让我们看看一个不好的案例：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> myPath <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>__dirname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/../bin/myBin.js</span><span class="token template-punctuation string">`</span></span>\n</code></pre>\n<p>它使用的是正斜杠，但是 Windows 上是使用反斜杠作为路径的分割符。所以我们不要通过手动的方式构建文件系统路径，而是使用 Node.js 的路径模块:</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> myPath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token method function property-access">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">\'..\'</span><span class="token punctuation">,</span> <span class="token string">\'bin\'</span><span class="token punctuation">,</span> <span class="token string">\'myBin.js\'</span><span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E9%81%BF%E5%85%8D%E4%BD%BF%E7%94%A8%E5%88%86%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%91%BD%E4%BB%A4">避免使用分号链接命令<a class="anchor" href="#%E9%81%BF%E5%85%8D%E4%BD%BF%E7%94%A8%E5%88%86%E5%8F%B7%E9%93%BE%E6%8E%A5%E5%91%BD%E4%BB%A4">§</a></h4>\n<p>我们在 Linux 上一般都使用分号来顺序链接要运行的命令，例如：<code>cd /tmp;ls</code>。但是，在 Windows 上执行相同的操作会失败。</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">; </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath2<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n</code></pre>\n<p>我们可以使用 <code>&amp;&amp;</code> 或者 <code>||</code>：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> process <span class="token operator">=</span> childProcess<span class="token punctuation">.</span><span class="token method function property-access">exec</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> || </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>cliExecPath2<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n</code></pre>\n<h3 id="34-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">3.4 允许环境覆盖<a class="anchor" href="#34-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 允许从环境变量中读取配置，并且当它与命令行参数冲突时，允许环境变量被覆盖。</p>\n<p>❌ <strong>错误：</strong> 尽量不要使用自定义配置。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用环境变量调整配置，这是许多工具中用于修改 CLI 工具行为的常用方法。</p>\n<p>当命令行参数和环境变量都配置相同的设置时，应该给环境变量一个优先级来覆盖该设置。</p>\n<h2 id="4-%E6%98%93%E7%94%A8%E6%80%A7">4 易用性<a class="anchor" href="#4-%E6%98%93%E7%94%A8%E6%80%A7">§</a></h2>\n<p>本节将介绍，如何在用户缺乏开发者设计工具所需环境的情况下，更加容易地使用 Node.js CLI。</p>\n<h3 id="41-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">4.1 允许环境覆盖<a class="anchor" href="#41-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96">§</a></h3>\n<p>✅ <strong>正确：</strong> 为 CLI 创建一个 docker 镜像，并将其发布到Docker Hub之类的公共仓库中，以便没有 Node.js 环境的用户可以使用它。</p>\n<p>❌ <strong>错误：</strong> 没有 Node.js 环境的用户将没有 npm 或 npx ，因此将无法运行您的 CLI 工具。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>从 npm 仓库中下载 Node.js CLI 工具通常将使用 Node.js 工具链（例如 npm 或 npx）来完成。这在JavaScript 和 Node.js 开发者中很容易完成。</p>\n<p>但是，如果您将 CLI 程序提供给大众使用，而不管他们是否熟悉 JavaScript 或该工具是否可用，那么将限制 CLI 程序仅以 npm 仓库形式的安装分发。如果您的 CLI 工具打算在CI环境中使用，则可能还需要安装那些与Node.js 相关的工具链依赖项。</p>\n<p>打包和分发可执行文件的方式有很多，将预先绑定了 CLI 工具的Docker容器进行容器化，这是一种容易使用方法并且不需要太多依赖关系（除了需要 Docker 环境之外）。</p>\n<h3 id="42-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7">4.2 优雅降级<a class="anchor" href="#42-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7">§</a></h3>\n<p>✅ <strong>正确：</strong> 在用户不受支持的环境中提供没有彩色和丰富交互的输出，比如跳过某些交互直接提供 JSON 格式的输出。</p>\n<p>❌ <strong>错误：</strong> 对于不受支持的终端用户，使用终端交互可能会显著降低最终用户体验，并阻止他们使用您的 CLI 工具。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>对于那些拥有丰富交互形式的终端的用户来说，彩色输出、ascii图表、终端动画会带来很好的用户体验，但是对于没有这些特性的终端用户来说，它可能会显示一下乱码或者完全无法操作。</p>\n<p>要使终端不受支持的用户正确使用您的 CLI 工具，您有如下选择:</p>\n<ul>\n<li>\n<p>自动检测终端能力，并在运行时评估是否对 CLI 的交互性进行降级；</p>\n</li>\n<li>\n<p>为用户提供一个选项来显式地进行降级，例如通过提供一个 <code>--json</code> 命令行参数来强制输出原始数据。</p>\n</li>\n</ul>\n<h3 id="43-nodejs-%E7%89%88%E6%9C%AC%E5%85%BC%E5%AE%B9">4.3 Node.js 版本兼容<a class="anchor" href="#43-nodejs-%E7%89%88%E6%9C%AC%E5%85%BC%E5%AE%B9">§</a></h3>\n<p>✅ <strong>正确：</strong> 支持目前还在维护的 <a href="https://nodejs.org/en/about/releases">Node.js 版本</a> 。</p>\n<p>❌ <strong>错误：</strong> 试图与不受支持的Node.js版本保持兼容的代码库将很难维护，并且会失去使用语言新特性的有点。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>有时可能需要专门针对缺少新的 ECAMScript 特性的旧 Node.js 版本兼容。例如，如果您正在构建一个主要面向DevOps 的Node.js CLI，那么他们可能没有一个理想的 Node.js 环境或者是最新的 runtime。比如，Debian Stretch (oldstable) 附带就是 <a href="https://packages.debian.org/search?suite=default&amp;section=all&amp;arch=any&amp;searchon=names&amp;keywords=nodejs">Node.js 8.11.1</a>.。</p>\n<p>如果你的需要兼容旧版本的 Node. js 如 Node. js 8、6、4，最好是使用 Babel 之类的编译器来确保生成的代码与V8 JavaScript 引擎的版本兼容，并与这些版本附带的Node.js runtime 兼容。</p>\n<p>绝对不要因此简化你的代码，来使用一些旧的 ECMAScript 语言规范，因为这会产生代码维护相关的问题。</p>\n<h3 id="44-%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B-nodejs-runtime">4.4 自动检测 Node.js runtime<a class="anchor" href="#44-%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B-nodejs-runtime">§</a></h3>\n<p>✅ <strong>正确：</strong> 在 Shebang 声明中使用与安装位置无关的引用，该引用可根据运行时环境自动定位 Node.js run</p>\n<p>time。</p>\n<p>❌ <strong>错误：</strong> 硬编码 Node.js runtime 位置，如 <code>#!/usr/local/bin/node</code> ，仅特定于您自己的环境，这可能使 CLI 工具在其他 Node.js 安装目录不同的环境中无法工作。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>首先在 <code>cli.js</code> 文件的顶部添加 <code>#!/usr/local/bin/node</code>，然后通过 <code>node cli.js</code> 来启动 Node.js CLI，这是一个容易的开始。但是，这是一种有缺陷的方法，因为其他用户的环境无法保证 <code>node</code> 可执行文件的位置。</p>\n<p>我们可以将 <code>#!/usr/bin/env node</code> 作为最佳实践，但是这仍然假设 Node.js runtime 是被 bin/node 引用，而不是 bin/nodejs 或其他。</p>\n<h2 id="5-%E6%B5%8B%E8%AF%95">5 测试<a class="anchor" href="#5-%E6%B5%8B%E8%AF%95">§</a></h2>\n<h3 id="51-%E4%B8%8D%E8%A6%81%E4%BF%A1%E4%BB%BB%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83">5.1 不要信任语言环境<a class="anchor" href="#51-%E4%B8%8D%E8%A6%81%E4%BF%A1%E4%BB%BB%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83">§</a></h3>\n<p>✅ <strong>正确：</strong> 不要假定输出文本与您声明的字符串等效，因为测试可能在与您的语言环境不同，比如在非英语环境的系统上运行。</p>\n<p>❌ <strong>错误：</strong> 当开发人员在非英语语言环境的系统上进行测试时，开发人员将遇到测试失败。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>当您运行 CLI 并解析输出来测试 CLI 时，您可能倾向于使用  grep  命令，以确保某些字符存在于输出中，例如在不带参数的情况下运行 CLI 时：</p>\n<pre class="language-js"><code class="language-js"><span class="token keyword">const</span> output <span class="token operator">=</span> <span class="token function">execSync</span><span class="token punctuation">(</span>cli<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token function">expect</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token property-access">to</span><span class="token punctuation">.</span><span class="token method function property-access">contain</span><span class="token punctuation">(</span><span class="token string">"Examples:"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n<p>如果在非英语的语言环境中运行测试，并且 CLI 参数解析库支持自动检测语言环境并采用该语言环境，则输出从 <code>Examples</code> 转换成了 “语言环境” 的语言，测试将失败。</p>\n<h2 id="6-%E9%94%99%E8%AF%AF">6 错误<a class="anchor" href="#6-%E9%94%99%E8%AF%AF">§</a></h2>\n<h3 id="61-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF">6.1 错误信息<a class="anchor" href="#61-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF">§</a></h3>\n<p>✅ <strong>正确：</strong> 在展示错误信息时，提供可以在项目文档中查找的可跟踪错误的代码，从而简化错误消息的排除。</p>\n<p>❌ <strong>错误：</strong> 一般的错误消息往往模棱两可，用户很难搜索解决方案。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>返回错误消息时，请确保它们包含特定的错误代码，以便以后查阅。与HTTP状态代码非常相似，因此 CLI 工具需要命名或编码错误。</p>\n<p>例如：</p>\n<pre class="language-bash"><code class="language-bash">$ my-cli-tool --doSomething\n\nError <span class="token punctuation">(</span>E4002<span class="token punctuation">)</span>: please provide an API token via environment variables\n</code></pre>\n<h3 id="62-%E5%8F%AF%E8%A1%8C%E7%9A%84%E9%94%99%E8%AF%AF">6.2 可行的错误<a class="anchor" href="#62-%E5%8F%AF%E8%A1%8C%E7%9A%84%E9%94%99%E8%AF%AF">§</a></h3>\n<p>✅ <strong>正确：</strong> 错误消息应告诉用户解决方案是什么，而不是仅仅提示这里存在错误。</p>\n<p>❌ <strong>错误：</strong> 面对错误消息，如果没有任何解决错误的提示，则用户可能无法成功使用 CLI。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>例如：</p>\n<pre class="language-bash"><code class="language-bash">$ my-cli-tool --doSomething\n\nError <span class="token punctuation">(</span>E4002<span class="token punctuation">)</span>: please provide an API token via environment variables\n</code></pre>\n<h3 id="63-%E6%8F%90%E4%BE%9B%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F">6.3 提供调试模式<a class="anchor" href="#63-%E6%8F%90%E4%BE%9B%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F">§</a></h3>\n<p>✅ <strong>正确：</strong> 如果高级用户需要诊断问题，则给他们提供更详细的信息</p>\n<p>❌ <strong>错误：</strong> 不要关闭调试功能。因为只是从用户那里收集反馈，并让他们查明错误原因将特别困难。</p>\n<p>➡️ <strong>细节：</strong></p>\n<p>使用环境变量或命令行参数来设置调试模式并打开详细输出信息。在代码中有意义的地方，植入调试消息，以帮助用户和维护者理解程序，输入和输出以及其他使解决问题变得容易的信息。</p>\n<p>参考开源软件包：</p>\n<ul>\n<li><a href="https://www.npmjs.com/package/debug">debug</a></li>\n</ul>\n<hr>\n<h2 id="%E4%BD%9C%E8%80%85">作者<a class="anchor" href="#%E4%BD%9C%E8%80%85">§</a></h2>\n<p><strong>Node.js CLI Apps Best Practices</strong> © <a href="https://github.com/lirantal">Liran Tal</a>, Released under <a href="https://github.com/lirantal/nodejs-cli-apps-best-practices/blob/master/LICENSE">CC BY-SA 4.0</a> License.</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%B8%BA%E4%BB%80%E4%B9%88%E5%86%99%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0" }, "\u4E3A\u4EC0\u4E48\u5199\u8FD9\u7BC7\u6587\u7AE0\uFF1F")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%89%B9%E6%80%A7" }, "\u7279\u6027\uFF1A")),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%B8%BA%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%91" }, "\u4E3A\u4EC0\u4E48\u662F\u6211\uFF1F")),
            React.createElement("li", null,
                React.createElement("a", { href: "#1-%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%9A%84%E7%BB%8F%E9%AA%8C" }, "1 \u547D\u4EE4\u884C\u7684\u7ECF\u9A8C"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#11-%E5%B0%8A%E9%87%8D-posix" }, "1.1 \u5C0A\u91CD POSIX")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#12-%E6%9E%84%E5%BB%BA%E5%8F%8B%E5%A5%BD%E7%9A%84-cli" }, "1.2 \u6784\u5EFA\u53CB\u597D\u7684 CLI")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#13-%E6%9C%89%E7%8A%B6%E6%80%81%E7%9A%84%E6%95%B0%E6%8D%AE" }, "1.3 \u6709\u72B6\u6001\u7684\u6570\u636E")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#14-%E6%8F%90%E4%BE%9B%E5%A4%9A%E5%BD%A9%E7%9A%84%E4%BD%93%E9%AA%8C" }, "1.4 \u63D0\u4F9B\u591A\u5F69\u7684\u4F53\u9A8C")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#15-%E4%B8%B0%E5%AF%8C%E7%9A%84%E4%BA%A4%E4%BA%92" }, "1.5 \u4E30\u5BCC\u7684\u4EA4\u4E92")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#16-%E6%97%A0%E5%A4%84%E4%B8%8D%E5%9C%A8%E7%9A%84%E8%B6%85%E9%93%BE%E6%8E%A5" }, "1.6 \u65E0\u5904\u4E0D\u5728\u7684\u8D85\u94FE\u63A5")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#17-%E9%9B%B6%E9%85%8D%E7%BD%AE" }, "1.7 \u96F6\u914D\u7F6E")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#2-%E5%8F%91%E5%B8%83" }, "2 \u53D1\u5E03"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#21-%E6%9C%80%E5%B0%8F%E5%8C%96%E7%9A%84%E4%BE%9D%E8%B5%96" }, "2.1 \u6700\u5C0F\u5316\u7684\u4F9D\u8D56")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#22-%E4%BD%BF%E7%94%A8%E6%96%87%E4%BB%B6%E9%94%81" }, "2.2 \u4F7F\u7528\u6587\u4EF6\u9501")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#3-%E9%80%9A%E7%94%A8%E6%80%A7" }, "3 \u901A\u7528\u6027"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#31-%E6%8E%A5%E5%8F%97-stdin-%E4%BD%9C%E4%B8%BA%E8%BE%93%E5%85%A5" }, "3.1 \u63A5\u53D7 STDIN \u4F5C\u4E3A\u8F93\u5165")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#32-%E7%BB%93%E6%9E%84%E5%8C%96%E8%BE%93%E5%87%BA" }, "3.2 \u7ED3\u6784\u5316\u8F93\u51FA")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#33-%E8%B7%A8%E5%B9%B3%E5%8F%B0" }, "3.3 \u8DE8\u5E73\u53F0"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#34-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96" }, "3.4 \u5141\u8BB8\u73AF\u5883\u8986\u76D6")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#4-%E6%98%93%E7%94%A8%E6%80%A7" }, "4 \u6613\u7528\u6027"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#41-%E5%85%81%E8%AE%B8%E7%8E%AF%E5%A2%83%E8%A6%86%E7%9B%96" }, "4.1 \u5141\u8BB8\u73AF\u5883\u8986\u76D6")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#42-%E4%BC%98%E9%9B%85%E9%99%8D%E7%BA%A7" }, "4.2 \u4F18\u96C5\u964D\u7EA7")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#43-nodejs-%E7%89%88%E6%9C%AC%E5%85%BC%E5%AE%B9" }, "4.3 Node.js \u7248\u672C\u517C\u5BB9")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#44-%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B-nodejs-runtime" }, "4.4 \u81EA\u52A8\u68C0\u6D4B Node.js runtime")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#5-%E6%B5%8B%E8%AF%95" }, "5 \u6D4B\u8BD5"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#51-%E4%B8%8D%E8%A6%81%E4%BF%A1%E4%BB%BB%E8%AF%AD%E8%A8%80%E7%8E%AF%E5%A2%83" }, "5.1 \u4E0D\u8981\u4FE1\u4EFB\u8BED\u8A00\u73AF\u5883")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#6-%E9%94%99%E8%AF%AF" }, "6 \u9519\u8BEF"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#61-%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF" }, "6.1 \u9519\u8BEF\u4FE1\u606F")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#62-%E5%8F%AF%E8%A1%8C%E7%9A%84%E9%94%99%E8%AF%AF" }, "6.2 \u53EF\u884C\u7684\u9519\u8BEF")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#63-%E6%8F%90%E4%BE%9B%E8%B0%83%E8%AF%95%E6%A8%A1%E5%BC%8F" }, "6.3 \u63D0\u4F9B\u8C03\u8BD5\u6A21\u5F0F")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E4%BD%9C%E8%80%85" }, "\u4F5C\u8005")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2020/02/22",
    'updated': null,
    'excerpt': "这是一个关于如何构建成功的、可移植的、对用户友好的Node.js 命令行工具（CLI）最佳实践的集合。 为什么写这篇文章？ 一个糟糕的 CLI 工具会让用户觉得难用，而构建一个成功的 CLI 需要密切关注很多细节，同时需要站在用户的角...",
    'cover': undefined,
    'categories': [
        "Node.js"
    ],
    'tags': [
        "前端",
        "翻译",
        "Node"
    ],
    'blog': {
        "isPost": true,
        "posts": [
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
                "count": 26
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
                "count": 4
            },
            {
                "name": "机器学习",
                "count": 3
            },
            {
                "name": "随便写写",
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
                "count": 25
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
                "name": "JavaScript",
                "count": 10
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
                "name": "Node",
                "count": 7
            },
            {
                "name": "React",
                "count": 7
            },
            {
                "name": "Vue.js",
                "count": 7
            },
            {
                "name": "工作",
                "count": 7
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
                "name": "翻译",
                "count": 5
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
                "name": "Koa",
                "count": 2
            },
            {
                "name": "Promise",
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
                "name": "async/await",
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
                "name": "Generator",
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
                "name": "offer",
                "count": 1
            },
            {
                "name": "Postion",
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
                "name": "Sticky",
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
                "name": "消费主义",
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
                "name": "随便写写",
                "count": 1
            },
            {
                "name": "面试",
                "count": 1
            }
        ]
    }
};
