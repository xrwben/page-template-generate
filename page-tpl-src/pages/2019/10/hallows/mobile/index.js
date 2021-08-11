'use strict'

import { getPlatformType, getPackageId, goRoom, goLogin, goRecharge } from 'common'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import './style.less'

import App from '../App'
import PageBg from '../components/PageBg/PageBg'

import PageAnimation from '../plugins/PageAnimation'

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
    if (per === '27') {
        return '钻石'
    }

    return '克拉'
})()

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={[
            {
                height: 2400,
                image: require('./images/bg1.jpg')
            },
            {
                height: 3550,
                image: require('./images/bg2.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))

;(function () {
    const pageAni = new PageAnimation(document.querySelector('#app'))

    pageAni.start([
        require('./images/deco/house.png'),
        require('./images/deco/bird.png'),
        require('./images/deco/g-1.png'),
        require('./images/deco/g-2.png'),
        require('./images/deco/g-3.png'),
        require('./images/deco/g-4.png'),
        require('./images/deco/jcc.png'),
        require('./images/deco/ng-1.png'),
        require('./images/deco/ng-2.png'),
        require('./images/deco/ng-3.png'),
        require('./images/deco/candle.png'),
        require('./images/deco/h.png'),
        require('./images/deco/txt-jcc.png'),
        require('./images/deco/w-1.png'),
        require('./images/deco/w-2.png'),
        require('./images/deco/w-3.png'),
        require('./images/deco/w-4.png'),
        require('./images/deco/w-5.png'),
        require('./images/deco/w-6.png'),
        require('./images/deco/w-7.png'),
        require('./images/deco/wing-a.png'),
        require('./images/deco/wing-b.png')
    ], [
        'pa-house',
        'pa-w-1', 'pa-w-2', 'pa-w-3', 'pa-w-4', 'pa-w-5', 'pa-w-6', 'pa-w-7',
        'pa-bf pa-bf-1',
        'pa-ghost-3', 'pa-ghost-4',
        'pa-wing-b', 'pa-wing-a', 'pa-jcc', 'pa-txt-jcc',
        'pa-ng-1', 'pa-ng-2',
        'pa-txt-banner',
        'pa-ng-3', 'pa-ng-4',
        'pa-ghost-2',
        'pa-ghost-1'
    ])
})()
