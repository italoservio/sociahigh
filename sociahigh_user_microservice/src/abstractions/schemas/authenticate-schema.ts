import Joi from 'joi';

export default Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
});
