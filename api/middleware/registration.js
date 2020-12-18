const Users = require('../auth/users-model');

const checkPayloadExists = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json('username and password required');
  } else {
    next();
  }
};

const checkUsernameUnique = async (req, res, next) => {
  try {
    const rows = await Users.findBy({ username: req.body.username });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json('username taken');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginNameExists = async (req, res, next) => {
  try {
    const rows = await Users.findBy({ username: req.body.username });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json('invalid credentials');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports =  {
  checkPayloadExists,
  checkUsernameUnique,
  loginNameExists
};
