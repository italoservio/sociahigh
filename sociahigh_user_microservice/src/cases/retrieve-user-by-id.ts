import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {IdDTO} from '../abstractions/dtos';
import * as users from '../database/repositories/users-repository';

export async function retrieveUserById(req: FastifyRequest, res: FastifyReply) {
  const {id} = req.params as IdDTO;
  req.log.info(id);

  try {
    const user = await users.retrieveById(id);

    if (!user) {
      const err = new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
      req.log.error(err);
      return err;
    }

    const {password, ...rest} = user;
    res.status(200).send(rest);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
