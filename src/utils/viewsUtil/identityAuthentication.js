import customAjax from '../../middlewares/customAjax';
import Framework7 from '../../js/lib/framework7';

const f7 = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});

class CustomClass{
    callback (data){
        const { code, message } = data;
        f7.alert(1 == code ? '上传成功' : message, '提示', () => {
            1 == code && window.mainView.router.load({
                url: 'views/user.html',
                reload: true
            });
        });
    }
        // Submit individual infomation to server.
    subCardInfo (){
        const identityClasses = $$('.identity-infomation').attr('class');
        let individualPass = false;
        let individualSrcArr = [];
        if (identityClasses.indexOf('company') > -1){
            // post company identity;
            let companyUrl = $$('.identity-company-pic img').attr('src');
            if (!companyUrl){
                this.f7.alert('请按要求上传营业执照正本照', '温馨提示');
                return;
            }
            companyUrl = companyUrl.split('@')[0];
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updateEnterpriseUserInfo',
                header: ['token'],
                // paramsType: 'application/json',
                data: [companyUrl],
                type: 'post',
                noCache: true
            }, this.callback);
        } else {
            // post individual identity;
            individualPass = true;
            $$.each($$('.identity-individual-pic img'), (index, item) => {
                const imgSrc = $$('.identity-individual-pic img').eq(index).attr('src');
                individualSrcArr[index] = imgSrc && imgSrc.split('@')[0];
                !imgSrc && (individualPass = false);
            });
            if (!individualPass){
                this.f7.alert('请按要求上传三张证件照', '温馨提示');
                return;
            }
            $$('.identity-submit>.identity-submit-btn').addClass('pass individual-pass');
            customAjax.ajax({
                apiCategory: 'userInfo',
                api: 'updatePersonalUserInfo',
                header: ['token'],
                // paramsType: 'application/json',
                data: individualSrcArr,
                type: 'post',
                noCache: true
            }, this.callback);
        }
    }

    init (f){
        this.f7 = f;
    }
}

const identityAuthenticationUtils = new CustomClass();
export default identityAuthenticationUtils;
