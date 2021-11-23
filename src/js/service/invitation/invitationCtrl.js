/**
 * 邀请码
 * Created by domicc on 27/02/2017.
 * 只有在未登录的并且有邀请数据的情况下，邀请框显示并且引导登录
 */

import {isLogin, loginViewShow} from '../../../middlewares/loginMiddle';
import store from '../../../utils/localStorage';
import invitationModel from './InvitationModel';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';

function invitationInit (f7, view){
    const $modalBgInvitation = $$('.modal-bg-invitation');
    const $confirmBtn = $$('.modal-bg-invitation .btn.confirm');
    const $cancelBtn = $$('.modal-bg-invitation .btn.cancel');
    const $text = $$('.modal-bg-invitation .text');
    const $headUrl = $modalBgInvitation.find('.img-user');
    const $nickname = $modalBgInvitation.find('.div-nickname').children('.nickname');
    const {android} = window.currentDevice;

    const {
        cancelInvitationNumberKey,
        inviteInfoKey,
        cacheUserInfoKey,
        imgPath
    } = config;

    const callback = (inviterInfo) => {
        const userInfo = store.get(cacheUserInfoKey);

        /**
         * 页面跳转
         * */
        if(android && ('string' == typeof inviterInfo)){
            const jsJumpInfo = JSON.parse(inviterInfo);
            if(jsJumpInfo.jsJump || store.get('jsJumpData')){
                jsJumpInfo.jsJump && store.set('jsJumpData', jsJumpInfo.jsJump);
                if(jsJumpInfo.jsJump){
                    window.jsJumpFromPush(jsJumpInfo.jsJump);
                }else{
                    window.jsJumpFromPush(store.get('jsJumpData'));
                }
                setTimeout(() => {
                    store.set('jsJumpData', '');
                }, 2000);
                return;
            }
        }

        if (isLogin()){
            invitationModel.accept(() => {
                console.log('invitetion---userInvitation/me');
            });
        }

        /**
         * 邀请
         * */
        let inviterInfoData = inviterInfo;
        if(android){
            inviterInfoData = JSON.parse(inviterInfoData);
        }
        if(userInfo &&
          (userInfo.inviterId ||
          (inviterInfoData && (userInfo.invitationCode == inviterInfoData.invitationCode)) ||
          (store.get(inviteInfoKey) && (store.get(inviteInfoKey).invitationCode == inviterInfoData.invitationCode)))){
            return;
        }
        if(inviterInfoData && inviterInfoData.invitationCode){
            store.set(inviteInfoKey, inviterInfoData);
            store.set(cancelInvitationNumberKey, 0);
        }else{
            const cancelInvitationNumber = store.get(cancelInvitationNumberKey);
            if(Number(cancelInvitationNumber) >= 3){
                return;
            }
        }

        const {
            invitationCode,
            inviter,
            headerUrl
        } = store.get(inviteInfoKey) || {};
        const weixinData = nativeEvent.getDataToNative('weixinData');
        if (invitationCode){
            $headUrl.attr('src', headerUrl ? `${headerUrl}${imgPath(8)}` : './img/defimg.png');
            $nickname.text(inviter);

            if (isLogin()){
                $confirmBtn.text('接受邀请');
                $cancelBtn.text('我再想想');
                $text.text('接收邀请之后, 你和好友都将获得靠谱指数5分的奖励');
            } else {
                $confirmBtn.text(weixinData ? '绑定手机号' : '现在去登录');
                $cancelBtn.text('我再想想');
                $confirmBtn.text('登录接受邀请');
                $text.text('立刻去登录自动接受朋友邀请，你们两个都能加5分哦');
                $modalBgInvitation.addClass('show');
            }
        }
        return;
    };

    /**
     * 获取魔窗传递的邀请信息/页面跳转信息
     * */
    invitationModel.getInviterInfo(callback, f7);
}

function invitationAction (){
    const $confirmBtn = $$('.modal-bg-invitation .btn.confirm');
    const $modalBgInvitation = $$('.modal-bg-invitation');
    const $cancelBtn = $$('.modal-bg-invitation .btn.cancel');
    const {
        waitAddPointerKey,
        // inviteInfoKey,
        cancelInvitationNumberKey
    } = config;
    $confirmBtn.click(() => {
        // const inviteInfoCache = store.get(inviteInfoKey) || {};
        // const {
        //     invitationCode
        // } = inviteInfoCache;
        if (isLogin()){
            // invitationModel.acceptInvitation(invitationCode, () => {});
            $modalBgInvitation.removeClass('show');
            window.apiCount('app_btn_invite_accept');
        } else {
            store.set(waitAddPointerKey, 1);
            $modalBgInvitation.removeClass('show');
            loginViewShow();
            window.apiCount('app_btn_invite_login');
        }
    });

    $cancelBtn.click(() => {
        let count = store.get(cancelInvitationNumberKey) || 0;
        store.set(cancelInvitationNumberKey, Number(count) + 1);
        store.set(waitAddPointerKey, 0);
        $modalBgInvitation.removeClass('show');
        window.apiCount('app_btn_invite_unaccept');
    });
}

export {invitationInit, invitationAction};
