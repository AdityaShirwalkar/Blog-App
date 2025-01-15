const mongoose = require('mongoose');
const {model}  = mongoose; 
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String,required: true, min: 4, unique: true},
    password: {type: String,required: true},
});

const UserModel = model('User',userSchema);

module.exports=UserModel;