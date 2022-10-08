(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{436:function(t,s,r){"use strict";r.r(s);var a=r(2),e=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("blockquote",[s("p",[t._v("加分号还是不加分号？tab还是空格？你还在为代码风格与同事争论得面红耳赤吗？")])]),t._v(" "),s("p",[t._v("正文之前，先看个段子放松一下： "),s("a",{attrs:{href:"https://zhuanlan.zhihu.com/p/19700946",target:"_blank",rel:"noopener noreferrer"}},[t._v("去死吧！你这个异教徒！"),s("OutboundLink")],1)]),t._v(" "),s("p",[t._v("想起自己刚入行的时候，从svn上把代码checkout下来，看到同事写的代码，大括号居然换行了。心中暗骂，这个人是不是个**，大括号为什么要换行？年轻气盛的我，居然满腔怒火，将空行一一删掉。\n但是关于代码风格，我们很难区分谁对谁错，不同的人有不同偏好，唯有强制要求才能规避争论。")]),t._v(" "),s("p",[t._v("所以，团队关于代码风格必须遵循两个基本原则：")]),t._v(" "),s("ol",[s("li",[t._v("少数服从多数；")]),t._v(" "),s("li",[t._v("用工具统一风格。")])]),t._v(" "),s("p",[t._v("本文将介绍，如何使用ESLint + Prettier来统一我们的前端代码风格。")]),t._v(" "),s("h2",{attrs:{id:"prettier是什么"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#prettier是什么"}},[t._v("#")]),t._v(" Prettier是什么？")]),t._v(" "),s("p",[t._v('首先，对应ESLint大多都很熟悉，用来进行代码的校验，但是Prettier（直译过来就是"更漂亮的"😂）听得可能就比较少了。js作为一门灵活的弱类型语言，代码风格千奇百怪，一千个人写js就有一千种写法。虽然js没有官方推荐的代码规范，不过社区有些比较热门的代码规范，比如'),s("a",{attrs:{href:"https://standardjs.com/readme-zhcn.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("standardjs"),s("OutboundLink")],1),t._v("、"),s("a",{attrs:{href:"https://github.com/airbnb/javascript",target:"_blank",rel:"noopener noreferrer"}},[t._v("airbnb"),s("OutboundLink")],1),t._v("。使用ESLint配合这些规范，能够检测出代码中的潜在问题，提高代码质量，但是并不能完全统一代码风格，因为这些代码规范的重点并不在代码风格上（虽然有一些限制）。")]),t._v(" "),s("h4",{attrs:{id:"下面开始安利-prettier。"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#下面开始安利-prettier。"}},[t._v("#")]),t._v(" 下面开始安利，Prettier。")]),t._v(" "),s("p",[t._v("Prettier是一个能够完全统一你和同事代码风格的利器，假如你有个c++程序员转行过来写前端的同事，你发现你们代码风格完全不一样，你难道要一行行去修改他的代码吗，就算你真的去改，你的需求怎么办，所以没有人真的愿意在保持代码风格统一上面浪费时间。选择Prettier能够让你节省出时间来写更多的bug（不对，是修更多的bug），并且统一的代码风格能保证代码的可读性。")]),t._v(" "),s("h4",{attrs:{id:"看看prettier干的好事。"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#看看prettier干的好事。"}},[t._v("#")]),t._v(" 看看Prettier干的好事。")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://file.shenfq.com/18-6-18/90739745.jpg",alt:"gif"}}),t._v(" "),s("img",{attrs:{src:"https://file.shenfq.com/18-6-18/93998995.jpg",alt:"gif"}})]),t._v(" "),s("p",[t._v("能支持jsx")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://file.shenfq.com/18-6-18/85648012.jpg",alt:"gif"}})]),t._v(" "),s("p",[t._v("也能支持css")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://file.shenfq.com/18-6-18/55246702.jpg",alt:"gif"}})]),t._v(" "),s("p",[t._v("唯一的遗憾是，暂时还不能格式化vue模版文件中template部分。")]),t._v(" "),s("h2",{attrs:{id:"eslint-与-prettier配合使用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#eslint-与-prettier配合使用"}},[t._v("#")]),t._v(" ESLint 与 Prettier配合使用")]),t._v(" "),s("p",[t._v("首先肯定是需要安装"),s("code",[t._v("prettier")]),t._v("，并且你的项目中已经使用了ESLint，有"),s("code",[t._v("eslintrc.js")]),t._v("配置文件。")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-D")]),t._v(" prettier\n")])])]),s("h4",{attrs:{id:"配合eslint检测代码风格"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#配合eslint检测代码风格"}},[t._v("#")]),t._v(" 配合ESLint检测代码风格")]),t._v(" "),s("p",[t._v("安装插件：")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-D")]),t._v(" eslint-plugin-prettier\n")])])]),s("p",[t._v("eslint-plugin-prettier插件会调用prettier对你的代码风格进行检查，其原理是先使用prettier对你的代码进行格式化，然后与格式化之前的代码进行对比，如果过出现了不一致，这个地方就会被prettier进行标记。")]),t._v(" "),s("p",[t._v("接下来，我们需要在rules中添加，"),s("code",[t._v('"prettier/prettier": "error"')]),t._v("，表示被prettier标记的地方抛出错误信息。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//.eslintrc.js")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"plugins"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"prettier"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"rules"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"prettier/prettier"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"error"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("借助ESLint的autofix功能，在保存代码的时候，自动将抛出error的地方进行fix。因为我们项目是在webpack中引入eslint-loader来启动eslint的，所以我们只要稍微修改webpack的配置，就能在启动webpack-dev-server的时候，每次保存代码同时自动对代码进行格式化。")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" path "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'path'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nmodule"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("module")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("rules")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("test")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token regex"}},[s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")]),s("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[t._v("\\.(js|vue)$")]),s("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[t._v("/")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    \t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("loader")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'eslint-loader'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    \t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("enforce")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'pre'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    \t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("include")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("path"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("join")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("__dirname"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'src'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    \t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n          "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("fix")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n    \t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("如果你的eslint是直接通过cli方式启动的，那么只需要在后面加上fix即可，如："),s("code",[t._v("eslint --fix")]),t._v("。")]),t._v(" "),s("h4",{attrs:{id:"如果与已存在的插件冲突怎么办"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如果与已存在的插件冲突怎么办"}},[t._v("#")]),t._v(" 如果与已存在的插件冲突怎么办")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" i "),s("span",{pre:!0,attrs:{class:"token parameter variable"}},[t._v("-D")]),t._v(" eslint-config-prettier\n")])])]),s("p",[t._v("通过使用eslint-config-prettier配置，能够关闭一些不必要的或者是与prettier冲突的lint选项。这样我们就不会看到一些error同时出现两次。使用的时候需要确保，这个配置在extends的最后一项。")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//.eslintrc.js")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'standard'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//使用standard做代码规范")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"prettier"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("这里有个"),s("a",{attrs:{href:"https://github.com/prettier/eslint-config-prettier#special-rules",target:"_blank",rel:"noopener noreferrer"}},[t._v("文档"),s("OutboundLink")],1),t._v("，列出了会与prettier冲突的配置项。")]),t._v(" "),s("h4",{attrs:{id:"同时使用上面两项配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#同时使用上面两项配置"}},[t._v("#")]),t._v(" 同时使用上面两项配置")]),t._v(" "),s("p",[t._v("如果你同时使用了上述的两种配置，那么你可以通过如下方式，简化你的配置。")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//.eslintrc.js")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"extends"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"plugin:prettier/recommended"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("最后贴一下我们项目中的完整配置，是在vue-cli生成的代码基础上修改的，并且使用standard做代码规范：")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("root")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("parserOptions")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("parser")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'babel-eslint'")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("env")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("browser")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("es6")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// https://github.com/standard/standard/blob/master/docs/RULES-en.md")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'standard'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'plugin:vue/essential'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"plugin:prettier/recommended"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// required to lint *.vue files")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugins")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'vue'")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// add your custom rules here")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("rules")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"prettier/prettier"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"error"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// allow async-await")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v("'generator-star-spacing'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'off'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// allow debugger during development")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v("'no-debugger'")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" process"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("env"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("NODE_ENV")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'production'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'error'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'off'")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),s("h4",{attrs:{id:"什么-你们项目没有启用eslint"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#什么-你们项目没有启用eslint"}},[t._v("#")]),t._v(" 什么？你们项目没有启用ESLint")]),t._v(" "),s("p",[t._v("不要慌，没有ESLint也不要怕，可以通过"),s("a",{attrs:{href:"https://www.npmjs.com/package/onchange",target:"_blank",rel:"noopener noreferrer"}},[t._v("onchange"),s("OutboundLink")],1),t._v("进行代码的监听，然后自动格式化代码。只要在package.json的scripts下添加如下代码，然后使用"),s("code",[t._v("npm run format")]),t._v("，我们就能监听src目录下所有的js文件并进行格式化：")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"scripts"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"format"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("\"onchange 'src/**/*.js' -- prettier --write {{changed}}\"")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("当你想格式化的文件不止js文件时，也可以添加多个文件列表。")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"scripts"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"format"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("\"onchange 'test/**/*.js' 'src/**/*.js' 'src/**/*.vue' -- prettier --write {{changed}}\"")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("当然，你也能够在编辑器中配置对prettier的支持，具体支持哪些编辑器，请戳"),s("a",{attrs:{href:"https://prettier.io/docs/en/editors.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("这里"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"如何对prettier进行配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#如何对prettier进行配置"}},[t._v("#")]),t._v(" 如何对Prettier进行配置")]),t._v(" "),s("p",[t._v("一共有三种方式支持对Prettier进行配置：")]),t._v(" "),s("ol",[s("li",[t._v("根目录创建"),s("code",[t._v(".prettierrc")]),t._v("文件，能够写入YML、JSON的配置格式，并且支持"),s("code",[t._v(".yaml/.yml/.json/.js")]),t._v("后缀；")]),t._v(" "),s("li",[t._v("根目录创建"),s("code",[t._v(".prettier.config.js")]),t._v("文件，并对外export一个对象；")]),t._v(" "),s("li",[t._v("在"),s("code",[t._v("package.json")]),t._v("中新建"),s("code",[t._v("prettier")]),t._v("属性。")])]),t._v(" "),s("p",[t._v("下面我们使用"),s("code",[t._v("prettierrc.js")]),t._v("的方式对prettier进行配置，同时讲解下各个配置的作用。")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"printWidth"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//一行的字符数，如果超过会进行换行，默认为80")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"tabWidth"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//一个tab代表几个空格数，默认为80")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"useTabs"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//是否使用tab进行缩进，默认为false，表示用空格进行缩减")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"singleQuote"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//字符串是否使用单引号，默认为false，使用双引号")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"semi"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//行位是否使用分号，默认为true")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"trailingComma"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"none"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('//是否使用尾逗号，有三个可选值"<none|es5|all>"')]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"bracketSpacing"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//对象大括号直接是否有空格，默认为true，效果：{ foo: bar }")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"parser"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"babylon"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//代码的解析引擎，默认为babylon，与babel相同。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("配置大概列出了这些，还有一些其他配置可以在"),s("a",{attrs:{href:"https://prettier.io/docs/en/options.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),s("OutboundLink")],1),t._v("进行查阅。")]),t._v(" "),s("p",[t._v("注意一点，parser的配置项官网列出了如下可选项：")]),t._v(" "),s("ul",[s("li",[t._v("babylon")]),t._v(" "),s("li",[t._v("flow")]),t._v(" "),s("li",[t._v("typescript Since v1.4.0")]),t._v(" "),s("li",[t._v("postcss Since v1.4.0")]),t._v(" "),s("li",[t._v("json Since v1.5.0")]),t._v(" "),s("li",[t._v("graphql Since v1.5.0")]),t._v(" "),s("li",[t._v("markdown Since v1.8.0")])]),t._v(" "),s("p",[t._v("但是如果你使用了vue的单文件组件形式，记得将"),s("code",[t._v("parser")]),t._v("配置为vue，目前官方文档没有列出来。当然如果你自己写过AST的解析器，也可以用你自己的写的"),s("code",[t._v('parser: require("./my-parser")')]),t._v("。")]),t._v(" "),s("h2",{attrs:{id:"总结"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),s("p",[t._v("有了prettier我们再也不用羡慕隔壁写golang的同事，保存后就能自动format，也不用为了项目代码不统一和同事争论得面红耳赤，因为我们统一使用prettier的风格。可能刚开始有些地方你看不惯，不过不要紧，想想这么做都是为了团队和睦，世界和平，我们做出的牺牲都是必要的。而且prettier的样式风格已经在很多大型开源项目中被采用，比如react、webpack、babel。")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://file.shenfq.com/18-6-18/78377904.jpg",alt:"他们都在用"}})]),t._v(" "),s("p",[t._v("你看，他们都在用了，你还在等什么，想变成异教徒被烧死吗，还不快行动起来。更多精彩内容请看"),s("a",{attrs:{href:"https://prettier.io/",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方链接"),s("OutboundLink")],1)])])}),[],!1,null,null,null);s.default=e.exports}}]);