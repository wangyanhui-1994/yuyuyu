/**
 * create time 2017/03/01
 * author cash
 * */
import {updateCtrl} from '../js/service/updateVersion/updateVersionCtrl';
import InitApp from '../js/model/InitApp';
import {isLogin} from '../middlewares/loginMiddle';
import store from '../utils/localStorage';
import config from '../config';
import {
    registerPayResult,
    registerActivityOnResume,
    registerActivityOnCreate,
    registerActivityOnStart,
    registerActivityOnStop,
    registerActivityOnPause,
    registerActivityOnDestroy
} from '../js/jsBridge/registerHandler';
// import nativeEvent from '../utils/nativeEvent';

// 初始化注册所用native回调h5的方法
const initRegisterBridge = () => {
    registerPayResult();
    registerActivityOnResume();
    registerActivityOnCreate();
    registerActivityOnStart();
    registerActivityOnStop();
    registerActivityOnPause();
    registerActivityOnDestroy();
};

function JsBridge (fnName, data, callback, Framework7){
    const f7 = Framework7 || window.f7;
    const {infoNumberKey} = config;
    const handler = (fnName, data, callback) => {
        window.WebViewJavascriptBridge.callHandler(
            fnName,
            data,
            callback
        );
    };

    const getInfoNumber = () => {
        if(!isLogin()){
            return;
        }
        // 获取未读咨询数量
        InitApp.getInfoNumber((res) => {
            const {data, message, code} = res;
            if(1 == code && data){
                store.set(infoNumberKey, data);
                if(window.buyFooter){
                    window.buyFooter.infoNumberKey = data;
                }

                if(window.sellFooter){
                    window.sellFooter.infoNumberKey = data;
                }
            }else{
                console.log(message);
            }
        });
    };

    const {android} = window.currentDevice;
    if (window.WebViewJavascriptBridge){
        handler(fnName, data, callback);
    } else {
        if (android){
            window.document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function (){
                    window.WebViewJavascriptBridge.init(function (message, responseCallback){
                        var data = {
                            'Javascript Responds': '测试中文!'
                        };
                        responseCallback(data);
                    });

                    // app后台唤醒后js做的操作
                    // 阅读时长清空
                    window.WebViewJavascriptBridge.registerHandler('appWillEnterForeground', (data, responseCallback) => {
                        updateCtrl(f7);
                        getInfoNumber();
                        window.viewsBeginTime = 0;
                    });

                    // 注册h5回调方法
                    initRegisterBridge();

                    handler(fnName, data, callback);
                },
                false
            );
        } else {
            let WVJBIframe = window.document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__';
            window.WVJBCallbacks = [];
            window.document.documentElement.appendChild(WVJBIframe);
            setTimeout(function (){
                window.document.documentElement.removeChild(WVJBIframe);
                if (window.WebViewJavascriptBridge){
                    handler(fnName, data, callback);

                    // app后台唤醒后js做的操作
                    window.WebViewJavascriptBridge.registerHandler('appWillEnterForeground', () => {
                        updateCtrl(f7);
                        getInfoNumber();
                        window.viewsBeginTime = 0;
                    });

                    // 注册h5回调方法
                    initRegisterBridge();
                }
            }, 30);
        }
    }
}

function registerHandler (fnName, callback){
    if (!window.bridge){
        console.log('bridge 未初始化！');
        return;
    }
    window.bridge.registerHandler(fnName, callback);
}

export {
    JsBridge,
    registerHandler
};
