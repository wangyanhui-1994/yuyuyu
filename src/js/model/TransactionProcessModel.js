/**
 *
 * @authors zhongliang.he (404784102@qq.com)
 * @date    2017-12-21 17:31:25
 * @description [交易流程相关Model]
 */

import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class TransactionProcessModel{

	/**
	 * [getMySellOrderList 获取我卖出的订单列表]
	 * @param  {[Object]}   data     [参数：pageSize, pageNo]
	 * @param  {Function} callback [获取到数据后的回调]
	 * @author [zhongliang.he]
	 */
    getMySellOrderList (data, callback){
        RestTemplate.get(
            'guarantee/orders/seller',
            {},
            data,
            callback,
            true,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [getMyBuyOrderList 获取我买到的订单列表]
     * @param  {[Object]}   data     [参数：pageSize, pageNo]
     * @param  {Function} callback [获取到数据后的回调]
	 * @author [zhongliang.he]
     */
    getMyBuyOrderList (data, callback){
        RestTemplate.get(
            'guarantee/orders/buyer',
            {},
            data,
            callback,
            true,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [postSellerExpediting 催买家发货]
     * @param  {[Object]}   data     [只有一个key: orderNo]
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    postSellerExpediting (data, callback){
        const { orderNo } = data || {};
        RestTemplate.post(
            `guarantee/orders/${orderNo}/urges`,
            {},
            {},
            {},
            callback
        );
    }
    /**
     * [postPurchaseOrder 创建采购单]
     * @param  {[Object]}   data     [参数：pageSize, pageNo]
     * @param  {Function} callback [获取到数据后的回调]
     * @author [candy]
     */
    postPurchaseOrder (data, callback){
        RestTemplate.post(
            'guarantee/orders',
            {},
            {},
            data,
            callback
        );
    }

    /**
     * [deleteOrder 删除订单]
     * @param  {[Object]}   data     [只有一个key: orderNo]
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    deleteOrder (data, callback){
        const { orderNo } = data || {};
        RestTemplate.del(
            `guarantee/orders/${orderNo}`,
            {},
            {},
            callback
        );
    }
    /**
     * [postHelp 申请平台帮助]
     * @param  {[type]}   orderNo  [订单id]
     * @param  {[Object]}   data     [参数]
     * @param  {Function} callback [获取到数据后的回调]
     * @return {[type]}            [description]
     * @author [candy]
     */
    postHelp (orderNo, data, callback){
        RestTemplate.post(
            `guarantee/orders/${orderNo}/helps`,
            {},
            {},
            data,
            callback
        );
    }

    /**
     * [deleteOrder 确认收货]
     * @param  {[Object]}   data     [只有一个key: orderNo]
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    confirmationReceipt (data, callback){
        const { orderNo } = data || {};
        RestTemplate.post(
            `guarantee/orders/${orderNo}/confirmation`,
            {},
            {},
            {},
            callback
        );
    }
    /**
     * [deleteHelp 撤销平台帮助]
     * @param  {[type]}   helpId   [帮助id]
     * @param  {Function} callback [获取到数据后的回调]
     * @author [candy]
     */
    deleteHelp (helpId, callback){
        RestTemplate.del(
            `guarantee/helps/${helpId}`,
            {},
            '',
            callback
        );
    }

    /**
     * [cancelOrder 取消订单]
     * @param  {[Object]}   data
     * {
     *     orderNo: 订单号,
     *     reason: 取消原因
     * }
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    closeOrder (data, callback){
        const {orderNo, reason} = data;
        RestTemplate.put(
            `guarantee/orders/${orderNo}/cancellation`,
            {},
            {},
            {
                reason: reason || ''
            },
            callback
        );
    }
    /**
     * [getLastReceiverInfo 获取上次收货人信息]
     * @param  {Function} callback [获取到数据后的回调]
     * @author [candy]
     */
    getLastReceiverInfo (callback){
        RestTemplate.get(
            'guarantee/lastOrderReceiverInfo',
            {},
            {},
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [getLatestBuy 我最近买的个数]
     * @param  {[type]}   data     [上次浏览时间]
     * @param  {Function} callback [获取到数据后的回调]
     * @author [candy]
     */
    getLatestBuy (data, callback){
        RestTemplate.get(
            'guarantee/latestCount/asBuyer',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [getLatestSell 我最近卖的个数]
     * @param  {[type]}   data [上次浏览时间]
     * @param  {Function} callback     [获取到数据后的回调]
     * @author [candy]
     */
    getLatestSell (data, callback){
        RestTemplate.get(
            'guarantee/latestCount/asSeller',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [getOrderDetail 获取订单详情]
     * @param  {[Object]}   data     [只有一个key: orderNo]
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    getOrderDetail (data, callback){
        const { orderNo } = data || {};
        RestTemplate.get(
            `guarantee/orders/${orderNo}`,
            {},
            {},
            callback,
            true,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    /**
     * [updateOrderPrice 修改订单价格]
     * @param  {[Object]}   data
     * {
     *     orderNo: 订单号,
     *     newPrice: 新的订单价格
     * }
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    updateOrderPrice (data, callback){
        const {newPrice, orderNo} = data;
        RestTemplate.put(
            `guarantee/orders/${orderNo}/price`,
            {},
            {},
            {
                newPrice
            },
            callback
        );
    }

    /**
     * [postOrderLogistics 填写物流信息]
     * @param  {[Object]}   data
     * {
     *     orderNo: 订单号,
     *     deliveryOrderNo: 汽运填订单号，空运填航班号,
     *     deliveryStartTime: 发货时间,
     *     deliveryType: 类型
     * }
     * @param  {Function} callback [ajax回调]
     * @author [zhongliang.he]
     */
    postOrderLogistics (data, callback){
        const {
            orderNo,
            deliveryOrderNo,
            deliveryStartTime,
            deliveryType
        } = data || {};
        RestTemplate.post(
            `guarantee/orders/${orderNo}/logistics`,
            {},
            {},
            {
                deliveryOrderNo,
                deliveryStartTime,
                deliveryType
            },
            callback
        );
    }
    /**
     * [getHelpsDetail 获取维权详情]
     * @param  {[type]}   data     [只有一个key: helpId]
     * @param  {Function} callback [ajax回调]
     * @author [candy]
     */
    getHelpsDetail (data, callback){
        const { helpId } = data || {};
        RestTemplate.get(
            `guarantee/helps/${helpId}`,
            {},
            {},
            callback,
            true,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    /**
     * [getToBePaidBuy 作为买家获取待支付订单数]
     * @param  {Function} callback     [获取到数据后的回调]
     * @author [candy]
     */
    getToBePaidBuy (callback){
        RestTemplate.get(
            'guarantee/orders/toBePaid/asBuyer',
            {},
            {},
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    /**
     * [getToBePaidBuy 作为卖家获取待发货订单数]
     * @param  {Function} callback     [获取到数据后的回调]
     * @author [candy]
     */
    getToBeDeliveredSell (callback){
        RestTemplate.get(
            'guarantee/orders/toBeDelivered/asSeller',
            {},
            {},
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    /**
     * [getLastAddress 获取上次收货人信息]
     * @param  {Function} callback [获取到数据后的回调]
     * @author [candy]
     */
    getLastAddress (callback){
        RestTemplate.get(
            'guarantee/lastOrderReceiverInfo',
            {},
            {},
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    /**
     * [postAppaySettled 提交申请入驻]
     * @param  {[Object]}   data     [传递后台的数据]
     * {
     *     fishType: 鱼种名,
     *     name: 申请人姓名
     * }
     * @param  {[string]}   headers  [需要添加到header的数据]
     * @param  {Function} callback [回调函数]
     * @author [yang]
     */
    postAppaySettled (data, headers, callback){
        const {
            fishType,
            name
        } = data || {};
        RestTemplate.post(
            'guarantee/users',
            headers,
            {},
            {
                fishType,
                name
            },
            callback
        );
    }

}

const transactionProcessModel = new TransactionProcessModel();
export default transactionProcessModel;
