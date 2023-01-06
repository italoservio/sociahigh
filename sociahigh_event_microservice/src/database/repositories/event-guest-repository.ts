import knex from '../conn';
import {
  AddressSuppressedDTO,
  EventDTO,
  EventGuestDTO,
  PaginateGuestsDTO,
  PaginateUserInvitationsDTO,
  UserDTO,
} from '../../abstractions/dtos';
import {TDatabaseTransaction} from '../../abstractions/types';
import {ItemDTO} from '../../abstractions/dtos/commons/item-dto';
import {randomUUID} from 'node:crypto';
import {AnswerEnum} from '../../abstractions/enums';

export async function add(
  invitation: Partial<EventGuestDTO>,
  db_transaction?: TDatabaseTransaction,
) {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);

  await (db_transaction ? db_transaction : knex)
    .insert<ItemDTO>({
      ...invitation,
      id: binary_id,
      event_id: knex.fn.uuidToBin(invitation.event_id as string),
      user_id: knex.fn.uuidToBin(invitation.user_id as string),
    })
    .into('event_guests');
  return {...invitation, id: uuid};
}

export async function paginateEventGuests(
  event_id: string,
  params: PaginateGuestsDTO,
) {
  const event_binary_id = knex.fn.uuidToBin(event_id);
  const offset = (params.page - 1) * params.page_size;

  const chain = knex
    .select<
      {
        event_guests: EventGuestDTO;
        users: Omit<UserDTO, 'id'> & {id: Buffer};
      }[]
    >('*')
    .from('event_guests')
    .leftJoin('users', 'users.id', '=', 'event_guests.user_id')
    .where({event_id: event_binary_id});

  if (params.name) {
    chain
      .andWhereILike('users.first_name', `%${params.name}%`)
      .orWhereILike('users.last_name', `%${params.name}%`);
  }

  const rows = await chain
    .options({nestTables: true})
    .offset(offset)
    .limit(params.page_size);

  return rows.map(({event_guests, users}) => {
    delete event_guests.user_id;
    return {
      ...event_guests,
      id: knex.fn.binToUuid(event_guests.id as Buffer),
      event_id: knex.fn.binToUuid(event_guests.event_id as Buffer),
      user:
        !!users && Object.keys(users).length
          ? {
              ...users,
              id: knex.fn.binToUuid(users.id),
            }
          : null,
    };
  });
}

export async function paginateUserInvitations(
  user_id: string,
  params: PaginateUserInvitationsDTO,
) {
  const user_binary_id = knex.fn.uuidToBin(user_id);
  const offset = (params.page - 1) * params.page_size;

  const chain = knex
    .select<
      {
        event_guests: EventGuestDTO;
        events: EventDTO;
        addresses: AddressSuppressedDTO;
      }[]
    >('*')
    .from('event_guests')
    .leftJoin('events', 'events.id', '=', 'event_guests.event_id')
    .leftJoin('addresses', 'addresses.id', '=', 'events.address_id')
    .whereRaw('event_guests.user_id = ?', [user_binary_id]);

  if ('answer' in params) {
    chain.whereIn('event_guests.answer', params.answer as string[]);
  }

  const rows = await chain
    .options({nestTables: true})
    .offset(offset)
    .limit(params.page_size);

  return rows.map(({events, event_guests, addresses}) => {
    delete events.address_id;
    delete event_guests.event_id;

    const created_at = new Date(events.created_at!).getTime();
    const updated_at = new Date(events.updated_at!).getTime();
    const starts_at = new Date(events.starts_at).getTime();

    const offset_in_ms = new Date().getTimezoneOffset() * 60000;
    events.created_at = new Date(created_at - offset_in_ms).toISOString();
    events.updated_at = new Date(updated_at - offset_in_ms).toISOString();
    events.starts_at = new Date(starts_at - offset_in_ms).toISOString();

    return {
      ...events,
      id: knex.fn.binToUuid(events.id as Buffer),
      user_id: knex.fn.binToUuid(events.user_id as Buffer),
      address: {
        ...addresses,
        id: knex.fn.binToUuid(addresses.id as Buffer),
      },
      invitation: {
        ...event_guests,
        id: knex.fn.binToUuid(event_guests.id as Buffer),
        user_id: knex.fn.binToUuid(event_guests.user_id as Buffer),
      },
    };
  });
}

export async function retrieveUserInvitationById(
  user_id: string,
  invitation_id: string,
) {
  const binary_id = knex.fn.uuidToBin(invitation_id);
  const user_binary_id = knex.fn.uuidToBin(user_id);
  const row = await knex
    .select<EventGuestDTO>('*')
    .from('event_guests')
    .where({
      user_id: user_binary_id,
      id: binary_id,
    })
    .first();

  if (!row) return null;
  return {
    ...row,
    id: knex.fn.binToUuid(row.id as Buffer),
    user_id: knex.fn.binToUuid(row.user_id as Buffer),
    event_id: knex.fn.binToUuid(row.event_id as Buffer),
  };
}

export async function retrieveUserInvitationByEventId(
  user_id: string,
  event_id: string,
) {
  const event_binary_id = knex.fn.uuidToBin(event_id);
  const user_binary_id = knex.fn.uuidToBin(user_id);
  const row = await knex
    .select<EventGuestDTO>('*')
    .from('event_guests')
    .where({
      user_id: user_binary_id,
      event_id: event_binary_id,
    })
    .first();

  if (!row) return null;
  return {
    ...row,
    id: knex.fn.binToUuid(row.id as Buffer),
    user_id: knex.fn.binToUuid(row.user_id as Buffer),
    event_id: knex.fn.binToUuid(row.event_id as Buffer),
  };
}

export async function updateInvitation(
  user_id: string,
  invitation_id: string,
  data_to_update: Partial<EventGuestDTO>,
) {
  const binary_id = knex.fn.uuidToBin(invitation_id);
  const user_binary_id = knex.fn.uuidToBin(user_id);
  return knex('event_guests')
    .where({
      id: binary_id,
      user_id: user_binary_id,
    })
    .update({...data_to_update});
}

export async function removeAllByEventId(
  event_id: string,
  db_transaction?: TDatabaseTransaction,
) {
  const binary_id = knex.fn.uuidToBin(event_id);
  await (db_transaction ? db_transaction : knex)('event_guests')
    .where({event_id: binary_id})
    .del();
}
