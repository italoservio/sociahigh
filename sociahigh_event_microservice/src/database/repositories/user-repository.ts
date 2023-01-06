import {UserDTO, UserSuppressedDTO} from '../../abstractions/dtos';
import {TDatabaseTransaction} from '../../abstractions/types';
import knex from '../conn';

export async function retrieveById(
  uuid: string,
): Promise<UserSuppressedDTO | null> {
  const binary_id = knex.fn.uuidToBin(uuid);
  const user = await knex
    .select<Omit<UserSuppressedDTO, 'id'> & {id: Buffer}>('*')
    .from('users')
    .where({id: binary_id})
    .first();
  if (user) return {...user, id: uuid};
  else return null;
}

export async function create(
  user: UserSuppressedDTO,
  db_transaction?: TDatabaseTransaction,
): Promise<void> {
  const binary_id = knex.fn.uuidToBin(user.id as string);
  return (db_transaction ? db_transaction : knex)
    .insert({...user, id: binary_id})
    .into('users');
}

export async function retrieveByEmailOrPhone(
  filter: Partial<Pick<UserDTO, 'email' | 'phone'>>,
): Promise<UserSuppressedDTO | null> {
  const user = await knex
    .select<Omit<UserSuppressedDTO, 'id'> & {id: Buffer}>('*')
    .from('users')
    .where(filter)
    .first();
  if (user) return {...user, id: knex.fn.binToUuid(user.id)};
  else return null;
}
