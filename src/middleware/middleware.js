const jwt = require('jsonwebtoken')

const userAuth = async (req,res,next)=>{

    try{
         const token = req.header('x-api-key')
         if(!token){
             res.status(403).send({status:false,msg:'missing authentication token in request'})
             return
         }
         const decoded = await jwt.verify(token,'rehan')
         if(!decoded){
             res.status(403).send({status:false,msg:'Invalid authentication token in request'})
             return
         }
         req.userId = decoded.userId
         next()
    }
    catch(error){
        console.error(`Error!${error.message}`)
        res.status(500).send({status:false,message:error.message})
    }
}
module.exports = {userAuth}