import Vue from 'vue';
import TransactionProcessModel from '../../model/TransactionProcessModel';
import ObjectUtils from '../../../utils/ObjectUtils';
import {getDate} from '../../../utils/time';
import {contactUs} from '../../../utils/domListenEvent';
import nativeEvent from '../../../utils/nativeEvent';
function platformHelpInit (f7, view, page){
    f7.hideIndicator();
    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-platform-help');
    const currentPage = $$(pages[pages.length - 1]);
    const { helpId, isBuyer} = page.query;

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            // 1 卖家    2 买家
            helpInfo: {},
            isBuyer
        },
        methods: {
            contactUs,
            getDate,
            toPayOrder (){
                view.router.load({
                    url: 'views/transactionProcess/myBuyOrder.html?searchType=1'
                });
            },
            delHelp (){
                f7.modal({
                    title: '撤销帮助',
                    text: '您将撤销本次帮助，如果问题未解决，可以再次发起，确定撤销吗？',
                    // verticalButtons: 'true',
                    buttons: [
                        {
                            text: '我再想想',
                            onClick: () => {}
                        },
                        {
                            text: '确定',
                            onClick: () => {
                                f7.showIndicator();
                                TransactionProcessModel.deleteHelp(helpId, (res)=>{
                                    const {
                                        code,
                                        message
                                    } = res;
                                    f7.hideIndicator();
                                    if (1 == code){
                                        window.mainView.router.refreshPreviousPage();
                                        nativeEvent['nativeToast'](1, '本次帮助已撤销~');
                                        setTimeout(window.mainView.router.back, 100);
                                        return;
                                    }
                                    f7.alert(message, '提示');
                                });
                            }
                        }
                    ]
                });
            }
        },
        computed: {
            reasonTypeText (){
                const {reasonType} = this.helpInfo;
                let res = '-';
                1 == reasonType && (res = '未收到货');
                2 == reasonType && (res = '不想要了');
                3 == reasonType && (res = '物流一直未送达');
                4 == reasonType && (res = '货物质量与描述不符');
                5 == reasonType && (res = '数量不够或漏发');
                6 == reasonType && (res = '卖家发错货');
                return res;
            },
            helpState (){
                const {state} = this.helpInfo;
                let res = '-';
                0 == state && (res = '处理中');
                1 == state && (res = '处理完成');
                2 == state && (res = '撤销');
                return res;
            },
            helpDetail (){
                const {state, result} = this.helpInfo;
                let res = `${result}<br>如有疑问请联系客服`;
                2 == isBuyer && 0 == state && (res = '平台正为您处理中');
                1 == isBuyer && 0 == state && (res = '平台正在介入处理，有疑问请联系客服');
                return res;
            },
            userText (){
                const {buyerName, sellerName} = this.helpInfo;
                let text = '卖家';
                let content = `${sellerName}`;
                if (1 == isBuyer){
                    text = '买家';
                    content = `${buyerName}`;
                }
                return {
                    text,
                    content
                };
            }

        },
        filters: {
            getDate
        }
    });
    const callback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        f7.hideIndicator();
        if (1 == code){
            vueData.helpInfo = ObjectUtils.copy(data);
        } else{
            console.log(message);
        }
    };
    const getHelpsDetail = () => {
        TransactionProcessModel.getHelpsDetail({helpId}, callback);
    };
    getHelpsDetail();
}

export {
    platformHelpInit
};
