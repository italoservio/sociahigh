import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {EditEventDTO, IdDTO} from '../abstractions/dtos';
import {AnswerEnum} from '../abstractions/enums';
import * as event_guests from '../database/repositories/event-guest-repository';
import * as addresses from '../database/repositories/address-repository';
import * as events from '../database/repositories/event-repository';
import * as users from '../database/repositories/user-repository';
import * as mail from './send-email';

export async function editEvent(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;
  const body = req.body as EditEventDTO;
  req.log.info({user_id, event_id, body});

  try {
    const existent = await events.retrieveById(user_id, event_id);
    if (!existent) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }

    if ('address' in body) {
      const {id: address_id, ...address} = body.address!;
      await addresses.update(address_id as string, address);

      delete body.address;
    }

    await events.update(event_id, body);

    sendEditEventEmail(user_id, event_id);

    const event = await events.retrieveById(user_id, event_id, true);
    return res.status(200).send(event);
  } catch (err) {
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}

async function sendEditEventEmail(user_id: string, event_id: string) {
  const event = await events.retrieveById(user_id, event_id, true);

  const owner = await users.retrieveById(user_id);
  const owner_description = `
    Olá, ${owner?.first_name}! Seu evento de nome: "${event!.name}"
    foi alterado e já estamos comunicando todos os convidados.
  `;

  const guest_description = `
    O evento de nome: "${event!.name}" foi alterado e você está sendo
    comunicado das alterações.
    O evento: "${event!.name}" de ${
    owner?.first_name
  }, se iniciará às ${new Date(event!.starts_at).toLocaleString()} em ${
    event!.address?.place
  }, ${event!.address?.number}.
  `;

  const subject = 'Sociahigh: Evento alterado!';
  const title = 'Evento alterado!';
  const owner_html = await mail.mountHTML({
    title,
    description: owner_description,
  });

  const guest_html = await mail.mountHTML({
    title,
    description: guest_description,
  });

  mail.sendEmail(owner!.email, subject, owner_html);

  let page = 1;
  const page_size = 100;
  const promises = [];
  do {
    const guests = await event_guests.paginateEventGuests(event_id, {
      page,
      page_size,
    });

    for (const guest of guests) {
      if (guest.answer === AnswerEnum.ACCEPTED) {
        promises.push(mail.sendEmail(guest.user!.email, subject, guest_html));
      }
    }

    if (guests.length < page_size) page = 0;
  } while (page > 0);

  await Promise.all(promises);
}
