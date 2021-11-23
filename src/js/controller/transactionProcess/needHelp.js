import Vue from 'vue';
// import store from '../../../utils/localStorage';
// import config from '../../../config';
import TransactionProcessModel from '../../model/TransactionProcessModel';
function needHelpInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-need-help')[$$('.view-main .pages>.page-need-help').length - 1]);
    // 获取当前设备
    const {androidChrome} = window.currentDevice;
    const { isBuyer, orderNo, fishTypeName, numText, specifications, img } = page.query;
    let helpId = '';
    f7.hideIndicator();
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            goodsReceived: false,
            goodsreceivedText: '',
            reasonType: 3,
            reasonTypeText: '',
            remark: '',
            fishTypeName,
            specifications,
            img,
            numText
        },
        methods: {
            submitHelp (){
                if(!this.isPass){
                    return;
                }
                postHelp();

            }
        },
        computed: {
            isPass (){
                return this.goodsreceivedText && this.reasonTypeText;
            }
        }
    });

    // 货物状态选择框绑定
    let stateInitObj = {
        input: currentPage.find('.need-help-state'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                values: ('true false').split(' '),
                displayValues: ('已收到货 未收到货').split(' ')
            }
        ],
        onChange: (a, b, c) => {
            vueData.goodsReceived = false;
            vueData.goodsreceivedText = c[0];
            b[0] === 'true' && (vueData.goodsReceived = true);
            vueData.reasonTypeText = '';
        }
    };
    f7.picker(stateInitObj);

    // 未收到货帮助原因选择框绑定
    let receiveInitObj = {
        input: currentPage.find('.need-help-receive'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                values: ('2 3').split(' '),
                displayValues: ('不想要了 物流一直未送达').split(' '),
                textAlign: 'center'
            }
        ],
        onChange: (a, b, c) => {
            vueData.reasonTypeText = c[0];
            vueData.reasonType = b[0];
        }
    };
    f7.picker(receiveInitObj);
     // 已收到货帮助原因选择框绑定
    let noReceiveInitObj = {
        input: currentPage.find('.need-help-no-receive'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                values: ('4 5 6').split(' '),
                displayValues: ('货物质量与描述不符 数量不够或漏发 卖家发错货').split(' '),
                textAlign: 'center'
            }
        ],
        onChange: (a, b, c) => {
            vueData.reasonTypeText = c[0];
            vueData.reasonType = b[0];
        }
    };
    f7.picker(noReceiveInitObj);

    const postHelp = () => {
        f7.showIndicator();
        TransactionProcessModel.postHelp(orderNo, {
            goodsReceived: vueData.goodsReceived,
            reasonType: vueData.reasonType,
            remark: vueData.remark
        }, (res)=>{
            const {
                    code,
                    message
                } = res;
            if (1 == code){
                f7.hideIndicator();
                window.mainView.router.refreshPreviousPage();
                setTimeout(window.mainView.router.back, 100);
                // f7.alert('本次帮助已提交，请耐心等待客服处理哦~', '温馨提示', window.mainView.router.back);
            } else{
                f7.alert(message, '提示');
            }
        });
    };
}

export {
    needHelpInit
};
