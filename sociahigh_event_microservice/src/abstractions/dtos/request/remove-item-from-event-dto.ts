import {IdDTO} from '../commons/id-dto';
import schema from '../../schemas/remove-item-from-event-schema';

export class RemoveItemFromEventDTO extends IdDTO {
  item_id: string;

  constructor(args: RemoveItemFromEventDTO) {
    super({id: args.id});
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
