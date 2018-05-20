import nativeEvent from '../../utils/nativeEvent';

function weixinModalEvent (){
    /*
     * 关闭微信分享model
     * */
    $$('.modal-close').click((e) => {
        const ele = e.target || window.event.target;
        const classes = ele.className;
        if (classes.indexOf('footer') > -1 || classes.indexOf('modal-close') > -1){
            $$('.modal-close').removeClass('on');
        }
    });

    /*
     * 微信分享给朋友
     * */
    $$('.share-to-friends')[0].onclick = () => {
        const {webUrl, imgUrl, description, title, type} = window.shareInfo;
        if (1 === type){
            nativeEvent.shareInfoToWeixin(0, imgUrl);
            return;
        }
        // 有可能传入的图片url是已经带有load的oss切割图片的参数，去掉oss切割图片的老式写法
        let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
        url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
        nativeEvent.shareInfoToWeixin(2, webUrl, url, description, title);
    };

    /*
     * 微信分享到朋友圈
     * */
    $$('.share-to-friends-circle')[0].onclick = () => {
        const {webUrl, imgUrl, description, title, type} = window.shareInfo;
        if (1 === type){
            nativeEvent.shareInfoToWeixin(1, imgUrl);
            return;
        }
        // 有可能传入的图片url是已经带有load的oss切割图片的参数，去掉oss切割图片的老式写法
        let url = imgUrl ? (imgUrl.split('@')[0].split('?')[0] + '?x-oss-process=image/resize,m_fill,h_100,w_100') : '';
        url = url ? encodeURI(url) : 'http://m.yudada.com/img/app_icon_108.png';
        nativeEvent.shareInfoToWeixin(3, webUrl, url, description, title);
    };
}

export {weixinModalEvent};
