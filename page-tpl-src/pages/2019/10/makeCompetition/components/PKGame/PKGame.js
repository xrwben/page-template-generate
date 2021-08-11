import { PureComponent } from 'react'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { getPkRank } from '../../service'
import PKItem from './PKItem'

export default class PkGame extends PureComponent {
    constructor (props) {
        super(props)

        this.interval = null

        this.state = {
            subStage: props.showStage - 5,
            showSubStage: props.showStage - 5,
            pklist: []
        }
    }

    componentDidMount () {
        this.loadStage(this.state.showSubStage)

        if (this.props.stage < 10) {
            this.pollLoadStage()
        }
    }

    componentWillUnmount () {
        if (this.interval) {
            clearTimeout(this.interval)
        }
    }

    pollLoadStage () {
        if (this.interval) {
            clearTimeout(this.interval)
        }
        this.interval = setTimeout(() => {
            getPkRank(this.state.showSubStage).then(data => {
                const len = [8, 4, 2, 1][this.state.showSubStage - 1]

                if (data.length < len) {
                    data = data.concat(Array(len - data.length).fill(null))
                }

                this.setState({
                    pklist: data
                })

                this.interval = null

                this.pollLoadStage() // ! 这里没有设置停止条件
            }).catch(err => {
                console.log(err)
            })
        }, 5000)
    }

    loadStage (stage) {
        $loading.show()
        getPkRank(stage).then(data => {
            const len = [8, 4, 2, 1][stage - 1]

            if (data.length < len) {
                data = data.concat(Array(len - data.length).fill(null))
            }

            $loading.hide()
            this.setState({
                pklist: data
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    changeTab (tabInd) {
        if (tabInd > this.state.subStage) {
            switch (tabInd) {
            case 2: $toast.show('19日 16:00:00 开启'); break
            case 3: $toast.show('20日 00:00:00 开启'); break
            case 4: $toast.show('20日 16:00:00 开启'); break
            }
            return
        }
        if (tabInd === this.state.showSubStage) return

        this.setState({
            showSubStage: tabInd
        }, () => {
            if (this.props.stage !== 10 && this.state.showSubStage === this.state.subStage) {
                this.pollLoadStage()
            } else {
                clearTimeout(this.interval)
            }
        })
        this.loadStage(tabInd)
    }

    getEndStatus () {
        return [
            '19日 15:59:59 结束该轮比赛',
            '19日 23:59:59 结束该轮比赛',
            '20日 15:59:59 结束该轮比赛',
            '20日 23:59:59 决出最终擂主'
        ][this.state.showSubStage - 1]
    }

    render () {
        return (
            <div className={ 'game game-pk pk-stage-' + this.state.showSubStage }>
                <div className="game-rule">
                    <div className="game-r-h">擂主争霸赛</div>
                    <div className="game-r-i">1、该阶段将进行4轮的 1 v 1 比拼，最后的赢家则成为擂主；</div>
                    <div className="game-r-i">2、八强赛：19日 00:00:00 - 15:59:59，四强赛：19日 16:00:00 - 23:59:59、半决赛：20日 00:00:00 - 15:59:59；擂主争霸：20日 16:00:00 - 23:59:59；</div>
                    <div className="game-r-i">3、每一轮比赛的胜者累计自己本轮30%的战力计入下一轮中；</div>
                    <div className="game-r-i">4、活动期间送礼量大，服务器会有一定程度的延迟，请提前10秒冲榜，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单情况，平台不予补偿，请谅解！</div>
                </div>
                <div className="game-box-1">
                    <div className="game-box-2">
                        <div className="game-box-3">
                            <div className="pk-tab fl-box">
                                {
                                    ['八强赛', '四强赛', '半决赛', '擂主争霸'].map((tabName, tind) => {
                                        return (
                                            <div
                                                key={ 'sub-tab-' + tind }
                                                className={ 'butn pk-tab-i btn-s tab-pk-' + (tind + 1) + (this.state.showSubStage === (tind + 1) ? '-a' : '') }
                                                onClick={ () => { this.changeTab(tind + 1) } }>{ tabName }</div>
                                        )
                                    })
                                }
                            </div>
                            <div className="pk-end-status">{ this.getEndStatus() }</div>
                            {
                                this.state.pklist.map((item, ind) => (
                                    <PKItem
                                        key={ 'pklist_' + ind }
                                        item={ item }
                                        goRoom={ this.goRoom }
                                        isEnd={ this.state.showSubStage === 4 ? (this.props.stage === 10) : (this.state.showSubStage < this.state.subStage) } />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
