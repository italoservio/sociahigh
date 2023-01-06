import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {IdDTO, UpdateInvitationDTO} from '../abstractions/dtos';
import * as event_guests from '../database/repositories/event-guest-repository';

export async function updateInvitation(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: invitation_id} = req.params as IdDTO;
  const {answer} = req.body as UpdateInvitationDTO;
  req.log.info(JSON.stringify({invitation_id, answer}));

  try {
    const invitation = await event_guests.retrieveUserInvitationById(
      user_id,
      invitation_id,
    );

    if (!invitation) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }

    const now = new Date();
    const now_in_ms = now.getTime();
    const offset_in_ms = now.getTimezoneOffset() * 60000;
    const now_utc = new Date(now_in_ms - offset_in_ms);

    await event_guests.updateInvitation(user_id, invitation_id, {
      answer,
      answered_at: now_utc,
    });

    invitation.answer = answer;
    invitation.answered_at = now_utc;
    return res.status(200).send(invitation);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
