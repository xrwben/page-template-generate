// pure function - display components RankItem
export default function RankItem (props) {
    const { ind, target, levelIcon, goRoom } = props

    return (
        <div
            className={ ['rank-row', target.tiper ? 'has-tiper' : '', target.isPlaying ? 'has-live' : ''].join(' ').trim() } >
            <div className="rank-cell cell-1">{ ind + 1 }</div>
            <div className="rank-cell cell-2">
                <div className="headpic">
                    <img className="avatar" src={ target.headPic } alt="主播头像" onClick={ () => goRoom(target) } />
                    <span className="icon-s icon_live" style={ { display: target.isPlaying ? 'block' : 'none' } }></span>
                </div>
                <div className="nickname">
                    <span className="name txt-of">{ target.nickname }</span>
                    <span className={ 'level_icon ' + levelIcon + target.level }></span>
                </div>
            </div>
            <div className="rank-cell cell-3 txt-of">{ target.score }</div>
            {
                target.tiper && <div className="rank-r-tiper" key={'r-tip-' + ind}>{ target.tiper }</div>
            }
        </div>
    )
}
