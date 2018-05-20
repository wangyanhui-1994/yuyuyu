import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import { soundRelease, contactUs } from '../utils/domListenEvent';
import { isLogin, loginViewShow } from '../middlewares/loginMiddle';

function releaseInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-release')[$$('.view-main .pages>.page-release').length - 1]);
    const { debug } = config;

    if (!window['addressObj'] || (window['addressObj'] && !window['addressObj']['initCityName'])){
        !debug && nativeEvent.getAddress();
    }

    $$('.service-contact-us').off('click', contactUs).on('click', contactUs);

    // 点击文字发布
    currentPage.find('.release-infomation').click(() => {
        if(!isLogin()){
            f7.alert('您还没登录，请先登录!', '温馨提示', loginViewShow);
            return;
        }
        $$('.release-select-model').addClass('on');
        window.apiCount('btn_text');
    });

    $$('.release-select-model')[0].onclick = (e) => {
        $$('.release-select-model').removeClass('on');
    };

    // 点击语音发布
    currentPage.find('.release-sound')[0].onclick = () => {
        if(!isLogin()){
            f7.alert('您还没登录，请先登录!', '温馨提示', loginViewShow);
            return;
        }
        soundRelease();
        window.apiCount('btn_voice');
    };
}

export {
    releaseInit
};
