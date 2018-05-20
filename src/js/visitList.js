import Vue from 'vue';
import store from '../utils/localStorage';
import config from '../config';
import visitorList from '../component/visitList';
import visitListModel from './model/VisitListModel';
import emptyBox from '../component/emptyBox';
function visitListInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-visit-list')[$$('.view-main .pages>.page-visit-list').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const {
        pageSize
    } = config;
    let pageNo = 1;
    let loading = false;
    window.userVue && (window.userVue.visitorCount = 0);
    store.set('visitorCount', 0);
    store.set('userVisitTime', window.parseInt(new Date().getTime() / 1000));
    store.set('visitTime', window.parseInt(new Date().getTime() / 1000));
    window.refreshTabbar && window.refreshTabbar();
    /**
     * vue的数据模型
     * */
    Vue.component('visit-list-component', visitorList);
    Vue.component('empty-box', emptyBox);
    const visitComponent = new Vue({
        el: currentPage.find('.visitList')[0],
        data: {
            visitList: [],
            isLoading: false,
            isShow: false,
            isEmpty: false
        }
    });

    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            if(pageNo == 1){
                visitComponent.visitList = [];
                if(!data.records.length){
                    visitComponent.isEmpty = true;
                }
            }else{
                visitComponent.isEmpty = false;
            }
            $$.each(data.records, (index, item) => {
                visitComponent.visitList.push(item);
            });

            if(data.records.length){
                loading = false;
                if(pageNo == 1 && data.records.length < pageSize){
                    visitComponent.isLoading = false;
                }else{
                    visitComponent.isLoading = true;
                }
            }else{
                loading = true;
                visitComponent.isLoading = false;
            }
        }else{
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('.lazy').trigger('lazy');
        setTimeout(() => {
            currentPage.find('.lazy').trigger('lazy');
        }, 300);
    };

    /*
     * [getVisitList 获取访客列表数据]
     */
    const getVisitList = () => {
        visitListModel.getVisitList(
            {
                pageSize,
                pageNo
            },
            callback
        );
    };
    getVisitList();

    // 下拉刷新
    $ptrContent.on('refresh', () => {
        // visitComponent.visitList = [];
        pageNo = 1;
        loading = false;
        visitComponent.isLoading = false;
        getVisitList();
    });

    // 上拉加载
    $infinite.on('infinite', function (){
        if(loading){
            return;
        }
        loading = true;
        pageNo++;
        getVisitList();
    });

}
export{
    visitListInit
};
