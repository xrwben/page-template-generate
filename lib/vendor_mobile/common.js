import './common.less'
import Vue from 'vue'
import $ from 'webpack-zepto'
import { FastClick } from './fastclick.min.js'
import report from './report'
import './pageLoadStat.js'

/**
 * [监控]：try-catch封装zepto, cmd
*/
report.spyAll()
/**
 * [监控]：上报vue生命周期内发生的异常
*/
Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    // 2.4.0+可以监控自定义事件内的错误
    let msg = `错误发生在生命周期钩子：${info}中，具体信息：${err.stack}`
    report.jsReport(msg)
}

/**
 * @description 判断是否是iosWKWebview包 这种包采用最新的交互方法
 * @author Jesse
 * @date 2020-05-15
 * @returns boolean
 */
export var isWKWebviewPackage = function () {
    const platform = getPlatformType()
    if (platform === 'ios_webview' &&
    navigator.userAgent.indexOf('webkit/') > 0 && (navigator.userAgent.split('webkit/')[1].split(' ')[0] === '1')) {
        return true
    } else {
        return false
    }
}

// iOS项目更换WKWebview 调用方法修改 兼容老版本
// 后期有新增方法直接调用window.webkit.messageHandlers.***,不在扩展gBridge对象了
if (isWKWebviewPackage()) {
    window.gBridge = {
        UGF5Success: function () {
            window.webkit.messageHandlers.UGF5Success.postMessage(null)
        },
        iUGF5: function (pid) {
            window.webkit.messageHandlers.iUGF5.postMessage(pid)
        },
        IAPPay: function (pid) {
            window.webkit.messageHandlers.IAPPay.postMessage(pid)
        },
        // qq支付
        qUGF5: function (pid) {
            window.webkit.messageHandlers.qUGF5.postMessage(payId)
        },
        bindAUGF5: function () {
            window.webkit.messageHandlers.bindAUGF5.postMessage(null)
        },
        onEffectPreview: function (effectInfo) {
            window.webkit.messageHandlers.onEffectPreview.postMessage(effectInfo)
        },
        pushLive: function () {
            window.webkit.messageHandlers.pushLive.postMessage(null)
        },
        bindingwx: function () {
            window.webkit.messageHandlers.bindingwx.postMessage(null)
        },
        bindingWechat: function () {
            window.webkit.messageHandlers.bindingWechat.postMessage(null)
        },
        fullscreen: function () {
            window.webkit.messageHandlers.fullscreen.postMessage(null)
        },
        successClose: function () {
            window.webkit.messageHandlers.successClose.postMessage(null)
        },
        getCameraStatus: function () {
            window.webkit.messageHandlers.getCameraStatus.postMessage(null)
        },
        gameCoinPay:function(opt){
            window.webkit.messageHandlers.gameCoinPay.postMessage(opt)
        },
        closeWeb:function(){
            window.webkit.messageHandlers.closeWeb.postMessage(null)
        },
        showMenuButton:function(bool){
            if(bool){
                window.webkit.messageHandlers.showMenuButton.postMessage('1')
            }else{
                window.webkit.messageHandlers.showMenuButton.postMessage('0')
            }
        },
        needLogin:function(){
            window.webkit.messageHandlers.needLogin.postMessage(null)
        },
        paySuccess:function(){
            window.webkit.messageHandlers.paySuccess.postMessage(null)
        },
        // 云闪付
        startChinaPayOrder:function(money){
            window.webkit.messageHandlers.startChinaPayOrder.postMessage(money)
        },
        // 打开微信
        openwx:function(){
            window.webkit.messageHandlers.openwx.postMessage(null)
        },
         // 打开微信
        openWechat:function(){
            window.webkit.messageHandlers.openWechat.postMessage(null)
        },
        // 微信支付
        wUGF5: function (payId) {
            window.webkit.messageHandlers.wUGF5.postMessage(payId)
        },
        // 微信支付
        wxPay:function(payId){
            window.webkit.messageHandlers.wxPay.postMessage(payId)
        },
        // 支付宝支付
        aUGF5: function (payId) {
            window.webkit.messageHandlers.aUGF5.postMessage(payId)
        },
        // 支付宝支付
        alipay:function(payId){
            window.webkit.messageHandlers.alipay.postMessage(payId)
        },
        // 去充值页
        recharge:function(){
            window.webkit.messageHandlers.recharge.postMessage(null)
        },
        // 进入个人主页
        userDetail: function (uid) {
            window.webkit.messageHandlers.userDetail.postMessage(uid)
        },
        setShareData: function (shareData) {
            window.webkit.messageHandlers.setShareData.postMessage(shareData)
        },
        // 设置右上角标题和链接
        changeMenuButton: function (title, url) {
            window.webkit.messageHandlers.changeMenuButton.postMessage({'title': title, 'url': url})
        },
        // 事件上报
        onEvent: function (eventName, jsonString) {
            window.webkit.messageHandlers.onEvent.postMessage({'eventName': eventName, 'jsonString': jsonString})
        },
        mountPreview: function (data) {
            window.webkit.messageHandlers.mountPreview.postMessage(data)
        },
        refreshBroadcastCard: function () {
            window.webkit.messageHandlers.refreshBroadcastCard.postMessage(null)
        },
        wUGF5WithPrivateMsg: function (money) {
            window.webkit.messageHandlers.wUGF5WithPrivateMsg.postMessage(money)
        },
        aUGF5WithPrivateMsg: function () {
            window.webkit.messageHandlers.aUGF5WithPrivateMsg.postMessage(money)
        },
        // 进入个人资料编辑页
        userEdit: function () {
            window.webkit.messageHandlers.userEdit.postMessage(null)
        },
        // 进入真人认证页面
        jumpMFAuth: function () {
            window.webkit.messageHandlers.jumpMFAuth.postMessage(null)
        },
        // 进入交友列表
        jumpMFList: function () {
            window.webkit.messageHandlers.jumpMFList.postMessage(null)
        },
        // 进入消息列表页
        messagePage: function () {
            window.webkit.messageHandlers.messagePage.postMessage(null)
        },
        // 自动打招呼
        autoGreet: function () {
            window.webkit.messageHandlers.autoGreet.postMessage(null)
        },
        // 打招呼
        greet: function (uid) {
            window.webkit.messageHandlers.greet.postMessage(uid)
        },
        // 进入录音设置页
        uploadRecord:function(){
            window.webkit.messageHandlers.uploadRecord.postMessage(null)
        },
        goSetProfile:function(){
            window.webkit.messageHandlers.goSetProfile.postMessage(null)
        },
        goPublish:function(){
            window.webkit.messageHandlers.goPublish.postMessage(null)
        },
        goComments:function(){
            window.webkit.messageHandlers.goComments.postMessage(null)
        },
        showInviteSharePage:function(imgUrl){
            window.webkit.messageHandlers.showInviteSharePage.postMessage(imgUrl)
        },
        inviteCodePatse:function(str){
            window.webkit.messageHandlers.inviteCodePatse.postMessage(str)
        },
        useBackground:function(url){
            window.webkit.messageHandlers.useBackground.postMessage(url)
        },
        accessNotification: function () {
            window.webkit.messageHandlers.accessNotification.postMessage(null)
        }
    }
}

/**
 * fastclick init
*/
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        try {
	    	FastClick.attach(document.body)
        } catch (e) {
            console.log('fastclick:' + e.name + ':' + e.message)
        }
    }, false)
}

/*
社交分包隐藏右上角
排除商城和我的背包
 */
var packageId = getPackageId()
if (packageId == 100 || packageId == 101) {
    console.log('hide right menu')
    if (location.href.indexOf('backpack/list.html') == -1 &&
		location.href.indexOf('store/list.html') == -1) {
    	hideRightTopMenu()
    }
}

/**
 * 过滤http字段
 */
export var filterHttp = function (url) {
    if (url) {
        return url.replace(/^http:/i, '')
    }
}

/* 刷新泡泡数:
*   addCoin字符串类型toString()
*   isAddCoin: true或者不填  增加泡泡 ； false减少泡泡
*/
export var refreshCoin = function (addCoin, isAddCoin) {
    var platform = getPlatformType()

    var flag = (isAddCoin || isAddCoin == null) ? '-' : ''
    console.log('refreshCoin:', platform)

    if (platform === 'android_webview') {
        try {
            recharge.refreshCoin(flag + addCoin)
            console.log('refreshCoin is called')
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.refreshCoin.postMessage(flag + addCoin)
        console.log('webkit refreshCoin is called')
    } else if (platform === 'ios_webview') {
        try {
            gBridge.refreshCoin(flag + addCoin)
            console.log('refreshCoin is called')
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    }
}

// 刷新app数据
// opt: {"coin": 123, "lowkeyEnter":true}
export var refreshAppInfo = function (opt) {
    try {
        if (isWKWebviewPackage()) {
            window.webkit.messageHandlers.updateMyInfo.postMessage(JSON.stringify(opt))
            console.log('webkit refreshAppInfo is called')
        } else {
            gBridge.updateMyInfo(JSON.stringify(opt))
            console.log('refreshAppInfo is called')
        }
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

// 刷新背包
export var refreshBackpack = function () {
    var platform = getPlatformType()
    if (platform === 'android_webview') {
        try {
            recharge.refreshPackage()
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.refreshPackage.postMessage(null)
        console.log('webkit refreshPackage is called')
    } else if (platform === 'ios_webview') {
        try {
            gBridge.refreshPackage()
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    }
}

// 预加载图片
export var preloadImgs = function (array) {
    window.onload = function () {
        var newimages = []

        var arr = (typeof array !== 'object') ? [array] : array

        for (var i = 0; i < arr.length; i++) {
            newimages[i] = new Image()
            newimages[i].src = arr[i]
        }
    }
}

// 显示loading状态
export var showLoading = function () {
    var load = '<div class="alert_loading_wrap"><img src="' + require('../../img/common/loading.png') + '" class="alertLoding rotate_loading"></div>'

    var alertLoding = $('.alert_loading_wrap')

    if (alertLoding.length != 0) {
        alertLoding.show()
    } else {
        $('body').append(load)
    }
}
export var hideLoading = function () {
    $('.alert_loading_wrap').hide()
}

// 跳到直播间
// packageId: 默认果酱,  2 =>土豪
export var goRoom = function (rid, packageId) {
    if (/guojiang_android/i.test(navigator.userAgent)) {
        try {
            recharge.roomDetail(rid.toString()) // 进入直播间
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.roomDetail.postMessage(rid)
        console.log('webkit roomDetail is called')
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        try {
            gBridge.roomDetail(rid) // 进入直播间
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    } else {
        location.href = '/room/' + rid + '?packageId=' + packageId
    }
}

// 调起分享
export var goShare = function () {
    if (/guojiang_android/i.test(navigator.userAgent)) {
        recharge.onShare()
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.share.postMessage(null)
        console.log('webkit share is called')
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        gBridge.share() // 果酱
    } else {
        // share
        if ($('#mShareBg').length == 0) {
            var share = '<img src="//static.guojiang.tv/mobile/img/common/shareBg.png" id="mShareBg"/>'
            $('body').append(share)

            $('#mShareBg').on('click', function () {
                $(this).hide()
            })
        } else {
            $('#mShareBg').show()
        }
    }
}

// 获取平台类型
export function getPlatformType () {
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

// 登录
export function goLogin () {
    var platform = getPlatformType()
    if (platform === 'android_webview') {
        recharge.needLogin()
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.needLogin.postMessage(null)
        console.log('webkit needLogin is called')
    } else if (platform === 'ios_webview') {
        location.href = 'FZIphoneCommunicate://type/1'
        gBridge.needLogin()
    } else {
        location.href = '/user/login?callback=' + window.top.location.href
    }
}

// 微信授权
export var goWechatLogin = function () {
    location.href = '//m.guojiang.tv/user/wxLogin?callback=' + location.href
}

// 控制ios右上角
export var showIosMenu = function () {
    try {
        if (isWKWebviewPackage()) {
            window.webkit.messageHandlers.showMenuButton.postMessage("1")
            console.log('webkit showMenuButton is called')
        } else {
            gBridge.showMenuButton(true)
        }
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

export var hideIosMenu = function () {
    try {
        if (isWKWebviewPackage()) {
            window.webkit.messageHandlers.showMenuButton.postMessage("0")
            console.log('webkit showMenuButton is called')
        } else {
            gBridge.showMenuButton(false)
        }
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

// 安卓ios隐藏右上角
export function hideRightTopMenu () {
    var platform = getPlatformType()
    console.log('comein function hiderighttopmenu')
    if (platform == 'android_webview') {
        setTimeout(function () {
            try {
                console.log('hideRightTopMenu')
                gBridge.hideRightMenuButton()
            } catch (e) {
                console.warn(e.name + ':' + e.message)
            }
        }, 500)
    } else if (platform == 'ios_webview') {
        setTimeout(function () {
            hideIosMenu()
        }, 500)
    }
}

// 关闭当前webview
export var closeWebview = function () {
    var platform = getPlatformType()

    if (platform === 'android_webview') {
        try {
            recharge.goBack()
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    } else if (isWKWebviewPackage()) {
        window.webkit.messageHandlers.closeWeb.postMessage(null)
        console.log('webkit closeWeb is called')
    } else if (platform === 'ios_webview') {
        try {
            gBridge.closeWeb()
        } catch (e) {
            alert(e.name + ':' + e.message)
        }
    }
    console.log('closewebview')
}

// 获取app version
export function getVersion () {
    var version
    if (navigator.userAgent.indexOf('guojiang_version') > 0) {
        version = navigator.userAgent.split('guojiang_version/')[1].split(' ')[0]
    } else {
        version = '0'
    }
    return version
}

// 获取app packageId
export function getPackageId () {
    var packageId
    if (navigator.userAgent.indexOf('guojiang_package') > 0) {
        packageId = navigator.userAgent.split('guojiang_package/')[1].split(' ')[0]
    } else {
        packageId = '0'
    }
    return packageId
}

// 获取app packageId
export var getBoundleId = function () {
    var boundleId
    if (navigator.userAgent.indexOf('guojiang_bundleId') > 0) {
        boundleId = navigator.userAgent.split('guojiang_bundleId/')[1].split(' ')[0]
    } else {
        boundleId = '-1'
    }
    return boundleId
}

// 获取app channel
export function getChannel () {
    var channel
    if (navigator.userAgent.indexOf('guojiang_channel') > 0) {
        channel = navigator.userAgent.split('guojiang_channel/')[1].split(' ')[0]
    } else {
        channel = '0'
    }
    return channel
}
/*
*获取当前网络状态，支持微信qq客户端场景
* 无线网： WIFI
*/
export var getNetType = function () {
    var type
    if (navigator.userAgent.indexOf('NetType') > 0) {
        type = navigator.userAgent.split('NetType/')[1].split(' ')[0]
    } else {
        type = '-1'
    }
    return type
}

export function isOffline () {
    if (!navigator.onLine) {
        layer.open({
            content: '网络不给力',
            skin: 'msg',
            time: 3
        })
        return true
    } else {
        return false
    }
}

/**
 * 时间戳转日期
 * @Author   smy
 * @DateTime 2017-07-12T16:45:20+0800
 * @param    {int}                 num      单位秒，要转换的时间戳
 * @param    {Boolean}                isSecond 转化后的日期是否带秒,默认不带
 * @return   {date}                          返回日期格式
 */
export var formatDate = function (num, isSecond) {
    var formatNum = new Date(parseInt(num) * 1000)

    var y = formatNum.getFullYear()

    var month = (parseInt(formatNum.getMonth()) + 1) < 10 ? 0 + (formatNum.getMonth() + 1).toString() : (parseInt(formatNum.getMonth()) + 1)

    var d = parseInt(formatNum.getDate()) < 10 ? 0 + formatNum.getDate().toString() : formatNum.getDate()

    var h = parseInt(formatNum.getHours()) < 10 ? 0 + formatNum.getHours().toString() : formatNum.getHours()

    var m = parseInt(formatNum.getMinutes()) < 10 ? 0 + formatNum.getMinutes().toString() : formatNum.getMinutes()

    var i = parseInt(formatNum.getSeconds()) < 10 ? 0 + formatNum.getSeconds().toString() : formatNum.getSeconds()
    if (isSecond) {
        return y + '-' + month + '-' + d + '   ' + h + ':' + m + ':' + i
    } else {
        return y + '-' + month + '-' + d + '   ' + h + ':' + m
    }
}
// 日期转时间戳
export var exchangeTime = function (date) {
    if (date) {
        // 2015-12-24 18:58:00
        var date_1 = date.split(' ')[0]

        var date_2 = date.split(' ')[1]
        var y = date_1.split('-')[0]

        var m = date_1.split('-')[1] - 1

        var d = date_1.split('-')[2]

        var h = date_2.split(':')[0]

        var i = date_2.split(':')[1]

        var s = date_2.split(':')[2]
    } else {
        var now_date = new Date()
        var y = now_date.getFullYear()

        var m = now_date.getMonth() + 1

        var d = now_date.getDate()

        var h = now_date.getHours()

        var i = now_date.getMinutes()

        var s = now_date.getSeconds()
    }
    // UTC计算0时区，相差8小时
    return Date.UTC(y, m, d, h, i, s) - 8 * 3600 * 1000
}

// 判断活动是否开始，结束。 日期格式：2016/1/5 00:00:00
export var isActivitying = function (startdate, enddate) {
    var start_time = new Date(startdate).getTime()

    var end_time = new Date(enddate).getTime()

    var now_time = new Date().getTime()
    if (now_time >= start_time && now_time <= end_time) {
        return 1 // 活动开始
    } else if (now_time < start_time) {
        return 0 // 活动还未开始
    } else {
        return 2// 活动结束
    }
}
/*
*   time: 倒计时的单位数（s, ms）
*   dosomething: 每个单位的倒计时后执行的函数，参数为单位数
*   callback：倒计时结束后的回调
*   timegap: 1 为 每1ms倒计时，1000为1s，默认1s
 */

export function countDownS (time, dosomething, callback, timegap) {
    var _time = time
    if (timegap == undefined) {
        timegap = 1000
    }

    if (_time == 0) {
        callback()
    } else {
        dosomething(_time)
        _time--
        setTimeout(function () { countDownS(_time, dosomething, callback, timegap) }, timegap)
    }
}

// 验证信息
export var regExpTest = function (content, type) {
    var regExpMap = {
        'common': /[\s\S]*/, // 匹配任何内容
        'noChinese': /^[^\u4e00-\u9fa5]{0,}$/, // 非中文
        'letter': /^[a-zA-Z]+([a-zA-Z]|\s)*$/, // 纯字母
        'number': /^\d+$/, // 匹配数字
        'numberLimit10': /^\d{10}$/, // 匹配10位数字
        'creditMonth': /^(([0][1-9])|([1][0-2]))$/,
        'creditYear': /^(\d){1,2}$/,
        'creditCvc': /^(\d){3,4}$/,
        'creditNumberUSA': /^(\d){5,19}$/,
        'email': /^\w+([-.]\w+)*@\w+([-]\\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/,
        'mobile': /^1[0-9]{10}$/, // 指的是中国的手机号码
        'mobileCN': /^1[0-9]{10}$/, // 中国1开头的10为数字
        'mobileHK': /^[0-9]{8}$/, // 香港
        'mobileMacau': /^[0-9]{8}$/, // 澳门
        'mobileTW': /^[0-9]{9,10}$/, // 台湾
        'password': /^[a-zA-Z0-9]{6,22}$/,
        'registPassword': /^[0-9a-zA-Z_]{6,22}$/, // 验证由数字、26个英文字母或者下划线组成的密码
        'telephone': /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/,
        'date': /^\d{4}-\d{2}-\d{2}$/, // 简单日期格式判断  1990-12-12
        'hour': /^(1|0)[0-9]|2[0-3]$/, // 小时格式判断        24小时制
        'minute': /^[0-5][0-9]$/ // 分钟格式判断
    }

    var regExpErrMap = {
        'email': '邮箱格式错误',
        'mobile': '手机格式错误',
        'letter': '请输入英文字母',
        'noChinese': '此处不允许输入中文',
        'number': '请输入正确数字',
        'numberLimit10': '请输入正确的10位数字',
        'creditMonth': '请输入2位的月数',
        'creditYear': '请输入2位的年数',
        'creditCvc': '请输入正确的验证码',
        'creditNumberUSA': '请输入正确的卡号',
        'mobileCN': '手机格式错误(中国)',
        'mobileHK': '手机格式错误(香港)',
        'mobileMacau': '手机格式错误(澳门)',
        'mobileTW': '手机格式错误(台湾)',
        'telephone': '座机格式错误',
        'password': '密码长度必须为6-22位',
        'registPassword': '密码格式错误',
        'date': '请选择日期',
        'hour': '请输入正确的小时',
        'minute': '请输入正确的分钟'
    }

    return {errno: regExpMap[type].test(content), msg: regExpErrMap[type]}
}

// 微信分享结果回调
export var onWxShareSuccess = function (data) {
    // console.log(data+'wx success');
    try {
        shareSuccessCallback()
    } catch (e) {}
}
export var onWxShareCancel = function (data) {
    // console.log(data+'wx cancel');
    try {
        shareCancelCallback()
    } catch (e) {}
}
export var onAppShareSuccess = function (data) {
    // console.log(data+'app success');
    try {
        shareSuccessCallback()
    } catch (e) {}
}
export var onAppShareCancel = function (data) {
    // console.log(data+'app cancel');
    try {
        shareCancelCallback()
    } catch (e) {}
}
export var onQqShareSuccess = function (data) {
    // console.log(data+'qq success');
    try {
        shareSuccessCallback()
    } catch (e) {}
}
export var onQqShareCancel = function (data) {
    // console.log(data+'qq cancel');
    try {
        shareCancelCallback()
    } catch (e) {}
}
export var onQzoneShareSuccess = function (data) {
    // console.log(data+'Qzone success');
    try {
        shareSuccessCallback()
    } catch (e) {}
}
export var onQzoneShareCancel = function (data) {
    // console.log(data+'Qzone cancel');
    try {
        shareCancelCallback()
    } catch (e) {}
}

// 进行极验验证码校验
export function gtValidate (callback) {
    var gt = document.createElement('script')
    gt.src = '//static.guojiang.tv/mobile/v2/js/lib/gt.js'
    $(document.head).append(gt)

    checkGtLoaded()
    function checkGtLoaded () {
        if (typeof initGeetest === 'undefined') {
            setTimeout(checkGtLoaded, 10)
        } else {
            startGt(callback)
        }
    }
}

function startGt (callback) {
    // 拖动滑块验证 gee
    $.ajax({
        // 获取id，challenge，success（是否启用failback）
        url: '/user/StartCaptchaServlet?t=' + (new Date()).getTime(), // 加随机数防止缓存
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            // 使用initGeetest接口
            // 参数1：配置参数
            // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
                product: 'bind', // 产品形式，包括：float，embed，popup, bind。注意只对PC版验证码有效
                width: '100%'
            }, function (captchaObj) {
                // 表单验证没问题后，进行极验验证
                var verify_num = 0
                verrifyGt()
                function verrifyGt () {
                    captchaObj.verify()
                    console.log('verify_num:', verify_num++)
                    console.log('geetest_panel_length:', $('.geetest_panel').length)
                    setTimeout(function () {
                        if ($('.geetest_panel').eq(-1).css('display') == 'none' || $('.geetest_panel').length == 0) {
                            setTimeout(function () {
                                verrifyGt()
                            }, 200)
                        }
                    }, 100)
                }

                // if (!validate) {}
                captchaObj.onSuccess(function () {
                    var validate = captchaObj.getValidate()
                    $.ajax({
                        url: '/user/gtValidate',
                        type: 'POST',
                        dataType: 'JSON',
                        data: {
                            geetest_challenge: validate.geetest_challenge,
                            geetest_validate: validate.geetest_validate,
                            geetest_seccode: validate.geetest_seccode
                        },
                        success: function (data) {
                            data = JSON.parse(data)
                            if (data.errno == 0) {
                                if (typeof callback !== 'undefined') { callback() }
                            } else {
                                captchaObj.reset()
                            }
                        }
                    })
                }) // onSuccess EDN
                    .onClose(function () {
                        location.reload()
                    })
            })
        }
    })
}

// 统一拦截ajax请求
function ajaxEventTrigger (event) {
    var ajaxEvent = new CustomEvent(event, { detail: this })
    window.dispatchEvent(ajaxEvent)
}

var oldXHR = window.XMLHttpRequest
function newXHR () {
    var realXHR = new oldXHR()

    realXHR.addEventListener('readystatechange', function () { ajaxEventTrigger.call(this, 'ajaxReadyStateChange') }, false)

    return realXHR
}
window.XMLHttpRequest = newXHR

let gtLayerArr = []
window.addEventListener('ajaxReadyStateChange', function (e) {
    // 过滤webpack browser-sync监听
    if (e.detail.responseURL.indexOf('browser-sync') != -1) return

    // XMLHttpRequest Object
    if (e.detail.readyState == 4) {
        var isJsonp = e.detail.responseText.match(/^\w+\({1}/) != null

        var errno
        if (isJsonp) {
            errno = $.trim(e.detail.responseText.match(/(errno:\s*\-*\d+)/)[0].split('errno:')[1])
        } else {
            var res = e.detail.responseText
            if (typeof (res) === 'string') {
                res = JSON.parse(res)
            }
            errno = res.errno
        }

        if (errno == -300) {
            let amINeedQueue = gtLayerArr.length != 0
            gtLayerArr.push(1)

            if (!amINeedQueue) {
                gtValidate(function () {
                    gtLayerArr = []
                })
            }
        } else if (errno == -100) {
            goLogin()
        }
    }
})

// requestAnimationFrame 浏览器兼容，web动画优化

var lastTime = 0
var vendors = ['ms', 'moz', 'webkit', 'o']
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
}
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime()
        var timeToCall = Math.max(0, 16 - (currTime - lastTime))
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
    }
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
        clearTimeout(id)
    }
}

/**
 * mrzjd 2018/7/31
 * @function goRecharge
 * @desc 移动端调用充值页面
 */
export var goRecharge = function () {
    var platform = getPlatformType()
    if (isSocialPackage()) {
        location.href = '/dist/makeFriends/coinWithdraw.html'
        return false
    }
    if (platform === 'ios_webview') { // ios app
        $.ajax({
            url: '/rechargeApp/useApplePay',
            type: 'get',
            dataType: 'JSON',
            success: function (data) {
                if (typeof data === 'string') {
                    data = JSON.parse(data)
                }
                if (data.data.useApplePay) { // 苹果的原生充值页
                    // console.log('inside ios app with apple pay');
                    try {
                        if (isWKWebviewPackage()) {
                            console.log('webkit recharge is called. useApplePay: ')
                            window.webkit.messageHandlers.recharge.postMessage(null)
                        } else {
                            console.log('gBridge.recharge is called. useApplePay: ')
                            gBridge.recharge(); // eslint-disable-line
                        }
                    } catch (e) {
                        alert(e.name + ':' + e.message)
                    }
                } else {
                    // console.log('inside ios app without apple pay');
                    location.href = '/rechargeApp' // app h5充值页
                }
                // console.log('finish ios config');
            }
        })
    } else if (platform === 'android_webview') { // 安卓 app
        // console.log('inside android app');
        const versionNum = parseInt(getVersion().trim().replace(/\./g, ''))
        if (getChannel() === 'and-hwly-cps-7' && versionNum < 610) {
            try {
                console.log('gBridge.toHWRecharge is called. useApplePay: ')
                gBridge.toHWRecharge(); // eslint-disable-line
            } catch (e) {
                alert(e.name + ':' + e.message)
            }
        } else {
            location.href = '/rechargeApp' // app h5充值页
        }
    } else { // app 外
        // console.log('outside app');
        location.href = '/recharge' // h5充值页
    }
}

/**
 * @description 判断是否是社交包
 * @author Jesse
 * @date 2020-04-24
 * @returns boolean
 */
export var isSocialPackage = function () {
    const packageId = getPackageId()
    const platform = getPlatformType()
    if (platform === 'android_webview') {
        return ['9', '18', '19', '20', '22', '23', '24', '27', '32', '33', '40', '41', '43'].indexOf(packageId) >= 0
    } else if (platform === 'ios_webview') {
        return ['18', '20', '24', '32'].indexOf(packageId) >= 0
    } else {
        return false
    }
}

/**
 * smy 2018-09-17
 * webview内的跳转
 * 用于当webview内的一个页面没有返回和关闭按钮的情况跳转到另一个页面时，另一个页面要求有返回或关闭按钮
 * 应用实例：
 * 1元粉丝徽章
*/
export var goWebviewUrl = function (url) {
    try {
        if (isWKWebviewPackage()) {
            console.log('webkit toUrl is called')
            window.webkit.messageHandlers.toUrl.postMessage(url)
        } else {
            gBridge.toUrl(url)
        }
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

/**
 * smy 2018-09-17
 * 通过外部浏览器打开某链接
*/
export var openBrowserWithUrl = function (url) {
    try {
        if (isWKWebviewPackage()) {
            console.log('webkit openBrowserWithUrl is called')
            window.webkit.messageHandlers.openBrowserWithUrl.postMessage(url)
        } else {
            gBridge.openBrowserWithUrl(url)
        }
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

export default {
    filterHttp,
    refreshCoin,
    refreshAppInfo,
    refreshBackpack,
    preloadImgs,
    showLoading,
    hideLoading,
    goRoom,
    goShare,
    getPlatformType,
    goLogin,
    goWechatLogin,
    showIosMenu,
    hideIosMenu,
    hideRightTopMenu,
    closeWebview,
    getVersion,
    getPackageId,
    getBoundleId,
    getChannel,
    getNetType,
    formatDate,
    exchangeTime,
    isActivitying,
    countDownS,
    regExpTest,
    onWxShareSuccess,
    onWxShareCancel,
    onAppShareSuccess,
    onAppShareCancel,
    onQqShareSuccess,
    onQqShareCancel,
    onQzoneShareSuccess,
    onQzoneShareCancel,
    gtValidate,
    goRecharge,
    isSocialPackage,
    goWebviewUrl,
    openBrowserWithUrl
}
