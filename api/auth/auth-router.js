const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('./users-model');
const { payloadExists, usernameUnique, usernameExists, passwordCheck, makeToken } = require('../middleware/registration');

router.post('/register', payloadExists, usernameUnique, async (req, res) => {  
  try{
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = await User.add({
      username: req.body.username,
      password: hash
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status (500).json({ message: error.message });
  }
});

router.post('/login', payloadExists, usernameExists, passwordCheck, async (req, res) => {
  try{
    const rows = await User.findBy({ username: req.body.username });
    const user = rows[0];
    const token = makeToken(user);
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token
    });
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
});

module.exports = router;
