import RestTemplate from '../../middlewares/RestTemplate';

/**
 * [Count 所有后台统return计api的action]
 * @return {[object]} 成功失败反馈
 */
class ConsultGuarantee{
    /**
     * [refreshInfo 用户刷新已经发布的信息]
     * @param  {[number]}   data     [信息id]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    postGuarantee (id, callback){
        RestTemplate.post(
            `demandInfo/${id}/guaranteeConsultants`,
            {},
            {},
            {},
            callback
        );
    }
}

const consultGuarantee = new ConsultGuarantee();
export default consultGuarantee;