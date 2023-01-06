import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {PaginateUserDTO} from '../abstractions/dtos';
import * as users from '../database/repositories/users-repository';

export async function paginateUser(req: FastifyRequest, res: FastifyReply) {
  const query = req.query as PaginateUserDTO;
  req.log.info(query);

  try {
    const items = await users.paginate(query);
    return res.status(200).send({
      page: Number(query.page),
      page_size: Number(query.page_size),
      items,
    });
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
