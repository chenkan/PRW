/**
 * Usage
 * 在工程根目录下执行 mocha test/Smoke.test.js
 * 不在根目录的话 sails无法正常加载启动
 */

var sails = require('sails');
var liftedApp;

before(function (done) {            // done是标志位 用于告知mocha此处的异步操作在逻辑上结束了 可以继续后面的测试步骤了
    this.timeout(5000);             // before的超时时间 在此时间内done须被回调 否则失败
    sails.lift({
        log: {
            level: 'error'
        }
    }, function (err, sails) {      // Node惯例 回调函数参数的第一位是err 第二位是data
        liftedApp = sails;
        done(err, sails);           // 回调done 表示OK了 继续后面的测试吧
    });
});


var battle = require("../api/core/Battle");
describe('/smoke test/', function () {
    it("should show simple battle scenario", function (done) {
        this.timeout(60 * 1000);
        battle.battle(1, 2, done);
    });
});


after(function (done) {
    liftedApp.lower(done);
});
