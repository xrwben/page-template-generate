import '../shared/base.less'

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

window.onload = function () {
    const article = document.querySelector('#article')

    if (getPlatformType() === 'ios_webview') {
        article.innerHTML = article.innerHTML.replace(/细语/g, '柔耳').replace('深圳市鹏城映像科技有限公司', '海南面对面文化传媒有限公司')
    }

    article.style.display = 'block'
}
