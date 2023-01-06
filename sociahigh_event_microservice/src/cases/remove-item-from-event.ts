import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {RemoveItemFromEventDTO} from '../abstractions/dtos';
import * as events from '../database/repositories/event-repository';
import * as event_items from '../database/repositories/event-item-repository';

export async function removeItemFromEvent(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const user_id = req.user as string;
  const {id: event_id, item_id} = req.params as RemoveItemFromEventDTO;

  try {
    const event = await events.retrieveById(user_id, event_id);
    if (!event) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }

    await event_items.remove(event_id, item_id);
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
