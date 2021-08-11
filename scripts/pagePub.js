/**
 * 页面发布脚本
 */
require('./helpers/init')()

const path = require('path')
const myInquirer = require('./helpers/inquirer')
const chalk = require('chalk')
const ora = require('ora')()
const fse = require('fs-extra')
const glob = require('glob')
const { pub2Test, pub2Trunk } = require('./helpers/publish')

let target
let info

function resolve (...name) {
    return path.resolve(__dirname, ...name)
}

try {
    target = require('../xg-tpl-src/src/compiler')
    info = require('../xg-tpl-src/src/config.json')
} catch (e) {
    console.log(chalk.red('Error: src/[compiler.js | config.json] 文件不存在'))
    process.exit(0)
}

/* 测试结点 */
const HTML_SERVER_ROOT = {
    videochat: '/var/www/videochat/web/html',
    social: '/var/www/make_friends/web/html'
}
const HTML_DIR = {
    mobile: 'mobile/dist/vmaker/',
    pc: 'pc/dist/vmaker/'
}
const STATIC_SERVER_DIR = '/var/www/static_guojiang_tv/vmaker'

/* trunk结点 */
const TRUNK = resolve('../.trunk')
const HTML_TRUNK_DIR = {
    videochat: 'videochat/web/html',
    social: 'social-html'
}
const STATIC_TRUNK_DIR = 'static/vmaker'

async function pubEnv (env, files, dest, type) {
    if (!dest) {
        console.log(chalk.red('目标路劲未指定'))
        process.exit(0)
    }
    if (env === 'test') {
        await pub2Test(files, dest, type)
    } else if (env === 'trunk') {
        await pub2Trunk(files, dest)
    }
}

async function pubHTML (env, pt, type) {
    const ptRoot = `../dist/${pt}`

    // 1. html
    const htmlsRoot = resolve(ptRoot, 'html')
    const htmls = glob.sync(htmlsRoot + '/**/*').map(fpath => {
        return {
            path: fpath,
            dir: path.join(HTML_DIR[pt], path.dirname(path.relative(htmlsRoot, fpath)))
        }
    })

    if (env === 'test') {
        if (HTML_SERVER_ROOT[type]) {
            await pubEnv(env, htmls, HTML_SERVER_ROOT[type], type)
        } else {
            await pubEnv(env, htmls, HTML_SERVER_ROOT['videochat'], 'videochat')
            await pubEnv(env, htmls, HTML_SERVER_ROOT['social'], 'social')
        }
    } else if (env === 'trunk') {
        const trunk = await fse.readFile(TRUNK, { encoding: 'utf8' })
        if (HTML_TRUNK_DIR[type]) {
            await pubEnv(env, htmls, path.resolve(trunk, HTML_TRUNK_DIR[type]))
        } else {
            await pubEnv(env, htmls, path.resolve(trunk, HTML_TRUNK_DIR['videochat']))
            await pubEnv(env, htmls, path.resolve(trunk, HTML_TRUNK_DIR['social']))
        }
    }
}

async function pubStatic (env, pt, type) {
    const ptRoot = `../dist/${pt}`
    // 2.1 images
    const imagesRoot = resolve(ptRoot, 'images')
    const images = glob.sync(imagesRoot + '/**/*').map(fpath => {
        return {
            path: fpath,
            // images 需要带目录 (构建目录已有，所以这里不用写)
            dir: path.join(`${pt}/images/`, path.dirname(path.relative(imagesRoot, fpath)))
        }
    })
    // 2.2 css
    const cssRoot = resolve(ptRoot, 'style')
    const css = glob.sync(cssRoot + '/**/*').map(fpath => {
        return {
            path: fpath,
            // css 不需要带项目目录
            dir: path.join(`${pt}/style/`, path.dirname(path.relative(cssRoot, fpath)))
        }
    })
    // 2.3 js
    const jsRoot = resolve(ptRoot, 'js')
    const js = glob.sync(jsRoot + '/**/*').map(fpath => {
        return {
            path: fpath,
            // js 不需要带项目目录
            dir: path.join(`${pt}/js/`, path.dirname(path.relative(jsRoot, fpath)))
        }
    })

    let dest
    if (env === 'test') {
        dest = STATIC_SERVER_DIR
    } else if (env === 'trunk') {
        const trunk = await fse.readFile(TRUNK, { encoding: 'utf8' })
        dest = path.resolve(trunk, STATIC_TRUNK_DIR)
    }
    await pubEnv(env, [...images, ...css, ...js], dest, type)
}

async function pubProxy (env, type) {
    if (await fse.exists(resolve('../dist/mobile'))) {
        await pubHTML(env, 'mobile', type)
        await pubStatic(env, 'mobile', type)
    }

    if (await fse.exists(resolve('../dist/pc'))) {
        await pubHTML(env, 'pc', type)
        await pubStatic(env, 'pc', type)
    }
}

async function pubTest (type) {
    ora.start(`[Publish to test] 开始发布文件...`)
    await pubProxy('test', type)
    ora.succeed(`[Publish to test] 发布文件成功!`)
}

async function initTrunk () {
    // await
    let isexist = await fse.exists(TRUNK)
    if (isexist) return

    const trunkDir = await myInquirer.input('请输入本地trunk路径: ')
    isexist = await fse.exists(trunkDir)
    if (!isexist) {
        console.log(chalk.red('输入的路径 无效!'))
        process.exit(0)
    }
    await fse.writeFile(TRUNK, trunkDir)
}

// 发布线上trunk
async function pubTrunk (type) {
    // await
    await initTrunk()

    const trunk = await fse.readFile(TRUNK, { encoding: 'utf8' })
    if (!await fse.exists(trunk)) {
        console.log(chalk.red('.trunk配置中的路径无效! 请修改确认后再发布'))
        process.exit(0)
    }

    ora.start(`[Publish to trunk] 开始拷贝文件...`)
    await pubProxy('trunk', type)
    ora.succeed('[Publish to trunk] 拷贝文件成功！请到trunk目录确认并提交文件！')
}

async function starter () {
    const start = await myInquirer.confirm(`确认开始发布: ${info.name} ${target.use}?`)

    if (!start) {
        process.exit(0)
    }

    if (info.type !== 'page') {
        console.log(chalk.red('当前src目录不是page类型！'))
        process.exit(0)
    }

    const env = await myInquirer.list('请选择发布环境', ['test', 'trunk'])

    const type = await myInquirer.list('请选择发布类型', ['videochat', 'social', 'both'])

    ora.start('开始构建...')
    const packer = require('./pack')
    await packer(type)
    ora.succeed('构建成功!')

    env === 'test' ? pubTest(type) : pubTrunk(type)
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
