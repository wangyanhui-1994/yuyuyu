import Vue from 'vue';
import {alertTitleText} from '../utils/string';
import {loginViewShow} from '../middlewares/loginMiddle';
import {
    goIdentity
} from '../utils/domListenEvent';

function moneyBibleInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-money-bible')[$$('.view-main .pages>.page-money-bible').length - 1]);
    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {},
        methods: {
            refreshInfo (){
                if(alertTitleText()){
                    f7.alert(alertTitleText(), loginViewShow);
                }else{
                    view.router.load({
                        url: 'views/myList.html?type=2'
                    });
                }
            },
            authInfo: goIdentity,
            goMyShop (){
                if(alertTitleText()){
                    f7.alert(alertTitleText(), loginViewShow);
                }else{
                    view.router.load({
                        url: 'views/myShop.html'
                    });
                }
            }
        }
    });
}

export{
  moneyBibleInit
};
