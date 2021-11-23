/**
 * Created by domicc on 28/02/2017.
 */
import RestTemplate from '../../../middlewares/RestTemplate';
import {JsBridge} from '../../../middlewares/JsBridge';
import store from '../../../utils/localStorage';
import config from '../../../config';
import nativeEvent from '../../../utils/nativeEvent';

class InvitationModel{

    acceptInvitation (code, callback){
        RestTemplate.post('invite', {}, {}, {
            code
        }, (res) => {
            if (1 == res.code){
                nativeEvent.nativeToast(1, '接受邀请成功');
                this.clearInviterInfo();
                callback && callback(res);
                return;
            }
            nativeEvent.nativeToast(0, res.message);
            this.clearInviterInfo();
        });
    }

    getInviterInfo (callback, f7){
        JsBridge('JS_GetInvitationInfo', '', (data) => {
            callback(data || '');
        }, f7);
    }

    /**
     * 清除邀请人信息
     * */
    clearInviterInfo (){
        const {
            cancelInvitationNumberKey,
            waitAddPointerKey,
            inviteInfoKey
        } = config;
        store.set(cancelInvitationNumberKey, 0);
        store.set(waitAddPointerKey, 0);
        store.set(inviteInfoKey, '');
    }

    /**
     * 新版加分，后台判断，登录状态下就发送api
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    accept (cb){
        RestTemplate.post('userInvitation/me', {}, {}, {}, (res) => {
            cb();
            this.clearInviterInfo();
        });
    }

}

const invitationModel = new InvitationModel();
export default invitationModel;
