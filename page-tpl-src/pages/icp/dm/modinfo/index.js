'use strict'

import $ from 'jquery'
import '../../lib/dll/layer' // eslint-disable-line

import '../shared/base.less'
import './style.less'

import DATA from './data.json'

window.layer.config({
    title: false
})

function getQSParams () {
    const result = {}
    let qs = window.location.search
    if (!qs) return result

    qs = qs.slice(1).split('&')
    qs.forEach(kv => {
        const target = kv.split('=')
        result[target[0].trim()] = target[1].trim()
    })

    return result
}

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
    },
    logined () {
        window.layer.closeAll()
        $('.room_login').css('display', 'none')
        $('.room_logined').css({
            display: 'block'
        })
    },
    logout () {
        $('.room_login').css('display', 'block')
        $('.room_logined').css({
            display: 'none'
        })
    }
}

const app = {
    initEvents () {
        $('.room_logined .logout').on('click', function () {
            ux.logout()
        })
        $('.room_login span').on('click', function () {
            ux.showLoginPanel()
        })
        $('body').delegate('#overlay-login .go-login', 'click', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()

            ux.logined()
            return false
        })
        $('body').delegate('#overlay-cont .close_btn', 'click', function () {
            window.layer.closeAll()
        })
    },
    render () {
        const infoid = getQSParams().infoid
        const source = DATA[infoid]

        if (!source) {
            return
        }

        $('#mod-avatar').attr('src', source.avatar)
        $('#mod-nickname').text(source.nickname)
        $('.badge-age').html('<span class="icon-girl">♀</span> ' + source.age)
        $('.address').text('坐标 ' + source.address)
        $('.info-p .fans').text('粉丝：' + source.fans)
        $('.info-p .atte').text('关注：' + source.atte)
        $('.tatto').text('个性签名：' + (source.tatto.length > 20 ? source.tatto.slice(0, 20) + '...' : source.tatto))

        $('.label-a').text(source.badge[0])
        $('.label-b').text(source.badge[1])
        $('.label-c').text(source.badge[2])

        $($('.label-d')[0]).text(source.hobby[0])
        $($('.label-d')[1]).text(source.hobby[1])
        $($('.label-d')[2]).text(source.hobby[2])

        $('.gallery').html(source.album.map((item, ind) => `<div class="photo" key="${ind}"><img src="${item}" alt="photo"></div>`).join(''))
    },
    run () {
        this.render()
        this.initEvents()
    }
}

app.run()
