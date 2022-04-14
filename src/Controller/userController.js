//validation
const userModel = require("../Model/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const saltRounds = 10
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};
const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email.trim());
};
const validatePhone = function (phone) {
  var re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
  if (typeof phone == "string") {
    return re.test(phone.trim());
  } else {
    return re.test(phone);
  }
};
/////////User Registration///////////////////////

const createUser = async function (req, res) {
  try {
    const requestBody = req.body;
   
    const { firstName, lastName, email, password, phone, address } =requestBody;
    const encryptedPassword = await bcrypt.hash(password,saltRounds)
    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({
        status: false,
        msg: "Invalid request parameters.plz provide user details",
      });
      return;
    }
    if (!isValid(firstName)) {
      res.status(400).send({ status: false, msg: "firstname is required" });
      return;
    }
    if (!isValid(lastName)) {
      res.status(400).send({ status: false, msg: "lastnmae is required" });
      return;
    }
    if (!isValid(email)) {
      res.status(400).send({ status: false, msg: "email is required" });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).send({ status: false, msg: "plz provide valid email" });
      return;
    }
    const isEmailAlreadyUsed = await userModel.findOne({ email: email });
    if (isEmailAlreadyUsed) {
      res
        .status(400)
        .send({ status: false, msg: "email is already reegistered" });
      return;
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, msg: "password is required" });
      return;
    }
    if (!isValid(phone)) {
      res.status(400).send({ status: false, msg: "phone number is required" });
      return;
    }
    if (!validatePhone(phone)) {
      res.status(400).send({ status: false, msg: "plz provide valid phone" });
      return;
    }
    const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });
    if (isPhoneAlreadyUsed) {
      res
        .status(400)
        .send({ status: false, msg: "email is already reegistered" });
      return;
    }
    if (!isValid(address)) {
      res.status(400).send({ status: false, msg: "address is required" });
      return;
    }
userData={
  firstName:firstName,
  lastName:lastName,
  email:email,
  password:encryptedPassword,
  phone:phone,
  address:address

}
    const createUserData = await userModel.create(userData);
    {
      res
        .status(201)
        .send({
          status: true,
          msg: "successfully created",
          data: createUserData,
        });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

///////login //////
const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!isValidRequestBody(requestBody)) {
      res
        .status(400)
        .send({
          status: false,
          msg: "Invalid request parameters.plz provide user details",
        });
      return;
    }
    const { email, password } = requestBody;
    if (!isValid(email)) {
      res.status(400).send({ status: false, msg: "email is required" });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).send({ status: false, msg: "plz provide valid email" });
      return;
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, msg: "password is required" });
      return;
    }
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      res.status(401).send({ status: false, msg: "Invalid login credentials" });
      return;
    }
    const token = await jwt.sign(
      {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 1800,
      },
      "rehan"
    );
    res.header("x-api-key", token);
    res
      .status(201)
      .send({
        status: true,
        message: "user login successfull",
        data: { token },
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
/////////List api using pagination/////
const userDetails = async function (req, res) {
  try {
    const limitValue = req.query.limit || 2;
    const skipValue = req.query.skip || 0;

    let userData = await userModel.find().limit(limitValue).skip(skipValue);
    if (!userData) {
      res.status(404).send({ status: false, message: "user not found" });
    }
    res.status(200).send({ status: true, msg: "success", data: userData });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};


//////update user details
const updateUser = async function(req,res){
    try{
        const requestBody = req.body
        const userId = req.params.userId
        const userIdFromToken = req.userId

        if(!isValid(userId)){
            res.status(400).send({status:false,message:`${userId} is not a valid userId`})
            return
        }
        if(!isValid(userIdFromToken)){
            res.status(400).send({status:false,message:`${userIdFromToken} Invalid userId`})
            return
        }
        const user = await userModel.findOne({_id:userId})
        if(!user){
            res.status(404).send({status:false,message:'user not found'})
            return
        }
        if(userId.toString() !== userIdFromToken)
        {
            res.status(401).send({status:false,message:'unauthorized access! user info does not match'})
        }
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({
              status: false,
              msg: "Invalid request parameters.plz provide user details",
            });
            return;
          }
        let{firstName,lastName,email,password,phone,address} = requestBody
        if (!isValid(firstName)) {
            res.status(400).send({ status: false, msg: "firstname is required" });
            return;
          }
          if (!isValid(lastName)) {
            res.status(400).send({ status: false, msg: "lastnmae is required" });
            return;
          }
          if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" });
            return;
          }
          if (!validateEmail(email)) {
            res.status(400).send({ status: false, msg: "plz provide valid email" });
            return;
          }
        //   const isEmailAlreadyUsed = await userModel.findOne({ email: email });
        //   if (isEmailAlreadyUsed) {
        //     res
        //       .status(400)
        //       .send({ status: false, msg: "email is already reegistered" });
        //     return;
        //   }
          if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" });
            return;
          }
          if (!isValid(phone)) {
            res.status(400).send({ status: false, msg: "phone number is required" });
            return;
          }
          if (!validatePhone(phone)) {
            res.status(400).send({ status: false, msg: "plz provide valid phone" });
            return;
          }
        //   const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });
        //   if (isPhoneAlreadyUsed) {
        //     res
        //       .status(400)
        //       .send({ status: false, msg: "email is already reegistered" });
        //     return;
        //   }
          if (!isValid(address)) {
            res.status(400).send({ status: false, msg: "address is required" });
            return;
          }
          const updatedUserData = await userModel.findOneAndUpdate({_id:userId},requestBody,{new:true})         
            res.status(201).send({ status: true,msg: "successfully update",data: updatedUserData,
              });
          
        
            }catch (err) {
          res.status(500).send({ status: false, msg: err.message });
        }
    }
     
//////// filter icluding pagination///////
const filter = async function(req,res){
  try{
      
      const userId = req.params.userId
      const userIdFromToken = req.userId

      if(!isValid(userId)){
          res.status(400).send({status:false,message:`${userId} is not a valid userId`})
          return
      }
      if(!isValid(userIdFromToken)){
          res.status(400).send({status:false,message:`${userIdFromToken} Invalid userId`})
          return
      }
      const user = await userModel.findOne({_id:userId})
      if(!user){
          res.status(404).send({status:false,message:'user not found'})
          return
      }
      if(userId.toString() !== userIdFromToken)
      {
          res.status(401).send({status:false,message:'unauthorized access! user info does not match'})
      }
    if(req.query.firstName||req.query.lastName||req.query.email||req.query.password||req.query.phone||req.query.address)
    {let firstName = req.query.firstName
    let lastName =req.query.lastName 
    let email = req.query.email
    let password =req.query.password
    let phone =req.query.phone
    let address =req.query.address
    obj = {}
    if(firstName){
      obj.firstName = firstName
    }
    
    if(lastName){
      obj.lastName = lastName
    }
    if(email){
      obj.email = email
    }
    if(password){
      obj.password = password
    }
    if(phone){
      obj.phone = phone
    }
    if(address){
      obj.address = address
    }
    const limitValue = req.query.limit || 2;
    const skipValue = req.query.skip || 0;

    let data = await userModel.find(obj).limit(limitValue).skip(skipValue)
    {
      if(!data){
        res.status(400).send({status:false,msg:"no data"})
      }
      else  {
        return res.status(200).send({status:true,data:data})
      }
    }
  }
   else {
     return res.status(400).send({status:false,msg:'mandatory body not given'})
   }
  
  }
  catch(error){
    res.status(500).send({status:false,message:error.message})
  }
}   
    




module.exports = { createUser, loginUser, userDetails,updateUser,filter}
