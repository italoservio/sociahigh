import Joi from 'joi';
import item_schema from './commons/item-suppressed-schema';

export default Joi.object({
  items: Joi.array().not().empty().items(item_schema),
});
