import config from '../config';
import Vue from 'vue';
import store from '../utils/localStorage';
import FindModel from './model/FindModel';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import HomeModel from './model/HomeModel';

function findInit (f7, view, page){
    f7.hideIndicator();
    const {infoNumberKey} = config;
    const currentPage = $$($$('.view-main .pages>.page-find')[$$('.view-main .pages>.page-find').length - 1]);
    /**
     * vue的数据模型
     * */
    window.sellFooter = new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            infoNumberKey: store.get(infoNumberKey) || 0
        }
    });

    const findVue = new Vue({
        el: currentPage.find('.find-vue-box')[0],
        data: {
            bannerList: [],
            adList: []
        },
        methods: {
            openNewWindow (item){
                const {loginRequired, link, id, type} = item;
                // banner统计
                HomeModel.postBannerCount({
                    bannerId: id
                }, (data) => {
                    console.log(data);
                });

                if(link.toString().length <= 3){
                    f7.alert('敬请期待！');
                    return;
                }

                if (loginRequired && !isLogin()){
                    f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow);
                    return;
                }
                const accessToken = store.get('accessToken');
                let openUrl = link;
                if (0 == type){
                    loginRequired && (openUrl += `/${accessToken}`);
                    nativeEvent.goNewWindow(openUrl);
                }

                if (1 == type){
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                if (2 == type){
                    f7.showIndicator();
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
            }
        }
    });

    const bannersCallBack = (res) => {
        const {
        code,
        data,
        message
    } = res;
        if(1 == code){
            $$.each(data, (index, item) => {
                findVue.bannerList.push(item);
            });

        }else{
            console.log(message);
        }
        currentPage.find('.lazy').trigger('lazy');
        setTimeout(() => {
            currentPage.find('.lazy').trigger('lazy');
        }, 300);
    };

        /*
     * [getMoreBanners 获取banner列表]
     */
    const getMoreBanners = () => {
        FindModel.getMoreBanner(
            {
            },
            bannersCallBack
        );
    };
    getMoreBanners();

    const adsCallBack = (res) => {
        const {
        code,
        data,
        message
    } = res;
        if(1 == code){
            $$.each(data, (index, item) => {
                findVue.adList.push(item);
            });

        }else{
            console.log(message);
        }
    };

            /*
     * [getMoreAD 获取专区模块]
     */
    const getMoreAD = () => {
        FindModel.getMoreAds(
            {
            },
            adsCallBack
        );
    };
    getMoreAD();

        /*
     * 跳转页面
     * */
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });
}

export {
    findInit
};
