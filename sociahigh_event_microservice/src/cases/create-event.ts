import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {CreateEventDTO} from '../abstractions/dtos';
import {TDatabaseTransaction} from '../abstractions/types';
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../database/transaction';
import {retrieveExternalUserById} from './externals/retrieve-external-user-by-id';
import * as addresses from '../database/repositories/address-repository';
import * as events from '../database/repositories/event-repository';
import * as users from '../database/repositories/user-repository';
import * as mail from './send-email';

export async function createEvent(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const body = req.body as CreateEventDTO;
  req.log.info({user_id, body});

  const db_transaction = await beginTransaction();
  try {
    await createUserIfNotExists(req, user_id, db_transaction);

    const {address: body_address, ...body_event} = body;
    const {id: address_id, ...address} = await addresses.create(
      body_address,
      db_transaction,
    );

    const event = await events.create(
      user_id,
      address_id as string,
      body_event,
      db_transaction,
    );

    await commitTransaction(db_transaction);

    sendCreateEventEmail(user_id, body);

    return res.status(201).send({...event, user_id, address});
  } catch (err) {
    req.log.error(err);
    await rollbackTransaction(db_transaction);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}

async function createUserIfNotExists(
  req: FastifyRequest,
  user_id: string,
  db_transaction: TDatabaseTransaction,
): Promise<void> {
  const user = await users.retrieveById(user_id);

  if (!user) {
    const res = await retrieveExternalUserById(req, user_id);
    const external_user = res.data;

    await users.create(
      {
        id: external_user.id,
        first_name: external_user.first_name,
        last_name: external_user.last_name,
        email: external_user.email,
        phone: external_user.phone,
      },
      db_transaction,
    );
  }
}

async function sendCreateEventEmail(user_id: string, event: CreateEventDTO) {
  const user = await users.retrieveById(user_id);
  const title = 'Sociahigh: Evento criado!';
  const html = await mail.mountHTML({
    title: 'Evento criado!',
    description: `Olá, ${user?.first_name}! Seu evento de nome: "${event.name}"
      foi criado e já está pronto para receber os convidados`,
  });

  await mail.sendEmail(user!.email, title, html);
}
