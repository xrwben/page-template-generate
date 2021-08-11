<template>
    <div class="module-reward">
        <div class="plan-container"></div>
        <div class="mod-award-container">
            <div class="mod-1">
                <p class="look-award mod-zj" @click="showContent(popupData.modzj, 'zj')"></p>
            </div>
            <div class="mod-2">
                <p class="look-award mod-one" @click="showContent(popupData.mod1, 'gj')"></p>
                <p class="look-award mod-two" @click="showContent(popupData.mod2, 'yj')"></p>
                <p class="look-award mod-three" @click="showContent(popupData.mod3, 'jj')"></p>
            </div>
        </div>
        <div class="user-award-container">
            <div class="user-1">
                <p class="look-award user-zz" @click="showContent(popupData.user1, 1)"></p>
            </div>
            <div class="user-2">
                <p class="look-award user-gw" @click="showContent(popupData.user23, 2)"></p>
                <p class="look-award user-qw" @click="showContent(popupData.user23, 3)"></p>
                <p class="look-award user-gj" @click="showContent(popupData.user410, 4)"></p>
            </div>
            <div class="user-3">
                <p class="look-award user-hj" @click="showContent(popupData.user410, 5)"></p>
                <p class="look-award user-bj" @click="showContent(popupData.user410, 6)"></p>
                <p class="look-award user-zj" @click="showContent(popupData.user410, 7)"></p>
            </div>
            <div class="user-4">
                <p class="look-award user-nj" @click="showContent(popupData.user410, 8)"></p>
                <p class="look-award user-xj" @click="showContent(popupData.user410, 9)"></p>
                <p class="look-award user-js" @click="showContent(popupData.user410, 10)"></p>
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="popup-module" v-if="showRewardPopup && currentData">
            <div class="popup-wrap">
                <div class="popup-reward-container">
                    <i class="close com-sprite-s" @click="showRewardPopup=false">关闭</i>
                    <div class="content">
                        <pc-scroller class="reward-scroller" ref="reward-scroller" thumb-color="rgba(255, 255, 255, 0.5)">
                            <div class="list-item" v-for="(item, index) in currentData.list" :key="index">
                                <div class="icon" @click="showAnimation(item)">
                                    <!-- 动态勋章 -->
                                    <i v-if="item.pic.indexOf('gif-xz') > -1" :class="item.pic" :style="xzStyle"></i>
                                    <!-- 动态头像框 -->
                                    <i v-else-if="item.pic.indexOf('gif-txk') > -1" :class="item.pic" :style="txkStyle"></i>
                                    <!-- 用户不同弹幕 -->
                                    <i v-else-if="item.pic.indexOf('dm') > -1" :class="[item.pic, 'dm-'+gloryName.en[userRank - 1]]"></i>
                                    <!-- 其它图像 -->
                                    <i v-else :class="item.pic"></i>
                                </div>
                                <p class="name" @click="showTip(item.tip)">{{ item.name.replace(/克拉/g, giftPer) }}<i class="tip-q btn-question" v-if="item.tip"></i></p>
                                <p class="txt">{{ item.txt }}</p>
                            </div>
                        </pc-scroller>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            showRewardPopup: true,
            popupData: {
                modzj: {
                    title: '超级冠军',
                    list: [
                        { pic: 'reward-mod-s jb', name: '荣誉奖杯', txt: '(以实物为准)', tip: '' },
                        { pic: 'reward-mod-s hz-zj', name: '特制粉丝徽章', txt: '(90日)', tip: '酷炫的粉丝徽章，更彰显尊贵。奖励有效期内，该特制粉丝徽章将会替换主播现有粉丝徽章' },
                        { pic: 'gif-xz xz-zj', name: '流光勋章', txt: '(90日)', tip: '' },
                        { pic: 'gif-txk txk-zj', name: '流光头像框', txt: '(90日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-mod-s xxk', name: '专属信息卡', txt: '(90日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-mod-s jv', name: '加V认证', txt: '(90日)', tip: '认证：2020年度最佳主播' },
                        { pic: 'reward-mod-s bq-zj', name: '推荐标签', txt: '(90日)', tip: '' },
                        { pic: 'reward-mod-s pp-zj', name: '全站开播飘屏', txt: '(90日)', tip: '年度结束后次日主播首次开播下发，每日下发一个' },
                        { pic: 'reward-mod-s lw', name: '全站定制礼物', txt: '(90日)', tip: '' },
                        { pic: 'reward-mod-s qmjc', name: '1.2倍粉丝亲密度加成', txt: '(90日)', tip: '活动结束后，只要成为主播的粉丝，送出任意礼物即享1.2倍粉丝亲密度加成' },
                        { pic: 'reward-mod-s kl', name: '克拉*3000,000', txt: '', tip: '' },
                        { pic: 'reward-mod-s kp', name: '定制开屏', txt: '(4日)', tip: '' },
                        { pic: 'reward-mod-s tc', name: '2021年1/2/3月收入提成+5%', txt: '', tip: '' },
                        { pic: 'reward-mod-s ztme', name: '2021年度盛典超级冠军赛直通名额', txt: '', tip: '' }
                    ]
                },
                mod1: {
                    title: '赛道冠军',
                    list: [
                        { pic: 'reward-mod-s jb', name: '荣誉奖杯', txt: '(以实物为准)', tip: '' },
                        { pic: 'reward-mod-s hz-1', name: '特制粉丝徽章', txt: '(60日)', tip: '酷炫的粉丝徽章，更彰显尊贵。奖励有效期内，该特制粉丝徽章将会替换主播现有粉丝徽章' },
                        { pic: 'gif-xz xz-1', name: '流光勋章', txt: '(60日)', tip: '' },
                        { pic: 'gif-txk txk-1', name: '流光头像框', txt: '(60日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-mod-s xxk', name: '专属信息卡', txt: '(60日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-mod-s jv', name: '加V认证', txt: '(60日)', tip: '认证：2020年度XX主播冠军' },
                        { pic: 'reward-mod-s bq-1', name: '推荐标签', txt: '(60日)', tip: '' },
                        { pic: 'reward-mod-s pp-1', name: '全站开播飘屏', txt: '(60日)', tip: '年度结束后次日主播首次开播下发，每日下发一个' },
                        { pic: 'reward-mod-s lw', name: '全站定制礼物', txt: '(60日)', tip: '' },
                        { pic: 'reward-mod-s qmjc', name: '1.2倍粉丝亲密度加成', txt: '(60日)', tip: '活动结束后，只要成为主播的粉丝，送出任意礼物即享1.2倍粉丝亲密度加成' },
                        { pic: 'reward-mod-s kl', name: '克拉*1000,000', txt: '', tip: '' },
                        { pic: 'reward-mod-s kp', name: '定制开屏', txt: '(2日)', tip: '' }
                    ]
                },
                mod2: {
                    title: '赛道亚军',
                    list: [
                        { pic: 'reward-mod-s jb', name: '荣誉奖杯', txt: '(以实物为准)', tip: '' },
                        { pic: 'gif-xz xz-2', name: '流光勋章', txt: '(30日)', tip: '' },
                        { pic: 'gif-txk txk-2', name: '流光头像框', txt: '(30日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-mod-s xxk', name: '专属信息卡', txt: '(30日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-mod-s jv', name: '加V认证', txt: '(30日)', tip: '认证：2020年度XX主播亚军' },
                        { pic: 'reward-mod-s bq-2', name: '推荐标签', txt: '(30日)', tip: '' },
                        { pic: 'reward-mod-s pp-2', name: '全站开播飘屏', txt: '(30日)', tip: '年度结束后次日主播首次开播下发，每日下发一个' },
                        { pic: 'reward-mod-s qmjc', name: '1.2倍粉丝亲密度加成', txt: '(30日)', tip: '活动结束后，只要成为主播的粉丝，送出任意礼物即享1.2倍粉丝亲密度加成' },
                        { pic: 'reward-mod-s kl', name: '克拉*800,000', txt: '', tip: '' }
                    ]
                },
                mod3: {
                    title: '赛道季军',
                    list: [
                        { pic: 'reward-mod-s jb', name: '荣誉奖杯', txt: '(以实物为准)', tip: '' },
                        { pic: 'gif-xz xz-3', name: '流光勋章', txt: '(30日)', tip: '' },
                        { pic: 'gif-txk txk-3', name: '流光头像框', txt: '(30日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-mod-s xxk', name: '专属信息卡', txt: '(30日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-mod-s jv', name: '加V认证', txt: '(30日)', tip: '认证：2020年度XX主播季军' },
                        { pic: 'reward-mod-s bq-3', name: '推荐标签', txt: '(30日)', tip: '' },
                        { pic: 'reward-mod-s pp-3', name: '全站开播飘屏', txt: '(30日)', tip: '年度结束后次日主播首次开播下发，每日下发一个' },
                        { pic: 'reward-mod-s qmjc', name: '1.2倍粉丝亲密度加成', txt: '(30日)', tip: '活动结束后，只要成为主播的粉丝，送出任意礼物即享1.2倍粉丝亲密度加成' },
                        { pic: 'reward-mod-s kl', name: '克拉*500,000', txt: '', tip: '' }
                    ]
                },
                user1: {
                    title: '第1名',
                    list: [
                        { pic: 'gif-xz', name: '流光勋章', txt: '(90日)', tip: '' },
                        { pic: 'gif-txk', name: '流光头像框', txt: '(90日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-user-s dm', name: '定制弹幕', txt: '(90日)', tip: '' },
                        { pic: 'reward-user-s lh', name: '4位永久靓号', txt: '', tip: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字，用户按照年度大人物榜的名次，依次选择靓号。此奖励将搭配专属靓号格式（靓号ID：XXX），用户替换下的旧靓号将回收。' },
                        { pic: 'reward-user-s zj', name: '年度大人物音效座驾', txt: '(90日)', tip: '运营于年度结束的7个工作日内，与用户联系座驾放入头像后下发。app端用户请更新至V6.2.7及以上版本查看。' },
                        { pic: 'reward-user-s xxk-user', name: '专属信息卡', txt: '(90日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-user-s nc', name: '永久专属昵称', txt: '', tip: '独一无二，永久专属于你的名字。运营会在年度结束的7个工作日内和奖励用户确定专属昵称' },
                        { pic: 'reward-user-s tr', name: '踢人权限', txt: '(90日)', tip: '只要成为该直播间管理员，即可拥有踢出房间内10级以下用户2小时特权。' },
                        { pic: 'reward-user-s pp', name: '上线全站飘屏', txt: '', tip: '年度结束后次日起，每日首次进入直播间触发。用户当前为隐身状态进入直播间不下发，若用户当日解除隐身状态，首次进入直播间，则可触发。有效期至2021年1月31日23:59:59。' },
                        { pic: 'reward-user-s jv-user', name: '加V认证', txt: '(90日)', tip: '认证：2020年度大人物第X名 - Y' },
                        { pic: 'reward-user-s cl', name: '礼物合成材料大礼包', txt: '', tip: '海蓝宝石*50、金琥珀*50、玛瑙*50、皇家紫水晶*50' },
                        { pic: 'reward-user-s hb', name: '年度红包', txt: '', tip: '年度红包于12.16之后每周用户首次进入直播间，下发到用户背包，每周X个，共Y个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包不发放，逾期不补发。有效期至2021年5月31日23:59:59，请及时使用。' },
                        { pic: 'reward-user-s stt', name: '上头条*30', txt: '', tip: '' },
                        { pic: 'reward-user-s fl', name: '大额返利', txt: '', tip: '2021年1/2/3月24小时内累计充值20万及以上返利20%' },
                        { pic: 'reward-user-s dhj', name: '定制打火机、钢笔', txt: '(以实物为准)', tip: '' }
                    ],
                    redpackage: {
                        avarage: 4,
                        total: 96
                    }
                },
                user23: {
                    title: '第2-3名',
                    list: [
                        { pic: 'gif-xz', name: '流光勋章', txt: '(60日)', tip: '' },
                        { pic: 'gif-txk', name: '流光头像框', txt: '(60日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-user-s dm', name: '定制弹幕', txt: '(60日)', tip: '' },
                        { pic: 'reward-user-s lh', name: '4位永久靓号', txt: '', tip: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字，用户按照年度大人物榜的名次，依次选择靓号。此奖励将搭配专属靓号格式（靓号ID：XXX），用户替换下的旧靓号将回收。' },
                        { pic: 'reward-user-s zj', name: '年度大人物音效座驾', txt: '(60日)', tip: '运营于年度结束的7个工作日内，与用户联系座驾放入头像后下发。app端用户请更新至V6.2.7及以上版本查看。' },
                        { pic: 'reward-user-s xxk-user', name: '专属信息卡', txt: '(60日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-user-s nc', name: '永久专属昵称', txt: '', tip: '独一无二，永久专属于你的名字。运营会在年度结束的7个工作日内和奖励用户确定专属昵称' },
                        { pic: 'reward-user-s tr', name: '踢人权限', txt: '(60日)', tip: '只要成为该直播间管理员，即可拥有踢出房间内10级以下用户2小时特权。' },
                        { pic: 'reward-user-s jv-user', name: '加V认证', txt: '(60日)', tip: '认证：2020年度大人物第X名 - Y' },
                        { pic: 'reward-user-s cl', name: '礼物合成材料大礼包', txt: '', tip: '海蓝宝石*40、金琥珀*40、玛瑙*40、皇家紫水晶*40' },
                        { pic: 'reward-user-s hb', name: '年度红包', txt: '', tip: '年度红包于12.16之后每周用户首次进入直播间，下发到用户背包，每周X个，共Y个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包不发放，逾期不补发。有效期至2021年5月31日23:59:59，请及时使用。' },
                        { pic: 'reward-user-s stt', name: '上头条*20', txt: '', tip: '' },
                        { pic: 'reward-user-s dhj', name: '定制打火机、钢笔', txt: '(以实物为准)', tip: '' }
                    ],
                    redpackage: {
                        avarage: 2,
                        total: 48
                    }
                },
                user410: {
                    title: '第4-10名',
                    list: [
                        { pic: 'gif-xz', name: '流光勋章', txt: '(30日)', tip: '' },
                        { pic: 'gif-txk', name: '流光头像框', txt: '(30日)', tip: 'app端用户请更新至V6.2.7及以上版本查看' },
                        { pic: 'reward-user-s dm', name: '定制弹幕', txt: '(30日)', tip: '' },
                        { pic: 'reward-user-s lh', name: '5-8位永久靓号', txt: '', tip: '运营会在年度结束的7个工作日内和奖励用户确定靓号数字，用户按照年度大人物榜的名次，依次选择靓号。此奖励将搭配专属靓号格式（靓号ID：XXX），用户替换下的旧靓号将回收。' },
                        { pic: 'reward-user-s zj', name: '年度大人物音效座驾', txt: '(30日)', tip: '运营于年度结束的7个工作日内，与用户联系座驾放入头像后下发。app端用户请更新至V6.2.7及以上版本查看。' },
                        { pic: 'reward-user-s xxk-user', name: '专属信息卡', txt: '(30日)', tip: '直播间发言区域内点击昵称或点击头像可弹出信息卡' },
                        { pic: 'reward-user-s nc', name: '永久专属昵称', txt: '', tip: '独一无二，永久专属于你的名字。运营会在年度结束的7个工作日内和奖励用户确定专属昵称' },
                        { pic: 'reward-user-s jv-user', name: '加V认证', txt: '(30日)', tip: '认证：2020年度大人物第X名 - Y' },
                        { pic: 'reward-user-s cl', name: '礼物合成材料大礼包', txt: '', tip: '海蓝宝石*30、金琥珀*30、玛瑙*30、皇家紫水晶*30' },
                        { pic: 'reward-user-s hb', name: '年度红包', txt: '', tip: '年度红包于12.16之后每周用户首次进入直播间，下发到用户背包，每周X个，共Y个。用户送出，全站飘屏通知抢克拉，主播不参与分成；若用户当周没有进入直播间，则当周红包不发放，逾期不补发。有效期至2021年5月31日23:59:59，请及时使用。' },
                        { pic: 'reward-user-s stt', name: '上头条*10', txt: '', tip: '' },
                        { pic: 'reward-user-s dhj', name: '定制打火机、钢笔', txt: '(以实物为准)', tip: '' }
                    ],
                    redpackage: {
                        avarage: 1,
                        total: 24
                    }
                }
            },
            currentData: null,
            userRank: 1,
            gloryName: {
                en: ['zz', 'gw', 'qw', 'gggj', 'hj', 'bj', 'xgzj', 'nj', 'xj', 'js'],
                zh: ['至尊皇帝', '尊贵国王', '传奇亲王', '高贵公爵', '尊荣侯爵', '英勇伯爵', '显贵子爵', '荣誉男爵', '华贵勋爵', '高级爵士']
            },
            xzStyle: null, // 勋章内联样式
            txkStyle: null // 头像框内联样式
        }
    },
    methods: {
        // 点击弹窗显示奖励内容
        showContent (content, rank) {
            // console.log(content, rank)
            this.currentData = content
            this.showRewardPopup = true
            this.userRank = rank
            if (typeof rank === 'number') {
                this.xzStyle = {
                    background: 'url(' + require(`../images/reward/user-xz/xz-${this.gloryName.en[this.userRank - 1]}.gif`) + ')'
                }
                this.txkStyle = {
                    background: 'url(' + require(`../images/reward/user-txk/txk-${this.gloryName.en[this.userRank - 1]}.gif`) + ')'
                }
            } else {
                this.xzStyle = {
                    background: 'url(' + require(`../images/reward/mod-xz/xz-${rank}.gif`) + ')'
                }
                this.txkStyle = {
                    background: 'url(' + require(`../images/reward/mod-txk/txk-${rank}.gif`) + ')'
                }
            }
        },
        // 显示座驾动效
        showAnimation (info) {
            if (info.name === '年度大人物音效座驾') {
                this.$SvgPlayer.playSvg(`//static.guojiang.tv/vmaker/zj2020/${this.userRank}/data.json`)
            }
        },
        // 点击问号提示
        showTip (tip) {
            console.log(tip, this.giftPer)
            if (!tip) {
                return
            }
            if (tip.indexOf('克拉') > -1) {
                tip = tip.replace(/克拉/g, this.giftPer)
            }
            if (tip.indexOf('认证：2020年度大人物') > -1) {
                tip = tip.replace('X', this.userRank).replace('Y', this.gloryName.zh[this.userRank - 1])
            }
            if (tip.indexOf('红包') > -1) {
                tip = tip.replace('X', this.currentData.redpackage.avarage).replace('Y', this.currentData.redpackage.total)
            }
            this.$toast.show(tip, true)
        }
    }
}
</script>
