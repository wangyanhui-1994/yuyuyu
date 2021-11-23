// import nativeEvent from '../utils/nativeEvent';
import Vue from 'vue';
import config from '../config';
import store from '../utils/localStorage';
import { isLogin, loginViewShow } from '../middlewares/loginMiddle';
import { alertTitleText } from '../utils/string';
import ClassroomModel from './model/ClassroomModel';
import { readTimeFormat, getFirstDayOfWeek, getDateStr} from '../utils/time';
import nativeEvent from '../utils/nativeEvent';
/**
 * [aquaticClassroomInit 咨询模块ctrl]
 * @param  {[object]} f7   [description]
 * @param  {[object]} view [description]
 * @param  {[object]} page [description]
 */
function aquaticClassroomInit (f7, view, page){
    const currentPage = $$($$('.view-main .pages>.page-aquatic-classroom')[$$('.view-main .pages>.page-aquatic-classroom').length - 1]);
    const $infinite = currentPage.find('.infinite-scroll');
    const $mainView = $('.view.view-main');
    const $classroomLoginModal = $$('.save-article-confirm-modal');
    const $schoolReportCard = $$('.school-report-card');
    const {ios} = f7.device;
    const {
        pageSize,
        infoNumberKey,
        cacheStudyInfoKey,
        mWebUrl
    } = config;
    let pageNo = 1;
    store.set(infoNumberKey, 0);
    store.set('catInfoNumberTime', parseInt(new Date().getTime() / 1000, 10));
    new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
        }
    });
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            infoList: [],
            isLogin: isLogin(),
            loading: false,
            showAll: false,
            studyInfo: {},
            isMedalChanged: false
        },
        methods: {
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            goArtical (){
                window.apiCount('cell_education_usefulInfo');
                window.mainView.router.load({
                    url: 'views/aquaticArtical.html'
                });
            },
            goMedal (){
                window.apiCount('cell_education_myMedals');
                // 点击我的勋章去掉红点显示
                store.set('newMedalCount', 0);
                window.refreshTabbar && window.refreshTabbar();
                // 待领取消失
                vueData.isMedalChanged = false;
                window.mainView.router.load({
                    url: 'views/aquaticClassroom/myMedal.html'
                });
            },
            headUrl (url){
                let res = '';
                if (url){
                    res = url + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                } else {
                    res = 'img/defimg.png';
                    if(!this.isLogin && store.get('weixinData') && store.get('weixinData').imgUrl){
                        res = store.get('weixinData').imgUrl + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,png';
                    }
                }
                return res;
            },
            goclassType (type){
                window.mainView.router.load({
                    url: 'views/aquaticList.html?parentId=' + type
                });
            },
            goLogin (){
                $classroomLoginModal.addClass('show');
            },
            toLogin (){
                loginViewShow();
            },
            goScoreReport (){
                window.apiCount('cell_education_weeklyReport');
                // 跳转M站成绩单页面
                let time = getDateStr(-7); // 上周成绩单
                time = Date.parse(new Date(time)) / 1000;
                let lastUserinfo = store.get(cacheStudyInfoKey) || {};
                nativeEvent.goNewWindow(`${mWebUrl}education/weeklyTranscript/${time}?s=n&userId=${lastUserinfo.encodedUserId}`);
            }
        },
        computed: {
            studySeconds (){
                return readTimeFormat(this.studyInfo.studySeconds);
            }
        }
    });

    window.classData = vueData;
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
    const studyCallback = (res) => {
        const {
            code,
            data,
            message
        } = res;
        if (1 == code){
            if (data){
                vueData.studyInfo = data;
                store.set(cacheStudyInfoKey, data);
                // 判断水产课堂红点显示
                let {medalCount} = store.get(cacheStudyInfoKey) || {};
                if(medalCount && medalCount != data.medalCount){
                    store.set('newMedalCount', 1);
                }
                window.refreshTabbar && window.refreshTabbar();
                // 成绩单信封浮层
                if(isLogin() && vueData.studyInfo.studySeconds){
                    let date = getFirstDayOfWeek(new Date());
                    date = Date.parse(date) / 1000;
                    // 成绩单每周出现一次，和上次存入的周一开始时间做对比
                    let lastScoreTime = store.get('lastScoreTime');
                    if(date > lastScoreTime){
                        $$('.aquatic-score-modal').addClass('showAquatic');
                    };
                }
            }
        } else {
            console.log(message);
        }
    };
    // 判断待领取状态（备用）
    // const isMedal = (newCount, lastCount)=>{
    //     if(newCount && lastCount && newCount != lastCount){
    //         vueData.isMedalChanged = true;
    //     }
    //     if(!lastCount && newCount > 0){
    //         vueData.isMedalChanged = true;
    //     }
    // };
    /*
     * [getList 获取咨询列表数据]
     */
    const getList = () => {
        ClassroomModel.getArticleList({
            pageSize,
            pageNo
        },
        callback
        );
    };
    getList();

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
        getStudyInfo();
        // 待领取状态和水产课堂勋章红点显示一致
        let newMedal = store.get('newMedalCount');
        newMedal > 0 && (vueData.isMedalChanged = true);
    }
    if(!isLogin()){
         // 在线课堂统计，没有登录的用户获取游客ID
        guestId = store.get('guestId');
        if (!guestId){
            ClassroomModel.getGuestId({}, (res) => {
                const {code, data} = res;
                if (1 == code && data){
                    store.set('guestId', data);
                    guestId = store.get('guestId');
                    getStudyInfo();
                }
            });
        } else {
            getStudyInfo();
        }
    }
    // 上拉加载
    $infinite.on('infinite', function (){
        if (vueData.loading || vueData.showAll){
            return;
        }
        vueData.loading = true;
        pageNo++;
        getList();
    });

    // const screenHeight = window.screen.height;
    ios && $infinite.addClass('sticky-header');
    if (!ios){
        $infinite[0].onscroll = (e) => {
            const top = e.target.scrollTop;
            if (top >= 142){
                !$mainView.hasClass('show-fixed-header') && $mainView.addClass('show-fixed-header');
            } else {
                $mainView.hasClass('show-fixed-header') && $mainView.removeClass('show-fixed-header');
            }
        };
    }

    // 拆开成绩单 页面跳转以及取消模态框
    $schoolReportCard.click((event) =>{
        let image = $$(event.target).hasClass('school-report-separate');
        if(image){
            let timestamp = getDateStr(-7); // 上周成绩单
            timestamp = Date.parse(new Date(timestamp)) / 1000;
            // 存入点击成绩单模态框的本周一开始时间
            let firstDate = getFirstDayOfWeek(new Date());
            let lastUserinfo = store.get(cacheStudyInfoKey) || {};
            firstDate = Date.parse(firstDate) / 1000;
            store.set('lastScoreTime', firstDate);
            nativeEvent.goNewWindow(`${mWebUrl}education/weeklyTranscript/${timestamp}?s=n&userId=${lastUserinfo.encodedUserId}`);
        }else{
            $schoolReportCard.removeClass('showAquatic');
        }
        $schoolReportCard.removeClass('showAquatic');
    });
}

export {
    aquaticClassroomInit
};
