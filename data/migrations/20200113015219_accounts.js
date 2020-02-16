
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(users) {
      users.increments('id');
      users.string('name').notNullable();
      users.string('email').notNullable().unique();
      users.integer('phone').notNullable().unique();
      users.string('password').notNullable();
    })
    .createTable('products', function(products) {
        products.increments('id');
        products.string('url').notNullable();
        products.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users').dropTableIfExists('products');
};
