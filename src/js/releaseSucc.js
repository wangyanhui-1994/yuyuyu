import customAjax from '../middlewares/customAjax';
import { html } from '../utils/string';
import { home } from '../utils/template';
// import nativeEvent from '../utils/nativeEvent';
import store from '../utils/localStorage';
import config from '../config';
import {isLogin, loginViewShow} from '../middlewares/loginMiddle';
import Framework7 from './lib/framework7';

const newF7 = new Framework7({
    modalButtonOk: '现在去登录',
    modalButtonCancel: '算了',
    fastClicks: true,
    modalTitle: '温馨提示'
});

function releaseSuccInit (f7, view, page){
    const { type, id, fishName, phone } = page.query;
    const { pageSize, shareUrl } = config;
    const currentPage = $$($$('.view-main .pages>.page-release-succ')[$$('.view-main .pages>.page-release-succ').length - 1]);
    currentPage.find('span.release-succ-name').text(fishName);

    /**
     * 发布成功之后的操作
     * 1：未登录的引导登录
     * 2：已登录的引导分享发布的信息
     * */
    if (!isLogin()){
        newF7.confirm('登录之后可以随时查看自己发布的信息，有更多好处，现在去登录吧？', '友情提示', () => {
            window.apiCount('btn_text_guideLogin_yes');
            loginViewShow(phone);
        });
    }else{
        const releaseF7 = new Framework7({
            modalButtonOk: '现在转发',
            modalButtonCancel: '我再想想',
            fastClicks: true,
            modalTitle: '温馨提示'
        });
        const {
            type,
            specifications,
            stock,
            provinceName,
            cityName,
            fishTypeName,
            quantityTags,
            id,
            state,
            imgList,
            description
        } = window.releaseInfo;

        // const userInfo = store.get(cacheUserInfoKey);
        1 == state && currentPage.find('.release-succ-head').find('span').text('所有人都可以看到你的信息啦');
        1 == state && currentPage.find('.release-succ-head>p').eq(0).hide();

        const catBtn = `<a href='views/${1 == type ? 'buydetail' : 'selldetail'}.html?id=${id}' class='button col-45' onclick="apiCount('btn_text_goDetail')" class='button col-45 first'>查看信息详情</a>`;
        currentPage.find('.release-succ-back-btn').children('a').eq(1).remove();
        currentPage.find('.release-succ-back-btn').append(catBtn);

        /**
         * 未实名认证的不引导分享
         * */
        if(1 == state){
            releaseF7.confirm('一键转发到微信让您的成交率翻3倍!', '友情提示', () => {
                window.apiCount('btn_text_guideShare_yes');
                if (!store.get('isWXAppInstalled')){
                    f7.alert('分享失败');
                    return;
                }
                let title = '';
                const text = 2 == type ? '出售' : '求购';
                title += `【${text}】${fishTypeName}, ${provinceName || ''}${cityName || ''}`;
                let descriptionText = '';
                if(window.releaseInfo.title){
                    descriptionText += `${window.releaseInfo.title}，`;
                }
                descriptionText += stock ? `数量${stock}，` : '';
                // descriptionText += price ? `价格${price}，` : '';
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
                    imgUrl: imgList[0],
                    description: descriptionText
                };
                $$('.share-to-weixin-model').addClass('on');
            });
        }
    }

    /**
     * 发布成功后获取相似的反向信息（出售 -> 求购/ 求购 -> 出售）
     * */
    const callback = (data) => {
        const { code, message } = data;
        if (code !== 1){
            f7.alert(message, '提示');
            return;
        }
        let strHtml = '';
        $$.each(data.data, (index, item) => {
            if (2 == type){
                strHtml += home.buy(item);
            } else {
                strHtml += home.cat(item);
            }
        });
        html(currentPage.find('.release-succ-list').children('.list-view'), strHtml, f7);
        strHtml && currentPage.find('.release-succ-list').addClass('show');
        f7.hideIndicator();
    };
    customAjax.ajax({
        apiCategory: 'demandInfo',
        api: 'list',
        data: [id, '', type == 1 ? 2 : 1, '', pageSize, 1],
        type: 'get'
    }, callback);

}

export {
    releaseSuccInit
};
