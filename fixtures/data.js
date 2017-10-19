const mongoose=require('../libs/mongoose');
const Dataq=require('../models/data');
const mainFile=require('../Price/price.json');
const sp1=require('../Price/price2');
const sp2=require('../Price/price3');
const sp3=require('../Price/price4');
/*
1. id
2. Название, <BR> <strong>Статус </strong>
3. info, <a href='http://camelion.ru/katalog/svetotekhnika/nochnik-nl-182' target='_blank'>Доп.информация</a>"
если нет фото, если есть, то /url
4. amount
5. price
6.
7.
8.
9.
10. category
11. photo. prefix:http://img.optonoff.ru/
*/
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

var resultMass=[];
try {
    mainFile.data.forEach((item,i)=>{
        var dataObj={
            _id:parseInt(item[0]),
            name:takeName(item[1]),
            category:takeCat(item[9]),
            price:item[4],
            specialPrice1:sp1.data[i][4],
            specialPrice2:sp2.data[i][4],
            specialPrice3:sp3.data[i][4],
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
});
/*var b=new Dataq (resultMass[20]);
async function q() {
    await b.save();
    console.log('done');
}
q();*/
