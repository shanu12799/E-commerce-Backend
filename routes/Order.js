var express = require('express');
// const axios=require('axios')
var router = express.Router();
var pool=require('./pool')
const nodeMailer = require('nodemailer');

router.post('/addNewRecord',function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query('insert into carddetails(firstname,lastname,address1,address2,city,country,state,zip,cardname,cardnumber,cvv,expdate) values(?,?,?,?,?,?,?,?,?,?,?,?)',[req.body.firstname,req.body.lastname,req.body.address1,req.body.address2,req.body.city,req.body.state,req.body.country,req.body.zip,req.body.cardname,req.body.cardnumber,req.body.cvv,req.body.expdate,],function(error,result){
     if(error)
     {
       console.log(error)
        return res.status(500).json({RESULT:false})
     }
     else
     {

      return res.status(200).json({RESULT:true})
     }
  
    })
});


module.exports = router;   