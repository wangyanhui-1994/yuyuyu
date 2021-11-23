import Vue from 'vue';
import config from '../../../config';
import TransactionProcessModel from '../../model/TransactionProcessModel';

function mySellOrderInit (f7, view, page){
    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-my-sell-order');
    const currentPage = $$(pages[pages.length - 1]);
    /**
     * [$nav 当前导航栏]
     */
    const $nav = $$($$('.view-main .navbar-inner')[$$('.view-main .navbar-inner').length - 1]);
    let navSellName = $nav.find('.sell-name');
    const $ptrContent = currentPage.find('.page-content');
    const { pageSize } = config;
    let {searchType} = page.query;
    // 是否正在请求中
    let isSendAjax = false;
    let pageNo = 1;
    // 筛选类型:0全部,1待发货的
    let type = 0;
    if(searchType){
        type = searchType;
        navSellName.text('待发货');
    }
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            // 是否存在待发货订单
            isHasToBeDelivered: 0,
            // 是否完全显示列表，是就不发送请求
            isShowAll: false,
            // 列表数据
            orderList: [],
            isInitData: false
        },
        methods: {
            toSellOrder (){
                view.router.load({
                    url: 'views/transactionProcess/mySellOrder.html?searchType=1'
                });
            }
        }
    });

    const getOrderList = () => {
        TransactionProcessModel.getMySellOrderList({
            pageNo,
            pageSize,
            type
        }, (res) => {
            const { code, data, message } = res;
            if (1 != code){
                console.log(message);
                return;
            }

            vueData.isInitData = true;
            if (1 == pageNo){
                // 第一页初始化列表数据
                vueData.orderList = data || [];
                // 第一页数据少于10条的情况没翻页，默认处理列表已经没有数据了
                (!data || data.length < 10) && (vueData.isShowAll = true);
            } else {
                vueData.orderList = vueData.orderList.concat(data || []);
                if (!data || !data.length){
                    vueData.isShowAll = true;
                }
            }
            isSendAjax = false;
            pageNo++;
            // 关闭loading层
            f7.hideIndicator();
            // 关闭下拉刷新状态
            f7.pullToRefreshDone();
        });
    };

    getOrderList();

    /**
     * [作为卖家获取待发货订单数]
     * @author [candy]
     */
    const getToBeDeliveredSell = () => {
        TransactionProcessModel.getToBeDeliveredSell((res) => {
            const { code, data, message } = res;
            if (1 != code){
                console.log(message);
                return;
            }
            vueData.isHasToBeDelivered = data;
        });
    };
    if(!searchType){
        getToBeDeliveredSell();
    }
     // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.isShowAll = false;
        vueData.isInitData = false;
        isSendAjax = true;
        pageNo = 1;
        getOrderList();
        if(!searchType){
            getToBeDeliveredSell();
        }
    });
    // 上啦加载分页
    $ptrContent.on('infinite', () => {
        if(isSendAjax || vueData.isShowAll){
            return;
        }
        isSendAjax = true;
        getOrderList();
    });
}

export {
    mySellOrderInit
};
