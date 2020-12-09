---
title: 从零开始实现 VS Code 基金插件
author: shenfq
date: 2020/08/24
categories:
- VSCode
tags:
- VSCode
---

# 从零开始实现 VS Code 基金插件

## 写在前面

随着7月一波牛市行情，越来越多的人投身A股行列，但是股市的风险巨大，有人一夜暴富，也有人血本无归，所以对于普通人来说基金定投是个不错的选择，本人也是基金定投的一枚小韭菜。

![基金定投](https://file.shenfq.com/ipic/2020-08-22-050614.png)

上班的时候经常心理痒痒，想看看今天的基金又赚（ge）了多少钱，拿出手机打开支付宝的步骤过于繁琐，而且我也不太关心其他的指标，只是想知道今天的净值与涨幅。VS Code 做为一个编码工具，提供了强大的插件机制，我们可以好好利用这个能力，可以一边编码的时候一边看看行情。

![示例](https://file.shenfq.com/ipic/2020-08-21-120746.png)

## 实现插件

### 初始化

VSCode 官方提供了非常方便的插件模板，我们可以直接通过 `Yeoman` 来生成 VS Code 插件的模板。

先全局安装 [yo](https://www.npmjs.com/package/yo) 和 [generator-code](https://www.npmjs.com/package/generator-code)，运行命令 `yo code`。

```bash
# 全局安装 yo 模块
npm install -g yo generator-code
```

这里我们使用 TypeScript 来编写插件。

![yo code](https://file.shenfq.com/ipic/2020-08-22-135902.png)

![yo code](https://file.shenfq.com/ipic/2020-08-22-135811.png)

生成后的目录结构如下：

![目录结构](https://file.shenfq.com/ipic/2020-08-23-132408.png)

VS Code 插件可以简单理解为一个 Npm 包，也需要一个 `package.json` 文件，属性与 Npm 包的基本一致。

```json
{
  // 名称
  "name": "fund-watch",
  // 版本
  "version": "1.0.0",
  // 描述
  "description": "实时查看基金行情",
  // 发布者
  "publisher": "shenfq",
  // 版本要求
  "engines": {
    "vscode": "^1.45.0"
  },
  // 入口文件
  "main": "./out/extension.js",
  "scripts": {
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
  },
  "devDependencies": {
    "@types/node": "^10.14.17",
    "@types/vscode": "^1.41.0",
    "typescript": "^3.9.7"
  },
  // 插件配置
  "contributes": {},
  // 激活事件
  "activationEvents": [],
}
```

简单介绍下其中比较重要的配置。

- `contributes`：插件相关配置。
- `activationEvents`：激活事件。
- `main`：插件的入口文件，与 Npm 包表现一致。
- `name` 、 `publisher`：name 是插件名，publisher 是发布者。`${publisher}.${name}` 构成插件 ID。

比较值得关注的就是 `contributes` 和 `activationEvents` 这两个配置。

### 创建视图

我们首先在我们的应用中创建一个视图容器，视图容器简单来说一个单独的侧边栏，在 `package.json` 的 `contributes.viewsContainers` 中进行配置。

```json
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "fund-watch",
          "title": "FUND WATCH",
          "icon": "images/fund.svg"
        }
      ]
    }
  }
}
```

![侧边栏](https://file.shenfq.com/ipic/2020-08-23-092247.png)

然后我们还需要添加一个视图，在 `package.json` 的 `contributes.views` 中进行配置，该字段为一个对象，它的 Key 就是我们视图容器的 id，值为一个数组，表示一个视图容器内可添加多个视图。

```js
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "fund-watch",
          "title": "FUND WATCH",
          "icon": "images/fund.svg"
        }
      ]
    },
    "views": {
      "fund-watch": [
        {
          "name": "自选基金",
          "id": "fund-list"
        }
      ]
    }
  }
}
```

如果你不希望在自定义的视图容器中添加，可以选择 VS Code 自带的视图容器。

- `explorer`: 显示在资源管理器侧边栏
- `debug`: 显示在调试侧边栏
- `scm`: 显示在源代码侧边栏

```js
{
  "contributes": {
    "views": {
      "explorer": [
        {
          "name": "自选基金",
          "id": "fund-list"
        }
      ]
    }
  }
}
```

![显示到资源管理器中](https://file.shenfq.com/ipic/2020-08-23-100627.png)

### 运行插件

使用 `Yeoman` 生成的模板自带 VS Code 运行能力。

![vscode配置](https://file.shenfq.com/ipic/2020-08-23-134256.png)

切换到调试面板，直接点击运行，就能看到侧边栏多了个图标。

![调试面板](https://file.shenfq.com/ipic/2020-08-23-134410.png)

![运行结果](https://file.shenfq.com/ipic/2020-08-23-132932.png)

### 添加配置

我们需要获取基金的列表，当然需要一些基金代码，而这些代码我们可以放到 VS Code 的配置中。

```json
{
  "contributes": {
    // 配置
    "configuration": {
      // 配置类型，对象
      "type": "object",
      // 配置名称
      "title": "fund",
      // 配置的各个属性
      "properties": {
        // 自选基金列表
        "fund.favorites": {
          // 属性类型
          "type": "array",
          // 默认值
          "default": [
            "163407",
            "161017"
          ],
          // 描述
          "description": "自选基金列表，值为基金代码"
        },
        // 刷新时间的间隔
        "fund.interval": {
          "type": "number",
          "default": 2,
          "description": "刷新时间，单位为秒，默认 2 秒"
        }
      }
    }
  }
}
```

### 视图数据

我们回看之前注册的视图，VS Code 中称为树视图。

```json
"views": {
  "fund-watch": [
    {
      "name": "自选基金",
      "id": "fund-list"
    }
  ]
}
```

我们需要通过 vscode 提供的 `registerTreeDataProvider` 为视图提供数据。打开生成的 `src/extension.ts` 文件，修改代码如下：

```js
// vscode 模块为 VS Code 内置，不需要通过 npm 安装
import { ExtensionContext, commands, window, workspace } from 'vscode';
import Provider from './Provider';

// 激活插件
export function activate(context: ExtensionContext) {
  // 基金类
  const provider = new Provider();

  // 数据注册
  window.registerTreeDataProvider('fund-list', provider);
}

export function deactivate() {}
```

这里我们通过 VS Code 提供的 `window.registerTreeDataProvider` 来注册数据，传入的第一个参数表示视图 ID，第二个参数是 `TreeDataProvider` 的实现。

`TreeDataProvider` 有两个必须实现的方法：

- `getChildren`：该方法接受一个 element，返回 element 的子元素，如果没有element，则返回的是根节点的子元素，我们这里因为是单列表，所以不会接受 element 元素；
- `getTreeItem`：该方法接受一个 element，返回视图单行的 UI 数据，需要对 `TreeItem` 进行实例化；

我们通过 VS Code 的资源管理器来展示下这两个方法：

![方法展示](https://file.shenfq.com/ipic/2020-08-24-015527.png)

有了上面的知识，我们就可以轻松为树视图提供数据了。

```js
import { workspace, TreeDataProvider, TreeItem } from 'vscode';

export default class DataProvider implements TreeDataProvider<string> {
  refresh() {
    // 更新视图
  }

  getTreeItem(element: string): TreeItem {
    return new TreeItem(element);
  }

  getChildren(): string[] {
    const { order } = this;
    // 获取配置的基金代码
    const favorites: string[] = workspace
      .getConfiguration()
      .get('fund-watch.favorites', []);
    
    // 依据代码排序
		return favorites.sort((prev, next) => (prev >= next ? 1 : -1) * order);
  }
}


```

现在运行之后，可能会发现视图上没有数据，这是因为没有配置激活事件。

```json
{
	"activationEvents": [
    // 表示 fund-list 视图展示时，激活该插件
		"onView:fund-list"
	]
}
```

![基金代码列表](https://file.shenfq.com/ipic/2020-08-24-015003.png)

### 请求数据

我们已经成功将基金代码展示在视图上，接下来就需要请求基金数据了。网上有很多基金相关 api，这里我们使用天天基金网的数据。

![天天基金网](https://file.shenfq.com/ipic/2020-08-24-020506.png)

通过请求可以看到，天天基金网通过 JSONP 的方式获取基金相关数据，我们只需要构造一个 url，并传入当前时间戳即可。

```js
const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`
```

VS Code 中请求数据，需要使用内部提供的 `https` 模块，下面我们新建一个 `api.ts`。

```ts
import * as https from 'https';

// 发起 GET 请求
const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks = '';
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误!'));
        return;
      }
      res.on('data', (chunk) => chunks += chunk.toString('utf8'));
      res.on('end', () => resolve(chunks));
    });
  });
};

interface FundInfo {
  now: string
  name: string
  code: string
  lastClose: string
  changeRate: string
  changeAmount: string
}

// 根据基金代码请求基金数据
export default function fundApi(codes: string[]): Promise<FundInfo[]> {
  const time = Date.now();
	// 请求列表
  const promises: Promise<string>[] = codes.map((code) => {
    const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${time}`;
    return request(url);
  });
  return Promise.all(promises).then((results) => {
    const resultArr: FundInfo[] = [];
    results.forEach((rsp: string) => {
      const match = rsp.match(/jsonpgz\((.+)\)/);
      if (!match || !match[1]) {
        return;
      }
      const str = match[1];
      const obj = JSON.parse(str);
      const info: FundInfo = {
        // 当前净值
        now: obj.gsz,
        // 基金名称
        name: obj.name,
        // 基金代码
        code: obj.fundcode,
        // 昨日净值
        lastClose: obj.dwjz,
        // 涨跌幅
        changeRate: obj.gszzl,
        // 涨跌额
        changeAmount: (obj.gsz - obj.dwjz).toFixed(4),
      };
      resultArr.push(info);
    });
    return resultArr;
  });
}
```

接下来修改视图数据。

```js
import { workspace, TreeDataProvider, TreeItem } from 'vscode';
import fundApi from './api';

export default class DataProvider implements TreeDataProvider<FundInfo> {
  // 省略了其他代码
  getTreeItem(info: FundInfo): TreeItem {
    // 展示名称和涨跌幅
  	const { name, changeRate } = info
    return new TreeItem(`${name}  ${changeRate}`);
  }

  getChildren(): Promise<FundInfo[]> {
    const { order } = this;
    // 获取配置的基金代码
    const favorites: string[] = workspace
      .getConfiguration()
      .get('fund-watch.favorites', []);
    
    // 获取基金数据
		return fundApi([...favorites]).then(
      (results: FundInfo[]) => results.sort(
      	(prev, next) => (prev.changeRate >= next.changeRate ? 1 : -1) * order
    	)
    );
  }
}

```

![视图数据](https://file.shenfq.com/ipic/2020-08-24-025708.png)

### 美化格式

前面我们都是通过直接实例化 `TreeItem` 的方式来实现 UI 的，现在我们需要重新构造一个 `TreeItem`。

```js
import { workspace, TreeDataProvider, TreeItem } from 'vscode';
import FundItem from './TreeItem';
import fundApi from './api';

export default class DataProvider implements TreeDataProvider<FundInfo> {
  // 省略了其他代码
  getTreeItem(info: FundInfo): FundItem {
    return new FundItem(info);
  }
}
```

```js
// TreeItem
import { TreeItem } from 'vscode';

export default class FundItem extends TreeItem {
  info: FundInfo;

  constructor(info: FundInfo) {
    const icon = Number(info.changeRate) >= 0 ? '📈' : '📉';

    // 加上 icon，更加直观的知道是涨还是跌
    super(`${icon}${info.name}   ${info.changeRate}%`);

    let sliceName = info.name;
    if (sliceName.length > 8) {
      sliceName = `${sliceName.slice(0, 8)}...`;
    }
    const tips = [
      `代码:　${info.code}`,
      `名称:　${sliceName}`,
      `--------------------------`,
      `单位净值:　　　　${info.now}`,
      `涨跌幅:　　　　　${info.changeRate}%`,
      `涨跌额:　　　　　${info.changeAmount}`,
      `昨收:　　　　　　${info.lastClose}`,
    ];

    this.info = info;
    // tooltip 鼠标悬停时，展示的内容
    this.tooltip = tips.join('\r\n');
  }
}
```

![美化后](https://file.shenfq.com/ipic/2020-08-24-030457.png)

### 更新数据

`TreeDataProvider` 需要提供一个 `onDidChangeTreeData` 属性，该属性是 EventEmitter 的一个实例，然后通过触发 EventEmitter 实例进行数据的更新，每次调用 refresh 方法相当于重新调用了 `getChildren` 方法。

```js
import { workspace, Event, EventEmitter, TreeDataProvider } from 'vscode';
import FundItem from './TreeItem';
import fundApi from './api';

export default class DataProvider implements TreeDataProvider<FundInfo> {
  private refreshEvent: EventEmitter<FundInfo | null> = new EventEmitter<FundInfo | null>();
  readonly onDidChangeTreeData: Event<FundInfo | null> = this.refreshEvent.event;

  refresh() {
    // 更新视图
    setTimeout(() => {
      this.refreshEvent.fire(null);
    }, 200);
  }
}
```

我们回到 `extension.ts`，添加一个定时器，让数据定时更新。

```js
import { ExtensionContext, commands, window, workspace } from 'vscode'
import Provider from './data/Provider'

// 激活插件
export function activate(context: ExtensionContext) {
  // 获取 interval 配置
  let interval = workspace.getConfiguration().get('fund-watch.interval', 2)
  if (interval < 2) {
    interval = 2
  }

  // 基金类
  const provider = new Provider()

  // 数据注册
  window.registerTreeDataProvider('fund-list', provider)

  // 定时更新
  setInterval(() => {
    provider.refresh()
  }, interval * 1000)
}

export function deactivate() {}

```

除了定时更新，我们还需要提供手动更新的能力。修改 `package.json`，注册命令。

```json
{
  "contributes": {
		"commands": [
			{
				"command": "fund.refresh",
				"title": "刷新",
				"icon": {
					"light": "images/light/refresh.svg",
					"dark": "images/dark/refresh.svg"
				}
			}
		],
		"menus": {
			"view/title": [
				{
					"when": "view == fund-list",
					"group": "navigation",
					"command": "fund.refresh"
				}
			]
		}
	}
}
```

- `commands`：用于注册命令，指定命令的名称、图标，以及 command 用于 extension 中绑定相应事件；
- `menus`：用于标记命令展示的位置；
  - `when`：定义展示的视图，具体语法可以查阅[官方文档](https://code.visualstudio.com/docs/getstarted/keybindings#_when-clause-contexts)；
  - group：定义菜单的分组；
  - command：定义命令调用的事件；

![view-actions](https://file.shenfq.com/ipic/2020-08-24-032913.png)

配置好命令后，回到 `extension.ts` 中。

```js
import { ExtensionContext, commands, window, workspace } from 'vscode';
import Provider from './Provider';

// 激活插件
export function activate(context: ExtensionContext) {
  let interval = workspace.getConfiguration().get('fund-watch.interval', 2);
  if (interval < 2) {
    interval = 2;
  }

  // 基金类
  const provider = new Provider();

  // 数据注册
  window.registerTreeDataProvider('fund-list', provider);

  // 定时任务
  setInterval(() => {
    provider.refresh();
  }, interval * 1000);

  // 事件
  context.subscriptions.push(
    commands.registerCommand('fund.refresh', () => {
      provider.refresh();
    }),
  );
}

export function deactivate() {}

```

现在我们就可以手动刷新了。

![image-20200824113219392](https://file.shenfq.com/ipic/2020-08-24-033219.png)

### 新增基金

我们新增一个按钮用了新增基金。

```json
{
  "contributes": {
		"commands": [
      {
        "command": "fund.add",
        "title": "新增",
        "icon": {
          "light": "images/light/add.svg",
          "dark": "images/dark/add.svg"
        }
      },
			{
				"command": "fund.refresh",
				"title": "刷新",
				"icon": {
					"light": "images/light/refresh.svg",
					"dark": "images/dark/refresh.svg"
				}
			}
		],
		"menus": {
			"view/title": [
        {
          "command": "fund.add",
          "when": "view == fund-list",
          "group": "navigation"
        },
				{
					"when": "view == fund-list",
					"group": "navigation",
					"command": "fund.refresh"
				}
			]
		}
	}
}
```

在 `extension.ts ` 中注册事件。

```js
import { ExtensionContext, commands, window, workspace } from 'vscode';
import Provider from './Provider';

// 激活插件
export function activate(context: ExtensionContext) {
  // 省略部分代码 ...
  
  // 基金类
  const provider = new Provider();

  // 事件
  context.subscriptions.push(
    commands.registerCommand('fund.add', () => {
      provider.addFund();
    }),
    commands.registerCommand('fund.refresh', () => {
      provider.refresh();
    }),
  );
}

export function deactivate() {}
```

实现新增功能，修改 `Provider.ts`。

```js
import { workspace, Event, EventEmitter, TreeDataProvider } from 'vscode';
import FundItem from './TreeItem';
import fundApi from './api';

export default class DataProvider implements TreeDataProvider<FundInfo> {
  // 省略部分代码 ...

  // 更新配置
  updateConfig(funds: string[]) {
    const config = workspace.getConfiguration();
    const favorites = Array.from(
      // 通过 Set 去重
      new Set([
        ...config.get('fund-watch.favorites', []),
        ...funds,
      ])
    );
    config.update('fund-watch.favorites', favorites, true);
  }

  async addFund() {
    // 弹出输入框
    const res = await window.showInputBox({
      value: '',
      valueSelection: [5, -1],
      prompt: '添加基金到自选',
      placeHolder: 'Add Fund To Favorite',
      validateInput: (inputCode: string) => {
        const codeArray = inputCode.split(/[\W]/);
        const hasError = codeArray.some((code) => {
          return code !== '' && !/^\d+$/.test(code);
        });
        return hasError ? '基金代码输入有误' : null;
      },
    });
    if (!!res) {
      const codeArray = res.split(/[\W]/) || [];
      const result = await fundApi([...codeArray]);
      if (result && result.length > 0) {
        // 只更新能正常请求的代码
        const codes = result.map(i => i.code);
        this.updateConfig(codes);
        this.refresh();
      } else {
        window.showWarningMessage('stocks not found');
      }
    }
  }
}
```

![新增按钮](https://file.shenfq.com/ipic/2020-08-24-035043.png)

![输入框](https://file.shenfq.com/ipic/2020-08-24-035109.png)

### 删除基金

最后新增一个按钮，用来删除基金。

```json
{
	"contributes": {
		"commands": [
			{
				"command": "fund.item.remove",
				"title": "删除"
			}
		],
		"menus": {
      // 这个按钮放到 context 中
      "view/item/context": [
        {
          "command": "fund.item.remove",
          "when": "view == fund-list",
          "group": "inline"
        }
      ]
		}
  }
}
```

在 `extension.ts ` 中注册事件。

```js
import { ExtensionContext, commands, window, workspace } from 'vscode';
import Provider from './Provider';

// 激活插件
export function activate(context: ExtensionContext) {
  // 省略部分代码 ...
  
  // 基金类
  const provider = new Provider();

  // 事件
  context.subscriptions.push(
    commands.registerCommand('fund.add', () => {
      provider.addFund();
    }),
    commands.registerCommand('fund.refresh', () => {
      provider.refresh();
    }),
    commands.registerCommand('fund.item.remove', (fund) => {
      const { code } = fund;
      provider.removeConfig(code);
      provider.refresh();
    })
  );
}

export function deactivate() {}
```

实现新增功能，修改 `Provider.ts`。

```js
import { window, workspace, Event, EventEmitter, TreeDataProvider } from 'vscode';
import FundItem from './TreeItem';
import fundApi from './api';

export default class DataProvider implements TreeDataProvider<FundInfo> {
  // 省略部分代码 ...

  // 删除配置
  removeConfig(code: string) {
    const config = workspace.getConfiguration();
    const favorites: string[] = [...config.get('fund-watch.favorites', [])];
    const index = favorites.indexOf(code);
    if (index === -1) {
      return;
    }
    favorites.splice(index, 1);
    config.update('fund-watch.favorites', favorites, true);
  }
}
```

![删除按钮](https://file.shenfq.com/ipic/2020-08-24-035658.png)

## 总结

实现过程中也遇到了很多问题，遇到问题可以多翻阅 [VSCode 插件中文文档](https://liiked.github.io/VS-Code-Extension-Doc-ZH/#/)。该插件已经发布的了 VS Code 插件市场，感兴趣的可以直接[下载该插件](https://marketplace.visualstudio.com/items?itemName=shenfq.fund-watch)，或者在 github 上下载[完整代码](https://github.com/Shenfq/fund-watch)。