import store from '../utils/localStorage';
import config from '../config';
import { home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import customAjax from '../middlewares/customAjax';

function otherListInit (f7, view, page){
    const load = $$('.page-other-list .infinite-scroll-preloader');
    const currentPage = $$($$('.view-main .pages>.page-other-list')[$$('.view-main .pages>.page-other-list').length - 1]);
    const { type, id } = page.query;
    const { pageSize, cacheUserInfoKey } = config;
    const showAllInfo = $$('.page-other-list .filter-search-empty-info');
    let pageNo = 1;
    let isShowAll = false;
    let loading = false;
    let level = store.get(cacheUserInfoKey);
    $$('.other-list-title').text(2 == type ? '正在出售' : '正在求购');
    load.hide();

    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1){
            f7.alert(message, '提示');
            f7.pullToRefreshDone();
            return;
        }
        let otehrHtml = '';
        $$.each(data.data.records, (index, item) => {
            if (2 == type){
                otehrHtml += home.cat(item, level);
            } else {
                otehrHtml += home.buy(item, level);
            }
        });
        showAllInfo.hide();
        if (data.data.records.length && 1 != pageNo){
            $$('.other-list-info').append(otehrHtml);
        } else {
            1 == pageNo && html($$('.other-list-info'), otehrHtml, f7);
        }

        currentPage.find('img.lazy').trigger('lazy');
        f7.hideIndicator();
        f7.pullToRefreshDone();

        if (data.data.records.length < pageSize){
            isShowAll = true;
            load.hide();
            showAllInfo.show();
            loading = true;
        }else{
            load.show();
            isShowAll = false;
            loading = false;
        }
        if (1 == pageNo && !data.data.records.length){
            2 == type ? $$('.my-sell-list-empty').show() : $$('.my-buy-list-empty').show();
            showAllInfo.hide();
        } else {
            $$('.my-sell-list-empty').hide();
            $$('.my-buy-list-empty').hide();
        }

    };

    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'listFiltered',
        data: [id, pageSize, pageNo, type, 1],
        type: 'get'
    }, callback);

    // Attach 'infinite' event handler
    $$('.page-other-list .infinite-scroll').on('infinite', function (){
        if (isShowAll){
            return;
        }
        // Exit, if loading in progress
        if (loading) return;
        // Set loading flag
        loading = true;
        pageNo++;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'listFiltered',
            data: [id, pageSize, pageNo, type, 1],
            type: 'get',
            isMandatory: nativeEvent['getNetworkStatus']()
        }, callback);
    });

    // pull to refresh.
    const ptrContent = $$('.page-other-list .pull-to-refresh-content');
    ptrContent.on('refresh', function (e){
        pageNo = 1;
        showAllInfo.hide();
        isShowAll = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'listFiltered',
            data: [id, pageSize, pageNo, type, 1],
            type: 'get',
            isMandatory: nativeEvent['getNetworkStatus']()
        }, callback);
    });

}

export {
    otherListInit
};
