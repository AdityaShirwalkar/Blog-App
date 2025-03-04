const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Post = require('/models/Post')
const app = express();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const secret = 'qwertyuiop';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware  = multer({dest:'uploads/'});
const fs = require('fs');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))
mongoose.connect('mongodb+srv://username:password@blog.v2ck6.mongodb.net/?retryWrites=true&w=majority&appName=blog'); //Add username and password of mongodb.atlas
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
    });
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.post('/post', uploadMiddleware.single('file'),async (req,res)=>{
    const {originalName,path} = req.file;
    const parts = originalName.split('.');
    const ext = parts[parts.length-1];
    const newPath=path+'.'+ext;
    fs.renameSync(path,newPath);

    const {token} = req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json({postDoc});
        res.json(info); 
    });

});

app.put('/post', uploadMiddleware.single('file'), async(req,res) => {
    let newPath = null;
    if(req.file) {
        const {originalName,path} = req.file;
        const parts = originalName.split('.');
        const ext = parts[parts.length-1];
        newPath=path+'.'+ext;
        fs.renameSync(path,newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify()(postDoc.author) === JSON.stringify(info.id);
        res.json({isAuthor});
        if(!isAuthor){
            return res.status(400).json('You are not the author');
        }

        await postDoc.update({
            title,
            summary,
            content,
            cover:newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc)
        // const postDoc = await Post.create({
        //     title,
        //     summary,
        //     content,
        //     cover:newPath,
        //     author:info.id,
        // })
        res.json({postDoc});
        res.json(info); 
    });
});

app.get('/post',async (req,res)=>{
    res.json(await Post.find().populate('author',['username'])
    .sort({createdAt:-1})
    .limit(20)
    );
});

app.get('/post/:id',async(req,res)=> {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.listen(4000);