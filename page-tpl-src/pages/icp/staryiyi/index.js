'use strict'
import $ from 'jquery'
import '../../lib/dll/layer' // eslint-disable-line

import '../shared/base.less'
import './style.less'

import DATA from './data.json'

window.layer.config({
    title: false
})

const helpers = {
    getHashConnNum () {
        const base = 5000
        const x = parseInt(Math.random() * 200 + 300)
        const y = parseInt(Math.random() * 50)
        const symbol = parseInt(Math.random() * 2)

        return symbol === 0 ? base + x + y : base + x - y
    },
    getStatus () {
        const num = parseInt(Math.random() * 2)
        if (num === 0) {
            return 'free'
        }
        return ''
    },
    getLabel () {
        const temLabel = ['温柔', '清纯', '甜美', '性感', '火辣', '迷人', '幽默', '可爱', '女神', '娇柔', '妩媚', '治愈', '高冷', '性感', '成熟', '温婉', '幽默', '可爱', '呆萌', '娇羞', '女神']
        let len = temLabel.length
        const labelArr = []
        for (let i = 0; i < 3; i++) {
            len -= i
            const randomId = parseInt(Math.random() * len)

            labelArr.push(temLabel[randomId])
            temLabel.splice(randomId, 1)
        }

        return `<span>${labelArr[0]}</span><span>${labelArr[1]}</span><span>${labelArr[2]}</span>`
    },
    getChatNum () {
        return parseInt(Math.random() * 490) + 10
    },
    getPlaying () {
        return Math.random() * 10 >> 0 > 5 ? 'active' : ''
    },
    getTime () {
        return Math.random() * 20 >> 0
    },
    gtRandomInd (range, num) {
        const inds = []
        while (inds.length < num) {
            const i = Math.random() * range >> 0
            if (inds.indexOf(i) === -1) {
                inds.push(i)
            }
        }
        return inds
    },
    listRender (data) {
        return data.map(item => {
            return `
<li>
    <img src="${item.avatar}" class="avatar">
    <p class="title">
        <span class="text">${item.nickname}<span class="status_icon ${helpers.getStatus()}"></span></span>
    </p>
    <div class="label_wrap">${helpers.getLabel()}</div>

    </div>
    <p class="chat_num">${helpers.getChatNum()}次私密聊天</p>
    <span class="star"></span>

    <div class="voice_wrap clearfix">
        <span class="voice_icon fl" class="${helpers.getPlaying()}"></span>
        <span class="voice_length fr">${helpers.getTime()}''</span>
    </div>

    <hr>
    <button class="yue_btn go-info" data-id="${item.id}">查看资料</button>
</li>`
        }).join('')
    },
    siderlistRender (data) {
        return data.map((item, ind) => {
            return `<li class="clearfix">
    <div class="avatar_wrap fl go-info" data-id="${item.id}">
        <img src="${item.avatar}" class="avatar">
        ${ind < 3 ? `<img src="//static.guojiang.tv/src/pc/v4/img/chat/0${ind + 1}.png" class="avatar_mask">` : ''}
    </div>
    <div class="desc_wrap fl">
        <P class="nickname">${item.nickname}</P>
        <p class="num">${helpers.getChatNum()}次接单</p>
    </div>
</li>`
        }).join('')
    }
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
    },
    goInfo (id) {
        window.location.href = './dmModInfo.html?infoid=' + id
    }
}

const app = {
    initPhoneSvg () {
        var svgContainer = document.getElementById('phoneAnimation')
        window.bodymovin.loadAnimation({
            wrapper: svgContainer,
            animType: 'svg',
            loop: true,
            autoplay: true,
            path: '//static.guojiang.tv/src/pc/v4/img/chat/mobile/data.json'
        })
    },
    initConnNum () {
        const el = $('.conn-num')

        setInterval(() => {
            el.text(helpers.getHashConnNum())
        }, 1000)
    },
    initModlist () {
        $('#modlist').html(
            helpers.listRender(DATA)
        )
    },
    initSiderlist () {
        const randomInd = helpers.gtRandomInd(60, 10)
        $('#sider-list').html(
            helpers.siderlistRender(DATA.filter((val, ind) => randomInd.indexOf(ind) !== -1))
        )
    },
    initEvents () {
        $('.room_logined .logout').on('click', function () {
            ux.logout()

            sessionStorage.clear()
        })
        $('.room_login span').on('click', function () {
            ux.showLoginPanel()
        })
        $('body').delegate('#overlay-login .go-login', 'click', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()

            ux.logined()

            sessionStorage.setItem('staryiyi_islogin', true)

            return false
        })
        $('body').delegate('#overlay-cont .close_btn', 'click', function () {
            window.layer.closeAll()
        })
        // $('#app').delegate('.go-info', 'click', function (evt) {
        //     evt.preventDefault()
        //     evt.stopPropagation()

        //     ux.goInfo($(this).attr('data-id'))
        //     return false
        // })
    },
    run () {
        this.initPhoneSvg()
        this.initConnNum()
        this.initModlist()
        this.initSiderlist()

        this.initEvents()

        if (sessionStorage.getItem('staryiyi_islogin')) {
            ux.logined()
        }
    }
}

app.run()
