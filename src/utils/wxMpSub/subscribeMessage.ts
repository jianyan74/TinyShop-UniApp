/**
 * 微信小程序订阅消息
 */
import store from "@/store";
import {NotifyConfigItem} from "@/response/config";

/**
 * tmpId对应场景
 */
const tmpScope = {
    // 订单付款时触发
    createOrder: ['order_consign', 'coupon_give'], //普通订单
    presaleOrder: ['order_consign', 'coupon_give', 'order_stock_up_accomplish'], // 预售订单
    groupOrder: ['order_consign', 'order_wholesale_accomplish', 'order_wholesale_close'], //拼团订单
    // 申请售后时触发
    afterSale: ['order_return_member_deliver', 'order_return_apply_close', 'order_return_money'], // 售后申请
    // 砍价时触发
    bargain: ['order_bargain_accomplish', 'order_bargain_close'], // 砍价
};
/**
 * 组合配置 {name: "order_consign", title: "", template_id: ""}
 */
const getSubConfig = () => {
    const configs: NotifyConfigItem[] = store.getters['user/getNotifyConfig'];
    const subConfig = {};
    configs.forEach((item) => {
        subConfig[item.name] = item.template_id;
    })
    return subConfig;
}
/**
 * 获取订阅模版id
 * @param scopeName
 */
const getTmpIds = (scopeName: string) => {
    const sConfig = getSubConfig();
    const tmpNames = tmpScope[scopeName];
    const tmpIds:string[] = [];
    tmpNames.forEach(i => {
        sConfig[i] && tmpIds.push(sConfig[i])
    })
    return tmpIds;
}
/**
 * 发起订阅
 * @param tmpIds
 */
const subscribe = (tmpIds: Array<string>) => {
    return new Promise((resolve) => {
        uni.requestSubscribeMessage({
            tmplIds: tmpIds,
            success (res) {
                console.log('sub success', res)
            },
            fail (err) {
                console.error('sub err：', err)
            },
            complete(){
                resolve('');
            }
        })
    })
}
/**
 * 订单付款时发起订阅
 */
export function subOrderMessage(orderType: number) {
    let scopeName = "";
    switch (orderType) {
        case 4: //拼团订单
            scopeName = 'groupOrder';
            break;
        case 6: // 预售订单
            scopeName = 'presaleOrder';
            break;
        default: //其它当普通订单
            scopeName = 'createOrder';
    }
    return subscribe(getTmpIds(scopeName));
}
/**
 * 售后与砍价发起订阅
 */
export function subMessage(actionType: string) {
    let scopeName;
    switch (actionType) {
        case 'afterSale': // 售后
            scopeName = 'afterSale';
            break;
        case 'bargain': // 砍价
            scopeName = 'bargain';
            break;
        default:
            scopeName = '';
    }

    return subscribe(getTmpIds(scopeName));
}
