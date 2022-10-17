const express = require('express');
const { 
  validateUserId,
  validateUser,
  validatePost
 } = require('../middleware/middleware');
const User = require('./users-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
      .then(users => {
        res.json(users);
      })
      .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert({name: req.name})
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, {name: req.name})
      .then(updatedUser => {
        res.json(updatedUser)
      })
      .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
    await User.remove(req.params.id)
    res.json(req.user)
  }catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  User.getUserPosts(req.params.id)
      .then(posts => {
        res.json(posts);
      })
      .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.body);
});

router.use((error, req, res, next) => { //eslint-disable-line
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: "Something went wrong inside posts router"
  })
})

// do not forget to export the router
module.exports = router;