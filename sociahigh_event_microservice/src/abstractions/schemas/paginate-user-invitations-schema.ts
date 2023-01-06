import Joi from 'joi';
import {AnswerEnum} from '../enums';
import paginate_schema from './commons/paginate-schema';

export default Joi.object({
  answer: Joi.array()
    .items(Joi.string().valid(...Object.values(AnswerEnum)))
    .optional(),
  ...paginate_schema,
});
