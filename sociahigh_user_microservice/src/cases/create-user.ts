import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {CreateUserDTO} from '../abstractions/dtos';
import * as users from '../database/repositories/users-repository';
import {encryptPassword} from './encrypt-password';

export async function createUser(req: FastifyRequest, res: FastifyReply) {
  const body = req.body as CreateUserDTO;
  req.log.info({...body, password: 'hidden'});

  try {
    const registers = await users.paginate({
      page: 1,
      page_size: 1,
      email: body.email,
    });

    if (registers.length) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_CONFLICT, 409);
    }

    body.password = await encryptPassword(body.password);
    body.email = body.email.toLocaleLowerCase();
    body.phone = body.phone.replace(/\D/, '');

    const {password, ...rest} = await users.create(body);
    return res.status(201).send(rest);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
