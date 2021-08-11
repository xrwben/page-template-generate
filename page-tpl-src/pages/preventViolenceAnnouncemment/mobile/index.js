'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge } from 'common'

import './style.less'
import CommonMixin from '../mixin'

new Vue({
    el: '#app',
    components: {},
    mixins: [CommonMixin],
    data: {
        // ...
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
        goRecharge
    }
})
