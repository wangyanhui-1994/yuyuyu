import Vue from 'vue';
import {getMonthDay, getDayArr} from '../../../utils/time';
import TransactionProcessModel from '../../model/TransactionProcessModel';

function logisticsInfoInit (f7, view, page){
    /**
     * 获取当前页面
     */
    const pages = $$('.view-main .pages>.page-logistics-info');
    const currentPage = $$(pages[pages.length - 1]);

    // id用于判断input输入框是新增还是修改原来的信息
    const {orderNo} = page.query;
    // 获取当前设备
    const {androidChrome} = window.currentDevice;

    const vueData = new Vue({
        el: currentPage.find('.vue-box')[0],
        data: {
            text: '航班号',
            number: '',
            dateNumber: '',
            type: 1
        },
        methods: {
            submit (){
                const vm = this;
                if (!vm.isPass){
                    f7.alert('请填写完整信息~', '提示');
                    return;
                }
                let deliveryStartTime = new Date(vm.dateNumber.split('-').join('/')).getTime();
                let dateNow = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
                if(deliveryStartTime > dateNow){
                    f7.alert('不能选择今天之后的日期，请重新选择发货时间', '提示');
                    return;
                }
                TransactionProcessModel.postOrderLogistics({
                    orderNo,
                    deliveryOrderNo: vm.number,
                    deliveryStartTime: window.parseInt(deliveryStartTime / 1000, 10),
                    deliveryType: vm.type
                }, (res) => {
                    f7.hideIndicator();
                    let {code, message} = res;
                    if (1 == code){
                        window.mainView.router.refreshPreviousPage();
                        setTimeout(window.mainView.router.back, 100);
                        return;
                    }
                    f7.alert(message, '提示');
                });
            }
        },
        computed: {
            // 放开修改按钮
            isPass (){
                return !!this.number && !!this.dateNumber;
            }
        }
    });

    // 日期(年、月、日顺序)选择框绑定
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    console.log(today.getDate());

    const days = getMonthDay(year, month);
    let dateInitObj = {
        input: currentPage.find('.logistics-info-date'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        value: [today.getFullYear(), today.getMonth() + 1, today.getDate()],
        cols: [
            {
                textAlign: 'left',
                values: [2017, 2018, 2019]
            },
            {
                values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },
            {
                textAlign: 'right',
                values: getDayArr(days).arr
            }
        ],
        // 更新每个月的天数
        onChange: function (picker, values, displayValues){
            if (values[0] != year || values[1] != month){
                const newDays = getMonthDay(values[0], values[1]);
                picker.cols[2].replaceValues(getDayArr(newDays).arr);
            }
            year = values[0];
            month = values[1];
            vueData.dateNumber = `${values[0]}-${values[1]}-${values[2]}`;
        },
        formatValue: function (p, values, displayValues){
            return `${values[0]}-${values[1]}-${values[2]}`;
        }
    };
    f7.picker(dateInitObj);

    // 物流方式选择框绑定
    let typeInitObj = {
        input: currentPage.find('.logistics-info-type'),
        toolbarCloseText: '确定',
        rotateEffect: !androidChrome,
        textAlign: 'center',
        cols: [
            {
                textAlign: 'center',
                values: ['空运', '汽运']
            }
        ],
        onChange: function (picker, values, displayValues){
            if (values[0] === '汽运'){
                vueData.text = '物流号';
                vueData.type = 0;
            }

            if (values[0] === '空运'){
                vueData.text = '航班号';
                vueData.type = 1;
            }
        }
    };
    f7.picker(typeInitObj);

    f7.hideIndicator();
}

export {
    logisticsInfoInit
};
