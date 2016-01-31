module.exports = {
    ChunckManager : function () {
        "use strict";
        var map = require('./MapGen.js'),
            mapBuilder = new map.MapGenerator(42),
            mongoose = require('mongoose'),
            chunckDataSchema = new mongoose.Schema({
                iPos : Number,
                jPos : Number,
                map : [Number]
            });
        
        mongoose.connect('mongodb://localhost/popolina', function (err) {
            if (err) {
                throw err;
            }
        });
        
        this.getChunck = function (iPos, jPos, callback) {
            var i,
                newChunck,
                ChunckDataModel = mongoose.model('chunckData', chunckDataSchema),
                query = ChunckDataModel.find(null);
            
            query.where('iPos', iPos);
            query.where('jPos', jPos);
            query.exec(function (err, comms) {
                if (err) {
                    throw err;
                }
                if (comms.length === 0) {
                    newChunck = new ChunckDataModel();
                    newChunck.iPos = iPos;
                    newChunck.jPos = jPos;
                    newChunck.map = mapBuilder.getMap(iPos, jPos);
                    return newChunck.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(newChunck);
                    });
                } else {
                    callback(comms[0]);
                }
            });
        };
    }
};