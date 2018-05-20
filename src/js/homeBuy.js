import customAjax from '../middlewares/customAjax';
import {home} from '../utils/template';
import {html, getName, alertTitleText} from '../utils/string';
import config from '../config';
import nativeEvent from '../utils/nativeEvent';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import {releaseFishViewShow} from '../js/releaseView/releaseFishViews';
import {getDealTime} from '../utils/time';
import Vue from 'vue';
import {JsBridge} from '../middlewares/JsBridge';
import store from '../utils/localStorage';
import HomeModel from './model/HomeModel';
import { myListBuy } from '../utils/domListenEvent';
import {getPutFishList, editFishList, imgIsLoad} from '../utils/strTool';
import visitListModel from './model/VisitListModel';
import ClassroomModel from './model/ClassroomModel';

function homeBuyInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-home-buy')[$$('.view-main .pages>.page-home-buy').length - 1]);
    const {fishCacheObj, cacheUserInfoKey, pageSize, infoNumberKey, mWebUrl, cacheStudyInfoKey} = config;
    const userInfo = store.get(cacheUserInfoKey) || {};
    const fishCarDriverId = userInfo.fishCarDriverId || '';
    let fishCache = $$.isArray(store.get(fishCacheObj.fishCacheKey)) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
    let pageNo = 1;
    let isRefresh = false;
    let isInfinite = false;
    /**
     * vue的数据模型
     * */

     // 底部tabbar组件
    window.buyFooter = new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
            infoNumberKey: store.get(infoNumberKey) || 0,
            visitData: {
                imgUrl: '',
                visitTime: ''
            },
            addPoint: store.get('addPoint') || 0
        }
    });

    window.vueHome = new Vue({
        el: currentPage.find('.home-vue-box')[0],
        data: {
            homeData: {
                trades: '',
                banners: [],
                fishTags: '',
                adsTop: [],
                adsBottom: []
            },
            fishCarTripInfo: '',
            fishCarDriverId: fishCarDriverId,
            userInfo: userInfo,
            bigerBuyInfo: '',
            selectCache: [],
            showAll: false,
            isLogin: isLogin(),
            visitData: {
                imgUrl: '',
                visitTime: ''
            }
        },
        methods: {
            getName: getName,
            getDealTime: getDealTime,
            myListBuy: myListBuy,
            imgIsLoad: imgIsLoad,
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            // 分享我的行程
            shareTrip (){
                window.apiCount(this.fishCarTripInfo ? 'btn_home_driver_shareRoute' : 'btn_home_driver_postRoute');
                if (this.fishCarTripInfo){
                    window.mainView.router.load({
                        url: 'views/shareMyTrip.html',
                        query: {
                            contactName: this.fishCarTripInfo.contactName,
                            date: this.fishCarTripInfo.appointedDate,
                            departureProvinceName: this.fishCarTripInfo.departureProvinceName,
                            destinationProvinceName: this.fishCarTripInfo.destinationProvinceName,
                            id: this.fishCarTripInfo.id
                        }
                    });
                } else {
                    window.releaseView.router.load({
                        url: 'views/releaseFishCarTrip.html',
                        reload: true
                    });
                    releaseFishViewShow();
                }
            },
            // 点击banner， 打开第三方webview
            goThreeWindow (e){
                const ele = e || window.event;
                const $ele = ele.target.tagName == 'DIV' ? $$(ele.target) : $$(ele.target).parent();
                const loginRequired = $ele.attr('data-login') === 'true';
                const link = $ele.attr('data-href');
                const type = $ele.attr('data-type');
                const id = $ele.attr('data-id');

                // 必须要登录的banner
                if (loginRequired && !isLogin()){
                    f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow);
                    return;
                }

                const accessToken = store.get('accessToken');
                let openUrl = link;
                console.log(type)
                // benner链接有三种类型：远程模板， 内部模板， 外部链接
                if (0 == type){
                    loginRequired && (openUrl += `/${accessToken}`);
                    nativeEvent.goNewWindow(openUrl);
                }

                if (1 == type){
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                if (2 == type){
                    f7.showIndicator();
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                // banner统计
                HomeModel.postBannerCount({
                    bannerId: id
                }, (data) => {
                    console.log(data);
                });
            },

            clickAds (item){
                const {
                    loginRequired,
                    type,
                    link,
                    id
                } = item;

                HomeModel.postOperateCount({
                    adsId: id
                }, (res) => {
                    const {code, message} = res;
                    if(1 != code){
                        console.log(message);
                    }
                });

                if (!!Number(loginRequired) && !isLogin()){
                    f7.alert('此活动需要登录才能参加，请您先去登录！', '提示', loginViewShow);
                    return;
                }
                const accessToken = store.get('accessToken');
                let openUrl = link;
                if (0 == type){
                    loginRequired && (openUrl += `/${accessToken}`);
                    nativeEvent.goNewWindow(openUrl);
                }

                if (1 == type){
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
                if (2 == type){
                    f7.showIndicator();
                    window.mainView.router.load({
                        url: openUrl
                    });
                }
            },
            // 我发布的求购列表
            goMyBuyList (){
                window.apiCount('btn_home_postPurchaseInfo');
                view.router.load({
                    url: 'views/filter.html?type=1&release=true'
                });
            },
            // 发现页面
            goToFind (){
                window.apiCount('btn_home_moreService');
                view.router.load({
                    url: 'views/find.html'
                });
            },
            // goToassurance (){
            //     apiCount.goNewWindow('https://mp.weixin.qq.com/s/YTuPNWHwdxMv1VQnRCfqqA');
            // }
            // 金牌鱼苗专区， 远程模板
            goToGuarante (){
                window.apiCount('btn_home_assurance');
                f7.showIndicator();
                const time = new Date().getTime();
                const guaranteTime = store.get('guaranteTime') || time;
                if(time / 1000 / 60 - guaranteTime / 1000 / 60 > 10){
                    store.set('guaranteTime', time);
                }
                window.mainView.router.load({
                    url: `${mWebUrl}models/babyFish?time=${time}`
                });
            }
        },
        computed: {
            tripDate (){
                if (!this || !this.fishCarTripInfo){
                    return '';
                }
                let res = '';
                const arr = this.fishCarTripInfo.appointedDate.split('-');

                res += Number(arr[1]) >= 10 ? arr[1] : arr[1].replace('0', '');
                res += '月';
                res += Number(arr[2]) >= 10 ? arr[2] : arr[2].replace('0', '');
                res += '日';
                return res;
            }
        }
    });

    /**
     * 初始化slider
     * */
    const initSlider = () => {
        /*
         * 开始注销掉swiper实例（场景： 在用户中心跟首页切换的时候不注销可能产生多个实例互相影响）
         * */
        if (window.yudadaSwiper){
            window.yudadaSwiper.destroy && window.yudadaSwiper.destroy(false, false);
        }
        window.yudadaSwiper = f7.swiper('.swiper-slow', {
            pagination: currentPage.find('.swiper-pagination'),
            lazyLoading: true,
            paginationClickable: true,
            initialSlide: 0,
            speed: 400,
            autoplay: 4000,
            centeredSlides: true,
            loop: true,
            autoplayDisableOnInteraction: true,
            onTouchStart: (swiper, e) => {
                if ($$.isArray(window.yudadaSwiper)){
                    window.yudadaSwiper[window.yudadaSwiper.length - 1].stopAutoplay();
                } else {
                    window.yudadaSwiper.stopAutoplay();
                }
            },
            onTouchEnd: (swiper, e) => {
                /*
                 * 为了解决手动滑动后，焦点选择错误以及自动滚动关闭的bug
                 * */
                setTimeout(() => {
                    const index = currentPage.find('.swiper-slide-active').attr('data-swiper-slide-index');
                    currentPage.find('.swiper-pagination').children('span').removeClass('swiper-pagination-bullet-active').eq(index).addClass('swiper-pagination-bullet-active');
                    if ($$.isArray(window.yudadaSwiper)){
                        window.yudadaSwiper[window.yudadaSwiper.length - 1].startAutoplay();
                    } else {
                        window.yudadaSwiper.startAutoplay();
                    }
                }, 80);
            }
        });
    };

    // const renderFishTags = (tagList) => {
    //     console.log('render tag list!');
    // };

    /**
     * 绑定部分vue的数据源
     * slider列表数据、成交记录列表、鱼种分类列表
     * */
    const initDataCallback = (data) => {
        // const {banners, trades, fishTags} = data.data;
        const {banners} = data.data;
        if (1 == data.code){
            window.vueHome.homeData = data.data;
            console.log(data.data)
            if(data.data.ads && data.data.ads.length){
                if(data.data.ads.length % 2 == 0){
                    window.vueHome.homeData.adsTop = data.data.ads;
                }else{
                    window.vueHome.homeData.adsBottom = [data.data.ads.pop(), data.data.ads.pop(), data.data.ads.pop()];
                    window.vueHome.homeData.adsBottom.reverse();
                    window.vueHome.homeData.adsTop = data.data.ads;
                }
            }
            banners && banners.length && setTimeout(initSlider, 100);
            return;
        } else {
            console.log(data.message);
        }
        setTimeout(() => {
            currentPage.find('.lazy').trigger('lazy');
        }, 300);
    };

    customAjax.ajax({
        apiCategory: 'initPage',
        data: ['3', 1],
        type: 'get',
        isMandatory: !!nativeEvent.getNetworkStatus()
    }, initDataCallback);

    /**
     * render 首页的信息列表
     * */
    const callback = (res) => {
        const {code, message, data} = res;
        if(1 == code){
            if (data.length){
                let catListHtml = '';
                $$.each(data, (index, item) => {
                    catListHtml += home.cat(item);
                });
                console.log(catListHtml)
                if(1 == pageNo){
                    alert(1)
                    html(currentPage.find('.cat-list-foreach'), catListHtml, f7);
                }else{
                    currentPage.find('.cat-list-foreach').append(catListHtml);
                }
            }
            window.vueHome.showAll = (data.length < pageSize);
        }else{
            console.log(message);
        }
        // pull to refresh done.
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
        setTimeout(() => {
            isRefresh = false;
            isInfinite = false;
        }, 300);
    };
    /*
     * 获取首页信息
     * */
    function getHomeListInfo (){
        let fishIds = [];

        fishCache = $$.isArray(store.get(fishCacheObj.fishCacheKey)) ? store.get(fishCacheObj.fishCacheKey).reverse() : [];
        console.log(fishCache)
        $$.each(fishCache, (index, val) => {
            fishIds.push(val.id);
        });
        HomeModel.postFollowSaleList({
            fishIds,
            pageNo,
            pageSize
        }, callback);
    }

    /*
     * 下啦刷新首页列表数据
     * 上啦加载更多
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', () => {
        if(isRefresh || isInfinite){
            return;
        }
        window.vueHome.showAll = false;
        isRefresh = true;
        isInfinite = false;
        pageNo = 1;
        getHomeListInfo();
    });
    f7.pullToRefreshTrigger(ptrContent);

    ptrContent.on('infinite', () => {
        if(isRefresh || isInfinite || window.vueHome.showAll){
            return;
        }
        isRefresh = false;
        isInfinite = true;
        pageNo++;
        getHomeListInfo();
    });

    /*
     * 跳转页面
     * */
    $$('.home-search-mask').on('click', () => {
        view.router.load({
            url: 'views/search.html'
        });
    });

    // /**
    //  *当前登录角色通过司机审核时,之间跳转至需求列表
    //  *如果有选择历史,优先选择历史的选择
    //  * */
    // currentPage.find('.callFishCar').click(() => {
    //     const userInfo = store.get(cacheUserInfoKey);
    //     const {driverState} = userInfo || {};
    //     const isFishCar = store.get('isFishCar');
    //
    //     if (isFishCar || 0 === isFishCar){
    //         window.mainView.router.load({
    //             url: `views/fishCar.html?isFishCar=${isFishCar}`
    //         });
    //         return;
    //     }
    //
    //     if (isLogin() && (1 == driverState)){
    //         window.mainView.router.load({
    //             url: 'views/fishCar.html?isFishCar=1'
    //         });
    //         return;
    //     }
    //     $$('.fish-car-modal').addClass('on');
    // });

    // 获取设备号
    if(!window.uuid){
        setTimeout(() => {
            JsBridge('JS_GetUUid', {}, (data) => {
                window.uuid = data;
            });
        }, 4000);
    }

    // 获取关心鱼种发布的条数
    if(fishCache.length){
        HomeModel.postFollowFishNumber({
            subscribedFishes: getPutFishList(fishCache)
        }, (res) => {
            const {code, data, message} = res;
            if(1 == code){
                window.vueHome.selectCache = editFishList(data);
            }else{
                console.log(message);
            }

        });
    }

    const visistCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            if(data){
                window.buyFooter.visitData.imgUrl = data.imgUrl;
                let minutes = new Date(data.scanTime * 1000).getMinutes();
                let hours = new Date(data.scanTime * 1000).getHours();
                if(minutes < 10){
                    minutes = '0' + minutes;
                }
                if(hours < 10){
                    hours = '0' + hours;
                }
                window.buyFooter.visitData.visitTime = hours + ':' + minutes;
                store.set('visitorCount', 1);
                window.refreshTabbar && window.refreshTabbar();
            }

        }else{
            console.log(message);
        }

    };
    /*
     * [getLatestVisitor 获取访客数据]
     * visitTime 最新进入首页的时间，切换页面更新
     */
    const getLatestVisitor = () => {
        const lastGetTime = store.get('visitTime') || 0;
        HomeModel.getLatestVisitor(
            {
                lastGetTime
            },
            visistCallback
        );
    };

    // 获取当前用户等级增长数
    const pointsCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if(1 == code){
            window.buyFooter.addPoint = data;
            store.set('addPoint', data || 0);
            window.refreshTabbar();
        }else{
            console.log(message);
        }
    };

    /*
     * [getAddPoints 获取用户积分增加数]
     */
    const getAddPoints = () => {
        const lastGetTime = store.get('levelTime') || 0;
        visitListModel.getAddedPoints(
            {
                lastGetTime
            },
            pointsCallback
        );
    };

    const studyCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            if (data){
                let {medalCount} = store.get(cacheStudyInfoKey) || {};
                store.set(cacheStudyInfoKey, data);
                if(medalCount && medalCount != data.medalCount){
                    store.set('newMedalCount', 1);
                }
                window.refreshTabbar && window.refreshTabbar();
            }
        } else {
            console.log(message);
        }
    };
    /*
     * [getStudyInfo 获取个人信息]
     */
    let guestId = store.get('guestId') || '';
    const getStudyInfo = () => {
        ClassroomModel.getStudyInfo({
            guestId
        },
        studyCallback
        );
    };

    if(isLogin()){
        getLatestVisitor();
        getAddPoints();
        getStudyInfo();

        // 获取当前用户本周浏览求购最多的一条信息（浏览次数超过100的）
        HomeModel.getBiggerBuyInfo((res) => {
            const {code, data, message} = res;
            if(1 == code){
                window.vueHome.bigerBuyInfo = data;
            }else{
                console.log(message);
            }
        });

        // 获取用户的当前等级
        const {level} = userInfo;
        const $levelModal = $$('.update-level-modal');
        HomeModel.getUserLevel((res) => {
            const {code, data, message} = res;
            if(1 == code && data){
                // 升级处理逻辑
                if(Number(data) > level){
                    let levelHtml = '';
                    for(let li = 0;li < Number(data);li++){
                        levelHtml += '<i class="iconfont icon-collection-active"></i>';
                    }
                    $levelModal.find('.content-level').html(levelHtml);
                    $levelModal.find('p').children('span').text(data);
                    $levelModal.addClass('show');
                    userInfo.level = Number(data);
                    store.set(cacheUserInfoKey, userInfo);
                }
            }else{
                console.log(message);
            }
        });

        /**
         * 获取司机最新的一条信息
         * */
        if (fishCarDriverId){
            HomeModel.getMyFishRecentTrip((res) => {
                const {code, message, data} = res;
                if (1 == code){
                    window.vueHome.fishCarTripInfo = data || '';
                } else {
                    console.log(message);
                }
            });
        }
    } else {
        // 在线课堂统计，没有登录的用户获取游客ID
        const guestId = store.get('guestId');
        if (!guestId){
            ClassroomModel.getGuestId({}, (res) => {
                const {code, data} = res;
                if (1 == code && data){
                    store.set('guestId', data);
                }
            });
        }
    }

    // // //存储数据
    // $$('#shareToWeixin').children().eq(0)[0].onclick = () => {
    //     const a = {
    //         sk:123,
    //         jj: 'qwe',
    //         ok: 'klk'
    //     };
    //     // nativeEvent.setDataToNative('sk', a);
    //     nativeEvent.setUerInfoToNative(a);
    // }
    //
    // $$('#shareToWeixin').children().eq(1)[0].onclick = () => {
    //     console.log(nativeEvent.getDataToNative('sk'));
    // }
    //
    // //分享
    // $$('#shareToWeixin').children().eq(2)[0].onclick = () => {
    //     nativeEvent.shareInfoToWeixin(0, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }
    //
    // $$('#shareToWeixin').children().eq(3)[0].onclick = () => {
    //     nativeEvent.shareInfoToWeixin(1, 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png');
    // }
    //
    // $$('#shareToWeixin').children().eq(4)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(2, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // }
    //
    // $$('#shareToWeixin').children().eq(5)[0].onclick = () => {
    //     // '//www.baidu.com/img/baidu_jgylogo3.gif'
    //     nativeEvent.shareInfoToWeixin(3, 'http://baidu.com', 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png', '测试', '我是分享测试');
    // };
    //
    // $$('#shareToWeixin').children().eq(6)[0].onclick = () => {
    //     JsBridge('JS_GetUUid', '', (data) => {
    //         alert(`设备号：${data}`)
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(7)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 0,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(8)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 1,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(9)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 2,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#shareToWeixin').children().eq(10)[0].onclick = () => {
    //     JsBridge('JS_QQSceneShare', {
    //         type: 3,
    //         imageUrl: 'http://img.yudada.com/fileUpload/img/demand_img/20161128/1480322100_9070.png',
    //         title: '鱼大大',
    //         describe: "鱼大大老好了",
    //         webUrl: 'http://www.baidu.com'
    //     }, (data) => {
    //         console.log(data + '----' + '我好了')
    //     });
    // };
    //
    // $$('#wei-xin-login')[0].onclick = () => {
    //     nativeEvent.callWeixinLogin();
    // }
}

export {
    homeBuyInit
};
