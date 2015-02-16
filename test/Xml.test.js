/** Usage ***
 * mocha Xml.test.js
 */

describe('/parse xml to json/', function () {
    it("should show cards in json", function (done) {
        var utils = require("../api/core/Utils");
        var parser = utils.parseCards;
        parser('../tables/equipment.xml', 'equipments', 'equipment', function(data) {
            console.log(data);
            done();
        });
    });
});
