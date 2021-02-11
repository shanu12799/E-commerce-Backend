var express = require('express');
var router = express.Router();
// const { Admin } = require("../models/Admin");
var pool=require('./pool')
router.post('/checkadminlogin',function(req, res, next) {
    console.log(req.body)
    pool.query('select * from admin where adminid=? and password=? ',[req.body.adminid,req.body.password],function(error,result){
     if(error)
     {
       console.log(error)
       console.log("sachin")
        return res.status(500).json({RESULT:false,msg:"invalid error"})
     }
     else
      if(result.length==0)
      {

      return res.status(500).json({RESULT:false,msg:"Emai not found/password not correct"})
     }
     else
     {
        console.log(result)
        return res.status(200).json({RESULT:result})  
     }
  
    })
      
    });



// router.get('/', function(req, res, next) {
   

//    var callback = function(err,data){
     
//      if(err)
//        console.log(err);
//      else
//        console.log(data);
       
//    }
//    var std = new Admin({Adminemail:'100',Adminname:'sachin',password:'123'});
   
    
//    std.save(callback); 
//      res.render('index', { title: 'Save' });
//    });

//  router.post('/checkadminlogin',(req,res)=>{
//    const {email,password} = req.body
//    console.log(req.body)
//    console.log('email:-',req.body.adminid)
//    console.log('password:-',password)
//    Admin.findOne({Adminemail:req.body.adminid},(err,result)=>{
//            if (!result){
                
//                  return res.status(422).json({RESULT:false})
//                }
//                console.log(result)
   
//         Admin.findOne({password:password},(err,isMatch)=>{
//               if(!isMatch){
//                console.log(err)
//                return res.status(422).json({RESULT:false})
//               }
//               else{
//                  console.log(result)
//                  return res.status(200).json({RESULT:result})
//                 }
//         })
      
//      })
//  })
module.exports = router;   