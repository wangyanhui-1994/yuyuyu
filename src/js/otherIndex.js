import config from '../config';
import { html } from '../utils/string';
import { home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { getCertInfo } from '../utils/string';
import customAjax from '../middlewares/customAjax';
import { otherIndexClickTip, veiwCert, inviteFriends } from '../utils/domListenEvent';
import Vue from 'vue';
import store from '../utils/localStorage';
import CountModel from './model/count';
import { isLogin } from '../middlewares/loginMiddle';

function otherIndexInit (f7, view, page){
    const { currentUserId } = page.query;
    const currentPage = $$($$('.view-main .pages>.page-other-index')[$$('.view-main .pages>.page-other-index').length - 1]);
    const { imgPath, cacheUserInfoKey, mWebUrl } = config;
    let level;
    let nameAuthentication;
    let userCache = store.get(cacheUserInfoKey);
    // console.log(userCache)

    /**
     * 页面content模块管理
     * 由于头部有f7的事件绑定，跟vue有冲突，所以不能交给vue管理。
     * */
    const shopVue = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            userInfo: {},
            saleDemands: {},
            buyDemands: {},
            fishCertificateList: {},
            recentScanTimes: 0,
            buyDemandsCount: 0,
            saleDemandsCount: 0,
            currentUserId: currentUserId,
            isMyShop: false,
            buyFishTypes: '',
            tradesCount: '',
            medalCount: 0,
            medalList:[]
        },
        methods: {
            imgPath: imgPath,
            veiwCert: veiwCert,
            getCertInfo: getCertInfo,
            inviteFriends: inviteFriends,
            isLogin: isLogin(),
            catPic (url){
                nativeEvent.catPic(url);
            },
            levelArray (level){
                let levelArray = [];
                for(let i = 0;i < level;i++){
                    levelArray.push(1);
                }
                return levelArray;

            },
            headUrl (url){
                let res = '';
                if(url){
                    res = url + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                }else{
                    res = 'img/default_head.png';
                }
                return res;
            },
            goMainMedal() {
                 view.router.load({
                    url: `views/aquaticClassroom/myMedal.html?userId=${currentUserId}`
                });
            }
        }
    });

    /**
     * 页面footer模块管理
     * */
    const shopFooterVue = new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            phone: '',
            isMyShop: false
        },
        methods: {
            callPhone (phone){
                window.apiCount('btn_profile_call');
                nativeEvent.contactUs(phone);
                CountModel.phoneCount({
                    entry: 1,
                    phone
                }, (res) => {
                    const {code} = res;
                    if(1 !== code){
                        console.log('发送统计失败！');
                    }
                });
            },
            goMyShop (){
                // window.mainView.router.loadPage('views/myShop.html');
                const title = `好友${shopVue.userInfo.nickname || ''}的水产店铺`;
                const webUrl = `${mWebUrl}userShop/${currentUserId}?s=n`;
                window.shareInfo = {
                    title,
                    webUrl,
                    imgUrl: shopVue.userInfo.imgUrl || '',
                    description: '养得好不如卖的好，鱼大大实名认证水产交易平台'
                };
                $$('.share-to-weixin-model').addClass('on');
            }
        }
    });

    function renderList (buyList, sellList){
        f7.hideIndicator();
        f7.pullToRefreshDone();
        if(!sellList.length){
            currentPage.find('.other-index-empty-info').show();
            // currentPage.find('.other-index-list').removeClass('show-buy-list');
            currentPage.find('.other-index-list').removeClass('show-sell-list');
            f7.pullToRefreshDone();
            return;
        }

        // if(buyList.length){
        //     let buyHtml = '';
        //     $$.each(buyList, (index, item) => {
        //         buyHtml += home.buy(item, level);
        //     });
        //     html($$('.other-buy-list .list'), buyHtml, f7);
        //     currentPage.find('.other-index-list').addClass('show-buy-list');
        // }

        if(sellList.length){
            let sellHtml = '';
            $$.each(sellList, (index, item) => {
                sellHtml += home.cat(item, level, nameAuthentication);
            });
            html($$('.other-sell-list .list'), sellHtml, f7);
            currentPage.find('.other-index-list').addClass('show-sell-list');
        }

        currentPage.find('img.lazy').trigger('lazy');
    }

    const callback = (data) => {
        const {
            userInfo,
            saleDemands,
            buyDemands,
            fishCertificateList,
            buyDemandsCount,
            saleDemandsCount,
            recentScanTimes,
            buyFishTypes,
            tradesCount,
            medalCount,
            medalList
        } = data.data;
        shopVue.userInfo = userInfo;
        shopVue.saleDemands = saleDemands;
        shopVue.buyDemands = buyDemands;
        shopVue.fishCertificateList = fishCertificateList;
        shopVue.buyDemandsCount = buyDemandsCount;
        shopVue.saleDemandsCount = saleDemandsCount;
        shopVue.recentScanTimes = recentScanTimes;
        shopVue.buyFishTypes = buyFishTypes;
        shopVue.tradesCount = tradesCount;
        shopVue.medalCount = medalCount;
        shopVue.medalList = medalList;

        shopFooterVue.phone = userInfo.phone;
        if(userCache && userCache.id){
            if(currentUserId == userCache.id){
                // const lastHeader = $$($$('.view-main .navbar>div')[$$('.view-main .navbar>div').length - 1]);
                shopFooterVue.isMyShop = true;
                shopVue.isMyShop = true;
                // lastHeader.find('.center').text('我的店铺').css({left: '-20px'});
                // lastHeader.find('.right').children().hide();
            }
        }
        renderList(buyDemands, saleDemands);
    };

    function getInfo (){
        customAjax.ajax({
            apiCategory: 'userInformation',
            data: [currentUserId],
            val: {
                id: currentUserId
            },
            type: 'get',
            isMandatory: !!nativeEvent.getNetworkStatus()
        }, callback);
    }

    /*
    * 获取/刷新个人信息
    * */
    const ptrContent = currentPage.find('.other-index-refresh');
    getInfo();
    ptrContent.on('refresh', getInfo);

    $$('.navbar-inner.other-index .icon-more').off('click', otherIndexClickTip).on('click', otherIndexClickTip);
}

export {
    otherIndexInit
};
