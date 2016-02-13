/*jslint node: true */

var mongoose = require('mongoose'),
    brickDataSchema = new mongoose.Schema({
        reference : String,
        vertices : [Number],
        triangles : [Number]
    });

var Brick = module.exports = mongoose.model('Brick', brickDataSchema);

module.exports.getBrickByReference = function (reference, callback) {
    "use strict";
    var query = Brick.findOne(null);
    query.where('reference', reference);
    query.exec(callback); // Should it return on this line ? Can't really tell...
};