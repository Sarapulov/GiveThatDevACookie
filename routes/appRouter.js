var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Apps = require('../models/apps');
var Verify = require('./verify');
var appRouter = express.Router(); // HERE

appRouter.use(bodyParser.json());



appRouter.route('/')
.get(function (req, res, next) {
    Apps.find(req.query)
        .populate('comments.postedBy')
        .populate('postedBy')
        .exec(function (err, app) {
        if (err) next(err);
        res.json(app);
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    req.body.postedBy = req.decoded._id;
    Apps.create(req.body, function (err, app) {
        if (err) next(err);
        var id = app._id;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Added App with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Apps.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});



appRouter.route('/:appId')
.get(function (req, res, next) {
  Apps.findById(req.params.appId)
      .populate('comments.postedBy')
      .populate('postedBy')
      .exec(function (err, app) {
      if (err) next(err);
      res.json(app);
  });
})
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Apps.findByIdAndUpdate(req.params.appId, {
        $set: req.body
    }, {
        new: true
    }, function (err, app) {
        if (err) next(err);
        res.json(app);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Apps.findByIdAndRemove(req.params.appId, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});



appRouter.route('/:appId/comments')
.get(function (req, res, next) {
  Apps.findById(req.params.appId)
      .populate('comments.postedBy')
      .exec(function (err, app) {
      if (err) next(err);
      res.json(app.comments);
  });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  Apps.findById(req.params.appId, function (err, app) {
      if (err) next(err);
      req.body.postedBy = req.decoded._id;
      app.comments.push(req.body);
      app.save(function (err, app) {
          if (err) throw err;
          console.log('Updated Comments!');
          res.json(app);
      });
  });
})
.delete(Verify.verifyAdmin, function (req, res, next) {
  Apps.findById(req.params.appId, function (err, app) {
      if (err) next(err);
      for (var i = (app.comments.length - 1); i >= 0; i--) {
          app.comments.id(app.comments[i]._id).remove();
      }
      app.save(function (err, result) {
          if (err) next(err);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Deleted all comments!');
      });
  });
});



appRouter.route('/:appId/comments/:commentId')
.get(function (req, res, next) {
  Apps.findById(req.params.appId)
      .populate('comments.postedBy')
      .exec(function (err, app) {
      if (err) next(err);
      res.json(app.comments.id(req.params.commentId));
  });
})
.put(Verify.verifyOrdinaryUser, function (req, res, next) {
  // We delete the existing commment and insert the updated
  // comment as a new comment
  Apps.findById(req.params.appId, function (err, app) {
      if (err) throw err;
      app.comments.id(req.params.commentId).remove();
      req.body.postedBy = req.decoded._id;
      app.comments.push(req.body);
      app.save(function (err, app) {
          if (err) next(err);
          console.log('Updated Comments!');
          res.json(app);
      });
  });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Apps.findById(req.params.appId, function (err, app) {
      if (app.comments.id(req.params.commentId).postedBy
         != req.decoded._id) {
          var err = new Error('You are not authorized to perform this operation!');
          err.status = 403;
          return next(err);
      }
      app.comments.id(req.params.commentId).remove();
      app.save(function (err, resp) {
          if (err) next(err);
          res.json(resp);
      });
  });
});



module.exports = appRouter;
