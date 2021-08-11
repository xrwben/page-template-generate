'use strict'

import Vue from 'vue'
import PcScroller from '../../shared/components/pc/PCScroller.vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'
import CommonMixin from '../mixin'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

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
        this.$refs['contribution-scroller'] && this.$refs['contribution-scroller'].refreshDOM()
        this.$refs['rw-rank-scroller'] && this.$refs['rw-rank-scroller'].refreshDOM()
        this.$refs['pk-rank-scroller'] && this.$refs['pk-rank-scroller'].refreshDOM()
    },
    methods: {
        resetPKRankScroller () {
            this.$refs['pk-rank-scroller'] && this.$refs['pk-rank-scroller']._resetBox()
            this.$refs['pk-rank-scroller'] && this.$refs['pk-rank-scroller']._refresh()
        },
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
            window.locatioin.relaod()
        }
    }
})
