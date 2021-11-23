import Vue from 'vue';
import config from '../config';
import recordListModel from './model/RecordListModel';
import recordList from '../component/recordList';
import emptyBox from '../component/emptyBox';
import {
    myListSell
} from '../utils/domListenEvent';
function myRecordListInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-my-record-list')[$$('.view-main .pages>.page-my-record-list').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const {
        pageSize
    } = config;
    let pageNo = 1;
    let loading = false;
    const nav = $$($$('.view-main .navbar')[$$('.view-main .navbar').length - 1]);
    let total = nav.find('b');
    /**
     * vue的数据模型
     * */
    Vue.component('record-list-component', recordList);
    Vue.component('empty-box', emptyBox);
    const recordComponent = new Vue({
        el: currentPage.find('.vue-record')[0],
        data: {
            recordList: [],
            isLoading: true,
            recordCount: 0,
            isEmpty: false
        },
        methods: {
            myListSell: myListSell
        }
    });
    new Vue({
        el: currentPage.find('.record-footer')[0],
        data: {
        },
        methods: {
            myListSell: myListSell
        }
    });

    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            total.text(data.total);
            if(pageNo == 1){
                recordComponent.recordList = [];
                if(!data.records.length){
                    recordComponent.isEmpty = true;
                }
            }else{
                recordComponent.isEmpty = false;
            }

            $$.each(data.records, (index, item) => {
                recordComponent.recordList.push(item);
            });
            recordComponent.recordCount = data.length;

            if(data.records.length){
                loading = false;
                if(pageNo == 1 && data.records.length < pageSize){
                    recordComponent.isLoading = false;
                }else{
                    recordComponent.isLoading = true;
                }
            }else{
                loading = true;
                recordComponent.isLoading = false;
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
     * [getRecordsList 获取访客列表数据]
     */
    const getRecordsList = () => {
        recordListModel.getRecordList(
            {
                pageSize,
                pageNo
            },
            callback
        );
    };
    getRecordsList();

    // 下拉刷新
    $ptrContent.on('refresh', () => {
        pageNo = 1;
        loading = false;
        recordComponent.isLoading = true;
        getRecordsList();
    });

    // 上拉加载
    $infinite.on('infinite', function (){
        if(loading){
            return;
        }
        loading = true;
        pageNo++;
        getRecordsList();
    });

}
export{
    myRecordListInit
};
