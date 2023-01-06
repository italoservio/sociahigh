import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from 'fastify';
import {ErrorCodeEnum} from '../enums';
import {ErrorWithStatus} from '../handlers';

export function jwtInterceptor(server: FastifyInstance) {
  return (
    req: FastifyRequest,
    _res: FastifyReply,
    done: HookHandlerDoneFunction,
  ) => {
    const token = req.headers.authorization;
    if (!token) {
      return done(new ErrorWithStatus(ErrorCodeEnum.ERR_VALIDATION, 403));
    }

    try {
      const lean_token = token.split(' ')[1];
      const payload: {sub: string} = (
        server as unknown as Record<string, any>
      ).jwt.verify(lean_token);
      (req as unknown as Record<string, any>).user = payload.sub;

      return done();
    } catch (err) {
      return done(new ErrorWithStatus(ErrorCodeEnum.ERR_VALIDATION, 403));
    }
  };
}
