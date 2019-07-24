const User = require('./user')
const url = require('url');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app)
const path = require('path')
const userArr = [];
const msgArr = [];


app.use(express.static(path.join(__dirname, 'dist')));



app.get('/sigin', function (req, res) {
    console.log(req.method + ':' + req.url);
    var dataArr = url.parse(req.url).query.replace(/&/g, '=').split('=')
    var data = '{"' + dataArr[0] + '":"' + dataArr[1] + '","' + dataArr[2] + '":"' + dataArr[3] + '"}'
    console.log(data)
        User.find(JSON.parse(data), function (err, result) {
            console.log('查询：' + result)
            if (err) {
                res.header('Access-Control-Allow-Origin', '*')
                res.send({ 'code': 401, 'Msg': '查询失败！' })

            } else if (!result.length) {
                data = '{"' + dataArr[2] + '":"' + dataArr[3] + '","type":' + 1 + ',"' + dataArr[4] + '":"' + dataArr[5] + '"}'

                User.create(JSON.parse(data), function (err, result) {
                    console.log("保存：" + result)
                    if (err) {
                        res.header('Access-Control-Allow-Origin', '*')
                        res.send({ 'code': 402, 'Msg': '注册失败！' })
                        console.log('注册失败' + err)
                    } else {
                        res.header('Access-Control-Allow-Origin', '*')
                        res.send({ 'code': 201, 'Msg': '注册成功！' })

                        console.log('注册成功')
                    }


                })
            } else {
                res.header('Access-Control-Allow-Origin', '*')
                res.send({ 'code': 301, 'Msg': '账号已存在！' })

                console.log('账号已存在！')
            }

        })
})


const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('socket已连接')
    socket.on('login', function (name) {
        if (userArr.indexOf(name) > -1) {
            socket.emit('loginFail')
            console.log(name + '重复登录')
        } else {
            socket.name = name;
            userArr.push(name);
            socket.emit('loginSuccess')
            io.sockets.emit('logined', userArr, msgArr, { 'user': socket.name })
        }



    })

    socket.on('disconnect', function () {
        console.log(socket.name + '断开连接')
        if (socket.name != null) {
            //users.splice(socket.userIndex, 1);
            userArr.splice(userArr.indexOf(socket.name), 1);
            msgArr.length
            socket.broadcast.emit('logout', { 'num': msgArr.length }, { 'user': socket.name });
        }
    });

    socket.on('sendMsg', function (data) {
        msgArr.push(data);
        io.sockets.emit('returnMsg', msgArr)
    })
})

app.get('/login', function (req, res) {
    console.log(req.method + ':' + req.url);
    var dataArr = url.parse(req.url).query.replace(/&/g, '=').split('=')
    var data = '{"' + dataArr[0] + '":"' + dataArr[1] + '","' + dataArr[2] + '":"' + dataArr[3] + '"}'
    console.log(data)
   
        User.find(JSON.parse(data), function (err, result) {
            console.log('查询：' + result)
            if (err) {
                res.header('Access-Control-Allow-Origin', '*')
                res.send({ 'code': 401, 'Msg': '查询失败！' })

            } else if (!result.length) {
                console.log('ss')
                res.header('Access-Control-Allow-Origin', '*')
                res.send({ 'code': 302, 'Msg': '账号不存在或者账号密码错误！' })

                console.log('账号不存在或者账号密码错误！')
            } else {
                res.header('Access-Control-Allow-Origin', '*')
                res.send({ 'code': 202, 'Msg': '登录成功！' })

                console.log('登录成功')
            }

        })
    
})





server.listen(3030, 'localhost', function () {
    console.log('server is runing')
});


