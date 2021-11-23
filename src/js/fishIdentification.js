import fishIdentifyModel from './model/FishIdentifyModel';
import config from '../config/';
import Vue from 'vue';
import { getYMD } from '../utils/time.js';
import store from '../utils/localStorage';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import { alertTitleText} from '../utils/string';
// import nativeEvent from '../utils/nativeEvent';
function fishIdentificationInit (f7, view, page){
    f7.hideIndicator();
    const {
        userName,
        pondNum,
        createTime
    } = page.query;
    const { cacheUserInfoKey } = config;
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const userInfo = store.get(cacheUserInfoKey);
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            isYuerle: false,
            userName: '',
            pondNum: 0,
            createTime: '',
            isYu2leDetail: false,
            isYu2leMain: true
        },
        methods: {
            getYuerle (){
                f7.showIndicator();
                if (isLogin()){
                    getYuerleInfo();
                }else{
                    f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                }
                
            }
        }
    });
    if(userInfo.yu2le){
        vueData.userName = userInfo.yu2le.userName;
        vueData.pondNum = userInfo.yu2le.pondNum;
        vueData.createTime = getYMD(userInfo.yu2le.createTime);
        vueData.isYuerle = true;
    }
    const getYuerleInfo = () =>{
        fishIdentifyModel.postFishIdentify(
            {},
            callback
            );
    };
    const callback = (res) => {
        f7.hideIndicator();
        const {
			code,
			data,
			message
		} = res;
        if(1 == code){
            if(data){
                vueData.userName = data.userName;
                vueData.pondNum = data.pondNum;
                vueData.createTime = getYMD(data.createTime);
                vueData.isYuerle = true;
            }else{
                f7.alert('您不是鱼儿乐用户哦~');
            }
        }else{
            console.log(message);
        }
    };

    if(userName){
        vueData.userName = userName;
        vueData.pondNum = pondNum;
        vueData.createTime = getYMD(createTime);
        vueData.isYu2leDetail = true;
    }
}

export {
	fishIdentificationInit
};
