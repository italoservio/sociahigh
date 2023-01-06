import schema from '../../schemas/authenticate-schema';

export class AuthenticateDTO {
  email: string;
  password: string;

  constructor(args: AuthenticateDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
