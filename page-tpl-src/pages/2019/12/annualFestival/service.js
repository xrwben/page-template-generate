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

// 初始化 - 赛程
export function initGames () {
    return axios.get('/anniversary2019S2/initInfo')
        .then(apiHandler)
        .then(dataHandler)
}

// 赛程 所有主播榜单
function getRanks (params) {
    return axios.get('/anniversary2019S2/modRanks', { params })
        .then(apiHandler)
        .then(dataHandler)
}

// 赛程 - 预选赛日榜
export function getPreRanksByDate (date, page, startTime) {
    // const targetDate = ['2019-12-04', '2019-12-05', '2019-12-06', '2019-12-07'][date]
    const st = new Date(startTime.replace(/-/g, '/'))
    st.setTime(st.getTime() + date * 3600000 * 24)

    const targetDate = [st.getFullYear(), st.getMonth() + 1, st.getDate()].join('-')

    if (!targetDate) throw new Error('参数有误')

    return getRanks({
        activityId: 1905,
        date: targetDate,
        page,
        pageRows: 15
    })
}

// 赛程 - 预选赛总榜
export function getPreRanks (page) {
    return getRanks({
        activityId: 1905,
        page,
        pageRows: 15
    })
}

// 赛程 - 单项赛 (晋级赛)
export function getEventRanks (prog, group) {
    const progMap = [
        1892, // n -> 18,
        1902, // 18 -> 15,
        1901, // 18 -> 10,
        1900, // 10 -> 7,
        1899, // 9 -> 4,
        1898 // 4 -> 1
    ]

    const pageRows = [21, 18, 15, 10, 7, 4][prog]

    return getRanks({
        activityId: progMap[prog],
        group,
        pageRows
    })
}

// 赛程 - 超级冠军赛
export function getFinalRanks (prog) {
    const progMap = [
        1896, // 5 -> 3
        1895 // 3 -> 1
    ]
    const pageRows = [5, 3][prog]

    return getRanks({
        activityId: progMap[prog],
        pageRows
    })
}

// 大人物榜
export function getUserRanks () {
    return axios.get('/anniversary2019S2/userTotalRanks')
        .then(apiHandler)
        .then(dataHandler)
}

// 助力票领取信息
export function getTicketInfo () {
    return axios.get('/anniversary2019S2/userTickets')
        .then(apiHandler)
        .then(dataHandler)
}

// 领取助力票
export function drawTicket (type) {
    return axios.get('/anniversary2019S2/getTicket', {
        params: { type }
    }).then(apiHandler).then(dataHandler)
}

// 所有赛道主播 第一页数据
export function getAllGroups () {
    return axios.get('/anniversary2019S2/allGroupMod')
        .then(apiHandler)
        .then(dataHandler)
}

// 赛道报名
export function signGroup (group) {
    return axios.get('/anniversary2019S2/enroll', {
        params: {
            group
        }
    }).then(apiHandler).then(dataHandler)
}

// 单个赛道
export function getAllByGroup (groupId) {
    return axios.get('/anniversary2019S2/groupMod', {
        params: {
            groupId,
            page: 0,
            pageRows: 21
        }
    }).then(apiHandler).then(dataHandler)
}

// 竞猜数据
export function getBets () {
    return axios.get('/Anniversary2019S2/guessData')
        .then(apiHandler)
        .then(dataHandler)
}

// 我的竞猜
export function getMyBets (page) {
    return axios.get('/Anniversary2019S2/myGuess', {
        params: {
            page
        }
    }).then(apiHandler).then(dataHandler)
}

// 参与竞猜
export function makeBets (bid, betOp, num) {
    return axios.get('/Anniversary2019S2/guessJoin', {
        params: {
            id: bid,
            option: betOp,
            num: num
        }
    }).then(apiHandler).then(dataHandler)
}

// 竞猜榜
export function getBetRanks () {
    return axios.get('/Anniversary2019S2/guessRank')
        .then(apiHandler)
        .then(dataHandler)
}

// 霸屏历史
export function getScreenHis () {
    return axios.get('/Anniversary2019S2/holdRecord', {
        params: {
            page: 0,
            pageRows: 50
        }
    }).then(apiHandler).then(dataHandler)
}

// 正在霸屏
export function getNowScreen () {
    return axios.get('/Anniversary2019S2/holdScreen')
        .then(apiHandler)
        .then(dataHandler)
}
