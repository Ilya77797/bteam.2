const Dataq=require('../models/data');
const mongoose=require('../libs/mongoose');
const Categor=require('../models/categor');
const mainFile=require('../Price/last.json');

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
    if(str1==''||str1==undefined){
     if(str2==''||str2==undefined)
         return 'null'
     else
         return str2
    }


    return mainFile.prefixes[0]+str1

    /*var str=str1.substring(str1.indexOf("http"),str1.indexOf("target")-2);
     return str.replace(/'\'/g, "")*/
    /*var str= str1.substring(str1.indexOf('http'),str1.indexOf("target"));
    var index=str.indexOf("'")
    if(index==-1)
        return str
    else
        return str.substring(0,index);*/
}

function takeIcon(str) {
    if(str==''||str==undefined)
        return 'images/noPicture.png'
    return mainFile.prefixes[1]+str
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
var resultMass=[];
try {
    mainFile.data.forEach((item,i)=>{
        var dataObj={
            _id:parseInt(item[0]),
            name:item[0]+' '+item[1],
            status:item[2],
            textDescription:item[3],
            measure:item[4],
            amount:item[5],
            price:item[6],
            specialPrice1:item[7],
            specialPrice2:item[8],
            specialPrice3:item[9],
            specialPrice4:item[10],
            minOrder:item[11],
            category:takeCat(item[12]),
            icon:takeIcon(item[13]),
            info:takeInfo(item[13], item[14]),
            index:i,


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
});
