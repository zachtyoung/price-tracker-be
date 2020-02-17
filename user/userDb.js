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
    return db('products as p')
      .join('users as u', 'u.id', 'p.user_id')
      .select('p.id', 'p.url')
      .where('p.user_id', userId);
  }
  function insertUserProducts(user_id, url){
      return db('products')
      .insert(user_id,url)
      .then(id => {
        return id
      });
  }
  function removeUserProducts(id){
      return db('products')
      .where('id', id)
      .del(); 
  }