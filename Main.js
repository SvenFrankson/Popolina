/*jslint node: true*/

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

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

app.post("/levelTile", function (req, res) {
    "use strict";
    var iPos = req.body.iPos,
        jPos = req.body.jPos,
        i = req.body.i,
        j = req.body.j,
        h = req.body.h;
    
    iPos = parseInt(iPos, 10);
    jPos = parseInt(jPos, 10);
    i = parseInt(i, 10);
    j = parseInt(j, 10);
    h = parseInt(h, 10);
    
    ChunckManager.levelTile(iPos, jPos, [{"i" : i, "j" : j, "h" : h}], function (chunck) {
        res.send(chunck);
    });
});

app.post("/addBlock", function (req, res) {
    "use strict";
    var i = req.body.i,
        j = req.body.j,
        k = req.body.k,
        d = req.body.d,
        iPos = req.body.iPos,
        jPos = req.body.jPos,
        reference = req.body.reference,
        texture = req.body.texture;
    
    i = parseInt(i, 10);
    j = parseInt(j, 10);
    k = parseInt(k, 10);
    d = parseInt(d, 10);
    iPos = parseInt(iPos, 10);
    jPos = parseInt(jPos, 10);
    
    ChunckManager.addBlock(iPos, jPos, reference, texture, i, j, k, d, function (chunck) {
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