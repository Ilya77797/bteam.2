const passport = require('koa-passport');
const compose = require('koa-compose');
let User = require('../models/user');
const mongoose=require('mongoose');
exports.post = async (ctx, next) => {
    //await passport.authenticate('local');
    var a =await auth(ctx);
    if (ctx.state.user) {
        ctx.body={id:ctx.sessionId};
        //ctx.redirect('/');
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



