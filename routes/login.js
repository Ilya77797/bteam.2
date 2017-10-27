const passport = require('koa-passport');
const compose = require('koa-compose');
let User = require('../models/user');
const mongoose=require('mongoose');
exports.post = async (ctx, next) => {
    var a =await auth(ctx);
    if (ctx.state.user) {
        ctx.redirect('/');
    } else {
      ctx.status = 401;
      ctx.body = { error: a};

    }
  };

async function auth(ctx) {
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    var user=await User.findOne({ username });

        if (!user || !user.checkPassword(password)) {
            // don't say whether the user exists
            return  {userP:user.checkPassword(password), func:user.checkPassword}
        }
        else {
            ctx.state.user=user;
        }
    


}



