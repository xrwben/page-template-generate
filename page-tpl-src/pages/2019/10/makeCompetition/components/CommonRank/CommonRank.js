import { PureComponent } from 'react'
import RankItem from './RankItem'

import avatarHolderImg from '../../images/avatar_holder.png'
import RankMeCenter from './RankMeCenter'

export default class CommonRank extends PureComponent {
    constructor (props) {
        super(props)

        this.levelIcon = 'm_level_icon_'
        if (props.type === 'user') {
            this.levelIcon = 'u_level_icon_'
        }

        this.ranklen = new Array(10).fill(0)
    }

    render () {
        var list = this.ranklen.map((v, ind) => {
            var tiper = ''
            var target = this.props.ranks[ind]

            if (this.props.tipers && ind < this.props.tipers[0]) {
                tiper = this.props.tipers[1]
            }

            if (!target) {
                return {
                    headPic: avatarHolderImg,
                    isPlaying: false,
                    nickname: '虚位以待',
                    level: -1,
                    score: '--',
                    tiper
                }
            }

            return {
                ...target,
                tiper
            }
        })

        return (
            <div className="rank">
                <div className="rank-w1">
                    <div className="rank-w2">
                        <div className="rank-h">
                            <div className="rank-cell cell-1">
                                <div className="icon-s txt-pm">排名</div>
                            </div>
                            <div className="rank-cell cell-2">
                                <div className={ 'icon-s txt-' + this.props.type }></div>
                            </div>
                            <div className="rank-cell cell-3">
                                <div className="icon-s txt-val">战力</div>
                            </div>
                        </div>
                        <div className="rank-list">
                            {
                                this.props.showHolder ? <div className="rank-holder">{ this.props.holder }</div> : list.map((target, ind) => {
                                    return (
                                        <RankItem
                                            key={'r-row-' + ind}
                                            ind={ ind }
                                            target={ target }
                                            levelIcon={ this.levelIcon }
                                            goRoom={ this.goRoom } />
                                    )
                                })
                            }
                        </div>
                        <div className="rank-footer">仅展示前10位{ this.props.type === 'user' ? '用户' : '主播' }</div>
                        {
                            this.props.meCenter && (
                                <RankMeCenter
                                    meCenter={ this.props.meCenter }
                                    levelIcon={ this.levelIcon }
                                    goRoom={ this.goRoom } />
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
