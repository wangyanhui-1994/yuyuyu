/**
 * Created by zhongliang.He on 19/03/2017.
 */

import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class Count{
    /**
     * [phoneCount 用户拨电话统计]
     * @param  {[object]}   data     [传入的数据]
     * {
     *  entry: number 0未知，1出售求购需求，2鱼车需求，3行程 ,
     *  phone: 拨打的电话号码
     * }
     * @param  {Function} callback [回调函数]
     * @return {[object]}            [后台的反馈]
     */
    phoneCount (data, callback){
        RestTemplate.post(
            'phoneCallLog',
            {},
            {},
            data,
            callback
        );
    }
}

const count = new Count();
export default count;
