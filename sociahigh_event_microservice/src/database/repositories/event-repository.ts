import {randomUUID} from 'node:crypto';
import {
  AddressSuppressedDTO,
  CreateEventDTO,
  EventDTO,
  PaginateEventDTO,
} from '../../abstractions/dtos';
import {AnswerEnum} from '../../abstractions/enums';
import {TDatabaseTransaction} from '../../abstractions/types';
import knex from '../conn';
import * as items from './event-item-repository';

export async function create(
  user_id: string,
  address_id: string,
  event: Omit<CreateEventDTO, 'address'>,
  db_transaction?: TDatabaseTransaction,
): Promise<Partial<EventDTO>> {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);
  const binary_user_id = knex.fn.uuidToBin(user_id);
  const binary_address_id = knex.fn.uuidToBin(address_id);

  await (db_transaction ? db_transaction : knex)
    .insert({
      ...event,
      id: binary_id,
      user_id: binary_user_id,
      address_id: binary_address_id,
    })
    .into('events');
  return {...event, id: uuid, user_id};
}

export async function retrieveById(
  user_id: string,
  event_id: string,
  complete = false,
): Promise<EventDTO | null> {
  const binary_id = knex.fn.uuidToBin(event_id);
  const binary_user_id = knex.fn.uuidToBin(user_id);

  const selection = ['events.*', ...(complete ? ['addresses.*'] : [])];

  const chain = knex
    .select<{
      events: EventDTO;
      addresses: AddressSuppressedDTO;
    }>(...selection)
    .from('events')
    .options({nestTables: true});

  if (complete) {
    chain.leftJoin('addresses', 'addresses.id', '=', 'events.address_id');
  }

  const row = await chain
    .where({'events.id': binary_id, 'events.user_id': binary_user_id})
    .first();

  if (row?.events) {
    const event = row.events;

    event.id = event_id;
    event.address_id = knex.fn.binToUuid(event.address_id as Buffer);
    event.user_id = knex.fn.binToUuid(event.user_id as Buffer);

    if (complete) {
      const address = row.addresses;
      address.id = knex.fn.binToUuid(address.id as Buffer);
      delete event.address_id;
      event.address = address;

      event.items = await items.retrieveByEventId(event_id);
    }

    return event;
  } else {
    return null;
  }
}

export async function exists(id: string) {
  const binary_id = knex.fn.uuidToBin(id);
  const result = await knex
    .count<{quantity: number}>('id as quantity')
    .from('events')
    .where({id: binary_id})
    .first();
  return !!result?.quantity;
}

export async function paginateUserEvents(
  user_id: string,
  params: PaginateEventDTO,
): Promise<EventDTO[]> {
  const user_binary_id = knex.fn.uuidToBin(user_id);
  const offset = (params.page - 1) * params.page_size;

  type ExtraCustomFields = {
    items_with_user: number;
    total_items: number;
    accepted_guests: number;
    total_guests: number;
  };

  const rows = await knex
    .with('items_with_users', qb => {
      qb.select('i.event_id')
        .sum('i.value as summation')
        .from('items as i')
        .whereNot({user_id: null})
        .groupBy('i.event_id');
    })
    .with('total_items', qb => {
      qb.select('i.event_id')
        .sum('i.value as summation')
        .from('items as i')
        .groupBy('i.event_id');
    })
    .with('accepted_guests', qb => {
      qb.select('eg.event_id')
        .count('eg.id as counter')
        .from('event_guests as eg')
        .where({answer: AnswerEnum.ACCEPTED})
        .groupBy('eg.event_id');
    })
    .with('total_guests', qb => {
      qb.select('eg.event_id')
        .count('eg.id as counter')
        .from('event_guests as eg')
        .groupBy('eg.event_id');
    })
    .select<
      {
        e: EventDTO;
        a: AddressSuppressedDTO;
        '': ExtraCustomFields;
      }[]
    >(
      'e.*',
      'a.*',
      knex.raw('coalesce(iwu.summation, 0) as items_with_user'),
      knex.raw('coalesce(ti.summation, 0) as total_items'),
      knex.raw('coalesce(ag.counter, 0) as accepted_guests'),
      knex.raw('coalesce(tg.counter, 0) as total_guests'),
    )
    .from('events as e')
    .leftJoin('addresses as a', 'a.id', 'e.address_id')
    .leftJoin('items_with_users as iwu', 'iwu.event_id', 'e.id')
    .leftJoin('total_items as ti', 'ti.event_id', 'e.id')
    .leftJoin('accepted_guests as ag', 'ag.event_id', 'e.id')
    .leftJoin('total_guests as tg', 'tg.event_id', 'e.id')
    .where({
      user_id: user_binary_id,
      deleted_at: null,
    })
    .options({nestTables: true})
    .offset(offset)
    .limit(params.page_size);

  return rows.map(row => {
    const custom_entries = row[''];

    const {
      id: binary_event_id,
      address_id: binary_address_id,
      user_id: binary_user_id,
      ...rest
    } = row.e;

    const event_id = knex.fn.binToUuid(binary_event_id as Buffer);
    const address_id = knex.fn.binToUuid(binary_address_id as Buffer);

    const address = row.a;
    address.id = address_id;

    const created_at = new Date(rest.created_at!).getTime();
    const updated_at = new Date(rest.updated_at!).getTime();
    const starts_at = new Date(rest.starts_at).getTime();

    const offset_in_ms = new Date().getTimezoneOffset() * 60000;
    rest.created_at = new Date(created_at - offset_in_ms).toISOString();
    rest.updated_at = new Date(updated_at - offset_in_ms).toISOString();
    rest.starts_at = new Date(starts_at - offset_in_ms).toISOString();

    return {
      id: event_id,
      user_id,
      ...rest,
      address,
      ...custom_entries,
    };
  });
}

export async function update(event_id: string, data: Partial<EventDTO>) {
  const binary_id = knex.fn.uuidToBin(event_id);
  return knex('events')
    .where({id: binary_id})
    .update({...data, updated_at: new Date()});
}

export async function removeById(
  event_id: string,
  db_transaction?: TDatabaseTransaction,
) {
  const binary_id = knex.fn.uuidToBin(event_id);
  await (db_transaction ? db_transaction : knex)('events')
    .where({id: binary_id})
    .del();
}
