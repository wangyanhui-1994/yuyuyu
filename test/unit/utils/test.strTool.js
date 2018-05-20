'use strict';
import 'babel-polyfill';
import {
    getUnit,
    getBuyTime,
    orderPriceFormatter
} from '../../../src/utils/strTool';
import chai from 'chai';

const {expect} = chai;

describe('可测试的字符串处理模块', function (){

    /**
     * [获取单位斤/尾/只或者相对于的ID]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    it('获取单位斤/尾/只或者相对于的ID, 传入斤，返回id：0', function (done){
        expect(getUnit('斤')).to.be.equal(0);
        done();
    });

    it('获取单位斤/尾/只或者相对于的ID, 传入id:0，返回斤', function (done){
        expect(getUnit(0)).to.be.equal('斤');
        done();
    });

    /**
     * [获取求购信息求购时间文案 长期收购/一个月内收购/两个月内收购/三个月内收购]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    it('获取求购信息求购时间文案 长期收购', function (done){
        expect(getBuyTime(window.parseInt(new window.Date().getTime() / 1000, 10) + 60 * 60 * 24 * 120)).to.be.equal('长期收购');
        done();
    });

    it('获取求购信息求购时间文案 一个月内收购', function (done){
        expect(getBuyTime(window.parseInt(new window.Date().getTime() / 1000, 10) + 60 * 60 * 24 * 20)).to.be.equal('一个月内收购');
        done();
    });

    it('获取求购信息求购时间文案 两个月内收购', function (done){
        expect(getBuyTime(window.parseInt(new window.Date().getTime() / 1000, 10) + 60 * 60 * 24 * 40)).to.be.equal('两个月内收购');
        done();
    });

    it('获取求购信息求购时间文案 三个月内收购', function (done){
        expect(getBuyTime(window.parseInt(new window.Date().getTime() / 1000, 10) + 60 * 60 * 24 * 70)).to.be.equal('三个月内收购');
        done();
    });
});
