<template>
    <div class="popup-module">
        <div class="popup-rule-container">
            <i class="close com-sprite-s" @click="closeRulePopup">关闭</i>
            <div class="content">
                <pc-scroller class="rule-scroller" ref="rule-scroller" thumb-color="rgba(255, 255, 255, 0.5)">
                    <div class="tab-wrap">
                        <div class="tab rule-sprite-s" :class="currentTab===1?'rule-hxs-normal':'rule-hxs-gray'" @click="changeTab(1)"></div>
                        <div class="tab rule-sprite-s" :class="currentTab===2?'rule-yxs-normal':'rule-yxs-gray'" @click="changeTab(2)"></div>
                        <div class="tab rule-sprite-s" :class="currentTab===3?'rule-sdbm-normal':'rule-sdbm-gray'" @click="changeTab(3)"></div>
                        <div class="tab rule-sprite-s" :class="currentTab===4?'rule-jjs-normal':'rule-jjs-gray'" @click="changeTab(4)"></div>
                        <div class="tab rule-sprite-s" :class="currentTab===5?'rule-sdzb-normal':'rule-sdzb-gray'" @click="changeTab(5)"></div>
                        <div class="tab rule-sprite-s" :class="currentTab===6?'rule-cjgjs-normal':'rule-cjgjs-gray'" @click="changeTab(6)"></div>
                    </div>
                    <!-- 活动时间 -->
                    <div class="headline rule-sprite-s icon-time"></div>
                    <p class="item">{{ timeRange[currentTab - 1] }}</p>
                    <!-- 活动礼物 -->
                    <div class="headline rule-sprite-s icon-gift"></div>
                    <table class="table">
                        <tr><th>礼物名称</th><th>单价({{ giftPer }})</th><th>荣耀值</th></tr>
                        <tr v-for="(item, index) in ruleGift" :key="index">
                            <td>
                                <div class="pic" :class="item.pic"></div>
                                <p>{{ item.name }}</p>
                            </td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.score }}</td>
                        </tr>
                    </table>
                    <p class="item">*凤游九天为音效礼物，app端V6.2.7以上及PC端送出，可触发震撼音效</p>
                    <!-- 报名规则 -->
                    <div class="headline rule-sprite-s icon-apply" v-show="currentTab === 3"></div>
                    <div v-show="currentTab === 3">
                        <p class="item">报名范围：预选赛晋级的101强主播。</p>
                        <p class="item">报名说明：</p>
                        <p class="item">1. 101位主播可自由报名赛道，每个赛道最多只能报名21位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。</p>
                        <p class="item">2. 确认报名后，将不可变更赛道。每个主播只能参加其中一条赛道，请谨慎操作！</p>
                        <p class="item">3. 12.2 22:00:00将公布所有赛道主播。</p>
                        <p class="item">4. 2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，主播无需参与赛道报名。</p>
                        <p class="item">5. 12月1日至12月2日，主播获得的荣耀值不计入任意赛段，用户贡献荣耀值全程累计。</p>
                    </div>
                    <!-- 活动规则 -->
                    <div class="headline rule-sprite-s icon-activity" v-show="currentTab !== 3"></div>
                    <div v-show="currentTab === 1">
                        <p class="item">1.平台所有主播无需报名，均可参赛。</p>
                        <p class="item">2.海选赛期间内，主播荣耀值达10000即可晋级。</p>
                        <p class="item">3.三周年冠军-歌姬章八爪（ID：8888888）直接进入赛道报名，享有海选赛及预选赛免赛权；2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，两位主播不占海选赛名额。</p>
                        <p class="item">4.所有晋级主播可获得锦鲤*10（锦鲤非活动礼物，仅用于"年度锦鲤"玩法中瓜分克拉，年度结束后，按主播锦鲤数占总锦鲤数的比例，瓜分200w克拉）。</p>
                        <p class="item">5.海选赛结束后，主播荣耀值清零，不累计至预选赛，用户贡献荣耀值全程累计。</p>
                    </div>
                    <div v-show="currentTab === 2">
                        <p class="item">1.海选赛晋级主播，即可参赛。</p>
                        <p class="item">2.按主播累计荣耀值排名，晋级前100名主播。若荣耀值相同，则按先到先得排名。预选赛结束后，主播荣耀值清零，用户贡献荣耀值活动全程累计。</p>
                        <p class="item">3.三周年冠军-歌姬章八爪（ID：8888888）直接进入赛道报名，享有海选赛及预选赛免赛权；2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，两位主播不占100名晋级名额。</p>
                    </div>
                    <div v-show="currentTab === 4">
                        <p class="item">1.每个赛道各有3轮末尾淘汰，最终每个赛道决出8强，每日主播荣耀值清零不累计，用户贡献荣耀值活动全程累计。</p>
                        <p class="item">2.若有荣耀值相同，则按先到先得排名。</p>
                        <p class="item">3.赛程如下：</p>
                        <p class="item-img-4"></p>
                        <p class="item">4.2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，主播不参与晋级赛比拼。</p>
                    </div>
                    <div v-show="currentTab === 5">
                        <p class="item">1.12.6 - 12.12单循环比拼</p>
                        <p class="item">1）主播按照赛道内单循环方式比拼，每天与赛道内一名主播进行比拼，比拼以当天00:00:00 - 23:59:59期间的荣耀值定胜负，胜方积3分，负方积1分，荣耀值每轮清零。</p>
                        <p class="item">2）12.12 23:59:59结算时，积分前4名的主播晋级至13日比赛；若积分相同，按照12.6-12.12期间主播总荣耀值排名，此时若荣耀值相同，则按先到先得排名。</p>
                        <p class="item">3）比拼赛程如下，其中数字为12月5日赛道内排名：</p>
                        <table class="table">
                            <tr><th>12.6第一轮</th><th>12.7第二轮</th><th>12.8第三轮</th><th>12.9第四轮</th><th>12.10第五轮</th><th>12.11第六轮</th><th>12.12第七轮</th></tr>
                            <tr><td>1 V 2</td><td>1 V 3</td><td>1 V 4</td><td>1 V 5</td><td>1 V 6</td><td>1 V 7</td><td>1 V 8</td></tr>
                            <tr><td>3 V 4</td><td>2 V 4</td><td>2 V 3</td><td>2 V 6</td><td>2 V 5</td><td>2 V 8</td><td>2 V 7</td></tr>
                            <tr><td>5 V 6</td><td>5 V 7</td><td>5 V 8</td><td>3 V 7</td><td>3 V 8</td><td>3 V 5</td><td>3 V 6</td></tr>
                            <tr><td>7 V 8</td><td>6 V 8</td><td>6 V 7</td><td>4 V 8</td><td>4 V 7</td><td>4 V 6</td><td>4 V 5</td></tr>
                        </table>
                        <p class="item">2.12.6 00:00-00:05分为系统分组时间，此期间送礼，主播荣耀值不计入任意榜单。</p>
                        <p class="item">3.13日，5个赛道晋级的4名主播按照当日荣耀值进行排名，最终决出赛道冠亚季军。</p>
                        <p class="item">4.若超级冠军-年度最佳主播出现在XX赛道，则赛道内2-4名主播名次进1。</p>
                        <p class="item">5.荣耀值若有相同，则按先到先得排名、定胜负。</p>
                        <p class="item">6.2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，主播不参与赛道争霸比拼。</p>
                    </div>
                    <div v-show="currentTab === 6">
                        <p class="item">1. 5个赛道的冠军主播进行两天的末位淘汰，直至决出超级冠军——年度最佳主播。若荣耀值相同，则按先到先得排名。</p>
                        <p class="item">例：若偶像赛道的冠军主播成为年度最佳主播，则偶像赛道的亚军主播自动成为偶像赛道的冠军主播，则偶像赛道的季军主播自动成为偶像赛道的亚军主播，则偶像赛道的第四名主播自动成为偶像赛道的季军主播。</p>
                        <p class="item">2.主播荣耀值次日零点清零，用户贡献荣耀值年度全程累计。</p>
                        <p class="item">3.赛程如下：</p>
                        <p class="item-img-6"></p>
                        <p class="item">4.2019年度最佳主播-大团子（ID：456789）直接进入超级冠军赛，参与本赛程比拼。</p>
                    </div>
                    <!-- 主播玩法 -->
                    <div class="headline rule-sprite-s icon-mod" v-if="currentTab !== 1 && currentTab !== 3"></div>
                    <div v-show="currentTab === 2">
                        <p class="item">1.日榜的前五名主播奖励荣耀值，每日23:59:59结算。自动算入主播次日日榜，以及预选赛榜。奖励的荣耀值不计算主播收益，仅计入排行榜。</p>
                        <table class="table">
                            <tr><th>日榜名次</th><th>第1名</th><th>第2名</th><th>第3名</th><th>第4、5名</th></tr>
                            <tr><td>奖励荣耀值</td><td>20000</td><td>15000</td><td>10000</td><td>5000</td></tr>
                        </table>
                        <p class="item">2.每日的前100强主播次日24小时奖励年度特殊推荐标签。<i class="icon rule-sprite-s bq-100"></i></p>
                        <p class="item">3.晋级的100名主播可获得锦鲤*60（锦鲤非活动礼物，仅用于"年度锦鲤"玩法中瓜分克拉，年度结束后，按主播锦鲤数占总锦鲤数的比例，瓜分200w克拉）。</p>
                    </div>
                    <div v-show="currentTab === 4">
                        <p class="item">1.每轮未淘汰的主播在下一轮进行期间奖励年度特殊推荐标签。<i class="icon rule-sprite-s bq-tl15"></i></p>
                        <p class="item">2.最后一日决出赛道8强主播，都将获得<i class="icon rule-sprite-s bq-tl8"></i>特殊推荐标签。有效期：12.6 00:00:00 - 12.12 23:59:59。</p>
                        <p class="item">3.每日晋级的主播可获得锦鲤*200（锦鲤非活动礼物，仅用于"年度锦鲤"玩法中瓜分克拉，年度结束后，按主播锦鲤数占总锦鲤数的比例，瓜分200w克拉）。</p>
                    </div>
                    <div v-show="currentTab === 5">
                        <p class="item">1.晋级至13日比赛的主播，将在13日当日奖励年度特殊推荐标签<i class="icon rule-sprite-s bq-tl4"></i>。每个赛道的冠亚季军主播，都将获得“XX冠军”、“XX亚军”、“XX季军”特殊推荐标签，有效期：12.14 00:00:00-12.15 23:59:59。</p>
                        <p class="item">2.12.6 - 12.12每日比拼的最后10分钟所有主播的荣耀值隐藏，仅主播本人与活动全程贡献荣耀值最高的用户可见！</p>
                        <p class="item">3.赛道冠军可带13日自身荣耀值50%的分数进入超级冠军赛14日的比拼。</p>
                        <p class="item">4.单循环比拼赛期间，每日比拼获胜的主播获得锦鲤*300；赛道争霸赛（12.13）前三名主播分别获得10000、5000、2000只锦鲤（锦鲤非活动礼物，仅用于"年度锦鲤"玩法中瓜分克拉。年度结束后，按主播锦鲤数占总锦鲤数的比例，瓜分200w克拉）。</p>
                    </div>
                    <div v-show="currentTab === 6">
                        <p class="item">1.获得2020星光年度最佳主播的主播，将在12月16日00:00全站飘屏通知。</p>
                        <p class="item">2.超级冠军赛第一名主播，额外奖励1000000克拉，第二名主播额外奖励800000克拉，第三名主播额外奖励500000克拉。</p>
                        <p class="item">3.15日当日送出年度礼物，主播/用户经验值、粉丝亲密度双倍计算，主播星光值、分成按照原价计算！</p>
                    </div>
                    <!-- 用户玩法 -->
                    <div class="headline rule-sprite-s icon-user"></div>
                    <p class="item">1.观看福利：活动期间，用户每日首次进入直播间，获得1张助力票，自动下发在背包。在线累计观看直播满5分钟，获得1张助力票，需手动领取。每日上限5张。6张票仅当日有效，次日清空。（在活动页面年度大人物页面领取助力票；一个设备/IP每日仅限一个ID获得观看福利）</p>
                    <p class="item">2.首充福利：活动期间，APP端用户每日每个设备/IP下，首个ID首次成功充值任意金额，即可获得10张助力票。<span class="recharge" @click="goRecharge">去充值>>></span></p>
                    <p class="item">3.红包雨福利：用户一次性送出1880张年度票、一个盛典火箭或一个凤游九天，触发直播间红包雨，掉落年度票、助力票。送出凤游九天，掉落的年度票、助力票更多。</p>
                    <p class="item">4.全站特效：一次性赠送6个凤游九天或者30个盛典火箭，触发全站特效。所有直播间都将出现送出用户和获得主播的头像和炫酷特效！</p>
                    <p class="item">5.宝箱福利：用户送出一个年度宝箱，用户可以通过输入口令，有概率领取到年度票、助力票；一次性送出宝箱数量≥100个，直播间内的用户将有机会额外获得盛典火箭哦。</p>
                    <!-- 温馨提示 -->
                    <div class="tips-wrap">
                        <p class="tip-item">温馨提示：</p>
                        <p class="tip-item">1.背包中获得的年度礼物有效期至2021年5月31日23:59:59，逾期清空，请及时送出。其中助力票不参与分成。</p>
                        <p class="tip-item">2.因活动期间，送礼量大，服务器会有一定程度的延迟，请提前10秒偷塔，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单情况，平台不予补偿，请谅解！</p>
                        <p class="tip-item">3.年度宝箱、凤游九天、全站特效及大人物音效座驾，app端请更新至V6.2.7及以上查看！</p>
                        <p class="tip-item">4.为给大家提供更好的直播体验，活动期间每日最后10分钟，全平台送出凤游九天/盛典火箭及触发全站特效无特效显示，红包雨效果不变，对您造成的困扰，请谅解！</p>
                    </div>
                </pc-scroller>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    inject: ['getContext'],
    data () {
        return {
            activityStatus: this.getContext().activityStatus,
            currentTab: 1,
            timeRange: [
                '活动时间：11.25 11:00:00 - 11.27 23:59:59。',
                '活动时间：11.28 00:00:00 - 11.30 23:59:59。',
                '报名时间：12.1 00:00:00 - 12.2 19:59:59。',
                '活动时间：12.3 00:00:00 - 12.5 23:59:59。',
                '活动时间：12.6 00:00:00 - 12.13 23:59:59。',
                '活动时间：12.14 00:00:00 - 12.15 23:59:59。'
            ],
            ruleGift: [
                { pic: 'gift-ndp', name: '年度票', price: '10', score: '1' },
                { pic: 'gift-sdhj', name: '盛典火箭', price: '18800', score: '1880' },
                { pic: 'gift-ndbx', name: '年度宝箱', price: '20000', score: '2000' },
                { pic: 'gift-fwjt', name: '凤游九天', price: '93600', score: '9360' },
                { pic: 'gift-zlp', name: '助力票', price: '10', score: '1' }
            ]
        }
    },
    updated () {
        this.pageType === 'pc' && this.$refs['rule-scroller'] && this.$refs['rule-scroller'].refreshDOM()
    },
    created () {
        this.currentTab = [0, -1].includes(this.activityStatus) ? 1 : this.activityStatus
    },
    methods: {
        // 切换tab
        changeTab (activityStatus) {
            this.currentTab = activityStatus
        },
        // 关闭弹窗
        closeRulePopup () {
            this.$emit('close-rule-popup')
        }
    }
}
</script>
