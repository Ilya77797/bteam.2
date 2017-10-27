const mongoose=require('../libs/mongoose');
var isLogged=require('../libs/isLogged');
var Data=require('../models/data');
const LIMIT=9;
function returnLength(mass) {
    return Math.ceil(mass/9);
}
exports.get=async function(ctx, next) {
    var search=ctx.request.body.text.trim();
    var cat=ctx.request.body.cat;
    var isMainSearch=ctx.request.body.flag;
    var isPageSearch=ctx.request.body.isPageS;
    var page=ctx.request.body.page;
    if(isMainSearch)
        page=1;

    var numberOfPages;
    if(search==''){
        if(cat==null)
        {
            var products= await Data.find().skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count().then(returnLength);

        }
        else {
            var products=await Data.find({'category':cat}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                var numberOfPages=await Data.count({'category':cat}).then(returnLength);

        }

    }
    else{
        var rex=new RegExp(search,'i');//
        if(cat==null)
        {
            var products= await Data.find({'name':rex}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count({'name':rex}).then(returnLength);
        }
        else {//стр
            var products=await Data.find({'category':cat, 'name':rex}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count({'category':cat, 'name':rex}).then(returnLength);
        }

    }

    if(products.length==0){
        ctx.body=['null'];
    }
    else {

        if(await isLogged(ctx)){
            ctx.body = {Products:products, login:true, PageCount:numberOfPages};

        }
        else{
            products.forEach(function (item) {
                item.specialPrice1='null';
                item.specialPrice2='null';
                item.specialPrice3='null';
            });

            ctx.body = {Products:products, login:false, PageCount:numberOfPages};
        }


    }


};