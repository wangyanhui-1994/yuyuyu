import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import releaseFishCarTripModel from './model/ReleaseFishCarTripModel';
import {
    getProvinceList,
    getProvinceId
} from '../utils/string';
import {getBeforedawnTime} from '../utils/time';

function releaseFishCarTripInit (f7, view, page){
    f7.hideIndicator();
    let departureProvinceList = getProvinceList();
    let destinationProvinceList = getProvinceList();
    destinationProvinceList.unshift('全国');

    const $currentPage = $$($$('.view-release-fish .pages>.page-release-fish-car-trip')[$$('.view-release-fish .pages>.page-release-fish-car-trip').length - 1]);
    const $description = $currentPage.find('.release-discription').children();
    const $date = $currentPage.find('.select-date-box').children('input');
    const $departure = $currentPage.find('.release-departure').children('input');
    const $destination = $currentPage.find('.release-destination').children('input');

    if (!isLogin()){
        f7.alert('登录后才能发布需求，请您先登录！', '温馨提示', () => {
            loginViewShow();
            window.mainView.router.back();
        });
        return;
    }

    /**
     * 出发地选择
     * */
    f7.picker({
        input: $currentPage.find('.release-departure').children('input'),
        rotateEffect: true,
        toolbarCloseText: '确定',
        cols: [
            {
                textAlign: 'center',
                values: departureProvinceList
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
        cols: [
            {
                textAlign: 'center',
                values: destinationProvinceList
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

    $currentPage.find('.toolbar-inner').children('a')[0].onclick = () => {
        const description = $description.val() || '';
        const appointedTime = $date.val();
        const departureProvinceName = $departure.val();
        const destinationProvinceName = $destination.val();

        let error = '';
        if(description.length > 50){
            error = '补充说明最多只能输入50个字符!';
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

        function callback (res){
            const {code, message, data} = res;
            if (1 == code){
                nativeEvent.nativeToast('1', '发布成功！');
                const {
                    appointedDate,
                    contactName,
                    departureProvinceName,
                    destinationProvinceName,
                    id
                } = data;
                window.releaseView.router.load({
                    url: 'views/releaseFishCarDemandSuccess.html',
                    query: {
                        isDriver: true,
                        date: appointedDate,
                        contactName,
                        departureProvinceName,
                        destinationProvinceName,
                        id
                    }
                });
            } else {
                f7.alert(message);
            }
        }

        releaseFishCarTripModel.post({
            appointedTime: new Date(`2017/${appointedTime.replace('月', '/').replace('日', '')}`).getTime() * 0.001,
            departureProvinceId: getProvinceId(departureProvinceName)['provinceId'],
            departureProvinceName,
            description,
            destinationProvinceId: getProvinceId(destinationProvinceName)['provinceId'],
            destinationProvinceName
        }, {}, callback);
    };
}

export {
    releaseFishCarTripInit
};
