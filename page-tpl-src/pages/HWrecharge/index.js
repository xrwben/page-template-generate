/*
 * @Date: 2020-03-18 10:35:05
 * @LastEditors: Jesse
 * @LastEditTime: 2020-03-18 10:45:11
 */
'use strict'

import Vue from 'vue'
import './style.less'
import { goRecharge } from 'common'

new Vue({
    el: '#app',
    methods: {
        recharge () {
            // goRecharge()
             try {
                console.log('gBridge is called. useApplePay: ')
            gBridge.openBrowserWithUrl('https://m.tuho.tv/dist/protocal/privacyProtocal.html')
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        },
        recharge2(){
             try {
                console.log('gBridge is called. useApplePay: ')
                gBridge.toBrowserDownload('https://static.guojiang.tv/android/apk/5.8.3-18.apk')
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        }
    }
})
