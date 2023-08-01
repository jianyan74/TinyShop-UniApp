// import { isBindingCheck } from '@/api/login';
import mHelper from "@/utils/helper";
import mRouter from "@/utils/routerUtil";
import thirdPartyApi from "@/api/tinyShop/thirdParty";
import orderApi from "@/api/tinyShop/order";
import {paymentConfig} from "@/response/payment";
import commonApi from "@/api/tinyShop/common";
import member from "@/api/tinyShop/member";
import {PayTypeEnum} from "@/enum/paymentEnum";

const mPayment = {
    // WxJsSdk
    async wxConfigH5(url: string) {
        if (mHelper.isWechat()) {
            const jsApiList = JSON.stringify([
                "chooseWXPay",
                "scanQRCode",
                "updateAppMessageShareData",
                "updateTimelineShareData",
            ]);
            try {
                const data = await thirdPartyApi.handleWechatConfig({
                    url: url,
                    jsApiList, // 需要调用微信的原生方法
                    debug: false, // 是否打开调试
                });
                // eslint-disable-next-line
                // @ts-ignore
                jWeixin.config(data);
            } catch (e) {
                //
            }
        }
    },

    /*
     *@des 微信支付
     *
     *@param order_group 订单:order;充值:recharge;
     *@param data 订单 {“order_id”:199} 充值 {“money”:100};
     */
    async wechatPay(config: paymentConfig) {
        const {order_group, pay_type, data, route, query = {}, code} = config;
        if (mHelper.platformGroupFilter() === "tinyShopH5") {
            mHelper.toast("仅支持微信H5、微信小程序、APP支付");
            return;
        }
        if (mHelper.platformGroupFilter() === "tinyShopQqMini") {
            mHelper.toast("QQ小程序暂不支持充值");
            return;
        }
        if (
            mHelper.platformGroupFilter() === "tinyShopAndroid" ||
            mHelper.platformGroupFilter() === "tinyShopIos"
        ) {
            try {
                const appPayConfig = await commonApi.handleOrderPay({
                    order_group,
                    pay_type,
                    trade_type: "app",
                    data,
                });
                uni.requestPayment({
                    provider: "wxpay", // 微信支付
                    orderInfo: JSON.stringify(appPayConfig.config), //微信订单数据 data.config
                    success: function () {
                        mHelper.toast("支付成功");
                        mRouter.redirectTo({route, query});
                    },
                    fail: function (err) {
                        mHelper.toast(`支付失败${JSON.stringify(err)}`);
                    },
                });
            } catch (e) {
                //
            }
        } else {
            try {
                const bindingData = (await member.getIsBindingCheck({
                    oauth_client: mHelper.isWechat() ? "wechatMp" : "wechatMini",
                })) as any;
                if (bindingData.openid) {
                    const appPayConfig = (await commonApi.handleOrderPay({
                        order_group,
                        pay_type,
                        trade_type: mHelper.isWechat() ? "mp" : "mini",
                        data,
                        openid: bindingData.openid,
                    })) as any;
                    if (mHelper.platformGroupFilter() === "tinyShopWechatMp") {
                        // eslint-disable-next-line
                        // @ts-ignore
                        jWeixin.ready(() => {
                            // eslint-disable-next-line
                            // @ts-ignore
                            jWeixin.chooseWXPay({
                                ...appPayConfig.config,
                                success() {
                                    mHelper.toast("支付成功");
                                    mRouter.redirectTo({route, query});
                                },
                                fail(err) {
                                    // 支付成功后的回调函数
                                    mHelper.toast(`支付失败${JSON.stringify(err)}`);
                                },
                            });
                        });
                    } else {
                        uni.requestPayment({
                            ...appPayConfig.config,
                            timeStamp: appPayConfig.config.timestamp,
                            success: () => {
                                mHelper.toast("支付成功");
                                mRouter.redirectTo({route, query});
                            },
                            fail: (err) => {
                                mHelper.toast(`支付失败${JSON.stringify(err)}`);
                            },
                        });
                    }
                } else {
                    if (mHelper.platformGroupFilter() === "tinyShopWechatMp") {
                        console.log("data", data);
                        const appPayConfig = (await commonApi.handleOrderPay(
                            {
                                order_group,
                                pay_type,
                                trade_type: "mp",
                                data,
                            },
                            `?code=${code}`
                        )) as any;
                        // eslint-disable-next-line
                        // @ts-ignore
                        jWeixin.ready(() => {
                            // eslint-disable-next-line
                            // @ts-ignore
                            jWeixin.chooseWXPay({
                                ...appPayConfig.config,
                                success() {
                                    mHelper.toast("支付成功");
                                    mRouter.redirectTo({route, query});
                                },
                                fail(err) {
                                    // 支付成功后的回调函数
                                    mHelper.toast(`支付失败${JSON.stringify(err)}`);
                                },
                            });
                        });
                    } else {
                        uni.login({
                            provider: "weixin",
                            success: async (loginRes) => {
                                const appPayConfig = (await commonApi.handleOrderPay(
                                    {
                                        order_group,
                                        pay_type,
                                        trade_type: "mini",
                                        data,
                                    },
                                    `?code=${loginRes.code}`
                                )) as any;
                                uni.requestPayment({
                                    ...appPayConfig.config,
                                    timeStamp: appPayConfig.config.timestamp,
                                    success: () => {
                                        mHelper.toast("支付成功");
                                        mRouter.redirectTo({route, query});
                                    },
                                    fail: (err) => {
                                        mHelper.toast(`支付失败${JSON.stringify(err)}`);
                                    },
                                });
                            },
                            fail: function (err) {
                                mHelper.log(err);
                            },
                        });
                    }
                }
            } catch (e) {
                mHelper.log(`支付失败${JSON.stringify(e)}`);
            }
        }
    },

    /*
     *@des 支付宝支付
     *
     *@param order_group 订单:order;充值:recharge;
     *@param data 订单 {“order_id”:199} 充值 {“money”:100};
     */
    async aliPay(config: paymentConfig) {
        const {order_group, pay_type, data, route, query = {}} = config;
        if (mHelper.platformGroupFilter() === "tinyShopWechatMini") {
            mHelper.toast("微信小程序不支持支付宝充值");
            return;
        }
        if (mHelper.platformGroupFilter() === "tinyShopQqMini") {
            mHelper.toast("QQ小程序不支持支付宝支付");
            return;
        }
        try {
            const appPayConfig = (await orderApi.handleOrderPay({
                order_group,
                pay_type,
                trade_type:
                    mHelper.platformGroupFilter() === "tinyShopH5" ? "wap" : "app",
                data,
            })) as any;
            if (mHelper.platformGroupFilter() === "tinyShopH5") {
                window.location.href = appPayConfig.config.config;
            } else if (mHelper.platformGroupFilter("app") === "tinyShopApp") {
                uni.requestPayment({
                    provider: "alipay",
                    orderInfo: appPayConfig.config.config, //微信、支付宝订单数据
                    success: function () {
                        mHelper.toast("支付成功");
                        mRouter.redirectTo({route, query});
                    },
                    fail: function (err) {
                        mHelper.toast(`支付失败${err}`);
                    },
                });
            }
        } catch (e) {
            //
        }
    },

    /*
     *@des 字节跳动支付
     *
     *@param order_group 订单:order;充值:recharge;
     *@param data 订单 {“order_id”:199} 充值 {“money”:100};
     */
    async byteDancePay(config: paymentConfig) {
        const {order_group, pay_type, data, route, query = {}} = config;
        if (mHelper.platformGroupFilter() !== "tinyShopByteDanceMini") {
            mHelper.toast("该平台不支持字节跳动支付");
        }

        try {
            const appPayConfig = (await orderApi.handleOrderPay({
                order_group,
                pay_type,
                trade_type: "byte-dance",
                data,
            })) as AnyObject;
            if (mHelper.platformGroupFilter() === "tinyShopH5") {
                window.location.href = appPayConfig.config.config;
            } else if (mHelper.platformGroupFilter("app") === "tinyShopApp") {
                uni.requestPayment({
                    // provider: "toutiao",
                    provider: "alipay",
                    // service: "5",
                    orderInfo: appPayConfig.config, //微信、支付宝订单数据
                    success: function (res) {
                        // 支付成功处理逻辑，只有res.code=0时，才表示支付成功
                        // 但是最终状态要以商户后端结果为准
                        // 0：支付成功 1：支付超时 2：支付失败 3：支付关闭 4：支付取消 9：订单状态开发者自行获取。只要调起收银台成功，支付状态都会回调success返回，开发者依据返回的 code 值，进行后续业务逻辑处理
                        if (res.code === 0) {
                            mHelper.toast("支付成功");
                            mRouter.redirectTo({route, query});
                        }
                    },
                    fail: function (err) {
                        mHelper.toast(`支付失败${err}`);
                    },
                });
            }
        } catch (e) {
            //
        }
    },
    /*
     *@des 余额支付
     *
     *@param data 支付参数
     */
    async balancePay(config: paymentConfig) {
        const {order_group, pay_type, data, route, query = {}} = config;
        try {
            await orderApi.handleOrderPay({
                order_group,
                trade_type: "default",
                pay_type,
                data,
            });
            mHelper.toast("支付成功");
            mRouter.redirectTo({route, query});
        } catch (e) {
            //
        }
    },

    async commonPay(config: paymentConfig) {
        const {pay_type} = config;
        switch (pay_type) {
            case PayTypeEnum.WECHAT:
                await mPayment.wechatPay(config);
                break;
            case PayTypeEnum.ALIPAY:
                await mPayment.aliPay(config);
                break;
            case PayTypeEnum.UNIONPAY:
                // await mPayment.aliPay(config);
                break;
            case PayTypeEnum.BYTEDANCE:
                await mPayment.balancePay(config);
                break;
            case PayTypeEnum.BALANCE:
                await mPayment.balancePay(config);
                break;
        }
    },
};
export default mPayment;
