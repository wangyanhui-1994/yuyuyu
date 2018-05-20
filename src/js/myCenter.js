import store from '../utils/localStorage';
import config from '../config';
import { getAddressIndex } from '../utils/string';
import { logOut, isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';

function myCenterInit (f7, view, page){
    f7.hideIndicator();
    if (!isLogin()){
        view.router.load({
            url: 'views/user.html'
        });
        f7.hideIndicator();
        return;
    }
    const currentPage = $$($$('.view-main .pages>.page-my-center')[$$('.view-main .pages>.page-my-center').length - 1]);
    const { imgPath } = config;
    const userInfo = store.get(config['cacheUserInfoKey']);

    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            userInfo: userInfo
        },
        methods: {
            imgPath: imgPath,
            postHeadPic (){
                nativeEvent.postPic(4);
            },
            selectAddress (){
                const {
                    provinceIndex,
                    cityIndex
                } = getAddressIndex(this.userInfo.provinceName, this.userInfo.cityName);
                nativeEvent.eventChooseAddress(1, provinceIndex, cityIndex);
            },
            logOut (){
                logOut(f7);
            },
            goEditName (){
                view.router.load({
                    url: 'views/editName.html'
                });
            },
            catPic (url){
                nativeEvent.catPic(url);
            }
        },
        computed: {
            getAddress (){
                let res = '请选择';
                if(this.userInfo.provinceName){
                    res = this.userInfo.provinceName + ' ' + this.userInfo.cityName;
                }
                return res;
            }
        }
    });
}

export {
    myCenterInit
};
