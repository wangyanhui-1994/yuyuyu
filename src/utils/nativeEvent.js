import Framework7 from '../js/lib/framework7';

window.currentDevice = new Framework7()['device'];
class CustomClass{

    doubleClickFeedback (){
        if (this.doubleClick){
            return true;
        }
        this.doubleClick = true;
        setTimeout(() => {
            this.doubleClick = false;
            console.log('点击太频繁！');
        }, 300);
        return false;
    }

        /**
         * 调用native统计事件（友盟统计）
         * */
    apiCount (id){
        const {ios, android} = window.currentDevice;
        if (!window['JS_UMengToCount'] && (!window['yudada'] || !window['yudada']['JS_UMengToCount'])){
            return false;
        }
        ios && window.JS_UMengToCount(id);
        android && window.yudada.JS_UMengToCount(id);
    }

        /**
         * 调用native拨打电话
         * */
    contactUs (phone){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios, android} = window.currentDevice;
        if (!window['JS_MakeCall'] && (!window['yudada'] || !window['yudada']['JS_MakeCall'])){
            return false;
        }
        ios && window.JS_MakeCall(phone.toString());
        android && window.yudada.JS_MakeCall(phone.toString());
    }

        /**
         * 调用native选择地区页面
         * */
    eventChooseAddress (type, provinceIndex, cityIndex){
            // pageType:0:release page  1:mycenter page
        const {ios, android} = window.currentDevice;
        if (!window['JS_ChooseAddress'] && (!window['yudada'] || !window['yudada']['JS_ChooseAddress'])){
            return false;
        }
        ios && window.JS_ChooseAddress(type, provinceIndex || 0, cityIndex || 0);
        android && window.yudada.JS_ChooseAddress(type, provinceIndex || 0, cityIndex || 0);
    }

        /**
         * 调用native定位
         * */
    getAddress (){
        const {ios, android} = window.currentDevice;
        if (!window['JS_LocationOfDevice'] && (!window['yudada'] || !window['yudada']['JS_LocationOfDevice'])){
            return false;
        }
        ios && window.JS_LocationOfDevice();
        android && window.yudada.JS_LocationOfDevice();
    }

        /**
         * 调用native选择图片组件
         * */
    postPic (mark, id, path, functionName){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios, android} = window.currentDevice;
        if (!window['JS_PictureSeletor'] && (!window['yudada'] || !window['yudada']['JS_PictureSeletor'])){
            return false;
        }
        if (5 == mark){
            ios && window.JS_PictureSeletor(5, '', id, path || '', functionName || '');
            android && window.yudada.JS_PictureSeletor(5, '上传照片', id, path || '', functionName || '');
            return;
        }

        const _mark = Number(mark) > -4 ? mark : 4;
        ios && window.JS_PictureSeletor(_mark, '', id, '', '');
        android && window.yudada.JS_PictureSeletor(_mark, '上传照片', id, '', '');
    }

        /**
         * 调用native查看图片组件
         * */
    catPic (url){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios, android} = window.currentDevice;
        if (!window['JS_ShowOriginalImg'] && (!window['yudada'] || !window['yudada']['JS_ShowOriginalImg'])){
            return false;
        }
        ios && window.JS_ShowOriginalImg(url);
        android && window.yudada.JS_ShowOriginalImg(url);
    }

        /**
         * 调用友盟分享
         * */
    shareInfo (title, html, url, message, imgUrl){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios, android} = window.currentDevice;
        if (!window['JS_ToShare'] && (!window['yudada'] || !window['yudada']['JS_ToShare'])){
            return false;
        }
        ios && window.JS_ToShare(title, html, url, message, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');
        android && window.yudada.JS_ToShare(title, html, url, message, imgUrl || 'http://m.yudada.com/img/app_icon_108.png');
    }

        // release voice info.
    releaseVoiceInfo (){
        const {ios, android} = window.currentDevice;
        ios && window.JS_RecordingModal();
        android && window.yudada.JS_RecordingModal();
    }

        // native alert style.
    nativeAlert (title, message, button1, button2){
        const {ios, android} = window.currentDevice;
        if (!window['JS_ShowAlertWithTitles'] && (!window['yudada'] || !window['yudada']['JS_ShowAlertWithTitles'])){
            return false;
        }
        ios && window.JS_ShowAlertWithTitles(title, message, button1, button2);
        android && window.yudada.JS_ShowAlertWithTitles(title, message, button1, button2);
    }

        // native login.
    nativeLogin (username, code){
        const {ios, android} = window.currentDevice;
        const obj = {
            'tele': username,
            'pass': code
        };
        if (!window['JS_SetUserInfo'] && (!window['yudada'] || !window['yudada']['JS_Login'])){
            return false;
        }
        ios && window.JS_SetUserInfo(obj);
        android && window.yudada.JS_Login(obj.tele, obj.pass);
    }

    getUserValue (){
        const {ios} = window.currentDevice;
        if (!window['JS_Token'] && (!window['yudada'] || !window['yudada']['JS_Token'])){
            return false;
        }
        const token = ios ? window.JS_Token() : window.yudada.JS_Token();
        return token;
    }

    logOut (){
        const {ios, android} = window.currentDevice;
        if (!window['JS_UserExitLog'] && (!window['yudada'] || !window['yudada']['JS_UserExitLog'])){
            return false;
        }
        ios && window.JS_UserExitLog();
        android && window.yudada.JS_UserExitLog();
    }

    getAPi (){
        const {ios} = window.currentDevice;
        if (!window['JS_BaseUrl'] && (!window['yudada'] || !window['yudada']['JS_BaseUrl'])){
            return false;
        }
        return ios ? window.JS_BaseUrl() : window.yudada.JS_BaseUrl();
    }

    getDistricInfo (){
        const {ios} = window.currentDevice;
        if (!window['JS_AreaInfo'] && (!window['yudada'] || !window['yudada']['JS_AreaInfo'])){
            return false;
        }
        return ios ? JSON.parse(window.JS_AreaInfo()) : JSON.parse(window.yudada.JS_AreaInfo());
    }

    nativeToast (type, message){
            // type: 0 faild, 1 succ;
        const {ios} = window.currentDevice;
        if (!window['JS_ShowHUD_AutoDisappear'] && (!window['yudada'] || !window['yudada']['JS_ShowHUD_AutoDisappear'])){
            return false;
        }
        ios ? window.JS_ShowHUD_AutoDisappear(type, message) : window.yudada.JS_ShowHUD_AutoDisappear(type, message);
    }

    setNativeUserInfo (){
            // clear user info on native.
        const {ios} = window.currentDevice;
        if (!window['JS_PerferenceSetShared'] && (!window['yudada'] || !window['yudada']['JS_PerferenceSetShared'])){
            return false;
        }
        ios ? window.JS_PerferenceSetShared() : window.yudada.JS_PerferenceSetShared('accessToken', '');
    }

    nativeGoBack (){
        window.yudada.JS_GoBack();
    }

        /**
         * 5: wifi
         * */
    getNetworkStatus (){
        const {ios} = window.currentDevice;
        if (!window['JS_GetNetWorkStates'] && (!window['yudada'] || !window['yudada']['JS_GetNetWorkStates'])){
            return true;
        }
        const status = ios ? window.JS_GetNetWorkStates() : window.yudada.JS_GetNetWorkStates();
        return Number(status) > 0;
    }

    getDeviceInfomation (){
        const {ios} = window.currentDevice;
        if (!window['JS_VersionInfo'] && (!window['yudada'] || !window['yudada']['JS_VersionInfo'])){
            return false;
        }
        return ios ? JSON.parse(window.JS_VersionInfo()) : JSON.parse(window.yudada.JS_VersionInfo());
    }

    goNewWindow (url){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios} = window.currentDevice;
        if (!window['JS_JumpToThirdWeb'] && (!window['yudada'] || !window['yudada']['JS_JumpToThirdWeb'])){
            return false;
        }
        ios ? window.JS_JumpToThirdWeb(url) : window.yudada.JS_JumpToThirdWeb(url);
    }

        /**
         * 搜索历史操作
         * */
    searchHistoryActions (type, val){
            /**
             *  type == 1: save search history;
             *  type == 2: get search history;
             *  type == 3: clear search history.
             */
        const {ios} = window.currentDevice;
        if (!window['JS_SearchRecord'] && (!window['yudada'] || !window['yudada']['JS_SearchRecord'])){
            return false;
        }
        ios ? window.JS_SearchRecord(type, val) : window.yudada.JS_SearchRecord(type, val);
    }

    /**
     * 跟native获取h5存入的信息
     * */
    getDataToNative (key){
        const {ios} = window.currentDevice;
        if (!window['JS_GetObjectWithKey'] && (!window['yudada'] || !window['yudada']['JS_GetObjectWithKey'])){
            return false;
        }
        let val = ios ? window.JS_GetObjectWithKey(key) : window.yudada.JS_GetObjectWithKey(key);
        if (val && (val.indexOf('{"') > -1 || val.indexOf('["') > -1)){
            val = JSON.parse(val);
        }

        val == '[]' && (val = []);
        val == '{}' && (val = {});
        // 判断是否安装微信
        // const defaultArr = ['appChannel', 'isWXAppInstalled', 'versionNumber', 'accessToken'];
        // if (defaultArr.indexOf(key) > -1 || Number(val) > -100){
        //     return val;
        // }
        return val;
    }

        /**
         * 存入数据到nativve
         * */
    setDataToNative (key, val){
        const {ios} = window.currentDevice;
        if (!window['JS_SaveObjectWithKey'] && (!window['yudada'] || !window['yudada']['JS_SaveObjectWithKey'])){
            return false;
        }
        let value = '';
        if(val && 'object' == typeof val){
            value = JSON.stringify(val);
        } else {
            value = val || '';
        }
        ios ? window.JS_SaveObjectWithKey(key, value) : window.yudada.JS_SaveObjectWithKey(key, value);
        return true;
    }

        /**
         * 根据key去native获取用户中心的数据
         * */
    getUserInfo (key){
        const {ios} = window.currentDevice;
        if (!window['JS_PerferenceGetShared'] && (!window['yudada'] || !window['yudada']['JS_PerferenceGetShared'])){
            return false;
        }
        let res;
        if (ios){
            res = window.JS_PerferenceGetShared(key || '');
        } else {
            res = window.yudada.JS_PerferenceGetShared(key || '');
        }
        return res;
    }

        // get app push data.
    getJumpDate (){
        const {ios} = window.currentDevice;
        if (!window['JS_GetPushInfo'] && (!window['yudada'] || !window['yudada']['JS_GetPushInfo'])){
            return false;
        }
        return ios ? window.JS_GetPushInfo() : window.yudada.JS_GetPushInfo();
    }

        /**
         * share info to weixin.
         * 0: 分享图片到微信好友    参数2 : 图片url
         * 1: 分享图片到朋友圈        参数2 : 图片url
         * 2: 分享web到微信好友   参数2: web  url    参数3: 图片url   参数4: 描述   参数5: 标题
         * 3: 分享web到朋友圈    参数2: web url  参数3 : 图片url   参数4: 描述   参数5: 标题
         */
    shareInfoToWeixin (par1, par2, par3, par4, par5){
        if (this.doubleClickFeedback()){
            return;
        }
        const {ios} = window.currentDevice;
        if (!window['JS_WXSceneShare'] && (!window['yudada'] || !window['yudada']['JS_WXSceneShare'])){
            return false;
        }
        ios ? window.JS_WXSceneShare(par1, par2, par3 || '', par4 || '', par5 || '')
             : window.yudada.JS_WXSceneShare(par1, par2, par3 || '', par4 || '', par5 || '');
    }

        /**
         * 调用native微信登录/绑定
         * */
        // callWeixinLogin() {
        //     if (this.doubleClickFeedback()) {
        //         return
        //     }
        //     const {ios, android} = window.currentDevice;
        //     if (!window['JS_WeChatLogin'] && (!window['yudada'] || !window['yudada']['JS_WeChatLogin'])) {
        //         return false;
        //     }
        //     ios ? JS_WeChatLogin() : window.yudada.JS_WeChatLogin();
        // }

        /**
         * 存入用户信息
         * @data: object
         * */
    setUerInfoToNative (data){
        const {ios} = window.currentDevice;
        if (!window['JS_SetNativeUserInfo'] && (!window['yudada'] || !window['yudada']['JS_SetNativeUserInfo'])){
            return false;
        }
        if (ios){
            data && window.JS_SetNativeUserInfo(data);
        } else {
            $$.each(data, (key, val) => {
                key && window.yudada.JS_PerferenceSetShared(key, val);
            });
        }
    }
    }

const nativeEvent = new CustomClass();
export default nativeEvent;
