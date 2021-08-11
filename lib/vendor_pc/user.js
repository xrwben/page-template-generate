import layer from 'layer'

export var qqLogin = function (loginUrl) {
    var width = 700
    var height = 500
    var win = window.screen; var left = (win.width - width) / 2; var top = (win.height - height - 60) / 2
    try {
        window.external.openLoginWindow('{"title":"QQ登录","from":"LoginUi","to":"Loginer","cmd":"openLoginWindow","ThirdUrl":"' + loginUrl + '","nWndWidth":' + width + ',"nWndHeight":' + width + '}')
    } catch (s) {
        window.open(loginUrl, 'letv_coop_login', 'toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=' + (left > 0 ? left : 0) + ',top=' + (top > 0 ? top : 0))
    }
}

export var weiboLogin = function (loginUrl) {
    var width = 700
    var height = 500
    var win = window.screen; var left = (win.width - width) / 2; var top = (win.height - height - 60) / 2
    try {
        window.external.openLoginWindow('{"title":"微博登录","from":"LoginUi","to":"Loginer","cmd":"openLoginWindow","ThirdUrl":"' + loginUrl + '","nWndWidth":' + width + ',"nWndHeight":' + width + '}')
    } catch (s) {
        window.open(loginUrl, 'letv_coop_login', 'toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=' + (left > 0 ? left : 0) + ',top=' + (top > 0 ? top : 0))
    }
}

export var weixinLogin = function (loginUrl) {
    var width = 700
    var height = 500
    var win = window.screen; var left = (win.width - width) / 2; var top = (win.height - height - 60) / 2
    try {
        window.external.openLoginWindow('{"title":"微信登录","from":"LoginUi","to":"Loginer","cmd":"openLoginWindow","ThirdUrl":"' + loginUrl + '","nWndWidth":' + width + ',"nWndHeight":' + width + '}')
    } catch (s) {
        window.open(loginUrl, 'letv_coop_login', 'toolbar=0,status=0,resizable=1,width=' + width + ',height=' + height + ',left=' + (left > 0 ? left : 0) + ',top=' + (top > 0 ? top : 0))
    }
}

export var getUserInfo = function (callback) {
    var ajax_url = '/user/getUserInfo'

    $.ajax({
        url: ajax_url,
        type: 'GET',
        dataType: 'jsonp',
        success: function (resp) {
            callback(resp)
        }
    })
}

export var showRegisterPanel = function () {
    layer.open({
        type: 2,
        skin: 'user-layer',
        shadeClose: true,
        title: false,
        closeBtn: false,
        shade: [0.5, '#000'],
        border: [0],
        area: ['700px', '500px'],
        content: '/user/showRegister'
    })
    return false
}

export var showLoginPanel = function () {
    if ($('.user-layer').length == 0) {
        layer.open({
            type: 2,
            skin: 'user-layer',
            shadeClose: true,
            title: false,
            closeBtn: false,
            shade: [0.6, '#000'],
            border: [0],
            area: ['700px', '407px'],
            content: '/user/showLogin'
        })
    }
    return false
}

export var showBindPanel = function () {
    layer.open({
        type: 2,
        skin: 'user-layer',
        shadeClose: true,
        title: false,
        closeBtn: false,
        shade: [0.5, '#000'],
        border: [0],
        area: ['400px', '410px'],
        content: ['/user/bind', 'no']
    })
    return false
}
export var showCheckPhonePanel = function(){
    layer.open({
        type: 2,
        skin: 'user-layer',
        shadeClose: false,
        title: false,
        closeBtn: false,
        shade: [0.5, '#000'],
        border: [0],
        area: ['400px','320px'],
        content: ['/user/checkPhone','no']
    });
    return false;
}

export default {
    qqLogin,
    weiboLogin,
    weixinLogin,
    getUserInfo,
    showRegisterPanel,
    showLoginPanel,
    showCheckPhonePanel,
    showBindPanel
}