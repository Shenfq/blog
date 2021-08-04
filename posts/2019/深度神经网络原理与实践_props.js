import projectConfig from '/pagic.config.js';
export default {
    config: { "root": "/", ...projectConfig, branch: 'main' },
    'pagePath': "posts/2019/深度神经网络原理与实践.md",
    'layoutPath': "posts/_layout.tsx",
    'outputPath': "posts/2019/深度神经网络原理与实践.html",
    'title': "深度神经网络原理与实践",
    'content': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h1>深度神经网络原理与实践</h1>\n<h2 id="%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80">理论基础<a class="anchor" href="#%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80">§</a></h2>\n<h3 id="%E4%BB%80%E4%B9%88%E6%98%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">什么是神经网络<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%98%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h3>\n<p>我们知道深度学习是机器学习的一个分支，是一种以人工神经网络为架构，对数据进行表征学习的算法。而深度神经网络又是深度学习的一个分支，它在 wikipedia 上的解释如下：</p>\n<blockquote>\n<p>深度神经网络（Deep Neural Networks, DNN）是一种判别模型，具备至少一个隐层的神经网络，可以使用反向传播算法进行训练。权重更新可以使用下式进行随机梯度下降法求解。</p>\n</blockquote>\n<p>首先我们可以知道，深度神经网络是一种判别模型。意思就是已知变量 x ，通过判别模型可以推算出 y。比如机器学习中常用到的案例，通过手写数字，模型推断出手写的是数字几。</p>\n<p><img src="https://file.shenfq.com/Fjw7fiWg-n1qXji4aX9DUz10Nrqa.png" alt="image"></p>\n<p>深度神经网络中的“深度”指的是一系列连续的表示层，数据模型中包含了多少层，这就被称为模型的“深度”。通过这些层我们可以对数据进行高层的抽象。如下图所示，深度神级网络由一个输入层，多个（至少一个）隐层，以及一个输出层构成，而且输入层与输出层的数量不一定是对等的。每一层都有若干个神经元，神经元之间有连接权重。</p>\n<p><img src="https://file.shenfq.com/FuBpmY1q3QeBX22BvqjMUV2ea1U0.png" alt="image"></p>\n<p>还是上面的案例，识别手写数字，手写的数字要怎么转成输入呢？既然是手写，那么肯定是一张图片，图片由多个像素点组成，这些像素点可以构成一个输入，经过多层神经网络，输出10个数字，这个10个数字就代表了数字 0 ~ 9 的概率。</p>\n<p><img src="https://file.shenfq.com/FsdJBzIsxftYo9e89lUwU2wlx5O7.png" alt="image"></p>\n<h3 id="%E7%A5%9E%E7%BB%8F%E5%85%83%E5%A6%82%E4%BD%95%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA">神经元如何输入输出<a class="anchor" href="#%E7%A5%9E%E7%BB%8F%E5%85%83%E5%A6%82%E4%BD%95%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA">§</a></h3>\n<p>神经网络中的每个神经元都可以看成是一个简单的线性函数，下面我们构造一个简单的三层的神经网络来看看。</p>\n<p><img src="https://file.shenfq.com/FnQlw8WyQxZ-iszYHdFur7PxwrY0.png" alt="image"></p>\n<p>如上图所示，n1 可以表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>n</mi><mn>1</mn></msub><mo>=</mo><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>2</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>3</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>3</mn></msub><mo>+</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">n_1 = w_{1,1}x_1 + w_{2,1}x_2 + w_{3,1}x_3 + b\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.69444em;vertical-align:0em;"></span><span class="mord mathnormal">b</span></span></span></span></span></p>\n<p>其中 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 表示神经元之间的权重，b 为一个常量，作为函数的偏移量。较小的权重可以弱化某个神经元对下一个神经元造成的影响，而较大的权重将放大信号。假设 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 为 0.1，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>3</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{3,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 为 0.7，那么 x3 对 n1 的影响要大于 x1。你可能会问，为什么每个神经元要与其他所有层的神经元相互连接？</p>\n<p>这里主要由两个原因：</p>\n<ol>\n<li>完全连接的形式相对容易的编写成计算机指令。</li>\n<li>在神经网络训练的过程中会弱化实际上不需要的连接（也就是某些连接权重会慢慢趋近于 0）。</li>\n</ol>\n<p>实际上通过计算得到 n1 后，其实不能立马用于后面的计算，还需要经过一个激活函数（一般为 sigmod 函数）。</p>\n<p><img src="https://file.shenfq.com/Fvu_bZlZ1vUg249qL6Rjvox19GXg.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/Ft059zilmQAlgRWVCl56_DV_MjoB.png" alt="sigmod 函数"></p>\n<p>其作用主要是引入非线性因素。如果神级网络中只有上面那种线性函数，无论有多少层，结果始终是线性的。</p>\n<h4 id="%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B">实际案例<a class="anchor" href="#%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B">§</a></h4>\n<p>为了方便计算，我们构造一个只有两层的神经网络，演示一下具体的计算过程。</p>\n<p><img src="https://file.shenfq.com/FozUDE0MOGnnoMqGhIOzVlFekc-k.png" alt="image"></p>\n<p>先通过线性函数求得一个 x 值，再把 x 值带入激活函数，得到 y1 的值。</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>x</mi><mo>=</mo><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>2</mn></msub><mo>=</mo><mo stretchy="false">(</mo><mn>1.0</mn><mo>∗</mo><mn>0.9</mn><mo stretchy="false">)</mo><mo>+</mo><mo stretchy="false">(</mo><mn>0.5</mn><mo>∗</mo><mn>0.3</mn><mo stretchy="false">)</mo><mo>=</mo><mn>1.05</mn></mrow><annotation encoding="application/x-tex">x = w_{1,1}x_1 + w_{2,1}x_2 = (1.0 * 0.9) + (0.5 * 0.3) = 1.05\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mord">.</span><span class="mord">0</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">9</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">0</span><span class="mord">.</span><span class="mord">5</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">1</span><span class="mord">.</span><span class="mord">0</span><span class="mord">5</span></span></span></span></span></p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>y</mi><mn>1</mn></msub><mo>=</mo><mn>1</mn><mi mathvariant="normal">/</mi><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><msup><mi>e</mi><mrow><mo>−</mo><mi>x</mi></mrow></msup><mo stretchy="false">)</mo><mo>=</mo><mn>1</mn><mi mathvariant="normal">/</mi><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mn>0.3499</mn><mo stretchy="false">)</mo><mo>=</mo><mn>0.7408</mn></mrow><annotation encoding="application/x-tex">y_1 = 1 / (1 + e ^{-x}) = 1 / (1 + 0.3499) = 0.7408\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.19444em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mord">/</span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1.071331em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.821331em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mathnormal mtight">x</span></span></span></span></span></span></span></span></span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mord">/</span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mord">4</span><span class="mord">9</span><span class="mord">9</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">7</span><span class="mord">4</span><span class="mord">0</span><span class="mord">8</span></span></span></span></span></p>\n<h3 id="%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95">矩阵乘法<a class="anchor" href="#%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95">§</a></h3>\n<p>其实上面的计算过程，很容易通过矩阵乘法的方式表示。矩阵这个东西，说简单点就是一个表格，或者一个二维数组。如下图所示，就是一个典型的矩阵。</p>\n<p><img src="https://file.shenfq.com/Fle6c7tCJeSpI56GXYLhpDvI5F9o.png" alt="image"></p>\n<p>那么矩阵的乘法可以表示为：</p>\n<p><img src="https://file.shenfq.com/Fl5i9c6pmYwtkwupgDlppqaA-YsD.png" alt="image"></p>\n<p>矩阵的乘法通常被成为点乘或者内积。如果我们将矩阵内的数字换成我们神经网络的输入和权重，你会发现原来前面的计算如此简单。</p>\n<p><img src="https://file.shenfq.com/FvkpHJlq3aCNMqw-plANUCRp3_r-.png" alt="image"></p>\n<p>获得点积后，只需要代入到激活函数，就能获得输出了。</p>\n<p><img src="https://file.shenfq.com/Fh7GrdgN0p0Y0Ys5qrcQUxdqVx3N.png" alt="image"></p>\n<p>通过矩阵计算过程可以表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>X</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><msub><mi>W</mi><mrow><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi mathvariant="normal">_</mi><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo separator="true">⋅</mo><msub><mi>I</mi><mrow><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow></msub><msub><mi>O</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><mi>s</mi><mi>i</mi><mi>g</mi><mi>m</mi><mi>o</mi><mi>i</mi><mi>d</mi><mo stretchy="false">(</mo><msub><mi>X</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">X_{hidden} = W_{input\_hidden} · I_{input}\n\nO_{hidden} = sigmoid(X_{hidden})\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.83333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.05033em;vertical-align:-0.367em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.13889em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">n</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mtight" style="margin-right:0.02778em;">_</span><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.367em;"><span></span></span></span></span></span></span><span class="mpunct">⋅</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.311664em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">n</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">O</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">s</span><span class="mord mathnormal">i</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>\n<h4 id="%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B-1">实际案例<a class="anchor" href="#%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B-1">§</a></h4>\n<p>下面通过矩阵来表示一个三层神经网络的计算过程。</p>\n<p><img src="https://file.shenfq.com/Fipyv33DnVPnwP-GY55JevCWbFOk.png" alt="image"></p>\n<p>上图只给出了输入层到隐层的计算过程，感兴趣可以自己手动计算下，隐层到输出层的计算过程。隐层到输出层的权重矩阵如下：</p>\n<p><img src="https://file.shenfq.com/FlAAJfkpy5sVbAfRcFh5SC084ufW.png" alt="image"></p>\n<h3 id="%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD">反向传播<a class="anchor" href="#%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD">§</a></h3>\n<p>进过一轮神经网络计算得到输出值，通常与我们实际想要的值是不一致的，这个时候我们会得到一个误差值（误差值就是训练数据给出的正确答案与实际输出值之间的差值）。但是这个误差是多个节点共同作用的结果，我们到底该用何种方式来更新各个连接的权重呢？这个时候我们就需要通过反向传播的方式，求出各个节点的误差值。</p>\n<p><img src="https://file.shenfq.com/Fs3p0gufO8D59AXgizAwXk4VI3vU.png" alt="image"></p>\n<p>下面我们代入具体值，进行一次计算。</p>\n<p><img src="https://file.shenfq.com/Fn2bljmwTC0IIqdAldaMKpv-WQ5N.png" alt="image"></p>\n<p>上图中可以看到 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">e_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 的误差值主要由 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 和 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{2,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 造成，那么其误差应当分散到两个连接上，可以按照两个连接的权重对误差 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">e_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 进行分割。</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub><mo>∗</mo><mfrac><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow></mfrac><mo>=</mo><mn>0.8</mn><mo>∗</mo><mfrac><mn>2</mn><mrow><mn>2</mn><mo>+</mo><mn>3</mn></mrow></mfrac><mo>=</mo><mn>0.32</mn></mrow><annotation encoding="application/x-tex">e_1 * \frac{w_{1,1}}{w_{1,1} + w_{2,1}} = 0.8 * \frac{2}{2 + 3} = 0.32\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.61528em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.079668em;vertical-align:-0.972108em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.1075599999999999em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.972108em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">8</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.09077em;vertical-align:-0.7693300000000001em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.32144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">3</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693300000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mord">2</span></span></span></span></span></p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub><mo>∗</mo><mfrac><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow></mfrac><mo>=</mo><mn>0.8</mn><mo>∗</mo><mfrac><mn>3</mn><mrow><mn>2</mn><mo>+</mo><mn>3</mn></mrow></mfrac><mo>=</mo><mn>0.48</mn></mrow><annotation encoding="application/x-tex">e_1 * \frac{w_{2,1}}{w_{1,1} + w_{2,1}} = 0.8 * \frac{3}{2 + 3} = 0.48\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.61528em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.079668em;vertical-align:-0.972108em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.1075599999999999em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.972108em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">8</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.09077em;vertical-align:-0.7693300000000001em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.32144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">3</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693300000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">4</span><span class="mord">8</span></span></span></span></span></p>\n<p>同理对误差 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">e_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 进行分割，然后把两个连接处的误差值相加，就能得到输出点的前馈节点的误差值。</p>\n<p><img src="https://file.shenfq.com/FrCafEfslODTYVqrV6pFZaMI-TiG.png" alt="image"></p>\n<p>然后在按照之前的方法将这个误差传播到前面的层，直到所有节点都能得到自己的误差值，这种方式被成为反向传播。</p>\n<h4 id="%E4%BD%BF%E7%94%A8%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E8%AF%AF%E5%B7%AE">使用矩阵乘法进行反向传播误差<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E8%AF%AF%E5%B7%AE">§</a></h4>\n<p>上面如此繁琐的操作，我们也可以通过矩阵的方式进行简化。</p>\n<p><img src="https://file.shenfq.com/FmYWgu8b1lMgQxEqynXOxxllgaYa.png" alt="image"></p>\n<p>这个矩阵中还是有麻烦的分数需要处理，那么我们能不能大胆一点，将分母直接做归一化的处理。这么做我们仅仅只是改变了反馈误差的大小，其误差依旧是按照比例来计算的。</p>\n<p><img src="https://file.shenfq.com/FjD8lHUXF7Ytn9W8YWcnHOUa28-9.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/FmdzXGU-rU3BCo-Mz3eNvKckP-wE.png" alt="image"></p>\n<p>仔细观察会发现，与我们之前计算每层的输出值的矩阵点击很像，只是权重矩阵进行翻转，右上方的元素变成了左下方的元素，我们可以称其为转置矩阵，记为 $ w^T $。</p>\n<p>反向传播误差的矩阵可以简单表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>e</mi><mi>r</mi><mi>r</mi><mi>o</mi><msub><mi>r</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><msubsup><mi>W</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi><mi mathvariant="normal">_</mi><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow><mi>T</mi></msubsup><mo separator="true">⋅</mo><mi>e</mi><mi>r</mi><mi>r</mi><mi>o</mi><msub><mi>r</mi><mrow><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">error_{hidden} = W^{T}_{hidden\_output} · error_{output}\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">o</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.355331em;vertical-align:-0.46399999999999997em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.891331em;"><span style="top:-2.4530000000000003em;margin-left:-0.13889em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span><span class="mord mtight" style="margin-right:0.02778em;">_</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span><span style="top:-3.1130000000000004em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.13889em;">T</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.46399999999999997em;"><span></span></span></span></span></span></span><span class="mpunct">⋅</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">o</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.28055599999999997em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span></span></p>\n<h3 id="%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D">梯度下降<a class="anchor" href="#%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D">§</a></h3>\n<p>在每个点都得到误差后，我们该按照何种方式来更新权重呢？</p>\n<p>这个时候就要使用到机器学习中常用的方式：梯度下级。</p>\n<p><img src="https://file.shenfq.com/FsrJBt8QxtpMcJ2qpJeeTAR0sYTW.png" alt="image"></p>\n<p>更多细节可以参考我之前写的博客：<a href="https://blog.shenfq.com/2019/01/28/2019/%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D%E4%B8%8E%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92/">梯度下降与线性回归</a></p>\n<p>通过不停的训练，我们就能改进神经网络，其本质就是不断地改变权重的大小，减小神经网络输出的误差值。\n最后就能够得到一个多层神经网络的模型，通过输入进行有效的预测。</p>\n<h2 id="%E5%AE%9E%E6%88%98">实战<a class="anchor" href="#%E5%AE%9E%E6%88%98">§</a></h2>\n<h3 id="%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87">环境准备<a class="anchor" href="#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87">§</a></h3>\n<p>首先需要安装 python3 ，直接去 python 官网安装，尽量安装最新版，不推荐安装 python2 。安装好 python 环境之后，然后安装 virtualenv 以及相关依赖。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 升级 pip 到最新版本</span>\npip3 <span class="token function">install</span> --upgrade pip\n\n<span class="token comment"># 安装 virtualenv ，用于配置虚拟环境</span>\npip3 <span class="token function">install</span> --user --upgrade virtualenv\n</code></pre>\n<p>正常情况下，当我们在使用 pip 进行包安装的时候，都是安装的全局包，相当于<code>npm install -g</code>。假如现在有两个项目，项目 A 依赖 simplejson@2 ，项目 B 依赖 simplejson@3，这样我们在一台机器上开发显得有些手足无措。这个时候 virtualenv 就能大展身手了，virtualenv 可以创建一个独立的 python 运行环境，也就是一个沙箱，你甚至可以在 virtualenv 创建的虚拟环境中使用与当前系统不同的 python 版本。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 配置虚拟环境</span>\n<span class="token builtin class-name">cd</span> ~/ml\nvirtualenv <span class="token function">env</span>\n\n<span class="token comment"># 启动虚拟环境</span>\n<span class="token comment"># linux</span>\n<span class="token builtin class-name">source</span> env/bin/activate\n<span class="token comment"># windows</span>\n./env/Scripts/activate\n\n</code></pre>\n<p>启动后，如下</p>\n<pre class="language-bash"><code class="language-bash"><span class="token punctuation">(</span>env<span class="token punctuation">)</span> λ \n</code></pre>\n<p><img src="https://file.shenfq.com/Fn5PT4ZTWJRwwnOIMTRAP6AZV07z.png" alt="image"></p>\n<p>在虚拟环境下安装所有模块依赖。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 安装模块和依赖</span>\n<span class="token punctuation">(</span>env<span class="token punctuation">)</span> λ pip3 <span class="token function">install</span> --upgrade jupyter matplotlib numpy scipy\n</code></pre>\n<ul>\n<li>\n<p>jupyter：基于网页的用于交互计算的应用程序。其可被应用于全过程计算：开发、文档编写、运行代码和展示结果。</p>\n</li>\n<li>\n<p>numpy：数组计算扩展的包，支持高维度数组与矩阵运算，此外也针对数组运算提供大量的数学函数库。</p>\n</li>\n<li>\n<p>scipy：基于numpy的扩展包，它增加的功能包括数值积分、最优化、统计和一些专用函数。</p>\n</li>\n<li>\n<p>matplotlib：基于numpy的扩展包，提供了丰富的数据绘图工具，主要用于绘制一些统计图形。</p>\n</li>\n<li>\n<p>scikit-learn：开源的Python机器学习库，它基于Numpy和Scipy，提供了大量用于数据挖掘和分析的工具，包括数据预处理、交叉验证、算法与可视化算法等一系列接口。</p>\n</li>\n</ul>\n<h4 id="%E5%90%AF%E5%8A%A8-jupyter">启动 jupyter<a class="anchor" href="#%E5%90%AF%E5%8A%A8-jupyter">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">jupyter notebook\n</code></pre>\n<p>jupyter 会在8888端口起一个服务，并自动打开浏览器。</p>\n<p><img src="https://file.shenfq.com/FoIVlLx4Rsh81RLyGmgZ5r0lyuZe.png" alt="image"></p>\n<p>通过右上角的new，你就能创建一个项目了。创建项目后，我们很方便的在该页面上进行 python 代码的运行与输出。</p>\n<p><img src="https://file.shenfq.com/FmSvJC2Uv_plGVynXbzcWsNfeyEV.gif" alt="image"></p>\n<h4 id="%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE">准备数据<a class="anchor" href="#%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE">§</a></h4>\n<p>MNIST 是由美国的高中生和美国人口调查局的职员手写数字（0 ~ 9）图片。接下来要做的事情就是让我们的程序学习这些图片的信息，能够识别出输入的图片所代表的数字含义，这听上去好像有点难度，不着急，我们一步步来。</p>\n<p>这里准备了 MNIST 的训练数据，其中 <code>train_100</code> 为训练数据集，<code>test_10</code> 为测试数据集。在机器学习的过程中，我们一般会将数据集切分成两个，分别为训练集合测试集，一般 80% 的数据进行训练，保留 20% 用于测试。这里因为是 hello world 操作，我们只用 100 个数据进行训练，真实情况下，这种数据量是远远不够的。</p>\n<ul>\n<li><a href="https://raw.githubusercontent.com/makeyourownneuralnetwork/makeyourownneuralnetwork/master/mnist_dataset/mnist_train_100.csv">mnist_train_100.csv</a></li>\n<li><a href="https://raw.githubusercontent.com/makeyourownneuralnetwork/makeyourownneuralnetwork/master/mnist_dataset/mnist_test_10.csv">mnist_test_10.csv</a></li>\n</ul>\n<p>如果想用完整的数据进行训练，可以下载这个 csv 文件。</p>\n<p><a href="https://pjreddie.com/media/files/mnist_train.csv">https://pjreddie.com/media/files/mnist_train.csv</a></p>\n<h4 id="%E8%A7%82%E5%AF%9F%E6%95%B0%E6%8D%AE">观察数据<a class="anchor" href="#%E8%A7%82%E5%AF%9F%E6%95%B0%E6%8D%AE">§</a></h4>\n<p>下载数据后，将 csv （逗号分隔值文件格式）文件放入到 datasets 文件夹，然后使用 python 进行文件的读取。</p>\n<pre class="language-python"><code class="language-python">data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_train_100.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ndata_list <span class="token operator">=</span> data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># readlines方法用于读取文件的所有行，并返回一个数组</span>\ndata_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token builtin">len</span><span class="token punctuation">(</span>data_list<span class="token punctuation">)</span> <span class="token comment"># 数组长度为100</span>\n</code></pre>\n<p>打印第一行文本，看看数据的格式是怎么样的</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">print</span><span class="token punctuation">(</span>data_list<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token builtin">len</span><span class="token punctuation">(</span>data_list<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment"># 使用 , 进行分割，将字符串转换为数组</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FpwLohSBEtk8nhG2dyGeE91jZwHe.png" alt="image"></p>\n<p>可以看到一行数据一共有 785 个数据，第一列表示这个手写数的真实值（这个值在机器学习中称为标签），后面的 784 个数据表示一个 28 * 28 的尺寸的像素值，流行的图像处理软件通常用8位表示一个像素，这样总共有256个灰度等级(像素值在0~255 间)，每个等级代表不同的亮度。</p>\n<p>下面我们导入 numpy 库，对数据进行处理，values[1:] 取出数组的第一位到最后并生成一个新的数组，使用 numpy.asfarray 将数组转为一个浮点类型的 ndarray，然后每一项除以 255 在乘以 9，将每个数字转为 0 ~ 9 的个位数，使用 astype(int) 把每个数再转为 int 类型，最后 reshape((28,28) 可以把数组转为 28 * 28 的二维数组。</p>\n<p>如果想了解更多 numpy 的资料，可以查看它的<a href="https://www.numpy.org.cn/index.html">文档</a>。</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">import</span> numpy <span class="token keyword">as</span> np\n\nvalues <span class="token operator">=</span> data_list<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\nimage_array <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255</span> <span class="token operator">*</span> <span class="token number">9</span><span class="token punctuation">)</span><span class="token punctuation">.</span>astype<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">.</span>reshape<span class="token punctuation">(</span><span class="token number">28</span><span class="token punctuation">,</span><span class="token number">28</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FrwDGzwLUk0yEgKOvPPRCykAOJWg.png" alt="image"></p>\n<p>这样看不够直观，接下来使用 matplotlib ，将像素点一个个画出来。</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">import</span> matplotlib<span class="token punctuation">.</span>pyplot\n<span class="token operator">%</span>matplotlib inline\n\nmatplotlib<span class="token punctuation">.</span>pyplot<span class="token punctuation">.</span>imshow<span class="token punctuation">(</span>\n    np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span>reshape<span class="token punctuation">(</span><span class="token number">28</span><span class="token punctuation">,</span><span class="token number">28</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n    cmap<span class="token operator">=</span><span class="token string">\'Greys\'</span><span class="token punctuation">,</span> \n    interpolation<span class="token operator">=</span><span class="token string">\'None\'</span>\n<span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FjeF-u3KhHB0ii7ryTNiR1Aji28v.png" alt="image"></p>\n<h3 id="%E6%90%AD%E5%BB%BA%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">搭建神经网络<a class="anchor" href="#%E6%90%AD%E5%BB%BA%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h3>\n<p>我们简单勾勒出神经网络的大概样子，至少需要三个函数：</p>\n<ol>\n<li>初始化函数——设定输入层、隐藏层、输出层节点的数量，随机生成的权重。</li>\n<li>训练——学习给定的训练样本，调整权重。</li>\n<li>查询——给定输入，获取预测结果。</li>\n</ol>\n<p>框架代码如下：</p>\n<pre class="language-python"><code class="language-python"><span class="token comment"># 引入依赖库</span>\n<span class="token keyword">import</span> numpy <span class="token keyword">as</span> np\n<span class="token keyword">import</span> scipy<span class="token punctuation">.</span>special\n<span class="token keyword">import</span> matplotlib<span class="token punctuation">.</span>pyplot\n\n<span class="token comment"># 神经网络类定义</span>\n<span class="token keyword">class</span> <span class="token class-name">neuralNetwork</span><span class="token punctuation">:</span>\n    <span class="token comment"># 初始化神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n\n    <span class="token comment"># 训练神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">train</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n   \n    <span class="token comment"># 查询神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">query</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n</code></pre>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">初始化神经网络<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<p>接下来让我们进行第一步操作，初始化一个神经网络。</p>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 初始化神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputnodes<span class="token punctuation">,</span> hiddennodes<span class="token punctuation">,</span> outputnodes<span class="token punctuation">,</span> learningrate<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 设置输入层、隐藏层、输出层节点的数量</span>\n        self<span class="token punctuation">.</span>inodes <span class="token operator">=</span> inputnodes\n        self<span class="token punctuation">.</span>hnodes <span class="token operator">=</span> hiddennodes\n        self<span class="token punctuation">.</span>onodes <span class="token operator">=</span> outputnodes\n        \n        <span class="token comment"># 连接权重，随机生成输入层到隐藏层和隐藏层到输出层的权重</span>\n        self<span class="token punctuation">.</span>wih <span class="token operator">=</span> np<span class="token punctuation">.</span>random<span class="token punctuation">.</span>rand<span class="token punctuation">(</span>self<span class="token punctuation">.</span>hnodes<span class="token punctuation">,</span> self<span class="token punctuation">.</span>inodes<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">0.5</span>\n        self<span class="token punctuation">.</span>who <span class="token operator">=</span> np<span class="token punctuation">.</span>random<span class="token punctuation">.</span>rand<span class="token punctuation">(</span>self<span class="token punctuation">.</span>onodes<span class="token punctuation">,</span> self<span class="token punctuation">.</span>hnodes<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">0.5</span>\n\n        <span class="token comment"># 学习率</span>\n        self<span class="token punctuation">.</span>lr <span class="token operator">=</span> learningrate\n        \n        <span class="token comment"># 将激活函数设置为 sigmoid 函数</span>\n        self<span class="token punctuation">.</span>activation_function <span class="token operator">=</span> <span class="token keyword">lambda</span> x<span class="token punctuation">:</span> scipy<span class="token punctuation">.</span>special<span class="token punctuation">.</span>expit<span class="token punctuation">(</span>x<span class="token punctuation">)</span>\n        \n        <span class="token keyword">pass</span>\n</code></pre>\n<p><strong>生成权重</strong></p>\n<p>生成连接权重使用 <code>numpy</code> 函数库，该库支持大维度数组以及矩阵的运算，通过<code>numpy.random.rand(x, y)</code>可以快速生成一个 <code>x * y</code> 的矩阵，每个数字都是一个 0 ~ 1 的随机数。因为导入库的时候使用了 <code>import numpy as np</code> 命令，所有代码中可以用 <code>np</code> 来代替 <code>numpy</code>。</p>\n<p><img src="https://file.shenfq.com/FjWSNNZ758iVgqaGunY3LNYu60Iv.png" alt="image"></p>\n<p>上面就是通过 <code>numpy.random.rand</code> 方法生成一个 <code>3 * 3</code> 矩阵的案例。减去0.5是为了保证生成的权重所有权重都能维持在 -0.5 ~ 0.5 之间的一个随机值。</p>\n<p><img src="https://file.shenfq.com/FuGnOobiInRSl4F9PXOP_Odn-YPj.png" alt="image"></p>\n<p><strong>激活函数</strong></p>\n<p><code>scipy.special</code> 模块中包含了大量的函数库，利用 <code>scipy.special</code> 库可以很方便快捷的构造出一个激活函数：</p>\n<pre class="language-python"><code class="language-python">activation_function <span class="token operator">=</span> <span class="token keyword">lambda</span> x<span class="token punctuation">:</span> scipy<span class="token punctuation">.</span>special<span class="token punctuation">.</span>expit<span class="token punctuation">(</span>x<span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E6%9F%A5%E8%AF%A2%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">查询神经网络<a class="anchor" href="#%E6%9F%A5%E8%AF%A2%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 查询神经网络    </span>\n    <span class="token keyword">def</span> <span class="token function">query</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputs_list<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 将输入的数组转化为一个二维数组</span>\n        inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>inputs_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        \n        <span class="token comment"># 计算输入数据与权重的点积</span>\n        hidden_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>wih<span class="token punctuation">,</span> inputs<span class="token punctuation">)</span>\n        <span class="token comment"># 经过激活函数的到隐藏层数据</span>\n        hidden_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>hidden_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 计算隐藏层数据与权重的点积</span>\n        final_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">,</span> hidden_outputs<span class="token punctuation">)</span>\n        <span class="token comment"># 最终到达输出层的数据</span>\n        final_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>final_inputs<span class="token punctuation">)</span>\n        \n        <span class="token keyword">return</span> final_outputs\n</code></pre>\n<p>查询神经网络的操作很简单，只需要使用 <code>numpy</code> 的 <code>dot</code> 方法对两个矩阵求点积即可。</p>\n<p>这里有一个知识点，就是关于 <code>numpy</code> 的数据类型，通过 <code>numpy.array</code> 方法能够将 python 中的数组转为一个 N 维数组对象 <code>Ndarray</code>，该方法第二个参数就是表示转化后的维度。</p>\n<p><img src="https://file.shenfq.com/FnfUXxYR0zUQaBWUxp8RNZXxBpbr.png" alt="image"></p>\n<p>上图是一个普通数组 <code>[1, 2, 3]</code> 使用该方法转变成二维数组，返回 <code>[[1, 2, 3]]</code>。该方法还有个属性 T，本质是调用 <code>numpy</code> 的 <code>transpose</code> 方法，对数组进行轴对换，如下图所示。</p>\n<p><img src="https://file.shenfq.com/FvmwZV-hOpFrG2uVrO3G-_nVgRCc.png" alt="image"></p>\n<p>通过转置我们就能得到一个合适的输入矩阵了。</p>\n<p><img src="https://file.shenfq.com/Fr4gSENAXsb-vwRuOkIc4OoIKT71.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/Fjz5HdsAs_XNskbCwoyB8Q0-4laj.png" alt="image"></p>\n<h4 id="%E8%AE%AD%E7%BB%83%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">训练神经网络<a class="anchor" href="#%E8%AE%AD%E7%BB%83%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 训练神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">train</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputs_list<span class="token punctuation">,</span> targets_list<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 将输入数据与目标数据转为二维数组</span>\n        inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>inputs_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        targets <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>targets_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        \n        <span class="token comment"># 通过矩阵点积和激活函数得到隐藏层的输出</span>\n        hidden_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>wih<span class="token punctuation">,</span> inputs<span class="token punctuation">)</span>\n        hidden_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>hidden_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 通过矩阵点积和激活函数得到最终输出</span>\n        final_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">,</span> hidden_outputs<span class="token punctuation">)</span>\n        final_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>final_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 获取目标值与实际值的差值</span>\n        output_errors <span class="token operator">=</span> targets <span class="token operator">-</span> final_outputs\n        <span class="token comment"># 反向传播差值</span>\n        hidden_errors <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">.</span>T<span class="token punctuation">,</span> output_errors<span class="token punctuation">)</span> \n        \n        <span class="token comment"># 通过梯度下降法更新隐藏层到输出层的权重</span>\n        self<span class="token punctuation">.</span>who <span class="token operator">+=</span> self<span class="token punctuation">.</span>lr <span class="token operator">*</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>\n            <span class="token punctuation">(</span>output_errors <span class="token operator">*</span> final_outputs <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">-</span> final_outputs<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n            np<span class="token punctuation">.</span>transpose<span class="token punctuation">(</span>hidden_outputs<span class="token punctuation">)</span>\n        <span class="token punctuation">)</span>\n        <span class="token comment"># 通过梯度下降法更新输入层到隐藏层的权重</span>\n        self<span class="token punctuation">.</span>wih <span class="token operator">+=</span> self<span class="token punctuation">.</span>lr <span class="token operator">*</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>\n            <span class="token punctuation">(</span>hidden_errors <span class="token operator">*</span> hidden_outputs <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">-</span> hidden_outputs<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n            np<span class="token punctuation">.</span>transpose<span class="token punctuation">(</span>inputs<span class="token punctuation">)</span>\n        <span class="token punctuation">)</span>\n        \n        <span class="token keyword">pass</span>\n</code></pre>\n<p>训练神经网络前半部分与查询类似，中间会将得到的差值通过求矩阵点积的方式进行反向传播，最后就是使用梯度下级的方法修正权重。其中 <code>self.lr</code> 为梯度下降的学习率，这个值是限制梯度方向的速率，我们需要经常调整这个值来达到模型的最优解。</p>\n<h3 id="%E8%BF%9B%E8%A1%8C%E8%AE%AD%E7%BB%83">进行训练<a class="anchor" href="#%E8%BF%9B%E8%A1%8C%E8%AE%AD%E7%BB%83">§</a></h3>\n<pre class="language-python"><code class="language-python"><span class="token comment"># 设置每一层的节点数量</span>\ninput_nodes <span class="token operator">=</span> <span class="token number">784</span>\nhidden_nodes <span class="token operator">=</span> <span class="token number">100</span>\noutput_nodes <span class="token operator">=</span> <span class="token number">10</span>\n\n<span class="token comment"># 学习率</span>\nlearning_rate <span class="token operator">=</span> <span class="token number">0.1</span>\n\n<span class="token comment"># 创建神经网络模型</span>\nn <span class="token operator">=</span> neuralNetwork<span class="token punctuation">(</span>input_nodes<span class="token punctuation">,</span>hidden_nodes<span class="token punctuation">,</span>output_nodes<span class="token punctuation">,</span> learning_rate<span class="token punctuation">)</span>\n\n<span class="token comment"># 加载训练数据</span>\ntraining_data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_train_100.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ntraining_data_list <span class="token operator">=</span> training_data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span>\ntraining_data_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment"># 训练神经网络</span>\n<span class="token comment"># epochs 表示训练次数</span>\nepochs <span class="token operator">=</span> <span class="token number">10</span>\n<span class="token keyword">for</span> e <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>epochs<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token comment"># 遍历所有数据进行训练</span>\n    <span class="token keyword">for</span> record <span class="token keyword">in</span> training_data_list<span class="token punctuation">:</span>\n        <span class="token comment"># 数据通过 \',\' 分割，变成一个数组</span>\n        all_values <span class="token operator">=</span> record<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\n        <span class="token comment"># 分离出图片的像素点到一个单独数组</span>\n        inputs <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255.0</span> <span class="token operator">*</span> <span class="token number">0.99</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n        <span class="token comment"># 创建目标输出值（数字 0~9 出现的概率，默认全部为 0.01）</span>\n        targets <span class="token operator">=</span> np<span class="token punctuation">.</span>zeros<span class="token punctuation">(</span>output_nodes<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n        <span class="token comment"># all_values[0] 表示手写数字的真实值，将该数字的概率设为 0.99</span>\n        targets<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0.99</span>\n        n<span class="token punctuation">.</span>train<span class="token punctuation">(</span>inputs<span class="token punctuation">,</span> targets<span class="token punctuation">)</span>\n        <span class="token keyword">pass</span>\n    <span class="token keyword">pass</span>\n\n<span class="token comment"># 训练完毕</span>\n<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">\'done\'</span><span class="token punctuation">)</span>\n\n</code></pre>\n<h3 id="%E9%AA%8C%E8%AF%81%E8%AE%AD%E7%BB%83%E7%BB%93%E6%9E%9C">验证训练结果<a class="anchor" href="#%E9%AA%8C%E8%AF%81%E8%AE%AD%E7%BB%83%E7%BB%93%E6%9E%9C">§</a></h3>\n<pre class="language-python"><code class="language-python">\n<span class="token comment"># 加载测试数据</span>\ntest_data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_test_10.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ntest_data_list <span class="token operator">=</span> test_data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span>\ntest_data_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment"># 测试神经网络</span>\n<span class="token comment"># 记录所有的训练值，正确存 1 ，错误存 0 。</span>\nscorecard <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n<span class="token comment"># 遍历所有数据进行测试</span>\n<span class="token keyword">for</span> record <span class="token keyword">in</span> test_data_list<span class="token punctuation">:</span>\n    <span class="token comment"># 数据通过 \',\' 分割，变成一个数组</span>\n    all_values <span class="token operator">=</span> record<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\n    <span class="token comment"># 第一个数字为正确答案</span>\n    correct_label <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n    <span class="token comment"># 取出测试的输入数据</span>\n    inputs <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255.0</span> <span class="token operator">*</span> <span class="token number">0.99</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n    <span class="token comment"># 查询神经网络</span>\n    outputs <span class="token operator">=</span> n<span class="token punctuation">.</span>query<span class="token punctuation">(</span>inputs<span class="token punctuation">)</span>\n    <span class="token comment"># 取出概率最大的数字，表示输出</span>\n    label <span class="token operator">=</span> np<span class="token punctuation">.</span>argmax<span class="token punctuation">(</span>outputs<span class="token punctuation">)</span>\n    <span class="token comment"># 打印出真实值与查询值</span>\n    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">\'act: \'</span><span class="token punctuation">,</span> label<span class="token punctuation">,</span> <span class="token string">\' pre: \'</span><span class="token punctuation">,</span> correct_label<span class="token punctuation">)</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>label <span class="token operator">==</span> correct_label<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 神经网络查询结果与真实值匹配，记录数组存入 1</span>\n        scorecard<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n    <span class="token keyword">else</span><span class="token punctuation">:</span>\n        <span class="token comment"># 神经网络查询结果与真实值不匹配，记录数组存入 0</span>\n        scorecard<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n        <span class="token keyword">pass</span>\n    \n    <span class="token keyword">pass</span>\n    \n<span class="token comment"># 计算训练的成功率</span>\nscorecard_array <span class="token operator">=</span> np<span class="token punctuation">.</span>asarray<span class="token punctuation">(</span>scorecard<span class="token punctuation">)</span>\n<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"performance = "</span><span class="token punctuation">,</span> scorecard_array<span class="token punctuation">.</span><span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> scorecard_array<span class="token punctuation">.</span>size<span class="token punctuation">)</span>\n</code></pre>\n<h3 id="%E5%AE%8C%E6%95%B4%E4%BB%A3%E7%A0%81">完整代码<a class="anchor" href="#%E5%AE%8C%E6%95%B4%E4%BB%A3%E7%A0%81">§</a></h3>\n<p>要查看完整代码可以访问我的 github： <a href="https://github.com/Shenfq/deep_neural_network/blob/master/NeuralNetWork.ipynb">deep_neural_network</a></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>到这里整个深度神级网络的模型原理与实践已经全部进行完毕了，虽然有些部分概念讲解并不是那么仔细，但是你还可以通过搜索其他资料了解更多。感谢《Python神经网络编程》这本书，因为它才有了这个博客，如果感兴趣你也可以买来看看，这本书真的用很简单的语言描述了复杂的数学计算。</p>\n<p>人工智能现在确实是一个非常火热的阶段，希望感兴趣的同学们多多尝试，但是也不要一昧的追新，忘记了自己本来的优势。</p>'
        } }),
    'head': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "/assets/hm.js" }),
        React.createElement("link", { crossOrigin: "anonymous", href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css", integrity: "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X", rel: "stylesheet" })),
    'script': React.createElement(React.Fragment, null,
        React.createElement("script", { src: "https://cdn.pagic.org/react@16.13.1/umd/react.production.min.js" }),
        React.createElement("script", { src: "https://cdn.pagic.org/react-dom@16.13.1/umd/react-dom.production.min.js" }),
        React.createElement("script", { src: "/index.js", type: "module" })),
    'contentTitle': React.createElement("h1", { key: "0" }, "\u6DF1\u5EA6\u795E\u7ECF\u7F51\u7EDC\u539F\u7406\u4E0E\u5B9E\u8DF5"),
    'contentBody': React.createElement("article", { dangerouslySetInnerHTML: {
            __html: '<h2 id="%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80">理论基础<a class="anchor" href="#%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80">§</a></h2>\n<h3 id="%E4%BB%80%E4%B9%88%E6%98%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">什么是神经网络<a class="anchor" href="#%E4%BB%80%E4%B9%88%E6%98%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h3>\n<p>我们知道深度学习是机器学习的一个分支，是一种以人工神经网络为架构，对数据进行表征学习的算法。而深度神经网络又是深度学习的一个分支，它在 wikipedia 上的解释如下：</p>\n<blockquote>\n<p>深度神经网络（Deep Neural Networks, DNN）是一种判别模型，具备至少一个隐层的神经网络，可以使用反向传播算法进行训练。权重更新可以使用下式进行随机梯度下降法求解。</p>\n</blockquote>\n<p>首先我们可以知道，深度神经网络是一种判别模型。意思就是已知变量 x ，通过判别模型可以推算出 y。比如机器学习中常用到的案例，通过手写数字，模型推断出手写的是数字几。</p>\n<p><img src="https://file.shenfq.com/Fjw7fiWg-n1qXji4aX9DUz10Nrqa.png" alt="image"></p>\n<p>深度神经网络中的“深度”指的是一系列连续的表示层，数据模型中包含了多少层，这就被称为模型的“深度”。通过这些层我们可以对数据进行高层的抽象。如下图所示，深度神级网络由一个输入层，多个（至少一个）隐层，以及一个输出层构成，而且输入层与输出层的数量不一定是对等的。每一层都有若干个神经元，神经元之间有连接权重。</p>\n<p><img src="https://file.shenfq.com/FuBpmY1q3QeBX22BvqjMUV2ea1U0.png" alt="image"></p>\n<p>还是上面的案例，识别手写数字，手写的数字要怎么转成输入呢？既然是手写，那么肯定是一张图片，图片由多个像素点组成，这些像素点可以构成一个输入，经过多层神经网络，输出10个数字，这个10个数字就代表了数字 0 ~ 9 的概率。</p>\n<p><img src="https://file.shenfq.com/FsdJBzIsxftYo9e89lUwU2wlx5O7.png" alt="image"></p>\n<h3 id="%E7%A5%9E%E7%BB%8F%E5%85%83%E5%A6%82%E4%BD%95%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA">神经元如何输入输出<a class="anchor" href="#%E7%A5%9E%E7%BB%8F%E5%85%83%E5%A6%82%E4%BD%95%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA">§</a></h3>\n<p>神经网络中的每个神经元都可以看成是一个简单的线性函数，下面我们构造一个简单的三层的神经网络来看看。</p>\n<p><img src="https://file.shenfq.com/FnQlw8WyQxZ-iszYHdFur7PxwrY0.png" alt="image"></p>\n<p>如上图所示，n1 可以表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>n</mi><mn>1</mn></msub><mo>=</mo><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>2</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>3</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>3</mn></msub><mo>+</mo><mi>b</mi></mrow><annotation encoding="application/x-tex">n_1 = w_{1,1}x_1 + w_{2,1}x_2 + w_{3,1}x_3 + b\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">n</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.69444em;vertical-align:0em;"></span><span class="mord mathnormal">b</span></span></span></span></span></p>\n<p>其中 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 表示神经元之间的权重，b 为一个常量，作为函数的偏移量。较小的权重可以弱化某个神经元对下一个神经元造成的影响，而较大的权重将放大信号。假设 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 为 0.1，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>3</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{3,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">3</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 为 0.7，那么 x3 对 n1 的影响要大于 x1。你可能会问，为什么每个神经元要与其他所有层的神经元相互连接？</p>\n<p>这里主要由两个原因：</p>\n<ol>\n<li>完全连接的形式相对容易的编写成计算机指令。</li>\n<li>在神经网络训练的过程中会弱化实际上不需要的连接（也就是某些连接权重会慢慢趋近于 0）。</li>\n</ol>\n<p>实际上通过计算得到 n1 后，其实不能立马用于后面的计算，还需要经过一个激活函数（一般为 sigmod 函数）。</p>\n<p><img src="https://file.shenfq.com/Fvu_bZlZ1vUg249qL6Rjvox19GXg.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/Ft059zilmQAlgRWVCl56_DV_MjoB.png" alt="sigmod 函数"></p>\n<p>其作用主要是引入非线性因素。如果神级网络中只有上面那种线性函数，无论有多少层，结果始终是线性的。</p>\n<h4 id="%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B">实际案例<a class="anchor" href="#%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B">§</a></h4>\n<p>为了方便计算，我们构造一个只有两层的神经网络，演示一下具体的计算过程。</p>\n<p><img src="https://file.shenfq.com/FozUDE0MOGnnoMqGhIOzVlFekc-k.png" alt="image"></p>\n<p>先通过线性函数求得一个 x 值，再把 x 值带入激活函数，得到 y1 的值。</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>x</mi><mo>=</mo><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><msub><mi>x</mi><mn>2</mn></msub><mo>=</mo><mo stretchy="false">(</mo><mn>1.0</mn><mo>∗</mo><mn>0.9</mn><mo stretchy="false">)</mo><mo>+</mo><mo stretchy="false">(</mo><mn>0.5</mn><mo>∗</mo><mn>0.3</mn><mo stretchy="false">)</mo><mo>=</mo><mn>1.05</mn></mrow><annotation encoding="application/x-tex">x = w_{1,1}x_1 + w_{2,1}x_2 = (1.0 * 0.9) + (0.5 * 0.3) = 1.05\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.8694379999999999em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mord">.</span><span class="mord">0</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">9</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">0</span><span class="mord">.</span><span class="mord">5</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">1</span><span class="mord">.</span><span class="mord">0</span><span class="mord">5</span></span></span></span></span></p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>y</mi><mn>1</mn></msub><mo>=</mo><mn>1</mn><mi mathvariant="normal">/</mi><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><msup><mi>e</mi><mrow><mo>−</mo><mi>x</mi></mrow></msup><mo stretchy="false">)</mo><mo>=</mo><mn>1</mn><mi mathvariant="normal">/</mi><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mn>0.3499</mn><mo stretchy="false">)</mo><mo>=</mo><mn>0.7408</mn></mrow><annotation encoding="application/x-tex">y_1 = 1 / (1 + e ^{-x}) = 1 / (1 + 0.3499) = 0.7408\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.19444em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mord">/</span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1.071331em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.821331em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mathnormal mtight">x</span></span></span></span></span></span></span></span></span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mord">/</span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mord">4</span><span class="mord">9</span><span class="mord">9</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">7</span><span class="mord">4</span><span class="mord">0</span><span class="mord">8</span></span></span></span></span></p>\n<h3 id="%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95">矩阵乘法<a class="anchor" href="#%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95">§</a></h3>\n<p>其实上面的计算过程，很容易通过矩阵乘法的方式表示。矩阵这个东西，说简单点就是一个表格，或者一个二维数组。如下图所示，就是一个典型的矩阵。</p>\n<p><img src="https://file.shenfq.com/Fle6c7tCJeSpI56GXYLhpDvI5F9o.png" alt="image"></p>\n<p>那么矩阵的乘法可以表示为：</p>\n<p><img src="https://file.shenfq.com/Fl5i9c6pmYwtkwupgDlppqaA-YsD.png" alt="image"></p>\n<p>矩阵的乘法通常被成为点乘或者内积。如果我们将矩阵内的数字换成我们神经网络的输入和权重，你会发现原来前面的计算如此简单。</p>\n<p><img src="https://file.shenfq.com/FvkpHJlq3aCNMqw-plANUCRp3_r-.png" alt="image"></p>\n<p>获得点积后，只需要代入到激活函数，就能获得输出了。</p>\n<p><img src="https://file.shenfq.com/Fh7GrdgN0p0Y0Ys5qrcQUxdqVx3N.png" alt="image"></p>\n<p>通过矩阵计算过程可以表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>X</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><msub><mi>W</mi><mrow><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi mathvariant="normal">_</mi><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo separator="true">⋅</mo><msub><mi>I</mi><mrow><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow></msub><msub><mi>O</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><mi>s</mi><mi>i</mi><mi>g</mi><mi>m</mi><mi>o</mi><mi>i</mi><mi>d</mi><mo stretchy="false">(</mo><msub><mi>X</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">X_{hidden} = W_{input\_hidden} · I_{input}\n\nO_{hidden} = sigmoid(X_{hidden})\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.83333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.05033em;vertical-align:-0.367em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.13889em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">n</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mtight" style="margin-right:0.02778em;">_</span><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.367em;"><span></span></span></span></span></span></span><span class="mpunct">⋅</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.311664em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">n</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">O</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">s</span><span class="mord mathnormal">i</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.07847em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>\n<h4 id="%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B-1">实际案例<a class="anchor" href="#%E5%AE%9E%E9%99%85%E6%A1%88%E4%BE%8B-1">§</a></h4>\n<p>下面通过矩阵来表示一个三层神经网络的计算过程。</p>\n<p><img src="https://file.shenfq.com/Fipyv33DnVPnwP-GY55JevCWbFOk.png" alt="image"></p>\n<p>上图只给出了输入层到隐层的计算过程，感兴趣可以自己手动计算下，隐层到输出层的计算过程。隐层到输出层的权重矩阵如下：</p>\n<p><img src="https://file.shenfq.com/FlAAJfkpy5sVbAfRcFh5SC084ufW.png" alt="image"></p>\n<h3 id="%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD">反向传播<a class="anchor" href="#%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD">§</a></h3>\n<p>进过一轮神经网络计算得到输出值，通常与我们实际想要的值是不一致的，这个时候我们会得到一个误差值（误差值就是训练数据给出的正确答案与实际输出值之间的差值）。但是这个误差是多个节点共同作用的结果，我们到底该用何种方式来更新各个连接的权重呢？这个时候我们就需要通过反向传播的方式，求出各个节点的误差值。</p>\n<p><img src="https://file.shenfq.com/Fs3p0gufO8D59AXgizAwXk4VI3vU.png" alt="image"></p>\n<p>下面我们代入具体值，进行一次计算。</p>\n<p><img src="https://file.shenfq.com/Fn2bljmwTC0IIqdAldaMKpv-WQ5N.png" alt="image"></p>\n<p>上图中可以看到 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">e_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 的误差值主要由 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{1,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 和 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow><annotation encoding="application/x-tex">w_{2,1}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.716668em;vertical-align:-0.286108em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span> 造成，那么其误差应当分散到两个连接上，可以按照两个连接的权重对误差 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub></mrow><annotation encoding="application/x-tex">e_1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 进行分割。</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub><mo>∗</mo><mfrac><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow></mfrac><mo>=</mo><mn>0.8</mn><mo>∗</mo><mfrac><mn>2</mn><mrow><mn>2</mn><mo>+</mo><mn>3</mn></mrow></mfrac><mo>=</mo><mn>0.32</mn></mrow><annotation encoding="application/x-tex">e_1 * \frac{w_{1,1}}{w_{1,1} + w_{2,1}} = 0.8 * \frac{2}{2 + 3} = 0.32\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.61528em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.079668em;vertical-align:-0.972108em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.1075599999999999em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.972108em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">8</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.09077em;vertical-align:-0.7693300000000001em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.32144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">3</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693300000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">3</span><span class="mord">2</span></span></span></span></span></p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>e</mi><mn>1</mn></msub><mo>∗</mo><mfrac><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mrow><msub><mi>w</mi><mrow><mn>1</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub><mo>+</mo><msub><mi>w</mi><mrow><mn>2</mn><mo separator="true">,</mo><mn>1</mn></mrow></msub></mrow></mfrac><mo>=</mo><mn>0.8</mn><mo>∗</mo><mfrac><mn>3</mn><mrow><mn>2</mn><mo>+</mo><mn>3</mn></mrow></mfrac><mo>=</mo><mn>0.48</mn></mrow><annotation encoding="application/x-tex">e_1 * \frac{w_{2,1}}{w_{1,1} + w_{2,1}} = 0.8 * \frac{3}{2 + 3} = 0.48\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.61528em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.079668em;vertical-align:-0.972108em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.1075599999999999em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathnormal" style="margin-right:0.02691em;">w</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.301108em;"><span style="top:-2.5500000000000003em;margin-left:-0.02691em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.972108em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">8</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:2.09077em;vertical-align:-0.7693300000000001em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.32144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">3</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">3</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7693300000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">0</span><span class="mord">.</span><span class="mord">4</span><span class="mord">8</span></span></span></span></span></p>\n<p>同理对误差 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>e</mi><mn>2</mn></msub></mrow><annotation encoding="application/x-tex">e_2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 进行分割，然后把两个连接处的误差值相加，就能得到输出点的前馈节点的误差值。</p>\n<p><img src="https://file.shenfq.com/FrCafEfslODTYVqrV6pFZaMI-TiG.png" alt="image"></p>\n<p>然后在按照之前的方法将这个误差传播到前面的层，直到所有节点都能得到自己的误差值，这种方式被成为反向传播。</p>\n<h4 id="%E4%BD%BF%E7%94%A8%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E8%AF%AF%E5%B7%AE">使用矩阵乘法进行反向传播误差<a class="anchor" href="#%E4%BD%BF%E7%94%A8%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95%E8%BF%9B%E8%A1%8C%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E8%AF%AF%E5%B7%AE">§</a></h4>\n<p>上面如此繁琐的操作，我们也可以通过矩阵的方式进行简化。</p>\n<p><img src="https://file.shenfq.com/FmYWgu8b1lMgQxEqynXOxxllgaYa.png" alt="image"></p>\n<p>这个矩阵中还是有麻烦的分数需要处理，那么我们能不能大胆一点，将分母直接做归一化的处理。这么做我们仅仅只是改变了反馈误差的大小，其误差依旧是按照比例来计算的。</p>\n<p><img src="https://file.shenfq.com/FjD8lHUXF7Ytn9W8YWcnHOUa28-9.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/FmdzXGU-rU3BCo-Mz3eNvKckP-wE.png" alt="image"></p>\n<p>仔细观察会发现，与我们之前计算每层的输出值的矩阵点击很像，只是权重矩阵进行翻转，右上方的元素变成了左下方的元素，我们可以称其为转置矩阵，记为 $ w^T $。</p>\n<p>反向传播误差的矩阵可以简单表示为：</p>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>e</mi><mi>r</mi><mi>r</mi><mi>o</mi><msub><mi>r</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi></mrow></msub><mo>=</mo><msubsup><mi>W</mi><mrow><mi>h</mi><mi>i</mi><mi>d</mi><mi>d</mi><mi>e</mi><mi>n</mi><mi mathvariant="normal">_</mi><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow><mi>T</mi></msubsup><mo separator="true">⋅</mo><mi>e</mi><mi>r</mi><mi>r</mi><mi>o</mi><msub><mi>r</mi><mrow><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi></mrow></msub></mrow><annotation encoding="application/x-tex">error_{hidden} = W^{T}_{hidden\_output} · error_{output}\n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.58056em;vertical-align:-0.15em;"></span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">o</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.33610799999999996em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.355331em;vertical-align:-0.46399999999999997em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">W</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.891331em;"><span style="top:-2.4530000000000003em;margin-left:-0.13889em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">h</span><span class="mord mathnormal mtight">i</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">d</span><span class="mord mathnormal mtight">e</span><span class="mord mathnormal mtight">n</span><span class="mord mtight" style="margin-right:0.02778em;">_</span><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span><span style="top:-3.1130000000000004em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.13889em;">T</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.46399999999999997em;"><span></span></span></span></span></span></span><span class="mpunct">⋅</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">o</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.28055599999999997em;"><span style="top:-2.5500000000000003em;margin-left:-0.02778em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">o</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span><span class="mord mathnormal mtight">p</span><span class="mord mathnormal mtight">u</span><span class="mord mathnormal mtight">t</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.286108em;"><span></span></span></span></span></span></span></span></span></span></span></p>\n<h3 id="%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D">梯度下降<a class="anchor" href="#%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D">§</a></h3>\n<p>在每个点都得到误差后，我们该按照何种方式来更新权重呢？</p>\n<p>这个时候就要使用到机器学习中常用的方式：梯度下级。</p>\n<p><img src="https://file.shenfq.com/FsrJBt8QxtpMcJ2qpJeeTAR0sYTW.png" alt="image"></p>\n<p>更多细节可以参考我之前写的博客：<a href="https://blog.shenfq.com/2019/01/28/2019/%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D%E4%B8%8E%E7%BA%BF%E6%80%A7%E5%9B%9E%E5%BD%92/">梯度下降与线性回归</a></p>\n<p>通过不停的训练，我们就能改进神经网络，其本质就是不断地改变权重的大小，减小神经网络输出的误差值。\n最后就能够得到一个多层神经网络的模型，通过输入进行有效的预测。</p>\n<h2 id="%E5%AE%9E%E6%88%98">实战<a class="anchor" href="#%E5%AE%9E%E6%88%98">§</a></h2>\n<h3 id="%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87">环境准备<a class="anchor" href="#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87">§</a></h3>\n<p>首先需要安装 python3 ，直接去 python 官网安装，尽量安装最新版，不推荐安装 python2 。安装好 python 环境之后，然后安装 virtualenv 以及相关依赖。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 升级 pip 到最新版本</span>\npip3 <span class="token function">install</span> --upgrade pip\n\n<span class="token comment"># 安装 virtualenv ，用于配置虚拟环境</span>\npip3 <span class="token function">install</span> --user --upgrade virtualenv\n</code></pre>\n<p>正常情况下，当我们在使用 pip 进行包安装的时候，都是安装的全局包，相当于<code>npm install -g</code>。假如现在有两个项目，项目 A 依赖 simplejson@2 ，项目 B 依赖 simplejson@3，这样我们在一台机器上开发显得有些手足无措。这个时候 virtualenv 就能大展身手了，virtualenv 可以创建一个独立的 python 运行环境，也就是一个沙箱，你甚至可以在 virtualenv 创建的虚拟环境中使用与当前系统不同的 python 版本。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 配置虚拟环境</span>\n<span class="token builtin class-name">cd</span> ~/ml\nvirtualenv <span class="token function">env</span>\n\n<span class="token comment"># 启动虚拟环境</span>\n<span class="token comment"># linux</span>\n<span class="token builtin class-name">source</span> env/bin/activate\n<span class="token comment"># windows</span>\n./env/Scripts/activate\n\n</code></pre>\n<p>启动后，如下</p>\n<pre class="language-bash"><code class="language-bash"><span class="token punctuation">(</span>env<span class="token punctuation">)</span> λ \n</code></pre>\n<p><img src="https://file.shenfq.com/Fn5PT4ZTWJRwwnOIMTRAP6AZV07z.png" alt="image"></p>\n<p>在虚拟环境下安装所有模块依赖。</p>\n<pre class="language-bash"><code class="language-bash"><span class="token comment"># 安装模块和依赖</span>\n<span class="token punctuation">(</span>env<span class="token punctuation">)</span> λ pip3 <span class="token function">install</span> --upgrade jupyter matplotlib numpy scipy\n</code></pre>\n<ul>\n<li>\n<p>jupyter：基于网页的用于交互计算的应用程序。其可被应用于全过程计算：开发、文档编写、运行代码和展示结果。</p>\n</li>\n<li>\n<p>numpy：数组计算扩展的包，支持高维度数组与矩阵运算，此外也针对数组运算提供大量的数学函数库。</p>\n</li>\n<li>\n<p>scipy：基于numpy的扩展包，它增加的功能包括数值积分、最优化、统计和一些专用函数。</p>\n</li>\n<li>\n<p>matplotlib：基于numpy的扩展包，提供了丰富的数据绘图工具，主要用于绘制一些统计图形。</p>\n</li>\n<li>\n<p>scikit-learn：开源的Python机器学习库，它基于Numpy和Scipy，提供了大量用于数据挖掘和分析的工具，包括数据预处理、交叉验证、算法与可视化算法等一系列接口。</p>\n</li>\n</ul>\n<h4 id="%E5%90%AF%E5%8A%A8-jupyter">启动 jupyter<a class="anchor" href="#%E5%90%AF%E5%8A%A8-jupyter">§</a></h4>\n<pre class="language-autoit"><code class="language-autoit">jupyter notebook\n</code></pre>\n<p>jupyter 会在8888端口起一个服务，并自动打开浏览器。</p>\n<p><img src="https://file.shenfq.com/FoIVlLx4Rsh81RLyGmgZ5r0lyuZe.png" alt="image"></p>\n<p>通过右上角的new，你就能创建一个项目了。创建项目后，我们很方便的在该页面上进行 python 代码的运行与输出。</p>\n<p><img src="https://file.shenfq.com/FmSvJC2Uv_plGVynXbzcWsNfeyEV.gif" alt="image"></p>\n<h4 id="%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE">准备数据<a class="anchor" href="#%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE">§</a></h4>\n<p>MNIST 是由美国的高中生和美国人口调查局的职员手写数字（0 ~ 9）图片。接下来要做的事情就是让我们的程序学习这些图片的信息，能够识别出输入的图片所代表的数字含义，这听上去好像有点难度，不着急，我们一步步来。</p>\n<p>这里准备了 MNIST 的训练数据，其中 <code>train_100</code> 为训练数据集，<code>test_10</code> 为测试数据集。在机器学习的过程中，我们一般会将数据集切分成两个，分别为训练集合测试集，一般 80% 的数据进行训练，保留 20% 用于测试。这里因为是 hello world 操作，我们只用 100 个数据进行训练，真实情况下，这种数据量是远远不够的。</p>\n<ul>\n<li><a href="https://raw.githubusercontent.com/makeyourownneuralnetwork/makeyourownneuralnetwork/master/mnist_dataset/mnist_train_100.csv">mnist_train_100.csv</a></li>\n<li><a href="https://raw.githubusercontent.com/makeyourownneuralnetwork/makeyourownneuralnetwork/master/mnist_dataset/mnist_test_10.csv">mnist_test_10.csv</a></li>\n</ul>\n<p>如果想用完整的数据进行训练，可以下载这个 csv 文件。</p>\n<p><a href="https://pjreddie.com/media/files/mnist_train.csv">https://pjreddie.com/media/files/mnist_train.csv</a></p>\n<h4 id="%E8%A7%82%E5%AF%9F%E6%95%B0%E6%8D%AE">观察数据<a class="anchor" href="#%E8%A7%82%E5%AF%9F%E6%95%B0%E6%8D%AE">§</a></h4>\n<p>下载数据后，将 csv （逗号分隔值文件格式）文件放入到 datasets 文件夹，然后使用 python 进行文件的读取。</p>\n<pre class="language-python"><code class="language-python">data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_train_100.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ndata_list <span class="token operator">=</span> data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># readlines方法用于读取文件的所有行，并返回一个数组</span>\ndata_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token builtin">len</span><span class="token punctuation">(</span>data_list<span class="token punctuation">)</span> <span class="token comment"># 数组长度为100</span>\n</code></pre>\n<p>打印第一行文本，看看数据的格式是怎么样的</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">print</span><span class="token punctuation">(</span>data_list<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token builtin">len</span><span class="token punctuation">(</span>data_list<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment"># 使用 , 进行分割，将字符串转换为数组</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FpwLohSBEtk8nhG2dyGeE91jZwHe.png" alt="image"></p>\n<p>可以看到一行数据一共有 785 个数据，第一列表示这个手写数的真实值（这个值在机器学习中称为标签），后面的 784 个数据表示一个 28 * 28 的尺寸的像素值，流行的图像处理软件通常用8位表示一个像素，这样总共有256个灰度等级(像素值在0~255 间)，每个等级代表不同的亮度。</p>\n<p>下面我们导入 numpy 库，对数据进行处理，values[1:] 取出数组的第一位到最后并生成一个新的数组，使用 numpy.asfarray 将数组转为一个浮点类型的 ndarray，然后每一项除以 255 在乘以 9，将每个数字转为 0 ~ 9 的个位数，使用 astype(int) 把每个数再转为 int 类型，最后 reshape((28,28) 可以把数组转为 28 * 28 的二维数组。</p>\n<p>如果想了解更多 numpy 的资料，可以查看它的<a href="https://www.numpy.org.cn/index.html">文档</a>。</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">import</span> numpy <span class="token keyword">as</span> np\n\nvalues <span class="token operator">=</span> data_list<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\nimage_array <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255</span> <span class="token operator">*</span> <span class="token number">9</span><span class="token punctuation">)</span><span class="token punctuation">.</span>astype<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">.</span>reshape<span class="token punctuation">(</span><span class="token number">28</span><span class="token punctuation">,</span><span class="token number">28</span><span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FrwDGzwLUk0yEgKOvPPRCykAOJWg.png" alt="image"></p>\n<p>这样看不够直观，接下来使用 matplotlib ，将像素点一个个画出来。</p>\n<pre class="language-python"><code class="language-python"><span class="token keyword">import</span> matplotlib<span class="token punctuation">.</span>pyplot\n<span class="token operator">%</span>matplotlib inline\n\nmatplotlib<span class="token punctuation">.</span>pyplot<span class="token punctuation">.</span>imshow<span class="token punctuation">(</span>\n    np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span>reshape<span class="token punctuation">(</span><span class="token number">28</span><span class="token punctuation">,</span><span class="token number">28</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n    cmap<span class="token operator">=</span><span class="token string">\'Greys\'</span><span class="token punctuation">,</span> \n    interpolation<span class="token operator">=</span><span class="token string">\'None\'</span>\n<span class="token punctuation">)</span>\n</code></pre>\n<p><img src="https://file.shenfq.com/FjeF-u3KhHB0ii7ryTNiR1Aji28v.png" alt="image"></p>\n<h3 id="%E6%90%AD%E5%BB%BA%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">搭建神经网络<a class="anchor" href="#%E6%90%AD%E5%BB%BA%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h3>\n<p>我们简单勾勒出神经网络的大概样子，至少需要三个函数：</p>\n<ol>\n<li>初始化函数——设定输入层、隐藏层、输出层节点的数量，随机生成的权重。</li>\n<li>训练——学习给定的训练样本，调整权重。</li>\n<li>查询——给定输入，获取预测结果。</li>\n</ol>\n<p>框架代码如下：</p>\n<pre class="language-python"><code class="language-python"><span class="token comment"># 引入依赖库</span>\n<span class="token keyword">import</span> numpy <span class="token keyword">as</span> np\n<span class="token keyword">import</span> scipy<span class="token punctuation">.</span>special\n<span class="token keyword">import</span> matplotlib<span class="token punctuation">.</span>pyplot\n\n<span class="token comment"># 神经网络类定义</span>\n<span class="token keyword">class</span> <span class="token class-name">neuralNetwork</span><span class="token punctuation">:</span>\n    <span class="token comment"># 初始化神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n\n    <span class="token comment"># 训练神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">train</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n   \n    <span class="token comment"># 查询神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">query</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token keyword">pass</span>\n</code></pre>\n<h4 id="%E5%88%9D%E5%A7%8B%E5%8C%96%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">初始化神经网络<a class="anchor" href="#%E5%88%9D%E5%A7%8B%E5%8C%96%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<p>接下来让我们进行第一步操作，初始化一个神经网络。</p>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 初始化神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">__init__</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputnodes<span class="token punctuation">,</span> hiddennodes<span class="token punctuation">,</span> outputnodes<span class="token punctuation">,</span> learningrate<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 设置输入层、隐藏层、输出层节点的数量</span>\n        self<span class="token punctuation">.</span>inodes <span class="token operator">=</span> inputnodes\n        self<span class="token punctuation">.</span>hnodes <span class="token operator">=</span> hiddennodes\n        self<span class="token punctuation">.</span>onodes <span class="token operator">=</span> outputnodes\n        \n        <span class="token comment"># 连接权重，随机生成输入层到隐藏层和隐藏层到输出层的权重</span>\n        self<span class="token punctuation">.</span>wih <span class="token operator">=</span> np<span class="token punctuation">.</span>random<span class="token punctuation">.</span>rand<span class="token punctuation">(</span>self<span class="token punctuation">.</span>hnodes<span class="token punctuation">,</span> self<span class="token punctuation">.</span>inodes<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">0.5</span>\n        self<span class="token punctuation">.</span>who <span class="token operator">=</span> np<span class="token punctuation">.</span>random<span class="token punctuation">.</span>rand<span class="token punctuation">(</span>self<span class="token punctuation">.</span>onodes<span class="token punctuation">,</span> self<span class="token punctuation">.</span>hnodes<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">0.5</span>\n\n        <span class="token comment"># 学习率</span>\n        self<span class="token punctuation">.</span>lr <span class="token operator">=</span> learningrate\n        \n        <span class="token comment"># 将激活函数设置为 sigmoid 函数</span>\n        self<span class="token punctuation">.</span>activation_function <span class="token operator">=</span> <span class="token keyword">lambda</span> x<span class="token punctuation">:</span> scipy<span class="token punctuation">.</span>special<span class="token punctuation">.</span>expit<span class="token punctuation">(</span>x<span class="token punctuation">)</span>\n        \n        <span class="token keyword">pass</span>\n</code></pre>\n<p><strong>生成权重</strong></p>\n<p>生成连接权重使用 <code>numpy</code> 函数库，该库支持大维度数组以及矩阵的运算，通过<code>numpy.random.rand(x, y)</code>可以快速生成一个 <code>x * y</code> 的矩阵，每个数字都是一个 0 ~ 1 的随机数。因为导入库的时候使用了 <code>import numpy as np</code> 命令，所有代码中可以用 <code>np</code> 来代替 <code>numpy</code>。</p>\n<p><img src="https://file.shenfq.com/FjWSNNZ758iVgqaGunY3LNYu60Iv.png" alt="image"></p>\n<p>上面就是通过 <code>numpy.random.rand</code> 方法生成一个 <code>3 * 3</code> 矩阵的案例。减去0.5是为了保证生成的权重所有权重都能维持在 -0.5 ~ 0.5 之间的一个随机值。</p>\n<p><img src="https://file.shenfq.com/FuGnOobiInRSl4F9PXOP_Odn-YPj.png" alt="image"></p>\n<p><strong>激活函数</strong></p>\n<p><code>scipy.special</code> 模块中包含了大量的函数库，利用 <code>scipy.special</code> 库可以很方便快捷的构造出一个激活函数：</p>\n<pre class="language-python"><code class="language-python">activation_function <span class="token operator">=</span> <span class="token keyword">lambda</span> x<span class="token punctuation">:</span> scipy<span class="token punctuation">.</span>special<span class="token punctuation">.</span>expit<span class="token punctuation">(</span>x<span class="token punctuation">)</span>\n</code></pre>\n<h4 id="%E6%9F%A5%E8%AF%A2%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">查询神经网络<a class="anchor" href="#%E6%9F%A5%E8%AF%A2%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 查询神经网络    </span>\n    <span class="token keyword">def</span> <span class="token function">query</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputs_list<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 将输入的数组转化为一个二维数组</span>\n        inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>inputs_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        \n        <span class="token comment"># 计算输入数据与权重的点积</span>\n        hidden_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>wih<span class="token punctuation">,</span> inputs<span class="token punctuation">)</span>\n        <span class="token comment"># 经过激活函数的到隐藏层数据</span>\n        hidden_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>hidden_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 计算隐藏层数据与权重的点积</span>\n        final_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">,</span> hidden_outputs<span class="token punctuation">)</span>\n        <span class="token comment"># 最终到达输出层的数据</span>\n        final_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>final_inputs<span class="token punctuation">)</span>\n        \n        <span class="token keyword">return</span> final_outputs\n</code></pre>\n<p>查询神经网络的操作很简单，只需要使用 <code>numpy</code> 的 <code>dot</code> 方法对两个矩阵求点积即可。</p>\n<p>这里有一个知识点，就是关于 <code>numpy</code> 的数据类型，通过 <code>numpy.array</code> 方法能够将 python 中的数组转为一个 N 维数组对象 <code>Ndarray</code>，该方法第二个参数就是表示转化后的维度。</p>\n<p><img src="https://file.shenfq.com/FnfUXxYR0zUQaBWUxp8RNZXxBpbr.png" alt="image"></p>\n<p>上图是一个普通数组 <code>[1, 2, 3]</code> 使用该方法转变成二维数组，返回 <code>[[1, 2, 3]]</code>。该方法还有个属性 T，本质是调用 <code>numpy</code> 的 <code>transpose</code> 方法，对数组进行轴对换，如下图所示。</p>\n<p><img src="https://file.shenfq.com/FvmwZV-hOpFrG2uVrO3G-_nVgRCc.png" alt="image"></p>\n<p>通过转置我们就能得到一个合适的输入矩阵了。</p>\n<p><img src="https://file.shenfq.com/Fr4gSENAXsb-vwRuOkIc4OoIKT71.png" alt="image"></p>\n<p><img src="https://file.shenfq.com/Fjz5HdsAs_XNskbCwoyB8Q0-4laj.png" alt="image"></p>\n<h4 id="%E8%AE%AD%E7%BB%83%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">训练神经网络<a class="anchor" href="#%E8%AE%AD%E7%BB%83%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C">§</a></h4>\n<pre class="language-python"><code class="language-python">    <span class="token comment"># 训练神经网络</span>\n    <span class="token keyword">def</span> <span class="token function">train</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> inputs_list<span class="token punctuation">,</span> targets_list<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 将输入数据与目标数据转为二维数组</span>\n        inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>inputs_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        targets <span class="token operator">=</span> np<span class="token punctuation">.</span>array<span class="token punctuation">(</span>targets_list<span class="token punctuation">,</span> ndmin<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">.</span>T\n        \n        <span class="token comment"># 通过矩阵点积和激活函数得到隐藏层的输出</span>\n        hidden_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>wih<span class="token punctuation">,</span> inputs<span class="token punctuation">)</span>\n        hidden_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>hidden_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 通过矩阵点积和激活函数得到最终输出</span>\n        final_inputs <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">,</span> hidden_outputs<span class="token punctuation">)</span>\n        final_outputs <span class="token operator">=</span> self<span class="token punctuation">.</span>activation_function<span class="token punctuation">(</span>final_inputs<span class="token punctuation">)</span>\n        \n        <span class="token comment"># 获取目标值与实际值的差值</span>\n        output_errors <span class="token operator">=</span> targets <span class="token operator">-</span> final_outputs\n        <span class="token comment"># 反向传播差值</span>\n        hidden_errors <span class="token operator">=</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>self<span class="token punctuation">.</span>who<span class="token punctuation">.</span>T<span class="token punctuation">,</span> output_errors<span class="token punctuation">)</span> \n        \n        <span class="token comment"># 通过梯度下降法更新隐藏层到输出层的权重</span>\n        self<span class="token punctuation">.</span>who <span class="token operator">+=</span> self<span class="token punctuation">.</span>lr <span class="token operator">*</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>\n            <span class="token punctuation">(</span>output_errors <span class="token operator">*</span> final_outputs <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">-</span> final_outputs<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n            np<span class="token punctuation">.</span>transpose<span class="token punctuation">(</span>hidden_outputs<span class="token punctuation">)</span>\n        <span class="token punctuation">)</span>\n        <span class="token comment"># 通过梯度下降法更新输入层到隐藏层的权重</span>\n        self<span class="token punctuation">.</span>wih <span class="token operator">+=</span> self<span class="token punctuation">.</span>lr <span class="token operator">*</span> np<span class="token punctuation">.</span>dot<span class="token punctuation">(</span>\n            <span class="token punctuation">(</span>hidden_errors <span class="token operator">*</span> hidden_outputs <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">-</span> hidden_outputs<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n            np<span class="token punctuation">.</span>transpose<span class="token punctuation">(</span>inputs<span class="token punctuation">)</span>\n        <span class="token punctuation">)</span>\n        \n        <span class="token keyword">pass</span>\n</code></pre>\n<p>训练神经网络前半部分与查询类似，中间会将得到的差值通过求矩阵点积的方式进行反向传播，最后就是使用梯度下级的方法修正权重。其中 <code>self.lr</code> 为梯度下降的学习率，这个值是限制梯度方向的速率，我们需要经常调整这个值来达到模型的最优解。</p>\n<h3 id="%E8%BF%9B%E8%A1%8C%E8%AE%AD%E7%BB%83">进行训练<a class="anchor" href="#%E8%BF%9B%E8%A1%8C%E8%AE%AD%E7%BB%83">§</a></h3>\n<pre class="language-python"><code class="language-python"><span class="token comment"># 设置每一层的节点数量</span>\ninput_nodes <span class="token operator">=</span> <span class="token number">784</span>\nhidden_nodes <span class="token operator">=</span> <span class="token number">100</span>\noutput_nodes <span class="token operator">=</span> <span class="token number">10</span>\n\n<span class="token comment"># 学习率</span>\nlearning_rate <span class="token operator">=</span> <span class="token number">0.1</span>\n\n<span class="token comment"># 创建神经网络模型</span>\nn <span class="token operator">=</span> neuralNetwork<span class="token punctuation">(</span>input_nodes<span class="token punctuation">,</span>hidden_nodes<span class="token punctuation">,</span>output_nodes<span class="token punctuation">,</span> learning_rate<span class="token punctuation">)</span>\n\n<span class="token comment"># 加载训练数据</span>\ntraining_data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_train_100.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ntraining_data_list <span class="token operator">=</span> training_data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span>\ntraining_data_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment"># 训练神经网络</span>\n<span class="token comment"># epochs 表示训练次数</span>\nepochs <span class="token operator">=</span> <span class="token number">10</span>\n<span class="token keyword">for</span> e <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span>epochs<span class="token punctuation">)</span><span class="token punctuation">:</span>\n    <span class="token comment"># 遍历所有数据进行训练</span>\n    <span class="token keyword">for</span> record <span class="token keyword">in</span> training_data_list<span class="token punctuation">:</span>\n        <span class="token comment"># 数据通过 \',\' 分割，变成一个数组</span>\n        all_values <span class="token operator">=</span> record<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\n        <span class="token comment"># 分离出图片的像素点到一个单独数组</span>\n        inputs <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255.0</span> <span class="token operator">*</span> <span class="token number">0.99</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n        <span class="token comment"># 创建目标输出值（数字 0~9 出现的概率，默认全部为 0.01）</span>\n        targets <span class="token operator">=</span> np<span class="token punctuation">.</span>zeros<span class="token punctuation">(</span>output_nodes<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n        <span class="token comment"># all_values[0] 表示手写数字的真实值，将该数字的概率设为 0.99</span>\n        targets<span class="token punctuation">[</span><span class="token builtin">int</span><span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0.99</span>\n        n<span class="token punctuation">.</span>train<span class="token punctuation">(</span>inputs<span class="token punctuation">,</span> targets<span class="token punctuation">)</span>\n        <span class="token keyword">pass</span>\n    <span class="token keyword">pass</span>\n\n<span class="token comment"># 训练完毕</span>\n<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">\'done\'</span><span class="token punctuation">)</span>\n\n</code></pre>\n<h3 id="%E9%AA%8C%E8%AF%81%E8%AE%AD%E7%BB%83%E7%BB%93%E6%9E%9C">验证训练结果<a class="anchor" href="#%E9%AA%8C%E8%AF%81%E8%AE%AD%E7%BB%83%E7%BB%93%E6%9E%9C">§</a></h3>\n<pre class="language-python"><code class="language-python">\n<span class="token comment"># 加载测试数据</span>\ntest_data_file <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"datasets/mnist_test_10.csv"</span><span class="token punctuation">,</span> <span class="token string">\'r\'</span><span class="token punctuation">)</span>\ntest_data_list <span class="token operator">=</span> test_data_file<span class="token punctuation">.</span>readlines<span class="token punctuation">(</span><span class="token punctuation">)</span>\ntest_data_file<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token comment"># 测试神经网络</span>\n<span class="token comment"># 记录所有的训练值，正确存 1 ，错误存 0 。</span>\nscorecard <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n\n<span class="token comment"># 遍历所有数据进行测试</span>\n<span class="token keyword">for</span> record <span class="token keyword">in</span> test_data_list<span class="token punctuation">:</span>\n    <span class="token comment"># 数据通过 \',\' 分割，变成一个数组</span>\n    all_values <span class="token operator">=</span> record<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">\',\'</span><span class="token punctuation">)</span>\n    <span class="token comment"># 第一个数字为正确答案</span>\n    correct_label <span class="token operator">=</span> <span class="token builtin">int</span><span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n    <span class="token comment"># 取出测试的输入数据</span>\n    inputs <span class="token operator">=</span> <span class="token punctuation">(</span>np<span class="token punctuation">.</span>asfarray<span class="token punctuation">(</span>all_values<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">255.0</span> <span class="token operator">*</span> <span class="token number">0.99</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">0.01</span>\n    <span class="token comment"># 查询神经网络</span>\n    outputs <span class="token operator">=</span> n<span class="token punctuation">.</span>query<span class="token punctuation">(</span>inputs<span class="token punctuation">)</span>\n    <span class="token comment"># 取出概率最大的数字，表示输出</span>\n    label <span class="token operator">=</span> np<span class="token punctuation">.</span>argmax<span class="token punctuation">(</span>outputs<span class="token punctuation">)</span>\n    <span class="token comment"># 打印出真实值与查询值</span>\n    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">\'act: \'</span><span class="token punctuation">,</span> label<span class="token punctuation">,</span> <span class="token string">\' pre: \'</span><span class="token punctuation">,</span> correct_label<span class="token punctuation">)</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>label <span class="token operator">==</span> correct_label<span class="token punctuation">)</span><span class="token punctuation">:</span>\n        <span class="token comment"># 神经网络查询结果与真实值匹配，记录数组存入 1</span>\n        scorecard<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>\n    <span class="token keyword">else</span><span class="token punctuation">:</span>\n        <span class="token comment"># 神经网络查询结果与真实值不匹配，记录数组存入 0</span>\n        scorecard<span class="token punctuation">.</span>append<span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span>\n        <span class="token keyword">pass</span>\n    \n    <span class="token keyword">pass</span>\n    \n<span class="token comment"># 计算训练的成功率</span>\nscorecard_array <span class="token operator">=</span> np<span class="token punctuation">.</span>asarray<span class="token punctuation">(</span>scorecard<span class="token punctuation">)</span>\n<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"performance = "</span><span class="token punctuation">,</span> scorecard_array<span class="token punctuation">.</span><span class="token builtin">sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> scorecard_array<span class="token punctuation">.</span>size<span class="token punctuation">)</span>\n</code></pre>\n<h3 id="%E5%AE%8C%E6%95%B4%E4%BB%A3%E7%A0%81">完整代码<a class="anchor" href="#%E5%AE%8C%E6%95%B4%E4%BB%A3%E7%A0%81">§</a></h3>\n<p>要查看完整代码可以访问我的 github： <a href="https://github.com/Shenfq/deep_neural_network/blob/master/NeuralNetWork.ipynb">deep_neural_network</a></p>\n<h2 id="%E6%80%BB%E7%BB%93">总结<a class="anchor" href="#%E6%80%BB%E7%BB%93">§</a></h2>\n<p>到这里整个深度神级网络的模型原理与实践已经全部进行完毕了，虽然有些部分概念讲解并不是那么仔细，但是你还可以通过搜索其他资料了解更多。感谢《Python神经网络编程》这本书，因为它才有了这个博客，如果感兴趣你也可以买来看看，这本书真的用很简单的语言描述了复杂的数学计算。</p>\n<p>人工智能现在确实是一个非常火热的阶段，希望感兴趣的同学们多多尝试，但是也不要一昧的追新，忘记了自己本来的优势。</p>'
        } }),
    'toc': React.createElement("nav", { key: "0", className: "toc" },
        React.createElement("ol", null,
            React.createElement("li", null,
                React.createElement("a", { href: "#%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80" }, "\u7406\u8BBA\u57FA\u7840"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E4%BB%80%E4%B9%88%E6%98%AF%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C" }, "\u4EC0\u4E48\u662F\u795E\u7ECF\u7F51\u7EDC")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%A5%9E%E7%BB%8F%E5%85%83%E5%A6%82%E4%BD%95%E8%BE%93%E5%85%A5%E8%BE%93%E5%87%BA" }, "\u795E\u7ECF\u5143\u5982\u4F55\u8F93\u5165\u8F93\u51FA"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%9F%A9%E9%98%B5%E4%B9%98%E6%B3%95" }, "\u77E9\u9635\u4E58\u6CD5"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD" }, "\u53CD\u5411\u4F20\u64AD"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%A2%AF%E5%BA%A6%E4%B8%8B%E9%99%8D" }, "\u68AF\u5EA6\u4E0B\u964D")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E5%AE%9E%E6%88%98" }, "\u5B9E\u6218"),
                React.createElement("ol", null,
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87" }, "\u73AF\u5883\u51C6\u5907"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E6%90%AD%E5%BB%BA%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C" }, "\u642D\u5EFA\u795E\u7ECF\u7F51\u7EDC"),
                        React.createElement("ol", null)),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E8%BF%9B%E8%A1%8C%E8%AE%AD%E7%BB%83" }, "\u8FDB\u884C\u8BAD\u7EC3")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E9%AA%8C%E8%AF%81%E8%AE%AD%E7%BB%83%E7%BB%93%E6%9E%9C" }, "\u9A8C\u8BC1\u8BAD\u7EC3\u7ED3\u679C")),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#%E5%AE%8C%E6%95%B4%E4%BB%A3%E7%A0%81" }, "\u5B8C\u6574\u4EE3\u7801")))),
            React.createElement("li", null,
                React.createElement("a", { href: "#%E6%80%BB%E7%BB%93" }, "\u603B\u7ED3")))),
    'author': "shenfq",
    'contributors': [
        "Shenfq"
    ],
    'date': "2019/03/17",
    'updated': null,
    'excerpt': "理论基础 什么是神经网络 我们知道深度学习是机器学习的一个分支，是一种以人工神经网络为架构，对数据进行表征学习的算法。而深度神经网络又是深度学习的一个分支，它在 wikipedia 上的解释如下： 首先我们可以知道，深度神经...",
    'cover': "https://file.shenfq.com/Fjw7fiWg-n1qXji4aX9DUz10Nrqa.png",
    'categories': [
        "机器学习"
    ],
    'tags': [
        "机器学习",
        "深度学习",
        "神经网络"
    ],
    'blog': {
        "isPost": true,
        "posts": [
            {
                "pagePath": "posts/2021/pull-request.md",
                "title": "你给开源框架提过 PR 吗？",
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
                "excerpt": "你有给开源的库或者框架提过 PR 吗？ 如果没有，那么今天的文章会教你怎么给开源库提 PR。 为什么要给开源框架提 PR？ 这件事还得从好几年前（2019年）说起，那时候在折腾一个虚拟 DOM 的玩具（参考之前的文章：🔗虚拟DOM到底...",
                "cover": "https://file.shenfq.com/pic/20210803211333"
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
                "count": 27
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
                "name": "感悟",
                "count": 7
            },
            {
                "name": "总结",
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
                "name": "GitHub",
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
                "name": "Pull Request",
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
