<template>
    <div class="module-hxs">
        <div class="rank-tip">海选赛期间，荣耀值达10000即可晋级</div>
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
                        <span class="com-sprite-s live" v-if="item.isPlaying"></span>
                        <img :src="item.headPic" alt="">
                        <span class="icon-advance" v-if="item.score >= 10000"></span>
                    </div>
                    <div class="name">
                        <p class="txt-of">{{ item.nickname }}</p>
                        <span :class="['level_icon', 'm_level_icon_'+item.level]"></span>
                    </div>
                    <div class="val txt-of">{{ item.score }}</div>
                </div>
            </pc-scroller>
        </div>
        <p class="list-footer">仅展示前100位主播</p>
        <div class="self-container" v-if="isLogin &&isMod && rankCenter">
            <div class="block block-1">
                <div class="avatar">
                    <img :src="rankCenter.headPic" alt="">
                    <span class="icon-advance" v-if="rankCenter.pairInfos[0].value >= 10000"></span>
                </div>
                <div class="name">
                    <p class="txt-of">{{ rankCenter.nickname }}</p>
                    <span :class="['level_icon', 'm_level_icon_'+rankCenter.level]"></span>
                </div>
            </div>
            <div class="block block-2">
                <p>{{ rankCenter.pairInfos[0].name }}：{{ rankCenter.pairInfos[0].value }}</p>
                <p>{{ rankCenter.pairInfos[1].name }}：{{ rankCenter.pairInfos[1].value }}</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    inject: ['getContext'],
    data () {
        return {
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
        this.getRankData()
    },
    methods: {
        // 获取榜单数据
        getRankData () {
            this.$loading && this.$loading.show()
            this.$axios.get('/Anniversary2020/modRanks', {
                params: {
                    stage: this.stage >= 3 ? 3 : this.stage,
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
        }
    }
}
</script>
