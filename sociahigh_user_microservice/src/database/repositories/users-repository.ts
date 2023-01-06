import {randomUUID} from 'node:crypto';
import {CreateUserDTO, PaginateUserDTO} from '../../abstractions/dtos';
import {UserDTO} from '../../abstractions/dtos/commons/user-dto';
import knex from '../conn';

export async function create(user: CreateUserDTO): Promise<Partial<UserDTO>> {
  const uuid = randomUUID();
  const binary_id = knex.fn.uuidToBin(uuid);
  await knex.insert({...user, id: binary_id}).into('users');
  return {id: uuid, ...user};
}

export async function retrieveById(uuid: string): Promise<UserDTO | null> {
  const binary_id = knex.fn.uuidToBin(uuid);
  const user = await knex
    .select<Omit<UserDTO, 'id'> & {id: Buffer}>('*')
    .from('users')
    .where({
      id: binary_id,
      deleted_at: null,
    })
    .first();
  if (user) return {...user, id: uuid};
  else return null;
}

export async function paginate(
  params: PaginateUserDTO,
): Promise<Partial<UserDTO>[]> {
  const {page, page_size, ...filters} = params;
  const offset = (page - 1) * page_size;
  let chain = knex
    .select<(Omit<UserDTO, 'id'> & {id: Buffer})[]>('*')
    .from('users');

  if (Object.keys(filters)) {
    chain = chain.where(filters);
  }

  const result = await chain.offset(offset).limit(params.page_size);
  return result.map(user => {
    const {password, ...rest} = user;
    return {...rest, id: knex.fn.binToUuid(user.id)};
  });
}

export async function retrieveByEmail(email: string): Promise<UserDTO | null> {
  const user = await knex
    .select<Omit<UserDTO, 'id'> & {id: Buffer}>('*')
    .from('users')
    .where({email})
    .first();
  if (user) {
    const {id: binary_id, ...rest} = user;
    return {...rest, id: knex.fn.binToUuid(binary_id)};
  } else return null;
}
