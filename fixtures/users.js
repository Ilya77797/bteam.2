const mongoose=require('../libs/mongoose');
const User=require('../models/user');
var user={
  username:"A1",
  displayName:'user1',
  password:'12345'
};
console.log('12');
async function doit1 () {
    var us1=new User(user);
    try{
        await us1.save();
    }
    catch(e){
        console.log(e);
    }
    console.log('done');
};

doit1();