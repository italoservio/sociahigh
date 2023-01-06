import schema from '../../schemas/commons/user-schema';

export class UserDTO {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;

  constructor(args: Partial<UserDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
