'use strict'

import { Component } from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line
import { showLoginPanel } from 'user' // eslint-disable-line

import './style.less'

import App from '../App'
import PageBg from '../components/PageBg/PageBg'

import PageAnimation from '../plugins/PageAnimation'

/* 注入 */
Component.prototype.pageType = 'pc'

Component.prototype.perName = '克拉'

Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return

    const rid = infos.id || infos.mid || infos.uid
    rid && window.open('/' + rid, '_blank')
}

Component.prototype.goRecharge = function () {
    window.open('/recharge/center', '_blank')
}

Component.prototype.goLogin = function () {
    showLoginPanel()
}

ReactDOM.render((
    <App>
        <PageBg pageType={'pc'} bgs={[
            {
                height: 1000,
                image: require('./images/bg1.png')
            },
            {
                height: 1300,
                image: require('./images/bg2.jpg')
            },
            {
                height: 1960,
                image: require('./images/bg3.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))

;(function () {
    const pageAni = new PageAnimation(document.querySelector('#app'))

    pageAni.start([
        require('./images/house.png'),
        require('./images/cartain.png'),
        require('./images/b-l.png'),
        require('./images/ghost-1.png'),
        require('./images/ghost-2.png'),
        require('./images/ghost-3.png'),
        require('./images/ghost-4.png'),
        require('./images/jcc.png'),
        require('./images/ng-1.png'),
        require('./images/ng-2.png'),
        require('./images/ng-3.png'),
        require('./images/ng-4.png'),
        require('./images/txt-banner.png'),
        require('./images/txt-jcc.png'),
        require('./images/w-1.png'),
        require('./images/w-2.png'),
        require('./images/w-3.png'),
        require('./images/w-4.png'),
        require('./images/w-5.png'),
        require('./images/w-6.png'),
        require('./images/w-7.png'),
        require('./images/wing-a.png'),
        require('./images/wing-b.png')
    ], [
        'pa-house',
        'pa-w-1', 'pa-w-2', 'pa-w-3', 'pa-w-4', 'pa-w-5', 'pa-w-6', 'pa-w-7',
        'pa-bf pa-bf-1', 'pa-bf pa-bf-2',
        'pa-ghost-3', 'pa-ghost-4',
        'pa-wing-b', 'pa-wing-a', 'pa-jcc', 'pa-txt-jcc',
        'pa-ng-1', 'pa-ng-2',
        'pa-txt-banner',
        'pa-ng-3', 'pa-ng-4',
        'pa-ghost-2',
        'pa-cartain',
        'pa-ghost-1'
    ])
})()
