import Joi from 'joi';
import address_schema from './address-suppressed-schema';

export default Joi.object({
  id: Joi.string().uuid().trim().optional(),
  user_id: Joi.string().uuid().trim().required(),
  name: Joi.string().trim().trim().required(),
  description: Joi.string().trim().required(),
  starts_at: Joi.date().iso().required(),
  address: address_schema,
  created_at: Joi.date().iso().optional(),
  updated_at: Joi.date().iso().optional(),
  deleted_at: Joi.date().iso().optional(),
});
