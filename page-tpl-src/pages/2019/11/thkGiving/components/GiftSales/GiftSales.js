import { PureComponent } from 'react'

import feastPic from '../../images/feast.png'
import ghPic from '../../images/chicken.png'
import $svgPlayer from '../../plugins/svgPlayer'

export default class GiftSales extends PureComponent {
    preview () {
        $svgPlayer.play('//static.guojiang.tv/app/gift/pc_animation/4911/data.json')
    }

    render () {
        return (
            <div className="gift-sales wrap-box">
                <div className="wrap-c">
                    <div className="h-title h-gift"></div>
                    <div className="sales-c">
                        <div className="gift-i">
                            <div className="gift-pic icon-s g-bg">
                                <span className="icon-s badge"></span>
                                <img className="pic" src={ ghPic } alt="幸运火鸡" />
                                <div className="gift-val">10{ this.perName }/个</div>
                            </div>
                            <div className="name">幸运火鸡</div>
                        </div>
                        <div className="gift-i">
                            <div className="gift-pic icon-s g-bg">
                                <span className="icon-s badge"></span>
                                <img className="pic" src={ feastPic } alt="火鸡盛宴" />
                                <div className="gift-val">6666{ this.perName }/个</div>
                            </div>
                            <div className="name">火鸡盛宴</div>
                            <div className="opt fl-box">
                                <div className="butn btn-s btn-preview" onClick={ this.preview }>预览</div>
                                <div className={ 'butn btn-s btn-buy' + (this.props.stage > 1 ? '-d' : '') } onClick={ this.props.onGoBuy }>购买</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
