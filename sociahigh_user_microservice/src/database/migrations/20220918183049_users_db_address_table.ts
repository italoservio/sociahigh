import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('addresses').then(exists => {
    if (!exists) {
      return knex.schema.createTable('addresses', table => {
        table.uuid('id', {useBinaryUuid: true}).primary();
        table
          .uuid('user_id', {useBinaryUuid: true})
          .index()
          .references('id')
          .inTable('users');
        table.string('zip');
        table.string('place');
        table.string('number');
        table.string('city');
        table.string('state');
        table.string('country');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(null);
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('addresses');
}
