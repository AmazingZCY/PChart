const mongoose = require('mongoose');
const db_url = "mongodb://localhost:27017";

mongoose.Promise = global.Promise;
//连接数据库
mongoose.connect(db_url);

//连接成功

mongoose.connection.on('connected',function(){
    console.log('数据库已连接至'+db_url)
})

//连接出错

mongoose.connection.on('error',function(err){
    console.log('数据库连接出问题'+err)
})

//连接断开

mongoose.connection.on('disconnected',function(){
    console.log('数据库连接断开')
})
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    uid :{ type:String},
    type:{type:Number},
    password:{type:String},
    logintime:{type:Date,default:Date.now},
    versionKey:false
})
const User = mongoose.model('User',UserSchema)
module.exports = User