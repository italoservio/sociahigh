import {AnswerEnum} from '../../enums';
import schema from '../../schemas/update-invitation-schema';

export class UpdateInvitationDTO {
  answer: AnswerEnum;

  constructor(args: UpdateInvitationDTO) {
    const {error} = schema.validate(args);
    if (error) throw error;
    Object.assign(this, args);
  }
}
