/*************************************************************
Dependencies
Express for request handling
Passport & GithubStrategy for Github Authentication and session handling
Session for Express session middleware
BodyParser for body parsing middleware
MethodOverride for overriding HTTP verbs
Partials add partial rendering support to Express
**************************************************************/

var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var GithubStrategy = require('passport-github2').Strategy;
var partials = require('express-partials');

/*************************************************************
Local dependencies
**************************************************************/
var github = require('./github');
var config = require('./env/config');

/*************************************************************
Github App Credentials
https://developer.github.com/v3/oauth/
**************************************************************/

/*************************************************************
Passport Session Setup
To support persistent login sessions, Passport has to be able to
serialize users into a session and deserialize users out of a 
session. Usually this achieved by storing the user ID when 
serializing and finding the user ID when deserializing.
However, without a DB I'm having the entire Github profile
be serialized and deserialized.
**************************************************************/

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/*************************************************************
Github Strategy Setup
**************************************************************/

passport.use(new GithubStrategy({
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //asynchronous verification
    process.nextTick(function() {
      //User's Github is returned to represent the
      //logged in user.
      //With a database we would want to associate
      //the github profile with a user in our database
      //and return that user instead
      return done(null, profile);
    });
  }
));

/*************************************************************
Utilities
**************************************************************/

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/*************************************************************
Express Setup
**************************************************************/

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

/*************************************************************
Routes
**************************************************************/

app.get('/', function(req, res) {
  res.render('index', { user: req.user});
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', { user: req.user});
});

app.get('/login', function(req, res) {
  res.render('login', { user: req.user});
});

app.get('/auth/github', 
   passport.authenticate('github',{ scope: [ 'user:email']}),
   function(req, res) {
    //request is redirected to Github
    //so this is not called
    //After auth, Github will redirect user
    //back to application with the below callback
   });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/repos', ensureAuthenticated, function(req, res) {
 console.log("user", req.user.username);

  github.getRepoData(function(result) {
    // console.log("languages\n", result);
    res.render('repos',{ user: req.user, repos: result });
  });
});

app.listen(3000);