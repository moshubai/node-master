const path = require('path')

module.exports = class TestNow {
    /**
     * 
     * 
     */
    getTestFileName(fileName) {
        const dirName = path.dirname(fileName)
        const baseName = path.basename(fileName)
        const extName = path.extname(fileName)
        console.log('dirNamedirNamedirNamedirName', dirName, baseName, extName); //xu-log
        const testName = baseName.replace(extName, `.spec${extName}`)
        return path.format({
            root: dirName + '/__test__/',
            base: testName
        })
    }

}