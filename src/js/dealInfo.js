import Vue from 'vue';
import {getProvinceList, getProvinceId} from '../utils/string';
import {getUnit} from '../utils/strTool';
import infoDetail from './model/InfoDetail';

function dealInfoInit (f7, view, page){
    f7.hideIndicator();
    const currentPage = $$($$('.view-submit-deal .pages>.page-deal-info')[$$('.view-submit-deal .pages>.page-deal-info').length - 1]);
    let isSend = false;
    const {
        type,
        infoId,
        fishId,
        fishName,
        fishParentId,
        fishParentName
    } = page.query;

    new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            typeText: (1 == type) ? '求购情况' : '销售情况',
            subData: {
                fishTypeId: fishId,
                fishTypeName: fishName,
                infoId: infoId,
                parentFishTypeId: fishParentId,
                parentFishTypeName: fishParentName
            }
        },
        methods: {
            submitInfo (){
                const {err, params} = checkParams();
                if(err){
                    f7.alert(err);
                    return;
                }

                if(isSend){
                    return;
                }
                f7.showIndicator();
                infoDetail.postDealRecord(params, (res) => {
                    const {code, message} = res;
                    f7.hideIndicator();
                    isSend = true;
                    if(1 == code){
                        window.subDealView.router.load({
                            url: `views/submitDealSucc.html?infoId=${infoId}&type=${type}`
                        });
                    }else{
                        f7.alert(message);
                    }
                });
            }
        }
    });

    /**
     * [input 选择单位]
     * @type {[type]}
     */
    f7.picker({
        input: currentPage.find('#deal-unit'),
        toolbarCloseText: '确定',
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['斤', '尾', '只']
            }
        ]
    });

    /**
     * [input 销售情况选择]
     * @type {[type]}
     */
    f7.picker({
        input: currentPage.find('.select-status'),
        toolbarCloseText: '确定',
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: 2 == type ? ['已全部卖出', '还有货'] : ['短期内不求购', '继续求购']
            }
        ]
    });

    /**
     * [input 交易地区选择]
     * @type {[type]}
     */
    f7.picker({
        input: currentPage.find('.select-address'),
        toolbarCloseText: '确定',
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: getProvinceList()
            }
        ]
    });

    /**
     * [input 选择成交时间]
     * @type {[type]}
     */
    const today = new Date();
    const lastDate = new Date().setDate(today.getDate() + 365 * 20);
    f7.calendar({
        input: currentPage.find('.select-time'),
        dateFormat: 'yyyy-mm-dd',
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', ' 11', '12'],
        monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', ' 11', '12'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        disabled: {
            from: today,
            to: lastDate
        }
    });

    /**
     * [checkParams 检查填写的情况]
     * @return {[type]} [description]
     */
    function checkParams (){
        const $time = currentPage.find('.select-time');
        const $address = currentPage.find('.select-address');
        const $unit = currentPage.find('#deal-unit');
        const $infoStatus = currentPage.find('.select-status');
        const $dealNumber = currentPage.find('.deal-num');
        let err = '';
        !$time.val() && (err = '请选择成交时间！');
        !$address.val() && (err = '请选择交易地区！');
        !$dealNumber.val() && (err = '请填写成交数量');
        !$unit.val() && (err = '请选择成交单位！');
        !$infoStatus.val() && (err = `请选择${2 == type ? '销售' : '求购'}情况！`);
        return {
            err,
            params: {
                cityId: '',
                cityName: '',
                closed: (('已全部卖出' == $infoStatus.val()) || ('短期内不求购' == $infoStatus.val())),
                fishTypeId: fishId,
                fishTypeName: fishName,
                infoId,
                parentFishTypeId: fishParentId,
                parentFishTypeName: fishParentName,
                provinceId: getProvinceId($address.val())['provinceId'],
                provinceName: $address.val(),
                quantity: $dealNumber.val(),
                tradeTime: $time.val() ? parseInt(new Date($time.val()).getTime() / 1000, 10) : '',
                type: type,
                unit: getUnit($unit.val())
            }
        };
    }
}

export{
  dealInfoInit
};
