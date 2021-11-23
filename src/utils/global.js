import config from '../config/';
import customAjax from '../middlewares/customAjax';
import store from './localStorage';
import Framework7 from '../js/lib/framework7';
import nativeEvent from '../utils/nativeEvent';
import { goIdentity } from './domListenEvent';
import { isLogin, loginViewHide, loginViewShow } from '../middlewares/loginMiddle';
import { getQuery } from './string';

const f7 = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});

class CustomClass{

    /*
    * native返回认证上传的信息，h5更新用户关联信息
    * */
    getPhoneSrc (srcimg, src, index){
        const { identity, cacheUserInfoKey, imgPath } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        let individualCert = true;
        const id = store.get(cacheUserInfoKey) ? store.get(cacheUserInfoKey)['id'] : '';
        const _index = Number(index);
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code){
                $$('.my-center-head img').attr('src', src + imgPath(8));
                $$('.user-pic>img.user-head-pic').attr('src', src + imgPath(8));
                $$('img.picker-invite-head-img').attr('src', src + imgPath(8));
                let userInfoChange = store.get(cacheUserInfoKey);
                userInfoChange['imgUrl'] = src;
                store.set(cacheUserInfoKey, userInfoChange);
            }else{
                console.log(message);
            }
        };
        if (_index == 4){
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateUserInfo',
                data: [id, '', src],
                type: 'post',
                noCache: true
            }, callback);
        } else if (_index > -1 && _index <= 2){
            /**
             * 上传司机身份证
             * */
            if(currentPage.find('.post-driver-header').length){
                currentPage.find('.post-box').children('.left').children('div').html(`<img src="${src}${identity['individual']}" />`);
                return;
            }

            /**
             * 上传非司机身份证
             * */
            $$('.identity-individual-pic>div').eq(_index).addClass('on');
            $$('.identity-individual-pic>div').eq(_index).find('img').attr('src', src + identity['individual']);
            $$.each($$('.identity-individual-pic>div'), (_index, item) => {
                !$$('.identity-individual-pic>div').eq(_index).find('img').attr('src') && (individualCert = false);
            });
            individualCert && ($$('.identity-submit>.identity-submit-btn').addClass('pass individual-pass'));
        } else if (3 == _index){
            $$('.identity-company-pic>div').addClass('on');
            $$('.identity-company-pic>div').find('img').attr('src', src + identity['company']);
            $$('.identity-submit>.identity-submit-btn').addClass('pass company-pass');
        }
    }

    /*
    * native返回h5发布信息是选择地区信息
    * */
    getProandCity (province, city, provinceId, cityId){
        if (!window['addressObj']){
            window['addressObj'] = {};
        }
        if (!window['selectedAddress']){
            window['selectedAddress'] = {};
        }
        window['addressObj']['provinceName'] = province;
        window['addressObj']['cityName'] = city;
        window['addressObj']['provinceId'] = provinceId;
        window['addressObj']['cityId'] = cityId;
        window['selectedAddress']['provinceName'] = province;
        window['selectedAddress']['cityName'] = city;

        if(window.releaseVue){
            window.releaseVue.subInfo.provinceName = province;
            window.releaseVue.subInfo.provinceId = provinceId;
            window.releaseVue.subInfo.cityName = city;
            window.releaseVue.subInfo.cityId = cityId;
            window.releaseVue.subInfo.address = `${province} ${city}`;
        }
    }

    /*
    * 更新用户信息
    * */
    saveInforAddress (userId, provinceId, cityId, province, city, address){
        const { cacheUserInfoKey } = config;
        const { provinceName, cityName, id } = store.get(cacheUserInfoKey);
        if (province == provinceName && city == cityName){
            // nativeEvent['nativeToast'](0, '请改变您所在的地区！');
            nativeEvent['nativeToast'](1, '修改成功！');
            return;
        }
        const callback = (data) => {

            const { code, message } = data;
            if (1 == code){
                nativeEvent['nativeToast'](1, message);
                let userInfoChange = store.get(cacheUserInfoKey);
                userInfoChange['provinceName'] = province;
                userInfoChange['cityName'] = city;
                store.set(cacheUserInfoKey, userInfoChange);
                $$('.my-center-address').find('span').text(`${province}${city}`);
                window.userVue.userInfo.cityId = cityId;
            }
        };
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'updateUserInfo',
            data: [id, '', '', address, provinceId, cityId, province, city],
            type: 'post',
            noCache: true
        }, callback);
    }

    appJump (id){
        const url = id == 0 ? 'views/homeBuy.html' : 'views/release.html';
        window.mainView.router.load({ url });
    }

    /*
    * native传给h5定位信息
    * */
    getAdreesSys (province, city, longitude, latitude){
        window['addressObj'] = {};

        window['addressObj']['initProvinceName'] = province;
        window['addressObj']['initCityName'] = city;

        // 由于第三方sdk修改造成的bug,临时处理
        if (province.indexOf('null') > -1 || city.indexOf('null') > -1){
            window['addressObj']['initProvinceName'] = '';
            window['addressObj']['initCityName'] = '';
        }
        window['addressObj']['longitude'] = longitude;
        window['addressObj']['latitude'] = latitude;
    }

    /*
    * native给h5鱼类资质证书的资源信息，h5更新
    * */
    subAndShowFishAu (TOKEN, path, uploadFilename, fileSize, srcimg, id){
        const callback = (data) => {
            const { code, message } = data;
            if (1 == code){
                window.mainView.router.refreshPage();
            } else {
                f7.alert(message, '提示');
            }
        };
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'addUserFishCertificate',
            header: ['token'],
            // paramsType: 'application/json',
            data: [path, uploadFilename, fileSize],
            type: 'post',
            noCache: true
        }, callback);
    }

    /*
    * native登录后跳转h5页面
    * */
    getKey (token, userId, state, status){
        /*
         *   status == '0': user fisrt login.
         *   status == '1': user many login.
         *   status == '2':微信绑定手机号
         */
        (0 == status) && nativeEvent.nativeToast(1, '登录成功！');
        (2 == status) && nativeEvent.nativeToast(1, '手机号绑定成功！');
        loginViewHide();
        store.set('weixinData', '');
        f7.hideIndicator();
        // 删除游客ID
        store.remove('guestId');
        const pageArr = ['homeSell', 'homeBuy', 'user', 'aquaticRanking', 'aquaticClassroom', 'articalInfo'];
        if(pageArr.indexOf(window.mainView.activePage.name) > -1){
            window.mainView.router.refreshPage();
            f7.hidePreloader();
        }else if('bindAccount' == window.mainView.activePage.name){
            window.mainView.router.load({
                url: 'views/user.html'
            });
            f7.hidePreloader();
        }else{
            const loginCallback = (data) => {
                const {code, message} = data;
                const { cacheUserInfoKey } = config;
                if(1 == code){
                    store.set(cacheUserInfoKey, data.data);
                    nativeEvent.setUerInfoToNative({
                        inviterId: data.data.inviterId
                    });
                }else{
                    console.log(message);
                }
                f7.hidePreloader();
            };

            customAjax.ajax({
                apiCategory: 'auth',
                header: ['token'],
                type: 'get',
                noCache: true
            }, loginCallback);
        }
    }

    /*
    * 退出app
    * */
    exitApp (){
        const { ios, android } = window.currentDevice;
        if (window.mainView['url'] &&
            (window.mainView['url'].indexOf('homeBuy.html') > -1 ||
            window.mainView['url'].indexOf('user.html') > -1 ||
            window.mainView['url'].indexOf('homeSell.html') > -1 ||
            window.mainView['url'].indexOf('aquaticClassroom.html') > -1)){
            ios && window.JS_ExitProcess();
            android && window.yudada.JS_ExitProcess();
        }
    }

    /*
    * 调用native统计
    * */
    apiCount (name){
        nativeEvent.apiCount(name);
    }

    writeHistory (history){
        const arr = history.split(' ') || [];
        let resArr = [];
        arr.length && $$.each(arr, (index, str) => {
            resArr.push(str.replace('“', '').replace('”', ''));
        });
        const { cacheHistoryKey } = config;
        store.set(cacheHistoryKey, resArr);
    }

    /*
    * 登录失败时，native通知h5
    * */
    loginFail (){
        const currentPage = $$($$('.view-login .pages>.page')[$$('.view-login .pages>.page').length - 1]);
        f7.hidePreloader();
        currentPage.find('.login-code-write').children('input').val('');
        currentPage.find('.login-code-submit').removeClass('on');
        currentPage.find('input[type="tel"]').focus();
    }

    logout (){
        const { cacheUserInfoKey } = config;
        store.remove(cacheUserInfoKey);
        nativeEvent.setNativeUserInfo();
        window.mainView.router.load({
            url: 'views/user.html',
            animatePages: false,
            reload: true
        });
    }

    initLogout (){
        const { cacheUserInfoKey } = config;
        let refreshId = setInterval(() => {
            if (window.mainView['url'].indexOf('user.html') > -1){
                store.remove(cacheUserInfoKey);
                setTimeout(() => {
                    window.mainView.router.load({
                        url: 'views/user.html',
                        reload: true
                    });
                }, 600);
                clearInterval(refreshId);
            }
        }, 500);
    }

    /*
    * 安卓手机物理键返回callback
    * 后退页面或者关闭辅助视图
    * */
    jsBack (){
        const $loginNavs = $$('.view-login .navbar>.navbar-inner');
        const $currentLoginNav = $$($loginNavs[$loginNavs.length - 1]);

        const $releaseNavs = $$('.view-release-fish .navbar>.navbar-inner');
        const $currentReleaseNav = $$($releaseNavs[$releaseNavs.length - 1]);

        const $dealNavs = $$('.view-submit-deal .navbar>.navbar-inner');
        const $currentDealNav = $$($dealNavs[$dealNavs.length - 1]);

        const $payNavs = $$('.view-pay-flow .navbar>.navbar-inner');
        const $currentPayNav = $$($payNavs[$payNavs.length - 1]);

        if($$('.view-login').hasClass('show')){
            $currentLoginNav.find('.iconfont').click();
            return;
        }

        if($$('.view-release-fish').hasClass('show')){
            $currentReleaseNav.find('.iconfont').click();
            return;
        }

        if ($$('.view-submit-deal').hasClass('show')){
            $currentDealNav.find('.iconfont').click();
            return;
        }

        if ($$('.view-pay-flow').hasClass('show')){
            $currentPayNav.find('.iconfont').click();
            return;
        }

        const exitAppPageNameArr = ['homeBuy', 'user', 'aquaticClassroom', 'find', 'homeSell', 'releaseSucc'];
        const { ios } = window.currentDevice;
        const {name} = window.mainView.activePage;

        if (exitAppPageNameArr.indexOf(name) > -1){
            'releaseSucc' !== name && (ios ? window.JS_ExitProcess() : window.yudada.JS_ExitProcess());
            return;
        } else {
            window.mainView.router.back();
        }
    }

    postReleasePicCallback (index, url, name){
        // const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        // currentPage.find('.release-info-pic-add').remove();
        // const len = currentPage.find('.release-info-pic-list').children('span').length;
        // currentPage.find('.release-info-pic-list').append(releaseInfo.picList(url, currentPage));
        // len < 4 && currentPage.find('.release-info-pic-list').append(releaseInfo.addPicBtn());
        window.releaseVue.subInfo.imgs.push(url);
    }

    /*
     * type: demandInfo, level, auth
     * 信息, 等级, 认证, 我的店铺分享, 行程分享
     */
    jsJumpFromPush (obj){
        const { cacheUserInfoKey, mWebUrl } = config;
        const { type, id, url, title, secondCategoryName} = getQuery(obj);
        // 跳转app内的页面
        if ('demandInfo' == type){
            const callback = (data) => {
                if (data.data){
                    const type = data.data.demandInfo.type;
                    window.mainView.router.load({
                        url: `views/${2 == type ? 'selldetail' : 'buydetail'}.html?id=${id}`
                    });
                }
            };
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getDemandInfo',
                data: [id],
                header: ['token'],
                val: {
                    id
                },
                type: 'get'
            }, callback);
        } else if('myShop' == type){
            window.mainView.router.load({
                url: `views/otherIndex.html?currentUserId=${id}`
            });
        } else if('fishCarRoute' == type){
            window.mainView.router.load({
                url: 'views/fishCar.html?isFishCar=0'
            });
        } else if('classroom' == type){
            window.mainView.router.load({
                url: 'views/aquaticClassroom.html',
                reload: true
            });
        }else if('level' == type || 'auth' == type){
            if (!isLogin()){
                nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
                loginViewShow();
                return;
            }
            if ('level' == type){
                // nativeEvent['goNewWindow'](`${mWebUrl}user/member?id=${store.get(cacheUserInfoKey).id}`);
                window.mainView.router.load({
                    url: `${mWebUrl}user/member/${store.get(cacheUserInfoKey).id}?time=${new Date().getTime()}`
                });
            } else if ('auth' == type){
                customAjax.ajax({
                    apiCategory: 'auth',
                    header: ['token'],
                    type: 'get',
                    noCache: true
                }, (data) => {
                    if (data.code == 1){
                        store.set(cacheUserInfoKey, data.data);
                        if(window.location.hash.indexOf('catIdentityStatus.html') > -1){
                            window.mainView.router.refreshPage();
                            return;
                        }
                        goIdentity();
                    } else {
                        console.log('获取用户信息失败！');
                    }
                });
            }
        } else if('babyFish' == type){
            window.mainView.router.load({
                url: `${mWebUrl}models/babyFish?time=${new Date().getTime()}`
            });
        } else if ('classroomArticleDetail' == type){
            window.mainView.router.load({
                url: 'views/articalInfo.html',
                query: {
                    url,
                    id,
                    secondCategoryName,
                    title
                }
            });
        }
    }

    /*
    * native调用h5登录页面
    * */
    jumpToLogin (){
        loginViewShow();
    }

    /*
    * 从native获取微信的用户信息
    * */
    getWeixinDataFromNative (data){
        nativeEvent.setDataToNative('weixinData', data);
        if(nativeEvent.getUserValue()){
            window.mainView.router.load({
                url: 'views/user.html',
                reload: true
            });
            loginViewHide();
        }else{
            window.loginView.router.load({
                url: 'views/bindPhone.html?notBindPhone=true'
            });
            window.mainView.router.refreshPage();
        }
        if(window.mainView.url && window.mainView.url.indexOf('bindAccount') > -1){
            window.mainView.router.refreshPage();
        }
    }

    /*
    * 绑定手机号失败，native调用提示
    * */
    phoneBindFaild (){
        const { servicePhoneNumber } = config;
        f7.hidePreloader();
        f7.modal({
            title: '暂时无法绑定',
            text: '你的手机号码已被其他微信账号绑定，你可以：<br/>1:绑定其它手机号码<br/>2:联系客服',
            verticalButtons: 'true',
            buttons: [
                {
                    text: '绑定其它手机号',
                    onClick: () => {
                        window.loginView.router.back();
                    }
                },
                {
                    text: '联系客服',
                    onClick: () => {
                        nativeEvent.contactUs(servicePhoneNumber);
                    }
                },
                {
                    text: '我再想想',
                    onClick: () => {}
                }
            ]
        });
    }

    /*
     * 绑定微信号失败，native调用提示
     * */
    weixinBindFaild (){
        const { servicePhoneNumber } = config;
        f7.hidePreloader();
        f7.modal({
            title: '暂时无法绑定',
            text: '你的微信号已被其他用户绑定，你可以：<br/>1:绑定其它微信号<br/>2:联系客服',
            buttons: [
                {
                    text: '我知道了',
                    onClick: () => {
                        window.mainView.router.refreshPage();
                    }
                },
                {
                    text: '联系客服',
                    onClick: () => {
                        nativeEvent.contactUs(servicePhoneNumber);
                    }
                }
            ]
        });
    }

    /**
     * 上传司机驾照回调函数
     * */
    postDriverFileCallback (index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.right').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    /**
     * 上传司机道路运输从业资格证回调函数
     * */
    postDriverRoadTransportFileCallback (index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.left').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    /**
     * 上传司机道路运输证回调函数
     * */
    postDriverTransportCertificateFileCallback (index, url, name){
        const { identity } = config;
        const currentPage = $$('.view-main .pages>.page').eq($$('.view-main .pages>.page').length - 1);
        currentPage.find('.post-box').children('.right').children('div').html(`<img src="${url}${identity['individual']}" />`);
    }

    /**
     * [postUserShowCallback description]
     * @param  {[nmber]} index [返回的id]
     * @param  {[string]} url [上传的图片返回的在线路径]
     * @param  {[string]} name []
     * @return {[type]}     [description]
     */
    postUserShowCallback (index, url, name){
        window.strengthShowModel.userInfo.abilityImgList.unshift(url);
    }

    init (f){
        this.f7 = f;
        window['getPhoneSrc'] = this.getPhoneSrc;
        window['getProandCity'] = this.getProandCity;
        window['saveInforAddress'] = this.saveInforAddress;
        window['appJump'] = this.appJump;
        window['getAdreesSys'] = this.getAdreesSys;
        window['subAndShowFishAu'] = this.subAndShowFishAu;
        window['getKey'] = this.getKey;
        window['exitApp'] = this.exitApp;
        window['apiCount'] = this.apiCount;
        window['writeHistory'] = this.writeHistory;
        window['loginFail'] = this.loginFail;
        window['logout'] = this.logout;
        window['initLogout'] = this.initLogout;
        window['jsBack'] = this.jsBack;
        window['postReleasePicCallback'] = this.postReleasePicCallback;
        window['jsJumpFromPush'] = this.jsJumpFromPush;
        window['jumpToLogin'] = this.jumpToLogin;
        window['getWeixinDataFromNative'] = this.getWeixinDataFromNative;
        window['phoneBindFaild'] = this.phoneBindFaild;
        window['weixinBindFaild'] = this.weixinBindFaild;
        window['postDriverFileCallback'] = this.postDriverFileCallback;
        window['postDriverRoadTransportFileCallback'] = this.postDriverRoadTransportFileCallback;
        window['postDriverTransportCertificateFileCallback'] = this.postDriverTransportCertificateFileCallback;
        window['postUserShowCallback'] = this.postUserShowCallback;
    }
}

const globalEvent = new CustomClass();
export default globalEvent;
