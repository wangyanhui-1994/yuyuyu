import nativeEvent from '../utils/nativeEvent';
import identityAuthenticationUtils from '../utils/viewsUtil/identityAuthentication';
import store from '../utils/localStorage';
import config from '../config';
import { isLogin } from '../middlewares/loginMiddle';

function identityAuthenticationInit (f7, view, page){
    f7.hideIndicator();
    if (!isLogin()){
        nativeEvent['nativeToast'](0, '您还没有登录，请先登录!');
        window.mainView.router.load({
            url: 'views/login.html'
        });
        return;
    }
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const individualBtn = currentPage.find('.identity-individual');
    const companyBtn = currentPage.find('.identity-company');
    const certBox = currentPage.find('.identity-infomation');
    const authenticationDemo = currentPage.find('.identity-pic-demo');
    const subBtn = currentPage.find('.identity-submit-btn');
    const { cacheUserInfoKey } = config;
    const {
        enterpriseAuthenticationState,
        personalAuthenticationState
    } = store.get(cacheUserInfoKey);

    // eslint-disable-next-line
    let individualType = 0;
    identityAuthenticationUtils.init(f7);

    /*
     * identity individual doing.
     */
    // select identity individual.
    individualBtn[0].onclick = () => {
        if (1 == personalAuthenticationState){
            return;
        }
        individualType = 1;
        currentPage.find('.identity-select-type').find('.col-50').removeClass('active');
        individualBtn.addClass('active');
        certBox.addClass('individual').removeClass('company');
        authenticationDemo.addClass('show');
        subBtn.hasClass('individual-pass') ? subBtn.addClass('pass') : subBtn.removeClass('pass');
    };
    $$.each(currentPage.find('.identity-individual-pic').children('div'), (index, item) => {
        $$(item).on('click', () => {
            nativeEvent.postPic(index, '');
        });
    });

    /*
     * identity company doing.
     */
    // select identity company.
    companyBtn[0].onclick = () => {
        if (1 == enterpriseAuthenticationState){
            return;
        }
        individualType = 2;
        currentPage.find('.identity-select-type').find('.col-50').removeClass('active');
        companyBtn.addClass('active');
        certBox.addClass('company').removeClass('individual');
        authenticationDemo.removeClass('show');
        subBtn.hasClass('company-pass') ? subBtn.addClass('pass') : subBtn.removeClass('pass');
    };

    currentPage.find('.identity-company-pic').children('div').on('click', () => {
        nativeEvent.postPic(3, '');
    });

    // click submit set ajax.
    currentPage.find('.identity-submit').children('a').on('click', () => {
        // const classes = $$('.identity-submit>a').attr('class');
        identityAuthenticationUtils.subCardInfo();
    });

    if (enterpriseAuthenticationState == 1){
        currentPage.find('.identity-company').children('p').eq(1).text('已认证');
        individualBtn.addClass('active');
        certBox.addClass('individual').removeClass('company');
        authenticationDemo.addClass('show');
    } else if (personalAuthenticationState == 1){
        currentPage.find('.identity-individual').children('p').eq(1).text('已认证');
        companyBtn.addClass('active');
        certBox.addClass('company').removeClass('individual');
    }

}

export {
    identityAuthenticationInit
};
