import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'
import Swiper from '../../packages/swiper.min.js'

const CommonMixin = {
    components: {
        Loading, Toast
    },
    data: {
        serverTime: '',
        startTime: '',
        endTime: '',
        isLogin: false,
        isMod: false,
        activityStatus: 0,
        canSeckill: false,
        // 主播开店=kd 、一折秒杀=ms
        currentTab: 'kd',
        // 主播折扣
        swiperIns: null,
        swiperIndex: 0,
        discountList: [],
        discountGift: {
            '2折': [
                { gift: '告白气球', id: 0, pic: require('./images/gifts/gift-gbqq.png'), oldprice: 8888, newprice: 1778 },
                { gift: '炫酷超跑', id: 0, pic: require('./images/gifts/gift-xkcp.png'), oldprice: 29999, newprice: 6000 },
                { gift: '爱心飞船', id: 0, pic: require('./images/gifts/gift-axfc.png'), oldprice: 131400, newprice: 26280 }
            ],
            '3折': [
                { gift: '生日蛋糕', id: 0, pic: require('./images/gifts/gift-srdg.png'), oldprice: 6666, newprice: 2000 },
                { gift: '丘比特', id: 0, pic: require('./images/gifts/gift-qbt.png'), oldprice: 19999, newprice: 6000 },
                { gift: '宠你上天', id: 0, pic: require('./images/gifts/gift-cnst.png'), oldprice: 52000, newprice: 15600 }
            ],
            '4折': [
                { gift: '水晶鞋', id: 0, pic: require('./images/gifts/gift-sjx.png'), oldprice: 5200, newprice: 2080 },
                { gift: '南瓜马车', id: 0, pic: require('./images/gifts/gift-ngmc.png'), oldprice: 12000, newprice: 4800 },
                { gift: '泰坦号', id: 0, pic: require('./images/gifts/gift-tth.png'), oldprice: 131400, newprice: 52560 }
            ],
            '5折': [
                { gift: '仙女棒', id: 0, pic: require('./images/gifts/gift-xnb.png'), oldprice: 2999, newprice: 1500 },
                { gift: '许愿池', id: 0, pic: require('./images/gifts/gift-xyc.png'), oldprice: 29999, newprice: 15000 },
                { gift: '爱心飞机', id: 0, pic: require('./images/gifts/gift-axfj.png'), oldprice: 88888, newprice: 44444 }
            ]
        },
        // 资格争夺、业绩冲刺
        modRankTab: 'zg',
        modRankList: [],
        myModRank: null,
        // 秒杀专区
        oneDiscountGift: [
            { name: '帝王套', pid: 0, pic: require('./images/gifts/gift-dwt.png'), oldprice: 917660, newprice: 91766, num: 2 },
            { name: '梦里花开', pid: 0, pic: require('./images/gifts/gift-mlhk.png'), oldprice: 9999, newprice: 999, num: 5 },
            { name: '童话王国', pid: 0, pic: require('./images/gifts/gift-thwg.png'), oldprice: 334400, newprice: 33440, num: 2 },
            { name: '烟花', pid: 0, pic: require('./images/gifts/gift-yh.png'), oldprice: 13140, newprice: 1314, num: 5 }
        ],
        msTips: '',
        showPurchasePopup: false,
        buyCurrentGift: null,
        giftNumber: 1,
        purchaseStep: 1,
        // 秒杀资格榜
        dateTabs: [
            { curDate: '2020/01/08', text: '1.8' },
            { curDate: '2020/01/09', text: '1.9' },
            { curDate: '2020/01/10', text: '1.10' },
            { curDate: '2020/01/11', text: '1.11' },
            { curDate: '2020/01/12', text: '1.12' }
        ],
        msEnd: false,
        currentDateTab: '',
        currentTimeTab: '',
        userRankList: [],
        myUserRank: null,
        // 秒杀盛况
        buyListWall: [],
        animationIns: null,
        showRulePopup: false
    },
    computed: {
        // 日期1.8-1.12
        currentDate () {
            if (new Date(this.serverTime) < new Date(this.startTime)) {
                return this.startTimeFormat(0)
            } else if (new Date(this.serverTime) > new Date(this.endTime)) {
                return this.startTimeFormat(4)
            }
            return new Date(this.serverTime).getFullYear() + '/' + (new Date(this.serverTime).getMonth() + 1) + '/' + new Date(this.serverTime).getDate()
        },
        // 当前时间段00:00:00-18:59:59   19:00:00-23:59:59
        currentTime () {
            console.log('当前几点', new Date(this.serverTime).getHours())
            return new Date(this.serverTime).getHours() < 19 ? 1 : 2
        },
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
    watch: {
        'swiperIns.realIndex' (newVal, oldVal) {
            console.log('当前索引：', this.swiperIns.realIndex)
            this.swiperIndex = newVal
        },
        'currentTime' (newVal) {
            console.log(newVal)
        },
        'currentDate' (newVal) {
            console.log(newVal)
            console.log('当前时间是开始时间吗=', this.currentDate === this.startTimeFormat())
        },
        'currentTab' (newVal, oldVal) {
            console.log('currentTab>>>>>>>>>>>>>>', newVal, oldVal)
        }
    },
    created () {
        this.init()
    },
    mounted () {
        // console.log('先打印我')
        // setTimeout(() => {
        //     const scrollWrapperHeight = this.$refs['scroll-up-wrapper'].clientHeight
        //     const cHeight = this.$refs['scroll-up-container'].clientHeight
        //     const sTop = this.$refs['scroll-up-container'].scrollTop
        //     console.log('滚动容器：>>>>', scrollWrapperHeight, cHeight, sTop)
        // }, 3000)
    },
    beforeDestroy () {
        window.cancelAnimationFrame(this.animationIns)
    },
    methods: {
        // 初始化信息
        init () {
            axios.get('/specialMart/initInfo').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.serverTime = resData.serverTime.replace(/-/g, '/')
                    this.startTime = resData.startTime.replace(/-/g, '/')
                    this.endTime = resData.endTime.replace(/-/g, '/')
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.canSeckill = resData.canSeckill
                    this.activityStatus = resData.activityStatus
                    // this.activityStatus = -1

                    this.modRankTab = [0, 1].includes(this.activityStatus) ? 'zg' : 'cc'

                    // 拼接轮播数据
                    const hasModDiscount = resData.modDiscounts
                    Object.keys(this.discountGift).forEach((item, index) => {
                        this.discountList.push({
                            discount: index + 2,
                            headPic: hasModDiscount.length ? hasModDiscount[index].headPic : '',
                            mid: hasModDiscount.length ? hasModDiscount[index].mid : '',
                            nickname: hasModDiscount.length ? hasModDiscount[index].nickname : '',
                            gifts: this.discountGift[item],
                            rid: hasModDiscount.length ? hasModDiscount[index].rid : ''
                        })
                    })
                    console.log(this.discountList)
                    // 请求到主播开店打折后轮播
                    this.$nextTick(() => {
                        this.swiper()
                    })
                    // 请求主播榜单数据
                    this.getModRankData()

                    // 拼接一折秒杀专区数据
                    this.oneDiscountGift = this.oneDiscountGift.map((item, index) => {
                        return {
                            ...item,
                            pid: resData.seckillLeft[index].pid,
                            left: resData.seckillLeft[index].left
                        }
                    })
                    console.log(this.oneDiscountGift)
                    // 秒杀专区tips
                    // this.serverTime = '2020-01-08 18:00:00'
                    // this.startTime = '2020-01-08 11:00:00'
                    // this.endTime = '2020-01-13 23:59:59'
                    const serverDate = this.startTimeFormat(0, this.serverTime)
                    if (new Date(serverDate) <= new Date(this.startTimeFormat(0)) && this.currentTime === 1) {
                        this.msTips = '今日19:00:00开启秒杀'
                    } else if (new Date(serverDate) >= new Date(this.startTimeFormat(5)) && this.currentTime === 2) {
                        this.msTips = '秒杀已结束~'
                        this.msEnd = true
                    } else {
                        if (this.currentTime === 1) {
                            this.msTips = '今日18:59:59结束该轮秒杀'
                        } else {
                            this.msTips = '今日23:59:59结束该轮秒杀'
                        }
                    }

                    // 判断当前用户榜单tab
                    this.dateTabs = this.dateTabs.map((item, index) => {
                        return {
                            text: item.text,
                            curDate: this.startTimeFormat(index)
                        }
                    })
                    this.currentDateTab = this.currentDate
                    this.currentTimeTab = this.currentTime
                    console.log('this.dateTabs>>>>>>>>>>', this.dateTabs)
                    console.log('this.currentDateTab>>>>>>>>>>', this.currentDateTab)
                    console.log('this.currentTimeTab>>>>>>>>>>', this.currentTimeTab)
                    this.getUserRankData()

                    // 请求礼物墙数据
                    this.getPurchaseList()
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 主播开店 一折秒杀 tab切换
        changeCurrentTab (type) {
            this.currentTab = type
            // debugger
            if (type === 'kd') {
                this.swiperIns.autoplay.start()
                window.cancelAnimationFrame(this.animationIns)
                this.animationIns = null
            } else {
                this.swiperIns.autoplay.stop()
                this.$nextTick(() => {
                    this.rowUpScroll()
                })
            }
        },
        // 轮播
        swiper () {
            this.swiperIns = new Swiper('.swiper-container', {
                loop: true,
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                observer: true,
                observeParents: true
            })
        },
        // 资格争夺战和业绩冲刺帮tab
        changeModRankTab (type) {
            if (type === 'cc' && [0, 1].includes(this.activityStatus)) {
                this.$refs.toast.show('1.10 00:00:00 开启')
                return
            }
            this.modRankTab = type
            this.getModRankData()
        },
        // 获取主播榜单数据
        getModRankData () {
            this.$refs.loading.show()
            this.resetRankScroller()
            axios.get('/specialMart/ranks', {
                params: {
                    activityId: this.modRankTab === 'zg' ? 1888 : 1887,
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
                                nickname: '虚位以待',
                                score: '--',
                                headPic: require('./images/xwyd.png')
                            })
                        }
                    }
                    this.modRankList = resData.ranks.concat(createList)
                    this.myModRank = res.data.data.myRank
                    // console.log(this.myModRank)
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.$refs.loading.hide()
            })
        },
        // 秒杀弹窗
        purchase (info) {
            const serverDate = this.startTimeFormat(0, this.serverTime)
            if (new Date(serverDate) <= new Date(this.startTimeFormat(0)) && this.currentTime === 1) {
                this.$refs.toast.show('今日 19:00:00 开启秒杀！')
                return
            }
            if (new Date(serverDate) >= new Date(this.startTimeFormat(5)) && this.currentTime === 2) {
                this.$refs.toast.show('秒杀已结束~')
                return
            }
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (!this.canSeckill) {
                this.$refs.toast.show('您未获得本轮秒杀资格！每天00:00:00-18:59:59消耗积分前三名、19:00:00-23:59:59消耗积分前五名的用户可以获得秒杀资格，详见页面下方的“资格秒杀榜”！')
                return
            }
            if (!info.left) {
                this.$refs.toast.show('该礼物已被购完，请下次再来！')
                return
            }
            this.showPurchasePopup = true
            this.buyCurrentGift = info
            this.giftNumber = 1
        },
        // 购买输入控制
        inputRuleReg () {
            this.giftNumber = this.giftNumber.replace(/([^0-9])/g, '')
            if (parseInt(this.giftNumber) <= 0) {
                this.giftNumber = 1
            } else if (parseInt(this.giftNumber) >= this.buyCurrentGift.left) {
                this.giftNumber = this.buyCurrentGift.left
            }
        },
        // 确认秒杀
        confirmPay () {
            if (!this.giftNumber) {
                this.$refs.toast.show('购买数量不能为空！')
                return
            }
            axios.get('/specialMart/buyProduct', {
                params: {
                    params: JSON.stringify([
                        {
                            pid: this.buyCurrentGift.pid,
                            num: this.giftNumber
                        }
                    ])
                }
            }).then(res => {
                if (res.data.errno === 111) {
                    this.purchaseStep = 2
                } else if (res.data.errno === 0) {
                    this.showPurchasePopup = false
                    this.$refs.toast.show(res.data.msg)
                    // 购买成功后刷新数据
                    this.init()
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 用户榜单日期tab切换
        changeCurrentDateTab (type) {
            console.log('changeCurrentDateTab (type)', type)
            if (this.currentDateTab === type) {
                return
            }
            if (new Date(this.serverTime) < new Date(type)) {
                return
            }
            this.currentDateTab = type
            this.currentTimeTab = 1
            this.getUserRankData()
        },
        // 用户榜单tab当前时间切换
        changeCurrentTimeTab (type) {
            if (this.currentTimeTab === type) {
                return
            }
            if (type === 2 && this.currentTime === 1 && this.currentDateTab === this.currentDate) {
                return
            }
            this.currentTimeTab = type
            this.getUserRankData()
        },
        // 获取用户榜单数据
        getUserRankData () {
            this.$refs.loading.show()
            axios.get('/specialMart/ranks', {
                params: {
                    date: this.currentDateTab,
                    stage: this.currentTimeTab
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    if (!resData.hasNext && resData.ranks.length < 5) {
                        const len = resData.ranks.length
                        for (let i = len; i < 5; i++) {
                            createList.push({
                                nickname: '虚位以待',
                                score: '--',
                                headPic: require('./images/xwyd.png')
                            })
                        }
                    }
                    this.userRankList = resData.ranks.concat(createList)
                    this.myUserRank = resData.myRank
                    // console.log(this.userRankList)
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.$refs.loading.hide()
            })
        },
        // 秒杀盛况 购买列表
        getPurchaseList () {
            axios.get('/specialMart/getPurchaseList', {
                params: {
                    type: 2
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    if (resData.length > 5) {
                        this.buyListWall = resData.concat(resData.slice(0, 5))
                    } else {
                        this.buyListWall = resData
                    }
                } else {
                    console.log(res.data.msg)
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
        // 获取相对开始时间
        startTimeFormat (gapDay = 0, start = this.startTime) {
            // console.log(typeof new Date(this.startTime))
            // const startTime = start || this.startTime
            const time = new Date(start).getTime() + gapDay * 24 * 60 * 60 * 1000
            return new Date(time).getFullYear() + '/' + (new Date(time).getMonth() + 1) + '/' + new Date(time).getDate()
        }
    }
}

export default CommonMixin
