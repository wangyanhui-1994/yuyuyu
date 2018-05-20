module.exports = {
    timeDifference: (unix) => {
        if (unix == '' || unix == null){
            return;
        }
        let today = new Date();
        let unixs = new Date((unix * 1000));

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let min = today.getMinutes();

        let unixYear = unixs.getFullYear();
        let unixMonth = parseInt(unixs.getMonth() + 1, 10);
        let unixday = unixs.getDate();
        // console.log(unixs + "" +unixMonth + "**" + unixday);

        let todayZero = year + '/' + month + '/' + day;
        // console.log(todayZero);

        let currentUnix = Date.parse(new Date(today)) / 1000; // 当前时间戳
        let todayZeroUnix = Date.parse(new Date(todayZero)) / 1000; // 当天凌晨时间戳
        let yestedayZeroUnix = parseInt(todayZeroUnix - 24 * 60 * 60, 10); // 昨天凌晨时间戳
        let qiantianZeroUnix = parseInt(yestedayZeroUnix - 24 * 60 * 60, 10); // 前天凌晨
        let unixDefi = parseInt(currentUnix - unix, 10); // 时间戳差
        let temp = '';
        let hourt = '';

        const currentYear = new Date().getFullYear();
        // 刚刚
        if (unixDefi <= 60){
            temp = '刚刚';
        } else if (unixDefi > 60 && unixDefi <= 60 * 60){ // 几分钟之前
            min = parseInt(unixDefi / 60, 10);
            temp = min + '分钟前';
        } else if (unix < currentUnix && unix > todayZeroUnix){ // 几小时之前
            hourt = parseInt((currentUnix - unix) / (60 * 60), 10);
            temp = hourt + '小时前';
        } else if (unix > yestedayZeroUnix && unix <= todayZeroUnix){ // 昨天
            temp = '昨天发布';
        } else if (unix < yestedayZeroUnix && unix >= qiantianZeroUnix){ // 前天
            temp = '前天发布';
        } else {
            if(unixMonth < 10){
                unixMonth = `0${unixMonth}`;
            }
            if(unixday < 10){
                unixday = `0${unixday}`;
            }

            if(currentYear == unixYear){
                temp = `${unixMonth}/${unixday}发布`;
            }else{
                temp = `${unixYear}/${unixMonth}/${unixday}发布`;
            }
        }
        return temp;
    },
    centerShowTime: (unix) => {
        if (!unix){
            return '';
        }
        let today = new Date();

        let currentUnix = Date.parse(new Date(today)) / 1000; // 当前时间戳
        let unixDefi = parseInt(currentUnix - unix, 10); // 时间戳差
        let temp = '';

        if (unixDefi < 60 * 60){ // 1小时内
            temp = '刚刚来过';
        } else if (unixDefi >= 60 * 60 && unixDefi < 60 * 60 * 24){ // 几小时之前
            temp = parseInt(unixDefi / (60 * 60), 10) + '小时前来过';
        } else if (unixDefi >= 60 * 60 * 24 && unixDefi < 60 * 60 * 24 * 7){
            temp = parseInt(unixDefi / (60 * 60 * 24), 10) + '天前来过';
        } else {
            temp = '一周前来过';
        }
        return temp;
    },
    /**
     * [getDate 时间格式化]
     * @param  {[Strin]} time [时间戳，10位13位都行]
     * @param  {[String]} type [返回格式类型]
     * 1：不传返回 2017年9月10日
     * 2：second 返回 2017-9-10  12:25:01
     * 3：其他值 返回 2017年9月10日10:07
     * @return {[Strin]}      [返回格式化后的时间格式]
     */
    getDate: (time, type) => {
        if(!time){
            return '';
        }
        let dateTime = parseInt(time, 10);
        (dateTime + '').length == 10 && (dateTime *= 1000);
        const test = new Date(dateTime);
        const $year = test.getFullYear();
        const $month = parseInt(test.getMonth(), 10) + 1;
        const $day = test.getDate();
        const $fdate = $year + '年' + $month + '月' + $day + '日';

        let res = $fdate;

        const $hours = test.getHours();
        const $minute = test.getMinutes() > 9 ? test.getMinutes() : `0${test.getMinutes()}`;
        const $second = test.getSeconds() > 9 ? test.getSeconds() : `0${test.getSeconds()}`;

        if (type){
            res = `${$month}月${$day}日${$hours}:${$minute}`;
            'second' === type && (res = `${$year}-${$month}-${$day}  ${$hours}:${$minute}:${$second}`);
        }

        return res;
    },
    getDealTime: (data) => {
        if(!data){
            return '';
        }
        const test = new Date(parseInt(data, 10));
        const m = parseInt(test.getMonth(), 10) + 1;
        const d = test.getDate();
        const y = test.getFullYear();

        const nowTime = new Date().getTime();
        const time = new Date(`${y}/${m}/${d}`).getTime();

        let res;
        const cxTime = Number(nowTime) - Number(time);
        if(cxTime <= 60 * 60 * 24 * 1000){
            res = '今天';
        }else if(cxTime > 60 * 60 * 24 * 1000 && cxTime <= 60 * 60 * 24 * 1000 * 2){
            res = '昨天';
        }else{
            res = `${m}月${d}日`;
        }
        return res;
    },
    fishCarActiveTime: (date) => {
        if(!date){
            return '';
        }
        const currentTime = new Date().getTime();
        const itemTime = date * 1000;
        let res = '';
        if(currentTime - itemTime <= 60 * 60 * 1000){
            res = '刚刚活跃';
        }else if(60 * 60 * 1000 < (currentTime - itemTime) && (currentTime - itemTime) <= 60 * 60 * 1000 * 24){
            res = '今天活跃';
        }else if(60 * 60 * 1000 * 24 * 2 >= (currentTime - itemTime) && (currentTime - itemTime) > 60 * 60 * 1000 * 24){
            res = '昨天活跃';
        }else if(60 * 60 * 1000 * 24 * 7 >= (currentTime - itemTime) && (currentTime - itemTime) > 60 * 60 * 1000 * 24 * 2){
            res = `${parseInt((currentTime - itemTime) / (60 * 60 * 1000 * 24), 10)}天前活跃`;
        }else if((currentTime - itemTime) > 60 * 60 * 1000 * 24 * 7){
            res = '7天前活跃';
        }
        return res;
    },
    getBeforedawnTime: () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return `${year}/${month}/${day}`;
    },
    getYMD: (time) => {
        if (!time){
            return '';
        }
        const date = time.toString().length == 13 ? time : time * 1000;

        const today = new Date(date);
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return `${year}年${month}月${day}日`;
    },
    getMarketTimeStr (time){
        if(!time){
            return '';
        }
        const year = new Date(time * 1000).getFullYear();
        const month = new Date(time * 1000).getMonth() + 1;
        const day = new Date(time * 1000).getDate();
        let timeStr = '';
        if(day <= 10){
            timeStr = '上旬';
        }

        if(day <= 20 && day > 10){
            timeStr = '中旬';
        }

        if(day > 20){
            timeStr = '下旬';
        }
        return `预售产品，${year}年${month}月${timeStr}开卖`;
    },
    getYmdTime: (time) => {
        if (!time){
            return '';
        }
        const date = time.toString().length == 13 ? time : time * 1000;

        const today = new Date(date);
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        if(month < 10){
            month = '0' + month;
        }
        if(day < 10){
            day = '0' + day;
        }
        return `${year}-${month}-${day}`;
    },
    timeDiff: (unix) => {
        if (unix == '' || unix == null){
            return;
        }
        const date = unix.toString().length == 13 ? unix : unix * 1000;
        let today = new Date();
        let unixs = new Date(date);

        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let min = today.getMinutes();

        let unixYear = unixs.getFullYear();
        let unixMonth = parseInt(unixs.getMonth() + 1, 10);
        let unixday = unixs.getDate();
        // console.log(unixs + "" +unixMonth + "**" + unixday);

        let todayZero = year + '/' + month + '/' + day;
        // console.log(todayZero);

        let currentUnix = Date.parse(new Date(today)) / 1000; // 当前时间戳
        let todayZeroUnix = Date.parse(new Date(todayZero)) / 1000; // 当天凌晨时间戳
        let yestedayZeroUnix = parseInt(todayZeroUnix - 24 * 60 * 60, 10); // 昨天凌晨时间戳
        let qiantianZeroUnix = parseInt(yestedayZeroUnix - 24 * 60 * 60, 10); // 前天凌晨
        let unixDefi = parseInt(currentUnix - unix, 10); // 时间戳差
        let temp = '';
        let hourt = '';

        const currentYear = new Date().getFullYear();
        // 刚刚
        if (unixDefi > 0 && unixDefi <= 60){
            temp = '刚刚';
        } else if (unixDefi > 60 && unixDefi <= 60 * 60){ // 几分钟之前
            min = parseInt(unixDefi / 60, 10);
            temp = min + '分钟前';
        } else if (unix < currentUnix && unix > todayZeroUnix){ // 几小时之前
            hourt = parseInt((currentUnix - unix) / (60 * 60), 10);
            temp = hourt + '小时前';
        } else if (unix > yestedayZeroUnix && unix <= todayZeroUnix){ // 昨天
            temp = '昨天';
        } else if (unix < yestedayZeroUnix && unix >= qiantianZeroUnix){ // 前天
            temp = '前天';
        } else {
            if(unixMonth < 10){
                unixMonth = '0' + unixMonth;
            }
            if(unixday < 10){
                unixday = '0' + unixday;
            }
            if(currentYear == unixYear){
                temp = `${unixMonth}/${unixday}`;
            }else{
                temp = `${unixYear}/${unixMonth}/${unixday}`;
            }
        }
        return temp;
    },
    readTimeFormat: (d) => {
        let res = '';
        let arr = '';
        let isMin = false;
        if (d >= 60 * 60){
            res = (d / 60 / 60).toFixed(1);
        } else {
            isMin = true;
            res = d ? (d / 60).toFixed(1) : 0;
        }
        arr = (res + '').split('.');
        if (arr.length > 1){
            !Number(arr[1]) && (res = arr[0]);
        }
        res = isMin ? `<span class="num">${res}</span>分钟` : `<span class="num">${res}</span>小时`;
        return d ? res : ('<span class="num">0</span>分钟');
    },
    // 格式化邀请时间
    getInvitationTime (time){
        const date = time.toString().length == 13 ? time : Number(time) * 1000;
        const month = new Date(date).getMonth() + 1;
        const day = new Date(date).getDate();
        const hours = new Date(date).getHours();
        const mins = new Date(date).getMinutes();
        return month + '月' + day + '日' + '    ' + hours + ':' + mins;
    },
    getYearWeek: () =>{
        let checkDate = new Date(new Date());
        const year = checkDate.getFullYear();
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        const time = checkDate.getTime();
        checkDate.setMonth(0);
        checkDate.setDate(1);
        const week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        return '截止到' + year + '年第' + week + '周';
    },
    // js获取当前时间前后N天日期的方法
    getDateStr: (addDayCount) => {
        let dd = new Date();
        // 获取AddDayCount天后的日期
        dd.setDate(dd.getDate() + addDayCount);
        const y = dd.getFullYear();
        // 获取当前月份的日期，不足10补0
        const m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1);
        // 获取当前几号，不足10补0
        const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        return y + '-' + m + '-' + d;
    },
    // 获取当前日期的周一凌晨时间
    getFirstDayOfWeek: (date) => {
        const day = date.getDay() || 7;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
    },
    /**
     * [根据年月获取这个月有多少天]
     * @param  {[number]} year  [年份]
     * @param  {[number]} month [月份]
     * @return {[number]}       [一个月有多少天]
     */
    getMonthDay: (year, month) => {
        const isYearNum = year > 0;
        const isMinthNum = month > 0;
        if (!isYearNum || !isMinthNum){
            window.alert('Fn:getMonthDay错误提示：请传入正确的参数！');
            return 30;
        }
        let y = Number(year);
        let m = Number(month);
        if (month == 12){
            m = 1;
            y++;
        } else {
            m++;
        }
        let date = new Date(`${y}/${m}/01`);
        date.setDate(0);
        return date.getDate();
    },
    /**
     * [获取picker的日期数组]
     * @param  {[Number]} num [一个月有多少天]
     * @return {[Object]}
     * {
     *     arr: Array,
     *     defaultArr: Array
     * }
     */
    getDayArr: (num) => {
        let arr = [];
        let defaultArr = [];
        for(let i = 1;i <= num;i++){
            arr.push(i);
            defaultArr.push(`${i}日`);
        }
        return {
            arr,
            defaultArr
        };
    },
    /**
     * [把秒转为几天几小时]
     * @param  {[type]} second [description]
     * @return {[type]}        [description]
     */
    secondToDate: (second)=>{
        if(second < 0){
            window.alert('Fn:secondToDate错误提示：请传入正确的参数！');
            return 0;
        }
        let res = '';
        var days = parseInt(second / 60 / 60 / 24, 10); // 计算剩余的天数
        var hours = parseInt(second / 60 / 60 % 24, 10); // 计算剩余的小时
        // var minutes = parseInt(second / 60 % 60, 10);// 计算剩余的分钟
        // var seconds = parseInt(second % 60, 10);// 计算剩余的秒数
        res = days + '天' + hours + '小时';
        return res;
    }

};
