const db = require('../../data/dbConfig');

module.exports = {
  add,
  findBy,
  findById
};

async function add(user) {
  const [id] = await db('users').insert(user, 'id');
  return (findById(id));
}

function findBy(filter) {
  return db('users').where(filter).orderBy('id');
}

function findById(id) {
  return db('users').where({ id }).first();
}
