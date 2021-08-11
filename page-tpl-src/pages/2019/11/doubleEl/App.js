import { Component } from 'react' // eslint-disable-line
import GiftToper from './components/GiftToper/GiftToper'
import GiftCart from './components/GiftCart/GiftCart'
import PkBar from './components/PkBar/PkBar'
import TopRank from './components/TopRank/TopRank'
import RuleLayer from './components/RuleLayer/RuleLayer'
import RecordLayer from './components/RecordLayer/RecordLayer'

import $loading from './plugins/loading'
import $toast from './plugins/toast'

import 'core-js/modules/es.array.fill'

import { init, attend } from './service'

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
            recordState: false,

            islogin: false,
            isMod: false,

            stage: 0
        }

        this.toggleRule = () => {
            this.setState({
                ruleState: !this.state.ruleState
            })
        }

        this.toggleRecord = () => {
            if (this.state.stage === 0) {
                return $toast.show('活动未开始')
            }

            if (!this.state.islogin) {
                this.goLogin()
                return
            }

            this.setState({
                recordState: !this.state.recordState
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
    }

    componentDidMount () {
        $loading.show()
        init().then(data => {
            $loading.hide()

            this.setState({
                islogin: data.isLogin,
                isMod: data.isMod,
                stage: data.activityStatus
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
                    {/* 五折限定 */}
                    <GiftToper stage={ this.state.stage } isMod={ this.state.isMod } />
                    {/* 购物车 */}
                    <GiftCart showRecord={ this.toggleRecord } />
                    {/* ranks progress */}
                    <PkBar stage={ this.state.stage } />
                    {/* ranks */}
                    <TopRank atteService={ this.attention } />

                    <div className="copyright">在法律允许的范围内，本活动的解释权归平台所有</div>
                </div>

                <div className="floater butn btn-s btn-rule" onClick={ this.toggleRule } >活动规则</div>

                { this.state.ruleState && <RuleLayer onClose={ this.toggleRule } /> }

                { this.state.recordState && <RecordLayer onClose={ this.toggleRecord } /> }
            </div>
        )
    }
}
