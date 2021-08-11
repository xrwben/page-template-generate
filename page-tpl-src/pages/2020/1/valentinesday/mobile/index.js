'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge, refreshBackpack } from 'common'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.log(err, vm, info)
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
        resetPKRankScroller () {
            this.$refs['pk-rank-scroller'].$el.scrollTop = 0
        },
        goRoom (infos) {
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
