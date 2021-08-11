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
    return axios.get('/doubleEleven/init')
        .then(apiHandler)
        .then(dataHandler)
}

// 购物车清空记录
export function getCartRecord (pageNo) {
    return axios.get('/doubleEleven/shoppingCartRecord', {
        params: {
            page: pageNo,
            pageRows: 15
        }
    }).then(apiHandler).then(dataHandler)
}

// 队伍PK进度条
export function getPkInfo () {
    return axios.get('/doubleEleven/teamPkInfo')
        .then(apiHandler)
        .then(dataHandler)
}

// 主播榜单
export function getRanks (type, page) {
    return axios.get('/doubleEleven/ranks', {
        params: {
            page,
            pageRows: 15,
            type: 2,
            team: type // 1 -> 秀恩爱 2 -> 买买买
        }
    }).then(apiHandler).then(dataHandler)
}

// 礼物榜单
export function getGiftRanks () {
    return axios.get('/doubleEleven/ranks', {
        params: {
            type: 1
        }
    }).then(apiHandler).then(dataHandler)
}

// 关注
export function attend (mid) {
    return axios.get('/chenChen/attention', {
        params: {
            mid: mid
        }
    }).then(apiHandler).then(dataHandler)
}
