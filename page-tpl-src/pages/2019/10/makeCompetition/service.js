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
    return axios.get('/fightToEnd/init')
        .then(apiHandler)
        .then(dataHandler)
        .then(data => {
            let stage = data.activityStatus
            if (data.activityStatus === 2) {
                const now = new Date(data.serverTime.replace(/-/g, '/'))
                const hour = now.getHours()

                // 计算距离开始时间多久 12h - 36h
                if (hour < 12) {
                    stage = 2
                } else if (hour < 18) {
                    stage = 3
                } else if (hour < 21) {
                    stage = 4
                } else {
                    stage = 5
                }
            }
            if (data.activityStatus === 3) {
                stage = 5 + data.stage3SubStage
            }
            if (data.activityStatus === 4) {
                stage = 10
            }

            return {
                islogin: data.isLogin,
                isMod: data.isMod,
                stage: stage // 0 未开始 1 晋级赛前置 2 晋级赛(2 3 4 5) 3 擂台赛 (6, 7, 8, 9) 10 已结束
            }
        })
}

// 闯关详情
export function getGKInfo () {
    return axios.get('/fightToEnd/ranks', {
        params: {
            stage: 1
        }
    }).then(apiHandler).then(dataHandler).then(data => {
        const result = {
            gk: 0,
            gkValue: 0,
            counter: 0,
            isThrough: false
        }
        data.forEach((gkItem) => {
            if (gkItem.isCurrentSubStage) {
                result.gk = gkItem.subStage - 1
                result.gkValue = gkItem.currentScore
            }
            if (gkItem.subStage === 4) {
                result.counter = gkItem.subStageModsNum
            }
            if (gkItem.subStage === 6 && gkItem.scoreLeft === 0) {
                result.gk = 5
                result.gkValue = 100000
                result.isThrough = true
            }
        })
        return result
    })
}

// 获取晋级主播
export function getPromIn () {
    return axios.get('/fightToEnd/stage3Mods')
        .then(apiHandler)
        .then(dataHandler)
}

// 获取晋级赛主播榜
export function getPromInRank () {
    return axios.get('/fightToEnd/ranks', {
        params: {
            stage: 2,
            type: 2
        }
    }).then(apiHandler).then(dataHandler)
}

// 获取用户榜
export function getUserRank () {
    return axios.get('/fightToEnd/ranks', {
        params: {
            stage: 2,
            type: 1
        }
    }).then(apiHandler).then(dataHandler)
}

// 获取争霸赛主播榜
export function getPkRank (subStage) {
    if (!subStage) return Promise.reject(new Error('参数错误'))
    return axios.get('/fightToEnd/ranks', {
        params: {
            stage: 3,
            subStage
        }
    }).then(apiHandler).then(dataHandler)
}
