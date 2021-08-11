'use strict'

import Vue from 'vue'
// import axios from "axios";
import { goRoom, goLogin, goRecharge } from 'common'

import './style.less'
import CommonMixin from '../mixin'

new Vue({
    el: '#app',
    components: {},
    mixins: [CommonMixin],
    data: {},
    mounted () {},
    methods: {
        // 跳转主播直播间 根据
        redirectRoom (room) {
            room.rid && goRoom(room.rid)
        },
        // 保存图片
        saveImg () {
            this.$refs.toast.show('请截图保存哦！')
        },
        // goRoom (infos) {
        //     if (!infos || !infos.rid) return
        //     goRoom(infos.rid)
        // },
        goLogin () {
            goLogin()
        },
        goRecharge
    }
})
