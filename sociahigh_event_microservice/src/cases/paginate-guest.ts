import {FastifyReply, FastifyRequest} from 'fastify';
import {IdDTO, PaginateGuestsDTO} from '../abstractions/dtos';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import * as event_guests from '../database/repositories/event-guest-repository';

export async function paginateGuests(req: FastifyRequest, res: FastifyReply) {
  const {id: event_id} = req.params as IdDTO;
  const query = req.query as PaginateGuestsDTO;

  req.log.info(JSON.stringify({event_id, query}));

  try {
    const items = await event_guests.paginateEventGuests(event_id, query);
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
