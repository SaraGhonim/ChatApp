const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Chat = require('../models/Chats');

const {validateNewUser} = require('../models/user');
const {validateUser} = require('../models/user');

const bcrypt = require('bcrypt');

router.get('/login', async (req, res)=>{
    console.log("login");
    res.sendFile(__dirname + '/log.html')
})
router.get('/register', async (req, res)=>{
    console.log("register");
    res.sendFile(__dirname + '/signUp.html')
})
router.get('/home/:email', async (req, res)=>{    
  console.log("home")

  const result = await Chat.find({owner:req.params.email});
    const user = await User.find({email:req.params.email});

  if(result.length>0)
   {
    data={name:`${user[0].name}`,messages:result,m:['']}
    res.render('home',{data:data})
   }
  else {
    data={name:`${user[0].name}`,messages:[{}],m:['There are no chats yet']}
    res.render('home',{data:data})
   }
  
})

router.post('/register', async (req, res) => {
 try{
      console.log("register",req.body)
      const {error}  = validateNewUser(req.body); 
      if (error) 
      { console.log(error.details[0].message)
        res.send(error.details[0].message)
        return
      }
      let user = await User.find({ email: req.body.email });
      if (user.length>0) 
      {
       console.log("User already registered",user) 
       res.send('User already registered');
       return
      }
       else
      {
       user = new User(req.body)
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(user.password, salt);
       await user.save(function (err) {if (err) console.log(err)});f
       data={name:`${user[0].name}`,messages:[{}],m:['There are no chats yet']}
       res.render('home',{data:data})
      }

    }
    catch(error){
      console.log(error)
      res.send(error)
    }
    });

router.post('/login', async (req, res) => {
        try{  
          console.log("login",req.body)
          const {error}  = validateUser(req.body); 
          if (error) 
          {
          console.log(error)
          console.log(error.details[0].message)
          res.send(error.details[0].message)
          return
          }
          let user = await User.find({ email: req.body.email });
          if (!user.length>0)  
          {
            console.log(user,"!found")
            res.send('There is no such a user.');
            return
          }
        
          const validPassword = await bcrypt.compare(req.body.password, user.password);

          if (!validPassword) 
          {
            console.log(user,user[0].password,"not valid pass")
            res.send('This password is not correct.');
            return
          }
        else{
           const result = await Chat.find({owner:req.body.email});
           if(result.length>0)
            {
   
            res.redirect(`home/${user[0].email}`)
            }
           else {
            res.redirect(`home/${user[0].email}`)

            }

        }
      }
        catch(error){
          console.log("error",error)
          res.send("error")
          return
        }
 });
            

module.exports = router;
       