// import store from '../utils/localStorage';
import config from '../config';
import { html } from '../utils/string';
import { invite } from '../utils/template';
import { isLogin } from '../middlewares/loginMiddle';
import nativeEvent from '../utils/nativeEvent';
// import customAjax from '../middlewares/customAjax';
import Invitation from './model/Invitation';

function inviteFriendsListInit (f7, view, page){
    if (!isLogin()){
        view.router.load({
            url: 'views/user.html'
        });
        f7.hideIndicator();
        return;
    }
    f7.hideIndicator();
    const currentPage = $$($$('.view-main .pages>.page-invite-friends-list')[$$('.view-main .pages>.page-invite-friends-list').length - 1]);
    const { pageSize } = config;
    let pageNo = 1;
    let pullToRefresh = false;
    let isInfinite = false;
    let isShowAll = false;
    const showAllBox = currentPage.find('.filter-search-empty-info');
    const loadBox = currentPage.find('.infinite-scroll-preloader');

    const callback = (data) => {
        const {code, message} = data;
        if(1 == code){
            let str = '';
            $$.each(data.data, (index, item) => {
                str += invite.inviteList(item, data.data.length - 1 === index);
            });

            if(pullToRefresh || 1 == pageNo){
                html(currentPage.find('.invite-friends-list'), '', f7);
            }
            // currentPage.find('.invite-friends-total').text(data.data.total);
            currentPage.find('.invite-friends-list').append(str);
        }else{
            f7.alert(message, '温馨提示');
        }

        if(data.data.length < pageSize){
            isShowAll = true;
            showAllBox.show();
            loadBox.hide();
        }else{
            showAllBox.hide();
            isShowAll = false;
            loadBox.show();
        }

        f7.pullToRefreshDone();
        isInfinite = false;
        pullToRefresh = false;
    };

    /**
     * 获取列表信息
     * */
    function getList (isDisableCache, onlyUseCache){
        Invitation.getInvitationList({
            pageSize,
            pageNo
        }, callback);
    }
    getList(false, true);

    /**
     * 下拉刷新列表数据
     * */
    const ptrContent = currentPage.find('.pull-to-refresh-content');
    ptrContent.on('refresh', () => {
        pullToRefresh = true;
        isInfinite = false;
        isShowAll = false;
        pageNo = 1;
        showAllBox.hide();
        loadBox.show();
        getList(nativeEvent.getNetworkStatus());
    });
    // setTimeout(() => {
    //     f7.pullToRefreshTrigger(ptrContent);
    // }, 50);

    /**
     * 上啦加载更多
     * */
    currentPage.find('.infinite-scroll').on('infinite', function (){
        if (isShowAll || isInfinite){
            return;
        }
        isInfinite = true;
        pullToRefresh = false;
        pageNo++;
        getList(nativeEvent.getNetworkStatus());
    });
}

export {
    inviteFriendsListInit
};
