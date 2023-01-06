import Joi from 'joi';
import {AnswerEnum} from '../enums';

export default Joi.object({
  answer: Joi.string()
    .valid(...Object.values(AnswerEnum).filter(a => a !== AnswerEnum.PENDING))
    .required(),
});
