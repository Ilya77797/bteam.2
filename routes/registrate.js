const mongoose=require('../libs/mongoose');

const User=require('../models/user');
exports.get=async function (ctx, next) {
    ctx.body=ctx.render('regestration');
};

exports.post=async function (ctx, next) {
   var data= ctx.request.body;
   const user=new User({
       email:data.email,
       displayName: data.email,
       password: data.password1,

   });

   try{
       await user.save();
   }
   catch(e){
     if(e.name=='ValidationError'){
         let errorMessages = "";
         for(let key in e.errors) {
             errorMessages += `${key}: ${e.errors[key].message}<br>`;
         }
         ctx.flash('error', errorMessages);
         ctx.redirect('/register');
         return;
     }
     else {
         ctx.throw(e);
     }

   }

    await ctx.login(user);

    ctx.redirect('/');


}