const mongoose=require('../libs/mongoose');
var isLogged=require('../libs/isLogged');
var Data=require('../models/data');
var Category=require('../models/categor');
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
        if(cat==null||cat=="allProducts")
        {
            var products= await Data.find().skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count().then(returnLength);

        }
        else {
            var allCats=await Category.find({});
            var resMass=deepSearch(allCats,cat);
            if(resMass.length<=1){
                resMass=resMass[0].name;
            }
            else {
                resMass.shift();
            }

            var products=await Data.find({'category':{ $in : resMass }}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                var numberOfPages=await Data.count({'category':{ $in : resMass }}).then(returnLength);

        }

    }
    else{
        var rex=new RegExp(search,'i');//
        if(cat==null||cat=="allProducts")
        {
            var products= await Data.find({'name':rex}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count({'name':rex}).then(returnLength);
        }
        else {//стр
            var allCats=await Category.find({});
            var resMass=deepSearch(allCats,cat);
            if(resMass.length<=1){
                resMass=resMass[0].name;
            }
            else {
                resMass.shift();
            }
            var products=await Data.find({'category':{ $in : resMass }, 'name':rex}).skip((page-1)*LIMIT).limit(LIMIT);
            if(!isPageSearch)
                numberOfPages=await Data.count({'category':{ $in : resMass }, 'name':rex}).then(returnLength);
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
                item.specialPrice4='null';
            });

            ctx.body = {Products:products, login:false, PageCount:numberOfPages};
        }


    }


};

function deepSearch(cat, req) {
    var resSubcats=[];
    search(cat);
    return resSubcats;
    function search(cat) {
        cat.forEach((item)=>{
            if(item.name==req){
                resSubcats.push(item);
                if(item.subcat!='null')
                    addToMass(item.subcat);
            }
            else {
                if(item.subcat!='null')
                    search(item.subcat);
            }
        });
    }
    function addToMass(subcat) {
        subcat.forEach((item)=>{
            resSubcats.push(item.name);
            if(item.subcat!='null')
                addToMass(item.subcat);
        });
    }

}

