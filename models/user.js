var mongoose = require('mongoose')
var MovieSchema = require('../schemas/user')
var User = mongoose.model('User',MovieSchema)

module.exports = User