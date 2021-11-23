import Vue from 'vue';

function submitDealSuccInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-submit-deal .pages>.page-submit-deal-succ')[$$('.view-submit-deal .pages>.page-submit-deal-succ').length - 1]);
    const {infoId, type} = page.query;

    window.strengthShowModel = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {},
        methods: {
            closeDealView (){
                window.mainView.router.refreshPage();
                $$('.view-submit-deal').removeClass('show');
            }
        },
        computed: {
            hrefUrl (){
                return `views/${1 == type ? 'buydetail.html' : 'selldetail.html'}?id=${infoId}`;
            }
        }
    });
}

export{
  submitDealSuccInit
};
