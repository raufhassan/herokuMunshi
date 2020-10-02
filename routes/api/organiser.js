const express =require('express');
const router =express.Router();
const Organiser =require('../../models/organiser');

router.post('/orgregister',(req,res)=>{
    Organiser.findOne({email:req.body.email}).then(user=>{
        if(user)
        {
            res.json({msg:"user already exists"});
        }
        else {
            const newusers=new Organiser({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
            })
            newusers.save().then(res.json({message:"Account has been created"}));
        }
    }
        
    )}
)

module.exports=router