'use strict'

import Vue from 'vue'
// import axios from 'axios'
import { goRoom, goLogin } from 'common'

import './style.less'

function getQSParams () {
    const result = {}
    let qs = window.location.search
    if (!qs) return result

    qs = qs.slice(1).split('&')
    qs.forEach(kv => {
        const target = kv.split('=')
        result[target[0].trim()] = target[1].trim()
    })

    return result
}

new Vue({
    el: '#app',
    data: {
        // ...
        target: 0,
        lv4: false,
        level: 0,
        levelDjMap: [
            '无',
            '解锁随机加分道具',
            '解锁减分道具',
            '解锁随机偷分道具',
            '解锁隐藏道具'
        ]
    },
    mounted () {
        const query = getQSParams()
        this.lv4 = !!(+query.lv4)
        if (!query.level) {
            this.level = -1
        } else {
            this.level = +query.level
        }
        if (query.target) {
            this.target = +query.target
        }
    },
    methods: {
        // ...
        goRoom (infos) {
            if (!infos || !infos.rid) return
            goRoom(infos.rid)
        },
        goLogin
    }
})
