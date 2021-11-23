import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import { loginViewHide } from '../middlewares/loginMiddle';
import {weixinAction} from './service/login/loginCtrl';
import store from '../utils/localStorage';

function loginInit (f7, view, page){
    const {phone, notBindPhone} = page.query;
    const {mWebUrl} = config;
    f7.hideIndicator();
    const currentPage = $$(
        $$('.view-login .pages>.page')[$$('.view-login .pages>.page').length - 1]);
    const currentNavbar = $$(
        $$('.view-login .navbar>.navbar-inner')[$$('.view-login .navbar>.navbar-inner').length -
                                                1]);
    const input = currentPage.find('.login-phone').children('input')[0];
    const nextBtn = currentPage.find('.login-next').children('a')[0];
    let isPass = false;
    setTimeout(() => {
        currentPage.find('.login-phone').children('input').focus();
    }, 800);

    const inputChange = () => {
        const val = input.value;
        let classes = nextBtn.className;
        if (/^1[3|4|5|7|8]\d{9}$/.test(val)){
            classes += ' on';
            nextBtn.className = classes;
            isPass = true;
        } else {
            nextBtn.className = classes.replace(' on', '');
            isPass = false;
        }
    };
    if (phone){
        input.value = phone;
        inputChange();
    }
    input.oninput = () => {
        inputChange();
    };

    /*
     * 输入框输入监听事件
     * */
    input.onkeypress = (e) => {
        const event = e || window.event;
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13){
            nextBtn.click();
        }
    };

    nextBtn.onclick = () => {
        inputChange();
        if (!isPass){
            return;
        }
        currentPage.find('input').blur();
        window.loginView.router.load({
            url: 'views/loginCode.html' + `?phone=${input.value}`
        });

    };

    /*
     * 打开第三方webview，载入帮助页面
     * */
    if (currentPage.find('.user-protocol').length){
        currentPage.find('.user-protocol').children('a')[0].onclick = () => {
            window.apiCount('btn_term');
            nativeEvent['goNewWindow'](`${mWebUrl}terms.html`);
        };
    }

    /*
     * 判断是否为微信登录而未绑定手机号的情况，显示以及隐藏跳过按钮
     * 跳过绑定手机号
     * */
    if (currentNavbar.find('.bind-phone-break').length){
        notBindPhone && currentNavbar.find('.bind-phone-break').children('span').show();
        currentNavbar.find('.bind-phone-break')[0].onclick = () => {
            loginViewHide();
            window.mainView.router.refreshPage();
        };
    }

    /*
     * 调用native微信登录
     * */
    if (currentPage.find('.weixin-login-btn').length){
        currentPage.find('.weixin-login-btn')[0].onclick = () => {
            window.apiCount('btn_login_wechat');
            weixinAction(f7);
        };
    }

    /**
     * 没有微信 隐藏微信按钮
     */
    if (!store.get('isWXAppInstalled') || store.get('weixinData')){
        currentPage.find('.break-up-line').hide();
        currentPage.find('.weixin-login-btn').hide();
    }

}

export {
    loginInit
};
