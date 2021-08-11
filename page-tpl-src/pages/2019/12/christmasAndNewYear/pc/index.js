'use strict'

import Vue from 'vue'
// import $ from 'jquery'
// import '../../../packages/niceScroll.js'
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
        pageType: 'pc',
        timerID: null
    },
    mounted () {
        this.snow()
    },
    updated () {
        this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
        this.$refs['rule-scroller'] && this.$refs['rule-scroller'].refreshDOM()
    },
    beforeDestroy () {
        clearTimeout(this.timerID)
    },
    methods: {
        goRoom (infos) {
            console.log(infos)
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
        resetRankScroller () {
            console.log(this.$refs['rank-scroller'])
            this.$refs['rank-scroller'] && this.$refs['rank-scroller']._resetBox()
            this.$refs['rank-scroller'] && this.$refs['rank-scroller']._refresh()
        },
        resetRuleScroller () {
            this.$refs['rule-scroller'] && this.$refs['rule-scroller']._resetBox()
            this.$refs['rule-scroller'] && this.$refs['rule-scroller']._refresh()
        },
        snow () {
            const canvas = document.getElementById('snow-canvas')
            const w = canvas.clientWidth
            const h = canvas.clientHeight
            const ctx = canvas.getContext('2d')
            const rate = 20
            const arc = 200
            let time
            const size = 2
            const speed = 10
            const lights = []
            const colors = ['#eee']

            // // 设置 canvas 宽高和 banner 图一致
            canvas.setAttribute('width', w)
            canvas.setAttribute('height', h)

            function init () {
                time = 0

                for (var i = 0; i < arc; i++) {
                    lights[i] = {
                        x: Math.ceil(Math.random() * w),
                        y: Math.ceil(Math.random() * h),
                        toX: Math.random() * 5 + 1,
                        toY: Math.random() * 5 + 1,
                        c: colors[Math.floor(Math.random() * colors.length)],
                        size: Math.random() * size
                    }
                }
            }

            function bubble () {
                ctx.clearRect(0, 0, w, h)
                for (var i = 0; i < arc; i++) {
                    var li = lights[i]
                    ctx.beginPath()
                    ctx.arc(li.x, li.y, li.size, 0, Math.PI * 2, false)
                    ctx.fillStyle = li.c
                    ctx.fill()

                    li.x = li.x + li.toX * (time * 0.05)
                    li.y = li.y + li.toY * (time * 0.05)
                    if (li.x > w) { li.x = 0 }
                    if (li.y > h) { li.y = 0 }
                    if (li.x < 0) { li.x = w }
                    if (li.y < 0) { li.y = h }
                }
                if (time < speed) {
                    time++
                }
                this.timerID = setTimeout(bubble, 1000 / rate)
            }
            init()
            bubble()
        }
    }
})
