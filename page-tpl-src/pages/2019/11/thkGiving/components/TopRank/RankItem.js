// pure function - display components RankItem
import avatarHolderImg from '../../images/holder.png'

const holder = {
    headPic: avatarHolderImg,
    id: null,
    isLoved: false,
    isPlaying: false,
    level: -1,
    nickname: '虚位以待',
    rid: null,
    score: '--'
}

export default function RankItem (props) {
    let { ind, target, levelIcon, goRoom } = props

    if (!target) {
        target = holder
    }

    return (
        <div
            className="rank-row" >
            <div className="rank-cell cell-1">{ ind + 4 }</div>
            <div className="rank-cell cell-2">
                <div className="headpic">
                    <img className="avatar" src={ target.headPic } alt="主播头像" onClick={ () => goRoom(target) } />
                    <span className="icon-s icon-live" style={ { display: target.isPlaying ? 'block' : 'none' } }></span>
                </div>
                <div className="nickname">
                    <span className="name txt-of">{ target.nickname }</span>
                    <span className={ 'level_icon ' + levelIcon + target.level }></span>
                </div>
            </div>
            <div className="rank-cell cell-3 txt-of">{ target.score }</div>
        </div>
    )
}
