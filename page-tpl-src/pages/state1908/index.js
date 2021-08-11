/* 入口js do anything you want */

import './style.less'

function getPlatformType () {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        // 这是微信平台下浏览器
        return 'wechat'
    } else if (/QQ\//i.test(navigator.userAgent)) {
        // qq客户端
        return 'qq'
    } else if (/guojiang_android/i.test(navigator.userAgent)) {
        return 'android_webview'
    } else if (/android/i.test(navigator.userAgent)) {
        return 'android'
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        return 'ios_webview'
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios'
    } else {
        return 'pc'
    }
}

function hideRightTopMenu () {
    var platform = getPlatformType()
    console.log('comein function hiderighttopmenu')
    if (platform === 'android_webview') {
        setTimeout(function () {
            try {
                console.log('hideRightTopMenu')
                gBridge.hideRightMenuButton() // eslint-disable-line
            } catch (e) {
                console.warn(e.name + ':' + e.message)
            }
        }, 500)
    } else if (platform === 'ios_webview') {
        setTimeout(function () {
            try {
                console.log('hideRightTopMenu')
                gBridge.showMenuButton(false) // eslint-disable-line
            } catch (e) {
                console.warn(e.name + ':' + e.message)
            }
        }, 500)
    }
}

function appShareInit () {
    var wxShareParam = JSON.parse(gjShareParam) // eslint-disable-line
    if (wxShareParam['imgLink'].indexOf('http:') === -1 && wxShareParam['imgLink'].indexOf('https:') === -1) {
        wxShareParam['imgLink'] = 'http:' + wxShareParam['imgLink']
        gjShareParam = JSON.stringify(wxShareParam) // eslint-disable-line
    }

    setTimeout(function () {
        try {
            gBridge.setShareData(gjShareParam) // eslint-disable-line
        } catch (e) {
            console.log(e)
        }
    }, 500)
}

window.onload = function () {
    hideRightTopMenu()
    appShareInit()
}
