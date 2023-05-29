const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../model/userModel');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());


router.get('/all',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})


router.post('/register', (req,res) => {

    let hashPassword = bcrypt.hashSync(req.body.password, 8);
    User.create({
        email: req.body.email,
        password: hashPassword,
    },(err,data) => {
        if(err) return res.send('Error While Register')
        res.send({token:'Registration Successfull'})
    })
})


router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return res.send({auth:false,token:'Error While Logging'});
        if(!user) return res.send({auth:false,token:'No User Found'})
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password);
            if(!passIsValid) return res.send({auth:false,token:'Invalid Password'})

            let token = jwt.sign({id:user._id},config.secret,{expiresIn:86400})
            res.send({auth:true,token:token})
        }
    })
})


router.get('/userInfo',(req,res) => {
    let token = req.headers['x-access-token'];
    if(!token) res.send({auth:false,token:'No Token Provided'})

    jwt.verify(token,config.secret,(err,user) => {
        if(err) return res.send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) =>{
            res.send(result)
        })
    })
})


router.delete('/delete',(req,res) =>{
    User.remove({},(err,data) => {
        if(err) throw err;
        res.send("User Deleted")
    })
})


module.exports = router;
