const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    voteStatus:{type:Boolean,required:true}
})

module.exports = mongoose.model('userSchema',userSchema);