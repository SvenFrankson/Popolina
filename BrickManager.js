/*jslint node: true */

module.exports = {
    BrickManager : function () {
        "use strict";
        var models = require('./models'),
            BrickModel = models.Brick;
        
        this.getBrick = function (reference, callback) {
            BrickModel.getBrickByReference(reference, function (err, brick) {
                if (err) {
                    throw err;
                }
                if (brick === null) {
                    var newBrick = new BrickModel();
                    newBrick.reference = reference;
                    newBrick.vertices = [];
                    newBrick.triangles = [];
                    return newBrick.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(newBrick);
                    });
                } else {
                    callback(brick);
                }
            });
        };
    }
};