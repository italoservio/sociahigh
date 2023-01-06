import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {IdDTO, PaginateUserAddressDTO} from '../abstractions/dtos';
import * as addresses from '../database/repositories/address-repository';

export async function paginateUserAddress(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const {id} = req.params as IdDTO;
  const query = req.query as PaginateUserAddressDTO;
  req.log.info({id, query});

  try {
    const items = await addresses.paginateByUserId(id, query);
    res.status(200).send({
      page: Number(query.page),
      page_size: Number(query.page_size),
      items,
    });
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
