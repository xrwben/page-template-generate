'use strict'

import Vue from 'vue'
import axios from 'axios'
import { getPlatformType } from 'common'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

import './style.less'
const url = require('url')
const querystring = require('querystring')

new Vue({
    el: '#app',
    components: { Toast, Loading },
    data: {
        platform: '',
        showTips: false,
        showOp: false,
        packageId: 0,
        packageA: null,
        packageB: null
    },
    mounted: function () {
        this.platform = getPlatformType()
        const arg = url.parse(location.href).query
        // 将arg参数字符串反序列化为一个对象
        const params = querystring.parse(arg)
        this.packageId = params.packageId
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
        getMoreInfo () {
            this.showOp = true
        },
        init () {
            return axios.get('/download/iosInstallInfo', {
                params: {
                    packageId: this.packageId
                }
            }).then(res => {
                if (res.status !== 200) {
                    throw new Error('网络异常:', res.statusText)
                }
                const data = res.data
                if (data.errno !== 0) {
                    throw new Error('异常:', data.msg)
                }

                data.data.forEach(pkg => {
                    if (pkg.qrcode_location === '1') {
                        this.packageA = pkg
                    }
                    if (pkg.qrcode_location === '2') {
                        this.packageB = pkg
                    }
                })
            })
        },
        precheck () {
            if (this.platform === 'wechat' || this.platform === 'QQ' || this.platform === 'android_webview' || this.platform === 'ios_webview') {
                this.showTips = true
                return false
            }
            if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                this.$refs.toast.show('只支持iOS设备下载')
                return false
            }
            return true
        },
        goInstall (type) {
            if (!this.precheck()) return

            let target
            if (type === 1) {
                target = this.packageA
            }
            if (type === 2) {
                target = this.packageB
            }
            if (!target || !target.link) {
                this.$refs.toast.show('下载链接无效')
                return
            }
            location.href = target.link.replace(/&amp;/g, '&')
        },
        goCert () {
            if (!this.precheck()) return

            location.href = 'https://static.guojiang.tv/ios/ipa/edix.mobileprovision'
        },
        hideLayer () {
            this.showTips = false
        }
    }
})
