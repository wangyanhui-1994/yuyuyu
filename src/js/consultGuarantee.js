import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import consultGuarantee from './model/guaranteeModel';


function consultGuaranteeInit (f7, view, page){
    const {url} = config;
    const {id} = page.query;
    const currentPage = $$($$('.view-main .page-consult-guarantee')[$$('.view-main .page-consult-guarantee').length - 1]);
    const $infinite = currentPage.find('.page-content');
    f7.hideIndicator();
    currentPage.find('.guarantee-btn')[0].onclick = () => {
        window.apiCount('btn_assurance_wantToBuy');

        if (isLogin()){
            consult();
        } else {
            loginViewShow();
        }
    }
    const consult = () => {
        f7.showIndicator();
        consultGuarantee.postGuarantee(id, (res) => {
                    const {code, message} = res;
                    f7.hideIndicator();
                    if(1 == code){
                        f7.modal({
                            title:'客服会在24小时内尽快联系你，请保持手机畅通，耐心等待！',
                            buttons:[{
                                text:'我知道啦',
                                onClick: () => {}
                            }]
                        });
                    }else{
                        f7.alert(message);
                    }
                });
    };
}

export{
  consultGuaranteeInit
};
