import { getPlatformType, getPackageId } from 'common'
import { Component, createRef } from 'react'
import Boardcast from './components/Boardcast/Boardcast'

import $loading from './plugins/loading'
import $toast from './plugins/toast'
import axios from 'axios'

function apiHandler (res) {
    if (res.status === 200) {
        return res.data
    } else {
        console.error('[service.apiHandler]:', res.message)
        throw new Error(res.message)
    }
}

function dataHandler (data) {
    if (data.errno === 0) {
        return data.data
    } else {
        console.error('[service.dataHandler]:', data.msg)
        throw new Error(data.msg)
    }
}

const service = {
    init () {
        return axios.get('/audioActivity/getInfo').then(apiHandler).then(dataHandler)
    }
}

export default class App extends Component {
    constructor (props) {
        super(props)

        Component.prototype.perName = this.getPerName()

        this.boardcast = createRef()

        this.state = {
            started: false,
            mod: null,
            msg: []
        }
    }

    componentDidMount () {
        $loading.show()
        service.init().then(data => {
            $loading.hide()
            this.setState({
                started: data.started,
                mod: !data.isMod ? null : {
                    headPic: data.headPic,
                    coin: data.coin,
                    left: data.left
                },
                msg: data.nicknames
            }, () => {
                if (this.state.msg.length === 0) return
                this.boardcast.current.runBoard()
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    getPerName () {
        if (this.pageType === 'pc') return '克拉'
        const platform = getPlatformType() // eslint-disable-line
        const per = getPackageId() // eslint-disable-line

        /* 语音包 分包单位 */
        if ([1, 9, 18, 19, 20, 22, 23, 24, 26, 27].indexOf(+per) !== -1) {
            return '钻石'
        }

        /* ios 分包单位 */
        if (platform !== 'ios_webview') {
            return '克拉'
        }

        if (per === '12') {
            return '甜蜜'
        }

        return '克拉'
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    <div className="banner"></div>
                    <div className="rules">
                        <div className="rule-h"></div>
                        <div className="rule-c">
                            <p className="rule-i">1. 活动时间：10.15 00:00:00 - 此页面下线</p>
                            <p className="rule-i">2. 个人每日收到礼物累计价值10000{ this.perName }以内50%分成，超出10000{ this.perName }部分65%分成。另外活动期间，超出10000{ this.perName }部分在每次收礼时即时发放该礼物价值的15%分成至账户收益。相当于超出10000{ this.perName }部分分成是80%！</p>
                            <p className="rule-i">注1：当今日一次收到可以累积达标10000{ this.perName }的礼物，超出10000{ this.perName }部分的{ this.perName }无额外分成。例如：主播今日还差2000{ this.perName }达到10000{ this.perName }，今日又收到2999{ this.perName }礼物，那么一共10999{ this.perName }礼物无额外分成奖励，之后每次收礼时即时发放该礼物价值的15%分成至账户收益。</p>
                            <p className="rule-i">注2：次日从零计算累计礼物价值。</p>
                            <p className="rule-i">3.对活动有任何问题，可加微信（ID：<span className="txt-hl">gjyy_01</span>）咨询。</p>
                        </div>
                    </div>
                    <Boardcast ref={ this.boardcast } msg={ this.state.msg }/>
                    {
                        this.state.mod && (this.state.started ? (
                            <div className="mod-info">
                                <div className="mod-avatar">
                                    <div className="cown"></div>
                                    <img className="mod-headpic" src={ this.state.mod.headPic } alt="主播头像" />
                                </div>
                                <p className="info-1">今日累计收礼：<span className="cl-pr">{ this.state.mod.coin }</span> { this.perName }</p>
                                {
                                    this.state.mod.left <= 0 ? <p className="info-2">今日开启15%额外分成</p> : (
                                        <p className="info-2">距离获得15%额外分成还差 <span className="cl-db">{ this.state.mod.left }</span> { this.perName }</p>
                                    )
                                }
                            </div>
                        ) : (
                            <div className="mod-info">
                                <div className="mod-holder">活动还未开始</div>
                            </div>
                        ))
                    }
                    <div className="footer">在法律允许的范围内，本活动的解释权归平台所有</div>
                </div>
            </div>
        )
    }
}
