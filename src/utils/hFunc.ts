import {MarketingTypeEnum} from "@/enum/marketingEnum";
import mRouteConfig from "@/config/routes";
import {Route} from "@/response/route";
import mRouter from "@/utils/routerUtil";

/**
 * 跳转商品列表 用于rf-decorate-product-list、rf-home-header 中，装修页面点击商品背景图跳转到商品列表
 * @param {any} info 装修数据中的组件数据下的props
 */
export function navToProductList(info: any) {
    const {productType, dataSource, cate,} = info;
    let url;
    let query = {};
    switch (productType) {
        case "new":
            url = "productList";
            query = {param: JSON.stringify({is_new: 1,}),};
            break;
        case "recommend":
            url = "productList";
            query = {param: JSON.stringify({is_recommend: 1,}),};
            break;
        case "hot":
            url = "productList";
            query = {param: JSON.stringify({is_hot: 1,}),};
            break;
        case MarketingTypeEnum.BARGAIN:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.BARGAIN,};
            break;
        case MarketingTypeEnum.WHOLESALE:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.WHOLESALE,};
            break;
        case MarketingTypeEnum.PRE_SELL:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.PRE_SELL,};
            break;
        case MarketingTypeEnum.GROUP_BUY:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.GROUP_BUY,};
            break;
        case MarketingTypeEnum.DISCOUNT:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.DISCOUNT,};
            break;
        case MarketingTypeEnum.SEC_KILL:
            url = "marketingProductList";
            query = {marketingType: MarketingTypeEnum.SEC_KILL,};
            break;
        default:
            url = "productList";
            break;
    }
    if (dataSource === "cate" && cate && cate.cate_id) {
        url = "productList";
        query = {cate_id: cate.cate_id,};
    }
    if (url) navTo(mRouteConfig[url], query);
}

/**
 * 路由跳转
 * @param {Route} route 路由对象
 * @param {Object} query 参数
 */
export function navTo(route: Route, query = {}) {
    mRouter.push({route, query,});
}
