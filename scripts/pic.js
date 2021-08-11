/**
 * 整合图片流程
 */
require('./helpers/init')()
const chalk = require('chalk')
const myInquirer = require('./helpers/inquirer')

const sprite = require('./sprite')
const imgmin = require('./imagemin')

async function starter () {
    console.log(chalk.green('开始处理 CSS Sprite .'))
    await sprite()
    console.log(chalk.green('开始处理 imagemin 图片压缩 .'))
    await imgmin()
}

async function main () {
    if (!await myInquirer.confirm(`确认开始 处理 ${chalk.green('图片资源')} ?`)) {
        process.exit(0)
    }

    try {
        await starter()
    } catch (e) {
        console.log(chalk.red(e))
        console.log(chalk.red('请确认错误类型，若为配置错误，请查看相关文档。若为代码缺陷，请提交至git issue fix后使用。'))
    }
}

main()
