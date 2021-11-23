import Vue from 'vue';
import config from '../config';
import ClassroomModel from './model/ClassroomModel';
import { isLogin, loginViewShow } from '../middlewares/loginMiddle';
import { alertTitleText } from '../utils/string';
import nativeEvent from '../utils/nativeEvent';
function aquaticInfoInit (f7, view, page){
    const {
        pageSize,
        mWebUrl
    } = config;
    let pageNo = 1;
    window.viewsBeginTime = 0;
    const {url, id, secondCategoryName} = page.query;
    let {title} = page.query;
    const currentPage = $$($$('.view-main .pages>.page-aquatic-Info')[$$('.view-main .pages>.page-aquatic-Info').length - 1]);
    const $nav = $$($$('.view-main .navbar-inner')[$$('.view-main .navbar-inner').length - 1]);
    const $ptrContent = currentPage.find('.pull-to-refresh-content');
    const $infinite = currentPage.find('.infinite-scroll');
    let articalTitle = $nav.find('.artical-title');
    let loading = false;
    let info = '';
    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            infoList: [],
            showAll: false,
            secondCategoryName: secondCategoryName || ''
        },
        methods: {
        },
        computed: {
        }
    });
    const vueFooter = new Vue({
        el: currentPage.find('.class-toolbar')[0],
        data: {
            useful: false
        },
        methods: {
            login (){
                f7.alert(alertTitleText(), '温馨提示', loginViewShow);
            },
            isLogin: isLogin,
            changeUse (){
                window.apiCount('cell_education_detail_userful');
                f7.showIndicator();
                if(this.useful){
                    deleteUseful();;
                }else{
                    postUseful();
                }
            },
            goShareClass (){
                window.apiCount('cell_education_detail_share');
                const shareTitle = `${title}_鱼大大`;
                const webUrl = `${mWebUrl}education/article/detail/${id}?s=n`;
                window.shareInfo = {
                    title: shareTitle,
                    webUrl,
                    imgUrl: 'http://static.yudada.com/ssr_m/img/classroom/ic_classroom_share.png',
                    description: '上「鱼大大水产课堂」，解决你的养殖问题，让你做养殖“老大”！'
                };
                $$('.share-to-weixin-model').addClass('on');
            }
        },
        computed: {
        }
    });
    if(title){
        articalTitle.text(title);
    }
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
                loading = false;
                vueData.secondCategoryName = vueData.infoList[0].secondCategoryName;
                if(pageNo == 1 && data.length < pageSize){
                    vueData.showAll = true;
                }else{
                    vueData.showAll = false;
                }
            }else{
                loading = true;
                vueData.showAll = true;
            }
        } else {
            console.log(message);
        }
        f7.hideIndicator();
        f7.pullToRefreshDone();
        currentPage.find('img.lazy').trigger('lazy');
    };

    /*
     * [getList 获取咨询列表数据]
     */
    const getSecondList = () => {
        ClassroomModel.getSecondList(id, {
            pageSize,
            pageNo,
            id
        },
        callback
        );
    };

    const getContent = (url) => {
        $.ajax({
            method: 'get',
            timeout: 20000,
            url,
            processData: true,
            crossDomain: true,
            success: function (res){
                let text = res.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                text = text.replace(/^点击.*听课$/, '');
                text = text.replace(/点击[\s]+[\d\D]*听课/g, '');
                text = text.replace('<!--tailTrap<body></body><head></head><html></html>-->', '');
                text = text.replace('<!--headTrap<body></body><head></head><html></html>-->', '');
                let context = text.match(/<body\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/body>/gi);
                let style = text.match(/<style\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/style>/gi).join('');
                if (style){
                    style = style.split('font:inherit;').join('');
                    style = style.split('font-size:100%;').join('');
                }
                let body = context[0];
                body = body.split('body').join('div');
                body = body.split('data-src').join('src');
                body = body.split('href=').join('data-href=');
                // body = body.split('http://').join('https://')
                body = body.split('?wx_fmt=jpeg').join('');
                body = body.split('?wx_fmt=png').join('');
                body = body.split('?wx_fmt=jpg').join('');
                body = body.split('?wx_fmt=gif').join('');
                body = body.split('推荐阅读').join('');
                body = body.split('font:inherit;').join('');
                body = body.split('font-size:100%;').join('');
                currentPage.find('.main-content').html(style + body);
                f7.hideIndicator();
            }
        });
    };

    /*
     * [postUseful 点赞]
     */
    const postUseful = () => {
        ClassroomModel.postUseful(id, {id}, (res)=>{
            if(res.code == 1){
                f7.hideIndicator();
                info = '已标记有用';
                nativeEvent['nativeToast'](1, info);
                vueFooter.useful = true;
            }else{
                console.log(res.message);
            }
        });
    };

    /*
     * [deleteUseful 取消点赞]
     */
    const deleteUseful = () => {
        ClassroomModel.deleteUseful(id, (res)=>{
            if(res.code == 1){
                f7.hideIndicator();
                info = '对我没用了';
                nativeEvent['nativeToast'](1, info);
                vueFooter.useful = false;
            }else{
                console.log(res.message);
            }
        });
    };

    // 下拉刷新
    $ptrContent.on('refresh', () => {
        vueData.infoList = [];
        pageNo = 1;
        loading = false;
        vueData.showAll = false;
        getSecondList();
    });

     // 上拉加载
    $infinite.on('infinite', function (){
        if(loading){
            return;
        }
        loading = true;
        pageNo++;
        getSecondList();
    });

    const checkArticalUseful = () => {
        ClassroomModel.checkArticalUseful({
            id
        }, (res) =>{
            const {code, data} = res;
            if(1 == code){
                vueFooter.useful = data.useful;
                if(data.deleted){
                    !$$('.modal-overlay-visible').length && f7.alert('此文章已被删除');
                } else{
                    !title && (title = data.title);
                    articalTitle.text(data.title);
                    !url && getContent(data.link);
                    getSecondList();
                    window.viewsBeginTime = data.beginTime || 0;
                }
            }
        });
    };

    url && getContent(url);
    checkArticalUseful();
}

export {
    aquaticInfoInit
};
