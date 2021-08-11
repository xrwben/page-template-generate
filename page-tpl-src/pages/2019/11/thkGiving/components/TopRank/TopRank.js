import { PureComponent, createRef } from 'react'

import RankTop3 from './RankTop3'
import RankItem from './RankItem'
import RankMeCenter from './RankMeCenter'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { getModRank, getUserRank } from '../../service'
import PCScroller from '../PCScroller/PCScroller'

export default class TopRank extends PureComponent {
    constructor (props) {
        super(props)

        this.listInited = false
        this.loading = false
        this.hasNext = false
        this.pageNo = 0

        this.state = {
            type: 'mod',
            dateInd: 0,

            list: [],
            meCenter: null
        }

        this.scroller = createRef()

        this.onScroll = (evt) => {
            var bh = 150
            var target = evt.target
            var toBottomH = target.scrollHeight - target.scrollTop - target.clientHeight

            if (toBottomH < bh) {
                this.loadRank().catch(err => {
                    console.log(err.message)
                })
            }
        }

        this.onAtte = (info, ind) => {
            this.props.attention(info).then(() => {
                const target = [...this.state.list]
                target[ind].isLoved = true

                this.setState({
                    list: target
                })
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    enter () {
        this.setState({
            dateInd: this.props.stage === 2 ? -1 : this.props.currDate
        }, () => {
            this.refreshRank()
        })
    }

    resetScroller () {
        if (this.pageType === 'pc' && this.scroller.current) {
            this.scroller.current._resetBox()
            this.scroller.current._refresh()
        } else {
            this.scroller.current.scrollTop = 0
        }
    }

    onTabChange (type) {
        if (type === this.state.type) return

        if (type === 'mod') {
            // 活动结束 -> 显示主播总榜 // 活动未结束 -> 当前日榜
            this.setState({
                dateInd: this.props.stage === 2 ? -1 : this.props.currDate
            })
        }

        this.resetScroller()

        this.setState({
            type: type
        }, () => {
            this.refreshRank()
        })
    }

    onSubTabChange (dateInd) {
        if (dateInd > this.props.currDate) return

        this.setState({
            dateInd: dateInd
        }, () => {
            this.refreshRank()
        })
    }

    refreshRank () {
        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        $loading.show()
        this.loadRank(true).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    getRank () {
        if (this.state.type === 'mod') {
            return getModRank(this.state.dateInd, this.pageNo)
        } else {
            return getUserRank(this.pageNo)
        }
    }

    loadRank (refresh) {
        if (!this.hasNext) {
            return Promise.reject(new Error(`[loading ${this.state.type}]: 没有更多数据...`))
        }
        if (this.loading) {
            return Promise.reject(new Error(`[load ${this.state.type}]: loading 正在加载中... 请稍后`))
        }

        this.loading = true

        return this.getRank().then(data => {
            const target = {
                list: refresh ? data.data : this.state.list.concat(data.data)
            }

            let needReset = false
            if (!this.listInited) {
                this.listInited = true
                target.meCenter = (data.myRank && data.myRank.uid !== '') ? data.myRank : null
                needReset = true
            }

            this.pageNo += 1
            this.loading = false

            if (this.pageNo >= data.pageSum) {
                this.hasNext = false
            } else {
                this.hasNext = data.hasNext
            }

            this.setState(target, needReset ? () => {
                this.resetScroller()
            } : null)
        })
    }

    subDateTab () {
        if (this.state.type === 'user') return null

        const calc = (ind) => {
            if (this.props.stage === 0) { // 活动未开始
                return ' inactive'
            }
            if (ind > this.props.currDate) {
                return ' inactive'
            }
            if (ind === this.state.dateInd) {
                return ' active'
            }
            return ''
        }

        return (
            <div className="rank-tab rank-day-tab fl-box">
                <div className={ 'tab-day butn' + calc(0) } onClick={ () => this.onSubTabChange(0) } >11.27</div>
                <div className={ 'tab-day butn' + calc(1) } onClick={ () => this.onSubTabChange(1) } >11.28</div>
                <div className={ 'tab-day butn' + calc(2) } onClick={ () => this.onSubTabChange(2) }>11.29</div>
                <div className={ 'tab-day butn' + calc(3) } onClick={ () => this.onSubTabChange(3) }>11.30</div>
                <div
                    // className={ 'tab-day butn' + (this.state.dateTab === -1 ? ' active' : '') }
                    className={ 'tab-day butn' + calc(-1) }
                    onClick={ () => this.onSubTabChange(-1) } >总榜</div>
            </div>
        )
    }

    render () {
        let list = this.state.list
        if (!this.hasNext) {
            list = list.concat((new Array(100 - list.length)).fill(null))
        }

        const levelIcon = this.state.type === 'user' ? 'u_level_icon_' : 'm_level_icon_'

        const listJSX = this.props.stage === 0 ? (
            <div className="rank-holder">活动未开始</div>
        ) : list.slice(3).map((target, ind) => {
            return (
                <RankItem
                    key={'r-row-' + ind}
                    ind={ ind }
                    target={ target }
                    levelIcon={ levelIcon }
                    goRoom={ this.goRoom } />
            )
        })

        return (
            <div className={ 'wrap-box rank ' + this.state.type }>
                <div className="wrap-c">
                    <div className="h-title h-rank"></div>
                    {/* 列表tab */}
                    <div className="rank-tab">
                        <div
                            className={ 'butn tab-i btn-2-s tab-m' + (this.state.type === 'mod' ? '-a' : '') }
                            onClick={ () => this.onTabChange('mod') }>感恩榜</div>
                        <div
                            className={ 'butn tab-i btn-2-s tab-u' + (this.state.type === 'user' ? '-a' : '') }
                            onClick={ () => this.onTabChange('user') }>陪伴榜</div>
                    </div>
                    {/* 日榜tab */}
                    { this.subDateTab() }
                    <div className="rank-content">
                        {
                            this.props.stage > 0 &&
                            <RankTop3 top3={ list.slice(0, 3) } levelIcon={ levelIcon } type={ this.state.type } onAtte={ this.onAtte } />
                        }
                        <div className="rank-h">
                            <div className="rank-cell cell-1">排名</div>
                            <div className="rank-cell cell-2">{ this.state.type === 'user' ? '用户' : '主播' }</div>
                            <div className="rank-cell cell-3">感恩值</div>
                        </div>
                        {
                            this.pageType === 'pc' ? (
                                <PCScroller
                                    ref={ this.scroller }
                                    className="rank-list"
                                    right="0"
                                    thumbColor="#ea5413"
                                    onScroll={this.onScroll}
                                    canBubble={ true }
                                >
                                    { listJSX }
                                </PCScroller>
                            ) : (
                                <div
                                    ref={ this.scroller }
                                    className="rank-list"
                                    onScroll={this.onScroll}>
                                    { listJSX }
                                </div>
                            )
                        }
                        <div className="rank-footer">仅展示前100位{ this.state.type === 'user' ? '用户' : '主播' }</div>
                        {
                            this.state.meCenter && (
                                <RankMeCenter
                                    meCenter={ this.state.meCenter }
                                    levelIcon={ levelIcon }
                                    goRoom={ this.goRoom } />
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
