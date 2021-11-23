import Vue from 'vue';
import config from '../config';
import ClassroomModel from './model/ClassroomModel';
function aquaticArticalInit (f7, page){
    f7.hideIndicator();
    const {
        pageSize
    } = config;
    let pageNo = 1;
    const currentPage = $$($$('.view-main .pages>.page-aquatic-artical')[$$('.view-main .pages>.page-aquatic-artical').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            infoList: [],
            loading: false,
            showAll: false
        },
        methods: {
            goToLook (){
                window.mainView.router.load({
                    url: 'views/aquaticClassroom.html',
                    reload: true
                });
            }
        },
        computed: {
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
            $$.each(data, (item) => {
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
    // 二级分类下列表
    // const getSecondCategory = () => {
    //     ClassroomModel.getSecondCategory(id:type,{
    //             pageSize,
    //             pageNo
    //         },
    //         callback
    //     );
    // };
    // getSecondCategory();

    const getUsefulList = () => {
        vueData.loading = true;
        ClassroomModel.getUsefulList({
            pageSize,
            pageNo
        },
        callback
        );
    };
    getUsefulList();

     // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.infoList = [];
        pageNo = 1;
        vueData.loading = false;
        vueData.showAll = false;
        getUsefulList();
    });

     // 上拉加载
    $infinite.on('infinite', function (){
        if(vueData.loading){
            return;
        }
        vueData.loading = true;
        pageNo++;
        getUsefulList();
    });

}

export {
    aquaticArticalInit
};
