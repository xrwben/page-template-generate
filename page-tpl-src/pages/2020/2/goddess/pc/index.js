'use strict'

import Vue from 'vue'
import PcScroller from '../../shared/components/pc/PCScroller.vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'
import CommonMixin from '../mixin'

new Vue({
    el: '#app',
    components: {
        PcScroller
    },
    mixins: [CommonMixin],
    data: {
        pageType: 'pc'
    },
    mounted () {},
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['card-scroller'] && this.$refs['card-scroller'].refreshDOM()
    },
    methods: {
        goRoom (infos) {
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
