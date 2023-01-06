import Joi from 'joi';

export default Joi.object({
  email: Joi.string().trim().email(),
  phone: Joi.string(),
}).xor('email', 'phone');
