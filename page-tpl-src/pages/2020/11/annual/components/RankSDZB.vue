<template>
    <div class="module-sdzb">
        <div class="tab-container">
            <div class="tab competition-jjs-s" :class="categoryTab===1?'rq-normal':'rq-gray'" @click="changeCategoryTab(1)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===2?'tl-normal':'tl-gray'" @click="changeCategoryTab(2)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===3?'fy-normal':'fy-gray'" @click="changeCategoryTab(3)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===4?'ox-normal':'ox-gray'" @click="changeCategoryTab(4)"></div>
            <div class="tab competition-jjs-s" :class="categoryTab===5?'yl-normal':'yl-gray'" @click="changeCategoryTab(5)"></div>
        </div>
        <div class="pk-container">
            <div class="tab-date">
                <div class="tab competition-sdzb-s" :class="currentTab==='pk'?'tab-pk-normal':'tab-pk-gray'" @click="changeCurrentTab('pk')"></div>
                <div class="tab competition-sdzb-s" :class="currentTab==='zb'?'tab-sdzb-normal':'tab-sdzb-gray'" @click="changeCurrentTab('zb')"></div>
            </div>
            <!-- 单循环比拼赛 -->
            <div v-if="currentTab==='pk'">
                <div class="rank-tip">
                    <div class="tip-head">单循环比拼赛</div>
                    <p>1.所有主播按12月5日的排名进行为期7天的单循环比拼赛，每日比拼赛道内一名主播，以当日荣耀值定胜负，荣耀值若有相同，则按先到先得定胜负。</p>
                    <p>2.每日最后10分钟，主播荣耀值隐藏，仅主播及为主播贡献荣耀值最高的用户可见主播荣耀值。</p>
                    <p>3.每日比拼获胜的主播+3积分，失败的主播+1积分。</p>
                    <p>4.积分榜按积分排序，积分若有相同，则按12.6-12.12期间主播总荣耀值排名，此时若荣耀值相同，则按先到先得排名。</p>
                    <p>5.12日结算时，积分榜前四名主播进入最终的赛道争霸，于13日决出赛道冠亚季军。</p>
                    <p>6.12月6日00:00 - 00:05分为分组时间，期间主播收到任意年度礼物不计荣耀值。</p>
                </div>
                <div class="tab-round">
                    <div class="tab competition-sdzb-s" :class="currentDate===12?'round1-normal':'round1-gray'" @click="changeDateTab(12)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===13?'round2-normal':'round2-gray'" @click="changeDateTab(13)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===14?'round3-normal':'round3-gray'" @click="changeDateTab(14)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===15?'round4-normal':'round4-gray'" @click="changeDateTab(15)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===16?'round5-normal':'round5-gray'" @click="changeDateTab(16)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===17?'round6-normal':'round6-gray'" @click="changeDateTab(17)"></div>
                    <div class="tab competition-sdzb-s" :class="currentDate===18?'round7-normal':'round7-gray'" @click="changeDateTab(18)"></div>
                </div>
                <div class="group-tip" v-show="!pkList.length">00:00 - 00:05为分组时间<br>期间主播榜单不记数据</div>
                <div class="hide-tip competition-sdzb-s logo-hide" v-show="hideRank"></div>
                <div class="list-pk" v-show="pkList.length">
                    <div class="pk-item" v-for="(item, index) in pkList" :key="index+'_'+Math.random()">
                        <div class="progress-bar">
                            <!-- <div class="left-bar" :style="{width: (item.toScore / (Number(item.fromScore) + Number(item.toScore)) * 100) + '%'}"></div> -->
                            <div class="left-bar" :style="{width: calcPkWidth(item, 'left')}"></div>
                            <div class="vs-icon"></div>
                            <!-- <div class="right-bar" :style="{width: (item.fromScore / (Number(item.fromScore) + Number(item.toScore)) * 100) + '%'}"></div> -->
                            <div class="right-bar" :style="{width: calcPkWidth(item, 'right')}"></div>
                        </div>
                        <div class="pk-con">
                            <div class="pk-info left-block">
                                <i class="left-icon competition-sdzb-s" :class="item.status===0?'':(item.winner===item.toMid?'win':'lose')"></i>
                                <p class="left-score score">{{ item.isHide ? item.showToScore : item.toScore }}</p>
                                <div class="avatar" @click="goRoom({'rid':item.toRid, 'mid': item.toMid})">
                                    <span class="com-sprite-s live" v-if="item.toIsPlaying"></span>
                                    <img :src="item.toHeadPic" alt="">
                                </div>
                                <div class="name txt-of">{{ item.toName }}</div>
                            </div>
                            <div class="pk-info right-block">
                                <i class="right-icon competition-sdzb-s" :class="item.status===0?'':(item.winner===item.fromMid?'win':'lose')"></i>
                                <p class="right-score score">{{ item.isHide ? item.showFromScore : item.fromScore }}</p>
                                <div class="avatar" @click="goRoom({'rid':item.fromRid, 'mid': item.fromMid})">
                                    <span class="com-sprite-s live" v-if="item.fromIsPlaying"></span>
                                    <img :src="item.fromHeadPic" alt="">
                                </div>
                                <div class="name txt-of">{{ item.fromName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 赛道争霸 -->
            <div v-if="currentTab==='zb'">
                <div class="rank-tip">
                    <div class="tip-head">赛道争霸</div>
                    <p>1.所有主播按12月13日荣耀值排名，决出赛道内冠亚季军。</p>
                    <p>2.若年度最佳主播出现在该赛道，则该赛道内2-4名主播名次进1。</p>
                    <p>3.赛道冠军可带13日自身荣耀值50%的分数进入超级冠军赛14日的比拼。</p>
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
                                <div class="logo" :style="getXZStyle(index)" v-if="index<3"></div>
                            </div>
                            <div class="val txt-of">{{ item.score }}</div>
                        </div>
                        <p class="out-tip" v-if="index===1">若超级冠军-年度最佳主播出现在{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}赛道，则第二名主播晋级为{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}冠军</p>
                        <p class="out-tip" v-if="index===2">若超级冠军-年度最佳主播出现在{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}赛道，则第三名主播晋级为{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}亚军</p>
                        <p class="out-tip" v-if="index===3">若超级冠军-年度最佳主播出现在{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}赛道，则第四名主播晋级为{{ ['人气','天籁','风云','偶像','娱乐'][categoryTab-1] }}季军</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="currentTab==='pk' && scoreList.length">
            <div class="title competition-sdzb-s title-jfb"></div>
            <div class="list-container">
                <div class="list-head">
                    <p>排名</p>
                    <p>主播</p>
                    <p>荣耀值</p>
                    <p>积分</p>
                </div>
                <div class="list-con">
                    <div class="list-item" v-for="(item, index) in scoreList" :key="index">
                        <div class="item-con">
                            <span class="order">{{ index + 1 }}</span>
                            <div class="avatar" @click="goRoom(item)">
                                <span class="live com-sprite-s" v-if="item.isPlaying"></span>
                                <img :src="item.headPic" alt="">
                                <span class="icon-advance" v-if="index < 4 && stage >= 19"></span>
                            </div>
                            <div class="name">
                                <p class="txt-of">{{ item.nickname }}</p>
                                <span :class="['level_icon', 'm_level_icon_'+item.level]"></span>
                            </div>
                            <div class="val txt-of">{{ item.pkScore }}</div>
                            <div class="scroe txt-of">{{ item.score }}</div>
                        </div>
                        <p class="out-tip" v-if="index===3">{{ stage > 18 ? '以下已被淘汰' : '12日23:59:59结算时，以下将被淘汰' }}</p>
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
            categoryTab: 1,
            currentTab: 'pk',
            currentDate: 12,
            hideRank: false,
            pkList: [],
            scoreList: [],
            rankList: []
        }
    },
    computed: {
        stage () {
            return this.getContext().stage
        }
    },
    created () {
        this.currentTab = this.stage >= 19 ? 'zb' : 'pk'
        this.currentDate = this.stage >= 19 ? 19 : this.stage
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
        // 循环pK、赛道争霸tab切换
        changeCurrentTab (type) {
            if (type === this.currentTab || this.stage < 19) {
                return
            }
            this.currentTab = type
            this.currentDate = (this.currentDate >= 18 && type === 'pk') ? 18 : 19
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
        // 获取PK榜单数据
        getRankData () {
            this.$loading && this.$loading.show()
            this.$axios.get('/Anniversary2020/modRanks', {
                params: {
                    stage: this.currentDate >= 19 ? 19 : this.currentDate,
                    group: this.categoryTab
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    if (this.currentTab === 'pk') {
                        const { pkRanks, ranks } = res.data.data
                        this.pkList = pkRanks.map((item, index) => {
                            return {
                                ...item,
                                fromScore: item.isHide ? 0 : item.fromScore,
                                toScore: item.isHide ? 0 : item.toScore,
                                showFromScore: item.fromScore, // 增加两个变量在隐榜时自己和第一用户可以看
                                showToScore: item.toScore
                            }
                        })
                        this.hideRank = pkRanks.some(item => {
                            return item.isHide === true
                        })
                        // console.log(this.pkList, this.hideRank)
                        this.scoreList = ranks
                    } else {
                        this.rankList = res.data.data.ranks
                    }
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.$loading && this.$loading.hide()
            })
        },
        // 计算pk条宽度
        calcPkWidth (info, type) {
            const leftScore = info.toScore
            const rightScore = info.fromScore
            const totalScore = info.fromScore + info.toScore
            if (totalScore === 0) {
                return type === 'left' ? '50%' : '50%'
            } else if (totalScore > 0) {
                if (leftScore === 0 || (rightScore / totalScore > 0.95)) {
                    return type === 'left' ? '5%' : '95%'
                } else if (rightScore === 0 || (leftScore / totalScore > 0.95)) {
                    return type === 'left' ? '95%' : '5%'
                } else {
                    return type === 'left' ? leftScore / totalScore * 100 + '%' : rightScore / totalScore * 100 + '%'
                }
            }
        },
        // 设置xz样式
        getXZStyle (rank) {
            return {
                background: 'url(' + require(`../images/mod-xz/xz-${['rq', 'tl', 'fy', 'ox', 'yl'][this.categoryTab - 1]}-${rank + 1}.gif`) + ') no-repeat center / 100% 100%'
            }
        }
    }
}
</script>
