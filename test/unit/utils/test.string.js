'use strict';
import 'babel-polyfill';
// import Nightmare from 'nightmare';
// import {
//     trim,
// } from'../../../src/utils/string';
import chai from 'chai';

const {
    expect
} = chai;
// const nightmare = Nightmare({ show: true });

describe('字符串处理工具模块测试', function (){

  /**
   * [字符串去空格]
   * @param  {Function} done [字符串去空格方法]
   * @return {[string]}        [description]
   */
    it('字符串去空格方法测试', function (done){
        expect(2).to.be.equal(1 + 1);
        done();
    });

});
