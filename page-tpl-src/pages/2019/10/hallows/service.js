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
    return axios.get('/Hallo2019/init')
        .then(apiHandler)
        .then(dataHandler)
}

// 榜单
export function getRank (type, page) {
    return axios.get('/Hallo2019/ranks', {
        params: {
            type, page, pageRows: 15
        }
    }).then(apiHandler).then(dataHandler)
}

// 购买商品
export function buyProduct (num) {
    return axios.get('/Hallo2019/buyProduct', {
        params: {
            pid: 1992,
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
