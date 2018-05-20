/**
 * [exports 由于string.js中的方法太过于耦合，不利于测试！]
 * 为了方便与单元测试新建的字符串处理
 */
module.exports = {
    getUnit (val){
        if(!val.toString().length){
            return '';
        }
        const arr = [
            {text: '斤', val: 0},
            {text: '尾', val: 1},
            {text: '只', val: 2}
        ];
        let res = '';
        for(let i = 0;i < arr.length;i++){
            val == arr[i].text && (res = arr[i].val);
            val == arr[i].val && (res = arr[i].text);
        }
        return res;
    },

    getBuyTime (time){
        let res = '';
        if(!time){
            res = '长期收购';
        }else{
            const differenceTime = parseFloat((time * 1000 - new Date().getTime()) / (60 * 60 * 24 * 1000 * 30), 10);
            if(0 < differenceTime && differenceTime <= 1){
                res = '一个月内收购';
            }else if(1 < differenceTime && differenceTime <= 2){
                res = '两个月内收购';
            }else if(2 < differenceTime && differenceTime <= 3){
                res = '三个月内收购';
            }else{
                res = '长期收购';
            }
        }
        return res;
    },
    // 整合关心的鱼种，返回后台需要 的格式
    //   {
    //     "fishId": "string",
    //     "fishName": "string",
    //     "id": 0,
    //     "imgUrl": "string",
    //     "parentFishId": "string",
    //     "parentFishName": "string"
    //   }
    getPutFishList (list){
        let res = [];
        if(!list || !list.length){
            return res;
        }
        for(let i = 0;i < list.length;i++){
            res.push({
                fishId: list[i].id,
                fishName: list[i].name,
                parentFishId: list[i].parant_id,
                parentFishName: list[i].parant_name
            });
        }
        return res;
    },

    // 将后台返回的关心鱼种数据转化后存入app
    editFishList (list){
        let res = [];
        if(!list || !list.length){
            return res;
        }
        for(let i = 0;i < list.length;i++){
            res.push({
                id: list[i].fishId,
                name: list[i].fishName,
                // eslint-disable-next-line
                parant_id: list[i].parentFishId,
                // eslint-disable-next-line
                parant_name: list[i].parentFishName,
                saleDemandsCount: list[i].saleDemandsCount
            });
        }
        return res;
    },

    // 判断图片有没有被缓存
    imgIsLoad (url){
        let img = new window.Image();
        img.src = url;
        if(img.complete){
            return true;
        }

        return false;
    },

    // 根据key获取数组里的对应对象
    findObjByKey (arr, key, value){
        if(!arr.length){
            return;
        }
        for(let i = 0; i < arr.length; i++){
            if(arr[i][key] == value){
                return arr[i];
            }
        }
    },
    /**
     * @param  {[url链接]}
     * @param  {[param对象]}
     * @author [Candy]
     * @return {[将给定的对象参数拼接在url后]}
     */
    createURL (url, param){
        var urlLink = '';
        $.each(param, function (item, key){
            var link = '&' + item + '=' + key;
            urlLink += link;
        });
        urlLink = url + '?' + urlLink.substr(1);
        return urlLink.replace(' ', '');
    },
    /**
     * [orderPriceFormatter 订单返回的金额最小单位是分，转化为元保留两位小数]
     * @param  {[String]} amount [金额]
     * @return {[String]}        [保留两位小数的金额]
     * @author [zhongliang.he]
     */
    orderPriceFormatter (amount){
        let res = Number(amount);
        if (res <= 0){
            window.alert('Fn:orderPriceFormatter错误提示：请传入正确的参数！');
            return 0.00;
        }
        return (res / 100).toFixed(2);
    }
};
