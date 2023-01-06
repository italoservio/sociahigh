import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {
  AddUserToItemBodyDTO,
  AddUserToItemParamsDTO,
} from '../abstractions/dtos';
import * as events from '../database/repositories/event-repository';
import * as event_guests from '../database/repositories/event-guest-repository';
import * as event_items from '../database/repositories/event-item-repository';

export async function addUserToItem(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: event_id, item_id} = req.params as AddUserToItemParamsDTO;
  const {user_id: user_to_add_id} = req.body as AddUserToItemBodyDTO;

  req.log.info(JSON.stringify({user_id, event_id, item_id, user_to_add_id}));

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
    await event_items.updateItemUser(event_id, item_id, user_to_add_id);
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
