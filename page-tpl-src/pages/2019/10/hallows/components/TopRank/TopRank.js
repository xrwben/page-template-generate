import { PureComponent, createRef } from 'react'

import RankTop3 from './RankTop3'
import RankItem from './RankItem'
import RankMeCenter from './RankMeCenter'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { getRank } from '../../service'
import PCScroller from '../PCScroller/PCScroller'

export default class TopRank extends PureComponent {
    constructor (props) {
        super(props)

        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        this.state = {
            type: 'mod',

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
            this.props.atteService(info).then(() => {
                const target = [...this.state.list]
                target[ind].isLoved = true

                this.setState({
                    list: target
                })
            })
        }
    }

    componentDidMount () {
        this.refreshRank()
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

        this.resetScroller()

        this.setState({
            type: type
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

    loadRank (refresh) {
        if (!this.hasNext) {
            return Promise.reject(new Error(`[loading ${this.state.type}]: 没有更多数据...`))
        }
        if (this.loading) {
            return Promise.reject(new Error(`[load ${this.state.type}]: loading 正在加载中... 请稍后`))
        }

        this.loading = true

        return getRank(this.state.type, this.pageNo).then(data => {
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

    render () {
        let list = this.state.list
        if (!this.hasNext) {
            list = list.concat((new Array(100 - list.length)).fill(null))
        }

        const levelIcon = this.state.type === 'user' ? 'u_level_icon_' : 'm_level_icon_'

        const listJSX = list.slice(3).map((target, ind) => {
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
            <div className={ 'rank ' + this.state.type }>
                {/* 列表tab */}
                <div className="rank-tab fl-box">
                    <div
                        className={ 'butn tab-i tab-s tab-mod' + (this.state.type === 'mod' ? '-a' : '') }
                        onClick={ () => this.onTabChange('mod') }>南瓜公主榜</div>
                    <div
                        className={ 'butn tab-i tab-s tab-user' + (this.state.type === 'user' ? '-a' : '') }
                        onClick={ () => this.onTabChange('user') }>骷髅骑士榜</div>
                </div>
                <div className="rank-content">
                    <div className="rank-bg">
                        <RankTop3 top3={ list.slice(0, 3) } levelIcon={ levelIcon } type={ this.state.type } onAtte={ this.onAtte } />
                        <div className="rank-h">
                            <div className="rank-cell cell-1">排名</div>
                            <div className="rank-cell cell-2">{ this.state.type === 'user' ? '用户' : '主播' }</div>
                            <div className="rank-cell cell-3">积分</div>
                        </div>
                        {
                            this.pageType === 'pc' ? (
                                <PCScroller
                                    ref={ this.scroller }
                                    className="rank-list"
                                    right="0"
                                    thumbColor="#ea5413"
                                    onScroll={this.onScroll}
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
