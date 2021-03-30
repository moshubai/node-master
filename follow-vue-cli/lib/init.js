const { promisify } = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')

const { clone } = require('./download')

const log = content => console.log(chalk.green(content))

const isWin32 = process.platform === 'win32'



const spawnFn = async (...args) => {
    /*
    child_process.spawn(command[, args][, options])
    - command : 要运行的命令
    - args : 字符串参数列表。
    - options: 选项，其中 cwd 可以指定子进程的当前工作目录。detached 可以设置 true 或者 false，为 true，则将子进程独立于父进程来运行，父进程结束后，子进程可以继续执行。 stdio 用于配置子进程与父进程之间建立的管道
    */
    const { spawn } = require('child_process')
    return new Promise(resolve => {
        console.log('', args); //xu-log
        const proc = spawn(...args)

        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
        proc.on('close', () => {
            resolve()
        })
    })
}





module.exports = async (name) => {
    log(name);
    clear();
    const data = await figlet('xu zhan bo')
    log(data);

    // 创建项目
    log('开始创建项目，拉取Git项目')

    await clone('github:moshubai/node-master', name)
    log('安装依赖')

    // 利用cnpm install 安装依赖
    await spawnFn(isWin32 ? 'yarn.cmd' : 'yarn', ['install'], { cwd: `./${name}` })

    log(`
    👌安装完成：
    To get Start:
    ===========================
        cd ${name}
        npm run serve
    ===========================
     `)

    const open = require('open')
    open('http://localhost:8080')
    await spawnFn(isWin32 ? 'yarn.cmd' : 'yarn', ['serve'], { cwd: `./${name}` })

}







