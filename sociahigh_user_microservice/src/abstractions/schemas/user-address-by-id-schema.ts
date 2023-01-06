import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid().trim().required(),
  address_id: Joi.string().uuid().trim().required(),
});
