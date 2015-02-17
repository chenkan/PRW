/**
 * Index
 */
module.exports = {

    index: function (req, res) {
        if (req.session.user_detail) {
            res.view("homepage");
        } else {
            res.redirect("/login");
        }
    }

};
