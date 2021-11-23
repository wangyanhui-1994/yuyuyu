import config from '../config/';
import store from '../utils/localStorage';
import nativeEvent from '../utils/nativeEvent';
import ClassroomModel from '../../src/js/model/ClassroomModel';

const {
    cacheUserInfoKey,
    cacheStudyInfoKey
} = config;

/*
 * 判断用户是否登录
 * */
function isLogin (){
    const nativeToken = store.get('accessToken') || nativeEvent.getUserValue();
    const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
    if (!nativeToken){
        store.remove(cacheUserInfoKey);
        // 更新用户中心登录状态
        if ('user' == window.mainView.activePage.name &&
            currentPage.find('.login-succ').length && !store.get('weixinData')){
            window.mainView.router.refreshPage();
        }
        return false;
    } else {
        return true;
    }
}

/*
 * native通知h5登出，清除h5用户信息
 * */
function logOut (f7){
    f7.modal({
        title: '退出登录',
        text: '确认退出登录?',
        buttons: [{
            text: '确认',
            onClick: () => {
                store.remove(cacheUserInfoKey);
                store.set('addPoint', 0);
                store.set('visitorCount', 0);
                store.set('addBuyCount', 0);
                store.set('addSellCount', 0);
                store.remove('accessToken');
                store.remove('weixinUnionId');
                store.remove('weixinData');
                nativeEvent.setNativeUserInfo();
                store.remove('inviterId');
                store.remove('unionId');
                store.get(cacheStudyInfoKey);
                getGuestId();
                window.mainView.router.load({
                    url: 'views/user.html'
                });
            }
        }, {
            text: '取消',
            onClick: () => {}
        }]
    });
}

/**
 * 主动登出，清除h5用户信息并且通知native清除用户信息
 * */
function activeLogout (){
    store.set('addPoint', 0);
    store.set('visitorCount', 0);
    store.set('addBuyCount', 0);
    store.set('addSellCount', 0);
    store.remove(cacheUserInfoKey);
    store.remove('accessToken');
    nativeEvent.setNativeUserInfo();
    store.remove('weixinData');
    store.remove('weixinUnionId');
    store.remove('inviterId');
    store.remove('unionId');
    store.get(cacheStudyInfoKey);

    getGuestId();
    if (window.mainView.activePage.name === 'aquaticInfo'){
        setTimeout(() => {
            window.mainView.router.load({
                url: 'views/aquaticClassroom.html',
                reload: true
            });
        }, 500);
        return;
    }
    window.mainView.router.load({
        url: 'views/user.html',
        reload: true
    });
}

/**
 * 显示登录模块。
 * 1：当有没有token并且没有微信数据的时候，是正常的登录流程，load登录页面
 * 2：当有微信数据而没有token时，就是绑定手机号流程，load绑定个手机号页面
 * 3: 在发布成功页面登录，带来手机号自动填入
 * */
function loginViewShow (phone){
    const token = store.get('accessToken');
    const weixinData = store.get('weixinData');
    let url;
    if (!token && !weixinData){
        url = Number(phone) ? ('views/login.html?phone=' + phone) : 'views/login.html';
    }

    if (!token && weixinData){
        url = 'views/bindPhone.html';
    }
    window.loginView.router.load({
        url,
        reload: true
    });
    $$('.view-login').addClass('show');
}

function getToken (){
    return store.get('accessToken') || nativeEvent.getUserValue();
}

function setToken (accessToken){
    store.set('accessToken', accessToken);
}

/**
 * 隐藏登录页面
 * */
function loginViewHide (){
    $$('.view-login').removeClass('show');
}

/* 退出之后获取guestId*/
function getGuestId (){
    ClassroomModel.getGuestId({}, (res) => {
        const {
            code,
            data
        } = res;
        if (1 == code && data){
            store.set('guestId', data);
            window.mainView.activePage.url.indexOf('aquaticClassroom.html') > -1 && window.mainView.refreshPage();
        }
    });
}

export {
    isLogin,
    logOut,
    activeLogout,
    loginViewShow,
    loginViewHide,
    getToken,
    setToken
};
