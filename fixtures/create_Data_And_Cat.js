const Dataq=require('../models/data');
const mongoose=require('../libs/mongoose');
const Categor=require('../models/categor');
const mainFile=require('../Price/main.json');

function takeName(str) {
    if(str.indexOf('<')==-1)
        return str
    return str.substring(0,str.indexOf('<'));


}

function takeStatus(str) {
    if(str.indexOf('<')==-1)
        return 'В наличие'
    return str.substring(str.indexOf('<strong>')+8,str.indexOf('</strong>'));
}

function takeInfo(str1, str2) {
    if(str1==''||str1==undefined)
        return 'null'
    if(str1=='/url')
        return 'http://img.optonoff.ru/show/'+str2

    /*var str=str1.substring(str1.indexOf("http"),str1.indexOf("target")-2);
     return str.replace(/'\'/g, "")*/
    var str= str1.substring(str1.indexOf('http'),str1.indexOf("target"));
    var index=str.indexOf("'")
    if(index==-1)
        return str
    else
        return str.substring(0,index);
}

function takeIcon(str) {
    if(str==''||str==undefined)
        return 'images/noPicture.png'
    return 'http://img.optonoff.ru/'+str
}

function takeAmount(str) {
    return str.substring(str.indexOf('+'))
}

function takeCat(str) {
    if(str==undefined)
        return 'null'
    return str
}
//parcing categories
var resultCat=[];
try{
    mainFile.groups.forEach((item)=>{
        let cat={
            name:item.name,
            subcat:item.subcat
        };
        resultCat.push(cat);

    });
}
catch (e){

}
resultCat.forEach(async function (item) {
    let cat=new Categor(item);
    await cat.save();
    console.log(`category ${item.name} is added to the database`);
});



//parcing data from JSON---Доделать
/*
var resultMass=[];
try {
    mainFile.data.forEach((item,i)=>{
        var dataObj={
            _id:parseInt(item[0]),
            name:parseInt(item[0])+' '+takeName(item[1]),
            category:takeCat(item[10]),
            price:item[4],
            specialPrice1:item[5],
            specialPrice2:item[6],
            specialPrice3:item[7],
            icon:takeIcon(item[10]),
            amount:takeAmount(item[3]),
            status:takeStatus(item[1]),
            info:takeInfo(item[2], item[10]),


        };
        resultMass.push(dataObj);
    });

}
catch(e){
    console.log('err: ', e)
}

resultMass.forEach(async function (data,i) {
    var b=new Dataq(data);
    await b.save();
    console.log('done: ', i);
});*/
