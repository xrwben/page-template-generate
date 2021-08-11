'use strict'

import { Component } from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'

import App from '../App'
import PageBg from '../components/PageBg/PageBg'

/* 注入 */
Component.prototype.pageType = 'pc'

Component.prototype.perName = '克拉'

Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return

    const rid = infos.id || infos.mid || infos.uid
    rid && window.open('/' + rid, '_blank')
}

Component.prototype.goLogin = function () {
    showLoginPanel()
}

Component.prototype.goRecharge = function () {
    window.open('/recharge/center', '_blank')
}

ReactDOM.render((
    <App>
        <PageBg pageType={'pc'} bgs={[
            {
                height: 400,
                image: require('./images/bg1.jpg')
            },
            {
                height: 400,
                image: require('./images/bg2.jpg')
            },
            {
                height: 1660,
                image: require('./images/bg3.jpg')
            },
            {
                height: 2946,
                image: require('./images/bg4.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
