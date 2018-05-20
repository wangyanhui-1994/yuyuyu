/**
 * Created by zhongliang.He on 02/11/2017.
 */
import nativeEvent from '../../utils/nativeEvent';
import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class Invitation{
    /**
     * [getInvitationList 获取邀请人列表]
     * @param  {[object]}   data     [pageSize, pageNo]
     * @param  {Function} callback [回调函数]
     * @return {[object]}            [data list]
     */
    getInvitationList (data, callback){
        RestTemplate.get(
            'userInfo/invitation/friends',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
}

const invitation = new Invitation();
export default invitation;
