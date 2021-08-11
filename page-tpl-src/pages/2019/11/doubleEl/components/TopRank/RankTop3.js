import { Component } from 'react'
import avatarHolder from '../../images/holder.jpg'

const holder = {
    headPic: avatarHolder,
    id: null,
    isLoved: false,
    isPlaying: false,
    level: null,
    nickname: '虚位以待',
    rid: null,
    score: '--'
}

function TopItem (_item, _ind, levelIcon, onAtte) {
    const item = _item || holder
    const ind = _ind
    const goRoom = Component.prototype.goRoom
    const Cookie = Component.prototype.Cookie

    const isLoved = item.isLoved || String(item.id) === Cookie.uid || String(item.mid) === Cookie.uid

    return (
        <div className={ 'top-i top-' + ind } key={ 'toper-' + ind }>
            <div className="headpic">
                <span className="icon-s icon-live-2" style={ { display: item.isPlaying ? 'block' : 'none' } }></span>
                <img className="avatar" src={ item.headPic } alt="" onClick={ () => goRoom(item) } />
            </div>
            <div className="nickname fl-box">
                <span className="name txt-of">{ item.nickname }</span>
                <span className={ 'level_icon ' + levelIcon + item.level }></span>
            </div>
            <div className="score">积分：{ item.score }</div>
            <div
                className={ 'butn btn-s btn-atte' + (isLoved ? '-dis' : '') }
                onClick={ () => !isLoved && onAtte(item, ind) } >关注</div>
        </div>
    )
}

export default function RankTop3 (props) {
    return (
        <div className="rank-top3">
            {
                props.top3.map((item, ind) => TopItem(item, ind, props.levelIcon, props.onAtte))
            }
        </div>
    )
}
