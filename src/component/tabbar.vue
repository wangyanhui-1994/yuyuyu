<template>
<div class="toolbar-inner fixed-tool-bar">
    <a :class="1 == tabIndex && 'active'" data-reload="true" @click="goToHomeBuy()">
        <span class="iconfont icon-tabbar-home"></span> 首页
    </a>
    <a :class="2 == tabIndex && 'active'" data-reload="true" @click="goToFind()">
        <span class="iconfont icon-tabbar-discover"></span> 发现
    </a>
    <a @click="releaseInfo()">
        <div class="tab-release">
            <span class="tab-release-bg">发布信息</span>
            <span class="tab-release-content">
                 <i class="iconfont icon-edit"></i>
            </span>
        </div>
    </a>
    <a data-reload="true" :class="4 == tabIndex && 'active'" @click="goToClassRoom()">
        <span class="iconfont icon-tabbar-tutor">
            <i v-if="isLogin && (classRoomNum > 0 || addMedal > 0)"></i>
        </span>
        <p>水产课堂</p>
    </a>
    <a :class="5 == tabIndex && 'active'" class="tabbar-user" data-reload="true" @click="goToUser()">
        <span class="iconfont icon-tabbar-profile">
            <i v-if="addPoints"></i>
        </span> 个人中心
    </a>
    <div v-if="isLogin && 1 == tabIndex && visitData.visitTime" class="someone-visit list-block" @click=" goMyVisitList()">
        <div class="item-media">
           <img :src="headUrl(visitData.imgUrl)" alt="">
        </div>
       <div class="item-inner ">
        <div class="item-title">有人看了你的店铺</div>
        <div class="item-time">最近{{visitData.visitTime}}
            <span class="iconfont icon-arrow arrow-left"></span>
            <span class="iconfont icon-arrow arrow-right"></span>
        </div>
       </div> 
    </div>
    <img v-if="opened && isPrize" src="../build/img/Bitmap.png"  class="week-prize" @click ="goToPrize()">
</div>
</template>

<style>
</style>

<script>
    import {
        alertTitleText
    } from '../utils/string';
    import {getDateStr,getFirstDayOfWeek} from '../utils/time';
    import nativeEvent from '../utils/nativeEvent';
    import store from '../utils/localStorage';
    import {
        loginViewShow
    } from '../middlewares/loginMiddle';
    import {isLogin} from '../middlewares/loginMiddle';
    import config from '../config';
    const {
        cacheStudyInfoKey,
        mWebUrl
    } = config;
    export default {
        data: function() {
            let isPrize = false
            let date = getFirstDayOfWeek(new Date());
            date = Date.parse(date)/1000;
            let lastPrizeTime = store.get('lastPrizeTime');
             // 当前时间的凌晨信息>上次存入的时间，显示礼物
            isPrize = date > lastPrizeTime;
            return {
                pageName: window.mainView.activePage.name,
                isUpdate: false,
                addPoints: 0,
                addMedal: 0,
                isLogin: isLogin(),
                medalTit:true,
                isPrize,
                opened: true
            };
        },
        props: ['tabIndex', 'classRoomNum','visitData', 'addPoint', 'isMedalChanged'],
        created() {
            const vm = this
            window.refreshTabbar = () => {
                vm.getPoint();
            }
            vm.getPoint();
        },
        methods: {
            headUrl (url){
                    let res = '';
                    if(url){
                        res = url + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                    }else{
                        res = 'img/defimg.png';
                    }
                    return res;
                },
            // 最近访客
            goMyVisitList (){
                window.apiCount('btn_home_hintPop');
                this.getHomeVisitData() && this.setVisitData()
                window.mainView.router.load({
                    url: 'views/visitList.html'
                });
            },
            releaseInfo() {
                const text = alertTitleText();
                window.apiCount('btn_tabbar_post');
                if (!!text) {
                    window.f7.alert(text, '温馨提示', loginViewShow);
                } else {
                    this.getHomeVisitData() && this.setVisitData()
                    window.mainView.router.load({
                        url: 'views/release.html'
                    })
                }
            },
            goToHomeBuy(){
                window.apiCount('btn_tabbar_buy');
                if('homeBuy' == this.pageName){
                    return;
                }
                window.mainView.router.load({
                    url: 'views/homeBuy.html',
                    reload: true
                })
            },
            goToHomeSell(){
                window.apiCount('btn_tabbar_sell');
                if('homeSell' == this.pageName){
                    return;
                }
                this.getHomeVisitData() && this.setVisitData()
                window.mainView.router.load({
                    url: 'views/homeSell.html',
                    reload: true
                })
            },
            goToClassRoom(){
                window.apiCount('btn_home_tutor');
                if('aquaticClassroom' == this.pageName){
                    return;
                }
                this.getHomeVisitData() && this.setVisitData()
                window.mainView.router.load({
                    url: 'views/aquaticClassroom.html',
                    reload: true
                })
            },
            goToUser(){
                window.apiCount('btn_tabbar_profile');
                if('user' == this.pageName){
                    return;
                }
                this.getHomeVisitData() && this.setVisitData()
                window.mainView.router.load({
                    url: 'views/user.html',
                    reload: true
                })
            },
            goToFind(){
                // window.apiCount('btn_tabbar_sell');
                if('find' == this.pageName){
                    return;
                }
                this.getHomeVisitData() && this.setVisitData()
                window.apiCount('btn_tabbar_discover');
                window.mainView.router.load({
                    url: 'views/find.html',
                    reload: true
                })
            },

            getPoint() {
                let point = store.get('addPoint')
                let visitCount = store.get('visitorCount')
                let sellCount = store.get('addSellCount')
                let buyCount = store.get('addBuyCount')
                let getMedal = store.get('getMedal')
                let newMedal = store.get('newMedalCount')
                let {opened} = store.get(cacheStudyInfoKey) || {};
                this.opened = opened;
                this.medalTit = !!getMedal
                this.addPoints = Number(point) || Number(visitCount) || Number(sellCount) || Number(buyCount)
                this.addMedal = Number(newMedal)
            },
            setVisitData() {
                store.set('visitTime', window.parseInt(new Date().getTime() / 1000))
                window.buyFooter.visitData.visitTime = 0;
            },

            getHomeVisitData() {
                return window.buyFooter && window.buyFooter.visitData && window.buyFooter.visitData.visitTime || 0
            },
            goToPrize() {
                let currentDate = Date.parse(new Date())/1000;
                store.set('lastPrizeTime',currentDate);
                nativeEvent.goNewWindow(`${mWebUrl}education/weekPrize?s=n`);
                this.isPrize = false;
            }
        }
    };
</script>
