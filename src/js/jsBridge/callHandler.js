/**
 *
 * @authors zhongliang.he (404784102@qq.com)
 * @date    2017-12-21 11:50:55
 * @version 0.0.1
 * @description [所有通过jsBridge 调用native的方法]
 */

import {JsBridge} from '../../middlewares/JsBridge';

/**
 * [bridgeAppPay 调起native支付]
 * @param  {[Object]} data [传递的参数，订单号]
 */
function callAppPay (data){
    f7.showIndicator();
    const {orderId} = data;
    JsBridge('JS_AppPay', {
        orderId
    });
}

/**
 * [bridgeCloseNativePop 调用native关闭第三方webview或者activity]
 */
function callCloseNativePop (){
    JsBridge('JS_AppPopBack');
}

/**
 * [callUploadPayment 线下交易上传凭证，调起native的页面]
 * @param  {[Number]} orderId [订单号]
 * @param  {[String]} imgUrl  [修改凭证的图片url]
 */
function callUploadPayment (orderId, imgUrl){
    JsBridge('JS_AppPushToOfflinePayment', {
        orderId,
        voucherUrl: imgUrl || ''
    });
}

/**
 * [callCopyResult 复制到剪切板]
 * @param  {[String]} val [需要复制的值]
 */
function callCopyResult (val){
    JsBridge('JS_CopyResult', {
        pasteboardStr: val
    });
}
/**
 * [callAddressResult 调用app选择地区控件]
 */
function callAddressResult (provinceIndex, cityIndex, callback){
    JsBridge('JS_AppEditMyAddress', {
        provinceIndex,
        cityIndex
    }, callback);
}

export{
    callAppPay,
    callCloseNativePop,
    callUploadPayment,
    callCopyResult,
    callAddressResult
};
