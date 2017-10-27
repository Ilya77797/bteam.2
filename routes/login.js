const passport = require('koa-passport');
const compose = require('koa-compose');
var session=require('../libs/mongoose');
let User = require('../models/user');
const mongoose=require('mongoose');
exports.post = async (ctx, next) => {
    //await passport.authenticate('local');
    var a =await auth(ctx);
    if (ctx.state.user) {
        var ses={
            sid:`koa:sess:${ctx.sessionId}`,
            blob:'{"cookie":{"httpOnly":true,"path":"/","overwrite":true,"signed":false,"maxAge":14400000}}'
        };
        var curSes=new session.models.Session(ses);
        try {
            await curSes.save();
        }
        catch (e){

        }
        ctx.redirect('/');
    } else {
      ctx.status = 401;
      ctx.body = { error: 'err'};

    }
  };

async function auth(ctx) {
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    var user=await User.findOne({ username });

        if (!user || !user.checkPassword(password)) {
            // don't say whether the user exists
            return  0
        }
        else {
            ctx.state.user=user;
        }



}



