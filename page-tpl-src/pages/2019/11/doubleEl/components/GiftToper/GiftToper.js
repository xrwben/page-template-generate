import { PureComponent } from 'react'
import { getGiftRanks } from '../../service'

import mmmPic from '../../images/g-mmm.png'
import lvPic from '../../images/g-love.png'
import carPic from '../../images/g-car.png'
import cnstPic from '../../images/g-cnst.png'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import avatarHolder from '../../images/holder.jpg'

export default class GiftToper extends PureComponent {
    constructor (props) {
        super(props)

        this.holder = {
            isholder: true,
            myRank: {
                score: '-',
                scoreFirstLead: '-',
                scoreFromBeingSurpassed: '-',
                isFirst: false
            },
            modRank: {
                headPic: avatarHolder,
                nickname: '虚位以待',
                score: '-',
                id: null,
                level: null,
                rid: null,
                isPlaying: false
            },
            userRank: {
                id: null,
                nickname: '虚位以待',
                headPic: avatarHolder,
                level: null
            }
        }

        this.gifts = [
            {
                cln: 'gift-mmm',
                pic: mmmPic
            },
            {
                cln: 'gift-love',
                pic: lvPic
            },
            {
                cln: 'gift-car',
                pic: carPic
            },
            {
                cln: 'gift-cnst',
                pic: cnstPic
            }
        ]

        this.state = {
            giftsRank: [this.holder, this.holder, this.holder, this.holder]
        }
    }

    componentDidMount () {
        $loading.show()
        getGiftRanks().then(data => {
            $loading.hide()

            const granks = data.map((gitm) => {
                if (!gitm || gitm.modRank instanceof Array || gitm.userRank instanceof Array) {
                    return this.holder
                }
                return gitm
            })

            for (let i = granks.length; i < 4; i++) {
                granks.push(this.holder)
            }

            this.setState({
                giftsRank: granks
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        const gifts = this.gifts

        return (
            <div className="gift-toper">
                <div className="sec-header">
                    <div className="sec-h">
                        <div className="pic-s h-gift">礼物五折  心意不打折</div>
                    </div>
                    <div className="sec-sub-h">萌萌喵、LOVE、炫酷超跑、宠你上天五折送出，经验不打折，活动期间收取指定礼物积分Top1的主播将奖励开播飘屏*2，若积分超过100w，可额外获得50000{ this.perName }奖励！！！</div>
                </div>
                {
                    this.state.giftsRank.map((gitm, gind) => {
                        const hasModInfo = this.props.stage < 2 && this.props.isMod && !gitm.isholder
                        return (
                            <div
                                className={ ['gift-toper-i fl-box', gifts[gind].cln, !hasModInfo && 'no-mod'].join(' ').trim() }
                                key={ gifts[gind].cln }>
                                <div className="gift-pic">
                                    <img alt={ gifts[gind].cln } src={ gifts[gind].pic } />
                                </div>
                                <div className="infoer mod">
                                    <div className="headpic">
                                        <img className="avatar" src={ gitm.modRank.headPic } alt="主播头像" onClick={ () => { this.goRoom(gitm.modRank) } } />
                                        <div className="icon-s icon-live" style={ { display: gitm.modRank.isPlaying ? 'block' : 'none' } }>live</div>
                                    </div>
                                    <div className="nickname fl-box">
                                        <span className="name txt-of">{ gitm.modRank.nickname }</span>
                                        <span className={ 'level_icon m_level_icon_' + gitm.modRank.level }></span>
                                    </div>
                                </div>
                                <div className="infoer user">
                                    <div className="headpic">
                                        <img className="avatar" src={ gitm.userRank.headPic } alt="主播头像" />
                                    </div>
                                    <div className="nickname fl-box">
                                        <span className="name txt-of">{ gitm.userRank.nickname }</span>
                                        <span className={ 'level_icon u_level_icon_' + gitm.userRank.level }></span>
                                    </div>
                                </div>
                                <div className="score txt-of">积分<br/>{ gitm.modRank.score }</div>
                                {
                                    hasModInfo && (
                                        <div className="tiper">
                                            {
                                                gitm.myRank.isFirst ? `距被超越还差 ${gitm.myRank.scoreFromBeingSurpassed} 积分` : `我的积分：${gitm.myRank.score} ，距Top1还需 ${gitm.myRank.scoreFirstLead} 积分`
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
