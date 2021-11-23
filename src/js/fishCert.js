import customAjax from '../middlewares/customAjax';
import config from '../config';
import store from '../utils/localStorage';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import { activeLogout } from '../middlewares/loginMiddle';
import { fishCert } from '../utils/template';
import {fishCertAction} from '../utils/domListenEvent';

function fishCertInit (f7, view, page){
    const { cacheUserInfoKey } = config;
    const userInfo = store.get(cacheUserInfoKey);
    if (!userInfo){
        activeLogout();
    }
    $$('.fish-cert-head .button').on('click', () => {
        nativeEvent.postPic(-1, '');
    });

    // get user fish cset list.
    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1){
            f7.alert(message, '提示');
        }
        let listStr = '';
        let num = data.data.list && data.data.list.length > 0 ? data.data.list.length : 0;
        $$.each(data.data.list, (index, item) => {
            listStr += fishCert.certList(item, index);
        });
        html($$('.fish-cert-list'), listStr, f7);
        listStr && $$('.fish-cert-content').addClass('show');
        $$('.user-verification-num').text(num);
        f7.hideIndicator();
    };
    customAjax.ajax({
        apiCategory: 'userInfo',
        header: ['token'],
        api: 'getUserFishCertificateList',
        data: [],
        type: 'get',
        isMandatory: !!nativeEvent.getNetworkStatus()
    }, callback);

    // cat verify cert faild info.
    $$('.fish-cert-list').off('click', fishCertAction).on('click', fishCertAction);

}

export {
    fishCertInit
};
