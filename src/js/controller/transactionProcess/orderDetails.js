import Vue from 'vue';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';
import store from '../../../utils/localStorage';
import {orderPriceFormatter} from '../../../utils/strTool';
import TransactionProcessModel from '../../model/TransactionProcessModel';
import {getYmdTime, getDate, secondToDate} from '../../../utils/time';
import {createURL} from '../../../utils/strTool';
import ObjectUtils from '../../../utils/ObjectUtils';
import {callUploadPayment, callAppPay, callCopyResult} from '../../jsBridge/callHandler';

function orderDetailsInit (f7, view, page){
    const {mWebUrl, cacheUserInfoKey} = config;
    const {orderNo} = page.query;

    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-order-details');
    const currentPage = $$(pages[pages.length - 1]);
    const $ptrContent = currentPage.find('.page-content');
    const userInfo = store.get(cacheUserInfoKey) || {};
    const {id} = userInfo;

    // 订单详情强制性登录！
    if (!id){
        f7.alert('您的登录已经失效，请重新登录~', '提示', () => {
            view.router.load({
                url: 'views/user.html',
                reload: true
            });
        });
        return;
    }

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            // 1 卖家    2 买家
            userType: 0,
            orderInfo: {
                demandProductInfo: {
                    imgList: []
                },
                deliveryInfo: {},
                helpInfo: {},
                operationLogs: [],
                orderUrges: {},
                receiverInfo: {}
            }
        },
        methods: {
            getDate,
            secondToDate,
            goOffline (){
                nativeEvent.goNewWindow(`${mWebUrl}transactionProcess/offlineTransactionProcess?s=n`);
            },
            // 客服帮助
            goToHelp (){
                const vm = this;
                view.router.load({
                    url: `views/transactionProcess/platformHelp.html?helpId=${vm.orderInfo.helpInfo.id}&isBuyer=${vm.userType}`
                });
            },
            // 查看商品（信息）详情
            viewsGoodsInfo (){
                const {demandId} = this.orderInfo;
                view.router.load({
                    url: `views/selldetail.html?id=${demandId}`
                });
            },
            // 担保平台说明页面
            goToGuarantee (){
                window.mainView.router.load({
                    url: 'views/transactionProcess/guaranteeDesc.html'
                });
            },

            /**
             * [viewUserShop 查看卖家/买家个人主页]
             */
            viewUserShop (){
                const vm = this;
                const {
                    sellerUserId,
                    buyerUserId
                } = vm.orderInfo;

                // 数据还没回来
                if (!sellerUserId){
                    return;
                }

                let userId = sellerUserId;
                1 == vm.userType && (userId = buyerUserId);
                view.router.load({
                    url: `views/otherIndex.html?currentUserId=${userId}`
                });
            },
            // 立即付款，调起native支付
            callAppPay (){
                const vm = this;
                callAppPay({
                    orderId: vm.orderInfo.orderNo
                });
            },
            // 点击更多操作,弹出ActionSheet
            showCancelOrderActionSheet (){
                const vm = this;
                const button1 = [
                    {
                        text: '取消订单',
                        onClick: function (){
                            vm.selectCancelOrderReason();
                        }
                    }
                ];
                const button2 = [
                    {
                        text: '取消',
                        color: 'red'
                    }
                ];
                f7.actions([button1, button2]);
            },
            // 点击取消订单后，弹出选择取消原因
            selectCancelOrderReason (){
                const vm = this;
                const button1 = [
                    {
                        text: '我不想买了',
                        onClick: function (){
                            vm.cancelOrder('我不想买了');
                        }
                    },
                    {
                        text: '信息填写错误，重新拍',
                        onClick: function (){
                            vm.cancelOrder('信息填写错误，重新拍');
                        }
                    },
                    {
                        text: '卖家缺货',
                        onClick: function (){
                            vm.cancelOrder('卖家缺货');
                        }
                    },
                    {
                        text: '其他原因',
                        onClick: function (){
                            vm.cancelOrder('其他原因');
                        }
                    }
                ];
                const button2 = [
                    {
                        text: '取消',
                        color: 'red'
                    }
                ];
                f7.actions([button1, button2]);
            },
            // 买家取消订单
            cancelOrder (text){
                const {orderNo} = this.orderInfo;
                f7.modal({
                    title: text ? '取消订单' : '关闭订单',
                    text: `${text ? '取消' : '关闭'}交易之后本次交易将无法继续进行，请谨慎操作~`,
                    // verticalButtons: 'true',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {}
                        },
                        {
                            text: text ? '确认取消' : '确认关闭',
                            onClick: () => {
                                f7.showIndicator();
                                TransactionProcessModel.closeOrder({
                                    orderNo,
                                    reason: text || ''
                                }, (res) => {
                                    const {code, message} = res;
                                    f7.hideIndicator();
                                    if (1 == code){
                                        // f7.alert(text ? '订单已取消~' : '订单已关闭~', '提示');
                                        loadOrderDetail();
                                        window.mainView.router.refreshPreviousPage();
                                        return;
                                    }
                                    f7.alert(message, '提示');
                                });
                            }
                        }
                    ]
                });
            },
            // 卖家关闭交易
            closeOrder (){
                const vm = this;
                vm.cancelOrder('');
            },
            // 修改价格
            updatePrice (){
                f7.showIndicator();
                const {orderNo, payTotalMoney} = this.orderInfo;
                window.mainView && window.mainView.router.load({
                    url: `views/transactionProcess/revisePrice.html?orderNo=${orderNo}&payTotalMoney=${payTotalMoney}`
                });
            },

            // 催买家发货
            expediting (){
                const vm = this;
                f7.showIndicator();
                TransactionProcessModel.postSellerExpediting({
                    orderNo: vm.orderInfo.orderNo
                }, (data) => {
                    const {code, message} = data;
                    f7.hideIndicator();
                    if(code == 1){
                        nativeEvent['nativeToast'](1, '卖家已收到提醒~');
                        return;
                    }
                    f7.alert(message, '提示');
                });
            },

            // 申请客服帮助
            serviceHelp (){
                f7.showIndicator();
                const vm = this;
                let paramObj = {};
                paramObj.isBuyer = vm.userType;
                paramObj.orderNo = vm.orderInfo.orderNo;
                if(vm.orderInfo.demandProductInfo.imgList){
                    paramObj.img = vm.orderInfo.demandProductInfo.imgList[0];
                }
                paramObj.fishTypeName = vm.orderInfo.demandProductInfo.fishTypeName;
                paramObj.numText = vm.orderInfo.demandProductInfo.num + vm.orderInfo.demandProductInfo.unitText;
                paramObj.specifications = vm.specText;
                let url = createURL('views/transactionProcess/needHelp.html', paramObj);
                view.router.load({
                    url
                });
            },
            // 填写物流信息
            writeLogisticsInfo (){
                f7.showIndicator();
                const vm = this;
                window.mainView.router.load({
                    url: `views/transactionProcess/logisticsInfo.html?orderNo=${vm.orderInfo.orderNo}`
                });
            },
            // 确认收货
            confirmationReceipt (){
                const vm = this;
                f7.modal({
                    title: '确认收货',
                    text: '对收到的货物满意的话就尽快确认收货吧,请确认是本人操作~',
                    // verticalButtons: 'true',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {}
                        },
                        {
                            text: '确定',
                            onClick: () => {
                                f7.showIndicator();
                                TransactionProcessModel.confirmationReceipt({
                                    orderNo: vm.orderInfo.orderNo
                                }, (data) => {
                                    f7.hideIndicator();
                                    const {message, code} = data;
                                    if (1 === code){
                                        window.mainView.router.refreshPage();
                                        window.mainView.router.refreshPreviousPage();
                                        nativeEvent['nativeToast'](1, '交易成功~');
                                        return;
                                    }
                                    f7.alert('提示', message);
                                });
                            }
                        }
                    ]
                });
            },
            // 删除订单
            deleteOrder (){
                const vm = this;
                f7.modal({
                    title: '删除订单',
                    text: '订单删除后本次交易将无法继续进行，请谨慎操作~',
                    // verticalButtons: 'true',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {}
                        },
                        {
                            text: '确定',
                            onClick: () => {
                                f7.showIndicator();
                                TransactionProcessModel.deleteOrder({
                                    orderNo: vm.orderInfo.orderNo
                                }, (data) => {
                                    f7.hideIndicator();
                                    const {message, code} = data;
                                    if (1 === code){
                                        window.mainView.router.refreshPreviousPage();
                                        nativeEvent['nativeToast'](1, '订单已删除~');
                                        setTimeout(window.mainView.router.back, 100);
                                        return;
                                        // f7.alert('订单已删除~', '温馨提示', window.mainView.router.back);
                                    }else{
                                        f7.alert(message, '提示');
                                    }
                                });
                            }
                        }
                    ]
                });
            },
            // 调用native上传凭证
            callUploadPayment (){
                const orderId = this.orderInfo.orderNo;
                callUploadPayment(orderId);
            },
            // 联系买家
            contactBuyer (){
                const {buyerPhone} = this.orderInfo;
                nativeEvent.contactUs(buyerPhone);
            },

            /**
             * [copyResult 复制单号]
             * @param  {[String]} val [订单号]
             */
            copyResult (){
                const {orderNo} = this.orderInfo;
                callCopyResult(orderNo);
                nativeEvent.nativeToast(1, '复制成功！');
            }

        },
        computed: {
            /**
             * [deliveryTypeText 物流类型文案]
             * @return {[String]} [0汽运，1空运]
             */
            deliveryText (){
                const {deliveryType, deliveryOrderNo, deliveryStartTime} = this.orderInfo.deliveryInfo;
                let text = '';
                let content = '';
                let time = getYmdTime(deliveryStartTime);

                if (0 === deliveryType){
                    text = '汽运';
                    content = `物流号：${deliveryOrderNo}`;
                }

                if (1 === deliveryType){
                    text = '空运';
                    content = `航班号：${deliveryOrderNo}`;
                }
                return {
                    text,
                    content,
                    time
                };
            },
            // 买家：XXX / 卖家：XXX
            userTypeText (){
                const vm = this;
                let res = '';
                const {
                    sellerName,
                    sellerUserId,
                    buyerName,
                    buyerUserId
                } = vm.orderInfo;

                // 卖家
                if (sellerUserId == id){
                    res = `买家：${buyerName || '匿名用户'}`;
                }

                // 买家
                if (buyerUserId == id){
                    res = `卖家：${sellerName || '匿名用户'}`;
                }
                return res;
            },
            // 收货地址
            receiverAddress (){
                const vm = this;
                const {
                    receiverProvinceName,
                    receiverCityName,
                    receiverDetailAddress
                } = vm.orderInfo.receiverInfo || {};
                return `${receiverProvinceName || ''}${receiverCityName || ''}${receiverDetailAddress || ''}`;
            },
            // 是否显示客服帮助模块
            isShowHelpInfo (){
                const vm = this;
                const stateArr = [0, 1];
                const {
                    state
                } = vm.orderInfo.helpInfo || {};
                return stateArr.indexOf(state) > -1;
            },
            // 维权帮助状态问啊
            helpInfoStateText (){
                const vm = this;
                let res = '-';
                const {
                    state
                } = vm.orderInfo.helpInfo || {};
                0 === state && (res = '处理中');
                1 === state && (res = '处理完成');
                return res;
            },
            // 商品图片
            picImg (){
                let url = '';
                const vm = this;
                const {imgList} = vm.orderInfo.demandProductInfo || [];
                imgList[0] && (url += `${imgList[0]}@1e_1c_2o_0l_110h_110w_90q.src`);
                return url;
            },
            // 规格标签
            specText (){
                let res = '';
                const vm = this;
                res += vm.orderInfo.demandProductInfo.quantityTagList && vm.orderInfo.demandProductInfo.quantityTagList.length && (vm.orderInfo.demandProductInfo.quantityTagList[0]['tagName'] || '') || '';
                res && vm.orderInfo.demandProductInfo.specifications && (res = `${res}，${vm.orderInfo.demandProductInfo.specifications}`);
                (!res) && vm.orderInfo.demandProductInfo.specifications && (res += vm.orderInfo.demandProductInfo.specifications);
                return res;
            }
        },
        filters: {
            orderPriceFormatter,
            getDate
        }
    });

    /**
     * [loadOrderDetail 获取订单详情]
     */
    const loadOrderDetail = () => {
        TransactionProcessModel.getOrderDetail({
            orderNo
        }, (res) => {
            f7.hideIndicator();
            f7.pullToRefreshDone();
            const {code, message, data} = res;
            if (1 !== code){
                f7.alert(message);
                return;
            }
            vueData.orderInfo = ObjectUtils.copy(data);
            vueData.userType = 2;
            data.sellerUserId === id && (vueData.userType = 1);
        });
    };

    loadOrderDetail();

    // 下拉刷新
    $ptrContent.on('refresh', () => {
        loadOrderDetail();
    });
}

export {
    orderDetailsInit
};
