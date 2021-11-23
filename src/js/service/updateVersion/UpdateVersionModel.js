/**
 * Created by cash on 27/02/2017.
 */

import RestTemplate from '../../../middlewares/RestTemplate';
import {getToken} from '../../../middlewares/loginMiddle';
import store from '../../../utils/localStorage';

class UpdateVersionModel{
    get (callback){
        const versionNumber = store.get('versionNumber');
        const channel = store.get('appChannel');
        const apiStr = `appWabUpgrade/getAppWebNowVersionNumber/${window.currentDevice.android ? 1 : 2}/${versionNumber}?channel=${channel}`;
        RestTemplate.get(apiStr, {'access-token': getToken()}, {}, callback, true);
    }

}

const updateVersionModel = new UpdateVersionModel();
export default updateVersionModel;
