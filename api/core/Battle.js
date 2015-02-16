/**
 * 战斗场景控制模块
 * @param done - 当做执行结束的标志位使用（但并不表示函数内所有线程及资源都正常释放了）
 */
exports.battle = function battle (id1, id2, done) {

    var async = require('async');

    var player1;
    var player2;
    var players;

    // 从数据库读取User数据
    async.parallel([
            function (callback) {           // callback1
                findUser(id1, callback);
            },
            function (callback) {           // callback2
                findUser(id2, callback);
            }
        ],

        function (err, results) { // results = [callback1, callback2]
            var user1 = results[0];
            var user2 = results[1];
            if (!user1 || !user2) {
                return;
            }
            socket1 = user1.socket;
            socket2 = user2.socket;

            // 初始化 & 推送基本信息
            var battle4init = require("./Battle4Init");
            players = battle4init.battle4init(user1, user2);
            player1 = players[0];
            player2 = players[1];

            // 把战斗对象压入全局索引 在处理主动技能的接口中可以访问这些对象
            global.playersInBattle[player1.login] = player1;
            global.playersInBattle[player2.login] = player2;

            // FIXME 战斗结束结算
            var battle4end = require("./Battle4End");
            battle4end.battle4end(player1, player2);

        });

};

// TODO 战斗结束后彻底清除所有占用资源


 /**
 * 从数据库读取User数据
 */
function findUser(id, callback) {
    User.findOne({login:id}).exec(callback);
}
