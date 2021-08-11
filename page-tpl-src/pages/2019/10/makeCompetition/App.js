import { getPlatformType, getPackageId } from 'common'
import { Component } from 'react' // eslint-disable-line
import SecProgress from './components/SecProgress/SecProgress'
import GetInDetails from './components/GetInDetails/GetInDetails'
import StageTab from './components/StageTab/StageTab'
import CommonRank from './components/CommonRank/CommonRank'
import PromotionGame from './components/PromotionGame/PromotionGame'
import PKGame from './components/PKGame/PKGame'
import RuleLayer from './components/RuleLayer/RuleLayer'

import $loading from './plugins/loading'
import $toast from './plugins/toast'
import { init, getGKInfo, getUserRank } from './service'

import 'core-js/modules/es.array.fill'

export default class App extends Component {
    constructor () {
        super()

        Component.prototype.perName = this.getPerName()

        this.state = {
            inited: false,
            islogin: false,
            isMod: true,

            stage: 0, // 0 未开始 1 晋级赛 2 擂主争霸赛 3 结束
            showStage: 1, // 展示阶段
            gk: 0, // 当前闯关关卡
            showGk: 0, // 当前展示的关卡

            power: 0, // 当前战力 (当前关卡的战力)
            counter: 0, // 已通关人数
            isThrough: false, // 是否通关

            showRule: false, // 是否显示规则

            // 用户榜数据
            ranklist: [],
            meCenter: null
        }
    }

    componentDidMount () {
        $loading.show()
        Promise.all([
            this.loadInit(),
            this.loadGkInfo(),
            this.loadUserRank()
        ]).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    getPerName () {
        if (this.pageType === 'pc') return '克拉'
        const platform = getPlatformType() // eslint-disable-line
        if (platform !== 'ios_webview') {
            return '克拉'
        }

        const per = getPackageId() // eslint-disable-line
        if (per === '8') {
            return '果汁'
        }
        if (per === '12') {
            return '甜蜜'
        }
        if (per === '27') {
            return '钻石'
        }

        return '克拉'
    }

    // 初始化信息
    loadInit () {
        return init().then(data => {
            var showStage = Math.min(Math.max(data.stage, 1), 9) // 1 - 9

            this.setState({
                inited: true,
                islogin: data.islogin,
                isMod: data.isMod,
                stage: data.stage,
                showStage: showStage
            })
        }).catch(err => {
            $toast.show(err.message)
        })
    }

    // 关卡信息
    loadGkInfo () {
        return getGKInfo().then(data => {
            this.setState({
                gk: data.gk,
                showGk: data.gk,
                power: data.gkValue,
                counter: data.counter,
                isThrough: data.isThrough
            })
        }).catch(err => {
            // $toast.show(err.message)
            console.log(err.message)
        })
    }

    // 用户榜
    loadUserRank () {
        return getUserRank().then(data => {
            const meCenter = (data.myRank && !Array.isArray(data.myRank) && data.myRank.pairInfos) ? data.myRank : null
            this.setState({
                ranklist: data.ranks,
                meCenter: meCenter
            })
        }).catch(err => {
            $toast.show(err.message)
        })
    }

    // 关卡显示切换
    changeGetInProg (gkInd) {
        if (this.state.showGk === gkInd) return
        this.setState({
            showGk: gkInd
        })
    }

    // 赛程切换
    changeShowStage (sind) {
        if (sind === 1) {
            if (this.state.showStage < 6) return

            this.setState({
                showStage: 5
            })
            return
        }

        if (sind === 2) {
            if (this.state.stage < 6) {
                $toast.show('19日 00:00:00 开启')
                return
            }

            if (this.state.showStage >= 6) return

            this.setState({
                showStage: Math.min(Math.max(this.state.stage, 1), 9) // 1 - 9
            })
        }
    }

    ruleClick () {
        this.setState({
            showRule: !this.state.showRule
        })
    }

    renderSubContent () {
        if (!this.state.inited) { return [] }
        return this.state.showStage < 6 ? <PromotionGame stage={ this.state.stage } isMod={ this.state.isMod } /> : <PKGame stage={ this.state.stage } showStage={ this.state.showStage } />
    }

    calcSecMask () {
        // 活动已结束
        if (this.state.stage === 10) {
            // 不是主播 或 未登录
            if (!this.state.islogin || !this.state.isMod) {
                return 'end'
            }

            if (this.state.isThrough) {
                return ''
            }

            if (this.state.showGk >= this.state.gk) {
                return 'end'
            }

            return ''
        }

        // 活动未开始 或 未登录 或 不是主播
        if (!this.state.islogin || !this.state.isMod || this.state.stage === 0) {
            return 'pre'
        }

        if (this.state.gk < this.state.showGk) {
            return 'pre'
        }

        return ''
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    <div className="banner">一战到底 活动时间：10.17 - 10.20</div>

                    {/* 闯关赛 */}
                    <div className="ht-s h-getin">闯关赛</div>
                    <div className="get-in">
                        <div className="get-in-w1">
                            <div className="get-in-w2">
                                <div className="desc">闯关赛玩法：主播达到通关所需战力即可通关并获得关卡奖励，通过第四关方能解锁晋级赛（18日23:59:59 前）</div>
                                <div className="ltime">闯关截止时间：10.20 23:59:59</div>
                                <SecProgress
                                    gk={ this.state.gk }
                                    showGk={ this.state.showGk }
                                    isThrough={ this.state.isThrough }
                                    onToggle={ (gkInd) => this.changeGetInProg(gkInd) } />
                                <div className={ ['gt-d-wrap', this.calcSecMask()].join(' ').trim() }>
                                    <GetInDetails
                                        gk={ this.state.gk }
                                        showGk={ this.state.showGk }
                                        power={ this.state.power }
                                        counter={ this.state.counter }
                                        isThrough={ this.state.isThrough } />
                                    <div className="tiper">{ (this.state.isMod || this.state.stage === 10) ? '' : '注：成为主播，闯关即刻开启！' }</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 晋级赛 , 擂主争霸赛 */}
                    <StageTab stage={ this.state.showStage } onToggle={ (sind) => this.changeShowStage(sind) } />
                    {
                        this.renderSubContent()
                    }

                    {/* 贡献榜 */}
                    <div className="ht-s h-tyrant">贡献榜</div>
                    <CommonRank type="user" ranks={ this.state.ranklist } meCenter={ this.state.meCenter } />

                    <p className="copyright">在法律允许的范围内，本活动的解释权归平台所有</p>
                </div>

                {/* 规则按钮 */}
                <div className="butn btn-s btn_rule floater" onClick={ () => this.ruleClick() }></div>

                {/* 规则层 */}
                {
                    this.state.showRule && <RuleLayer onClose={ () => this.ruleClick() } />
                }
            </div>
        )
    }
}
