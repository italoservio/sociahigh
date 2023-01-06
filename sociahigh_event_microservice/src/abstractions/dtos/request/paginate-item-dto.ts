import schema from '../../schemas/paginate-item-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateItemDTO extends PaginateDTO {
  with_user?: boolean;

  constructor(args: PaginateItemDTO) {
    super();
    const {error} = schema.validate(args);
    if (error) throw error;

    args.with_user = args.with_user && String(args.with_user) === 'true';

    Object.assign(this, args);
  }
}
