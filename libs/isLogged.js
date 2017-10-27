const mongoose=require('../libs/mongoose');
var session=require('../libs/mongoose');
module.exports=async function isLogged(ctx) {
    try{
        var ses=ctx.sessionId;
    }
    catch (e){

    }

    if(ses==undefined)
        return false
    var a= await session.models.Session.find({sid:`koa:sess:${ses}`});

    if (a.length!=0)
        return true

    return false;
}