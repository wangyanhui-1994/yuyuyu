import RestTemplate from '../../middlewares/RestTemplate';
import nativeEvent from '../../utils/nativeEvent';

class RecordList{
    // 获取当前用户成交记录
    getRecordList (data, callback){
        RestTemplate.get(
            'userInfo/me/trades',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    getUserRecordList (data, callback){
        RestTemplate.get(
            'trades',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    // 出售详情成交记录
    getDetailRecordList (data, callback){
        RestTemplate.get(
            `demands/${data.demandId}/trades`,
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

}

const recordList = new RecordList();
export default recordList;
