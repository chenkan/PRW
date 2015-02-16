/**
 * 战斗场景 之 主动技能处理
 */
exports.battle4active = function battle4active(myName, enemyName, skillId) {
  // 从全局索引获取战斗对象
  var me = global.playersInBattle[myName];
  var enemy = global.playersInBattle[enemyName];

  if (me && enemy) {
    var activeSkill = require("../cards/activeskill/" + skillId);
    activeSkill(me, enemy);
  }
};
