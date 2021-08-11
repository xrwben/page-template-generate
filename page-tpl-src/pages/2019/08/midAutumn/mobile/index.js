'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge } from 'common'

import './style.less'
import CommonMixin from '../mixin'

new Vue({
    el: '#app',
    components: {
        scroller: {
            template: '<div><slot/></div>'
        }
    },
    mixins: [CommonMixin],
    data: {
        // ...
        pageType: 'mobile'
    },
    mounted () {},
    methods: {
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin () {
            goLogin()
        },
        goRecharge,
        resetSegS () {
            this.$nextTick(() => {
                this.$refs['segs-scroller'].$el.scrollTop = 0
            })
        },
        resetRwS () {
            this.$refs['rw-scroller'].$el.scrollTop = 0
        },
        resetRankScroller () {
            this.$refs['rank-scroller'].$el.scrollTop = 0
        },
        resetTeamS () {
            this.$refs['team-scroller'].$el.scrollTop = 0
        },
        resetDrawSegS () {
            this.$refs['draw-scroller'].$el.scrollTop = 0
        }
    }
})
