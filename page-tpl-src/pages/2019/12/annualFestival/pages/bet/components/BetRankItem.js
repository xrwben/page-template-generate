import { PureComponent } from 'react'
import holderPic from '../../../images/holder.png'

const HOLDER = {
    headPic: holderPic,
    nickname: '虚位以待',
    num: '-',
    uid: null,
    level: null
}

export default class BetRankItem extends PureComponent {
    render () {
        let { ind, target } = this.props

        target = target || HOLDER

        return (
            <div className="br-item fl-ver">
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
                        <img className="avatar" src={ target.headPic } />
                    </div>
                    <div className="nickname fl-ver">
                        <span className="name txt-of">{ target.nickname }</span>
                        <span className={ `level_icon u_level_icon_${target.level}` }></span>
                    </div>
                </div>
                <div className="score txt-of">{ target.num }</div>
            </div>
        )
    }
}
