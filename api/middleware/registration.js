const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../auth/users-model');
const { jwtSecret } = require('../../config/secrets');

const payloadExists = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json('username and password required');
  } else {
    next();
  }
};

const usernameUnique = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json('username taken');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const usernameExists = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json('invalid credentials');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const passwordCheck = (req, res, next) => {
  try {
    const verify = bcrypt.compareSync(req.body.password, req.userData.password);
    if(verify) {
      next();
    } else {
      res.status(401).json('invalid credentials');
    }
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};

const makeToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '3h',
  };
  return jwt.sign(payload, jwtSecret, options)
};

module.exports =  {
  payloadExists,
  usernameUnique,
  usernameExists,
  passwordCheck,
  makeToken
};
