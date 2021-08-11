import { PureComponent } from 'react'

export default class ScreenItem extends PureComponent {
    render () {
        const { data, goRoom } = this.props
        const perName = this.perName

        if (!data) return null

        const [gname, gval] = data.giftName.split(',')

        return (
            <div className="bp-item fl-ver">
                <div className="headpic user">
                    <img className="avatar" src={ data.userHeadPic } />
                </div>
                <div className="user-info">
                    <div className="nickname txt-of">{ data.userName }</div>
                    <div className="pre-s txt-give">送给</div>
                </div>
                <div className="headpic mod" onClick={ () => goRoom(data) }>
                    <img className="avatar" src={ data.modHeadPic } />
                </div>
                <div className="nickname txt-of">{ data.modName }</div>
                <img className="bp-g-pic" src={ data.icon } />
                <div className="bp-g-info">
                    <div className="g-name txt-of">{ gname }</div>
                    <div className="g-val txt-of">{ gval.slice(2).replace('克拉', perName) }</div>
                </div>
            </div>
        )
    }
}
