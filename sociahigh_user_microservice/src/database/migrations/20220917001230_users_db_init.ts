import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('users').then(exists => {
    if (!exists) {
      return knex.schema.createTable('users', table => {
        table.uuid('id', {useBinaryUuid: true}).primary();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique();
        table.string('phone');
        table.string('password');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(null);
      });
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user');
}
