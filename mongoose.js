const mongoose = require("mongoose");
const config = require('../config')
const db_url = config.mongodb_url;

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

export default mongoose