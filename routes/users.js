var express = require('express');
var router = express.Router();
var pool=require('./pool') 
var springedge = require('springedge');
var otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var otp=otpGenerator.generate(4, { upperCase: false, specialChars: false,digits:true,alphabets:false });
/* GET users listing. */

router.post('/addNewRecord', function(req, res, next) {
  console.log(req.body)
  pool.query("select * from usertable where useremail=? or userphonenumber=? ",[req.body.email ,req.body.phonenumber],function(error,result){
    if(error)
    {
      console.log(error)
       return res.status(500).json([])
    }
    else
    { 
       console.log("result length",result.length)
        if(result.length>0)
        { 
          console.log("welcome")
          return res.status(500).json({RESULT:false,error:"email alredy exist"})
        }
        else{
                 

          pool.query('insert into usertable(userfirstname,userlastname,userphonenumber,useremail,password) values(?,?,?,?,?)',[req.body.firstname,req.body.lastname,req.body.phonenumber,req.body.email,req.body.password],function(error,result){
            if(error)
            {
              console.log("sachin :",error)
               return res.status(500).json({RESULT:false})
            }
            else
            {
             return res.status(200).json({RESULT:true})
            }
         
           })
          

             

        }
    }
   

      })
  });

    router.post('/passwordconfirmation',function(req, res, next) {
      console.log("gmail",req.body)
      if(req.body.confirmpassword===req.body.password)
      {
        pool.query('update usertable set password=? where useremail =?',[req.body.confirmpassword,req.body.gmail],function(error,result){
          if(error){
            console.log(error)
            return res.status(500).json({RESULT:false})
          }
          else{
            //console.log(error)
            return res.status(200).json({RESULT:true})
          }
        })
      }
    else{
          return res.status(500).json({RESULT:false})
        }
        
      });
  

router.post('/checkuserlogin',function(req, res, next) {
  console.log(req.body)
  pool.query('select * from usertable where (useremail=? or  userphonenumber=?)  and password=?',[req.body.useremail,req.body.useremail,req.body.password],function(error,result){
    console.log(error)
   if(error)
   {
     console.log("error",error)
      return res.status(500).json({RESULT:false})
   }
   else{
    if(result.length==0)
    {
    return res.status(500).json({RESULT:false})
   }
   else
   {
      console.log(result)
      return res.status(200).json({RESULT:result})  
   }
  }
  })
    
  });
  router.post('/ForgetPasword',function(req,res,next){
    console.log("body:",req.body)
      // var mail=req.body.gmail;
      // console.log("rec:",mail)
      pool.query('select * from usertable where useremail=? or userphonenumber=?',[req.body.gmail,req.body.gmail],function(error,result){
        if(error)
        {
          console.log("error",error)
           return res.status(500).json({RESULT:false})
        }
        else {     
          if(result==0){
            return res.status(500).json({RESULT:false})
          }
          else{
            
          
//                let transporter=nodemailer.createTransport({
//                service:'gmail',
//                auth:{
//                        user: 'darkdragon0900@gmail.com',
//                        pass:'9144415881'
//                       }
//                 });
//                var msg='Your otp is: '+otp
//               //step2
//               let mailOptions={
//                from:'darkdragon0900@gmail.com',
//                to:req.body.gmail,
//                subject:'testing',
//               text:msg
//                };

// //step3

//              transporter.sendMail(mailOptions ,function(err ,data)
//              {
//                if(err)
//                {
//                  console.log('error Occurs',err)
//                }
//               else{
//                    console.log('Email sent !!!!')
//                    return res.status(200).json({RESULT:true})
//                   }
//                })
//                     console.log(result)
//                     return res.status(200).json({RESULT:true})  
                 var params = {
                                'sender': 'SEDEMO',
                                'apikey': '6925gb1sdem70j5u657o201129r41829h',
                                'to': [
                                         '91'+result[0].userphonenumber //Moblie Numbers 
                                      ],
                                'message': otp+"this is your verfication pin ",
                                'format': 'json'
                              };
 
                springedge.messages.send(params, 5000, function (err, response) {
                if (err) 
                {
                      return console.log(err);
                }
               else{
                        console.log(response);
                        console.log('otp send');
      //  return res.status(200).json({'otp':otp});
                       return res.status(200).json({RESULT:true})
                   } 
                   });

          }
        }
        })  
  });

  router.post('/HandleOtp',function(req,res,next){
      console.log("body:",req.body.phonenumber)
      console.log("rec:",req.body.phonenumber)
        /* GET home page. */
       var params = {
    'sender': 'SEDEMO',
    'apikey': '6925gb1sdem70j5u657o201129r41829h',
    'to': [
      '91'+req.body.phonenumber //Moblie Numbers 
    ],
    'message': otp+"this is your verfication pin ",
    'format': 'json'
  };
   
  springedge.messages.send(params, 5000, function (err, response) {
    if (err) 
    {
      return console.log(err);
    }
    else{
         console.log(response);
         console.log('otp send');
        //  return res.status(200).json({'otp':otp});
        return res.status(200).json({RESULT:true})
    } 
  });
    
  })

module.exports = router;
