---
title: Gulp入门指南
author: shenfq
date: 2017/05/24
categories:
- 前端工程
tags:
- gulp
- 前端构建工具
- 前端
---

## 为什么要写这篇博客？ 

谈起为什么，其实就是想总结下这段时间做的工作。之前一直在用gulp，但是一直没有自己的思考，下了两个插件就开始了。这一次为公司的项目配置了一次gulp，尽可能多的考虑到了一些情况，比如本地开发调试时生成map映射，上线时清除到已生成的map映射。   

> 在构建这个项目时，参考到了[这篇文章](https://github.com/nimojs/gulp-book/blob/master/chapter7.md)

## 一、准备工作     

1. 安装[node](https://nodejs.org/en/)；
2. 使用npm安装[gulp](http://www.gulpjs.com.cn/docs/) ；   
    
    ```bash
    npm install --global gulp   //全局安装gulp
    npm install --save-dev gulp  //在项目目录下安装gulp，作为项目的开发依赖

    gulp -v  //使用该命令查看gulp是否安装成功
    ```

3. 项目目录下创建gulpfile.js。


## 二、为什么要使用gulp

首先gulp可以解放双手，以前需要频繁Ctrl+C、Ctrl+V的操作，现在只需要在命令行输入一个命令就可以搞定。只要我们配置好gulpfile.js文件后，一个命令就能将当前项目下所有的js与css进行压缩，并且实时监听修改的文件进行操作。这还得感谢node，让js具有了文件读写的能力，之前只能在浏览器运行的脚本，现在可以在本地跑起来，前端人员也能开心的写服务器了。


## 三、一步步抽象自己的gulp任务

### 代码压缩任务

先编写一个简单的压缩js的任务，并生成对应的map映射，方便在浏览器中调试。

```js
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task('uglifyjs', function() {
    return gulp.src('./resource/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: true, //默认不混淆变量名
            compress: false
        }))
        .pipe(sourcemaps.write('/map/js'))
        .pipe(gulp.dest('./publice/js'));
});
```

### 使用管道流监听 error

上面是我们使用gulp最平常不过的使用方法，但是这样做会有个缺点，那就是在压缩多个js过程中，一旦有一个js写错，就会终止任务，并且不知道出错的地方在哪里。
在gulp中文网上发现了这样一片文章[整合 streams 来处理错误](http://www.gulpjs.com.cn/docs/recipes/combining-streams-to-handle-errors/)。gulp每一次pipe都会创建新的管道流，使用 stream-combiner2 可以将一系列的stream合并成一个，然后只用监听这一个stream抛出的错误就可以了。

只要稍微修改下前面的代码，就能愉快的监听gulp过程中产生的error了。

```js
var gulp = require('gulp'),
    combiner = require('stream-combiner2'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task('uglifyjs', function() {
    var batArr = [
        gulp.src('./resource/js/**/*.js'),
        sourcemaps.init(),
        uglify({
            mangle: true, //默认不混淆变量名
            compress: false
        }),
        sourcemaps.write('/map/js'),
        gulp.dest('./publice/js')
    ];
    var combiner = combiner.obj(batArr);
    combined.on('error', console.error.bind(console));
    return combined;
});
```

### 提高watch的效率         

先看看watch最原始的写法：

```javascript
gulp.task('watchjs', function() {
    return gulp.watch('./resource/js/**/*.js', function () {
        var batArr = [
            gulp.src('./resource/js/**/*.js'),
            sourcemaps.init(),
            uglify({
                mangle: true, //默认不混淆变量名
                compress: false
            }),
            sourcemaps.write('/map/js'),
            gulp.dest('./publice/js')
        ];
        var combiner = combiner.obj(batArr);
        combined.on('error', console.error.bind(console));
        return combined;
    });
});
```
上面的这种方式可以达到监听js文件夹下所有的js的目的，并且在js文件发生变化后会自动执行回调函数。关键的问题在于，如果只是修改了一个js文件，这个函数还是会把所有的js都重新压缩一遍，这样的效率就很低了。

其实在watch方法的回调函数中，会传入一个event参数，该参数是一个对象，里面有当前修改的文件路径。有了这个参数，要做的就是把拼接出文件的源路径和输出路径就行，这里使用了一个插件（[gulp-watch-path](https://github.com/nimojs/gulp-watch-path)）。


```js
gulp.task('watchjs', function(event) {
    return gulp.watch('./resource/js/**/*.js', function (event) {
        var paths = watchPath(event, './resource/', './public/');
        var batArr = [
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify({
                mangle: true, //默认不混淆变量名
                compress: false
            }),
            sourcemaps.write('/map/js'),
            gulp.dest(paths.distDir)
        ];
        var combiner = combiner.obj(batArr);
        combined.on('error', console.error.bind(console));
        return combined;
    });
});
```

### 引入gulp-util插件，配置更轻松     

这个插件有很多的作用，相当于是一个gulp的工具类。现在主要介绍在项目中用到的两个方法：env和log。

env方法可以获取到运行gulp命令时，跟在后面的参数。比如：

```bash
gulp --production
```

当运行上面的命令时，我们可以使用env方法获取到。

```js
var gutil = require('gulp-util');
console.log(gutil.env('production'));  //true
```

log方法可以让控制台打印出带颜色的信息（听起来好像没什么卵用），可以更清晰得看到一些错误信息。


```javascript
var colors = gutil.colors;
gutil.log(colors.red('Error!')); //在控制台打印出红色的Error。
```

---

完整的gulpfile.js文件请访问：[GitHub](https://github.com/Shenfq/gulpfile)