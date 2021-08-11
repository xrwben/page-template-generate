import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const service = {
    apiHandler (res) {
        if (res.status === 200) {
            return res.data
        } else {
            console.error('[service.apiHandler]:', res.message)
            throw new Error(res.message)
        }
    },
    dataHandler (data) {
        if (data.errno === 0) {
            return data.data
        } else {
            console.error('[service.dataHandler]:', data.msg)
            throw new Error(data.msg)
        }
    },
    init () {
        return axios.get('/nationalDay2019/init').then(this.apiHandler).then(this.dataHandler)
    },
    sign () {
        return axios.get('/nationalDay2019/sign').then(this.apiHandler)
    },
    getRecord () {
        return axios.get('/nationalDay2019/signRecords').then(this.apiHandler).then(this.dataHandler)
    }
}

const Timer = {
    runAni: null,
    ticktock: null
}

function kCalc (num) {
    if (typeof num !== 'number') return num
    if (num > 999999) {
        return ((num / 1000) >> 0) / 10 + 'w'
    }
    if (num > 99999) {
        return ((num / 100) >> 0) / 10 + 'k'
    }
    return num
}

const CommonMixin = {
    components: {
        Loading, Toast
    },
    data: {
        perType: 0, // 1 -> 果汁 2 -> 甜蜜

        ruleModal: false,
        tiperModal: false,
        chargeModal: false,
        recordModal: false,

        stage: 0, // 0 未开始 1/2 进行中 3 已结束
        islogin: false,
        isSign: false,
        awardTime: 0, // 剩余时间
        markTime: 0, // 接口返回的时间点
        totalMoney: '--', // 当前总额
        avgMoney: '--', // 昨天平均瓜分
        isLast: false, // 是否是最后一天

        signedMan: 0, // 已打卡人数
        signedName: ['--'], //

        recordPay: 0,
        recordAward: 0,
        records: [-1, -1, -1, -1, -1, -1, -1, -1, -1]
    },
    computed: {
        perClass () {
            switch (this.perType) {
            case 1: return '_2'
            case 2: return '_3'
            default: return ''
            }
        },
        perName () {
            switch (this.perType) {
            case 1: return '果汁'
            case 2: return '甜蜜'
            default: return '克拉'
            }
        },
        tmAvgRewards () {
            if (this.stage <= 1) {
                return '昨日人均瓜分--克拉'
            } else {
                return '昨日人均瓜分' + kCalc(this.avgMoney) + this.perName
            }
        }
    },
    created () {
        if (this.pageType === 'pc') return
        const platform = common.getPlatformType() // eslint-disable-line
        if (platform !== 'ios_webview') {
            return
        }

        const per = common.getPackageId() // eslint-disable-line
        if (per === '8') {
            this.perType = 1
            return
        }
        if (per === '12') {
            this.perType = 2
            return
        }

        this.perType = 0
    },
    mounted () {
        this.showLoading()
        this.init().catch(err => {
            this.showToast(err)
        }).then(() => {
            this.hideLoading()
        })
    },
    methods: {
        showLoading () {
            this.$refs.loading.show()
        },
        hideLoading () {
            this.$refs.loading.hide()
        },
        showToast (msg) {
            this.$refs.toast.show(msg.replace(/克拉/g, this.perName))
        },
        closeM (modal) {
            if (!modal || this[modal] === undefined) return

            this[modal] = false
        },
        showRule () {
            this.ruleModal = true
        },
        runAni () {
            if (Timer.runAni) {
                clearTimeout(Timer.runAni)
                Timer.runAni = null
            }
            const boards = this.$refs.boards
            const itemH = boards.getElementsByClassName('name-i')[0].getBoundingClientRect().height
            const len = this.signedName.length
            let boardY = 0
            let ind = 0

            function ani () {
                boardY -= itemH
                ind++
                boards.style.transform = `translateY(${boardY}px)`
                boards.style.transition = 'all 0.8s ease-in-out'

                if (ind === len) {
                    boardY = 0
                    ind = 0
                    setTimeout(() => {
                        boards.style.transition = 'none'
                        boards.style.transform = `translateY(0px)`
                    }, 800)
                    Timer.runAni = setTimeout(ani, 2000)
                } else {
                    Timer.runAni = setTimeout(ani, 2000)
                }
            }

            ani()
        },
        startCounting () {
            if (Timer.ticktock) {
                clearTimeout(Timer.ticktock)
                Timer.runAni = null
            }
            const target = this.isLast ? this.$refs['counting-last'] : this.$refs.counting
            const markTime = this.markTime
            const awardTime = this.awardTime

            function getHMS (time) {
                const hours = time / 3600 >> 0
                const mins = (time % 3600) / 60 >> 0
                const ss = time % 60

                return [
                    hours < 10 ? '0' + hours : hours,
                    mins < 10 ? '0' + mins : mins,
                    ss < 10 ? '0' + ss : ss
                ]
            }

            function ticktock () {
                const delta = (Date.now() - markTime) / 1000 >> 0 // s
                const left = awardTime - delta

                if (left <= 0) { // 倒计时结束
                    location.reload()
                    return
                }

                target.innerText = getHMS(left).join(':')

                Timer.ticktock = setTimeout(ticktock, 1000)
            }

            ticktock()
        },
        init () {
            return service.init().then(data => {
                this.stage = data.isActivity
                this.islogin = data.isLogin
                this.isSign = data.isSign
                this.awardTime = data.awardTime
                this.markTime = Date.now()
                this.totalMoney = data.totalMoney
                this.avgMoney = data.avgMoney
                this.isLast = data.isLast

                this.signedMan = data.signNum
                this.signedName = data.nickname.length === 0 ? ['--'] : data.nickname

                if (this.signedName.length > 1) {
                    this.runAni()
                }

                if (this.isLast) {
                    // 最后十分钟
                    if (this.awardTime < 600) {
                        this.stage = 3
                    } else {
                        this.awardTime -= 10 * 60
                    }
                }

                if (this.stage < 3 && this.isSign) {
                    this.$nextTick(() => {
                        this.startCounting()
                    })
                }
            })
        },
        goSign () {
            if (!this.islogin) return this.goLogin()

            if (this.isSign) {
                if (this.isLast) {
                    this.showToast(`您已成功打卡，今日23:50:01-23:59:59结算瓜分${this.perName}。`)
                } else {
                    this.showToast(`今日已成功打卡，明天记得来打卡瓜分${this.perName}哟~`)
                }
                return
            }

            // 不是最后一天 询问扣费
            if (!this.isLast) {
                // 计算是否是最后十分钟
                const delta = (Date.now() - this.markTime) / 1000 >> 0 // s
                const left = this.awardTime - delta
                if (left < 600) {
                    this.showToast('系统结算中')
                    return
                }

                this.tiperModal = true
                return
            }

            // 是最后一天 -> 直接签到
            this.confirmSign()
        },
        confirmSign () {
            this.showLoading()
            service.sign().then((res) => {
                this.hideLoading()
                this.tiperModal = false

                if (res.errno === 1008) {
                    // 余额不足
                    this.chargeModal = true
                    return
                }

                if (res.errno !== 0) {
                    this.showToast(res.msg)
                    return
                }

                this.showToast(res.msg)

                this.showLoading()
                return this.init().catch(err => {
                    this.showToast(err)
                }).then(() => {
                    this.hideLoading()
                })
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        showMyRecord () {
            if (!this.islogin) return this.goLogin()

            this.recordModal = true
            this.showLoading()
            service.getRecord().then(data => {
                this.hideLoading()

                this.recordPay = data.pay
                this.recordAward = data.award
                this.records = data.records.concat(this.records.slice(data.records.length))
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        }
    }
}

export default CommonMixin
