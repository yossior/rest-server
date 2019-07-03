var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    name: String,
    adminIDs:[String],
    members: []
});


module.exports = mongoose.model('Team', Team);