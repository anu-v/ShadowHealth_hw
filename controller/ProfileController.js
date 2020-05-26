var express=require('express');
var router=express.Router();
var app= express();
var questionModel=require('../model/questionModel');
var userModel = require('../model/userModel');
var bodyparser = require('body-parser');
var session = require('express-session');
const { buildSanitizeFunction } = require('express-validator');
const sanitizeBody = buildSanitizeFunction('body');
var { check, validationResult } = require('express-validator');
var urlEncodedParser = bodyparser.urlencoded({ extended: false });

var userProfile;
router.use( (req, res, next) => {
 res.locals.user = req.session.theUser;
 next();
});

//render home page
router.get('/', function (req, res) {
    res.render('index', {user:req.session.theUser});
  });
//render home page
router.get('/index', function (req, res) {
    res.render('index', {user:req.session.theUser});//render home page
});
//render Login page
router.get('/Login',function(req,res){
  if(!req.session.theUser){
  var alert='';
  res.render('Login',{alert:alert});
}
else{
  var alert="You are already logged in";
  res.render('questions',{alert:alert,user:req.session.theUser});
}
});

router.post('/Login',urlEncodedParser, async function(req,res){
  var users=await userModel.getUser(req.body.username);
  if(users[0]== null){
      var alert="User not found";
      res.render('Login',{alert:alert});
  }else  {
     
      var getHash=userModel.getHash(req.body.password,users[0].salt);
      var retreivedHash= users[0].hash;
          if (getHash==retreivedHash) {
            var alert="You are logged in";
            req.session.theUser = users[0];
            var data = await questionModel.getQuestions();
            res.render('questions',{data:data,alert:alert,user:req.session.theUser});
          }else{
            var alert="Password doesn't match";
            res.render('Login',{alert:alert});
              }
            }
});
//render questions page
router.get('/questions',async function(req, res) {
  if(req.session.theUser){
  var data = await questionModel.getQuestions();
  var alert = '';
  res.render('questions',{data:data,alert:alert,user:req.session.theUser});
}else{
  var alert="User Not Logged In";
  res.render('Login',{alert:alert});
}
});
//render question page
  router.get('/question', async function(req,res){
      var alert = req.query.alert;
      if(req.query.questionID!==null && req.query.questionID!== undefined){
            var questionData= await questionModel.getQuestion(req.query.questionID);
            res.render('question', {data:questionData,alert:alert,user:req.session.theUser});
          }else if(req.session.theUser == null){
                 var alert="User Not Logged In";
                 res.render('Login',{alert:alert});
               }
        else{
  			res.send('invalid code');
        }
});

router.post('/question',urlEncodedParser,[
  check('answer', 'answer should not be less than 1 and more than 50 characters').isLength({min:1, max:50})
], async function(req,res){
  const error = validationResult(req);
  if (error.isEmpty()){
    var questionid = parseInt(req.body.questionID);
    var questionData= await questionModel.getQuestion(questionid);
    if(questionData[0].answer == req.body.answer){
      var user =await userModel.getUser(req.session.theUser.username);
      var score  = user[0].score
      score = score + 20;
      await userModel.updateScore(req.session.theUser.username , score);
      var alert = "you got the answer correct. +20 points to your score.Would you like to answer another question?";
    var data = await questionModel.getQuestions();
      res.render('questions', {data:data,alert:alert,user:req.session.theUser});
    }else if (questionData[0].answer != req.body.answer){
      var alert = "you got the answer wrong.Would you like to answer another question?";
    var data = await questionModel.getQuestions();
      res.render('questions', {data:data,alert:alert,user:req.session.theUser});
    }
  }
});


router.get('/newQuestion', function(req, res) {
    if(req.session.theUser){
  var alert='';
  res.render('newQuestion', {user:req.session.theUser,alert:alert});//render newConnection page
  }else{
    var alert = "Please login to add a new question"
    res.render('Login',{alert:alert,user:req.session.theUser});
  }
});

router.post('/newQuestion',urlEncodedParser,[
  check('question', 'question should not be less than 10 and more than 50 characters').isLength({min:10, max:50}),
  check('answer', 'answer should not be less than 1 and more than 50 characters').isLength({min:1, max:50})
],async function(req,res){
  const error = validationResult(req);
  if (error.isEmpty()){
  await questionModel.addQuestion(req.body.question,req.body.answer,req.session.theUser.username);
  var data = await questionModel.getQuestions();
  var alert = '';
  res.render('questions',{data:data,alert: alert,user:req.session.theUser});
}else{
      console.log(error);
      var alert='';
        res.render('newQuestion', {user: req.session.theUser,  alert:error.errors[0].msg});

    }
  });
//route to render userRegistration page
  router.get('/userRegistration', function(req, res) {
      if(req.session.userProfile== null){
    var alert='';
    res.render('userRegistration', {alert:alert});
    }else{
      res.send("You are logged in");
    }
  });

  router.post('/userRegistration',urlEncodedParser, [check('username').isAlphanumeric().withMessage('No special characters allowed')
.isLength({min:6, max:15}).withMessage('username length should be equal to 6-15 characters!!'),
check('password').isAlphanumeric().isLength({min:4}).withMessage('must be Alphabets,no special characters allowed')], async function(req, res){
  const error = validationResult(req);
  if (error.isEmpty()){
    var isExistUser = await userModel.getUser(req.body.username);
    if(isExistUser.length!== 0 ){
    var alert = "username already exists.It should be unique";
    res.render('userRegistration', {user:req.session.theUser,alert:alert});
  } else{
    var alert ="user succefully added";
    await userModel.addUser(req.body);
    res.render('Login', {user:req.session.theUser,alert:alert});
  }
}else{
      console.log(error);
      var alert=error.errors[0].msg;
      res.render('userRegistration', {user:req.session.theUser,alert:alert});
    }
});
//route to render scoreDashboard page
router.get('/scoreDashboard', async function(req, res) {
    if(req.session.theUser== null){
  var alert='';
  res.render('Login', {alert:alert});
  }else{
    var alert = '';
    var data = await userModel.getUsers();
    res.render('scoreDashboard',{data:data,user:req.session.theUser,alert:alert});
  }
});




//user logout functionality
router.get('/signout',function(req,res){
 if(req.session.theUser){
   req.session.destroy();
   res.redirect('/');
 }else{
    res.redirect('/');
 }
});

router.get('/*',function(req,res){
res.send("404 error.Unable to find the page you are searching for");
});


const Allcheck = function(attribute){ //to disallow specific special chars
  let regexp = /[`~$%^.*_+=;<>/?|]+/;
  if(!regexp.test(attribute)){
    return attribute
  } else{
    throw new Error('Special characters are not allowed');
  }
}

module.exports = router;
