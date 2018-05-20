import {isLogin} from '../../../middlewares/loginMiddle';
import loginModel from '../../../js/service/login/LoginModel';
import {JsBridge} from '../../../middlewares/JsBridge';
import store from '../../../utils/localStorage';
import nativeEvent from '../../../utils/nativeEvent';
import {getCurrentDay, getVersionSetTag} from '../../../utils/string';
import config from '../../../config';
import invitationModel from '../../service/invitation/InvitationModel';
import InitApp from '../../model/InitApp';
import {getPutFishList, editFishList} from '../../../utils/strTool';

function weixinAction (f7){
    JsBridge('JS_WeChatLoginWithBridge', '', (weixinCode) => {
        const {
            waitAddPointerKey,
            inviteInfoKey,
            cacheUserInfoKey,
            fishCacheObj
        } = config;
        const getFishList = () => {
            const fishCache = $$.isArray(store.get(fishCacheObj.fishCacheKey)) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
            InitApp.putFishList({
                subscribedFishes: getPutFishList(fishCache),
                action: 'login'
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
        };
        if(weixinCode){
            if(isLogin()){
                // 绑定微信号
                loginModel.put({
                    code: weixinCode
                }, (res) => {
                    const {code, message} = res;
                    if(1 == code){
                        getFishList();
                        nativeEvent.nativeToast(1, '账号绑定成功！');
                        window.mainView.router.load({
                            url: 'views/user.html'
                        });
                    }else if(102 == code){
                        window.weixinBindFaild();
                    }else{
                        f7.alert(message);
                    }
                });
            }else{
                // 微信登录
                loginModel.post({
                    code: weixinCode
                }, (res) => {
                    const {code, data, message} = res;
                    if(1 == code){

                        if(data.token){
                            store.set('accessToken', data.token);
                            window.getKey(data.token, '', '', 0);
                            store.set(cacheUserInfoKey, data.userInfoView);

                            getFishList();

                            // 设置别名
                            JsBridge('JS_SetTagsWithAlias', {
                                tags: [
                                    getCurrentDay().replace('/', '').replace('/', ''),
                                    getVersionSetTag()
                                ],
                                alias: `${data.userInfoView.id}`
                            }, () => {}, f7);

                            if (1 == store.get(waitAddPointerKey)){
                                const {invitationCode} = store.get(inviteInfoKey);
                                invitationModel.acceptInvitation(invitationCode);
                            }

                            if(data.userInfoView.fishCarDriverId || data.fishCarDriverId){
                                store.set('isFishCar', 1);
                            }
                        }else{
                            data.userInfoView.unionId && store.set('weixinUnionId', data.userInfoView.unionId);
                            data.userInfoView && store.set('weixinData', data.userInfoView);
                            nativeEvent.nativeToast(1, '微信登录成功！');
                            window.getWeixinDataFromNative(data.userInfoView);
                            JsBridge('JS_SetTagsWithAlias', {
                                tags: [
                                    getCurrentDay().replace('/', '').replace('/', ''),
                                    getVersionSetTag()
                                ],
                                alias: ''
                            }, () => {}, f7);
                        }
                    }else{
                        nativeEvent.nativeToast(0, message);
                    }
                });
            }
        }
    }, '');
}

export {
    weixinAction
};
