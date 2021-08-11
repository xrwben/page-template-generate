/* 赛事 - 报名赛 */
import { PureComponent, createRef } from 'react'
import { getAllGroups, signGroup, getAllByGroup } from '../../service'
import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

export default class SignContent extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            canEnroll: false,
            isEnrolled: false,
            myGroup: null,

            headPic: '',

            signConfimer: false,

            groups: [
                {
                    mods: [],
                    currentNum: 0,
                    maxNum: 21,
                    groupId: 1
                },
                {
                    mods: [],
                    currentNum: 0,
                    maxNum: 21,
                    groupId: 2
                },
                {
                    mods: [],
                    currentNum: 0,
                    maxNum: 21,
                    groupId: 3
                },
                {
                    mods: [],
                    currentNum: 0,
                    maxNum: 21,
                    groupId: 4
                },
                {
                    mods: [],
                    currentNum: 0,
                    maxNum: 21,
                    groupId: 5
                }
            ],

            activeG: [false, false, false, false, false],

            isReval: false,
            countT: 0,

            signInd: -1,
            signGroupId: -1,

            countLock: false // 加锁 用于倒计时结束避免重复倒计时
        }

        this.groupLoaded = [false, false, false, false, false]

        this.counter = createRef()

        this.timer = null

        this.onClose = () => {
            this.setState({
                signConfimer: false
            })
        }
    }

    componentDidMount () {
        this.initGroup()
    }

    componentWillUnmount () {
        this.timer && clearTimeout(this.timer)
    }

    initGroup () {
        $loading.show()
        getAllGroups().then(data => {
            $loading.hide()
            // 计算倒计时
            const sTime = new Date(this.props.serverTime.replace(/-/g, '/')).getTime()
            const eTime = new Date(data.enrollEndTime.replace(/-/g, '/')).getTime()
            const isReval = sTime > (eTime + 3600000 * 2)

            this.st = Date.now()
            const countT = (eTime - sTime) / 1000
            // const countT = 10

            this.setState({
                canEnroll: data.canEnroll,
                isEnrolled: data.isEnrolled,
                myGroup: data.myGroup,
                headPic: data.headPic,

                groups: data.groupMods,

                isReval: isReval,
                countT: countT
            }, () => {
                if (countT > 0 && !this.state.countLock) {
                    this.doCount()
                }
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    // 倒计时结束
    countEnd () {
        this.setState({
            countLock: true
        })
        this.initGroup()
    }

    // 倒计时逻辑
    doCount () {
        const pass = (Date.now() - this.st) / 1000
        const end = this.state.countT - pass
        const ins = this.counter.current

        /* 倒计时到期 */
        if (end < 0) {
            ins.innerText = ''
            this.countEnd()
            return
        }

        let hour = end / 3600 >> 0
        let min = (end % 3600) / 60 >> 0
        let sec = end % 60 >> 0

        hour = hour < 10 ? '0' + hour : hour
        min = min < 10 ? '0' + min : min
        sec = sec < 10 ? '0' + sec : sec

        ins.innerText = `${hour}时${min}分${sec}秒`
        this.timer = setTimeout(() => {
            this.doCount()
        }, 1000)
    }

    // 获取详细列表数据
    loadMoreGroupItem (ind, groupId) {
        $loading.show()
        getAllByGroup(groupId).then(data => {
            $loading.hide()
            this.groupLoaded[ind] = true
            const groups = this.state.groups.map((item, ti) => {
                if (ti === ind) {
                    item.mods = data
                }
                return item
            })

            this.setState({
                groups
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    togGroup (ind) {
        // 结果已公布 并且其他数据没有加载过
        const target = this.state.groups[ind]
        if (this.state.isReval && target.mods.length !== 0 && !this.groupLoaded[ind]) {
            this.loadMoreGroupItem(ind, target.groupId)
        }

        this.setState({
            activeG: this.state.activeG.map((val, i) => {
                if (ind === i) {
                    return !val
                }
                return val
            })
        })
    }

    toSignGroup (ind, groupId) {
        this.setState({
            signConfimer: true,
            signInd: ind,
            signGroupId: groupId
        })
    }

    calcGname (ind) {
        return ['', '年度天籁主播', '年度风云主播', '年度偶像主播', '年度元气主播', '年度魅力主播'][ind]
    }

    confirmSign () {
        const groupId = this.state.signGroupId
        const ind = this.state.signInd
        const gname = this.calcGname(groupId)

        $loading.show()
        signGroup(groupId).then(data => {
            $loading.hide()
            $toast.show(`小主，你已经成功报名${gname}赛道！祝好运！`)

            const groups = this.state.groups.map((item, itmInd) => {
                if (itmInd === ind) {
                    item.currentNum += 1
                }
                return item
            })

            // 报名数量为21时触发更新
            if (groups[ind].currentNum === 21) {
                let flag = 0
                groups.forEach(item => {
                    if (item.currentNum === 21) flag++
                })

                if (flag === 2) {
                    groups.forEach(item => {
                        if (item.currentNum !== 21) {
                            item.maxNum = 20
                        }
                    })
                }
            }

            this.setState({
                isEnrolled: true,
                myGroup: groupId,
                groups,
                signConfimer: false
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)

            this.setState({
                signConfimer: false
            })

            // 刷新数据 -> 防止因为赛道21变化而产生的UI不准确
            this.initGroup()
        })
    }

    signGroupJSX (item, ind, active) {
        const isReval = this.state.isReval && item.mods.length !== 0
        const { countT, canEnroll, isEnrolled, countLock } = this.state
        const { currentNum, maxNum } = item

        let canSign = true
        // 倒计时结束 || 已报名 || 赛道以报满
        if (countT <= 0 || isEnrolled || currentNum >= maxNum || countLock) {
            canSign = false
        }

        return (
            <div className={ `sign-path-i border-deco2 path-${ind}` } key={ item.groupId }>
                <div className={ `sign-path-c sign-bg-${ind} ${active ? 'active' : ''}` }>
                    <div className="path-info">
                        <div className="info-h">
                            <div className={`sign-s h-${ind}`}></div>
                            <div className="sign-num">{ currentNum }/{ maxNum }</div>
                        </div>
                        {
                            canEnroll && (
                                <div
                                    className={ 'sign-s butn sign-btn btn-sign' + (canSign ? '' : '-d') }
                                    onClick={ () => canSign && this.toSignGroup(ind, item.groupId) } >报名</div>
                            )
                        }
                    </div>
                    <div className="sign-list fl-box">
                        {
                            isReval ? (
                                item.mods.map((mod, mind) => (
                                    <div className="sign-item" key={ 'si-' + mind }>
                                        <div className="headpic" onClick={ () => this.goRoom(mod) }>
                                            <span className="pre-s icon-live" style={ { display: mod.isPlaying ? '' : 'none' } }>live</span>
                                            <img className="avatar" src={mod.headPic} />
                                        </div>
                                        <div className="name txt-of">{ mod.nickname }</div>
                                    </div>
                                ))
                            ) : (
                                new Array(currentNum).fill(null).map((i, ind) => (
                                    <div className="sign-item" key={ 'si-taken-' + ind }>
                                        <div className="sign-s taken"></div>
                                        <div className="name txt-of">名额已占</div>
                                    </div>
                                )).concat(new Array(maxNum - currentNum).fill(null).map((i, ind) => (
                                    <div className="sign-item" key={ 'si-holder-' + ind }>
                                        <div className="sign-s holder"></div>
                                        <div className="name txt-of">虚位以待</div>
                                    </div>
                                )))
                            )
                        }
                    </div>
                    <div className="sign-s butn open" onClick={ () => this.togGroup(ind) }></div>
                </div>
            </div>
        )
    }

    scrollTo (anchorName) {
        var target = document.querySelector(anchorName)
        if (!target) return

        this.animateScroll('scrollTop', target.offsetTop, 500)
    }

    animateScroll (attr, targetValue, duration) {
        if (this.animTimer) {
            clearTimeout(this.animTimer)
            this.animTimer = null
        }
        this.sTime = Date.now()
        var initVal = document.body[attr] || document.documentElement[attr]
        var fpsTime = 1000 / 60

        var _run = () => {
            var out = this._tweenEaseInOut(Date.now() - this.sTime, initVal, targetValue - initVal, duration)
            document.body[attr] = out
            document.documentElement[attr] = out

            if (Date.now() - this.sTime < duration) {
                this.animTimer = setTimeout(_run, fpsTime)
            } else {
                clearTimeout(this.animTimer)
                this.animTimer = null
            }
        }

        _run()
    }

    _tweenEaseInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b
        return -c / 2 * ((--t) * (t - 2) - 1) + b
    }

    render () {
        return (
            <div className="sign-c">
                {/* 赛道规则 及 倒计时 */}
                <div className="sign-rule border-deco2">
                    {
                        (!this.state.countLock && this.state.countT > 0) && (
                            <div className="sign-counter fl-box">
                                <div className="sign-s txt-count">报名倒计时</div>
                                <div className="time" ref={ this.counter }></div>
                            </div>
                        )
                    }
                    <div className="sign-rule-i">报名时间：12.8 00:00:00-12.9 19:59:59。</div>
                    <div className="sign-rule-i">报名范围：预选赛晋级的102强主播。</div>
                    <div className="sign-rule-i">报名说明：<br/>1.102位主播可自由报名赛道，每个赛道最多只能报名21位主播，若在报名时间内有主播未报名，则由系统随机分配到未满赛道。</div>
                    <div className="sign-rule-i">2.确认报名后，将不可变更赛道。每个主播只能参加其中一条赛道，请谨慎操作！</div>
                    <div className="sign-rule-i">3. 12.9 22:00:00将公布所有赛道主播。</div>
                </div>
                {/* 我的赛道 */}
                {
                    this.state.canEnroll && (
                        <div className="sign-info">
                            <div className="sign-info-c fl-box">
                                <div className="headpic">
                                    <img className="avatar" src={ this.state.headPic } />
                                </div>
                                <div className="sign-s txt-my">我的赛道</div>
                                <div className="status">
                                    { this.state.isEnrolled
                                        ? this.calcGname(this.state.myGroup)
                                        : '还未报名'
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* 赛道列表 */}
                <div className="sign-path">
                    {/* 天籁主播 */}
                    {
                        this.state.groups.map((item, ind) => this.signGroupJSX(item, ind, this.state.activeG[ind]))
                    }
                </div>

                {/* sign layer */}
                {
                    this.state.signConfimer && (
                        <div className="layer layer-sign-c">
                            <div className="layer-cus">
                                <div className="common-s butn btn-close" onClick={ this.onClose }></div>
                                <div className="layer-m">
                                    <div className="c-h">小主，确定报名{ this.calcGname(this.state.signGroupId) }赛道吗？</div>
                                    <div className="opts fl-box">
                                        <div className="sign-s butn btn-sign-cc" onClick={ this.onClose }>我再看看吧</div>
                                        <div className="sign-s butn btn-sign-ok" onClick={ () => this.confirmSign() }>确定</div>
                                    </div>
                                    <div className="c-tips">提示：报名成功后，无法更改赛道，请谨慎操作！</div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* floater */}
                {
                    this.pageType === 'pc' && (
                        <div className="floater sign-nav">
                            <div className="sign-nav-i butn nav-0" onClick={ () => this.scrollTo('.path-0') }></div>
                            <div className="sign-nav-i butn nav-1" onClick={ () => this.scrollTo('.path-1') }></div>
                            <div className="sign-nav-i butn nav-2" onClick={ () => this.scrollTo('.path-2') }></div>
                            <div className="sign-nav-i butn nav-3" onClick={ () => this.scrollTo('.path-3') }></div>
                            <div className="sign-nav-i butn nav-4" onClick={ () => this.scrollTo('.path-4') }></div>
                            <div className="sign-nav-i butn nav-top" onClick={ () => this.scrollTo('.header_wrap') }></div>
                        </div>
                    )
                }
            </div>
        )
    }
}
