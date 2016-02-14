/*jslint node: true */

module.exports = {
    ChunckManager : function () {
        "use strict";
        var map = require('./MapGen.js'),
            mapBuilder = new map.MapGenerator(4242),
            models = require('./models'),
            ChunckModel = models.Chunck,
            TemplateModel = models.Template;
            
        
        this.getChunck = function (iPos, jPos, callback) {
            ChunckModel.getChunckByPos(iPos, jPos, function (err, chunck) {
                if (err) {
                    throw err;
                }
                if (chunck === null) {
                    var newChunck = new ChunckModel();
                    newChunck.iPos = iPos;
                    newChunck.jPos = jPos;
                    newChunck.map = mapBuilder.getMap(iPos, jPos);
                    newChunck.blocks = [];
                    return newChunck.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(newChunck);
                    });
                } else {
                    callback(chunck);
                }
            });
        };
        
        this.levelTile = function (iPos, jPos, levels, callback) {
            ChunckModel.getChunckByPos(iPos, jPos, function (err, chunck) {
                if (err) {
                    throw err;
                }
                if (chunck === null) {
                    return;
                } else {
                    var l,
                        newMap = chunck.map.slice();
                    for (l = 0; l < levels.length; l += 1) {
                        newMap[levels[l].i + levels[l].j * 32] += levels[l].h;
                    }
                    chunck.map = newMap;
                    chunck.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(chunck);
                    });
                }
            });
        };
        
        this.addBlock = function (iPos, jPos, reference, texture, i, j, k, d, callback) {
            ChunckModel.getChunckByPos(iPos, jPos, function (err, chunck) {
                if (err) {
                    throw err;
                }
                if (chunck === null) {
                    return;
                } else {
                    var block = {};
                    block.reference = reference;
                    block.texture = texture;
                    block.iPos = i;
                    block.jPos = j;
                    block.kPos = k;
                    block.dir = d;
                    chunck.blocks.push(block);
                    chunck.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        callback(chunck);
                    });
                }
            });
        };
        
        this.addTemplate = function (iPos, jPos, reference, i, j, k, d, callback) {
            ChunckModel.getChunckByPos(iPos, jPos, function (err, chunck) {
                if (err) {
                    throw err;
                } else if (chunck === null) {
                    return;
                } else {
                    TemplateModel.getTemplateByReference(reference, function (err, template) {
                        if (err) {
                            throw err;
                        } else if (template === null) {
                            return;
                        } else {
                            var n = 0;
                            for (n = 0; n < template.blocks.length; n += 1) {
                                var block = {};
                                block.reference = template.blocks[n].reference;
                                block.texture = template.blocks[n].texture;
                                block.iPos = template.blocks[n].iPos + i;
                                block.jPos = template.blocks[n].jPos + j;
                                block.kPos = template.blocks[n].kPos + k;
                                block.dir = template.blocks[n].dir;
                                console.log(block);
                                chunck.blocks.push(block);
                            }
                            chunck.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                callback(chunck);
                            });
                        }
                    });
                }
            });
        };
    }
};