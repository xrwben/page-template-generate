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
        // ...
        pageType: 'pc'
    },
    mounted () {},
    updated () {
        this.$refs['segs-scroller'] && this.$refs['segs-scroller'].refreshDOM()
        this.$refs['rw-scroller'] && this.$refs['rw-scroller'].refreshDOM()
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['team-scroller'] && this.$refs['team-scroller'].refreshDOM()
        this.$refs['draw-scroller'] && this.$refs['draw-scroller'].refreshDOM()
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
        resetSegS () {
            this.$refs['segs-scroller']._resetBox()
            this.$refs['segs-scroller']._refresh()
        },
        resetRwS () {
            this.$refs['rw-scroller']._resetBox()
            this.$refs['rw-scroller']._refresh()
        },
        resetRankScroller () {
            this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller']._refresh()
        },
        resetTeamS () {
            this.$refs['team-scroller']._resetBox()
            this.$refs['team-scroller']._refresh()
        },
        resetDrawSegS () {
            this.$refs['draw-scroller']._resetBox()
            this.$refs['draw-scroller']._refresh()
        }
    }
})
