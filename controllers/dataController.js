
const session = require('express-session');

const voterSchema = require('../models/voterSchema');
const userSchema = require('../models/userSchema');


const adminData = async(req,res)=>{
    try{
        const voters = await voterSchema.find();
        const users = await userSchema.find();
        res.render('admin',{voters:voters,users:users})
    } catch (err) {
        res.json(err);
    }
}

const resetVotes = (req,res)=>{
    voterSchema.updateMany({},{votes:0})
    .then(()=>{
        return userSchema.updateMany({},{voteStatus:false})
    })
    .then(()=>{
        res.redirect('/admin');
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send('Failed to Reset Votes')
    })
}

const showData = async (req,res)=>{
    try {
        const voters = await voterSchema.find();
        const users = await userSchema.findById(req.session.userId);
        
        if(users.voteStatus){
            res.redirect('/results');
        } else {
            
            res.render('index',{voters:voters});
        }
        
    } catch (err) {
        res.json(err);
    }
}

const updateVotes = (req,res) => {

    voterSchema.findByIdAndUpdate(
        req.params.id,
        { $inc: { votes: 1 } },  // Use the $inc operator to increment the votes
        { new: true }  // Return the updated document
    ).then(() => {
        // Update the user's voteStatus after incrementing the votes
        return userSchema.findByIdAndUpdate(
            req.session.userId, 
            { voteStatus: true },  // Set voteStatus to true after voting
            { new: true }  // Return the updated user document
        );
    })
    .then(()=>{
        res.redirect('/results');
    })
    .catch((err)=>{
        res.status(500).send('Failed to add Vote');
    })
}

const resultData = async (req,res)=>{
    try {
        const voters = await voterSchema.find();
        const users = await userSchema.findById(req.session.userId);
        res.render('results',{voters:voters,message:users.voteStatus?"We received your vote":null});
    } catch (err) {
        res.json(err);
    }
}


module.exports = {adminData,resetVotes,showData,updateVotes,resultData};