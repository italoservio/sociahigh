import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
});
