/**
 * 主动技能卡牌：振奋士气
 * 描述：提高所有武器20%攻击，持续15秒
 */
module.exports = function(me, enemy) {
  var utils = require("../../core/Utils");
  var loadCardById = utils.loadCardById;
  var loaderBuff = require("../../core/LoadBuff");
  var skill = loadCardById(200000);

  // Buff及刷新武器定时器
  loaderBuff.loadBuff(skill, me, enemy);
  // updateWeaponTimer(me, enemy);

  // 开始释放主动技能
  me.buffState.push(200000);
  var rsp = {code: 200, data: {}};
  rsp.data.fight_info = me.nickname + " 发动【振奋士气】";
  rsp.data.fight_id = 200000;
  rsp.data.user_info = {};
  rsp.data.user_info[me.login] = "HP: " + me.hp;
  rsp.data.user_info[enemy.login] = "HP: " + enemy.hp;
  sails.sockets.emit(me.socket, 'battle4active', rsp);
  sails.sockets.emit(enemy.socket, 'battle4active', rsp);

  me.timeouts[200000] = setTimeout(function() {
    // UnBuff及刷新武器定时器
    loaderBuff.unloadBuff(skill, me, enemy);
    // updateWeaponTimer(me, enemy);

    // 结束主动技能
    me.buffState = me.buffState.filter(function(value) {return value != 200000});
    var rsp = {code: 200, data: {}};
    rsp.data.fight_info = me.nickname + " 结束【振奋士气】";
    rsp.data.fight_id = 200000;
    rsp.data.user_info = {};
    rsp.data.user_info[me.login] = "HP: " + me.hp;
    rsp.data.user_info[enemy.login] = "HP: " + enemy.hp;
    sails.sockets.emit(me.socket, 'battle4active', rsp);
    sails.sockets.emit(enemy.socket, 'battle4active', rsp);
  }, skill['duration'] * 1000);
}
