import customAjax from './customAjax';
import nativeEvent from '../utils/nativeEvent';
/**
 * Rest Api Request Template
 * Created by domicc on 24/02/2017.
 */

export default class RestTemplate{

    /**
     * @url api
     * @headers 需要添加到header的数据
     * @params get传给后台的数据
     * @noCache 是否需要缓存后台返回的数据
     * @isMandatory 是否使用缓存数据
     * */
    static get (url, headers, params, callback, noCache, isMandatory){
        const obj = {
            apiCategory: url,
            header: ['token'],
            type: 'get',
            data: params,
            noCache
        };
        headers && headers['apiVersion'] && (obj.apiVersion = headers['apiVersion']);
        isMandatory && (obj.isMandatory = isMandatory);
        customAjax.ajax(obj, callback);
        // $$.ajax({
        //     method: 'get',
        //     url,
        //     headers,
        //     contentType: 'application/json',
        //     data: params,
        //     cache: false,
        //     processData: true,
        //     crossDomain: true,
        //     success: function (result) {
        //         console.log(result);
        //         callback(JSON.parse(result));
        //     }
        // });
    };

    /**
     * @url api
     * @headers 需要添加到header的数据
     * @params 拼接在url后面的数据
     * @body post传递后台的数据
     * @noCache 是否需要缓存后台返回的数据
     * */
    static post (url, headers, params, body, callback){
        const noCache = !(url && url.indexOf('recommendation') > -1);
        const isMandatory = (url && url.indexOf('recommendation') > -1) ? !!nativeEvent['getNetworkStatus']() : true;
        let obj = {
            apiCategory: url,
            header: ['token'],
            val: params,
            type: 'post',
            data: body,
            paramsType: 'application/json',
            noCache,
            isMandatory
        };
        headers && headers['apiVersion'] && (obj.apiVersion = headers['apiVersion']);
        customAjax.ajax(obj, callback);
    };

    /**
     * @url api
     * @headers 需要添加到header的数据
     * @params 拼接在url后面的数据
     * @body post传递后台的数据
     * @noCache 是否需要缓存后台返回的数据
     * */
    static put (url, headers, params, body, callback){
        customAjax.ajax({
            apiCategory: url,
            header: ['token'],
            val: params,
            type: 'put',
            data: body,
            paramsType: 'application/json',
            noCache: true,
            isMandatory: true
        }, callback);
    };

    static del (url, headers, params, callback){
        customAjax.ajax({
            apiCategory: url,
            header: ['token'],
            val: params,
            type: 'delete',
            data: params,
            paramsType: 'application/json',
            noCache: true,
            isMandatory: true
        }, callback);
    };

}
