function notFoundInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-not-found')[$$('.view-main .pages>.page-not-found').length - 1]);
    const {errInfo} = page.query;
    errInfo && currentPage.find('.not-found-error-info').text(errInfo || '');
    f7.hideIndicator();
    currentPage.find('.show-other-info')[0].onclick = () => {
        f7.showIndicator();
        if (view.history.length <= 1){
            view.router.load({url: 'views/homeBuy.html'});
        } else {
            view.router.back();
            setTimeout(() => {
                view.router.refreshPage();
                f7.hideIndicator();
            }, 800);
        }
    };
}

export {notFoundInit};
