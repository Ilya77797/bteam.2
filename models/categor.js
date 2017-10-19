const mongoose = require('mongoose');
const config = require('../config/default');
const categorShema=new mongoose.Schema({
    category:{
        type: String,
    }
},
);

module.exports = mongoose.model('Categor', categorShema);
