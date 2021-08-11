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
        pageType: 'pc'
    },
    mounted () {
        document.getElementById('banner').style.height = document.body.getBoundingClientRect().width / 1920 * 921 + 'px'
    },
    updated () {
        this.$refs['rw-scroller'] && this.$refs['rw-scroller'].refreshDOM()
        this.$refs['rules-scroller'] && this.$refs['rules-scroller'].refreshDOM()
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
        resetRwS () {
            this.$refs['rw-scroller']._resetBox()
            this.$refs['rw-scroller']._refresh()
        }
    }
})
