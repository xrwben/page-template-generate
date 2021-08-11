'use strict'

import Vue from 'vue'
import axios from 'axios'
import { getPlatformType } from 'common'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

import './style.less'

function getQSParams () {
    const result = {}
    let qs = window.location.search
    if (!qs) return result

    qs = qs.slice(1).split('&')
    qs.forEach(kv => {
        const target = kv.split('=')
        result[target[0].trim()] = target[1].trim()
    })

    return result
}

function getCookie () {
    const cookieStr = document.cookie
    const cookie = {}

    cookieStr.split(';').forEach(kv => {
        const target = kv.trim().split('=')
        cookie[target[0].trim()] = target[1].trim()
    })

    return cookie
}

new Vue({
    el: '#app',
    components: { Toast, Loading },
    data: {
        loaded: false,

        platform: '',
        // showTips: false, // 不需要showTips因为第三方下载链接中会有
        showOp: false,
        showWarn: false,
        showSecret: false,

        hasAccess: false,
        secret: '',
        downloadLink: '',

        uid: '',
        currPkg: '',
        packageId: '0',
        package: {
            display_name: '--',
            introduction: '--'
        }
    },
    created () {
        const query = getQSParams()
        const cookie = getCookie()
        if (query.packageId) {
            this.packageId = query.packageId
        }
        this.currPkg = query.pkg || ''
        this.uid = cookie.uid
    },
    mounted () {
        this.platform = getPlatformType().toLowerCase()

        this.$refs.loading.show()
        this.init().then(() => {
            this.$refs.loading.hide()
        }).catch(err => {
            this.$refs.loading.hide()
            this.$refs.toast.show(err.message)
        })
    },
    methods: {
        closeOp () {
            this.showOp = false
        },
        closeWarn () {
            this.showWarn = false
        },
        // hideLayer () {
        //     this.showTips = false
        // },
        closeSecret () {
            this.showSecret = false

            this.secret = ''
            this.downloadLink = ''
        },
        getMoreInfo () {
            this.showOp = true
        },
        initFakeData () {
            if (this.currPkg === 'tc') {
                this.package = {
                    display_name: '星光直播',
                    introduction: '使用腾讯美颜'
                }
            }
            if (this.currPkg === 'fu') {
                this.package = {
                    display_name: '星光直播-FU美颜',
                    introduction: '使用Faceu美颜增加脸部特效'
                }
            }
        },
        init () {
            // 检查是否有资格下载
            return axios.get('/download/IosPersonalInfo', {
                params: {
                    packageId: this.packageId
                }
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error('网络异常:', res.statusText)
                }
                const data = res.data

                // ! -> 未登录: location.href
                if (data.errno === 100 && data.msg === '未登录') {
                    location.href = '/dist/vmaker/iosGuideLogin.html' + location.search
                    return
                }

                this.loaded = true

                // ! -> hasAccess = false
                if (data.errno === 102 && data.msg === '非VIP用户') {
                    this.initFakeData()
                    this.hasAccess = false
                    return
                } else {
                    this.hasAccess = true
                }

                if (this.currPkg === 'tc') {
                    this.package = data.data[0]
                }
                if (this.currPkg === 'fu') {
                    this.package = data.data[1]
                }
            })
        },
        precheck () {
            if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                this.$refs.toast.show('只支持iOS设备下载')
                return false
            }
            // if (this.platform === 'qq' || this.platform === 'android_webview' || this.platform === 'ios_webview') {
            //     this.showTips = true
            //     return false
            // }
            if (!this.hasAccess) {
                this.showWarn = true
                return false
            }
            return true
        },
        goInstall () {
            if (!this.precheck()) return

            const target = this.package

            if (!target || !target.link) {
                this.$refs.toast.show('下载链接无效')
                return
            }

            this.secret = atob(target.secret)
            this.downloadLink = target.link
            this.showSecret = true
        },
        goDownload () {
            // 复制密码
            // location.href = this.downloadLink.replace(/&amp;/g, '&')
            this.copyCode()
            location.href = this.downloadLink
            // console.log('前往下载', this.secret, this.downloadLink)
        },
        copyCode () {
            var span = document.querySelector('#secret')
            var range
            if (document.selection) {
                range = document.body.createTextRange()
                range.moveToElementText(span)
                range.select()
            } else if (window.getSelection) {
                var selection = window.getSelection()
                range = document.createRange()
                selection.removeAllRanges()
                range.selectNodeContents(span)
                selection.addRange(range)
            }

            document.execCommand('copy')
        }
    }
})
