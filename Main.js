var express = require('express'),
    app = express(),
    chunckManager = require('./ChunckManager.js'),
    ChunckManager = new chunckManager.ChunckManager();


app.get("/", function (req, res) {
    "use strict";
    res.setHeader('Content-Type', 'text/plain');
    res.end('Popolina Home');
});

app.get("/maps/:iPos/:jPos", function (req, res) {
    "use strict";
    var i,
        iPos = req.params.iPos,
        jPos = req.params.jPos,
        chunck,
        responseString;
    
    iPos = parseInt(iPos, 10);
    jPos = parseInt(jPos, 10);
    
    chunck = ChunckManager.getChunck(iPos, jPos, function (chunck) {
        res.send(chunck);
    });
});

app.listen(8080);