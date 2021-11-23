/**
 * Created by zhongliang.He on 22/11/2017.
 */
import nativeEvent from '../../utils/nativeEvent';
import RestTemplate from '../../middlewares/RestTemplate';

/**
 * Classroom: 在线课堂相关API调用
 */
class Classroom{
    /**
     * [getGuestId 获取游客ID]
     * @param  {[type]}   data     []
     * @param  {Function} callback [Function]
     * @return {[type]}            [Object]
     */
    getGuestId (data, callback){
        RestTemplate.get(
            'random/guestId',
            {},
            data,
            callback,
            false,
            true
        );
    }

    /**
     * [getArticleList 获取在新课堂文章列表]
     * @param  {[type]}   data     [{firstCategoryId, secondCategoryId, fuzzyCondition, pageSize, pageNo}]
     * @param  {Function} callback [FUnction]
     * @return {[type]}            [Object]
     */
    getArticleList (data, callback){
        RestTemplate.get(
            'infos',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

     /**
     * [getStudyInfo 获取在线课堂个人信息]
     * @param  {[type]}   data     [{firstCategoryId, secondCategoryId, fuzzyCondition, pageSize, pageNo}]
     * @param  {Function} callback [FUnction]
     * @return {[type]}            [Object]
     */
    getStudyInfo (data, callback){
        RestTemplate.get(
            'user/study/info',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    // 获取二级分类子列表
    getSecondList (id, data, callback){
        RestTemplate.get(
            `infos/${id}/secondCategory/list`,
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }
    // 获取一级分类子分类
    getSecondCategory (parentId, data, callback){
        RestTemplate.get(
            `categorys/${parentId}`,
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    // 阅读量加1
    putViews (id, data, callback){
        RestTemplate.put(
            `infos/${id}/views`,
            {},
            {},
            data,
            callback
        );
    }

    // 有用
    postUseful (id, data, callback){
        RestTemplate.post(
            `infos/${id}/useful`,
            {},
            {},
            data,
            callback
        );
    }

    // 取消有用
    deleteUseful (id, callback){
        RestTemplate.del(
            `infos/${id}/cancel/useful`,
            {},
            '',
            callback
        );
    }

    // 学习排行榜
    getStudyRank (data, callback){
        RestTemplate.get(
            'infos/study/rank',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    getUsefulList (data, callback){
        RestTemplate.get(
            'infos/useful/list',
            {},
            data,
            callback,
            false,
            !!nativeEvent.getNetworkStatus()
        );
    }

    // 阅读时长
    postViewTimes (data, callback){
        RestTemplate.post(
            'infos/users/study',
            {},
            {},
            data,
            callback
        );
    }

    // 是否有用
    checkArticalUseful (data, callback){
        RestTemplate.get(
            'user/info/useful',
            {},
            data,
            callback,
            false,
            true
        );
    }

    getMedallList (id, callback){
        RestTemplate.get(
            `users/${id}/medals`,
            {},
            {},
            callback,
            false,
            true
        );
    }
}

const classroom = new Classroom();
export default classroom;
