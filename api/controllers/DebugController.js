/**
 * 调试页面
 * @type {{onlineUser: onlineUser, quickBattle: quickBattle}}
 */
module.exports = {

    /**
     * 快速战斗
     * @param req
     * @param res
     */
    quickBattle: function (req, res) {
        var myName = req.param('myName');
        var enemyName = req.param('enemyName');
        var done = function () {
            // ignore me
        };

        var battle = require("../core/Battle");
        battle.battle(myName, enemyName, done);
    },

    activeSkill: function (req, res) {
        var myName = req.param('myName');
        var enemyName = req.param('enemyName');
        var skillId = req.param('skillId');

        var battle4active = require("../core/Battle4Active");
        battle4active.battle4active(myName, enemyName, skillId);
    },

    activeSkill2: function (req, res) {
        var myName = req.param('myName');
        var enemyName = req.param('enemyName');
        var skillId = req.param('skillId');

        var battle4active2 = require("../core/Battle4Active2");
        battle4active2.battle4active2(myName, enemyName, skillId);
    }

};
