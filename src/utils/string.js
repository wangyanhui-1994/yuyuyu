import nativeEvent from './nativeEvent';
import config from '../config/index';
import {getToken} from '../middlewares/loginMiddle';
import store from '../utils/localStorage';

const {fishCacheObj, mWebUrl} = config;
module.exports = {
    trim: (str) => {
        if (!str){
            return '';
        }
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    /*
     * Prevent script injection attacks.
     */
    html: (dom, str, f7) => {
        if (str && str.toString().indexOf('<script') > -1){
            f7 && f7.alert('请求错误,请重新发送请求!');
            return;
        }
        dom.length == undefined ? dom.innerHTML = str : dom.html(str);
    },

    // mycenter get user name: return 何＊＊
    getName: (name) => {
        if(!name){
            return '';
        }
        let arr = name.split('');
        let res = arr[0];
        arr.shift();
        arr.forEach((item, index) => {
            res += '*';
        });
        return res;
    },

    getBusinessLicenseNumber: (str) => {
        if(!str){
            return '';
        }
        const arr = str.split('');
        let res = arr[0];
        const lastStr = arr.pop();
        arr.shift();
        arr.forEach((item, index) => {
            res += '*';
        });
        res += lastStr;
        return res;
    },

    getQuery: (str) => {
        let obj = {};
        if (!str){
            return obj;
        }
        const arr = str.split('?').length > 1 ? str.split('?')[1].split('&') : str.split('?')[0].split('&');
        arr.forEach((item) => {
            const key = item.split('=')[0];
            const val = item.split('=')[1];
            if (key.indexOf('keyvalue') > -1){
                obj['keyvalue'] = item.substr(9, 100);
            } else {
                obj[key] = val;
            }
        });
        return obj;
    },

    getTabStr: (str) => {
        if (str && str.length <= 4){
            return str;
        }
        const res = str.substr(0, 4);
        return res + '...';
    },

    getSingleProvinceId: (district, provinceName) => {
        if (!provinceName){
            return;
        }
        let id;
        district['root']['province'].forEach((item) => {
            item['name'] == provinceName && (id = item['postcode']);
        });
        return id;
    },

    getCityId: (district, provinceName, cityName) => {
        if (!provinceName){
            return;
        }
        let id;
        district['root']['province'].forEach((item) => {
            if (item['name'] == provinceName){
                item['city'].forEach(val => {
                    val['name'] == cityName && (id = val['postcode']);
                });
            }
        });
        return id;
    },

    imgIsUpload: (src) => {
        if (!src){
            return false;
        }
        let img = window.document.createElement('img');
        img.src = src;
        return img.complete ? `<img src="${src}" alt="图片" />` : null;
    },

    getCertInfo: (type) => {
        let text = '';
        let label = '';
        let classes = '';
        let certName = '';
        if (1 == type){
            text = '苗种生产';
            label = '苗';
            classes = 'seedling';
            certName = '苗种生产许可证';
        } else if (2 == type){
            text = '水产养殖';
            label = '水';
            classes = 'water';
            certName = '水产养殖许可证';
        } else if (3 == type){
            text = '检验检疫';
            label = '检';
            classes = 'cert';
            certName = '检验检疫合格证';
        } else if (4 == type){
            text = '无公害农产品产地';
            label = '证';
            classes = 'identity';
            certName = '无公害农产品产地认证证书';
        } else if (5 == type){
            text = '绿色食品';
            label = '证';
            classes = 'identity';
            certName = '绿色食品证书';
        } else if (6 == type){
            text = '有机产品';
            label = '证';
            classes = 'identity';
            certName = '有机产品认证证书';
        }
        return {
            label,
            text,
            classes,
            certName
        };
    },

    getAddressIndex (provinceName, cityName){
        const district = nativeEvent['getDistricInfo']();
        let provinceIndex, cityIndex, currentProvince, lat, lng;
        district && $$.each(district['root']['province'], (index, item) => {
            if (item['name'] == provinceName){
                provinceIndex = index;
                currentProvince = item;
                return;
            }
        });
        currentProvince && currentProvince['city'] && $$.each(currentProvince['city'], (index, item) => {
            if (item['name'] == cityName){
                cityIndex = index;
                lat = item.lat;
                lng = item.lng;
                return;
            }
        });

        !provinceIndex && (provinceIndex = 0);
        !cityIndex && (cityIndex = 0);
        !lat && (lat = 0);
        !lng && (lng = 0);
        return {
            provinceIndex,
            cityIndex,
            lat,
            lng
        };
    },

    getTagInfo (){
        var tagList = [{
            id: 1,
            name: '水花',
            type: 0
        }, {
            id: 2,
            name: '<1000尾',
            type: 0
        }, {
            id: 3,
            name: '1000-100尾',
            type: 0
        }, {
            id: 4,
            name: '100-10尾',
            type: 0
        }, {
            id: 5,
            name: '10-1尾',
            type: 0
        }, {
            id: 6,
            name: '>1斤',
            type: 0
        }, {
            id: 7,
            name: '有来源证明',
            type: 1,
            category: 0
        }, {
            id: 8,
            name: '活力好',
            type: 1,
            category: 0
        }, {
            id: 9,
            name: '光泽度好',
            type: 1,
            category: 0
        }, {
            id: 10,
            name: '体型好',
            type: 1,
            category: 0
        }, {
            id: 11,
            name: '有检疫证明',
            type: 1,
            category: 0
        }, {
            id: 12,
            name: '交通方便',
            type: 1,
            category: 0
        }, {
            id: 13,
            name: '无病无伤',
            type: 1,
            category: 1
        }, {
            id: 14,
            name: '皮毛好',
            type: 1,
            category: 1
        }, {
            id: 15,
            name: '有检测报告',
            type: 1,
            category: 1
        }, {
            id: 16,
            name: '大水面养殖',
            type: 1,
            category: 1
        }, {
            id: 17,
            name: '已经停料',
            type: 1,
            category: 1
        }];

        const adultFishTags = [
            {id: 24, name: '<0.5斤'},
            {id: 25, name: '0.5-1斤'},
            {id: 26, name: '1-5斤'},
            {id: 27, name: '5-10斤'},
            {id: 28, name: '>10斤'}
        ];
        let specList = [];
        $$.each(tagList, (index, item) => {
            0 == item.type && specList.push(item);
        });

        let discriptionList = [];
        $$.each(tagList, (index, item) => {
            1 == item.type && discriptionList.push(item);
        });
        return {
            specList,
            discriptionList,
            adultFishTags
        };
    },

    /**
     * caculate the great circle distance
     * @param {Object} lat1
     * @param {Object} lng1
     * @param {Object} lat2
     * @param {Object} lng2
     */

    getRange: (lat1, lng1) => {
        const lat2 = window['addressObj'] && window['addressObj']['latitude'];
        const lng2 = window['addressObj'] && window['addressObj']['longitude'];
        if (!lng2 || !lat2 || !lat1 || !lng1){
            return -2;
        }
        const rad = function (d){
            return d * Math.PI / 180.0;
        };

        let radLat1 = rad(Number(lat1));
        let radLat2 = rad(Number(lat2));
        let a = radLat1 - radLat2;
        let b = rad(Number(lng1)) - rad(Number(lng2));

        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        return Number(s).toFixed(0);
    },

    isEmailStr: (val) => {
        if (!val){
            return '';
        }
        let res = val;
        const ranges = [
            // '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
            // '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
            // '\ud83d[\ude80-\udeff]',
            "'",
            '"',
            '~',
            '`',
            '\\',
            '/',
            '&',
            '$',
            '%'
        ];
        $$.each(ranges, (index, item) => {
            if(val.indexOf(item) > -1){
                res = res.replace(item, '');
            }
        });
        // res = res.replace(new RegExp(ranges.join('|'), 'g'), '')
        // .replace(/\ud83d[\ude00-\ude4f]/g, '')
        // .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '')
        // .replace(/[\uE000-\uF8FF]/g, '')
        // .replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
        // .replace(/^[\u{1f600}-\u{1f64f}]/g, '');
        return res;
    },

    saveSelectFishCache: (obj) => {
        const {name} = obj;
        if (name && name.indexOf('全部') == -1){
            const {fishCacheKey, maxLength} = fishCacheObj;
            let currentFishCache = store.get(fishCacheKey) || [];
            let index = -10;
            currentFishCache && currentFishCache.length && $$.each(currentFishCache, (key, val) => {
                name == val.name && (index = key);
            });
            Number(index) > -1 && currentFishCache.splice(index, 1);
            currentFishCache.length >= maxLength && currentFishCache.shift();
            currentFishCache.push(obj);
            store.set(fishCacheKey, currentFishCache);
        }
    },

    getCurrentDay: () => {
        const newDate = new Date();
        const y = newDate.getFullYear();
        const m = newDate.getMonth() + 1 >= 10 ? newDate.getMonth() + 1 : ('0' + (newDate.getMonth() + 1));
        const d = newDate.getDate() >= 10 ? newDate.getDate() : ('0' + newDate.getDate());
        return y + '/' + m + '/' + d;
    },

    getInfoStatus: (state) => {
        const text = (0 == state && '待审核') || (2 == state && '审核未通过') || (1 == state && '已发布');
        const className = (0 == state && 'check') || (2 == state && 'faild') || (1 == state && 'pass');
        return {
            text,
            className
        };
    },

    alertTitleText: () => {
        const token = getToken();
        const weixinData = store.get('weixinData');
        let text = '';
        !token && !weixinData && (text = '您还没登录，请先登录!');
        !token && weixinData && (text = '绑定手机号后，可以使用全部功能!');
        return text;
    },

    /**
     *
     * 根据地区名字获取id
     */
    getProvinceId: (provinceName, cityName) => {
        const _district = nativeEvent['getDistricInfo']() || {root: {province: []}};
        let provinceId, cityId, selectItem;
        provinceName && $$.each(_district.root.province, (index, item) => {
            if(provinceName === item.name){
                provinceId = item.postcode;
                selectItem = item;
            }
        });

        cityName && $$.each(selectItem && selectItem.city, (index, item) => {
            if(cityName === item.name){
                cityId = item.postcode;
            }
        });
        return {
            provinceId,
            cityId
        };
    },

    /**
     * 获取所以的省份名字信息
     * */
    getProvinceList: () => {
        const _district = nativeEvent['getDistricInfo']() || {root: {province: []}};
        let list = [];
        $$.each(_district.root.province, (index, item) => {
            list.push(item.name);
        });
        return list;
    },

    /**
     * 获取鱼车填写路线列表中的特殊项标
     *
     * */
    getCreateDriverListLabel: (number) => {
        let label;
        switch(number){
        case 0:
            label = '①';
            break;
        case 1:
            label = '②';
            break;
        case 2:
            label = '③';
            break;
        case 3:
            label = '④';
            break;
        case 4:
            label = '⑤';
            break;
        default:
            label = '';
            break;
        }
        return label;
    },

    /**
     * 获取鱼罐材质id
     * */
    getFishTankId: (text) => {
        let id;
        switch(text){
        case '玻璃钢':
            id = 1;
            break;
        case '塑胶':
            id = 2;
            break;
        case '不锈钢':
            id = 3;
            break;
        case '白铁':
            id = 4;
            break;
        case '铁':
            id = 5;
            break;
        case '铝':
            id = 6;
            break;
        default:
            id = 0;
            break;
        }
        return id;
    },

    /**
     * 获取鱼罐材质name
     * */
    getFishTankName: (id) => {
        let name;
        switch(id){
        case 1:
            name = '玻璃钢';
            break;
        case 2:
            name = '塑胶';
            break;
        case 3:
            name = '不锈钢';
            break;
        case 4:
            name = '白铁';
            break;
        case 5:
            name = '铁';
            break;
        case 6:
            name = '铝';
            break;
        default:
            name = '未知';
            break;
        }
        return name;
    },

    /**
     * 获取氧气罐id
     * */
    getOxygenTankId: (text) => {
        let id;
        switch(text){
        case '液氧罐':
            id = 1;
            break;
        case '普通氧气罐':
            id = 2;
            break;
        default:
            id = 0;
            break;
        }
        return id;
    },

    /**
     * 获取氧气罐name
     * */
    getOxygenTankName: (id) => {
        let text;
        switch(id){
        case 1:
            text = '液氧罐';
            break;
        case 2:
            text = '普通氧气罐';
            break;
        default:
            text = '未知';
            break;
        }
        return text;
    },
    getPickerSelectCityData: () => {
        const _district = nativeEvent['getDistricInfo']() || {root: {province: []}};
        let res = {
            '全国': []
        };
        $$.each(_district.root.province, (index, item) => {
            let arr = [];
            $$.each(item.city, (_index, _item) => {
                arr.push(_item.name);
            });
            res[item.name] = arr;
        });
        return res;
    },

    /**
     * 获取明天/后天/或者几月几号
     * */
    getFishCarDateStyle: (date) => {
        if(!date){
            return '';
        }
        const itemTime = new Date(date).getTime();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const currentZeroTime = new Date(`${year}/${month}/${day}`).getTime();
        const oneDayTime = 60 * 60 * 24 * 1000;
        const dateStyle = `${date.split('-')[1]}月${date.split('-')[2]}日`;
        let res;
        if(oneDayTime > Number(itemTime - currentZeroTime) && Number(itemTime - currentZeroTime) >= 0){
            res = `今天(${dateStyle})`;
        }else if(oneDayTime * 2 > Number(itemTime - currentZeroTime) && Number(itemTime - currentZeroTime) >= oneDayTime){
            res = `明天(${dateStyle})`;
        }else if(oneDayTime * 3 > Number(itemTime - currentZeroTime) && Number(itemTime - currentZeroTime) >= oneDayTime * 2){
            res = `后天(${dateStyle})`;
        }else{
            res = dateStyle;
        }
        return res;
    },

    getProvinceCityArr: () => {
        const _district = nativeEvent['getDistricInfo']() || {root: {province: []}};
        let list = {};
        $$.each(_district.root.province, (index, item) => {
            const cityArr = [];
            $$.each(item.city, (i, v) => {
                cityArr.push(v.name);
            });
            list[item.name] = cityArr;
        });
        return list;
    },
    /**
     * 获取两位数的版本号给native
     * */
    getVersionSetTag: () => {
        const versionNumber = store.get('versionNumber');
        const versionArr = versionNumber.replace('V', '').split('_');
        const fistStr = versionArr[0] < 10 ? versionArr[0].replace('0', '') : versionArr[0];
        const secondStr = versionArr[1] < 10 ? versionArr[1].replace('0', '') : versionArr[1];
        return `${fistStr}.${secondStr}`;
    },
    /**
     * 根据当前用户信息，获取分享店铺的url
     * */
    getShareImgUrl: (userInfo) => {
        const {
            publishedDemandsCount,
            level,
            personalAuthenticationState,
            enterpriseAuthenticationState,
            nickname,
            scanLink,
            imgUrl
        } = userInfo;

        const {url} = config;
        let str = `${url}shareImages/person`;
        str += `?level=${level}`;
        str += `&headImgUrl=${imgUrl ? encodeURIComponent(imgUrl) : ''}`;
        str += `&enterpriseAuthenticated=${1 == enterpriseAuthenticationState}`;
        str += `&personAuthenticated=${1 == personalAuthenticationState}`;
        str += `&nickName=${nickname ? encodeURI(nickname) : ''}`;
        str += `&qrCodeLink=${encodeURIComponent(scanLink)}`;
        str += `&publishedDemandsCount=${publishedDemandsCount}`;
        return str;
    },
    /**
     * [getShareTripImgUrl 获取行程分享的图片在线地址]
     * @param  {[object]} userInfo [用户信息]
     */
    getShareTripImgUrl: (userInfo, query) => {
        const {
          imgUrl
      } = userInfo;

        const {
        date,
        departureProvinceName,
        destinationProvinceName,
        id,
        contactName
      } = query;
        const qrCodeLink = `${mWebUrl}fishcar/route/${id}`;
        let appointedDay = date.split('-');
        appointedDay = `${Number(appointedDay[1]) < 10 ? Number(appointedDay[1]) : appointedDay[1]}月${Number(appointedDay[2]) < 10 ? Number(appointedDay[2]) : appointedDay[2]}日`;

        const {url} = config;
        let str = `${url}shareImages/route`;
        str += `?appointedDay=${encodeURI(appointedDay)}`;
        str += `&headImgUrl=${imgUrl ? encodeURIComponent(imgUrl) : ''}`;
        str += `&departureArea=${departureProvinceName ? encodeURI(departureProvinceName) : ''}`;
        str += `&destinationArea=${destinationProvinceName ? encodeURI(destinationProvinceName) : ''}`;
        str += `&nickName=${contactName ? encodeURI(contactName) : ''}`;
        str += `&qrCodeLink=${encodeURIComponent(qrCodeLink)}`;
        return str;
    },
    /**
     * 获取企业认证或者个人认证
     * @e 企业认证状态
     * @p 个人认证状态
     * */
    getAuthText: (e, p) => {
        let res = '实名认证';
        1 == p && (res = '已个人认证');
        1 == e && (res = '已企业认证');
        return res;
    }
};
