/**
 * 被动技能卡牌：天下无双
 * 分类：定时器 / Buff类
 */
module.exports = function(me, other) {
  var utils = require("../../core/Utils");
  var loaderById = utils.loadCardById;
  var skill = loaderById(300130);
  console.log(me.nickname + "加载了" + skill.name);

  me.timers[skill.id] = setInterval(function () {

    for (var e in me.equipment_cards) {
      me.equipment_cards[e]['attack'] *= (1 + skill['alterSelfValue']);
    }

    /* rsp data */
    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    rsp.data.fight_info = me.nickname + " 发动『天下无双』 攻击力提升!";

    /* user_info */
    rsp.data.user_info = {};
    rsp.data.user_info[me.login] = "HP : " + me.hp;
    rsp.data.user_info[other.login] = "HP : " + other.hp;

    /* socket emit */
    sails.sockets.emit(me.socket, 'battle4timer', rsp);
    sails.sockets.emit(other.socket, 'battle4timer', rsp);
  }, skill['interval'] * 1000);

};

// TODO 此卡还没有专门测试
