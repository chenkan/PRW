/**
 * 战斗场景 之 初始化
 * 1. 加载卡牌数据
 * 2. 计算血量及闪避率等战斗时参数
 * 3. 向客户端Push初始信息
 * 4. 函数本身返回交战双方的战斗时对象
 */
exports.battle4init = function battle4init (user1, user2) {

    // 加载卡牌数据
    loadCards(user1);
    loadCards(user2);

    var player1 = user1;
    var player2 = user2;
    player1.timers = {};
    player2.timers = {};
    player1.timeouts = {};
    player2.timeouts = {};
    player1.buffState = [];
    player2.buffState = [];

    // 加载被动技能
    loadPassiveSkill(player1, player2);
    loadPassiveSkill(player2, player1);

    // 加载武器
    loadWeapon(player1, player2);
    loadWeapon(player2, player1);

    // 计算HP及Miss
    setTotalHp(player1);
    setAverageMiss(player1);
    setTotalHp(player2);
    setAverageMiss(player2);

    // 设置初始状态
    setStatus(player1);
    setStatus(player2);

    // 向客户端Push初始信息
    var rsp = {};
    rsp.code = 200;
    rsp.data = {};
    rsp.data.fight_info = "【战斗开始】" + player1.nickname + " VS " + player2.nickname;
    rsp.data.user_info = {};
    rsp.data.user_info[user1.login] = player1;
    rsp.data.user_info[user2.login] = player2;

    // 裁剪不必要数据
    var utils = require("../core/Utils");
    var clone = require('clone');
    var trim = utils.trimJson;
    var trimSet = ["timers", "timeouts"];
    var rspTrim = clone(rsp);
    trim(rspTrim, trimSet);
    sails.sockets.emit(user1.socket, 'battle4init', rspTrim);
    sails.sockets.emit(user2.socket, 'battle4init', rspTrim);

    return [player1, player2];
};

/**
 * 加载卡牌数据
 * @param user
 */
function loadCards(user) {
    var utils = require("./Utils");
    var loaderByIds = utils.loadCardByIds;
    var loaderById = utils.loadCardById;
    user["active_skill_cards"] = loaderByIds(user["active_skill_cards"]);
    user["passive_skill_cards"] = loaderByIds(user["passive_skill_cards"]);
    user["my_cards"] = loaderByIds(user["my_cards"]);
    user["equipment_cards"]["main_weapon"] = loaderById(user["equipment_cards"]["main_weapon"]);
    user["equipment_cards"]["assist_weapon"] = loaderById(user["equipment_cards"]["assist_weapon"]);
    user["equipment_cards"]["engine_body"] = loaderById(user["equipment_cards"]["engine_body"]);
    user["equipment_cards"]["accessory"] = loaderById(user["equipment_cards"]["accessory"]);
}

/**
 * 机甲总HP
 */
function setTotalHp(player) {
    player.hp =
        player["equipment_cards"]["main_weapon"]["armour"] +
        player["equipment_cards"]["assist_weapon"]["armour"] +
        player["equipment_cards"]["engine_body"]["armour"] +
        player["equipment_cards"]["accessory"]["armour"];
}

/**
 * 机甲平均miss值
 */
function setAverageMiss(player) {
    player.miss =
        (player["equipment_cards"]["main_weapon"]["dodge_rate"] +
        player["equipment_cards"]["assist_weapon"]["dodge_rate"] +
        player["equipment_cards"]["engine_body"]["dodge_rate"] +
        player["equipment_cards"]["accessory"]["dodge_rate"]) / 4;
}

/**
 * 机甲状态
 */
function setStatus(player) {
    player.battleStatus = 0;//普通状态初始默认为0
}


// 不考虑excel配置数据异常时的处理
// excel配置表在系统启动时统一检查

/**
 * 加载被动技能
 * - 技能严格区分Buff和特效
 * - Buff数值必须是百分比
 * @param me
 * @param other
 */
function loadPassiveSkill(me, other) {
    var passiveCards = me.passive_skill_cards;
    for (var p in passiveCards) {
        var skill = passiveCards[p];
        var skillJS = require("../cards/passiveskill/" + skill.id);
        skillJS(me, other);
    }
}

/**
 * 加载武器卡牌
 * @param me
 * @param other
 */
function loadWeapon(me, other) {
  var weaponCards = me.equipment_cards;
  for (var p in weaponCards) {
    var weapon = weaponCards[p];
    var weaponJS = require("../cards/weapon/" + weapon.id);
    weaponJS(me, other, weapon);
  }
}
