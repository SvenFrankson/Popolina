/*jslint node: true */

module.exports = {
    ChunckManager : function () {
        "use strict";
        var map = require('./MapGen.js'),
            mapBuilder = new map.MapGenerator(4242),
            mongoose = require('mongoose'),
            chunckDataSchema = new mongoose.Schema({
                iPos : Number,
                jPos : Number,
                map : [Number],
                blocks : [{
                    iPos : Number,
                    jPos : Number,
                    kPos : Number,
                    dir : Number,
                    reference : String
                }]
            });
        
        this.getChunck = function (iPos, jPos, callback) {
            var i,
                newChunck,
                newBlock1 = {},
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
                    newChunck.blocks = [];
                    newBlock1.iPos = 6;
                    newBlock1.jPos = 6;
                    newBlock1.kPos = newChunck.map[6 + 6 * 32];
                    newBlock1.dir = 0;
                    newBlock1.reference = "cube";
                    newChunck.blocks.push(newBlock1);
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
        
        this.moveTile = function (iPos, jPos, i, j, step) {
            var ChunckDataModel = mongoose.model('chunckData', chunckDataSchema);
            ChunckDataModel.findOne({ 'iPos' : iPos, 'jPos' : jPos}, function (err, doc) {
                if (err) {
                    throw err;
                }
                var newMap = doc.map.slice();
                newMap[i + 32 * j] += step;
                doc.map = newMap;
                doc.save(function (err) {
                    if (err) {
                        throw err;
                    }
                });
            });
        };
    }
};