import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {EventDTO, IdDTO} from '../abstractions/dtos';
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../database/transaction';
import * as events from '../database/repositories/event-repository';
import * as addresses from '../database/repositories/address-repository';
import * as event_items from '../database/repositories/event-item-repository';
import * as event_guests from '../database/repositories/event-guest-repository';
import * as users from '../database/repositories/user-repository';
import * as mail from './send-email';

export async function removeEvent(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;
  req.log.info({user_id, event_id});

  const db_transaction = await beginTransaction();
  try {
    const existent = await events.retrieveById(user_id, event_id);
    if (!existent) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }

    await event_guests.removeAllByEventId(event_id, db_transaction);
    await event_items.removeAllByEventId(event_id, db_transaction);
    await events.removeById(event_id, db_transaction);
    await addresses.removeById(existent.address_id as string, db_transaction);

    await commitTransaction(db_transaction);

    sendRemoveEventEmail(user_id, existent);

    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    await rollbackTransaction(db_transaction);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}

async function sendRemoveEventEmail(user_id: string, event: EventDTO) {
  const user = await users.retrieveById(user_id);
  const title = 'Sociahigh: Evento removido!';
  const html = await mail.mountHTML({
    title: 'Evento removido!',
    description: `Olá, ${user?.first_name}! Seu evento de nome: "${event.name}"
      foi removido`,
  });

  await mail.sendEmail(user!.email, title, html);
}
