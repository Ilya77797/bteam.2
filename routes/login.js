const passport = require('koa-passport');
const compose = require('koa-compose');

const mongoose=require('mongoose');
exports.post = compose([
  passport.authenticate('local'),
  async (ctx, next) => {
    if (ctx.state.user) {
        ctx.redirect('/');
    } else {
      ctx.status = 401;
      ctx.body = { error: info };
    }
  }
]);



