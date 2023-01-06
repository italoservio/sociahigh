import schema from '../../schemas/add-user-to-item-params-schema';
import {IdDTO} from '../commons/id-dto';

export class AddUserToItemParamsDTO extends IdDTO {
  item_id: string;

  constructor(args: AddUserToItemParamsDTO) {
    const {id, ...rest} = args;
    super({id});

    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, rest);
  }
}
