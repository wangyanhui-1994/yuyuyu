import store from '../utils/localStorage';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';
import { getName, getBusinessLicenseNumber } from '../utils/string';

function otherInfoInit (f7, view, page){
    const { id, goodsId } = page.query;
    const userCache = store.get(`getDemandInfo_id_${goodsId}`);
    const currentPage = $$($$('.view-main .pages>.page-other-info')[$$('.view-main .pages>.page-other-info').length - 1]);

    const { imgPath, mWebUrl } = config;
    const editCallback = (data) => {
        const { userInfo } = userCache && userCache['data'] || data['data'];
        const {
            identificationCard,
            phone,
            enterpriseAuthenticationState,
            personalAuthenticationState,
            name,
            nickname,
            imgUrl,
            address,
            enterpriseName,
            businessLicenseNo,
            businessLicenseUrl,
            level
        } = userInfo;

        imgUrl && ($$('.page-other-info .center-head-pic img').attr('src', imgUrl + imgPath(8)));
        nickname && $$('.page-other-info .my-center-nice-name>span').text(nickname);
        $$('.page-other-info .my-center-nice-name>i').addClass(`iconfont icon-v${level || 0}`);
        phone && $$('.other-info-phone').text(phone);
        address ? $$('.other-info-address').text(address) : $$('.other-info-address-parent').hide();

        if (enterpriseAuthenticationState == 1){
            $$('.other-authentication-info').addClass('company');
            $$('.other-cert-text>span').text('企业认证');
            enterpriseName && $$('.other-campany-name').text(enterpriseName);
            businessLicenseNo && $$('.other-company-number').text(getBusinessLicenseNumber(businessLicenseNo));
            $$('.other-cat-company-info').on('click', () => {
                nativeEvent.catPic(businessLicenseUrl);
            });
        } else if (personalAuthenticationState == 1){
            $$('.other-authentication-info').addClass('individual');
            name && $$('.other-info-name').text(getName(name));
            identificationCard && $$('.other-info-number').text(getBusinessLicenseNumber(identificationCard));
        }
        f7.hideIndicator();
    };

    currentPage.find('.go-member-info')[0].onclick = () => {
        window.apiCount('btn_profile_memberIntro');
        nativeEvent['goNewWindow'](`${mWebUrl}user/memberIntro`);
    };
    if (!userCache){
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'getUserCertificate',
            data: [id],
            type: 'get',
            val: { id }
        }, editCallback);
    } else {
        editCallback(userCache);
    }

}

export {
    otherInfoInit
};
