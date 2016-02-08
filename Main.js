/*jslint node: true*/

var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    chunckManager = require('./ChunckManager.js'),
    ChunckManager = new chunckManager.ChunckManager(),
    brickManager = require('./BrickManager.js'),
    BrickManager = new brickManager.BrickManager();

        
mongoose.connect('mongodb://localhost/popolina', function (err) {
    "use strict";
    if (err) {
        throw err;
    }
});

app.get("/", function (req, res) {
    "use strict";
    res.setHeader('Content-Type', 'text/plain');
    res.end('Popolina Home');
});

app.get("/maps/:iPos/:jPos", function (req, res) {
    "use strict";
    var i,
        iPos = req.params.iPos,
        jPos = req.params.jPos;
    
    iPos = parseInt(iPos, 10);
    jPos = parseInt(jPos, 10);
    
    ChunckManager.getChunck(iPos, jPos, function (chunck) {
        res.send(chunck);
    });
});

app.post("/levelTile/:iPos/:jPos/:i/:j/:step/:size", function (req, res) {
    "use strict";
    var i = req.params.i,
        j = req.params.j,
        iPos = req.params.iPos,
        jPos = req.params.jPos,
        step = req.params.step,
        size = req.params.size;
    
    i = parseInt(i, 10);
    j = parseInt(j, 10);
    iPos = parseInt(iPos, 10);
    jPos = parseInt(jPos, 10);
    step = parseInt(step, 10);
    size = parseInt(size, 10);
    ChunckManager.levelTile(iPos, jPos, i, j, step, size, function (chunck) {
        res.send(chunck);
    });
});

app.get("/bricks/:ref", function (req, res) {
    "use strict";
    var ref = req.params.ref;
    
    BrickManager.getBrick(ref, function (brick) {
        res.send(brick);
    });
});

app.listen(8080);