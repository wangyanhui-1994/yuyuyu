/**
 * Created by zhongliang.He on 19/05/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class InfoDetail{
    /**
     * [refreshInfo 用户刷新已经发布的信息]
     * @param  {[number]}   data     [信息id]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    refreshInfo (id, callback){
        RestTemplate.post(
            `demandInfo/${id}/refreshLog`,
            {},
            {},
            {},
            callback
        );
    }

    /**
     * [postDealRecord 提交成交记录]
     * @param  {[type]}   data     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    postDealRecord (data, callback){
        RestTemplate.post(
            'trades',
            {},
            {},
            data,
            callback
        );
    }
}

const infoDetail = new InfoDetail();
export default infoDetail;
