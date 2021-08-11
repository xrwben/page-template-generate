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
        activityStatus: 0,
        currentTab: 'sd', // sd圣诞 yd元旦
        // 限定
        showPurchasePopup: false,
        giftNumber: 1,
        purchaseStep: 1,
        // 榜单
        rankTab: 'mod', // mod主播榜 user用户榜
        rankList: [],
        rankCenter: null,
        // 圣诞祝福墙
        blessList: [],
        animationIns: null,
        // 活动规则弹窗
        showRulePopup: false,
        ruleTab: 'sd',
        // 雪花
        snowAnimationIns: null
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
    },
    mounted () {
        this.snow()
    },
    beforeDestroy () {
        window.cancelAnimationFrame(this.animationIns)
        window.cancelAnimationFrame(this.snowAnimationIns)
    },
    methods: {
        // 初始化接口
        init () {
            axios.get('/christmas2020/initInfo').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.activityStatus = resData.activityStatus
                    // this.activityStatus = 2

                    if ([0, 1, 3].indexOf(this.activityStatus) > -1) {
                        this.currentTab = 'sd'
                        this.ruleTab = 'sd'
                        // 只有在圣诞阶段才请求祝福墙数据
                        this.getBlessList()
                    } else {
                        this.currentTab = 'yd'
                        this.ruleTab = 'yd'
                    }
                    // 请求榜单数据
                    this.getRankData()
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 切换tab
        changeCurrentTab (type) {
            if (this.currentTab === type) {
                return
            }
            if ([0, 1, 3].indexOf(this.activityStatus) > -1 && type === 'yd') {
                this.$refs.toast.show('12.29 11:00开启！')
                return
            }
            this.currentTab = type
            this.rankTab = 'mod'
            this.getRankData()
        },
        // 切换活动规则
        changeRuleTab (type) {
            if (this.ruleTab === type) {
                return
            }
            if ([0, 1, 3].indexOf(this.activityStatus) > -1 && type === 'yd') {
                this.$refs.toast.show('12.29 11:00开启！')
                return
            }
            this.ruleTab = type
        },
        // 礼物预览
        preview (type) {
            const xxr = '//static.guojiang.tv/app/gift/pc_animation/4753_99/data.json'
            const sdml = '//static.guojiang.tv/app/gift/pc_animation/4752/data.json'
            const xjn = '//static.guojiang.tv/app/gift/pc_animation/4751_99/data.json'
            const nyht = '//static.guojiang.tv/app/gift/pc_animation/4750/data.json'
            let path = ''
            if (type === 10) {
                path = this.currentTab === 'sd' ? xxr : xjn
            } else if (type === 9999) {
                path = this.currentTab === 'sd' ? sdml : nyht
            }
            this.$refs.svgPlayer.playSvg(path)
        },
        // 购买弹窗
        purchase () {
            this.showPurchasePopup = true
            this.purchaseStep = 1
        },
        // 购买输入控制
        inputRuleReg () {
            this.giftNumber = this.giftNumber.replace(/([^0-9])/g, '')
            if (parseInt(this.giftNumber) <= 0) {
                this.giftNumber = 1
            } else if (parseInt(this.giftNumber) >= 9999) {
                this.giftNumber = 9999
            }
        },
        // 确认购买
        confirmPay () {
            if (!this.giftNumber) {
                this.$refs.toast.show('购买数量不能为空！')
                return
            }
            let url = ''
            let pid = 0
            if (this.activityStatus === 1) {
                url = '/christmas2020/buyProduct'
                pid = 1932
            } else if (this.activityStatus === 2) {
                url = '/newYear2021/buyProduct'
                pid = 1931
            }
            axios.get(url, {
                params: {
                    pid,
                    num: this.giftNumber
                }
            }).then(res => {
                if (res.data.errno === 111) {
                    this.purchaseStep = 2
                } else if (res.data.errno === 0) {
                    this.showPurchasePopup = false
                    this.giftNumber = 1
                    this.$refs.toast.show(res.data.msg)
                    // 刷新背包
                    this.refreshBackpack()
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            })
        },
        // 切换榜单
        changeRankTab (type) {
            if (this.rankTab === type) {
                return
            }
            this.rankTab = type
            this.getRankData()
        },
        // 获取榜单数据
        getRankData () {
            this.$refs.loading && this.$refs.loading.show()
            const url = this.currentTab === 'sd' ? '/christmas2020/ranks' : '/newYear2021/ranks'
            axios.get(url, {
                params: {
                    type: this.rankTab === 'mod' ? 1 : 2,
                    page: 1,
                    pageRows: 10
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    if (resData.ranks.length < 10) {
                        const len = resData.ranks.length
                        for (let i = len; i < 10; i++) {
                            createList.push({
                                isPlaying: false,
                                nickname: '虚位以待',
                                score: '--',
                                headPic: require('./images/xwyd.png'),
                                follow: 'hide'
                            })
                        }
                    }
                    this.rankList = resData.ranks.concat(createList)
                    this.rankCenter = resData.myRank
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
            axios.get('/hallo2020/attention', {
                params: {
                    mid: room.id
                }
            }).then(res => {
                const { data } = res
                if (data.errno === 0) {
                    this.getRankData()
                } else {
                    this.$refs.toast.show(data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 房间跳转
        goRoomRedictor (info) {
            if (this.rankTab === 'user') {
                return
            }
            this.goRoom(info)
        },
        // 祝福列表
        getBlessList () {
            axios.get('/christmas2020/blessingWall').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    if (resData.length > 5) {
                        this.blessList = resData.concat(resData.slice(0, 5))
                        this.$nextTick(() => {
                            this.rowUpScroll()
                        })
                    } else {
                        this.blessList = resData
                    }
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            })
        },
        // 向上循环滚动动画
        rowUpScroll () {
            window.cancelAnimationFrame(this.animationIns)
            let run = null
            const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
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
        // 雪花
        snow () {
            const canvas = document.querySelector('#snow')
            const W = window.innerWidth
            const H = window.innerHeight

            // 设置canvas画布大小
            canvas.setAttribute('width', W)
            canvas.setAttribute('height', H)

            const ctx = canvas.getContext('2d')

            const config = {
                number: this.pageType === 'app' ? 50 : 200,
                snowArr: []
                // pic: 'https://www.deanhan.cn/wp-content/uploads/2017/12/snow.png',
                // speed: 0
            }
            // const snowImg = new Image()
            // snowImg.src = config.pic
            // snowImg.src = require('./images/share.png')

            for (let i = 0; i < config.number; i++) {
                config.snowArr.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    toX: Math.random(),
                    toY: Math.random() * 1 + 1,
                    size: Math.random() * 3
                })
            }
            // console.log(config)
            const dropAnimation = () => {
                window.cancelAnimationFrame(this.snowAnimationIns)
                ctx.clearRect(0, 0, W, H)
                for (let i = 0; i < config.snowArr.length; i++) {
                    const snow = config.snowArr[i]
                    ctx.beginPath()
                    ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI * 2, true)
                    ctx.fillStyle = '#efefef'
                    ctx.fill()
                    // ctx.drawImage(snowImg, snow.x, snow.y, snow.size, snow.size)

                    snow.x = snow.x > W ? 0 : snow.x + snow.toX
                    snow.y = snow.y > H ? 0 : snow.y + snow.toY
                }
                this.snowAnimationIns = requestAnimationFrame(dropAnimation)
            }
            this.snowAnimationIns = requestAnimationFrame(dropAnimation)
        }
    }
}

export default CommonMixin
