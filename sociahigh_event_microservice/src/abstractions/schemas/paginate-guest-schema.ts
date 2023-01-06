import Joi from 'joi';
import paginate_schema from './commons/paginate-schema';

export default Joi.object({
  name: Joi.string().optional(),
  ...paginate_schema,
});
