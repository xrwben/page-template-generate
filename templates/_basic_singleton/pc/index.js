'use strict'

import Vue from 'vue'
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'

new Vue({
    el: '#app',
    data: {
        // ...
    },
    mounted () {},
    updated () {},
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
        }
    }
})
