import { PureComponent } from 'react'
import { getPkInfo } from '../../service'

export default class PkBar extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            from: 0,
            to: 0,
            winner: 'from'
        }

        this.duration = 5000
        this.isPolling = false
    }

    componentDidMount () {
        this.loadPkInfo()

        this.props.stage === 1 && this.startPolling()
    }

    componentDidUpdate () {
        if (this.props.stage === 1 && !this.isPolling) {
            this.startPolling()
        }
    }

    startPolling () {
        if (this.isPolling) return

        this.isPolling = true

        const counter = () => {
            this.loadPkInfo().then(() => {
                setTimeout(counter, this.duration)
            })
        }

        setTimeout(counter, this.duration)
    }

    loadPkInfo () {
        return getPkInfo().then((data) => {
            this.setState({
                from: data.from,
                to: data.to,
                winner: data.winner
            })
        })
    }

    calcW (left, right) {
        const la = Math.max(left || 0, 1)
        const lb = Math.max(right || 0, 1)
        const total = la + lb
        return Math.min(Math.max(la / total * 100, 8), 92).toFixed(2)
    }

    render () {
        return (
            <div className="pk-bar">
                <div className="pic-s h-rank">秀恩爱vs买买买</div>
                <div className={ this.props.stage === 2 ? ('bar end winner-' + this.state.winner) : 'bar' }>
                    <div className="bar-w" style={ { width: this.calcW(this.state.from, this.state.to) + '%' } }></div>
                    <div className="bar-deco-w">
                        <div className="pic-s bar-deco"></div>
                    </div>
                    <div className="l-val">
                        {
                            [].slice.call(String(this.state.from)).map((num, ni) => (
                                <div className={ 'num-s r-' + num } key={ 'r-' + ni }></div>
                            ))
                        }
                    </div>
                    <div className="r-val">
                        {
                            [].slice.call(String(this.state.to)).map((num, ni) => (
                                <div className={ 'num-s l-' + num } key={ 'l-' + ni }></div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}
