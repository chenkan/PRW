/**
 * 被动技能卡牌：切断补给
 */
module.exports = function(me, enemy) {
  var utils = require("../../core/Utils");
  var loaderById = utils.loadCardById;
  var skill = loaderById(300090);
  var loader = require("../../core/LoadBuff");
  loader.loadBuff(skill, me, enemy);
  console.log(me.nickname + "加载了" + skill.name);

  for (var p in enemy.equipment_cards) {
    enemy.equipment_cards[p]['ammo'] -= skill['alterOtherValue'];
  }
};

// TODO 此卡还没有专门测试
