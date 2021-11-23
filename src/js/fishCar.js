import customAjax from '../middlewares/customAjax';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {getProvinceId, alertTitleText, getProvinceList} from '../utils/string';
import {fishCar} from '../utils/template';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import store from '../utils/localStorage';
import {releaseFishViewShow} from './releaseView/releaseFishViews';
import CountModel from './model/count';

function fishCarInit (f7, view, page){
    const {pageSize, cacheUserInfoKey} = config;
    const currentPage = $$($$('.view-main .pages>.page-fish-car')[$$('.view-main .pages>.page-fish-car').length - 1]);
    const currentNavbar = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);
    const contentBox = currentPage.find('.page-list-view').children('.list');
    const showAllText = currentPage.find('.filter-search-empty-info');
    const downLoading = currentPage.find('.infinite-scroll-preloader');
    const emptyContent = currentPage.find('.filter-empty-search-result');
    f7.hideIndicator();
    const isFishCar = !!Number(page.query.isFishCar);

    if (isFishCar){
        const btnHtml = currentNavbar.find('.switch-btn').html().replace('货主', '司机');
        currentNavbar.find('.switch-btn').html(btnHtml);
        currentPage.find('.tabbat-text').children('p').text('有空车找不到货？发布行程让货来找你');
        currentPage.find('.tabbat-text').children('span').text('发布行程');
        currentPage.find('.filter-empty-search-result').children('p').text('货主还没来，先发布一个行程吧~');
        currentNavbar.find('#select-city-input').children('span').text('所有出发地');
    }

    store.set('isFishCar', isFishCar || 0);

    /**
     * 发布需求/发布行程
     * @isFishCar
     * */
    currentPage.find('.tabbat-text').children('span').click(() => {
        const loginStatus = isLogin();
        const userInfo = store.get(cacheUserInfoKey);
        const {driverState, driverRefuseDescribe} = userInfo || {};

        if (isFishCar){
            window.apiCount('btn_fishcar_demands_post');
            if (!loginStatus){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                return;
            }else{
                if (!driverState && 0 != driverState){
                    f7.modal({
                        title: '无法发布行程？',
                        text: '只有登记司机信息后,才可以发布行程找货源哟~',
                        buttons: [
                            {
                                text: '我再想想',
                                onClick: () => {
                                }
                            },
                            {
                                text: '现在去登记',
                                onClick: () => {
                                    window.mainView.router.load({
                                        url: 'views/postDriverAuth.html'
                                    });
                                }
                            }
                        ]
                    });
                } else {
                    let driverMessage = '';
                    if (0 == driverState){
                        driverMessage = '请耐心等待审核结果，审核通过后就可以发布行程了';
                    } else if (2 == driverState){
                        driverMessage = driverRefuseDescribe;
                    } else if (3 == driverState){
                        driverMessage = '您的司机身份已被冻结，请联系客服！';
                    }
                    1 !== driverState && f7.modal({
                        title: '无法发布行程',
                        text: driverMessage,
                        buttons: [
                            {
                                text: '我知道了',
                                onClick: () => {
                                }
                            }
                        ]
                    });
                }

                if(1 !== driverState){
                    return;
                }
            }
        } else {
            window.apiCount('btn_fishcar_routes_post');
            if (!loginStatus){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                return;
            }
        }
        const url = isFishCar ? 'views/releaseFishCarTrip.html' : 'views/releaseFishCarDemand.html';
        window.releaseView.router.load({
            url,
            reload: true
        });
        releaseFishViewShow();
    });

    let provinceId = '';
    let pageNo = 1;
    let isInfinite = false;
    let isShowAll = false;
    let isRefresh = false;

    // if (window.addressObj) {
    //     if (window.addressObj.initProvinceName) {
    //         provinceId = getProvinceId(window.addressObj.initProvinceName)['provinceId'];
    //     }
    // }
    // if (!!provinceId) {
    //     currentPage.find('.list-item').children('span').removeClass('active-ele');
    //     currentPage.find('span[data-postcode="' + provinceId + '"]').addClass('active-ele');
    //     currentPage.find('.select-city').children().find('span').text(window.addressObj.initProvinceName);
    // }

    /**
     * 调用f7选择组件
     * */
    let provinceArr = getProvinceList();
    provinceArr.unshift('全国');

    let pickerObj = {
        input: currentNavbar.find('#select-city-input').children('span'),
        toolbarCloseText: '确定',
        rotateEffect: true,
        cssClass: 'fish-car-province-filter',
        onOpen: (p) => {
            $$('.fish-car-province-filter .close-picker').click(() => {
                const val = p.value[0];
                currentNavbar.find('#select-city-input').children('span')
                    .text(val == '全国' ? (isFishCar ? '所有出发地' : '所有目的地') : val);
                provinceId = getProvinceId(val, '')['provinceId'];
                getList(true);
                window.apiCount(isFishCar ? 'btn_fishcar_routes_regionSelect' : 'btn_fishcar_demands_regionSelect');
            });
        },
        cols: [
            {
                textAlign: 'center',
                values: provinceArr
            }
        ],
        onChange: (a, b, c) => {

        }
    };
    if (window.addressObj && window.addressObj.initProvinceName){
        provinceArr.indexOf(window.addressObj.initProvinceName) > -1 &&
        (pickerObj.value = [window.addressObj.initProvinceName]);
    }
    f7.picker(pickerObj);

    function callback (res, type){
        const {code, message, data} = res;
        if (1 == code){
            currentNavbar.find('.count-driver').text(
                isFishCar ? `${data.total || '0'}位货主有货要发` : `${data.total || '0'}位司机计划出行`
            );
            if (data.records && data.records.length){
                emptyContent.hide();
                let str = '';
                $$.each(data.records, (index, item) => {
                    if ('demandInfo' == type){
                        str += fishCar.demandList(item);
                    } else {
                        str += fishCar.list(item);
                    }
                });

                if (isRefresh || (1 == pageNo)){
                    currentPage.find('.page-content').scrollTop(0);
                    contentBox.html('');
                }

                str && contentBox.append(str);

                // 显示全部
                if (data.records.length < pageSize){
                    isShowAll = true;
                    downLoading.hide();
                    showAllText.show();
                } else {
                    downLoading.show();
                    showAllText.hide();
                    isShowAll = false;
                }
            } else if (pageNo == 1){
                contentBox.html('');
                emptyContent.show();
                isShowAll = true;
                downLoading.hide();
                showAllText.hide();
            }

            f7.pullToRefreshDone();
            if (isRefresh){
                currentNavbar.find('.filter-tab').hide();
            }
            isRefresh = false;
            isInfinite = false;
            currentPage.find('img.lazy').trigger('lazy');
        }else{
            console.log(message);
        }
    }

    /**
     * 获取鱼车需求列表相关操作
     * */
    function getFishCarList (bool){
        customAjax.ajax({
            apiCategory: 'fishCarDriverDemands',
            data: [provinceId, pageSize, pageNo],
            type: 'get',
            isMandatory: bool
        }, (data) => {
            callback(data, 'list');
        });
    }

    /**
     * 获取鱼车需求列表相关操作
     * */
    function getFishCarDemandList (bool){
        const obj = {
            apiCategory: 'fishCarDemands',
            data: [provinceId, pageSize, pageNo],
            type: 'get',
            isMandatory: bool
        };
        isFishCar && (obj.apiVersion = 2);
        customAjax.ajax(obj, (data) => {
            callback(data, 'demandInfo');
        });
    }

    /**
     * 数据最终请求
     * */
    function getList (bool){
        if (!isFishCar){
            getFishCarList(bool);
        } else {
            getFishCarDemandList(bool);
        }
    }

    getList(false);

    /**
     * 上啦加载
     * */
    currentPage.find('.infinite-scroll').on('infinite', function (){
        if (isInfinite || isShowAll){
            return;
        }
        downLoading.show();
        showAllText.hide();
        isInfinite = true;
        pageNo++;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        getList(isMandatory);
    });

    /**
     * 下拉刷新
     * */
    currentPage.find('.pull-to-refresh-content').on('refresh', function (){
        isRefresh = true;
        isShowAll = false;
        pageNo = 1;
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        currentNavbar.find('.filter-tab').hide();
        getList(isMandatory);
    });

    /**
     * 打开切换司机/货主modal
     * */
    $$('.switch-btn').click(() => {
        window.apiCount('btn_fishcar_changerole');
        $$('.fish-car-modal').addClass('on');
    });

    /**
     * 拨打电话
     * */
    currentPage.find('.page-list-view').children('.list').click((e) => {
        const ele = e.target || window.event.target;
        if ($$(ele).hasClass('fish-call') || $$(ele).parent().hasClass('fish-call')){
            window.apiCount(isFishCar ? 'btn_fishcar_routes_call' : 'btn_fishcar_demands_call');
            const phone = $$(ele).attr('data-phone') ||
                $$(ele).parent().attr('data-phone');
            nativeEvent.contactUs(phone);
            CountModel.phoneCount({
                entry: isFishCar ? 2 : 3,
                phone: phone
            }, (res) => {
                const {code} = res;
                if(1 !== code){
                    console.log('发送统计失败！');
                }
            });
        }
    });
}

export {
    fishCarInit
};
