import axios from 'axios'
// import $ from 'jquery'
// import '../../packages/niceScroll.js'
import SvgPlayer from '../shared/components/SvgPlayer.vue'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const CommonMixin = {
    components: {
        SvgPlayer, Loading, Toast
    },
    data: {
        // 初始化信息
        isLogin: false,
        activityStatus: 1,
        isMod: true,
        // 霸屏 倒计时
        showBpRule: false,
        nowHoldScreen: null,
        passTime: 0,
        countdownTimer: null,
        nowTimer: null,
        historyHoldScreen: [],
        // 限定礼物tab、弹窗
        currentGift: 'christmas',
        showXdBuyPopup: false,
        giftNumber: 1,
        giftTotalPrice: 9999,
        purchaseStep: 1,
        // 榜单 1：主播；2：用户
        currentRank: 'christmas',
        rankType: 1,
        rankList: [],
        myRank: null,
        // 祝福墙
        wishWallList: [],
        // 活动弹窗 弹窗tab christmas newyear
        showRulePopup: false,
        rulePopupType: 'christmas'
    },
    computed: {
        giftPer () {
            if (this.pageType === 'pc') {
                return '克拉'
            }
            const platform = common.getPlatformType() // eslint-disable-line
            if (platform === 'ios_webview') {
                const per = common.getPackageId() // eslint-disable-line
                if (per === '11') {
                    return '花瓣'
                }
                if (per === '12') {
                    return '甜蜜'
                }
                return '克拉'
            }
            return '克拉'
        }
    },
    created () {
        this.init()
        this.getHistoryHoldScreen()
        this.getWishWallData()
    },
    mounted () {
        // $('.rank-scroller, .rule-scroller').niceScroll({
        //     cursorwidth: 6,
        //     cursorcolor: 'rgba(255, 255, 255, 0.5)', // 设置滚动条滑块的颜色
        //     cursorborder: 'none', // CSS方式定义滚动条边框颜色
        //     autohidemode: false,
        //     cursorfixedheight: 40,
        //     horizrailenabled: false,
        //     hwacceleration: true,
        //     railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
        //     zindex: 1
        // })
    },
    updated () {
        this.$nextTick(() => {
            const historyRollupHoldscreenDom = document.querySelectorAll('.history-rollup-holdscreen')
            const wishRollupWallDom = document.querySelectorAll('.wish-rollup-wall')
            console.log(historyRollupHoldscreenDom, wishRollupWallDom)
            if (this.historyHoldScreen.length > 4) {
                historyRollupHoldscreenDom.forEach(item => {
                    item.style = `animation: holdScreenRowUp ${this.historyHoldScreen.length}s linear infinite`
                })
            }
            if (this.wishWallList.length > 5) {
                wishRollupWallDom.forEach(item => {
                    item.style = `animation: wishWallRowUp ${this.wishWallList.length}s linear infinite`
                })
            }
        })
    },
    watch: {
        // 'this.historyHoldScreen' (newVal, oldVal) {
        //     console.log('数据是否更新了：', newVal.length !== oldVal.length)
        // }
    },
    beforeDestroy () {
        this.nowTimer && clearTimeout(this.nowTimer)
        this.countdownTimer && clearTimeout(this.countdownTimer)
    },
    methods: {
        // 初始化数据
        init () {
            axios.get('/christmas2019/initInfo').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.activityStatus = resData.activityStatus
                    // this.activityStatus = -1
                    // 限定显示当前
                    this.currentGift = [0, 1, 3].includes(this.activityStatus) ? 'christmas' : 'newyear'
                    // 当前活动规则
                    this.rulePopupType = [0, 1, 3].includes(this.activityStatus) ? 'christmas' : 'newyear'
                    // 获取当前榜单
                    this.currentRank = [0, 1, 3].includes(this.activityStatus) ? 'christmas' : 'newyear'
                    this.getNowHoldScreen()
                    this.getRankData()
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 正在霸屏 只有活动期间才霸屏
        getNowHoldScreen () {
            if (![1, 2].includes(this.activityStatus)) {
                this.nowTimer && clearTimeout(this.nowTimer)
                return
            }
            this.nowTimer && clearTimeout(this.nowTimer)
            // console.log('this.nowTimer>>>>>>>', this.nowTimer)
            axios.get('/christmas2019/holdScreen').then(res => {
                if (res.data.errno === 0) {
                    // 如果当前霸屏存在 且和请求的服务器时间不一致 则说明有新的霸屏
                    if (this.nowHoldScreen && res.data.data && this.nowHoldScreen.holdTime !== res.data.data.holdTime) {
                        this.getHistoryHoldScreen()
                    }
                    this.nowHoldScreen = res.data.data
                    this.passTime = Date.now()
                    // console.log('this.passTime>>>>>>', this.passTime)
                    if (this.nowHoldScreen) {
                        this.startCountDown()
                    }
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.nowTimer = setTimeout(() => {
                    this.getNowHoldScreen()
                }, 5000)
            })
        },
        // 倒计时
        startCountDown () {
            // 数据不存在了就不轮询了
            if (!this.nowHoldScreen) {
                return
            }
            // 先清除之前的倒计时实例
            // this.countdownTimer
            this.countdownTimer && clearTimeout(this.countdownTimer)
            // console.log('this.countdownTimer >>>>>>>>>', this.countdownTimer)
            const pass = (Date.now() - this.passTime) / 1000 >> 0
            const endTime = this.nowHoldScreen.endTime - pass
            console.log(this.passTime)
            console.log(Date.now() - this.passTime)
            if (endTime < 0) {
                this.$refs.countdown.innerHTML = ''
                this.getHistoryHoldScreen()
                return
            }
            let min = endTime / 60 >> 0
            let sec = endTime % 60 >> 0
            min = min < 10 ? '0' + min : min
            sec = sec < 10 ? '0' + sec : sec
            this.$refs.countdown.innerHTML = min + ':' + sec
            this.countdownTimer = setTimeout(() => {
                console.log('正在倒计时', min + ':' + sec)
                this.startCountDown()
            }, 1000)
        },
        // 历史霸屏
        getHistoryHoldScreen () {
            axios.get('/christmas2019/holdRecord').then(res => {
                if (res.data.errno === 0) {
                    this.historyHoldScreen = res.data.data
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // rowScollUp () {
        //     this.$nextTick(() => {
        //         const historyRollupHoldscreenDom = document.querySelectorAll('.history-rollup-holdscreen')
        //         const wishRollupWallDom = document.querySelectorAll('.wish-rollup-wall')
        //         console.log(historyRollupHoldscreenDom, wishRollupWallDom)
        //         if (this.historyHoldScreen.length > 4) {
        //             historyRollupHoldscreenDom.forEach(item => {
        //                 item.style = `animation: holdScreenRowUp ${this.historyHoldScreen.length}s linear infinite`
        //             })
        //         }
        //         if (this.wishWallList.length > 6) {
        //             wishRollupWallDom.forEach(item => {
        //                 item.style = `animation: wishWallRowUp ${this.wishWallList.length}s linear infinite`
        //             })
        //         }
        //     })
        // },
        // 双旦限定tab切换
        changeGiftTab (type) {
            if (type === 'newyear') {
                if ([2, -1].includes(this.activityStatus)) {
                    this.currentGift = 'newyear'
                } else {
                    this.$refs.toast.show('2019.12.31 10:00:00开启！')
                }
            } else {
                this.currentGift = 'christmas'
            }
        },
        // 预览
        preview (type) {
            // 金鼠送福 http://static.guojiang.tv/app/gift/pc_animation/4901/data.json
            // 冬日恋歌 http://static.guojiang.tv/app/gift/pc_animation/4903/data.json
            // 99平安果 http://static.guojiang.tv/app/gift/pc_animation/4904_99/data.json
            // 99贺卡 http://static.guojiang.tv/app/gift/pc_animation/4902_99/data.json
            console.log(type)
            let path = ''
            if (this.currentGift === 'christmas') {
                path = type === 1 ? '//static.guojiang.tv/app/gift/pc_animation/4903/data.json' : '//static.guojiang.tv/app/gift/pc_animation/4904_99/data.json'
            } else {
                path = type === 1 ? '//static.guojiang.tv/app/gift/pc_animation/4901/data.json' : '//static.guojiang.tv/app/gift/pc_animation/4902_99/data.json'
            }
            this.$refs.svgPlayer.playSvg(path)
        },
        // 购买-弹窗
        showPurchasePopup () {
            if (this.activityStatus === 0) {
                this.$refs.toast.show('12.24 12:00才可购买！')
            } else if (this.activityStatus === 3) {
                this.$refs.toast.show('圣诞活动已经结束！')
            } else if ([1, 2].includes(this.activityStatus)) {
                this.showXdBuyPopup = true
            }
        },
        // 购买输入控制
        inputRuleReg () {
            this.giftNumber = this.giftNumber.replace(/([^0-9])/g, '')
            if (parseInt(this.giftNumber) <= 0) {
                this.giftNumber = 1
            }
            this.giftTotalPrice = parseInt(this.giftNumber || 0) * 9999
            console.log(typeof this.giftNumber)
        },
        // 确认购买
        confirmPurchase () {
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (!this.giftNumber) {
                this.$refs.toast.show('购买数量不能为空！')
                return
            }
            let path = ''
            let pid = 0
            if (this.activityStatus === 1) {
                path = '/christmas2019/buyProduct'
                pid = 2331
            } else if (this.activityStatus === 2) {
                path = '/newYear2020/buyProduct'
                pid = 2332
            }
            axios.get(path, {
                params: {
                    pid,
                    num: this.giftNumber
                }
            }).then(res => {
                if (res.data.errno === 111) {
                    this.purchaseStep = 2
                } else if (res.data.errno === 0) {
                    this.showXdBuyPopup = false
                    this.$refs.toast.show(res.data.msg)
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 切换榜单(圣诞or元旦)
        changeRankTab (type) {
            if (type === 'newyear') {
                if ([0, 1, 3].includes(this.activityStatus)) {
                    this.$refs.toast.show('2019.12.31 10:00:00开启！')
                    return
                } else {
                    this.currentRank = 'newyear'
                    this.rankType = 1
                }
            } else {
                this.currentRank = 'christmas'
                this.rankType = 1
            }
            this.getRankData()
        },
        // 切换榜单类型（主播or用户）
        changeRankType (type) {
            this.rankType = type
            this.getRankData()
        },
        // 获取榜单数据
        getRankData (type = 1) {
            let path = ''
            if (this.currentRank === 'christmas') {
                path = '/christmas2019/ranks'
            } else if (this.currentRank === 'newyear') {
                path = '/newYear2020/ranks'
            }
            // debugger
            this.$refs.loading.show()
            this.resetRankScroller()
            axios.get(path, {
                params: {
                    type: this.rankType,
                    page: 0,
                    pageRows: 100
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    if (!resData.hasNext && resData.ranks.length < 100) {
                        const len = resData.ranks.length
                        for (let i = len; i < 100; i++) {
                            createList.push({
                                isPlaying: false,
                                nickname: '',
                                score: ''
                            })
                        }
                    }
                    // console.log('createList>>>>>>', createList)
                    this.rankList = resData.ranks.concat(createList)
                    // console.log(this.rankList, 'jdfdfj')
                    this.myRank = res.data.data.myRank
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.$refs.loading.hide()
            })
        },
        // 关注主播
        follow (room) {
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            axios.get('/chenChen/attention', {
                params: {
                    mid: room.id
                }
            }).then(res => {
                const { data } = res
                if (data.errno === 0) {
                    this.getRankData()
                } else {
                    console.log(data.data.msg)
                    this.$refs.toast.show(data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 祝福墙
        getWishWallData () {
            axios.get('/christmas2019/blessingWall').then(res => {
                if (res.data.errno === 0) {
                    this.wishWallList = res.data.data
                    console.log('<<<<<<', this.wishWallList)
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 活动规则弹窗tab
        changeRulePopupTab (type) {
            if (type === 'newyear' && [0, 1, 3].includes(this.activityStatus)) {
                this.$refs.toast.show('2019.12.31 10:00:00开启！')
                return
            }
            this.rulePopupType = type
            this.resetRuleScroller()
        },
        // 判断是pc还是移动端
        getDeviceType () {
            if (/Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(navigator.userAgent)) {
                return 'app'
            } else {
                return 'pc'
            }
        },
        // 跳转直播间
        redirectRoom (info) {
            console.log(' >>>>>>>>>>>>>>>>>>info', info)
            if (this.rankType === 1) {
                this.goRoom(info)
            } else {
                console.log('不是主播！！！！！！')
            }
        }
    }
}

export default CommonMixin
