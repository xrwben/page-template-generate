// import axios from 'axios'
import Vue from 'vue'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'
import SvgPlayer from '../shared/components/SvgPlayer.vue'
import BuyModal from './BuyModal.vue'
import axios from 'axios'

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err)
}

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
    // api: 初始化
    init () {
        return axios.get('/autumn2019/init').then(this.apiHandler).then(this.dataHandler)
    },
    // api: 购买礼物
    buyGift (num) {
        return axios.get('/autumn2019/buyProduct', {
            params: {
                pid: 1993,
                num
            }
        }).then(this.apiHandler)
    },
    // api: 获取各类榜单
    getRank (stage, page, pageRow, type) {
        return axios.get('/autumn2019/ranks', {
            params: {
                stage,
                page,
                pageRow,
                type
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 入围赛主播榜
    getPreModRank (page) {
        console.log('get pre mod rank')
        return this.getRank(1, page, 15, 'mod')
    },
    // 用户榜
    getUserRank (page) {
        console.log('get user rank')
        return this.getRank(1, page, 15, 'user')
    },
    // 战队淘汰榜 12日/13日
    getInTeamRank (stage) {
        console.log('get in team rank')
        return this.getRank(stage, 0, 10, 'mod')
    },
    // 战队pk榜
    getPkRank () {
        console.log('get pk rank')
        return this.getRank(4, 0, 5, 'mod')
    },
    // 兑换碎片广播
    getBoardcast () {
        return axios.get('/autumn2019/broadcast').then(this.apiHandler).then(this.dataHandler)
    },
    // 当前碎片详情
    getSegInfo () {
        console.log('get seg info')
        return axios.get('/autumn2019/GetPieceGifts').then(this.apiHandler).then(this.dataHandler)
    },
    // 我的兑换详情
    getSegExInfo (type) {
        console.log('get seg ex info')
        return axios.get('/autumn2019/GetExchangeInfo', {
            params: { type }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 兑换碎片
    exchangeSeg (type, giftId) {
        return axios.get('/autumn2019/Exchange', {
            params: { type, giftId }
        }).then(this.apiHandler)
    },
    // 获取战队成员列表
    getMembers (stage, group) {
        console.log('get members')
        return axios.get('/autumn2019/teamDetails', {
            params: {
                stage, group
            }
        }).then(this.apiHandler).then(this.dataHandler)
    }
}

const CommonMixin = {
    components: {
        Loading, Toast, SvgPlayer, BuyModal
    },
    data: {
        per: '克拉', // pkg unit
        stage: 0, // 0 未开始 1 (100) 2,3 淘汰 4,5 对决 6 已结束
        showStage: 0,
        islogin: false,
        isMod: false,

        preQs: false,
        getinQs: false,
        finalQs: false,

        layerBuy: false,
        layerCharge: false,

        layerTeam: false,
        layerReward: false,
        layerSegs: false,
        layerDraw: false,
        layerSegConfirm: false,

        segConfirm: {
            type: 'mod',
            gid: '',
            val: 0,
            name: ''
        },

        tabSegs: 'mod',
        tabDrawSegs: 'mod',

        modTabName: {
            pre: 'btn2-s btn-tab-ruwei',
            getin: 'btn3-s btn-tab-tt',
            final: 'btn3-s btn-tab-final'
        },
        tabType: 'mod',
        rwweiSeg: [10, 8, 7, 6, 5, 4, 4, 4, 4, 4],

        // -> 入围榜 / 用户榜 数据池
        mainRanks: {
            currPage: 0,
            loading: false,
            hasNext: true,
            list: [],
            meCenter: null
        },

        // -> 战队榜 (淘汰榜)
        teamRanks: {
            list: [],
            meCenter: null
        },

        // -> 战队pk榜 14
        pkRanks: [
            { winner: 0, leftTeam: {}, rightTeam: {} },
            { winner: 0, leftTeam: {}, rightTeam: {} },
            { winner: 0, leftTeam: {}, rightTeam: {} },
            { winner: 0, leftTeam: {}, rightTeam: {} },
            { winner: 0, leftTeam: {}, rightTeam: {} }
        ],

        segBoard: [],

        seglist: {
            mod: [],
            user: []
        },

        segLeft: {
            user: 0,
            mod: 0
        },

        drawInfos: [],
        drawCenter: {
            left: 0,
            exchanged: 0,
            total: 0,
            score: 0
        },

        tipsStatus: false,
        tips: '',

        teamRankInd: 0,
        teamMembers: []
    },
    created () {
        if (this.pageType === 'pc') return
        const platform = common.getPlatformType() // eslint-disable-line
        if (platform !== 'ios_webview') {
            return
        }

        const per = common.getPackageId() // eslint-disable-line
        if (per === '8') {
            this.per = '果汁'
            return
        }
        if (per === '12') {
            this.per = '甜蜜'
            return
        }

        this.per = '克拉'
    },
    mounted () {
        this.showLoading()
        this.initScroller()
        this.init().then(this.loadRanks).then(() => {
            this.hideLoading()

            if (this.stage === 4) {
                // -> polling stage 4
                this.pollingPkTeam()
            }
        }).catch(this.errHandler)
    },
    filters: {
        pkScoreElip (score) {
            if (!score) return 0

            if (score < 10000) return score

            const nums = ((score / 1000) + '').split('.')

            return nums[0] + '.' + nums[1][0] + 'k'
        }
    },
    computed: {
        currStage () {
            if (this.showStage < 2) {
                return 'pre'
            }
            if (this.showStage < 4) {
                return 'getin'
            }
            return 'final'
        },
        listType () {
            if (this.tabType === 'user') return 'user'

            return this.currStage
        },
        ranks () {
            if (this.currStage === 'pre' || this.tabType === 'user') {
                const list = this.mainRanks.list
                const len = this.mainRanks.list.length
                if (!this.mainRanks.hasNext && len < 100) { // 补足数据
                    const res = []
                    for (let i = len; i < 100; i++) {
                        res.push({
                            nickname: '虚位以待',
                            score: '--'
                        })
                    }
                    return list.concat(res)
                }
                return list
            }
            return []
        },
        pkRanksWash () {
            return this.pkRanks.map(item => {
                const la = Math.max(item.score || 0, 1)
                const lb = Math.max(item.to_score || 0, 1)
                const total = la + lb
                const progress = Math.min(Math.max(la / total * 100, 8), 92).toFixed(2)
                return {
                    ...item,
                    progress
                }
            })
        },
        teamMembersNum () {
            return {
                2: 10,
                3: 8,
                4: 5,
                5: 5
            }[this.showStage]
        },
        teamSegDate () {
            return {
                2: 12,
                3: 13,
                4: 14,
                5: 15
            }[this.showStage]
        },
        // 战队内部成员榜 的 奖励碎片显示
        teamSeg () {
            if (this.showStage === 5) {
                if (this.teamRankInd < 3) {
                    return [10, 8, 6, 4, 4]
                }
                return []
            }
            if (this.showStage === 4) {
                return [10, 8, 6, 4, 4]
            }

            let target
            if (this.teamRankInd < 3) {
                target = [10, 8, 8, 6, 6, 6, 6, 6]
            } else if (this.teamRankInd < 6) {
                target = [8, 6, 6, 4, 4, 4, 4, 4]
            } else {
                target = [6, 4, 4, 2, 2, 2, 2, 2]
            }

            if (this.showStage === 2) {
                return target
            }
            if (this.showStage === 3) {
                return target.slice(0, 5)
            }
        },
        getInCenterTips () {
            const data = this.teamRanks.meCenter
            if (!data) return ''

            if (this.showStage === 2) {
                if (data.rank == '10' || data.rank == '9') { // eslint-disable-line
                    return '有淘汰风险'
                }
                return '今日淘汰队内末尾2名'
            }

            if (this.showStage === 3) {
                if (data.rank == '8' || data.rank == '7') { // eslint-disable-line
                    return '有淘汰风险'
                }
                return '今日淘汰队内末尾3名'
            }
            return ''
        },
        getInCenterTeamRank () {
            const data = this.teamRanks.meCenter
            if (!data) return ''

            const target = this.teamRanks.list
            let res = ''
            for (let i = 0; i < target.length; i++) {
                if (target[i].group === this.groupId) {
                    res = i + 1
                }
            }
            return res
        }
    },
    methods: {
        errHandler (err) {
            this.showToast(err.message)
            this.hideLoading()
        },
        showLoading () {
            this.$refs.loading.show()
        },
        hideLoading () {
            this.$refs.loading.hide()
        },
        showToast (msg) {
            this.$refs.toast.show(msg)
        },
        showTips (msg) {
            this.tipsStatus = true
            this.tips = msg
        },
        hideTips () {
            this.tipsStatus = false
        },
        preview (path) {
            this.$refs.svgPlayer.playSvg(path)
        },
        toggleLayer (type) {
            if (!(type in this)) return
            this[type] = !this[type]

            if (type === 'layerReward' && this.layerReward) {
                this.resetRwS()
            }

            if (type === 'layerSegs') {
                if (this.layerSegs) {
                    this.triggerSegShow()
                } else {
                    this.triggerSegHide()
                }
            }
        },
        goBuy () {
            if (this.stage === 6 || this.stage === 0) return // 活动已结束 或 未开始

            if (!this.islogin) {
                this.goLogin()
                return
            }

            this.$refs.buyModal.show()
        },
        goPurchase (num) {
            // -> 前往购买
            if (num <= 0 || num > 9999) {
                this.$refs.toast.show('请输入正确的购买数量')
                return
            }
            this.showLoading()
            service.buyGift(num).then(res => {
                this.hideLoading()
                this.$refs.buyModal.hide()
                if (res.errno === 0) {
                    this.showToast('礼物已放至您的背包，请注意查收！')
                    if (this.refreshBackpack) this.refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.toggleLayer('layerCharge')
                    } else {
                        this.showToast(res.msg)
                    }
                }
            }).catch(err => {
                this.hideLoading()
                this.showToast(err.message)
            })
        },
        // 主tab切换 赛程切换
        goStage (name) {
            if (name === this.currStage) return // 当前阶段不切换

            const resetStage = (name) => {
                // 入围赛
                if (name === 'pre') {
                    this.showStage = 1
                    this.resetRanks()
                    return true
                }

                // 淘汰赛
                if (name === 'getin') {
                    // 未到日期
                    if (this.stage < 2) {
                        this.showToast('战队淘汰赛 开启时间为9月12日 00:00')
                        return false
                    }
                    this.resetTeamRanks()
                    if (this.stage === 2) {
                        this.showStage = 2
                        return true
                    }
                    this.showStage = 3
                    return true
                }

                // final
                if (this.stage < 4) {
                    this.showToast('战队对决赛 开启时间为9月14日 00:00')
                    return false
                }
                if (this.stage === 4) {
                    this.showStage = 4
                    return true
                }
                this.showStage = 5
                return true
            }

            if (!resetStage(name)) return

            // ! rank refresh
            this.tabType = 'mod'
            this.resetRankScroller()

            this.showLoading()
            this.loadRanks().then(() => {
                this.hideLoading()
            }).catch(this.errHandler)
        },
        // 二级tab切换
        goModTab () {
            if (this.tabType === 'mod') return
            this.tabType = 'mod'

            if (this.currStage === 'pre') {
                this.resetRanks()
            }

            if (this.currStage === 'getin') {
                this.showStage = Math.min(this.stage, 3)
                this.resetTeamRanks()
            }

            if (this.currStage === 'final') {
                this.showStage = Math.min(this.stage, 5)
                this.resetTeamRanks()
            }

            this.resetRanks()
            this.showLoading()
            this.loadRanks().then(() => {
                this.hideLoading()
            }).catch(this.errHandler)
        },
        goUserTab () {
            if (this.tabType === 'user') return
            this.tabType = 'user'

            this.resetRanks()

            this.showLoading()
            this.loadRanks().then(() => {
                this.hideLoading()
            }).catch(this.errHandler)
        },
        // 三级tab 日期切换
        changeShowStage (sstage) {
            if (sstage > this.stage) return // 赛程未到

            if (sstage === this.showStage) return // 当前赛程 不切换

            this.resetTeamRanks()
            this.resetPkTeamRanks()
            this.showStage = sstage

            this.showLoading()
            this.loadRanks().then(() => {
                this.hideLoading()
            }).catch(this.errHandler)
        },
        // 展开全部队员
        showTeams (group, tRank) {
            this.toggleLayer('layerTeam')
            this.teamRankInd = tRank

            this.teamMembers = []
            this.resetTeamS()

            this.showLoading()
            service.getMembers(this.showStage, group).then(data => {
                this.hideLoading()
                this.teamMembers = data
            }).catch(err => {
                this.showToast(err.message)
                this.hideLoading()
            })
        },
        showTeamsBySearch (group) {
            const data = this.teamRanks
            let findi = -1
            for (let i = 0; i < data.length; i++) {
                if (data[i].group === group) {
                    findi = i
                }
            }

            this.showTeams(group, findi)
        },
        goSegsTab (tabSegs) {
            if (tabSegs === this.tabSegs) return

            this.tabSegs = tabSegs
        },
        showDraw () {
            if (!this.islogin) {
                this.goLogin()
                return
            }
            if (this.stage === 0) {
                this.showToast('活动暂未开始')
                return
            }

            this.toggleLayer('layerDraw')

            if (this.isMod) {
                this.tabDrawSegs = 'mod'
            }

            this.loadDrawlist()
        },
        goDrawTab (tabDrawSegs) {
            if (tabDrawSegs === this.tabDrawSegs) return

            this.resetDrawSegS()
            this.tabDrawSegs = tabDrawSegs

            this.loadDrawlist()
        },
        loadDrawlist () {
            this.showLoading()
            service.getSegExInfo(this.tabDrawSegs).then(data => {
                this.drawInfos = data.list
                this.drawCenter.left = data.left
                this.drawCenter.exchanged = data.exchanged
                this.drawCenter.total = data.total
                this.drawCenter.score = data.score
                this.hideLoading()
            }).catch(err => {
                this.showToast(err.message)
                this.hideLoading()
            })
        },
        triggerSegShow () {
            if (this.isMod) {
                this.tabSegs = 'mod'
            }
            this.resetSegS()

            this.showLoading()
            Promise.all([
                service.getBoardcast().then(data => {
                    this.segBoard = data
                    this.$nextTick(() => {
                        this.runBoard()
                    })
                }),
                service.getSegInfo().then(data => {
                    if (data.pieces_left) {
                        this.segLeft.mod = data.pieces_left.mod
                        this.segLeft.user = data.pieces_left.user
                    }
                    this.seglist.mod = data.gift_list.mod
                    this.seglist.user = data.gift_list.user
                })
            ]).then(() => {
                this.hideLoading()
            }).catch(err => {
                this.showToast(err.message)
                this.hideLoading()
            })
        },
        triggerSegHide () { },
        runBoard () {
            var msgWrapper = this.$refs.msgBoard
            var allWidth = msgWrapper.scrollWidth
            var cWidth = msgWrapper.clientWidth

            if (allWidth <= cWidth) {
                return
            }
            var left = 0
            var step = 0.6
            var _self = this

            var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

            function run () { // eslint-disable-line
                left -= step
                msgWrapper.style.transform = 'translate3d(' + left + 'px, 0px, 0px)'
                msgWrapper.style.webkitTransform = 'translate3d(' + left + 'px, 0px, 0px)'

                if (Math.abs(left) > (allWidth / 2)) {
                    left = 0
                }

                if (!_self.layerSegs) return // ! 如果弹窗关闭 则停止动画
                requestAnimationFrame(run)
            }

            requestAnimationFrame(run)
        },
        drawSeg (type, seg) {
            if (!this.islogin) {
                this.goLogin()
                return
            }
            if (!seg || !seg.gid) return

            if (this.stage === 0) {
                this.showToast('活动未开始！')
                return
            }

            if (seg.name === '8位靓号' && seg.toast === '您已成功兑换靓号，请勿重复兑换！') {
                this.showToast('您已成功兑换靓号，请勿重复兑换！')
                return
            }

            if (seg.nums && seg.nums[1] === 0) { // 份额已兑换完
                if (seg.nums[0] === '今日兑换') {
                    this.showToast(`${seg.name}每日仅可兑换${seg.nums[2]}次！今日已全部兑换！`)
                } else if (seg.nums[0] === '靓号兑换') {
                    this.showToast('3个靓号已兑换完毕！')
                } else {
                    this.showToast(`${seg.name}兑换有效期间仅可兑换${seg.nums[2]}次！已全部兑换！`)
                }
                return
            }

            if (seg.val > this.segLeft[this.tabSegs]) {
                this.showToast('呜呜呜，碎片不足！')
                return
            }

            this.segConfirm.type = type
            this.segConfirm.name = seg.name
            this.segConfirm.val = seg.val
            this.segConfirm.gid = seg.gid
            this.toggleLayer('layerSegConfirm')
        },
        confirmDraw () {
            this.showLoading()

            service.exchangeSeg(this.segConfirm.type, this.segConfirm.gid).then(res => {
                this.hideLoading()
                this.showToast(res.msg)

                // 兑换成功
                if (res.errno === 0) {
                    const findG = this.seglist[this.tabSegs].find((gifts) => {
                        return gifts.gid === this.segConfirm.gid
                    })
                    if (findG && findG.nums) { // 可兑换数量减少
                        findG.nums[1] = Math.max(findG.nums[1] - 1, 0)
                    }
                    this.segLeft[this.tabSegs] -= findG.val // 减少碎片数量
                }

                this.toggleLayer('layerSegConfirm')
            })
        },
        initScroller () {
            var scrollBox = function (ele, cb, ctx) {
                var bh = 150
                var _self = ctx
                var scrollEle = ele

                console.log('scroller')
                scrollEle.addEventListener('scroll', function () {
                    var toBottomH = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight
                    if (toBottomH < bh) {
                        cb.call(_self)
                    }
                }, false)
            }

            // 方法调用映射表
            scrollBox(this.$refs['rank-scroller'].$el, () => {
                this.loadRanks()
            }, this)
        },
        // 轮询加载
        pollingPkTeam () {
            setTimeout(() => {
                if (this.showStage !== 4 || this.tabType === 'user') {
                    this.pollingPkTeam() // -> 非展示 pk tab 跳过数据加载
                    return
                }

                console.log('polling -> pk rank')
                this.loadPkRank().then(data => {
                    this.pollingPkTeam() // -> next
                })
            }, 5000)
        },
        /* api */
        init () {
            return service.init().then(data => {
                this.stage = data.activityStatus
                this.showStage = Math.min(Math.max(data.activityStatus, 1), 5)
                this.islogin = data.isLogin
                this.isMod = data.isModerator
                this.groupId = data.group

                if (!this.isMod) {
                    this.tabSegs = 'user'
                    this.tabDrawSegs = 'user'
                }
            })
        },
        resetRanks () {
            this.resetRankScroller()
            this.mainRanks = {
                currPage: 0,
                loading: false,
                hasNext: true,
                list: [],
                meCenter: null
            }
        },
        resetTeamRanks () {
            this.teamRanks.list = []
            this.teamRanks.meCenter = null
        },
        resetPkTeamRanks () {
            this.pkRanks = [
                { winner: 0, leftTeam: {}, rightTeam: {} },
                { winner: 0, leftTeam: {}, rightTeam: {} },
                { winner: 0, leftTeam: {}, rightTeam: {} },
                { winner: 0, leftTeam: {}, rightTeam: {} },
                { winner: 0, leftTeam: {}, rightTeam: {} }
            ]
        },
        // 分发榜单
        loadRanks () {
            if (this.tabType === 'user') {
                return this.loadUserRank()
            }

            if (this.showStage === 1) {
                return this.loadPreRank()
            }

            if (this.showStage === 2) {
                return this.loadGetInRank(2)
            }

            if (this.showStage === 3) {
                return this.loadGetInRank(3)
            }

            if (this.showStage === 4) {
                return this.loadPkRank()
            }

            return this.loadGetInRank(5)
        },
        loadCommonRank (source, tag, maxNum, serviceName) {
            if (!source.hasNext) {
                console.log(`[loading ${tag}]: 没有更多数据...`)
                return
            }
            if (source.loading) {
                console.log(`[load ${tag}]: loading 正在加载中... 请稍后`)
                return
            }
            source.loading = true

            return service[serviceName](this.mainRanks.currPage).then(data => {
                var list = source.list.concat(data.data)

                source.hasNext = data.pageSum - (Number(data.pageNo)) > 1
                if (list.length > maxNum) {
                    source.list = list.slice(0, maxNum)
                    source.hasNext = false
                } else {
                    source.list = list
                }

                source.currPage += 1
                source.loading = false

                if (!source.inited) {
                    source.inited = true
                    source.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                }
            })
        },
        loadUserRank () {
            return this.loadCommonRank(this.mainRanks, 'user', 100, 'getUserRank')
        },
        loadPreRank () {
            return this.loadCommonRank(this.mainRanks, 'pre mod', 100, 'getPreModRank')
        },
        loadGetInRank (dateStage) {
            return service.getInTeamRank(dateStage).then(data => {
                this.teamRanks.list = data.data
                this.teamRanks.meCenter = data.myRank
            })
        },
        loadPkRank () {
            return service.getPkRank().then(data => {
                this.pkRanks = data
            })
        }
    }
}

export default CommonMixin
