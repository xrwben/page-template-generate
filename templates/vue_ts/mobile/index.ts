'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge, refreshBackpack, getPlatformType, getPackageId } from 'common'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
}

Vue.prototype.pageType = 'pc'

Vue.prototype.giftPer = (function () {
    const platform = getPlatformType()
    if (platform === 'ios_webview') {
        const per = getPackageId()
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

new Vue({
    el: '#app',
    components: {
        ScrollBar: {
            template: '<div><slot/></div>'
        }
    },
    mixins: [CommonMixin],
    data: {
        // pageType: 'app'
    },
    methods: {
        goRoom (infos: any) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin () {
            goLogin()
        },
        goRecharge,
        refreshBackpack
    }
})
