import bcrypt from 'bcrypt';
import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {AuthenticateDTO} from '../abstractions/dtos';
import * as users from '../database/repositories/users-repository';

export async function authenticateUser(req: FastifyRequest, res: FastifyReply) {
  const body = req.body as AuthenticateDTO;
  req.log.info({...body, password: 'hidden'});

  try {
    const user = await users.retrieveByEmail(body.email);

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      const err = new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
      req.log.error(err);
      return err;
    }

    const access_token = await res.jwtSign({sub: user.id}, {expiresIn: '2h'});

    const now = new Date();
    const now_in_ms = now.getTime();
    const offset_in_ms = now.getTimezoneOffset() * 60000;
    const now_utc = new Date(now_in_ms - offset_in_ms);

    res.status(200).send({
      access_token,
      expires_at: new Date(now_utc.setHours(now_utc.getHours() + 2)),
    });
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
