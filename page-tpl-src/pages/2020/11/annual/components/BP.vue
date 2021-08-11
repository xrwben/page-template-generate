<template>
    <div class="module-bp-glory">
        <!-- 霸屏 -->
        <div class="module-bp">
            <div class="title competition-sprite-s title-bp"></div>
            <div class="bp-container">
                <div class="btn-bp-rule competition-sprite-s bp-rule" @click="showBpPopup=true"></div>
                <div class="now-block">
                    <div class="sub-title bp-now">正在霸屏 <span ref="countdown" class="countdown"></span></div>
                    <div class="now-con">
                        <div class="activeing-group" v-if="activityStatus!==0 && activityStatus!==-1">
                            <div class="now-list-con" v-if="nowHoldScreenData">
                                <div class="hold-list-item">
                                    <div class="item-1">
                                        <img :src="nowHoldScreenData.userHeadPic" alt="">
                                    </div>
                                    <div class="item-2">
                                        <p class="name txt-of">{{ nowHoldScreenData.userName }}</p>
                                        <div class="icon">送给</div>
                                    </div>
                                    <div class="item-3" @click="goRoom(nowHoldScreenData)">
                                        <img :src="nowHoldScreenData.modHeadPic" alt="">
                                    </div>
                                    <div class="item-4">
                                        <p class="name txt-of">{{ nowHoldScreenData.modName }}</p>
                                    </div>
                                    <div class="item-5">
                                        <img :src="nowHoldScreenData.icon" alt="">
                                    </div>
                                    <div class="item-6">
                                        <p class="gift txt-of">{{ nowHoldScreenData.giftName.split(',')[0] }}</p>
                                        <p class="price txt-of">{{ nowHoldScreenData.giftName.split(',')[1] }}</p>
                                    </div>
                                </div>
                                <div class="bp-tip-now txt-of">tip：一次性赠送年度礼物价值高于当前霸屏礼物即可抢占当前霸屏位。</div>
                            </div>
                            <p v-else class="bp-tip">一次性送出价值≥52000{{ giftPer }}的年度礼物，即可与主播一起抢占全站直播间霸屏位。</p>
                        </div>
                        <div class="actived-group" v-else>
                            <p class="bp-tip">{{ activityStatus===0?'活动未开始~':'活动已结束~' }}</p>
                        </div>
                    </div>
                </div>
                <div class="history-block">
                    <div class="sub-title his-title sprite-icon-s bp-history">历史霸屏</div>
                    <div class="his-con scroll-up-wrapper">
                        <div class="bp-tip-his" v-if="!hisHoldScreenList.length">快去霸屏，享受全站瞩目！</div>
                        <div class="hold-list-con history-rollup-holdscreen scroll-up-container" v-else>
                            <div class="hold-list-item" v-for="(item, index) in hisHoldScreenList" :key="index">
                                <div class="item-1">
                                    <img :src="item.userHeadPic" alt="">
                                </div>
                                <div class="item-2">
                                    <p class="name txt-of">{{ item.userName }}</p>
                                    <div class="icon sprite-icon-s give">送给</div>
                                </div>
                                <div class="item-3">
                                    <img :src="item.modHeadPic" alt="">
                                </div>
                                <div class="item-4">
                                    <p class="name txt-of">{{ item.modName }}</p>
                                </div>
                                <div class="item-5">
                                    <img :src="item.icon" alt="">
                                </div>
                                <div class="item-6">
                                    <p class="gift txt-of">{{ item.giftName.split(',')[0] }}</p>
                                    <p class="price txt-of">{{ item.giftName.split(',')[1] }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bp-rule-popup" v-if="showBpPopup">
                <div class="rule-container">
                    <i class="close com-sprite-s" @click="showBpPopup=false">关闭</i>
                    <div class="content">
                        <p>1. 活动期间，用户一次性送出价值≥52000{{ giftPer }}的年度礼物，即可与主播一起抢占全站直播间霸屏位，享受全站瞩目。点击霸屏位，即可跳转至当前霸屏主播直播间。</p>
                        <p>2. 霸屏位展示5分钟，在此期间，一次性赠送年度礼物价值高于当前霸屏礼物即可抢占当前霸屏位。</p>
                        <p>3. 霸屏5分钟结束后，最先一次性赠送价值≥52000{{ giftPer }}的年度礼物可抢占霸屏位。</p>
                        <p>4. 霸屏主播在霸屏期间因违反平台公约被封号、禁播，霸屏位隐藏。最先一次性赠送价值≥52000{{ giftPer }}的年度礼物抢占霸屏位。</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 荣耀加倍 -->
        <div class="module-glory" v-if="activityStatus!==-1 && activityStatus!==3 && activityStatus!==6 && stage!==19">
            <div class="title competition-sprite-s title-glory"></div>
            <div class="glory-container">
                <div class="no-tip" v-if="leftTime === -1">本小时榜暂未开启~</div>
                <div v-else>
                    <div class="time-tip">{{ leftTime }}后，以下主播获得次小时前10分钟荣耀值加成</div>
                    <div class="list-con">
                        <div class="block" v-for="(item, index) in currentHour" :key="index">
                            <div class="avatar" @click="goRoom(item)">
                                <span class="com-sprite-s live" v-if="item && item.isPlaying"></span>
                                <img v-if="item" :src="item.headPic" alt="">
                                <img v-else src="../images/xwyd.png" alt="">
                            </div>
                            <div class="name txt-of">{{ item && item.nickname || '虚位以待' }}</div>
                            <div class="score txt-of">荣耀值:{{ item && item.score || '--' }}</div>
                        </div>
                    </div>
                    <div class="self-con" v-if="isLogin && isMod && selfCenter">
                        <div class="mod-info">
                            <div class="avatar">
                                <img :src="selfCenter.headPic" alt="">
                            </div>
                            <div class="name txt-of">{{ selfCenter.nickname }}</div>
                        </div>
                        <div class="score txt-of">本小时荣耀值：{{ selfCenter.score }}</div>
                    </div>
                </div>
                <div class="time-tip time-last-tip">上一时段</div>
                <div class="list-con">
                    <div class="block" v-for="(item, index) in preHour" :key="index">
                        <div class="avatar" @click="goRoom(item)">
                            <span class="com-sprite-s live" v-if="item && item.isPlaying"></span>
                            <img v-if="item" :src="item.headPic" alt="">
                            <img v-else src="../images/xwyd.png" alt="">
                        </div>
                        <div class="order">Top{{ index + 1 }}</div>
                        <div class="name txt-of">{{ item && item.nickname || '虚位以待' }}</div>
                        <div class="score txt-of">荣耀值:{{ item && item.score || '--' }}</div>
                    </div>
                </div>
                <div class="explain-con">
                    <p>玩法说明：</p>
                    <p>1.每日10:00 - 18:59，每小时荣耀值Top1主播将于次小时前10分钟获得1.2倍荣耀值加成奖励；每日19:00 - 21:59，每小时荣耀值Top3主播将于次小时前10分钟获得1.3、1.2、1.1倍荣耀值加成奖励，该加成仅适用于主播榜单！</p>
                    <p>2.赛道报名（12.1-12.2）、赛道冠亚季军争霸赛（12.13）、超级冠军赛（12.14-12.15）该玩法关闭。</p>
                    <p>3.加成的荣耀值取整计入当前下方赛程，不计入该小时榜中。</p>
                    <p>4.未晋级至当前赛程的主播无法参与该玩法。</p>
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
            // 霸屏
            nowHoldScreenData: null,
            nowHoldScreenTimer: null,
            countdownTimer: null,
            hisHoldScreenList: [],
            animationIns: null,
            showBpPopup: false,
            // 荣耀加倍
            leftTime: '',
            timerIns: null,
            currentHour: [],
            selfCenter: null,
            preHour: []
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
    mounted () {
        this.getNowHoldScreen()
        this.getHistoryHoldScreen()
        this.getGloryData()
    },
    beforeDestroy () {
        this.nowHoldScreenTimer && clearTimeout(this.nowHoldScreenTimer)
        this.countdownTimer && clearTimeout(this.countdownTimer)
        this.animationIns && window.cancelAnimationFrame(this.animationIns)
        this.timerIns && window.clearTimeout(this.timerIns)
    },
    methods: {
        // 正在霸屏
        getNowHoldScreen () {
            this.nowHoldScreenTimer && clearTimeout(this.nowHoldScreenTimer)
            this.$axios.get('/Anniversary2020/holdScreen').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    // 当前霸屏的服务器时间不相等时说明有新的霸屏数据 然后去刷新历史霸屏和霸屏王数据
                    if (this.nowHoldScreenData && resData && this.nowHoldScreenData.holdTime !== resData.holdTime) {
                        this.getHistoryHoldScreen()
                    }
                    this.nowHoldScreenData = resData
                    // 正在霸屏倒计时
                    this.startCountDown()
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                // 未开始or结束不轮询
                if ([0, -1].includes(this.activityStatus) || this._isDestroyed) {
                    return
                }
                this.nowHoldScreenTimer = setTimeout(() => {
                    console.log('----开始轮询正在霸屏----')
                    this.getNowHoldScreen()
                }, 5000)
            })
        },
        // 霸屏倒计时
        startCountDown () {
            this.countdownTimer && clearTimeout(this.countdownTimer)
            // 霸屏数据不存在就停止倒计时
            if (!this.nowHoldScreenData) {
                this.$refs.countdown.innerText = ''
                return
            }
            const time = this.nowHoldScreenData.endTime
            if (time <= 0) {
                this.$refs.countdown.innerText = ''
                return
            }
            let minutes = Math.floor(time / 60)
            let seconds = time % 60
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            this.$refs.countdown.innerText = `${minutes}:${seconds}`
            this.countdownTimer = setTimeout(() => {
                this.nowHoldScreenData.endTime--
                this.startCountDown()
            }, 1000)
        },
        // 历史霸屏
        getHistoryHoldScreen () {
            this.$axios.get('/anniversary2020/holdRecord').then(res => {
                if (res.data.errno === 0) {
                    const resData = res.data.data
                    if (resData.length > 1) {
                        this.hisHoldScreenList = resData.concat(resData.slice(0, 1))
                        this.$nextTick(() => {
                            this.rowUpScroll()
                        })
                    } else {
                        this.hisHoldScreenList = resData
                    }
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 向上循环滚动动画
        rowUpScroll () {
            window.cancelAnimationFrame(this.animationIns)
            let run = null
            const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
            const scrollWrapperHeight = document.querySelector('.scroll-up-wrapper').getBoundingClientRect().height
            const scrollIns = document.querySelector('.scroll-up-container')
            const cHeight = scrollIns.getBoundingClientRect().height
            let sTop = scrollIns.scrollTop
            console.log('滚动容器：', scrollWrapperHeight, cHeight, sTop)
            run = () => {
                window.cancelAnimationFrame(this.animationIns)
                sTop++
                scrollIns.style.transform = `translate3d(0, -${sTop}px, 0)`
                // console.log('滚动了:', sTop, cHeight - scrollWrapperHeight)
                if (sTop >= cHeight - scrollWrapperHeight) {
                    sTop = 0
                }
                this.animationIns = requestAnimationFrame(run)
            }
            this.animationIns = requestAnimationFrame(run)
        },
        // 获取荣耀加倍榜数据
        getGloryData () {
            if (this.activityStatus === -1 || this.activityStatus === 3 || this.activityStatus === 6 || this.stage === 19) {
                return
            }
            this.$axios.get('/anniversary2020/hourRanks').then(res => {
                if (res.data.errno === 0) {
                    const { leftTime, myRank, ranks } = res.data.data
                    this.leftTime = leftTime
                    this.currentHour = ranks.currentHour
                    this.selfCenter = myRank
                    this.preHour = ranks.preHour
                    // 调用倒计时 如果不在时间段则返回-1不调用倒计时
                    if (leftTime < 0) {
                        return
                    }
                    this.getCountDown(leftTime)
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 荣耀加倍倒计时
        getCountDown (time) {
            this.timerIns && clearTimeout(this.timerIns)
            if (time <= 0) {
                this.leftTime = '00分00秒'
                // 如果倒计时为0则再次请求下一小时数据
                this.getGloryData()
                return
            }
            let minutes = Math.floor(time / 60)
            let seconds = time % 60
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            this.leftTime = `${minutes}分${seconds}秒`
            this.timerIns = setTimeout(() => {
                time--
                this.getCountDown(time)
            }, 1000)
        }
    }
}
</script>
