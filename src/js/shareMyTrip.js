import store from '../utils/localStorage';
import config from '../config/index';
import {activeLogout, isLogin} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import shareComponent from '../component/shareComponent';
import {JsBridge} from '../middlewares/JsBridge';
import {getShareTripImgUrl} from '../utils/string';

function shareMyTripInit (f7, view, page){
    f7.hideIndicator();
    if (!isLogin()){
        activeLogout();
    }
    const currentPage = $$($$('.view-main .pages>.page-share-my-trip')[$$('.view-main .pages>.page-share-my-trip').length - 1]);
    const {cacheUserInfoKey} = config;
    const userInfo = store.get(cacheUserInfoKey);
    const shareImgUrl = getShareTripImgUrl(userInfo, page.query);

    const {
        imgUrl,
        registerCount
    } = userInfo || {};

    /**
     * vue的数据模型
     * */
    Vue.component('share-component', shareComponent);

    new Vue({
        el: currentPage.find('.page-content')[0],
        data: {
            imgUrl: imgUrl,
            query: page.query,
            level: userInfo.level
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
                window.apiCount('btn_inviteFriends_share');
                nativeEvent.shareInfoToWeixin(0, shareImgUrl);
            },
            weixinShareCircle (){
                window.apiCount('btn_inviteFriends_share');
                nativeEvent.shareInfoToWeixin(1, shareImgUrl);
            },
            qqShareFriend (){
                window.apiCount('btn_inviteFriends_share');
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

export {shareMyTripInit};
