import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {UserAddressByIdDTO} from '../abstractions/dtos';
import * as addresses from '../database/repositories/address-repository';

export async function retrieveUserAddressById(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const {id: user_id, address_id} = req.params as UserAddressByIdDTO;

  try {
    const address = await addresses.retrieveById(user_id, address_id);

    if (!address) {
      const err = new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
      req.log.error(err);
      return err;
    }

    res.status(200).send(address);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
