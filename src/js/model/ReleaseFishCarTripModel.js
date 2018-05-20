/**
 * Created by zhongliang.He on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class ReleaseFishCarDemandModel{
    post (data, headers, callback){
        RestTemplate.post('fishCarDriverDemands', headers, '', data, callback);
    }
}

const releaseFishCarDemandModel = new ReleaseFishCarDemandModel();
export default releaseFishCarDemandModel;
