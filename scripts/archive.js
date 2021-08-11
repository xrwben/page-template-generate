/**
 * page页面分支 归档
 * 归档 -> 存至pages目录下 合并其他代码 删除page分支
 */
require('./helpers/init')()

const path = require('path')
const commander = require('commander')
const chalk = require('chalk')
const ora = require('ora')()
const { gitXGTPL, gitSRC } = require('./helpers/git')
const fse = require('fs-extra')
const myInquirer = require('./helpers/inquirer')

commander.option('-t, --type <value>', 'Archive Type: 归档类型 (page | tpl)')
    .parse(process.argv)

if (commander.type !== 'page' && commander.type !== 'tpl') {
    console.log(chalk.red('未知的归档类型'))
    process.exit(0)
}

const resolve = (...name) => {
    return path.resolve(__dirname, ...name)
}

async function starter () {
    const A_TYPE = commander.type
    const BADGE = chalk.blue(A_TYPE)
    const targetGit = { page: gitSRC, tpl: gitXGTPL }[A_TYPE]

    if (!await myInquirer.confirm(`确认开始进行 归档${BADGE}分支 操作?`)) {
        process.exit(0)
    }

    const branches = await gitSRC.branchLocal()
    const branchRE = {
        page: /^page\//,
        tpl: /^tpl\//
    }[A_TYPE]
    const typeBr = branches.all.filter(brname => branchRE.test(brname))

    if (typeBr.length === 0) {
        console.log(chalk.red(`当前本地Git仓库没有可用的${BADGE}分支!`))
        process.exit(0)
    }

    const chosenBr = await myInquirer.list(`请选择需要归档的${BADGE}分支:`, typeBr)

    // * 1. checkout type/$ 分支
    ora.start(`切换至 ${chosenBr} 分支`)
    await gitSRC.checkout(chosenBr)
    ora.succeed(`已切换至 ${chosenBr} 分支!`)
    if (A_TYPE === 'tpl') {
        ora.start(`xg-tpl 正在切换到 master 分支>>>>`)
        await gitXGTPL.checkout('master')
        ora.succeed(`xg-tpl 已切换至 master 分支!`)
    }

    const project = await fse.readJSON(resolve('../xg-tpl-src/src/config.json'), { encoding: 'utf8' })
    const ensureType = {
        page: 'page',
        tpl: 'template'
    }[A_TYPE]
    if (project.type !== ensureType) {
        console.log(chalk.red(`src 目录不是 ${ensureType} 类型，请确认后再归档`))
        process.exit(0)
    }

    // * 2. pre
    ora.start('xg-tpl-src本地分支master同步至page分支>>>')
    await gitSRC.mergeFromTo('master', chosenBr) // 本地分支同步
    ora.succeed(`xg-tpl-src本地分支master同步至 ${chosenBr} 分支`)

    const configFilePath = {
        page: resolve('../xg-tpl-src/pages/pages.json'),
        tpl: resolve('../templates/templates.json')
    }[A_TYPE]
    const configFile = configFilePath
    const config = require(configFile)
    if (config[project.name]) {
        const ensure = await myInquirer.confirm('已有该项目的归档记录，是否覆盖归档?')
        if (!ensure) {
            process.exit(0)
        }
    }

    // * 2. move src文件至page/$目录下 并删除src目录
    const targetDir = {
        page: 'xg-tpl-src/pages',
        tpl: 'templates'
    }[A_TYPE]
    ora.start(`归档 src 代码至 ${targetDir} 目录下管理`)
    const srcRoot = resolve('../xg-tpl-src/src')
    const targetRoot = resolve('../', targetDir, project.name)
    const files = await fse.readdir(srcRoot)
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(srcRoot, files[i])
        const targetPath = path.join(targetRoot, files[i])
        if (files[i] !== '.gitkeep') {
            await fse.move(filePath, targetPath, { overwrite: true })
        }
    }
    ora.succeed('src 代码文件已归档')

    // * 3. pages.json记录归档信息
    config[project.name] = {
        author: project.author,
        name: project.name,
        branch: chosenBr,
        useTpl: project.useTpl,
        created: project.created,
        archived: new Date().toString()
    }

    await fse.writeJSON(configFile, config, { spaces: 4 })

    // * 4. commit && merge pages/$ to master
    ora.start('Git commit 记录归档信息')
    await targetGit.add('.')
    await targetGit.commit(`[xg-tpl][${A_TYPE}] ${chosenBr} auto archives`)
    ora.succeed('归档信息已 commit 同步至本地git管理')

    if (A_TYPE === 'page') {
        ora.start('归档信息正在合并至git master')
        await targetGit.checkout('master')
        A_TYPE === 'page' && await targetGit.mergeFromTo(chosenBr, 'master')
        ora.succeed('归档信息已同步至git master，请手动 push 到远程仓库~')
    }

    // * 5. 删除 pages 分支
    ora.start(`正在删除 ${chosenBr} 分支`)
    await gitSRC.checkout('master')
    ora.succeed(`src 已切换到master分支!`)
    await gitSRC.deleteLocalBranch(chosenBr)
    ora.succeed(`${chosenBr} 分支已删除!`)

    console.log(chalk.green(`${chosenBr} 分支 归档已完成!`))
    console.log(chalk.green(`请确认后手动push至远程分支!`))
}

try {
    starter()
} catch (e) {
    console.log(chalk.red(e.message))
    console.log(chalk.red('请确认错误类型，若为配置错误，请查看相关文档。若为代码缺陷，请提交至git issue fix后使用。'))
}
