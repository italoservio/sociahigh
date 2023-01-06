import {AnswerEnum} from '../../enums';
import schema from '../../schemas/paginate-user-invitations-schema';
import {PaginateDTO} from '../commons/paginate-dto';

export class PaginateUserInvitationsDTO extends PaginateDTO {
  answer?: AnswerEnum[];

  constructor(args: PaginateUserInvitationsDTO) {
    super();

    if ('answer' in args && typeof args.answer === 'string') {
      args.answer = (args.answer as unknown as string)
        .split(',')
        .map(en => en.trim()) as AnswerEnum[];
    }

    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
