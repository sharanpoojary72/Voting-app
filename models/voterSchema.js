const mongoose =require('mongoose');

const voterSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    votes:{type:Number},
    fa_name:{type:String}
})

module.exports = mongoose.model('voters',voterSchema)