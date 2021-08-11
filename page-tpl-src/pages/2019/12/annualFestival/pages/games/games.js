import { PureComponent } from 'react'

import './style.less'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { setShare } from '../../utils'
import { initGames } from '../../service'
import ScreenHolder from './components/ScreenHolder'
import ScreenRule from './components/ScreenRule'

import pre from './pre'
import sign from './sign'
import event from './event'
import champion from './champion'

const GameStageViews = [
    // 预选赛
    pre,
    // 赛道报名
    sign,
    // 单项赛
    event,
    // 冠军赛
    champion
]

const SHARE = [
    {
        title: '2019星光年度盛典-预选赛',
        content: '把预选赛打出了决赛的感觉...'
    },
    {
        title: '2019星光年度盛典-赛道报名',
        content: '巅峰之战，从这一刻的选择正式打响！'
    },
    {
        title: '2019星光年度盛典-单项赛',
        content: '强强对决，最激烈的厮杀，玩的就是刺激！“战”稳了！'
    },
    {
        title: '2019星光年度盛典-超级冠军赛',
        content: '巅峰之战，年度最佳主播，唯一的王者宝座正虚位以待！'
    }
]

export default class GamesPage extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            gameStage: -1, // 0 - 预选赛 1 - 赛道报名 2 - 单项赛 3 - 超级冠军赛
            showStage: -1,

            activityStatus: 0,

            isMod: false,
            startTime: 0,
            serverTime: 0,

            inited: false,

            sRuleState: false
        }

        this.sRuleClose = () => {
            this.setState({
                sRuleState: false
            })
        }

        this.sRuleShow = () => {
            this.setState({
                sRuleState: true
            })
        }
    }

    componentDidMount () {
        $loading.show()
        initGames().then(data => {
            $loading.hide()

            if (data.activityStatus === 0) {
                location.href = './annualFestival.html?time=0'
            }

            let gameStage = -1
            if (data.activityStatus === -1) { // 活动已结束 - 超级冠军赛
                gameStage = 3
            } else if (data.activityStatus === 1) { // 预选赛
                gameStage = 0
            } else if (data.activityStatus === 2) { // 报名
                gameStage = 1
            } else if (data.activityStatus < 9) { // 单项赛
                gameStage = 2
            } else { // 超级冠军赛
                gameStage = 3
            }

            setShare(SHARE[gameStage].title, SHARE[gameStage].content)

            this.props.proxy.onChangeLogin(data.isLogin)

            this.setState({
                isMod: data.isMod,
                gameStage: gameStage, // [0-未开始, 1-预选赛, 2-赛道报名赛, 3-n进15, 4-15进10, 5-10进7, 6-7进4, 7-4强, 8-5进3, 9-三强, -1-结束]
                showStage: gameStage,

                activityStatus: data.activityStatus,

                startTime: data.startTime,
                serverTime: data.serverTime,

                inited: true
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    calcTab (key) {
        const { gameStage, showStage } = this.state
        if (gameStage < key) {
            return 'dis'
        }
        if (showStage === key) {
            return 'active'
        }
        return ''
    }

    changeGameStage (type) {
        if (type === this.state.showStage) return

        if (type > this.state.gameStage) {
            const tip = [
                '预选赛 开启时间为12月4日 12:00',
                '赛道报名 开启时间为12月8日 00:00',
                '单项赛 开启时间为12月10日 00:00',
                '超级冠军赛 开启时间为12月16日 00:00'
            ]

            $toast.show(tip[type])
            return
        }

        this.setState({
            showStage: type
        })
    }

    render () {
        const { showStage } = this.state

        let Banner = () => null
        let Content = () => null

        const view = GameStageViews[showStage]
        if (view) {
            Banner = () => <div className={ `game-h h-${['pre', 'sign', 'events', 'final'][showStage]}` }></div>
            Content = GameStageViews[showStage]
        }

        return (
            <div className="page-r games">
                <Banner />
                {/* 霸屏 */}

                {
                    this.state.inited &&
                        <ScreenHolder
                            activityStatus={ this.state.activityStatus }
                            sRuleShow={ this.sRuleShow } />
                }
                {/* 赛事tab */}
                <div className="tab-games fl-box">
                    <div
                        className={ `butn tab-i game-0 ${this.calcTab(0)}` }
                        onClick={ () => this.changeGameStage(0) } />
                    <div
                        className={ `butn tab-i game-1 ${this.calcTab(1)}` }
                        onClick={ () => this.changeGameStage(1) } />
                    <div
                        className={ `butn tab-i game-2 ${this.calcTab(2)}` }
                        onClick={ () => this.changeGameStage(2) } />
                    <div
                        className={ `butn tab-i game-3 ${this.calcTab(3)}` }
                        onClick={ () => this.changeGameStage(3) } />
                </div>
                <Content
                    serverTime={ this.state.serverTime }
                    startTime={ this.state.startTime }
                    gameStage={ this.state.gameStage }
                    activityStatus={ this.state.activityStatus } />

                { this.state.sRuleState && <ScreenRule onClose={ this.sRuleClose } /> }
            </div>
        )
    }
}
