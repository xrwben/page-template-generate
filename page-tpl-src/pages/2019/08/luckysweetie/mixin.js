import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'
import 'core-js/modules/es.array.find'

const source = {
    ani: {
        pc: {
            entry: '//static.guojiang.tv/app/gift/pc_animation/luckysweetie_pc/entry/data.json',
            float: '//static.guojiang.tv/app/gift/pc_animation/luckysweetie_pc/float/data.json'
        },
        mobile: {
            entry: '//static.guojiang.tv/app/gift/pc_animation/luckysweetie/entry/data.json',
            float: '//static.guojiang.tv/app/gift/pc_animation/luckysweetie/float/data.json'
        }
    }
}

const helpers = {
    loadScripts (src) {
        const s = document.createElement('script')

        return new Promise((resolve, reject) => {
            s.onload = resolve
            s.onabort = reject
            s.onerror = reject

            s.src = src

            document.body.appendChild(s)
        })
    },
    whenImgsLoaded (imgs) {
        return new Promise((resolve, reject) => {
            let flag = 1
            const waiter = () => {
                if (flag >= imgs.length - 1) {
                    resolve()
                    flag = null
                } else {
                    flag += 1
                }
            }

            imgs.forEach(item => {
                if (item.src.split('/').pop() === 'banner.jpg') {
                    return
                }
                if (item.complete) { // 已有缓存
                    flag += 1
                } else {
                    item.onload = item.onerror = item.onabort = waiter
                }
            })

            if (flag >= imgs.length - 1) {
                resolve()
                flag = null
            }
        })
    },
    bodymovin (wrapper, aniPath, loop, DOMLoadedHandler, completeHandler) {
        const wrapperEle = document.getElementById(wrapper)
        if (!wrapperEle || !bodymovin) return // eslint-disable-line

        const aniIns = bodymovin.loadAnimation({ // eslint-disable-line
            wrapper: wrapperEle,
            animType: 'html',
            loop: loop,
            autoplay: false,
            path: aniPath
        })

        // img_loaded ployfill
        DOMLoadedHandler && aniIns.addEventListener('DOMLoaded', function () {
            let imgs = wrapperEle.querySelectorAll('img')
            imgs = [].slice.call(imgs)
            helpers.whenImgsLoaded(imgs).then(() => {
                DOMLoadedHandler(aniIns)
            })
        })

        // complete
        completeHandler && aniIns.addEventListener('complete', () => {
            completeHandler(aniIns)
        })

        return aniIns
    }
}

const service = { // eslint-disable-line
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
        return axios.get('/luckySugar/init').then(this.apiHandler).then(this.dataHandler)
    },
    // 开奖列表 (已开奖 我的中奖记录 我的送出记录)
    getTrophyList (type) {
        return axios.get('/luckySugar/awardInfo', {
            params: {
                pos: type
            }
        }).then(this.apiHandler).then(this.dataHandler)
    },
    // 糖果主播榜
    getRanks () {
        return axios.get('/luckySugar/ranks').then(this.apiHandler).then(this.dataHandler)
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

const CommonMixin = {
    components: {
        Loading, Toast
    },
    data: {
        per: 1, // 单位map
        stage: 0,
        islogin: false,
        isMod: false,
        mid: 0,

        rwTab: 1,
        rwTabMap: [
            null,
            ['txt-s txt-x1-c1', 'txt-s txt-x1-c2', 'txt-s txt-x1-c3', 'txt-s txt-x1-c4', 'txt-s txt-x1-c5'],
            ['txt-s txt-x1-c2', 'txt-s txt-x1-c3', 'txt-s txt-x1-c4', 'txt-s txt-x1-c5'],
            ['txt-s txt-x3-c1', 'txt-s txt-x1-c4', 'txt-s txt-x1-c5']
        ],

        trophyId: 283,
        trophyNum: 0,
        trophyMap: [
            null,
            { name: 'mmm', needs: 330, pid: 283 },
            { name: 'prxd', needs: 1100, pid: 110 },
            { name: 'bx', needs: 2199, pid: 583 },
            { name: 'wishes', needs: 3344, pid: 5117 },
            { name: 'cnst', needs: 5550, pid: 5116 },
            { name: 'plane', needs: 9999, pid: 240 },
            { name: 'ship', needs: 15000, pid: 5089 }
            // { name: 'king', needs: 99999, pid: 212 }
        ],

        trophyList: [],

        layerRules: false,

        ranks: {
            list: [],
            meCenter: null
        }
    },
    computed: {
        currTrophy () {
            return this.trophyMap.find(item => item && item.pid === this.trophyId)
        },
        progBlocks () {
            if (this.trophyNum === 0) return 0
            return Math.max((this.trophyNum / this.currTrophy.needs) * 26 >> 0, 1)
        },
        top3 () {
            const top3 = this.ranks.list.slice(0, 3)
            return top3.length < 3 ? top3.concat([null, null, null].slice(0, 3 - top3.length)) : top3
        },
        ranklists () {
            const lists = this.ranks.list.slice(3)
            return lists.length < 7 ? lists.concat([null, null, null, null, null, null, null].slice(0, 7 - lists.length)) : lists
        }
    },
    created () {
        const platform = common.getPlatformType() // eslint-disable-line
        if (platform !== 'ios_webview') {
            return
        }

        const per = common.getPackageId() // eslint-disable-line

        if (per === '8') {
            this.per = 2
            return
        }
        if (per === '12') {
            this.per = 3
            return
        }

        this.per = 1
    },
    mounted () {
        helpers.loadScripts('//static.guojiang.tv/pc/v3/js/component/bodymovin.js').then(done => {
            this.goAni()
        })

        this.showLoading()
        Promise.all([
            this.init(),
            this.getTrophyList(this.rwTab - 1),
            this.getRanks()
        ]).then(() => {
            this.hideLoading()
            this.startPolling()
        }).catch(err => {
            this.showToast(err)
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
            this.$refs.toast.show(msg)
        },
        goAni () {
            const entry = helpers.bodymovin('ani-box1', source.ani[this.pageType].entry, false, (ins) => {
                ins.play()
            }, () => {
                helpers.bodymovin('ani-box2', source.ani[this.pageType].float, true, (ins) => {
                    document.getElementById('ani-box1').style.opacity = 0
                    entry.destroy()
                    document.getElementById('ani-box2').style.opacity = 1
                    ins.play()
                })
            })
        },
        changeTab (type) {
            if (this.rwTab === type) return

            if ((type === 2 || type === 3) && !this.islogin) {
                this.goLogin()
                return
            }

            this.rwTab = type
            this.trophyList = []

            this.resetRwS()
            this.showLoading()
            this.getTrophyList(type - 1).then(() => {
                this.hideLoading()
            })
        },
        toggleRule () {
            this.layerRules = !this.layerRules

            if (this.layerRules) {
                this.resetRuleS()
            }
        },
        // logic
        init () {
            return service.init().then(data => {
                this.stage = data.isActivity
                this.islogin = data.isLogin
                this.trophyId = data.pid
                this.trophyNum = data.currentNum
            })
        },
        getTrophyList (type) {
            return service.getTrophyList(type).then(data => {
                this.trophyList = data
            })
        },
        getRanks () {
            return service.getRanks().then(data => {
                this.ranks.list = data.data
                this.ranks.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null

                if (this.ranks.meCenter) {
                    this.isMod = true
                    this.mid = +(this.ranks.meCenter.id || this.ranks.meCenter.uid)
                }
            })
        },
        atte (info) {
            if (!this.islogin) {
                this.goLogin()
                return Promise.reject(new Error('未登录'))
            }

            if (!info || info._holder || !info.id || info.isLoved) {
                return Promise.reject(new Error('参数错误'))
            }

            return service.attend(info.id || info.mid).then(data => {
                if (data.errno === 0) {
                    info.isLoved = true
                } else {
                    this.showToast(data.msg)
                }
            }).catch(err => {
                this.showToast(err.message)
            })
        },
        startPolling () {
            // 5s 轮询数据
            if (this.stage === 2) return // 活动已结束不轮询
            setTimeout(() => {
                service.init().then(data => {
                    if (this.trophyId !== data.pid) {
                        // 当前礼物开奖了 -> 刷新中奖列表
                        this.getTrophyList(this.rwTab - 1)
                    }

                    this.stage = data.isActivity
                    this.trophyId = data.pid
                    this.trophyNum = data.currentNum

                    this.startPolling()
                })
            }, 5000)
        }
    }
}

export default CommonMixin
