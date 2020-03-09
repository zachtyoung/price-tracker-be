  
exports.seed = function(knex) {
  return knex('users').insert([
    { name: 'Zach', email:'ztyoung59@yahoo.com', phone:'3164694365', password:'password'  }, // 1
  ]);
};