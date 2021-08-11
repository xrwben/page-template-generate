import { PureComponent } from 'react'

export default class RechargeLayer extends PureComponent {
    render () {
        return (
            <div className="layer layer-recharge">
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ this.props.onClose }></div>
                    <div className="text">余额不足，快去充值吧！</div>
                    <div className="layer-opr fl-box">
                        <div className="butn btn-s btn-cancel" onClick={ this.props.onClose }>不了</div>
                        <div className="butn btn-s btn-charge" onClick={ () => this.goRecharge() }>充值</div>
                    </div>
                </div>
            </div>
        )
    }
}
