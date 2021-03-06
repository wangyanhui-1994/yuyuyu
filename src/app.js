import Framework7 from './js/lib/framework7';
import version from './config/version.json';
import config from './config';
import {searchInit} from './js/search';
import {filterInit} from './js/filter';
import {selldetailInit} from './js/selldetail';
import {buydetailInit} from './js/buydetail';
import {releaseInit} from './js/release';
import {releaseInfoInit} from './js/releaseInfo';
import {loginInit} from './js/login';
import {loginCodeInit} from './js/loginCode';
import {userInit} from './js/user';
import {myCenterInit} from './js/myCenter';
import {identityAuthenticationInit} from './js/identityAuthentication';
import globalEvent from './utils/global';
import {otherIndexInit} from './js/otherIndex';
import {otherInfoInit} from './js/otherInfo';
import {otherListInit} from './js/otherList';
import {myListInit} from './js/myList';
import {fishCertInit} from './js/fishCert';
import {releaseSuccInit} from './js/releaseSucc';
import nativeEvent from './utils/nativeEvent';
import {getQuery, alertTitleText} from './utils/string';
import {catIdentityStatusInit} from './js/catIdentityStatus';
import {editNameInit} from './js/editName';
import {inviteCodeInit} from './js/inviteCode';
import {inviteFriendsInit} from './js/inviteFriends';
import {inviteFriendsListInit} from './js/inviteFriendsList';
import {myCollectionInit} from './js/myCollection';
import {dealListInit} from './js/dealList';
import {releaseSelectTagInit} from './js/releaseSelectTag';
import {notFoundInit} from './js/notFound';
import {bindAccountInit} from './js/bindAccount';
import {fishCarInit} from './js/fishCar';
import {releaseFishCarDemandInit} from './js/releaseFishCarDemand';
import {postDriverAuthInit} from './js/postDriverAuth';
import {postDriverInfoInit} from './js/postDriverInfo';
import {driverDemandInfoInit} from './js/driverDemandInfo';
import {updateCtrl, updateClickEvent} from './js/service/updateVersion/updateVersionCtrl';
import {invitationAction} from './js/service/invitation/invitationCtrl';
import {JsBridge} from './middlewares/JsBridge';
import {releaseFishCarDemandSuccessInit} from './js/releaseFishCarDemandSuccess';
import {releaseFishCarTripInit} from './js/releaseFishCarTrip';
import {weixinModalEvent} from './js/modal/weixinModal';
import {
    fishCarModalJumpEvent
} from './js/modal/fishCarDriverSelectAddressModal';
import {fishCarTripListInit} from './js/fishCarTripList';
import {myFishCarDemandListInit} from './js/myFishCarDemandList';
import RefreshOldTokenModel from './js/model/RefreshOldTokenModel';
import store from './utils/localStorage';
import {shareMyTripInit} from './js/shareMyTrip';
import {aquaticClassroomInit} from './js/aquaticClassroom';
import {homeBuyInit} from './js/homeBuy';
import {strengthShowInit} from './js/strengthShow';
import {dealInfoInit} from './js/dealInfo';
import {releasePriceInit} from './js/releasePrice';
import {addInstructionInit} from './js/addInstruction';
import {chooseDateInit} from './js/chooseDate';
import {homeSellInit} from './js/homeSell';
import HomeModel from './js/model/HomeModel';
import InitApp from './js/model/InitApp';
import {submitDealSuccInit} from './js/submitDealSucc';
import {mvpListInit} from './js/mvpList';
import {moneyBibleInit} from './js/moneyBible';
import {isLogin, loginViewShow} from './middlewares/loginMiddle';
import {getPutFishList, editFishList} from './utils/strTool';
import {fishIdentificationInit} from './js/fishIdentification';
import {fishMarketInit} from './js/fishMarket';
import {fishMarketInfoInit} from './js/fishMarketInfo';
import {fishIdentifySuccessInit} from './js/fishIdentifySuccess';
import {findInit} from './js/find';
import {myRecordListInit} from './js/myRecordList';
import {visitListInit} from './js/visitList';
import {babyFishInit} from './js/babyFish';
import {fishGuranteeInfoInit} from './js/fishGuranteeInfo';
import {consultGuaranteeInit} from './js/consultGuarantee';
import {aquaticArticalInit} from './js/aquaticArtical';
import {aquaticRankingInit} from './js/aquaticRanking';
import {aquaticListInit} from './js/aquaticList';
import {aquaticInfoInit} from './js/aquaticInfo';
import {aquaticSearchInit} from './js/aquaticSearch';
import {myMedalInit} from './js/controller/aquaticClassroomCtrl/myMedal';
import {medalInfoInit} from './js/controller/aquaticClassroomCtrl/medalInfo';
import {medalListInit} from './js/controller/aquaticClassroomCtrl/medalList';
import ClassroomModel from './js/model/ClassroomModel';

// ??????????????????
import {purchaseOrderInit} from './js/controller/transactionProcess/purchaseOrder';
import {orderDetailsInit} from './js/controller/transactionProcess/orderDetails';
import {receivingAddressInit} from './js/controller/transactionProcess/receivingAddress';
import {mySellOrderInit} from './js/controller/transactionProcess/mySellOrder';
import {myBuyOrderInit} from './js/controller/transactionProcess/myBuyOrder';
import {needHelpInit} from './js/controller/transactionProcess/needHelp';
import {platformHelpInit} from './js/controller/transactionProcess/platformHelp';
import {revisePriceInit} from './js/controller/transactionProcess/revisePrice';
import {logisticsInfoInit} from './js/controller/transactionProcess/logisticsInfo';
import {guaranteeDescInit} from './js/controller/transactionProcess/guaranteeDesc';
import {applySettledInit} from './js/controller/transactionProcess/applySettled';

// ??????vue????????????????????????
import Vue from 'vue';
import tabbar from './component/tabbar';
import classroomSearch from './component/classroom/searchInput';
import classroomArticleItem from './component/classroom/articleItem';
import classroomSearchCacheItem from './component/classroom/searchCacheItem';
import classroomRankItem from './component/classroom/rankItem';
import classroomSaveArticleConfirmModal from './component/classroom/saveArticleConfirmModal';
import sellOrderItem from './component/transactionProcess/sellOrderItem';
import buyOrderItem from './component/transactionProcess/buyOrderItem';

Vue.component('tab-bar-component', tabbar);
Vue.component('classroom-search', classroomSearch);
Vue.component('classroom-article-item', classroomArticleItem);
Vue.component('classroom-rank-item', classroomRankItem);
Vue.component('classroom-search-cache-item', classroomSearchCacheItem);
Vue.component('classroom-save-article-confirm-modal', classroomSaveArticleConfirmModal);
Vue.component('sell-order-item', sellOrderItem);
Vue.component('buy-order-item', buyOrderItem);

const deviceF7 = new Framework7();
const {device} = deviceF7;
const {android, androidChrome} = device;
const {
    timeout,
    fishCacheObj,
    url,
    infoNumberKey,
    cacheStudyInfoKey,
    servicePhoneNumber,
    newsModalKey,
    mWebUrl
} = config;
console.log(`current app update time: ${version.date}!${store.get('versionNumber')}`);
let animatStatus = true;
android && (animatStatus = androidChrome);
window.isTipBack = false;
window.shraeInfo = {};
window.viewTimes = 0;
let isBack = false;
/*
 * ?????????f7?????????
 * */
let initAppConfig = {
    activeState: false,
    imagesLazyLoadThreshold: 50,
    pushState: true,
    animateNavBackIcon: true,
    animatePages: animatStatus,
    preloadPreviousPage: true,
    modalButtonOk: '??????',
    modalButtonCancel: '??????',
    fastClicks: true,
    modalTitle: '????????????',
    allowDuplicateUrls: true,
    preprocess: (content, url, next) => {
        next(content);
        window.$$ && $$('.fish-car-modal').removeClass('on');
        const query = getQuery(url);
        if (url.indexOf('search.html') > -1){
            searchInit(f7, window.mainView, {query});
        }
        // ????????????????????????????????????
        if (url.indexOf('homeBuy.html') > -1 && window.buyFooter &&
            window.buyFooter.visitData && window.buyFooter.visitData.visitTime){
            store.set('visitTime', window.parseInt(new Date().getTime() / 1000));
            window.buyFooter.visitData.visitTime = 0;
        }
    },
    /*
     * ?????????????????????????????????????????????
     * */
    preroute: (view, options) => {
        const {history} = view;
        const currentPage = options && options['url'];
        const len = history.length;
        const _currentPage = history[len - 1];
        const btns = window.document.getElementsByClassName('modal-button');

        // ????????????????????????????????????
        if (_currentPage.indexOf('homeBuy.html') > -1 && window.buyFooter &&
            window.buyFooter.visitData && window.buyFooter.visitData.visitTime){
            store.set('visitTime', window.parseInt(new Date().getTime() / 1000));
            window.buyFooter.visitData.visitTime = 0;
        }

        // ??????????????????????????????
        // ??????
        if((view.activePage.url.indexOf('articalInfo.html') > -1 ||
            (currentPage && currentPage.indexOf('articalInfo.html') > -1)) && window.viewsBeginTime){
            const infoId = view.activePage.query.id;
            const guestId = store.get('guestId') || '';
            const type = 1;

            ClassroomModel.postViewTimes({
                guestId,
                infoId,
                platform: android ? 'Android' : 'IOS',
                beginTime: window.viewsBeginTime,
                type
            }, (res)=>{
                if(res.code == 1){
                }else{
                    console.log(res.message);
                }
            });
            window.viewsBeginTime = 0;
        }

        if(!currentPage && view.activePage.url.indexOf('aquaticClassroom.html') > -1 && !isBack && window.classData){
            isBack = true;
            setTimeout(() => {
                const guestId = store.get('guestId') || '';
                ClassroomModel.getStudyInfo({
                    guestId
                }, (res)=>{
                    const {
                        code,
                        data,
                        message
                    } = res;
                    if (1 == code){
                        if (data){
                            window.classData.studyInfo = data;
                            window.classData.isLogin = isLogin();
                            store.set(cacheStudyInfoKey, data);
                        }
                    } else {
                        console.log(message);
                    }
                });
                isBack = false;
                // window.mainView.router.refreshPage();
                // isBack = false
                // aquaticClassroomInit(f7, window.mainView, view.activePage)
            }, 500);
        }
        if (!window.isTipBack && btns.length && btns[0].innerText.indexOf('????????????') > -1){
            return false;
        }

        if (!currentPage && len >= 1){
            const backPage = history[len - 2];
            if ((_currentPage.indexOf('homeBuy.html') > -1 && options && !options.isEnableBack) ||
             (_currentPage.indexOf('user.html') > -1 && options && !options.isEnableBack) ||
              _currentPage.indexOf('releaseSucc.html') > -1 ||
                (_currentPage.indexOf('homeSell.html') > -1 && options && !options.isEnableBack) ||
                (_currentPage.indexOf('aquaticClassroom.html') > -1 && options && !options.isEnableBack)){
                return false;
            }

            if ($$('.modal-overlay-visible').length){
                $$('.modal-overlay-visible').trigger('click');
                $$('.modal-button').length && $$('.modal-button')[0].click();
            }
            $$('div.footer').length && $$('div.footer').click();

            if (_currentPage.indexOf('filter.html') > -1 && backPage && backPage.indexOf('filter.html') > -1){
                window.mainView.router.load({
                    url: 'views/homeBuy.html',
                    reload: true
                });
                return false;
            }
            $$('.release-select-model').removeClass('on');
            if (_currentPage.indexOf('releaseInfo.html') > -1 && !window.isTipBack && f7){
                f7.modal({
                    title: '??????????????????????????????',
                    text: '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????~',
                    buttons: [
                        {
                            text: '????????????',
                            onClick: () => {
                                window.isTipBack = true;
                                window.mainView.router.back();
                            }
                        },
                        {
                            text: '????????????',
                            onClick: () => {}
                        }
                    ]
                });
                return false;
            }

            // ????????????????????????????????????????????????
            if (android && !androidChrome){
                if (isBack){
                    return false;
                }
                isBack = true;
                setTimeout(() => {
                    isBack = false;
                }, 400);
            }
        }
    }
};

/*
 * ????????????????????????????????????????????????????????????????????????4.4????????????????????????????????????
 * */
android && !androidChrome && (initAppConfig['swipeBackPage'] = false);
var f7 = new Framework7(initAppConfig);
window.f7 = f7;
window.mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * ?????????????????????
 * */
window.loginView = f7.addView('.view-login', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * ????????????????????????
 * */
window.releaseView = f7.addView('.view-release-fish', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * [subDealView ????????????????????????]
 * @type {Boolean}
 */
window.subDealView = f7.addView('.view-submit-deal', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * [payFlowView ??????????????????]
 * @type {[Object]}
 */
window.payFlowView = f7.addView('.view-pay-flow', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * ??????????????????????????????
 * */
window.mainView.router.load({
    url: 'views/homeBuy.html',
    animatePages: false,
    reload: true
});

window.$$ = window.Dom7;
window.jQuery = window.Dom7;
window.$ = window.Dom7;
globalEvent.init(f7);
window.currentDevice = f7.device;
window.f7 = f7;

if(android && !androidChrome){
    $$('html').addClass('android-4-min');
}else{
    /**
     * ?????????jsBrige
     * */
    JsBridge('JS_SaveInfomation', {jsBrigeTest: 123}, f7);
}

/*
 * Trigger lazy load img.
 */
$$('img.lazy').trigger('lazy');
/*
 * some kinds of loading style.
 * 1: app.showIndicator()
 * 2: app.showPreloader()
 * 3: app.showPreloader('My text...')
 * hide: app.hide*
 */

/*
 * ???????????????????????????name???????????????controller
 * */
// eslint-disable-next-line no-debugger
f7.onPageInit('*', (page) => {
    if (page.name){
        f7.showIndicator();
    }

    const hideLoadArr = ['recruitDriverSuccess', 'myMember', 'pageMvp', 'homeSell', 'homeBuy'];
    if(hideLoadArr.indexOf(page.name) > -1){
        f7.hideIndicator();
    }

    setTimeout(f7.hideIndicator, timeout);
    page.name === 'homeBuy' && homeBuyInit(f7, window.mainView, page);

    page.name === 'editName' && editNameInit(f7, window.mainView, page);
    page.name === 'catIdentityStatus' && catIdentityStatusInit(f7, window.mainView, page);
    (page.name === 'login' || page.name === 'bindPhone') && loginInit(f7, window.mainView, page);
    page.name === 'loginCode' && loginCodeInit(f7, window.mainView, page);
    page.name === 'search' && searchInit(f7, window.mainView, page);
    page.name === 'filter' && filterInit(f7, window.mainView, page);
    page.name === 'selldetail' && selldetailInit(f7, window.mainView, page);
    page.name === 'buydetail' && buydetailInit(f7, window.mainView, page);
    page.name === 'release' && releaseInit(f7, window.mainView, page);
    page.name === 'releaseInfo' && releaseInfoInit(f7, window.mainView, page);
    page.name === 'myCenter' && myCenterInit(f7, window.mainView, page);
    page.name === 'identityAuthentication' && identityAuthenticationInit(f7, window.mainView, page);
    page.name === 'otherIndex' && otherIndexInit(f7, window.mainView, page);
    page.name === 'otherInfo' && otherInfoInit(f7, window.mainView, page);
    page.name === 'otherList' && otherListInit(f7, window.mainView, page);
    page.name === 'myList' && myListInit(f7, window.mainView, page);
    page.name === 'fishCert' && fishCertInit(f7, window.window.mainView, page);
    page.name === 'releaseSucc' && releaseSuccInit(f7, window.window.mainView, page);
    page.name === 'user' && userInit(f7, window.mainView, page);
    page.name === 'inviteCode' && inviteCodeInit(f7, window.mainView, page);
    page.name === 'inviteFriendsList' && inviteFriendsListInit(f7, window.mainView, page);
    (page.name === 'inviteFriends' || page.name === 'myShop') && inviteFriendsInit(f7, window.mainView, page);

    page.name === 'myCollection' && myCollectionInit(f7, window.mainView, page);
    page.name === 'dealList' && dealListInit(f7, window.mainView, page);
    page.name === 'releaseSelectTag' && releaseSelectTagInit(f7, window.mainView, page);
    page.name === 'notFound' && notFoundInit(f7, window.mainView, page);
    page.name === 'bindAccount' && bindAccountInit(f7, window.mainView, page);
    page.name === 'submitDealSucc' && submitDealSuccInit(f7, window.mainView, page);
    page.name === 'mvpList' && mvpListInit(f7, window.mainView, page);

    /**
     * ????????????
     * */
    page.name === 'fishCar' && fishCarInit(f7, window.mainView, page);
    page.name === 'releaseFishCarDemand' && releaseFishCarDemandInit(f7, window.mainView, page);
    page.name === 'releaseFishCarTrip' && releaseFishCarTripInit(f7, window.mainView);
    page.name === 'driverDemandInfo' && driverDemandInfoInit(f7, window.mainView, page);
    page.name === 'releaseFishCarDemandSuccess' && releaseFishCarDemandSuccessInit(f7, window.mainView, page);
    page.name === 'fishCarTripList' && fishCarTripListInit(f7, window.mainView, page);
    page.name === 'myFishCarDemandList' && myFishCarDemandListInit(f7, window.mainView, page);
    page.name === 'shareMyTrip' && shareMyTripInit(f7, window.mainView, page);

    /**
     * ????????????????????????
     * */
    page.name === 'postDriverAuth' && postDriverAuthInit(f7, window.mainView, page);
    page.name === 'postDriverInfo' && postDriverInfoInit(f7, window.mainView, page);

    page.name === 'aquaticClassroom' && aquaticClassroomInit(f7, window.mainView, page);
    page.name === 'strengthShow' && strengthShowInit(f7, window.mainView, page);
    page.name === 'dealInfo' && dealInfoInit(f7, window.mainView, page);
    page.name === 'releasePrice' && releasePriceInit(f7, window.mainView, page);
    page.name === 'addInstruction' && addInstructionInit(f7, window.mainView, page);
    page.name === 'chooseDate' && chooseDateInit(f7, window.mainView, page);
    page.name === 'homeSell' && homeSellInit(f7, window.mainView, page);
    page.name === 'moneyBible' && moneyBibleInit(f7, window.mainView, page);
    /**
     * ?????????????????????
     * */
    page.name === 'fishIdentification' && fishIdentificationInit(f7, window.mainView, page);
    page.name === 'fishIdentifySuccess' && fishIdentifySuccessInit(f7, window.mainView, page);
    /**
     * ????????????????????????
     * */
    page.name === 'fishMarket' && fishMarketInit(f7, window.mainView, page);
    page.name === 'fishMarketInfo' && fishMarketInfoInit(f7, window.mainView, page);
    /**
     * ????????????
     * */
    page.name === 'find' && findInit(f7, window.mainView, page);
    /**
     * ????????????
     * */
    page.name === 'myRecordList' && myRecordListInit(f7, window.mainView, page);
    /**
     * ????????????
     * */
    page.name === 'visitList' && visitListInit(f7, window.mainView, page);

    // ???????????????????????????
    page.name === 'babyFish' && babyFishInit(f7, window.mainView, page);
    page.name === 'fishGuranteeInfo' && fishGuranteeInfoInit(f7, window.mainView, page);
    page.name === 'pageConsultGuarantee' && consultGuaranteeInit(f7, window.mainView, page);

    /**
     * ????????????
     * */
    page.name === 'aquaticArtical' && aquaticArticalInit(f7, window.mainView, page);
    page.name === 'aquaticRanking' && aquaticRankingInit(f7, window.mainView, page);
    page.name === 'aquaticList' && aquaticListInit(f7, window.mainView, page);
    page.name === 'aquaticInfo' && aquaticInfoInit(f7, window.mainView, page);
    page.name === 'aquaticSearch' && aquaticSearchInit(f7, window.mainView, page);
    /* ??????*/
    page.name === 'myMedal' && myMedalInit(f7, window.mainView, page);
    page.name === 'medalInfo' && medalInfoInit(f7, window.mainView, page);
    page.name === 'medalList' && medalListInit(f7, window.mainView, page);

    /* ????????????*/
    page.name === 'purchaseOrder' && purchaseOrderInit(f7, window.mainView, page);
    page.name === 'orderDetails' && orderDetailsInit(f7, window.mainView, page);
    page.name === 'receivingAddress' && receivingAddressInit(f7, window.mainView, page);
    page.name === 'mySellOrder' && mySellOrderInit(f7, window.mainView, page);
    page.name === 'myBuyOrder' && myBuyOrderInit(f7, window.mainView, page);
    page.name === 'needHelp' && needHelpInit(f7, window.mainView, page);
    page.name === 'platformHelp' && platformHelpInit(f7, window.mainView, page);
    page.name === 'revisePrice' && revisePriceInit(f7, window.mainView, page);
    page.name === 'logisticsInfo' && logisticsInfoInit(f7, window.mainView, page);
    page.name === 'guaranteeDesc' && guaranteeDescInit(f7, window.mainView, page);
    page.name === 'applySettled' && applySettledInit(f7, window.mainView, page);
});

f7.onPageAfterAnimation('*', (page) => {
    window.mainView.allowPageChange = true;
});

/**
 * ??????????????????????????????
 * */
f7.onPageAfterBack('*', (page) => {
    const {name} = window.mainView.activePage;
    if ('homeBuy' == name){
        const fishCache = $$.isArray(store.get(fishCacheObj.fishCacheKey)) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
        if(fishCache.length){
            HomeModel.postFollowFishNumber({
                subscribedFishes: getPutFishList(fishCache)
            }, (res) => {
                const {code, data, message} = res;
                if(1 == code){
                    window.vueHome.selectCache = editFishList(data);
                }else{
                    console.log(message);
                }

            });
        }
    }
});

/*
 * ??????????????????/????????????????????????
 * */
$$('.view-login>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    $$(ele).hasClass('login-view-close') && $$('.view-login').removeClass('show');
    return;
});

$$('.view-release-fish>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    $$(ele).hasClass('release-view-close') && $$('.view-release-fish').removeClass('show');
    return;
});

$$('.view-submit-deal>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    $$(ele).hasClass('deal-view-close') && $$('.view-submit-deal').removeClass('show');
    return;
});

$$('.view-pay-flow>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    if ($$(ele).hasClass('pay-flow-view-close')){
        $$('.view-pay-flow').removeClass('show');
        e.stopPropagation();
        e.preventDefault();
    }

    $$(ele).hasClass('contact-service') && nativeEvent.contactUs(servicePhoneNumber);
    return;
});

$$('.view-main>.navbar').click((e) => {
    const ele = e.target || window.event.target;
    $$(ele).hasClass('contact-service') && nativeEvent.contactUs(servicePhoneNumber);
    return;
});

/**
 * ??????native?????????????????????????????????
 * 1.8??????1.9 ??????token????????????
 * */
let interTime = 0;
if (!store.get('versionNumber')){

    const intervalId = setInterval(() => {
        interTime += 200;

        const versionNumber = store.get('versionNumber');
        if(versionNumber == 'V01_09_01_01' &&
            !store.get('isUpdateLarge') &&
            nativeEvent.getUserValue()){
            RefreshOldTokenModel.post((res) => {
                const {code, data, message} = res;
                if(1 == code){
                    nativeEvent.setNativeUserInfo();
                    store.set('accessToken', data);
                    store.set('isUpdateLarge', 1);
                }else{
                    console.log(message);
                }
            });
            clearInterval(intervalId);
        }

        if(interTime >= 20000 || !!versionNumber){
            clearInterval(intervalId);
        }

        if(store.get('versionNumber') && !$('#patchCss').length){
            // ???????????????css
            const head = $('head')[0];
            const cssLink = window.document.createElement('link');
            cssLink.setAttribute('rel', 'stylesheet');
            cssLink.setAttribute('charset', 'utf-8');
            cssLink.setAttribute('charset', 'patchCss');
            cssLink.setAttribute('type', 'text/css');
            cssLink.href = `http://static.yudada.com/mobile/css/patch_${store.get('versionNumber')}.css`;
            head.appendChild(cssLink);
        }
    }, 500);
}

/**
 * ???????????????????????????????????????
 * ??????????????????????????????
 * ???????????????model???
 * ??????modal????????????
 * ??????modal??????
 * ??????????????????modal??????
 * */
const interId = setInterval(() => {
    if(window.JS_GetObjectWithKey ||
        (window.yudada && window.yudada.JS_GetObjectWithKey)){
        updateCtrl(f7);
        nativeEvent.getAddress();
        clearInterval(interId);
    }
}, 100);
updateClickEvent(f7);
invitationAction();
weixinModalEvent();
// fishCarDriverSelectAddressModalEvent(f7);
fishCarModalJumpEvent(f7);

// ????????????????????????
InitApp.getInfoNumber((res) => {
    const {data, message, code} = res;
    if(1 == code && data){
        store.set(infoNumberKey, data);
        if(window.buyFooter){
            window.buyFooter.infoNumberKey = data;
        }

        if(window.sellFooter){
            window.sellFooter.infoNumberKey = data;
        }
    }else{
        console.log(message);
    }
});

/**
 * ???????????????
 * ????????????????????????
 */
setTimeout(() => {
    JsBridge('JS_GetUUid', {}, (data) => {
        window.uuid = data;
    });
    if(isLogin()){
        const fishCache = $$.isArray(store.get(fishCacheObj.fishCacheKey)) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
        InitApp.putFishList({
            subscribedFishes: getPutFishList(fishCache),
            action: 'open'
        }, (res) => {
            const {code, message, data} = res;
            if(1 == code){
                const newFishList = editFishList(data);
                store.set(fishCacheObj.fishCacheKey, newFishList.length ? newFishList.reverse() : '');
                if(window.vueHome){
                    window.vueHome.selectCache = newFishList;
                }

            }else{
                console.log(message);
            }
        });
    }
}, 1500);

// ??????js??????
window.onload = function (){
    function handler (eventError){
        if(eventError.target.tagName == 'IMG'){
            return;
        }
        const data = {
            type: eventError.type,
            filename: eventError.filename,
            message: eventError.message,
            lineno: eventError.lineno
        };
        $$.ajax({
            timeout: 3000,
            cache: false,
            headers: {},
            crossDomain: true,
            method: 'POST',
            url: `${url}jsErrors`,
            data: JSON.stringify(data),
            contentType: 'application/json',
            error: function (data){
                console.log('?????????????????????');
            },
            success: function (data){
                console.log('?????????????????????');
            }
        });
        return true;
    }
    if (window.addEventListener){
        window.addEventListener('error', handler, true);
    } else if (window.attachEvent){
        window.attachEvent('onerror', handler);
    }
};

// ??????picker???????????????????????????????????????
$$('body').touchmove((e) => {
    const ele = e.target || window.event.target;
    if(($$(ele).hasClass('picker-modal-inner') && $$(ele).hasClass('picker-items')) ||
    ($$(ele).hasClass('toolbar-inner') && $$(ele).parent().hasClass('toolbar'))){
        e.preventDefault();
        e.stopPropagation();
        return;
    }
});

// ??????????????????????????????model
setTimeout(() => {
    var isShowClassroomFunction = store.get(newsModalKey);
    if (!isShowClassroomFunction){
        $$('.news-function-model').addClass('show');
    }
}, 1000);

$('.news-function-model').click((e) => {
    const ele = e.target || window.event.target;
    const time = new Date().getTime();
    if (ele.tagName == 'IMG'){
        f7.showIndicator();
        store.set(newsModalKey, 1);
        $('.news-function-model').removeClass('show');
        window.mainView.router.load({
            url: `${mWebUrl}models/babyFish?time=${time}`
        });
    }
});

// ???????????????????????????????????????
// const windowWidth = $$(window).width();
// $$('html').css({
//     fontSize: (10 * windowWidth / 375) + 'px'
// })

// ????????????????????????
const $levelModal = $$('.update-level-modal');
$levelModal.find('.btn-sure').click(() => {
    $levelModal.removeClass('show');
});

// ????????????????????????modal
const $classroomLoginModal = $$('.save-article-confirm-modal');
$classroomLoginModal.click((e) => {
    $$(e.target).hasClass('save-article-confirm-modal') && $classroomLoginModal.removeClass('show');
});

$classroomLoginModal.touchmove((e) => {
    if ($$(e.target).hasClass('save-article-confirm-modal')){
        e.preventDefault();
        e.stopPropagation();
        return;
    }
});

$classroomLoginModal.find('.btn').click(() => {
    f7.alert(alertTitleText(), '????????????', loginViewShow);
    $classroomLoginModal.removeClass('show');
});
