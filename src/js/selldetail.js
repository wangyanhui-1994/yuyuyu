import config from '../config';
import customAjax from '../middlewares/customAjax';
import store from '../utils/localStorage';
import {timeDifference, getMarketTimeStr, getYmdTime} from '../utils/time';
import recordListModel from './model/RecordListModel';
import {
    saveSelectFishCache,
    getRange,
    getAddressIndex,
    alertTitleText,
    getCertInfo
} from '../utils/string';

import nativeEvent from '../utils/nativeEvent';
import {detailClickTip, goIdentity} from '../utils/domListenEvent';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import CountModel from './model/count';
import Vue from 'vue';
import InfoDetail from './model/InfoDetail';
import {createURL} from '../utils/strTool';

function selldetailInit (f7, view, page){
    const {id} = page.query;
    const currentPage = $$($$('.view-main .pages>.page-selldetail')[$$('.view-main .pages>.page-selldetail').length - 1]);
    const lastHeader = $$($$('.view-main .navbar>div.detail-text')[$$('.view-main .navbar>div.detail-text').length - 1]);
    const {shareUrl, cacheUserInfoKey, mWebUrl, imgPath} = config;
    const userInfo = store.get(cacheUserInfoKey);
    const locaUserId = userInfo && userInfo.id;
    const {
        pageSize
    } = config;
    let pageNo = 1;

    // 如果没有定位信息，进入信息详情请求获取定位信息
    if(!window['addressObj']){
        nativeEvent.getAddress();
    }

    /*
    * 点击收藏信息
    * */
    const collectionCallback = (data) => {
        const {code} = data;
        if (8 == code){
            nativeEvent['nativeToast'](0, '您已收藏过该资源!');
        } else if (1 !== code){
            const info = footVue.favorite ? '添加收藏失败，请重试！' : '取消收藏失败，请重试！';
            nativeEvent['nativeToast'](0, info);
            footVue.favorite = !footVue.favorite;
        } else {
            let info;
            let collectionNum = Number($$('.user-collection-num').text());
            if (footVue.favorite){
                info = '添加收藏成功！';
                $$('.user-collection-num').text(++collectionNum);
            } else {
                info = '取消收藏成功！';
                $$('.user-collection-num').text(--collectionNum);
                $$('div[data-page="myCollection"]').find('a[href="./views/selldetail.html?id=' + id + '"]').remove();
            }
            nativeEvent['nativeToast'](1, info);
        }
        f7.hideIndicator();
    };

    const footVue = new Vue({
        el: currentPage.find('.selldetail-footer')[0],
        data: {
            isMineInfo: false,
            userInfo: {},
            demandInfo: {},
            certList: {},
            favorite: '',
            isReview: false,
            isVerify: false,
            isDelete: false,
            isGuaranteed: false,
            isLogin: isLogin(),
            isIos: window.currentDevice.ios,
            demandGuaranteed: false
        },
        methods: {
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            catRejectInfo (){
                window.apiCount('btn_rejectReason');
                f7.alert(this.demandInfo.refuseDescribe, '查看原因');
            },
            callPhone (){
                window.apiCount('btn_call');
                nativeEvent.contactUs(this.demandInfo.requirementPhone);
                CountModel.phoneCount({
                    entry: 1,
                    phone: this.demandInfo.requirementPhone
                }, (res) => {
                    const {code} = res;
                    if(1 !== code){
                        console.log('发送统计失败！');
                    }
                });
            },
            deleteInfo (){
                window.apiCount('btn_delete');
                f7.confirm('你确定删除出售信息吗？', '删除发布信息', () => {
                    f7.showIndicator();
                    customAjax.ajax({
                        apiCategory: 'demandInfo',
                        api: 'deleteDemandInfo',
                        header: ['token'],
                        paramsType: 'application/json',
                        val: {
                            id
                        },
                        type: 'DELETE',
                        noCache: true
                    }, (data) => {
                        const {code, message} = data;
                        f7.hideIndicator();
                        f7.alert(message || '删除成功', '提示', () => {
                            if (1 == code){
                                const sellNum = parseInt($$('.user-sell-num').eq($$('.user-sell-num').length - 1).text(), 10) - 1;
                                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').next('div.list-check-status').remove();
                                $$('.page-my-list a[href="./views/selldetail.html?id=' + id + '"]').remove();
                                $$('.user-sell-num').text(sellNum <= 0 ? 0 : sellNum);
                                view.router.back();
                                view.router.refreshPage();
                            }
                        });
                    });
                });
            },
            shareInfo (){
                if (!store.get('isWXAppInstalled')){
                    f7.alert('分享失败');
                    return;
                }
                window.apiCount('btn_share');
                let title = '';
                const shareImg = currentPage.find('.sell-detail-img>img').attr('src');
                const {
                    specifications,
                    stock,
                    provinceName,
                    cityName,
                    fishTypeName,
                    description,
                    quantityTags
                } = this.demandInfo;

                title += `【出售】${fishTypeName}, ${provinceName || ''}${cityName || ''}`;
                let descriptionText = '';
                if (this.demandInfo.title){
                    descriptionText += `${this.demandInfo.title}，`;
                }
                descriptionText += stock ? `${'数量' + stock}，` : '';
                // descriptionText += price ? `${'价格' + price}，` : '';
                if(!specifications && (!quantityTags || !JSON.parse(quantityTags).length)){
                    descriptionText += '';
                }else if(specifications && quantityTags && JSON.parse(quantityTags).length){
                    descriptionText += `${'规格' + (specifications + (quantityTags && JSON.parse(quantityTags).length ? ('，' + JSON.parse(quantityTags)[0].tagName) : ''))}，`;
                }else{
                    descriptionText += `${'规格' + (specifications || (quantityTags && JSON.parse(quantityTags).length ? JSON.parse(quantityTags)[0].tagName : ''))}，`;
                }
                descriptionText += description || '';
                descriptionText += '点击查看更多信息~';

                window.shareInfo = {
                    title,
                    webUrl: `${shareUrl}${id}`,
                    imgUrl: shareImg,
                    description: descriptionText
                };
                $$('.share-to-weixin-model').addClass('on');
            },
            collectionAction (){
                window.apiCount('btn_favorite');
                if (!nativeEvent['getNetworkStatus']()){
                    nativeEvent.nativeToast(0, '请检查您的网络！');
                    f7.pullToRefreshDone();
                    f7.hideIndicator();
                    return;
                }
                if (!isLogin()){
                    f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                    return;
                }
                const httpType = this.favorite ? 'DELETE' : 'POST';
                this.favorite = !this.favorite;

                customAjax.ajax({
                    apiCategory: 'favorite',
                    api: 'demandInfo',
                    header: ['token'],
                    val: {
                        id
                    },
                    noCache: true,
                    type: httpType
                }, collectionCallback);
            },
            refreshInfo (){
                InfoDetail.refreshInfo(this.demandInfo.id, (res) => {
                    const {code} = res;
                    if(1 == code){
                        nativeEvent.nativeToast(1, '刷新成功！');
                        this.demandInfo.sort = parseInt(new Date().getTime() / 1000, 10);
                    }else{
                        nativeEvent.nativeToast(0, '一条信息每天只能刷新一次哟！');
                    }
                });
            },
            tipInfo (){
                f7.alert('您今天已经刷新过该条信息！');
            },
            /**
             * [purchaseAction 立即购买按钮, 打开交易流程视图跳转到采购单页面]
             */
            purchaseAction (){
                window.apiCount('btn_infoDetail_buy');
                if (!isLogin()){
                    f7.alert(alertTitleText(), '温馨提示', loginViewShow);
                    return;
                }
                let paramObj = {};
                paramObj.demandId = sellVue.demandInfo.id;
                paramObj.img = sellVue.demandInfo.imgePath;
                if(JSON.parse(sellVue.demandInfo.imgs).length){
                    paramObj.img = JSON.parse(sellVue.demandInfo.imgs)[0];
                }
                paramObj.quantityTags = sellVue.specText;
                paramObj.fishTypeName = sellVue.demandInfo.fishTypeName;
                paramObj.contactName = sellVue.demandInfo.contactName;
                let url = createURL('views/transactionProcess/purchaseOrder.html', paramObj);
                f7.showIndicator();
                window.payFlowView.router.load({
                    url,
                    reload: true
                });
                $$('.view-pay-flow').addClass('show');
                // m站担保咨询问题链接
                // window.mainView.router.load({
                //     url: `${mWebUrl}consultGuarantee?id=${id}`
                // });
            }
        },
        computed: {
            isRefresh (){
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth() + 1;
                const day = today.getDate();
                const currentDate = new Date(`${year}/${month}/${day}`);

                let res = (this.demandInfo.sort - parseInt(currentDate / 1000, 10)) > 0;
                if(this.demandInfo.createTime && (this.demandInfo.createTime == this.demandInfo.sort)){
                    res = false;
                }
                return res;
            }
        }
    });

    const sellVue = new Vue({
        el: currentPage.find('.sell-vue-box')[0],
        data: {
            isMineInfo: false,
            userInfo: {},
            demandInfo: {},
            certList: {},
            favorite: '',
            demandInfoSale: {},
            isLogin: isLogin(),
            currentUserInfo: store.get(cacheUserInfoKey) || {},
            recordList: [],
            yu2le: {},
            demandGuaranteed: false
        },
        methods: {
            timeDifference: timeDifference,
            getCertInfo: getCertInfo,
            imgPath: imgPath,
            getYmdTime: getYmdTime,
            getMarketTimeStr: getMarketTimeStr,
            catCert (url){
                nativeEvent.catPic(url);
            },
            goAuthPage (){
                window.apiCount('btn_infoDetail_goVerify');
                goIdentity();
            },
            pointUp (){
                if(!isLogin()){
                    f7.alert(alertTitleText(), loginViewShow);
                    return;
                }
                window.apiCount('btn_infoDetail_myMember');
                window.mainView.router.load({
                    url: `${mWebUrl}user/member/${userInfo.id}?time=${new Date().getTime()}`
                });
            },
            catPic (url){
                nativeEvent.catPic(url);
            },
            submitDeal (){
                window.apiCount('btn_infoDetail_postTrades');
                window.subDealView.router.load({
                    url: `./views/dealInfo.html?type=${this.demandInfo.type}&infoId=${this.demandInfo.id}&fishId=${this.demandInfo.fishTypeId}&fishName=${this.demandInfo.fishTypeName}&fishParentId=${this.demandInfo.fishParentTypeId}&fishParentName=${this.demandInfo.fishParentTypeName}`,
                    reload: true
                });
                $$('.view-submit-deal').addClass('show');
            },
            fishIdentify (){
                window.apiCount('btn_infoDetail_hintAI');
                window.mainView.router.load({
                    url: `views/fishIdentification.html?userName=${this.yu2le.userName}&pondNum=${this.yu2le.pondNum}&createTime=${this.yu2le.createTime}`
                });
            },
            levelArray (level){
                let levelArray = [];
                for(let i = 0;i < level;i++){
                    levelArray.push(1);
                }
                return levelArray;
            },
            consultMore (){
                window.apiCount('btn_infoDetail_learnAssurance');
                window.mainView.router.load({
                    url: `./views/fishGuranteeInfo.html?id=${id}`
                });
            }
        },
        computed: {
            getRangeText (){
                const {lat, lng} = getAddressIndex(this.demandInfo.provinceName, this.demandInfo.cityName);
                const rangeText = getRange(lat, lng);
                let res = '';
                if (rangeText > 0){
                    res = rangeText;
                }
                return res;
            },
            getImgUrl (){
                let res = '';
                if(this.demandInfo.imgs && JSON.parse(this.demandInfo.imgs).length){
                    res += JSON.parse(this.demandInfo.imgs)[0];
                }else{
                    res += this.demandInfo.imgePath;
                }
                res += '?x-oss-process=image/resize,m_fill,h_200,w_400';
                return res;
            },
            specText (){
                let res = '';
                res += this.demandInfo.quantityTags && JSON.parse(this.demandInfo.quantityTags).length && (JSON.parse(this.demandInfo.quantityTags)[0]['tagName'] || '') || '';
                res && this.demandInfo.specifications && (res = `${res}，${this.demandInfo.specifications}`);
                (!res) && this.demandInfo.specifications && (res += this.demandInfo.specifications);
                return res;
            },
            descriptionTags (){
                let res = '';
                if(this.demandInfo.descriptionTags && JSON.parse(this.demandInfo.descriptionTags).length){
                    res = JSON.parse(this.demandInfo.descriptionTags);
                }
                return res;
            },
            getPrice (){
                let res = '';
                // const userInfo = store.get(cacheUserInfoKey) || {};
                if(this.demandInfoSale.lowerPrice && this.demandInfoSale.expectedPrice){
                    res = `${this.demandInfoSale.lowerPrice}-${this.demandInfoSale.expectedPrice}`;
                }else{
                    res = this.demandInfoSale.expectedPrice || this.demandInfoSale.lowerPrice || '';
                }
                !this.demandInfoSale.lowerPrice && !this.demandInfoSale.expectedPrice && (res = '价格面议');
                // if(isLogin()){
                //     const userInfo = store.get(cacheUserInfoKey) || {};
                //     if(userInfo.nameAuthentication || this.isMineInfo){
                //         if(this.demandInfoSale.lowerPrice && this.demandInfoSale.expectedPrice){
                //             res = `${this.demandInfoSale.lowerPrice}-${this.demandInfoSale.expectedPrice}`;
                //         }else{
                //             res = this.demandInfoSale.expectedPrice || this.demandInfoSale.lowerPrice || '';
                //         }
                //     }
                //     !this.demandInfoSale.lowerPrice && !this.demandInfoSale.expectedPrice && (res = '价格面议');
                // }else{
                //     !this.demandInfoSale.lowerPrice && !this.demandInfoSale.expectedPrice && (res = '价格面议');
                //     (this.demandInfoSale.lowerPrice || this.demandInfoSale.expectedPrice) && (res = '');
                // }
                return res;
            },
            isShowDeal (){
                let res = false;
                if(this.isMineInfo &&
                   !this.demandInfo.closed &&
                    (1 == this.demandInfo.state)){
                    res = true;
                    if((this.demandInfoSale && (this.demandInfoSale.marketTime * 1000 > new Date().getTime()))){
                        res = false;
                    }
                }
                return res;
            }
        }
    });

    /*
    * 拿到数据，编辑页面
    * */
    const callback = (data) => {
        if (1 == data.code){
            const {
                userInfo,
                demandInfo,
                // eslint-disable-next-line
                user_ishCertificate_list,
                favorite,
                demandInfoSale,
                yu2le,
                demandGuaranteed
            } = data.data;

            sellVue.userInfo = userInfo;
            sellVue.demandInfo = demandInfo;
            sellVue.yu2le = yu2le;
            // eslint-disable-next-line
            sellVue.certList = user_ishCertificate_list;
            sellVue.favorite = favorite;
            sellVue.isMineInfo = (locaUserId == demandInfo.userId);
            sellVue.demandGuaranteed = demandGuaranteed;

            if(demandInfoSale){
                sellVue.demandInfoSale = demandInfoSale;
            }

            footVue.demandInfo = demandInfo;
            footVue.favorite = favorite;
            footVue.isMineInfo = (locaUserId == demandInfo.userId);
            footVue.isGuaranteed = demandGuaranteed;
            if(0 == demandInfo.state){
                footVue.isReview = true;
            }

            if(2 == demandInfo.state){
                footVue.isVerify = true;
            }

            if(demandInfo.userId == locaUserId){
                footVue.isDelete = true;
            }

            const {
                fishTypeName,
                fishParentTypeName,
                fishTypeId,
                fishParentTypeId,
                state
            } = demandInfo;
            lastHeader.find('a.detail-more').show();

            if (state == 0 || state == 2){
                lastHeader.find('a.detail-more').hide();
                lastHeader.find('right').css('paddingRight', '3rem');
            }
            let addClassName = (1 == state && 'active') || (0 == state && 'review') || (2 == state && 'faild') || null;
            addClassName && currentPage.addClass(addClassName);

            /*
             * 存入最近使用鱼种
             * */
            saveSelectFishCache({
                name: fishTypeName,
                id: fishTypeId,
                // eslint-disable-next-line
                parant_id: fishParentTypeId,
                // eslint-disable-next-line
                parant_name: fishParentTypeName
            });
        }
        currentPage.find('img.lazy').trigger('lazy');
        f7.hideIndicator();
        f7.pullToRefreshDone();
    };

    /*
    * 初始化获取数据跟刷新数据
    * */
    const ptrContent = currentPage.find('.sell-detail-refresh');
    const initData = () => {
        customAjax.ajax({
            apiCategory: 'demandInfo',
            api: 'getDemandInfo',
            data: [id],
            header: ['token'],
            val: {
                id
            },
            type: 'get',
            isMandatory: !!nativeEvent.getNetworkStatus()
        }, callback);
    };
    initData();
    ptrContent.on('refresh', initData);

    /*
    * 点击右上角nav，选择分享或者举报
    * */
    lastHeader.find('.detail-more')[0] && (lastHeader.find('.detail-more')[0].onclick = detailClickTip);

    const recordCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            $$.each(data.records, (index, item) => {
                sellVue.recordList.push(item);
            });
        }else{
            console.log(message);
        }
    };
    /*
     * [getDetailRecordsList 获取成交列表数据]
     */
    let demandId = window.parseInt(id);
    const getDetailRecordsList = () => {
        recordListModel.getDetailRecordList(
            {
                pageSize,
                pageNo,
                demandId
            },
            recordCallback
        );
    };
    getDetailRecordsList();
}

export {
    selldetailInit
};
