const { promisify } = require('util')

module.exports.clone = async (urlRepo, desc) => {
    // 下载git的插件
    const download = promisify(require('download-git-repo'))
    const ora = require('ora')
    const process = ora(`下载中...       ${urlRepo}`)
    process.start()
    await download(urlRepo, desc)
    process.succeed()

}





