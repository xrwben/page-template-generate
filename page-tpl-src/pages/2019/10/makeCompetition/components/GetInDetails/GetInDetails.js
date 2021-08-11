import { PureComponent } from 'react'

export default class GetInDetails extends PureComponent {
    constructor (props) {
        super(props)

        this.data = {
            curr: 700,
            totalTarget: 5000,
            details: [
                {
                    target: 5000,
                    rewards: '暴鸡*30'
                },
                {
                    target: 10000,
                    rewards: '暴鸡*60+500战力'
                },
                {
                    target: 15000,
                    rewards: '麦克风*1+800战力'
                },
                {
                    target: 25000,
                    rewards: '晋级飘屏通知*1+红包雨*1+1000战力'
                },
                {
                    target: 50000,
                    rewards: '萌萌喵*1+1500战力'
                },
                {
                    target: 100000,
                    rewards: '开播飘屏*1+红包雨*1+2500战力'
                }
            ]
        }
    }

    getGkDetails () {
        return this.data.details[this.props.showGk]
    }

    render () {
        const details = this.getGkDetails()

        let power = 0
        if (this.props.gk === this.props.showGk) {
            power = this.props.power
        }
        if (this.props.gk > this.props.showGk) {
            power = details.target
        }

        return (
            <div className="gt-details">
                {
                    this.props.isThrough && <div className="icon-s all-in"></div>
                }
                <div className="dt-name icon-s h-curr-bg">第{ this.props.showGk + 1 }关</div>
                {
                    this.props.showGk === 3 && <div className="dt-info">已通关 { this.props.counter } 人</div>
                }
                <div className="dt-progress">
                    <div className="dt-prog-i" style={ { width: power / details.target * 100 + '%' } }></div>
                    <div className="dt-prog-value">{ power }/{ details.target }</div>
                </div>
                <div className="dt-info">距通关还需<span className="cl-red">{ details.target - power }</span>战力</div>
                <div className="dt-info mt-10">主播奖励：{ details.rewards }</div>
                {
                    this.props.showGk === 3 && <div className="dt-info dt-tip">注：18日未通过此关的主播，无法解锁晋级赛</div>
                }
            </div>
        )
    }
}
