import Joi from 'joi';
import paginate_schema from '../commons/paginate-schema';

export default Joi.object({
  email: Joi.string().email().optional().lowercase(),
  phone: Joi.string().optional(),
  ...paginate_schema,
});
