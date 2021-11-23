/**
 * Created by zhongliang.He on 19/03/2017.
 */
import nativeEvent from '../../utils/nativeEvent';
import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class Mvp{
    /**
     * [getMvpList 获取水产全明星列表]
     * @param  {[object]}   data     [pageSize, pageNo]
     * @param  {Function} callback [回调函数]
     * @return {[object]}            [data list]
     */
    getMvpList (data, callback){
        RestTemplate.get(
            'allStars',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
}

const mvp = new Mvp();
export default mvp;
