import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid().trim().optional(),
  user_id: Joi.string().uuid().trim().required(),
  event_id: Joi.string().uuid().trim().required(),
  answer: Joi.string().optional(),
  answered_at: Joi.date().iso().optional(),
  invited_at: Joi.date().iso().optional(),
});
