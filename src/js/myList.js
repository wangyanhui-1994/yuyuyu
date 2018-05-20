import store from '../utils/localStorage';
import config from '../config';
import { home } from '../utils/template';
import nativeEvent from '../utils/nativeEvent';
import { html } from '../utils/string';
import customAjax from '../middlewares/customAjax';
import {isLogin} from '../middlewares/loginMiddle';

function myListInit (f7, view, page){
    if (!isLogin()){
        view.router.load({
            url: 'views/user.html'
        });
        f7.hideIndicator();
        return;
    }
    let type = page.query['type'] || 2;
    const { pageSize, cacheUserInfoKey, shareUrl} = config;
    const currentPage = $$($$('.view-main .pages>.page-my-list')[$$('.view-main .pages>.page-my-list').length - 1]);
    const currentHeader = $$($$('.view-main .navbar>.navbar-inner')[$$('.view-main .navbar>.navbar-inner').length - 1]);

    // eslint-disable-next-line
    const { id, level } = store.get(cacheUserInfoKey) || { id: 1 };
    const sellLoad = currentPage.find('.sell-infinite-scroll-preloader');
    const buyLoad = currentPage.find('.buy-infinite-scroll-preloader');
    const showSellAllInfo = currentPage.find('.sell-collection-empty-info');
    const showBuyAllInfo = currentPage.find('.buy-collection-empty-info');

    const sellContent = currentPage.find('.sell-collection-list-info');
    const buyContent = currentPage.find('.buy-collection-list-info');
    const openGuide = store.get('refreshGuide');

    let sellDate = [];
    let buyDate = [];

    if(!openGuide){
        store.set('refreshGuide', 'true');
        $$('.my-list-guide-model').addClass('on');
    }

    /*
    * 关闭刷新信息引导
    * */
    $$('.my-list-guide-model')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        if(ele.className.indexOf('my-list-guide-model') > -1 || ele.className.indexOf('footer') > -1){
            $$('.my-list-guide-model').removeClass('on');
        }
    };

    const sellEmpty = currentPage.find('.sell-collection-list-empty');
    const buyEmpty = currentPage.find('.buy-collection-list-empty');
    let emptyInfo = sellEmpty;

    let sellPageNo = 1;
    let buyPageNo = 1;

    // eslint-disable-next-line
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;

    const callback = (data) => {
        const { code, message } = data;
        let currentPageNo;
        f7.hideIndicator();
        f7.pullToRefreshDone();
        if (code !== 1){
            console.log('获取我的发信息列表失败！error=' + (message || ''));
            return;
        }

        let otehrHtml = '';
        let content, load;
        if (2 == type){
            content = sellContent;
            load = sellLoad;
            currentPageNo = sellPageNo;
        } else {
            content = buyContent;
            load = buyLoad;
            currentPageNo = buyPageNo;
        }

        $$.each(data.data.records, (index, item) => {
            if (2 == type){
                sellDate.push(item);
                otehrHtml += home.cat(item, level, '', true);
            } else {
                buyDate.push(item);
                otehrHtml += home.buy(item, level, '', true);
            }
        });

        if (!pullToRefresh && data.data.records.length){
            content.append(otehrHtml);
        } else {
            currentPageNo == 1 && html(content, otehrHtml, f7);
        }

        if (data.data.records.length < pageSize){
            2 == type ? showSellAllInfo.show() : showBuyAllInfo.show();
            load.hide();
        }else{
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            load.show();
        }

        if (1 == currentPageNo && !data.data.records.length){
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            emptyInfo.show();
            load.hide();
        } else {
            emptyInfo.hide();
        }
        pullToRefresh = false;
        isInfinite = false;
        loading = false;
        currentPage.find('img.lazy').trigger('lazy');
    };

    const getListInfo = () => {
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        isInfinite = false;
        pullToRefresh = false;
        loading = false;

        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, pageNo, type],
            type: 'get',
            isMandatory: nativeEvent['getNetworkStatus']()
        }, callback);
    };

    // get list for service;
    // getListInfo();
    currentPage.find('#tab1').on('show', function (){
        type = 2;
        currentHeader.find('.center').text('我的出售');
        !sellContent.children('a').length && getListInfo();
    });

    currentPage.find('#tab2').on('show', function (){
        type = 1;
        currentHeader.find('.center').text('我的求购');
        !buyContent.children('a').length && getListInfo();
    });

    f7.showTab(2 == type ? '#tab1' : '#tab2');
    const tabIndex = 2 == type ? 0 : 1;
    currentHeader.find('.tab-link').removeClass('active').eq(tabIndex).addClass('active');

    currentPage.find('.infinite-scroll').on('infinite', function (){
        if (2 == type ? showSellAllInfo.css('display') == 'block'
            : showBuyAllInfo.css('display') == 'block'){
            return;
        }
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        isInfinite = true;
        // Exit, if loading in progress
        if (loading) return;

        // Set loading flag
        loading = true;
        pullToRefresh = false;
        type == 2 ? sellPageNo++ : buyPageNo++;
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, pageNo, type],
            type: 'get',
            isMandatory
        }, callback);
    });

    // pull to refresh.
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', function (e){
        type == 2 ? (sellPageNo = 1) : (buyPageNo = 1);
        type == 2 ? (sellDate = []) : (buyDate = []);
        const isMandatory = !!nativeEvent['getNetworkStatus']();
        2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        pullToRefresh = true;
        emptyInfo.hide();
        isInfinite = false;
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'mine',
            header: ['token'],
            data: [pageSize, 1, type],
            type: 'get',
            isMandatory
        }, callback);
    });

    let activeInfoId = null;
    // refresh and share info.
    const refreshCallback = (data) => {
        const {code, message} = data;
        if(1 == code){
            $$('span.refresh-btn[data-id="' + activeInfoId + '"]').addClass('disabled').text('今日已刷新');
            nativeEvent.nativeToast(1, `今天刷新信息次数还剩${data.data}次!`);
        }else{
            nativeEvent.nativeToast(0, message);
        }
    };

    // const {device} = f7;
    currentPage.find('.tabs.swiper-wrapper')[0].onclick = (e) => {
        const ele = e.target || window.event.target;
        // refresh info
        if(ele.className.indexOf('refresh-btn') > -1 && $(ele).attr('data-id') && ele.className.indexOf('disabled') == -1){
            const clickInfoId = $(ele).attr('data-id');
            window.apiCount('btn_refreshInfo');
            activeInfoId = clickInfoId;
            customAjax.ajax({
                apiCategory: 'demandInfo',
                api: 'refreshLog',
                header: ['token'],
                paramsType: 'application/json',
                data: [clickInfoId, 'refresh'],
                val: {
                    id: clickInfoId,
                    action: 'refreshLog'
                },
                type: 'POST',
                isMandatory: true
            }, refreshCallback);
        }
        // share info
        if(ele.className.indexOf('sell-list-share') > -1 && $(ele).attr('data-id')){
            const infoType = $(ele).attr('data-type');
            const itemId = $(ele).attr('data-id');
            let listItem = null;
            $$.each(2 == infoType ? sellDate : buyDate, (index, item) => {
                item && item.id == itemId && (listItem = item);
            });

            let title = '';
            let shareImg;

            const {
                specifications,
                stock,
                provinceName,
                cityName,
                fishTypeName,
                quantityTags,
                imgePath,
                imgs,
                description
            } = listItem;

            if(1 == infoType){
                shareImg = imgePath;
            }else{
                imgs && JSON.parse(imgs).length ? (shareImg = JSON.parse(imgs)[0]) : (shareImg = imgePath);
            }
            title += `【${2 == infoType ? '出售' : '求购'}】${fishTypeName}, ${provinceName || ''}${cityName || ''}`;
            let descriptionText = '';
            if(listItem.title){
                descriptionText += `${listItem.title}，`;
            }
            descriptionText += stock ? `数量${stock}，` : '';
            // descriptionText += price ? `${'价格' + price}，` : '';
            if(!specifications && (!quantityTags || !JSON.parse(quantityTags).length)){
                descriptionText += '';
            }else if(specifications && quantityTags && JSON.parse(quantityTags).length){
                descriptionText += `${'规格' + (specifications + (quantityTags && JSON.parse(quantityTags).length ? ('，' + JSON.parse(quantityTags)[0].tagName) : ''))}，`;
            }else{
                descriptionText += `${'规格' + (specifications || (quantityTags && JSON.parse(quantityTags).length ? JSON.parse(quantityTags)[0].tagName : ''))}，`;
            }
            descriptionText += description || '';
            descriptionText += '点击查看更多信息~';

            window.shareInfo = {
                title,
                webUrl: `${shareUrl}${listItem.id}`,
                imgUrl: shareImg,
                description: descriptionText
            };
            $$('.share-to-weixin-model').addClass('on');
        }
    };
}

export {
    myListInit
};
