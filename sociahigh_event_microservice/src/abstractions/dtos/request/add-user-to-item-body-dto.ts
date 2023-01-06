import schema from '../../schemas/add-user-to-item-body-schema';

export class AddUserToItemBodyDTO {
  user_id: string;

  constructor(args: AddUserToItemBodyDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
