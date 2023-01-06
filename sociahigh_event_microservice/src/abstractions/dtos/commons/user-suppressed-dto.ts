import schema from '../../schemas/commons/user-suppressed-schema';

export class UserSuppressedDTO {
  id: string | Buffer;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  constructor(args: Partial<UserSuppressedDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
