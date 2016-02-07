/*jslint node: true */

module.exports = {
    BrickManager : function () {
        "use strict";
        var mongoose = require('mongoose'),
            brickDataSchema = new mongoose.Schema({
                reference : String,
                vertices : [Number],
                triangles : [Number]
            });
        
        this.getBrick = function (ref, callback) {
            var i,
                newBrick,
                BrickDataModel = mongoose.model('brickData', brickDataSchema),
                query = BrickDataModel.find(null);
            
            query.where('ref', ref);
            query.exec(function (err, comms) {
                if (err) {
                    throw err;
                }
                if (comms.length === 0) {
                    newBrick = new BrickDataModel();
                    newBrick.reference = ref;
                    newBrick.vertices = [-0.25, 0, -0.25,
                                         0.25, 0, -0.25,
                                         0.25, 0, 0.25,
                                         -0.25, 0, 0.25,
                                         -0.25, 0.6, -0.25,
                                         0.25, 0.6, -0.25,
                                         0.25, 0.6, 0.25,
                                         -0.25, 0.6, 0.25
                                        ];
                    newBrick.triangles = [0, 1, 2,
                                          0, 2, 3,
                                          2, 6, 7,
                                          2, 7, 3,
                                          6, 5, 4,
                                          6, 4, 7,
                                          1, 5, 6,
                                          1, 6, 2,
                                          0, 4, 5,
                                          0, 5, 1,
                                          3, 7, 4,
                                          3, 4, 0
                                         ];
                    return newBrick.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(newBrick);
                    });
                } else {
                    callback(comms[0]);
                }
            });
        };
    }
};