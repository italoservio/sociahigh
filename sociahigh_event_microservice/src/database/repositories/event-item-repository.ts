import {ItemDTO} from '../../abstractions/dtos/commons/item-dto';
import {TDatabaseTransaction} from '../../abstractions/types';
import knex from '../conn';
import {randomUUID} from 'node:crypto';
import {PaginateItemDTO, UserSuppressedDTO} from '../../abstractions/dtos';

export async function add(
  event_id: string,
  item: Partial<ItemDTO>,
  db_transaction?: TDatabaseTransaction,
): Promise<Partial<ItemDTO>> {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);
  const binary_event_id = knex.fn.uuidToBin(event_id);

  await (db_transaction ? db_transaction : knex)
    .insert<ItemDTO>({
      id: binary_id,
      event_id: binary_event_id,
      ...item,
    })
    .into('items');
  return {...item, id: uuid, event_id};
}

export async function remove(event_id: string, item_id: string) {
  const binary_id = knex.fn.uuidToBin(event_id);
  const binary_item_id = knex.fn.uuidToBin(item_id);
  return knex('items')
    .update<ItemDTO>({
      deleted_at: knex.fn.now(),
    })
    .where({
      id: binary_item_id,
      event_id: binary_id,
    });
}

export async function updateItemUser(
  event_id: string,
  item_id: string,
  user_id: string,
) {
  const binary_event_id = knex.fn.uuidToBin(event_id);
  const binary_item_id = knex.fn.uuidToBin(item_id);
  const binary_user_id = knex.fn.uuidToBin(user_id);
  return knex('items')
    .update<ItemDTO>({user_id: binary_user_id})
    .where({id: binary_item_id, event_id: binary_event_id});
}

export async function retrieveByEventId(
  event_id: string,
  include_deleted = false,
): Promise<any> {
  const binary_id = knex.fn.uuidToBin(event_id);

  const rows = await knex
    .select<
      {
        items: ItemDTO;
        users: UserSuppressedDTO;
      }[]
    >()
    .from('items')
    .leftJoin('users', 'users.id', '=', 'items.user_id')
    .options({nestTables: true})
    .where({
      event_id: binary_id,
      ...(!include_deleted && {deleted_at: null}),
    });

  return rows.map(row => {
    const {users, items} = row;
    const {id: binary_item_id, user_id, ...item} = items;
    const {id: binary_user_id, ...user} = users;

    return {
      id: knex.fn.binToUuid(binary_item_id as Buffer),
      ...item,
      event_id,
      user: binary_user_id
        ? {
            ...user,
            id: knex.fn.binToUuid(binary_user_id as Buffer),
          }
        : null,
    };
  });
}

export async function paginateByEventId(
  event_id: string,
  params: PaginateItemDTO,
  include_deleted = false,
): Promise<ItemDTO[]> {
  const binary_id = knex.fn.uuidToBin(event_id);

  const offset = (params.page - 1) * params.page_size;

  const chain = knex
    .select<ItemDTO[]>()
    .from('items')
    .where({
      event_id: binary_id,
      ...(!include_deleted && {deleted_at: null}),
    });

  if ('with_user' in params) {
    if (params.with_user) chain.andWhereNot({user_id: null});
    else chain.andWhere({user_id: null});
  }

  const rows = await chain.offset(offset).limit(params.page_size);

  return rows.map(item => {
    const {id: binary_item_id, user_id: binary_user_id, ...rest} = item;
    return {
      id: knex.fn.binToUuid(binary_item_id as Buffer),
      user_id: binary_user_id
        ? knex.fn.binToUuid(binary_user_id as Buffer)
        : null,
      ...rest,
      event_id,
    };
  });
}

export async function removeAllByEventId(
  event_id: string,
  db_transaction?: TDatabaseTransaction,
) {
  const binary_id = knex.fn.uuidToBin(event_id);
  await (db_transaction ? db_transaction : knex)('items')
    .where({event_id: binary_id})
    .del();
}
