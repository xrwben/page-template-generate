import { PureComponent } from 'react'
import RewardsLayer from './RewardsLayer'

import './style.less'

export default class RewardsPage extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            rwType: '',
            rwKey: '',
            showRw: false
        }

        this.onClose = () => {
            this.setState({
                showRw: false
            })
        }

        this.showRw = (rwType, rwKey) => {
            this.setState({
                rwType, rwKey, showRw: true
            })
        }
    }

    render () {
        return (
            <div className="page-r rewards">
                <div className="pic-sec show-sec-0"></div>
                <div className="pic-sec show-sec-1"></div>
                <div className="pic-sec show-sec-2">
                    <div className="butn btn-go-rw btn-m-top0" onClick={ () => this.showRw('m-0', 'm_0') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-3">
                    <div className="butn btn-go-rw2 btn-m-top1" onClick={ () => this.showRw('m-1', 'm_1') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-m-top2" onClick={ () => this.showRw('m-2', 'm_2') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-m-top3" onClick={ () => this.showRw('m-3', 'm_3') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-4"></div>
                <div className="pic-sec show-sec-5">
                    <div className="butn btn-go-rw btn-u-top0" onClick={ () => this.showRw('u-0', 'u_0') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-6">
                    <div className="butn btn-go-rw2 btn-u-top1" onClick={ () => this.showRw('u-1-4', 'u_1') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-u-top2" onClick={ () => this.showRw('u-1-4', 'u_2') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-7">
                    <div className="butn btn-go-rw2 btn-u-top3" onClick={ () => this.showRw('u-1-4', 'u_3') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-u-top4" onClick={ () => this.showRw('u-1-4', 'u_4') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-8">
                    <div className="butn btn-go-rw2 btn-u-top1" onClick={ () => this.showRw('u-5-9', 'u_5') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-u-top2" onClick={ () => this.showRw('u-5-9', 'u_6') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-9">
                    <div className="butn btn-go-rw2 btn-u-top3" onClick={ () => this.showRw('u-5-9', 'u_7') }>查看奖励</div>
                    <div className="butn btn-go-rw2 btn-u-top4" onClick={ () => this.showRw('u-5-9', 'u_8') }>查看奖励</div>
                </div>
                <div className="pic-sec show-sec-10">
                    <div className="butn btn-go-rw2 btn-u-top-10" onClick={ () => this.showRw('u-5-9', 'u_9') }>查看奖励</div>
                </div>

                { this.state.showRw && RewardsLayer(this.state.rwType, this.state.rwKey, this.onClose) }
            </div>
        )
    }
}
