import { PureComponent, createRef } from 'react'
import PCScroller from '../PCScroller/PCScroller'
import { getCartRecord } from '../../service'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

export default class RecordLayer extends PureComponent {
    constructor (props) {
        super(props)

        this.pcScroller = createRef()

        this.onScroll = (evt) => {
            var bh = 150
            var target = evt.target
            var toBottomH = target.scrollHeight - target.scrollTop - target.clientHeight

            if (toBottomH < bh) {
                this.loadRecord().catch(err => {
                    console.log(err.message)
                })
            }
        }

        this.loading = false
        this.hasNext = true
        this.pageNo = 0

        this.state = {
            list: []
        }
    }

    componentDidMount () {
        $loading.show()
        this.loadRecord().then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    loadRecord () {
        if (!this.hasNext) {
            return Promise.reject(new Error(`[loading record]: 没有更多数据...`))
        }
        if (this.loading) {
            return Promise.reject(new Error(`[load record]: loading 正在加载中... 请稍后`))
        }

        this.loading = true

        return getCartRecord(this.pageNo).then(data => {
            this.loading = false
            this.pageNo += 1

            this.hasNext = data.length !== 0

            this.setState({
                list: this.state.list.concat(data)
            }, () => {
                if (this.pageNo !== 1) return
                const pcSRef = this.pcScroller.current
                if (pcSRef && pcSRef._resetBox) {
                    pcSRef._resetBox()
                    pcSRef._refresh()
                }
            })
        })
    }

    rListContent () {
        return this.state.list.length === 0
            ? <div className="rec-holder">空空如也，快去为Ta清空购物车吧！</div>
            : this.state.list.map((record, rci) => (
                <div className="rec-row fl-box" key={ 'rec-row-' + rci }>
                    <div className="rec-cell cell-1 txt-of">{ record.nickname }</div>
                    <div className="rec-cell cell-2 txt-of">{ record.awardMsg.replace(/克拉/g, this.perName) }</div>
                    <div className="rec-cell cell-3 txt-of">{ record.time }</div>
                </div>
            ))
    }

    render () {
        return (
            <div className="layer layer-record">
                <div className="layer-content">
                    <div className="layer-c-w">
                        <div className="butn btn-s btn-close" onClick={ () => this.props.onClose() }></div>
                        <div className="layer-main">
                            <div className="rec-h fl-box">
                                <div className="cell-1"><span className="pic-s txt-c1"></span></div>
                                <div className="cell-2"><span className="pic-s txt-c2"></span></div>
                                <div className="cell-2"><span className="pic-s txt-c3"></span></div>
                            </div>
                            {
                                this.pageType === 'pc' ? (
                                    <PCScroller
                                        ref={ this.pcScroller }
                                        nodiff={ true }
                                        className="rec-list"
                                        right="10"
                                        thumbColor="#fdd254"
                                        onScroll={this.onScroll} >
                                        { this.rListContent() }
                                    </PCScroller>
                                ) : (
                                    <div className="rec-list" onScroll={this.onScroll}>{ this.rListContent() }</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
