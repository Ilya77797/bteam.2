require('../models/categor');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
var Data=require('../models/data');
const LIMIT=9;
exports.get=async function(ctx, next) {

        if(ctx.isAuthenticated()){
            ctx.body = ctx.render('main',{isLoged:true});

        }
        else {

            ctx.body = ctx.render('main',{isLoged:false});
        }

};


