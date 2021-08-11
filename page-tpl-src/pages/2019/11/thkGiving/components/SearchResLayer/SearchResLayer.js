import { PureComponent } from 'react'

export default class SearchResLayer extends PureComponent {
    render () {
        const result = this.props.result
        return (
            <div className="layer layer-res">
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ this.props.onClose }></div>
                    <div className="res-item fl-box">
                        <div className="headpic">
                            <img className="avatar" alt="用户头像" src={ result.headPic } />
                        </div>
                        <div className="info">
                            <div className="nickname fl-ver">
                                <span className="name txt-of">{ result.nickname }</span>
                                <span className={ `level_icon u_level_icon_${result.level}` }></span>
                            </div>
                            <div className="score">感恩之心*{ result.score }</div>
                        </div>
                        <div className="butn btn-s btn-give2" onClick={ this.props.onGive }>赠送</div>
                    </div>
                </div>
            </div>
        )
    }
}
