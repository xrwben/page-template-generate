'use strict'

import Vue from 'vue'
import { goRoom, goLogin, goRecharge } from 'common'

import './style.less'
import CommonMixin from '../mixin'

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err, vm, info)
}

new Vue({
    el: '#app',
    components: {},
    mixins: [CommonMixin],
    data () {
        return {}
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
