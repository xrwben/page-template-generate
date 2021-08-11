import { PureComponent } from 'react'
import avatarHolder from '../../mobile/images/avatar-holder.png'

export default class HallowCP extends PureComponent {
    getCpBox () {
        /* eslint-disable */
        const couple = this.props.couple
        let {
            mod_head,
            mod_nickname,
            mod_level,
            score,
            user_head,
            user_nickname,
            user_level
        } = couple

        mod_head = mod_head || avatarHolder
        mod_nickname = mod_nickname || '虚位以待'
        user_head = user_head || avatarHolder
        user_nickname = user_nickname || '虚位以待'

        return (
            <div className="cp-box fl-box">
                <div className="cp-user cp-i">
                    <div className="icon-s cown cown-queen"></div>
                    <img className="headpic" src={ mod_head } alt="主播" onClick={ () => this.goRoom({ rid: couple.mod_rid, mid: couple.mod_mid }) } />
                    <div className="icon-s icon-live" style={ { display: couple.mod_isPlaying ? 'block' : 'none' } }></div>
                    <div className="nickname fl-box">
                        <span className="name txt-of">{ mod_nickname }</span>
                        <span className={ 'level_icon m_level_icon_' + mod_level }></span>
                    </div>
                </div>
                <div className="cp-value">
                    <div className="icon-s icon-cp">万圣CP</div>
                    <div className="score txt-of">积分：{ score }</div>
                    <div className="icon-s icon-love"></div>
                </div>
                <div className="cp-mod cp-i">
                    <div className="icon-s cown cown-knight"></div>
                    <img className="headpic" src={ user_head } alt="用户" />
                    <div className="nickname fl-box">
                        <span className="name txt-of">{ user_nickname }</span>
                        <span className={ 'level_icon u_level_icon_' + user_level }></span>
                    </div>
                </div>
            </div>
        )
        /* eslint-enable */
    }

    getCpMyRank () {
        const myRank = this.props.cpMyRank

        const tiper = (myRank ? myRank.tip : '').replace(/(\d+)/, `<span class="cl-hl">$1</span>`)

        return (
            myRank ? (
                <div className="mod-center fl-box">
                    <div className="infos">
                        <div className="headpic">
                            <img className="avatar" src={ myRank.head } alt="我的头像" onClick={ () => this.goRoom(myRank) } />
                        </div>
                        <div className="icon-s icon-live" style={ { display: myRank.isPlaying ? 'block' : 'none' } }></div>
                        <div className="nickname fl-box">
                            <span className="name txt-of">{ myRank.nickname }</span>
                            <span className={ 'level_icon m_level_icon_' + myRank.level }></span>
                        </div>
                    </div>
                    <div className="details">
                        <div className="txt">积分：{ myRank.score }</div>
                        <div className="txt" dangerouslySetInnerHTML={ { __html: tiper } }></div>
                    </div>
                </div>
            ) : (<div className="mod-center-holder"></div>)
        )
    }

    render () {
        return (
            this.props.showMask
                ? (
                    <div className="hallow-cp"> <div className="hallow-mask">11月1日揭晓万圣CP，敬请期待~</div></div>
                ) : (
                    <div className="hallow-cp">
                        { this.getCpBox() }
                        { this.getCpMyRank() }
                    </div>
                )
        )
    }
}
