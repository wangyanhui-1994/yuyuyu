import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class Find{
    // 获取更多banner图片
    getMoreBanner (data, callback){
        RestTemplate.get(
            'more/banners',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    // 获取专区模块
    getMoreAds (data, callback){
        RestTemplate.get(
            'ads',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

}

const findModel = new Find();
export default findModel;
