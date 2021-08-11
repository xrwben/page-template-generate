import './common.less'
import './layer.css'
import Vue from 'vue'
import $ from 'jquery'
import layer from 'layer'
import report from './report'
import './pageLoadStat.js'
import querystring from 'querystring'

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
 * layer默认设置
 */
layer.config({
    title: false
})

/**
 * 进入页面时用cookie记录channel信息，用于注册渠道
 */
setChannelCookie()
function setChannelCookie () {
    let params = querystring.parse(location.search.split('?')[1])
    let channel = params.channel
    if (typeof channel !== 'undefined' && channel != '') {
        // 当链接用渠道参数且不为空时
        setCookie('channel', channel)
    } else if (getCookie('channel')) {
        // 当链接没有渠道参数或者渠道为空，cookie又有渠道时，删除cookie渠道参数
        // 防止用旧的channel注册
        delCookie('channel')
    }
}

/**
 * 设置删除查找cookie
 * @Author   smy
 * @DateTime 2017-12-07T17:55:36+0800
 */
export function setCookie (name, value) {
    let Days = 7
    let exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)

    let domainArr = location.host.split('.')
    let domain = domainArr[1] + '.' + domainArr[2]

    document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/;domain=' + domain
}

export function delCookie (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)

    let cval = getCookie(name)

    let domainArr = location.host.split('.')
    let domain = domainArr[1] + '.' + domainArr[2]

    if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/;domain=' + domain
    }
}

export function getCookie (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (document.cookie.match(reg)) {
        let arr = document.cookie.match(reg)
        return unescape(arr[2])
    } else {
        return null
    }
}

// 转化日期为时间戳，兼容IE，safari
export var exchangeTime = function (time) {
    // 2015-12-24 18:58:00
    var date
    if (time) {
        var arr = time.replace(/ |:/g, '-').split('-')

        date = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5])).valueOf()
    } else {
        var now_date = new Date()
        date = now_date.getTime()
    }
    return date
}

export var in_array = function (search, array) {
    for (var i in array) {
        if (search == array[i]) { return true }
    }
    return false
}

// 显示loading状态
export var showLoading = function () {
    var load = '<img src="//static.guojiang.tv/pc/v3/img/common/loading.gif" class="alertLoding">'

    var alertLoding = $('.alertLoding')

    if (alertLoding.length != 0) {
        alertLoding.show()
    } else {
        $('body').append(load)
    }
}
export var hideLoading = function () {
    $('.alertLoding').hide()
}

/**
 * 引入文件，支持引入css，js
 * @Author   smy
 * @DateTime 2017-12-16T16:28:42+0800
 */
export function include (file) {
    var files = typeof file === 'string' ? [file] : file
    for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s+|\s+$/g, '')
        name = name.split('?')[0]
        var att = name.split('.')
        var ext = att[att.length - 1].toLowerCase()
        var isCSS = ext == 'css'
        var tag = isCSS ? 'link' : 'script'
        var attr = isCSS ? ' type=\'text/css\' rel=\'stylesheet\' ' : ' language=\'javascript\' type=\'text/javascript\' '
        var link = (isCSS ? 'href' : 'src') + '=\'' + name + '\''
        if ($(tag + '[' + link + ']').length == 0) $(document.head).append('<' + tag + attr + link + '></' + tag + '>')
    }
}

/**
 * 进行极验验证码校验
 * @Author   smy
 * @DateTime 2017-12-16T16:30:23+0800
 */
export function gtValidate (callback) {
    include('//static.guojiang.tv/pc/v3/js/component/gt.js')

    checkGtLoaded()
    function checkGtLoaded () {
        if (typeof initGeetest === 'undefined') {
            setTimeout(checkGtLoaded, 10)
        } else {
            startGt(callback)
        }
    }
}

export function startGt (callback) {
    var gt_loading
    // 拖动滑块验证 gee
    $.ajax({
        // 获取id，challenge，success（是否启用failback）
        url: '/user/StartCaptchaServlet?t=' + (new Date()).getTime(), // 加随机数防止缓存
        type: 'POST',
        dataType: 'json',
        beforeSend: function () {
            gt_loading = layer.load()
        },
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
                setTimeout(function () {
                    captchaObj.verify()
                }, 200)

                captchaObj.onReady(function () {
                    layer.close(gt_loading)
                })
                    .onSuccess(function () {
                        var validate = captchaObj.getValidate()
                        $.ajax({
                            url: '/Vcode/VerifyCode',
                            type: 'POST',
                            dataType: 'JSON',
                            data: {
                                geetest_challenge: validate.geetest_challenge,
                                geetest_validate: validate.geetest_validate,
                                geetest_seccode: validate.geetest_seccode
                            },
                            success: function (data) {
                                if (data.errno == 0) {
                                    if (typeof (callback) !== 'undefined') { callback() }
                                } else {
                                    captchaObj.reset()
                                }
                            }
                        })
                    }) // onSuccess EDN
                    .onClose(function () {
                        if (typeof (callback) !== 'undefined') {
                            location.reload()
                        }
                    })
                    .onError(function () {
                        layer.alert('出错啦，稍后进行重试')
                    })
            })
        }
    })
}

// 对所有ajax请求进行拦截过滤
$(document).ajaxComplete(function (event, data, opt) {
    var errno
    if (opt.dataType.toLowerCase() == 'jsonp') {
        errno = data.responseText ? $.trim((data.responseText).split('errno:')[1].split(',')[0]) : ''
    } else {
        var res = data.responseText
        if (typeof (res) === 'string' && res != '') {
            res = eval('(' + res + ')')
        }
        errno = res.errno
    }

    if (errno == -300) {
        gtValidate()
    }
});

// requestAnimationFrame 浏览器兼容，web动画优化
(function () {
    var lastTime = 0
    var vendors = ['ms', 'moz', 'webkit', 'o']
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
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
}());

// 提示浏览器升级代码
(function showUpdateBrowserLayer () {
    if (navigator.appName == 'Microsoft Internet Explorer' && parseInt(navigator.appVersion.split('MSIE')[1].replace(/[ ]/g, '').split(';')[0]) < 9) {
        var _html = ' <div class="update_browser_wrap">\
                      <span class="mask"></span>\
                      <div class="content">\
                          <img class="close" src="//static.kuaishouvideo.com/src/pc/img/common/update_browser_close.png"/>\
                          <p>hi，您当前的浏览器版本过低，可能存在重大安全漏洞！</p>\
                          <h3>建议立即<a href="//browsehappy.osfipin.com" target="_blank">升级浏览器</a></h3>\
                          <a href="//se.360.cn/" target="_blank" class="skip_btn">360浏览器</a>\
                      </div>\
                  </div>'
        $('body').append(_html)
        $('.update_browser_wrap .close').on('click', function () {
            $('.update_browser_wrap').hide()
        })
    }
})()

export default {
    startGt, gtValidate, include, hideLoading, showLoading, in_array, exchangeTime, getCookie, setCookie, delCookie, 
}
