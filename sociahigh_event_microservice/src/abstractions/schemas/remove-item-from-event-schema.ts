import Joi from 'joi';

export default Joi.object({
  id: Joi.string().uuid().required(),
  item_id: Joi.string().uuid().required(),
});
