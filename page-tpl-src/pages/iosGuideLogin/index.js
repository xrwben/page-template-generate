'use strict'

import Vue from 'vue'
// import axios from 'axios'
import { getPlatformType } from 'common'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

import './style.less'

const origin = window.location.origin
const VIP_IOS_GUIDE_LINK = origin + '/dist/vmaker/iosVipGuide.html' + location.search
const VIP_IOS_GUIDE_LINK_ENCODE = encodeURIComponent(VIP_IOS_GUIDE_LINK)

new Vue({
    el: '#app',
    components: { Toast, Loading },
    data: {
        platform: ''
    },
    mounted: function () {
        this.platform = getPlatformType()

        // this.$refs.loading.show()
        // this.init().then(() => {
        //     this.$refs.loading.hide()
        // }).catch(err => {
        //     this.$refs.loading.hide()
        //     this.$refs.toast.show(err.message)
        // })
    },
    methods: {
        loginByPhone () {
            location.href = origin + '/user/loginTwo?callback=' + VIP_IOS_GUIDE_LINK_ENCODE
        },
        loginByQQ () {
            location.href = origin + '/user/qqLogin?callback=' + VIP_IOS_GUIDE_LINK_ENCODE
        },
        loginByWx () {
            location.href = origin + '/user/wxLogin?callback=' + VIP_IOS_GUIDE_LINK_ENCODE
        },
        loginByWeibo () {
            location.href = origin + '/user/weiboLogin?callback=' + VIP_IOS_GUIDE_LINK_ENCODE
        }
    }
})
