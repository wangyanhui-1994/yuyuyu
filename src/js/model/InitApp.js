/**
 * Created by zhongliang.He on 15/05/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';
import store from '../../utils/localStorage';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class InitApp{
    /**
     * [getInfoNumber 获取资讯列表的未读数量]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getInfoNumber (callback){
        let lastViewTime = store.get('catInfoNumberTime');
        if(!lastViewTime){
            store.set('catInfoNumberTime', parseInt(new Date().getTime() / 1000, 10));
            lastViewTime = parseInt(new Date().getTime() / 1000, 10);
        }
        RestTemplate.get(
            'infos/new/count',
            {},
            {
                lastViewTime
            },
            callback,
            true,
            true
        );
    }

    /**
     * [initApp 鱼种同步]
     * @type {InitApp}
     */
    putFishList (data, callback){
        RestTemplate.put(
          'subscribedFishes',
          {},
          {},
          data,
          callback
      );
    }
}

const initApp = new InitApp();
export default initApp;
