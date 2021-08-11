import axios from 'axios'
import SvgPlayer from '../shared/components/SvgPlayer.vue'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const CommonMixin = {
    components: {
        SvgPlayer, Loading, Toast
    },
    data: {
        isLogin: false,
        isMod: false,
        productId: 0,
        activityStatus: 0,
        // 霸屏
        holdScreenKingData: null,
        nowHoldScreenData: null,
        nowHoldScreenTimer: null,
        countdownTimer: null,
        hisHoldScreenList: [],
        animationIns: null,
        showBpPopup: false,
        // 限定、购买弹窗
        showPurchasePopup: false,
        purchaseStep: 1,
        giftNumber: 1,
        giftAddress: [],
        // 寻爱CP大作战
        currentRankTab: 'rw',
        currentCpTab: 'tsyd',
        currentTimeTab: '20进10',
        rwRankList: [],
        myModRank: null,
        pkRankList: [],
        pkTimer: null,
        cpRankList: [],
        // 贡献榜弹窗
        showContributionPopup: false,
        currentContributionList: [],
        // 永生花弹窗
        showFlowerPopup: false,
        foreverFlowerInfo: null,
        // 规则弹窗
        showRulePopup: false
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
        this.getHoldScreenKing()
        this.getHistoryHoldScreen()
    },
    mounted () {
        // this.rowUpScroll()
    },
    beforeDestroy () {
        this.nowHoldScreenTimer && clearTimeout(this.nowHoldScreenTimer)
        this.countdownTimer && clearTimeout(this.countdownTimer)
        this.pkTimer && clearTimeout(this.pkTimer)
        this.animationIns && window.cancelAnimationFrame(this.animationIns)
    },
    methods: {
        // 初始化数据
        init () {
            axios.get('/valentinesDay2020/initInfo').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.productId = resData.productId
                    this.giftAddress = resData.pcAnimation
                    this.activityStatus = resData.activityStatus
                    // this.activityStatus = 0

                    // 获取当前榜单tab
                    this.currentRankTab = [0, 1].includes(this.activityStatus) ? 'rw' : 'cp'
                    switch (this.activityStatus) {
                    case 0:
                    case 1:
                    case 2:
                        this.currentTimeTab = '20进10'
                        break
                    case 3:
                        this.currentTimeTab = '10进5'
                        break
                    case 4:
                    case -1:
                        this.currentTimeTab = 'cp之争'
                        break
                    default:
                        this.currentTimeTab = 'cp之争'
                    }

                    // 活动期间才请求正在霸屏数据
                    if ([1, 2, 3, 4].includes(this.activityStatus)) {
                        this.getNowHoldScreen()
                    }

                    // 请求榜单数据
                    this.changeRankTab(this.currentRankTab)
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 霸屏王
        getHoldScreenKing () {
            axios.get('/valentinesDay2020/holdScreenTopUser').then(res => {
                if (res.data.errno === 0) {
                    // if (res.data.data) {
                    //     this.holdScreenKingData = Object.assign(res.data.data, {
                    //         show: 'show'
                    //     })
                    // } else {
                    //     this.holdScreenKingData = {
                    //         show: 'hide',
                    //         headPic: require('./images/xwyd-1.jpg'),
                    //         isTop: false,
                    //         nickname: '虚位以待',
                    //         times: 0,
                    //         timesDiff: 0
                    //     }
                    // }
                    this.holdScreenKingData = res.data.data || {
                        show: 'hide',
                        headPic: require('./images/xwyd-1.jpg'),
                        isTop: false,
                        nickname: '虚位以待',
                        times: 0,
                        timesDiff: 0
                    }
                    console.log(this.holdScreenKingData)
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 正在霸屏
        getNowHoldScreen () {
            this.nowHoldScreenTimer && clearTimeout(this.nowHoldScreenTimer)
            axios.get('/valentinesDay2020/holdScreen').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    // 当前霸屏的服务器时间不相等时说明有新的霸屏数据 然后去刷新历史霸屏和霸屏王数据
                    if (this.nowHoldScreenData && resData && this.nowHoldScreenData.holdTime !== resData.holdTime) {
                        this.getHoldScreenKing()
                        this.getHistoryHoldScreen()
                    }
                    this.nowHoldScreenData = resData
                    // 正在霸屏倒计时
                    this.startCountDown()
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.nowHoldScreenTimer = setTimeout(() => {
                    this.getNowHoldScreen()
                }, 5000)
            })
        },
        // 倒计时
        startCountDown () {
            this.countdownTimer && clearTimeout(this.countdownTimer)
            // 霸屏数据不存在就停止倒计时
            if (!this.nowHoldScreenData) {
                this.$refs.countdown.innerText = ''
                return
            }
            const time = this.nowHoldScreenData.endTime
            if (time <= 0) {
                this.$refs.countdown.innerText = ''
                return
            }
            let minutes = Math.floor(time / 60)
            let seconds = time % 60
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            this.$refs.countdown.innerText = `${minutes}:${seconds}`
            this.countdownTimer = setTimeout(() => {
                this.nowHoldScreenData.endTime--
                this.startCountDown()
            }, 1000)
        },
        // 历史霸屏
        getHistoryHoldScreen () {
            axios.get('/valentinesDay2020/holdRecord').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    if (resData.length > 4) {
                        this.hisHoldScreenList = resData.concat(resData.slice(0, 4))
                        this.$nextTick(() => {
                            this.rowUpScroll()
                        })
                    } else {
                        this.hisHoldScreenList = resData
                    }
                    // console.log(this.hisHoldScreenList)
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 向上循环滚动动画
        rowUpScroll () {
            window.cancelAnimationFrame(this.animationIns)
            let run = null
            const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
            const scrollWrapperHeight = document.querySelector('.scroll-up-wrapper').getBoundingClientRect().height
            const scrollIns = document.querySelector('.scroll-up-container')
            const cHeight = scrollIns.getBoundingClientRect().height
            let sTop = scrollIns.scrollTop
            console.log('滚动容器：', scrollWrapperHeight, cHeight, sTop)
            run = () => {
                window.cancelAnimationFrame(this.animationIns)
                sTop++
                scrollIns.style.transform = `translate3d(0, -${sTop}px, 0)`
                // console.log('滚动了:', sTop, this.animationIns)
                if (sTop >= cHeight - scrollWrapperHeight) {
                    sTop = 0
                }
                this.animationIns = requestAnimationFrame(run)
            }
            this.animationIns = requestAnimationFrame(run)
            console.log('this.animationIns>>>>', this.animationIns)
        },
        // 显示购买弹窗
        showBuyPopup () {
            this.showPurchasePopup = true
            this.purchaseStep = 1
        },
        // 购买输入控制
        inputRuleReg () {
            this.giftNumber = this.giftNumber.replace(/([^0-9])/g, '')
            if (parseInt(this.giftNumber) <= 0) {
                this.giftNumber = 1
            }
            if (parseInt(this.giftNumber) >= 9999) {
                this.giftNumber = 9999
            }
        },
        // 确认购买
        confirmPay () {
            if (!this.giftNumber) {
                this.$refs.toast.show('购买数量不能为空！')
                return
            }
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            axios.get('/valentinesDay2020/buyProduct', {
                params: {
                    pid: this.productId,
                    num: this.giftNumber
                }
            }).then(res => {
                if (res.data.errno === 111) {
                    this.purchaseStep = 2
                } else if (res.data.errno === 0) {
                    this.showPurchasePopup = false
                    this.$refs.toast.show(res.data.msg)
                    // 购买成功后刷新数据
                    // 刷新背包
                    this.refreshBackpack()
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 礼物预览
        preview (type) {
            let path = ''
            if (type === 'merry') {
                path = this.giftAddress[0]
            } else if (type === 'flower') {
                path = this.giftAddress[1]
            }
            this.$refs.svgPlayer.playSvg(path)
        },
        // 永生花tip
        giftTips () {
            this.$refs.toast.show('通过活动玩法获得，主播无分成，价值520宠爱值~')
        },
        // 永生花弹窗
        changeFlowerPopup () {
            this.showFlowerPopup = true
            this.getFlowerInfo()
        },
        // 永生花详情
        getFlowerInfo () {
            axios.get('/valentinesDay2020/flowerInfo').then(res => {
                if (res.data.errno === 0) {
                    this.foreverFlowerInfo = res.data.data
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 永生花合成
        composeFlower () {
            axios.get('/valentinesDay2020/finish').then(res => {
                if (res.data.errno === 0) {
                    this.$refs.toast.show('“永生花”已下发至您的背包，请注意查收！')
                    this.foreverFlowerInfo.hasFinish = 1
                    // 刷新背包
                    this.refreshBackpack()
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 任务未完成从永生花弹窗跳转直播间
        redirectRoom (type) {
            if (type === 1 && this.foreverFlowerInfo.watchTime >= 20) {
                return
            }
            if (type === 2 && this.foreverFlowerInfo.hasSpeak) {
                return
            }
            if (type === 3 && this.foreverFlowerInfo.hasSendGift) {
                return
            }
            if (!this.foreverFlowerInfo.hasFinish) {
                this.goRoom(this.foreverFlowerInfo.top10Mod)
            }
        },
        // 切换榜单 入围之战、CP之争
        changeRankTab (type) {
            this.currentRankTab = type
            if (this.currentRankTab === 'rw') {
                this.getRwRankData()
            } else {
                this.getPKRankData()
            }
        },
        // 切换CP类型 天生一对、佳偶天成、神仙眷侣
        changeCPTab (type) {
            if (type === this.currentCpTab) {
                return
            }
            this.currentCpTab = type
            this.getPKRankData()
        },
        // 切换日期 2月12、2月13、2月14
        changeTimeTab (type) {
            if (type === this.currentTimeTab) {
                return
            }
            this.currentTimeTab = type
            this.getPKRankData()
        },
        // 获取入围榜单数据
        getRwRankData () {
            this.$refs.loading.show()
            axios.get('/valentinesDay2020/modRanks', {
                params: {
                    page: 1,
                    pageRows: 60
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    if (!resData.hasNext && resData.ranks.length < 60) {
                        const len = resData.ranks.length
                        for (let i = len; i < 60; i++) {
                            createList.push({
                                headPic: require('./images/xwyd-1.jpg'),
                                nickname: '虚位以待',
                                score: '--',
                                top3Users: []
                            })
                        }
                    }
                    this.rwRankList = resData.ranks.concat(createList)
                    this.myModRank = resData.myRank
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.$refs.loading.hide()
            })
        },
        // 获取PK榜单数据
        getPKRankData () {
            // 先清除定时器
            this.pkTimer && clearTimeout(this.pkTimer)
            console.log(this.currentCpTab, this.currentTimeTab)
            axios.get('/valentinesDay2020/pkRanks', {
                params: {
                    group: this.currentCpTab === 'tsyd' ? 1 : this.currentCpTab === 'jotc' ? 2 : 3,
                    stage: this.currentTimeTab === '20进10' ? 2 : this.currentTimeTab === '10进5' ? 3 : 4
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    if (['20进10', '10进5'].includes(this.currentTimeTab)) {
                        const createLength = this.currentTimeTab === '20进10' ? 10 : 5
                        if (resData.length < createLength) {
                            const len = resData.length
                            for (let i = len; i < createLength; i++) {
                                createList.push({
                                    fromNickname: '虚位以待',
                                    fromHeadPic: require('./images/xwyd-1.jpg'),
                                    fromScore: 0,
                                    fromTop3Users: [],
                                    fromIsWinner: 'hide',
                                    toNickname: '虚位以待',
                                    toHeadPic: require('./images/xwyd-1.jpg'),
                                    toScore: 0,
                                    toTop3Users: [],
                                    toIsWinner: 'hide'
                                })
                            }
                        }
                        this.pkRankList = resData.concat(createList)
                        // console.log(this.pkRankList)
                    }
                    if (this.currentTimeTab === 'cp之争') {
                        const len = resData.ranks.length
                        if (len < 5) {
                            for (let i = len; i < 5; i++) {
                                createList.push({
                                    headPic: require('./images/xwyd-1.jpg'),
                                    nickname: '虚位以待',
                                    score: '--',
                                    top3Users: []
                                })
                            }
                        }
                        this.cpRankList = resData.ranks.concat(createList)
                        // console.log(this.cpRankList)
                    }

                    // pk条处理
                    if (['20进10', '10进5'].includes(this.currentTimeTab)) {
                        this.$nextTick(() => {
                            this.pkRankList.forEach((item, index) => {
                                const totalScore = item.fromScore + item.toScore
                                if (totalScore === 0) {
                                    this.$refs['left-bar-' + index][0].style.width = '50%'
                                    this.$refs['right-bar-' + index][0].style.width = '50%'
                                } else if (totalScore > 0) {
                                    if (item.fromScore === 0) {
                                        this.$refs['left-bar-' + index][0].style.width = '5%'
                                        this.$refs['right-bar-' + index][0].style.width = '95%'
                                    } else if (item.toScore === 0) {
                                        this.$refs['left-bar-' + index][0].style.width = '95%'
                                        this.$refs['right-bar-' + index][0].style.width = '5%'
                                    // } else if ((item.fromScore - item.toScore) / totalScore > 0.9) {
                                    //     this.$refs['left-bar-' + index][0].style.width = '95%'
                                    //     this.$refs['right-bar-' + index][0].style.width = '5%'
                                    // } else if ((item.fromScore - item.toScore) / totalScore < -0.9) {
                                    //     this.$refs['left-bar-' + index][0].style.width = '5%'
                                    //     this.$refs['right-bar-' + index][0].style.width = '95%'
                                    } else {
                                        this.$refs['left-bar-' + index][0].style.width = item.fromScore / totalScore * 100 + '%'
                                        this.$refs['right-bar-' + index][0].style.width = item.toScore / totalScore * 100 + '%'
                                    }
                                }
                            })
                        })
                    }
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.pkTimer = setTimeout(() => {
                    if (this.currentRankTab === 'cp' && ['20进10', '10进5'].includes(this.currentTimeTab)) {
                        this.getPKRankData()
                    }
                }, 5000)
            })
        },
        // 贡献榜弹窗
        changeContributionPopup (id) {
            this.showContributionPopup = true
            this.getContributionRankData(id)
        },
        // 获取用户贡献榜单数据
        getContributionRankData (id) {
            this.$refs.loading.show()
            axios.get('/valentinesDay2020/userRanks', {
                params: {
                    mid: id
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    this.currentContributionList = res.data.data.ranks
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.$refs.loading.hide()
            })
        }
    }
}

export default CommonMixin
