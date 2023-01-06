import Joi from 'joi';

export default Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
  phone: Joi.number().required(),
  password: Joi.string().trim().required(),
});
