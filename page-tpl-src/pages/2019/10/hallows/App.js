import { Component, createRef } from 'react' // eslint-disable-line

import GiftSales from './components/GiftSales/GiftSales'
import HallowCP from './components/HallowCP/HallowCP'
import TopRank from './components/TopRank/TopRank'
import RuleLayer from './components/RuleLayer/RuleLayer'
import BuyLayer from './components/BuyLayer/BuyLayer'
import RechargeLayer from './components/RechargeLayer/RechargeLayer'

import $loading from './plugins/loading'
import $toast from './plugins/toast'

import { init, attend } from './service'

import 'core-js/modules/es.array.fill'

function getCookie () {
    const cookieStr = document.cookie
    const cookie = {}

    cookieStr.split(';').forEach(kv => {
        const target = kv.trim().split('=')
        cookie[target[0].trim()] = target[1].trim()
    })

    return cookie
}

Component.prototype.Cookie = getCookie()

export default class App extends Component {
    constructor (props) {
        super(props)

        this.state = {
            islogin: false,
            stage: 0,
            ambsor: {
                mid: null,
                rid: null,
                isLoved: false
            },
            couple: {
                mod_head: null,
                mod_nickname: null,
                mod_level: null,
                score: 0,
                user_head: null,
                user_nickname: null,
                user_level: 0
            },
            cpMyRank: {
                head: null,
                nickname: null,
                level: null,
                score: 0,
                tip: ''
            },

            ruleStatus: false
        }

        this.buyLayer = createRef()
        this.rechargeLayer = createRef()

        this.setRule = (value) => {
            this.setState({
                ruleStatus: value
            })
        }

        this.showBuyLayer = () => {
            if (this.state.stage < 1) {
                $toast.show('10.29 12:00后才可购买！')
                return
            }

            if (this.state.stage >= 3) {
                return
            }

            this.buyLayer.current.show()
        }

        this.onRechargeCb = () => {
            this.rechargeLayer.current.show()
        }

        this.setRuleStatus = (val) => {
            this.setState({
                ruleStatus: val
            })
        }

        this.attention = (info) => {
            if (!this.state.islogin) {
                this.goLogin()
                return Promise.reject(new Error('未登录'))
            }

            if (!info || (!info.id && !info.mid) || info.isLoved) {
                return Promise.reject(new Error('参数错误'))
            }

            $loading.show()
            return attend(info.id || info.mid).then(() => {
                $loading.hide()
            }).catch(err => {
                $loading.hide()
                $toast.show(err.message)
            })
        }

        this.onAmAtte = (info) => {
            this.attention(info).then(() => {
                this.setState({
                    ambsor: {
                        ...this.state.ambsor,
                        isLoved: true
                    }
                })
            })
        }
    }

    componentDidMount () {
        this.pageInit()
    }

    pageInit () {
        $loading.show()
        init().then(data => {
            $loading.hide()
            this.setState(prevState => {
                return {
                    islogin: data.isLogin,
                    stage: data.isActivity,

                    ambsor: {
                        mid: data.mid,
                        rid: data.rid,
                        isLoved: data.isLoved
                    },

                    couple: data.cpRank ? data.cpRank : prevState.couple,
                    cpMyRank: data.myRank
                }
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    <div className="banner"></div>
                    <div className="sub-h"></div>
                    {/* 活动礼物 */}
                    <GiftSales
                        ambsor={ this.state.ambsor }
                        onAtte={ this.onAmAtte }
                        onGoBuy={ () => this.showBuyLayer() }
                        stage={ this.state.stage } />
                    {/* 万圣CP */}
                    <HallowCP showMask={ this.state.stage <= 1 } couple={ this.state.couple } cpMyRank={ this.state.cpMyRank } />
                    {/* 榜单 */}
                    <TopRank atteService={ this.attention } />

                    <div className="copyright">在法律允许的范围内，本活动的解释权归平台所有</div>
                </div>

                <div className="floater butn btn-s btn-rule" onClick={ () => this.setRule(true) }>活动规则</div>

                { this.state.ruleStatus && <RuleLayer onClose={ () => this.setRule(false) } /> }
                <BuyLayer ref={ this.buyLayer } onRechargeCb={ this.onRechargeCb } />
                <RechargeLayer ref={ this.rechargeLayer } />
            </div>
        )
    }
}
