var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')

/* GET home page. */
router.post('/addNewRecord', upload.single('categoryIcon'),function(req, res, next) {
  console.log(req.body)
  console.log(req.file)
  pool.query('insert into categories(categoryname,categoryicon) values(?,?)',[req.body.categoryName,req.file.filename],function(error,result){
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


  router.get('/dropdown',function(req, res, next) {
    pool.query('select categoryname,categoryid from categories',function(error,result){
     if(error)
     {
        console.log(error)
        return res.status(500).json([])
     }
     else
     {
      return res.status(200).json(result)
     }
  
    })
      
    });
  router.get('/displayAll',function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query('select * from categories',function(error,result){
     if(error)
     {
        console.log(error)
        return res.status(500).json([])
     }
     else
     {
       console.log(result)
      return res.status(200).json(result)
     }
  
    })
      
    });

    router.post('/editdata',function(req,res,next){
      console.log(req.body)
      pool.query('update categories set categoryname=? where categoryid=?',[req.body.categoryName,req.body.categoryId],function(error,result){
        if(error){
          console.log(error)
          return res.status(500).json({RESULT:false})
        }
        else{
          return res.status(200).json({RESULT:true})
        }
      })
    });
    
router.post('/editIcon', upload.single('categoryIcon'),function(req, res, next) {
  console.log(req.body)
  console.log(req.file)
  pool.query('update categories set categoryicon=? where categoryid=?',[req.file.filename,req.body.categoryId],function(error,result){
   if(error)
   {
     console.log(error)
      return res.status(500).json({RESULT:false})
   }
   else
   {
          fs.unlink("./public/images/"+req.body.oldpicture,function(err){
            if(err)
            {
              return res.status(500).json({RESULT:false})
            }
            else
            {
              console.log("old picture deleted")
            return res.status(200).json({RESULT:true})
            }
        })
  }
  })
    
  });
  router.post('/deleteRecord',function(req, res, next) {
    pool.query('delete from  categories where categoryid=?',[req.body.categoryId],function(error,result){
       
      if(error)
     {
        return res.status(500).json({RESULT:false})}
  
     else
     {
      return res.status(200).json({RESULT:true})
     }
  
    })  
  });

module.exports = router;