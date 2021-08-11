// pure function - display components RankItem

export default function RankMeCenter (props) {
    const { meCenter, levelIcon, goRoom } = props

    return (
        <div className="rank-center">
            <div className="infor">
                <div className="headpic">
                    <img className="avatar" src={ meCenter.headPic } alt="主播头像" onClick={ () => goRoom(meCenter) } />
                    <span className="icon-s icon-live-2" style={ { display: meCenter.isPlaying ? 'block' : 'none' } }></span>
                </div>
                <div className="nickname">
                    <div className="name txt-of">{ meCenter.nickName }</div>
                    <span className={ 'level_icon ' + levelIcon + meCenter.level }></span>
                </div>
            </div>
            <div className="details">
                {
                    [0, 2, 1, 3].map((ind) => {
                        var target = meCenter.pairInfos[ind]
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
