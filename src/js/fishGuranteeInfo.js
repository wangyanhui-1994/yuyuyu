import Vue from 'vue';
import config from '../config';
function fishGuranteeInfoInit (f7, view, page){
    f7.hideIndicator();
    const {id} = page.query;
    const {mWebUrl} = config;
     const currentPage = $$($$('.view-main .page-fish-gurantee-Info')[$$('.view-main .page-fish-gurantee-Info').length - 1]);
     // 底部tabbar组件
    window.buyFooter = new Vue({
        el: currentPage.find('.toolbar')[0],
        data: {
        },
        methods:{
        	bugGuarante(){
                window.apiCount('btn_assurance_start');
        		window.mainView.router.load({
                    url: `${mWebUrl}consultGuarantee?id=${id}`
                });
        	}
        }
    });
}

export {
    fishGuranteeInfoInit
};