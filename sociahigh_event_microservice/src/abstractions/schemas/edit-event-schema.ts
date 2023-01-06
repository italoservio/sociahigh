import Joi from 'joi';

export default Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  starts_at: Joi.date().iso().optional(),
  address: Joi.object({
    id: Joi.string().uuid().required(),
    zip: Joi.string().trim().required(),
    place: Joi.string().trim().required(),
    number: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
  }).optional(),
});
