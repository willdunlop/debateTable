var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var debateMod = require('../models/debate');
var itemMod = require('../models/item');
var commentMod = require('../models/comment');

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
    var red = req.body.red;
    var blue = req.body.blue;
    var user = req.user;
    //red and blue values

    var newDebate = new debateMod({
      topic: topic,
      comparitive: comparitive,
      red: red,
      blue: blue,
      user: user
    });
    newDebate.save(function(err, debate){
      if (err) {
        return callback(err);
      } else {
        debateMod.findOne(debate).populate('user').exec(function(err, debate){
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
      console.log("###MDLWRE### \n" + debate);
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
      mongoose.model('Item').find({}).populate('user').exec(function(err, items){
        mongoose.model('Comment').find({}).exec(function(err, comments){
          if (err) {
            console.log('GET: There was an issue retrieving: ' + err);
          } else {
            mongoose.model('Item').populate(items, {
              path: 'user',
              model: 'Account'
            }, function(err, items){
              if(err){
                console.log(err);
              } else {
              console.log('GET: Retrieving debate: ' + debate._id);
              res.format({
                html:function(){
                  res.render('debates/show', {
                    "debate" : debate,
                    title: debate.topic,
                    "items" : items,
                    user: req.user
                  });
                },
                json: function(){
                  res.json(debate);
                }
              });
            }
          });
        }
      });
    })
  });
})

  //Ability to add an item
   .post(function(req,res){
    var title = req.body.title;
    var claim = req.body.claim;
    var source = req.body.source;
    var redblue = req.body.redblue;
    var debate = req.body.debate
    var user = req.user;

    var newItem = new itemMod({
      title: title,
      claim: claim,
      source: source,
      redblue: redblue,
      debate: debate,
      user: user
    });
    newItem.save(function(err, item){
      if(err){
        console.log(err);
        res.render("error", {
          message: "An error occured",
          error: err
        });
      } else {
        itemMod.findOne(item).populate('user').exec(function(err,item){
          if(err) {
            console.log(err);
            res.render("error", {
              message: "An error occured",
              error: err
            });
          } else {
            console.log('POST: Creating new item: ' + item);
            res.format({
              html: function(){
                res.redirect("/debates/" + item.debate);
              },
                json: function(){
                  res.json(item);
              }
            });
          }
        });
      }
    });
  })
  //POST a comment for each item
  router.route('/:id/comments')
  .post(function(req, res){
    var comment = req.body.comment;
    var author = req.user;
    var item = req.body.item;

    var newComment = new commentMod({
      comment: comment,
      author: author,
      item: item
    });
    newComment.save(function(err, comment){
      if (err){
        console.log(err);
        res.render("error", {
          message: "Error!",
          error: err
        });
      } else {
        commentMod.findOne(comment).populate('author', 'item').exec(function(err,comment){
          if(err) {
            console.log(err);
            res.render("error", {
              message: "Error!",
              error: err
            });
          } else {
            console.log('POST: Creating new comment: ' + comment);
            res.format({
              html: function(){
                res.redirect("/debates", {
                  "comment" : comment
                });
              },
              json: function(){
                res.json(comment);
              }
            });
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
