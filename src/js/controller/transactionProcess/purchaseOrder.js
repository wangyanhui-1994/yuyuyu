import Vue from 'vue';
// import store from '../../../utils/localStorage';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';
import TransactionProcessModel from '../../model/TransactionProcessModel';
import {callAppPay} from '../../jsBridge/callHandler';
import ObjectUtils from '../../../utils/ObjectUtils';
import {createURL} from '../../../utils/strTool';
// import {contactUs} from '../../../utils/domListenEvent';
function purchaseOrderInit (f7, view, page){
    f7.hideIndicator();
    const {mWebUrl} = config;
    /**
     * 获取当前页面
     */
    const pages = $$('.view-pay-flow .pages>.page-purchase-order');
    const currentPage = $$(pages[pages.length - 1]);
    // const lastHeader = $$($$('.view-pay-flow .navbar>div')[$$('.view-pay-flow .navbar>div').length - 1]);
    const {demandId, img, quantityTags, fishTypeName, contactName} = page.query;
    let error = '请先与卖家沟通价格！';
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            hasMedal: false,
            orderInfo: {
                buyerRemark: '',
                demandId,
                money: '',
                num: '',
                receiverCityId: '',
                receiverCityName: '',
                receiverDetailAddress: '',
                receiverName: '',
                receiverPhone: '',
                receiverProvinceId: '',
                receiverProvinceName: '',
                unit: 1
            },
            receiverInfo: {},
            unitText: '尾',
            unitVal: 1,
            img,
            quantityTags,
            fishTypeName,
            contactName
        },
        methods: {
            /**
             * [goToPay 通过jsBridge调用native支付]
             */
            goToPay (){
                const vm = this;
                if(!vm.payOn){
                    return;
                }
                if(vm.orderInfo.money < 500){
                    error = '这点小钱您可大胆交易，担保交易金额至少500元！';
                    f7.alert(error, '提示');
                    return;
                }

                f7.modal({
                    title: '温馨提示',
                    text: '请先与卖家电话沟通，将协商确认后的价格填写在输入框内。如果价格变动，也可以和卖家协商~',
                    // verticalButtons: 'true',
                    buttons: [
                        // {
                        //     text: '我再想想',
                        //     onClick: () => {}
                        // },
                        {
                            text: '我知道了',
                            onClick: () => {
                                f7.showIndicator();
                                postPurchaseOrder();
                            }
                        }
                    ]
                });
            },
            changeAddress (){
                if(!vueData.receiverInfo.receiverProvinceName){
                    vueData.receiverInfo.receiverProvinceName = this.orderInfo.receiverProvinceName;
                    vueData.receiverInfo.receiverProvinceId = this.orderInfo.receiverProvinceId;
                    vueData.receiverInfo.receiverCityId = this.orderInfo.receiverCityId;
                    vueData.receiverInfo.receiverCityName = this.orderInfo.receiverCityName;
                    vueData.receiverInfo.receiverDetailAddress = this.orderInfo.receiverDetailAddress;
                    vueData.receiverInfo.receiverPhone = this.orderInfo.receiverPhone;
                    vueData.receiverInfo.receiverName = this.orderInfo.receiverName;
                };
                let url = createURL('views/transactionProcess/receivingAddress.html', vueData.receiverInfo);
                window.payFlowView.router.load({
                    url
                });
            },
            aboutItem (){
                nativeEvent.goNewWindow(`${mWebUrl}transactionProcess/serviceAgreement?s=n`);
            },
            checkBuyLength (){
                if(this.orderInfo.money && this.orderInfo.money.length > 8){
                    this.orderInfo.money = this.orderInfo.money.substring(0, 8);
                }
                if(this.orderInfo.num && this.orderInfo.num.length > 8){
                    this.orderInfo.num = this.orderInfo.num.substring(0, 8);
                }
            }
        },
        computed: {
            payOn (){
                return this.orderInfo.num && this.orderInfo.money && this.address;
            },
            address (){
                let res = '';
                const {
                        receiverName,
                        receiverPhone,
                        receiverProvinceName,
                        receiverCityName,
                        receiverDetailAddress
                    } = this.orderInfo;
                receiverName && (res = `${receiverName}  ${receiverPhone}</br>${receiverProvinceName}${receiverCityName}${receiverDetailAddress}`);
                return res;
            }
        }
    });

    window.purchaseData = vueData;
    /*
    * 点击右上角nav,联系客服
    * */
    // lastHeader.find('.contact-service')[0].onclick = contactUs;

    /**
     * [pickerObj 数量单位枚举]
     * @type {数量单位：0斤，1尾，2只}
     */
    let pickerObj = {
        input: currentPage.find('.unit-text'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        cssClass: 'col-1',
        cols: [
            {
                values: ('1 0 2').split(' '),
                displayValues: ('尾 斤 只').split(' '),
                textAlign: 'left'
            }
        ],
        onChange: (a, b, c) => {
            vueData.unitText = c[0];
            vueData.unitVal = b[0];
            vueData.orderInfo.unit = b[0];
        }
    };
    f7.picker(pickerObj);

    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            f7.hideIndicator();
            callAppPay({
                orderId: data.orderNo
            });
        } else{
            console.log(message);
        }
    };
    const postPurchaseOrder = () => {
        // 提交时价格传分（乘100）
        let submitInfo = ObjectUtils.copy(vueData.orderInfo);
        submitInfo.money = submitInfo.money * 100;
        TransactionProcessModel.postPurchaseOrder(submitInfo, callback);
    };
    /**
     * [获取上次收货人信息]
     * @return {[type]} [description]
     */
    const getLastAddress = () => {
        TransactionProcessModel.getLastAddress((res)=>{
            const {
                code,
                data,
                message
            } = res;
            if (1 == code){
                f7.hideIndicator();
                if(data){
                    vueData.orderInfo.receiverName = data.receiverName;
                    vueData.orderInfo.receiverPhone = data.receiverPhone;
                    vueData.orderInfo.receiverProvinceName = data.receiverProvinceName;
                    vueData.orderInfo.receiverCityName = data.receiverCityName;
                    vueData.orderInfo.receiverDetailAddress = data.receiverDetailAddress;
                    vueData.orderInfo.receiverProvinceId = data.receiverProvinceId;
                    vueData.orderInfo.receiverCityId = data.receiverCityId;
                    vueData.receiverInfo = ObjectUtils.copy(data);
                }
            } else{
                console.log(message);
            }
        });
    };
    getLastAddress();
}

export {
    purchaseOrderInit
};
