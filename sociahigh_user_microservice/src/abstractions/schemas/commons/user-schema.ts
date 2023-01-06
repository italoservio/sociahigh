import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
  password: Joi.string(),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  deleted_at: Joi.date(),
});
