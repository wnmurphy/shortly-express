var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var bcrypt = require('bcrypt-nodejs');

var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Plug in middleware...
app.use(partials());

// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
// Set root directory for express app
app.use(express.static(__dirname + '/public'));

// Add session
app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000
  }
}));

app.get('/', util.checkUser, function (req, res) {
  res.render('index');
});

app.get('/create', util.checkUser, function (req, res) {
  res.render('index');
});

app.get('/links', util.checkUser, function (req, res) {
  Links.reset().fetch().then(function (links) {
    res.send(200, links.models);
  });
});

app.post('/links', util.checkUser, function (req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function (found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function (err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function (newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
});

// Load login page
app.get('/login', function (req, res) {
  res.render('login');
});

// Load signup page
app.get('/signup', function (req, res) {
  res.render('signup');
});

// Load signup page
app.get('/logout', function (req, res) {
  req.session.destroy(function (err){
    if (err) {
      console.error(error);
    }
  });
  res.render('login');

});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Create new User
  var newUser = new User({username: username}).fetch()
    .then(function(newUser){
      if (!newUser) {
        res.redirect('/login');
      } else {
        bcrypt.compare(password, newUser.get('password'), function (err, match){
          if (match) {
            util.createSession(req, res, newUser);
          } else {
            res.redirect('login');
          }
        });
      }
    });
  });

// Submit credentials on signup page
app.post('/signup', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  new User({
    'username': username,
    'password': password
  }).save().then(function (newUser) {
    Users.add(newUser);
    return newUser;
  }).then(function (newUser) {
    util.createSession(req, res, newUser);
  });
});

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function (link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function () {
        db.knex('urls')
          .where('code', '=', link.get('code'))
          .update({
            visits: link.get('visits') + 1,
          }).then(function () {
            return res.redirect(link.get('url'));
          });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
