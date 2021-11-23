import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class VisitList{
    // 获取当前用户最近访客信息
    getVisitList (data, callback){
        RestTemplate.get(
            'userInfo/me/visitors',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    // 获取当前用户最近访客数
    getVisitCount (data, callback){
        RestTemplate.get(
            'userInfo/me/visitorsCount',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
   // 获取当前用户积分增加数
    getAddedPoints (data, callback){
        RestTemplate.get(
            'userInfo/me/addedPoints',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
}

const visitList = new VisitList();
export default visitList;
