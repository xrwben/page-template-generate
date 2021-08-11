'use strict'

import { Component } from 'react'
import ReactDOM from 'react-dom'
import './style.less'

import App from './App'
import PageBg from './components/PageBg/PageBg'

import { goRoom } from 'common'

/* 注入方法 */
Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return
    goRoom(infos.rid)
}

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={[
            {
                height: 350,
                image: require('./images/bg1.jpg')
            },
            {
                height: 410,
                image: require('./images/bg2.jpg')
            },
            {
                height: 970,
                image: require('./images/bg3.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
