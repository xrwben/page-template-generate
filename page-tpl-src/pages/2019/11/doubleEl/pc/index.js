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

ReactDOM.render((
    <App>
        <PageBg pageType={'pc'} bgs={[
            {
                height: 350,
                image: require('./images/bg1.jpg')
            },
            {
                height: 470,
                image: require('./images/bg2.jpg')
            },
            {
                height: 4350,
                image: require('./images/bg3.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
