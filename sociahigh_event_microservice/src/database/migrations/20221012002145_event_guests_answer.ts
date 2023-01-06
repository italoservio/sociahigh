import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('event_guests', table => {
    table.string('answer').nullable().defaultTo(null).alter();
    table.dateTime('answered_at').nullable().defaultTo(null).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('event_guests', table => {
    table.string('answer').alter();
    table.dateTime('answered_at').defaultTo(knex.fn.now()).alter();
  });
}
