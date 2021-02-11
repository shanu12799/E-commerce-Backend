var express = require('express');
  var router = express.Router();
  var pool=require('./pool')
  var upload=require('./multer');
  var fs=require('fs')
  
  /* GET home page. */
  router.post('/addNewRecord',upload.single('Subcategoryicon'),function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query('insert into subcategories(categoryid,subcategoryname,subcategoryicon) values(?,?,?)',[req.body.categoryId,req.body.Subcategoryname,req.file.filename],function(error,result){
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
  router.post('/editdata',function(req,res,next){
    console.log(req.body)
    pool.query('update subcategories set subcategoryname=?,subcategorydescription=?,amount=?,quantity=? where subcategoryid=?',[req.body.subcategoryName,req.body.subcategoryDescription,req.body.Amount,req.body.quantity,req.body.subcategoryId],function(error,result){
      if(error){
        console.log(error)
        return res.status(500).json({RESULT:false})
      }
      else{
        //console.log(error)
        return res.status(200).json({RESULT:true})
      }
    })
  });

  router.post('/dropdown',function(req, res, next) {
    console.log("enter in dropdown")
    console.log(req.body.categoryId)
    pool.query('select subcategoryname,subcategoryid from subcategories where categoryid=?',[req.body.categoryId],function(error,result){
     if(error)
     {
        console.log(error)
        return res.status(500).json([])
     }
     else
     {
       console.log("sachin")
      return res.status(200).json(result)
     }
  
    })
      
    });
  router.post('/editIcon', upload.single('subcategoryIcon'),function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query('update subcategories set subcategoryicon=? where subcategoryid=?',[req.file.filename,req.body.subcategoryId],function(error,result){
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
  router.get('/displayAll',function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query("select * from subcategories ",function(error,result){
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
    router.post('/displayByCategoryId',function(req, res, next) {
      console.log(req.body)
      console.log(req.file)
     pool.query("select * from subcategories where categoryid=? ",[req.body.categoryid],function(error,result){
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

router.post('/searchbyname',function(req, res, next) {
console.log(req.body)
var name=req.body.searchname
var id=req.body.categoryid

// pool.query("select * from subcategories where subcategoryname LIKE ? ",name+'%d',function(error,result)
pool.query("select * from subcategories  where categoryid = ? and subcategoryname LIKE ? ",[id,name+'%'],function(error,result)

{
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

    router.post('/deleteRecord',function(req, res, next) {
      pool.query('delete from  subcategories where subcategoryid=?',[req.body.subcategoryId],function(error,result){
         
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
