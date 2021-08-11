import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const CommonMixin = {
    components: {
        Loading, Toast
    },
    data: {
        activityStatus: 0,
        serverTime: 0,
        endTime: 0,
        isLogin: false,
        modInfo: {
            headPic: '',
            nickname: '主播昵称',
            discount: 0
        },
        countDownTime: '',
        timer: null,
        discountGift: [
            {
                disc: 2,
                gifts: [
                    { giftName: '告白气球', pid: 0, pic: require('./images/gifts/gift-gbqq.png'), oldprice: 8888, newprice: 1778, num: 1, ischecked: false },
                    { giftName: '炫酷超跑', pid: 0, pic: require('./images/gifts/gift-xkcp.png'), oldprice: 29999, newprice: 6000, num: 1, ischecked: false },
                    { giftName: '爱心飞船', pid: 0, pic: require('./images/gifts/gift-axfc.png'), oldprice: 131400, newprice: 26280, num: 1, ischecked: false }
                ]
            },
            {
                disc: 3,
                gifts: [
                    { giftName: '生日蛋糕', pid: 0, pic: require('./images/gifts/gift-srdg.png'), oldprice: 6666, newprice: 2000, num: 1, ischecked: false },
                    { giftName: '丘比特', pid: 0, pic: require('./images/gifts/gift-qbt.png'), oldprice: 19999, newprice: 6000, num: 1, ischecked: false },
                    { giftName: '宠你上天', pid: 0, pic: require('./images/gifts/gift-cnst.png'), oldprice: 52000, newprice: 15600, num: 1, ischecked: false }
                ]
            },
            {
                disc: 4,
                gifts: [
                    { giftName: '水晶鞋', pid: 0, pic: require('./images/gifts/gift-sjx.png'), oldprice: 5200, newprice: 2080, num: 1, ischecked: false },
                    { giftName: '南瓜马车', pid: 0, pic: require('./images/gifts/gift-ngmc.png'), oldprice: 12000, newprice: 4800, num: 1, ischecked: false },
                    { giftName: '泰坦号', pid: 0, pic: require('./images/gifts/gift-tth.png'), oldprice: 131400, newprice: 52560, num: 1, ischecked: false }
                ]
            },
            {
                disc: 5,
                gifts: [
                    { giftName: '仙女棒', pid: 0, pic: require('./images/gifts/gift-xnb.png'), oldprice: 2999, newprice: 1500, num: 1, ischecked: false },
                    { giftName: '许愿池', pid: 0, pic: require('./images/gifts/gift-xyc.png'), oldprice: 29999, newprice: 15000, num: 1, ischecked: false },
                    { giftName: '爱心飞机', pid: 0, pic: require('./images/gifts/gift-axfj.png'), oldprice: 88888, newprice: 44444, num: 1, ischecked: false }
                ]
            }
        ],
        // discount: 2,
        currentGifts: [],
        totalPrice: 0,
        showPurchasePopup: false,
        // 秒杀盛况
        buyListWall: [],
        animationIns: null
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
        this.getPurchaseList()
    },
    mounted () { },
    beforeDestroy () {
        clearInterval(this.timer)
        window.cancelAnimationFrame(this.animationIns)
    },
    methods: {
        // 初始化信息
        init () {
            let urlId = 0
            if (window.location.href.indexOf('mid') > -1) {
                urlId = window.location.href.split('?')[1].split('=')[1]
            }
            console.log(urlId)
            axios.get('/specialMart/initInfo', {
                params: {
                    mid: urlId
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.serverTime = resData.serverTime.replace(/-/g, '/')
                    this.endTime = resData.endTime.replace(/-/g, '/')
                    this.isLogin = resData.isLogin
                    this.activityStatus = resData.activityStatus
                    this.modInfo.headPic = resData.headPic || require('./images/xwyd.png')
                    this.modInfo.nickname = resData.nickname || '主播昵称'
                    this.modInfo.discount = resData.discount || 5

                    // 根据返回时间倒计时
                    if (this.activityStatus === 2) {
                        this.countDownTime = (new Date(this.endTime) - new Date(this.serverTime)) / 1000 >> 0
                        this.startCountDown()
                    } else if (this.activityStatus === -1) {
                        this.$refs.countDownTimer.innerText = '00:00:00'
                    }

                    // 根据返回礼物匹配pid
                    this.discountGift.forEach(item => {
                        item.gifts.forEach(subitem => {
                            resData.products.forEach(resitem => {
                                if (subitem.giftName === resitem.productName) {
                                    subitem.pid = resitem.pid
                                }
                            })
                        })
                    })

                    // 根据返回折扣填充礼物
                    this.discountGift.filter(item => {
                        if (item.disc === this.modInfo.discount) {
                            this.currentGifts = item.gifts
                        }
                        // 初始化数据
                        // item.gifts.forEach(subitem => {
                        //     subitem.ischecked = false
                        //     subitem.num = 1
                        // })
                    })
                    console.log('当前礼物>>>>', this.currentGifts)
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        startCountDown () {
            // console.log('passTime', this.countDownTime)
            const time = this.countDownTime
            if (time <= 0) {
                this.$refs.countDownTimer.innerText = '00:00:00'
                return
            }
            let hours = Math.floor(time / 60 / 60)
            let minutes = Math.floor(time / 60 % 60)
            let seconds = time % 60
            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            this.$refs.countDownTimer.innerText = `${hours}:${minutes}:${seconds}`
            // alert('倒计时时间', this.countDownTime, new Date(serverTime))
            this.timer = setTimeout(() => {
                this.countDownTime--
                this.startCountDown()
            }, 1000)
        },
        // 勾选
        changeChecked (info) {
            console.log(info)
            info.ischecked = !info.ischecked
            this.calculateTotalPrice()
        },
        // 加减
        changeNum (info, num) {
            // console.log(info, num, typeof info.num)
            if (!info.num) {
                info.num = 0
            }
            info.num = parseInt(info.num) + num
            if (info.num <= 1) {
                info.num = 1
            }
            if (info.num >= 9999) {
                info.num = 9999
            }
            this.calculateTotalPrice()
        },
        // 购买输入控制
        inputRuleReg (info) {
            info.num = String(info.num).replace(/([^0-9])/g, '')
            if (parseInt(info.num) <= 1) {
                info.num = 1
            }
            this.calculateTotalPrice()
            // console.log(info, typeof info.num)
        },
        // 失去焦点时判断输入是否为空
        onblurInput (info) {
            if (!info.num) {
                info.num = 1
                this.calculateTotalPrice()
            }
        },
        // 计算总价格
        calculateTotalPrice () {
            let total = 0
            this.currentGifts.forEach(item => {
                if (item.ischecked) {
                    total = total + parseInt(item.num || 0) * item.newprice
                }
            })
            this.totalPrice = total
        },
        // 确认购买
        confirmPay () {
            if (this.activityStatus === -1) {
                this.$refs.toast.show('活动已经结束~')
                return
            }
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            if (!this.totalPrice) {
                this.$refs.toast.show('您还未选中礼物！')
                return
            }
            const data = this.currentGifts.filter(item => {
                if (item.ischecked) {
                    return item
                }
            }).map(item => {
                return {
                    pid: item.pid,
                    num: item.num
                }
            })
            console.log(data)
            axios.get('/specialMart/buyProduct', {
                params: {
                    params: JSON.stringify(data)
                }
            }).then(res => {
                if (res.data.errno === 111) {
                    this.showPurchasePopup = true
                } else if (res.data.errno === 0) {
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
        // 卖场盛况 购买列表
        getPurchaseList () {
            axios.get('/specialMart/getPurchaseList', {
                params: {
                    type: 1
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    // const resData = [
                    //     { nickname: '土壕1', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕2', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕3', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕4', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕5', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕6', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕7', property: '怦然心动', num: 11 },
                    //     { nickname: '土壕8', property: '怦然心动', num: 11 }
                    // ]
                    if (resData.length > 5) {
                        this.buyListWall = resData.concat(resData.slice(0, 5))
                        this.$nextTick(() => {
                            this.rowUpScroll()
                        })
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
        }
    }
}

export default CommonMixin
