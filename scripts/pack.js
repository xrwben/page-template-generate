/**
 * src. tpl/page 开发/构建 脚本
 */
require('./helpers/init')()

const path = require('path')
const chalk = require('chalk')
const myInquirer = require('./helpers/inquirer')
const webpack = require('webpack')
const server = require('browser-sync').create()
const { emptyDir, ensureDir } = require('fs-extra')
const PUBLIC = require('./webpack/config')
const getConfig = require('./webpack/getConfig')

const isProd = process.env.NODE_ENV === 'production'
const isMain = require.main === module
const options = isProd ? null : require('./server/config')

let target
let info

function resolve (...name) {
    return path.resolve(__dirname, ...name)
}

try {
    target = require('../xg-tpl-src/src/compiler') // eslint-disable-line
    info = require('../xg-tpl-src/src/config.json') // eslint-disable-line
} catch (e) {
    console.log(chalk.red('Error: src/[compiler.js | config.json] 文件不存在'))
    process.exit(0)
}

function compiler (config, hooks) {
    const packer = webpack(config)
    const std = (err, stats) => {
        if (err) {
            console.error(err)
            return
        }

        if (!isProd) {
            server.active ? server.reload() : server.init(options)
        }

        console.log(stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true // 在控制台展示颜色
        }))

        hooks(stats)
    }
    if (isProd || !isMain) {
        packer.run(std)
    } else {
        packer.watch({
            ignored: /node_modules/
        }, std)
    }
}

async function starter (type) {
    if (isMain && isProd) {
        const confirm = await myInquirer.confirm(`确认开始构建: ${process.env.NODE_ENV} ${info.name} ${target.use}?`)

        if (!confirm) {
            process.exit(0)
        }
    }

    if (isProd && info.type !== 'page') {
        console.log(chalk.red('当前src目录不是page类型！'))
        process.exit(0)
    }

    const filename = info.name
    const config = getConfig(target.use, {
        filename,
        dllVer: target.dll,
        vendorVer: target.vendor,
        platform: target.platform
    }, info.app)

    await ensureDir(resolve('../dist'))
    await emptyDir(resolve('../dist'))

    const getPaths = s => {
        const arr = []
        if (Array.isArray(config)) {
            arr.push(s['pc'])
            arr.push(s['mobile'])
        } else if (target.use === 'pure') {
            arr.push(s[target.platform])
        } else {
            arr.push(s[target.use])
        }
        return arr
    }

    const callback = () => {
        const s = PUBLIC.SEVER
        const pathArr = []
        if (type === 'videochat' || !type) {
            pathArr.push(...getPaths(s['videochat']))
        } else if (type === 'social') {
            pathArr.push(...getPaths(s['social']))
        } else {
            pathArr.push(...getPaths(s['videochat']))
            pathArr.push(...getPaths(s['social']))
        }

        const log = msg => console.log(chalk.blue(msg))
        log('\n')
        pathArr.map(p => log(`Public url: ${p + filename}.html`))
        log('\n')

        if (!isProd) {
            const getLocalUrl = p => p.replace(/(\w+\.\w+)(\/)/, `$1:${options.port}$2`)
            pathArr.map(p => log(`Local url: ${getLocalUrl(p) + filename}.html`))
        }
    }

    if (isMain) {
        compiler(config, callback)
    } else {
        return new Promise((resolve, reject) => {
            compiler(config, () => {
                callback()
                resolve()
            })
        })
    }
}

async function main (type) {
    try {
        await starter(type)
    } catch (e) {
        console.log(chalk.red(e))
        console.log(chalk.red('请确认错误类型，若为配置错误，请查看相关文档。若为代码缺陷，请提交至git issue fix后使用。'))
    }
}

if (isMain) {
    main()
} else {
    module.exports = starter
}
