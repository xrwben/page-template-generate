'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge } from 'common'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err, vm, info)
}

new Vue({
    el: '#app',
    components: {
        PcScroller: {
            template: '<div><slot/></div>'
        }
    },
    mixins: [CommonMixin],
    data: {
        pageType: 'app'
    },
    mounted () {},
    methods: {
        resetRankScroller () {
            this.$refs['rank-scroller'].$el.scrollTop = 0
        },
        resetRuleScroller () {
            this.$refs['rule-scroller'].$el.scrollTop = 0
        },
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin () {
            goLogin()
        },
        goRecharge
    }
})
