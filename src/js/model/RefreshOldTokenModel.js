/**
 * Created by zhongliang.He on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class RefreshOldTokenModel{
    post (callback){
        RestTemplate.post('auth/transfer', {apiVersion: 2}, {}, {}, callback);
    }
}

const refreshOldTokenModel = new RefreshOldTokenModel();
export default refreshOldTokenModel;
