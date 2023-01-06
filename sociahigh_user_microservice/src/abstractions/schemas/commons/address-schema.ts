import Joi from 'joi';

export default Joi.object({
  zip: Joi.string().trim().required(),
  place: Joi.string().trim().required(),
  number: Joi.string().trim().optional(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});
