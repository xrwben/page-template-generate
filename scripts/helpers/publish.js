/**
 * 发布工具
 */
const SSH2Utils = require('./ssh2utils')
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const PUBLISH_DIR = path.resolve(__dirname, '../../.publish')

const TEST_ENV = require('./secret').test

async function pubDir (env, dir, dest) {
    let client = new SSH2Utils()
    await client.createConn(env)
    await client.putDir(dir, dest)
    client.end()
    client = null
}

// 测试是直接发布到服务器
async function pub2Test (files, dest, type) {
    // 1. 将文件列表移入一个目录下
    if (await fsExtra.exists(PUBLISH_DIR)) {
        await fsExtra.remove(PUBLISH_DIR)
    }
    await fsExtra.ensureDir(PUBLISH_DIR)

    for (let i = 0; i < files.length; i++) {
        let dirDest = PUBLISH_DIR
        if (files[i].dir) {
            dirDest = path.resolve(PUBLISH_DIR, files[i].dir)
            await fsExtra.ensureDir(dirDest)
        }
        dirDest = path.resolve(dirDest, path.basename(files[i].path))
        if (fs.statSync(files[i].path).isFile()) {
            await fsExtra.copyFile(files[i].path, dirDest) // 2. 拷贝文件
        }
    }

    // 2. publish
    if (type === 'social') {
        if (/\/web\/html/.test(dest)) { // html
            await pubDir(TEST_ENV['social'], PUBLISH_DIR, dest)
        } else { // 静态资源
            await pubDir(TEST_ENV['videochat'], PUBLISH_DIR, dest)
        }
    } else {
        await pubDir(TEST_ENV['videochat'], PUBLISH_DIR, dest)
    }

    // 3. delete tmp
    await fsExtra.remove(PUBLISH_DIR)
}

// 线上是发布到本地trunk目录，再手动提交
async function pub2Trunk (files, dest) {
    for (let i = 0; i < files.length; i++) {
        let dirDest = dest
        if (files[i].dir) {
            dirDest = path.resolve(dest, files[i].dir)
            await fsExtra.ensureDir(dirDest) // 1. 确保目录
        }
        dirDest = path.resolve(dirDest, path.basename(files[i].path))
        if (fs.statSync(files[i].path).isFile()) {
            await fsExtra.copyFile(files[i].path, dirDest) // 2. 拷贝文件
        }
    }
}

module.exports = {
    pub2Test,
    pub2Trunk
}
