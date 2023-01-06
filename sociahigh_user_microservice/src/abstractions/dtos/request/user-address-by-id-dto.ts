import schema from '../../schemas/user-address-by-id-schema';
import {IdDTO} from '../commons/id-dto';

export class UserAddressByIdDTO extends IdDTO {
  address_id: string;

  constructor(args: UserAddressByIdDTO) {
    super({id: args.id});
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
