import Framework7 from '../js/lib/framework7';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from './nativeEvent';
import config from '../config';
import store from './localStorage';
import customAjax from '../middlewares/customAjax';
import {alertTitleText} from '../utils/string';

const f7 = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});
const {servicePhoneNumber} = config;
module.exports = {
    detailClickTip: () => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        const lastHeader = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
        var popoverHTML = '<div class="popover detail-right-more" style="width:35%">' +
            '<div class="popover-inner">' +
            '<div class="list-block">' +
            '<ul>' +
            '<li><a href="#" class="item-link list-button" data-id="1">有奖转发</a></li>' +
            '<li><a href="#" class="item-link list-button" data-id="2">举报</a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        f7.popover(popoverHTML, lastHeader.find('span.iconfont'));
        const detailMoreEvent = (e) => {
            const dataId = e.target.getAttribute('data-id');
            if (1 == dataId){
                f7.closeModal('.detail-right-more');
                window.apiCount('btn_info_nav_more_share');
                setTimeout(() => {
                    currentPage.find('div.icon-share').trigger('click');
                }, 500);
            } else if (2 == dataId){
                window.apiCount('btn_infonav_more_report');
                f7.closeModal('.detail-right-more');
                f7.confirm('你确定举报该用户吗？', '举报虚假信息', () => {
                    f7.alert('举报成功！');
                });
            }
        };
        $$('.detail-right-more').off('click', detailMoreEvent).on('click', detailMoreEvent);
    },

    otherIndexClickTip: () => {
        f7.confirm('你确定举报该用户吗？', '举报虚假信息', () => {
            f7.alert('举报成功！');
        });
    },

    goHome: () => {
        window.mainView.router.load({
            url: 'views/homeBuy.html',
            reload: true
        });
    },

    goUser: () => {
        window.mainView.router.load({
            url: 'views/user.html',
            reload: true
        });
    },
    goMyCenter: () => {
        if (isLogin()){
            window.mainView.router.load({
                url: 'views/myCenter.html'
            });
        } else {
            loginViewShow();
        }
    },

    myListBuy: (isHome) => {
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.apiCount(isHome ? 'btn_home_myPurchase' : 'btn_mysell');
            window.mainView.router.load({
                url: 'views/myList.html?type=1'
            });
        }
    },

    myListSell: () => {
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.apiCount('btn_mypurchase');
            window.mainView.router.load({
                url: 'views/myList.html?type=2'
            });
        }
    },

    uploadCert: () => {
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.apiCount('btn_certification');
            window.mainView.router.load({
                url: 'views/fishCert.html'
            });
        }
    },

    identifyFish: () => {
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.mainView.router.load({
                url: 'views/fishIdentification.html'
            });
        }
    },

    goIdentity: () => {
        const {cacheUserInfoKey} = config;
        let personalAuthenticationState, enterpriseAuthenticationState;
        let userInfomation = store.get(cacheUserInfoKey);
        if (userInfomation){
            personalAuthenticationState = userInfomation['personalAuthenticationState'];
            enterpriseAuthenticationState = userInfomation['enterpriseAuthenticationState'];
        }
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.apiCount('btn_identity');
            const url = (-1 == personalAuthenticationState && -1 == enterpriseAuthenticationState)
                ? 'views/identityAuthentication.html' : 'views/catIdentityStatus.html';
            window.mainView.router.load({
                url
            });
        }

    },

    contactUs: () => {
        window.apiCount('btn_contact');
        nativeEvent.contactUs(servicePhoneNumber);
    },

    cancleIndividual: () => {
        const cancleIndividualCallback = (data) => {
            const {code, message} = data;
            if(1 == code){
                $$('page-identity-status').removeClass('individual-review');
                window.mainView.router.load({
                    url: 'views/user.html',
                    reload: true
                });
            }else{
                console.log(message);
            }
        };
        f7.confirm('你确定撤销身份认证审核吗？', '撤销审核', () => {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'cancelPersonalAuthentication',
                header: ['token'],
                paramsType: 'application/json',
                data: [],
                type: 'post',
                noCache: true
            }, cancleIndividualCallback);
        });
    },

    canclCompany: () => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        const cancleCompanyCallback = (data) => {
            currentPage.find('page-identity-status').removeClass('company-review');
            window.mainView.router.load({
                url: 'views/user.html',
                reload: true
            });
        };
        f7.confirm('你确定撤销企业认证审核吗？', '撤销审核', () => {
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'cancelEnterpriseAuthentication',
                header: ['token'],
                paramsType: 'application/json',
                data: [],
                type: 'post',
                noCache: true
            }, cancleCompanyCallback);
        });
    },

    fishCertAction: (e) => {
        const event = e || window.event;
        const ele = event.target;
        let classes = ele.className;
        const id = $$(ele).attr('data-id');

        const deleteCallback = (data) => {
            const {code, message} = data;
            if (1 == code){
                $$('.fish-cert-list>.col-50').length == 1 && $$('.fish-cert-content').removeClass('show');
                window.mainView.router.refreshPage();
                $$('span.user-verification-num').text($$('.fish-cert-list>.col-50').length);
                f7.hideIndicator();
            } else {
                f7.alert(message, '提示');
            }

        };

        if (classes.indexOf('cat-cert-faild-info') > -1){
            const info = $$(ele).attr('data-info');
            f7.alert(info, '未通过原因');
        } else if (classes.indexOf('fish-cert-delete') > -1){
            const sureCallback = () => {
                f7.showIndicator();
                customAjax.ajax({
                    apiCategory: 'userInfo',
                    header: ['token'],
                    // paramsType: 'application/json',
                    api: 'deleteUserFishCertificate',
                    data: [id],
                    val: {id},
                    type: 'post'
                }, deleteCallback);
            };

            f7.confirm('确定删除？', '删除证书', sureCallback);
        } else if (classes.indexOf('fish-cert-reupload') > -1){
            nativeEvent.postPic(-1, id);
        } else if (ele.tagName == 'IMG'){
            const url = ele.getAttribute('src').split('@')[0];
            window.apiCount('cell_certificate');
            nativeEvent.catPic(url);
        }
    },

    veiwCert: (e) => {
        window.apiCount('cell_profile_certificate');
        const ele = e.target || window.event;
        const classes = ele.className;
        if (classes.indexOf('open-cert-button') > -1){
            const url = $$(ele).attr('data-url');
            nativeEvent.catPic(url);
        }
    },

    soundRelease: () => {
        nativeEvent.releaseVoiceInfo();
    },

    inviteFriends: () => {
        if (!isLogin()){
            f7.alert(alertTitleText(), '温馨提示', loginViewShow);
        } else {
            window.apiCount('btn_myCenter_inviteFriends');
            window.mainView.router.load({
                url: 'views/inviteFriends.html'
            });
        }
    }
};
