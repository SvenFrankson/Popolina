/*jslint node: true */

var mongoose = require('mongoose'),
    chunckDataSchema = mongoose.Schema({
        iPos : Number,
        jPos : Number,
        map : [Number],
        blocks : [{
            iPos : Number,
            jPos : Number,
            kPos : Number,
            dir : Number,
            reference : String,
            texture : String
        }]
    });

var Chunck = module.exports = mongoose.model('Chunck', chunckDataSchema);

module.exports.getChunckByPos = function (iPos, jPos, callback) {
    "use strict";
    var query = Chunck.findOne(null);
    query.where('iPos', iPos);
    query.where('jPos', jPos);
    query.exec(callback); // Should it return on this line ? Can't really tell...
};