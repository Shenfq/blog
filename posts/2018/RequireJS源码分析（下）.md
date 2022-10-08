---
title: RequireJS源码分析（下）
author: shenfq
date: 2018/02/25
categories:
- 前端工程
tags:
- 模块化
- 前端
- 前端工程化
---



这篇文章主要会讲述模块加载操作的主要流程，以及Module的主要功能。废话不多说，直接看代码吧。


模块加载使用方法：

```javascript

require.config({
    paths: {
        jquery: 'https://cdn.bootcss.com/jquery/3.2.1/jquery'
    }
});

require(['jquery'], function ($) {
    $(function () {
        console.log('jQuery load!!!');
    });
});

```

<!-- more -->


我们直接对上面的代码进行分析，假设我们调用了require方法，需要对jquery依赖加载，require对依赖的加载，都是通过Module对象中的check方法来完成的。
在上篇中，我们已经知道require方法只是进行了参数的修正，最后调用的方法是通过context.makeRequire方法进行构造的。
这个方法中最核心的代码在nextTick中，nextTick上篇中也分析过，nextTick方法其实是一个定时器。

```javascript
intakeDefines();

//通过setTimeout的方式加载依赖，放入下一个队列，保证加载顺序
context.nextTick(function () {
	//优先加载denfine的模块
	intakeDefines();

	requireMod = getModule(makeModuleMap(null, relMap));

	requireMod.skipMap = options.skipMap; //配置项，是否需要跳过map配置

	requireMod.init(deps, callback, errback, {
		enabled: true
	});

	checkLoaded();
});	

```

我们一步一步分析这几句代码：

1. requireMod = getModule(makeModuleMap(null, relMap))，这里得到的实际上就是Module的实例。
    
2. requireMod.init(deps, callback, errback, { enabled: true })，这个就是重点操作了，进行依赖项的加载。


先看getModle、makeModlueMap这两个方法是如何创建Module实例的。

```javascript

function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
    //变量的声明
	var url, pluginModule, suffix, nameParts,
		prefix = null,
		parentName = parentModuleMap ? parentModuleMap.name : null,
		originalName = name,
		isDefine = true, //是否是define的模块
		normalizedName = '';

	//如果没有模块名，表示是require调用，使用一个内部名
	if (!name) {
		isDefine = false;
		name = '_@r' + (requireCounter += 1);
	}

	nameParts = splitPrefix(name);
	prefix = nameParts[0];
	name = nameParts[1];

	if (prefix) { //如果有插件前缀
		prefix = normalize(prefix, parentName, applyMap);
		pluginModule = getOwn(defined, prefix); //获取插件
	}

	//Account for relative paths if there is a base name.
	if (name) {
		if (prefix) { //如果存在前缀
			if (isNormalized) {
				normalizedName = name;
			} else if (pluginModule && pluginModule.normalize) {
				//Plugin is loaded, use its normalize method.
				normalizedName = pluginModule.normalize(name, function (name) {
					return normalize(name, parentName, applyMap); //相对路径转为绝对路径
				});
			} else {
				normalizedName = name.indexOf('!') === -1 ?
					normalize(name, parentName, applyMap) :
					name;
			}
		} else {
			//一个常规模块，进行名称的标准化.
			normalizedName = normalize(name, parentName, applyMap);
			
			nameParts = splitPrefix(normalizedName); //提取插件
			prefix = nameParts[0];
			normalizedName = nameParts[1];
			isNormalized = true;

			url = context.nameToUrl(normalizedName); //将模块名转化成js的路径
		}
	}

	suffix = prefix && !pluginModule && !isNormalized ?
		'_unnormalized' + (unnormalizedCounter += 1) :
		'';

	return {
		prefix: prefix,
		name: normalizedName,
		parentMap: parentModuleMap,
		unnormalized: !!suffix,
		url: url,
		originalName: originalName,
		isDefine: isDefine,
		id: (prefix ?
			prefix + '!' + normalizedName :
			normalizedName) + suffix
	};
}

//执行该方法后，得到一个对象：
{
   id: "_@r2", //模块id，如果是require操作，得到一个内部构造的模块名
   isDefine: false,
   name: "_@r2", //模块名
   originalName: null,
   parentMap: undefined,
   prefix: undefined, //插件前缀
   unnormalized: false,
   url: "./js/_@r2.js" , //模块路径
}

```

这里的前缀其实是requirejs提供的插件机制，requirejs能够使用插件，对加载的模块进行一些转换。比如加载html文件或者json文件时，可以直接转换为文本或者json对象，具体使用方法如下：

```javascript
require(["text!test.html"],function(html){
    console.log(html);
});

require(["json!package.json"],function(json){
    console.log(json);
});

//或者进行domReady
require(['domReady!'], function (doc) {
    //This function is called once the DOM is ready,
    //notice the value for 'domReady!' is the current
    //document.
});
```

经过makeModuleMap方法得到了一个模块映射对象，然后这个对象会被传入getModule方法，这个方法会实例化一个Module。

```javascript
function getModule(depMap) {
	var id = depMap.id,
		mod = getOwn(registry, id);

	if (!mod) { //对未注册模块，添加到模块注册器中
		mod = registry[id] = new context.Module(depMap);
	}

	return mod;
}

//模块加载器
Module = function (map) {
	this.events = getOwn(undefEvents, map.id) || {};
	this.map = map;
	this.shim = getOwn(config.shim, map.id);
	this.depExports = [];
	this.depMaps = [];
	this.depMatched = [];
	this.pluginMaps = {};
	this.depCount = 0;
	
	/* this.exports this.factory
	   this.depMaps = [],
	   this.enabled, this.fetched
	*/
};

Module.prototype = {
    //some methods
}

context = {
    //some prop
    Module: Module
};

```


得到了Module实例之后，就是我们的重头戏了。
可以说Module是requirejs的核心，通过Module实现了依赖的加载。

```javascript
//首先调用了init方法，传入了四个参数
//分别是：依赖数组，回调函数，错误回调，配置
requireMod.init(deps, callback, errback, { enabled: true });

//我们在看看init方法做了哪些事情
init: function (depMaps, factory, errback, options) { //模块加载时的入口
	options = options || {};
	
	if (this.inited) {
		return;  //如果已经被加载直接return
	}

	this.factory = factory;

    //绑定error事件
	if (errback) {
		this.on('error', errback);
	} else if (this.events.error) {
		errback = bind(this, function (err) {
			this.emit('error', err);
		});
	}

	//将依赖数组拷贝到对象的depMaps属性中
	this.depMaps = depMaps && depMaps.slice(0);

	this.errback = errback;

	//将该模块状态置为已初始化
	this.inited = true;

	this.ignore = options.ignore;
	
	//可以在init中开启此模块为enabled模式，
	//或者在之前标记为enabled模式。然而，
	//在调用init之前不知道依赖关系，所以，
	//之前为enabled，现在触发依赖为enabled模式
	if (options.enabled || this.enabled) {
		//启用这个模块和依赖。
		//enable之后会调用check方法。
		this.enable();
	} else {
		this.check();
	}
}

```


可以注意到，在调用init方法的时候，传入了一个option参数：

```javascript
{
    enabled: true
}
```

这个参数的目的就是标记该模块是否是第一次初始化，并且需要加载依赖。由于enabled属性的设置，init方法会去调用enable方法。enable方法我稍微做了下简化，如下：

```javascript
enable: function () {
	enabledRegistry[this.map.id] = this;
	this.enabled = true;
	this.enabling = true;

	//1、enable每一个依赖， ['jQuery']
	each(this.depMaps, bind(this, function (depMap, i) {
		var id, mod, handler;

        if (typeof depMap === 'string') {
            //2、获得依赖映射
    		depMap = makeModuleMap(depMap,
    			(this.map.isDefine ? this.map : this.map.parentMap),
    			false,
    			!this.skipMap);
    		this.depMaps[i] = depMap; //获取的依赖映射
    
    		this.depCount += 1; //依赖项+1
    		
    		//3、绑定依赖加载完毕的事件
    		//用来通知当前模块该依赖已经加载完毕可以使用
    		on(depMap, 'defined', bind(this, function (depExports) {
				if (this.undefed) {
					return;
				}
				this.defineDep(i, depExports); //加载完毕的依赖模块放入depExports中，通过apply方式传入require定义的函数中
				this.check();
			}));
    	}
		id = depMap.id;
		mod = registry[id]; //将模块映射放入注册器中进行缓存
		
		if (!hasProp(handlers, id) && mod && !mod.enabled) {
		    //4、进行依赖的加载
			context.enable(depMap, this); //加载依赖
		}
	}));

	this.enabling = false;

	this.check();
},

```

简单来说这个方法一共做了三件事：

1. 遍历了所有的依赖项

    `each(this.depMaps, bind(this, function (depMap, i) {}));`

2. 获得所有的依赖映射

    `depMap = makeModuleMap(depMap);`，这个方法前面也介绍过，用于获取依赖模块的模块名、模块路径等等。根据最开始写的代码，我们对jQuery进行了依赖，最后得到的depMap，如下：
    
    ```javascript
    {
        id: "jquery",
        isDefine: true,
        name: "jquery",
        originalName: "jquery",
        parentMap: undefined,
        prefix:undefined,
        unnormalized: false,
        url: "https://cdn.bootcss.com/jquery/3.2.1/jquery.js"
    }
    ```

3. 绑定依赖加载完毕的事件，用来通知当前模块该依赖已经加载完毕可以使用

    ```javascript
    on(depMap, 'defined', bind(this, function (depExports) {});
    ```


4. 最后通过`context.enable`方法进行依赖的加载。

    ```javascript
    context = {
        enable: function (depMap) { 
            //在之前的enable方法中已经把依赖映射放到了registry中
        	var mod = getOwn(registry, depMap.id);
        	if (mod) {
        		getModule(depMap).enable();
        	}
        }
    }
    ```
    
最终调用getModule方法，进行Module对象实例化，然后再次调用enable方法。这里调用的enable方法与之前容易混淆，主要区别是，之前是require模块进行enable，这里是模块的依赖进行enable操作。我们现在再次回到那个简化后的enable方法，由于依赖的加载没有依赖项需要进行遍历，可以直接跳到enable方法最后，调用了check方法，现在我们主要看check方法。

```javascript
enable: function () {
    //将当前模块id方法已经enable的注册器中缓存
	enabledRegistry[this.map.id] = this;
	this.enabled = true;
	this.enabling = true;

	//当前依赖项为空，可以直接跳过
	each(this.depMaps, bind(this, function (depMap, i) {}));

	this.enabling = false;

    //最后调用加载器的check方法
	this.check();
},
check: function () {
	if (!this.enabled || this.enabling) {
		return;
	}
	
	var id = this.map.id;
	//一些其他变量的定义

	if (!this.inited) {
		// 仅仅加载未被添加到defQueueMap中的依赖
		if (!hasProp(context.defQueueMap, id)) {
			this.fetch(); //调用fetch() -> load() -> req.load()
		}
	} else if (this.error) {
		//没有进入这部分逻辑，暂时跳过
	} else if (!this.defining) {
		//没有进入这部分逻辑，暂时跳过
	}
},
```

初看check方法，确实很多，足足有100行，但是不要被吓到，其实依赖加载的时候，只进了第一个if逻辑`if(!this.inited)`。由于依赖加载的时候，是直接调用的加载器的enable方法，并没有进行init操作，所以进入第一个if，立马调用了fetch方法。其实fetch的关键代码就一句：


```javascript
Module.prototype = {
    fetch: function () {
        var map = this.map;
        return map.prefix ? this.callPlugin() : this.load();
    },
    load: function () {
    	var url = this.map.url;
    
    	//Regular dependency.
    	if (!urlFetched[url]) {
    		urlFetched[url] = true;
    		context.load(this.map.id, url);
    	}
    }
}


```

如果有插件就先调用callPlugin方法，如果是依赖模块直接调用load方法。load方法先拿到模块的地址，然后调用了context.load方法。这个方法在上一章已经讲过了，大致就是动态创建了一个script标签，然后把src设置为这个url，最后将script标签insert到head标签中，完成一次模块加载。

```html
<!--最后head标签中会有一个script标签，这就是我们要加载的jQuery-->
<script type="text/javascript" charset="utf-8" async data-requirecontext="_" data-requiremodule="jquery" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>
```

到这一步，还只进行了一半，我们只是加载jquery.js，并没有拿到jquery对象。翻翻jQuery的源码，就能在最后看到jQuery使用了define进行定义。

```javascript
if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}
```

关于define在上一章已经讲过了，最后jQuery模块会push到globalDefQueue数组中。具体怎么从globalDefQueue中获取呢？答案是通过事件。在前面的load方法中，为script标签绑定了一个onload事件，在jquery.js加载完毕之后会触发这个事件。该事件最终调用context.completeLoad方法，这个方法会拿到全局define的模块，然后进行遍历，通过调用callGetModule，来执行define方法中传入的回调函数，得到最终的依赖模块。

```javascript
//为加载jquery.js的script标签绑定load事件
node.addEventListener('load', context.onScriptLoad, false);

function getScriptData(evt) {
	var node = evt.currentTarget || evt.srcElement;
	
	removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
	removeListener(node, context.onScriptError, 'error');

	return {
		node: node,
		id: node && node.getAttribute('data-requiremodule')
	};
}

context = {
    onScriptLoad: function (evt) {
    	if (evt.type === 'load' ||
    		(readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
    		interactiveScript = null;
    		
    		//通过该方法可以获取当前script标签加载的js的模块名
    		//并移除绑定的load与error事件
    		var data = getScriptData(evt);
    		//调用completeLoad方法
    		context.completeLoad(data.id);
    	}
    },
    completeLoad: function (moduleName) {
		var found, args, mod;
		
		//从globalDefQueue拿到define定义的模块，放到当前上下文的defQueue中	
		takeGlobalQueue(); 
		
		while (defQueue.length) {
			args = defQueue.shift();

			callGetModule(args); //运行define方法传入的回调，得到模块对象
		}
		//清空defQueueMap
		context.defQueueMap = {};

		mod = getOwn(registry, moduleName);

		checkLoaded();
	}
};

function callGetModule(args) {
    //args内容就是define方法传入的三个参数，分别是，
    //模块名、依赖数组、返回模块的回调。
    //拿之前jquery中的define方法来举例，到这一步时，args如下：
    //["jquery", [], function() {return $;}]
	if (!hasProp(defined, args[0])) {
	    //跳过已经加载的模块，加载完毕后的代码都会放到defined中缓存，避免重复加载
		getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
	}
}
```

在callGetModule方法中，再次看到了getModule这个方法，这里又让我们回到了起点，又一次构造了一个Module实例，并调用init方法。所以说嘛，Module真的是requirejs的核心。首先这个Module实例会在registry中获取，因为在之前我们已经构造过一次了，并且直接调用了enable方法来进行js的异步加载，然后调用init方法之后的逻辑我也不啰嗦了，init会调用enable，enable又会调用check，现在我们主要来看看check中发生了什么。

```javascript
check: function () {
	if (!this.enabled || this.enabling) {
		return;
	}

	var err, cjsModule,
		id = this.map.id,
		depExports = this.depExports,
		exports = this.exports,
		factory = this.factory;

	if (!this.inited) {
		// 调用fetch方法，异步的进行js的加载
	} else if (this.error) {
	    // 错误处理
		this.emit('error', this.error);
	} else if (!this.defining) {
		this.defining = true;

		if (this.depCount < 1 && !this.defined) { //如果依赖数小于1，表示依赖已经全部加载完毕
			if (isFunction(factory)) { //判断factory是否为函数
				exports = context.execCb(id, factory, depExports, exports);
			} else {
				exports = factory;
			}

			this.exports = exports;

			if (this.map.isDefine && !this.ignore) {
				defined[id] = exports; //加载的模块放入到defined数组中缓存
			}

			//Clean up
			cleanRegistry(id);

			this.defined = true;
		}
		
		this.defining = false;

		if (this.defined && !this.defineEmitted) {
			this.defineEmitted = true;
			this.emit('defined', this.exports); //激活defined事件
			this.defineEmitComplete = true;
		}

	}
}
```

这次调用check方法会直接进入最后一个`else if`中，这段逻辑中首先判断了该模块的依赖是否全部加载完毕（`this.depCount < 1`），我们这里是jquery加载完毕后来获取jquery对象，所以没有依赖项。然后判断了回调是否是一个函数，如果是函数则通过execCb方法执行回调，得到需要暴露的模块（也就是我们的jquery对象）。另外回调也可能不是一个函数，这个与require.config中的shim有关，可以自己了解一下。拿到该模块对象之后，放到defined对象中进行缓存，之后在需要相同的依赖直接获取就可以了（`defined[id] = exports;`）。

到这里的时候，依赖的加载可以说是告一段落了。但是有个问题，依赖加载完毕后，require方法传入的回调还没有被执行。那么依赖加载完毕了，我怎么才能通知之前require定义的回调来执行呢？没错，可以利用观察者模式，这里requirejs中自己定义了一套事件系统。看上面的代码就知道，将模块对象放入defined后并没有结束，之后通过requirejs的事件系统激活了这个依赖模块defined事件。

激活的这个事件，是在最开始，对依赖项进行遍历的时候绑定的。

```javascript
//激活defined事件
this.emit('defined', this.exports);


//遍历所有的依赖，并绑定defined事件
each(this.depMaps, bind(this, function (depMap, i) {
    on(depMap, 'defined', bind(this, function (depExports) {
		if (this.undefed) {
			return;
		}
		this.defineDep(i, depExports); //将获得的依赖对象，放到指定位置
		this.check();
	}));
}

defineDep: function (i, depExports) {
	if (!this.depMatched[i]) {
		this.depMatched[i] = true;
		this.depCount -= 1; 
		//将require对应的deps存放到数组的指定位置
		this.depExports[i] = depExports;
	}
}
```

到这里，我们已经有眉目了。在事件激活之后，调用defineDep方法，先让depCount减1，这就是为什么check方法中需要判断depCount是否小于1的原因（只有小于1才表示所以依赖加载完毕了），然后把每个依赖项加载之后得到的对象，按顺序存放到depExports数组中，而这个depExports就对应require方法传入的回调中的arguments。

最后，事件函数调用check方法，我们已经知道了check方法会使用context.execCb来执行回调。其实这个方法没什么特别，就是调用apply。


```javascript
context.execCb(id, factory, depExports, exports);

execCb: function (name, callback, args, exports) {
	return callback.apply(exports, args);
}
```

到这里，整个一次require的过程已经全部结束了。核心还是Module构造器，不过是require加载依赖，还是define定义依赖，都需要通过Module，而Module中最重要的两个方法enable和check是重中之重。通过require源码的分析，对js的异步，还有早期的模块化方案有了更加深刻的理解。