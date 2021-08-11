const chalk = require('chalk')

let count = false

module.exports = function init () {
    if (count) return
    count = true
    console.log(chalk.green('欢迎使用果酱xingguang项目活动模板系统!\n'))
}
