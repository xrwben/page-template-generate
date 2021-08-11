import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const CommonMixin = {
    components: {
        Loading, Toast
    },
    data: {
        isLogin: false,
        isMod: false,
        isActivity: 0,
        taskData: null,
        rankList: [],
        myRank: null,
        // 女神卡弹窗
        showCardPopup: false,
        modCardDetails: null,
        // 活动规则弹窗
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
        this.getRankData()
    },
    mounted () { },
    methods: {
        // 初始化信息
        init () {
            axios.get('/girlsDay/init').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.isActivity = resData.isActivity
                    // this.isActivity = 2
                    this.taskData = resData
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 领取卡片
        getCard (cardId) {
            if (this.isActivity === 0) {
                this.$refs.toast.show('活动未开始~')
                return
            }
            if (this.isActivity === 2) {
                this.$refs.toast.show('活动已结束~')
                return
            }
            if (!this.isLogin) {
                this.goLogin()
                return
            }
            axios.get('/girlsDay/receiveCard', {
                params: {
                    card: cardId
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    // 重新刷新数据
                    this.init()
                    // 刷新背包
                    this.refreshBackpack()
                }
                this.$refs.toast.show(res.data.msg)
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取榜单数据
        getRankData () {
            this.$refs.loading && this.$refs.loading.show()
            axios.get('/girlsDay/ranks', {
                params: {
                    page: 0,
                    pageRows: 100
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    for (let i = 0; i < resData.data.length; i++) {
                        if (!resData.data[i]) {
                            resData.data[i] = {
                                isPlaying: false,
                                headPic: require('./images/xwyd.png'),
                                nickname: '虚位以待',
                                score: '--',
                                follow: 'hide'
                            }
                        }
                    }
                    this.rankList = resData.data
                    this.myRank = resData.myRank
                    // console.log(this.rankList, this.myRank)
                } else {
                    console.error(res.data.msg)
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
                    // console.log(data.data.msg)
                    this.$refs.toast.show(data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 查看主播卡片详情
        getModCardDetails (info) {
            console.log(info)
            if (!info.id && !info.uid) {
                return
            }
            this.modCardDetails = null
            axios.get('/girlsDay/getRankDetail', {
                params: {
                    mid: info.id || info.uid
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    this.modCardDetails = res.data.data
                    // console.log(this.modCardDetails)
                } else {
                    console.log(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
            this.showCardPopup = true
        }
    }
}

export default CommonMixin
