/**
 * Created by domicc on 24/02/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

class UserModel{
    /**
     * [get 获取用户信息]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    get (callback){
        RestTemplate.get('auth', '', {}, callback, true);
    }

    /**
     * [update 更新用户信息]
     * @param  {[object]}   data     [params]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    update (data, callback){
        RestTemplate.put('userInfo', '', {}, data, callback);
    }
}

const userModel = new UserModel();
export default userModel;
