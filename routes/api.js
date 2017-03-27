var express = require('express');
var mongoOp = require("../models/mongo");
var router = express.Router();


router.get('/', function (req, res, next) {
    res.status(404).send("Invalid api call");
});

// Endpoint: /object || Endpoint: /object/mykey  || Endpoint: /object/mykey?timestamp=1440568980
router.get('/object/:key', function (req, res) {

    var key = "";
    var timestamp;
    key = req.params.key;

    if (req.query.timestamp) {
        timestamp = parseInt(req.query.timestamp) * 1000;
    }

    storeGet(key, timestamp, res);
});


// Endpoint: /object
router.post('/object', function (req, res) {

    var body = req.body;

    var key = Object.keys(body)[0];
    var value = body[key];
    storePut(key, value, res);
})


function storePut(key, value, res) {
    var db = new mongoOp();

    db.key = key;
    db.value = value;

    db.save(function (err) {

        if (err) {
            response = {"error": true, "message": "Error adding data"};
        } else {
            response = {"error": false, "message": "Data added"};
        }
        res.send(response);
    });

}


function storeGet(key, timestamp, res) {

// if timestamp is present return whatever the value of the key at the time was
    if (timestamp) {
        var isoTime = new Date(timestamp).toISOString();
        mongoOp.find({
            'key': key,
            "timestamp": {$lte: isoTime}
        }).sort({'timestamp': -1}).limit(1).exec(function (err, returnedValue) {
            if (err) {
                res.send(err);
            }
            if (returnedValue[0]) {
                res.send(returnedValue[0]._doc.value.toString());
            } else {
                res.status(404).send("No matching key found");
            }
        });
    } else {
        mongoOp.find({
            'key': key
        }).sort({'timestamp': -1}).limit(1).exec(function (err, returnedValue) {
            if (err) {
                res.send(err);
            }
            console.log(returnedValue);
            if (returnedValue[0]) {
                res.send(returnedValue[0]._doc.value.toString());
            } else {
                res.status(404).send("No matching key found");
            }
        });
    }
}


module.exports = router;
