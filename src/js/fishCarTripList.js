import config from '../config';
import { fishCar } from '../utils/template';
import { html } from '../utils/string';
import { isLogin } from '../middlewares/loginMiddle';
import FishAboutModel from './model/FishAboutModel';
import {releaseFishViewShow} from './releaseView/releaseFishViews';

function fishCarTripListInit (f7, view, page){
    if (!isLogin()){
        view.router.load({
            url: 'views/user.html'
        });
        f7.hideIndicator();
        return;
    }
    /**
     * @type  1是计划中 2是行程历史
     * */
    let type = 2;
    const currentPage = $$($$('.view-main .pages>.page-my-fish-car-trip')[$$('.view-main .pages>.page-my-fish-car-trip').length - 1]);

    const { pageSize } = config;
    const sellLoad = currentPage.find('.sell-infinite-scroll-preloader');
    const buyLoad = currentPage.find('.buy-infinite-scroll-preloader');
    const showSellAllInfo = currentPage.find('.sell-collection-empty-info');
    const showBuyAllInfo = currentPage.find('.buy-collection-empty-info');

    const sellContent = currentPage.find('.sell-collection-list-info');
    const buyContent = currentPage.find('.buy-collection-list-info');

    const sellEmpty = currentPage.find('.sell-collection-list-empty');
    const buyEmpty = currentPage.find('.buy-collection-list-empty');
    let emptyInfo = sellEmpty;

    let sellPageNo = 1;
    let buyPageNo = 1;
    let pageNo = 1;

    // eslint-disable-next-line
    let isInfinite = false;
    let loading = false;
    let pullToRefresh = false;

    const callback = (data) => {
        const { code } = data;
        let currentPageNo;
        f7.hideIndicator();
        f7.pullToRefreshDone();
        if (code !== 1){
            data.message && f7.alert(data.message);
            return;
        }

        let otehrHtml = '';
        let content, listLength, load;
        if (2 == type){
            content = sellContent;
            load = sellLoad;
            currentPageNo = sellPageNo;
        } else {
            content = buyContent;
            load = buyLoad;
            currentPageNo = buyPageNo;
        }

        listLength = content.children('a').length;
        $$.each(data.data, (index, item) => {
            otehrHtml += fishCar.list(item, true, type == 1);
        });

        if (!pullToRefresh && data.data.length && (currentPageNo != 1)){
            content.append(otehrHtml);
        } else {
            currentPageNo == 1 && html(content, otehrHtml, f7);
        }

        if (data.data.length < pageSize){
            2 == type ? showSellAllInfo.show() : showBuyAllInfo.show();
            load.hide();
        }else{
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            load.show();
        }

        if (!listLength && !data.data.length && currentPageNo == 1){
            2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
            emptyInfo.show();
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

        FishAboutModel.getMyFishTripList({
            pageSize,
            pageNo
        }, {expired: type == 1}, callback);
    };

    /**
     * 获取数据
     * */
    getListInfo();
    currentPage.find('#tab1').on('show', function (){
        window.apiCount('btn_myFishcarRoutes_tab1');
        type = 2;
        !sellContent.children('a').length && getListInfo();
    });

    currentPage.find('#tab2').on('show', function (){
        window.apiCount('btn_myFishcarRoutes_tab2');
        type = 1;
        !buyContent.children('a').length && getListInfo();
    });

    /**
     * 下拉加载
     * */
    currentPage.find('.infinite-scroll').on('infinite', function (){
        if (2 == type ? showSellAllInfo.css('display') == 'block'
            : showBuyAllInfo.css('display') == 'block'){
            return;
        }
        isInfinite = true;
        if (loading) return;

        loading = true;
        pullToRefresh = false;
        type == 2 ? sellPageNo++ : buyPageNo++;
        const pageNo = type == 2 ? sellPageNo : buyPageNo;
        FishAboutModel.getMyFishTripList({
            pageSize,
            pageNo
        }, {expired: type == 1}, callback);
    });

    /**
     * 下拉刷新
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', function (e){
        sellPageNo = 1;
        buyPageNo = 1;
        2 == type ? showSellAllInfo.hide() : showBuyAllInfo.hide();
        emptyInfo = type == 2 ? sellEmpty : buyEmpty;

        pullToRefresh = true;
        emptyInfo.hide();
        isInfinite = false;
        FishAboutModel.getMyFishTripList({
            pageSize,
            pageNo
        }, {expired: type == 1}, callback);
    });

    /**
     * 删除行程
     * */
    currentPage.find('.collection-list-info').click((e) => {
        const ele = e.target || window.event.target;
        if($$(ele).hasClass('delete-trip')){
            const infoId = $$(ele).attr('data-id');
            window.apiCount('btn_myFishcarRoutes_delete');
            f7.confirm(
                '您确定要删除该条行程吗?',
                '删除行程',
                () => {
                    f7.showIndicator();
                    FishAboutModel.deleteMyFishTrip(infoId, (res) => {
                        const {code, message} = res;
                        if(1 == code){
                            f7.alert('删除成功!');
                            $$(ele).parent().parent('.driver-info').remove();
                            // mainView.router.refreshPage();
                        }else{
                            f7.alert(message);
                        }
                        f7.hideIndicator();
                    });
                }
            );
        }
        return;
    });

    /**
     * 点击发布司机行程
     * */
    currentPage.find('.collection-list-empty').children('a').click(() => {
        window.apiCount('btn_myFishcarRoutes_post');
        window.releaseView.router.reloadPage('views/releaseFishCarTrip.html');
        releaseFishViewShow();
    });
}

export {
    fishCarTripListInit
};
