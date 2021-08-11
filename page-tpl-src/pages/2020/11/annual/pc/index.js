'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
import PcScroller from '../../shared/components/pc/PCScroller.vue'
import router from '../router.js'

import './style.less'
import CommonMixin from '../mixin.js'
// 打包后增加大约700kb
// import 'core-js/stable'
// import 'regenerator-runtime/runtime'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
}

// 全局注入
Vue.component('PcScroller', PcScroller)

Vue.prototype.pageType = 'pc'

Vue.prototype.isSocialPackage = false

Vue.prototype.giftPer = '克拉'

Vue.prototype.goRoom = (infos) => {
    if (!infos) return

    const rid = infos.id || infos.mid || infos.uid
    rid && window.open('/' + rid, '_blank')
}

Vue.prototype.goLogin = showLoginPanel

Vue.prototype.goRecharge = () => {
    window.open('/recharge/center', '_blank')
}

new Vue({
    el: '#app',
    router,
    mixins: [CommonMixin],
    data: {
        // pageType: 'pc'
    },
    mounted () {},
    methods: {}
})
