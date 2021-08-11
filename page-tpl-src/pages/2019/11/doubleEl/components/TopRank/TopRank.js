import { PureComponent, createRef } from 'react'

import RankTop3 from './RankTop3'
import RankItem from './RankItem'
import RankMeCenter from './RankMeCenter'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { getRanks } from '../../service'
import PCScroller from '../PCScroller/PCScroller'

export default class TopRank extends PureComponent {
    constructor (props) {
        super(props)

        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        this.state = {
            type: 1,

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
            }).catch(err => {
                console.log(err.message)
            })
        }
    }

    componentDidMount () {
        // 随机切换展示两个类型的榜单
        this.setState({
            type: (Math.random() * 2 >> 0) + 1
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

        return getRanks(this.state.type, this.pageNo).then(data => {
            const target = {
                list: refresh ? data.ranks : this.state.list.concat(data.ranks)
            }

            let needReset = false
            if (!this.listInited) {
                this.listInited = true
                target.meCenter = (data.myRank && !!data.myRank.uid && !!data.myRank.rid) ? data.myRank : null
                needReset = true
            }

            this.pageNo += 1
            this.loading = false

            this.hasNext = data.hasNext

            // if (this.pageNo >= data.pageSum) {
            //     this.hasNext = false
            // } else {
            //     this.hasNext = data.hasNext
            // }

            this.setState(target, needReset ? () => {
                this.resetScroller()
            } : null)
        })
    }

    render () {
        let list = this.state.list
        if (!this.hasNext) {
            list = list.concat((new Array(50 - list.length)).fill(null))
        }

        const levelIcon = 'm_level_icon_'

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
            <div className={ 'rank type-' + this.state.type }>
                {/* 列表tab */}
                <div className="rank-tab fl-box">
                    <div
                        className={ 'butn tab-i btn-s btn-t-lv' + (this.state.type === 1 ? '' : '-dis') }
                        onClick={ () => this.onTabChange(1) }>秀恩爱</div>
                    <div
                        className={ 'butn tab-i btn-s btn-t-buy' + (this.state.type === 2 ? '' : '-dis') }
                        onClick={ () => this.onTabChange(2) }>买买买</div>
                </div>
                <div className="rank-content">
                    <div className="rank-c-bg"></div>
                    <RankTop3 top3={ list.slice(0, 3) } levelIcon={ levelIcon } onAtte={ this.onAtte } />
                    <div className="rank-h">
                        <div className="rank-cell cell-1">排名</div>
                        <div className="rank-cell cell-2">主播</div>
                        <div className="rank-cell cell-3">积分</div>
                    </div>
                    {
                        this.pageType === 'pc' ? (
                            <PCScroller
                                ref={ this.scroller }
                                className="rank-list"
                                right="0"
                                thumbColor="#fdd254"
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
                    <div className="rank-footer">当前只展示前50名主播</div>
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
        )
    }
}
