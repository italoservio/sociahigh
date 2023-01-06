import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {IdDTO, PaginateItemDTO} from '../abstractions/dtos';
import * as events from '../database/repositories/event-repository';
import * as event_guests from '../database/repositories/event-guest-repository';
import * as items from '../database/repositories/event-item-repository';

export async function paginateItem(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;
  const query = req.query as PaginateItemDTO;

  req.log.info(JSON.stringify({event_id, query}));

  const event = await events.retrieveById(user_id, event_id);
  if (!event) {
    const invitation = await event_guests.retrieveUserInvitationByEventId(
      user_id,
      event_id,
    );

    if (!invitation) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }
  }

  try {
    const event_items = await items.paginateByEventId(event_id, query);
    return res.status(200).send({
      page: Number(query.page),
      page_size: Number(query.page_size),
      items: event_items,
    });
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
