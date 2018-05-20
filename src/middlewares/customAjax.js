import config from '../config/';
import store from '../utils/localStorage';
import {activeLogout, getToken} from '../middlewares/loginMiddle';
import Framework7 from '../js/lib/framework7';
import nativeEvent from '../utils/nativeEvent';
import invitationModel from '../js/service/invitation/InvitationModel';
import {getAddressIndex} from '../utils/string';

const f7 = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    fastClicks: true,
    modalTitle: '温馨提示'
});
class CustomClass{
    /**
     * 旧的方法api跟参数分开配置，参数为array
     * 新的方法就直接是object传进来
     * */
    getKey (apiCategory, api, key, val, params){
        let res = `${apiCategory ? (apiCategory + '_') : ''}${api || ''}`;
        if ($$.isArray(key)){
            $$.each(key, (index, k) => {
                let value = '';
                if (val && (val[index] || (val[index] == 0))){
                    value = val[index];
                }
                res += `_${k}_${value}`;
            });
        } else {
            $$.each(key, (k, v) => {
                let value = '';
                if (v || (v == 0)){
                    value = v;
                }
                res += `_${k}_${value}`;
            });
        }

        if (params && 'object' == typeof params){
            $$.each(params, (k, v) => {
                let item = '';
                if (v || (v == 0)){
                    item = v;
                }
                res += `_${k}_${item}`;
            });
        }

        if(res.indexOf('recommendation') > -1 && res.indexOf('demands') > -1 && !key){
            $$.each(val, (key, item) => {
                res += `_${key}_${encodeURIComponent(item)}`;
            });
        }
        return res;
    }

    getData (key, val){
        let obj = {};
        $$.each(key, (index, k) => {
            obj[k] = val[index] || '';
        });
        return obj;
    }

    checkMaxLenAndDelete (){
        const {cacheMaxLen, cacheUserInfoKey, cacheHistoryKey} = config;
        const len = store.getAll().length;
        let isDel = false;
        const storeCache = store.getAll();
        const disableDeleteArr = [cacheUserInfoKey, cacheHistoryKey];
        if (len >= cacheMaxLen){
            for(let item in storeCache){
                if(!isDel && (disableDeleteArr.indexOf(item) == -1) && (item.indexOf('_') > -1) && (store.getAll().length >= cacheMaxLen)){
                    store.remove(item);
                    isDel = true;
                }
            }
        }
    }

    /*
     *   isMandatory: Whether it is mandatory to refresh ，default:false
     *   noCache: Local storage is not required, default: false
     */
    ajax (obj, callback){
        const {
            api,
            data,
            apiCategory,
            type,
            isMandatory,
            noCache,
            val,
            header,
            paramsType,
            onlyUseCache,
            apiVersion
        } = obj;

        const isGet = 'get' == type;
        const key = api ? config[apiCategory][api] : config[apiCategory];
        const {timeout, cacheUserInfoKey} = config;
        const saveKey = api in ['login', 'getUserInfo'] ? cacheUserInfoKey : this.getKey(apiCategory, api, key, data, val);
        let newData = $$.isArray(data) ? this.getData(key, data) : data;

        let headers = {};
        let url = `${config.url}${apiCategory == 'inviteter' ? 'invite' : apiCategory}${api ? ('/' + api + '/') : ''}`;
        apiCategory == 'demandInfoAdd' && !api && (url = `${config.url}demandInfo`);
        url.indexOf('deleteDemandInfo') > -1 && (url = url.replace('demandInfo/deleteDemandInfo', 'demandInfo'));
        url.indexOf('demandInfo/refreshLog/') > -1 && (url = url.replace('demandInfo/refreshLog/', 'demandInfo/'));
        url.indexOf('userInformation') > -1 && (url = url.replace('userInformation', 'userInfo'));
        url.indexOf('listFiltered') > -1 && (url = url.replace('listFiltered', 'list/filtered'));
        url.indexOf('postFishCars') > -1 && (url = url.replace('postFishCars', 'fishCars'));
        if('put' == type && ('subscribedFishes' == apiCategory)){
            url += `?action=${data.action}`;
            delete newData.action;
        }

        /**
         * 不同type的API参数处理
         * 例如：post跟get的参数不同
         * */
        if ('fishCarDemands' == apiCategory && 'post' == type){
            delete newData.pageNo;
            delete newData.pageSize;
        }

        paramsType && (newData = JSON.stringify(newData));

        if (val){
            $$.each(val, (key, value) => {
                url += `/${value}`;
            });
        }

        if (header){
            const {ios} = window.currentDevice;
            if(store.get('accessToken') && ios && window.JS_GetObjectWithKey){
                !window.JS_GetObjectWithKey('accessToken') && window.JS_SaveObjectWithKey('accessToken', store.get('accessToken'));
            }
            header.indexOf('token') > -1 && (headers['access-token'] = store.get('accessToken') || getToken() || '');
        }

        if (!noCache){
            const cacheData = store.get(saveKey);
            const apiArr = ['getDemandInfo'];
            const apiCategoryArr = ['userInformation'];
            if(cacheData && (!isMandatory || apiArr.indexOf(api) > -1 || apiCategoryArr.indexOf(apiCategory) > -1)){
                const {time, code} = cacheData;
                if(1 !== code){
                    f7.pullToRefreshDone();
                    f7.hideIndicator();
                    f7.hidePreloader();
                    return;
                }
                setTimeout(() => {
                    callback(cacheData);
                }, 200);
                if(isGet && (new Date().getTime() - time) <= 3 * 1000){
                    setTimeout(() => {
                        f7.pullToRefreshDone();
                        f7.hideIndicator();
                        f7.hidePreloader();
                    }, 200);
                    return;
                }
            }
        }
        const _this = this;

        /**
         * 没有网络的时候提示用户，且不向服务器发送请求
         * */
        if (!nativeEvent['getNetworkStatus']()){
            nativeEvent.nativeToast(0, '请检查您的网络！');
            f7.pullToRefreshDone();
            f7.hideIndicator();
            f7.hidePreloader();
            return;
        }

        /**
         * 仅仅只使用缓存
         * 首页：先显示缓存，在触发下拉刷新逻辑
         * */
        if (onlyUseCache){
            return;
        }

        /**
         * 在headr中添加设备信息
         * */
        const deviceInfo = nativeEvent['getDeviceInfomation']();
        const {initProvinceName, initCityName} = window.addressObj || {};
        const {lng, lat} = getAddressIndex(initProvinceName, initCityName);
        $$.each(deviceInfo, (key, val) => {
            headers[key] = val;
        });
        !!window.uuid && (headers['device-id'] = window.uuid);
        headers.longitude = lng;
        headers.latitude = lat;
        apiVersion && (headers['v'] = apiVersion);

        $$.ajax({
            method: type,
            url,
            timeout,
            headers,
            contentType: paramsType || 'application/x-www-form-urlencoded',
            data: newData,
            cache: false,
            processData: true,
            crossDomain: true,

            /**
             * 服务的回来的ajax，根据status处理失败请求
             * */
            error: function (err, status){
                if (parseInt(status, 10) >= 500){
                    nativeEvent.nativeToast(0, '服务器繁忙，请稍后再试！');
                } else {
                    nativeEvent.nativeToast(0, '请检查您的网络！');
                }
                f7.pullToRefreshDone();
                f7.hideIndicator();
                f7.hidePreloader();

                if (url.indexOf('favorite/demandInfo/') > -1){
                    callback(null, err);
                }
            },

            /**
             * 服务器回来的ajax根据不同的code进行处理。
             * */
            success: function (data, status){
                const _data = JSON.parse(data);

                if (_data.code == 2 && _data.message){
                    if (url.indexOf('userAddDemandInfo') > -1){
                        const {type, fishTypeId, fishTypeName, requirementPhone} = newData;
                        const callback = (data) => {
                            f7.hideIndicator();
                            f7.hidePreloader();
                            const {code, message} = data;
                            if (1 == code){
                                $$('.release-sub-info').removeClass('pass');
                                window['releaseInfo'] = data['data'];
                                window.mainView.router.load({
                                    url: 'views/releaseSucc.html?' + `type=${type}&&id=${fishTypeId}&fishName=${fishTypeName}&phone=${requirementPhone}`
                                });
                            } else {
                                f7.alert(message, '提示');
                            }
                        };
                        _this.ajax({
                            apiCategory: 'demandInfoAdd',
                            header: ['token'],
                            paramsType: 'application/json',
                            data: newData,
                            type: 'post',
                            isMandatory: true,
                            noCache: true
                        }, callback);
                    } else {
                        f7.hideIndicator();
                        f7.hidePreloader();
                        f7.pullToRefreshDone();
                        f7.hidePreloader();
                        activeLogout();
                        f7.alert(_data.message, '提示', () => {
                            window.mainView.router.refreshPage();
                        });
                        return;
                    }
                } else if (0 == _data.code){
                    f7.hideIndicator();
                    f7.hidePreloader();
                    f7.alert(_data.message, '提示');
                } else if (-1 == _data.code){
                    f7.hideIndicator();
                    f7.hidePreloader();
                    nativeEvent.nativeToast(0, '服务器异常，请稍后再试！');
                } else if (4 == _data.code){
                    f7.hideIndicator();
                    f7.hidePreloader();
                    invitationModel.clearInviterInfo();
                    f7.alert(_data.message, '提示');
                    return;
                } else if (3 == _data.code){
                    if (url.indexOf('/auth') > -1){
                        f7.alert(_data.message);
                        activeLogout();
                        return;
                    }
                    f7.showIndicator();
                    setTimeout(() => {
                        window.mainView.router.load({
                            url: 'views/notFound.html?errInfo=' + _data.message,
                            reload: true
                        });
                    }, 600);
                    return;
                }
                if (3 !== _data.code && (-1 !== data.code)){
                    let dataObj = JSON.parse(data);
                    if (!noCache && saveKey){
                        dataObj.time = new Date().getTime();
                        _this.checkMaxLenAndDelete();
                        store.set(saveKey, dataObj, true);
                    }
                    callback(dataObj, null, true);
                }
            }
        });
    }
}

const CustomAjax = new CustomClass();
export default CustomAjax;
