import {randomUUID} from 'node:crypto';
import {AddressDTO, PaginateUserAddressDTO} from '../../abstractions/dtos';
import knex from '../conn';

export async function create(
  user_id: string,
  address: Omit<AddressDTO, 'id' | 'user_id'>,
): Promise<Partial<AddressDTO>> {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);
  const binary_foreign = knex.fn.uuidToBin(user_id);
  await knex
    .insert<AddressDTO>({id: binary_id, user_id: binary_foreign, ...address})
    .into('addresses');
  return {id: uuid, user_id, ...address};
}

export async function paginateByUserId(
  user_id: string,
  params: PaginateUserAddressDTO,
): Promise<Partial<AddressDTO[]>> {
  const offset = (params.page - 1) * params.page_size;
  const binary_id = knex.fn.uuidToBin(user_id);
  const rows = await knex
    .select<AddressDTO[]>('*')
    .from('addresses')
    .where({
      user_id: binary_id,
    })
    .offset(offset)
    .limit(params.page_size);

  return rows.map(row => ({
    ...row,
    id: knex.fn.binToUuid(row.id as Buffer),
    user_id: knex.fn.binToUuid(row.user_id as Buffer),
  }));
}

export async function retrieveById(
  user_id: string,
  address_id: string,
): Promise<AddressDTO | undefined> {
  const binary_user_id = knex.fn.uuidToBin(user_id);
  const binary_address_id = knex.fn.uuidToBin(address_id);
  const row = await knex
    .select<AddressDTO>('*')
    .from('addresses')
    .where({
      id: binary_address_id,
      user_id: binary_user_id,
      deleted_at: null,
    })
    .first();

  if (!row) return undefined;

  return {
    ...row,
    id: knex.fn.binToUuid(row.id as Buffer),
    user_id: knex.fn.binToUuid(row.user_id as Buffer),
  };
}
