/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (callback) {

    // 设置全局常量
    setParams();

    // 刷新用户状态
    User.update({},{status:global.status.STATUS_OFFLINE}).exec(function afterwards(err, updated) {
        if (err) {
            return;
        }
        console.log('-- 重启服务器时更新所有用户的状态 -- 所有用户下线 --');
    });

    // Callback
    callback();
};

function setParams() {
    /* 用户状态码 */
    global.status = {};
    global.status.STATUS_OFFLINE        = 0;
    global.status.STATUS_ONLINE         = 1; // ignore this status
    global.status.STATUS_WAITING_BATTLE = 2;
    global.status.STATUS_IN_BATTLE      = 3; // ignore this status

    /* 卡牌类型 */
    global.card = {};
    global.card.TYPE_EQUIPMENT          = 1;
    global.card.TYPE_ACTIVE             = 2;
    global.card.TYPE_PASSIVE            = 3;

    /* 卡牌数据 */
    loadCardInfo();

    /* 装备属性码 */
    global.equipment = {};
    global.equipment.ATTR_ATTACK        = 1; // 攻击
    global.equipment.ATTR_ARMOR         = 2; // 护甲
    global.equipment.ATTR_SPEED         = 3; // 攻击CD / 单位秒
    global.equipment.ATTR_HIT           = 4; // 命中率
    global.equipment.ATTR_MISS          = 5; // 闪避率
    global.equipment.ATTR_BASH          = 6; // 暴击率
    global.equipment.ATTR_AMMO          = 7; // 弹药量

    /* 战斗中对象的全局索引 */
    global.playersInBattle = {};
}

/**
 * 合并Object
 * @param obj1
 * @param obj2
 * @returns {}
 */
// seek better merge tool
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var x in obj1) { obj3[x] = obj1[x]; }
    for (var y in obj2) { obj3[y] = obj2[y]; }
    return obj3;
}

/**
 * 从xml文件加载卡牌数据
 */
function loadCardInfo() {
    var utils = require("../api/core/Utils");
    var parser = utils.parseCards;
    var async = require('async');
    async.parallel([
            function (callback) {
                parser('./tables/equipment.xml', 'equipments', 'equipment', function(data) {
                    global.card.DATA_EQUIPMENT = data;
                    callback();
                });
            },
            function (callback) {
                parser('./tables/activeSkill.xml', 'activeSkills', 'activeSkill', function(data) {
                    global.card.DATA_ACTIVE = data;
                    callback();
                });
            },
            function (callback) {
                parser('./tables/passiveSkill.xml', 'passiveSkills', 'passiveSkill', function(data) {
                    global.card.DATA_PASSIVE = data;
                    callback();
                });
            }
        ],

        function (err, results) {
            global.card.DATA_ALL = merge_options(merge_options(global.card.DATA_EQUIPMENT, global.card.DATA_ACTIVE),global.card.DATA_PASSIVE);
            var fs = require('fs');
            var files = fs.readdirSync("./api/cards/activeskill").concat(fs.readdirSync("./api/cards/passiveskill")).concat(fs.readdirSync("./api/cards/weapon"));
            parser('./tables/shop.xml', 'shops', 'shop', function(data) {
              for (var p in data) {
                var shop = data[p];
                if (files.indexOf(shop.id + ".js") > -1) {  // 代码中已实现的卡牌才可以进入商店
                  shop.card = global.card.DATA_ALL[shop.id];
                } else {
                  delete data[p];
                }
              }
              global.card.SHOP = data;
            });
        }
    );
}
