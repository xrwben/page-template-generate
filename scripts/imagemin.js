/**
 * image minify 图片压缩
 * 循环所有src下的.images目录 生成 images目录
 */
require('./helpers/init')()
const chalk = require('chalk')
const myInquirer = require('./helpers/inquirer')
const path = require('path')
const fse = require('fs-extra')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

const resolve = (...args) => {
    return path.resolve(__dirname, ...args)
}

async function minDirImage (dir, dest) {
    if (!await fse.exists(resolve('..', dir))) return
    await imagemin([dir + '/*.{jpg,png}'], {
        destination: dest,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    })
}

async function starter () {
    await minDirImage('xg-tpl-src/src/.images', 'src/images')
    await minDirImage('xg-tpl-src/src/mobile/.images', 'src/mobile/images')
    await minDirImage('xg-tpl-src/src/pc/.images', 'src/pc/images')
}

async function main () {
    if (!await myInquirer.confirm(`确认开始 处理 ${chalk.green('imagemin 图片压缩')} ?`)) {
        process.exit(0)
    }

    try {
        await starter()
    } catch (e) {
        console.log(chalk.red(e))
        console.log(chalk.red('请确认错误类型，若为配置错误，请查看相关文档。若为代码缺陷，请提交至git issue fix后使用。'))
    }
}

if (require.main === module) {
    main()
} else {
    module.exports = starter
}
