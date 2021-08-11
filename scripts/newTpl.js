/**
 * 创建模板页
 */
require('./helpers/init')()

const myInquirer = require('./helpers/inquirer')
const chalk = require('chalk')
const templates = require('../templates/templates.json')
const path = require('path')
const ora = require('ora')()
const { gitXGTPL, gitSRC, pull, getUserInfo } = require('./helpers/git')
const readdirSync = require('fs').readdirSync
const fs = require('fs-extra')

async function starter () {
    const confirm = await myInquirer.confirm('确认新建模板?')

    if (!confirm) {
        process.exit(0)
    }

    let tplName = await myInquirer.input('请输入新建的模板项目名')
    tplName = tplName.trim()
    if (!tplName) {
        console.log(chalk.red('模板项目名不能为空'))
        process.exit(0)
    }

    if (templates[tplName]) {
        console.log(chalk.red('该模板项目已存在!'))
        process.exit(0)
    }

    // 检查src目录
    const files = readdirSync(path.resolve(__dirname, '../xg-tpl-src/src'))
    if (files.length > 1 || (files.length === 1 && files[0] !== '.gitkeep')) {
        console.log(chalk.red('src目录已存在其他文件，请确认无其他文件后，再新建(除.gitkeep外)!'))
        process.exit(0)
    }

    // 1. 新建模板分支
    const branchName = `tpl/${tplName}`
    ora.start(`正在新建分支 ${branchName}`)
    await pull(gitXGTPL, 'origin', 'master')
    await pull(gitSRC, 'origin', 'master')
    await gitSRC.checkoutBranch(branchName, 'master')
    ora.succeed(`新建模板分支 ${branchName} success!`)

    // 2. 复制模板内容
    const type = await myInquirer.list('选择新建模板类型', [
        {
            name: '基础模板',
            value: 'basic'
        },
        {
            name: '空模板(空源码文件)',
            value: 'blank'
        },
        {
            name: '从已有模板中选择',
            value: 'exists'
        }
    ])

    let fromTpl
    if (type === 'blank') {
        fromTpl = '_blank'
    }
    if (type === 'basic') {
        // -> 直接新建空模板(only mobile | only pc | mobile & PC 同构 | mobile & PC 异构)内容
        const source = await myInquirer.list('请选择基础模板类型:', [
            {
                name: 'only mobile',
                value: '_basic_mobile'
            },
            {
                name: 'only pc',
                value: '_basic_pc'
            },
            {
                name: 'mobile & pc 同构',
                value: '_basic_mixin'
            },
            {
                name: 'mobile & pc 异构',
                value: '_basic_singleton'
            }
        ])
        fromTpl = source
    }
    if (type === 'exists') {
        // -> 从其他模板基础上新建模板
        const source = await myInquirer.list('请选择:', Object.keys(templates))
        fromTpl = source
    }

    // 2.1 拷贝目录
    ora.start(`正在创建源码目录`)
    await fs.copy(
        path.resolve(__dirname, '../templates', fromTpl),
        path.resolve(__dirname, '../xg-tpl-src/src')
    )
    // 2.2 写入config文件
    const user = (await getUserInfo(gitXGTPL)) || {}
    await fs.writeJSON(
        path.resolve(__dirname, '../xg-tpl-src/src', 'config.json'),
        {
            ...user,
            type: 'template',
            name: tplName,
            useTpl: fromTpl,
            branch: branchName,
            created: new Date().toString(),
            app: {
                pageTitle: '页面标题'
            }
        },
        {
            spaces: 4
        }
    )
    ora.succeed('创建源码目录 success!')
}

async function main () {
    try {
        await starter()
    } catch (e) {
        console.log(chalk.red(e))
        console.log(chalk.red('请确认错误类型，若为配置错误，请查看相关文档。若为代码缺陷，请提交至git issue fix后使用。'))
    }
}

main()
