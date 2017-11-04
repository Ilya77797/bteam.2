const mongoose = require('mongoose');
const config = require('config');
const dataShema=new mongoose.Schema({
    _id:{
      type:Number,
      unique:true
    },

    name:{
        type:String,

    },

    category:{
        type:String
    },

    price:{
        type:String
    },

    specialPrice1:{
        type:String
    },

    specialPrice2:{
        type:String
     },

    specialPrice3:{
        type:String
    },

    icon:{
        type:String
    },

    amount:{
        type:String
    },

    status:{
        /*enum:['Новинка', 'Ожидается', 'Акция', 'Обычный']*/
        type:String
    },

    info:{
        type:String
    }


},

{timestamps: true});

module.exports = mongoose.model('Product', dataShema);