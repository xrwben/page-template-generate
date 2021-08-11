import { Component, createRef } from 'react' // eslint-disable-line

import GiftSales from './components/GiftSales/GiftSales'
import Luckbag from './components/Luckbag/Luckbag'
import ThkRank from './components/ThkRank/ThkRank'
import TopRank from './components/TopRank/TopRank'
import RuleLayer from './components/RuleLayer/RuleLayer'
import RechargeLayer from './components/RechargeLayer/RechargeLayer'
import BuyLayer from './components/BuyLayer/BuyLayer'
import GiveLayer from './components/GiveLayer/GiveLayer'
import SearchResLayer from './components/SearchResLayer/SearchResLayer'
import RewardsLayer from './components/RewardsLayer/RewardsLayer'

import $loading from './plugins/loading'
import $toast from './plugins/toast'
import { init, getThkRank, attend } from './service'

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
            ruleState: false,
            buyState: false,
            rechargeState: false,
            giveState: false,
            searchResState: false,
            rwState: false,

            stage: 0,
            islogin: false,
            isMod: false,

            // 福袋进度
            lbValue: 0,
            lbIsOpen: false,

            // 搜索结果
            searchRes: null,
            thkMyInfo: null,
            thkRanks: [],

            // 赠送对象
            giveRes: null
        }

        this.topTankRef = createRef()

        this.togRule = this.togFactory('ruleState')
        this.togBuy = this.togFactory('buyState')
        this.togRecharge = this.togFactory('rechargeState')
        this.togGive = this.togFactory('giveState')
        this.togSearchRes = this.togFactory('searchResState')
        this.togRw = this.togFactory('rwState')

        this.onGoBuy = () => {
            if (this.state.stage < 1) {
                $toast.show('11.27 12:00才可购买！')
                return
            }

            if (this.state.stage > 1) {
                return
            }

            this.togBuy()
        }

        this.onMyRw = () => {
            if (this.state.stage < 1) {
                $toast.show('活动未开始')
                return
            }

            if (!this.state.islogin) {
                this.goLogin()
                return
            }

            this.togRw()
        }

        this.showSearchRes = (res) => {
            this.setState({
                searchRes: res
            })
            this.togSearchRes()
        }

        this.searchGive = () => {
            this.setState({
                giveRes: this.state.searchRes
            })
            this.togSearchRes()
            this.togGive()
        }

        this.toGive = (item) => {
            if (!this.state.islogin) {
                this.goLogin()
                return
            }

            if (this.state.stage === 0) {
                $toast.show('活动未开始')
                return
            }

            if (this.state.stage === 2) {
                $toast.show('活动已结束')
                return
            }

            this.setState({
                giveRes: item
            })
            this.togGive()
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

        this.refreshThk = () => {
            $loading.show()

            this.initThkRank().then(() => {
                $loading.hide()
            }).catch(err => {
                $loading.hide()
                $toast.show(err.message)
            })
        }

        this.openBag = () => {
            this.setState({
                lbIsOpen: true
            })
        }
    }

    togFactory (stateName) {
        return () => {
            this.setState({
                [stateName]: !this.state[stateName]
            })
        }
    }

    componentDidMount () {
        $loading.show()

        Promise.all([
            this.initAct(),
            this.initThkRank()
        ]).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    initAct () {
        return init().then(data => {
            this.setState({
                stage: data.isActivity,
                islogin: data.isLogin,

                isMod: data.isMod,

                lbValue: data.score,
                lbIsOpen: data.isOpen,

                currDate: data.isActivity === 2 ? 3 : Math.min(data.stage, 3) // [0, 1, 2 ,3]
            }, () => {
                this.topTankRef.current.enter()
            })
        })
    }

    initThkRank () {
        return getThkRank().then(data => {
            this.setState({
                thkMyInfo: data.myInfo instanceof Array ? null : data.myInfo,
                thkRanks: data.ranks
            })
        })
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    <div className="banner"></div>
                    {/* 感恩限定 */}
                    <GiftSales
                        stage={ this.state.stage }
                        onGoBuy={ this.onGoBuy } />
                    {/* 福袋 */}
                    <Luckbag
                        stage={ this.state.stage }
                        value={ this.state.lbValue }
                        isOpen={ this.state.lbIsOpen }
                        openBag={ this.openBag }
                        onMyRw={ this.onMyRw } />
                    {/* 深情榜 */}
                    <ThkRank
                        islogin={ this.state.islogin }
                        isMod={ this.state.isMod }
                        showSearchRes={ this.showSearchRes }
                        myInfo={ this.state.thkMyInfo }
                        ranks={ this.state.thkRanks }
                        toGive={ this.toGive } />
                    {/* 感恩榜 */}
                    <TopRank
                        ref={ this.topTankRef }
                        stage={ this.state.stage }
                        currDate={ this.state.currDate }
                        attention={ this.attention } />

                    <div className="copyright">在法律允许的范围内，本活动的解释权归平台所有</div>
                </div>

                <div className="floater butn btn-2-s btn-rule" onClick={ this.togRule }>活动规则</div>

                { this.state.ruleState && <RuleLayer onClose={ this.togRule } /> }
                { this.state.buyState && <BuyLayer onClose={ this.togBuy } onRechargeCb={ this.togRecharge } /> }
                { this.state.rechargeState && <RechargeLayer onClose={ this.togRecharge } /> }
                { this.state.giveState &&
                    <GiveLayer
                        onClose={ this.togGive }
                        canGiveNum={ this.state.thkMyInfo ? this.state.thkMyInfo.coin : 0 }
                        target={ this.state.giveRes }
                        refreshThk={ this.refreshThk } /> }
                { this.state.searchResState &&
                    this.state.searchRes &&
                    <SearchResLayer
                        onClose={ this.togSearchRes }
                        result={ this.state.searchRes }
                        onGive={ this.searchGive } /> }
                { this.state.rwState && <RewardsLayer onClose={ this.togRw } /> }
            </div>
        )
    }
}
