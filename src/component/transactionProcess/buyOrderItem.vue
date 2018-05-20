<template>
    <div class="buyer-order-item" >
        <div class="order-item-head" @click="redirectToUserIndex">
            {{item.sellerName || '匿名用户'}} <i class="iconfont icon-right"></i>
            <span class="order-status">{{orderStatusText}}</span>
        </div>
        <div class="order-item-content" @click="redirectToOrderInfo">
            <img :src="picImg" alt="">
            <div class="order-item-content-center">
                <div class="center-title">{{item.demandProductInfo.fishTypeName}}</div>
                <div class="center-spec">{{specText}}</div>
                <img src="../../build/img/ic_danbaojiaoyi.png" alt="">
            </div>
            <div class="order-item-content-right">
                <div class="order-price">￥{{item.payTotalMoney | orderPriceFormatter}}</div>
                <div class="order-quantity">{{`${item.demandProductInfo.num}${item.demandProductInfo.unitText}`}}</div>
            </div>
        </div>
        <div class="order-item-footer" ref="actionsBox">
            <span v-if="item.helpStatus === 0" @click="viewHelpInfo">帮助情况</span>
            <div v-else>
                <span v-if="item.status == 0" @click="expediting">催卖家发货</span>
                <span v-if="closeStatus" @click="deleteOrder">删除订单</span>
                
                <span class="color" v-if="item.status == 5" @click="callUploadPayment">上传凭证</span>
                <span class="color" v-if="item.status == 1" @click="confirmationReceipt">确认收货</span>
                <span class="bg-color" v-if="item.status == 4" @click="promptPayment">立即付款</span>
            </div>
        </div>
    </div>
</template>

<script>
import {orderPriceFormatter} from '../../utils/strTool'
import TransactionProcessModel from '../../js/model/TransactionProcessModel'
import {callUploadPayment, callAppPay} from '../../js/jsBridge/callHandler'
import nativeEvent from '../../utils/nativeEvent';
    /**
     * 买家订单列表的item
     */
    export default {
        name: 'buyer-order-item',
        data: function() {
            return {};
        },
        props: {
            item: {
                type: Object,
                default: () => {
                    return {
                        demandProductInfo: {
                            fishTypeName: '鲫鱼',
                            imgList: [
                                'https://img.yudada.com/img//20170510/1494407846823_6738.png'
                            ],
                            num: 1000,
                            specifications: "6-8尾",
                            unit: 0,
                            unitText: "斤",
                            quantityTagList:[]
                        },
                        orderStatus: '我的测试状态',
                        payStatus: 0,
                        payTotalMoney: 200,
                        payType: 0,
                        sellerEnterpriseName: "string",
                        sellerName: "老王",
                        sellerPhone: "string",
                        sellerUserId: 286
                    }
                }
            }
        },
        methods: {
            // 跳转到个人主页
            redirectToUserIndex() {
                const vm = this
                window.f7.showIndicator();
                window.mainView.router.load({
                    url: `views/otherIndex.html?currentUserId=${vm.item.sellerUserId}`
                })
            },
            // 跳转到订单详情
            redirectToOrderInfo() {
                const vm = this
                window.f7 && window.f7.showIndicator();
                window.mainView && window.mainView.router.load({
                    url: `views/transactionProcess/orderDetails.html?orderNo=${vm.item.orderNo}`
                });
            },
            // 查看帮助详情
            viewHelpInfo() {
                const vm = this
                window.f7.showIndicator();
                window.mainView && window.mainView.router.load({
                    url: `views/transactionProcess/platformHelp.html?helpId=${vm.item.helpInfo
                        .id}&isBuyer=2`
                });
            },
            // 催买家发货
            expediting() {
                const vm = this
                window.f7.showIndicator();
                TransactionProcessModel.postSellerExpediting({
                    orderNo: vm.item.orderNo
                }, (data) => {
                    const {code,message} = data
                    f7.hideIndicator();
                    if(code == 1){
                        nativeEvent['nativeToast'](1, '卖家已收到提醒~');
                        return;
                    }         
                    f7.alert(message, '提示');
                })
            },
            // 删除订单
            deleteOrder() {
                const vm = this
                f7.modal({
                    title: '删除订单',
                    text: '订单删除后本次交易将无法继续进行，请谨慎操作~',
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
                                TransactionProcessModel.deleteOrder({
                                    orderNo: vm.item.orderNo
                                }, (data) => {
                                    f7.hideIndicator();
                                    const {message, code} = data;
                                    if (1 === code){
                                        window.mainView.router.refreshPage()
                                        nativeEvent['nativeToast'](1, '订单已删除~')
                                        return;
                                    }else{
                                        f7.alert(message, '提示');
                                    }
                                });
                            }
                        }
                    ]
                });
            },
            // 调用native上传凭证
            callUploadPayment() {
                const orderId = this.item.orderNo
                callUploadPayment(orderId)
            },
            // 确认收货
            confirmationReceipt() {
                const vm = this
                f7.modal({
                    title: '确认收货',
                    text: '对收到的货物满意的话就尽快确认收货吧,请确认是本人操作~',
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
                                TransactionProcessModel.confirmationReceipt({
                                    orderNo: vm.item.orderNo
                                }, (data) => {
                                    f7.hideIndicator();
                                    const {message, code} = data;
                                    if (1 === code){
                                        window.mainView.router.refreshPage()
                                        nativeEvent['nativeToast'](1, '交易成功~');
                                        return;
                                    }
                                    f7.alert('提示', message);
                                });
                            }
                        }
                    ]
                });
            },
            // 立即付款
            promptPayment() {
                const orderId = this.item.orderNo
                callAppPay({
                    orderId
                })
            }
        },
        mounted() {
            const vm = this
            setTimeout(() => {
                !$$(vm.$refs.actionsBox).find('span').length && $$(vm.$refs.actionsBox).hide()
            }, 50)
        },
        computed: {
            picImg() {
                let url = ''
                const vm = this
                const {imgList} = vm.item.demandProductInfo || []
                imgList[0] && (url += `${imgList[0]}@1e_1c_2o_0l_110h_110w_90q.src`)
                return url
            },
            orderStatusText() {
                const {status, helpStatus} = this.item
                const closeArr = [3, 7, 8]
                let res = '-'
                0 == status && (res = '待发货')
                1 == status && (res = '待收货')
                2 == status && (res = '交易成功')
                closeArr.indexOf(status) > -1 && (res = '交易关闭')
                4 == status && (res = '待支付')
                5 == status && (res = '等待银行转账')
                6 == status && (res = '转账待确认')

                0 == helpStatus && (res = '平台帮助中')
                return res
            },
            closeStatus(){
                const closeArr = [3, 7, 8]
                return closeArr.indexOf(this.item.status) > -1
            },
            // 规格标签
            specText (){
                let res = '';
                const vm = this;
                res += vm.item.demandProductInfo.quantityTagList && vm.item.demandProductInfo.quantityTagList.length && (vm.item.demandProductInfo.quantityTagList[0]['tagName'] || '') || '';
                res && vm.item.demandProductInfo.specifications && (res = `${res}，${vm.item.demandProductInfo.specifications}`);
                (!res) && vm.item.demandProductInfo.specifications && (res += vm.item.demandProductInfo.specifications);
                return res;
            }
        },
        filters: {
            orderPriceFormatter
        }
    }
</script>

<style lang="less">
    @import '../../less/core/base.less';
    .buyer-order-item{
        margin-bottom: 1rem;
        background: @bg-fff;
        .order-item-head{
            background-image: url('../../build/img/ic_seller.png');
            background-repeat: no-repeat;
            background-size: 18px auto;
            background-position: 15px 8px;
            height: 3.5rem;
            padding: 0.75rem 2rem 0.75rem 4rem;
            position: relative;
            box-sizing: border-box;
            border-bottom: 1px solid @border-da;
            color: @bg-555;
            i{
                color: @text-a9;
                position: relative;
                top: -2px;
            }
            span{
                float: right;
                color: @text-f7;
            }
        }

        .order-item-content{
            padding: 1.5rem 25% 1.5rem 9.5rem;
            box-sizing: border-box;
            height: 10.2rem;
            position: relative;
            & > img{
                display: block;
                width: 7.2rem;
                position: absolute;
                left: 1.5rem;
                top: 1.5rem;
                border-radius: 5px;
            }

            &-right{
                position: absolute;
                text-align: right;
                width: 22%;
                right: 1.5rem;
                top: 1.3rem;
                font-size: 1.3rem;
                color: fade(@bg-555, 50);
                .order-price{
                    color: @themeColor;
                    font-size: 1.5rem;
                }
                & > div{
                    .text-hidden;
                    width: 100%;
                }
            }

            &-center{
                position: relative;
                width: 100%;
                height: 100%;
                img{
                    left: 0;
                    bottom: 0;
                    position: absolute;
                    height: 1.7rem;
                    display: block;
                }
                .center-spec{
                    .text-hidden;
                    width: 100%;
                    left: 0;
                    bottom: 1.8rem;
                    position: absolute;
                    font-size: 1.3rem;
                    color: fade(@bg-555, 50);
                }
                .center-title{
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    color: @bg-555;
                    font-size: 1.5rem;
                    line-height: 1.2;
                }
            }
        }

        .order-item-footer{
            border-top: 1px solid @border-da;
            padding: 1rem 1.5rem;
            text-align: right;
            span{
                padding: 1.3rem 1rem;
                line-height: 0;
                overflow: hidden;
                text-align: center;
                color: @bg-555;
                font-size: 1.5rem;
                border-radius: 1.3rem;
                margin-left: 10px;
                display: inline-block;
                border: 1px solid @btn-bc;
                box-sizing: border-box;
                &.color{
                    color: @text-f7;
                    border-color: @text-f7;
                }
                &.bg-color{
                    background: @text-f7;
                    color: @text-fff;
                    border-color: @text-f7;
                }
            }
        }
    }
</style>
