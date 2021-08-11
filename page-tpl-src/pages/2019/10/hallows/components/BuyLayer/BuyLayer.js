import { PureComponent } from 'react'
import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { refreshBackpack } from 'common'

import { buyProduct } from '../../service'

export default class BuyLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.price = 9999

        this.state = {
            status: false,
            buyInput: 1
        }

        this.buyInput = (evt) => {
            var value = this.ifilter(evt.target.value)

            evt.target.value = value
            this.setState({
                buyInput: value
            })
        }

        this.goBuy = () => {
            const num = this.state.buyInput
            if (num <= 0 || num > 9999) {
                $toast.show('请输入正确的购买数量')
                return
            }
            $loading.show()
            buyProduct(num).then(res => {
                $loading.hide()
                this.hide()

                if (res.errno === 0) {
                    $toast.show('礼物已放至您的背包，请注意查收！')
                    if (refreshBackpack) refreshBackpack() // 刷新礼物背包
                } else {
                    if (res.msg === '余额不足，请充值再来！' || res.errno === 111) {
                        this.props.onRechargeCb()
                    } else {
                        $toast.show(res.msg)
                    }
                }
            }).catch(err => {
                $loading.hide()
                $toast.show(err.message)
            })
        }
    }

    ifilter (value) {
        if (value === '') {
            return 0
        }

        value = +value.replace(/[^0-9]+/g, '')

        if (value > 9999) {
            value = 9999
        }
        if (value <= 0) {
            value = 0
        }

        return value
    }

    show () {
        this.setState({
            status: true,
            buyInput: 1
        })
    }

    hide () {
        this.setState({
            status: false
        })
    }

    render () {
        return (
            <div className="layer layer-buy" style={ this.state.status ? {} : { display: 'none' } }>
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ () => this.hide() }></div>
                    <div className="input-i fl-box">
                        <div className="label icon-s txt-gm">购买</div>
                        <input
                            className="input"
                            type="text"
                            value={ this.state.buyInput }
                            onClick={ evt => evt.target.focus() }
                            onChange={ this.buyInput } />
                        <div className="per icon-s txt-ge">个</div>
                    </div>
                    <div className="price-i fl-box">
                        <div className="label">价格：</div>
                        <div className="num">{ this.state.buyInput * this.price }</div>
                        <div className="per">{ this.perName }</div>
                    </div>
                    <div className="butn btn-s btn-buy" onClick={ this.goBuy }>购买</div>
                </div>
            </div>
        )
    }
}
