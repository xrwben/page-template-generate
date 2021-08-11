'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user'
import ScrollBar from '../../shared/components/pc/ScrollBar.vue'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
}

Vue.prototype.pageType = 'pc'

Vue.prototype.giftPer = '克拉'

new Vue({
    el: '#app',
    components: {
        ScrollBar
    },
    mixins: [CommonMixin],
    data: {
        // pageType: 'pc'
    },
    methods: {
        goRoom (infos: any) {
            if (!infos) return

            const rid = infos.id || infos.mid || infos.uid
            rid && window.open('/' + rid, '_blank')
        },
        goLogin () {
            showLoginPanel()
        },
        goRecharge () {
            window.open('/recharge/center', '_blank')
        },
        refreshBackpack () {
            // window.location.reload()
        }
    }
})
