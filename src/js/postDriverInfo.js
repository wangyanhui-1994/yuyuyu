import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {
    trim,
    getFishTankId,
    getOxygenTankId,
    getProvinceId,
    getFishTankName,
    getOxygenTankName,
    getProvinceList,
    getCreateDriverListLabel
} from '../utils/string';
import {fishCar} from '../utils/template';
import customAjax from '../middlewares/customAjax';

function postDriverInfoInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-post-driver-info')[$$('.view-main .pages>.page-post-driver-info').length - 1]);
    const {id} = page.query;
    const {identity} = config;
    const {androidChrome} = window.currentDevice;

    /**
     * 路线范围选择
     * */
    // f7.picker({
    //     input: currentPage.find('.post-driver-select-address'),
    //     toolbarCloseText: '确定',
    //     rotateEffect: true,
    //     // value: [selectedAddress || ''],
    //     cols: [
    //         {
    //             textAlign: 'center',
    //             values: ['全国', '多条路线']
    //         }
    //     ],
    //     onChange: (a,b) => {
    //         if('全国' != b[0]){
    //             currentPage.find('.add-address-click-box').show();
    //         }else{
    //             currentPage.find('.add-address-click-box').hide();
    //         }
    //     }
    // });

    /**
     * 添加路线
     * 编辑路线，存入点击的index
     * */
    let addressInitObj = {
        input: currentPage.find('.add-address-click-box').children('input'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cssClass: 'post-fish-car-driver',
        onOpen: (p) => {
            $$('.post-fish-car-driver .close-picker').click(() => {
                const val = p.value[0];
                const length = currentPage.find('.post-select-address').length;
                if (currentPage.find('.post-select-address').length < 5){
                    currentPage.find('.address-list').append(fishCar.selectAddress(length, val));
                    currentPage.find('.add-address-click-box').css({display: '-webkit-flex'});
                }
                5 == currentPage.find('.post-select-address').length &&
                 currentPage.find('.add-address-click-box').hide();
            });
        },
        cols: [
            {
                textAlign: 'center',
                values: getProvinceList()
            }
        ]
    };

    const sortList = () => {
        const len = currentPage.find('.post-select-address').length;
        len && $$.each(currentPage.find('.post-select-address'), (index, item) => {
            $$(item).find('.item-title').text(`地区${getCreateDriverListLabel(index)}`);
        });
    };

    currentPage.find('.address-list').click((e) => {
        const ele = e.target || window.event.target;
        if ($$(ele).hasClass('post-driver-name')){
            f7.confirm('您确定要删除这条地区吗?', '删除地区', () => {
                const len = currentPage.find('.post-select-address').length;
                if (5 == len){
                    currentPage.find('.add-address-click-box').css({
                        display: '-webkit-flex'
                    });
                }
                $$(ele).parents('.post-select-address').remove();
                sortList();
            }, () => {
            });
        }

    });

    // currentPage.find('.post-driver-select')[0].onclick = (e) => {
    //     const ele = e.target || window.event.target;
    //     //添加路线，弹出model
    //     if($$(ele).hasClass('add-item-btn')){
    //         $$('.edit-driver-address-model').addClass('add');
    //
    //
    //         return;
    //     }
    //
    //     if((!(ele.tagName == 'INPUT' && !$$(ele).hasClass('post-driver-select-address')))){
    //         return;
    //     }
    //     window.addressIndex = Number($$(ele).parent().prev().attr('data-index'));
    //     $$('.edit-driver-address-model').addClass('edit');
    // };

    /**
     * 鱼罐方数选择
     * */
    let fishCarSizeInitObj = {
        input: currentPage.find('.post-driver-fish-box-size'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
         // value: [selectedFishTankSize || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['1方', '2方', '3方', '4方', '5方', '6方',
                    '7方', '8方', '9方', '10方', '11方', '12方',
                    '13方', '14方', '15方', '16方', '17方', '18方', '19方', '20方']
            }
        ]
    };

    /**
     * 分箱数选择
     * */
    let fishCarBoxSizeInitObj = {
        input: currentPage.find('.post-driver-fish-box-number'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
         // value: [selectFishTankNumber || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['1个', '2个', '3个', '4个', '5个', '6个',
                    '7个', '8个', '9个', '10个']
            }
        ]
    };

    /**
     * 点击上传从业资格证
     * */
    currentPage.find('.post-box').children('.left')[0].onclick = () => {
        nativeEvent.postPic(5, '', 'roadTransportQualificationCertificate', 'postDriverRoadTransportFileCallback');
    };

    /**
     * 点击上传运输证
     * */
    currentPage.find('.post-box').children('.right')[0].onclick = () => {
        nativeEvent.postPic(5, '', 'transportCertificate', 'postDriverTransportCertificateFileCallback');
    };

    /**
     * 鱼罐材质选择
     * */
    let fishCarTankInitObj = {
        input: currentPage.find('.post-driver-fish-box'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
         // value: [selectedFishTankMaterial || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['玻璃钢', '塑胶', '不锈钢', '白铁', '铁', '铝']
            }
        ]
    };

    /**
     * 氧气罐材质选择
     * */
    let fishCarOxygenTank = {
        input: currentPage.find('.post-driver-fish-oxygen-tank'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
         // value: [selectOxygenTankMaterial || ''],
        cols: [
            {
                textAlign: 'center',
                values: ['液氧罐', '普通氧气罐']
            }
        ]
    };

    /**
     * render 辅助设备列表
     * 选择辅助设备
     * */
    currentPage.find('.post-driver-device-list').html(fishCar.tagList());
    currentPage.find('.post-driver-device-list')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if (ele.tagName != 'SPAN'){
            return;
        }
        $$(ele).toggleClass('on');
    };

    /**
     * 获取鱼车配送路线
     * */
    function getFishCarAddress (){
        let res = [];
        $$.each(currentPage.find('.post-select-address'), (index, item) => {
            const val = $$(item).find('input').val();
            // const valArr = $$(item).find('input').val().split('-');
            // const onlyStart = 1 == valArr.length ? valArr[0].substring(0, valArr[0].length - 1) : '';
            // const startId = onlyStart ? getProvinceId(onlyStart)['provinceId'] : '';
            // res.push({
            //     departureProvinceId: startId || getProvinceId(valArr[0])['provinceId'],
            //     departureProvinceName: onlyStart || valArr[0],
            //     destinationProvinceId: startId || getProvinceId(valArr[1])['provinceId'],
            //     destinationProvinceName: onlyStart || valArr[1],
            // })
            res.push({
                provinceId: getProvinceId(val)['provinceId'],
                provinceName: val
            });

        });
        return res;
    }

    /**
     * 获取标签列表
     * */
    function getTagList (){
        let res = [];
        $$.each(currentPage.find('.post-driver-device-list').children('span'), (index, item) => {
            if ($$(item).hasClass('on')){
                res.push({
                    id: $$(item).attr('data-id'),
                    tagName: $$(item).text()
                });
            }
        });
        return res;
    }

    /**
     * 点击提交申请
     * */
    function callback (data){
        const {code, message} = data;
        if (1 == code){
            if (id){
                nativeEvent.nativeToast('1', '修改成功！');
                view.router.load({
                    url: 'views/user.html'
                });
                return;
            }
            view.router.load({
                url: 'views/recruitDriverSuccess.html'
            });
        } else if (8 == code || 4 == code){
            f7.alert(message);
        } else {
            f7.alert(message);
        }
        f7.hideIndicator();
    }

    /**
     * 提交司机申请
     * 提交信息验证
     * */
    currentPage.find('.submit-btn')[0].onclick = () => {
        // const selectAddress = trim(currentPage.find('.post-driver-select-address').val());
        const fishTank = trim(currentPage.find('.post-driver-fish-box').val());
        const fishTankSize = trim(currentPage.find('.post-driver-fish-box-size').val());
        const fishBoxNumber = trim(currentPage.find('.post-driver-fish-box-number').val());
        const fishOxygenTank = trim(currentPage.find('.post-driver-fish-oxygen-tank').val());
        let errors = '';

        if (!fishOxygenTank){
            errors = '请选择氧气罐材质！';
        }

        if (!fishBoxNumber){
            errors = '请填写分箱数！';
        }

        if (!fishTankSize){
            errors = '请填写鱼罐方数！';
        }

        if (!fishTank){
            errors = '请选择鱼罐材质！';
        }

        if (!currentPage.find('.post-select-address').length){
            errors = '请您添加地区！';
        }

        // if (!selectAddress) {
        //     errors = '请选择路线范围！';
        // }

        if (errors){
            f7.alert(errors);
            return;
        }
        f7.showIndicator();
        const roadTransportQualificationCertificate = currentPage.find('.post-box').children('.left').find('img').length
            ? currentPage.find('.post-box').children('.left').find('img').eq(0).attr('src').split('@')[0] : '';
        const roadTransportCertificate = currentPage.find('.post-box').children('.right').find('img').length
            ? currentPage.find('.post-box').children('.right').find('img').eq(0).attr('src').split('@')[0] : '';

        let data = {
            contactName: window.authObj.name,
            contactPhone: window.authObj.phone,
            workingAge: Number(window.authObj.age.replace('年', '')),
            hasTeam: '是' == window.authObj.team,
            positiveIdUrl: window.authObj.authUrl,
            drivingLicence: window.authObj.driverUrl,
            roadTransportQualificationCertificate,
            roadTransportCertificate,
            fishTankMaterial: getFishTankId(fishTank),
            fishTankSize: Number(fishTankSize.replace('方', '')),
            fishTankBoxCount: Number(fishBoxNumber.replace('个', '')),
            oxygenTankMaterial: getOxygenTankId(fishOxygenTank),
            routineList: getFishCarAddress(),
            auxiliaryList: getTagList()
        };
        if (id){
            customAjax.ajax({
                apiCategory: 'fishCarDrivers',
                paramsType: 'application/json',
                data: data,
                header: ['token'],
                type: 'put',
                val: {
                    id
                },
                isMandatory: true,
                noCache: true
            }, callback);
        } else {
            customAjax.ajax({
                apiCategory: 'postFishCars',
                paramsType: 'application/json',
                data: data,
                type: 'post',
                isMandatory: true,
                noCache: true
            }, callback);
        }
    };

    /**
     * 如果存在id，则是修改，反则是新增申请
     * 填满返回的信息
     * */
    if (!id){
        f7.hideIndicator();
        f7.picker(addressInitObj);
        f7.picker(fishCarSizeInitObj);
        f7.picker(fishCarBoxSizeInitObj);
        f7.picker(fishCarTankInitObj);
        f7.picker(fishCarOxygenTank);
    } else {
        currentPage.find('.submit-btn').children().text('提交修改');
        currentPage.find('.post-driver-content').children('.post-title').hide();
        currentPage.find('.post-driver-content').children('.post-driver-select').hide();
        const {
            // routeList,
            roadTransportQualificationCertificate,
            roadTransportCertificate,
            fishTankMaterial,
            fishTankBoxCount,
            oxygenTankMaterial,
            fishTankSize,
            auxiliaryList,
            routineList
        } = window.driverData;
        // render路线
        // if (routeList && routeList.length) {
            // selectedAddress = '多条路线';
            // currentPage.find('.post-driver-select-address').val('多条路线');
            // currentPage.find('.add-address-click-box').remove();

            // $$.each(routineList, (index, item) => {
            //     const {departureProvinceName, destinationProvinceName} = item;
            //     const address = departureProvinceName == destinationProvinceName ?
            //         `${destinationProvinceName}内` : `${departureProvinceName}-${destinationProvinceName}`;
            //     currentPage.find('.post-driver-select').append(fishCar.selectAddress(index, address));
            // })

        $$.each(routineList, (index, item) => {
            const {provinceName} = item;
            currentPage.find('.address-list').append(fishCar.selectAddress(index, provinceName));
        });

        if (currentPage.find('.post-select-address').length == 5){
            currentPage.find('.add-address-click-box').hide();
        }
        // }
        // } else {
        //     selectedAddress = '全国';
        //     currentPage.find('.post-driver-select-address').val('全国');
        // }

        // 填写鱼罐材质
        fishCarTankInitObj.value = [getFishTankName(fishTankMaterial)];
        f7.picker(fishCarTankInitObj);

        // 填写鱼罐方数
        fishCarSizeInitObj.value = [`${fishTankSize}方`];
        f7.picker(fishCarSizeInitObj);

        // 填写分箱数
        fishCarBoxSizeInitObj.value = [`${fishTankBoxCount}个`];
        f7.picker(fishCarBoxSizeInitObj);

        // 填写氧气罐材质
        fishCarOxygenTank.value = [getOxygenTankName(oxygenTankMaterial)];
        f7.picker(fishCarOxygenTank);

        // 填选辅助设备
        if (auxiliaryList && auxiliaryList.length){
            $$.each(auxiliaryList, (index, item) => {
                currentPage.find('.post-driver-device-list').children(`span[data-id="${item.id}"]`).addClass('on');
            });
        }

        // 填写证件
        roadTransportQualificationCertificate && currentPage.find('.post-box').children('.left').children('div').html(`<img src="${roadTransportQualificationCertificate}${identity['individual']}" />`);
        roadTransportCertificate && currentPage.find('.post-box').children('.right').children('div').html(`<img src="${roadTransportCertificate}${identity['individual']}" />`);
    }
}

export {
    postDriverInfoInit
};
