/**
 * 工具类
 */
module.exports = {

    /**
     * 从xml中解析处卡牌数据为JSON
     * @param path
     * @param rootNode
     * @param subNode
     * @param callback
     * 每张卡牌解析后的JSON格式为：
     * { id: 200000,
     *   name: '振奋士气',
     *   cost: 8,
     *   alterSelfType: 1,
     *   alterSelfValue: 0.2,
     *   alterOtherType: 0,
     *   alterOtherValue: 0,
     *   specialType: 0,
     *   specialValue: 0,
     *   interval: -1,
     *   duration: 15,
     *   upgradePoint: -1,
     *   desc: '提高所有武器20%攻击,持续15秒' }
     */
    parseCards: function (path, rootNode, subNode, callback) {
        var fs = require('fs'),
            xml2js = require('xml2js');

        var parser = new xml2js.Parser();
        fs.readFile(path, function (err, data) {
            parser.parseString(data, function (err, result) {
                var cardIndex = {};
                var cards = result[rootNode][subNode];
                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    var keys = Object.keys(card);
                    for (var j = 0; j < keys.length; j++) {
                        var key = keys[j];
                        var value = card[key][0];
                        if (!isNaN(value)) {            // 解析数值
                            value = parseFloat(value);
                        }
                        card[key] = value;
                    }
                    cardIndex[card.id] = card;
                }
                callback(cardIndex);
            });
        });
    },

    /**
    * 依据id数组获取卡牌数据
    * @param ids
    */
    loadCardByIds: function (ids) {
        var clone = require('clone');
        var data = global.card.DATA_ALL;
        var rsp = [];
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            rsp.push(clone(data[id]));
        }
        return rsp;
    },

    /**
     * 依据id获取卡牌数据
     * @param id
     */
    loadCardById: function (id) {
        var clone = require('clone');
        var data = global.card.DATA_ALL;
        return clone(data[id]);
    },

    /**
     * 迭代遍历JSON 删除指定节点
     * - 这个API的可靠性 & 性能还待验证 以后考虑采用合适的NPM包
     * @param obj
     * @param nodeSet
     */
    trimJson: function (obj, nodeSet) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if(nodeSet.indexOf(property) > -1) {
                    delete obj[property];
                }
                if (typeof obj[property] == "object") {
                    module.exports.trimJson(obj[property], nodeSet);
                }
            }
        }
    }
};
