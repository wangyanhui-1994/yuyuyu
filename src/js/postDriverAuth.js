import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import { trim } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function postDriverAuthInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-post-driver-auth')[$$('.view-main .pages>.page-post-driver-auth').length - 1]);
    const $navbar = $$('.view-main .navbar-inner:last-child');
    const {id} = page.query;
    const {identity} = config;
    const {androidChrome} = window.currentDevice;

    /**
     * 工龄选择框绑定
     * */
    let workInitObj = {
        input: currentPage.find('.post-driver-age'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年',
                    '11年', '12年', '13年', '14年', '15年', '16年', '17年', '18年', '19年', '20年']
            }
        ]
    };

    /**
     * 车队选择框绑定
     * */
    let carTeamInitObj = {
        input: currentPage.find('.post-driver-team'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        // value: [defaultTeam || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['是', '否']
            }
        ]
    };

    /**
     * 如果存在id，则是修改，反则是新增申请
     * 填满返回的信息
     * */
    if(!id){
        f7.hideIndicator();
        f7.picker(workInitObj);
        f7.picker(carTeamInitObj);
    }else{
        /**
         * 获取司机信息详情
         * */
        const callback = (data) => {
            const {code, message} = data;
            if(1 == code){
                window.driverData = data.data;
                const {
                    nickName,
                    phone,
                    workingAge,
                    hasTeam,
                    drivingLicence
                } = data.data;
                currentPage.find('.post-driver-name').val(nickName);
                currentPage.find('.post-driver-phone').val(phone);

                workInitObj.value = [`${workingAge}年`];
                carTeamInitObj.value = [hasTeam ? '是' : '否'];
                f7.picker(workInitObj);
                f7.picker(carTeamInitObj);

                currentPage.find('.post-box').children('.left').find('div').html('<p>身份证已经上传过了，不允许修改！</p>');
                currentPage.find('.post-box').children('.right').find('div').html(`<img src="${drivingLicence}${identity['individual']}" />`);
            }else{
                console.log(message);
            }
            f7.hideIndicator();
        };

        customAjax.ajax({
            apiCategory: 'fishCarDrivers',
            data: [id],
            val: {
                id
            },
            type: 'get'
        }, callback);
        $navbar.find('.center').text('修改司机信息');
    }

    /**
     * 点击上传身份证
     * */
    currentPage.find('.post-box').children('.left')[0].onclick = () => {
        if(id){
            return;
        }
        nativeEvent.postPic(0, '');
    };

    /**
     * 点击上传驾照
     * */
    currentPage.find('.post-box').children('.right')[0].onclick = () => {
        nativeEvent.postPic(5, '', 'jiazhao', 'postDriverFileCallback');
    };

    /**
     * 点击下一步效验
     * */
    currentPage.find('.next-btn')[0].onclick = () => {
        const name = trim(currentPage.find('.post-driver-name').val());
        const phone = trim(currentPage.find('.post-driver-phone').val());
        const age = trim(currentPage.find('.post-driver-age').val());
        const team = trim(currentPage.find('.post-driver-team').val());
        let errors = '';
        const len = currentPage.find('.post-box').children().find('img').length;
        if((!id && 2 !== len) || (id && !len)){
            errors = '请上传完整的证件照片！';
        }

        if(!team){
            errors = '请选择是否有车队！';
        }

        if(!age){
            errors = '请选择运鱼的工龄！';
        }

        if(!phone || phone.length != 11){
            errors = '请填写正确的手机号码！';
        }

        if(!name){
            errors = '请填写您的真实姓名！';
        }

        if(errors){
            f7.alert(errors, '温馨提示');
            return;
        }
        window.authObj = {
            name,
            phone,
            age,
            team,
            authUrl: id ? '' : currentPage.find('.post-box').children('.left').find('img').eq(0).attr('src').split('@')[0],
            driverUrl: currentPage.find('.post-box').children('.right').find('img').eq(0).attr('src').split('@')[0]
        };
        view.router.load({
            url: `views/postDriverInfo.html?id=${id || ''}`
        });
    };
}

export {
    postDriverAuthInit
};
