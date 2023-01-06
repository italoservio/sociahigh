import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {PaginateEventDTO} from '../abstractions/dtos';
import * as events from '../database/repositories/event-repository';

export async function paginateEvent(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const query = req.query as PaginateEventDTO;

  req.log.info(JSON.stringify({user_id, query}));

  try {
    const items = await events.paginateUserEvents(user_id, query);
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
