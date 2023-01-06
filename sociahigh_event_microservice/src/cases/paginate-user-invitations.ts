import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {PaginateUserInvitationsDTO} from '../abstractions/dtos';
import * as event_guests from '../database/repositories/event-guest-repository';

export async function paginateUserInvitations(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const user_id = req.user as string;
  const query = req.query as PaginateUserInvitationsDTO;

  req.log.info(JSON.stringify({user_id, query}));

  try {
    const items = await event_guests.paginateUserInvitations(user_id, query);
    delete query.answer;
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
