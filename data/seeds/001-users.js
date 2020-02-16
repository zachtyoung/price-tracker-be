  
exports.seed = function(knex, Promise) {
  return knex('users').insert([
    { name: 'Frodo Baggins', email:'ztyoung59@yahoo.com', phone:'3164694365', password:'password'  }, // 1
    { name: 'Sam', email:'ztyoung69@yahoo.com', phone:'3164694364', password:'password'  }, // 1
  ]);
};