import { PureComponent } from 'react'
import holderPic from '../../../images/holder.png'

const HOLDER = {
    headPic: holderPic,
    nickname: '虚位以待',
    score: '-',
    id: null,
    level: null,
    rid: null,
    isPlaying: false,
    isLoved: false
}

// 获取榜单说明文案
function getRankDesc (stage, maxStage, group, ind) {
    const gname = ['天籁', '风云', '偶像', '元气', '魅力'][group]

    if (stage === 4 && maxStage > stage) return null

    if ((stage === 5 || stage === 4) && ind === 1) {
        return <div className={`et-rank-desc et-badge-top e-${group}-s desc-${group}`}>年度XX主播冠军</div>
    }
    // 7 -> 4 11 -> 3
    if (stage === 5 || stage === 4) {
        if (ind === 2) {
            return <div className="et-rank-desc">{`若超级冠军-年度最佳主播出现在${gname}赛道，则第二名主播晋级为${gname}冠军`}</div>
        }
        if (ind === 3) {
            return <div className="et-rank-desc">{`若超级冠军-年度最佳主播出现在${gname}赛道，则第三名主播晋级为${gname}亚军`}</div>
        }
        if (ind === 4) {
            return <div className="et-rank-desc">{`若超级冠军-年度最佳主播出现在${gname}赛道，则第四名主播晋级为${gname}季军`}</div>
        }
    }

    return null
}

export default class RankItem extends PureComponent {
    render () {
        const { stage, group, maxStage } = this.props
        const ind = this.props.ind
        const target = this.props.target || HOLDER
        const goRoom = this.goRoom

        const desc = getRankDesc(stage, maxStage, group, ind)

        return (
            <div className={ `rank-item fl-ver ${desc ? 'has-desc' : ''} ${this.props.className || ''}` }>
                <div className="ind fl-box">
                    {
                        ind < 10 ? [
                            <span className="num-s num-0" key="n-0" />,
                            <span className={ `num-s num-${ind}` } key="n-x" />
                        ] : (
                            [].slice.call((ind + '')).map((n, ni) => (
                                <span className={ `num-s num-${n}` } key={ 'n-' + ni } />
                            ))
                        )
                    }
                </div>
                <div className="info fl-ver">
                    <div className="headpic" onClick={ () => goRoom(target) }>
                        <span className="pre-s icon-live" style={ { display: target.isPlaying ? '' : 'none' } }>live</span>
                        <img className="avatar" src={ target.headPic } />
                    </div>
                    <div className="details">
                        <div className="nickname fl-ver">
                            <span className="name txt-of">{ target.nickname }</span>
                            <span className={ `level_icon m_level_icon_${target.level}` }></span>
                        </div>
                    </div>
                </div>
                <div className="score txt-of">{ target.score }</div>
                { desc }
            </div>
        )
    }
}
