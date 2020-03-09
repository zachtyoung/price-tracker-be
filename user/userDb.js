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
    getAllProducts,
    updateProducts
  };

  function get() {
    return db('users');
  }
  function getAllProducts(){
    return db('products')
  }
  function getById(id) {
    return db('users')
      .where({ id })
      .first();
  }
  function getByProductId(id) {
    return db('products')
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
      .select('products.user_id','products.id', 'products.url', 'products.img_url', 'products.description', 'products.price', 'products.target_price', 'products.notifications')
      .where('products.user_id', userId);
  }
  function insertUserProducts(item){
      return db('products')
      .insert(item)
      .returning('id')
  }
  function removeUserProducts(id){
      return db('products')
      .where('id', id)
      .del(); 
  }
  function updateProducts(id, changes) {
    return db('products')
      .where({ id })
      .update(changes);
  }
