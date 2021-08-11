<template>
    <div class="module-hi">
        <div class="tab-container">
            <div class="tab-item hi-tab-s" :class="currentTab==='qq'?'qq-normal':'qq-gray'" @click="changeTab('qq')"></div>
            <div class="tab-item hi-tab-s" :class="currentTab==='jl'?'jl-normal':'jl-gray'" @click="changeTab('jl')"></div>
            <div class="tab-item hi-tab-s" :class="currentTab==='hr'?'hr-noraml':'hr-gray'" @click="changeTab('hr')"></div>
        </div>
        <div class="rank-container">
            <div class="rank-tip" v-if="currentTab==='qq'">
                <div class="tip-head">年度全勤奖</div>
                <p>1.年度期间，累计开播时长前三名的主播，可分别获得99999{{ giftPer }}、88888{{ giftPer }}、66666{{ giftPer }}奖励，于年度结束后的7-15个工作日内发放。</p>
                <p>2.期间若有不出镜等挂机行为，官方有权取消其成绩！</p>
            </div>
            <div class="rank-tip" v-if="currentTab==='jl'">
                <div class="tip-head">年度锦鲤</div>
                <p>1.年度期间，所有获得锦鲤的主播，将于年度结束后，按其拥有的锦鲤数比例瓜分200w{{ giftPer }}。</p>
                <p>2.晋级至预选赛的主播均可获得锦鲤，每次晋级均可获得大量锦鲤奖励，详见活动规则说明。</p>
                <p>3.锦鲤非活动礼物，仅用于本玩法中瓜分克拉，获得的数量可在下方榜单查看。</p>
            </div>
            <div class="rank-tip" v-if="currentTab==='hr'">
                <div class="tip-head">用户玩法</div>
                <p>1.用户通过刷礼、观看直播、发言获得活跃度，每日23:59:59活跃度最高的前三名用户，分别获得1000、800、600张助力票，及“活跃红人”勋章（24小时）<i class="com-sprite-s question" @click="showTip"></i></p>
                <p>2.每日活跃度清零，奖励于次日零点下发至用户背包。</p>
            </div>
            <div class="list-head">
                <p>排名</p>
                <p>{{ currentTab !== 'hr' ? '主播' : '用户' }}</p>
                <p>{{ currentTab === 'qq' ? '直播时长' : (currentTab === 'jl' ? '锦鲤数' : '活跃度') }}</p>
            </div>
            <div class="list-con">
                <div class="list-item" v-for="(item, index) in rankList" :key="index">
                    <span class="order">{{ index + 1 }}</span>
                    <div class="avatar" @click="redirectRoom(item)">
                        <span class="com-sprite-s live" v-if="item.isPlaying && currentTab !== 'hr'"></span>
                        <img :src="item.headPic" alt="">
                    </div>
                    <div class="name">
                        <p class="txt-of">{{ item.nickname }}</p>
                        <span :class="['level_icon', (currentTab !== 'hr'?'m':'u')+'_level_icon_'+item.level]"></span>
                    </div>
                    <div class="val txt-of">{{ item.score }}</div>
                </div>
            </div>
            <p class="list-footer">仅展示前{{ currentTab==='hr'?'5位用户':'10位主播' }}</p>
            <div class="self-container" v-if="isLogin && rankCenter && (isMod || currentTab === 'hr')">
                <div class="block block-1">
                    <div class="avatar">
                        <img :src="rankCenter.headPic" alt="">
                    </div>
                    <div class="name">
                        <p class="txt-of">{{ rankCenter.nickname }}</p>
                        <span :class="['level_icon', (currentTab !== 'hr'?'m':'u')+'_level_icon_'+rankCenter.level]"></span>
                    </div>
                </div>
                <div class="block block-2">
                    <p>{{ rankCenter.pairInfos[0].name }}：{{ rankCenter.pairInfos[0].value }}</p>
                    <p>{{ rankCenter.pairInfos[1].name.replace('克拉', giftPer) }}：{{ rankCenter.pairInfos[1].value }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['getContext'],
    data () {
        return {
            currentTab: 'qq', // qq全勤 jl锦鲤 hr红人
            rankList: [],
            rankCenter: null
        }
    },
    computed: {
        isLogin () {
            return this.getContext().isLogin
        },
        isMod () {
            return this.getContext().isMod
        },
        activityStatus () {
            return this.getContext().activityStatus
        }
    },
    created () {
        this.getRankData()
    },
    methods: {
        // 切换tab
        changeTab (type) {
            if (this.currentTab === type) {
                return
            }
            this.currentTab = type
            this.getRankData()
        },
        // 获取榜单数据
        getRankData () {
            this.$loading && this.$loading.show()
            let path = ''
            let defualtLength = 10
            if (this.currentTab === 'qq') {
                path = '/anniversary2020/liveTimeRanks'
            } else if (this.currentTab === 'jl') {
                path = '/anniversary2020/jinliRanks'
            } else {
                path = '/anniversary2020/activationRanks'
                defualtLength = 5
            }
            this.$axios.get(path, {
                // params: {
                //     page: 1,
                //     pageRows: 10
                // }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    const len = resData.ranks.length
                    if (len < defualtLength) {
                        for (let i = len; i < defualtLength; i++) {
                            createList.push({
                                headPic: require('../images/xwyd.png'),
                                nickname: '虚位以待',
                                score: '--'
                            })
                        }
                    }
                    this.rankList = resData.ranks.concat(createList)
                    this.rankCenter = resData.myRank
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.$loading && this.$loading.hide()
            })
        },
        // 红人问号tip
        showTip () {
            this.$toast.show(`观看1分钟增加10活跃度、发言1次增加2活跃度；每送礼1${this.giftPer}年度礼物，增加1活跃度（其中每日送礼获得活跃度上限为1000、观看直播为1800）；12月15日为活动最后一天，前三名只下发勋章奖励`, true)
        },
        // 跳转直播间
        redirectRoom (info) {
            if (this.currentTab !== 'hr') {
                this.goRoom(info)
            }
        }
    }
}
</script>
