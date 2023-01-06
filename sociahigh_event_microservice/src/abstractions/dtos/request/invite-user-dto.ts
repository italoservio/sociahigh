import schema from '../../schemas/invite-user-schema';

export class InviteUserDTO {
  email?: string;
  phone?: string;

  constructor(args: Partial<InviteUserDTO>) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
