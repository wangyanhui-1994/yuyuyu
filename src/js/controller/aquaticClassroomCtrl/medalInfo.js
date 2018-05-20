import Vue from 'vue';
import store from '../../../utils/localStorage';
import config from '../../../config';
import { getYearWeek } from '../../../utils/time';
import strTool from '../../../utils/strTool';
import ObjectUtils from '../../../utils/ObjectUtils';
function medalInfoInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-medal-info')[$$('.view-main .pages>.page-medal-info').length - 1]);
    const $nav = $$($$('.view-main .navbar-inner')[$$('.view-main .navbar-inner').length - 1]);
    let medalName = $nav.find('.medal-name');
    let {id, year, week, userId, shareId} = page.query;
    const {
        cacheMedalInfoKey,
        url
    } = config;
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            hasMedal: false,
            medalInfo: {},
            medalList: store.get(cacheMedalInfoKey) || [],
            hideCard: false
        },
        methods: {
            getYearWeek: getYearWeek,
            toShare (){
                window.shareInfo = {
                    imgUrl: `${url}/shareImages/medal?userMedalRelId=${shareId}`,
                    type: 1
                };
                $$('.share-to-weixin-model').addClass('on');
            }
        },
        computed: {
            // 处理字符串逗号以前
            splitStart (){
                let str = this.medalInfo.description || '';
                let index = str.indexOf('，');
                if(index > -1){
                    str = str.substring(0, index);
                }
                return str;
            },
            // 处理字符串逗号以后
            splitEnd (){
                let res = '';
                let str = this.medalInfo.description || '';
                let index = str.indexOf('，');
                if(index > -1){
                    res = str.substring(index + 1);
                }
                return res;
            },
            medalTitle (){
                let res = '';
                res = year + '年第' + week + '周' + this.medalInfo.name;
                return res;
            },
            imgSrc (){
                let vm = this;
                let res = `img/medalempty${vm.medalInfo.id}.png`;
                vm.hasMedal && (res = `img/medal${vm.medalInfo.id}.png`);
                return res;
            }
        }
    });
    let obj = strTool.findObjByKey(vueData.medalList, 'id', id);
    vueData.medalInfo = ObjectUtils.copy(obj);
    if(vueData.medalInfo.medalCount > 0){
        vueData.hasMedal = true;
        vueData.hideCard = !!userId;
    }
    // navbar名字
    if(vueData.medalInfo){
        medalName.text(vueData.medalInfo.name);
    }
}

export {
    medalInfoInit
};
