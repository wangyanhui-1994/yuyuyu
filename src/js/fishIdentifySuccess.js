import fishIdentifyModel from './model/FishIdentifyModel';
import Vue from 'vue';
import { getYMD } from '../utils/time.js';
function fishIdentifySuccessInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            isYuerle: false,
            userName: '',
            pondNum: 0,
            createTime: ''
        },
        methods: {

        }
    });
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
            vueData.userName = data.userName;
            vueData.pondNum = data.pondNum;
            vueData.createTime = getYMD(data.createTime);
            vueData.isYuerle = true;
        }else{
            console.log(message);
        }
    };
    getYuerleInfo();

}

export {
    fishIdentifySuccessInit
};
