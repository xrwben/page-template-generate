/* 赛事 - 预选赛 */
import { PureComponent, createRef } from 'react'
import PreRule from './components/PreRule'
import PCScroller from '../../components/PCScroller/PCScroller'

import $loading from '../../plugins/loading'
import { getPreRanks, getPreRanksByDate } from '../../service'
import PreRankItem from './components/PreRankItem'
import RankMeCenter from './components/RankMeCenter'

export default class PreContent extends PureComponent {
    constructor (props) {
        super(props)

        this.scroller = createRef()

        // 根据startTime 和 endTime计算dayType
        let tabType = 0
        let dayType = 0
        const { startTime, serverTime, gameStage } = props
        if (gameStage > 0) {
            // 预选赛 已结束
            tabType = 1
            dayType = 3
        } else {
            // 计算当前日期
            const st = new Date(startTime.replace(/-/g, '/'))
            const nt = new Date(serverTime.replace(/-/g, '/'))

            const dayDelta = nt - st
            const dayms = 3600 * 1000

            if (dayDelta < 12 * dayms) { // 12小时内 - 4
                dayType = 0
            } else if (dayDelta < 36 * dayms) { // 36小时内 - 5
                dayType = 1
            } else if (dayDelta < 60 * dayms) { // 60小时内 - 6
                dayType = 2
            } else { // - 7
                dayType = 3
            }
        }

        this.state = {
            ruleState: false,

            tabType: tabType,
            dayType: dayType,
            showDayType: dayType,

            list: [],
            meCenter: null
        }

        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        this.onClose = () => {
            this.setState({
                ruleState: false
            })
        }

        this.showRule = () => {
            this.setState({
                ruleState: true
            })
        }

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
    }

    componentDidMount () {
        this.initRanks()
    }

    initRanks () {
        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        $loading.show()
        this.loadRank(true).then(() => {
            $loading.hide()
        }).catch(err => {
            console.log(err.message)
            $loading.hide()
        })
    }

    getRank (pageNo) {
        if (this.state.tabType === 0) {
            return getPreRanksByDate(this.state.showDayType, pageNo, this.props.startTime)
        } else {
            return getPreRanks(pageNo)
        }
    }

    loadRank (refresh) {
        const { tabType, showDayType } = this.state
        if (!this.hasNext) {
            console.log(`[loading 预选赛榜 ${tabType} ${showDayType}]: 没有更多数据...`)
            return Promise.resolve(null)
        }
        if (this.loading) {
            console.log(`[loading 预选赛榜 ${tabType} ${showDayType}]: loading 正在加载中... 请稍后`)
            return Promise.resolve(null)
        }

        this.loading = true

        return this.getRank(this.pageNo).then(data => {
            const target = {
                list: refresh ? data.ranks : this.state.list.concat(data.ranks).slice(0, 100)
            }

            let needReset = false
            if (!this.listInited) {
                this.listInited = true
                target.meCenter = data.myRank && typeof data.myRank.uid !== 'undefined' && data.myRank.uid !== '' ? data.myRank : null
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

    resetScroller () {
        if (this.pageType === 'pc' && this.scroller.current) {
            this.scroller.current._resetBox()
            this.scroller.current._refresh()
        } else {
            this.scroller.current.scrollTop = 0
        }
    }

    tabChange (type) {
        if (type === this.state.tabType) return

        this.resetScroller()

        this.setState({
            tabType: type,
            showDayType: this.state.dayType
        }, () => {
            this.initRanks()
        })
    }

    subTabChange (dayType) {
        if (dayType > this.state.dayType) return

        if (dayType === this.state.showDayType) return

        this.resetScroller()

        this.setState({
            showDayType: dayType
        }, () => {
            this.initRanks()
        })
    }

    calcDayTab (key) {
        if (key > this.state.dayType) {
            return '-d'
        }
        if (key === this.state.showDayType) {
            return '-a'
        }
        return ''
    }

    render () {
        const { tabType } = this.state

        let list = this.state.list
        if (!this.hasNext) {
            const hd = Math.max(100 - list.length, 0)
            list = list.concat((new Array(hd)).fill(null))
        }

        const listJSX = list.map((target, ind) => {
            return (
                <PreRankItem
                    type={ this.state.tabType === 0 ? this.state.showDayType : -1 }
                    ind={ ind + 1 }
                    key={'r-row-' + ind}
                    target={ target } />
            )
        })

        return (
            <div className="rank pre game-rank">
                <div className="rank-tab fl-box">
                    <div
                        className={ `butn rt-i tab-pre-s tab-day${tabType === 0 ? '-a' : ''}` }
                        onClick={ () => { this.tabChange(0) } } />
                    <div className={ `butn rt-i tab-pre-s tab-pre${tabType === 1 ? '-a' : ''}` }
                        onClick={ () => { this.tabChange(1) } } />
                </div>
                <div className="rank-c border-deco">
                    <div className="rd-tab fl-box" style={ { display: tabType === 0 ? '' : 'none' } }>
                        <div
                            className={ `butn rd-i tab-pre-s tab-day-12-4${this.calcDayTab(0)}` }
                            onClick={ () => { this.subTabChange(0) } } />
                        <div
                            className={ `butn rd-i tab-pre-s tab-day-12-5${this.calcDayTab(1)}` }
                            onClick={ () => { this.subTabChange(1) } } />
                        <div
                            className={ `butn rd-i tab-pre-s tab-day-12-6${this.calcDayTab(2)}` }
                            onClick={ () => { this.subTabChange(2) } } />
                        <div
                            className={ `butn rd-i tab-pre-s tab-day-12-7${this.calcDayTab(3)}` }
                            onClick={ () => { this.subTabChange(3) } } />
                    </div>
                    <div className="pre-s rank-h"></div>
                    {
                        this.pageType === 'pc' ? (
                            <PCScroller
                                ref={ this.scroller }
                                className="rank-list"
                                right="10"
                                thumbColor="#efc65a"
                                onScroll={ this.onScroll }
                                canBubble={ true } >
                                { listJSX }
                            </PCScroller>
                        ) : (
                            <div
                                ref={ this.scroller }
                                onScroll={ this.onScroll }
                                className="rank-list">{ listJSX }</div>
                        )
                    }
                    <div className="rank-tip">仅展示前100位主播</div>
                    { <RankMeCenter data={ this.state.meCenter } /> }
                </div>

                <div className="floater butn btn-pre-rule" onClick={ this.showRule } >预选赛规则</div>

                { this.state.ruleState && <PreRule onClose={ this.onClose } /> }
            </div>
        )
    }
}
