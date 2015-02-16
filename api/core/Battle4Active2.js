/**
 * 战斗场景 之 主动技能处理
 */
exports.battle4active2 = function battle4active2(myName, enemyName, skillId) {
    // 从全局索引获取战斗对象
    var me = global.playersInBattle[myName];
    var enemy = global.playersInBattle[enemyName];

    me.battleStatus = 2;//无敌状态为2

    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    sails.sockets.emit(me.socket, 'battle4active2', rsp);
    sails.sockets.emit(enemy.socket, 'battle4active2', rsp);
};
