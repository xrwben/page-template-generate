import { PureComponent } from 'react'

import './style.less'
import BetItem from './components/BetItem'
import BetRankItem from './components/BetRankItem'
import MyBets from './components/MyBets'
import BetsRule from './components/BetsRule'
import BetsLayer from './components/BetsLayer'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { getBets, getBetRanks } from '../../service'

export default class BetPage extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            inited: false,
            stage: 0, // 是否在活动期间

            // 竞猜轮播
            cari: 0,

            ticket: 0,
            bets: [],

            list: [],

            betState: false,
            betTarget: null,
            betOpt: -1,

            ruleState: false,

            myBetState: false,
            myBetList: []
        }

        this.cariPrev = () => {
            const { cari } = this.state
            // 第一个点击无效
            if (cari <= 0) return

            this.setState({
                cari: cari - 1
            })
        }

        this.cariNext = () => {
            const { cari } = this.state
            // 最后一个点击无效
            if (cari >= this.state.bets.length - 0) return

            this.setState({
                cari: cari + 1
            })
        }

        // 我的竞猜数据
        this.goMyBets = () => {
            if (!this.props.proxy.islogin) {
                this.goLogin()
                return
            }

            this.setState({
                myBetState: true
            })
        }

        this.onMyBetsClose = () => {
            this.setState({
                myBetState: false
            })
        }

        this.onRuleClose = () => {
            this.setState({
                ruleState: false
            })
        }

        this.showRule = () => {
            this.setState({
                ruleState: true
            })
        }

        this.onBetClose = () => {
            this.setState({
                betState: false
            })
        }

        // 竞猜倒计时结束时刷新竞猜
        this.onCountDown = () => {
            this.initPage()
        }

        // 投注
        this.onBet = (ind, opt) => {
            if (!this.props.proxy.islogin) {
                this.goLogin()
                return
            }

            const target = this.state.bets[ind]

            if (!target) {
                console.log('投注数据错误')
                return
            }

            if (target.isJoin) {
                $toast.show('本轮竞猜您已投注，看看别的竞猜吧~')
                return
            }

            if (target.end_sec < 0) {
                $toast.show('本轮已停止竞猜，看看别的竞猜吧~')
                return
            }

            this.setState({
                betState: true,
                betTarget: this.state.bets[ind],
                betOpt: opt
            })
        }

        // 投注成功后的数据刷新
        this.onSuccessBet = () => {
            this.initPage()
        }
    }

    componentDidMount () {
        this.initPage()
    }

    initPage () {
        $loading.show()
        Promise.all([
            this.loadBets(),
            this.loadRanks()
        ]).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    loadBets () {
        return getBets().then(data => {
            this.setState({
                inited: true,
                stage: data.isActivity,
                bets: data.isActivity === 1 ? data.data : [],
                ticket: data.ticket
            })
        })
    }

    loadRanks () {
        return getBetRanks().then(data => {
            const ranks = data.concat(
                new Array(10 - data.length).fill(null)
            )

            this.setState({
                myBetList: ranks
            })
        })
    }

    getTimuHolder () {
        if (!this.state.inited) return null
        if (this.state.stage === 0) {
            return <div className="holder">年度未开始</div>
        }
        if (this.state.stage === 1) {
            if (this.state.bets.length === 0) {
                return <div className="holder">当前暂无竞猜</div>
            } else {
                return this.state.bets.map((item, ind) => (
                    <BetItem
                        key={ item.id }
                        item={ item }
                        countDown={ this.onCountDown }
                        onBet={ (opt) => this.onBet(ind, opt) } />
                ))
            }
        }

        return <div className="holder">年度已结束</div>
    }

    render () {
        const { cari } = this.state

        return (
            <div className="page-r bet">
                <div className="bet-box">
                    <div className="bet-s h-curr-bet"></div>
                    {/* 竞猜题 */}
                    <div className="timu-box">
                        <div
                            className="timu-list"
                            style={ { transform: 'translateX(-' + 100 * cari + '%)' } } >
                            {
                                this.getTimuHolder()
                            }
                        </div>
                    </div>

                    <div
                        className="bet-s butn icon-next prev"
                        style={ { display: this.state.cari > 0 ? '' : 'none' } }
                        onClick={ this.cariPrev } />
                    <div
                        className="bet-s butn icon-next next"
                        style={ { display: this.state.cari < this.state.bets.length - 1 ? '' : 'none' } }
                        onClick={ this.cariNext } />

                    <div className="bet-s butn btn-my-bet" onClick={ this.goMyBets }>我的竞猜</div>
                </div>

                <div className="bet-rank border-deco">
                    <div className="bet-h bet-s br-h"></div>
                    <div className="bet-s br-list-h"></div>
                    <div className="bet-rank-c">
                        {
                            this.state.myBetList && this.state.myBetList.map((item, ind) => <BetRankItem ind={ ind + 1 } target={ item } key={ 'br-i-' + ind } />)
                        }

                        <div className="rank-tip">仅展示前10位用户</div>
                    </div>
                </div>

                <div className="floater bet-s butn btn-rule" onClick={ this.showRule }>竞猜规则</div>

                { this.state.myBetState && <MyBets stage={ this.state.stage } onClose={ this.onMyBetsClose } /> }

                { this.state.ruleState && <BetsRule onClose={ this.onRuleClose } /> }

                { this.state.betState &&
                    <BetsLayer
                        onClose={ this.onBetClose }
                        target={ this.state.betTarget }
                        ticket={ this.state.ticket }
                        betOpt={ this.state.betOpt }
                        onSuccessBet={ this.onSuccessBet } /> }
            </div>
        )
    }
}
