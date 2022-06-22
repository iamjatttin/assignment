var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'smtp uSers email',
    pass: 'password'
  }
});


//connection urls
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment');
//schemass
var userSchema = mongoose.Schema({
  name: String,
  email : String,
  otp : Number,
  date:{
    type: Date,
    default: Date.now
  }
});

//creating user model :: This model will be used for every crud operations
var user = mongoose.model("user", userSchema);
//connection operation routes

  router.get('/',(req, res) => {
    user.find((err, result) => {
      if (!err) {
        res.render("index", {
          result: result
      });
      } else {
          console.log('Failed to retrieve the user List: ' + err);
      }
    });
});
//  user post Route
router.post('/', function(req, res){
  var userinfo = req.body; 
     var newuser = new user({
        name: userinfo.name,
        email: userinfo.email,

     });
     newuser.save(function(err, Person){
      if(err) throw err
        if(err)
           res.send("error in save")
        else
           res.redirect("/")
     });
  
});
// Send Email

router.get('/send/:id', async function(req, res){

 userinfo = await user.findById(req.params.id);
  id =userinfo._id;
var mailOptions = {
  from: 'smtp user email',
  to: `${userinfo.email}`,
  subject: 'Sending Email using Node.js',
  text: `http://localhost:3000/verify:${id}`
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
res.send('Sent')
});
router.get('/verify/:id', async function(req, res){


res.send('Verified')
});
module.exports = router;