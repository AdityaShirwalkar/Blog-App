const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const app = express();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const secret = 'qwertyuiop';
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://AdityaShirwalkar:Adi@260204@blog.v2ck6.mongodb.net/?retryWrites=true&w=majority&appName=blog');
app.post('/register',async (req,res)=>{
    const{username,password} = req.body;
    try{
        const userDoc = await User.create({username,password:bcrypt.hashSync(password,salt),});
        res.json()
    } catch(e) {
        res.status(400).json(e)
    }
    res.json(userDoc);
});

app.post('/login',async (req,res)=>{
    const{username,password} = req.body;
    const UserDoc = await User.findOne({username});
    res.json(userDoc);
    const passOk = bcrypt.compareSync(password, userDoc.password);
    res.json(passOk);
    if(passOk) {
        //logged in
        jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
        })
        res.json()
    }
    else {
        res.status(400).json('Incorrect credentials');
    }
});

app.get('/profile',(req,res)=> {
    const {token} = req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;
        res.json(info); 
    })
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.post('/post',(req,res)=>{
    
})

app.listen(4000);