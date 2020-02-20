
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(users) {
      users.increments('id');
      users.string('name').notNullable();
      users.string('email').notNullable().unique();
      users.biginteger('phone').notNullable().unique();
      users.string('password').notNullable();
    })
    .createTable('products', function(products) {
        products.increments('id');
        products.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        products.string('url', 1024).notNullable();
        products.string('img_url', 1024).notNullable();
        products.string('description', 1024).notNullable();
        products.string('price').notNullable();
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users').dropTableIfExists('products');
};
