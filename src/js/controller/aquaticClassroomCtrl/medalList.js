import Vue from 'vue';
import store from '../../../utils/localStorage';
import config from '../../../config';
import { getYearWeek } from '../../../utils/time';
function medalListInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-medal-List')[$$('.view-main .pages>.page-medal-List').length - 1]);
    const $nav = $$($$('.view-main .navbar-inner')[$$('.view-main .navbar-inner').length - 1]);
    let medalTitleName = $nav.find('.medal-list-name');
    let {id, userId} = page.query;

    const {
        cacheMedalInfoKey
    } = config;
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
        	hasMedal: false,
            medalInfo: {},
            medalList: store.get(cacheMedalInfoKey) || [],
            userName: false
        },
        methods: {
            getYearWeek: getYearWeek,
            goInfo (item){
            	view.router.load({
                url: `views/aquaticClassroom/medalInfo.html?id=${id}&year=${item.year}&week=${item.weekOfYear}&userId=${userId || ''}&shareId=${item.id}`
            });
            }
        },
        computed: {

        }
    });
    if(userId){
        vueData.userName = true;
    }
    let obj = findObjById(vueData.medalList, id);
    vueData.medalInfo = JSON.parse(JSON.stringify(obj));
    if(vueData.medalInfo.medalCount > 0){
        vueData.hasMedal = true;
    }
     // 根据id获取勋章数组里该对象信息
    function findObjById (arr, target){
        if(!arr.length){
            return;
        }
        for(let i = 0; i < arr.length; i++){
            if(arr[i].id == target){
                return arr[i];
            }
        }
    }

    // navbar名字
    if(vueData.medalInfo){
        medalTitleName.text(vueData.medalInfo.name);
    }

}

export {
    medalListInit
};
