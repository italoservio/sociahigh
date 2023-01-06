import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {AddressDTO, IdDTO} from '../abstractions/dtos';
import * as addresses from '../database/repositories/address-repository';
import * as users from '../database/repositories/users-repository';

export async function addressToUser(req: FastifyRequest, res: FastifyReply) {
  const body = req.body as Omit<AddressDTO, 'id' | 'user_id'>;
  const {id} = req.params as IdDTO;
  req.log.info({id, body});

  const user = await users.retrieveById(id);
  if (!user) {
    const err = new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    req.log.error(err);
    return err;
  }

  try {
    const created = await addresses.create(id, body);
    return res.status(201).send(created);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
