import schema from '../../schemas/commons/id-schema';

export class IdDTO {
  id: string;

  constructor(args: IdDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
