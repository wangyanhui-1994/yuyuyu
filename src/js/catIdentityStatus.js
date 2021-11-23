import userUtils from '../utils/viewsUtil/userUtils';
import { cancleIndividual, canclCompany } from '../utils/domListenEvent';
import store from '../utils/localStorage';
import config from '../config';

function catIdentityStatusInit (f7, view, page){
    const { cacheUserInfoKey } = config;
    const userInfo = store.get(cacheUserInfoKey);
    f7.hideIndicator();
    userUtils.getBussesInfoCallback(userInfo);
    // cancle authentication.
    $$('.cancel-individual-verify-buuton').off('click', cancleIndividual).on('click', cancleIndividual);

    $$('.cancel-company-verify-buuton').off('click', canclCompany).on('click', canclCompany);
}

export {
    catIdentityStatusInit
};
