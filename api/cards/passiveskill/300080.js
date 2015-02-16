/**
 * 被动技能卡牌：补充弹药
 * 分类：定时器 / 回复类
 */
module.exports = function(me, other) {
  var utils = require("../../core/Utils");
  var loaderById = utils.loadCardById;
  var skill = loaderById(300080);
  console.log(me.nickname + "加载了" + skill.name);

  me.timers[skill.id] = setInterval(function () {

    for (var e in me.equipment_cards) {
      me.equipment_cards[e]['ammo'] += skill['alterSelfValue'];
    }

    /* rsp data */
    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    rsp.data.fight_info = me.nickname + " 发动『补充弹药』 回复" + skill['alterSelfValue'] + "点弹药";

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
