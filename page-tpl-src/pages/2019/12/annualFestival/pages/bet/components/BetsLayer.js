import { PureComponent } from 'react'

import $toast from '../../../plugins/toast'
import $loading from '../../../plugins/loading'
import { makeBets } from '../../../service'

export default class BetsLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            betNumber: '',
            activeOpt: typeof props.betOpt !== 'undefined' ? props.betOpt : -1,
            expect: 0
        }

        this.betInput = (evt) => {
            var value = this.ifilter(evt.target.value)

            evt.target.value = value
            this.setState({
                betNumber: value
            })

            this.calcExpect(value || 0)
        }

        this.choose = (optInd) => {
            if (this.state.activeOpt === optInd) return

            this.setState({
                activeOpt: optInd
            })

            this.calcExpect(this.state.betNumber)
        }

        this.goBet = () => {
            this.goToBet()
        }
    }

    ifilter (value) {
        if (value === '') {
            return ''
        }

        value = +value.replace(/[^0-9]+/g, '')

        /* 限制输入范围 */
        if (value > this.props.ticket) {
            value = this.props.ticket
        }
        // if (value <= 5) {
        //     value = 5
        // }

        return value
    }

    betOn (num) {
        if (num > this.props.ticket) {
            $toast.show('超出背包助力票上限')
            return
        }

        this.setState({
            betNumber: num
        })

        this.calcExpect(num)
    }

    calcExpect (dVal) {
        const value = dVal

        const target = this.props.target
        const awardNum = (+target.award_num) || 0

        let myside = 0
        let otherside = 0
        if (this.state.activeOpt === 0) {
            myside = target.selection1_progress
            otherside = target.selection2_progress
        } else {
            myside = target.selection2_progress
            otherside = target.selection1_progress
        }

        const expect = (value * (awardNum + otherside) / (value + myside)) || 0

        this.setState({
            expect: Math.ceil(expect)
        })
    }

    goToBet () {
        const { betNumber, activeOpt } = this.state
        const target = this.props.target

        if (activeOpt !== 1 && activeOpt !== 0) {
            $toast.show('请选择投注选项')
            return
        }

        if (!betNumber || betNumber < 5) {
            $toast.show('投注的下限助力票为5')
            return
        }

        if (betNumber > this.props.ticket) {
            $toast.show('超出背包助力票上限')
            return
        }

        $loading.show()
        makeBets(target.id, activeOpt + 1, betNumber).then(data => {
            $loading.hide()
            $toast.show('您已成功投注，祝您竞猜获胜！')
            this.props.onSuccessBet(betNumber)
            this.props.onClose()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        const { target, ticket } = this.props

        return (
            <div className="layer layer-bet-rule">
                <div className="layer-c">
                    <div className="common-s butn btn-close" onClick={ this.props.onClose }></div>
                    <div className="layer-m">
                        <div className="timu-h">{ target.title }</div>

                        <div className="options fl-box">
                            <div className="label">我猜：</div>
                            <div
                                className={ `bet-s butn icon-opt1 opt-a ${this.state.activeOpt === 0 && 'active'}` }
                                onClick={ () => this.choose(0) } >
                                <span className="opt-txt txt-of">{ target.selection1 }</span>
                            </div>
                            <div
                                className={ `bet-s butn icon-opt2 opt-b ${this.state.activeOpt === 1 && 'active'}` }
                                onClick={ () => this.choose(1) } >
                                <span className="opt-txt txt-of">{ target.selection2 }</span>
                            </div>
                        </div>

                        <div className="bet-input fl-box">
                            <div className="bet2-s txt-tz">投注:</div>
                            <input
                                className="input"
                                placeholder="请输入5个及以上"
                                value={ this.state.betNumber }
                                onChange={ this.betInput } />
                            <div className="bet2-s txt-tk">助力票</div>
                        </div>

                        <div className="bet-choice fl-box">
                            <div className="butn bet-choice-i" onClick={ () => this.betOn(10) } >10</div>
                            <div className="butn bet-choice-i" onClick={ () => this.betOn(100) }>100</div>
                            <div className="butn bet-choice-i" onClick={ () => this.betOn(1000) }>1000</div>
                        </div>

                        <div className="bet-expect">胜利预计获得：助力票*<span className="lh">{ this.state.expect }</span></div>

                        <div className="tiper">
                            <div className="bet-mt">剩余助力票*<span className="lh">{ ticket }</span></div>
                            <div className="butn bet2-s btn-ok" onClick={ this.goBet }>确认</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
