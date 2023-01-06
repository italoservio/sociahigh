import schema from '../../schemas/edit-event-schema';
import {AddressSuppressedDTO} from '../commons/address-suppressed-dto';

export class EditEventDTO {
  name?: string;
  description?: string;
  starts_at?: string;
  address?: AddressSuppressedDTO;

  constructor(args: Partial<EditEventDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
