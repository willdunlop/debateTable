var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('account/register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('account/register', { account : account });
            console.log('Shit fucked up mang');
        }

        passport.authenticate('local')(req, res, function () {
          req.session.save(function(err){
            if (err) {
              return next(err);
            }
            res.redirect('/');
          });
        });
    });
});

// router.put('/settings', function(req,res){
//   var username = req.body.username;
//   var password = req.body.password;
//
//   mongoose.model('Account').findById(req.user._id, function(err, account) {
//     account.update({
//       username: username,
//       password: password
//     }, function(err, accountID){
//       if (err) {
//         res.send("There was an error: " + err);
//       } else {
//         res.format({
//           html: function(){
//             res.redirect("/");
//           },
//           json: function(){
//             res.json(account);
//           }
//         });
//       }
//     })
//   });
// });

router.get('/login', function(req, res) {
    res.render('account/login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/settings', function(req,res){
  res.render('account/settings', { user: req.user });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
