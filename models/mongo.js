var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/vaultDb');

var mongoSchema = mongoose.Schema;

var keyStore = {
    "key": String,
    "value": String,
    "timestamp": {type: Date, default: Date.now}
};

// create model if not exists.
module.exports = mongoose.model('key_store', keyStore);