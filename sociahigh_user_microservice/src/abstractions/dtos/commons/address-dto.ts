import schema from '../../schemas/commons/address-schema';

export class AddressDTO {
  id: string | Buffer;
  user_id: string | Buffer;
  zip: string;
  place: string;
  number: string;
  city: string;
  state: string;
  country: string;

  constructor(args: Partial<AddressDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
