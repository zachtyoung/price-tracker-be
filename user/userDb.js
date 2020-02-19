const db = require('../data/dbConfig.js');

module.exports = {
    get,
    getById,
    insert,
    update,
    remove,
    getUserProducts,
    insertUserProducts,
    removeUserProducts,
    getBy,
  };

  function get() {
    return db('users');
  }
  function getById(id) {
    return db('users')
      .where({ id })
      .first();
  }
  function getBy(filter) {
    return db('users').where(filter);
  }
  function insert(user) {
    return db('users')
      .insert(user)
      .then(ids => {
        return getById(ids[0]);
      });
  }
  
  function update(id, changes) {
    return db('users')
      .where({ id })
      .update(changes);
  }
  
  function remove(id) {
    return db('users')
      .where('id', id)
      .del();
  }
  function getUserProducts(userId) {
    return db('products')
      .join('users', 'users.id', 'products.user_id')
      .select('products.id', 'products.url')
      .where('products.user_id', userId);
  }
  function insertUserProducts(user_id, url){
      return db('products')
      .insert(user_id, url)
  }
  function removeUserProducts(id){
      return db('products')
      .where('id', id)
      .del(); 
  }