/**
 * 战斗场景 之 战斗结束及战果结算
 */
exports.battle4end = function battle4end(player1, player2) {

  var watchJs = require("watchjs");
  var watch = watchJs.watch;
  watch(player1, "hp", function () {
    if (player1.hp <= 0) {
      summary4BattleEnd(player2, player1);
    }
  });

  watch(player2, "hp", function () {
    if (player2.hp <= 0) {
      summary4BattleEnd(player1, player2);
    }
  });

};

/**
 * 批量清除定时器
 * @param timers
 * @param timeouts
 */
function batchClearTimers(timers, timeouts) {
  for (var p in timers) {
    var timer = timers[p];
    clearInterval(timer);
  }
  for (var t in timeouts) {
    var timeout = timeouts[t];
    clearTimeout(timeout);
  }
}

/**
 * 战斗结算及推送相关信息
 * @param winner
 * @param loser
 */
function summary4BattleEnd(winner, loser) {
  batchClearTimers(winner.timers, winner.timeouts);
  batchClearTimers(loser.timers, loser.timeouts);
  var rsp = "【战斗结束】" + loser.nickname + "战败";
  delete global.playersInBattle[winner.login];
  delete global.playersInBattle[loser.login];
  setTimeout(function () {
    sails.sockets.emit(winner.socket, 'battle4end', rsp);
    sails.sockets.emit(loser.socket, 'battle4end', rsp);
  }, 3000);
}
