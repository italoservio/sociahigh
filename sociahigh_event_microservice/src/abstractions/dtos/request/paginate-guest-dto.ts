import schema from '../../schemas/paginate-guest-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateGuestsDTO extends PaginateDTO {
  name?: string;

  constructor(args: PaginateGuestsDTO) {
    super();
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
