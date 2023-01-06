import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {IdDTO} from '../abstractions/dtos';
import * as events from '../database/repositories/event-repository';

export async function retrieveEventById(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;

  try {
    const event = await events.retrieveById(user_id, event_id, true);
    if (!event) return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);

    const timezone_in_ms = new Date().getTimezoneOffset() * 60000;
    const starts_at_in_ms = new Date(event.starts_at).getTime();
    event.starts_at = new Date(starts_at_in_ms - timezone_in_ms).toISOString();

    return res.status(200).send(event);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
  }
}
