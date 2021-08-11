import { PureComponent } from 'react'

export default class GiftCart extends PureComponent {
    render () {
        return (
            <div className="gift-cart">
                <div className="w-1">
                    <div className="w-2">
                        <div className="sec-h icon-s h-cart">为Ta霸气清空购物车</div>
                        <div className="sec-sub-h">为心仪的主播清空购物车，就能获得狗粮红包奖励哦，还不快去直播间为Ta清空购物车！</div>
                        <div className="carts-list">
                            <div className="carts-i fl-box">
                                <div className="carts-pic icon-s icon-cart-1">初级购物车</div>
                                <div className="carts-info">
                                    <div className="needs">所需积分：6660</div>
                                    <div className="rws">
                                        <span className="label">用户奖励：</span>
                                        <span className="val">贡献最大的用户奖励狗粮红包*1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="carts-i fl-box">
                                <div className="carts-pic icon-s icon-cart-2">中级购物车</div>
                                <div className="carts-info">
                                    <div className="needs">所需积分：13140</div>
                                    <div className="rws">
                                        <span className="label">用户奖励：</span>
                                        <span className="val">贡献最大的用户奖励狗粮红包*1+随机抽取一位参与本次清空购物车的用户奖励100{ this.perName }</span>
                                    </div>
                                </div>
                            </div>
                            <div className="carts-i fl-box">
                                <div className="carts-pic icon-s icon-cart-3">高级购物车</div>
                                <div className="carts-info">
                                    <div className="needs">所需积分：33440</div>
                                    <div className="rws">
                                        <span className="label">用户奖励：</span>
                                        <span className="val">贡献最大的用户奖励狗粮红包*2+随机抽取两位参与本次清空购物车的用户奖励100{ this.perName }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carts-tiper">注：狗粮红包即时下发至背包，于12日23:59:59过期，请及时送出！</div>
                        <div className="butn btn-s btn-cart" onClick={ this.props.showRecord }>我的清空记录</div>
                    </div>
                </div>
            </div>
        )
    }
}
