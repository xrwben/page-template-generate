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

function getRankRw (type, ind) {
    // type = 0 1 2 3 日榜 -1 总榜
    // ind -> 1-100
    if (type < 0) {
        return null
    }

    const date = ['5', '6', '7', '8']
    const rw = [0, 20000, 15000, 10000, 5000, 5000]
    if (ind < 6) {
        return <div className="rw">{ date[type] }日结算时奖励{ rw[ind] }荣耀值</div>
    }
    return null
}

export default class RankItem extends PureComponent {
    render () {
        const type = this.props.type
        const ind = this.props.ind
        const target = this.props.target || HOLDER
        const goRoom = this.goRoom
        return (
            <div className="rank-item fl-ver">
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
                    <div className="headpic">
                        <span className="pre-s icon-live" style={ { display: target.isPlaying ? '' : 'none' } }>live</span>
                        <img className="avatar" src={ target.headPic } onClick={ () => goRoom(target) } />
                    </div>
                    <div className="details">
                        <div className="nickname fl-ver">
                            <span className="name txt-of">{ target.nickname }</span>
                            <span className={ `level_icon m_level_icon_${target.level}` }></span>
                        </div>
                        { getRankRw(type, ind) }
                    </div>
                </div>
                <div className="score txt-of">{ target.score }</div>
            </div>
        )
    }
}
