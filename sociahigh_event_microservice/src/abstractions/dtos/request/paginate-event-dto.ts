import schema from '../../schemas/paginate-event-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateEventDTO extends PaginateDTO {
  constructor(args: PaginateEventDTO) {
    super();
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
