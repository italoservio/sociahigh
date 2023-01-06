import {FastifyReply, FastifyRequest, HookHandlerDoneFunction} from 'fastify';
import {ErrorCodeEnum} from '../enums';
import {ErrorWithStatus} from '../handlers';

export function dtoInterceptor(dto: any, source: 'body' | 'params' | 'query') {
  return (
    req: FastifyRequest,
    _res: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    if (!req[source]) {
      throw new ErrorWithStatus(ErrorCodeEnum.ERR_NO_PARAMS, 400);
    }
    req[source] = new dto(req[source]);
    done();
  };
}
