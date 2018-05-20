'use strict';
import 'babel-polyfill';
import {
    getBeforedawnTime,
    timeDifference,
    centerShowTime,
    getDate,
    getDealTime,
    fishCarActiveTime,
    getMarketTimeStr,
    getMonthDay,
    secondToDate
} from '../../../src/utils/time';
import chai from 'chai';

const {expect} = chai;

describe('时间工具模块测试', function (){

    /**
     * [最初始的显示多久前 几分钟之前/几小时之前/昨天/前天/x月x日]
     * @param  {Function} done [description]
     * @return {[string]}        [几分钟之前/几小时之前/昨天/前天/x月x日]
     */
    it('获取多久之前的文案方法测试:2017-4-1发布', function (done){
        expect(timeDifference(new Date('2017/04/01').getTime() / 1000)).to.be.equal('04/01发布');
        done();
    });

    // 5分钟之前
    it('获取多久之前的文案方法测试:5分钟前', function (done){
        expect(timeDifference(new Date().getTime() / 1000 - (60 * 5) - 10)).to.be.equal('5分钟前');
        done();
    });

    // 2小时之前
    it('获取多久之前的文案方法测试:2小时前', function (done){
        expect(timeDifference(new Date().getTime() / 1000 - (60 * 60 * 2.5))).to.be.equal('2小时前');
        done();
    });

    // 昨天
    it('获取多久之前的文案方法测试:昨天', function (done){
        expect(timeDifference(new Date().getTime() / 1000 - (60 * 60 * 25))).to.be.equal('昨天发布');
        done();
    });

    // 前天
    it('获取多久之前的文案方法测试:前天', function (done){
        expect(timeDifference(new Date().getTime() / 1000 - (60 * 60 * 50))).to.be.equal('前天发布');
        done();
    });

    /**
     * [多久前来过 刚刚来过/几小时之前/几天之前/一周前来过]
     * @param  {Function} done []
     * @return {[string]}      [刚刚来过/几小时之前/几天之前/一周前来过]
     */
    it('获取多久之前的文案方法测试:刚刚来过', function (done){
        expect(centerShowTime(new Date().getTime() / 1000)).to.be.equal('刚刚来过');
        done();
    });

    /**
     * [获取时间戳格式化后的时间 x年x月x日/x月x日 2:30]
     * @param  {Function} done [description]
     * @return {[string]}        [x年x月x日/x月x日 2:30]
     */
    it('获取格式化后的时间方法测试:2017年3月20日', function (done){
        expect(getDate(new Date('2017-03-20').getTime() / 1000)).to.be.equal('2017年3月20日');
        done();
    });

    it('获取多久之前的文案方法测试:3月20日8:00', function (done){
        expect(getDate(new Date('2017-03-20').getTime() / 1000, true)).to.be.equal('3月20日8:00');
        done();
    });

    /**
     * [根据时间戳获取距当前时间的活跃时间]
     * @param  {Function} done [description]
     * @return {[string]}        [刚刚活跃/今天活跃/昨天活跃/几天活跃/7天前活跃]
     */
    it('获取多久之前活跃的文案方法测试:刚刚活跃', function (done){
        expect(fishCarActiveTime(new Date().getTime() / 1000)).to.be.equal('刚刚活跃');
        done();
    });

    it('获取多久之前活跃的文案方法测试:今天活跃', function (done){
        expect(fishCarActiveTime(new Date().getTime() / 1000 - (60 * 60 * 5))).to.be.equal('今天活跃');
        done();
    });

    it('获取多久之前活跃的文案方法测试:昨天活跃', function (done){
        expect(fishCarActiveTime(new Date().getTime() / 1000 - (60 * 60 * 25))).to.be.equal('昨天活跃');
        done();
    });

    it('获取多久之前活跃的文案方法测试:3天前活跃', function (done){
        expect(fishCarActiveTime(new Date().getTime() / 1000 - (60 * 60 * 75))).to.be.equal('3天前活跃');
        done();
    });

    /**
     * [获取当前时间的日期格式 x/x/x]
     * @param  {Function} done [description]
     * @return {[string]}        [2017/1/6]
     */
    it('获取当前时间的日期格式方法测试:' + getBeforedawnTime(), function (done){
        expect(getBeforedawnTime()).to.be.equal(getBeforedawnTime());
        done();
    });

    /**
     * [格式化传入时间：今天/昨天/x月x日]
     * @param  {string} done [时间戳]
     * @return {[type]}        [今天/昨天/x月x日]
     */
    const test = new Date();
    const m = parseInt(test.getMonth(), 10) + 1;
    const d = test.getDate();
    const y = test.getFullYear();
    it('格式化传入时间:今天', function (done){
        expect(getDealTime(new Date(`${y}/${m}/${d}`).getTime() + (60 * 60 * 1 * 1000))).to.be.equal('今天');
        done();
    });

    it('格式化传入时间:昨天', function (done){
        expect(getDealTime(new Date(`${y}/${m}/${d}`).getTime() - (60 * 60 * 12 * 1000))).to.be.equal('昨天');
        done();
    });

    it('格式化传入时间:3月1日', function (done){
        expect(getDealTime(new Date('2017/03/01').getTime())).to.be.equal('3月1日');
        done();
    });

    /**
     * [预售时间：xxxx年x月上旬、中旬、下旬]
     * @param  {string} done [时间戳]
     * @return {[type]}        [xxxx年x月上旬、中旬、下旬]
     */
    it('格式化传入时间:2017年12月5日时间戳，返回"预售产品，xxxx年x月上旬、中旬、下旬开卖"', function (done){
        expect(getMarketTimeStr(window.parseInt(new Date('2017/12/05').getTime() / 1000), 10)).to.be.equal('预售产品，2017年12月上旬开卖');
        done();
    });
    /**
     * [根据年月获取这个月有多少天]
     */
    it('根据年月获取这个月有多少天:2017 12，返回31', function (done){
        expect(getMonthDay(2017, 12)).to.be.equal(31);
        done();
    });
    /**
     * [把秒转为几天几小时]
     */
    it('把秒转为几天几小时:42673，返回0天11小时', function (done){
        expect(secondToDate(42673)).to.be.equal('0天11小时');
        done();
    });

});
