var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Consumer = require('../model/consumer');
var config = require('../model/config');

router.post('/',(req,res)=>{
    let mydata = {};
    for(let i in req.body){
      mydata = JSON.parse(i);
    }
    var sql = `select * from book_user where name='${mydata.username}';`;
    connMysql(sql,data=>{
        console.log(data);
        let obj = {}
        if(data.length != 0){
            obj.code = 501;
            obj.msg = '用户名已被注册';
        }else{
            var sql = `insert into book_user (name,pwd,sex,tel) values ('${mydata.username}','${mydata.pwd}','${mydata.sex}','${mydata.tel}');`;
            connMysql1(sql);
            obj.code = 201;
            obj.msg = '注册成功';
        }   
          res.send(JSON.stringify(obj));    
    });
})

function connMysql(sql,fn){
    var conn = mysql.createConnection({
        host:config.host,
        user:config.user,
        password:config.password,
        database:config.database
    });
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
function connMysql1(sql){
    var conn = mysql.createConnection({
        host:config.host,
        user:config.user,
        password:config.password,
        database:config.database
    });
    conn.connect();
      conn.query(sql,function(err,data,feild){
        if(!err){
        console.log("-------------------成功");
        }else{
          console.log('fail!',err.sqlMessage);
        }
      });
    conn.end(); 
}

module.exports = router;
