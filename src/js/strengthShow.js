import store from '../utils/localStorage';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import { isLogin } from '../middlewares/loginMiddle';
import Vue from 'vue';
import UserModel from './model/UserModel';

function strengthShowInit (f7, view, page){
    f7.hideIndicator();
    if (!isLogin()){
        view.router.load({
            url: 'views/user.html'
        });
        return;
    }

    const currentPage = $$($$('.view-main .pages>.page-strength-show')[$$('.view-main .pages>.page-strength-show').length - 1]);
    let userInfo = store.get(config.cacheUserInfoKey);
    if(!userInfo.abilityImgList || !userInfo.abilityImgList.length){
        userInfo.abilityImgList = [];
    }
    if(!userInfo.abilityDesc){
        userInfo.abilityDesc = '';
    }

    delete window.strengthShowModel;
    window.strengthShowModel = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            userInfo: userInfo
        },
        methods: {
            postHeadPic (){
                nativeEvent.postPic(5, currentPage.find('.pic-info-img').length, 'userShow', 'postUserShowCallback');
            },
            updateUserInfo (){
                if(!this.userInfo.abilityDesc && (!this.userInfo.abilityImgList || !this.userInfo.abilityImgList.length)){
                    f7.alert('请填写展示信息或者上传展示图片！');
                    return;
                }
                f7.showIndicator();
                UserModel.update({
                    abilityDesc: this.userInfo.abilityDesc || '',
                    abilityImgList: this.userInfo.abilityImgList || []
                }, (res) => {
                    const {code, message} = res;
                    if(1 == code){
                        store.set(config.cacheUserInfoKey, userInfo);
                        view.router.refreshPreviousPage();
                        f7.alert('修改成功！', '温馨提示', () => {
                            view.router.back();
                            setTimeout(() => {
                                view.router.refreshPage();
                            }, 500);
                        });
                    }else{
                        f7.alert(message);
                    }
                    f7.hideIndicator();
                });
            },
            deleteItem (index){
                this.userInfo.abilityImgList.splice(index, 1);
            }
        }
    });
}

export{
  strengthShowInit
};
