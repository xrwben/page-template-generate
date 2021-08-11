const fs = require('fs')
const resolve = (name) => require('path').resolve(__dirname, name)

const ADDR = ['广州', '沈阳', '南京', '武汉', '成都', '西安', '大连', '长春', '哈尔滨', '济南', '青岛', '杭州', '宁波', '厦门', '深圳']
const TATTO = [
    '欢迎来看我的直播哦',
    '你可以拥有爱，但不要执着，因为分离是必然的。',
    '有人说，爱让一男人低声下气，爱让一男人失去自己。',
    '欢迎来看我的直播哦',
    '人生有三样东西不可挽回：时间，机遇，以及说出去的话。',
    '很快乐、请不要再说爱我，我已经把失去的当成了一种收获。',
    '欢迎来看我的直播哦',
    '三生有幸',
    '我是你的专属吗？',
    '只管努力，其他的交给天意。',
    '东北的妹子，',
    '欢迎来看我的直播哦',
    '你赢，我陪你君临天下，你输，我陪你东山再起，',
    '陪陪我吧'
]

const BADGE = ['有才华', '美女', '神似明星', '做自己', '骄傲', '有个性', '酷', '爱撒娇']
const HOBBY = ['大保健', '看书', '闲坐', '旅行', '逛街', '聊天', '美食', '宠物', '猫']

const data = require('./data.json')

function getRandomAddr () {
    return ADDR[Math.random() * ADDR.length >> 0]
}

function getRandomTA () {
    return TATTO[Math.random() * TATTO.length >> 0]
}

function getBadge () {
    const ri = []
    const len = BADGE.length
    while (ri.length < 3) {
        const rrr = BADGE[Math.random() * len >> 0]
        if (ri.indexOf(rrr) === -1) {
            ri.push(rrr)
        }
    }
    return ri
}

function getHobby () {
    const ri = []
    const len = HOBBY.length
    while (ri.length < 3) {
        const rrr = HOBBY[Math.random() * len >> 0]
        if (ri.indexOf(rrr) === -1) {
            ri.push(rrr)
        }
    }
    return ri
}

for (var i in data) {
    data[i].address = getRandomAddr()
    data[i].age = ((Math.random() * 8) >> 0) + 18
    data[i].fans = ((Math.random() * 2000) >> 0) + 2000
    data[i].atte = ((Math.random() * 2000) >> 0) + 2000
    data[i].tatto = getRandomTA()
    data[i].badge = getBadge()
    data[i].hobby = getHobby()
}

fs.writeFileSync(resolve('./data.json'), JSON.stringify(data, null, 0))
