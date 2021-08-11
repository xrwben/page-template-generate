'use strict'

import { getPlatformType, getPackageId, goRoom, goLogin } from 'common'
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

Component.prototype.goLogin = function () {
    goLogin()
}

Component.prototype.perName = (function () {
    const platform = getPlatformType() // eslint-disable-line
    if (platform !== 'ios_webview') {
        return '克拉'
    }

    const per = getPackageId() // eslint-disable-line
    if (per === '12') {
        return '甜蜜'
    }
    if (per === '27') {
        return '钻石'
    }

    return '克拉'
})()

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={[
            {
                height: 500,
                image: require('./images/bg1.jpg')
            },
            {
                height: 550,
                image: require('./images/bg2.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
