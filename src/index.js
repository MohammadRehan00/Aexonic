const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const route = require('./route/route.js')


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Mohammad_Rehan-database?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>console.log("'mongodb running perfectly on 27017"))
.catch(err=>console.log(err))

app.use('/',route)
app.listen(process.env.PORT || 3000,function(){
    console.log("Express running on port"+(process.env.PORT || 3000))
})


