'use strict'

import ReactDOM from 'react-dom' // eslint-disable-line
import './style.less'
import App from '../App'
import PageBg from '../components/PageBg/PageBg'
import React from 'react'

React.Component.prototype.pageType = 'pc'

/* 注入方法 */
React.Component.prototype.goRoom = function (infos) {
    if (!infos || !infos.rid) return

    const rid = infos.id || infos.mid || infos.uid
    rid && window.open('/' + rid, '_blank')
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
                height: 2400,
                image: require('./images/bg3.jpg')
            },
            {
                height: 2800,
                image: require('./images/bg4.jpg')
            },
            {
                height: 2096,
                image: require('./images/bg5.jpg')
            }
        ]} />
    </App>
), document.getElementById('app'))
