const path = require('path')
const fs = require('fs')
module.exports = class TestNow {

    getJestSource(sourcePath = path.resolve('./')) {
        const testPath = `${sourcePath}/__test__`
        if (!fs.existsSync(testPath)) {
            fs.mkdirSync(testPath)
        }

        let list = fs.readdirSync(sourcePath)
        list
            .map(v => `${sourcePath}/${v}`)
            .filter(v => fs.statSync(v).isFile())
            .filter(v => v.indexOf('.spec') === -1)
            .map(v => this.getTestFile(v))
    }

    getTestFile(fileName) {
        const testFileName = this.getTestFileName(fileName)
        // 判断此文件是否存在
        if (fs.existsSync(testFileName)) {
            return
        }
        const me = require(fileName)
        let source;
        if (typeof me === 'object') {
            source = Object.keys(me)
                .map(v => this.getTestSource(v, path.basename(fileName), true))
                .join('\n')
        } else if (typeof me === 'function') {
            const baseName = path.basename(fileName)
            source = this.getTestSource(baseName.replace('js', ''), baseName)
        }
        fs.writeFileSync(testFileName, source)
    }













    getTestSource(methodName, classFile, isClass = false) {
        console.log('getTestSource:', methodName)
        return `
test('${'Test ' + methodName}',()=>{
const ${isClass ? '{' + methodName + '}' : methodName} = require('${'../' + classFile}')
const res = ${methodName}()
//expect(ret)
// .toBe('Test')
})
`
    }

    /**
     * 
     * https://juejin.cn/user/1978776660216136/posts
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