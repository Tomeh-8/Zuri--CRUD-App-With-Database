const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

//Connect to mongoDB database
atlasConnectionString = "mongodb+srv://dbCRUD:tomeh@cluster0.daubu.mongodb.net/crudApp?retryWrites=true&w=majority";
//localConnectionString = "mongodb://localhost/crudkb";
mongoose.connect(process.env.MONGO_URI||atlasConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

mongoose.connection.on("connected", () => {
   console.log("Database connected!");
});

//Schema
const Schema = mongoose.Schema;
const dataSchema = new Schema({
    name: String,
    email: String,
    country: String
});

//Model
const userData = mongoose.model("dataModels", dataSchema);

//Routes
// Get all users
app.get("/users",(req, res) => {
    userData.find({}, (err, data) => {
      if (err){
          return res.status(500).json({message: err});
      } else {
        return res.status(200).json({data});
      }
    });
});

//Get user by id
app.get("/users/:id",(req, res) => {
    
    userData.findById(req.params.id, (err, data) => {
      if (err){
          return res.status(500).json({message: err});
      }else if(!data){
         return res.status(404).json({message: "user not found!"});s
      }else {
        return res.status(200).json({data});
      }
    });
});

// Create users
app.post("/users", (req, res) => {
     userData.create({
     name: req.body.name,
     email: req.body.email,
     country: req.body.country
    }, (err, newUser) => {
        if(err){
         return res.status(500).json({message: err});
        }else{
         return res.status(200).json({message: "New user successfully created", newUser});
        }
    });
});

//Update user info
app.put("/users/:id", (req, res) => {
    
    userData.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
       }, (err, data) => {
      if (err){
          return res.status(500).json({message: err});
      }else if(!data){
         return res.status(404).json({message: "user not found!"});
      }else {
         data.save((err, savedUser) => {
             if(err){
                return res.status(500).json({message: err});
             } else{
                return res.status(200).json({message: "User Info successfully updated"});
             }
         });
      }
    });
});

//Delete user
app.delete("/users/:id",(req, res) => {
    
    userData.findByIdAndDelete(req.params.id, (err, data) => {
      if (err){
          return res.status(500).json({message: err});
      }else if(!data){
         return res.status(404).json({message: "user not found!"});s
      }else {
        return res.status(200).json({message: "message deleted successfully!"});
      }
    });
});

//Server port
app.listen(process.env.PORT||3000, () => console.log("server running..."));
