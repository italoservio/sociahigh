import Joi from 'joi';
import paginate_schema from './commons/paginate-schema';

export default Joi.object({
  with_user: Joi.boolean().optional(),
  ...paginate_schema,
});
