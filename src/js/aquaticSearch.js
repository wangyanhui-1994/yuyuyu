import Vue from 'vue';
import config from '../config/';
import store from '../utils/localStorage';
import { trim } from '../utils/string';
import { setHistoryClass } from '../utils/viewsUtil/searchUtils';
import ClassroomModel from './model/ClassroomModel';
function aquaticSearchInit (f7, view, page){
    f7.hideIndicator();
    const { pageSize, cacheClassKey } = config;
    let pageNo = 1;
    const {search} = page.query;
    const currentPage = $$($$('.view-main .pages>.page-aquatic-search')[$$('.view-main .pages>.page-aquatic-search').length - 1]);
    const $nav = $$('.view-main .navbar-inner').eq($$('.view-main .navbar-inner').length - 1);
    const input = $nav.find('.search-page-input')[0];
    const searchButton = $nav.find('.search-button')[0];
    // const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            listStr: [],
            isCache: false,
            fuzzyCondition: '',
            infoList: [],
            isClear: false,
            loading: false,
            searchVal: search,
            showAll: false
        },
        methods: {
            clearSearch (item){
                let cachelist = [];
                cachelist = store.get(cacheClassKey);
                let index = cachelist.indexOf(item);
                if (index > -1){
                    cachelist.splice(index, 1);
                }
                store.set(cacheClassKey, cachelist);
                this.listStr = cachelist;
            }
        },
        computed: {
        }
    });
    let searchHistoryClassdata = store.get(cacheClassKey) || [];
    const renderHistory = () => {
        // search list render;
        searchHistoryClassdata = store.get(cacheClassKey) || [];
        if (searchHistoryClassdata && searchHistoryClassdata.length){
            $$.each(searchHistoryClassdata, (index, item) => {
                if (!item){
                    return;
                }
                vueData.listStr.unshift(item);
            });
        }
        if(vueData.listStr.length){
            vueData.isCache = true;
        }
    };
    renderHistory();

    input.onkeypress = (e) => {
        const event = e || window.event;
        const val = trim(input.value);
        const code = event.keyCode || event.which || event.charCode;
        vueData.searchVal = input.value;
        if (code == 13){
            pageNo = 1;
            vueData.loading = false;
            vueData.showAll = false;
            vueData.listStr = [''];
            vueData.infoList = [];
            if (!val){
                return;
            }
            event.preventDefault();
            input.blur();
            getSearchList();
            return;
        }
    };

    const searchCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            f7.hideIndicator();
            if(data.length){
                vueData.loading = false;
                if(pageNo == 1){
                    vueData.infoList = [];
                }else{
                    vueData.showAll = false;
                }
                vueData.infoList = [].concat(vueData.infoList, data);

                if (data.length <= 10){
                    vueData.loading = true;
                    vueData.showAll = true;
                }
            }else{
                vueData.loading = true;
                vueData.isCache = true;
                vueData.showAll = true;
                !vueData.infoList.length && (vueData.listStr = ['']);
            }

        } else {
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
        vueData.loading = false;
    };

    // 获取搜索文章列表
    const getSearchArtical = () => {
        ClassroomModel.getArticleList({
            fuzzyCondition: vueData.fuzzyCondition,
            pageSize,
            pageNo
        },
            searchCallback
        );
    };

    !search && setTimeout(function (){
        input.focus();
    }, 600);

    let isClick = false;
    let getSearchList = () => {
        f7.showIndicator();
        if (isClick || !trim(input.value)){
            if (!trim(input.value)){
                vueData.listStr = [''];
                vueData.infoList = [];
            }
            f7.hideIndicator();
            return;
        }
        isClick = true;
        setHistoryClass(input.value);
        vueData.listStr = [];
        vueData.isClear = true;
        vueData.fuzzyCondition = input.value;
        getSearchArtical();
        setTimeout(() => {
            isClick = false;
        }, 100);

    };

    searchButton.onclick = getSearchList;

    if(search){
        input.blur();
        input.value = search;
        vueData.listStr = [];
        vueData.isClear = true;
        vueData.fuzzyCondition = input.value;
        getSearchArtical();
    }

     // 下拉刷新
    // $ptrContent.on('refresh', () => {
    //     vueData.infoList = [];
    //     pageNo = 1;
    //     vueData.loading = false;
    //     vueData.showAll = false;
    //     if(input.value){
    //         getSearchArtical();
    //     }
    // });
     // 上拉加载
    $infinite.on('infinite', function (){
        if(vueData.loading || !input.value || vueData.showAll){
            return;
        }
        vueData.loading = true;
        pageNo++;
        getSearchArtical();
    });

}

export {
    aquaticSearchInit
};
