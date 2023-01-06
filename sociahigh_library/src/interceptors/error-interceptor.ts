import {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorMessageEnum} from '../enums';
import {ErrorWithStatus} from '../handlers';
import {ValidationError} from 'joi';

export function errorInterceptor(
  err: FastifyError,
  req: FastifyRequest,
  res: FastifyReply,
) {
  req.log.error(err, err.message);

  let status: number;
  let message: string;
  let code: string;

  if (err instanceof ValidationError) {
    code = ErrorCodeEnum.ERR_VALIDATION;
    message = `Property ${err.message}`;
    status = 400;
  } else if (err instanceof ErrorWithStatus) {
    code = err.message;
    message = ErrorMessageEnum[code as ErrorCodeEnum];
    status = err.status;
  } else {
    code = ErrorCodeEnum.ERR_INTERNAL;
    message = ErrorMessageEnum[ErrorCodeEnum.ERR_INTERNAL];
    status = 500;
  }

  res.status(status).send({code, message, status});
}
