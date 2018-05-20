import config from '../config';

function babyFishInit (f7, view, page){
    const {mWebUrl} = config;
    const currentPage = $$($$('.view-main .page-baby-fish')[$$('.view-main .page-baby-fish').length - 1]);
    const $infinite = currentPage.find('.page-content');
    f7.hideIndicator();

    var pageNo = 2;
    var $loading = $('.page-baby-fish .list-loading');
    var $loadAll = $('.page-baby-fish .show-all');
    var isShowAll = false;
    var isLoad = false;
    var $listBox = currentPage.find('.baby-fish-list');
    $loading.show();

    const getList = () => {
        $.ajax({
            contentType: 'application/html',
            data: {
                pageNo: pageNo,
                pageSize: 10
            },
            timeout: 15000,
            method: 'GET',
            // url: 'http://localhost:8080/models/babyFishPage',
            url: `${mWebUrl}/models/babyFishPage`,
            success: function (res){
                if (res && res.indexOf('href') > -1){
                    $listBox.append(res);
                    isLoad = false;
                    pageNo++;
                }else{
                    $loading.hide();
                    $loadAll.show();
                    isLoad = false;
                    isShowAll = true;
                }
                f7.hideIndicator();
            }
        });
    };

    const screenHeight = window.screen.height;
    $infinite.scroll((e) => {
        const top = $infinite.scrollTop();
        if(top >= 40){
            $$('.view-main .navbar').addClass("active");
        }else{
            $$('.view-main .navbar').removeClass("active");
        }
        const maxHeight = currentPage.find('.content-box').height();
        if (screenHeight + top >= maxHeight && !isLoad && !isShowAll){
            isLoad = true;
            getList();
        }
    });
}

export{
  babyFishInit
};
