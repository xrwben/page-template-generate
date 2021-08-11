/* 赛事 - 超级冠军赛 */
import { PureComponent } from 'react'
import RankItem from './components/EventRankItem'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { getFinalRanks } from '../../service'
import ChampionRule from './components/ChampionRule'

export default class EventContent extends PureComponent {
    constructor (props) {
        super(props)

        let showStage = 0

        if (props.activityStatus === -1) {
            showStage = 1
        } else {
            showStage = props.activityStatus - 9
        }

        this.state = {
            ruleState: false,

            maxStage: showStage,
            showStage,
            list: []
        }

        this.maxlen = [5, 3]

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
        getFinalRanks(this.state.showStage).then(data => {
            $loading.hide()

            const maxlen = this.maxlen[this.state.showStage]
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
        const showStage = this.state.showStage
        const list = this.state.list.map((target, ind) => {
            return (
                <RankItem
                    stage={ showStage }
                    ind={ ind + 1 }
                    key={'r-row-' + ind}
                    target={ target } />
            )
        })

        if (showStage === 0) {
            let holder
            if (this.props.activityStatus === 9) {
                holder = <div className="rank-tip tip-line" key="r-row-holder">以下将被淘汰</div>
            } else {
                holder = <div className="rank-tip tip-line" key="r-row-holder">以下已被淘汰</div>
            }
            list.splice(3, 0, holder)
        }

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
        const { showStage } = this.state

        return (
            <div className="champion-c">
                <div className="champion-rank border-deco">
                    <div className="user-bg"></div>
                    <div className="top-h"></div>
                    <div className="es-tab fl-box">
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(0) }
                            onClick={ () => this.changeStage(0) } >
                            <div className="date">12.16</div>
                            <div className="final-s f-tab-i0">5进3</div>
                        </div>
                        <div
                            className={ 'butn es-tab-i' + this.calcEsTab(1) }
                            onClick={ () => this.changeStage(1) } >
                            <div className="date">12.17</div>
                            <div className="final-s f-tab-i1">3强争霸</div>
                        </div>
                    </div>
                    <div className="pre-s rank-h"></div>
                    <div className={ `es-list game-rank es-list-${showStage}` }>
                        { this.listJSX() }
                    </div>

                    <div className="floater butn final-s btn-final-rule" onClick={ this.showRule } >超级冠军赛规则</div>

                    { this.state.ruleState && <ChampionRule onClose={ this.onClose } /> }
                </div>
            </div>
        )
    }
}
