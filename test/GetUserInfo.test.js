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

describe('/get card info by ids/', function () {
    it("should show card info", function (done) {
        var ids = [200000, 200010];
        var utils = require("../api/core/Utils");
        var loader = utils.loadCardByIds;
        console.log("------ TEST -------");
        console.log(loader(ids, global.card.TYPE_ACTIVE));
        done();
    });
});
