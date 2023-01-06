import schema from '../../schemas/commons/item-suppressed-schema';

export class ItemSuppressedDTO {
  name: string;
  value: number;

  constructor(args: ItemSuppressedDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
