import nativeEvent from './nativeEvent';
// import {JsBridge} from '../middlewares/JsBridge';

/**
 *优先使用native存储的数据，如果没有就用h5存储的数据
 * */
module.exports = {
    get: (key) => {
        let value = '';

        if (!key){
            return '';
        }

        const keyArr = ['versionNumber', 'isShowClassroomFunction'];
        if(keyArr.indexOf(key) > -1){
            value = nativeEvent.getDataToNative(key) || '';
        }

        !value && (value = window.localStorage.getItem(key) || '');
        if (value && (value.indexOf('{"') > -1 || value.indexOf('["') > -1)){
            value = JSON.parse(window.localStorage.getItem(key));
        }

        value == '[]' && (value = []);
        value == '{}' && (value = {});
        if (!value){
            value = nativeEvent.getDataToNative(key) || '';
        }

        return value;
    },
    set: (key, val, notCacheNative) => {
        if (!key){
            return;
        }

        let value;
        if (typeof val == 'object'){
            value = JSON.stringify(val);
        } else {
            value = val;
        }

        if(!notCacheNative){
            nativeEvent.setDataToNative(key, val);
        }

        window.localStorage.setItem(key, value);
    },
    remove: (key) => {
        if (window['JS_UMengToCount'] || window['yudada']){
            nativeEvent.setDataToNative(key, '');
        }
        window.localStorage.removeItem(key);
    },
    clear: () => {
        window.localStorage.clear();
    },
    getAll: () => {
        return window.localStorage;
    }
};
