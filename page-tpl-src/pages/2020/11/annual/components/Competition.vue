<template>
    <div class="module-competition">
        <!-- 霸屏和荣耀加倍 -->
        <BP></BP>
        <!-- 赛程tab -->
        <div class="competition-tab">
            <div class="tab competition-sprite-s" :class="currentCompetition===1?'hxs-normal':'hxs-gray'" @click="changeTab(1)"></div>
            <div class="tab competition-sprite-s" :class="currentCompetition===2?'yxs-normal':'yxs-gray'" @click="changeTab(2)"></div>
            <div class="tab competition-sprite-s" :class="currentCompetition===3?'sdbm-normal':'sdbm-gray'" @click="changeTab(3)"></div>
            <div class="tab competition-sprite-s" :class="currentCompetition===4?'jjs-normal':'jjs-gray'" @click="changeTab(4)"></div>
            <div class="tab competition-sprite-s" :class="currentCompetition===5?'sdzb-normal':'sdzb-gray'" @click="changeTab(5)"></div>
            <div class="tab competition-sprite-s" :class="currentCompetition===6?'cjgjs-normal':'cjgjs-gray'" @click="changeTab(6)"></div>
        </div>
        <!-- 海选赛 -->
        <RankHXS v-if="currentCompetition===1"></RankHXS>
        <!-- 预选赛 -->
        <RankYXS v-if="currentCompetition===2"></RankYXS>
        <!-- 赛道报名 -->
        <Apply v-if="currentCompetition===3"></Apply>
        <!-- 晋级赛 -->
        <RankJJS v-if="currentCompetition===4"></RankJJS>
        <!-- 赛道争霸 -->
        <RankSDZB v-if="currentCompetition===5"></RankSDZB>
        <!-- 超级冠军赛 -->
        <RankCJGJS v-if="currentCompetition===6"></RankCJGJS>
    </div>
</template>

<script>
import BP from './BP.vue'
import RankHXS from './RankHXS.vue'
import RankYXS from './RankYXS.vue'
import Apply from './Apply.vue'
import RankJJS from './RankJJS.vue'
import RankSDZB from './RankSDZB.vue'
import RankCJGJS from './RankCJGJS.vue'

export default {
    components: {
        BP, RankHXS, RankYXS, Apply, RankJJS, RankSDZB, RankCJGJS
    },
    inject: ['getContext'],
    data () {
        return {
            currentCompetition: 2,
            tips: [
                { type: '海选赛', time: '11月25日11:00:00' },
                { type: '预选赛', time: '11月28日00:00:00' },
                { type: '赛道报名', time: '12月1日00:00:00' },
                { type: '晋级赛', time: '12月3日00:00:00' },
                { type: '赛道争霸', time: '12月6日00:00:00' },
                { type: '超级冠军赛', time: '12月14日00:00:00' }
            ]
        }
    },
    computed: {
        activityStatus () {
            return this.getContext().activityStatus
        }
    },
    watch: {
        activityStatus: {
            handler (newVal, oldVal) {
                console.log('watch>>>', newVal, oldVal)
                this.currentCompetition = this.activityStatus === -1 ? 6 : newVal
            },
            immediate: true
        }
    },
    // activityStatus因为是异步改变的 mounted时值还是初始值 所以需要watch监听改变
    // mounted () {
    //     this.currentCompetition = this.activityStatus === -1 ? 4 : this.activityStatus
    // },
    methods: {
        changeTab (type) {
            console.log(type, this.activityStatus)
            if (type === this.currentCompetition) {
                return
            }
            if (type > this.activityStatus && this.activityStatus !== -1) {
                this.$toast.show(`${this.tips[type - 1].type} 开始时间为${this.tips[type - 1].time}~`)
                return
            }
            this.currentCompetition = type
        }
    }
}
</script>
