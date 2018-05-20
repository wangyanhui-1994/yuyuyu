/**
 * create by zhongliang.He
 * */
import {getProvinceList, getCreateDriverListLabel} from '../../utils/string';

function fishCarDriverSelectAddressModalEvent (f7){
    /**
     * 省内运输跟跨省运输切换
     * */
    $$('.edit-driver-address-model .province-address-select>div').click((e) => {
        const ele = e.target || window.event.target;
        let currentItem = $$(ele);
        if (ele.tagName == 'SPAN'){
            currentItem = $$(ele).parent();
        }
        if (currentItem.hasClass('on')){
            return;
        }

        if (currentItem.hasClass('pull-left')){
            $$('.edit-driver-address-model .province-address-select>div').removeClass('on').eq(0).addClass('on');
            $$('.edit-driver-address-model .province-select-item').removeClass('on').eq(0).addClass('on');
        } else {
            $$('.edit-driver-address-model .province-address-select>div').removeClass('on').eq(1).addClass('on');
            $$('.edit-driver-address-model .province-select-item').removeClass('on').eq(1).addClass('on');
        }
    });

    /**
     * picker绑定省份数据（司机添加或者修改路线）
     * 因为只执行一次，所以放在入口文件
     * */
    setTimeout(() => {
        /* 省内选择*/
        f7.picker({
            input: $$('.edit-driver-address-model .province-select').find('input'),
            toolbarCloseText: '确定',
            rotateEffect: true,
            cols: [
                {
                    textAlign: 'center',
                    values: getProvinceList()
                }
            ]
        });

        /* 跨省出发地*/
        f7.picker({
            input: $$('.edit-driver-address-model .provinces-select').find('input').eq(0),
            toolbarCloseText: '确定',
            rotateEffect: true,
            cols: [
                {
                    textAlign: 'center',
                    values: getProvinceList()
                }
            ]
        });

        /* 跨省目的地*/
        f7.picker({
            input: $$('.edit-driver-address-model .provinces-select').find('input').eq(1),
            toolbarCloseText: '确定',
            rotateEffect: true,
            cols: [
                {
                    textAlign: 'center',
                    values: getProvinceList()
                }
            ]
        });
    }, 1000);

    /**
     * 以下是司机选择路线的操作
     * 1：关闭model
     * 2：添加路线
     * 3：编辑保存路线
     * 4：删除路线
     * */
    $$('.edit-driver-address-model-cancel').click(() => {
        $$('.edit-driver-address-model').removeClass('add edit');
    });

    $$('.edit-driver-address-model-add').click(() => {
        let address;
        if ($$('.province-address-select .pull-left').hasClass('on')){
            // 省内运鱼

            if ('请选择' == $$('.province-select').find('input').val()){
                f7.alert('请选择省份！');
                return;
            }
            address = `${$$('.province-select').find('input')
                .val()}内`;
        } else {
            // 跨省运鱼
            if ('请选择' == $$('.provinces-select').find('input').eq(0).val()){
                f7.alert('请选择出发省份！');
                return;
            }

            if ('请选择' == $$('.provinces-select').find('input').eq(1).val()){
                f7.alert('请选择目的地省份！');
                return;
            }

            if ($$('.provinces-select').find('input').eq(0).val() == $$('.provinces-select').find('input').eq(1).val()){
                f7.alert('跨省路线中出发省份不能跟目的地省份相同！');
                return;
            }
            const startVal = $$('.provinces-select').find('input').eq(0).val();
            const endVal = $$('.provinces-select').find('input').eq(1).val();
            address = `${startVal}-${endVal}`;
        }
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        const length = currentPage.find('.post-select-address').length;
        currentPage.find('.add-address-click-box').remove();
        currentPage.find('.post-driver-select').append(fishCar.selectAddress(length, address));
        if (currentPage.find('.post-select-address').length < 5){
            currentPage.find('.post-driver-select').append(fishCar.addBtn());
        }
        $$('.edit-driver-address-model').removeClass('add edit');
    });

    $$('.edit-driver-address-model-save').click(() => {
        let address;
        if ($$('.province-address-select .pull-left').hasClass('on')){
            // 省内运鱼

            if ('请选择' == $$('.province-select').find('input').val()){
                f7.alert('请选择省份！');
                return;
            }
            address = `${$$('.province-select').find('input').val()}内`;
        } else {
            // 跨省运鱼
            if ('请选择' == $$('.provinces-select').find('input').eq(0).val()){
                f7.alert('请选择出发省份！');
                return;
            }

            if ('请选择' == $$('.provinces-select').find('input').eq(1).val()){
                f7.alert('请选择目的地省份！');
                return;
            }

            if ($$('.provinces-select').find('input').eq(0).val() == $$('.provinces-select').find('input').eq(1).val()){
                f7.alert('跨省路线中出发省份不能跟目的地省份相同！');
                return;
            }
            const startVal = $$('.provinces-select').find('input').eq(0).val();
            const endVal = $$('.provinces-select').find('input').eq(1).val();
            address = `${startVal}-${endVal}`;
        }
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        currentPage.find('.post-select-address').find('input').eq(window.addressIndex)
            .val(address).attr('placeholder', address);
        $$('.edit-driver-address-model').removeClass('add edit');
    });

    $$('.edit-driver-address-model-delete').click(() => {
        const currentPage = $$($$('.view-main .pages>.page')[$$('.view-main .pages>.page').length - 1]);
        currentPage.find('.post-select-address').eq(window.addressIndex).remove();
        const itemLen = currentPage.find('.post-select-address').length;
        for (let i = 0; i < itemLen; i++){
            if (i <= (itemLen - window.addressIndex)){
                currentPage.find('.post-select-address').eq(i)
                    .find('.item-title').text(`路线${getCreateDriverListLabel(i)}`).attr('data-index', i);
            }
        }
        if (!currentPage.find('.add-address-click-box').length){
            currentPage.find('.post-driver-select').append(fishCar.addBtn());
        }
        $$('.edit-driver-address-model').removeClass('add edit');
    });
}

function fishCarModalJumpEvent (f7){
    /**
     * 鱼车modal选项点击跳转逻辑
     * */
    $$('.fish-car-modal').find('a').eq(0).click(() => {
        const {name} = mainView.activePage;
        if('fishCar' == name){
            mainView.router.reloadPage('views/fishCar.html?isFishCar=1');
        }else{
            mainView.router.load({url: 'views/fishCar.html?isFishCar=1'});
        }

    });

    $$('.fish-car-modal').find('a').eq(1).click(() => {
        const {name} = mainView.activePage;
        if('fishCar' == name){
            mainView.router.reloadPage('views/fishCar.html?isFishCar=0');
        }else{
            mainView.router.load({url: 'views/fishCar.html?isFishCar=0'});
        }
    });
}

export {
    fishCarDriverSelectAddressModalEvent,
    fishCarModalJumpEvent
};
