var mongoose = require('mongoose')
var MovieSchema = require('../schemas/infoCont')
var Movie = mongoose.model('Movie',MovieSchema)

module.exports = Movie
