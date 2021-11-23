import config from '../config';
import {getFishTankName } from '../utils/string';
import {fishCarActiveTime} from '../utils/time';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';
import {driverDemeandInfo} from '../utils/template';

function driverDemandInfoInit (f7, view, page){
    const {id} = page.query;
    const currentPage = $$($$('.view-main .pages>.page-driver-demand-info')[$$('.view-main .pages>.page-driver-demand-info').length - 1]);
    if(!id){
        return;
    }
    const {imgPath} = config;
    let contactPhone;
    window.apiCount('btn_fishcar_driverCell');
    /**
     * 获取司机详情后render出来
     * */
    function callback (data){
        const {code, message} = data;
        if(1 == code){
            const {
                contactName,
                phone,
                workingAge,
                hasTeam,
                fishTankMaterial,
                fishTankSize,
                fishTankBoxCount,
                auxiliaryList,
                headImgUrl,
                lastLoginTime,
                routineList,
                drivingLicence,
                roadTransportCertificate,
                roadTransportQualificationCertificate
            } = data.data;

            contactPhone = phone;
            currentPage.find('.driver-name').text(contactName);
            currentPage.find('.driver-other-info').text(`${workingAge}年经验${hasTeam ? '、有车队' : ''}`);
            currentPage.find('.head-tell').attr('data-phone', phone);
            currentPage.find('.time-desc').text(fishCarActiveTime(lastLoginTime).replace('来过', '活跃'));
            let addressStr = '常去的地区: ';
            routineList && routineList.length && $$.each(routineList, (index, item) => {
                addressStr += item.provinceName;
                index < (routineList.length - 1) && (addressStr += '，');
            });
            (addressStr !== '常去的地区: ') ? currentPage.find('.driver-info-address').text(addressStr).show()
                : currentPage.find('.driver-info-address').hide();

            let authCertStr = '';
            drivingLicence && (authCertStr += '驾驶证');
            roadTransportQualificationCertificate && (authCertStr += '、道路运输从业资格证');
            roadTransportCertificate && (authCertStr += '、道路运输证');
            currentPage.find('.driver-info-tip').children('b').text(authCertStr);

            /**
             * render路线
             * */
            // let str = '';
            // if(!routineList.length){
            //     str += fishCar.selectAddress(-1, '全国');
            // }else{
            //     $$.each(routineList, (index, item) => {
            //         const text = (item.departureProvinceName == item.destinationProvinceName) ?
            //                         `${item.destinationProvinceName}内` :
            //                         `${item.departureProvinceName}-${item.destinationProvinceName}`;
            //         str += fishCar.selectAddress(index, text);
            //     })
            // }
            // currentPage.find('.driver-info-address').html(str);

            /**
             * render鱼车信息
             * */
            currentPage.find('.info-title').eq(0).text(getFishTankName(fishTankMaterial));
            currentPage.find('.info-title').eq(1).text(`${fishTankSize}方`);
            currentPage.find('.info-title').eq(2).text(`${fishTankBoxCount}`);

            /**
             * render鱼车辅助设备
             * */
            if(auxiliaryList.length){
                currentPage.find('.driver-info-device-list').html(driverDemeandInfo.device(auxiliaryList));
                currentPage.find('.driver-info-device-list').parent().show();
            }else{
                currentPage.find('.driver-info-device-list').parent().hide();
            }

            /**
             * render司机头像
             * */
            if(headImgUrl){
                currentPage.find('.driver-head-img').attr('src', `${headImgUrl}${imgPath(8)}`);
            }

        }else{
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
    }

    function getDriverInfo (isMandatory){
        customAjax.ajax({
            apiCategory: 'fishCarDrivers',
            data: [id],
            val: {
                id
            },
            type: 'get',
            isMandatory
        }, callback);
    }
    getDriverInfo(false);

    /**
     * 下拉刷新
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', () => {
        getDriverInfo(nativeEvent.getNetworkStatus());
    });

    /**
     * 拨打电话
     * */
    currentPage.find('.release-sub-info')[0].onclick = () => {
        if(contactPhone){
            window.apiCount('btn_fishcar_driverDetail_call');
            nativeEvent.contactUs(contactPhone);
        }
    };
}

export {
    driverDemandInfoInit
};
