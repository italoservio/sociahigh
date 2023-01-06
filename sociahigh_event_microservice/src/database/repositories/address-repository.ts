import {AddressSuppressedDTO} from '../../abstractions/dtos';
import {randomUUID} from 'node:crypto';
import knex from '../conn';
import {TDatabaseTransaction} from '../../abstractions/types';

export async function create(
  address: Omit<AddressSuppressedDTO, 'id'>,
  db_transaction?: TDatabaseTransaction,
): Promise<AddressSuppressedDTO> {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);
  await (db_transaction ? db_transaction : knex)
    .insert({...address, id: binary_id})
    .into('addresses');
  return {id: uuid, ...address};
}

export async function update(
  address_id: string,
  data: Partial<AddressSuppressedDTO>,
) {
  const binary_id = knex.fn.uuidToBin(address_id);
  return knex('addresses').where({id: binary_id}).update(data);
}

export async function removeById(
  address_id: string,
  db_transaction?: TDatabaseTransaction,
) {
  const binary_id = knex.fn.uuidToBin(address_id);
  await (db_transaction ? db_transaction : knex)('addresses')
    .where({id: binary_id})
    .del();
}
