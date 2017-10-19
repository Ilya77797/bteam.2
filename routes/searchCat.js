const mongoose=require('../libs/mongoose');
var Categor=require('../models/categor');
exports.get=async function(ctx, next) {
    var data=ctx.request.body.search.trim();
    if(data[0]==''||data[0]==undefined){
        var cat= await Categor.find({});
    }
    else {
        var rex=new RegExp('^'+data,'i')
        var cat= await Categor.find({'category':rex});
    }
    if(cat.length==0){
        ctx.body=['Нет таких категорий'];
    }
    else {
        var cat2=cat.map((item)=>item.category);
        ctx.body=cat2;
    }




};


