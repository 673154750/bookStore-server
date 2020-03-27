var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Consumer = require('../model/consumer');
var config = require('../model/config');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res ) {
    let mydata = getMsg(req.body);
    let username = mydata.username;
    let pwd = mydata.pwd;
    let sex = mydata.sex;
    let tel = mydata.tel;
    let consumer = new Consumer(username,pwd,sex,tel);
    let sql = `select * from book_user where name='${consumer.username}' and pwd='${consumer.pwd}';`;
    connMysql1(sql,data=>{
        let user;
        for(let i in data){
            user = data[i];
        }
        console.log('获取到的当前用户：',user);
        let obj ={};
        if(data.length != 0){
            obj.code = '201';
            obj.msg = '登陆成功！';
        }else{
            obj.code = '501';
            obj.msg = '用户名或密码错误，请重新登录！';
        }
        let oo = {obj,user}
        res.send(JSON.stringify(oo));
    });
});

module.exports = router;

function getMsg(msg){
    let mydata={};
    for(let i in msg){
        mydata = i;
    }
    return JSON.parse(mydata);
}

function connMysql1(sql,fn){
    var conn = mysql.createConnection(config);
    conn.connect();
    conn.query(sql,function(err,data,feild){
        if(!err){
            fn(data);
        }else{
          console.log('fail!',err.sqlMessage);
        }
    });
    conn.end(); 
}