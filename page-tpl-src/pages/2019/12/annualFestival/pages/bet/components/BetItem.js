import { PureComponent, createRef } from 'react'

export default class BetItem extends PureComponent {
    constructor (props) {
        super(props)

        this.counter = createRef()
        this.st = Date.now()
        this.timer = null
    }

    componentDidMount () {
        const end = this.props.item.end_sec
        if (end < 0) {
            return
        }
        if (this.props.item.end_sec < 1800) {
            // 小于30min
            this.doCount()
        } else {
            // -> do nothing
        }
    }

    componentWillUnmount () {
        this.timer && clearTimeout(this.timer)
    }

    doCount () {
        const pass = (Date.now() - this.st) / 1000
        const end = this.props.item.end_sec - pass
        const ins = this.counter.current

        /* 倒计时到期 */
        if (end < 0) {
            ins.innerText = ''
            this.props.countDown()
            return
        }

        let min = end / 60 >> 0
        let sec = end % 60 >> 0

        min = min < 10 ? '0' + min : min
        sec = sec < 10 ? '0' + sec : sec

        ins.innerText = min + ':' + sec
        this.timer = setTimeout(() => {
            this.doCount()
        }, 1000)
    }

    calcW (left, right) {
        const la = Math.max(left || 0, 1)
        const lb = Math.max(right || 0, 1)
        const total = la + lb
        return Math.min(Math.max(la / total * 100, 30), 70).toFixed(2)
    }

    timeBoxJSX () {
        const { item } = this.props
        return item.end_sec < 1800 && item.end_sec > 0
            ? (<div className="end-time"><span className="hl" ref={ this.counter }></span>后停止竞猜</div>)
            : (<div className="end-time">今日<span className="hl">{ item.end_time }</span>之前停止竞猜</div>)
    }

    render () {
        const { item } = this.props

        // 计算进度条
        const { selection1_progress, selection2_progress } = item // eslint-disable-line
        const left = this.calcW(selection1_progress, selection2_progress)

        return (
            <div className="timu-item">
                {
                    this.timeBoxJSX()
                }

                <div className="timu-h txt-of">{ item.title }</div>
                <div className="options fl-box">
                    <div className="bet-s butn icon-opt1 opt-a" onClick={ () => this.props.onBet(0) }>
                        <span className="opt-txt txt-of">{ item.selection1 }</span>
                    </div>
                    <div className="bet-s butn icon-opt2 opt-b" onClick={ () => this.props.onBet(1) }>
                        <span className="opt-txt txt-of">{ item.selection2 }</span>
                    </div>
                </div>
                <div className="progress">
                    <div className="progress-i fl-box">
                        <div className="tube-a" style={ { width: left + '%' } }></div>
                        <div className="tube-b"></div>
                    </div>
                    <div className="prog-val left">{ item.selection1_progress }</div>
                    <div className="prog-val right">{ item.selection2_progress }</div>
                    <div className="bet-s prog-i" style={ { left: left + '%' } }></div>
                </div>
                <div className="tiper">注：本轮竞猜平台额外奖励获胜方瓜分助力票*{ item.award_num }</div>
            </div>
        )
    }
}
