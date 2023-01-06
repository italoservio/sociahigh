import schema from '../../schemas/paginate-user-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateUserDTO extends PaginateDTO {
  email?: string;
  phone?: string;

  constructor(args: PaginateUserDTO) {
    super();
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
