## node 学习

### 利用 node 创建一个克隆脚手架的工程之简化命令行开发

#### 初始化某文件夹（例如文件名：base-cli）

```
npm init
```

#### 安装插件

```
npm i commander download-git-repo ora handlebars figlet clear chalk open -s
```

> 插件介绍：

1.  `download-git-repo` 作用是从传入的连接中下载并提取一个 git 存储库（如：GitHub，GitLab，Bitbucket），更详细的在这 ☛[原文链接](https://www.npmjs.com/package/download-git-repo)。
2.  `ora` 可以理解文 loading 吧，☛[原文链接](https://www.npmjs.com/package/ora)。
3.  `handlebars` 可以理解文将数据和视图分离的一个插件，☛[原文链接](https://www.npmjs.com/package/handlebars)。
4.  `figlet` 使你的 log 更炫酷?!☛[原文链接](https://www.npmjs.com/package/figlet)。
5.  `clear` 清里 cmd 面板了。
6.  `chalk` 例子：chalk.blue('Hello world!');明白作用了吧。
7.  `open` 字面意思。

#### 开始配置

1.   配置 `package.json` 文件

```js
"bin": {
  "base": "./bin/base.js"
 }
```


#### 创建指令和执行文件

1. 创建指令（node 指令）

```js
const program = require("commander");
// commander的灵感来自Ruby，它提供了用户命令行输入和参数解析的强大功能，可以帮助我们简化命令行开发。
program.version(require("../package.json").version);

program
  .command("init <name>") // 这里创建的指令为 base init xxx
  .description("init project") // 这里是指令的描述
  .action(require("../lib/init")); // 这里执行的文件所在

program.parse(process.argv);
```

2. 开始配置 init 文件

```js
const { promisify } = require("util");
const figlet = promisify(require("figlet"));
const clear = require("clear");
const chalk = require("chalk");
const log = (content) => console.log(chalk.green(content));
module.exports = async (name) => {
  clear();
  const data = await figlet("base cli");
  log(data);
};
```

> 将上面代码复制到`init.js`中，执行如下命令，完了，就清楚做了什么。

```js
// 这个命令其实是一个连接引用，将npm模块链接到对应的运行项目中去
npm link
// 开始执行base.js编写的命令。
base init project
```


3. 正式配置 init 文件

```js
const { promisify } = require("util");

const clone = async (urlRepo, desc) => {
  // 下载git的插件
  const download = promisify(require("download-git-repo"));
  const ora = require("ora");
  const process = ora(`下载中...       ${urlRepo}`);
  process.start();
  await download(urlRepo, desc);
  process.succeed();
};

const spawnFn = async (...args) => {
  /*
    child_process.spawn(command[, args][, options])
    - command : 要运行的命令
    - args : 字符串参数列表。
    - options: 选项，其中 cwd 可以指定子进程的当前工作目录。detached 可以设置 true 或者 false，为 true，则将子进程独立于父进程来运行，父进程结束后，子进程可以继续执行。 stdio 用于配置子进程与父进程之间建立的管道
    */
  const { spawn } = require("child_process");
  return new Promise((resolve) => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};

module.exports = async (name) => {
  log(name);
  clear();
  log("开始创建项目，拉取Git项目");
  await clone("github:moshubai/node-master", name);
  log("安装依赖");
  // 利用yarn install 安装依赖，用子进程下载依赖child_process.spawn(command[, args][, options])
  await spawnFn("yarn", ["install"], { cwd: `./${name}` });
};
```

> ！！！注 这里有个 BUG，`await spawnFn('yarn', ['install'], { cwd: `./${name}` })` 这句代码在window系统会产生一个BUG，原因就是不确定执行哪一个文件，由于可执行文件为两个，所以就机器就选择困难症了，故而需要我们做出选择，将其修改为：`await spawnFn(process.platform === 'win32' ? 'yarn.cmd' : 'yarn', ['install'], { cwd: `./${name}` })`。Mac 忽略，此处心理一 W 羊驼个奔腾。

4. 安装完依赖，就是开始自动运行了。

```js
log(`安装完成`);
const open = require("open");
open("http://localhost:8080");
await spawnFn("yarn", ["serve"], { cwd: `./${name}` });
```
5. 结束

#### 结束语
  学习node，既能接触更深层的语言，也可以方便手写各种命令soso的，更重要的是作为一名前端，在性能优化方面很重要，光写不行，你还要让你的代码百米速度更快才行。