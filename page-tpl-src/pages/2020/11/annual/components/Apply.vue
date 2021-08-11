<template>
    <div class="module-apply">
        <!-- 报名倒计时 -->
        <div class="countdown-con" v-if="leftTime">报名倒计时：<span ref="countdown">{{ leftTime }}</span></div>
        <!-- 报名规则 -->
        <div class="rule-con">
            <p>报名范围：预选赛晋级的101强主播。</p>
            <p>报名时间：2020.12.1 00:00:00 - 12.2 19:59:59。</p>
            <p>报名说明：</p>
            <p>1. 101位主播可自由报名赛道，每个赛道最多只能报名21位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。</p>
            <p>2. 确认报名后，将不可变更赛道。每个主播只能参加其中一条赛道，请谨慎操作。</p>
            <p>3. 12.2 22:00:00将公布所有赛道主播。</p>
        </div>
        <!-- 我的赛道 -->
        <div class="myself-con" v-if="canApply !== 0">
            <div class="avatar">
                <img :src="headPic" alt="">
            </div>
            <div class="name"><i class="competition-apply-s my-track"></i>{{ categroy ? '年度'+['人气', '天籁', '风云', '偶像', '娱乐'][categroy-1]+'主播' : '还未报名' }}</div>
        </div>
        <!-- 各个赛道报名列表 -->
        <div class="apply-con" :class="'track-'+['rq', 'tl', 'fy', 'ox', 'yl'][index]" v-for="(item, index) in trackList" :key="item.groupId">
            <div class="apply-number">{{ item.currentNum }}/{{ item.maxNum }}</div>
            <div class="apply-btn competition-apply-s" v-if="canApply===1 && item.currentNum!==item.maxNum" :class="categroy?'apply-gray':'apply-normal'" @click="changeConfirmPopup(item)"></div>
            <div class="list-con" :class="item.expand?'expand':''">
                <div class="list-item" v-if="item.mods.length">
                    <div class="item-block" v-for="subitem in item.mods" :key="subitem.id">
                        <div class="avatar" @click="goRoom(subitem)">
                            <span class="com-sprite-s live" v-if="subitem.isPlaying"></span>
                            <img :src="subitem.headPic" alt="">
                        </div>
                        <div class="name txt-of">{{ subitem.nickname }}</div>
                    </div>
                </div>
                <div class="list-item" v-else>
                    <div class="item-block" v-for="(subitem, index_) in item.currentNum" :key="index_+'abc'">
                        <div class="avatar">
                            <img src="../images/competition/meyz.png" alt="">
                        </div>
                    </div>
                    <div class="item-block" v-for="(subitem, index_) in (item.maxNum-item.currentNum)" :key="index_+'def'">
                        <div class="avatar">
                            <img src="../images/competition/xw.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="arrow-btn">
                <i class="competition-apply-s arrow" :class="item.expand?'arrow-up':'arrow-down'" @click="toggleExpand(item)"></i>
            </div>
        </div>
        <!-- 导航栏 -->
        <div class="navigation" v-if="pageType==='pc'">
            <p :class="{'competition-apply-s act-rq': currentAnchor==='rq'}" @click="scrollTo('rq')">年度人气主播</p>
            <p :class="{'competition-apply-s act-tl': currentAnchor==='tl'}" @click="scrollTo('tl')">年度天籁主播</p>
            <p :class="{'competition-apply-s act-fy': currentAnchor==='fy'}" @click="scrollTo('fy')">年度风云主播</p>
            <p :class="{'competition-apply-s act-ox': currentAnchor==='ox'}" @click="scrollTo('ox')">年度偶像主播</p>
            <p :class="{'competition-apply-s act-yl': currentAnchor==='yl'}" @click="scrollTo('yl')">年度娱乐主播</p>
            <p @click="scrollTo('top')">top</p>
        </div>
        <!-- 报名确认弹窗 -->
        <div class="apply-popup" v-if="showConfirmPopup">
            <div class="apply-container">
                <i class="close com-sprite-s" @click="showConfirmPopup=false">关闭</i>
                <div class="content">
                    <div class="head-tip">小主，确定报名年度{{ ['人气', '天籁', '风云', '偶像', '娱乐'][selectCategory-1] }}主播赛道吗？</div>
                    <div class="btn-group">
                        <div class="competition-apply-s cancel-kk" @click="showConfirmPopup=false"></div>
                        <div class="competition-apply-s confirm" @click="confirmApply"></div>
                    </div>
                    <div class="foot-tip">提示：报名成功后，无法更改赛道，请谨慎操作！</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            timerIns: null,
            leftTime: 0,
            headPic: '',
            categroy: 0,
            // 赛道列表
            trackList: [],
            canApply: 0, // 0表示没有资格报名 1表示有资格可以报名 2表示有资格不在报名时间内
            // 当前锚点
            currentAnchor: '',
            // canScorll: true,
            // isShow: false,
            // 报名确认弹窗
            showConfirmPopup: false,
            selectCategory: 0
        }
    },
    created () {
        this.getApplyList()
    },
    mounted () {
        // this.pageType === 'pc' && this.winScroll()
    },
    beforeDestroy () {
        this.timerIns && window.clearTimeout(this.timerIns)
    },
    methods: {
        // 获取所有报名赛道数据
        getApplyList () {
            this.$loading && this.$loading.show()
            this.$axios.get('/anniversary2020/allGroupMod').then(res => {
                if (res.data.errno === 0) {
                    const { leftTime, headPic, myGroup, groupMods, canEnroll } = res.data.data
                    // 调用倒计时
                    this.startCountDown(leftTime)
                    this.headPic = headPic
                    this.categroy = myGroup
                    this.canApply = canEnroll
                    this.trackList = groupMods.map(item => {
                        return {
                            ...item,
                            expand: false
                        }
                    })
                    console.log(this.trackList)
                } else {
                    console.error(res.data.msg)
                }
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.$loading && this.$loading.hide()
            })
        },
        // 报名倒计时
        startCountDown (time) {
            this.timerIns && clearTimeout(this.timerIns)
            if (time <= 0) {
                this.leftTime = ''
                // this.getApplyList()
                return
            }
            let hour = Math.floor(time / 60 / 60)
            let minutes = Math.floor(time / 60 % 60)
            let seconds = time % 60
            hour = hour < 10 ? '0' + hour : hour
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            this.leftTime = `${hour}时${minutes}分${seconds}秒`
            this.timerIns = setTimeout(() => {
                time--
                this.startCountDown(time)
            }, 1000)
        },
        // 展开折叠
        toggleExpand (info) {
            info.expand = !info.expand
        },
        // 导航定位
        async scrollTo (className) {
            this.canScorll = false
            if (className === 'top') {
                this.currentAnchor = ''
                await document.querySelector('body').scrollIntoView({
                    behavior: 'smooth'
                })
                console.log('滚动停止')
                this.canScorll = true
                // this.isShow = false
                return
            }
            const targetClass = document.querySelector('.track-' + className)
            console.log(targetClass)
            if (!targetClass) {
                return
            }
            this.currentAnchor = className
            targetClass.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
            // new Promise((resolve, reject) => {
            //     resolve()
            // }).then((res) => {
            //     console.log('滚动----', res, this.canScorll)
            //     this.canScorll = true
            // })
        },
        // 页面滚动
        winScroll () {
            const floorArr = ['rq', 'tl', 'fy', 'ox', 'yl']
            this.$nextTick(() => {
                window.addEventListener('scroll', this.throttle(() => {
                    if (!this.canScorll) {
                        return
                    }
                    const _sTop = document.body.scrollTop || document.documentElement.scrollTop
                    this.isShow = _sTop > 1000
                    if (!this.isShow) {
                        this.currentAnchor = ''
                    }
                    console.log(_sTop, this.canScorll)
                    for (let i = 0; i < floorArr.length; i++) {
                        const _top = document.querySelector('.track-' + floorArr[i]).offsetTop
                        console.log(_top, _sTop)
                        if (_top > _sTop) {
                            this.currentAnchor = floorArr[i]
                            return
                        }
                    }
                }), 200)
            })
        },
        // 节流
        throttle (fn, wait = 800) {
            let flag = true
            return function () {
                if (!flag) {
                    return
                }
                flag = false
                setTimeout(() => {
                    fn()
                    flag = true
                }, wait)
            }
        },
        // 报名弹窗
        changeConfirmPopup (info) {
            // 赛道已满后者报了名
            if (info.currentNum === info.maxNum || this.categroy || !this.canApply) {
                return
            }
            this.showConfirmPopup = true
            this.selectCategory = info.groupId
        },
        // 确认报名
        confirmApply () {
            this.$loading && this.$loading.show()
            this.$axios.get('/anniversary2020/enroll', {
                params: {
                    group: this.selectCategory
                }
            }).then(res => {
                if (res.data.errno === 0) {
                    this.getApplyList()
                }
                this.showConfirmPopup = false
                this.$toast.show(res.data.msg)
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.$loading && this.$loading.hide()
            })
        }
    }
}
</script>
