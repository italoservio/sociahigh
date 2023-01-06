import schema from '../../schemas/create-user-schema';

export class CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;

  constructor(args: Partial<CreateUserDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
