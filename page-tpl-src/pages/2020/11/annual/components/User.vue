<template>
    <div class="module-user">
        <div class="title user-sprite-s title-user">大人物榜</div>
        <div class="user-container">
            <div class="task-list" v-if="taskInfo">
                <div class="task-item">
                    <div class="task-img user-sprite-s ticket"></div>
                    <div class="task-con">
                        <p class="txt-con">{{ taskInfo.first===2?1:0 }}/1 &ensp;今日首次进入直播间 </p>
                        <span :class="['btn-get', 'user-sprite-s', taskInfo.first===2?'get-gray':'get-normal']" @click="getCard(1)"></span>
                    </div>
                </div>
                <div class="task-item">
                    <div class="task-img user-sprite-s ticket"></div>
                    <div class="task-con">
                        <p class="txt-con">{{ taskInfo.received }}/{{ taskInfo.cumulate_total }} &ensp;今日累计观看直播{{ taskInfo.watch_time }}分钟</p>
                        <span :class="['btn-get', 'user-sprite-s', taskInfo.received===5?'get-gray':'get-normal']" @click="getCard(2)"></span>
                    </div>
                    <i class="tip-icon com-sprite-s question" @click="showTip"></i>
                </div>
            </div>
            <div class="list-head">
                <p>排名</p>
                <p>用户</p>
                <p>贡献荣耀值</p>
            </div>
            <div class="list-con">
                <div class="list-item" v-for="(item, index) in rankList" :key="index">
                    <span class="order">{{ index + 1 }}</span>
                    <div class="avatar">
                        <img :src="item.headPic" alt="">
                    </div>
                    <div class="name-logo">
                        <div class="name">
                            <p class="txt-of">{{ item.nickname }}</p>
                            <span :class="['level_icon', 'u_level_icon_'+item.level]"></span>
                        </div>
                        <div class="logo" :class="'xz-'+gifXZ[index]"></div>
                    </div>
                    <div class="val txt-of">{{ item.score }}</div>
                </div>
            </div>
            <p class="list-footer">仅展示TOP10大人物</p>
            <div class="self-container" v-if="isLogin && rankCenter">
                <div class="block block-1">
                    <div class="avatar" :class="'xz-'+gifXZ[rankCenter.rank-1]">
                        <img :src="rankCenter.headPic" alt="">
                    </div>
                    <div class="name">
                        <p class="txt-of">{{ rankCenter.nickname }}</p>
                        <span :class="['level_icon', 'u_level_icon_'+rankCenter.level]"></span>
                    </div>
                    <div v-if="rankCenter.rank!=='未上榜'" class="logo" :class="'xz-'+gifXZ[rankCenter.rank-1]"></div>
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
            taskInfo: null,
            rankList: [],
            rankCenter: null,
            gifXZ: ['zz', 'gw', 'qw', 'gggj', 'hj', 'bj', 'xgzj', 'nj', 'xj', 'js']
        }
    },
    computed: {
        isLogin () {
            return this.getContext().isLogin
        },
        activityStatus () {
            return this.getContext().activityStatus
        }
    },
    created () {
        console.log('pingtai>>>', this.pageType, this.activityStatus)
        this.getTaskInfo()
        this.getRankData()
    },
    methods: {
        // 任务信息
        getTaskInfo () {
            this.$axios.get('/Anniversary2020/userTickets').then(res => {
                if (res.data.errno === 0) {
                    this.taskInfo = res.data.data
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            })
        },
        // 领取票
        getCard (type) {
            if (!this.isLogin) {
                this.goLogin()
            }
            if (!this.taskInfo.isAvailableTime || this.activityStatus === -1) {
                this.$toast.show('活动已结束~')
                return
            }
            this.$axios.get('/Anniversary2020/getTicket', {
                params: {
                    type: type
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    this.getTaskInfo()
                    this.refreshBackpack && this.refreshBackpack()
                }
                this.$toast.show(res.data.msg)
            }).catch(err => {
                console.error(err)
            })
        },
        // 提示
        showTip () {
            this.$toast.show('年度期间首次进入直播间以及观看直播赠送助力票，仅当日有效，次日清零。')
        },
        // 获取榜单数据
        getRankData () {
            this.$loading && this.$loading.show()
            this.$axios.get('/Anniversary2020/userTotalRanks').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    const createList = []
                    const len = resData.ranks.length
                    if (len < 10) {
                        for (let i = len; i < 10; i++) {
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
        }
    }
}
</script>
