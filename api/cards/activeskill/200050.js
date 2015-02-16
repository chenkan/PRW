/**
 * 主动技能卡牌：定时炸弹
 * 描述：设置定时炸弹，5秒后给对方造成500点伤害
 */
module.exports = function(me, enemy) {
  var timer;

  timer = setTimeout(function() {
    enemy.hp -= 500;
    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    rsp.data.user_info = {};
    rsp.data.user_info[me.login] = "HP: " + me.hp;
    rsp.data.user_info[enemy.login] = "HP: " + enemy.hp;
    sails.sockets.emit(me.socket, 'battle4active', rsp);
    sails.sockets.emit(enemy.socket, 'battle4active', rsp);
  }, 5000);
}
