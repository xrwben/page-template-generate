import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'
import avatarHolder from './mobile/images/avatar-holder.jpg'
import 'core-js/modules/es.object.assign'

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
        return axios.get('/guard2019/init').then(this.apiHandler).then(this.dataHandler)
    },
    getRank (type) {
        return axios.get('/guard2019/ranks', {
            params: {
                type
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    getStars (mid) {
        return axios.get('/guard2019/rankDetails', {
            params: {
                mid
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 关注通用接口
    // 关注主播
    attend (id) {
        return axios.get('/chenChen/attention', {
            params: {
                mid: id
            }
        }).then(this.apiHandler)
    }
}

function holderHelper (defaultNum, sourcelist, defaultData, fixFn) {
    const result = []
    for (let i = 0; i < defaultNum; i++) {
        const target = sourcelist[i]
        if (target) {
            fixFn && fixFn(target, i)
            result.push(target)
        } else {
            const newDefault = { _holder: true }
            Object.assign(newDefault, defaultData)
            fixFn && fixFn(newDefault, i)
            result.push(newDefault)
        }
    }
    return result
}

const CommonMixin = {
    components: {
        Loading,
        Toast
    },
    data: {
        // ...
        stage: 0,
        islogin: false,
        isMod: false,
        mid: null,

        starTop3: [],
        starMaster: [],

        rankTab: 'mod',

        ranks: {
            list: [],
            meCenter: null
        },

        layerRules: false,
        layerInfos: false,
        infoType: 1, //  1 - 其他人 2 - 自己

        starToplist: [],
        starGuards: []
    },
    filters: {
        numPer (value) {
            // 1w 一下 按源数据显示
            const target = +value || 0
            if (target < 10000) {
                return target
            } else {
                return (target * 10 / 1000 >> 0) / 10 + 'k'
            }
        }
    },
    mounted () {
        this.showLoading()

        Promise.all([
            this.init(),
            this.getRank()
        ]).then(() => {
            this.hideLoading()
        }).catch(err => {
            this.showToast(err.message)
            this.hideLoading()
        })
    },
    computed: {
        // 榜单前三
        showRankTop3 () {
            return holderHelper(3, this.ranks.list, {
                nickname: '虚位以待',
                headPic: avatarHolder,
                isPlaying: false,
                isLoved: false,
                score: '--'
            }, (target) => {
                if (target._holder) return target
                if (this.rankTab === 'mod' && target.id === this.mid) {
                    target.isLoved = true
                }
                return target
            })
        },
        // 榜单剩余
        showRankOh () {
            return holderHelper(7, this.ranks.list.slice(3), {
                nickname: '虚位以待',
                headPic: avatarHolder,
                isPlaying: false,
                isLoved: false,
                score: '--'
            }, null)
        },
        // 十二星主
        showStarTop () {
            return holderHelper(12, this.starToplist, {
                modName: '虚位以待',
                headPic: avatarHolder,
                isPlaying: false,
                score: '--',
                uName: '虚位以待'
            }, (target, i) => {
                let ind = (i + 3) % 12
                ind = ind === 0 ? 12 : ind
                target._ind = ind
                target._starName = this.getStarName(i)
                return target
            })
        },
        // 我的/他的星座排名
        showGuards () {
            return holderHelper(12, this.starGuards, {
                rank: '暂无排名',
                score: '--',
                nickname: '虚位以待'
            }, (target, i) => {
                let ind = (i + 3) % 12
                ind = ind === 0 ? 12 : ind
                target._ind = ind
                target._starName = this.getStarName(i)
                return target
            })
        }
    },
    methods: {
        getStarName (si) {
            return ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'][si] || ''
        },
        showLoading () {
            this.$refs.loading.show()
        },
        hideLoading () {
            this.$refs.loading.hide()
        },
        showToast (msg) {
            this.$refs.show(msg)
        },
        toggleRule () {
            this.layerRules = !this.layerRules
            this.resetRuleS()
        },
        toggleInfos (infos) {
            if (this.rankTab === 'user' || !infos || infos._holder || infos.mid) return

            this.layerInfos = !this.layerInfos

            if (!this.layerInfos) return

            this.resetStarS()

            const targetId = +(infos.id || infos.uid || 0)
            if (targetId === this.mid) {
                this.infoType = 2
            } else {
                this.infoType = 1
            }

            this.showLoading()
            this.loadStars(infos.id || infos.uid).then(() => {
                this.hideLoading()
            }).catch(err => {
                this.showToast(err.message)
                this.hideLoading()
            })
        },
        changeTab (tab) {
            if (this.rankTab === tab) return

            this.rankTab = tab

            this.showLoading()
            this.getRank().then(() => {
                this.hideLoading()
            }).catch(err => {
                this.showToast(err.message)
                this.hideLoading()
            })
        },
        init () {
            return service.init().then(data => {
                this.stage = data.activityStatus
                this.islogin = data.isLogin
                if (this.stage === 2) {
                    // 活动已结束
                    this.starTop3 = data.stars.slice(0, 3)
                    this.starMaster = data.stars.slice(3)
                }
            })
        },
        getRank () {
            this.ranks.list = []
            this.ranks.meCenter = null
            return service.getRank(this.rankTab).then(data => {
                this.ranks.list = data.data
                this.ranks.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null

                if (this.ranks.meCenter && this.rankTab === 'mod') {
                    this.isMod = true
                    this.mid = +(this.ranks.meCenter.id || this.ranks.meCenter.uid)
                }
            })
        },
        loadStars (mid) {
            this.starToplist = []
            this.starGuards = []
            return service.getStars(mid).then(data => {
                this.starToplist = data.guardUsers
                this.starGuards = data.guardRanks
            })
        },
        atte (info) {
            if (!this.islogin) {
                this.goLogin()
                return
            }

            if (!info || info._holder || !info.id || info.isLoved) {
                return
            }

            service.attend(info.id || info.mid).then(data => {
                if (data.errno === 0) {
                    info.isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        }
    }
}

export default CommonMixin
