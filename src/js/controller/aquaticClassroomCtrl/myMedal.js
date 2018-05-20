import Vue from 'vue';
import store from '../../../utils/localStorage';
import config from '../../../config';
import ClassroomModel from '../../model/ClassroomModel';
function myMedalInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-my-medal')[$$('.view-main .pages>.page-my-medal').length - 1]);
    const {
        cacheUserInfoKey,
        cacheMedalInfoKey,
        getMedalKey
    } = config;
    const cacheUserInfo = store.get(cacheUserInfoKey) || {};
    let {userId} = page.query;

    let id = userId ? userId : cacheUserInfo.id;

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            medalList: []
        },
        methods: {
            goMedalInfo (item){
                let url = `views/aquaticClassroom/medalInfo.html?id=${item.id}`;
                if(item.medalCount > 0){
                    if(userId != cacheUserInfo.id){
                        url = `views/aquaticClassroom/medalList.html?id=${item.id}&userId=${userId || ''}`;
                    }else{
                        url = `views/aquaticClassroom/medalList.html?id=${item.id}`;
                    }
                }
                view.router.load({
                    url
                });
            },
            hideEmptyMedal (num){
                let isHide = true;
                if(userId && !num && userId != cacheUserInfo.id){
                    isHide = false;
                }
                return isHide;
            }
        },
        computed: {
        }
    });
    var cache = store.get(cacheMedalInfoKey);
    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            if (data){
                vueData.medalList = [].concat(data);
                store.set(cacheMedalInfoKey, data);
            }
        } else {
            console.log(message);
        }
    };
    const getList = () => {
        ClassroomModel.getMedallList(id, callback);
    };
    getList();
}

export {
    myMedalInit
};
