'use strict'

import Vue from 'vue'
// import axios from 'axios'
import { goRoom, goLogin } from 'common'

import './style.less'

new Vue({
    el: '#app',
    data: {
        // ...
    },
    mounted () {},
    methods: {
        // ...
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin
    }
})
