/**
 *
 * @authors yang (328906890@qq.com)
 * @date    2017-12-26 10:03:25
 * @description [申请入驻页面]
 */
import Vue from 'vue';
import TransactionProcessModel from '../../model/TransactionProcessModel';
import nativeEvent from '../../../utils/nativeEvent';
import config from '../../../config';
import store from '../../../utils/localStorage';

function applySettledInit (f7, view, page){
    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-apply-settled');
    const currentPage = $$(pages[pages.length - 1]);
    // id用于判断input输入框是新增还是修改原来的信息
    const {
        servicePhoneNumber,
        cacheUserInfoKey
    } = config;
    const {userGuaranteed, phone} = store.get(cacheUserInfoKey) || {};

    if (userGuaranteed){
        f7.alert('你已经入驻成功啦~', '提示', () => {
            view.router.back();
            f7.hideIndicator();
        });
        return;
    }

    f7.hideIndicator();
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            promptName: '申请人',
            promptNumber: '联系方式',
            promptType: '主要销售品种',
            promptError: '',
            name: '',
            number: phone,
            fishType: '',
            // 初始化 按钮是否被点击过
            isButtonClick: false
        },
        methods: {
            submit (){
                const vm = this;
                vm.isButtonClick = true;
                if (!vm.name){
                    vm.promptError = '请填写申请人姓名';
                    return;
                }
                if (!vm.number){
                    vm.promptError = '请填写联系方式';
                    return;
                }
                if (!vm.fishType){
                    vm.promptError = '请填写主要销售品种';
                    return;
                }

                f7.showIndicator();
                // post请求
                TransactionProcessModel.postAppaySettled({
                    fishType: vm.fishType,
                    name: vm.name
                }, {}, (res) => {
                    f7.hideIndicator();
                    const { code, message } = res;
                    // error code:120 审核中/121 审核通过/ 122 不通过/ 123 冻结
                    // 其中审核通过在前一页判断，也就是只会出现审核中、不通过、冻结三种情况
                    if (122 == code){
                        f7.modal({
                            title: '提示',
                            text: message,
                            buttons: [
                                {
                                    text: '联系客服',
                                    onClick: () => {
                                        nativeEvent.contactUs(servicePhoneNumber);
                                    }
                                }
                            ]
                        });
                        return;
                    }

                    if (1 == code){
                        let userInfo = store.get(cacheUserInfoKey) || {};
                        userInfo.userGuaranteed = true;
                        store.set(cacheUserInfoKey, userInfo);
                        f7.alert('入驻申请提交成功，请耐心等待客服审核~', '提示', () => {
                            view.router.back();
                        });
                        return;
                    }
                    f7.alert(message, '我知道了', () => {
                        view.router.back();
                    });
                });
            }
        },
        computed: {
            // 错误提示信息
            isErrorShow (){
                let isInputNull = !(this.name && this.number && this.fishType);
                return this.isButtonClick && isInputNull;
            }
        }
    });
    // 每次提示信息消失的时候清空提示信息
    vueData.$watch('isErrorShow', function (val, oldval){
        if (val == false){
            vueData.promptError = '';
        }
    });
}

export {
    applySettledInit
};
