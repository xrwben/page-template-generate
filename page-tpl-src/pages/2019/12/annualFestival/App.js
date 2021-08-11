import { getPlatformType } from 'common' // eslint-disable-line
import { Component, createRef } from 'react' // eslint-disable-line

import 'core-js/modules/es.array.fill'

import Router from './Router'

import $svgPlayer from './plugins/svgPlayer'
import $toast from './plugins/toast'

import { getQs } from './utils'

const RouterView = Router({
    '/rewards': {
        name: 'rewards',
        component: () => import(/* webpackChunkName: "rewards" */ './pages/rewards/rewards')
    },
    '/games': {
        name: 'games',
        component: () => import(/* webpackChunkName: "games" */ './pages/games/games')
    },
    '/user': {
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ './pages/user/user')
    },
    '/bet': {
        name: 'bet',
        component: () => import(/* webpackChunkName: "bet" */ './pages/bet/bet')
    },
    default: null
})

export default class App extends Component {
    constructor (props) {
        super(props)

        this.bannerSvg = createRef()
        this.bannerSvg2 = createRef()
        this.bannerSvgPath = {
            pc: {
                entry: '//static.guojiang.tv/app/gift/pc_animation/annual19/banner_pc/entry.json',
                float: '//static.guojiang.tv/app/gift/pc_animation/annual19/banner_pc/float.json'
            },
            mobile: {
                entry: '//static.guojiang.tv/app/gift/pc_animation/annual19/banner_h5/entry.json',
                float: '//static.guojiang.tv/app/gift/pc_animation/annual19/banner_h5/float.json'
            }
        }

        this.played = false

        this.tabPath = ['/rewards', '/games', '/user', '/bet']

        const isIOSAPP = getPlatformType && (getPlatformType() === 'ios_webview' || getPlatformType() === 'ios')

        this.state = {
            islogin: false,
            stage: 0,
            tabType: -1,

            // ios pc 默认不显示 controls
            showControls: isIOSAPP || this.pageType === 'pc'
        }

        this.videoIns = createRef()

        // 重置进入时的路由
        this.$router.reset()

        this.onChangeLogin = (islogin) => {
            this.setState({
                islogin
            })
        }

        Component.prototype.$changeRouterTab = (n) => this.changeRouterTab(n, true)

        this.goPlayVideo = () => {
            this.videoIns.current.play()
            this.setState({
                showControls: true
            })
        }
    }

    /* 头部区域动画 */
    startBannerAni () {
        if (!this.bannerSvg.current) {
            console.log('头部bannerSVG Ref获取失败')
            return
        }
        const bannerAni = this.bannerSvgPath[this.pageType || 'mobile']
        $svgPlayer.playBanner(bannerAni.entry, bannerAni.float, this.bannerSvg.current, this.bannerSvg2.current)
    }

    componentDidMount () {
        if (!this.noani) {
            this.startBannerAni()
        }

        const timeType = getQs('time')

        this.setState({
            stage: +timeType || 0
        }, () => {
            /* 加载首屏 */
            this.onPageReady()
        })
    }

    /* 页面初始化数据准备完毕 后 */
    onPageReady () {
        // 活动未开始 -> 只能访问奖励页
        if (this.state.stage === 0) {
            this.changeRouterTab(0)
            return
        }

        // 活动开始或结束 -> 访问赛程页
        this.changeRouterTab(1)
    }

    changeRouterTab (tabType, goBet) {
        if (this.state.stage === 0 && tabType > 0) {
            const sn = ['', '赛事战况', '年度大人物', '竞猜']
            $toast.show(`${sn[tabType]}开启时间为12月4日 12:00`)
            return
        }

        if (tabType === this.state.tabType) return

        const tabPath = this.tabPath[tabType]

        if (!tabPath) return

        this.setState({
            tabType
        }, () => {
            this.$router.go(tabPath)
        })

        if (goBet) {
            let top = 500
            if (this.pageType === 'pc') {
                top = 1300
            }
            document.body.scrollTop = top
            document.documentElement.scrollTop = top
        }
    }

    changeTab (tabType) {
        this.changeRouterTab(tabType)
    }

    rVideoBox () {
        const showControls = this.state.showControls

        return (
            <div className="video-box">
                <div className="video">
                    <video
                        ref={ this.videoIns }
                        playsInline={true}
                        webkit-playsinline="true"
                        x5-playsinline="true"
                        x-webkit-airplay="allow"
                        x5-video-player-type="h5"
                        x5-video-player-fullscreen=""
                        x5-video-orientation="portraint"
                        src="//static.guojiang.tv/vmaker/assets/images/annual19/video.mp4"
                        controls={ showControls }
                        preload="auto"
                        controlsList="nodownload nofullscreen"
                        poster='//static.guojiang.tv/vmaker/assets/images/annual19/cover.jpg' />
                    {
                        !showControls && (
                            <div className="video-mask">
                                <div className="common-s butn icon-play" onClick={ this.goPlayVideo } />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    {/* banner区域 及 公共展示区域 */}
                    <div className="banner">
                        {/* banner动效区域 */}
                        <div className="banner-svg" ref={ this.bannerSvg }></div>
                        <div className="banner-svg2" ref={ this.bannerSvg2 }></div>
                    </div>
                    {
                        this.rVideoBox()
                    }
                    <div className="sec-h">巅峰对决 胜者为王</div>
                    {/* 路由切换tab */}
                    <div className="router-tab fl-box">
                        <div
                            className={ 'butn rt-i rt-i-rw' + (this.state.tabType === 0 ? ' active' : '') }
                            onClick={ () => this.changeTab(0) }>年度奖项</div>
                        <div
                            className={ 'butn rt-i rt-i-games' + (this.state.tabType === 1 ? ' active' : '') }
                            onClick={ () => this.changeTab(1) }>赛程战况</div>
                        <div
                            className={ 'butn rt-i rt-i-user' + (this.state.tabType === 2 ? ' active' : '') }
                            onClick={ () => this.changeTab(2) }>大人物榜</div>
                        <div
                            className={ 'butn rt-i rt-i-bet' + (this.state.tabType === 3 ? ' active' : '') }
                            onClick={ () => this.changeTab(3) }>赛事竞猜</div>
                    </div>
                    {/* 路由区域 */}
                    <RouterView proxy={ { islogin: this.state.islogin, onChangeLogin: this.onChangeLogin } } />
                    <div className="page-footer"></div>
                </div>
            </div>
        )
    }
}
