/**
 * CSS Sprite Processor
 */
require('./helpers/init')()
const chalk = require('chalk')
const myInquirer = require('./helpers/inquirer')
const fse = require('fs-extra')
const path = require('path')
const spritesmith = require('spritesmith')

const resolve = (...args) => {
    return path.resolve(__dirname, ...args)
}

const IMAGEDIST = resolve('../xg-tpl-src/src/.images')

function getSprites (images, filename) {
    return new Promise((resolve, reject) => {
        spritesmith.run({
            src: images,
            padding: 10
        }, (err, result) => {
            if (err) reject(err)

            // 写入文件
            fse.writeFile(path.resolve(IMAGEDIST, filename + '.png'), result.image).then(() => {
                resolve({
                    cor: result.coordinates,
                    prop: result.properties
                })
            }).catch(err => {
                reject(err)
            })
        })
    })
}

async function getDirImages (dir, deepCb) {
    const files = await fse.readdir(dir)
    const len = files.length
    const images = []
    for (let i = 0; i < len; i++) {
        const imagePath = path.resolve(dir, files[i])
        const stat = await fse.stat(imagePath)
        if (stat.isFile()) {
            images.push(imagePath)
        }
        if (deepCb && stat.isDirectory()) {
            await deepCb(imagePath)
        }
    }
    return images
}

async function dirPicSprite (dir) {
    const images = await getDirImages(dir)
    const filename = path.basename(dir)
    const data = await getSprites(images, filename)
    return data
}

function getCSSTpl ({ cor, prop }, name) {
    const imgStr = Object.keys(cor).map((file) => {
        const filename = path.basename(file, '.png')
        return `.${filename} { .getSprite(${cor[file].width}, ${cor[file].height}, ${cor[file].x}, ${cor[file].y}); }`
    }).join('\r\n    ')

    return `.set_${name}_sprite () {
        .${name}-s {
            background: url('./images/${name}.png') no-repeat;
            background-size: ${prop.width}/@bf ${prop.height}/@bf;
            font-size: 0px;
            display: block;
        }
        ${imgStr}
    }
    .set_${name}_sprite();`
}

async function starter () {
    const sdir = resolve('../xg-tpl-src/src/sprite')
    const dirExist = await fse.exists(sdir)
    if (!dirExist) {
        console.log(chalk.info('无 sprite 目标目录'))
    }

    await fse.ensureDir(IMAGEDIST)

    const spriteData = [`.getSprite (@w, @h, @posx, @posy) {
        background-position: (@posx * -1)/@bf (@posy * -1)/@bf;
        width: @w/@bf;
        height: @h/@bf;
    }`]

    const images = await getDirImages(sdir, async (dir) => {
        const data = await dirPicSprite(dir)
        spriteData.push(getCSSTpl(data, path.basename(dir)))
    })

    if (images.length !== 0) {
        const data = await getSprites(images, 'sprite')
        spriteData.push(getCSSTpl(data, 'sprite'))
    }

    await fse.writeFile(resolve('../xg-tpl-src/src/sprite.less'), spriteData.join('\r\n\r\n'))
}

async function main () {
    if (!await myInquirer.confirm(`确认开始 处理 ${chalk.green('CSS Spirte')} ?`)) {
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
