var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer');
var fs=require('fs')

router.post('/addNewRecord', upload.single('productIcon'),function(req, res, next) {
    console.log(req.body)
    console.log(req.file)
    pool.query('insert into product(categoryid,subcategoryid,productname,productdescription,quantity,price,picture) values(?,?,?,?,?,?,?)',[req.body.categoryId,req.body.SubcategoryId,req.body.productname,req.body.productdescription,req.body.quantity,req.body.amount,req.file.filename],function(error,result){
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
    router.get('/displayAll',function(req, res, next) {
        console.log(req.body)
        console.log(req.file)
        pool.query('select * from product',function(error,result){
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
    router.post('/displayBySubCategoryId',function(req, res, next) {
      console.log("sachin")
      console.log(req.body)
      pool.query("select * from product where subcategoryid=?",[req.body.subcategoryid],function(error,result){
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
 router.post('/editdata',function(req,res,next){
     console.log(req.body)
        pool.query('update product set productname=?,productdescription=?, quantity=?,price=? where productid=?',[req.body.productname,req.body.productdescription,req.body.quantity,req.body.price,req.body.productId],function(error,result){
              if(error){
                console.log(error)
                return res.status(500).json({RESULT:false})
              }
              else{
                  console.log("sachin")
                  console.log(result)
                return res.status(200).json({RESULT:true})
              }
            })
          });

  router.post('/editIcon', upload.single('picture'),function(req, res, next) {
                console.log(req.body)
                console.log(req.file)
                pool.query('update product set picture=? where productid=?',[req.file.filename,req.body.productid],function(error,result){
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
    pool.query('delete from  product where productid=?',[req.body.productid],function(error,result){
                       
      if(error)
      {
         return res.status(500).json({RESULT:false})}
                  
        else
        {
         return res.status(200).json({RESULT:true})
         }
                  
    })  
});

router.post('/searchbyname',function(req, res, next) {
  console.log(req.body)
  var name=req.body.searchname
  var id=req.body.subcategoryid
  
  // pool.query("select * from subcategories where subcategoryname LIKE ? ",name+'%d',function(error,result)
  pool.query("select * from product  where subcategoryid = ? and productname LIKE ? ",[id,name+'%'],function(error,result)
  
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
  router.post('/searchbyprice',function(req, res, next) {
    console.log(req.body)
    var price=req.body.price
    var id=req.body.subcategoryid
    var que=''
    console.log(price)
    if(price==='all')
    {
      que="0 AND 2000"
    }
    if(price==='0-700')
    {
      que="0 AND 700"
    }
    if(price==='700-1200')
    {
     que ="700 AND 1200"
    }
    if(price==='above 1200')
    {
      que="1200 AND 2000"
    }
    
    pool.query("select * from product  where subcategoryid = ? and price between  "+" "+que+"",[id],function(error,result)
    
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














module.exports = router;