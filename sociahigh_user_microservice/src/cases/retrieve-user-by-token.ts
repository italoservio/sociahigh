import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import * as users from '../database/repositories/users-repository';

export async function retrieveUserByToken(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const id = req.user as string;
  req.log.info(id);

  try {
    if (!id) {
      const err = new ErrorWithStatus(ErrorCodeEnum.ERR_NO_PARAMS, 400);
      req.log.error(err);
      return err;
    }

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
