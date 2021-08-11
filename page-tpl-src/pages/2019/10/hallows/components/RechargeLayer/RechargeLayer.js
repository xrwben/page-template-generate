import { PureComponent } from 'react'

export default class RechargeLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            status: false
        }
    }

    show () {
        this.setState({
            status: true
        })
    }

    hide () {
        this.setState({
            status: false
        })
    }

    render () {
        return (
            <div className="layer layer-recharge" style={ this.state.status ? {} : { display: 'none' } }>
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ () => this.hide() }></div>
                    <div className="icon-s txt-recharge">余额不足，快去充值吧！</div>
                    <div className="layer-opr fl-box">
                        <div className="butn btn-s btn-cancel" onClick={ () => this.hide() }>不了</div>
                        <div className="butn btn-s btn-recharge" onClick={ () => this.goRecharge() }>充值</div>
                    </div>
                </div>
            </div>
        )
    }
}
