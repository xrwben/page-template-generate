<template>
    <div class="module-cjgjs">
        <div class="title competition-cjgjs-s title-cjgjb"></div>
        <div class="list-container">
            <div class="tab-date">
                <div class="tab competition-cjgjs-s" :class="currentDate===20?'from6to3-normal':'from6to3-gray'" @click="changeDateTab(20)"></div>
                <div class="tab competition-cjgjs-s" :class="currentDate===21?'to3q-normal':'to3q-gray'" @click="changeDateTab(21)"></div>
            </div>
            <div class="list-head">
                <p>排名</p>
                <p>主播</p>
                <p>荣耀值</p>
            </div>
            <div class="list-con">
                <div class="list-item" v-for="(item, index) in rankList" :key="index">
                    <div class="item-con">
                        <span class="order">{{ index + 1 }}</span>
                        <div class="avatar" @click="goRoom(item)">
                            <span class="live com-sprite-s" v-if="item.isPlaying"></span>
                            <img :src="item.headPic" alt="">
                        </div>
                        <div class="name-logo">
                            <div class="name">
                                <p class="txt-of">{{ item.nickname }}</p>
                                <span :class="['level_icon', 'm_level_icon_'+item.level]"></span>
                            </div>
                            <div class="logo gif-xz-zj" v-if="index===0 && currentDate===21"></div>
                        </div>
                        <div class="val txt-of">{{ item.score }}</div>
                    </div>
                    <p class="out-tip" v-if="index===2 && currentDate===20">{{ stage > 20 ? '以下已被淘汰' : '14日23:59:59结算时，以下将被淘汰' }}</p>
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
            currentDate: 20,
            rankList: []
        }
    },
    computed: {
        stage () {
            return this.getContext().stage
        }
    },
    created () {
        this.currentDate = this.stage >= 21 ? 21 : this.stage
        this.getRankData()
    },
    methods: {
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
            this.$axios.get('/Anniversary2020/modRanks', {
                params: {
                    stage: this.currentTab >= 21 ? 21 : this.currentDate
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    this.rankList = res.data.data.ranks
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
