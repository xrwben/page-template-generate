import { Component } from 'react'

export default class StageTab extends Component {
    render () {
        return (
            <div className="tab-stage fl-box">
                <div className={ 'butn tab-stage-i tab-s tab-prom' + (this.props.stage < 6 ? '-a' : '') } onClick={ () => this.props.onToggle(1) }>晋级赛</div>
                <div className={ 'butn tab-stage-i tab-s tab-pk' + (this.props.stage >= 6 ? '-a' : '') } onClick={ () => this.props.onToggle(2) }>擂主争霸赛</div>
            </div>
        )
    }
}
