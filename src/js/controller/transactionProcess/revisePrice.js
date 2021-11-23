import Vue from 'vue';
import {orderPriceFormatter} from '../../../utils/strTool';
import TransactionProcessModel from '../../model/TransactionProcessModel';

function revisePriceInit (f7, view, page){
    f7.hideIndicator();
    const {orderNo, payTotalMoney} = page.query;
    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-revise-price');
    const currentPage = $$(pages[pages.length - 1]);

    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            payTotalMoney: payTotalMoney || 0,
            newPrice: ''
        },
        methods: {
            updatePrice (){
                const vm = this;
                if (!vm.newPrice){
                    f7.alert('请填写修改后的价格~', '提示');
                    return;
                }
                f7.showIndicator();
                TransactionProcessModel.updateOrderPrice({
                    orderNo,
                    newPrice: vm.newPrice * 100
                }, (res) => {
                    f7.hideIndicator();
                    let {code, message} = res;
                    if (1 == code){
                        window.mainView.router.refreshPreviousPage();
                        setTimeout(window.mainView.router.back, 100);
                        return;
                    }
                    f7.alert(message, '提示');
                });
            }
        },
        computed: {
            // 放开修改按钮
            isPass (){
                return !!this.newPrice;
            }
        },
        filters: {
            orderPriceFormatter
        }
    });
}

export {
    revisePriceInit
};
