<template>
    <div class="module-yxs">
        <div class="tab-container">
            <div class="tab competition-yxs-s" :class="currentTab==='rb'?'rb-normal':'rb-gray'" @click="changeTypeTab('rb')"></div>
            <div class="tab competition-yxs-s" :class="currentTab==='yxsb'?'yxsb-normal':'yxsb-gray'" @click="changeTypeTab('yxsb')"></div>
        </div>
        <div class="list-container">
            <div class="tab-date" v-if="currentTab==='rb'">
                <div class="tab competition-yxs-s" :class="currentDate===4?'d1128-normal':'d1128-gray'" @click="changeDateTab(4)"></div>
                <div class="tab competition-yxs-s" :class="currentDate===5?'d1129-normal':'d1129-gray'" @click="changeDateTab(5)"></div>
                <div class="tab competition-yxs-s" :class="currentDate===6?'d1130-normal':'d1130-gray'" @click="changeDateTab(6)"></div>
            </div>
            <div class="list-head">
                <p>排名</p>
                <p>主播</p>
                <p>荣耀值</p>
            </div>
            <div class="list-con">
                <pc-scroller class="rank-scroller" ref="rank-scroller" thumb-color="rgba(255, 255, 255, 0.3)">
                    <div class="list-item" v-for="(item, index) in rankList" :key="index">
                        <span class="order">{{ index + 1 }}</span>
                        <div class="avatar" @click="goRoom(item)">
                            <span class="live com-sprite-s" v-if="item.isPlaying"></span>
                            <img :src="item.headPic" alt="">
                        </div>
                        <div class="name-award">
                            <div class="name">
                                <p class="txt-of">{{ item.nickname }}</p>
                                <span :class="['level_icon', 'm_level_icon_'+item.level]"></span>
                            </div>
                            <div class="award txt-of" v-if="currentTab==='rb' && index < 5">{{ [28, 29, 30][currentDate-4] }}日结算时奖励{{ [20000, 15000, 10000, 5000, 5000][index] }}荣耀值</div>
                        </div>
                        <div class="val txt-of">{{ item.score }}</div>
                    </div>
                </pc-scroller>
            </div>
            <p class="list-footer">{{ currentTab === 'rb' ? '仅展示前100位主播' : '30日结算时以上100名主播晋级' }}</p>
            <div class="self-container" v-if="isLogin && isMod && rankCenter">
                <div class="block block-1">
                    <div class="avatar">
                        <img :src="rankCenter.headPic" alt="">
                    </div>
                    <div class="name">
                        <p class="txt-of">{{ rankCenter.nickname }}</p>
                        <span :class="['level_icon', 'm_level_icon_'+rankCenter.level]"></span>
                    </div>
                </div>
                <div class="block block-2">
                    <div class="t-l">
                        <span>{{ rankCenter.pairInfos[0].name }}</span>
                        <p>{{ rankCenter.pairInfos[0].value }}</p>
                    </div>
                    <div class="b-l">
                        <span>{{ rankCenter.pairInfos[1].name }}</span>
                        <p>{{ rankCenter.pairInfos[1].value }}</p>
                    </div>
                </div>
                <div class="block block-3">
                    <div class="t-r">
                        <span>{{ rankCenter.pairInfos[2].name }}</span>
                        <p>{{ rankCenter.pairInfos[2].value }}</p>
                    </div>
                    <div class="b-r">
                        <span>{{ rankCenter.pairInfos[3].name }}</span>
                        <p>{{ rankCenter.pairInfos[3].value }}</p>
                    </div>
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
            currentTab: 'rb',
            currentDate: 1,
            rankList: [],
            rankCenter: null
        }
    },
    computed: {
        activityStatus () {
            return this.getContext().activityStatus
        },
        stage () {
            return this.getContext().stage
        },
        isLogin () {
            return this.getContext().isLogin
        },
        isMod () {
            return this.getContext().isMod
        }
    },
    updated () {
        this.pageType === 'pc' && this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
    },
    created () {
        // console.log('pingtai>>>', this.pageType, this.isMod, this.activityStatus, this.stage)
        this.currentTab = this.stage > 6 ? 'yxsb' : 'rb'
        this.currentDate = this.stage > 6 ? 6 : this.stage
        this.getRankData()
    },
    methods: {
        // 日榜或预选赛榜切换
        changeTypeTab (type) {
            if (type === this.currentTab) {
                return
            }
            this.currentTab = type
            this.getRankData()
        },
        // 日期切换
        changeDateTab (date) {
            console.log(date, this.stage)
            if (date === this.currentDate || date > this.stage) {
                return
            }
            this.currentDate = date
            this.getRankData()
        },
        // 获取榜单数据
        getRankData () {
            this.$loading && this.$loading.show()
            this.resetRankScroller()
            this.$axios.get('/Anniversary2020/modRanks', {
                params: {
                    stage: this.currentTab === 'yxsb' ? 456 : this.currentDate,
                    page: 0,
                    pageRows: 100
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    const len = resData.ranks.length
                    if (len < 100) {
                        for (let i = len; i < 100; i++) {
                            createList.push({
                                isPlaying: false,
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
        resetRankScroller () {
            if (this.pageType === 'pc') {
                this.$refs['rank-scroller'] && this.$refs['rank-scroller']._resetBox()
                this.$refs['rank-scroller'] && this.$refs['rank-scroller']._refresh()
            } else {
                if (this.$refs['rank-scroller']) {
                    this.$refs['rank-scroller'].$el.scrollTop = 0
                }
            }
        }
    }
}
</script>
