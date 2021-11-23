import store from '../utils/localStorage';
import config from '../config/index';
import {activeLogout, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';
import userUtils from '../utils/viewsUtil/userUtils';
import {JsBridge} from '../middlewares/JsBridge';
import {getShareImgUrl} from '../utils/string';

function inviteFriendsInit (f7, view, page){
    if (!isLogin()){
        activeLogout();
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const isMyShop = currentPage.hasClass('page-my-shop');
    const {cacheUserInfoKey} = config;
    const userInfo = store.get(cacheUserInfoKey);
    const shareImgUrl = getShareImgUrl(userInfo);

    const {
        scanLink,
        registerCount,
        enterpriseAuthenticationState,
        enterpriseAuthenticationTime,
        personalAuthenticationState,
        personalAuthenticationTime
    } = userInfo || {};

    const authText = userUtils.getAuthenticationText(enterpriseAuthenticationState, enterpriseAuthenticationTime, personalAuthenticationState, personalAuthenticationTime).myCenterText;

    /**
     * 生成二维码
     * */
    if (scanLink){
        setTimeout(() => {
            new window.QRCode(currentPage.find('.invite-user-code')[0], {
                text: scanLink,
                height: 180,
                width: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: window.QRCode.CorrectLevel.H
            });
        }, 30);
    }

    /**
     * vue的数据模型
     * */
    Vue.component('share-component', shareComponent);
    new Vue({
        el: currentPage.find('.page-content')[0],
        data: {
            inviteData: userInfo,
            authText: authText
        },
        methods: {
            // 跳转至用户已经邀请成功的列表
            goToInviteList (){
                window.apiCount('btn_inviteFriends_userlist');
                if (!registerCount){
                    nativeEvent.nativeToast(0, '你还没有邀请过好友！');
                    return;
                }
                view.router.load({url: 'views/inviteFriendsList.html'});
            },
            weixinShareFriend (){
                window.apiCount(isMyShop ? 'btn_shareMyShop_wechat' : 'btn_inviteFriends_wechat');
                nativeEvent.shareInfoToWeixin(0, shareImgUrl);
            },
            weixinShareCircle (){
                window.apiCount(isMyShop ? 'btn_shareMyShop_circle' : 'btn_inviteFriends_circle');
                nativeEvent.shareInfoToWeixin(1, shareImgUrl);
            },
            qqShareFriend (){
                window.apiCount(isMyShop ? 'btn_shareMyShop_qq' : 'btn_inviteFriends_qq');
                JsBridge('JS_QQSceneShare', {
                    type: '0',
                    imageUrl: shareImgUrl,
                    title: '鱼大大',
                    describe: '',
                    webUrl: ''
                }, () => {
                    console.log('分享成功！');
                });
            }
        }
    });
}

export {inviteFriendsInit};
