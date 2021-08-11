'use strict'

import { getPlatformType, getPackageId, goRoom, goRecharge, goLogin } from 'common'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import './style.less'

import App from '../App'
import PageBg from '../components/PageBg/PageBg'
import { getQs } from '../utils'

/* 注入 */
Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return
    goRoom(infos.rid)
}

Component.prototype.goRecharge = goRecharge
Component.prototype.goLogin = goLogin

Component.prototype.perName = (function () {
    const platform = getPlatformType() // eslint-disable-line
    if (platform !== 'ios_webview') {
        return '克拉'
    }

    const per = getPackageId() // eslint-disable-line
    if (per === '12') {
        return '甜蜜'
    }

    if (per === '11') {
        return '花瓣'
    }

    return '克拉'
})()

const noani = !!getQs('noani')
Component.prototype.noani = noani

let bgs = [
    {
        height: 1015,
        image: require('./images/banner_bg.jpg')
    },
    {
        height: 820,
        image: require('./images/video_bg.jpg')
    }
]
if (noani) {
    bgs = [
        {
            height: 400,
            image: require('./images/banner_bg.x1.jpg')
        },
        {
            height: 615,
            image: require('./images/banner_bg.x2.jpg')
        },
        {
            height: 820,
            image: require('./images/video_bg.jpg')
        }
    ]
}

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={bgs} />
    </App>
), document.getElementById('app'))
