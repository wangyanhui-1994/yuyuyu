import {getBusinessLicenseNumber, getName, html} from '../string';

const CustomClass = function (){};
let userUtils = new CustomClass();

userUtils.getAuthenticationText = (enterprise, enterpriseTime, personal, personalTime) => {
    const authenticationBtn = $$('p.user-identity-text');
    let text = '';
    let myCenterText = '';
    0 == personal && (text = '个人认证中');
    1 == personal && (text = '已完成个人认证');
    if (-1 == enterprise){
        -1 == personal && (text = '点击认证');
        2 == personal && (text = '个人认证失败');
    } else if (2 == enterprise){
        -1 == personal && (text = '企业认证失败');
        if (personalTime && enterpriseTime){
            2 == personal && (text = personalTime > enterpriseTime ? '个人认证失败' : '企业认证失败');
        }
    }
    0 == enterprise && (text = '企业认证中');
    1 == enterprise && (text = '已完成企业认证');
    1 == enterprise && (authenticationBtn.addClass('succ'));

    1 == enterprise && (myCenterText = '企业认证');
    1 !== enterprise && 1 == personal && (myCenterText = '个人认证');
    1 !== enterprise && 1 !== personal && (myCenterText = false);

    // edit individual authentication and company authentication popup page.
    const individualStatus = $$('.individual-authentication-status-text>.text');
    const companyStatus = $$('.company-authentication-status-text>.text');
    individualStatus.text((personal == 1 && '审核通过') || (personal == 2 && '审核未通过') || '审核中');
    companyStatus.text((enterprise == 1 && '审核通过') || (enterprise == 2 && '审核未通过') || '审核中');
    if (userUtils.data){
        const {
            name,
            identificationCard,
            personalAuthenticationDescribe,
            enterpriseAuthenticationDescribe,
            personalAuthenticationState,
            enterpriseAuthenticationState,
            enterpriseName,
            businessLicenseNo
        } = userUtils.data;
        personalAuthenticationDescribe && $$('.individual-faild-content').text(personalAuthenticationDescribe);
        enterpriseAuthenticationDescribe && $$('.company-faild-content').text(enterpriseAuthenticationDescribe);

        enterpriseName && $$('.company-authentication-name').text(enterpriseName);
        name && $$('.individual-authentication-name').text(getName(name));
        businessLicenseNo && $$('.company-authentication-number').text(getBusinessLicenseNumber(businessLicenseNo));
        identificationCard && $$('.individual-authentication-number').text(getBusinessLicenseNumber(identificationCard));
        const subPopup = $$('.page-identity-status');
        subPopup.removeClass('individual-review individual-succ individual-faild company-review company-succ company-faild');
        0 == personalAuthenticationState && subPopup.addClass('individual-review');
        1 == personalAuthenticationState && subPopup.addClass('individual-succ');
        2 == personalAuthenticationState && subPopup.addClass('individual-faild');
        0 == enterpriseAuthenticationState && subPopup.addClass('company-review');
        1 == enterpriseAuthenticationState && subPopup.addClass('company-succ');
        2 == enterpriseAuthenticationState && subPopup.addClass('company-faild');
    }

    return {
        text,
        myCenterText
    };
};

userUtils.getBussesInfoCallback = (data) => {
    const authenticationBtn = $$('p.user-identity-text');
    const verificationBtn = $$('span.user-verification-num');
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    // eslint-disable-next-line
    let text = '';
    if (data){
        userUtils.data = data;
        let {
            buyNumber,
            sellNumber,
            certNumber,
            enterpriseAuthenticationState,
            personalAuthenticationState,
            personalAuthenticationTime,
            enterpriseAuthenticationTime,
            registerCount,
            driverRefuseDescribe,
            driverState,
            fishCarDriverId,
            fishCarDemandCount
        } = data;

        buyNumber && html($$('.user-buy-num'), buyNumber, null);
        sellNumber && html($$('.user-sell-num'), sellNumber, null);
        certNumber > -1 && verificationBtn.text(certNumber);
        fishCarDemandCount && currentPage.find('.user-fish-car-num').text(fishCarDemandCount);

        enterpriseAuthenticationState == -1 ? $$('.individual-succ-button').show() : $$('.individual-succ-button').hide();
        personalAuthenticationState == -1 ? $$('.company-succ-button').show() : $$('.company-succ-button').hide();
        1 == personalAuthenticationState && (authenticationBtn.addClass('succ'));
        if (2 == personalAuthenticationState){
            2 == personalAuthenticationState &&
            (text = personalAuthenticationTime > enterpriseAuthenticationTime ? '个人认证失败' : '企业认证失败');
        }
        1 == enterpriseAuthenticationState && (authenticationBtn.addClass('succ'));
        text = userUtils.getAuthenticationText(enterpriseAuthenticationState, enterpriseAuthenticationTime,
            personalAuthenticationState, personalAuthenticationTime)['text'];

        $$('.user-invit>.first').removeClass('invit-numbers');
        registerCount && $$('.user-invit>.first').addClass('invit-numbers');
        $$('.user-invite-num').text(`已邀请${registerCount}人`);
        // $$('.user-go-invite-page').addClass('show');
        // text && authenticationBtn.text(text);
        /**
         * 判断是司机用户
         */
        if (fishCarDriverId){
            currentPage.find('.user-info-driver-check').removeClass('check reject edit');
            currentPage.find('.user-fish-car-driver').hide();
            currentPage.find('.user-info-driver-check').attr('data-id', fishCarDriverId);
            if (0 == driverState){
                currentPage.find('.user-info-driver-check').addClass('check');
            }

            if (1 == driverState || 3 == driverState){
                currentPage.find('.user-info-driver-check').addClass('edit');
                currentPage.find('.user-fish-car-driver').hide();
                if (1 == driverState){
                    currentPage.find('.driver-edit').attr('data-id', fishCarDriverId);
                    currentPage.find('.edit-fish-car-info').removeClass('hide').attr('href', `views/postDriverAuth.html?id=${fishCarDriverId}`);
                }
                3 == driverState && currentPage.find('.driver-edit').removeAttr('data-id');
            }

            if (2 == driverState){
                currentPage.find('.user-info-driver-check').addClass('reject');
                currentPage.find('.driver-reject').attr('data-message', driverRefuseDescribe);
            }
            currentPage.find('.user-invit').children('div').eq(1).addClass('border-none');
        } else {
            currentPage.find('.user-invit').children('div').eq(1).removeClass('border-none');
            currentPage.find('.user-fish-car-driver').css({
                display: '-webkit-box'
            });
        }
    }
};

export default userUtils;
