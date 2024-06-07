const express = require('express');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CalorieInfo = require('./models/CalorieInfoModel');
const cors = require('cors');

const infoModel = require('./models/infoModel');

 const userModel = require('./models/userModel')
 const foodModel = require("./models/foodModel")
 const trackingModel = require("./models/trackingModel")
 const verifyToken = require("./verifyToken")


mongoose.connect("mongodb+srv://2dharshini82004:2dharshini82004@cluster0.grwbibo.mongodb.net/nutrify")
.then(()=>{
    console.log("Database connection successfull")
})
.catch((err)=>{
    console.log(err);
})




const app = express();

 app.use(express.json());
 app.use(cors());



app.post("/register", (req,res)=>{
    
    let user = req.body;
   

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err)
        {
            bcrypt.hash(user.password,salt,async (err,hpass)=>{
                if(!err)
                {
                    user.password=hpass;
                    try 
                    {
                        let doc = await userModel.create(user)
                        res.status(201).send({message:"User Registered"})
                    }
                    catch(err){
                        console.log(err);
                        res.status(500).send({message:"Some Problem"})
                    }
                }
            })
        }
    })

    
})




app.post("/login",async (req,res)=>{

    let userCred = req.body;

    try 
    {
        const user=await userModel.findOne({email:userCred.email});
        if(user!==null)
        {
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true)
                {
                    jwt.sign({email:userCred.email},"nutrifyapp",(err,token)=>{
                        if(!err)
                        {
                            res.send({message:"Login Success",token:token,userid:user._id,name:user.name});
                        }
                    })
                }
                else 
                {
                    res.status(403).send({message:"Incorrect password"})
                }
            })
        }
        else 
        {
            res.status(404).send({message:"User not found"})
        }


    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem"})
    }



})



app.get("/foods",verifyToken,async(req,res)=>{

    try 
    {
        let foods = await foodModel.find();
        res.send(foods);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem while getting info"})
    }

})



app.get("/foods/:name",verifyToken,async (req,res)=>{

    try
    {
        let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
        if(foods.length!==0)
        {
            res.send(foods);
        }
        else 
        {
            res.status(404).send({message:"Food Item Not Fund"})
        }
       
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in getting the food"})
    }
    

})




app.post("/track",verifyToken,async (req,res)=>{
    
    let trackData = req.body;
   
    try 
    {
        let data = await trackingModel.create(trackData);
        console.log(data)
        res.status(201).send({message:"Food Added"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in adding the food"})
    }
    


})




app.get("/track/:userid/:date", async (req, res) => {
    try {
        let userid = req.params.userid;
        let dateParts = req.params.date.split("-");
        let day = parseInt(dateParts[1]);
        let month = parseInt(dateParts[0]);
        let year = parseInt(dateParts[2]);
        let strDate = `${month}/${day}/${year}`;

        let foods = await trackingModel.find({ userId: userid, eatenDate: strDate }).populate('userId').populate('foodId');
        res.send(foods);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some Problem in getting the food" });
    }
});
app.post('/calories', verifyToken, async (req, res) => {
    try {
      const { userId, calories } = req.body;
      

  
      if (!userId || !calories ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const newCalorieEntry = await infoModel.create({ userId,calories });
      
      res.status(201).json({ message: 'Calorie entry added successfully', calorieEntry: newCalorieEntry });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  
  app.get('/calories/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const calorieEntry = await infoModel.findOne({ userId }).sort({ createdAt: -1 });
        if (!calorieEntry) {
            return res.status(404).json({ message: 'Calorie entry not found' });
        }
        res.status(200).json({ calorieEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/calinfo', verifyToken, async (req, res) => {
    const { userId, date, totalCalories, caloriesConsumed, caloriesToGo } = req.body;
  
    try {
      let calorieInfo = await CalorieInfo.findOne({ userId, date });
      if (calorieInfo) {
        calorieInfo.totalCalories = totalCalories;
        calorieInfo.caloriesConsumed = caloriesConsumed;
        calorieInfo.caloriesToGo = caloriesToGo;
      } else {
        calorieInfo = new CalorieInfo({ userId, date, totalCalories, caloriesConsumed, caloriesToGo });
      }
  
      await calorieInfo.save();
      res.status(200).json({ message: 'Calorie data saved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  app.get('/calinfo/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const date = new Date().toISOString().split('T')[0];
  
    try {
      const calorieInfo = await CalorieInfo.findOne({ userId, date });
      if (calorieInfo) {
        res.status(200).json(calorieInfo);
      } else {
        const latestCalorieInfo = await CalorieInfo.findOne({ userId }).sort({ date: -1 });
        const totalCalories = latestCalorieInfo ? latestCalorieInfo.totalCalories : 0;
        res.status(200).json({ totalCalories, caloriesConsumed: 0, caloriesToGo: totalCalories });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.listen(8000,()=>{
    console.log("Server is up and running");
})
