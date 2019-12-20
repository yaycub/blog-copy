const { Router } = require('express');
const tokenVerify = require('../middleware/token-verify');
const Post = require('../models/Post');

module.exports = Router()
  .post('/new', tokenVerify, (req, res, next) => {
    Post
      .create(req.body)
      .then(post => res.send(post))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  })

  .patch('/:id', tokenVerify, (req, res, next) => {
    Post
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(post => res.send(post))
      .catch(next);
  })

  .delete('/:id', tokenVerify, (req, res, next) => {
    Post
      .findOneAndDelete(req.params.id)
      .then(post => res.send(post))
      .catch(next);
  });
