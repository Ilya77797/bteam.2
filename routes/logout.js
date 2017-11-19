
exports.post = async function(ctx, next) {
  ctx.logout();

  ctx.session = null; // destroy session (!!!)

  if(ctx.request.ctx.params.f==':main')
    ctx.redirect('/');
  else
      ctx.redirect('/corzina');
};
