var express = require('express');
var router = express.Router();
var pool=require('./pool')
const stripe=require("stripe")("sk_test_ebHdUja92805OehAKTywZvmB00cptbeZFE")
const uuid=require("uuidv4")

router.post('/addNewRecord', function(req, res, next) {
    console.log(req.body)
    pool.query("select * from cart where userid=? and productid=? ",[req.body.userid ,req.body.productid],function(error,result){
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
            return res.status(500).json({RESULT:false,error:"duplicate"})
          }
          else{

            pool.query('insert into cart(userid,productid,itemname,itemprice,quantity) values(?,?,?,?,?)',[req.body.userid,req.body.productid,req.body.itemname,req.body.price,req.body.quantity],function(error,result){
              if(error)
              {
                console.log("error",error)
                  return res.status(500).json({RESULT:false})
              }
              else
              {
                return res.status(200).json({RESULT:true,error:"success"})
              }
            
              })

               

          }
      }
     
 
        })
 });

router.post('/countitem',function(req, res, next) {
  console.log(req.body.userid)
  console.log("sachin")
  pool.query("select * from cart where userid=?",[req.body.userid],function(error,result){
  if(error)
  {
    console.log(error)
      return res.status(500).json([])
  }
  else
  {
         console.log(result.length)
        return res.status(200).json(result.length)
       }
    
      })
        
      });
      router.post('/clearitem',function(req, res, next) {
        console.log(req.body.userid)
        console.log("sachin")
        pool.query("delete from cart where userid=?",[req.body.userid],function(error,result){
         if(error)
         {
            console.log(error)
            return res.status(500).json([])
         }
         else
         {
           console.log(result.length)
          return res.status(200).json({RESULT:true})
         }
      
        })
          
        });

  router.post('/displaybyid',function(req, res, next) {
        console.log(req.body.userid)
        console.log("sachin")
        pool.query("select * from cart where userid=?",[req.body.userid],function(error,result){
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

        router.post('/checkquantity',function(req, res, next) {
          console.log(req.body.userid)
          console.log(req.body.cartid)
          console.log("sachin")
          pool.query("select * from cart where userid=? and cartid=?",[req.body.userid,req.body.cartid],function(error,result){
           if(error)
           {
              console.log(error)
              return res.status(500).json([])
           }
           else
           {
             console.log(result)
            return res.status(200).json({RESULT:result})
           }
        
          })
            
          });
      
        router.post('/deletebyid',function(req, res, next) {
          console.log(req.body)
          pool.query("delete from cart where cartid=? and userid=? ",[req.body.cartid,req.body.userid],function(error,result){
           if(error)
           {
              console.log(error)
              return res.status(500).json([])
           }
           else
           {
             console.log(result)
            return res.status(200).json({RESULT:true})
           }
        
          })
            
          });   

          router.post('/Addbyid',function(req, res, next) {
            console.log(req.body)
            pool.query("update cart set quantity=? where cartid=? and userid=? ",[req.body.quantity,req.body.cartid,req.body.userid],function(error,result){
             if(error)
             {
                console.log(error)
                return res.status(500).json({RESULT:false})
             }
             else
             {
               console.log(result)
              return res.status(200).json({RESULT:true})
             }
          
            })
              
            });

            router.post('/Subtractbyid',function(req, res, next) {
              console.log(req.body)
              pool.query("update cart set quantity=? where cartid=? and userid=? ",[req.body.quantity,req.body.cartid,req.body.userid],function(error,result){
               if(error)
               {
                  console.log(error)
                  return res.status(500).json([])
               }
               else
               {
                 console.log(result)
                return res.status(200).json({RESULT:true})
               }
            
              })
                
              });

    
  router.post('/Addbyid',function(req, res, next) {
            console.log(req.body)
            pool.query("update cart set quantity=? where cartid=? and userid=? ",[req.body.quantity,req.body.cartid,req.body.userid],function(error,result){
             if(error)
             {
                console.log(error)
                return res.status(500).json({RESULT:false})
             }
             else
             {
               console.log(result)
              return res.status(200).json({RESULT:true})
             }
          
            })
              
            });

            router.post('/checkout', async function(req, res, next) {
              console.log("request :",req.body);

              let error;
              let status;
              try
              {
                const {product,token}=req.body;

                const customer =await stripe.customers.create({email:token.email,source:token.id});
                const idempotency_key=uuid();
                const charge=await stripe.charges.create({
                        amount :product.price,
                        customer:customer.id,
                        receipt_email:token.email,
                        shipping:{
                          name:token.card.name,
                          address:{
                            line1:token.card.address_line1,
                            line2:token.card.address_line2,
                            city:token.card.address_city,
                            country:token.card.address_country,
                            postal_code:token.card.address_zip
                          }
                        }
                      },{
                        idempotency_key
                      }   



                );
                console.log("charge:",{charge});
                status="success"
              }
              catch(error){
                  console.log("Error :",error)
                  status="failure"
              }
             
               res.json({error,status});
            });         














module.exports = router;