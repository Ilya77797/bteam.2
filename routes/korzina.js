require('../models/categor');
var session=require('../libs/mongoose');
const passport = require('koa-passport');
const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
var Data=require('../models/data');
var isLogged=require('../libs/isLogged');
const User=require('../models/user');
addProto();
exports.get=async function (ctx, next) {
    //var products=ctx.request.body.products;
    if(await isLogged(ctx))
        ctx.body = ctx.render('korzina',{isLoged:true});
    else
        ctx.body = ctx.render('korzina',{isLoged:false});
};

exports.post=async function (ctx, next) {

    var massID=ctx.request.body.data.map((item)=>{
        var a=null;
        try{
            a= parseInt(item);
        }
        catch(e) {

        }
        if(a!=null)
            return a;
    });
    var data=await Data.find({_id:{ $in : massID }});

    if(await isLogged(ctx)){
        var ses=ctx.sessionId;
        var sesObj= await session.models.Session.find({sid:`koa:sess:${ses}`});
        var userId=sesObj[0].user;
        var c=userId.toObjectId();
        var user= await User.find({_id:userId.toObjectId()});
        var UserN={
            name:user[0].displayName,
            price:user[0].visiblePrice,
            discount:user[0]. discount
        };
        ctx.body = {Products:data, login:true, User:UserN};

    }
    else{
        data.forEach(function (item) {
            item.specialPrice1='null';
            item.specialPrice2='null';
            item.specialPrice3='null';
            item.specialPrice4='null';
        });

        ctx.body = {Products:data, login:false};
    }






};

function addProto() {
    String.prototype.toObjectId = function() {
        var ObjectId = (require('mongoose').Types.ObjectId);
        return new ObjectId(this.toString());
    };
}
