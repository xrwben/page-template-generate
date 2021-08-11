/*
 * @Date: 2020-01-17 14:29:57
 * @LastEditors: Jesse
 * @LastEditTime: 2020-01-17 14:35:10
 */
/* 入口js do anything you want */
import '../shared/base.less'
import './style.less'
import $ from 'jquery'
import '../../lib/dll/layer' // eslint-disable-line

window.layer.config({
    title: false
})

const ux = {
    showLoginPanel () {
        if ($('.user-layer').length === 0) {
            window.layer.open({
                type: 1,
                skin: 'user-layer',
                shadeClose: true,
                title: false,
                closeBtn: false,
                shade: [0.6, '#000'],
                border: [0],
                area: ['700px', '360px'],
                content: $('#overlay-cont')
            })
        }
        return false
    }
}

// $('.btn-download').click(() => {
//     window.open('https://sj.qq.com/myapp/detail.htm?apkName=com.huoshanzb.tv', '_blank')
// })

const islogin = sessionStorage.getItem('hello_ww_login')
if (islogin) {
    $('.login').text('注销')
}

$('.login').click(function () {
    if (sessionStorage.getItem('hello_ww_login')) return
    ux.showLoginPanel()
})

$('.go-login').click((evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    sessionStorage.setItem('hello_ww_login', true)

    $('.login').text('注销')
    window.layer.closeAll()

    return false
})

$('body').delegate('#overlay-cont .close_btn', 'click', function () {
    window.layer.closeAll()
})
