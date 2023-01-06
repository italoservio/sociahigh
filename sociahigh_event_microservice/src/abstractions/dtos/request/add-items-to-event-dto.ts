import schema from '../../schemas/add-items-to-event-schema';
import {ItemSuppressedDTO} from '../commons/item-suppressed-dto';

export class AddItemsToEventDTO {
  items: ItemSuppressedDTO[];

  constructor(args: AddItemsToEventDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
