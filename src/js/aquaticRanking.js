import Vue from 'vue';
import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import ClassroomModel from './model/ClassroomModel';
import store from '../utils/localStorage';
import ObjectUtils from '../utils/ObjectUtils';
import nativeEvent from '../utils/nativeEvent';
import { alertTitleText } from '../utils/string';

function aquaticRankingInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-aquatic-ranking')[$$('.view-main .pages>.page-aquatic-ranking').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    // const $infinite = currentPage.find('.infinite-scroll');
    const {
        cacheStudyInfoKey,
        mWebUrl
    } = config;
    let pageNo = 1;
    const pageSize = 100;
    // 登录 游客，微信登录各种情况下排行榜的显示逻辑
    const studyInfoCache = store.get(cacheStudyInfoKey);
    const weixinData = store.get('weixinData');
    let studyInfodata = studyInfoCache || {};
    if (!isLogin()){
        // weixinData && (studyInfodata = Object.assign(weixinData, studyInfoCache || {}));
        weixinData && (studyInfodata = ObjectUtils.copy(weixinData));
    }

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            isLogin: isLogin(),
            rankList: [],
            loading: false,
            showAll: false,
            studyInfodata,
            isPrize: true
        },
        methods: {
            loginViewShow (){
                loginViewShow();
            },
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            goToPrize (){
                window.apiCount('cell_education_rank_reward');
                nativeEvent.goNewWindow(`${mWebUrl}education/weekPrize?s=n`);
            }
        },
        computed: {
            isLoading (){
                return this.infoList.length && this.newList.length < pageSize;
            },
            studySeconds (){
                let res = '';
                if(this.studyInfodata.studySeconds > 60 * 60){
                    res = Math.floor(this.studyInfodata.studySeconds / 60 / 60) + '小时' + Math.floor((this.studyInfodata.studySeconds % 3600) / 60) + '分钟' ;
                }else{
                    res = this.studyInfodata.studySeconds ? (this.studyInfodata.studySeconds / 60).toFixed(1) + '分钟' : 0 + '分钟';
                }
                return res;
            },
            imgUrl (){
                const vm = this;
                const {imgUrl, headImg} = vm.studyInfodata;
                let src = 'http://img.yudada.com/img/default_%20avatar.png?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                imgUrl && (src = imgUrl);
                headImg && (src = `${headImg}?x-oss-process=image/resize,m_fill,h_100,w_100/format,png`);
                return src;
            },
            nickname (){
                const vm = this;
                const {nickname} = vm.studyInfodata;
                let name = '登录后可上榜';
                nickname && (name = nickname);
                vm.isLogin && !nickname && (name = '匿名用户');
                return name;
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
            1 == pageNo && (vueData.rankList = []);
            $$.each(data, (index, item) => {
                vueData.rankList.push(item);
            });
            vueData.loading = false;
            if(data.length){
                if(pageNo == 1 && data.length < pageSize){
                    vueData.showAll = true;
                }else{
                    vueData.showAll = false;
                }
            }else{
                vueData.showAll = true;
            }

            for (let i = 0; i < data.length; i++){
                data[i].mine && (vueData.studyInfodata = ObjectUtils.copy(data[i]));
            }
        } else {
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
    };
    /*
     * [getStudyRank 获取等级列表]
     */
    const getStudyRank = () => {
        ClassroomModel.getStudyRank({
            pageSize,
            pageNo
        },
        callback
        );
    };
    getStudyRank();

     /*
     * [getStudyInfo 获取个人信息]
     */
    const studyCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            if (data){
                // 在排行榜登录之后红点显示
                let {medalCount} = store.get(cacheStudyInfoKey) || {};
                if(medalCount && medalCount != data.medalCount){
                    store.set('newMedalCount', 1);
                }
                window.refreshTabbar && window.refreshTabbar();
                vueData.studyInfodata = ObjectUtils.copy(data);
                store.set(cacheStudyInfoKey, data);
                vueData.isPrize = vueData.studyInfodata.opened;
            }
        } else {
            console.log(message);
        }
    };
    let guestId = store.get('guestId') || '';
    const getStudyInfo = () => {
        ClassroomModel.getStudyInfo({
            guestId
        },
        studyCallback
        );
    };
    getStudyInfo();


     // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.rankList = [];
        pageNo = 1;
        vueData.loading = false;
        vueData.showAll = false;
        getStudyRank();
        getStudyInfo();
    });
}

export {
    aquaticRankingInit
};
