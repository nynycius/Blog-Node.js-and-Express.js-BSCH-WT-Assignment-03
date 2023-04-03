const express = require('express');
const router = express.Router();

//login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  console.log(req.body);
  res.send('hello');
});

module.exports = router;
