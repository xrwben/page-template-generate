// api service
import axios from 'axios'

function apiHandler (res) {
    if (res.status === 200) {
        return res.data
    } else {
        console.error('[service.apiHandler]:', res.message)
        throw new Error(res.message)
    }
}

function dataHandler (data) {
    if (data.errno === 0) {
        return data.data
    } else {
        console.error('[service.dataHandler]:', data.msg)
        throw new Error(data.msg)
    }
}

// 初始化接口
export function init () {
    return axios.get('/thanks2019/init')
        .then(apiHandler)
        .then(dataHandler)
}

// 榜单 (主播日榜及总榜)
export function getModRank (date, page) {
    const params = {
        page: page,
        pageRows: 15
    }
    if (date === -1) {
        params.type = 'mod'
    } else {
        params.type = 'daily'
        params.date = date
    }
    return axios.get('/thanks2019/ranks', {
        params
    }).then(apiHandler).then(dataHandler)
}

// 榜单 (用户总榜)
export function getUserRank (page) {
    return axios.get('/thanks2019/ranks', {
        params: {
            type: 'user',
            page,
            pageRows: 15
        }
    }).then(apiHandler).then(dataHandler)
}

// 购买商品
export function buyProduct (num) {
    return axios.get('/thanks2019/buyProduct', {
        params: {
            pid: 1991,
            num
        }
    }).then(apiHandler)
}

// 关注
export function attend (mid) {
    return axios.get('/chenChen/attention', {
        params: {
            mid: mid
        }
    }).then(apiHandler).then(dataHandler)
}

// 抽奖 | 开启福袋
export function lottery () {
    return axios.get('/thanks2019/lottery')
        .then(apiHandler)
        // .then(dataHandler)
}

// 中奖记录
export function getRwRecord () {
    return axios.get('/thanks2019/LotteryRecord')
        .then(apiHandler)
        .then(dataHandler)
}

// 搜索用户
export function searchUser (uid) {
    return axios.get('/thanks2019/search', {
        params: {
            uid
        }
    }).then(apiHandler).then(dataHandler)
}

// thk ranks
export function getThkRank () {
    return axios.get('/thanks2019/ThanksRank')
        .then(apiHandler)
        .then(dataHandler)
}

// send thk
export function sendThks (toUid, num) {
    return axios.get('/thanks2019/SendThanks', {
        params: {
            toUid, num
        }
    }).then(apiHandler)
}
