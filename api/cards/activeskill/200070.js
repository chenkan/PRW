/**
 * 主动技能卡牌：精确命中
 * 编号：200070
 * 分类：Buff
 * 描述：提高自身所有武器15%命中率，持续25秒
 */
module.exports = function(me, enemy) {
  // 同一个技能不能叠加使用
  if (me.timeouts[200070]) {
    return;
  }

  var utils = require("../../core/Utils");
  var loaderById = utils.loadCardById;
  var loaderBuff = require("../../core/LoadBuff");
  var skill = loaderById(200070);

  // Buff
  loaderBuff.loadBuff(skill, me, enemy);

  /* rsp data */
  var rsp = {};
  rsp.code = 200;
  rsp.data = {};
  rsp.data.fight_info = me.nickname + " 发动『精确命中』";
  rsp.data.user_info = {};
  rsp.data.user_info[me.login] = "HP: " + me.hp;
  rsp.data.user_info[enemy.login] = "HP: " + enemy.hp;
  sails.sockets.emit(me.socket, 'battle4active', rsp);
  sails.sockets.emit(enemy.socket, 'battle4active', rsp);

  // 设置Buff持续时间
  me.timeouts[200070] = setTimeout(function () {
    // UnBuff
    loaderBuff.unloadBuff(skill, me, enemy);

    /* rsp data */
    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    rsp.data.fight_info = me.nickname + " 结束『精确命中』";
    rsp.data.user_info = {};
    rsp.data.user_info[me.login] = "HP: " + me.hp;
    rsp.data.user_info[enemy.login] = "HP: " + enemy.hp;
    sails.sockets.emit(me.socket, 'battle4active', rsp);
    sails.sockets.emit(enemy.socket, 'battle4active', rsp);

    delete me.timeouts[200070];
  }, skill['duration'] * 1000);

};

