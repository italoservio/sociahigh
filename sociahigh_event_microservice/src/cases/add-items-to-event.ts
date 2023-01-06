import {FastifyReply, FastifyRequest} from 'fastify';
import {ErrorCodeEnum, ErrorWithStatus} from 'italoservio_sociahigh';
import {AddItemsToEventDTO, IdDTO} from '../abstractions/dtos';
import {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} from '../database/transaction';
import {ItemDTO} from '../abstractions/dtos/commons/item-dto';
import * as event_items from '../database/repositories/event-item-repository';
import * as events from '../database/repositories/event-repository';

export async function addItemsToEvent(req: FastifyRequest, res: FastifyReply) {
  const user_id = req.user as string;
  const {id: event_id} = req.params as IdDTO;
  const {items} = req.body as AddItemsToEventDTO;

  req.log.info(JSON.stringify({user_id, event_id, items}));

  try {
    const event = await events.retrieveById(user_id, event_id);
    if (!event) {
      return new ErrorWithStatus(ErrorCodeEnum.ERR_NOT_FOUND, 404);
    }
  } catch (err) {
    req.log.error(err);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }

  const db_transaction = await beginTransaction();
  try {
    const items_arr: Partial<ItemDTO>[] = [];
    for (const partial_item of items) {
      const item = await event_items.add(
        event_id,
        partial_item,
        db_transaction,
      );
      items_arr.push(item);
    }

    await commitTransaction(db_transaction);
    return res.status(201).send(items_arr);
  } catch (err) {
    req.log.error(err);
    await rollbackTransaction(db_transaction);
    return new ErrorWithStatus(ErrorCodeEnum.ERR_INTERNAL, 502);
  }
}
