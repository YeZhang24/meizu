const express = require("express");
const pool = require("./pool");
const bodyParser = require("body-parser");
//引入cors模块
const cors = require("cors");
var app = express();
app.listen(3000);
//4:指定静态目录 public
//__dirname 当前程序所有目录完整路径
//console.log(__dirname)
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+"/public"))
 //解决跨域cors， 配置允许那个程序跨域访问脚手架
app.use(cors({
    origin:["http://127.0.0.1:3001", "http://localhost:3001"],
    credentials: true
}))
//功能一： 用户获取制定新闻编号的所有评论--显示评论列表
app.get("/getComment", (req, res)=>{
    var articleId  = parseInt(req.query.articleId);
     //1:参数  当前页码  页大小(一页显示几行数据)
     var pno = req.query.pno;
     var pageSize = req.query.pageSize;
     var obj = {};
     var progress = 0;
     //2:sql
     //2.1:查找总记录数->转换总页数  15->3
     var sql = "SELECT count(id) as c FROM t_comment WHERE articleId = ?";
     pool.query(sql,[articleId], (err, result)=>{
         if(err) throw err;
         //可以分成几页
         var c = Math.ceil(result[0].c/pageSize);  
         obj.pageCount =c; 
         progress+=50;
         if(progress == 100){
             res.send(obj)
         }
     });
     var sql = " SELECT id,commentBy,place,commentTime,content, articleId";
      sql += " FROM t_comment WHERE articleId = ? ORDER BY id DESC";
      sql += " LIMIT ?,? ";
     var offset =  parseInt((pno-1)*pageSize);
     pageSize = parseInt(pageSize);
     pool.query(sql, [articleId, offset, pageSize], (err, result)=>{
         if(err) throw err;
         obj.data = result;
         progress+=50;
         if(progress == 100){
             res.send(obj)
         }
     })
})
//功能二 添加评论
app.get("/postComment", (req, res)=>{
    var articleId = req.query.articleId;
    var content = req.query.content;
    var commentTime = new Date();
    //console.log(articleId, content, commentTime);
    var sql = "INSERT INTO `t_comment` (`commentBy`, `place`, `commentTime`, `content`, `articleId`)VALUES('小舟破浪', 'web前端', ?, ?, ?)";
    pool.query(sql,[commentTime, content,articleId], (err, result)=>{
        if(err)throw err;
        //console.log(result);
        res.send({code: 1, msg: "添加成功"});
    })
})
//功能三 轮播图img
app.get("/getImg", (req, res)=>{
    var sql = "SELECT id, img_url FROM t_banner";
    pool.query(sql, (err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})
//功能三 验证用户名
app.get("/checkPhone", (req, res)=>{
    var phone = req.query.phone;
    console.log(phone);
    var sql = "SELECT id FROM t_user where phone = ?";
    pool.query(sql, phone, (err, result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({code: 000000, msg: "用户名已经存在"});
        }else{
            res.send({code: 000001})
        }
    })
})
//功能三 注册用户
app.get("/register", (req, res)=>{
    var name = req.query.name;
    var phone = req.query.phone;
    var pwd = req.query.pwd;
    console.log(name, phone, pwd);
    var sql = "INSERT INTO t_user(id, name, phone, pwd) VALUES(null, ?, ?, ?)";
    pool.query(sql, [name, phone, pwd], (err, result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code: 000001, msg: "注册成功"});
        }else{
            res.send({code: 000000, msg: "注册失败"});
        }
    })
    
})
app.get('/betterscroll',(req,res)=>{
    var left = [
        '推荐','手机','耳机','生活','智能','游戏','配件','居家','个护'
    ]
    var right = [
        [
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'魅族 16th',img:'http://127.0.0.1:3000/list-phone/p101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16th plus',img:'http://127.0.0.1:3000/list-phone/p102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 16x',img:'http://127.0.0.1:3000/list-phone/p103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15',img:'http://127.0.0.1:3000/list-phone/p104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 15 plus',img:'http://127.0.0.1:3000/list-phone/p105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 M15',img:'http://127.0.0.1:3000/list-phone/p106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 6',img:'http://127.0.0.1:3000/list-phone/p107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'魅族 Note8',img:'http://127.0.0.1:3000/list-phone/p108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-headset/h101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-headset/h102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-headset/h103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-headset/h104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-headset/h105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-headset/h106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-headset/h107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-headset/h108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        [
            {name:'JBL入耳耳机',img:'http://127.0.0.1:3000/list-life/l101.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'铁三角aa',img:'http://127.0.0.1:3000/list-life/l102.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL蓝牙音箱',img:'http://127.0.0.1:3000/list-life/l103.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Beats头戴式耳机',img:'http://127.0.0.1:3000/list-life/l104.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'先锋HiFi耳机',img:'http://127.0.0.1:3000/list-life/l105.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Skullcandy ink',img:'http://127.0.0.1:3000/list-life/l106.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'Jabra蓝牙耳机',img:'http://127.0.0.1:3000/list-life/l107.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'},
            {name:'JBL 蓝牙运动耳机',img:'http://127.0.0.1:3000/list-life/l108.jpg',href:'http://127.0.0.1:8080/#/home/goodsinfo/101'}
        ],
        
    ]
    res.send({r1:left,r2:right})
})

