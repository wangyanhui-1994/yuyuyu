import Vue from 'vue';
import { trim } from '../../../utils/string';
import {callAddressResult} from '../../jsBridge/callHandler';
import {getAddressIndex} from '../../../utils/string';
function receivingAddressInit (f7, view, page){
    f7.hideIndicator();
    /**
     * 获取当前页面
     * @author [Candy]
     */
    const pages = $$('.view-pay-flow .pages>.page-receiving-address');
    const currentPage = $$(pages[pages.length - 1]);
    let {
            receiverName,
            receiverPhone,
            receiverProvinceName,
            receiverCityName,
            receiverDetailAddress,
            receiverProvinceId,
            receiverCityId
        } = page.query;
    let error = '';
    let pIndex = 0;
    let cIndex = 0;
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            receiverName,
            receiverPhone,
            receiverProvinceName,
            receiverDetailAddress,
            receiverProvinceId,
            receiverCityId,
            receiverCityName
        },
        methods: {
            saveReceiverInfo (){
                error = getErr(trim(this.receiverName), trim(this.receiverPhone), trim(this.receiverProvinceName), trim(this.receiverDetailAddress));
                if (error){
                    f7.alert(error, '提示');
                    return;
                }
                window.purchaseData.orderInfo.receiverName = this.receiverName;
                window.purchaseData.orderInfo.receiverPhone = this.receiverPhone;
                window.purchaseData.orderInfo.receiverProvinceName = this.receiverProvinceName;
                window.purchaseData.orderInfo.receiverCityName = this.receiverCityName;
                window.purchaseData.orderInfo.receiverDetailAddress = this.receiverDetailAddress;
                window.purchaseData.orderInfo.receiverProvinceId = this.receiverProvinceId;
                window.purchaseData.orderInfo.receiverCityId = this.receiverCityId;
                window.payFlowView.router.back();
            },
            callAddressResult (){
                const vm = this;
                if(vm.receiverProvinceName){
                    const {
                        provinceIndex,
                        cityIndex
                    } = getAddressIndex(vm.receiverProvinceName, vm.receiverCityName);
                    pIndex = provinceIndex;
                    cIndex = cityIndex;
                }
                callAddressResult(pIndex, cIndex, (res)=>{
                    let data = JSON.parse(res);
                    vm.receiverProvinceId = data.provinceCode;
                    vm.receiverCityId = data.cityCode;
                    vm.receiverProvinceName = data.provinceName;
                    vm.receiverCityName = data.cityName;
                });
            }
        },
        computed: {
            isPass (){
                return trim(this.receiverName) && trim(this.receiverPhone) && trim(this.receiverProvinceName) && trim(this.receiverDetailAddress);
            },
            receiverAddress (){
                const vm = this;
                let res = '';
                vm.receiverProvinceName && vm.receiverCityName && (res = vm.receiverProvinceName + vm.receiverCityName);
                return res;
            }

        }
    });

    const getErr = (name, phone, area, address) => {
        let err = '';
        if(name.length < 2){
            err = '联系人不少于两个字！';
        }
        if(phone.length !== 11){
            err = '请输入十一位手机号！';
        }
        if (!name){
            err = '联系人不能为空！';
        }
        if (!phone){
            err = '手机号不能为空！';
        }
        if (!area){
            err = '所在地区不能为空！';
        }
        if (!address){
            err = '详细地址不能为空！';
        }
        return err;
    };
}

export {
    receivingAddressInit
};
