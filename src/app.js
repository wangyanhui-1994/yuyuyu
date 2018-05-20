import Framework7 from './js/lib/framework7';
import version from './config/version.json';
import config from './config';
import {searchInit} from './js/search';
import {filterInit} from './js/filter';
import {selldetailInit} from './js/selldetail';
import {buydetailInit} from './js/buydetail'
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

// 担保交易模块
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

// 注册vue自定义的组件资源
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
 * 初始化f7的参数
 * */
let initAppConfig = {
    activeState: false,
    imagesLazyLoadThreshold: 50,
    pushState: true,
    animateNavBackIcon: true,
    animatePages: animatStatus,
    preloadPreviousPage: true,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示',
    allowDuplicateUrls: true,
    preprocess: (content, url, next) => {
        next(content);
        window.$$ && $$('.fish-car-modal').removeClass('on');
        const query = getQuery(url);
        if (url.indexOf('search.html') > -1){
            searchInit(f7, window.mainView, {query});
        }
        // 关闭首页上的最近访客记录
        if (url.indexOf('homeBuy.html') > -1 && window.buyFooter &&
            window.buyFooter.visitData && window.buyFooter.visitData.visitTime){
            store.set('visitTime', window.parseInt(new Date().getTime() / 1000));
            window.buyFooter.visitData.visitTime = 0;
        }
    },
    /*
     * 返回上个页面的一些路由拦截操作
     * */
    preroute: (view, options) => {
        const {history} = view;
        const currentPage = options && options['url'];
        const len = history.length;
        const _currentPage = history[len - 1];
        const btns = window.document.getElementsByClassName('modal-button');

        // 关闭首页上的最近访客记录
        if (_currentPage.indexOf('homeBuy.html') > -1 && window.buyFooter &&
            window.buyFooter.visitData && window.buyFooter.visitData.visitTime){
            store.set('visitTime', window.parseInt(new Date().getTime() / 1000));
            window.buyFooter.visitData.visitTime = 0;
        }

        // 在线课堂阅读时长统计
        // 进来
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
        if (!window.isTipBack && btns.length && btns[0].innerText.indexOf('放弃发布') > -1){
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
                    title: '确定放弃这次发布吗？',
                    text: '亲，您已经填写了信息，还没发布呢，确定直接离开？发布一条信息，就有更大几率完成交易噢~',
                    buttons: [
                        {
                            text: '放弃发布',
                            onClick: () => {
                                window.isTipBack = true;
                                window.mainView.router.back();
                            }
                        },
                        {
                            text: '继续填写',
                            onClick: () => {}
                        }
                    ]
                });
                return false;
            }

            // 避免低版本的安卓手机返回触发两次
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
 * 在低端安卓机中切换页面动画效果不流畅，所以判断在4.4以下的安卓机禁止启用动画
 * */
android && !androidChrome && (initAppConfig['swipeBackPage'] = false);
var f7 = new Framework7(initAppConfig);
window.f7 = f7;
window.mainView = f7.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * 抽离出登录视图
 * */
window.loginView = f7.addView('.view-login', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * 鱼车相关发布需求
 * */
window.releaseView = f7.addView('.view-release-fish', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * [subDealView 提交成交记录视图]
 * @type {Boolean}
 */
window.subDealView = f7.addView('.view-submit-deal', {
    dynamicNavbar: true,
    domCache: true
});

/**
 * [payFlowView 交易流程视图]
 * @type {[Object]}
 */
window.payFlowView = f7.addView('.view-pay-flow', {
    dynamicNavbar: true,
    domCache: true
});

/*
 * 主视图初始化加载首页
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
     * 初始化jsBrige
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
 * 页面加载完成后根据name执行相应的controller
 * */
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
     * 鱼车相关
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
     * 上传司机信息页面
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
     * 鱼儿乐信息页面
     * */
    page.name === 'fishIdentification' && fishIdentificationInit(f7, window.mainView, page);
    page.name === 'fishIdentifySuccess' && fishIdentifySuccessInit(f7, window.mainView, page);
    /**
     * 批发市场信息页面
     * */
    page.name === 'fishMarket' && fishMarketInit(f7, window.mainView, page);
    page.name === 'fishMarketInfo' && fishMarketInfoInit(f7, window.mainView, page);
    /**
     * 发现页面
     * */
    page.name === 'find' && findInit(f7, window.mainView, page);
    /**
     * 我的成交
     * */
    page.name === 'myRecordList' && myRecordListInit(f7, window.mainView, page);
    /**
     * 我的访客
     * */
    page.name === 'visitList' && visitListInit(f7, window.mainView, page);

    // 金牌鱼苗、远程鱼苗
    page.name === 'babyFish' && babyFishInit(f7, window.mainView, page);
    page.name === 'fishGuranteeInfo' && fishGuranteeInfoInit(f7, window.mainView, page);
    page.name === 'pageConsultGuarantee' && consultGuaranteeInit(f7, window.mainView, page);

    /**
     * 在线课堂
     * */
    page.name === 'aquaticArtical' && aquaticArticalInit(f7, window.mainView, page);
    page.name === 'aquaticRanking' && aquaticRankingInit(f7, window.mainView, page);
    page.name === 'aquaticList' && aquaticListInit(f7, window.mainView, page);
    page.name === 'aquaticInfo' && aquaticInfoInit(f7, window.mainView, page);
    page.name === 'aquaticSearch' && aquaticSearchInit(f7, window.mainView, page);
    /* 勋章*/
    page.name === 'myMedal' && myMedalInit(f7, window.mainView, page);
    page.name === 'medalInfo' && medalInfoInit(f7, window.mainView, page);
    page.name === 'medalList' && medalListInit(f7, window.mainView, page);

    /* 担保交易*/
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
 * 返回动画完成之后调用
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
 * 关闭登录视图/发布需求信息视图
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
 * 调用native定位，获取当前定位信息
 * 1.8升级1.9 登录token兼容刷新
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
            // 补丁插入的css
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
 * 一开始执行检查版本更新操作
 * 更新版本按钮操作事件
 * 初始化邀请model类
 * 邀请modal按钮操作
 * 微信modal操作
 * 鱼车选择地区modal操作
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

// 获取未读咨询数量
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
 * 获取设备号
 * 关心鱼种数据整合
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

// 统计js报错
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
                console.log('错误发送失败！');
            },
            success: function (data){
                console.log('错误发送成功！');
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

// 处理picker组件空白处滑动触发页面滚动
$$('body').touchmove((e) => {
    const ele = e.target || window.event.target;
    if(($$(ele).hasClass('picker-modal-inner') && $$(ele).hasClass('picker-items')) ||
    ($$(ele).hasClass('toolbar-inner') && $$(ele).parent().hasClass('toolbar'))){
        e.preventDefault();
        e.stopPropagation();
        return;
    }
});

// 新功能第一次显示向导model
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

// 根据不同屏幕大小自适应字体
// const windowWidth = $$(window).width();
// $$('html').css({
//     fontSize: (10 * windowWidth / 375) + 'px'
// })

// 关闭更新等级弹窗
const $levelModal = $$('.update-level-modal');
$levelModal.find('.btn-sure').click(() => {
    $levelModal.removeClass('show');
});

// 在线课堂引导登录modal
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
    f7.alert(alertTitleText(), '温馨提示', loginViewShow);
    $classroomLoginModal.removeClass('show');
});
