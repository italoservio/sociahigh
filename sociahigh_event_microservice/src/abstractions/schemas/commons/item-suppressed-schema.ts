import Joi from 'joi';

export default Joi.object({
  name: Joi.string().trim().required(),
  value: Joi.number().required(),
});
