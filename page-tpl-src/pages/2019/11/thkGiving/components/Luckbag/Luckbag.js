import { PureComponent } from 'react'
import luckbagPic from '../../images/luckbag.png'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { lottery } from '../../service'

export default class Luckbag extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            showlb: false
        }

        this.openBl = () => {
            if (this.pageType === 'pc') {
                $toast.show('请移步至客户端开启福袋~')
                return
            }

            if (this.props.isOpen) {
                return
            }

            $loading.show()
            lottery().then(res => {
                $loading.hide()

                if (res.errno !== 0) {
                    $toast.show(res.msg)
                    return
                }

                this.setState({
                    showlb: true
                }, () => {
                    setTimeout(() => {
                        $toast.show(res.msg)
                        this.props.openBag()
                    }, 1400)
                })
            }).catch(err => {
                $loading.hide()
                $toast.show(err.message)
            })
        }
    }

    prog () {
        if (this.props.stage > 1) return null

        if (this.props.isOpen) {
            return (
                <div className="butn btn-2-s btn-isopen"></div>
            )
        }

        if (this.props.value >= 100) {
            return (
                <div className="butn btn-2-s btn-open" onClick={ this.openBl }></div>
            )
        }

        return (
            <div className="prog">
                <div className="bar" style={{ width: Math.min(this.props.value, 100) + '%' }}></div>
                <div className="val">{ this.props.value }/100</div>
            </div>
        )
    }

    render () {
        return (
            <div className="luckbag wrap-box">
                <div className="wrap-c">
                    <div className="h-title h-luckbag">抽福袋 100%中奖</div>
                    <div className="luckbag-c">
                        <div className="luck-pic">
                            <div className="pic-c">
                                <img className="bag" src={ luckbagPic } alt="福袋" />
                            </div>
                            { this.prog() }
                        </div>
                        <div className="luck-info">
                            <div className="luck-i"><span className="bold">每日累计送出活动礼物 ≥ 100 感恩值，即可开启福袋，100%中奖哦！</span></div>
                            <div className="luck-i"><span className="bold">福袋奖品：</span>助力票、幸运火鸡、火鸡盛宴、感恩红包、广播卡</div>
                            <div className="luck-i-tip">注：抽奖机会于当日23:59:59失效，请及时抽奖，每个设备号仅限一个ID参与抽奖！</div>
                        </div>
                    </div>
                    <div className="butn btn-s btn-rw" onClick={ this.props.onMyRw } >我的奖品</div>
                </div>

                <div className={ this.state.showlb ? 'open-box active' : 'open-box' }>
                    <div className="pic-light"></div>
                    <div className="pic-lb"></div>
                    <div className="pic-stars star1"></div>
                    <div className="pic-stars star2"></div>
                </div>
            </div>
        )
    }
}
