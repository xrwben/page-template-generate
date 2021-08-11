import { PureComponent } from 'react'

export default class RankMeCenter extends PureComponent {
    render () {
        if (!this.props.data) return null

        const { headPic, nickName, level, isPlaying } = this.props.data

        return (
            <div className="rank-center fl-box">
                <div className="infor">
                    <div className="headpic">
                        <img className="avatar" src={ headPic } onClick={ () => this.goRoom(this.props.data) } />
                        <span className="pre-s icon-live" style={ { display: isPlaying ? '' : 'none' } }></span>
                    </div>
                    <div className="nickname fl-box">
                        <div className="name txt-of">{ nickName }</div>
                        <span className={ `level_icon m_level_icon_${level}` }></span>
                    </div>
                </div>
                <div className="details fl-box">
                    {
                        [0, 2, 1, 3].map((ind) => {
                            var target = this.props.data.pairInfos[ind]
                            return (
                                <div className="di-item" key={ 'di_prop_' + ind }>
                                    <div className="di-title">{ target.name }</div>
                                    <div className="di-value">{ target.value }</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
