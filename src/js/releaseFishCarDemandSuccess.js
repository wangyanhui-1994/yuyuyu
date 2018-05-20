import {releaseFishViewHide} from './releaseView/releaseFishViews';

function releaseFishCarDemandSuccessInit (f7, view, page){
    f7.hideIndicator();
    const {
        isDriver,
        contactName,
        departureProvinceName,
        destinationProvinceName,
        date,
        id
    } = page.query;
    const $currentPage = $$($$('.view-release-fish .pages>.page-release-fish-car-demand-success')[$$('.view-release-fish .pages>.page-release-fish-car-demand-success').length - 1]);
    const pageName = window.mainView.activePage.name;
    if(isDriver){
        $currentPage.find('.circular-content').text('请等待货主联系');
        $currentPage.find('p').text('正在通知有需求的货主，请耐心等待');
        pageName == 'fishCarTripList' ? $currentPage.find('.jump-btn').text('查看我的行程')
        : $currentPage.find('.jump-btn').text('去找货主');
        $currentPage.find('.trip-show').show();

    }else{
        pageName == 'myFishCarDemandList' ? $currentPage.find('.jump-btn').text('查看我的需求')
            : $currentPage.find('.jump-btn').text('去找司机');
    }

    $currentPage.find('.jump-btn').click(() => {
        if('fishCar' != window.mainView.activePage.name){
            window.mainView.router.load({
                url: 'views/fishCar.html?isFishCar=1'
            });
        }else{
            window.mainView.router.refreshPage();
        }
        // mainView.router.reloadPage(`views/fishCar.html?isFishCar=${!isDriver}`);
        releaseFishViewHide();
    });

    $currentPage.find('.share-trip').click(() => {
        window.mainView.router.load({
            url: 'views/shareMyTrip.html',
            query: {
                contactName,
                departureProvinceName,
                destinationProvinceName,
                date,
                id
            }
        });
        releaseFishViewHide();
    });
}

export {
    releaseFishCarDemandSuccessInit
};
