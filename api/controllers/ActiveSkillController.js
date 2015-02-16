/**
 * 主动技能控制器
 */
module.exports = {

    on: function (req, res) {
        var myName = req.param('myName');
        var enemyName = req.param('enemyName');
        var skillId = req.param('skillId');
        console.log("send a active skill: " + skillId);
        console.log(skillId);

        var battle4active = require("../core/Battle4Active");
        battle4active.battle4active(myName, enemyName, skillId);
    }

};
