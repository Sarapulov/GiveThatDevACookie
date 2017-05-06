var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());



favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({postedBy:req.decoded._id})
      .populate('postedBy')
      .populate('apps')
      .exec(function (err, fav) {
        if (err) throw err;
        res.json(fav);
  });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({postedBy:req.decoded._id}, function (err, fav){
        if (err) throw err;
        if (!fav) { // if there is NO existing favorites object for current user => create it first and then update
          Favorites.create({
              postedBy: req.decoded._id
            }, function (err, favorite) {
              if (err) throw err;
              favorite.apps.push(req.body._id);
              res.json(favorite);
          });
        } else { // if there is  existing favorites object for current user => update it
          // update favorite object only if ther is no such element exist in array
          if (fav && fav.apps && fav.apps.indexOf(req.body._id) < 0) fav.apps.push(req.body._id);
          // save favorite object with postedBy and apps attributes updated
          fav.save(function (err, fv) {
              if (err) throw err;
              res.json(fv);
          });
        }
    });
})
/*
  When the user performs a DELETE operation on '/favorites', you will delete
  the list of favorites corresponding to the user
*/
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOneAndRemove({postedBy:req.decoded._id}, function (err, doc){
      if (err) throw err;
      res.json(doc);
  })
});




favoriteRouter.route('/:dishObjectId')
/*
  When the user performs a DELETE operation on '/favorites/dishObjectId', then
  you will remove the specified dish from the list of the user's favorite apps.
*/
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({postedBy:req.decoded._id}, function (err, fav){
      if (err) throw err;
      if (!fav) { // if there is NO existing favorites object for current user => create it first and then update
        res.json(null);
      } else { // if there is  existing favorites object for current user => update it
        // update favorite object only if ther is no such element exist in array
        if (fav && fav.apps && fav.apps.indexOf(req.params.dishObjectId) > -1) { // if dish id is currently favorited
          fav.apps.splice( fav.apps.indexOf(req.params.dishObjectId), 1 );
        }
        // save favorite object with postedBy and apps attributes updated
        fav.save(function (err, fv) {
            if (err) throw err;
            res.json(fv);
        });
      }
  });
});

module.exports = favoriteRouter;
