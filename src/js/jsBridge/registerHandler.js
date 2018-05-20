/**
 *
 * @authors zhongliang.he (404784102@qq.com)
 * @date    2017-12-21 11:50:55
 * @version 0.0.1
 * @description [所有通过注册到jsBridge native调用h5的方法]
 */

/**
 * [registerPayResult native支付完成后回调h5， 传递订单号]
 * @callback params {[String]} orderNumber [订单号]
 * @author [zhongliang.he]
 */
function registerPayResult (){
    window.WebViewJavascriptBridge.registerHandler('payResult', (orderNumber) => {
        const refreshPageArr = ['myBuyOrder', 'mySellOrder', 'orderDetails'];
        window.f7.hideIndicator();
        if (refreshPageArr.indexOf(window.mainView.activePage.name) > -1){
            window.mainView.router.refreshPage();
        } else {
            window.mainView.router.load({
                url: `views/transactionProcess/orderDetails.html?orderNo=${orderNumber}`
            });
        }
        // 关闭交易视图
        $$('.view-pay-flow').removeClass('show');
    });
}

// 以下是native activity的生命周期函数

/**
 * [registerActivityOnCreate native activity刚创建的时候回调h5]
 * @author [zhongliang.he]
 */
function registerActivityOnCreate (){
    window.WebViewJavascriptBridge.registerHandler('NA_onCreate', () => {});
}

/**
 * [registerActivityOnStart native activity开始初始化时候回调h5]
 * @author [zhongliang.he]
 */
function registerActivityOnStart (){
    window.WebViewJavascriptBridge.registerHandler('NA_onStart', () => {});
}

/**
 * [registerActivityOnStop native activity开始停止时候回调h5]
 * @author [zhongliang.he]
 */
function registerActivityOnStop (){
    window.WebViewJavascriptBridge.registerHandler('NA_onStop', () => {});
}

/**
 * [NA_onResume native activity已经加载好了~通知h5， 可能执行多次]
 * onShow activity 执行，（比如唤醒等, 由不可见到可见）
 * @author [zhongliang.he]
 */
function registerActivityOnResume (){
    window.WebViewJavascriptBridge.registerHandler('NA_onResume', () => {});
}

/**
 * [registerActivityOnPause native activity状态有可见转为不可见时调用，与NA_onResume相反]
 * @author [zhongliang.he]
 */
function registerActivityOnPause (){
    window.WebViewJavascriptBridge.registerHandler('NA_onPause', () => {});
}

/**
 * [registerActivityOnDestroy activity注销的回调]
 * @author [zhongliang.he]
 */
function registerActivityOnDestroy (){
    window.WebViewJavascriptBridge.registerHandler('NA_onDestroy', () => {});
}

export{
    registerPayResult,
    registerActivityOnResume,
    registerActivityOnCreate,
    registerActivityOnStart,
    registerActivityOnStop,
    registerActivityOnPause,
    registerActivityOnDestroy
};

