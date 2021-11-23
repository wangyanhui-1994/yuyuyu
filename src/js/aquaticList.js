import Vue from 'vue';
import config from '../config';
import ClassroomModel from './model/ClassroomModel';
function aquaticListInit (f7, view, page){
    f7.hideIndicator();
    const {parentId, secondCategoryId,secondCategoryName} = page.query;
    const {
        pageSize
    } = config;
    let pageNo = 1;
    const classType = [
        {id: 1, val: '水质底质'},
        {id: 3, val: '病害防治'},
        {id: 8, val: '机械药品'},
        {id: 16, val: '内循环'},
        {id: 11, val: '养殖技术'},
        {id: 18, val: '互联网'},
        {id: 20, val: '写欠条'},
        {id: 22, val: '其他'}

    ];
    const currentPage = $$($$('.view-main .pages>.page-aquatic-list')[$$('.view-main .pages>.page-aquatic-list').length - 1]);
    const nav = $$($$('.view-main .navbar-inner')[$$('.view-main .navbar-inner').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    let title = nav.find('.title');
    if(parentId){
        classType.forEach((item) => {
            if(item.id == parentId){
                title.text(item.val);
            }
        });
    }
    if(secondCategoryName){
        title.text(secondCategoryName);
    }
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            secondCategary: [],
            infoList: [],
            loading: false,
            showAll: false
        },
        methods: {
            goSecond (item){
                window.apiCount('cell_education_subCategory');
                window.f7 && window.f7.showIndicator();
                window.mainView && window.mainView.router.load({
                    url: 'views/aquaticList.html?secondCategoryId=' + item.id + '&secondCategoryName=' + item.name
                });
            }
        },
        computed: {
            lineNumer (){
                return parseInt(this.secondCategary.length / 3);
            }
        }
    });

    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            1 == pageNo && (vueData.infoList = []);
            $$.each(data, (index, item) => {
                vueData.infoList.push(item);
            });

            if(data.length){
                vueData.loading = false;
                if(pageNo == 1 && data.length < pageSize){
                    vueData.showAll = true;
                }else{
                    vueData.showAll = false;
                }
            }else{
                vueData.loading = true;
                vueData.showAll = true;
            }
        } else {
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
    };

    // 一级分类下列表
    const getList = () => {
        vueData.loading = true;
        ClassroomModel.getArticleList({
            firstCategoryId: parentId,
            secondCategoryId: secondCategoryId,
            pageSize,
            pageNo
        },
        callback
        );
    };
    getList();

    const secondCategoryCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            $$.each(data, (index, item) => {
                vueData.secondCategary.push(item);
            });
        } else {
            console.log(message);
        }
        f7.hideIndicator();
    };

    // 二级分类
    const getSecondCategory = () => {
        ClassroomModel.getSecondCategory(parentId, {
            parentId
        },
        secondCategoryCallback
        );
    };
    if(parentId){
        getSecondCategory();
    }

     // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.infoList = [];
        pageNo = 1;
        vueData.loading = false;
        vueData.showAll = false;
        getList();
    });

     // 上拉加载
    $infinite.on('infinite', function (){
        if(vueData.loading){
            return;
        }
        vueData.loading = true;
        pageNo++;
        getList();
    });

}

export {
    aquaticListInit
};
