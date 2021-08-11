import { PureComponent } from 'react'
import { getMyBets } from '../../../service'
import PCScroller from '../../../components/PCScroller/PCScroller'

import $loading from '../../../plugins/loading'
import $toast from '../../../plugins/toast'

function calcW (left, right) {
    const la = Math.max(left || 0, 1)
    const lb = Math.max(right || 0, 1)
    const total = la + lb
    return Math.min(Math.max(la / total * 100, 30), 70).toFixed(2)
}

function MyBetItem (props) {
    const { item } = props

    // 计算进度条
    const { selection1_progress, selection2_progress } = item // eslint-disable-line
    const left = calcW(selection1_progress, selection2_progress)

    return (
        <div className="my-bets-i">
            <div className="timu-h">{ item.title }</div>
            <div className="progress">
                <div className="progress-i fl-box">
                    <div className="tube-a" style={ { width: left + '%' } }></div>
                    <div className="tube-b"></div>
                </div>
                <div className="prog-label txt-of left">{ item.selection1 }</div>
                <div className="prog-val left">{ item.selection1_progress }</div>
                <div className="prog-val right">{ item.selection2_progress }</div>
                <div className="prog-label txt-of right">{ item.selection2 }</div>
                <div className="bet-s prog-i" style={ { left: left + '%' } }></div>
            </div>
            <div className="details">
                <div className="d-row fl-box">
                    <div className="d-cell txt-of">我的竞猜：{ item.my_guess }</div>
                    <div className="d-cell txt-of">竞猜助力票：{ item.vote_num }</div>
                </div>
                <div className="d-row fl-box strip">
                    <div className="d-cell txt-of">结果：<span className="lh">{ item.result }</span></div>
                    <div className="d-cell txt-of">盈亏：<span className="lh">{ item.result.indexOf('待公布') !== -1 ? '待公布' : item.win_num }</span></div>
                </div>
                <div className="d-row fl-box">
                    <div className="d-cell txt-of">平台奖励助力票*{ item.award_num }</div>
                    <div className="d-cell txt-of">竞猜时间：{ item.vote_time.slice(5) }</div>
                </div>
            </div>
        </div>
    )
}

export default class MyBets extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            inited: false,

            histories: []
        }

        this.listInited = false
        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        this.onScroll = (evt) => {
            var bh = 150
            var target = evt.target
            var toBottomH = target.scrollHeight - target.scrollTop - target.clientHeight

            if (toBottomH < bh) {
                this.loadMyBets().catch(err => {
                    console.log(err.message)
                })
            }
        }
    }

    componentDidMount () {
        $loading.show()
        this.loadMyBets().then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    loadMyBets () {
        if (!this.hasNext) {
            return Promise.reject(new Error(`[loading MyBets]: 没有更多数据...`))
        }
        if (this.loading) {
            return Promise.reject(new Error(`[loading MyBets]: loading 正在加载中... 请稍后`))
        }

        this.loading = true

        return getMyBets(this.pageNo).then(data => {
            this.pageNo += 1
            this.loading = false

            if (data.length === 0) {
                this.hasNext = false
            }

            this.setState({
                inited: true,
                histories: this.state.histories.concat(data)
            })
        })
    }

    getHolder () {
        if (this.props.stage === 2) {
            return <div className="holder">哎，年度结束了，不能一起玩了~</div>
        }
        return <div className="holder">大家都在玩的竞猜，就等你了！</div>
    }

    render () {
        const hisJSX = this.state.histories
            .map((item, mi) => <MyBetItem item={ item } key={ 'my-' + mi } />)
            .reduce((prev, item, cind) => {
                prev.push(item)
                prev.push(<div className="common-s sep" key={ 'sep-' + cind }></div>)
                return prev
            }, [])

        hisJSX.pop()

        const layerC = this.state.histories.length === 0 ? this.getHolder() : hisJSX

        return (
            <div className="layer layer-mybets">
                <div className="layer-c">
                    <div className="common-s butn btn-close" onClick={ this.props.onClose }></div>
                    <div className="bet2-s bet-h"></div>
                    {
                        !this.state.inited ? null : (this.pageType === 'pc' ? (
                            <PCScroller
                                className="layer-m"
                                right="10"
                                thumbColor="#efc65a"
                                onScroll={ this.onScroll }
                                canBubble={ true }
                            >
                                { layerC }
                            </PCScroller>
                        ) : (
                            <div className="layer-m">{ layerC }</div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
