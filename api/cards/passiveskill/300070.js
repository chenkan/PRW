/**
 * 被动技能卡牌：菁英战士
 */
module.exports = function(me, enemy) {
  var utils = require("../../core/Utils");
  var loaderById = utils.loadCardById;
  var skill = loaderById(300070);
  var loader = require("../../core/LoadBuff");
  loader.loadBuff(skill, me, enemy);
  console.log(me.nickname + "加载了" + skill.name);
};
