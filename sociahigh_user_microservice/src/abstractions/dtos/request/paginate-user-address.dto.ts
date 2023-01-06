import schema from '../../schemas/paginate-user-address-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateUserAddressDTO extends PaginateDTO {
  constructor(args: PaginateUserAddressDTO) {
    super();
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
