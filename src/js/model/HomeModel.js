/**
 * Created by zhongliang.He on 09/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class HomeModel{
    /**
     * 获取司机发布的最近的一条计划中的行程
     * */
    getMyFishRecentTrip (callback){
        RestTemplate.get(
            'fishCarDriverDemands/recent',
            {},
            {},
            callback,
            true,
            true
        );
    }

    /**
     * 首页banner统计
     * */
    postBannerCount (data, callback){
        RestTemplate.post(
            'bannerScanLogs',
            {},
            {},
            data,
            callback
        );
    }

    // 获取我要买中最近浏览超过100的信息
    getBiggerBuyInfo (callback){
        RestTemplate.get(
            'buying/state',
            {},
            {},
            callback,
            false,
            false
        );
    }

    // 获取关心的鱼种发布信息的条数
    postFollowFishNumber (data, callback){
        RestTemplate.post(
            'subscribedFishes',
            {},
            {},
            data,
            callback
        );
    }

    // 获取根据关心鱼种删选出来的出售列表
    postFollowSaleList (data, callback){
        RestTemplate.post(
            'demands/sale/recommendation',
            {},
            {},
            data,
            callback
        );
    }

    // 获取我要卖相关数据
    getSellData (callback){
        RestTemplate.get(
            'wannaSale',
            {},
            {},
            callback,
            false,
            false
        );
    }

    // 获取求购列表
    getBuyList (data, callback){
        RestTemplate.post(
            'demands/buy/recommendation',
            {},
            {},
            data,
            callback
        );
    }

    // 运营专区统计
    postOperateCount (data, callback){
        RestTemplate.post(
            'adsScanLogs',
            {},
            {},
            data,
            callback
        );
    }

     // 获取最近访客信息
    getLatestVisitor (data, callback){
        RestTemplate.get(
            'userInfo/me/visitors/latest',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

     // 获取当前用户等级
    getUserLevel (callback){
        RestTemplate.get(
            'userInfo/me/level',
            {},
            {},
            callback,
            false,
            false
        );
    }
}

const homeModel = new HomeModel();
export default homeModel;
