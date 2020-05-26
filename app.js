var express =require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieparser = require('cookie-parser');

var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/trivia');


app.use(cookieparser());
app.use(session({
    secret: 'Ektara',  saveUninitialized: true,
				 resave: true,
				 store: new MongoStore({ mongooseConnection: mongoose.connection,
				 							ttl: 2 * 24 * 60 * 60 })}));

var viewPath = path.join(__dirname, './views');
var questionModel= require('./model/questionModel')
app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use('/assets', express.static('assests'));
app.use('/assets/css',express.static(path.join(__dirname,'/./assets/css')));
app.use('/assets/images',express.static(path.join(__dirname,'/./assets/images')));
app.use('/partials',express.static('partials'));

var profilecontroller = require('./controller/ProfileController.js');
app.use('/',profilecontroller);
app.use('/question',profilecontroller);
app.use('/questions',profilecontroller);
app.use('/userRegistration',profilecontroller);
app.use('/Login',profilecontroller);
app.use('/newQuestion',profilecontroller);
app.use('/scoreDashboard',profilecontroller);
app.use('/*', profilecontroller);



app.listen(8083);
console.log('started at port 8083');
module.exports = app;
