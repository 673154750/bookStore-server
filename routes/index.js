var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../model/config');
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/catelogs', function(req, res) {
  let sql = 'select * from book_type;'
  connMysql(sql,data=>{
  res.send(JSON.stringify(data));
  });

});
router.get('/catelogs/detail', function(req, res) {
  for(let i in req.query){
    if(i == 'bid'){
      let id = req.query.bid;
      let sql = `select * from book_list where bid='${id}';`;
      connMysql(sql,data=>{
        res.send(JSON.stringify(data));
      });
    }else{
      let id = req.query.id;
      let sql = `select * from book_list where cid='${id}';`;
      connMysql(sql,data=>{
        res.send(JSON.stringify(data));
      })
    }
  }
});

router.get('/addcart',(req,res)=>{
  let bid = req.query.bid;
  let uid = req.query.uid;
  let sql1 = `select * from book_list where bid='${bid}';`
  connMysql(sql1,data1=>{
    let mydata = getMsg(data1);
    let sql2 = `select * from book_cart where bid='${bid}' and uid='${uid}';`;
    connMysql(sql2,data2=>{
      let count = data2.length;
      if(count == 0){
        let sql3 = `insert into book_cart(uid,bid,price,img,title,count) values (${uid},${bid},'${mydata.price}','${mydata.img}','${mydata.title}','${count + 1}');`
        connMysql1(sql3);
      }else{
        let carBook = getMsg(data2);
        let cart_id = carBook.cart_id;
        let sql4 = `update book_cart set count='${count + 1}' where cart_id=${cart_id};`
        connMysql1(sql4);
      }
    });
  });
res.send('{"msg":"ok"}');
});

router.get('/cart',(req,res)=>{
  let uid = req.query.uid
  console.log(uid);
  let sql = `select * from book_cart where uid='${uid}';`;
  connMysql(sql,data=>{
    res.send(JSON.stringify(data));
  });
});








function getMsg(msg){
  let mydata={};
  for(let i in msg){
      mydata = msg[i];
  }
  return mydata;
}


function connMysql(sql,fn){
  var conn = mysql.createConnection(config);
  conn.connect();
  conn.query(sql,function(err,data,feild){
      if(!err){
      fn(data);
      // console.log(data,"-------------------成功");
      }else{
        // console.log('fail!',err.sqlMessage);
      }
  });
  conn.end(); 
}

function connMysql1(sql){
  var conn = mysql.createConnection(config);
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
