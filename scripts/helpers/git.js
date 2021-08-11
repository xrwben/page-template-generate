/**
 * promisify simple git api & full with logic
 * 集中监控git操作
 */

const path = require('path')
const simpleGit = require('simple-git/promise')

const gitXGTPL = simpleGit(path.resolve(__dirname, '../../'))
const gitSRC = simpleGit(path.resolve(__dirname, '../../xg-tpl-src/'))

exports.use = function (type) {
    if (type === 'XGTPL') {
        return gitXGTPL
    }

    if (type === 'XGSRC') {
        return gitSRC
    }
}

exports.gitXGTPL = gitXGTPL
exports.gitSRC = gitSRC

exports.pull = async function pull (ins, remote, branch, options) {
    const remotes = await ins.getRemotes(true)
    if (remotes.length !== 0) { // 远程分支存在 才需要拉
        await ins.silent(false).pull(remote, branch, options)
    }
}

exports.getUserInfo = async function getUserInfo (ins) {
    const name = await ins.raw([
        'config',
        '--global',
        '--get',
        'user.name'
    ])
    const email = await ins.raw([
        'config',
        '--global',
        '--get',
        'user.email'
    ])
    return {
        author: name.trim(),
        email: email.trim()
    }
}
