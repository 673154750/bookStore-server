var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Consumer = require('../model/consumer');
var config = require('../model/config');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/changePwd', function(req, res) {
    let mydata = getMsg(req.body);
    let sql = `select * from book_user where name='${mydata.name}' and tel='${mydata.tel}';`;
    connMysql1(sql,data=>{
      let obj = {}
      if(data.length == 0){
        obj.code = 501;
        obj.msg = '用户名或手机号有误，请重新输入！'
      }else{
        let user;
        for(let i in data){
            user = data[i];
          }
          let sql = `update book_user set pwd='${mydata.pwd}' where uid='${user.uid}';`
          connMysql1(sql,data=>{
            console.log(data);
          });
          obj.code = 201;
          obj.msg = '修改成功'
      }
      console.log(obj);
      res.send(JSON.stringify(obj));
    })
});


router.post('/info',(req,res)=>{
  let mydata = getMsg(req.body);
  console.log(mydata);
  let sql = `select * from book_user where name='${mydata.name}' and pwd='${mydata.pwd}';`;
  connMysql1(sql,data=>{
    console.log('data',data)
    let obj = {}
    if(data.length == 0){
      obj.code = 501;
      obj.msg = '失败，请重新尝试！'
    }else{
      let user;
      for(let i in data){
          user = data[i];
        }
        let sql = `update book_user set sex='${mydata.sex}',tel='${mydata.tel}' where uid='${user.uid}';`
        connMysql1(sql,data=>{
          console.log('修改情况',data);
          let sql2 = `select * from book_user where uid='${user.uid}';`;
          connMysql1(sql2,data2=>{
            console.log('修改后的数据',data2);
            for(let i in data2){
              let nuser = data2[i];
              obj.code = 201;
              obj.msg = '修改成功'
              let msgs = {obj,nuser}
              console.log(obj);
              res.send(JSON.stringify(msgs));
            }
          });
        });
    }
  });
});

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

module.exports = router;
