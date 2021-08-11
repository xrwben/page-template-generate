import PCScroller from '../../components/PCScroller/PCScroller'
import { Component } from 'react'
import $toast from '../../plugins/toast'
import $svgPlayer from '../../plugins/svgPlayer'

const pageType = Component.prototype.pageType
const perName = Component.prototype.perName

/* map: css class => icon */
const icon = {
    /* ************** common ************** */
    // 定制动态勋章
    badge: {
        cname: {
            className: 'rw-pic badge-pic',
            src (key) {
                return `https://static.tuho.tv/vmaker/assets/images/annual19/medals/b_${key}.gif`
            }
        },
        txt: 'rw-t-s g-t-badge'
    },
    // 定制头像框
    avatar: {
        cname: {
            className: 'rw-pic avatar-pic',
            src (key) {
                return `https://static.tuho.tv/vmaker/assets/images/annual19/avatar/${key}.png`
            }
        },
        txt: 'rw-t-s g-t-avatar'
    },
    // 加v认证
    v: {
        cname: 'gi-s g-v',
        txt: 'rw-t-s g-t-v'
    },
    /* ************** 主播 ************** */
    // 荣誉奖杯
    globet: {
        cname: 'gi-m-s g-globet',
        txt: 'rw-t-m-s g-t-globet'
    },
    // 荣誉证书
    cert: {
        cname: 'gi-m-s g-cert',
        txt: 'rw-t-m-s g-t-cert'
    },
    // 推荐标签
    label: {
        cname: {
            className: 'rw-pic label-pic',
            src (key) {
                return `https://static.tuho.tv/vmaker/assets/images/annual19/label/${key}.png`
            }
        },
        txt: 'rw-t-m-s g-t-label'
    },
    // 全站开播飘屏
    danmu: {
        cname: {
            className: 'rw-pic danmu-pic',
            src (key) {
                return `https://static.tuho.tv/vmaker/assets/images/annual19/danmu/${key}.png`
            }
        },
        txt: 'rw-t-m-s g-t-danmu-m'
    },
    // 定制开屏
    screen: {
        cname: 'gi-m-s g-screen',
        txt: 'rw-t-m-s g-t-screen'
    },
    // 全站定制礼物
    cusgift: {
        cname: 'gi-m-s g-cusgift',
        txt: 'rw-t-m-s g-t-cusgift'
    },
    // 收入提成
    income: {
        cname: 'gi-m-s g-income',
        txt: 'rw-t-m-s g-t-income'
    },
    // 钻石克拉
    zs: {
        cname: 'gi-m-s g-zs',
        txt_0: 'rw-t-m-s g-t-zs-0',
        txt_1: 'rw-t-m-s g-t-zs-1',
        txt_2: 'rw-t-m-s g-t-zs-2',
        txt_3: 'rw-t-m-s g-t-zs-3'
    },
    /* ************** 用户 ************** */
    // 定制弹幕
    cdanmu: {
        cname: {
            className: 'rw-pic cdanmu-pic',
            src (key) {
                return `https://static.tuho.tv/vmaker/assets/images/annual19/cdanmu/${key}.png`
            }
        },
        txt: 'rw-t-u-s g-t-danmuc'
    },
    // 靓号
    liang: {
        cname: 'gi-u-s g-liang',
        txt: 'rw-t-u-s g-t-liang'
    },
    // 年度大人物座驾
    mount: {
        cname: 'gi-u-s mount',
        txt: 'rw-t-u-s g-t-zj'
    },
    // 年度红包
    redpack: {
        cname: 'gi-u-s g-redpack',
        txt: 'rw-t-u-s g-t-redpack'
    },
    // 上头条
    stt: {
        cname: 'gi-u-s g-stt',
        txt_10: 'rw-t-u-s g-t-stt-10',
        txt_20: 'rw-t-u-s g-t-stt-20',
        txt_30: 'rw-t-u-s g-t-stt-30'
    },
    // 上线全站飘屏
    sxdanmu: {
        cname: 'gi-s g-danmu',
        txt: 'rw-t-u-s g-t-danmu'
    },
    // 大额返利
    fanli: {
        cname: 'gi-u-s g-coin',
        txt: 'rw-t-u-s g-t-coin'
    }
}

const rwMap = {
    'm-0': [
        { cname: icon.globet.cname, txt: icon.globet.txt, desc: '（以实物为准）' },
        { cname: icon.cert.cname, txt: icon.cert.txt, desc: '（以实物为准）' },
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（90日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（90日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.v.cname, txt: icon.v.txt, desc: '（90日）', tips: '认证：2019年度最佳主播' },
        { cname: icon.label.cname, txt: icon.label.txt, desc: '（90日）' },
        { cname: icon.danmu.cname, txt: icon.danmu.txt, desc: '（60次）', tips: '年度结束后次日主播首次开播下发，每日下发一次' },
        { cname: icon.screen.cname, txt: icon.screen.txt, desc: '（4日）' },
        { cname: icon.cusgift.cname, txt: icon.cusgift.txt, desc: '（90日）' },
        { cname: icon.income.cname, txt: icon.income.txt },
        { cname: icon.zs.cname, txt: icon.zs.txt_0 }
    ],
    'm-1': [
        { cname: icon.globet.cname, txt: icon.globet.txt, desc: '（以实物为准）' },
        { cname: icon.cert.cname, txt: icon.cert.txt, desc: '（以实物为准）' },
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（60日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（60日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.v.cname, txt: icon.v.txt, desc: '（60日）', tips: '认证：2019年度XX主播冠军' },
        { cname: icon.label.cname, txt: icon.label.txt, desc: '（60日）' },
        { cname: icon.danmu.cname, txt: icon.danmu.txt, desc: '（30次）', tips: '年度结束后次日主播首次开播下发，每日下发一次' },
        { cname: icon.screen.cname, txt: icon.screen.txt, desc: '（2日）' },
        { cname: icon.cusgift.cname, txt: icon.cusgift.txt, desc: '（60日）' },
        { cname: icon.zs.cname, txt: icon.zs.txt_1 }
    ],
    'm-2': [
        { cname: icon.globet.cname, txt: icon.globet.txt, desc: '（以实物为准）' },
        { cname: icon.cert.cname, txt: icon.cert.txt, desc: '（以实物为准）' },
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（30日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（30日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.v.cname, txt: icon.v.txt, desc: '（30日）', tips: '认证：2019年度XX主播亚军' },
        { cname: icon.label.cname, txt: icon.label.txt, desc: '（30日）' },
        { cname: icon.danmu.cname, txt: icon.danmu.txt, desc: '（20次）', tips: '年度结束后次日主播首次开播下发，每日下发一次' },
        { cname: icon.zs.cname, txt: icon.zs.txt_2 }
    ],
    'm-3': [
        { cname: icon.globet.cname, txt: icon.globet.txt, desc: '（以实物为准）' },
        { cname: icon.cert.cname, txt: icon.cert.txt, desc: '（以实物为准）' },
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（20日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（20日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.v.cname, txt: icon.v.txt, desc: '（20日）', tips: '认证：2019年度XX主播季军' },
        { cname: icon.label.cname, txt: icon.label.txt, desc: '（20日）' },
        { cname: icon.danmu.cname, txt: icon.danmu.txt, desc: '（10次）', tips: '年度结束后次日主播首次开播下发，每日下发一次' },
        { cname: icon.zs.cname, txt: icon.zs.txt_3 }
    ],
    'u-0': [
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（90日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（90日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.cdanmu.cname, txt: icon.cdanmu.txt, desc: '（90日）' },
        { cname: icon.liang.cname, txt: icon.liang.txt, tips: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第1-3名靓号格式：AAAAA' },
        { cname: icon.mount.cname, txt: icon.mount.txt, desc: '（90日）', tips: '运营会在年度结束的7个工作日内，和用户联系座驾中放入的头像，再给用户下发。' },
        { cname: icon.redpack.cname, txt: icon.redpack.txt, tips: '年度红包于12.18 00:00:00之后每周用户首次进入直播间，下发到用户背包，每周4个，共96个。用户送出，全站飘屏通知抢' + perName + '，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2020年5月31日23:59:59，请及时使用。' },
        { cname: icon.stt.cname, txt: icon.stt.txt_30 },
        { cname: icon.v.cname, txt: icon.v.txt, desc: '（90日）', tips: '认证：2019年度大人物第一名：至尊皇帝' },
        null,
        { cname: icon.sxdanmu.cname, txt: 'rw-t-u-s g-t-danmu', tips: '年度结束后次日起，每日首次进入直播间触发。用户当前为隐身状态进入直播间不下发，若用户当日解除隐身状态，首次进入直播间，则可触发。有效期至2019年1月31日23:59:59' },
        { cname: icon.fanli.cname, txt: icon.fanli.txt, tips: '2020年1/2/3月24小时内累计充值20万及以上返利20%' }
    ],
    'u-1-4': [
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（60日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（60日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.cdanmu.cname, txt: icon.cdanmu.txt, desc: '（60日）' },
        {
            cname: icon.liang.cname,
            txt: icon.liang.txt,
            tips: {
                u_1: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第1-3名靓号格式：AAAAA',
                u_2: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第1-3名靓号格式：AAAAA',
                u_3: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第4-5名靓号格式：AAAAB',
                u_4: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第4-5名靓号格式：AAAAB'
            }
        },
        { cname: icon.mount.cname, txt: icon.mount.txt, desc: '（60日）', tips: '运营会在年度结束的7个工作日内，和用户联系座驾中放入的头像，再给用户下发。' },
        { cname: icon.redpack.cname, txt: icon.redpack.txt, tips: '年度红包于12.18 00:00:00之后每周用户首次进入直播间，下发到用户背包，每周2个，共48个。用户送出，全站飘屏通知抢' + perName + '，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2020年5月31日23:59:59，请及时使用。' },
        { cname: icon.stt.cname, txt: icon.stt.txt_20 },
        {
            cname: icon.v.cname,
            txt: icon.v.txt,
            desc: '（60日）',
            tips: {
                u_1: '认证：2019年度大人物第二名：尊贵国王',
                u_2: '认证：2019年度大人物第三名：传奇亲王',
                u_3: '认证：2019年度大人物第四名：高贵公爵',
                u_4: '认证：2019年度大人物第五名：尊荣侯爵'
            }
        }
    ],
    'u-5-9': [
        { cname: icon.badge.cname, txt: icon.badge.txt, desc: '（30日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.avatar.cname, txt: icon.avatar.txt, desc: '（30日）', tips: 'app端用户请更新至V5.5.6及以上版本查看' },
        { cname: icon.cdanmu.cname, txt: icon.cdanmu.txt, desc: '（30日）' },
        {
            cname: icon.liang.cname,
            txt: icon.liang.txt,
            tips: {
                u_5: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第6-10名靓号格式：AAABB',
                u_6: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第6-10名靓号格式：AAABB',
                u_7: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第6-10名靓号格式：AAABB',
                u_8: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第6-10名靓号格式：AAABB',
                u_9: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字。用户按照大人物榜的名次，依次选择靓号。第6-10名靓号格式：AAABB'
            }
        },
        { cname: icon.mount.cname, txt: icon.mount.txt, desc: '（30日）', tips: '运营会在年度结束的7个工作日内，和用户联系座驾中放入的头像，再给用户下发。' },
        { cname: icon.redpack.cname, txt: icon.redpack.txt, tips: '年度红包于12.18 00:00:00之后每周用户首次进入直播间，下发到用户背包，每周1个，共24个。用户送出，全站飘屏通知抢' + perName + '，主播不参与分成；若用户当周没有进入直播间，则当周红包雨不发放，逾期不予补发。有效期至2020年5月31日23:59:59，请及时使用。' },
        { cname: icon.stt.cname, txt: icon.stt.txt_10 },
        {
            cname: icon.v.cname,
            txt: icon.v.txt,
            desc: '（30日）',
            tips: {
                u_5: '认证：2019年度大人物第六名：英勇伯爵',
                u_6: '认证：2019年度大人物第七名：显贵子爵',
                u_7: '认证：2019年度大人物第八名：荣誉男爵',
                u_8: '认证：2019年度大人物第九名：华贵勋爵',
                u_9: '认证：2019年度大人物第十名：高级爵士'
            }
        }
    ]
}

const mountAni = {
    u_0: '//static.tuho.tv/src/pc/img/room/svg/mount/73/data.json',
    u_1: '//static.tuho.tv/src/pc/img/room/svg/mount/74/data.json',
    u_2: '//static.tuho.tv/src/pc/img/room/svg/mount/75/data.json',
    u_3: '//static.tuho.tv/src/pc/img/room/svg/mount/76/data.json',
    u_4: '//static.tuho.tv/src/pc/img/room/svg/mount/77/data.json',
    u_5: '//static.tuho.tv/src/pc/img/room/svg/mount/78/data.json',
    u_6: '//static.tuho.tv/src/pc/img/room/svg/mount/79/data.json',
    u_7: '//static.tuho.tv/src/pc/img/room/svg/mount/80/data.json',
    u_8: '//static.tuho.tv/src/pc/img/room/svg/mount/81/data.json',
    u_9: '//static.tuho.tv/src/pc/img/room/svg/mount/82/data.json'
}

function showTip (tips, rwKey) {
    if (typeof tips === 'string') {
        $toast.showTip(tips)
    } else {
        $toast.showTip(tips[rwKey])
    }
}

export default function RewardsLayer (rwType, rwKey, onClose) {
    const rwListJSX = rwMap[rwType].map((gift, gi) => !gift ? <span className="sep" key={ 'sep' } /> : (
        <div className="rw-i" key={ 'rw-i-' + gi }>
            <div className="rw-g-icon fl-box">
                {
                    typeof gift.cname.className !== 'undefined'
                        ? (
                            <img
                                className={ `${gift.cname.className} ${rwKey}` }
                                src={ gift.cname.src(rwKey) } />
                        )
                        : (<div className={ `rw-g-pic ${gift.cname}` }></div>)
                }
                {
                    gift.cname === 'gi-u-s mount' && <div className="mount-play fl-box" onClick={ () => $svgPlayer.play(mountAni[rwKey]) }><span className="butn common-s a-play"></span></div>
                }
            </div>
            <div className="rw-tips-hot" onClick={ () => { typeof gift.tips !== 'undefined' && showTip(gift.tips, rwKey) } }>
                <div className={ `rw-name ${gift.txt} ${gift.tips ? 'rw-name-tips' : ''}` }>
                    { typeof gift.tips !== 'undefined' && <span className="butn common-s icon-qs" /> }
                </div>
                <div className="rw-desc">{ gift.desc }</div>
            </div>
        </div>
    ))

    return (
        <div className="layer layer-rw" data-per={ perName }>
            <div className="layer-c">
                <div className="common-s butn btn-close" onClick={ onClose }></div>
                <div className="layer-h">
                    <div className="rw-h">
                        <img className={ `rw-h-pic ${rwKey}` } src={ `https://static.tuho.tv/vmaker/assets/images/annual19/layer-h/${rwKey}.png` } />
                    </div>
                    <img className={ `rw-h-t ${rwKey}` } src={ `https://static.tuho.tv/vmaker/assets/images/annual19/layer-t/${rwKey}.png` } />
                </div>
                {
                    pageType === 'pc' ? (
                        <PCScroller
                            className="layer-m"
                            right="10"
                            thumbColor="#efc65a"
                            onScroll={ null }
                            canBubble={ true }
                        >
                            <div className="rw-list fl-box">
                                { rwListJSX }
                            </div>
                        </PCScroller>
                    ) : (
                        <div className="layer-m">
                            <div className="rw-list fl-box">
                                { rwListJSX }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
