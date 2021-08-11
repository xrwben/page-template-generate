import { PureComponent, createRef } from 'react'

import $loading from '../../../plugins/loading'
import $toast from '../../../plugins/toast'
import ScreenItem from './ScreenItem'
import { getNowScreen, getScreenHis } from '../../../service'

export default class ScreenHolder extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            now: null,
            list: []
        }

        this.timeIns = createRef()
        this.timer = null
        this.st = null
        this.lock = false

        this.ani = createRef()
        this.aniStop = true

        this.autoRefreshTimer = null
    }

    componentDidMount () {
        this.lock = false
        $loading.show()
        Promise.all([
            this.loadNow(),
            this.loadHis()
        ]).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    componentWillUnmount () {
        this.timer && clearTimeout(this.timer)
        this.lock = true
    }

    loadNow () {
        if (this.props.activityStatus === -1) {
            return
        }

        return getNowScreen().then(data => {
            // 组件已销毁
            if (this.lock) return

            // 如果当前数据被覆盖则历史记录需要重新刷新 或者 添加进去后重新滚动
            const now = this.state.now
            if (now && now.holdTime !== data.holdTime) {
                // 说明数据更新了
                this.refreshHis()
            }

            this.st = Date.now()
            this.setState({
                now: typeof data.length !== 'undefined' ? null : data
            }, () => {
                this.startCounter()
            })
        })
    }

    loadHis () {
        return getScreenHis().then(data => {
            this.setState({
                list: data
            }, () => {
                this.startRunAni()
            })
        })
    }

    refreshHis () {
        return getScreenHis().then(data => {
            this.aniStop = true
            this.setState({
                list: data
            }, () => {
                this.startRunAni()
            })
        })
    }

    startCounter () {
        const now = this.state.now

        this.autoRefreshTimer && clearTimeout(this.autoRefreshTimer)

        if (now) {
            if (!this.timeIns.current) return
            this.timeCount()

            // 当前倒计时 -> 9s后刷新 (新的霸屏数据)
            this.autoRefreshTimer = setTimeout(() => {
                clearTimeout(this.timer)

                /* 解决刷新数据时恰好倒计时也到期 UI未刷新 */
                const pass = (Date.now() - this.st) / 1000 >> 0
                const end = this.state.now.endTime - pass

                if (end <= 0) {
                    this.timeIns.current.innerText = ''
                }

                this.loadNow()
            }, 9000)
        } else {
            // 当前没有霸屏 6s后刷新数据
            this.autoRefreshTimer = setTimeout(() => {
                this.loadNow()
            }, 6000)
        }
    }

    timeCount () {
        const pass = (Date.now() - this.st) / 1000 >> 0
        const end = this.state.now.endTime - pass

        if (end <= 0) {
            this.timeIns.current.innerText = ''
            this.loadNow()
            return
        }

        let min = end / 60 >> 0
        let sec = end % 60 >> 0

        min = min < 10 ? '0' + min : min
        sec = sec < 10 ? '0' + sec : sec

        this.timeIns.current.innerText = min + ':' + sec
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.timeCount()
        }, 1000)
    }

    startRunAni () {
        this.aniStop = false

        const ins = this.ani.current
        const sH = ins.scrollHeight
        const cH = ins.clientHeight

        const listLen = this.state.list.length

        if (sH <= cH || listLen < 5 || !ins) {
            return
        }
        let top = 0
        const step = 1
        const _self = this
        const limitTop = sH * listLen / (listLen + 4)

        const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

        function run () { // eslint-disable-line
            top -= step
            ins.style.transform = 'translate3d(0px, ' + top + 'px, 0px)'
            ins.style.webkitTransform = 'translate3d(0px, ' + top + 'px, 0px)'

            if (Math.abs(top) > limitTop) {
                top = 0
            }

            // 组件已销毁
            if (_self.lock || _self.aniStop) {
                return
            }
            requestAnimationFrame(run)
        }

        requestAnimationFrame(run)
    }

    nowHolder () {
        const perName = this.perName
        const { activityStatus } = this.props
        if (activityStatus === -1) {
            return <div className="bp-curr fl-box"><div className="bp-curr-txt">活动已结束~</div></div>
        }

        // 1 3 4 5 6 7 8 9 赛事期间
        if ([1, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(activityStatus) !== -1) {
            if (this.state.now) {
                return (
                    <div className="bp-curr">
                        <div className="bp-time fl-ver" ref={ this.timeIns }></div>
                        <ScreenItem data={ this.state.now } goRoom={ this.goRoom } />
                        <div className="bp-tip">tip：一次性赠送年度礼物价值高于当前霸屏礼物即可抢占当前霸屏位</div>
                    </div>
                )
            } else {
                return (
                    <div className="bp-curr fl-box">
                        <div className="bp-curr-txt">一次性送出价值≥52000{ perName }的年度礼物<br/>即可与主播一起抢占全站直播间霸屏位</div>
                    </div>
                )
            }
        }

        // 非赛事期间
        return <div className="bp-curr fl-box"><div className="bp-curr-txt">赛事期间开启霸屏！</div></div>
    }

    render () {
        const goRoomIns = () => {}
        const list = this.state.list
        const target = list.length > 4 ? list.concat(list.slice(0, 4)) : list
        const hisJSX = target.map((item, ind) => <ScreenItem data={ item } key={ 'si-' + ind } goRoom={ goRoomIns } />)

        return (
            <div className="screen-box">
                <div className="screen-bg">
                    <div className="screen-bg0"></div>
                    <div className="screen-bg1"></div>
                </div>
                <div className="screen-c">
                    <div className="pre-s butn btn-bp-rule" onClick={ this.props.sRuleShow }>霸屏必读</div>
                    {/* 正在霸屏 */}
                    {
                        this.nowHolder()
                    }
                    {/* 历史霸屏 */}
                    <div className="bp-histories">
                        <div className="bp-list" ref={ this.ani }>
                            {
                                this.state.list.length === 0
                                    ? (<div className="holder-tip">快去霸屏，享受全站瞩目！</div>)
                                    : (hisJSX)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
