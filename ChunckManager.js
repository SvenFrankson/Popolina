/*jslint node: true */

module.exports = {
    ChunckManager : function () {
        "use strict";
        var self = this,
            map = require('./MapGen.js'),
            mapBuilder = new map.MapGenerator(4242),
            models = require('./models'),
            ChunckModel = models.Chunck,
            TemplateModel = models.Template;
        
        self.createChunck = function (iPos, jPos, callback) {
            var newChunck = new ChunckModel();
            newChunck.iPos = iPos;
            newChunck.jPos = jPos;
            newChunck.map = mapBuilder.getMap(iPos, jPos);
            newChunck.blocks = [];
            return newChunck.save(function (err) {
                if (err) {
                    throw err;
                }
                var i = Math.floor(Math.random() * 24) + 4,
                    j = Math.floor(Math.random() * 24) + 4,
                    k = newChunck.map[i + 32 * j],
                    tree = Math.floor(Math.random() * 4) + 1;
                if (k > mapBuilder.MAPHEIGHT / 2) {
                    return self.addTemplate(iPos, jPos, "tree" + tree, i, j, k, 0, callback);
                } else {
                    return callback(newChunck);
                }
            });
        };
        
        self.getChunck = function (iPos, jPos, callback) {
            ChunckModel.getChunckByPos(iPos, jPos, function (err, chunck) {
                if (err) {
                    throw err;
                }
                if (chunck === null) {
                    self.createChunck(iPos, jPos, function (newChunck) {
                        callback(newChunck);
                    });
                } else {
                    callback(chunck);
                }
            });
        };
        
        self.levelTile = function (iPos, jPos, levels, callback) {
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
        
        self.addBlock = function (iPos, jPos, reference, texture, i, j, k, d, callback) {
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
        
        self.addTemplate = function (iPos, jPos, reference, i, j, k, d, callback) {
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
                            console.log("Template not found");
                            return;
                        } else {
                            var n = 0,
                                block = {};
                            for (n = 0; n < template.blocks.length; n += 1) {
                                block.reference = template.blocks[n].reference;
                                block.texture = template.blocks[n].texture;
                                block.iPos = template.blocks[n].iPos + i;
                                block.jPos = template.blocks[n].jPos + j;
                                block.kPos = template.blocks[n].kPos + k;
                                block.dir = template.blocks[n].dir;
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