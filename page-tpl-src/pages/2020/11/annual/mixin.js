import Vue from 'vue'
import axios from 'axios'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'
import SvgPlayer from '../shared/components/SvgPlayer.vue'
import Rule from './components/Rule.vue'
import { loadScript } from '../shared/utils/loadScript.js'
// import VueLazyLoad from '../../packages/vue-lazyload.js'
// Vue.use(VueLazyLoad, {
//     // preLoad: 1,
//     // error: require('./assets/img/error.jpg'),
//     // loading: require('./assets/img/homePage_top.jpg'),
//     // attempt: 2
// })

Vue.prototype.$axios = axios

// Vue.component('Toast', Vue.extend({
//     Toast
// }))
// Vue.component('Loading', Vue.extend({
//     Loading
// }))

const CommonMixin = {
    components: {
        Loading, Toast, SvgPlayer, Rule
    },
    data () {
        return {
            isLogin: false,
            isMod: false,
            activityStatus: 0, // 0-未开始 1-海选赛 2-预选赛 3-赛道报名 4-晋级赛 5-赛道争霸 6-超级冠军赛 -1-结束
            stage: 1, // 第几天
            // 动效
            aniEntryIns: null,
            aniFloatIns: null,
            animationSrc: {
                app: {
                    entry: '//static.guojiang.tv/app/gift/h5_animation/annual2020/app/entry.json',
                    float: '//static.guojiang.tv/app/gift/h5_animation/annual2020/app/float.json'
                },
                pc: {
                    entry: '//static.guojiang.tv/app/gift/h5_animation/annual2020/pc/entry.json',
                    float: '//static.guojiang.tv/app/gift/h5_animation/annual2020/pc/float.json'
                }
            },
            currentPath: '',
            // 规则弹窗
            showRulePopup: false,
            // 分享文案
            shareObj: [
                {
                    title: '2020星光年度盛典',
                    content: '21天鏖战厮杀，万众江湖谁能笑傲叱咤，江山如画谁能君临天下~'
                },
                {
                    title: '2020星光年度盛典-海选赛',
                    content: '年度盛典正式开启，万中选一，选的就是你！！！'
                },
                {
                    title: '2020星光年度盛典-预选赛',
                    content: '仅有的100个席位，你还在等什么！！！'
                },
                {
                    title: '2020星光年度盛典-赛道报名',
                    content: '巅峰之战，从这一刻的选择正式打响！！！'
                },
                {
                    title: '2020星光年度盛典-晋级赛',
                    content: '强强对决，竞争最激烈的晋级赛，就等你来~'
                },
                {
                    title: '2020星光年度盛典-赛道争霸',
                    content: '残酷的车轮战，只有强者才能笑到最后！'
                },
                {
                    title: '2020星光年度盛典-超级冠军赛',
                    content: '冠军之夜，谁能笑傲2020年终桂冠呢？'
                }
            ]
        }
    },
    provide () {
        return {
            getContext: () => ({
                isLogin: this.isLogin,
                isMod: this.isMod,
                activityStatus: this.activityStatus,
                stage: this.stage
            })
        }
    },
    computed: {
        appIconEntry () {
            return window.location.href.indexOf('appicon') > -1
        }
    },
    created () {
        this.init()
    },
    mounted () {
        Vue.prototype.$toast = this.$refs.toast
        Vue.prototype.$loading = this.$refs.loading
        Vue.prototype.$SvgPlayer = this.$refs.svgPlayer

        // 如果不是app半屏进入则加载动效插件
        !this.appIconEntry && loadScript('//static.guojiang.tv/pc/v3/js/component/bodymovin.js').then(() => {
            this.loadAnimation()
        })
    },
    destroyed () {
        this.aniEntryIns.destroy()
        this.aniFloatIns.destroy()
    },
    methods: {
        // 初始化数据
        init () {
            // 先发布预告的特殊处理
            // if (this.activityStatus === 0) {
            //     this.goRoute('/reward', false)
            //     return
            // }
            axios.get('/Anniversary2020/initInfo').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.isLogin = resData.isLogin
                    this.isMod = resData.isMod
                    this.activityStatus = resData.activityStatus
                    this.stage = resData.stage
                    // 当前tab选择
                    this.activityStatus === 0 ? this.goRoute('/reward', false) : this.goRoute('/competition', false)
                    // 初始化分享
                    this.initShare()
                } else {
                    this.$refs.toast.show(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            })
        },
        // 加载动效
        loadAnimation () {
            console.log('this.pageType>>', this.pageType)
            if (this.pageType === 'app') {
                this.aniEntryIns = this.newAniIns('.animation-entry', this.animationSrc.app.entry, false)
                this.aniFloatIns = this.newAniIns('.animation-float', this.animationSrc.app.float, true)
            }
            if (this.pageType === 'pc') {
                this.aniEntryIns = this.newAniIns('.animation-entry', this.animationSrc.pc.entry, false)
                this.aniFloatIns = this.newAniIns('.animation-float', this.animationSrc.pc.float, true)
            }
            // console.log(this.aniEntryIns, this.aniFloatIns)
            this.aniEntryIns.addEventListener('DOMLoaded', () => {
                let imgs = document.querySelector('.animation-entry').querySelectorAll('img')
                console.log(imgs)
                imgs = [].slice.call(imgs)
                this.waitImgs(imgs).then(() => {
                    console.log('开始播放第一段')
                    this.aniEntryIns.play()
                })
            })
            this.aniEntryIns.addEventListener('complete', () => {
                console.log('第一段完成')
                document.querySelector('.animation-float').style.display = 'block'
                console.log('开始播放第二段')
                this.aniFloatIns.play()
                document.querySelector('.animation-entry').style.display = 'none'
                this.aniEntryIns.destroy()
            })
        },
        newAniIns (el, path, loop) {
            el = document.querySelector(el)
            let type = 'svg' /* banner opening svg: 解决ios高版本机型 动效展示不完全 */
            if (!!window.ActiveXObject || 'ActiveXObject' in window) { /* ie - 不支持 svg 动效 */
                type = 'html'
            }
            // eslint-disable-next-line no-undef
            return bodymovin.loadAnimation({
                container: el,
                renderer: type || 'html',
                loop: loop,
                autoplay: false,
                path: path
            })
        },
        waitImgs (imgs) {
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
        // 初始化分享
        initShare () {
            if (this.activityStatus === -1) {
                return
            }
            window.gjShareParam = JSON.stringify({
                title: this.shareObj[this.activityStatus].title,
                content: this.shareObj[this.activityStatus].content,
                link: location.href,
                imgLink: require('./images/share.png')
            })
            // eslint-disable-next-line no-undef
            typeof gBridge !== 'undefined' && gBridge.setShareData(window.gjShareParam)
            document.title = this.shareObj[this.activityStatus].title
        },
        // 关闭规则弹窗
        closeRulePopup () {
            this.showRulePopup = false
        },
        // 路由跳转
        goRoute (path, type = true) {
            console.log(path)
            if (path === this.currentPath) {
                return
            }
            if (this.activityStatus === 0 && type) {
                this.$refs.toast.show(`开启时间为11月25日 11:00:00`)
                return
            }
            this.$router.replace(path).catch(err => err)
            this.currentPath = path
        }
    }
}

export default CommonMixin
