require('../models/categor');
var session=require('../libs/mongoose');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
var Data=require('../models/data');
var isLogged=require('../libs/isLogged');
const LIMIT=9;
exports.get=async function(ctx, next) {

        if(await isLogged(ctx)){
            ctx.body = ctx.render('main',{isLoged:true});

        }
        else {

            ctx.body = ctx.render('main',{isLoged:false});
        }

};




