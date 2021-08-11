<template>
    <div class="module-jjs">
        <div class="tab-container">
            <div class="tab competition-jjs-s" :class="categoryTab===1?'rq-normal':'rq-gray'" @click="changeCategoryTab(1)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===2?'tl-normal':'tl-gray'" @click="changeCategoryTab(2)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===3?'fy-normal':'fy-gray'" @click="changeCategoryTab(3)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===4?'ox-normal':'ox-gray'" @click="changeCategoryTab(4)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===5?'yl-normal':'yl-gray'" @click="changeCategoryTab(5)"></div>
        </div>
        <div class="list-container">
            <div class="tab-date">
                <div class="tab competition-jjs-s" :class="currentDate===9?'fromnto15-normal':'fromnto15-gray'" @click="changeDateTab(9)"></div>
                <div class="tab competition-jjs-s" :class="currentDate===10?'from15to10-normal':'from15to10-gray'" @click="changeDateTab(10)"></div>
                <div class="tab competition-jjs-s" :class="currentDate===11?'from10to8-normal':'from10to8-gray'" @click="changeDateTab(11)"></div>
            </div>
            <div class="list-head">
                <p>排名</p>
                <p>主播</p>
                <p>荣耀值</p>
            </div>
            <div class="list-con">
                <pc-scroller class="rank-scroller" ref="rank-scroller" thumb-color="rgba(255, 255, 255, 0.3)">
                    <div class="list-item" v-for="(item, index) in rankList" :key="index">
                        <div class="item-con">
                            <span class="order">{{ index + 1 }}</span>
                            <div class="avatar" @click="goRoom(item)">
                                <span class="live com-sprite-s" v-if="item.isPlaying"></span>
                                <img :src="item.headPic" alt="">
                            </div>
                            <div class="name">
                                <p class="txt-of">{{ item.nickname }}</p>
                                <span :class="['level_icon', 'm_level_icon_'+item.level]"></span>
                            </div>
                            <div class="val txt-of">{{ item.score }}</div>
                        </div>
                        <p class="out-tip" v-if="index===[14, 9, 7][currentDate-9]">{{ [3, 4, 5][currentDate-9] }}日23:59:59结算时，以下将被淘汰</p>
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
            categoryTab: 1,
            currentDate: 9,
            rankList: [],
            rankCenter: null
        }
    },
    computed: {
        stage () {
            return this.getContext().stage
        }
    },
    updated () {
        this.pageType === 'pc' && this.$refs['rank-scroller'] && this.$refs['rank-scroller'].refreshDOM()
    },
    created () {
        this.currentDate = this.stage > 11 ? 11 : this.stage
        this.getRankData()
    },
    methods: {
        // 五个赛道tab切换
        changeCategoryTab (type) {
            if (type === this.categoryTab) {
                return
            }
            this.categoryTab = type
            this.getRankData()
        },
        // 日期切换
        changeDateTab (date) {
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
                    stage: this.currentDate >= 11 ? 11 : this.currentDate,
                    group: this.categoryTab,
                    page: 0,
                    pageRows: [25, 15, 10][this.currentDate - 9]
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    this.rankList = resData.ranks
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
