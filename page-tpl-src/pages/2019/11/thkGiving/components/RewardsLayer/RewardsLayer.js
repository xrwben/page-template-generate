import { PureComponent } from 'react'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { getRwRecord } from '../../service'

export default class RewardsLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            records: [],
            tickets: 0
        }
    }

    componentDidMount () {
        this.loadRecord()
    }

    loadRecord () {
        $loading.show()
        getRwRecord().then(data => {
            $loading.hide()

            this.setState({
                records: data.record,
                tickets: data.ticket
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        const records = []

        for (let i = this.state.records.length - 1; i >= 0; i--) {
            const rec = this.state.records[i]
            records.push(
                <div className="rewards-row">
                    <div className="tcell cell-1 txt-of">{ rec.award }</div>
                    <div className="tcell cell-2 txt-of">{ rec.time }</div>
                </div>
            )
        }

        return (
            <div className="layer layer-rewards">
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ this.props.onClose }></div>
                    <div className="rewards-th">
                        <div className="tcell cell-1">奖品</div>
                        <div className="tcell cell-2">中奖时间</div>
                    </div>
                    <div className="rewards-list">
                        {
                            !this.state.records || this.state.records.length === 0
                                ? (<div className="holder">空空如也，快去送出活动礼物攒感恩值吧！</div>)
                                : records
                        }
                    </div>
                    <div className="rewards-me">我的助力票：{ this.state.tickets } 张</div>
                    <div className="rewards-tiper">注：助力票为2019星光年度盛典礼物，不参与分成，于预选赛下发至背包；</div>
                </div>
            </div>
        )
    }
}
