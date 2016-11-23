var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var debateMod = require('../models/debate');
var redMod = require('../models/red');
var blueMod = require('../models/blue');


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

//REST operations for all debates
router.route('/')
  //GET all debates
  .get(function(req, res, next) {
    //retrive from db
    var user = req.user;
    mongoose.model('Debate').find({})
    .populate('user').exec(function(err, debates) {
      if (err) {
        return console.error(err);
      } else {
        mongoose.model('Debate').populate(debates, {
            path: 'user',
            model: 'Account'
          }, function(err, debates){
            if (err) {
            return callback(err);
          } else {
            res.format({
              html: function(){
                res.render('debates/index', {
                  title: "Debates",
                  "debates" : debates,
                  user: user
                });
              },
              json: function(){
                res.json(infophotos);
              }
            });
          }
      });
    }
  });
})

  //POST a new debate
  .post(function(req, res) {
    //retrieve values from POST request
    //debate values
    var topic = req.body.topic;
    var comparitive = req.body.comparitive;
    var user = req.user;
    //red and blue values
    var redname = req.body.redname;
    var bluename = req.body.bluename
    //create red per debate made
    var red = new redMod({
      name: redname
    });


    var blue = new blueMod({
      name: bluename
    });

    var newDebate = new debateMod({
      topic: topic,
      comparitive: comparitive,
      user: user,
      red: red,
      blue: blue
    });
    newDebate.save(function(err, debate){
      if (err) {
        return callback(err);
      } else {
        debateMod.findOne(debate).populate('user', 'red', 'blue').exec(function(err, debate){
          if (err) {
            return callback(err);
          } else {
            console.log('POST: Creating new debate: ' + debate);
            res.format({
              html: function(){
                res.location("debates");
                res.redirect("/debates");
              },
              json: function(){
                res.json(debate);
              }
            });
          }
        });
      }
    });
  });


  //Get new debate page
  router.get('/new', function(req, res) {
    res.render('debates/new', {
      title: 'Start A Debate',
      user: req.user
    });
  });

  //middleware for validating debate :id's

router.param('id', function(req, res, next, id) {
  //search for id within the db
  mongoose.model('Debate').findById(id, function(err, debate){
    //404 if it can't be found
    if (err) {
      console.log(id + ' appears to not exist... sorry m8');
      res.status(404)
      var err = new Error('Not found');
      err.statur = 404;
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({message : err.status + ' ' + err});
        }
      });
      //if it is found, resume
    } else {
      console.log(debate);
      //once validated, save the debate
      req.id = id;
      next();
    }
  });
});

//Set up view for individual debate
router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Debate').findById(req.id, function(err, debate){
      if (err) {
        console.log('GET: There was an issue retrieving: ' + err);
      } else {
        console.log('GET: Retrieving debate: ' + debate._id);
        res.format({
          html:function(){
            res.render('debates/show', {
              "debate" : debate
            });
          },
          json: function(){
            res.json(debate);
          }
        });
      }
    });
  });

//GET the debates edit page
router.get('/:id/edit', function(req, res){
  //search through db for mathching id
  var user = req.user;
  mongoose.model('Debate').findById(req.id, function(err, debate){
    if (err){
      console.log('GET: There was an issue retrieving: ' + err);
    } else {
      //Return the debate
      console.log('GET: Retrieving deabte: ' + debate._id);
      res.format({
      html: function(){
        res.render('debates/edit', {
          title: 'Debate' + debate._id,
          "debate" : debate,
          user: user
        });
      },
      json: function(){
        res.json(debate);
      }
    });
    }
  });
});

//PUT request to apply changes to the debate update
router.put('/:id/edit', function(req, res) {
  var title = req.body.title;
  var comparitive = req.body.comparitive;
  var red = req.body.red;
  var blue = req.body.blue;

  //Find by id
  mongoose.model('Debate').findById(req.id, function(err, debate) {
    //update it
    debate.update({
      title : title,
      comparitive : comparitive,
      red : red,
      blue : blue
    }, function(err, debateID) {
      if (err) {
        res.send("There was an error when trying to update the debate: " + err);
      } else {
        res.format({
          html: function(){
            res.redirect("/debates/" + debate._id);
          },
          json: function(){
            res.json(debate);
          }
        });
      }
    })
  });
});

//DELETE a debate by ID
router.delete('/:id/edit', function(req, res){
  mongoose.model('Debate').findById(req.id, function(err, debate) {
    if (err) {
      return console.error(err);
    } else {
      debate.remove(function(err, debate) {
        if (err) {
          return console.error(err);
        } else {
          console.log('DELETE: Deleting: ' + debate._id);
          res.format({
            html: function() {
              res.redirect("/debates");
            },
            json: function(){
              res.json({message: 'deleted',
            item : debate
          });
            }
          });
        }
      });
    }
  });
});


module.exports = router;

//you need to make views now
