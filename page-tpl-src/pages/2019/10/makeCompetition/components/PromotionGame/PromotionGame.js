import { Component } from 'react'
import CommonRank from '../CommonRank/CommonRank'

import avatarHolderImg from '../../images/avatar_holder.png'
import $loading from '../../plugins/loading'
import { getPromIn, getPromInRank } from '../../service'

// 晋级赛 tab content
export default class PromotionGame extends Component {
    constructor (props) {
        super(props)

        this.holder = new Array(16).fill(0)

        this.rankTiper = {
            2: [2, '18日 11:59:59 晋级至擂主争霸赛'],
            3: [3, '18日 17:59:59 晋级至擂主争霸赛'],
            4: [5, '18日 20:59:59 晋级至擂主争霸赛'],
            5: [6, '18日 23:59:59 晋级至擂主争霸赛']
        }

        this.state = {
            propInMods: [],
            showAll: false,
            ranklist: [],
            meCenter: null
        }
    }

    componentDidMount () {
        $loading.show()
        Promise.all([
            getPromIn(),
            getPromInRank()
        ]).then(([propInMods, propInRank]) => {
            const meCenter = (propInRank.myRank && !Array.isArray(propInRank.myRank) && propInRank.myRank.pairInfos) ? propInRank.myRank : null
            if (meCenter && propInRank.myRank.uid) {
                const isGetIn = propInMods.find(propIn => propIn.id === +meCenter.uid && +propIn.rid === meCenter.rid)
                console.log(isGetIn)
                if (isGetIn) {
                    meCenter.getin = true
                }
            }
            this.setState({
                propInMods,
                ranklist: propInRank.ranks,
                meCenter: meCenter
            })
        }).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            console.log(err)
        })
    }

    componentWillUnmount () {
        // 卸载异步操作设置状态
        // this.setState = (state, callback) => {}
    }

    toggle () {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    render () {
        return (
            <div className="game game-promotion">
                <div className="game-rule">
                    <div className="game-r-h">晋级赛</div>
                    <div className="game-r-i">1、18日开启晋级赛，闯过第四关的主播将进入晋级赛，闯关赛获得的战力将作为初始值计入晋级赛榜单，该赛程战力不累计至擂主争霸；</div>
                    <div className="game-r-i">2、18日12点晋级榜单前2名主播、18点晋级榜单前3名主播、21点晋级榜单前5名主播、24点晋级榜单前6名主播，共计16名主播进入擂主争霸赛；</div>
                    <div className="game-r-i">3、若晋级至擂台争霸赛的主播其晋级时战力达40w，可获得奖励15000{ this.perName }；</div>
                    <div className="game-r-i">4、18日24点，晋级赛结束；</div>
                    <div className="game-r-i">5、活动期间送礼量大，服务器会有一定程度的延迟，请提前10秒冲榜，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单情况，平台不予补偿，请谅解！</div>
                </div>
                {/* 已晋级列表 */}
                <div className="ht-s h-prompt">已晋级</div>
                <div className="promo-list">
                    <div className={ 'list' + (this.state.showAll ? ' active' : '') } >
                        {
                            this.holder.map((v, ind) => {
                                var mod = this.state.propInMods[ind]
                                return (
                                    <div className="mod-i" key={'mod_i_' + ind}>
                                        <img className="avatar" src={ mod ? mod.headPic : avatarHolderImg } alt="" onClick={ () => this.goRoom(mod) } />
                                        <div className="name txt-of">{ mod ? mod.nickname : '虚位以待' }</div>
                                    </div>
                                )
                            })
                        }
                        <div className="tiper">以上主播已进入擂主争霸赛</div>
                    </div>
                    <div className={ 'butn btn-s btn-toggle ' + (this.state.showAll ? 'btn_up' : 'btn_down') } onClick={ () => this.toggle() }></div>
                </div>
                {/* 晋级赛榜单 */}
                <CommonRank
                    type="mod"
                    showHolder={ this.props.stage <= 1 }
                    holder="18日 00:00:00 开启"
                    ranks={ this.state.ranklist }
                    meCenter={ this.props.isMod ? this.state.meCenter : null }
                    tipers={ this.rankTiper[this.props.stage] } />
            </div>
        )
    }
}
