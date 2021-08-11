'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge, refreshBackpack, getPlatformType, getPackageId, isSocialPackage } from 'common'
import router from '../router.js'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
}

// 全局注册
Vue.component('PcScroller', Vue.extend({
    template: '<div><slot/></div>'
}))

Vue.prototype.pageType = 'app'

Vue.prototype.isSocialPackage = (function () {
    const socialPackage = isSocialPackage() // eslint-disable-line
    return socialPackage
})()

Vue.prototype.giftPer = (function () {
    const platform = getPlatformType() // eslint-disable-line
    if (platform === 'ios_webview') {
        const per = getPackageId() // eslint-disable-line
        if (per === '11') {
            return '花瓣'
        }
        if (per === '12') {
            return '甜蜜'
        }
        return '克拉'
    }
    return '克拉'
})()

Vue.prototype.goRoom = (infos) => {
    if (!infos || !infos.rid) return
    goRoom(infos.rid)
}

Vue.prototype.goRecharge = goRecharge

Vue.prototype.goLogin = goLogin

Vue.prototype.refreshBackpack = refreshBackpack

new Vue({
    el: '#app',
    router,
    mixins: [CommonMixin],
    data: {
        // pageType: 'app'
    },
    mounted () {},
    methods: {}
})
