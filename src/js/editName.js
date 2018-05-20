import store from '../utils/localStorage';
import config from '../config';
import { trim } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
import customAjax from '../middlewares/customAjax';

function editNameInit (f7, view, page){
    f7.hideIndicator();
    const nameInput = $$('.center-edit-name-input');
    const userInfo = store.get(config['cacheUserInfoKey']);
    const editUserNameSubBtn = $$('.center-submit-name');
    const {
        nickname,
        id
    } = userInfo;
    if (userInfo){
        nickname && $$('.page-my-center .my-center-nickname span').text(nickname);
    }

    nickname && (nameInput.val(nickname));
    const getErr = (val) => {
        let err = null;
        if (!val){
            err = '名字不能为空！';
        } else if (val.length > 8){
            err = '名字最大长度位8位！';
        } else if (val == nickname){
            err = '请修改您的名字！';
        }
        return err;
    };
    // edit user name;
    let error = '';
    let isSendInfo = false;
    nameInput[0].oninput = () => {
        const val = trim(nameInput.val());
        error = getErr(val);
        if (!error){
            editUserNameSubBtn.addClass('pass');
        } else {
            editUserNameSubBtn.removeClass('pass');
        }

    };
    const editUserCallback = (data) => {
        const { code, message } = data;
        if (1 == code){
            nativeEvent['nativeToast'](1, message);
            const val = trim(nameInput.val());
            let userInfoChange = userInfo;
            userInfoChange['nickname'] = val;
            store.set(config['cacheUserInfoKey'], userInfoChange);
            $$('.page-my-center').find('.center-name').children('span').text(val);
            $$('.page-user').find('.user-name').children('span').text(val);
            view.router.back();
        } else {
            f7.alert(message, '提示');
        }
        isSendInfo = false;
        editUserNameSubBtn.removeClass('pass');
    };

    // click sub button post user name;
    editUserNameSubBtn[0].onclick = () => {
        const val = trim(nameInput.val());
        error = getErr(val);
        if (isSendInfo || error){
            error && f7.alert(error, '提示');
            return;
        }
        isSendInfo = true;
        customAjax.ajax({
            apiCategory: 'userInfo',
            api: 'updateUserInfo',
            data: [id, val],
            type: 'post',
            noCache: true
        }, editUserCallback);
    };
}

export {
    editNameInit
};
