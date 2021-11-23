import { isEmailStr } from '../utils/string';
import Vue from 'vue';

function releasePriceInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .page-release-price')[$$('.view-main .page-release-price').length - 1]);
    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            lowerPrice: window.releaseVue ? window.releaseVue.subInfo.demandInfoSale.lowerPrice : '',
            price: window.releaseVue ? window.releaseVue.subInfo.demandInfoSale.expectedPrice : ''
        },
        methods: {
            checkText (type){
                this[type] = isEmailStr(this[type]);
            },
            saveEdit (){
                if(!this.lowerPrice && !this.price){
                    f7.alert('请至少填写一个价格！');
                    return;
                }
                if(window.releaseVue){
                    let res = '';
                    window.releaseVue.subInfo.demandInfoSale.lowerPrice = this.lowerPrice;
                    window.releaseVue.subInfo.demandInfoSale.expectedPrice = this.price;
                    if(this.lowerPrice && this.price){
                        res = `${this.lowerPrice}-${this.price}`;
                    }else{
                        res = this.lowerPrice || this.price || '';
                    }
                    window.releaseVue.priceText = res;
                }
                view.router.back();
            }
        }
    });

    setTimeout(() => {
        currentPage.find('input')[0].focus();
    }, 600);
}

export {
  releasePriceInit
};
