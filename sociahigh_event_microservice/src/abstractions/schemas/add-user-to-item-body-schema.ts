import Joi from 'joi';

export default Joi.object({
  user_id: Joi.string().uuid().required(),
});
