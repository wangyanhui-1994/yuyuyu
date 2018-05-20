/**
 * Created by cash on 27/02/2017.
 */

import RestTemplate from '../../../middlewares/RestTemplate';

class LoginModel{
    get (callback){

    }

    // 微信登录
    post (data, callback){
        const apiStr = 'auth?scope=weChat';
        RestTemplate.post(apiStr, {apiVersion: 2}, {}, data, callback, true);
    }

    // 微信绑定
    put (data, callback){
        const apiStr = 'auth?scope=weChat';
        RestTemplate.put(apiStr, {}, {}, data, callback, true);
    }

    delete (callback){

    }
}

const loginModel = new LoginModel();
export default loginModel;
