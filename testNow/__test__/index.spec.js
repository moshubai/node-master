const fs = require('fs')
test('集成测试', () => {
    // 准备环境
    // 删除测试文件夹
    fs.rmdirSync(__dirname + '/data/__test__', {
        recursive: true
    })
    const src = new (require('../index'))()
    src.getJestSource(__dirname + '/data')
});

// test('测试img', () => {
//     const src = new (require('../index'))()
//     const ret = src.getTestSource('fun','class')
//     console.log('ret',ret); //xu-log
//     expect(ret)
//     .toBe(`
// test('Test fun',()=>{
// const fun = require('../class')
// const res = fun()
// //expect(ret)
// // .toBe('Test')
// })
// `)
// });


// test('测试文件名生成', () => {
//     const src = new (require('../index'))()
//     const ret = src.getTestFileName('/abc/class.js')

//     console.log('getTestFileName',ret); //xu-log
//     expect(ret)
//     .toBe('/abc/__test__/class.spec.js')
// });
