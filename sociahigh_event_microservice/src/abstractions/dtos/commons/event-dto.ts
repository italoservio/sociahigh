import {AddressSuppressedDTO} from './address-suppressed-dto';
import schema from '../../schemas/commons/event-schema';
import {ItemDTO} from './item-dto';
import {EventGuestDTO} from './event-guest-dto';

export class EventDTO {
  id?: string | Buffer;
  user_id: string | Buffer;
  address_id?: string | Buffer;
  address?: AddressSuppressedDTO;
  guests?: EventGuestDTO[];
  items?: ItemDTO[];
  name: string;
  description: string;
  starts_at: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;

  constructor(args: Partial<EventDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
