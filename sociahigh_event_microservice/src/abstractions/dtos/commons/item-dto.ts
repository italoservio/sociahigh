import schema from '../../schemas/commons/item-schema';
import {UserSuppressedDTO} from './user-suppressed-dto';

export class ItemDTO {
  id?: string | Buffer;
  user_id?: string | Buffer | null;
  user?: UserSuppressedDTO;
  name: string;
  value: number;
  event_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;

  constructor(args: ItemDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
