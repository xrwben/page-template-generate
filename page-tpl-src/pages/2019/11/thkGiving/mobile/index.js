'use strict'

import { getPlatformType, getPackageId, goRoom, goLogin, goRecharge } from 'common'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import './style.less'

import App from '../App'
import PageBg from '../components/PageBg/PageBg'

/* 注入 */
Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return
    goRoom(infos.rid)
}

Component.prototype.perName = (function () {
    const platform = getPlatformType() // eslint-disable-line
    if (platform !== 'ios_webview') {
        return '克拉'
    }

    const per = getPackageId() // eslint-disable-line
    if (per === '11') {
        return '花瓣'
    }

    if (per === '12') {
        return '甜蜜'
    }

    return '克拉'
})()

Component.prototype.goLogin = goLogin

Component.prototype.goRecharge = goRecharge

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={[
            {
                height: 400,
                image: require('./images/bg1.jpg')
            },
            {
                height: 450,
                image: require('./images/bg2.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
