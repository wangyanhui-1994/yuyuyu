'use strict';
import store from '../../../utils/localStorage';
import UpdateVersionMode from './UpdateVersionModel';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';
import {JsBridge} from '../../../middlewares/JsBridge';
import {invitationInit} from '../../service/invitation/invitationCtrl';

const {waitAddPointerKey, newsModalKey} = config;
/**
 * value: 1  无更新
 * value: 2  大版本更新
 * value: 3  小版本更新
 * */
function updateCtrl (f7){
    store.set(waitAddPointerKey, 0);
    const $updateInfoText = $$('.update-content-text');
    const $updateModalBox = $$('.update-app-modal .update-content');
    const $updateModal = $$('.update-app-modal');
    const $body = $('body');

    const checkModalSize = () => {
        setTimeout(() => {
            const maxHeight = $('body').height() * 0.8 - 300;
            $updateInfoText.css({maxHeight: `${maxHeight}px`});
            $updateModalBox.css(
                'margin-top', `-${$updateModalBox.height() * 0.5 - 15}px`
            );
        }, 200);
    };

    const updateCallback = (res) => {
        const {
            describe,
            filePath,
            force,
            returnCode,
            versionNumber
        } = res;
        // 没有更新，进入邀请流程
        if(1 == returnCode){
            /* 初始化邀请码 */
            (!$updateModal.hasClass('large') &&
            !$updateModal.hasClass('small') &&
            !$updateModal.hasClass('force')) &&
            setTimeout(() => {
                invitationInit(f7, window.mainView);
            }, 1000);
            return;
        }else{
            $body.attr('data-update-version', versionNumber);
        }

        // 有大版本更新
        if(2 == returnCode){
            $updateModal.find('.title').text('快升级到最新版本');
            let strHtml = describe.split('\n').join('<br />');
            if(window.currentDevice.android && (5 != window.yudada.JS_GetNetWorkStates())){
                strHtml = '现在处于非WIFI环境下，需要使用移动流量更新，更新内容：<br />' + strHtml;
            }

            $updateInfoText.html(strHtml);

            if(force && window.currentDevice.android && (5 != window.yudada.JS_GetNetWorkStates())){
                $updateModal.addClass('large');
                force && $updateModal.addClass('force');
                $body.attr('data-update-url', filePath);
                checkModalSize();
            }else{
                if(window.currentDevice.android){
                    $updateModal.find('.title').text('已在WIFI环境下准备好最新版本');
                }
                JsBridge('JS_Download', {
                    filePath,
                    fileName: 'yudada.apk'
                }, (data) => {
                    if(1 == data){
                        $updateModal.addClass('large');
                        force && $updateModal.addClass('force');
                        checkModalSize();
                    }else{
                        nativeEvent.nativeToast(0, '下载失败！');
                    }
                }, f7);
            }
            return;
        }

        // 有小版本更新
        if(3 == returnCode){
            $updateModal.find('.title').text('已为您更新到最新版本');
            $updateInfoText.html(describe.split('\n').join('<br />'));

            JsBridge('JS_Download', {
                filePath,
                fileName: 'webapp.zip'
            }, (data) => {
                if(1 == data){
                    $updateModal.addClass('small');
                    checkModalSize();
                }else{
                    nativeEvent.nativeToast(0, '下载失败！');
                }
            }, f7);
            return;
        }
    };
    UpdateVersionMode.get(updateCallback);
}

function updateClickEvent (f7){
    const $body = $$('body');
    /**
     * 小版本更新
     * */
    $$('.small-version-update').click(() => {
        // 显示新功能引导海报
        store.remove(newsModalKey);
        JsBridge('JS_WebAppUpdate', {
            fileName: 'webapp.zip',
            versionNumber: $body.attr('data-update-version')
        }, () => {}, f7);
        window.apiCount('app_btn_h5Update_android');
    });

    /**
     * 大版本更新
     * 非强制更新/强制更新
     * */
    $$('.large-version-update').click(() => {
        const {android} = window.currentDevice;
        window.apiCount('app_btn_appUpdate_yes');
        // 显示新功能引导海报
        store.remove(newsModalKey);
        if (android){
            if (!$$('.update-app-modal').hasClass('force')){
                if(5 != window.yudada.JS_GetNetWorkStates()){
                    JsBridge('JS_Download', $('body').attr('data-update-url'), (data) => {
                        if(1 == data){
                            JsBridge('JS_AppUpdate', {
                                fileName: 'yudada.apk',
                                versionNumber: $body.attr('data-update-version')
                            }, (data) => {}, f7);
                        }else{
                            nativeEvent.nativeToast(0, '下载失败！');
                        }
                    }, f7);
                }else{
                    JsBridge('JS_AppUpdate', {
                        fileName: 'yudada.apk',
                        versionNumber: $body.attr('data-update-version')
                    }, (data) => {}, f7);
                }
                $$('.update-app-modal').removeClass('large small');
            }else{
                if($$('.update-app-modal').hasClass('force')){
                    f7.showPreloader('更新中...');
                }
                $$('.update-app-modal').removeClass('large small');
                JsBridge('JS_AppUpdate', {
                    fileName: 'yudada.apk',
                    versionNumber: $body.attr('data-update-version')
                }, (data) => {}, f7);
            }
        } else {
            if($$('.update-app-modal').hasClass('force')){
                f7.showPreloader('更新中...');
            }
            $$('.update-app-modal').removeClass('large small');
            JsBridge('JS_WebAppUpdate', {
                fileName: 'yudada.apk',
                versionNumber: $body.attr('data-update-version')
            }, (data) => {}, f7);
        }
    });

    /**
     * 点击我再想想
     * */
    $$('.large-version-cancel').click(() => {
        const {android} = window.currentDevice.android;
        $$('.update-app-modal').removeClass('large small');
        if(android){
            window.apiCount('app_btn_appUpdate_no');
        }else{
            window.apiCount('app_btn_h5Update_ios');
        }
    });

    $$('.update-app-modal').touchmove((e) => {
        const eve = e || window.event;
        if(!$$(eve.target).hasClass('update-content-text')){
            eve.preventDefault();
        }
        eve.stopPropagation();
        return;
    });
}

export {
    updateCtrl,
    updateClickEvent
};
