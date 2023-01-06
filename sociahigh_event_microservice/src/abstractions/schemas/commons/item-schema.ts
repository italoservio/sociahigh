import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid().optional(),
  name: Joi.string().trim().required(),
  value: Joi.number().required(),
  user_id: Joi.string().uuid().optional(),
  event_id: Joi.string().uuid().required(),
  created_at: Joi.date().iso().optional(),
  updated_at: Joi.date().iso().optional(),
  deleted_at: Joi.date().iso().optional(),
});
