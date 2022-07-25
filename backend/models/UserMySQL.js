const db = require("../config/mysql");

const User = function (user) {
    this.user_id = user.user_id;
    this.name = user.name;
    this.email = user.email;
}

User.findByEmail = function (email, result) {
    db.query("Select * from user where email = ? ", email, function(err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

module.exports = User;


