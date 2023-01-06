import schema from '../../schemas/commons/address-suppressed-schema';

export class AddressSuppressedDTO {
  id?: string | Buffer;
  user_id: string;
  zip: string;
  place: string;
  number: string;
  city: string;
  state: string;
  country: string;

  constructor(args: Partial<AddressSuppressedDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
