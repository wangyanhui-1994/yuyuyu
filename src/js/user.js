import store from '../utils/localStorage';
import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
// import nativeEvent from '../utils/nativeEvent';
import {getCurrentDay, alertTitleText, getAuthText} from '../utils/string';
import UserModel from './model/UserModel';
import Vue from 'vue';
import {timeDifference} from '../utils/time';
import {JsBridge} from '../middlewares/JsBridge';
import visitListModel from './model/VisitListModel';
import ClassroomModel from './model/ClassroomModel';
import transactionProcessModel from './model/TransactionProcessModel';

import {
    goMyCenter,
    myListBuy,
    myListSell,
    uploadCert,
    contactUs,
    goIdentity,
    identifyFish,
    inviteFriends
} from '../utils/domListenEvent';

function userInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-user')[$$('.view-main .pages>.page-user').length - 1]);
    const {
        cacheUserInfoKey,
        imgPath,
        mWebUrl,
        infoNumberKey,
        cacheStudyInfoKey
    } = config;
    let userInformation = store.get(cacheUserInfoKey);
    if(store.get('accessToken')){
        store.set('accessToken', store.get('accessToken'));
    }

    // 底部tabbar组件
    // // 更新个人中心icon右上角的小点点
    new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            infoNumberKey: store.get(infoNumberKey) || 0
        }
    });

    const userVue = new Vue({
        el: currentPage.find('.vue-model')[0],
        data: {
            userInfo: {},
            recentDemands: [],
            isLogin: false,
            visitorCount: store.get('visitorCount') || 0,
            addedPoints: store.get('addPoint') || 0,
            addBuyCount: store.get('addBuyCount') || 0,
            addSellCount: store.get('addSellCount') || 0
        },
        methods: {
            contactUs: contactUs,
            timeDifference: timeDifference,
            imgPath: imgPath,
            myListBuy: myListBuy,
            myListSell: myListSell,
            uploadCert: uploadCert,
            identifyFish: identifyFish,
            inviteFriends: inviteFriends,
            goIdentity: goIdentity, // 前往实名认证
            goMyCenter: () => {
                window.apiCount('btn_editInfo');
                goMyCenter();
            },
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            // 打开帮助中心
            helpCenter (){
                // window.apiCount('btn_help');
                // nativeEvent['goNewWindow'](`${mWebUrl}helpCenter.html`);
                view.router.load({
                    url: 'views/moneyBible.html'
                });
            },
            // 我的成交
            goMyRecordList (){
                window.apiCount('btn_myCenter_myTrades');
                window.mainView.router.load({
                    url: 'views/myRecordList.html'
                });
            },
            // 最近访客
            goMyVisitList (){
                window.apiCount('btn_myCenter_recentGuests');
                window.mainView.router.load({
                    url: 'views/visitList.html'
                });
            },
            // 我的等级
            goMyMember (){
                f7.showIndicator();
                window.userVue.addedPoints = 0;
                window.apiCount('btn_myCenter_myLevel');
                store.set('addPoint', 0);
                store.set('levelTime', window.parseInt(new Date().getTime() / 1000));
                window.refreshTabbar && window.refreshTabbar();
                window.mainView.router.load({
                    url: `${mWebUrl}user/member/${this.userInfo.id}?time=${new Date().getTime()}`
                });
            },
            // 我的收藏
            goMyCollection (){
                window.apiCount('btn_favoriteList');
                window.mainView.router.load({
                    url: 'views/myCollection.html'
                });
            },
            // 发布信息
            releaseInfo (){
                window.apiCount('btn_tabbar_post');
                if (this.weixinData && !this.isLogin){
                    this.login();
                    return;
                }
                view.router.load({
                    url: 'views/release.html'
                });
            },
            // 刷新信息
            refreshInfo (){
                view.router.load({
                    url: 'views/myList.html?type=2'
                });
            },
            // 绑定账号
            bindAccount (){
                if (!this.isLogin && !this.weixinData){
                    f7.alert('您还没登录，请先登录!', '温馨提示', loginViewShow);
                    return;
                }
                window.apiCount('btn_bindAccounts');
                window.mainView.router.load({
                    url: 'views/bindAccount.html'
                });
            },
            // 前往鱼车需求
            goFishDemand (){
                window.apiCount('btn_myCenter_fishcarDemands');
                view.router.load({
                    url: 'views/myFishCarDemandList.html'
                });
            },
            // 查看拒绝原因
            catRejectInfo (msg){
                f7.modal({
                    title: '抱歉',
                    text: `您的鱼车信息审核未通过，原因是：${msg}`,
                    buttons: [
                        {
                            text: '重新报名',
                            onClick: () => {
                                view.router.load({
                                    url: `views/postDriverAuth.html?id=${userVue.userInfo.fishCarDriverId}`
                                });
                            }
                        },
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            // 冻结提示
            frozenMsg (){
                window.apiCount('btn_myCenter_editDriverInfo');
                f7.modal({
                    title: '抱歉',
                    text: '您的鱼车司机账号已被冻结，请联系客服！',
                    buttons: [
                        {
                            text: '联系客服',
                            onClick: contactUs
                        },
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            // 分享我的店铺
            shareMyShop (){
                window.apiCount('btn_myCenter_myShop');
                if (!this.isLogin && !this.weixinData){
                    this.login();
                    return;
                }
                const id = window.userVue.userInfo.id;
                window.mainView.router.load({
                    url: `views/otherIndex.html?currentUserId=${id}`
                });
            },
            fishCarCheckIng (){
                f7.modal({
                    title: '司机审核中',
                    text: '请耐心等待审核结果，审核通过后就可以发布行程了',
                    buttons: [
                        {
                            text: '我知道了',
                            onClick: () => {}
                        }
                    ]
                });
            },
            driverBtnClick (){
                const {driverState} = this.userInfo;
                if(driverState > -2){
                    if(1 !== driverState){
                        if (0 == driverState){
                            this.fishCarCheckIng();
                        } else if (2 == driverState){
                            this.catRejectInfo(this.userInfo.driverRefuseDescribe);
                        } else if (3 == driverState){
                            this.frozenMsg();
                        }
                    }else{
                        window.mainView.router.load({
                            url: `views/postDriverAuth.html?id=${this.userInfo.fishCarDriverId}`
                        });
                    }
                }else{
                    if (!this.isLogin && !this.weixinData){
                        this.login();
                        return;
                    }
                    window.apiCount('btn_myCenter_registerDriver');
                    view.router.load({
                        url: 'views/postDriverAuth.html'
                    });
                }
            },
            authCheckInfo (){
                f7.alert('正在审核中，请耐心等待');
            },
            // 查看企业审核不通过理由
            showAuthRejectInfo (msg, type){
                f7.modal({
                    title: '抱歉',
                    text: `您的${type ? '企业' : '个人'}认证未通过，原因是：${msg}`,
                    buttons: [
                        {
                            text: '我知道了',
                            onClick: () => {}
                        },
                        {
                            text: '重新提交',
                            onClick: () => {
                                view.router.load({
                                    url: 'views/identityAuthentication.html'
                                });
                            }
                        }

                    ]
                });
            },
            // 我卖出的
            listSell (){
                f7.showIndicator();
                window.userVue.addSellCount = 0;
                store.set('addSellCount', 0);
                store.set('latestSellTime', window.parseInt(new Date().getTime() / 1000));
                window.refreshTabbar && window.refreshTabbar();
                view.router.load({
                    url: 'views/transactionProcess/mySellOrder.html'
                });
            },
            // 我买到的
            listBuy (){
                f7.showIndicator();
                window.userVue.addBuyCount = 0;
                store.set('addBuyCount', 0);
                store.set('latestBuyTime', window.parseInt(new Date().getTime() / 1000));
                window.refreshTabbar && window.refreshTabbar();
                view.router.load({
                    url: 'views/transactionProcess/myBuyOrder.html'
                });
            },
            /**
             * [userLogin 最上层事件监听用户中心头部操作]
             * 分几种情况：
             * 1：未登录： 提示去登陆
             * 2：微信登录：提示绑定手机号
             * 3：已经登录：判断是修改用户信息还是去店铺
             */
            userLogin (e){
                const vm = this;
                const ele = $$(e.target);

                // 已经登录了的
                if (isLogin()){
                    ele.hasClass('chang-user-info') ? vm.goMyCenter() : vm.shareMyShop();
                    return;
                }

                loginViewShow();
            }
        },
        computed: {
            // 获取司机入口文案
            driverBtnText (){
                let res = '司机登记';
                const {driverState} = this.userInfo;
                if(driverState > -2){
                    0 === driverState && (res = '审核中');
                    1 === driverState && (res = '修改鱼车');
                    2 === driverState && (res = '审核失败');
                    3 === driverState && (res = '司机冻结');
                }
                return res;
            },
            isShowGoAuth (){
                const {enterpriseAuthenticationState, personalAuthenticationState} = this.userInfo;
                return (1 !== enterpriseAuthenticationState && 1 !== personalAuthenticationState);
            },
            authText (){
                const {enterpriseAuthenticationState, personalAuthenticationState} = this.userInfo;
                return getAuthText(enterpriseAuthenticationState, personalAuthenticationState);
            },
            weixinData (){
                if(this.isLogin){
                    return '';
                }
                return store.get('weixinData') || {};
            },
            versionNumber (){
                const versionNumber = store.get('versionNumber');
                let currentVersion = '';
                if(versionNumber){
                    const currentVersionArr = versionNumber.replace('V', '').split('_');
                    currentVersionArr && $$.each(currentVersionArr, (index, item) => {
                        if(Number(item) < 10){
                            currentVersion += item.replace('0', '');
                        }else{
                            currentVersion += item;
                        }
                        index < (currentVersionArr.length - 1) && (currentVersion += '.');
                    });
                }
                return currentVersion;
            },
            getMyPhoneNum (){
                let res = '';
                if(this.userInfo.loginName){
                    res += this.userInfo.loginName.substr(0, 3) + '****' + this.userInfo.loginName.substr(7, 11);
                }
                return res;
            },
            /**
             * [headImg 用户头像链接]
             */
            headImg (){
                const weixinData = store.get('weixinData') || {};
                const userInfo = this.userInfo || {};
                let res = 'img/defimg.png';
                weixinData.imgUrl && (res = weixinData.imgUrl);
                userInfo.imgUrl && (res = userInfo.imgUrl + imgPath(8));
                return res;
            },
            /**
             * [userHeadRightText 头部在不同登录或者没登录状态下右边的文案内容]
             */
            userHeadRightText (){
                let text = '点击登录';
                const weixinData = store.get('weixinData') || {};
                weixinData.imgUrl && (text = '去绑定');
                isLogin() && (text = '我的店铺');
                return text;
            }
        }
    });

    const loginCallback = (data) => {
        f7.hideIndicator();
        const {code, message} = data;
        if (code == 1){
            store.set(cacheUserInfoKey, data.data);
            userVue.userInfo = data.data;
            userVue.recentDemands = data.data.recentDemands;
            userVue.isLogin = true;

            const oldDate = store.get('oldDate');
            !oldDate && store.set('oldDate', getCurrentDay());
            if (!oldDate || ((new Date(oldDate).getTime() + 60 * 60 * 24 * 1000) < new Date(getCurrentDay()).getTime())){
                const {
                    nickname,
                    personalAuthenticationState,
                    enterpriseAuthenticationState
                } = userInformation;
                store.set('oldDate', getCurrentDay());
                if (!nickname){
                    f7.modal({
                        title: '提示',
                        text: '你还没填写你的名字，填写完整有助于交易成交~',
                        buttons: [
                            {
                                text: '现在去填写',
                                onClick: () => {
                                    window.mainView.router.load({
                                        url: 'views/editName.html'
                                    });
                                }
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    });
                    return;
                }
                if (1 != personalAuthenticationState && 1 !== enterpriseAuthenticationState){
                    f7.modal({
                        title: '提示',
                        text: '实名认证有助于交易成交，交易额翻番不是梦~',
                        buttons: [
                            {
                                text: '现在去认证',
                                onClick: goIdentity
                            },
                            {
                                text: '取消',
                                onClick: () => {
                                }
                            }
                        ]
                    });
                    return;
                }
            }
        } else {
            f7.alert(message);
        }
        setTimeout(() => {
            currentPage.css({
                borderBottom: '1px solid #efeff4'
            });
        }, 1000);
    };

    setTimeout(() => {
        currentPage.css({
            borderBottom: '1px solid #efeff4'
        });
    }, 1000);

    if(!window.uuid){
        JsBridge('JS_GetUUid', {}, (data) => {
            window.uuid = data;
        });
    }
    // 获取当前用户最近访客数
    const visitCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            store.set('visitorCount', data);
            userVue.visitorCount = data;
        }else{
            console.log(message);
        }
    };

    /*
     * [getVisitCount 获取访客数]
     * userVisitTime 上次进入查看访客列表的时间
     */
    const getVisitCount = () => {
        const lastGetTime = store.get('userVisitTime') || 0;
        visitListModel.getVisitCount(
            {
                lastGetTime
            },
            visitCallback
        );
    };

    // 获取当前用户等级增长数
    const pointsCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            store.set('addPoint', data || 0);
            userVue.addedPoints = data;
            window.refreshTabbar();
        }else{
            console.log(message);
        }
    };

    /*
     * [getAddPoints 获取用户积分增加数]
     */
    const getAddPoints = () => {
        const lastGetTime = store.get('levelTime') || 0;
        visitListModel.getAddedPoints(
            {
                lastGetTime
            },
            pointsCallback
        );
    };

    // 我最近买的个数回调
    const latestBuyCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            store.set('addBuyCount', data || 0);
            userVue.addBuyCount = data;
            window.refreshTabbar();
        }else{
            console.log(message);
        }
    };

    /*
     * [getLatestBuy 我最近买的个数]
     */
    const getLatestBuy = () => {
        const lastBuyTime = store.get('latestBuyTime') || 0;
        transactionProcessModel.getLatestBuy(
            {
                lastScanTime:lastBuyTime
            },
            latestBuyCallback
        );
    };

    // 我最近卖的个数回调
    const latestSellCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            store.set('addSellCount', data || 0);
            userVue.addSellCount = data;
            window.refreshTabbar();
        }else{
            console.log(message);
        }
    };

    /*
     * [getLatestBuy 我最近卖的个数]
     */
    const getLatestSell = () => {
        const lastSellTime = store.get('latestSellTime') || 0;
        transactionProcessModel.getLatestSell(
            {
                lastScanTime:lastSellTime
            },
            latestSellCallback
        );
    };

    // 个人信息
    const studyCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            if (data){
                let {medalCount} = store.get(cacheStudyInfoKey) || {};
                store.set(cacheStudyInfoKey, data);
                if(medalCount && medalCount != data.medalCount){
                    store.set('newMedalCount', 1);
                }
                window.refreshTabbar && window.refreshTabbar();
            }
        } else {
            console.log(message);
        }
    };
    /*
     * [getStudyInfo 获取个人信息]
     */
    let guestId = store.get('guestId') || '';
    const getStudyInfo = () => {
        ClassroomModel.getStudyInfo({
            guestId
        },
        studyCallback
        );
    };
    /*
     * 判断登录状态
     * 已登录：微信登录/手机号登录
     * */
    if(isLogin()){
        userVue.isLogin = true;
        if (userInformation && userInformation.recentDemands){
            userVue.userInfo = userInformation;
            userVue.recentDemands = userInformation.recentDemands;
        }else{
            f7.showIndicator();
        }
        UserModel.get(loginCallback);
        getVisitCount();
        getAddPoints();
        getStudyInfo();
        getLatestBuy();
        getLatestSell();
    }
    window.userVue = userVue;
}

export {
    userInit
};
