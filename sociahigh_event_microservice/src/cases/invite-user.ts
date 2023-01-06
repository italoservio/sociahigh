import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {
  EventDTO,
  EventGuestDTO,
  IdDTO,
  InviteUserDTO,
  UserDTO,
  UserSuppressedDTO,
} from '../abstractions/dtos';
import {paginateExternalUsers} from './externals/paginate-external-users';
import {AnswerEnum} from '../abstractions/enums';
import * as events from '../database/repositories/event-repository';
import * as event_guests from '../database/repositories/event-guest-repository';
import * as users from '../database/repositories/user-repository';
import * as mail from './send-email';

export async function inviteUser(req: FastifyRequest, res: FastifyReply) {
  let user: UserSuppressedDTO | null;
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;
  const body = req.body as InviteUserDTO;

  req.log.info(JSON.stringify({user_id, event_id, body}));

  try {
    const event = await events.retrieveById(user_id, event_id);
    if (!event) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }

    user = await users.retrieveByEmailOrPhone({...body});
    if (!user) {
      const filters = {page: 1, page_size: 1, ...body};
      const {data: users} = await paginateExternalUsers(req, filters);

      if (!users.items.length) {
        return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
      }

      if (users.items[0].id === user_id) {
        return new ErrorWithStatus(ErrorCodeEnum.ERR_VALIDATION, 400);
      }

      user = await createSuppressedUserCopy(users.items[0]);
    }

    const invitation = mountEventGuestRegister(event_id, user);
    const response = await event_guests.add(invitation);

    sendInvitationEmail(user_id, user, event);

    return res.status(201).send(response);
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}

function mountEventGuestRegister(event_id: string, user: UserSuppressedDTO) {
  const now = new Date();
  const now_in_ms = now.getTime();
  const offset_in_ms = now.getTimezoneOffset() * 60000;
  const now_utc = new Date(now_in_ms - offset_in_ms);

  return {
    event_id,
    user_id: user.id,
    answer: AnswerEnum.PENDING,
    answered_at: null,
    invited_at: now_utc.toISOString(),
  } as EventGuestDTO;
}

async function createSuppressedUserCopy(user: UserDTO) {
  const suppressed_user = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
  };
  await users.create(suppressed_user);
  return suppressed_user;
}

async function sendInvitationEmail(
  user_id: string,
  guest: UserSuppressedDTO,
  event: EventDTO,
) {
  const owner = await users.retrieveById(user_id);
  const title = 'Sociahigh: Convite recebido!';
  const html = await mail.mountHTML({
    title: 'Convite recebido!',
    description: `Olá, ${guest?.first_name}! você foi convidado para o evento de nome: 
    "${event.name}" de ${owner?.first_name}. Entre no app para respondê-lo!`,
  });

  await mail.sendEmail(guest!.email, title, html);
}
