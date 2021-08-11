import { PureComponent } from 'react'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { sendThks } from '../../service'

export default class GiveLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            buyInput: 0
        }

        this.buyInput = (evt) => {
            var value = this.ifilter(evt.target.value)

            evt.target.value = value
            this.setState({
                buyInput: value
            })
        }

        this.give = () => {
            if (this.state.buyInput === 0) return
            if (this.state.buyInput > this.props.canGiveNum) return

            const target = this.props.target
            if (!target || !target.uid) {
                $toast.show('target | target.uid not exist')
                return
            }

            $loading.show()
            sendThks(target.uid, this.state.buyInput).then((res) => {
                $loading.hide()
                $toast.show(res.msg)

                this.props.onClose()
                this.props.refreshThk()
            }).catch((err) => {
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

        if (value > this.props.canGiveNum) {
            value = this.props.canGiveNum
        }
        if (value <= 0) {
            value = 0
        }

        return value
    }

    render () {
        const { target, canGiveNum } = this.props

        return (
            <div className="layer layer-give">
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ this.props.onClose }></div>
                    <div className="num-left">我还可送<span className="txt-r">{ canGiveNum }</span>个</div>
                    <div className="headpic">
                        <img className="avatar" src={ target.headPic } alt="用户头像" />
                    </div>
                    <div className="nickname fl-box">
                        <div className="name txt-of">{ target.nickname }</div>
                        <span className={ `level_icon u_level_icon_${target.level}` }></span>
                    </div>
                    <div className="input-num fl-box">
                        <span className="label">请输入数量：</span>
                        <input className="input-i" value={ this.state.buyInput } onChange={ this.buyInput } />
                        <span className="per">个</span>
                    </div>
                    <div className="give-opt fl-box">
                        <div className="butn btn-s btn-give" onClick={ this.give }>赠送</div>
                        <div className="butn btn-s btn-cancel2" onClick={ this.props.onClose }>取消</div>
                    </div>
                </div>
            </div>
        )
    }
}
