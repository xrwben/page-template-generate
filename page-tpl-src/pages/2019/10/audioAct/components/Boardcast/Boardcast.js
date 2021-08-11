/* 广播 */
import { Component, createRef } from 'react'

export default class Boardcast extends Component {
    constructor (props) {
        super(props)

        this.msgWrapper = createRef()
        this.aniHandler = null
    }

    runBoard () {
        var msgWrapper = this.msgWrapper.current
        var allWidth = msgWrapper.scrollWidth
        var cWidth = msgWrapper.clientWidth

        if (allWidth <= cWidth) {
            return
        }
        var left = 0
        var step = 0.6

        var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

        function run () { // eslint-disable-line
            left -= step
            msgWrapper.style.transform = 'translate3d(' + left + 'px, 0px, 0px)'
            msgWrapper.style.webkitTransform = 'translate3d(' + left + 'px, 0px, 0px)'

            if (Math.abs(left) > (allWidth / 2)) {
                left = 0
            }

            requestAnimationFrame(run)
        }

        this.aniHandler = requestAnimationFrame(run)
    }

    getlist () {
        let msg = this.props.msg
        if (msg.length === 1) {
            msg = [msg[0], msg[0], msg[0], msg[0]]
        } else {
            msg = msg.concat(msg)
        }
        return msg.map((info, ifi) => (
            <div key={'board_1_' + ifi} className="msg-info">恭喜 { info } 今日开启15%额外分成</div>
        ))
    }

    render () {
        var list = this.getlist()
        return (
            <div className="msg-board">
                <div className="msg-board-warp">
                    { (!this.props.msg || this.props.msg.length === 0)
                        ? (<div className="msg-holder">收礼超10000{ this.perName }部分，即可额外分成15%！</div>) : (
                            <div className="msg-board-c" ref={ this.msgWrapper }>
                                { list }
                            </div>
                        ) }
                </div>
            </div>
        )
    }
}
