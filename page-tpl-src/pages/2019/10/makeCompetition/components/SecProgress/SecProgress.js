import { PureComponent } from 'react'

export default class SecProgress extends PureComponent {
    render () {
        return (
            <div className="sec-prog">
                {
                    ['一', '二', '三', '四', '五', '六'].map((gkItem, gkInd) => (
                        <div
                            className={ 'butn prog-i' + (this.props.showGk === gkInd ? ' active' : '') } key={'gk-i-' + gkInd}
                            onClick={ e => this.props.onToggle(gkInd) } >
                            <div className="icon-s icon-dot"></div>
                            <div className="name">第{gkItem}关</div>
                        </div>
                    ))
                }
                <div className={ 'prog-index stage-' + (this.props.isThrough ? 7 : (this.props.gk + 1)) }>
                    <div className="prog-ic"></div>
                </div>
            </div>
        )
    }
}
