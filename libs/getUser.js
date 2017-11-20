var session=require('../libs/mongoose');
const mongoose=require('../libs/mongoose');
const User=require('../models/user');

async function getUser(ctx) {
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
    return UserN;
}

module.exports=getUser;