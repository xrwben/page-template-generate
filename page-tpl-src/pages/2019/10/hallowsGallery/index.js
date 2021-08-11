'use strict'

import { goRoom } from 'common'
import { Component } from 'react'
import ReactDOM from 'react-dom'
import './style.less'

import App from './App'
import PageBg from './components/PageBg/PageBg'

/* 注入 */
Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return
    goRoom(infos.rid)
}

ReactDOM.render((
    <App>
        <PageBg pageType={'mobile'} pageRatio={108} bgs={[
            {
                height: 500,
                image: require('./images/bg1.jpg')
            },
            {
                height: 576,
                image: require('./images/bg2.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
