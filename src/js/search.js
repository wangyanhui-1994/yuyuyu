import config from '../config/';
import customAjax from '../middlewares/customAjax';
import { trim, html, saveSelectFishCache } from '../utils/string';
import store from '../utils/localStorage';
import { search } from '../utils/template';
import { setHistory } from '../utils/viewsUtil/searchUtils';

function searchInit (f7, view, page){
    f7.hideIndicator();
    const { type, keyvalue } = page.query;
    const release = page.query.release === 'true';
    const { pageSize, cacheHistoryKey } = config;
    const input = $$('.search-page-input')[$$('.search-page-input').length - 1];
    const clear = $$('b.searchbar-clear');
    const hideVal = $$('.search-val');
    const searchButton = $$('span.search-button');
    const list = $$('.search-return-list');
    // const emptyValInfo = $$('.search-val-empty');
    const searchContent = $$('.search-content');
    const emptyInfo = $$('.search-empty-result');
    let searchHistoryMetadata = store.get(cacheHistoryKey);
    !release && trim(input.value) && searchButton.addClass('on');
    const renderHistory = () => {
        // search list render;
        searchHistoryMetadata = store.get(cacheHistoryKey);
        if (searchHistoryMetadata && searchHistoryMetadata.length){
            let listStr = '';
            $$.each(searchHistoryMetadata, (index, item) => {
                if (!item){
                    return;
                }
                listStr += search.historyLink(item);
            });
            html($$('.search-history-list'), listStr, f7);
            !release && listStr && !input.value ? $$('.serch-history').show() : $$('.serch-history').hide();
            !release && input.value && searchContent.addClass('on');
            input.value && hideVal.find('span').text(`“${trim(input.value)}”`);
        }
    };
    renderHistory();
    const callback = (data) => {
        let listHtml = '';
        release && input.value && (!data.data.length ? emptyInfo.show() : emptyInfo.hide());
        if (!data.data.length){
            html(list, listHtml, f7);
            return;
        }

        $$.each(data.data, (index, item) => {
            listHtml += search.link(item, release, type);
        });
        html(list, listHtml, f7);

    };

    clear.on('click', () => {
        input.value = '';
        clear.removeClass('on');
        hideVal.find('span').html('');
        searchContent.removeClass('on');
        html(list, '', f7);
        emptyInfo.hide();
        searchHistoryMetadata && searchHistoryMetadata.length && !release && $$('.serch-history').show();
    });

    setTimeout(function (){
        input.focus();
    }, 500);

    const inputChenge = () => {
        const val = trim(input.value);
        renderHistory();
        searchHistoryMetadata = store.get(cacheHistoryKey);
        if (!val){
            clear.trigger('click');
            !release && searchHistoryMetadata && searchHistoryMetadata.length && $$('.serch-history').show();
            html(list, '', f7);
        } else {
            hideVal.find('span').html(`“${val}”`);
            !release && searchContent.addClass('on');
            clear.addClass('on');
            $$('.serch-history').hide();
            emptyInfo.hide();
        }
        if (val){
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'getFishTypeList/100',
                data: [val],
                type: 'get',
                noCache: true
            }, callback);
        }
    };
    if(!release && keyvalue && keyvalue !== 'undefined'){
        input.value = keyvalue;
        inputChenge();
    };

    input.oninput = inputChenge;

    // clear history cache;
    $$('.search-clear-history').on('click', () => {
        store.remove(cacheHistoryKey);
        renderHistory();
        $$('.search-history-list').text('');
        $$('.serch-history').hide();
    });

    let isClick = false;
    let hrefFilterPage = () => {
        if (isClick || !trim(input.value)){
            return;
        }
        isClick = true;
        const val = hideVal.find('span').text();

        // searchContent.removeClass('on');
        const query = val ? `?keyvalue=${val}&type=2&pageSize=${pageSize}&search=true` : '';
        view.router.load({
            url: 'views/filter.html' + query,
            reload: true
        });
        setHistory(val);
        setTimeout(() => {
            isClick = false;
        }, 100);

    };

    // load filter;
    hideVal.click(hrefFilterPage);

    searchButton.click(hrefFilterPage);

    input.onkeypress = (e) => {
        const event = e || window.event;
        const val = trim(input.value);
        const code = event.keyCode || event.which || event.charCode;
        if (code == 13){
            if (!val && release){
                emptyInfo.show();
                return;
            }
            event.preventDefault();
            if (release || !val){
                return;
            }
            input.blur();
            searchButton.trigger('click');
            return;
        }
    };

    $$('.search-return-list')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if(ele.tagName != 'A'){
            return;
        }
        const name = $$(ele).attr('data-name');
        const id = $$(ele).attr('data-id');
        // eslint-disable-next-line
        const parant_id = $$(ele).attr('data-parent-id');
        // eslint-disable-next-line
        const parant_name = $$(ele).attr('data-parent-name');
        setHistory(name);
        saveSelectFishCache({
            name,
            id,
            // eslint-disable-next-line
            parant_id,
            // eslint-disable-next-line
            parant_name
        });
    };

    // From the release page to jump over the processing;
    if (release){
        $$('.search-header').addClass('release-select');
    }

}

export {
    searchInit
};
