/*jslint node: true */

var mongoose = require('mongoose'),
    templateDataSchema = mongoose.Schema({
        reference : String,
        blocks : [{
            iPos : Number,
            jPos : Number,
            kPos : Number,
            dir : Number,
            reference : String,
            texture : String
        }]
    });

var Template = module.exports = mongoose.model('Template', templateDataSchema);

module.exports.getTemplateByReference = function (reference, callback) {
    "use strict";
    var query = Template.findOne(null);
    query.where('reference', reference);
    query.exec(callback); // Should it return on this line ? Can't really tell...
};