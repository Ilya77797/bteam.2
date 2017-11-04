require('../models/categor');
var session=require('../libs/mongoose');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
var Data=require('../models/data');
var isLogged=require('../libs/isLogged');
exports.get=async function (ctx, next) {
    //var products=ctx.request.body.products;
    if(isLogged())
        ctx.body = ctx.render('korzina',{isLoged:true});
    else
        ctx.body = ctx.render('korzina',{isLoged:false});
};

exports.post=async function (ctx, next) {
    var massID=ctx.request.body.data;
    var resultData= [];
    for(let i=0; i<massID.length;i++){
        var d=await Data.findOne({_id:parseInt(massID[i])});
        resultData.push(d);
    }
resultData.sort((a,b)=>{
        var l=a.createdAt.getTime();
        var l1=b.createdAt.getTime()
        if(l<l1)
            return -1
        else
            return 1
});
    var b=0;




};
