// pure function - display component
import avatarHolder from '../../images/avatar_holder.png'

function progW (left, right) {
    const la = Math.max(left || 0, 1)
    const lb = Math.max(right || 0, 1)
    const total = la + lb
    return Math.min(Math.max(la / total * 100, 8), 92).toFixed(2)
}

export default function PKItem (props) {
    let item = props.item
    const goRoom = props.goRoom

    if (!item) {
        item = {
            fromMid: null,
            fromNickname: '虚位以待',
            fromHeadPic: avatarHolder,
            fromLevel: null,
            fromRid: null,
            fromIsPlaying: false,
            fromScore: '--',
            fromIsWinner: false,
            toMid: null,
            toNickname: '虚位以待',
            toHeadPic: avatarHolder,
            toLevel: null,
            toRid: null,
            toIsPlaying: false,
            toScore: '--',
            toIsWinner: false
        }
    }

    const pw = progW(+item.fromScore || 0, +item.toScore || 0)

    return (
        <div className="pk-item">
            <div className="pk-badge-l"></div>
            <div className="pk-badge-r"></div>
            <div className="pk-i-box">
                <div className={ 'pk-mod left ' + (props.isEnd ? (item.fromIsWinner ? 'win' : 'lose') : '') }>
                    <img className="avatar" src={ item.fromHeadPic } alt="主播头像" onClick={ () => goRoom({ mid: item.fromMid, rid: item.fromRid }) } />
                    <div className="icon-s icon_live" style={ { display: item.fromIsPlaying ? 'block' : 'none' } }></div>
                    <div className="nickname">
                        <div className="name txt-of">{ item.fromNickname }</div>
                        <span className={ 'level_icon m_level_icon_' + item.fromLevel }></span>
                    </div>
                </div>
                <div className="icon-s ic_pk">vs</div>
                <div className={ 'pk-mod right ' + (props.isEnd ? (item.toIsWinner ? 'win' : 'lose') : '') }>
                    <img className="avatar" src={ item.toHeadPic } alt="主播头像" onClick={ () => goRoom({ mid: item.toMid, rid: item.toRid }) } />
                    <div className="icon-s icon_live" style={ { display: item.toIsPlaying ? 'block' : 'none' } }></div>
                    <div className="nickname">
                        <div className="name txt-of">{ item.toNickname }</div>
                        <span className={ 'level_icon m_level_icon_' + item.toLevel }></span>
                    </div>
                </div>
            </div>
            <div className="pk-i-progress" style={ { background: 'linear-gradient(to right, #ff5702, #ffa502 ' + pw + '%, #28d0fe ' + pw + '%, #5341f0 100%)' }}>
                <div className="pk-value">{ item.fromScore }</div>
                <div className="pk-value">{ item.toScore }</div>
            </div>
        </div>
    )
}
