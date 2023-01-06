import schema from '../../schemas/create-event-schema';
import {AddressSuppressedDTO} from '../commons/address-suppressed-dto';

export class CreateEventDTO {
  name: string;
  description: string;
  starts_at: string;
  address: AddressSuppressedDTO;

  constructor(args: Partial<CreateEventDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
