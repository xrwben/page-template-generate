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
    getTimes () {
        return parseInt(Math.random() * 490) + 10
    },
    getLevel () {
        return Math.random() * 35 >> 0
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
    renderRankItem (data, hasTimes) {
        return data.map((item, ind) => {
            return `<li class="clearfix">
    <div class="rank_num_wrap">
        <span>NO.${ind + 1}</span>
        <i class="rank_num_icon"></i>
    </div>       
    <div class="img_wrap">
        <a href="javascript:;" class="go-info" data-id="${item.id}">
            <img src="${item.avatar}"><i class="img-shade"></i>
        </a>
    </div>
    <div class="nickname_wrap">
        <a href="javascript:;" class="go-info" data-id="${item.id}">
            <p class="nickname">${item.nickname}</p>
        </a>
        <div class="level-box">
            <span class="level level_icon m_level_icon_${helpers.getLevel()}"></span>
            
        </div>
        ${hasTimes ? `<p><span>${helpers.getTimes()}</span>次</p>` : ''}
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
        window.location.href = './modinfo.html?infoid=' + id
    }
}

const app = {
    renderRankPop () {
        const randomInd = helpers.gtRandomInd(60, 10)
        $('.popularity .rank_content').html(
            helpers.renderRankItem(DATA.filter((val, ind) => randomInd.indexOf(ind) !== -1), true)
        )
    },
    renderRankStar () {
        const randomInd = helpers.gtRandomInd(60, 10)
        $('.star .rank_content').html(
            helpers.renderRankItem(DATA.filter((val, ind) => randomInd.indexOf(ind) !== -1))
        )
    },
    renderRankWealth () {
        const randomInd = helpers.gtRandomInd(60, 10)
        $('.wealth .rank_content').html(
            helpers.renderRankItem(DATA.filter((val, ind) => randomInd.indexOf(ind) !== -1))
        )
    },
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
        $('#app').delegate('.go-info', 'click', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()

            ux.goInfo($(this).attr('data-id'))
            return false
        })
        $('.star .title-ul').delegate('li', 'click', function () {
            $('.star .title-ul li').removeClass('active')
            $(this).addClass('active')
            app.renderRankStar()
        })
        $('.wealth .title-ul').delegate('li', 'click', function () {
            $('.wealth .title-ul li').removeClass('active')
            $(this).addClass('active')
            app.renderRankWealth()
        })
        $('body').delegate('#overlay-cont .close_btn', 'click', function () {
            window.layer.closeAll()
        })
    },
    run () {
        this.renderRankPop()
        this.renderRankStar()
        this.renderRankWealth()
        this.initEvents()
    }
}

app.run()
