import config from '../../config/';
import store from '../localStorage';

module.exports = {
    setHistory: (str) => {
        const { cacheHistoryKey } = config;
        const history = store.get(cacheHistoryKey) || [];
        // const val = encodeURI(str.replace(/[^\u4E00-\u9FA5]/g, ''));
        const val = str && str.replace('“', '').replace('”', '');

        let isSame = false;
        if (!val){
            return;
        }
        history.forEach((item) => {
            item == val && (isSame = true);
        });
        if(isSame){
            return;
        }
        history.push(val);
        store.set(cacheHistoryKey, history);
    },
    setHistoryClass: (str) => {
        const { cacheClassKey } = config;
        const history = store.get(cacheClassKey) || [];
        // const val = encodeURI(str.replace(/[^\u4E00-\u9FA5]/g, ''));
        const val = str && str.replace('“', '').replace('”', '');

        let isSame = false;
        if (!val){
            return;
        }
        for(let i=0;i<history.length;i++){
            if(history[i]==val){isSame = true}
        }
        if(isSame){
            return;
        }
        history.push(val);
        store.set(cacheClassKey, history);
    }
};
