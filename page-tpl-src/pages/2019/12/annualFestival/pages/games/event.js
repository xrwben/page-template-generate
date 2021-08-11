/* 赛事 - 单项赛 */
import { PureComponent } from 'react'
import RankItem from './components/EventRankItem'
import EventRule from './components/EventRule'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { getEventRanks } from '../../service'

export default class EventContent extends PureComponent {
    constructor (props) {
        super(props)

        let showStage = 0

        if (props.gameStage === 2) {
            // 还在单项赛期间
            showStage = props.activityStatus - 3
        } else {
            // 显示最后一个阶段
            showStage = 5
        }

        this.state = {
            ruleState: false,

            showGroup: 0,
            maxStage: showStage,
            showStage,
            list: []
        }

        this.maxlen = [21, 18, 15, 10, 7, 4]

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
    }

    componentDidMount () {
        this.loadRank()
    }

    loadRank () {
        $loading.show()
        getEventRanks(this.state.showStage, this.state.showGroup + 1).then(data => {
            $loading.hide()

            const maxlen = data.maxNum || this.maxlen[this.state.showStage]
            if (data.ranks.length < maxlen) {
                data.ranks = data.ranks.concat(new Array(maxlen - data.ranks.length).fill(0))
            }

            this.setState({
                list: data.ranks
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    changeGroup (gInd) {
        if (gInd === this.state.showGroup) return

        this.setState({
            showGroup: gInd,
            showStage: this.state.maxStage
        }, () => {
            this.loadRank()
        })
    }

    changeStage (stage) {
        const { showStage, maxStage } = this.state
        if (stage === showStage) return

        if (stage > maxStage) return

        this.setState({
            showStage: stage
        }, () => {
            this.loadRank()
        })
    }

    listJSX () {
        const { showStage, showGroup, maxStage } = this.state
        const insertedI = [18, 15, 10, 7, 4, 3][showStage]

        const list = this.state.list.map((target, ind) => {
            return (
                <RankItem
                    className={ ind === insertedI - 1 ? 'no-bline' : '' }
                    maxStage={ maxStage }
                    stage={ showStage }
                    group={ this.state.showGroup }
                    ind={ ind + 1 }
                    key={'r-row-' + ind}
                    target={ target } />
            )
        })

        let holder = <div className="rank-tip tip-line" key="r-row-holder">以下已被淘汰</div>
        if (showStage + 3 === this.props.activityStatus) {
            holder = <div className="rank-tip tip-line" key="r-row-holder">以下将被淘汰</div>
        }

        if (showStage === 5) {
            const path = ['天籁', '风云', '偶像', '元气', '魅力'][showGroup]
            holder = <div className="rank-tip" key="r-row-holder">{ `15日23:59:59结算时，以上主播将成为年度${path}主播冠亚季军` }</div>
        }

        list.splice(insertedI, 0, holder)

        return list
    }

    calcEsTab (ind) {
        const { showStage, maxStage } = this.state
        if (showStage === ind) {
            return ' active'
        }

        if (ind > maxStage) {
            return ' dis'
        }

        return ''
    }

    render () {
        const { showGroup, showStage } = this.state

        return (
            <div className="event-c">
                <div className="et-tab fl-box">
                    <div
                        className={ `butn e-tab-s et-tab-i et-tab-0${showGroup === 0 ? '-a' : ''}` }
                        onClick={ () => this.changeGroup(0) } >天籁</div>
                    <div className={ `butn e-tab-s et-tab-i et-tab-1${showGroup === 1 ? '-a' : ''}` }
                        onClick={ () => this.changeGroup(1) } >风云</div>
                    <div className={ `butn e-tab-s et-tab-i et-tab-2${showGroup === 2 ? '-a' : ''}` }
                        onClick={ () => this.changeGroup(2) } >偶像</div>
                    <div className={ `butn e-tab-s et-tab-i et-tab-3${showGroup === 3 ? '-a' : ''}` }
                        onClick={ () => this.changeGroup(3) } >元气</div>
                    <div className={ `butn e-tab-s et-tab-i et-tab-4${showGroup === 4 ? '-a' : ''}` }
                        onClick={ () => this.changeGroup(4) } >魅力</div>
                </div>
                <div className="event-rank border-deco">
                    <div className="es-tab fl-box">
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(0) }
                            onClick={ () => this.changeStage(0) } >
                            <div className="date">12.10</div>
                            <div className="es-tab-s et-stab-0">21进18</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(1) }
                            onClick={ () => this.changeStage(1) } >
                            <div className="date">12.11</div>
                            <div className="es-tab-s et-stab-1">18进15</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(2) }
                            onClick={ () => this.changeStage(2) } >
                            <div className="date">12.12</div>
                            <div className="es-tab-s et-stab-2">15进10</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(3) }
                            onClick={ () => this.changeStage(3) } >
                            <div className="date">12.13</div>
                            <div className="es-tab-s et-stab-3">10进7</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(4) }
                            onClick={ () => this.changeStage(4) } >
                            <div className="date">12.14</div>
                            <div className="es-tab-s et-stab-4">7进3</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(5) }
                            onClick={ () => this.changeStage(5) } >
                            <div className="date">12.15</div>
                            <div className="es-tab-s et-stab-5">四强争霸</div>
                        </div>
                    </div>
                    <div className="pre-s rank-h"></div>
                    <div className={ `es-list game-rank es-list-${showStage} es-group-${showGroup}` }>
                        { this.listJSX() }
                    </div>
                </div>
                <div className="floater butn e-icon-s btn-et-rule" onClick={ this.showRule } >单项赛规则</div>

                { this.state.ruleState && <EventRule onClose={ this.onClose } /> }
            </div>
        )
    }
}
