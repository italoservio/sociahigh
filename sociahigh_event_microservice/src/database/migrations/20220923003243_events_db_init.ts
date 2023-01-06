import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .hasTable('users')
    .then(exists => {
      if (!exists) {
        return knex.schema.createTable('users', table => {
          table.uuid('id', {useBinaryUuid: true}).primary();
          table.string('first_name');
          table.string('last_name');
          table.string('email').unique();
          table.string('phone');
        });
      }
    })
    .then(() =>
      knex.schema.hasTable('addresses').then(exists => {
        if (!exists) {
          return knex.schema.createTable('addresses', table => {
            table.uuid('id', {useBinaryUuid: true}).primary();
            table.string('zip');
            table.string('place');
            table.string('number');
            table.string('city');
            table.string('state');
            table.string('country');
          });
        }
      }),
    )
    .then(() =>
      knex.schema.hasTable('events').then(exists => {
        if (!exists) {
          return knex.schema.createTable('events', table => {
            table.uuid('id', {useBinaryUuid: true}).primary();
            table
              .uuid('address_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('addresses');
            table
              .uuid('user_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('users');
            table.string('name');
            table.string('description');
            table.dateTime('starts_at').defaultTo(knex.fn.now());
            table.dateTime('created_at').defaultTo(knex.fn.now());
            table.dateTime('updated_at').defaultTo(knex.fn.now());
            table.dateTime('deleted_at').defaultTo(null);
          });
        }
      }),
    )
    .then(() =>
      knex.schema.hasTable('items').then(exists => {
        if (!exists) {
          return knex.schema.createTable('items', table => {
            table.uuid('id', {useBinaryUuid: true}).primary();
            table
              .uuid('event_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('events');
            table
              .uuid('user_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('users');
            table.string('name');
            table.string('value');
            table.dateTime('created_at').defaultTo(knex.fn.now());
            table.dateTime('updated_at').defaultTo(knex.fn.now());
            table.dateTime('deleted_at').defaultTo(null);
          });
        }
      }),
    )
    .then(() =>
      knex.schema.hasTable('event_guests').then(exists => {
        if (!exists) {
          return knex.schema.createTable('event_guests', table => {
            table.uuid('id', {useBinaryUuid: true}).primary();
            table
              .uuid('event_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('events');
            table
              .uuid('user_id', {useBinaryUuid: true})
              .index()
              .references('id')
              .inTable('users');
            table.string('answer');
            table.dateTime('answered_at').defaultTo(knex.fn.now());
            table.dateTime('invited_at').defaultTo(knex.fn.now());
          });
        }
      }),
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('event_guests')
    .then(() => knex.schema.dropTable('items'))
    .then(() => knex.schema.dropTable('events'))
    .then(() => knex.schema.dropTable('addresses'))
    .then(() => knex.schema.dropTable('users'));
}
