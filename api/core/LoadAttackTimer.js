/**
 * 加载攻击性定时器
 * - 武器
 * - 部分特效（浮游炮，等）
 */
module.exports = {

  /**
   * @param card
   * @param me
   * @param other
   */
  loadTimer: function (card, me, other) {
    if (card['attack'] > 0 && card['attack_speed'] > 0 && card['ammo'] > 0) {
      (function (ep) {
        var onceAttack = function () {
          ep['ammo'] -= 1;

          /* rsp */
          var rsp = {};
          rsp.code = 200;
          rsp.data = {};

          /* fight_info */
          // 检查弹药量
          if (0 <= ep['ammo']) {
            // 是否命中
            var isHit = Math.random() < ep['hit_rate'] && Math.random() > other.miss;
            if (other.battleStatus != 2) { // TODO 使用统一的status code
              if (isHit) {
                rsp.data.fight_info = me.nickname + " " + ep.name + " 造成" + ep['attack'] + "伤害";
                if (other.hp < ep['attack']) {
                  other.hp = 0;
                } else {
                  other.hp -= ep['attack'];
                }
              } else {
                rsp.data.fight_info = me.nickname + " " + ep.name + " 攻击未命中";
              }
            } else {
              rsp.data.fight_info = me.nickname + " " + ep.name + " 攻击未造成伤害";
            }

            // 是否最后一发弹药
            if (0 == ep['ammo']) {
              rsp.data.fight_info = rsp.data.fight_info + "（弹药耗尽了）"
            }
          } else {
            // TODO do something here?
            return;
          }

          /* user_info */
          rsp.data.user_info = {};
          rsp.data.user_info[me.login] = "HP : " + me.hp;
          rsp.data.user_info[other.login] = "HP : " + other.hp;

          /* socket emit */
          sails.sockets.emit(me.socket, 'battle4timer', rsp);
          sails.sockets.emit(other.socket, 'battle4timer', rsp);

          /* 设置下一次攻击的定时器 */
          if (other.hp > 0) {
            me.timeouts[ep.id] = setTimeout(onceAttack, ep['attack_speed'] * 1000);
          }

          console.log(me.nickname + " " + ep.name + " heating...");
        };

        /* 触发第一次攻击 */
        me.timeouts[ep.id] = setTimeout(onceAttack, ep['attack_speed'] * 1000);
      })(card);
    }
  }

};
