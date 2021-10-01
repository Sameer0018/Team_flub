const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


require("../db/conn");
const Registration = require("../modal/registrationSchema");

router.get('/', (req,res) => {
    res.send(`hello world from the server router.js`);
})




router.post('/register', async (req,res) => {
// console.log(req.body)
    const {name, email, phone, password, Cpassword} = req.body;
    
    if(!name || !email|| !phone || !password || !Cpassword) {
        return res.status(422).json({error:"Plz filled the field properly"})
    }

    try {

        const userExist  = await Registration.findOne({email: email});

        if(userExist) {
            return res.status(422).json({error:"Email already exist"});
        }else if(password != Cpassword) {
            return res.status(422).json({error:"password are not matching"});
        } else {
            const registration = new Registration({name, email, phone, password, cpassword : Cpassword});
        
            await registration.save();

            res.status(201).json({message: "user registered successfully"});
        }

       
    } catch (err) {
        console.log(err);
    }
     
    

})

//login route
router.post('/signin', async (req,res) => {
   try {
    let token;
    const{email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error:"Plz filled the data"})
    }

    const userLogin = await Registration.findOne({email:email});

    // console.log(userLogin);

    if(userLogin){
        const isMatch = await bcrypt.compare(password,userLogin.password);
   
        token = await userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
            expires:new Date(Date.now() + 25892000000),
            httpOnly:true
        });

        if(!isMatch) {
            res.status(400).json({error: "Invalid Credentials "});
        } else {
            res.json({message:"user Signin Successfully"});
        }
    } else {
        res.status(400).json({error: "Invalid Credentials"});
    }

   
   

   }  catch (err) {
       console.log(err);
   }
})

module.exports = router;