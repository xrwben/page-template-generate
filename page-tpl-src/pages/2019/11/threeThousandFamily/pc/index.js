'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'
import CommonMixin from '../mixin'

// import html2canvas from './html2canvas.min.js';
import base64 from './base64.js'

new Vue({
    el: '#app',
    components: {},
    mixins: [CommonMixin],
    data: {
        base64: base64
    },
    mounted () {},
    updated () {},
    methods: {
        // 跳转主播直播间 根据主播id跳转
        redirectRoom (room) {
            room.id && window.open('/' + room.id, '_blank')
        },
        // 保存图片
        saveImg () {
            // html2canvas(document.querySelector("#capture")).then(canvas => {
            //     document.body.appendChild(canvas)
            // });
        },
        // goRoom (infos) {
        //     if (!infos) return

        //     const rid = infos.id || infos.mid || infos.uid
        //     rid && window.open('/' + rid, '_blank')
        // },
        goLogin () {
            showLoginPanel()
        }
        // goRecharge () {
        //     window.open('/recharge/center', '_blank')
        // }
    }
})
