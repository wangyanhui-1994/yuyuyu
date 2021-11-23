import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import config from '../config';
import store from '../utils/localStorage';
import releaseFishCarDemandModel from './model/ReleaseFishCarDemandModel';
import {
    getProvinceCityArr,
    getProvinceList,
    getProvinceId
} from '../utils/string';
import {getBeforedawnTime} from '../utils/time';

function releaseFishCarDemandInit (f7, view, page){
    f7.hideIndicator();
    const {cacheUserInfoKey} = config;
    let destinationProvinceList = getProvinceList();
    let provinceCityList = getProvinceCityArr();

    const $currentPage = $$($$('.view-release-fish .pages>.page-release-fish-car-demand')[$$('.view-release-fish .pages>.page-release-fish-car-demand').length - 1]);
    const $phone = $currentPage.find('.contact-phone').children('input');
    const $nickname = $currentPage.find('.contact-nickname').children('input');
    const $description = $currentPage.find('.release-discription').children();
    const $date = $currentPage.find('.select-date-box').children('input');
    const $departure = $currentPage.find('.release-departure').children('input');
    const $destination = $currentPage.find('.release-destination').children('input');
    const $fishName = $currentPage.find('.demand-fish-name').children('input');
    const $fishNumber = $currentPage.find('.demand-fish-number').children('input');

    if (!isLogin()){
        f7.alert('登录后才能发布需求，请您先登录！', '温馨提示', () => {
            loginViewShow();
            window.mainView.router.back();
        });
        return;
    }

    const userInfo = store.get(cacheUserInfoKey);
    if(userInfo){
        const {loginName, nickname} = userInfo;
        loginName && $phone.val(loginName);
        nickname && $nickname.val(nickname);
    }

    /**
     * 出发地选择
     * */
    f7.picker({
        input: $currentPage.find('.release-departure').children('input'),
        rotateEffect: true,
        toolbarCloseText: '确定',
        formatValue: function (picker, values){
            return values[0] + ' ' + values[1];
        },
        cols: [
            {
                textAlign: 'center',
                values: destinationProvinceList,
                onChange: (picker, country) => {
                    if(picker.cols[1].replaceValues){
                        picker.cols[1].replaceValues(provinceCityList[country]);
                    }
                }
            },
            {
                values: provinceCityList[destinationProvinceList[0]],
                width: 160
            }
        ]
    });

    /**
     * 目的地选择
     * */
    f7.picker({
        input: $currentPage.find('.release-destination').children('input'),
        rotateEffect: true,
        toolbarCloseText: '确定',
        formatValue: function (picker, values){
            return values[0] + ' ' + values[1];
        },
        cols: [
            {
                textAlign: 'center',
                values: destinationProvinceList,
                onChange: (picker, country) => {
                    if(picker.cols[1].replaceValues){
                        picker.cols[1].replaceValues(provinceCityList[country]);
                    }
                }
            },
            {
                values: provinceCityList[destinationProvinceList[0]],
                width: 160
            }
        ]
    });

    /**
     * 选择日期
     * */
    const today = new Date();
    const getData = () => {
        let arr = [];
        let defaultArr = [];
        for(let i = 1;i < 32;i++){
            arr.push(i);
            defaultArr.push(`${i}日`);
        }
        return {
            arr,
            defaultArr
        };
    };
    // const getYears = () => {
    //     let years = [];
    //     let defaultYears = [];
    //     for(let i=1950;i<2030;i++){
    //         years.push(i);
    //         defaultYears.push(`${i}年`);
    //     }
    //     return {
    //         years,
    //         defaultYears
    //     }
    // };

    f7.picker({
        input: $currentPage.find('.select-date-box').children('input'),
        rotateEffect: true,
        toolbarCloseText: '确定',
        // value: [today.getFullYear(), today.getMonth(),today.getDate()],
        value: [today.getMonth() + 1, today.getDate()],
        onChange: function (picker, values, displayValues){
            var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
            if (values[1] > daysInMonth){
                picker.cols[1].setValue(daysInMonth);
            }
        },
        formatValue: function (p, values, displayValues){
            return values[0] + '月' + values[1] + '日';
        },
        cols: [
            // Years
            // {
            //     values: getYears().years,
            //     displayValues: getYears().defaultYears
            // },
            // Months
            {
                values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
                displayValues: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' '),
                textAlign: 'left'
            },
            // Days
            {
                values: getData().arr,
                displayValues: getData().defaultArr
            }
        ]
    });

    const loginName = store.get(cacheUserInfoKey) ? store.get(cacheUserInfoKey)['loginName'] : '';
    $currentPage.find('.release-phone').text(loginName);

    $currentPage.find('.toolbar-inner').children('a')[0].onclick = () => {
        const description = $description.val() || '';
        const appointedTime = $date.val();
        const departureProvinceName = $departure.val();
        const destinationProvinceName = $destination.val();
        const fishType = $fishName.val() || '';
        const quality = $fishNumber.val() || '';
        const contactName = $nickname.val();
        const contactPhone = $phone.val();

        let error = '';
        if(description.length > 50){
            error = '补充说明最多只能输入50个字符!';
        }
        if(!contactName){
            error = '请填写联系姓名!';
        }
        if(contactName && contactName.length > 8){
            error = '联系人姓名最大长度为8位字符!';
        }
        if(!contactPhone || contactPhone.length !== 11){
            error = '请填写正确的手机号!';
        }
        if(destinationProvinceName == departureProvinceName){
            error = '出发地和目的地不能相同!';
        }
        if(!destinationProvinceName){
            error = '请选择目的地!';
        }
        if(!departureProvinceName){
            error = '请选择出发地!';
        }
        if(!appointedTime){
            error = '请选择出发时间!';
        }else{
            const selectTime = `2017/${appointedTime.replace('月', '/').replace('日', '')}`;
            if(new Date(selectTime).getTime() < new Date(getBeforedawnTime()).getTime()){
                error = '请选择今日之后的日期!';
            }
        }

        if(error){
            f7.alert(error);
            return;
        }

        function callback (data){
            const {code, message} = data;
            if (1 == code){
                nativeEvent.nativeToast('1', '发布成功！');
                window.releaseView.router.load({
                    url: 'views/releaseFishCarDemandSuccess.html'
                });
            } else {
                f7.alert(message);
            }
        }

        releaseFishCarDemandModel.post({
            appointedTime: new Date(`2017/${appointedTime.replace('月', '/').replace('日', '')}`).getTime() * 0.001,
            contactName,
            contactPhone,
            departureProvinceId: getProvinceId(departureProvinceName.split(' ')[0], departureProvinceName.split(' ')[1])['provinceId'],
            departureCityId: getProvinceId(departureProvinceName.split(' ')[0], departureProvinceName.split(' ')[1])['cityId'],
            departureProvinceName: departureProvinceName.split(' ')[0],
            departureCityName: departureProvinceName.split(' ')[1],
            description,
            destinationProvinceId: getProvinceId(destinationProvinceName.split(' ')[0], destinationProvinceName.split(' ')[1])['provinceId'],
            destinationCityId: getProvinceId(destinationProvinceName.split(' ')[0], destinationProvinceName.split(' ')[1])['cityId'],
            destinationProvinceName: destinationProvinceName.split(' ')[0],
            destinationCityName: destinationProvinceName.split(' ')[1],
            fishType,
            quality
        }, {
            apiVersion: 2
        }, callback);
    };
}

export {
    releaseFishCarDemandInit
};
