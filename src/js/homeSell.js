import {html, alertTitleText} from '../utils/string';
import config from '../config';
import {home} from '../utils/template';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import {getDealTime} from '../utils/time';
import Vue from 'vue';
import store from '../utils/localStorage';
import HomeModel from './model/HomeModel';
import tabbar from '../component/tabbar';

function homeSellInit (f7, view, page){
    const {infoNumberKey, cacheUserInfoKey, pageSize} = config;
    const currentPage = $$($$('.view-main .pages>.page-home-sell')[$$('.view-main .pages>.page-home-sell').length - 1]);
    const currentNav = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const userInfo = store.get(cacheUserInfoKey);
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    let pageNo = 1;
    let isRefresh = false;
    let isInfinite = false;
    store.set('isHomeSell', true);
    /**
     * vue的数据模型
     * */
    Vue.component('tab-bar-component', tabbar);
    // 底部tabbar组件
    window.sellFooter = new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            infoNumberKey: store.get(infoNumberKey) || 0
        }
    });

    const vueHomeSell = new Vue({
        el: currentPage.find('.home-vue-box')[0],
        data: {
            listData: '',
            userData: '',
            showAll: false,
            isLogin: isLogin()
        },
        methods: {
            getDealTime: getDealTime,
            loginViewShow: loginViewShow,
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            goMyShop (){
                window.apiCount('btn_sell_myShop');
                view.router.load({
                    url: `views/otherIndex.html?currentUserId=${userInfo.id}`
                });
            }
        },
        computed: {
        }
    });

    currentNav.find('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });

    function getList (){
        HomeModel.getBuyList({
            pageNo,
            pageSize
        }, (res) => {
            const {code, message, data} = res;
            if(1 == code){
                let listStr = '';
                $$.each(data, (index, item) => {
                    listStr += home.buy(item);
                });
                if(1 == pageNo){
                    html(currentPage.find('.recommend-sell-list'), listStr, f7);
                }else{
                    currentPage.find('.recommend-sell-list').append(listStr);
                }
                vueHomeSell.showAll = !!(data.length < pageSize);
            }else{
                console.log(message);
            }
            f7.pullToRefreshDone();
            f7.hideIndicator();
            currentPage.find('img.lazy').trigger('lazy');
            setTimeout(() => {
                isRefresh = false;
                isInfinite = false;
            }, 100);
        });
    }

    function initPage (){
        pageNo = 1;
        if(isLogin()){
            HomeModel.getSellData((res) => {
                const {code, message, data} = res;
                if(1 == code){
                    vueHomeSell.userData = data;
                }else{
                    console.log(message);
                }
                f7.hideIndicator();
                setTimeout(() => {
                    currentPage.find('img.lazy').trigger('lazy');
                }, 100);
            });
        }
        getList();
    }

    // 下拉刷新
    ptrContent.on('refresh', () => {
        if(isRefresh || isInfinite){
            return;
        }
        vueHomeSell.showAll = false;
        isRefresh = true;
        isInfinite = false;
        pageNo = 1;
        initPage();
    });

    f7.pullToRefreshTrigger(ptrContent);

    // 上拉加载
    ptrContent.on('infinite', () => {
        if(isRefresh || isInfinite || vueHomeSell.showAll){
            return;
        }
        isRefresh = false;
        isInfinite = true;
        pageNo++;
        getList();
    });
}

export {
    homeSellInit
};
