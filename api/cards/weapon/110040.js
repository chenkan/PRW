/**
 * 武器卡牌：光剑
 */
module.exports = function(me, enemy, weapon) {
  var loader = require("../../core/LoadAttackTimer");
  loader.loadTimer(weapon, me, enemy);
  console.log(me.nickname + "加载了" + weapon.name);
};
