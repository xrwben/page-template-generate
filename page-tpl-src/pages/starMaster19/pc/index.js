'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line
import PCScroller from '../../shared/components/pc/PCScroller.vue'

import './style.less'
import CommonMixin from '../mixin'

new Vue({
    el: '#app',
    components: {
        scroller: PCScroller
    },
    mixins: [CommonMixin],
    data: {
    },
    mounted () {
    },
    updated () {
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
        this.$refs['stars-scroller'] && this.$refs['stars-scroller'].refreshDOM()
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
        resetRuleS () {
            this.$refs['rules-scroller']._resetBox()
            this.$refs['rules-scroller']._refresh()
        },
        resetStarS () {
            this.$refs['stars-scroller']._resetBox()
            this.$refs['stars-scroller']._refresh()
        }
    }
})
