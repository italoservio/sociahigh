import Joi from 'joi';

export default {
  page: Joi.number().required(),
  page_size: Joi.number().required(),
};
