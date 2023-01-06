import Joi from 'joi';
import address_schema from './commons/address-suppressed-schema';

export default Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  starts_at: Joi.date().iso().required(),
  address: address_schema,
});
